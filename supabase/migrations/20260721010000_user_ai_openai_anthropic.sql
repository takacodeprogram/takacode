-- Étend la config IA user avec OpenAI et Anthropic (Claude), pour ceux qui
-- veulent brancher leur clé perso sur ces providers.

alter table public.user_profiles
  drop constraint if exists user_profiles_ai_provider_check;

alter table public.user_profiles
  add column if not exists ai_api_key_openai text default '',
  add column if not exists ai_api_key_anthropic text default '',
  add constraint user_profiles_ai_provider_check
    check (ai_provider in ('', 'mistral', 'openrouter', 'gemini', 'openai', 'anthropic'));

comment on column public.user_profiles.ai_api_key_openai is
  'Clé API OpenAI du membre (optionnel).';
comment on column public.user_profiles.ai_api_key_anthropic is
  'Clé API Anthropic (Claude) du membre (optionnel).';
