-- =============================================================================
-- M2 — Le plan (cf. ROADMAP_REPOSITIONNEMENT.md §11.6)
--
-- project_plan_steps devient le lieu de la progression, a la place de
-- user_lesson_progress. Migration additive : user_lesson_progress reste en
-- place et continue d'alimenter les grades jusqu'a M5.
--
-- Critere de sortie : un projet neuf a un plan d'etapes ; un projet existant
-- continue de fonctionner sans plan.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. project_plan_steps — le plan personnalise du Builder
--
--    step_template_id est NULLABLE et volontairement en "set null" : une etape
--    peut venir d'un framework OU etre ajoutee par le membre, et la suppression
--    d'un gabarit ne doit jamais faire disparaitre le travail de quelqu'un.
--    Le plan appartient au Builder, pas au gabarit.
-- -----------------------------------------------------------------------------

create table if not exists public.project_plan_steps (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.user_projects (id) on delete cascade,
  step_template_id uuid references public.phase_step_templates (id) on delete set null,
  phase_slug text not null default '',
  phase_title text not null default '',
  title text not null,
  why text not null default '',
  deliverable_type text not null default 'other' check (deliverable_type in (
    'repo', 'app', 'document', 'video', 'channel', 'playlist', 'dashboard',
    'dataset', 'automation', 'landing', 'portfolio', 'proposal', 'product', 'other'
  )),
  acceptance_criteria jsonb not null default '[]'::jsonb
    check (jsonb_typeof(acceptance_criteria) = 'array'),
  status text not null default 'todo'
    check (status in ('todo', 'doing', 'blocked', 'done', 'skipped')),
  position integer not null default 100,
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now())
);

create index if not exists project_plan_steps_project_idx
  on public.project_plan_steps (project_id, position);
create index if not exists project_plan_steps_status_idx
  on public.project_plan_steps (project_id, status);

-- -----------------------------------------------------------------------------
-- 2. project_tasks — les actions concretes d'une etape
-- -----------------------------------------------------------------------------

create table if not exists public.project_tasks (
  id uuid primary key default gen_random_uuid(),
  step_id uuid not null references public.project_plan_steps (id) on delete cascade,
  label text not null,
  is_done boolean not null default false,
  position integer not null default 100,
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now())
);

create index if not exists project_tasks_step_idx
  on public.project_tasks (step_id, position);

-- -----------------------------------------------------------------------------
-- 3. Triggers updated_at
-- -----------------------------------------------------------------------------

drop trigger if exists trg_project_plan_steps_updated_at on public.project_plan_steps;
create trigger trg_project_plan_steps_updated_at
before update on public.project_plan_steps
for each row execute function internal.tg_set_updated_at();

drop trigger if exists trg_project_tasks_updated_at on public.project_tasks;
create trigger trg_project_tasks_updated_at
before update on public.project_tasks
for each row execute function internal.tg_set_updated_at();

-- -----------------------------------------------------------------------------
-- 4. RLS — donnee strictement personnelle
--    Le plan suit la propriete du projet : on ne duplique pas user_id, on
--    remonte a user_projects. Une seule source de verite pour l'acces.
-- -----------------------------------------------------------------------------

alter table public.project_plan_steps enable row level security;
alter table public.project_tasks enable row level security;

drop policy if exists project_plan_steps_own on public.project_plan_steps;
create policy project_plan_steps_own on public.project_plan_steps
  for all to authenticated
  using (exists (
    select 1 from public.user_projects p
    where p.id = project_id and p.user_id = (select auth.uid())
  ))
  with check (exists (
    select 1 from public.user_projects p
    where p.id = project_id and p.user_id = (select auth.uid())
  ));

drop policy if exists project_tasks_own on public.project_tasks;
create policy project_tasks_own on public.project_tasks
  for all to authenticated
  using (exists (
    select 1
    from public.project_plan_steps s
    join public.user_projects p on p.id = s.project_id
    where s.id = step_id and p.user_id = (select auth.uid())
  ))
  with check (exists (
    select 1
    from public.project_plan_steps s
    join public.user_projects p on p.id = s.project_id
    where s.id = step_id and p.user_id = (select auth.uid())
  ));
