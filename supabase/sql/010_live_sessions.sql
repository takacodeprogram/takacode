-- TakaCode - Sessions live gerees depuis l'admin
-- Run this after 009_hide_empty_tracks.sql

create schema if not exists internal;
create extension if not exists pgcrypto;

create table if not exists public.live_sessions (
  id uuid primary key default gen_random_uuid(),
  track_id uuid references public.learning_tracks (id) on delete set null,
  title text not null,
  description text not null default '',
  scheduled_at timestamptz,
  duration_minutes integer not null default 60 check (duration_minutes > 0),
  join_url text not null default '',
  replay_url text not null default '',
  is_published boolean not null default true,
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now())
);

create index if not exists live_sessions_schedule_idx on public.live_sessions (scheduled_at);
create index if not exists live_sessions_published_idx on public.live_sessions (is_published);

-- internal.tg_set_updated_at() existe deja (004).
drop trigger if exists trg_live_sessions_updated_at on public.live_sessions;
create trigger trg_live_sessions_updated_at
before update on public.live_sessions
for each row
execute function internal.tg_set_updated_at();

alter table public.live_sessions enable row level security;

drop policy if exists live_sessions_public_read on public.live_sessions;
create policy live_sessions_public_read
on public.live_sessions
for select
to anon, authenticated
using (is_published = true);

drop policy if exists live_sessions_admin_all on public.live_sessions;
create policy live_sessions_admin_all
on public.live_sessions
for all
to authenticated
using (internal.is_admin((select auth.uid())))
with check (internal.is_admin((select auth.uid())));

grant select on public.live_sessions to anon, authenticated;
grant insert, update, delete on public.live_sessions to authenticated;
