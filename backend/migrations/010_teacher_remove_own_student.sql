-- Teachers may remove students from their own assigned list; they cannot add students or access other teachers' students.
create or replace function public.remove_my_student(p_student uuid)
returns void language plpgsql security definer set search_path=public as $$
begin
  if not is_teacher() then raise exception 'forbidden' using errcode='42501'; end if;
  delete from teacher_students where teacher_id=auth.uid() and student_id=p_student;
  insert into notifications(user_id,kind,title,body,link) values(p_student,'teacher_assignment_removed','Teacher assignment removed','Your teacher has removed you from their assigned students.','#/classroom');
  insert into audit_log(actor_id,actor_email,action,target_type,target_id,details) select auth.uid(),p.email,'remove_my_student','student',p_student::text,'{}'::jsonb from profiles p where p.id=auth.uid();
end $$;
revoke execute on function public.remove_my_student(uuid) from public;
grant execute on function public.remove_my_student(uuid) to authenticated;
