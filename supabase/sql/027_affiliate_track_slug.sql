-- TakaCode - Associer les liens d'affiliation aux parcours
-- Ajoute une colonne track_slug pour lier un lien a un parcours

alter table if exists public.affiliate_links
  add column if not exists track_slug text;

create index if not exists affiliate_links_track_slug_idx
  on public.affiliate_links (track_slug);
