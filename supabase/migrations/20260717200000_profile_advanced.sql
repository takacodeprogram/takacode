-- TakaCode - Profil avance : pays, derniere connexion, appareils, IP, desactivation de compte

-- 1. Ajout des colonnes a user_profiles
alter table public.user_profiles add column if not exists country_code text not null default '';
alter table public.user_profiles add column if not exists last_sign_in_at timestamptz;
alter table public.user_profiles add column if not exists ip_address text not null default '';

-- 2. Table des sessions/appareils connectes
create table if not exists public.user_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  device_name text not null default '',
  device_type text not null default '',
  browser text not null default '',
  os text not null default '',
  ip_address text not null default '',
  country_code text not null default '',
  is_current boolean not null default false,
  last_active_at timestamptz not null default timezone('utc'::text, now()),
  created_at timestamptz not null default timezone('utc'::text, now())
);

create index if not exists user_sessions_user_idx on public.user_sessions (user_id, last_active_at desc);

alter table public.user_sessions enable row level security;

drop policy if exists user_sessions_select_self on public.user_sessions;
create policy user_sessions_select_self on public.user_sessions
  for select to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists user_sessions_delete_self on public.user_sessions;
create policy user_sessions_delete_self on public.user_sessions
  for delete to authenticated
  using ((select auth.uid()) = user_id);

grant select, insert, update, delete on public.user_sessions to authenticated;

-- 3. RPC pour desactiver son compte
create or replace function public.deactivate_my_account()
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  update public.user_profiles
  set role = 'deactivated'
  where id = auth.uid();
end;
$$;

grant execute on function public.deactivate_my_account() to authenticated;

-- 4. RPC pour supprimer son compte (definitive)
create or replace function public.delete_my_account()
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_uid uuid := auth.uid();
begin
  delete from public.user_sessions where user_id = v_uid;
  delete from public.user_profiles where id = v_uid;
  delete from auth.users where id = v_uid;
end;
$$;

grant execute on function public.delete_my_account() to authenticated;

-- 5. Nouvelle signature de update_my_profile avec country_code
drop function if exists public.update_my_profile(text, jsonb, jsonb, text, text);
create or replace function public.update_my_profile(
  p_bio text,
  p_socials jsonb,
  p_skills jsonb,
  p_avatar_url text,
  p_public_name text,
  p_country_code text default ''
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
        country_code = v_country
  where id = v_user;

  return jsonb_build_object('ok', true);
end;
$$;

revoke all on function public.update_my_profile(text, jsonb, jsonb, text, text, text) from public;
grant execute on function public.update_my_profile(text, jsonb, jsonb, text, text, text) to authenticated;
-- obsolete 5-param signature is dropped above; grants are no-op if it doesn't exist
do $$ begin
  revoke all on function public.update_my_profile(text, jsonb, jsonb, text, text) from public;
exception when undefined_function then null;
end $$;
do $$ begin
  grant execute on function public.update_my_profile(text, jsonb, jsonb, text, text) to authenticated;
exception when undefined_function then null;
end $$;

-- 7. RPC pour lister ses sessions
create or replace function public.list_my_sessions()
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_result jsonb;
begin
  select coalesce(jsonb_agg(row order by last_active_at desc), '[]'::jsonb) into v_result
  from (
    select
      id,
      device_name,
      device_type,
      browser,
      os,
      ip_address,
      country_code,
      is_current,
      last_active_at,
      created_at
    from public.user_sessions
    where user_id = auth.uid()
  ) sessions;
  return v_result;
end;
$$;

grant execute on function public.list_my_sessions() to authenticated;

-- 6. RPC pour enregistrer une session
create or replace function public.upsert_my_session(
  p_device_name text,
  p_device_type text,
  p_browser text,
  p_os text,
  p_ip_address text,
  p_country_code text
)
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_uid uuid := auth.uid();
begin
  -- Marquer les anciennes comme non courantes
  update public.user_sessions set is_current = false where user_id = v_uid;

  -- Insérer la nouvelle session
  insert into public.user_sessions (user_id, device_name, device_type, browser, os, ip_address, country_code, is_current)
  values (v_uid, p_device_name, p_device_type, p_browser, p_os, p_ip_address, p_country_code, true);

  -- Nettoyer les sessions de plus de 30 jours
  delete from public.user_sessions
  where user_id = v_uid
    and created_at < timezone('utc'::text, now()) - interval '30 days';
end;
$$;

grant execute on function public.upsert_my_session(text, text, text, text, text, text) to authenticated;

-- 8. Mise a jour du RPC leaderboard pour inclure le pays
create or replace function public.public_leaderboard(p_limit integer default 50)
returns jsonb
language sql stable security definer
set search_path = public, pg_temp
as $$
  select coalesce(jsonb_agg(row), '[]'::jsonb)
  from (
    select jsonb_build_object(
      'rank', row_number() over (order by points desc, updated_at asc),
      'public_name', case when btrim(public_name) = '' then 'Membre anonyme' else public_name end,
      'points', points,
      'grade', grade,
      'avatar_url', avatar_url,
      'country_code', country_code
    ) as row
    from public.user_profiles
    where points > 0
      and lower(role) <> 'admin'
    order by points desc, updated_at asc
    limit greatest(1, least(coalesce(p_limit, 50), 100))
  ) ranked;
$$;
