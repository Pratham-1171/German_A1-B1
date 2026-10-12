// In-memory stand-in for the Supabase endpoints the app uses. It mirrors the RLS rules proven in sql.test.js.
function createServer(opts) {
  opts = opts || {};
  const S = {users: new Map(), tokens: new Map(), refresh: new Map(), subs: [], nextSub: 1, offline: false, autoConfirm: opts.autoConfirm !== false, log: [], idc: 1};
  const uid = () => 'u' + (S.idc++).toString().padStart(4, '0') + '-0000-0000-0000-000000000000';
  S.addUser = (email, password, o) => { o = o || {}; const u = {id: uid(), email, password, full_name: o.name || '', role: o.role || 'student', approved: !!o.approved}; S.users.set(email, u); return u; };
  const byId = id => [...S.users.values()].find(u => u.id === id);
  const session = u => {
    const a = 'at.' + Math.random().toString(36).slice(2), r = 'rt.' + Math.random().toString(36).slice(2);
    S.tokens.set(a, u.id); S.refresh.set(r, u.id);
    return {access_token: a, refresh_token: r, expires_in: 3600, token_type: 'bearer', user: {id: u.id, email: u.email}};
  };
  const caller = h => { const t = (h.Authorization || '').replace('Bearer ', ''); const id = S.tokens.get(t); return id ? byId(id) : null; };
  const isAdmin = u => u && u.role === 'admin' && u.approved;
  const R = (status, body) => ({status, body});
  S.handle = (method, url, headers, body) => {
    const u = new URL(url), p = u.pathname, q = u.searchParams, me = caller(headers);
    S.log.push(method + ' ' + p);
    if (p === '/auth/v1/token' && q.get('grant_type') === 'password') {
      const usr = S.users.get(String(body.email).toLowerCase()) || S.users.get(body.email);
      return usr && usr.password === body.password ? R(200, session(usr)) : R(400, {error_description: 'Invalid login credentials', error_code: 'invalid_credentials'});
    }
    if (p === '/auth/v1/token' && q.get('grant_type') === 'refresh_token') { const id = S.refresh.get(body.refresh_token); return id ? R(200, session(byId(id))) : R(400, {error_description: 'Invalid Refresh Token'}); }
    if (p === '/auth/v1/signup') {
      if (S.users.has(body.email)) return R(422, {msg: 'User already registered'});
      const usr = S.addUser(body.email, body.password, {name: body.data && body.data.full_name});     // role/approved can never come from the request
      return S.autoConfirm ? R(200, session(usr)) : R(200, {id: usr.id, email: usr.email});
    }
    if (p === '/auth/v1/logout') { S.tokens.delete((headers.Authorization || '').replace('Bearer ', '')); return R(204, null); }
    if (p === '/auth/v1/recover') return R(200, {});
    if (p === '/auth/v1/user' && method === 'PUT') { if (!me) return R(401, {msg: 'unauthorized'}); me.password = body.password; return R(200, {id: me.id}); }
    if (!me) return R(401, {message: 'JWT expired or missing', code: 'PGRST301'});
    if (p === '/rest/v1/profiles' && method === 'GET') {
      const id = (q.get('id') || '').replace('eq.', ''); let rows = [...S.users.values()];
      if (!isAdmin(me)) rows = rows.filter(r => r.id === me.id);
      if (id) rows = rows.filter(r => r.id === id);
      return R(200, rows.map(r => ({id: r.id, email: r.email, full_name: r.full_name, role: r.role, approved: r.approved})));
    }
    if (p === '/rest/v1/profiles' && method === 'PATCH') {
      if (!isAdmin(me)) return R(200, []);                                                       // RLS: zero rows
      if (Object.keys(body).some(k => k !== 'approved')) return R(403, {message: 'permission denied', code: '42501'});
      const id = q.get('id').replace('eq.', ''); const t = byId(id); if (t) t.approved = !!body.approved; return R(204, null);
    }
    if (p === '/rest/v1/rpc/submit_progress') {
      if (!me.approved) return R(403, {message: 'account not approved', code: '42501'});
      if (me.role === 'admin') return R(200, {ok: true, skipped: 'admin', feedback: []});
      if (!body.p_payload || typeof body.p_payload.summary !== 'object') return R(400, {message: 'bad payload', code: '22023'});
      const dup = S.subs.find(s => s.student_id === me.id && s.client_id === body.p_client_id);
      if (!dup) S.subs.push({id: S.nextSub++, student_id: me.id, client_id: body.p_client_id, created_at: new Date(S.now ? S.now() : Date.now()).toISOString(), summary: body.p_payload.summary, payload: Object.assign({}, body.p_payload, {summary: undefined}), review_status: 'pending', review_note: null, rating: null, student_seen: true});
      const fb = S.subs.filter(s => s.student_id === me.id && !s.student_seen).map(s => ({id: s.id, status: s.review_status, note: s.review_note, rating: s.rating}));
      return R(200, {ok: true, server_time: new Date(S.now ? S.now() : Date.now()).toISOString(), duplicate: !!dup, feedback: fb});
    }
    if (p === '/rest/v1/rpc/ack_feedback') { S.subs.forEach(s => { if (s.student_id === me.id && body.p_ids.includes(s.id)) s.student_seen = true; }); return R(204, null); }
    if (p === '/rest/v1/rpc/admin_overview') {
      if (!isAdmin(me)) return R(403, {message: 'forbidden', code: '42501'});
      return R(200, [...S.users.values()].map(r => { const ss = S.subs.filter(s => s.student_id === r.id).sort((a, b) => b.id - a.id); return {id: r.id, email: r.email, full_name: r.full_name, role: r.role, approved: r.approved, created_at: new Date().toISOString(), last_sync_at: ss[0] ? ss[0].created_at : null, submissions: ss.length, unreviewed: ss.filter(s => s.review_status === 'pending').length, last_summary: ss[0] ? ss[0].summary : null}; }));
    }
    if (p === '/rest/v1/submissions' && method === 'GET') {
      let rows = S.subs.slice(); const sid = q.get('student_id'), id = q.get('id');
      if (!isAdmin(me)) rows = rows.filter(s => s.student_id === me.id);
      if (sid) rows = rows.filter(s => s.student_id === sid.replace('eq.', ''));
      if (id) rows = rows.filter(s => String(s.id) === id.replace('eq.', ''));
      return R(200, rows.sort((a, b) => b.id - a.id).map(s => JSON.parse(JSON.stringify(s))));
    }
    if (p === '/rest/v1/submissions' && method === 'PATCH') {
      if (!isAdmin(me)) return R(200, []);
      const id = +q.get('id').replace('eq.', ''), s = S.subs.find(x => x.id === id);
      if (s) Object.assign(s, body); return R(204, null);
    }
    return R(404, {message: 'not found ' + p});
  };
  S.fetch = async (url, init) => {
    init = init || {};
    if (S.offline) throw new TypeError('Failed to fetch');
    const r = S.handle(init.method || 'GET', url, init.headers || {}, init.body ? JSON.parse(init.body) : undefined);
    const text = r.body == null ? '' : JSON.stringify(r.body);
    return {ok: r.status >= 200 && r.status < 300, status: r.status, text: async () => text, headers: {get: () => new Date().toUTCString()}};
  };
  return S;
}
module.exports = {createServer};
