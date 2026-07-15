-- TakaCode - Deduplication des liens d'affiliation + contrainte anti-doublon
-- Run this after 015_affiliate_links.sql
--
-- Le seed 015 utilisait "on conflict do nothing" mais SANS index unique, donc
-- relancer 015 (ou l'appliquer deux fois) creait des doublons. Ce script:
--   1. supprime les doublons (garde la ligne la plus ancienne par provider+title),
--   2. ajoute un index unique pour empecher les futurs doublons.
-- Ensuite, tu peux supprimer un lien precis depuis /admin/affiliations (Editer -> Supprimer).

-- 1. Supprimer les doublons (garde le plus ancien ; ctid departage les egalites de date)
delete from public.affiliate_links a
using public.affiliate_links b
where a.provider = b.provider
  and a.title = b.title
  and (a.created_at > b.created_at or (a.created_at = b.created_at and a.ctid > b.ctid));

-- 2. Empecher les futurs doublons
create unique index if not exists affiliate_links_provider_title_uidx
  on public.affiliate_links (provider, title);
