-- TakaCode - Roles, gamification (points/grades) and referral system
-- Apply this file in Supabase SQL Editor (or migration tool) before using admin pages.

create schema if not exists internal;
create extension if not exists pgcrypto;

create table if not exists public.user_profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role text not null default 'user' check (role in ('user', 'mentor', 'admin')),
  points integer not null default 0 check (points >= 0),
  grade text not null default 'Starter',
  referral_code text unique,
  referred_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now())
);

create table if not exists public.referral_events (
  id bigint generated always as identity primary key,
  referrer_id uuid not null references auth.users (id) on delete cascade,
  referred_id uuid not null references auth.users (id) on delete cascade,
  points_awarded integer not null check (points_awarded > 0),
  reason text not null default 'signup_referral',
  created_at timestamptz not null default timezone('utc'::text, now()),
  unique (referrer_id, referred_id, reason)
);

create index if not exists user_profiles_points_idx on public.user_profiles (points desc);
create index if not exists user_profiles_role_idx on public.user_profiles (role);
create index if not exists user_profiles_referral_code_idx on public.user_profiles (referral_code);
create index if not exists user_profiles_referred_by_idx on public.user_profiles (referred_by);
create index if not exists referral_events_referrer_idx on public.referral_events (referrer_id);
create index if not exists referral_events_referred_idx on public.referral_events (referred_id);

create or replace function internal.compute_grade(p_points integer)
returns text
language sql
immutable
as $$
  select case
    when coalesce(p_points, 0) >= 3000 then 'Legend'
    when coalesce(p_points, 0) >= 1500 then 'Master'
    when coalesce(p_points, 0) >= 700 then 'Builder'
    when coalesce(p_points, 0) >= 250 then 'Starter+'
    else 'Starter'
  end;
$$;

create or replace function internal.generate_referral_code()
returns text
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  candidate text;
begin
  loop
    candidate := upper(substr(encode(gen_random_bytes(6), 'hex'), 1, 10));
    exit when not exists (
      select 1
      from public.user_profiles p
      where p.referral_code = candidate
    );
  end loop;

  return candidate;
end;
$$;

revoke all on function internal.generate_referral_code() from public;

create or replace function internal.tg_user_profiles_derive_fields()
returns trigger
language plpgsql
security definer
set search_path = public, internal, pg_temp
as $$
begin
  if tg_op = 'INSERT' then
    new.points := greatest(coalesce(new.points, 0), 0);
    new.referral_code := coalesce(nullif(trim(new.referral_code), ''), internal.generate_referral_code());
    new.created_at := coalesce(new.created_at, timezone('utc'::text, now()));
  else
    new.points := greatest(coalesce(new.points, old.points), 0);

    if new.referral_code is null or btrim(new.referral_code) = '' then
      new.referral_code := old.referral_code;
    end if;
  end if;

  new.grade := internal.compute_grade(new.points);
  new.updated_at := timezone('utc'::text, now());

  return new;
end;
$$;

revoke all on function internal.tg_user_profiles_derive_fields() from public;

drop trigger if exists trg_user_profiles_derive_fields on public.user_profiles;
create trigger trg_user_profiles_derive_fields
before insert or update on public.user_profiles
for each row
execute function internal.tg_user_profiles_derive_fields();

create or replace function internal.is_admin(p_user_id uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select exists (
    select 1
    from public.user_profiles p
    where p.id = p_user_id
      and p.role = 'admin'
  );
$$;

revoke all on function internal.is_admin(uuid) from public;
grant usage on schema internal to authenticated;
grant execute on function internal.is_admin(uuid) to authenticated;

create or replace function internal.tg_auth_users_set_default_role()
returns trigger
language plpgsql
security definer
set search_path = auth, pg_temp
as $$
begin
  new.raw_app_meta_data := coalesce(new.raw_app_meta_data, '{}'::jsonb);

  if coalesce(new.raw_app_meta_data ->> 'role', '') = '' then
    new.raw_app_meta_data := new.raw_app_meta_data || jsonb_build_object('role', 'user');
  end if;

  return new;
end;
$$;

revoke all on function internal.tg_auth_users_set_default_role() from public;

drop trigger if exists trg_auth_users_set_default_role on auth.users;
create trigger trg_auth_users_set_default_role
before insert on auth.users
for each row
execute function internal.tg_auth_users_set_default_role();

create or replace function internal.tg_auth_users_create_profile()
returns trigger
language plpgsql
security definer
set search_path = public, auth, internal, pg_temp
as $$
declare
  incoming_referral_code text;
  matched_referrer uuid;
begin
  incoming_referral_code := nullif(trim(coalesce(new.raw_user_meta_data ->> 'referral_code', '')), '');

  if incoming_referral_code is not null then
    select p.id
      into matched_referrer
    from public.user_profiles p
    where p.referral_code = upper(incoming_referral_code)
    limit 1;
  end if;

  insert into public.user_profiles (id, role, points, referred_by)
  values (
    new.id,
    coalesce(nullif(new.raw_app_meta_data ->> 'role', ''), 'user'),
    0,
    matched_referrer
  )
  on conflict (id) do update
    set referred_by = coalesce(public.user_profiles.referred_by, excluded.referred_by);

  if matched_referrer is not null and matched_referrer <> new.id then
    update public.user_profiles p
      set points = p.points + 100
    where p.id = matched_referrer;

    insert into public.referral_events (referrer_id, referred_id, points_awarded, reason)
    values (matched_referrer, new.id, 100, 'signup_referral')
    on conflict (referrer_id, referred_id, reason) do nothing;
  end if;

  return new;
end;
$$;

revoke all on function internal.tg_auth_users_create_profile() from public;

drop trigger if exists trg_auth_users_create_profile on auth.users;
create trigger trg_auth_users_create_profile
after insert on auth.users
for each row
execute function internal.tg_auth_users_create_profile();

insert into public.user_profiles (id, role, points)
select
  u.id,
  coalesce(nullif(u.raw_app_meta_data ->> 'role', ''), 'user') as role,
  0 as points
from auth.users u
on conflict (id) do nothing;

update auth.users u
set raw_app_meta_data = coalesce(u.raw_app_meta_data, '{}'::jsonb) || jsonb_build_object('role', 'user')
where coalesce(u.raw_app_meta_data ->> 'role', '') = '';

alter table public.user_profiles enable row level security;
alter table public.referral_events enable row level security;

drop policy if exists user_profiles_select_self_or_admin on public.user_profiles;
create policy user_profiles_select_self_or_admin
on public.user_profiles
for select
to authenticated
using ((select auth.uid()) = id or internal.is_admin((select auth.uid())));

drop policy if exists user_profiles_admin_update on public.user_profiles;
create policy user_profiles_admin_update
on public.user_profiles
for update
to authenticated
using (internal.is_admin((select auth.uid())))
with check (internal.is_admin((select auth.uid())));

drop policy if exists user_profiles_admin_insert on public.user_profiles;
create policy user_profiles_admin_insert
on public.user_profiles
for insert
to authenticated
with check (internal.is_admin((select auth.uid())));

drop policy if exists user_profiles_admin_delete on public.user_profiles;
create policy user_profiles_admin_delete
on public.user_profiles
for delete
to authenticated
using (internal.is_admin((select auth.uid())));

drop policy if exists referral_events_select_owner_or_admin on public.referral_events;
create policy referral_events_select_owner_or_admin
on public.referral_events
for select
to authenticated
using (
  (select auth.uid()) = referrer_id
  or (select auth.uid()) = referred_id
  or internal.is_admin((select auth.uid()))
);

grant select on public.user_profiles to authenticated;
grant update (role, points) on public.user_profiles to authenticated;
grant select on public.referral_events to authenticated;
