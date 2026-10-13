-- Sprachtreppe LMS v2 Phase 3
-- Assignments, offline-friendly submissions, grading and teacher feedback.
-- Apply after backend/schema.sql, 001_lms_phase1.sql and 002_lms_phase2.sql.

begin;

create table if not exists public.assignments (
  id uuid primary key default gen_random_uuid(),
  class_id uuid not null references public.classes(id) on delete cascade,
  teacher_id uuid not null references public.profiles(id),
  title text not null check (char_length(trim(title)) between 1 and 200),
  description text not null default '' check (char_length(description) <= 10000),
  instructions text not null default '' check (char_length(instructions) <= 20000),
  type text not null default 'course_activity' check (type in ('text','mcq','true_false','fill_blank','vocabulary','grammar','reading','listening','course_activity')),
  course_ref jsonb not null default '{}'::jsonb,
  points integer not null default 100 check (points between 1 and 10000),
  due_at timestamptz,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint assignments_course_ref_object check (jsonb_typeof(course_ref) = 'object')
);
create index if not exists assignments_class_due_idx on public.assignments(class_id,due_at);
create index if not exists assignments_teacher_idx on public.assignments(teacher_id,created_at desc);
alter table public.assignments enable row level security;

create table if not exists public.assignment_submissions (
  id uuid primary key default gen_random_uuid(),
  assignment_id uuid not null references public.assignments(id) on delete cascade,
  student_id uuid not null references public.profiles(id) on delete cascade,
  client_submission_id text not null check (char_length(trim(client_submission_id)) between 8 and 160),
  answer jsonb not null default '{}'::jsonb,
  submitted_at timestamptz not null default now(),
  status text not null default 'submitted' check (status in ('draft','submitted','late','graded','returned')),
  score numeric(7,2),
  teacher_feedback text not null default '' check (char_length(teacher_feedback) <= 20000),
  graded_at timestamptz,
  graded_by uuid references public.profiles(id),
  updated_at timestamptz not null default now(),
  unique(assignment_id,student_id,client_submission_id),
  constraint assignment_submissions_answer_object check (jsonb_typeof(answer) = 'object'),
  constraint assignment_submissions_score_nonnegative check (score is null or score >= 0)
);
create index if not exists assignment_submissions_student_idx on public.assignment_submissions(student_id,submitted_at desc);
create index if not exists assignment_submissions_assignment_idx on public.assignment_submissions(assignment_id,submitted_at desc);
alter table public.assignment_submissions enable row level security;

create or replace function public.is_assignment_teacher(p_assignment_id uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select public.is_admin() or exists (
    select 1 from public.assignments a
    where a.id=p_assignment_id and (
      a.teacher_id=auth.uid() or public.is_class_teacher(a.class_id)
    )
  );
$$;

create or replace function public.is_assignment_student(p_assignment_id uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select public.is_admin() or exists (
    select 1 from public.assignments a
    where a.id=p_assignment_id and public.is_class_member(a.class_id)
  );
$$;

create or replace function public.create_assignment(
  p_class_id uuid,
  p_title text,
  p_description text default '',
  p_instructions text default '',
  p_type text default 'course_activity',
  p_course_ref jsonb default '{}'::jsonb,
  p_points integer default 100,
  p_due_at timestamptz default null,
  p_published boolean default false
) returns public.assignments
language plpgsql security definer set search_path = '' as $$
declare v_uid uuid:=auth.uid(); v_assignment public.assignments;
begin
  if v_uid is null or not public.is_class_teacher(p_class_id) then
    raise exception 'forbidden' using errcode='42501';
  end if;
  if p_type not in ('text','mcq','true_false','fill_blank','vocabulary','grammar','reading','listening','course_activity') then
    raise exception 'invalid assignment type' using errcode='22023';
  end if;
  if p_points is null or p_points<1 or p_points>10000 then
    raise exception 'invalid points' using errcode='22023';
  end if;
  insert into public.assignments(class_id,teacher_id,title,description,instructions,type,course_ref,points,due_at,published)
  values(p_class_id,v_uid,trim(p_title),left(coalesce(p_description,''),10000),left(coalesce(p_instructions,''),20000),p_type,coalesce(p_course_ref,'{}'::jsonb),p_points,p_due_at,coalesce(p_published,false))
  returning * into v_assignment;
  return v_assignment;
end $$;

create or replace function public.update_assignment(
  p_assignment_id uuid,
  p_title text,
  p_description text default '',
  p_instructions text default '',
  p_type text default 'course_activity',
  p_course_ref jsonb default '{}'::jsonb,
  p_points integer default 100,
  p_due_at timestamptz default null,
  p_published boolean default false
) returns public.assignments
language plpgsql security definer set search_path = '' as $$
declare v_assignment public.assignments;
begin
  if not public.is_assignment_teacher(p_assignment_id) then raise exception 'forbidden' using errcode='42501'; end if;
  if p_type not in ('text','mcq','true_false','fill_blank','vocabulary','grammar','reading','listening','course_activity') then raise exception 'invalid assignment type' using errcode='22023'; end if;
  if p_points is null or p_points<1 or p_points>10000 then raise exception 'invalid points' using errcode='22023'; end if;
  update public.assignments set
    title=trim(p_title),description=left(coalesce(p_description,''),10000),instructions=left(coalesce(p_instructions,''),20000),
    type=p_type,course_ref=coalesce(p_course_ref,'{}'::jsonb),points=p_points,due_at=p_due_at,published=coalesce(p_published,false),updated_at=now()
  where id=p_assignment_id returning * into v_assignment;
  return v_assignment;
end $$;

create or replace function public.list_my_assignments(p_include_unpublished boolean default false)
returns table(
  id uuid,class_id uuid,title text,description text,instructions text,type text,course_ref jsonb,points integer,due_at timestamptz,published boolean,created_at timestamptz,updated_at timestamptz,
  my_status text,my_score numeric,my_feedback text,my_submitted_at timestamptz
)
language sql stable security definer set search_path = '' as $$
  select a.id,a.class_id,a.title,a.description,a.instructions,a.type,a.course_ref,a.points,a.due_at,a.published,a.created_at,a.updated_at,
    coalesce(s.status,'missing') as my_status,s.score,coalesce(s.teacher_feedback,'') as my_feedback,s.submitted_at
  from public.assignments a
  join public.class_members cm on cm.class_id=a.class_id and cm.student_id=auth.uid() and cm.status='active'
  left join lateral (
    select x.status,x.score,x.teacher_feedback,x.submitted_at
    from public.assignment_submissions x
    where x.assignment_id=a.id and x.student_id=auth.uid()
    order by x.submitted_at desc limit 1
  ) s on true
  where (a.published or p_include_unpublished) and (a.published or public.is_class_teacher(a.class_id))
  order by a.due_at nulls last,a.created_at desc;
$$;

create or replace function public.list_class_assignments(p_class_id uuid)
returns setof public.assignments
language sql stable security definer set search_path = '' as $$
  select a.* from public.assignments a
  where a.class_id=p_class_id and public.is_class_teacher(p_class_id)
  order by a.due_at nulls last,a.created_at desc;
$$;

create or replace function public.submit_assignment(
  p_assignment_id uuid,
  p_client_submission_id text,
  p_answer jsonb
) returns public.assignment_submissions
language plpgsql security definer set search_path = '' as $$
declare v_uid uuid:=auth.uid(); v_assignment public.assignments; v_submission public.assignment_submissions;
begin
  if v_uid is null then raise exception 'not authenticated' using errcode='28000'; end if;
  select * into v_assignment from public.assignments where id=p_assignment_id and published;
  if not found then raise exception 'assignment unavailable' using errcode='42501'; end if;
  if not public.is_class_member(v_assignment.class_id) then raise exception 'not a class member' using errcode='42501'; end if;
  if p_client_submission_id is null or char_length(trim(p_client_submission_id)) not between 8 and 160 then raise exception 'invalid submission id' using errcode='22023'; end if;
  if p_answer is null or jsonb_typeof(p_answer)<>'object' then raise exception 'answer must be an object' using errcode='22023'; end if;
  if octet_length(p_answer::text)>500000 then raise exception 'answer too large' using errcode='22001'; end if;
  insert into public.assignment_submissions(assignment_id,student_id,client_submission_id,answer,status,submitted_at,updated_at)
  values(p_assignment_id,v_uid,trim(p_client_submission_id),p_answer,case when v_assignment.due_at is not null and now()>v_assignment.due_at then 'late' else 'submitted' end,now(),now())
  on conflict(assignment_id,student_id,client_submission_id) do update set answer=excluded.answer,status=excluded.status,submitted_at=excluded.submitted_at,updated_at=now()
  returning * into v_submission;
  return v_submission;
end $$;

create or replace function public.grade_assignment_submission(
  p_submission_id uuid,
  p_score numeric,
  p_feedback text default '',
  p_status text default 'graded'
) returns public.assignment_submissions
language plpgsql security definer set search_path = '' as $$
declare v_submission public.assignment_submissions; v_max integer; v_uid uuid:=auth.uid();
begin
  select s.*,a.points into v_submission,v_max from public.assignment_submissions s join public.assignments a on a.id=s.assignment_id where s.id=p_submission_id;
  if not found or not public.is_assignment_teacher(v_submission.assignment_id) then raise exception 'forbidden' using errcode='42501'; end if;
  if p_score is null or p_score<0 or p_score>v_max then raise exception 'score must be between 0 and assignment points' using errcode='22023'; end if;
  if p_status not in ('graded','returned') then raise exception 'invalid grading status' using errcode='22023'; end if;
  update public.assignment_submissions set score=p_score,teacher_feedback=left(coalesce(p_feedback,''),20000),status=p_status,graded_at=now(),graded_by=v_uid,updated_at=now()
  where id=p_submission_id returning * into v_submission;
  return v_submission;
end $$;

create or replace function public.list_assignment_submissions(p_assignment_id uuid)
returns setof public.assignment_submissions
language sql stable security definer set search_path = '' as $$
  select s.* from public.assignment_submissions s
  where s.assignment_id=p_assignment_id and public.is_assignment_teacher(p_assignment_id)
  order by s.submitted_at desc;
$$;

create or replace function public.student_assignment_stats(p_class_id uuid)
returns table(total bigint,submitted bigint,late bigint,graded bigint,missing bigint,average_score numeric)
language sql stable security definer set search_path = '' as $$
  with mine as (
    select a.id,a.points,s.status,s.score
    from public.assignments a
    left join lateral (
      select x.status,x.score from public.assignment_submissions x
      where x.assignment_id=a.id and x.student_id=auth.uid() order by x.submitted_at desc limit 1
    ) s on true
    where a.class_id=p_class_id and a.published and public.is_class_member(p_class_id)
  )
  select count(*),count(*) filter(where status in ('submitted','late','graded','returned')),count(*) filter(where status='late'),count(*) filter(where status in ('graded','returned')),count(*) filter(where status is null),avg((score/points)*100) from mine;
$$;

-- RLS -----------------------------------------------------------------------
drop policy if exists assignments_select on public.assignments;
create policy assignments_select on public.assignments for select to authenticated
  using(public.is_admin() or public.is_class_teacher(class_id) or (published and public.is_class_member(class_id)));

drop policy if exists assignment_submissions_select on public.assignment_submissions;
create policy assignment_submissions_select on public.assignment_submissions for select to authenticated
  using(public.is_admin() or student_id=auth.uid() or public.is_assignment_teacher(assignment_id));

revoke all on public.assignments,public.assignment_submissions from anon,authenticated;
grant select on public.assignments,public.assignment_submissions to authenticated;
revoke all on function public.is_assignment_teacher(uuid),public.is_assignment_student(uuid),public.create_assignment(uuid,text,text,text,text,jsonb,integer,timestamptz,boolean),public.update_assignment(uuid,text,text,text,text,jsonb,integer,timestamptz,boolean),public.list_my_assignments(boolean),public.list_class_assignments(uuid),public.submit_assignment(uuid,text,jsonb),public.grade_assignment_submission(uuid,numeric,text,text),public.list_assignment_submissions(uuid),public.student_assignment_stats(uuid) from public,anon;
grant execute on function public.is_assignment_teacher(uuid),public.is_assignment_student(uuid),public.create_assignment(uuid,text,text,text,text,jsonb,integer,timestamptz,boolean),public.update_assignment(uuid,text,text,text,text,jsonb,integer,timestamptz,boolean),public.list_my_assignments(boolean),public.list_class_assignments(uuid),public.submit_assignment(uuid,text,jsonb),public.grade_assignment_submission(uuid,numeric,text,text),public.list_assignment_submissions(uuid),public.student_assignment_stats(uuid) to authenticated;

commit;
