-- Notify students and their assigned teachers whenever a course submission is created.
create or replace function public.notify_submission_event()
returns trigger language plpgsql security definer set search_path=public as $$
declare v_name text;
begin
  select coalesce(full_name,email) into v_name from profiles where id=new.student_id;
  insert into notifications(user_id,kind,title,body,link) values(new.student_id,'submission_received','Submission saved','Your work was submitted successfully.','#/review');
  insert into notifications(user_id,kind,title,body,link)
    select ts.teacher_id,'student_submission','New student submission',coalesce(v_name,'A student')||' submitted work for review.','#/audit'
    from teacher_students ts where ts.student_id=new.student_id;
  return new;
end $$;
drop trigger if exists submissions_notify_staff on public.submissions;
create trigger submissions_notify_staff after insert on public.submissions for each row execute function public.notify_submission_event();
revoke execute on function public.notify_submission_event() from public;
