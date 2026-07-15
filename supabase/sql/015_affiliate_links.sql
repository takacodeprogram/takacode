-- TakaCode - Liens d'affiliation geres depuis l'admin (monetisation)
-- Run this after 014_mentor_tracks.sql

create schema if not exists internal;
create extension if not exists pgcrypto;

create table if not exists public.affiliate_links (
  id uuid primary key default gen_random_uuid(),
  provider text not null,
  category text not null default 'outil',
  title text not null,
  description text not null default '',
  url text not null default '',
  logo_url text not null default '',
  is_published boolean not null default true,
  sort_order integer not null default 100,
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now())
);

create index if not exists affiliate_links_category_idx on public.affiliate_links (category, sort_order);
create index if not exists affiliate_links_published_idx on public.affiliate_links (is_published);

-- internal.tg_set_updated_at() existe deja (004).
drop trigger if exists trg_affiliate_links_updated_at on public.affiliate_links;
create trigger trg_affiliate_links_updated_at
before update on public.affiliate_links
for each row
execute function internal.tg_set_updated_at();

alter table public.affiliate_links enable row level security;

drop policy if exists affiliate_links_public_read on public.affiliate_links;
create policy affiliate_links_public_read
on public.affiliate_links
for select
to anon, authenticated
using (is_published = true);

drop policy if exists affiliate_links_admin_all on public.affiliate_links;
create policy affiliate_links_admin_all
on public.affiliate_links
for all
to authenticated
using (internal.is_admin((select auth.uid())))
with check (internal.is_admin((select auth.uid())));

grant select on public.affiliate_links to anon, authenticated;
grant insert, update, delete on public.affiliate_links to authenticated;

-- Seed d'exemples (URLs a completer avec tes vrais liens d'affiliation en admin).
insert into public.affiliate_links (provider, category, title, description, url, sort_order)
values
  ('Hostinger', 'hebergement', 'Hebergement web Hostinger', 'Hebergement rapide et abordable, ideal pour un premier site ou une boutique.', 'https://www.hostinger.fr', 10),
  ('Namecheap', 'domaine', 'Nom de domaine Namecheap', 'Acheter un nom de domaine pas cher avec confidentialite incluse.', 'https://www.namecheap.com', 20),
  ('Vercel', 'deploiement', 'Deploiement Vercel', 'Mettre en ligne ton site Next.js gratuitement en quelques minutes.', 'https://vercel.com', 30),
  ('Supabase', 'backend', 'Backend Supabase', 'Base de donnees, authentification et APIs pour ton app.', 'https://supabase.com', 40),
  ('OpenRouter', 'ia', 'Acces IA OpenRouter', 'Un acces unifie a de nombreux modeles IA pour tes projets.', 'https://openrouter.ai', 50)
on conflict do nothing;
