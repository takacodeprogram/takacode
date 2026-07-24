-- Bucket de stockage pour les fichiers des micro-projets
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('project-files', 'project-files', true, 5242880, '{image/png,image/jpeg,image/gif,application/pdf,text/plain,text/html,text/css,application/javascript,application/zip,application/gzip}')
on conflict (id) do nothing;

-- RLS: les fichiers sont publics en lecture, restreints en ecriture au proprietaire
drop policy if exists "project_files_select" on storage.objects;
create policy "project_files_select" on storage.objects
  for select to public
  using (bucket_id = 'project-files');

drop policy if exists "project_files_insert" on storage.objects;
create policy "project_files_insert" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'project-files' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "project_files_update" on storage.objects;
create policy "project_files_update" on storage.objects
  for update to authenticated
  using (bucket_id = 'project-files' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "project_files_delete" on storage.objects;
create policy "project_files_delete" on storage.objects
  for delete to authenticated
  using (bucket_id = 'project-files' and (storage.foldername(name))[1] = auth.uid()::text);
