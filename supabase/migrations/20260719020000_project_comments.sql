-- TakaCode - Commentaires sur les projets communautaires
-- Run after 20260719000002_rpcs_repo_public.sql

create table if not exists public.project_comments (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.user_projects(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  content text not null,
  parent_id uuid references public.project_comments(id) on delete cascade, -- pour réponses
  is_flagged boolean not null default false,
  is_hidden boolean not null default false,
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now())
);

create index if not exists project_comments_project_idx on public.project_comments (project_id, created_at desc);
create index if not exists project_comments_user_idx on public.project_comments (user_id);

-- internal.tg_set_updated_at() existe deja
drop trigger if exists trg_project_comments_updated_at on public.project_comments;
create trigger trg_project_comments_updated_at
before update on public.project_comments
for each row
execute function internal.tg_set_updated_at();

alter table public.project_comments enable row level security;

-- Tout le monde peut lire les commentaires non cachés des projets publiés
drop policy if exists project_comments_select on public.project_comments;
create policy project_comments_select
on public.project_comments
for select
using (
  not is_hidden
  and exists (
    select 1 from public.user_projects p
    where p.id = project_comments.project_id
    and p.status = 'published'
  )
);

-- Membres authentifiés peuvent commenter
drop policy if exists project_comments_insert on public.project_comments;
create policy project_comments_insert
on public.project_comments
for insert
to authenticated
with check (
  (select auth.uid()) = user_id
  and exists (
    select 1 from public.user_projects p
    where p.id = project_comments.project_id
    and p.status = 'published'
  )
);

-- Auteur peut modifier/supprimer ses commentaires, admin peut tout faire
drop policy if exists project_comments_update on public.project_comments;
create policy project_comments_update
on public.project_comments
for update
to authenticated
using (
  (select auth.uid()) = user_id
  or internal.is_admin((select auth.uid()))
)
with check (
  (select auth.uid()) = user_id
  or internal.is_admin((select auth.uid()))
);

drop policy if exists project_comments_delete on public.project_comments;
create policy project_comments_delete
on public.project_comments
for delete
to authenticated
using (
  (select auth.uid()) = user_id
  or internal.is_admin((select auth.uid()))
);

grant select on public.project_comments to anon, authenticated;
grant insert, update, delete on public.project_comments to authenticated;

-- RPC: lister les commentaires d'un projet (avec auteur)
create or replace function public.list_project_comments(p_project_id uuid, p_limit integer default 50)
returns jsonb
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select coalesce(jsonb_agg(item order by created_at asc), '[]'::jsonb)
  from (
    select
      jsonb_build_object(
        'id', c.id,
        'project_id', c.project_id,
        'user_id', c.user_id,
        'content', c.content,
        'parent_id', c.parent_id,
        'is_flagged', c.is_flagged,
        'is_hidden', c.is_hidden,
        'created_at', c.created_at,
        'updated_at', c.updated_at,
        'author', case when btrim(up.public_name) = '' then 'Membre anonyme' else up.public_name end,
        'author_avatar', up.avatar_url,
        'author_grade', up.grade
      ) as item,
      -- Expose la date au niveau superieur : l'agregat externe trie dessus.
      -- Sans cette colonne, "order by created_at" dans jsonb_agg echoue
      -- (42703 : la sous-requete ne renvoyait que "item").
      c.created_at
    from public.project_comments c
    join public.user_profiles up on up.id = c.user_id
    where c.project_id = p_project_id
      and c.is_hidden = false
    order by c.created_at asc
    limit greatest(1, least(coalesce(p_limit, 50), 200))
  ) ranked;
$$;

grant execute on function public.list_project_comments(uuid, integer) to anon, authenticated;

-- RPC: créer un commentaire
create or replace function public.create_project_comment(p_project_id uuid, p_content text, p_parent_id uuid default null)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_user_id uuid := auth.uid();
  v_result jsonb;
  v_comment public.project_comments%rowtype;
begin
  if v_user_id is null then
    return jsonb_build_object('error', 'Non authentifié');
  end if;

  if not exists (
    select 1 from public.user_projects
    where id = p_project_id and status = 'published'
  ) then
    return jsonb_build_object('error', 'Projet introuvable ou non publié');
  end if;

  if p_content is null or length(trim(p_content)) = 0 then
    return jsonb_build_object('error', 'Commentaire vide');
  end if;

  if length(p_content) > 5000 then
    return jsonb_build_object('error', 'Commentaire trop long (max 5000 caractères)');
  end if;

  -- En PostgreSQL, RETURNING ne voit que la ligne inseree : impossible d'y
  -- joindre user_profiles. On insere d'abord, puis on compose le JSON.
  insert into public.project_comments (project_id, user_id, content, parent_id)
  values (p_project_id, v_user_id, trim(p_content), p_parent_id)
  returning * into v_comment;

  select jsonb_build_object(
    'id', v_comment.id,
    'project_id', v_comment.project_id,
    'user_id', v_comment.user_id,
    'content', v_comment.content,
    'parent_id', v_comment.parent_id,
    'is_flagged', v_comment.is_flagged,
    'is_hidden', v_comment.is_hidden,
    'created_at', v_comment.created_at,
    'updated_at', v_comment.updated_at,
    'author', case when btrim(up.public_name) = '' then 'Membre anonyme' else up.public_name end,
    'author_avatar', up.avatar_url,
    'author_grade', up.grade
  )
  into v_result
  from public.user_profiles up
  where up.id = v_user_id;

  return coalesce(v_result, jsonb_build_object('error', 'Échec création'));
end;
$$;

grant execute on function public.create_project_comment(uuid, text, uuid) to authenticated;

-- RPC: signaler un commentaire
create or replace function public.flag_project_comment(p_comment_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_user_id uuid := auth.uid();
  v_comment project_comments%rowtype;
begin
  if v_user_id is null then
    return jsonb_build_object('error', 'Non authentifié');
  end if;

  select * into v_comment from public.project_comments where id = p_comment_id;
  if not found then
    return jsonb_build_object('error', 'Commentaire introuvable');
  end if;

  if v_comment.user_id = v_user_id then
    return jsonb_build_object('error', 'Vous ne pouvez pas signaler votre propre commentaire');
  end if;

  update public.project_comments set is_flagged = true where id = p_comment_id;
  return jsonb_build_object('success', true);
end;
$$;

grant execute on function public.flag_project_comment(uuid) to authenticated;

-- RPC: cacher/afficher un commentaire (admin/modérateur)
create or replace function public.moderate_project_comment(p_comment_id uuid, p_hide boolean)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if not internal.is_admin(auth.uid()) then
    return jsonb_build_object('error', 'Non autorisé');
  end if;

  update public.project_comments set is_hidden = p_hide where id = p_comment_id;
  return jsonb_build_object('success', true);
end;
$$;

grant execute on function public.moderate_project_comment(uuid, boolean) to authenticated;