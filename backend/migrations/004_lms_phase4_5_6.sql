-- Sprachtreppe LMS v2 Phases 4-6
-- Activity/attendance, dashboards, audit logging, email queue, retention helpers,
-- class roster management and assignment/announcement notification hooks.
-- Apply after backend/schema.sql and migrations 001, 002, 003.

begin;

-- Activity / attendance ------------------------------------------------------
create table if not exists public.study_sessions (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(id) on delete cascade,
  class_id uuid references public.classes(id) on delete set null,
  activity_type text not null default 'course',
  started_at timestamptz not null,
  ended_at timestamptz,
  duration_seconds integer not null default 0 check (duration_seconds between 0 and 21600),
  client_session_id text not null check (char_length(trim(client_session_id)) between 8 and 160),
  created_at timestamptz not null default now(),
  unique(student_id,client_session_id)
);
create index if not exists study_sessions_student_idx on public.study_sessions(student_id,started_at desc);
create index if not exists study_sessions_class_idx on public.study_sessions(class_id,started_at desc);
alter table public.study_sessions enable row level security;

create or replace function public.record_study_session(
  p_client_session_id text,
  p_class_id uuid,
  p_activity_type text,
  p_started_at timestamptz,
  p_ended_at timestamptz,
  p_duration_seconds integer
) returns public.study_sessions
language plpgsql security definer set search_path = '' as $$
declare v_uid uuid:=auth.uid(); v_s public.study_sessions;
begin
  if v_uid is null then raise exception 'not authenticated' using errcode='28000'; end if;
  if not exists(select 1 from public.profiles where id=v_uid and approved and role in ('student','teacher','admin')) then raise exception 'account not approved' using errcode='42501'; end if;
  if p_client_session_id is null or char_length(trim(p_client_session_id)) not between 8 and 160 then raise exception 'invalid session id' using errcode='22023'; end if;
  if p_duration_seconds is null or p_duration_seconds<0 or p_duration_seconds>21600 then raise exception 'invalid duration' using errcode='22023'; end if;
  if p_class_id is not null and not public.is_class_member(p_class_id) and not public.is_class_teacher(p_class_id) and not public.is_admin() then raise exception 'not authorized for class' using errcode='42501'; end if;
  insert into public.study_sessions(student_id,class_id,activity_type,started_at,ended_at,duration_seconds,client_session_id)
  values(v_uid,p_class_id,left(coalesce(p_activity_type,'course'),100),coalesce(p_started_at,now()),p_ended_at,p_duration_seconds,trim(p_client_session_id))
  on conflict(student_id,client_session_id) do update set ended_at=excluded.ended_at,duration_seconds=excluded.duration_seconds,activity_type=excluded.activity_type,class_id=excluded.class_id
  returning * into v_s;
  return v_s;
end $$;

-- Immutable audit log --------------------------------------------------------
create table if not exists public.admin_audit_log (
  id bigint generated always as identity primary key,
  actor_id uuid references public.profiles(id) on delete set null,
  action text not null check (char_length(trim(action)) between 1 and 120),
  target_type text not null default 'system',
  target_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  ip_address inet,
  created_at timestamptz not null default now(),
  check (jsonb_typeof(metadata)='object')
);
create index if not exists admin_audit_actor_idx on public.admin_audit_log(actor_id,created_at desc);
create index if not exists admin_audit_target_idx on public.admin_audit_log(target_type,target_id,created_at desc);
alter table public.admin_audit_log enable row level security;

create or replace function public.write_audit_log(p_action text,p_target_type text default 'system',p_target_id uuid default null,p_metadata jsonb default '{}'::jsonb)
returns public.admin_audit_log
language plpgsql security definer set search_path = '' as $$
declare v_row public.admin_audit_log;
begin
  if auth.uid() is null or not public.is_admin() then raise exception 'forbidden' using errcode='42501'; end if;
  insert into public.admin_audit_log(actor_id,action,target_type,target_id,metadata)
  values(auth.uid(),trim(p_action),coalesce(trim(p_target_type),'system'),p_target_id,coalesce(p_metadata,'{}'::jsonb)) returning * into v_row;
  return v_row;
end $$;

-- No update/delete policies: audit rows are append-only for clients.
create policy admin_audit_select on public.admin_audit_log for select to authenticated using(public.is_admin());
revoke all on public.admin_audit_log from anon,authenticated;
grant select on public.admin_audit_log to authenticated;

-- Email queue: application/job writes here; secrets stay server-side --------
create table if not exists public.email_queue (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  email text not null,
  type text not null check (char_length(trim(type)) between 1 and 80),
  subject text not null check (char_length(trim(subject)) between 1 and 200),
  payload jsonb not null default '{}'::jsonb,
  scheduled_at timestamptz not null default now(),
  sent_at timestamptz,
  attempts integer not null default 0 check (attempts>=0),
  last_error text,
  locked_at timestamptz,
  created_at timestamptz not null default now(),
  unique(user_id,type,scheduled_at)
);
create index if not exists email_queue_pending_idx on public.email_queue(scheduled_at) where sent_at is null;
alter table public.email_queue enable row level security;

create or replace function public.queue_email(p_user_id uuid,p_type text,p_subject text,p_payload jsonb default '{}'::jsonb,p_scheduled_at timestamptz default now())
returns public.email_queue
language plpgsql security definer set search_path = '' as $$
declare v_uid uuid:=auth.uid(); v_email text; v_row public.email_queue;
begin
  if v_uid is null or not public.is_teacher() then raise exception 'forbidden' using errcode='42501'; end if;
  select email into v_email from public.profiles where id=p_user_id and approved;
  if v_email is null then raise exception 'approved user not found' using errcode='P0002'; end if;
  insert into public.email_queue(user_id,email,type,subject,payload,scheduled_at)
  values(p_user_id,v_email,trim(p_type),left(trim(p_subject),200),coalesce(p_payload,'{}'::jsonb),coalesce(p_scheduled_at,now()))
  on conflict(user_id,type,scheduled_at) do update set subject=excluded.subject,payload=excluded.payload
  returning * into v_row;
  return v_row;
end $$;

-- Roster management ---------------------------------------------------------
create or replace function public.remove_student_from_class(p_class_id uuid,p_student_id uuid)
returns void language plpgsql security definer set search_path = '' as $$
begin
  if not public.is_class_teacher(p_class_id) then raise exception 'forbidden' using errcode='42501'; end if;
  update public.class_members set status='removed',left_at=now() where class_id=p_class_id and student_id=p_student_id;
end $$;

create or replace function public.leave_class(p_class_id uuid)
returns void language plpgsql security definer set search_path = '' as $$
begin
  if not exists(select 1 from public.class_members where class_id=p_class_id and student_id=auth.uid() and status='active') then raise exception 'not a member' using errcode='42501'; end if;
  update public.class_members set status='left',left_at=now() where class_id=p_class_id and student_id=auth.uid();
end $$;

create or replace function public.revoke_class_invite(p_invite_id uuid)
returns void language plpgsql security definer set search_path = '' as $$
declare v_class uuid;
begin
  select class_id into v_class from public.class_invites where id=p_invite_id;
  if not found or not public.is_class_teacher(v_class) then raise exception 'forbidden' using errcode='42501'; end if;
  update public.class_invites set revoked_at=now() where id=p_invite_id;
end $$;

-- Dashboard helpers ----------------------------------------------------------
create or replace function public.teacher_class_dashboard(p_class_id uuid)
returns table(
  class_id uuid,class_name text,student_count bigint,active_students_7d bigint,assignment_count bigint,unsubmitted_count bigint,graded_count bigint,avg_score numeric,weekly_minutes numeric,last_activity timestamptz
)
language sql stable security definer set search_path = '' as $$
  with students as (
    select student_id from public.class_members where class_id=p_class_id and status='active'
  ), latest_activity as (
    select ss.student_id,max(ss.started_at) last_at from public.study_sessions ss where ss.class_id=p_class_id group by ss.student_id
  ), stats as (
    select a.id,a.points,cm.student_id,s.score
    from public.assignments a
    join public.class_members cm on cm.class_id=a.class_id and cm.status='active'
    left join lateral(select x.score from public.assignment_submissions x where x.assignment_id=a.id and x.student_id=cm.student_id order by x.submitted_at desc limit 1)s on true
    where a.class_id=p_class_id and a.published
  )
  select c.id,c.name,(select count(*) from students),
    (select count(*) from latest_activity where last_at>=now()-interval '7 days'),
    (select count(*) from public.assignments where class_id=p_class_id and published),
    count(*) filter(where stats.score is null),count(*) filter(where stats.score is not null),
    avg((stats.score/stats.points)*100),
    coalesce((select sum(ss.duration_seconds)/60.0 from public.study_sessions ss where ss.class_id=p_class_id and ss.started_at>=now()-interval '7 days'),0),
    (select max(ss.started_at) from public.study_sessions ss where ss.class_id=p_class_id)
  from public.classes c left join stats on true
  where c.id=p_class_id and public.is_class_teacher(p_class_id)
  group by c.id,c.name;
$$;

create or replace function public.student_dashboard()
returns jsonb language sql stable security definer set search_path = '' as $$
  select jsonb_build_object(
    'assignments',coalesce((select jsonb_agg(to_jsonb(x)) from (select * from public.list_my_assignments(false) limit 100)x),'[]'::jsonb),
    'notifications',coalesce((select jsonb_agg(to_jsonb(x)) from (select * from public.get_my_notifications(50))x),'[]'::jsonb),
    'announcements',coalesce((select jsonb_agg(to_jsonb(x)) from (select * from public.get_my_announcements(30))x),'[]'::jsonb),
    'weekly_minutes',coalesce((select sum(duration_seconds)/60.0 from public.study_sessions where student_id=auth.uid() and started_at>=now()-interval '7 days'),0),
    'last_active', (select max(started_at) from public.study_sessions where student_id=auth.uid())
  );
$$;

-- Automatic notification hooks ---------------------------------------------
create or replace function public.notify_assignment_published()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if new.published and (tg_op='INSERT' or old.published is distinct from true) then
    insert into public.notifications(user_id,type,title,body,related_id)
    select cm.student_id,'assignment_created',new.title,
      case when new.due_at is null then 'A new assignment is available.' else 'A new assignment is available. Due: '||to_char(new.due_at,'YYYY-MM-DD HH24:MI') end,new.id
    from public.class_members cm
    where cm.class_id=new.class_id and cm.status='active'
      and not exists(select 1 from public.notifications n where n.user_id=cm.student_id and n.type='assignment_created' and n.related_id=new.id);
  end if;
  return new;
end $$;
drop trigger if exists assignment_published_notification on public.assignments;
create trigger assignment_published_notification after insert or update of published on public.assignments for each row execute function public.notify_assignment_published();

create or replace function public.notify_assignment_graded()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if new.status in ('graded','returned') and (old.status is distinct from new.status or old.score is distinct from new.score or old.teacher_feedback is distinct from new.teacher_feedback) then
    insert into public.notifications(user_id,type,title,body,related_id)
    values(new.student_id,'assignment_graded','Assignment graded','Your assignment has been graded. Open it to see your score and feedback.',new.assignment_id);
  end if;
  return new;
end $$;
drop trigger if exists assignment_graded_notification on public.assignment_submissions;
create trigger assignment_graded_notification after update of status,score,teacher_feedback on public.assignment_submissions for each row execute function public.notify_assignment_graded();

-- Retention / maintenance ---------------------------------------------------
create or replace function public.run_retention_cleanup()
returns jsonb language plpgsql security definer set search_path = '' as $$
declare v_audit bigint:=0; v_notifications bigint:=0; v_sessions bigint:=0; v_emails bigint:=0;
begin
  if not public.is_admin() then raise exception 'forbidden' using errcode='42501'; end if;
  delete from public.notifications where created_at < now()-interval '90 days'; get diagnostics v_notifications=row_count;
  delete from public.study_sessions where created_at < now()-interval '1 year'; get diagnostics v_sessions=row_count;
  delete from public.email_queue where sent_at is not null and sent_at < now()-interval '90 days'; get diagnostics v_emails=row_count;
  delete from public.admin_audit_log where created_at < now()-interval '2 years'; get diagnostics v_audit=row_count;
  return jsonb_build_object('audit_deleted',v_audit,'notifications_deleted',v_notifications,'sessions_deleted',v_sessions,'emails_deleted',v_emails,'ran_at',now());
end $$;

-- Secure client grants ------------------------------------------------------
revoke all on public.study_sessions,public.email_queue from anon,authenticated;
grant select on public.study_sessions to authenticated;
revoke all on function public.record_study_session(text,uuid,text,timestamptz,timestamptz,integer),public.write_audit_log(text,text,uuid,jsonb),public.queue_email(uuid,text,text,jsonb,timestamptz),public.remove_student_from_class(uuid,uuid),public.leave_class(uuid),public.revoke_class_invite(uuid),public.teacher_class_dashboard(uuid),public.student_dashboard(),public.run_retention_cleanup() from public,anon;
grant execute on function public.record_study_session(text,uuid,text,timestamptz,timestamptz,integer),public.write_audit_log(text,text,uuid,jsonb),public.queue_email(uuid,text,text,jsonb,timestamptz),public.remove_student_from_class(uuid,uuid),public.leave_class(uuid),public.revoke_class_invite(uuid),public.teacher_class_dashboard(uuid),public.student_dashboard(),public.run_retention_cleanup() to authenticated;

commit;
