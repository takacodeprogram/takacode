-- V1.1.1: close privileged RPCs that were explicitly exposed to anon.
revoke execute on function public.admin_set_user_role(uuid, text) from public, anon;
revoke execute on function public.admin_validate_track(uuid, boolean) from public, anon;
revoke execute on function public.count_unread_notifications() from public, anon;
revoke execute on function public.create_notification(uuid, text, text, text, text) from public, anon;
revoke execute on function public.generate_review_pending_notifications() from public, anon, authenticated;
revoke execute on function public.list_notifications(integer) from public, anon;
revoke execute on function public.list_review_history(integer) from public, anon;
revoke execute on function public.list_review_queue(integer) from public, anon;
revoke execute on function public.mark_all_notifications_read() from public, anon;
revoke execute on function public.mark_notification_read(uuid) from public, anon;
revoke execute on function public.submit_ai_review(uuid, uuid, text, text) from public, anon, authenticated;
revoke execute on function public.submit_lesson_project(uuid, text) from public, anon;
revoke execute on function public.submit_lesson_quiz(uuid, jsonb) from public, anon;
revoke execute on function public.submit_project_review(uuid, uuid, text, text) from public, anon;
revoke execute on function public.update_my_profile(text, jsonb, jsonb, text, text) from public, anon;
revoke execute on function public.rls_auto_enable() from public, anon, authenticated, service_role;

grant execute on function public.submit_ai_review(uuid, uuid, text, text) to service_role;
grant execute on function public.generate_review_pending_notifications() to service_role;

create or replace function public.create_notification(
  p_user_id uuid,
  p_type text,
  p_title text,
  p_body text default '',
  p_link text default ''
)
returns jsonb
language plpgsql
security definer
set search_path = public, internal, pg_temp
as $$
declare
  v_caller uuid := auth.uid();
begin
  -- A null caller can only be service_role because PUBLIC and anon cannot
  -- execute this function. Authenticated users may notify themselves, while
  -- admins retain cross-user moderation/support workflows.
  if v_caller is not null
     and p_user_id <> v_caller
     and not internal.is_admin(v_caller) then
    return jsonb_build_object('error', 'forbidden');
  end if;

  insert into public.notifications (user_id, type, title, body, link)
  values (
    p_user_id,
    p_type,
    left(btrim(coalesce(p_title, '')), 200),
    left(btrim(coalesce(p_body, '')), 2000),
    left(btrim(coalesce(p_link, '')), 500)
  );

  return jsonb_build_object('ok', true);
end;
$$;

revoke execute on function public.create_notification(uuid, text, text, text, text) from public, anon;
grant execute on function public.create_notification(uuid, text, text, text, text) to authenticated, service_role;

alter function internal.compute_grade(integer) set search_path = '';
alter function internal.ai_reviewer_id() set search_path = '';
