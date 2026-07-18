-- Ajoute description_format aux RPCs projets publies
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
        'author_id', p.user_id,
        'track_id', p.track_id,
        'title', p.title,
        'description', p.description,
        'description_format', p.description_format,
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
    'description_format', p.description_format,
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

-- RPC pour profil public (bypasse RLS pour les anonymes)
create or replace function public.get_public_profile(p_user_id uuid)
returns jsonb
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select jsonb_build_object(
    'id', up.id,
    'public_name', up.public_name,
    'avatar_url', up.avatar_url,
    'bio', up.bio,
    'bio_format', up.bio_format,
    'grade', up.grade,
    'points', up.points,
    'country_code', up.country_code,
    'socials', up.socials,
    'skills', up.skills,
    'created_at', up.created_at
  )
  from public.user_profiles up
  where up.id = p_user_id;
$$;

grant execute on function public.get_public_profile(uuid) to anon, authenticated;

-- Update update_my_profile to include bio_format
drop function if exists public.update_my_profile(text, jsonb, jsonb, text, text, text);
create or replace function public.update_my_profile(
  p_bio text,
  p_socials jsonb,
  p_skills jsonb,
  p_avatar_url text,
  p_public_name text,
  p_country_code text default '',
  p_bio_format text default 'text'
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
  v_country text := upper(left(btrim(coalesce(p_country_code, '')), 2));
  v_bio_format text := case when p_bio_format in ('text', 'markdown', 'html') then p_bio_format else 'text' end;
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
        public_name = v_public_name,
        country_code = v_country,
        bio_format = v_bio_format
  where id = v_user;

  return jsonb_build_object('ok', true);
end;
$$;

revoke all on function public.update_my_profile(text, jsonb, jsonb, text, text, text, text) from public;
grant execute on function public.update_my_profile(text, jsonb, jsonb, text, text, text, text) to authenticated;
