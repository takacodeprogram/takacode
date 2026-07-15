-- TakaCode - Propositions de parcours par les mentors (validees par l'admin)
-- Run this after 013_community_projects.sql
--
-- Un mentor peut CREER/EDITER ses propres propositions (is_pending = true,
-- non publiees). Elles restent invisibles du public tant que l'admin ne les a
-- pas validees. L'admin conserve le controle total (curation des lecons +
-- validation via admin_validate_track).

create schema if not exists internal;

alter table public.learning_tracks
  add column if not exists created_by uuid references auth.users (id) on delete set null,
  add column if not exists is_pending boolean not null default false;

create index if not exists learning_tracks_pending_idx on public.learning_tracks (is_pending);
create index if not exists learning_tracks_created_by_idx on public.learning_tracks (created_by);

create or replace function internal.is_mentor(p_user_id uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select exists (
    select 1 from public.user_profiles p
    where p.id = p_user_id and p.role in ('mentor', 'admin')
  );
$$;

revoke all on function internal.is_mentor(uuid) from public;
grant execute on function internal.is_mentor(uuid) to authenticated;

-- Le mentor gere seulement SES propositions (pending, non publiees).
drop policy if exists learning_tracks_mentor_insert on public.learning_tracks;
create policy learning_tracks_mentor_insert
on public.learning_tracks
for insert
to authenticated
with check (
  internal.is_mentor((select auth.uid()))
  and created_by = (select auth.uid())
  and is_published = false
  and is_pending = true
);

drop policy if exists learning_tracks_mentor_select on public.learning_tracks;
create policy learning_tracks_mentor_select
on public.learning_tracks
for select
to authenticated
using (created_by = (select auth.uid()));

drop policy if exists learning_tracks_mentor_update on public.learning_tracks;
create policy learning_tracks_mentor_update
on public.learning_tracks
for update
to authenticated
using (created_by = (select auth.uid()) and is_pending = true and internal.is_mentor((select auth.uid())))
with check (created_by = (select auth.uid()) and is_pending = true and is_published = false);

drop policy if exists learning_tracks_mentor_delete on public.learning_tracks;
create policy learning_tracks_mentor_delete
on public.learning_tracks
for delete
to authenticated
using (created_by = (select auth.uid()) and is_pending = true and internal.is_mentor((select auth.uid())));

-- Validation par l'admin: publie (approve) ou rejette une proposition.
create or replace function public.admin_validate_track(p_track uuid, p_approve boolean)
returns jsonb
language plpgsql
security definer
set search_path = public, internal, pg_temp
as $$
declare
  v_caller uuid := auth.uid();
begin
  if v_caller is null then
    return jsonb_build_object('error', 'not_authenticated');
  end if;
  if not internal.is_admin(v_caller) then
    return jsonb_build_object('error', 'forbidden');
  end if;

  if p_approve then
    update public.learning_tracks
      set is_pending = false, is_published = true, is_active = true, updated_at = timezone('utc'::text, now())
    where id = p_track and is_pending = true;
    return jsonb_build_object('ok', true, 'published', true);
  end if;

  update public.learning_tracks
    set is_pending = false, is_published = false, is_active = false, updated_at = timezone('utc'::text, now())
  where id = p_track and is_pending = true;
  return jsonb_build_object('ok', true, 'published', false);
end;
$$;

revoke all on function public.admin_validate_track(uuid, boolean) from public;
grant execute on function public.admin_validate_track(uuid, boolean) to authenticated;
