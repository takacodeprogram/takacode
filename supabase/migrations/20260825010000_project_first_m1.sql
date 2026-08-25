-- =============================================================================
-- M1 — Socle project-first (cf. ROADMAP_REPOSITIONNEMENT.md §11.6)
--
-- Cette migration N'EST PAS destructive. Elle ajoute les tables de gabarits et
-- les colonnes manquantes a user_projects. Aucune colonne existante n'est
-- supprimee, aucune lecture actuelle n'est modifiee : learning_tracks,
-- track_modules et track_lessons continuent de fonctionner a l'identique.
--
-- Critere de sortie : rien ne casse, anciennes colonnes intactes.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. project_types — les categories de realisation
--    C'est ce qui rend le moteur generique : un projet n'est plus implicitement
--    du code.
-- -----------------------------------------------------------------------------

create table if not exists public.project_types (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  label text not null,
  description text not null default '',
  icon text not null default 'lucide:target',
  accent_color text not null default '#4F8EF7',
  sort_order integer not null default 100,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now())
);

create index if not exists project_types_active_idx
  on public.project_types (is_active, sort_order);

-- -----------------------------------------------------------------------------
-- 2. project_frameworks — le squelette reutilisable d'une categorie
--    Ce que deviennent les learning_tracks. On ne migre pas les donnees ici :
--    les deux coexistent le temps de la bascule editoriale.
-- -----------------------------------------------------------------------------

create table if not exists public.project_frameworks (
  id uuid primary key default gen_random_uuid(),
  project_type_id uuid references public.project_types (id) on delete set null,
  legacy_track_id uuid references public.learning_tracks (id) on delete set null,
  slug text not null unique,
  title text not null,
  summary text not null default '',
  level_label text not null default 'Debutant',
  duration_weeks integer not null default 8 check (duration_weeks > 0),
  locale text not null default 'fr' check (locale in ('fr', 'en')),
  is_published boolean not null default false,
  sort_order integer not null default 100,
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now())
);

create index if not exists project_frameworks_type_idx
  on public.project_frameworks (project_type_id, sort_order);
create index if not exists project_frameworks_published_idx
  on public.project_frameworks (is_published, locale, sort_order);

-- -----------------------------------------------------------------------------
-- 3. framework_phases — les grandes phases (6 a 12, jamais plus)
--    Ce que deviennent les track_modules.
-- -----------------------------------------------------------------------------

create table if not exists public.framework_phases (
  id uuid primary key default gen_random_uuid(),
  framework_id uuid not null references public.project_frameworks (id) on delete cascade,
  slug text not null,
  title text not null,
  objective text not null default '',
  expected_outcome text not null default '',
  sort_order integer not null default 100,
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now()),
  unique (framework_id, slug)
);

create index if not exists framework_phases_framework_idx
  on public.framework_phases (framework_id, sort_order);

-- -----------------------------------------------------------------------------
-- 4. phase_step_templates — le gabarit d'une etape
--    Ce que deviennent les track_lessons, depouillees de leur logique de cours.
--    Une etape decrit CE QU'IL FAUT PRODUIRE et A QUELLES CONDITIONS c'est
--    termine. Pas un contenu pedagogique.
-- -----------------------------------------------------------------------------

create table if not exists public.phase_step_templates (
  id uuid primary key default gen_random_uuid(),
  phase_id uuid not null references public.framework_phases (id) on delete cascade,
  slug text not null,
  title text not null,
  why text not null default '',
  deliverable_type text not null default 'other' check (deliverable_type in (
    'repo', 'app', 'document', 'video', 'channel', 'playlist', 'dashboard',
    'dataset', 'automation', 'landing', 'portfolio', 'proposal', 'product', 'other'
  )),
  acceptance_criteria jsonb not null default '[]'::jsonb
    check (jsonb_typeof(acceptance_criteria) = 'array'),
  estimated_minutes integer not null default 60 check (estimated_minutes > 0),
  sort_order integer not null default 100,
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now()),
  unique (phase_id, slug)
);

create index if not exists phase_step_templates_phase_idx
  on public.phase_step_templates (phase_id, sort_order);

-- -----------------------------------------------------------------------------
-- 5. user_projects — generalisation
--    Les colonnes historiques (track_id, repo_url, live_url, revenue_model,
--    template_id, first_euro_at, has_declared_first_euro) sont CONSERVEES.
--    Elles seront depreciees en M7, quand plus rien ne les lira.
-- -----------------------------------------------------------------------------

alter table public.user_projects
  add column if not exists project_type_id uuid references public.project_types (id) on delete set null,
  add column if not exists framework_id uuid references public.project_frameworks (id) on delete set null,
  add column if not exists target_audience text not null default '',
  add column if not exists success_criteria text not null default '',
  add column if not exists visibility text not null default 'private',
  add column if not exists completed_at timestamptz,
  add column if not exists published_at timestamptz,
  add column if not exists valorised_at timestamptz;

create index if not exists user_projects_type_idx
  on public.user_projects (project_type_id);
create index if not exists user_projects_framework_idx
  on public.user_projects (framework_id);

-- visibility : private par defaut, le membre choisit ce qui devient public
alter table public.user_projects drop constraint if exists user_projects_visibility_check;
alter table public.user_projects
  add constraint user_projects_visibility_check
  check (visibility in ('private', 'unlisted', 'public'));

-- status : la contrainte actuelle confond "termine" et "publie" et ignore
-- "valorise". On elargit sans invalider les lignes existantes ('archived' reste
-- accepte tant que des projets le portent).
alter table public.user_projects drop constraint if exists user_projects_status_check;
alter table public.user_projects
  add constraint user_projects_status_check
  check (status in (
    'idea', 'planned', 'in_progress', 'completed',
    'published', 'valorised', 'paused', 'abandoned', 'archived'
  ));

-- -----------------------------------------------------------------------------
-- 6. Triggers updated_at (internal.tg_set_updated_at existe depuis 004)
-- -----------------------------------------------------------------------------

drop trigger if exists trg_project_types_updated_at on public.project_types;
create trigger trg_project_types_updated_at
before update on public.project_types
for each row execute function internal.tg_set_updated_at();

drop trigger if exists trg_project_frameworks_updated_at on public.project_frameworks;
create trigger trg_project_frameworks_updated_at
before update on public.project_frameworks
for each row execute function internal.tg_set_updated_at();

drop trigger if exists trg_framework_phases_updated_at on public.framework_phases;
create trigger trg_framework_phases_updated_at
before update on public.framework_phases
for each row execute function internal.tg_set_updated_at();

drop trigger if exists trg_phase_step_templates_updated_at on public.phase_step_templates;
create trigger trg_phase_step_templates_updated_at
before update on public.phase_step_templates
for each row execute function internal.tg_set_updated_at();

-- -----------------------------------------------------------------------------
-- 7. RLS — contenu editorial : lecture publique, ecriture reservee aux admins
-- -----------------------------------------------------------------------------

alter table public.project_types enable row level security;
alter table public.project_frameworks enable row level security;
alter table public.framework_phases enable row level security;
alter table public.phase_step_templates enable row level security;

drop policy if exists project_types_read on public.project_types;
create policy project_types_read on public.project_types
  for select to anon, authenticated using (is_active);

drop policy if exists project_types_admin_write on public.project_types;
create policy project_types_admin_write on public.project_types
  for all to authenticated
  using (internal.is_admin((select auth.uid())))
  with check (internal.is_admin((select auth.uid())));

drop policy if exists project_frameworks_read on public.project_frameworks;
create policy project_frameworks_read on public.project_frameworks
  for select to anon, authenticated using (is_published);

drop policy if exists project_frameworks_admin_write on public.project_frameworks;
create policy project_frameworks_admin_write on public.project_frameworks
  for all to authenticated
  using (internal.is_admin((select auth.uid())))
  with check (internal.is_admin((select auth.uid())));

drop policy if exists framework_phases_read on public.framework_phases;
create policy framework_phases_read on public.framework_phases
  for select to anon, authenticated
  using (exists (
    select 1 from public.project_frameworks f
    where f.id = framework_id and f.is_published
  ));

drop policy if exists framework_phases_admin_write on public.framework_phases;
create policy framework_phases_admin_write on public.framework_phases
  for all to authenticated
  using (internal.is_admin((select auth.uid())))
  with check (internal.is_admin((select auth.uid())));

drop policy if exists phase_step_templates_read on public.phase_step_templates;
create policy phase_step_templates_read on public.phase_step_templates
  for select to anon, authenticated
  using (exists (
    select 1
    from public.framework_phases p
    join public.project_frameworks f on f.id = p.framework_id
    where p.id = phase_id and f.is_published
  ));

drop policy if exists phase_step_templates_admin_write on public.phase_step_templates;
create policy phase_step_templates_admin_write on public.phase_step_templates
  for all to authenticated
  using (internal.is_admin((select auth.uid())))
  with check (internal.is_admin((select auth.uid())));

-- -----------------------------------------------------------------------------
-- 8. Seed des types de projet
--    Un projet numerique ne veut pas dire coder : la liste couvre le logiciel,
--    le contenu, le commerce et l'activite de service.
-- -----------------------------------------------------------------------------

insert into public.project_types (slug, label, description, icon, accent_color, sort_order) values
  ('saas',              'SaaS',               'Une application vendue par abonnement.',                  'lucide:layers',         '#4F8EF7',  10),
  ('web_app',           'Application web',    'Un outil accessible depuis un navigateur.',               'lucide:app-window',     '#4F8EF7',  20),
  ('site_web',          'Site web',           'Un site vitrine, un portfolio ou une landing page.',      'lucide:globe',          '#22D3EE',  30),
  ('agent_ia',          'Agent IA',           'Un agent qui execute une tache a ta place.',              'lucide:bot',            '#9B6DFF',  40),
  ('automatisation',    'Automatisation',     'Un workflow qui supprime une tache repetitive.',          'lucide:workflow',       '#9B6DFF',  50),
  ('data',              'Projet data',        'Collecter, nettoyer, analyser et restituer des donnees.', 'lucide:bar-chart-3',    '#10B981',  60),
  ('ecommerce',         'Boutique en ligne',  'Un catalogue, un paiement, des premieres commandes.',     'lucide:shopping-bag',   '#F59E0B',  70),
  ('contenu_video',     'Chaine video',       'Une chaine, un format, un systeme de production.',        'lucide:video',          '#EF4444',  80),
  ('podcast',           'Podcast',            'Un angle, un format, une distribution reguliere.',        'lucide:mic',            '#EC4899',  90),
  ('newsletter',        'Newsletter',         'Un numero publie et une page d''inscription.',            'lucide:mail',           '#EC4899', 100),
  ('produit_digital',   'Produit digital',    'Un produit telechargeable et son systeme de vente.',      'lucide:package',        '#F59E0B', 110),
  ('formation',         'Formation en ligne', 'Ta propre formation : structure, contenus, lancement.',   'lucide:graduation-cap', '#22D3EE', 120),
  ('freelance',         'Activite freelance', 'Une offre, un portfolio, des premiers clients.',          'lucide:briefcase',      '#10B981', 130),
  ('service_numerique', 'Service numerique',  'Un service en ligne rendu a des utilisateurs.',           'lucide:hand-helping',   '#4F8EF7', 140)
on conflict (slug) do update set
  label = excluded.label,
  description = excluded.description,
  icon = excluded.icon,
  accent_color = excluded.accent_color,
  sort_order = excluded.sort_order;
