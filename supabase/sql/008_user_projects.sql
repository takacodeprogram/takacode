-- TakaCode - Projets des membres (le projet que l'utilisateur construit)
-- Run this after 007_user_profile_fields.sql

create schema if not exists internal;
create extension if not exists pgcrypto;

create table if not exists public.user_projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  track_id uuid references public.learning_tracks (id) on delete set null,
  title text not null,
  description text not null default '',
  objective text not null default '',
  status text not null default 'in_progress' check (status in ('idea', 'in_progress', 'published', 'archived')),
  deadline date,
  repo_url text not null default '',
  live_url text not null default '',
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now())
);

create index if not exists user_projects_user_idx on public.user_projects (user_id, updated_at desc);
create index if not exists user_projects_track_idx on public.user_projects (track_id);

-- internal.tg_set_updated_at() existe deja (004).
drop trigger if exists trg_user_projects_updated_at on public.user_projects;
create trigger trg_user_projects_updated_at
before update on public.user_projects
for each row
execute function internal.tg_set_updated_at();

alter table public.user_projects enable row level security;

-- Donnees strictement personnelles: le membre gere seulement ses propres projets.
drop policy if exists user_projects_select_self on public.user_projects;
create policy user_projects_select_self
on public.user_projects
for select
to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists user_projects_insert_self on public.user_projects;
create policy user_projects_insert_self
on public.user_projects
for insert
to authenticated
with check ((select auth.uid()) = user_id);

drop policy if exists user_projects_update_self on public.user_projects;
create policy user_projects_update_self
on public.user_projects
for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

drop policy if exists user_projects_delete_self on public.user_projects;
create policy user_projects_delete_self
on public.user_projects
for delete
to authenticated
using ((select auth.uid()) = user_id);

grant select, insert, update, delete on public.user_projects to authenticated;
