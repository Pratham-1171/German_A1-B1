-- Sprachtreppe LMS v2 scheduled jobs
-- Optional pg_cron schedules are documented in SETUP.md because extension/job
-- installation is environment-specific. This migration adds the safe queueing
-- functions used by those jobs.

begin;

create or replace function public.queue_assignment_due_reminders()
returns integer language plpgsql security definer set search_path = '' as $$
declare v_count integer:=0;
begin
  if not public.is_admin() then raise exception 'forbidden' using errcode='42501'; end if;
  insert into public.email_queue(user_id,email,type,subject,payload,scheduled_at)
  select p.id,p.email,'assignment_due_24h','Sprachtreppe: assignment due soon',
    jsonb_build_object('assignment_id',a.id,'title',a.title,'due_at',a.due_at),now()
  from public.assignments a
  join public.class_members cm on cm.class_id=a.class_id and cm.status='active'
  join public.profiles p on p.id=cm.student_id and p.approved
  where a.published and a.due_at is not null
    and a.due_at between now()+interval '23 hours' and now()+interval '25 hours'
    and not exists(select 1 from public.email_queue q where q.user_id=p.id and q.type='assignment_due_24h' and q.payload->>'assignment_id'=a.id::text);
  get diagnostics v_count=row_count;
  return v_count;
end $$;

create or replace function public.queue_inactive_student_reminders()
returns integer language plpgsql security definer set search_path = '' as $$
declare v_count integer:=0;
begin
  if not public.is_admin() then raise exception 'forbidden' using errcode='42501'; end if;
  insert into public.email_queue(user_id,email,type,subject,payload,scheduled_at)
  select p.id,p.email,'inactive_7d','Sprachtreppe: we miss you',
    jsonb_build_object('last_active',max(ss.started_at)),now()
  from public.profiles p
  join public.class_members cm on cm.student_id=p.id and cm.status='active'
  left join public.study_sessions ss on ss.student_id=p.id
  where p.approved and p.role='student'
  group by p.id,p.email
  having coalesce(max(ss.started_at),p.created_at) < now()-interval '7 days'
  on conflict(user_id,type,scheduled_at) do nothing;
  get diagnostics v_count=row_count;
  return v_count;
end $$;

create or replace function public.queue_weekly_student_reports()
returns integer language plpgsql security definer set search_path = '' as $$
declare v_count integer:=0;
begin
  if not public.is_admin() then raise exception 'forbidden' using errcode='42501'; end if;
  insert into public.email_queue(user_id,email,type,subject,payload,scheduled_at)
  select p.id,p.email,'weekly_progress_report','Sprachtreppe: your weekly progress',
    jsonb_build_object('weekly_minutes',coalesce((select sum(duration_seconds)/60.0 from public.study_sessions ss where ss.student_id=p.id and ss.started_at>=now()-interval '7 days'),0)),now()
  from public.profiles p
  where p.approved and p.role='student'
    and not exists(select 1 from public.email_queue q where q.user_id=p.id and q.type='weekly_progress_report' and q.created_at>=date_trunc('week',now()));
  get diagnostics v_count=row_count;
  return v_count;
end $$;

revoke all on function public.queue_assignment_due_reminders(),public.queue_inactive_student_reminders(),public.queue_weekly_student_reports() from public,anon;
grant execute on function public.queue_assignment_due_reminders(),public.queue_inactive_student_reminders(),public.queue_weekly_student_reports() to authenticated;

commit;
