// Verifies the REAL security rules by running backend/schema.sql on an actual PostgreSQL engine (PGlite).
const test = require('node:test'), assert = require('node:assert');
const fs = require('fs'), path = require('path');
let PGlite; try { ({PGlite} = require('@electric-sql/pglite')); } catch (e) { PGlite = null; }
const skip = !PGlite && 'install @electric-sql/pglite to run SQL tests';
const schema = fs.readFileSync(path.join(__dirname, '../backend/schema.sql'), 'utf8');

async function boot(){
  const db = new PGlite();
  await db.exec(`
    create role anon nologin; create role authenticated nologin;
    create schema auth;
    create table auth.users (id uuid primary key default gen_random_uuid(), email text, raw_user_meta_data jsonb);
    create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
    grant usage on schema public, auth to anon, authenticated;
  `);
  await db.exec(schema);
  return db;
}
async function mkUser(db, email, meta){
  const r = await db.query(`insert into auth.users (email, raw_user_meta_data) values ($1, $2) returning id`, [email, meta || {}]);
  return r.rows[0].id;
}
async function as(db, uid, fn){            // run fn with the privileges of a signed-in API user
  await db.exec(`select set_config('request.jwt.claim.sub', '${uid}', false); set role authenticated;`);
  try { return await fn(); } finally { await db.exec(`reset role; select set_config('request.jwt.claim.sub', '', false);`); }
}
// "blocked" = the statement raised a permission/validation error OR (for UPDATE/DELETE) RLS silently matched zero rows
const blocked = async (p) => {
  try { const r = await p; if (r && r.rows && r.rows.length) return false; return !!r && r.affectedRows === 0; }
  catch (e) { if (/permission denied|row-level security|forbidden|not approved|42501|only the approved|immutable|violates|not authenticated|bad payload|too large|too many|bad client|check constraint|null value/i.test(e.message)) return true; throw e; }
};
const denied = blocked;
const payload = (n=5) => ({summary:{v:1, answers_7d:n, correct_7d:n-1}, mistakes:[], writing:[]});

test('schema installs and sign-up creates an unapproved student, ignoring role claims in metadata', {skip}, async () => {
  const db = await boot();
  const id = await mkUser(db, 's1@x.org', {full_name:'Stu', role:'admin', approved:true});
  const p = (await db.query('select role, approved, full_name from public.profiles where id=$1', [id])).rows[0];
  assert.deepEqual([p.role, p.approved, p.full_name], ['student', false, 'Stu']);
});

test('students cannot escalate privileges or read other people', {skip}, async () => {
  const db = await boot();
  const a = await mkUser(db, 'a@x.org'), b = await mkUser(db, 'b@x.org'), adm = await mkUser(db, 'adm@x.org');
  await db.exec(`update public.profiles set role='admin', approved=true where email='adm@x.org'; update public.profiles set approved=true where email in ('a@x.org','b@x.org')`);
  await as(db, a, async () => {
    assert.equal((await db.query('select * from public.profiles')).rows.length, 1, 'only own profile visible');
    assert.ok(await denied(db.query(`update public.profiles set role='admin' where id='${a}'`)), 'role change blocked');
    assert.ok(await denied(db.query(`update public.profiles set approved=true where id='${b}'`)), 'student cannot approve others');
    assert.ok(await denied(db.query(`insert into public.profiles (id,email,role,approved) values (gen_random_uuid(),'x@x.org','admin',true)`)), 'cannot insert profiles');
    assert.ok(await denied(db.query('select * from public.admin_overview()')), 'admin_overview forbidden');
    assert.ok(await denied(db.query(`insert into public.submissions (student_id, client_id, summary, payload) values ('${a}','12345678','{}','{}')`)), 'no direct inserts');
  });
  await as(db, adm, async () => assert.equal((await db.query('select * from public.profiles')).rows.length, 3, 'admin sees everyone'));
});

test('submit_progress: approval, validation, idempotency, rate limit, size limit', {skip}, async () => {
  const db = await boot();
  const a = await mkUser(db, 'a@x.org');
  await as(db, a, async () => assert.ok(await denied(db.query(`select public.submit_progress('${JSON.stringify(payload())}'::jsonb, 'client-0001')`)), 'unapproved rejected'));
  await db.exec(`update public.profiles set approved=true where id='${a}'`);
  await as(db, a, async () => {
    const r1 = (await db.query(`select public.submit_progress($1::jsonb, 'client-0001') as r`, [JSON.stringify(payload())])).rows[0].r;
    assert.equal(r1.ok, true); assert.equal(r1.duplicate, false); assert.ok(r1.server_time);
    const r2 = (await db.query(`select public.submit_progress($1::jsonb, 'client-0001') as r`, [JSON.stringify(payload())])).rows[0].r;
    assert.equal(r2.duplicate, true, 'same client id is not stored twice');
    assert.ok(await denied(db.query(`select public.submit_progress('[]'::jsonb, 'client-0002')`)), 'array payload rejected');
    assert.ok(await denied(db.query(`select public.submit_progress('{"summary":1}'::jsonb, 'client-0003')`)), 'summary must be an object');
    assert.ok(await denied(db.query(`select public.submit_progress($1::jsonb, 'client-0004')`, [JSON.stringify({summary:{}, junk:'x'.repeat(700000)})])), 'oversized rejected');
    for (let i = 0; i < 47; i++) await db.query(`select public.submit_progress($1::jsonb, $2)`, [JSON.stringify(payload()), 'bulk-client-' + i]);
    assert.ok(await denied(db.query(`select public.submit_progress($1::jsonb, 'one-too-many')`, [JSON.stringify(payload())])), 'daily rate limit');
  });
});

test('admin sees and reviews all; students see only their own; submissions are immutable', {skip}, async () => {
  const db = await boot();
  const a = await mkUser(db, 'a@x.org'), b = await mkUser(db, 'b@x.org'), adm = await mkUser(db, 'adm@x.org');
  await db.exec(`update public.profiles set role='admin', approved=true where email='adm@x.org'; update public.profiles set approved=true where email in ('a@x.org','b@x.org')`);
  await as(db, a, () => db.query(`select public.submit_progress($1::jsonb,'client-a-1')`, [JSON.stringify(payload(10))]));
  await as(db, b, () => db.query(`select public.submit_progress($1::jsonb,'client-b-1')`, [JSON.stringify(payload(3))]));
  await as(db, a, async () => assert.equal((await db.query('select * from public.submissions')).rows.length, 1));
  await as(db, adm, async () => {
    assert.equal((await db.query('select * from public.submissions')).rows.length, 2);
    const ov = (await db.query('select * from public.admin_overview()')).rows;
    assert.equal(ov.length, 3); assert.equal(Number(ov.find(r => r.email === 'a@x.org').unreviewed), 1);
    const sid = (await db.query(`select id from public.submissions where student_id='${a}'`)).rows[0].id;
    await db.query(`update public.submissions set review_status='reviewed', review_note='Good work', rating=4, reviewed_at=now(), reviewed_by='${adm}', student_seen=false where id=${sid}`);
    assert.ok(await denied(db.query(`update public.submissions set payload='{}' where id=${sid}`)), 'admin cannot rewrite what the student sent');
    assert.ok(await denied(db.query(`update public.profiles set role='student' where id='${adm}'`)), 'role not editable through the API, even for admins');
  });
  await as(db, a, async () => {
    assert.ok(await denied(db.query(`update public.submissions set rating=5`)), 'student cannot edit reviews');
    const r = (await db.query(`select public.submit_progress($1::jsonb,'client-a-2') as r`, [JSON.stringify(payload())])).rows[0].r;
    assert.equal(r.feedback.length, 1); assert.equal(r.feedback[0].note, 'Good work');
    await db.query(`select public.ack_feedback(array[${r.feedback[0].id}]::bigint[])`);
    const r2 = (await db.query(`select public.submit_progress($1::jsonb,'client-a-3') as r`, [JSON.stringify(payload())])).rows[0].r;
    assert.equal(r2.feedback.length, 0, 'feedback delivered once');
  });
});

test('anonymous (not signed-in) requests get nothing', {skip}, async () => {
  const db = await boot(); await mkUser(db, 'a@x.org');
  await db.exec(`reset role; set role anon;`);
  assert.ok(await denied(db.query('select * from public.profiles')));
  assert.ok(await denied(db.query('select * from public.submissions')));
  assert.ok(await denied(db.query(`select public.submit_progress('{"summary":{}}'::jsonb,'client-0001')`)));
  await db.exec('reset role');
});
