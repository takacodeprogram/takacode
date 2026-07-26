-- User AI config : chaque membre peut apporter sa propre clé API pour un
-- provider IA (Mistral, OpenRouter, Gemini) et choisir son provider par
-- défaut. Si aucune clé user n'est renseignée, on retombe sur les env vars
-- serveur (comportement historique).
--
-- Sécurité : les clés sont TEXT sur la table profiles. La RLS existante sur
-- profiles couvre déjà "select/update own row" — donc seul l'utilisateur peut
-- lire/écrire ses propres clés. Pas exposé aux autres users ni au public.
--
-- Décision assumée : pas de chiffrement at-rest côté DB (comme le refresh
-- token OAuth actuellement stocké). Si tu veux durcir, utiliser pgcrypto ou
-- externaliser dans un secret store dédié.

alter table public.user_profiles
  add column if not exists ai_provider text default '' check (ai_provider in ('', 'mistral', 'openrouter', 'gemini')),
  add column if not exists ai_api_key_mistral text default '',
  add column if not exists ai_api_key_openrouter text default '',
  add column if not exists ai_api_key_gemini text default '';

comment on column public.user_profiles.ai_provider is
  'Provider IA par défaut choisi par le membre. Vide = utilise le default serveur.';
comment on column public.user_profiles.ai_api_key_mistral is
  'Clé API Mistral du membre (optionnel). Si vide, utilise la clé serveur.';
comment on column public.user_profiles.ai_api_key_openrouter is
  'Clé API OpenRouter du membre (optionnel). Si vide, utilise la clé serveur.';
comment on column public.user_profiles.ai_api_key_gemini is
  'Clé API Gemini du membre (optionnel). Si vide, utilise la clé serveur.';
