-- LMS additions for the currently deployed classroom schema.
-- The deployed database uses admin as the teacher role.
create extension if not exists pgcrypto;

create table if not exists public.class_invites (
  id bigint generated always as identity primary key,
  class_id bigint not null references public.classes(id) on delete cascade,
  code_hash text not null unique,
  expires_at timestamptz,
  max_uses integer not null default 100 check (max_uses between 1 and 10000),
  uses integer not null default 0 check (uses >= 0),
  created_by uuid not null default auth.uid() references public.profiles(id),
  created_at timestamptz not null default now()
);

alter table public.class_invites enable row level security;
drop policy if exists class_invites_admin on public.class_invites;
create policy class_invites_admin on public.class_invites for all to authenticated using (public.is_admin()) with check (public.is_admin());
grant select, insert, update, delete on public.class_invites to authenticated;
grant usage, select on sequence public.class_invites_id_seq to authenticated;

create or replace function public.create_class(p_name text)
returns bigint language plpgsql security definer set search_path='' as $$
declare v_id bigint;
begin
  if not public.is_admin() then raise exception 'forbidden' using errcode='42501'; end if;
  if char_length(trim(p_name)) < 1 or char_length(trim(p_name)) > 60 then raise exception 'invalid class name'; end if;
  insert into public.classes(name, created_by) values(trim(p_name), auth.uid()) returning id into v_id;
  return v_id;
end $$;

create or replace function public.create_class_invite(p_class bigint, p_code text, p_expires_at timestamptz default null, p_max_uses integer default 100)
returns bigint language plpgsql security definer set search_path='' as $$
declare v_id bigint; v_hash text;
begin
  if not public.is_admin() then raise exception 'forbidden' using errcode='42501'; end if;
  if not exists(select 1 from public.classes where id=p_class and not archived) then raise exception 'class not found'; end if;
  if p_code is null or p_code !~ '^[A-Za-z0-9]{6,32}$' then raise exception 'invalid invite code'; end if;
  v_hash := encode(digest(lower(trim(p_code)), 'sha256'), 'hex');
  insert into public.class_invites(class_id,code_hash,expires_at,max_uses,created_by) values(p_class,v_hash,p_expires_at,coalesce(p_max_uses,100),auth.uid()) returning id into v_id;
  return v_id;
end $$;

create or replace function public.join_class_with_code(p_code text)
returns bigint language plpgsql security definer set search_path='' as $$
declare v_inv public.class_invites%rowtype;
begin
  if auth.uid() is null then raise exception 'not signed in'; end if;
  if not public.is_approved_student() then raise exception 'account not approved'; end if;
  select * into v_inv from public.class_invites where code_hash=encode(digest(lower(trim(p_code)), 'sha256'),'hex') and (expires_at is null or expires_at>now()) and uses<max_uses for update;
  if not found then raise exception 'invalid or expired class code'; end if;
  insert into public.class_members(class_id,student_id) values(v_inv.class_id,auth.uid()) on conflict do nothing;
  update public.class_invites set uses=uses+1 where id=v_inv.id;
  return v_inv.class_id;
end $$;

create or replace function public.update_assignment_progress(p_assignment bigint, p_done integer, p_correct integer)
returns void language plpgsql security definer set search_path='' as $$
declare v_uid uuid := auth.uid(); v_class bigint; v_target integer;
begin
  if v_uid is null or not public.is_approved_student() then raise exception 'forbidden' using errcode='42501'; end if;
  select class_id,target_count into v_class,v_target from public.assignments where id=p_assignment and not archived;
  if not found then raise exception 'assignment not found'; end if;
  if v_class is not null and not exists(select 1 from public.class_members where class_id=v_class and student_id=v_uid) then raise exception 'not a class member' using errcode='42501'; end if;
  if p_done < 0 or p_correct < 0 or p_correct > p_done or p_done > coalesce(v_target,100000) then raise exception 'invalid progress'; end if;
  insert into public.assignment_progress(assignment_id,student_id,done,correct,completed_at,updated_at)
  values(p_assignment,v_uid,p_done,p_correct,case when p_done>=coalesce(v_target,100000) then now() else null end,now())
  on conflict(assignment_id,student_id) do update set done=excluded.done,correct=excluded.correct,completed_at=excluded.completed_at,updated_at=now();
end $$;

grant execute on function public.create_class(text) to authenticated;
grant execute on function public.create_class_invite(bigint,text,timestamptz,integer) to authenticated;
grant execute on function public.join_class_with_code(text) to authenticated;
grant execute on function public.update_assignment_progress(bigint,integer,integer) to authenticated;
revoke execute on function public.create_class(text) from anon;
revoke execute on function public.create_class_invite(bigint,text,timestamptz,integer) from anon;
revoke execute on function public.join_class_with_code(text) from anon;
revoke execute on function public.update_assignment_progress(bigint,integer,integer) from anon;
