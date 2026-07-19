-- Lie les liens d'affiliation aux parcours : colonne track_slug utilisee par
-- lib/affiliate.ts (listAffiliatesByTrack), le formulaire admin et la page parcours.
alter table public.affiliate_links
  add column if not exists track_slug text not null default '';

create index if not exists affiliate_links_track_idx
  on public.affiliate_links (track_slug, sort_order);

-- Relie les suggestions seedees (scripts/seed-affiliations-suggestions.mjs)
-- a leurs parcours respectifs.
update public.affiliate_links set track_slug = 'automatisation-ia'
  where provider = 'Hostinger' and title = 'Hostinger VPS' and track_slug = '';
update public.affiliate_links set track_slug = 'bot-trading-ia'
  where provider = 'Hostinger' and title = 'Hostinger VPS pour bots de trading' and track_slug = '';
update public.affiliate_links set track_slug = 'bases-internet'
  where provider = 'Hostinger' and title = 'Hostinger Hebergement Web' and track_slug = '';
update public.affiliate_links set track_slug = 'dev-web-assiste-ia'
  where provider = 'Hostinger' and title = 'Hostinger Cloud / Node.js' and track_slug = '';
update public.affiliate_links set track_slug = 'dev-web-assiste-ia'
  where provider = 'Vercel' and title = 'Vercel' and track_slug = '';
update public.affiliate_links set track_slug = 'produits-digitaux'
  where provider in ('systeme.io', 'Chariow') and track_slug = '';
update public.affiliate_links set track_slug = 'creation-contenu-ia'
  where provider = 'ElevenLabs' and track_slug = '';
update public.affiliate_links set track_slug = 'bot-trading-ia'
  where provider = 'TradingView' and track_slug = '';
