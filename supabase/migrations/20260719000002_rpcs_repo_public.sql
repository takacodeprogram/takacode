-- Update community_projects to filter repo_url based on repo_is_public
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
        'id', p.id,
        'user_id', p.user_id,
        'title', p.title,
        'description', p.description,
        'objective', p.objective,
        'live_url', p.live_url,
        'repo_url', case when p.repo_is_public then p.repo_url else '' end,
        'repo_is_public', p.repo_is_public,
        'author', case when btrim(up.public_name) = '' then 'Membre anonyme' else up.public_name end,
        'avatar_url', up.avatar_url,
        'author_id', up.id,
        'track', coalesce(t.title, ''),
        'first_euro_at', p.first_euro_at,
        'has_declared_first_euro', p.has_declared_first_euro,
        'like_count', (select count(*)::integer from public.project_likes pl where pl.project_id = p.id)
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

-- Also update get_published_projects to filter repo_url
create or replace function public.get_published_projects(p_limit integer default 50)
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
        'id', p.id,
        'title', p.title,
        'objective', p.objective,
        'description', p.description,
        'description_format', p.description_format,
        'status', p.status,
        'deadline', p.deadline,
        'repo_url', case when p.repo_is_public then p.repo_url else '' end,
        'live_url', p.live_url,
        'revenue_model', p.revenue_model,
        'template_id', p.template_id,
        'first_euro_at', p.first_euro_at,
        'has_declared_first_euro', p.has_declared_first_euro,
        'repo_is_public', p.repo_is_public,
        'created_at', p.created_at,
        'updated_at', p.updated_at,
        'author_id', p.user_id,
        'track_id', p.track_id,
        'track_title', coalesce(t.title, ''),
        'track_slug', t.slug,
        'like_count', (select count(*)::integer from public.project_likes pl where pl.project_id = p.id)
      ) as item
    from public.user_projects p
    left join public.learning_tracks t on t.id = p.track_id
    where p.status = 'published'
    order by p.updated_at desc
    limit greatest(1, least(coalesce(p_limit, 50), 100))
  ) ranked;
$$;

revoke all on function public.get_published_projects(integer) from public;
grant execute on function public.get_published_projects(integer) to anon, authenticated;
