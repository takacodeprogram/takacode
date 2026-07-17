-- Table d'historique des versions de parcours (snapshots pour restauration)

create table if not exists public.track_versions (
  id uuid primary key default gen_random_uuid(),
  track_id uuid not null references public.learning_tracks(id) on delete cascade,
  snapshot jsonb not null,
  label text,
  created_at timestamptz not null default now()
);

create index if not exists idx_track_versions_track_id on public.track_versions(track_id);

alter table public.track_versions enable row level security;

create policy "admins manage track versions"
  on public.track_versions
  for all
  to authenticated
  using (exists (select 1 from public.user_roles where user_id = auth.uid() and role in ('admin', 'mentor')))
  with check (exists (select 1 from public.user_roles where user_id = auth.uid() and role in ('admin', 'mentor')));

grant select, insert, delete on public.track_versions to authenticated;
