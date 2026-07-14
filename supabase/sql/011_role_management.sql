-- TakaCode - Gestion des roles securisee + journal d'audit
-- Run this after 010_live_sessions.sql
--
-- Les changements de role passent par une RPC security definer qui:
--  - verifie que l'appelant est admin,
--  - interdit de changer son propre role (anti auto-blocage),
--  - empeche de retirer le dernier admin,
--  - journalise chaque changement (role_audit).

create schema if not exists internal;

create table if not exists public.role_audit (
  id bigint generated always as identity primary key,
  actor_id uuid references auth.users (id) on delete set null,
  target_id uuid references auth.users (id) on delete set null,
  old_role text not null,
  new_role text not null,
  created_at timestamptz not null default timezone('utc'::text, now())
);

create index if not exists role_audit_target_idx on public.role_audit (target_id, created_at desc);

alter table public.role_audit enable row level security;

drop policy if exists role_audit_admin_read on public.role_audit;
create policy role_audit_admin_read
on public.role_audit
for select
to authenticated
using (internal.is_admin((select auth.uid())));

grant select on public.role_audit to authenticated;

create or replace function public.admin_set_user_role(p_target uuid, p_role text)
returns jsonb
language plpgsql
security definer
set search_path = public, internal, pg_temp
as $$
declare
  v_caller uuid := auth.uid();
  v_old text;
  v_admin_count integer;
begin
  if v_caller is null then
    return jsonb_build_object('error', 'not_authenticated');
  end if;

  if not internal.is_admin(v_caller) then
    return jsonb_build_object('error', 'forbidden');
  end if;

  if p_role not in ('user', 'mentor', 'admin') then
    return jsonb_build_object('error', 'invalid_role');
  end if;

  if p_target = v_caller then
    return jsonb_build_object('error', 'cannot_change_self');
  end if;

  select role into v_old from public.user_profiles where id = p_target;
  if v_old is null then
    return jsonb_build_object('error', 'user_not_found');
  end if;

  if v_old = p_role then
    return jsonb_build_object('ok', true, 'old_role', v_old, 'new_role', p_role, 'unchanged', true);
  end if;

  -- Ne jamais retirer le dernier admin.
  if v_old = 'admin' and p_role <> 'admin' then
    select count(*) into v_admin_count from public.user_profiles where role = 'admin';
    if v_admin_count <= 1 then
      return jsonb_build_object('error', 'last_admin');
    end if;
  end if;

  update public.user_profiles set role = p_role where id = p_target;

  insert into public.role_audit (actor_id, target_id, old_role, new_role)
  values (v_caller, p_target, v_old, p_role);

  return jsonb_build_object('ok', true, 'old_role', v_old, 'new_role', p_role);
end;
$$;

revoke all on function public.admin_set_user_role(uuid, text) from public;
grant execute on function public.admin_set_user_role(uuid, text) to authenticated;
