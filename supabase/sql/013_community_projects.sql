-- TakaCode - Projets publies visibles dans la communaute (donnees reelles)
-- Run this after 012_profile_public.sql
--
-- Expose les projets dont le membre a choisi le statut "published", avec un
-- auteur non nominatif (pseudo public + avatar). Aucune donnee sensible.

create schema if not exists internal;

create or replace function public.community_projects(p_limit integer default 24)
returns jsonb
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select coalesce(jsonb_agg(item order by updated_at desc), '[]'::jsonb)
  from (
    select
      p.updated_at,
      jsonb_build_object(
        'title', p.title,
        'description', p.description,
        'objective', p.objective,
        'live_url', p.live_url,
        'repo_url', p.repo_url,
        'author', case when btrim(up.public_name) = '' then 'Membre anonyme' else up.public_name end,
        'avatar_url', up.avatar_url,
        'track', coalesce(t.title, '')
      ) as item
    from public.user_projects p
    join public.user_profiles up on up.id = p.user_id
    left join public.learning_tracks t on t.id = p.track_id
    where p.status = 'published'
    order by p.updated_at desc
    limit greatest(1, least(coalesce(p_limit, 24), 60))
  ) ranked;
$$;

revoke all on function public.community_projects(integer) from public;
grant execute on function public.community_projects(integer) to anon, authenticated;
