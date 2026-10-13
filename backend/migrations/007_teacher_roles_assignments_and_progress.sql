-- Teacher accounts, class teacher assignments, staff assignment creation,
-- teacher-safe RLS, and real exercise progress support.
-- Applied to Supabase project sprachtreppe as migration:
-- teacher_roles_assignments_and_progress_hooks_v2
-- teacher_lms_rls_policies
-- teacher_function_execute_hardening

create table if not exists public.class_teachers (
  class_id bigint not null references public.classes(id) on delete cascade,
  teacher_id uuid not null references public.profiles(id) on delete cascade,
  assigned_by uuid not null references public.profiles(id),
  assigned_at timestamptz not null default now(),
  primary key (class_id, teacher_id)
);

alter table public.class_teachers enable row level security;
grant select on public.class_teachers to authenticated;

create policy "teachers can read their class assignments"
on public.class_teachers for select to authenticated
using (teacher_id = auth.uid() or public.is_admin());

create or replace function public.is_teacher()
returns boolean language sql stable security definer set search_path=public
as $$ select exists(select 1 from public.profiles where id=auth.uid() and role='teacher' and approved); $$;

create or replace function public.is_staff()
returns boolean language sql stable security definer set search_path=public
as $$ select public.is_admin() or public.is_teacher(); $$;

create or replace function public.assign_teacher(p_email text)
returns uuid language plpgsql security definer set search_path=public
as $$
declare v_id uuid;
begin
  if not public.is_admin() then raise exception 'forbidden' using errcode='42501'; end if;
  select id into v_id from public.profiles where lower(email)=lower(trim(p_email));
  if v_id is null then raise exception 'teacher account not found'; end if;
  update public.profiles set role='teacher', approved=true where id=v_id;
  return v_id;
end $$;

create or replace function public.assign_teacher_to_class(p_class bigint, p_teacher uuid)
returns void language plpgsql security definer set search_path=public
as $$
begin
  if not public.is_admin() then raise exception 'forbidden' using errcode='42501'; end if;
  if not exists(select 1 from public.classes where id=p_class and not archived) then raise exception 'class not found'; end if;
  if not exists(select 1 from public.profiles where id=p_teacher and role='teacher' and approved) then raise exception 'teacher not found or not approved'; end if;
  insert into public.class_teachers(class_id,teacher_id,assigned_by) values(p_class,p_teacher,auth.uid()) on conflict do nothing;
end $$;

create or replace function public.my_classroom()
returns jsonb language sql stable security definer set search_path=public
as $$
  select case
    when public.is_approved_student() then public.classroom_for(auth.uid())
    when public.is_teacher() then jsonb_build_object(
      'classes', coalesce((select jsonb_agg(jsonb_build_object('id',c.id,'name',c.name,'archived',c.archived) order by c.name) from public.classes c join public.class_teachers ct on ct.class_id=c.id where ct.teacher_id=auth.uid() and not c.archived),'[]'::jsonb),
      'assignments', coalesce((select jsonb_agg(to_jsonb(a) order by a.created_at desc) from public.assignments a where not a.archived and (a.created_by=auth.uid() or a.class_id in (select class_id from public.class_teachers where teacher_id=auth.uid()))),'[]'::jsonb),
      'announcements', coalesce((select jsonb_agg(to_jsonb(a) order by a.created_at desc) from public.announcements a where a.class_id in (select class_id from public.class_teachers where teacher_id=auth.uid())),'[]'::jsonb)
    )
    else '{}'::jsonb end;
$$;

create or replace function public.create_assignment(p_class bigint,p_title text,p_instructions text,p_skill text,p_target integer,p_due timestamptz)
returns bigint language plpgsql security definer set search_path=public
as $$
declare v_id bigint;
begin
  if not public.is_staff() then raise exception 'forbidden' using errcode='42501'; end if;
  if p_class is not null and not (public.is_admin() or exists(select 1 from public.class_teachers where class_id=p_class and teacher_id=auth.uid())) then raise exception 'not assigned to class' using errcode='42501'; end if;
  if coalesce(length(trim(p_title)),0)<1 or length(trim(p_title))>120 then raise exception 'invalid title'; end if;
  if coalesce(p_target,0)<1 or p_target>1000 then raise exception 'invalid target'; end if;
  insert into public.assignments(class_id,title,instructions,kind,skill,target_count,due_at,created_by)
  values(p_class,trim(p_title),coalesce(p_instructions,''),'practice',coalesce(nullif(trim(p_skill),''),'mixed'),p_target,p_due,auth.uid())
  returning id into v_id;
  return v_id;
end $$;

-- assignment_status is recreated in the applied migration with staff-only visibility.

create policy "classes_teacher_select" on public.classes
for select to authenticated
using (public.is_teacher() and exists(select 1 from public.class_teachers ct where ct.class_id=classes.id and ct.teacher_id=auth.uid()) and not archived);

create policy "assignments_teacher_select" on public.assignments
for select to authenticated
using (public.is_teacher() and not archived and (created_by=auth.uid() or class_id in (select class_id from public.class_teachers where teacher_id=auth.uid())));

create policy "announcements_teacher_select" on public.announcements
for select to authenticated
using (public.is_teacher() and (class_id is null or class_id in (select class_id from public.class_teachers where teacher_id=auth.uid())));

create policy "announcements_teacher_insert" on public.announcements
for insert to authenticated
with check (public.is_teacher() and created_by=auth.uid() and class_id in (select class_id from public.class_teachers where teacher_id=auth.uid()));

revoke execute on function public.is_teacher() from public;
revoke execute on function public.is_staff() from public;
revoke execute on function public.assign_teacher(text) from public;
revoke execute on function public.assign_teacher_to_class(bigint,uuid) from public;
revoke execute on function public.my_classroom() from public;
revoke execute on function public.create_assignment(bigint,text,text,text,integer,timestamptz) from public;
revoke execute on function public.assignment_status(bigint) from public;
grant execute on function public.is_teacher() to authenticated;
grant execute on function public.is_staff() to authenticated;
grant execute on function public.assign_teacher(text) to authenticated;
grant execute on function public.assign_teacher_to_class(bigint,uuid) to authenticated;
grant execute on function public.my_classroom() to authenticated;
grant execute on function public.create_assignment(bigint,text,text,text,integer,timestamptz) to authenticated;
grant execute on function public.assignment_status(bigint) to authenticated;
