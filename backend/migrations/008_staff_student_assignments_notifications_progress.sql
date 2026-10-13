-- Staff/student assignment management, progress dashboards and in-app notifications.
create table if not exists public.teacher_students (
  teacher_id uuid not null references public.profiles(id) on delete cascade,
  student_id uuid not null references public.profiles(id) on delete cascade,
  assigned_by uuid not null references public.profiles(id),
  assigned_at timestamptz not null default now(),
  primary key (teacher_id, student_id),
  check (teacher_id <> student_id)
);
create index if not exists teacher_students_student_idx on public.teacher_students(student_id);
create index if not exists teacher_students_teacher_idx on public.teacher_students(teacher_id);
alter table public.teacher_students enable row level security;
grant select on public.teacher_students to authenticated;
drop policy if exists teacher_students_select on public.teacher_students;
create policy teacher_students_select on public.teacher_students for select to authenticated using (is_admin() or teacher_id=auth.uid() or student_id=auth.uid());

create table if not exists public.notifications (
  id bigint generated always as identity primary key,
  user_id uuid not null references public.profiles(id) on delete cascade,
  kind text not null default 'info',
  title text not null,
  body text not null default '',
  link text,
  read_at timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists notifications_user_created_idx on public.notifications(user_id, created_at desc);
alter table public.notifications enable row level security;
grant select, update on public.notifications to authenticated;
grant usage, select on sequence public.notifications_id_seq to authenticated;
create policy notifications_select_own on public.notifications for select to authenticated using (user_id=auth.uid());
create policy notifications_update_own on public.notifications for update to authenticated using (user_id=auth.uid()) with check (user_id=auth.uid());

create or replace function public.assign_student_to_teacher(p_teacher uuid,p_student uuid)
returns void language plpgsql security definer set search_path=public as $$
begin
  if not is_admin() then raise exception 'forbidden' using errcode='42501'; end if;
  if not exists(select 1 from profiles where id=p_teacher and role='teacher' and approved) then raise exception 'teacher not found or not approved'; end if;
  if not exists(select 1 from profiles where id=p_student and role='student' and approved) then raise exception 'student not found or not approved'; end if;
  insert into teacher_students(teacher_id,student_id,assigned_by) values(p_teacher,p_student,auth.uid()) on conflict (teacher_id,student_id) do update set assigned_by=excluded.assigned_by,assigned_at=now();
  insert into notifications(user_id,kind,title,body,link) values(p_student,'teacher_assignment','Teacher assigned','You have been assigned to a teacher.','#/classroom');
  insert into audit_log(actor_id,actor_email,action,target_type,target_id,details) select auth.uid(),p.email,'assign_student_to_teacher','student',p_student::text,jsonb_build_object('teacher_id',p_teacher) from profiles p where p.id=auth.uid();
end $$;

grant execute on function public.assign_student_to_teacher(uuid,uuid) to authenticated;

create or replace function public.remove_student_from_teacher(p_teacher uuid,p_student uuid)
returns void language plpgsql security definer set search_path=public as $$
begin
  if not is_admin() then raise exception 'forbidden' using errcode='42501'; end if;
  delete from teacher_students where teacher_id=p_teacher and student_id=p_student;
  insert into notifications(user_id,kind,title,body,link) values(p_student,'teacher_assignment_removed','Teacher assignment removed','You are no longer assigned to that teacher.','#/classroom');
  insert into audit_log(actor_id,actor_email,action,target_type,target_id,details) select auth.uid(),p.email,'remove_student_from_teacher','student',p_student::text,jsonb_build_object('teacher_id',p_teacher) from profiles p where p.id=auth.uid();
end $$;

grant execute on function public.remove_student_from_teacher(uuid,uuid) to authenticated;

create or replace function public.my_students()
returns jsonb language sql stable security definer set search_path=public as $$
  select coalesce(jsonb_agg(jsonb_build_object('id',p.id,'full_name',p.full_name,'email',p.email,'approved',p.approved,'assigned_at',ts.assigned_at,'assignment_count',coalesce(x.assignment_count,0),'completed_assignments',coalesce(x.completed_assignments,0),'done',coalesce(x.done,0),'correct',coalesce(x.correct,0),'last_activity',x.last_activity) order by p.full_name,p.email),'[]'::jsonb)
  from teacher_students ts join profiles p on p.id=ts.student_id
  left join lateral (select count(*) filter(where not a.archived)::int assignment_count,count(*) filter(where ap.completed_at is not null)::int completed_assignments,coalesce(sum(ap.done),0)::int done,coalesce(sum(ap.correct),0)::int correct,max(ap.updated_at) last_activity from assignments a left join assignment_progress ap on ap.assignment_id=a.id and ap.student_id=p.id) x on true
  where ts.teacher_id=auth.uid() and is_teacher();
$$;

grant execute on function public.my_students() to authenticated;

create or replace function public.admin_students_overview()
returns jsonb language sql stable security definer set search_path=public as $$
  select coalesce(jsonb_agg(jsonb_build_object('id',p.id,'full_name',p.full_name,'email',p.email,'approved',p.approved,'teachers',coalesce(t.teachers,'[]'::jsonb),'classes',coalesce(c.classes,'[]'::jsonb),'assignment_count',coalesce(x.assignment_count,0),'completed_assignments',coalesce(x.completed_assignments,0),'done',coalesce(x.done,0),'correct',coalesce(x.correct,0),'last_activity',x.last_activity,'pending_submissions',coalesce(s.pending_submissions,0)) order by p.full_name,p.email),'[]'::jsonb)
  from profiles p
  left join lateral (select jsonb_agg(jsonb_build_object('id',tp.id,'name',coalesce(tp.full_name,tp.email)) order by tp.full_name,tp.email) teachers from teacher_students ts join profiles tp on tp.id=ts.teacher_id where ts.student_id=p.id) t on true
  left join lateral (select jsonb_agg(jsonb_build_object('id',cl.id,'name',cl.name) order by cl.name) classes from class_members cm join classes cl on cl.id=cm.class_id where cm.student_id=p.id) c on true
  left join lateral (select count(*) filter(where not a.archived)::int assignment_count,count(*) filter(where ap.completed_at is not null)::int completed_assignments,coalesce(sum(ap.done),0)::int done,coalesce(sum(ap.correct),0)::int correct,max(ap.updated_at) last_activity from assignments a left join assignment_progress ap on ap.assignment_id=a.id and ap.student_id=p.id) x on true
  left join lateral (select count(*) filter(where coalesce(s.review_status,'pending')='pending')::int pending_submissions from submissions s where s.student_id=p.id) s on true
  where p.role='student' and is_admin();
$$;

grant execute on function public.admin_students_overview() to authenticated;

create or replace function public.staff_audit(p_limit integer default 100)
returns jsonb language sql stable security definer set search_path=public as $$
  select coalesce(jsonb_agg(jsonb_build_object('id',a.id,'at',a.at,'actor_id',a.actor_id,'actor_email',a.actor_email,'action',a.action,'target_type',a.target_type,'target_id',a.target_id,'details',a.details) order by a.at desc),'[]'::jsonb)
  from audit_log a
  where (is_admin() or a.actor_id=auth.uid() or exists(select 1 from teacher_students ts where ts.teacher_id=auth.uid() and ts.student_id=a.actor_id))
    and (is_admin() or is_teacher());
$$;

grant execute on function public.staff_audit(integer) to authenticated;

create or replace function public.mark_notification_read(p_id bigint)
returns void language sql security definer set search_path=public as $$
  update notifications set read_at=now() where id=p_id and user_id=auth.uid();
$$;
grant execute on function public.mark_notification_read(bigint) to authenticated;

create or replace function public.create_assignment(p_class bigint,p_title text,p_instructions text,p_skill text,p_target integer,p_due timestamptz)
returns bigint language plpgsql security definer set search_path=public as $$
declare v_id bigint;
begin
  if not is_staff() then raise exception 'forbidden' using errcode='42501'; end if;
  if p_class is null and not is_admin() then raise exception 'teachers must choose a class' using errcode='42501'; end if;
  if p_class is not null and not (is_admin() or exists(select 1 from class_teachers where class_id=p_class and teacher_id=auth.uid())) then raise exception 'not assigned to class' using errcode='42501'; end if;
  if coalesce(length(trim(p_title)),0)<1 or length(trim(p_title))>120 then raise exception 'invalid title'; end if;
  if coalesce(p_target,0)<1 or p_target>1000 then raise exception 'invalid target'; end if;
  insert into assignments(class_id,title,instructions,kind,skill,target_count,due_at,created_by) values(p_class,trim(p_title),coalesce(p_instructions,''),'practice',coalesce(nullif(trim(p_skill),''),'mixed'),p_target,p_due,auth.uid()) returning id into v_id;
  insert into notifications(user_id,kind,title,body,link)
  select distinct q.student_id,'assignment_assigned','New assignment: '||trim(p_title),'A new assignment has been assigned to you.','#/assignments'
  from (select cm.student_id from class_members cm where cm.class_id=p_class and p_class is not null and exists(select 1 from profiles sp where sp.id=cm.student_id and sp.role='student' and sp.approved)
        union select ts.student_id from teacher_students ts where ts.teacher_id=auth.uid() and p_class is null
        union select sp.id from profiles sp where sp.role='student' and sp.approved and p_class is null and is_admin()) q;
  return v_id;
end $$;

grant execute on function public.create_assignment(bigint,text,text,text,integer,timestamptz) to authenticated;

create or replace function public.update_assignment_progress(p_assignment bigint,p_done integer,p_correct integer)
returns void language plpgsql security definer set search_path=public as $$
declare v_uid uuid:=auth.uid(); v_class bigint; v_target integer; v_old_completed timestamptz; v_title text; v_completed boolean;
begin
  if v_uid is null or not is_approved_student() then raise exception 'forbidden' using errcode='42501'; end if;
  select class_id,target_count,title into v_class,v_target,v_title from assignments where id=p_assignment and not archived;
  if not found then raise exception 'assignment not found'; end if;
  if v_class is not null and not exists(select 1 from class_members where class_id=v_class and student_id=v_uid) then raise exception 'not a class member' using errcode='42501'; end if;
  select completed_at into v_old_completed from assignment_progress where assignment_id=p_assignment and student_id=v_uid;
  if p_done<0 or p_correct<0 or p_correct>p_done or p_done>coalesce(v_target,100000) then raise exception 'invalid progress'; end if;
  v_completed:=p_done>=coalesce(v_target,100000);
  insert into assignment_progress(assignment_id,student_id,done,correct,completed_at,updated_at) values(p_assignment,v_uid,p_done,p_correct,case when v_completed then coalesce(v_old_completed,now()) else null end,now()) on conflict(assignment_id,student_id) do update set done=excluded.done,correct=excluded.correct,completed_at=excluded.completed_at,updated_at=now();
  if v_completed and v_old_completed is null then
    insert into notifications(user_id,kind,title,body,link) values(v_uid,'assignment_submission','Assignment submitted','Your assignment "'||v_title||'" has been submitted.','#/assignments');
    insert into notifications(user_id,kind,title,body,link) select ts.teacher_id,'student_submission','Student submitted assignment',coalesce((select full_name from profiles where id=v_uid),'A student')||' completed "'||v_title||'".','#/assignments' from teacher_students ts where ts.student_id=v_uid;
    insert into audit_log(actor_id,actor_email,action,target_type,target_id,details) select v_uid,p.email,'assignment_submission','assignment',p_assignment::text,jsonb_build_object('done',p_done,'correct',p_correct) from profiles p where p.id=v_uid;
  end if;
end $$;

grant execute on function public.update_assignment_progress(bigint,integer,integer) to authenticated;
