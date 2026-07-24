-- TakaCode - Champs de profil editables par le membre (bio, reseaux, competences)
-- Run this after 006_platform_stats.sql
--
-- IMPORTANT securite: l'edition passe par une RPC security definer limitee aux
-- colonnes bio/socials/skills. On n'ajoute AUCUNE policy update "self" et on ne
-- donne AUCUN grant update de colonne a authenticated, pour eviter qu'un membre
-- puisse modifier son role ou ses points.

alter table public.user_profiles
  add column if not exists bio text not null default '',
  add column if not exists socials jsonb not null default '{}'::jsonb,
  add column if not exists skills jsonb not null default '[]'::jsonb;

alter table public.user_profiles
  drop constraint if exists user_profiles_socials_is_object;
alter table public.user_profiles
  add constraint user_profiles_socials_is_object check (jsonb_typeof(socials) = 'object');

alter table public.user_profiles
  drop constraint if exists user_profiles_skills_is_array;
alter table public.user_profiles
  add constraint user_profiles_skills_is_array check (jsonb_typeof(skills) = 'array');

create or replace function public.update_my_profile(
  p_bio text,
  p_socials jsonb,
  p_skills jsonb
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

  -- Limiter le nombre de competences.
  v_skills := coalesce((
    select jsonb_agg(value)
    from (
      select value
      from jsonb_array_elements(v_skills)
      where jsonb_typeof(value) = 'string'
      limit 20
    ) s
  ), '[]'::jsonb);

  update public.user_profiles
    set bio = v_bio,
        socials = v_socials,
        skills = v_skills
  where id = v_user;

  return jsonb_build_object('ok', true, 'bio', v_bio, 'socials', v_socials, 'skills', v_skills);
end;
$$;

revoke all on function public.update_my_profile(text, jsonb, jsonb) from public;
grant execute on function public.update_my_profile(text, jsonb, jsonb) to authenticated;
