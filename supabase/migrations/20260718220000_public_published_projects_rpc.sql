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
        'track_id', p.track_id,
        'title', p.title,
        'description', p.description,
        'objective', p.objective,
        'status', p.status,
        'deadline', p.deadline,
        'repo_url', p.repo_url,
        'live_url', p.live_url,
        'revenue_model', p.revenue_model,
        'template_id', p.template_id,
        'first_euro_at', p.first_euro_at,
        'has_declared_first_euro', p.has_declared_first_euro,
        'created_at', p.created_at,
        'updated_at', p.updated_at,
        'track', jsonb_build_object(
          'title', t.title,
          'slug', t.slug
        )
      ) as item
    from public.user_projects p
    left join public.learning_tracks t on t.id = p.track_id
    where p.status = 'published'
    order by p.updated_at desc
    limit greatest(1, least(coalesce(p_limit, 50), 100))
  ) ranked;
$$;

grant execute on function public.get_published_projects(integer) to anon, authenticated;
