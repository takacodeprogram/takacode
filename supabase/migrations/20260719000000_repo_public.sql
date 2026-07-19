-- Ajoute la possibilite de masquer le lien GitHub sur la page publique
alter table public.user_projects
  add column if not exists repo_is_public boolean not null default true;

-- Met a jour get_public_project pour inclure repo_is_public
create or replace function public.get_public_project(p_project_id uuid)
returns jsonb
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select jsonb_build_object(
    'id', p.id,
    'title', p.title,
    'description', p.description,
    'objective', p.objective,
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
    'author', case when btrim(up.public_name) = '' then 'Membre anonyme' else up.public_name end,
    'avatar_url', up.avatar_url,
    'author_grade', up.grade,
    'track', coalesce(t.title, ''),
    'track_slug', t.slug,
    'like_count', (select count(*)::integer from public.project_likes pl where pl.project_id = p.id),
    'description_format', p.description_format
  )
  from public.user_projects p
  join public.user_profiles up on up.id = p.user_id
  left join public.learning_tracks t on t.id = p.track_id
  where p.id = p_project_id and p.status = 'published';
$$;

grant execute on function public.get_public_project(uuid) to anon, authenticated;
