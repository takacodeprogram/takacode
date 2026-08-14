create table if not exists public.ai_chat_attachments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  context_kind text not null check (context_kind in ('dashboard', 'lesson', 'track', 'project', 'generic')),
  context_ref text not null default '',
  storage_path text not null unique,
  file_name text not null,
  mime_type text not null,
  size_bytes bigint not null check (size_bytes >= 0 and size_bytes <= 10485760),
  extracted_text text not null default '',
  created_at timestamptz not null default now()
);

create index if not exists ai_chat_attachments_user_ctx_idx
  on public.ai_chat_attachments (user_id, context_kind, context_ref, created_at desc);

alter table public.ai_chat_attachments enable row level security;

drop policy if exists "ai_chat_attachments_own_read" on public.ai_chat_attachments;
drop policy if exists "ai_chat_attachments_own_insert" on public.ai_chat_attachments;
drop policy if exists "ai_chat_attachments_own_delete" on public.ai_chat_attachments;
create policy "ai_chat_attachments_own_read" on public.ai_chat_attachments
  for select to authenticated using (auth.uid() = user_id);
create policy "ai_chat_attachments_own_insert" on public.ai_chat_attachments
  for insert to authenticated with check (auth.uid() = user_id);
create policy "ai_chat_attachments_own_delete" on public.ai_chat_attachments
  for delete to authenticated using (auth.uid() = user_id);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'ai-chat-files', 'ai-chat-files', false, 10485760,
  '{text/plain,text/markdown,text/csv,text/html,text/css,application/json,application/javascript,application/typescript,application/xml,application/pdf,image/png,image/jpeg,image/webp}'
)
on conflict (id) do update set
  public = false,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "ai_chat_files_own_read" on storage.objects;
drop policy if exists "ai_chat_files_own_insert" on storage.objects;
drop policy if exists "ai_chat_files_own_delete" on storage.objects;
create policy "ai_chat_files_own_read" on storage.objects
  for select to authenticated
  using (bucket_id = 'ai-chat-files' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "ai_chat_files_own_insert" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'ai-chat-files' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "ai_chat_files_own_delete" on storage.objects
  for delete to authenticated
  using (bucket_id = 'ai-chat-files' and (storage.foldername(name))[1] = auth.uid()::text);
