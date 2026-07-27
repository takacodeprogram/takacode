-- Historique de conversation avec l'assistant IA, scoppé par contexte de page.
-- Une entrée par message. Un thread = tous les messages du même
-- (user_id, context_kind, context_ref) triés par created_at.
--
-- context_kind : dashboard | lesson | track | project | generic
-- context_ref  : slug ou id relatif au contexte (lesson slug, track slug,
--                projet id) ; vide pour dashboard et generic.

create table if not exists public.ai_chat_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  context_kind text not null check (context_kind in ('dashboard', 'lesson', 'track', 'project', 'generic')),
  context_ref text not null default '',
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  provider text default '',
  model text default '',
  created_at timestamptz not null default now()
);

create index if not exists ai_chat_messages_user_ctx_idx
  on public.ai_chat_messages (user_id, context_kind, context_ref, created_at);

alter table public.ai_chat_messages enable row level security;

drop policy if exists "ai_chat_messages_own_read" on public.ai_chat_messages;
drop policy if exists "ai_chat_messages_own_insert" on public.ai_chat_messages;
drop policy if exists "ai_chat_messages_own_delete" on public.ai_chat_messages;

create policy "ai_chat_messages_own_read"   on public.ai_chat_messages for select using (auth.uid() = user_id);
create policy "ai_chat_messages_own_insert" on public.ai_chat_messages for insert with check (auth.uid() = user_id);
create policy "ai_chat_messages_own_delete" on public.ai_chat_messages for delete using (auth.uid() = user_id);

comment on table public.ai_chat_messages is
  'Historique persisté des conversations avec l''assistant IA global, un thread par (user, contexte de page).';
