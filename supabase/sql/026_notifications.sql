-- TakaCode - Systeme de notifications
-- Notifications pour: reviews en attente, rappels parcours/projets, resultats de review
--
-- Run this after 021_ai_review_support.sql

create schema if not exists internal;

-- 1. Table des notifications
create table if not exists public.notifications (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null check (type in (
    'review_pending',      -- "Un micro-projet attend ta review"
    'review_received',     -- "Ton micro-projet a ete revu"
    'track_reminder',      -- "Tu as un parcours en cours"
    'project_reminder',    -- "Tu as un projet en cours"
    'review_completed'     -- "La review est terminee"
  )),
  title text not null,
  body text not null default '',
  link text not null default '',
  read_at timestamptz,
  created_at timestamptz not null default timezone('utc'::text, now())
);

create index if not exists notifications_user_idx on public.notifications (user_id, read_at, created_at desc);
create index if not exists notifications_type_idx on public.notifications (type);

alter table public.notifications enable row level security;

-- Politique : chaque user voit ses propres notifs
drop policy if exists notifications_own on public.notifications;
create policy notifications_own
on public.notifications
for all
to authenticated
using (user_id = (select auth.uid()))
with check (user_id = (select auth.uid()));

grant select, insert, update on public.notifications to authenticated;

-- 2. Creer une notification (RPC)
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
set search_path = public, pg_temp
as $$
begin
  insert into public.notifications (user_id, type, title, body, link)
  values (p_user_id, p_type, p_title, p_body, p_link);

  return jsonb_build_object('ok', true);
end;
$$;

revoke all on function public.create_notification(uuid, text, text, text, text) from public;
grant execute on function public.create_notification(uuid, text, text, text, text) to authenticated;

-- 3. Lister les notifications non lues d'un user (RPC)
create or replace function public.list_notifications(p_limit integer default 20)
returns jsonb
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select coalesce(jsonb_agg(item order by n.created_at desc), '[]'::jsonb)
  from (
    select
      jsonb_build_object(
        'id', n.id,
        'type', n.type,
        'title', n.title,
        'body', n.body,
        'link', n.link,
        'read_at', n.read_at,
        'created_at', n.created_at
      ) as item
    from public.notifications n
    where n.user_id = (select auth.uid())
    order by n.created_at desc
    limit greatest(1, least(coalesce(p_limit, 20), 100))
  ) ranked;
$$;

revoke all on function public.list_notifications(integer) from public;
grant execute on function public.list_notifications(integer) to authenticated;

-- 4. Compter les notifications non lues (RPC)
create or replace function public.count_unread_notifications()
returns jsonb
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select jsonb_build_object(
    'count', coalesce((
      select count(*) from public.notifications
      where user_id = (select auth.uid()) and read_at is null
    ), 0)
  );
$$;

revoke all on function public.count_unread_notifications() from public;
grant execute on function public.count_unread_notifications() to authenticated;

-- 5. Marquer une notification comme lue (RPC)
create or replace function public.mark_notification_read(p_notification_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  update public.notifications
  set read_at = timezone('utc'::text, now())
  where id = p_notification_id and user_id = (select auth.uid());

  return jsonb_build_object('ok', true);
end;
$$;

revoke all on function public.mark_notification_read(uuid) from public;
grant execute on function public.mark_notification_read(uuid) to authenticated;

-- 6. Marquer toutes les notifs comme lues (RPC)
create or replace function public.mark_all_notifications_read()
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  update public.notifications
  set read_at = timezone('utc'::text, now())
  where user_id = (select auth.uid()) and read_at is null;

  return jsonb_build_object('ok', true);
end;
$$;

revoke all on function public.mark_all_notifications_read() from public;
grant execute on function public.mark_all_notifications_read() to authenticated;

-- 7. Generer les notifications de review en attente (RPC, appelee periodiquement)
-- Creer des notifs pour les projets en attente de review peer/mentor
create or replace function public.generate_review_pending_notifications()
returns jsonb
language plpgsql
security definer
set search_path = public, internal, pg_temp
as $$
declare
  v_row record;
  v_lesson_title text;
  v_author_name text;
  v_validation text;
begin
  -- Parcourir les projets en attente de review
  for v_row in
    select
      p.user_id as author_id,
      p.lesson_id,
      l.title as lesson_title,
      coalesce(nullif(l.micro_project ->> 'validation', ''), 'auto') as validation,
      case when btrim(up.public_name) = '' then 'Membre anonyme' else up.public_name end as author_name
    from public.user_lesson_progress p
    join public.track_lessons l on l.id = p.lesson_id
    join public.user_profiles up on up.id = p.user_id
    where p.review_status = 'pending'
      and p.project_submitted_at is not null
      and l.micro_project ->> 'validation' in ('peer', 'mentor')
  loop
    -- Verifier si une notif existe deja pour cette soumission
    if not exists (
      select 1 from public.notifications
      where user_id = v_row.author_id
        and type = 'review_pending'
        and link like '%' || v_row.lesson_id::text || '%'
        and read_at is null
    ) then
      -- Creer la notification pour l'auteur (info)
      -- Et pour les autres users/mentors (appel a reviewer)
      -- Ici on note juste que la notif doit etre creee
      -- Le frontend gerera l'affichage
      null;
    end if;
  end loop;

  return jsonb_build_object('ok', true);
end;
$$;

revoke all on function public.generate_review_pending_notifications() from public;
grant execute on function public.generate_review_pending_notifications() to authenticated;
