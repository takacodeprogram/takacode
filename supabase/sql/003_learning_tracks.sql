-- TakaCode - Learning tracks catalogue and user enrollments
-- Run this after 001_roles_points_referrals.sql

create schema if not exists internal;
create extension if not exists pgcrypto;

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

create table if not exists public.learning_tracks (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  goal_key text not null,
  title text not null,
  summary text not null,
  description text not null default '',
  level_label text not null default 'Debutant',
  duration_weeks integer not null default 8 check (duration_weeks > 0),
  accent_color text not null default '#4F8EF7',
  icon text not null default 'lucide:route',
  objective text not null default 'Construire un projet concret.',
  resources jsonb not null default '[]'::jsonb check (jsonb_typeof(resources) = 'array'),
  next_session text not null default 'Session annoncee bientot',
  next_steps jsonb not null default '[]'::jsonb check (jsonb_typeof(next_steps) = 'array'),
  is_published boolean not null default true,
  is_active boolean not null default true,
  sort_order integer not null default 100,
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now())
);

create table if not exists public.user_track_enrollments (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  track_id uuid not null references public.learning_tracks (id) on delete cascade,
  status text not null default 'in_progress' check (status in ('planned', 'in_progress', 'completed')),
  progress integer not null default 0 check (progress >= 0 and progress <= 100),
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now()),
  unique (user_id, track_id)
);

create index if not exists learning_tracks_goal_idx on public.learning_tracks (goal_key);
create index if not exists learning_tracks_sort_idx on public.learning_tracks (sort_order);
create index if not exists learning_tracks_published_idx on public.learning_tracks (is_published, is_active);
create index if not exists user_track_enrollments_user_idx on public.user_track_enrollments (user_id, created_at desc);
create index if not exists user_track_enrollments_track_idx on public.user_track_enrollments (track_id);

create or replace function internal.tg_set_updated_at()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  new.updated_at := timezone('utc'::text, now());
  return new;
end;
$$;

revoke all on function internal.tg_set_updated_at() from public;

create or replace function internal.tg_track_enrollment_derive_fields()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  new.progress := greatest(0, least(coalesce(new.progress, 0), 100));

  if new.started_at is null then
    new.started_at := coalesce(old.started_at, timezone('utc'::text, now()));
  end if;

  if new.status = 'completed' then
    new.progress := 100;
    new.completed_at := coalesce(new.completed_at, timezone('utc'::text, now()));
  elsif coalesce(new.status, '') <> 'completed' then
    new.completed_at := null;
  end if;

  new.updated_at := timezone('utc'::text, now());

  return new;
end;
$$;

revoke all on function internal.tg_track_enrollment_derive_fields() from public;

drop trigger if exists trg_learning_tracks_updated_at on public.learning_tracks;
create trigger trg_learning_tracks_updated_at
before update on public.learning_tracks
for each row
execute function internal.tg_set_updated_at();

drop trigger if exists trg_user_track_enrollments_derive_fields on public.user_track_enrollments;
create trigger trg_user_track_enrollments_derive_fields
before insert or update on public.user_track_enrollments
for each row
execute function internal.tg_track_enrollment_derive_fields();

insert into public.learning_tracks (
  slug,
  goal_key,
  title,
  summary,
  description,
  level_label,
  duration_weeks,
  accent_color,
  icon,
  objective,
  resources,
  next_session,
  next_steps,
  sort_order
)
values
  (
    'site-web',
    'website',
    'Parcours Site Web',
    'Construire un site vitrine, blog ou portfolio.',
    'Tu apprends a concevoir, coder et publier un site web clair et professionnel.',
    'Debutant',
    12,
    '#4F8EF7',
    'lucide:globe',
    'Construire ton premier site web complet et publie.',
    '["Guide HTML/CSS", "Introduction a JavaScript", "Projet: site vitrine"]'::jsonb,
    'Mercredi 20h00',
    '[{"label":"Decouvrir HTML", "state":"done"}, {"label":"Faire lexercice 1", "state":"current"}, {"label":"Construire le header", "state":"locked"}]'::jsonb,
    10
  ),
  (
    'application-web',
    'web_app',
    'Parcours Application Web',
    'Construire une plateforme ou un outil interactif.',
    'Tu avances de JavaScript a React puis au backend pour livrer une vraie application web.',
    'Debutant +',
    14,
    '#9B6DFF',
    'lucide:monitor-smartphone',
    'Publier ta premiere application web complete.',
    '["Bases JavaScript", "Introduction React", "Projet: outil web complet"]'::jsonb,
    'Jeudi 20h00',
    '[{"label":"Revoir JavaScript moderne", "state":"done"}, {"label":"Creer les composants React", "state":"current"}, {"label":"Connecter une base de donnees", "state":"locked"}]'::jsonb,
    20
  ),
  (
    'application-mobile',
    'mobile_app',
    'Parcours Application Mobile',
    'Creer une application Android ou iOS.',
    'Tu conois des ecrans mobiles, la navigation et les tests avant la mise en ligne.',
    'Debutant +',
    14,
    '#06B6D4',
    'lucide:smartphone',
    'Publier ta premiere application mobile.',
    '["UI mobile", "React Native bases", "Projet: app mobile MVP"]'::jsonb,
    'Lundi 19h30',
    '[{"label":"Structurer les ecrans", "state":"done"}, {"label":"Coder la navigation", "state":"current"}, {"label":"Tester et publier", "state":"locked"}]'::jsonb,
    30
  ),
  (
    'automatisation-ia',
    'automation_ai',
    'Parcours Automatisation et IA',
    'Creer des workflows, agents IA et assistants intelligents.',
    'Tu combines no-code, APIs et IA pour automatiser des process utiles.',
    'Pratique',
    10,
    '#22D3EE',
    'lucide:bot',
    'Automatiser un workflow metier avec IA.',
    '["Guide n8n", "Prompts robustes", "Projet: assistant metier"]'::jsonb,
    'Mardi 20h30',
    '[{"label":"Map des taches a automatiser", "state":"done"}, {"label":"Creer ton premier scenario n8n", "state":"current"}, {"label":"Ajouter la couche IA", "state":"locked"}]'::jsonb,
    40
  ),
  (
    'analyse-donnees',
    'data_analysis',
    'Parcours Analyse et Visualisation de Donnees',
    'Transformer des donnees en tableaux de bord et rapports.',
    'Tu apprends a nettoyer, analyser et visualiser des donnees pour prendre de meilleures decisions.',
    'Debutant',
    10,
    '#10B981',
    'lucide:bar-chart-3',
    'Transformer des donnees en tableaux de bord utiles.',
    '["Excel propre", "Power BI de base", "Projet: dashboard KPI"]'::jsonb,
    'Lundi 20h00',
    '[{"label":"Nettoyer un jeu de donnees", "state":"done"}, {"label":"Creer les premiers KPI", "state":"current"}, {"label":"Partager ton dashboard", "state":"locked"}]'::jsonb,
    50
  ),
  (
    'contenu-videos',
    'videos_youtube',
    'Parcours Contenu et Videos',
    'YouTube, montage video, videos IA et reseaux sociaux.',
    'Tu construis un systeme de creation regulier pour produire et publier du contenu video.',
    'Creation',
    8,
    '#F97316',
    'lucide:clapperboard',
    'Produire du contenu regulier pour le web et les reseaux.',
    '["Script efficace", "Montage video", "Projet: plan contenu 30 jours"]'::jsonb,
    'Mercredi 18h30',
    '[{"label":"Definir ton angle editorial", "state":"done"}, {"label":"Produire le premier episode", "state":"current"}, {"label":"Optimiser publication et SEO", "state":"locked"}]'::jsonb,
    60
  ),
  (
    'musique-audio',
    'podcast_audio',
    'Parcours Musique et Audio',
    'Podcasts, musique et contenus audio.',
    'Tu conois, enregistres et publies un projet audio ou musical de qualite.',
    'Creation',
    8,
    '#EC4899',
    'lucide:mic-2',
    'Produire un projet musical ou audio et le publier.',
    '["Home studio minimal", "Mixage et mastering", "Projet: morceau ou episode pilote"]'::jsonb,
    'Jeudi 19h00',
    '[{"label":"Choisir ton format", "state":"done"}, {"label":"Composer ou enregistrer une premiere version", "state":"current"}, {"label":"Finaliser et publier", "state":"locked"}]'::jsonb,
    70
  ),
  (
    'business-digital',
    'digital_business',
    'Parcours Business Digital',
    'Lancer un produit numerique, SaaS ou activite en ligne.',
    'Tu passes de lidee a une offre claire puis a un lancement concret.',
    'Build',
    12,
    '#F59E0B',
    'lucide:rocket',
    'Lancer un produit numerique monetisable.',
    '["Positionnement offre", "Tunnel de vente", "Projet: MVP monetisable"]'::jsonb,
    'Mardi 19h30',
    '[{"label":"Clarifier ton offre", "state":"done"}, {"label":"Construire le MVP", "state":"current"}, {"label":"Lancer les premieres ventes", "state":"locked"}]'::jsonb,
    80
  ),
  (
    'marketing-digital',
    'marketing_online',
    'Parcours Marketing Digital',
    'SEO, reseaux sociaux, email marketing et acquisition.',
    'Tu structures ta presence en ligne pour attirer, convertir et fideliser.',
    'Execution',
    10,
    '#EF4444',
    'lucide:megaphone',
    'Construire une presence en ligne qui attire et convertit.',
    '["Bases SEO", "Strategie reseaux sociaux", "Projet: plan marketing 90 jours"]'::jsonb,
    'Jeudi 19h30',
    '[{"label":"Definir ton audience", "state":"done"}, {"label":"Construire ton plan de contenu", "state":"current"}, {"label":"Lancer tes campagnes", "state":"locked"}]'::jsonb,
    90
  ),
  (
    'web3-blockchain',
    'web3',
    'Parcours Web3 et Blockchain',
    'Wallets, smart contracts et applications decentralisees.',
    'Tu apprends les bases blockchain puis tu develops une dApp fonctionnelle.',
    'Build',
    12,
    '#38BDF8',
    'lucide:wallet',
    'Construire une application Web3 avec wallet et smart contract.',
    '["Bases blockchain", "Smart contracts", "Projet: dApp MVP"]'::jsonb,
    'Jeudi 20h30',
    '[{"label":"Comprendre wallets et reseaux", "state":"done"}, {"label":"Coder ton premier smart contract", "state":"current"}, {"label":"Connecter ton front-end", "state":"locked"}]'::jsonb,
    100
  ),
  (
    '3d-immersif',
    'three_d',
    'Parcours 3D et Experiences Immersives',
    'Modelisation 3D, animation et experiences interactives.',
    'Tu produis des assets 3D et les integres dans des experiences web ou produit.',
    'Creation',
    12,
    '#8B5CF6',
    'lucide:box',
    'Creer des experiences 3D pour le web, le jeu ou la visualisation.',
    '["Blender foundations", "Modelisation 3D", "Projet: scene interactive"]'::jsonb,
    'Samedi 19h00',
    '[{"label":"Prendre en main Blender", "state":"done"}, {"label":"Modeliser un premier asset", "state":"current"}, {"label":"Animer et exporter", "state":"locked"}]'::jsonb,
    110
  ),
  (
    'outil-personnalise',
    'custom_projects',
    'Parcours Outils et Projets Personnalises',
    'Creer des solutions adaptees a un besoin precis.',
    'Tu cadres ton besoin puis tu livres un outil sur mesure, utile et maintenable.',
    'Sur mesure',
    12,
    '#14B8A6',
    'lucide:wrench',
    'Construire une solution adaptee a un besoin precis.',
    '["Cadrage du besoin", "Choix des outils", "Projet: solution personnalisee"]'::jsonb,
    'Mercredi 20h00',
    '[{"label":"Definir le resultat cible", "state":"done"}, {"label":"Decouper le projet en sprints", "state":"current"}, {"label":"Construire une premiere version", "state":"locked"}]'::jsonb,
    120
  ),
  (
    'decouverte-exploration',
    'learn_explore',
    'Parcours Decouvrir et Apprendre',
    'Decouvrir de nouvelles competences et experimenter.',
    'Tu explores plusieurs domaines pour choisir un cap avec clarte.',
    'Exploration',
    6,
    '#A78BFA',
    'lucide:graduation-cap',
    'Explorer plusieurs domaines avant de choisir ton prochain cap.',
    '["Parcours dinitiation", "Exercices pratiques", "Mini-projet guide"]'::jsonb,
    'Lundi 19h00',
    '[{"label":"Explorer les fondamentaux", "state":"done"}, {"label":"Realiser un mini-projet", "state":"current"}, {"label":"Choisir ton parcours cible", "state":"locked"}]'::jsonb,
    130
  ),
  (
    'autre-idee',
    'other',
    'Parcours Autre Idee',
    'Jai une idee differente et je veux un plan clair.',
    'Tu transformes ton idee libre en feuille de route actionnable.',
    'Sur mesure',
    8,
    '#A78BFA',
    'lucide:sparkles',
    'Transformer ton idee en feuille de route executable.',
    '["Cadrage du besoin", "Roadmap claire", "Projet: premiere version"]'::jsonb,
    'Mercredi 20h00',
    '[{"label":"Definir ton resultat cible", "state":"done"}, {"label":"Choisir le bon parcours", "state":"current"}, {"label":"Lancer ton premier sprint", "state":"locked"}]'::jsonb,
    140
  )
on conflict (slug) do update
set
  goal_key = excluded.goal_key,
  title = excluded.title,
  summary = excluded.summary,
  description = excluded.description,
  level_label = excluded.level_label,
  duration_weeks = excluded.duration_weeks,
  accent_color = excluded.accent_color,
  icon = excluded.icon,
  objective = excluded.objective,
  resources = excluded.resources,
  next_session = excluded.next_session,
  next_steps = excluded.next_steps,
  is_published = true,
  is_active = true,
  sort_order = excluded.sort_order,
  updated_at = timezone('utc'::text, now());

alter table public.learning_tracks enable row level security;
alter table public.user_track_enrollments enable row level security;

drop policy if exists learning_tracks_public_read on public.learning_tracks;
create policy learning_tracks_public_read
on public.learning_tracks
for select
to anon, authenticated
using (is_published = true and is_active = true);

drop policy if exists learning_tracks_admin_all on public.learning_tracks;
create policy learning_tracks_admin_all
on public.learning_tracks
for all
to authenticated
using (internal.is_admin((select auth.uid())))
with check (internal.is_admin((select auth.uid())));

drop policy if exists user_track_enrollments_select_self_or_admin on public.user_track_enrollments;
create policy user_track_enrollments_select_self_or_admin
on public.user_track_enrollments
for select
to authenticated
using ((select auth.uid()) = user_id or internal.is_admin((select auth.uid())));

drop policy if exists user_track_enrollments_insert_self_or_admin on public.user_track_enrollments;
create policy user_track_enrollments_insert_self_or_admin
on public.user_track_enrollments
for insert
to authenticated
with check ((select auth.uid()) = user_id or internal.is_admin((select auth.uid())));

drop policy if exists user_track_enrollments_update_self_or_admin on public.user_track_enrollments;
create policy user_track_enrollments_update_self_or_admin
on public.user_track_enrollments
for update
to authenticated
using ((select auth.uid()) = user_id or internal.is_admin((select auth.uid())))
with check ((select auth.uid()) = user_id or internal.is_admin((select auth.uid())));

drop policy if exists user_track_enrollments_delete_self_or_admin on public.user_track_enrollments;
create policy user_track_enrollments_delete_self_or_admin
on public.user_track_enrollments
for delete
to authenticated
using ((select auth.uid()) = user_id or internal.is_admin((select auth.uid())));

grant select on public.learning_tracks to anon, authenticated;
grant insert, update, delete on public.learning_tracks to authenticated;
grant select, insert, update, delete on public.user_track_enrollments to authenticated;
grant usage, select on sequence public.user_track_enrollments_id_seq to authenticated;
