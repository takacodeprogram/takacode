-- TakaCode - Avatar, pseudo public et leaderboard public
-- Run this after 011_role_management.sql

create schema if not exists internal;

alter table public.user_profiles
  add column if not exists avatar_url text not null default '',
  add column if not exists public_name text not null default '';

-- Etend l'edition de profil self (bio/socials/skills + avatar + pseudo public).
-- Toujours en security definer, limite aux colonnes non sensibles.
create or replace function public.update_my_profile(
  p_bio text,
  p_socials jsonb,
  p_skills jsonb,
  p_avatar_url text,
  p_public_name text
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_user uuid := auth.uid();
  v_bio text := left(btrim(coalesce(p_bio, '')), 600);
  v_socials jsonb := coalesce(p_socials, '{}'::jsonb);
  v_skills jsonb := coalesce(p_skills, '[]'::jsonb);
  v_avatar text := btrim(coalesce(p_avatar_url, ''));
  v_public_name text := left(btrim(coalesce(p_public_name, '')), 40);
begin
  if v_user is null then
    return jsonb_build_object('error', 'not_authenticated');
  end if;

  if jsonb_typeof(v_socials) <> 'object' then
    v_socials := '{}'::jsonb;
  end if;
  if jsonb_typeof(v_skills) <> 'array' then
    v_skills := '[]'::jsonb;
  end if;

  -- avatar: uniquement une URL https (ou vide).
  if v_avatar <> '' and v_avatar !~* '^https://' then
    v_avatar := '';
  end if;
  v_avatar := left(v_avatar, 500);

  v_skills := coalesce((
    select jsonb_agg(value)
    from (
      select value from jsonb_array_elements(v_skills)
      where jsonb_typeof(value) = 'string'
      limit 20
    ) s
  ), '[]'::jsonb);

  update public.user_profiles
    set bio = v_bio,
        socials = v_socials,
        skills = v_skills,
        avatar_url = v_avatar,
        public_name = v_public_name
  where id = v_user;

  return jsonb_build_object('ok', true);
end;
$$;

revoke all on function public.update_my_profile(text, jsonb, jsonb, text, text) from public;
grant execute on function public.update_my_profile(text, jsonb, jsonb, text, text) to authenticated;

-- Ancienne signature (3 params) devenue obsolete.
drop function if exists public.update_my_profile(text, jsonb, jsonb);

-- Leaderboard PUBLIC: uniquement des champs non sensibles (aucun email/vrai nom/id).
-- Les admins sont exclus du classement public.
create or replace function public.public_leaderboard(p_limit integer default 50)
returns jsonb
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select coalesce(jsonb_agg(row), '[]'::jsonb)
  from (
    select jsonb_build_object(
      'rank', row_number() over (order by points desc, updated_at asc),
      'public_name', case when btrim(public_name) = '' then 'Membre anonyme' else public_name end,
      'points', points,
      'grade', grade,
      'avatar_url', avatar_url
    ) as row
    from public.user_profiles
    where points > 0
      and lower(role) <> 'admin'
    order by points desc, updated_at asc
    limit greatest(1, least(coalesce(p_limit, 50), 100))
  ) ranked;
$$;

revoke all on function public.public_leaderboard(integer) from public;
grant execute on function public.public_leaderboard(integer) to anon, authenticated;
