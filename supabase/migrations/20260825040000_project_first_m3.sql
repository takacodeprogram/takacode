-- =============================================================================
-- M3 — Livrables, preuves, journal, opportunites
-- (cf. ROADMAP_REPOSITIONNEMENT.md §11.6)
--
-- Additive. repo_url, live_url et first_euro_at restent en place : ils sont
-- COPIES en lignes, pas deplaces. L'interface lira les nouvelles tables et
-- retombera sur les anciennes colonnes si elles sont vides, jusqu'a M7.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. project_deliverables — ce qui remplace repo_url et live_url
--    Un livrable n'est pas forcement une URL de code.
-- -----------------------------------------------------------------------------

create table if not exists public.project_deliverables (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.user_projects (id) on delete cascade,
  step_id uuid references public.project_plan_steps (id) on delete set null,
  kind text not null default 'other' check (kind in (
    'repo', 'app', 'document', 'video', 'channel', 'playlist', 'dashboard',
    'dataset', 'automation', 'landing', 'portfolio', 'proposal', 'product', 'other'
  )),
  title text not null default '',
  url text not null default '',
  file_path text not null default '',
  body text not null default '',
  validation_level text not null default 'auto' check (validation_level in (
    'auto', 'ai', 'peer', 'contributor', 'mentor', 'client'
  )),
  validated_at timestamptz,
  validated_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now())
);

create index if not exists project_deliverables_project_idx
  on public.project_deliverables (project_id, created_at desc);
create index if not exists project_deliverables_step_idx
  on public.project_deliverables (step_id);

-- -----------------------------------------------------------------------------
-- 2. project_proofs — « ca a marche », pas seulement « j'ai fait »
-- -----------------------------------------------------------------------------

create table if not exists public.project_proofs (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.user_projects (id) on delete cascade,
  kind text not null default 'stat' check (kind in (
    'user', 'review', 'sale', 'stat', 'client', 'download', 'subscription'
  )),
  label text not null default '',
  value_numeric numeric,
  value_text text not null default '',
  url text not null default '',
  observed_at date,
  created_at timestamptz not null default timezone('utc'::text, now())
);

create index if not exists project_proofs_project_idx
  on public.project_proofs (project_id, created_at desc);

-- -----------------------------------------------------------------------------
-- 3. project_journal — la matiere premiere de l'etude de cas
-- -----------------------------------------------------------------------------

create table if not exists public.project_journal (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.user_projects (id) on delete cascade,
  step_id uuid references public.project_plan_steps (id) on delete set null,
  entry_type text not null default 'learning' check (entry_type in (
    'decision', 'difficulty', 'learning', 'pivot'
  )),
  body text not null,
  created_at timestamptz not null default timezone('utc'::text, now())
);

create index if not exists project_journal_project_idx
  on public.project_journal (project_id, created_at desc);

-- -----------------------------------------------------------------------------
-- 4. project_opportunities — la fin de la chaine
-- -----------------------------------------------------------------------------

create table if not exists public.project_opportunities (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.user_projects (id) on delete cascade,
  kind text not null default 'other' check (kind in (
    'client', 'job', 'mission', 'activity', 'revenue', 'other'
  )),
  label text not null default '',
  amount numeric,
  currency text not null default '',
  declared_at timestamptz not null default timezone('utc'::text, now()),
  is_verified boolean not null default false,
  created_at timestamptz not null default timezone('utc'::text, now())
);

create index if not exists project_opportunities_project_idx
  on public.project_opportunities (project_id, declared_at desc);

-- -----------------------------------------------------------------------------
-- 5. Triggers et RLS
--    La propriete remonte a user_projects : une seule source de verite.
-- -----------------------------------------------------------------------------

drop trigger if exists trg_project_deliverables_updated_at on public.project_deliverables;
create trigger trg_project_deliverables_updated_at
before update on public.project_deliverables
for each row execute function internal.tg_set_updated_at();

alter table public.project_deliverables enable row level security;
alter table public.project_proofs enable row level security;
alter table public.project_journal enable row level security;
alter table public.project_opportunities enable row level security;

drop policy if exists project_deliverables_own on public.project_deliverables;
create policy project_deliverables_own on public.project_deliverables
  for all to authenticated
  using (exists (select 1 from public.user_projects p where p.id = project_id and p.user_id = (select auth.uid())))
  with check (exists (select 1 from public.user_projects p where p.id = project_id and p.user_id = (select auth.uid())));

drop policy if exists project_proofs_own on public.project_proofs;
create policy project_proofs_own on public.project_proofs
  for all to authenticated
  using (exists (select 1 from public.user_projects p where p.id = project_id and p.user_id = (select auth.uid())))
  with check (exists (select 1 from public.user_projects p where p.id = project_id and p.user_id = (select auth.uid())));

drop policy if exists project_journal_own on public.project_journal;
create policy project_journal_own on public.project_journal
  for all to authenticated
  using (exists (select 1 from public.user_projects p where p.id = project_id and p.user_id = (select auth.uid())))
  with check (exists (select 1 from public.user_projects p where p.id = project_id and p.user_id = (select auth.uid())));

drop policy if exists project_opportunities_own on public.project_opportunities;
create policy project_opportunities_own on public.project_opportunities
  for all to authenticated
  using (exists (select 1 from public.user_projects p where p.id = project_id and p.user_id = (select auth.uid())))
  with check (exists (select 1 from public.user_projects p where p.id = project_id and p.user_id = (select auth.uid())));

-- Un projet publie est visible de tous : ses livrables aussi, sinon le
-- portfolio public serait vide.
drop policy if exists project_deliverables_public_read on public.project_deliverables;
create policy project_deliverables_public_read on public.project_deliverables
  for select to anon, authenticated
  using (exists (
    select 1 from public.user_projects p
    where p.id = project_id and p.status in ('published', 'valorised')
  ));

drop policy if exists project_proofs_public_read on public.project_proofs;
create policy project_proofs_public_read on public.project_proofs
  for select to anon, authenticated
  using (exists (
    select 1 from public.user_projects p
    where p.id = project_id and p.status in ('published', 'valorised')
  ));

-- -----------------------------------------------------------------------------
-- 6. Reprise de l'existant
--    On COPIE, on ne deplace pas : les anciennes colonnes restent lisibles
--    jusqu'a M7. Le "not exists" rend la migration rejouable sans doublonner.
-- -----------------------------------------------------------------------------

insert into public.project_deliverables (project_id, kind, title, url, validation_level)
select p.id, 'repo', 'Depot du projet', p.repo_url, 'auto'
from public.user_projects p
where coalesce(p.repo_url, '') <> ''
  and not exists (
    select 1 from public.project_deliverables d
    where d.project_id = p.id and d.url = p.repo_url
  );

insert into public.project_deliverables (project_id, kind, title, url, validation_level)
select p.id, 'app', 'Projet en ligne', p.live_url, 'auto'
from public.user_projects p
where coalesce(p.live_url, '') <> ''
  and not exists (
    select 1 from public.project_deliverables d
    where d.project_id = p.id and d.url = p.live_url
  );

insert into public.project_opportunities (project_id, kind, label, declared_at, is_verified)
select p.id, 'revenue', 'Premier revenu declare', coalesce(p.first_euro_at, now()), false
from public.user_projects p
where p.has_declared_first_euro = true
  and not exists (
    select 1 from public.project_opportunities o
    where o.project_id = p.id and o.kind = 'revenue'
  );

-- Un projet qui a genere un revenu est, par definition, valorise.
update public.user_projects
set status = 'valorised', valorised_at = coalesce(valorised_at, first_euro_at, now())
where has_declared_first_euro = true
  and status in ('published', 'completed');
