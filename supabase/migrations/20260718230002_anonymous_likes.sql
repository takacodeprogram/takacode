-- Permet aux utilisateurs non connectes de liker (suivi par cookie + IP)
alter table public.project_likes
  drop constraint if exists project_likes_pkey,
  alter column user_id drop not null,
  add column visitor_id text;

alter table public.project_likes
  add constraint project_likes_owner_check
    check (user_id is not null or visitor_id is not null);

create unique index if not exists project_likes_user_project_idx
  on public.project_likes (project_id, user_id) where user_id is not null;

create unique index if not exists project_likes_visitor_project_idx
  on public.project_likes (project_id, visitor_id) where visitor_id is not null;

-- Table pour enregistrer les visiteurs anonymes (cookie + IP)
create table if not exists public.project_visitors (
  visitor_id text primary key,
  ip_address text,
  user_agent text,
  created_at timestamptz not null default timezone('utc'::text, now()),
  last_seen_at timestamptz not null default timezone('utc'::text, now())
);

alter table public.project_visitors enable row level security;

drop policy if exists project_visitors_insert on public.project_visitors;
create policy project_visitors_insert on public.project_visitors
  for insert to anon, authenticated
  with check (true);

drop policy if exists project_visitors_select on public.project_visitors;
create policy project_visitors_select on public.project_visitors
  for select using (true);

grant select, insert on public.project_visitors to anon, authenticated;

-- Mettre a jour les RPCs pour compter les likes anonymes aussi
create or replace function public.get_project_likes_count(p_project_id uuid)
returns integer
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select count(*)::integer from public.project_likes where project_id = p_project_id;
$$;

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

create or replace function public.get_visitor_liked_projects(p_visitor_id text)
returns jsonb
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select coalesce(jsonb_agg(project_id), '[]'::jsonb)
  from public.project_likes
  where visitor_id = p_visitor_id;
$$;

grant execute on function public.get_visitor_liked_projects(text) to anon, authenticated;

-- RLS: les anonymes peuvent inserer/supprimer leurs likes (via visitor_id)
drop policy if exists project_likes_insert on public.project_likes;
create policy project_likes_insert on public.project_likes
  for insert to anon, authenticated
  with check ((select auth.uid()) = user_id or (user_id is null and visitor_id is not null));

drop policy if exists project_likes_delete on public.project_likes;
create policy project_likes_delete on public.project_likes
  for delete to anon, authenticated
  using ((select auth.uid()) = user_id or (visitor_id is not null and (select auth.uid()) is null));

grant insert, delete on public.project_likes to anon;
