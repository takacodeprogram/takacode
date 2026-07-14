-- TakaCode - Compteurs agreges publics (real data pour les pages guest + admin)
-- Run this after 005_seed_mvp_curriculum.sql
--
-- Expose uniquement des COMPTEURS (aucune donnee personnelle). En security definer
-- pour contourner proprement les RLS (un invite ne peut pas compter user_profiles),
-- tout en ne renvoyant que des nombres.

create schema if not exists internal;

create or replace function public.platform_stats()
returns jsonb
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select jsonb_build_object(
    'members', (select count(*) from public.user_profiles),
    'published_tracks', (
      select count(*) from public.learning_tracks
      where is_published = true and is_active = true
    ),
    'total_modules', (
      select count(*) from public.track_modules m
      join public.learning_tracks t on t.id = m.track_id
      where m.is_published = true and t.is_published = true and t.is_active = true
    ),
    'total_lessons', (
      select count(*) from public.track_lessons l
      join public.track_modules m on m.id = l.module_id
      join public.learning_tracks t on t.id = m.track_id
      where l.is_published = true and m.is_published = true
        and t.is_published = true and t.is_active = true
    ),
    'completed_lessons', (
      select count(*) from public.user_lesson_progress
      where status = 'completed'
    ),
    'submitted_projects', (
      select count(*) from public.user_lesson_progress
      where project_submitted_at is not null
    )
  );
$$;

revoke all on function public.platform_stats() from public;
grant execute on function public.platform_stats() to anon, authenticated;
