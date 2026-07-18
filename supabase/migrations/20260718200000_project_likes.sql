create table if not exists public.project_likes (
  user_id uuid not null references auth.users(id) on delete cascade,
  project_id uuid not null references public.user_projects(id) on delete cascade,
  created_at timestamptz not null default timezone('utc'::text, now()),
  primary key (user_id, project_id)
);

create index if not exists project_likes_project_idx on public.project_likes (project_id);
create index if not exists project_likes_user_idx on public.project_likes (user_id);

alter table public.project_likes enable row level security;

drop policy if exists project_likes_select on public.project_likes;
create policy project_likes_select on public.project_likes for select using (true);

drop policy if exists project_likes_insert on public.project_likes;
create policy project_likes_insert on public.project_likes for insert to authenticated with check ((select auth.uid()) = user_id);

drop policy if exists project_likes_delete on public.project_likes;
create policy project_likes_delete on public.project_likes for delete to authenticated using ((select auth.uid()) = user_id);

grant select on public.project_likes to anon, authenticated;
grant insert, delete on public.project_likes to authenticated;

-- Like count for a project
create or replace function public.get_project_likes_count(p_project_id uuid)
returns integer
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select count(*)::integer from public.project_likes where project_id = p_project_id;
$$;

grant execute on function public.get_project_likes_count(uuid) to anon, authenticated;

-- Array of project IDs liked by a user
create or replace function public.get_user_liked_projects(p_user_id uuid)
returns jsonb
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select coalesce(jsonb_agg(project_id), '[]'::jsonb)
  from public.project_likes
  where user_id = p_user_id;
$$;

grant execute on function public.get_user_liked_projects(uuid) to anon, authenticated;

-- Single published project with author info, like count
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
    'repo_url', p.repo_url,
    'live_url', p.live_url,
    'revenue_model', p.revenue_model,
    'template_id', p.template_id,
    'first_euro_at', p.first_euro_at,
    'has_declared_first_euro', p.has_declared_first_euro,
    'created_at', p.created_at,
    'updated_at', p.updated_at,
    'author_id', p.user_id,
    'author', case when btrim(up.public_name) = '' then 'Membre anonyme' else up.public_name end,
    'avatar_url', up.avatar_url,
    'author_grade', up.grade,
    'track', coalesce(t.title, ''),
    'track_slug', t.slug,
    'like_count', (select count(*)::integer from public.project_likes pl where pl.project_id = p.id)
  )
  from public.user_projects p
  join public.user_profiles up on up.id = p.user_id
  left join public.learning_tracks t on t.id = p.track_id
  where p.id = p_project_id and p.status = 'published';
$$;

grant execute on function public.get_public_project(uuid) to anon, authenticated;

-- Update community_projects to include project id, user_id, and like_count
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
        'repo_url', p.repo_url,
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

-- Update platform_stats to include like count
create or replace function public.platform_stats()
returns jsonb
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select jsonb_build_object(
    'members', (select count(*) from public.user_profiles),
    'completed_lessons', (select count(*) from public.user_lesson_progress where status = 'completed'),
    'submitted_projects', (select count(*) from public.user_projects where status = 'published'),
    'published_tracks', (select count(*) from public.learning_tracks where is_published = true),
    'total_likes', (select count(*) from public.project_likes)
  );
$$;

grant execute on function public.platform_stats() to anon, authenticated;
