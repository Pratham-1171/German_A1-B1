-- Sprachtreppe LMS v2 Phase 2
-- Announcements, notification center, dashboard feed helpers and RLS.
-- Apply after backend/schema.sql and 001_lms_phase1.sql.

begin;

-- Announcements --------------------------------------------------------------
create table if not exists public.announcements (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.profiles(id) on delete cascade,
  class_id uuid references public.classes(id) on delete cascade,
  title text not null check (char_length(trim(title)) between 1 and 160),
  body text not null check (char_length(body) between 1 and 10000),
  priority text not null default 'normal' check (priority in ('low','normal','high','urgent')),
  published_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (expires_at is null or published_at is null or expires_at > published_at)
);
create index if not exists announcements_class_idx on public.announcements(class_id,published_at desc);
create index if not exists announcements_author_idx on public.announcements(author_id,created_at desc);
create index if not exists announcements_feed_idx on public.announcements(published_at desc,expires_at);
alter table public.announcements enable row level security;

-- Notification center --------------------------------------------------------
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  type text not null check (char_length(trim(type)) between 1 and 60),
  title text not null check (char_length(trim(title)) between 1 and 160),
  body text not null default '' check (char_length(body) <= 4000),
  related_id uuid,
  read_at timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists notifications_user_feed_idx on public.notifications(user_id,created_at desc);
create index if not exists notifications_unread_idx on public.notifications(user_id,read_at,created_at desc);
alter table public.notifications enable row level security;

-- Common timestamp trigger ---------------------------------------------------
create or replace function public.set_announcement_updated_at()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  new.updated_at := now();
  return new;
end $$;

drop trigger if exists announcements_updated_at on public.announcements;
create trigger announcements_updated_at
before update on public.announcements
for each row execute function public.set_announcement_updated_at();

-- Authorization helpers ------------------------------------------------------
create or replace function public.can_view_announcement(p_class_id uuid)
returns boolean language sql stable security definer set search_path = '' as $$
  select public.is_admin()
    or p_class_id is null
    or public.is_class_member(p_class_id)
    or public.is_class_teacher(p_class_id);
$$;

-- Announcement creation/editing ---------------------------------------------
create or replace function public.create_announcement(
  p_title text,
  p_body text,
  p_class_id uuid default null,
  p_priority text default 'normal',
  p_publish boolean default true,
  p_expires_at timestamptz default null
)
returns public.announcements
language plpgsql security definer set search_path = '' as $$
declare
  v_uid uuid := auth.uid();
  v_announcement public.announcements;
  v_published timestamptz;
begin
  if v_uid is null or not public.is_teacher() then
    raise exception 'forbidden' using errcode='42501';
  end if;
  if p_class_id is not null and not public.is_class_teacher(p_class_id) and not public.is_admin() then
    raise exception 'forbidden for this class' using errcode='42501';
  end if;
  if p_priority not in ('low','normal','high','urgent') then
    raise exception 'invalid priority' using errcode='22023';
  end if;
  if p_publish then v_published := now(); end if;
  insert into public.announcements(author_id,class_id,title,body,priority,published_at,expires_at)
    values(v_uid,p_class_id,trim(p_title),p_body,p_priority,v_published,p_expires_at)
    returning * into v_announcement;
  return v_announcement;
end $$;

create or replace function public.update_announcement(
  p_id uuid,
  p_title text,
  p_body text,
  p_priority text,
  p_published boolean,
  p_expires_at timestamptz
)
returns public.announcements
language plpgsql security definer set search_path = '' as $$
declare
  v_a public.announcements;
begin
  select * into v_a from public.announcements where id=p_id;
  if not found then raise exception 'announcement not found' using errcode='P0002'; end if;
  if not public.is_admin() and not public.is_class_teacher(v_a.class_id) then
    raise exception 'forbidden' using errcode='42501';
  end if;
  update public.announcements
    set title=trim(p_title), body=p_body, priority=p_priority,
        published_at=case when p_published then coalesce(published_at,now()) else null end,
        expires_at=p_expires_at
    where id=p_id returning * into v_a;
  return v_a;
end $$;

create or replace function public.delete_announcement(p_id uuid)
returns void language plpgsql security definer set search_path = '' as $$
declare v_class uuid;
begin
  select class_id into v_class from public.announcements where id=p_id;
  if not found then return; end if;
  if not public.is_admin() and not public.is_class_teacher(v_class) then
    raise exception 'forbidden' using errcode='42501';
  end if;
  delete from public.announcements where id=p_id;
end $$;

-- Notification delivery ------------------------------------------------------
create or replace function public.create_notification(
  p_user_id uuid,
  p_type text,
  p_title text,
  p_body text default '',
  p_related_id uuid default null
)
returns public.notifications
language plpgsql security definer set search_path = '' as $$
declare v_n public.notifications;
begin
  if not public.is_admin() and not public.is_teacher() then
    raise exception 'forbidden' using errcode='42501';
  end if;
  if p_user_id is null or not exists(select 1 from public.profiles where id=p_user_id) then
    raise exception 'user not found' using errcode='P0002';
  end if;
  insert into public.notifications(user_id,type,title,body,related_id)
    values(p_user_id,trim(p_type),trim(p_title),coalesce(p_body,''),p_related_id)
    returning * into v_n;
  return v_n;
end $$;

-- Create notifications for everyone in a class when publishing an announcement.
create or replace function public.notify_announcement(p_announcement_id uuid)
returns integer language plpgsql security definer set search_path = '' as $$
declare
  v_a public.announcements;
  v_count integer := 0;
begin
  select * into v_a from public.announcements where id=p_announcement_id;
  if not found then raise exception 'announcement not found' using errcode='P0002'; end if;
  if not public.is_admin() and not public.is_class_teacher(v_a.class_id) then
    raise exception 'forbidden' using errcode='42501';
  end if;
  if v_a.published_at is null then return 0; end if;

  if v_a.class_id is null then
    insert into public.notifications(user_id,type,title,body,related_id)
      select p.id,'announcement',v_a.title,v_a.body,v_a.id
      from public.profiles p
      where p.approved and p.id <> v_a.author_id
        and not exists(select 1 from public.notifications n where n.user_id=p.id and n.type='announcement' and n.related_id=v_a.id);
  else
    insert into public.notifications(user_id,type,title,body,related_id)
      select cm.student_id,'announcement',v_a.title,v_a.body,v_a.id
      from public.class_members cm
      where cm.class_id=v_a.class_id and cm.status='active'
        and cm.student_id <> v_a.author_id
        and not exists(select 1 from public.notifications n where n.user_id=cm.student_id and n.type='announcement' and n.related_id=v_a.id);
  end if;
  get diagnostics v_count = row_count;
  return v_count;
end $$;

-- Read helpers for mobile/offline dashboard ---------------------------------
create or replace function public.get_my_notifications(p_limit integer default 50)
returns setof public.notifications
language sql stable security definer set search_path = '' as $$
  select n.* from public.notifications n
  where n.user_id=auth.uid()
  order by n.created_at desc
  limit least(greatest(coalesce(p_limit,50),1),100);
$$;

create or replace function public.mark_notifications_read(p_ids uuid[] default null)
returns integer language plpgsql security definer set search_path = '' as $$
declare v_count integer;
begin
  if p_ids is null then
    update public.notifications set read_at=coalesce(read_at,now()) where user_id=auth.uid() and read_at is null;
  else
    update public.notifications set read_at=coalesce(read_at,now()) where user_id=auth.uid() and id=any(p_ids);
  end if;
  get diagnostics v_count=row_count;
  return v_count;
end $$;

create or replace function public.get_my_announcements(p_limit integer default 30)
returns setof public.announcements
language sql stable security definer set search_path = '' as $$
  select a.* from public.announcements a
  where a.published_at is not null
    and (a.expires_at is null or a.expires_at > now())
    and public.can_view_announcement(a.class_id)
  order by a.published_at desc
  limit least(greatest(coalesce(p_limit,30),1),100);
$$;

-- RLS -----------------------------------------------------------------------
drop policy if exists announcements_select on public.announcements;
create policy announcements_select on public.announcements for select to authenticated
  using(public.can_view_announcement(class_id));

drop policy if exists announcements_update on public.announcements;
create policy announcements_update on public.announcements for update to authenticated
  using(public.is_admin() or public.is_class_teacher(class_id))
  with check(public.is_admin() or public.is_class_teacher(class_id));

drop policy if exists announcements_delete on public.announcements;
create policy announcements_delete on public.announcements for delete to authenticated
  using(public.is_admin() or public.is_class_teacher(class_id));

drop policy if exists notifications_select on public.notifications;
create policy notifications_select on public.notifications for select to authenticated
  using(user_id=auth.uid() or public.is_admin());

drop policy if exists notifications_update on public.notifications;
create policy notifications_update on public.notifications for update to authenticated
  using(user_id=auth.uid() or public.is_admin())
  with check(user_id=auth.uid() or public.is_admin());

-- Defense-in-depth grants ---------------------------------------------------
revoke all on public.announcements,public.notifications from anon,authenticated;
grant select,update,delete on public.announcements to authenticated;
grant select,update on public.notifications to authenticated;
revoke all on function public.can_view_announcement(uuid),public.create_announcement(text,text,uuid,text,boolean,timestamptz),public.update_announcement(uuid,text,text,text,boolean,timestamptz),public.delete_announcement(uuid),public.create_notification(uuid,text,text,text,uuid),public.notify_announcement(uuid),public.get_my_notifications(integer),public.mark_notifications_read(uuid[]),public.get_my_announcements(integer) from public,anon;
grant execute on function public.can_view_announcement(uuid),public.create_announcement(text,text,uuid,text,boolean,timestamptz),public.update_announcement(uuid,text,text,text,boolean,timestamptz),public.delete_announcement(uuid),public.create_notification(uuid,text,text,text,uuid),public.notify_announcement(uuid),public.get_my_notifications(integer),public.mark_notifications_read(uuid[]),public.get_my_announcements(integer) to authenticated;

commit;
