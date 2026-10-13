-- Sprachtreppe LMS v2 Phase 1
-- Additive migration: teacher role, classes, memberships, invitations and RLS.
-- Apply after backend/schema.sql.

begin;

-- Roles ---------------------------------------------------------------------
alter table public.profiles drop constraint if exists profiles_role_check;
alter table public.profiles add constraint profiles_role_check
  check (role in ('student','teacher','admin'));

create or replace function public.is_teacher() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.profiles p
    where p.id = auth.uid() and p.role in ('teacher','admin') and p.approved);
$$;

create or replace function public.admin_set_user_role(p_user_id uuid, p_role text)
returns public.profiles language plpgsql security definer set search_path = '' as $$
declare v_profile public.profiles;
begin
  if not public.is_admin() then raise exception 'forbidden' using errcode='42501'; end if;
  if p_role not in ('student','teacher','admin') then raise exception 'invalid role' using errcode='22023'; end if;
  update public.profiles set role=p_role,
    approved=case when p_role in ('teacher','admin') then true else approved end
    where id=p_user_id returning * into v_profile;
  if not found then raise exception 'user profile not found' using errcode='P0002'; end if;
  return v_profile;
end $$;

-- Classes -------------------------------------------------------------------
create table if not exists public.classes (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(trim(name)) between 1 and 120),
  description text not null default '' check (char_length(description) <= 4000),
  level text check (level in ('A1','A2','B1','mixed')),
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now(),
  archived_at timestamptz
);
create index if not exists classes_created_by_idx on public.classes(created_by);
alter table public.classes enable row level security;

create table if not exists public.class_teachers (
  class_id uuid not null references public.classes(id) on delete cascade,
  teacher_id uuid not null references public.profiles(id) on delete cascade,
  role text not null default 'teacher' check (role in ('owner','teacher')),
  joined_at timestamptz not null default now(),
  primary key (class_id,teacher_id)
);
create index if not exists class_teachers_teacher_idx on public.class_teachers(teacher_id,class_id);
alter table public.class_teachers enable row level security;

create table if not exists public.class_members (
  class_id uuid not null references public.classes(id) on delete cascade,
  student_id uuid not null references public.profiles(id) on delete cascade,
  status text not null default 'active' check (status in ('active','left','removed')),
  joined_at timestamptz not null default now(),
  left_at timestamptz,
  primary key (class_id,student_id)
);
create index if not exists class_members_student_idx on public.class_members(student_id,class_id);
alter table public.class_members enable row level security;

create table if not exists public.class_invites (
  id uuid primary key default gen_random_uuid(),
  class_id uuid not null references public.classes(id) on delete cascade,
  code_hash text not null unique,
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now(),
  expires_at timestamptz,
  max_uses integer check (max_uses is null or max_uses > 0),
  uses integer not null default 0 check (uses >= 0),
  revoked_at timestamptz
);
create index if not exists class_invites_class_idx on public.class_invites(class_id,created_at desc);
alter table public.class_invites enable row level security;

-- Authorization -------------------------------------------------------------
create or replace function public.is_class_teacher(p_class_id uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select public.is_admin() or exists (
    select 1 from public.class_teachers ct join public.profiles p on p.id=ct.teacher_id
    where ct.class_id=p_class_id and ct.teacher_id=auth.uid()
      and p.approved and p.role in ('teacher','admin'));
$$;

create or replace function public.is_class_member(p_class_id uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select public.is_admin() or exists (
    select 1 from public.class_members cm
    where cm.class_id=p_class_id and cm.student_id=auth.uid() and cm.status='active');
$$;

-- Class creation ------------------------------------------------------------
create or replace function public.create_class(p_name text,p_description text default '',p_level text default null)
returns public.classes language plpgsql security definer set search_path = '' as $$
declare v_uid uuid:=auth.uid(); v_class public.classes;
begin
  if v_uid is null or not public.is_teacher() then raise exception 'forbidden' using errcode='42501'; end if;
  if p_level is not null and p_level not in ('A1','A2','B1','mixed') then raise exception 'invalid level' using errcode='22023'; end if;
  insert into public.classes(name,description,level,created_by)
    values(trim(p_name),left(coalesce(p_description,''),4000),p_level,v_uid) returning * into v_class;
  insert into public.class_teachers(class_id,teacher_id,role) values(v_class.id,v_uid,'owner');
  return v_class;
end $$;

create or replace function public.add_class_teacher(p_class_id uuid,p_teacher_id uuid)
returns void language plpgsql security definer set search_path = '' as $$
begin
  if not public.is_class_teacher(p_class_id) then raise exception 'forbidden' using errcode='42501'; end if;
  if not exists(select 1 from public.profiles where id=p_teacher_id and approved and role in ('teacher','admin'))
    then raise exception 'user is not an approved teacher' using errcode='42501'; end if;
  insert into public.class_teachers(class_id,teacher_id,role) values(p_class_id,p_teacher_id,'teacher')
    on conflict (class_id,teacher_id) do nothing;
end $$;

-- Invitation codes ----------------------------------------------------------
create or replace function public.create_class_invite(p_class_id uuid,p_code text,p_expires_at timestamptz default null,p_max_uses integer default null)
returns public.class_invites language plpgsql security definer set search_path = '' as $$
declare v_uid uuid:=auth.uid(); v_invite public.class_invites; v_hash text;
begin
  if not public.is_class_teacher(p_class_id) then raise exception 'forbidden' using errcode='42501'; end if;
  if p_code is null or char_length(trim(p_code)) not between 6 and 64 then raise exception 'invalid class code' using errcode='22023'; end if;
  if p_max_uses is not null and p_max_uses<=0 then raise exception 'max uses must be positive' using errcode='22023'; end if;
  v_hash:=encode(extensions.digest(lower(trim(p_code)),'sha256'),'hex');
  insert into public.class_invites(class_id,code_hash,created_by,expires_at,max_uses)
    values(p_class_id,v_hash,v_uid,p_expires_at,p_max_uses) returning * into v_invite;
  return v_invite;
exception when unique_violation then raise exception 'class code already exists' using errcode='23505';
end $$;

create or replace function public.join_class_with_code(p_code text)
returns public.classes language plpgsql security definer set search_path = '' as $$
declare v_uid uuid:=auth.uid(); v_hash text; v_invite public.class_invites; v_class public.classes;
begin
  if v_uid is null then raise exception 'not authenticated' using errcode='28000'; end if;
  if not exists(select 1 from public.profiles where id=v_uid and approved and role='student')
    then raise exception 'only approved students can join classes' using errcode='42501'; end if;
  if p_code is null or char_length(trim(p_code)) not between 6 and 64 then raise exception 'invalid class code' using errcode='22023'; end if;
  v_hash:=encode(extensions.digest(lower(trim(p_code)),'sha256'),'hex');
  select * into v_invite from public.class_invites
    where code_hash=v_hash and revoked_at is null
      and (expires_at is null or expires_at>now())
      and (max_uses is null or uses<max_uses) for update;
  if not found then raise exception 'invalid or expired class code' using errcode='42501'; end if;
  select * into v_class from public.classes where id=v_invite.class_id and archived_at is null;
  if not found then raise exception 'class is unavailable' using errcode='42501'; end if;
  insert into public.class_members(class_id,student_id,status,left_at)
    values(v_class.id,v_uid,'active',null)
    on conflict(class_id,student_id) do update set status='active',left_at=null;
  update public.class_invites set uses=uses+1 where id=v_invite.id;
  return v_class;
end $$;

-- RLS -----------------------------------------------------------------------
drop policy if exists classes_select on public.classes;
create policy classes_select on public.classes for select to authenticated
  using(public.is_class_member(id) or public.is_class_teacher(id));
drop policy if exists classes_update on public.classes;
create policy classes_update on public.classes for update to authenticated
  using(public.is_class_teacher(id)) with check(public.is_class_teacher(id));

drop policy if exists class_teachers_select on public.class_teachers;
create policy class_teachers_select on public.class_teachers for select to authenticated
  using(public.is_admin() or teacher_id=auth.uid() or public.is_class_member(class_id) or public.is_class_teacher(class_id));

drop policy if exists class_members_select on public.class_members;
create policy class_members_select on public.class_members for select to authenticated
  using(public.is_admin() or student_id=auth.uid() or public.is_class_teacher(class_id));

drop policy if exists class_invites_select on public.class_invites;
create policy class_invites_select on public.class_invites for select to authenticated
  using(public.is_class_teacher(class_id));

-- Defense-in-depth grants ---------------------------------------------------
revoke all on public.classes,public.class_teachers,public.class_members,public.class_invites from anon,authenticated;
grant select,update on public.classes to authenticated;
grant select on public.class_teachers,public.class_members,public.class_invites to authenticated;
revoke all on function public.is_teacher(),public.admin_set_user_role(uuid,text),public.is_class_teacher(uuid),public.is_class_member(uuid),public.create_class(text,text,text),public.add_class_teacher(uuid,uuid),public.create_class_invite(uuid,text,timestamptz,integer),public.join_class_with_code(text) from public,anon;
grant execute on function public.is_teacher(),public.admin_set_user_role(uuid,text),public.is_class_teacher(uuid),public.is_class_member(uuid),public.create_class(text,text,text),public.add_class_teacher(uuid,uuid),public.create_class_invite(uuid,text,timestamptz,integer),public.join_class_with_code(text) to authenticated;

commit;

-- Requires pgcrypto enabled in Supabase because extensions.digest() is used.
