-- TakaCode - Modes de validation des micro-projets + revue (pairs & mentors)
-- Run this after 015_affiliate_links.sql
--
-- micro_project.validation (jsonb) : 'auto' (defaut, heuristique) | 'ai' | 'peer' | 'mentor'.
-- Les modes peer/mentor/ai passent par une revue ; la lecon ne se termine qu'apres
-- approbation. Aucune soumission n'est exposee en masse : tout passe par des RPC.

create schema if not exists internal;

-- 1. Etat de revue sur la progression
alter table public.user_lesson_progress
  add column if not exists review_status text not null default 'none'
    check (review_status in ('none', 'pending', 'changes_requested', 'approved')),
  add column if not exists review_feedback text not null default '';

-- 2. Historique des revues
create table if not exists public.project_reviews (
  id bigint generated always as identity primary key,
  author_id uuid not null references auth.users (id) on delete cascade,
  lesson_id uuid not null references public.track_lessons (id) on delete cascade,
  reviewer_id uuid not null references auth.users (id) on delete cascade,
  verdict text not null check (verdict in ('approved', 'changes')),
  comment text not null default '',
  created_at timestamptz not null default timezone('utc'::text, now())
);

create index if not exists project_reviews_author_idx on public.project_reviews (author_id, lesson_id);
create index if not exists project_reviews_reviewer_idx on public.project_reviews (reviewer_id);

alter table public.project_reviews enable row level security;

drop policy if exists project_reviews_read on public.project_reviews;
create policy project_reviews_read
on public.project_reviews
for select
to authenticated
using (author_id = (select auth.uid()) or reviewer_id = (select auth.uid()) or internal.is_admin((select auth.uid())));

grant select on public.project_reviews to authenticated;

-- 3. Mode de validation d'une lecon
create or replace function internal.lesson_validation_mode(p_lesson uuid)
returns text
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select coalesce(nullif(l.micro_project ->> 'validation', ''), 'auto')
  from public.track_lessons l
  where l.id = p_lesson;
$$;

revoke all on function internal.lesson_validation_mode(uuid) from public;
grant execute on function internal.lesson_validation_mode(uuid) to authenticated;

-- 4. Completion avec gating selon le mode de validation
create or replace function internal.refresh_lesson_completion(p_user_id uuid, p_lesson_id uuid)
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_row public.user_lesson_progress%rowtype;
  v_lesson public.track_lessons%rowtype;
  v_has_quiz boolean;
  v_has_project boolean;
  v_mode text;
  v_project_ok boolean;
  v_done boolean;
begin
  select * into v_lesson from public.track_lessons where id = p_lesson_id;
  select * into v_row from public.user_lesson_progress where user_id = p_user_id and lesson_id = p_lesson_id;

  if v_lesson.id is null or v_row.id is null then
    return;
  end if;

  v_has_quiz := jsonb_array_length(coalesce(v_lesson.quiz, '[]'::jsonb)) > 0;
  v_has_project := coalesce(v_lesson.micro_project ->> 'title', '') <> '';
  v_mode := coalesce(nullif(v_lesson.micro_project ->> 'validation', ''), 'auto');

  v_project_ok := (not v_has_project)
    or (v_mode = 'auto' and v_row.project_submitted_at is not null)
    or (v_mode <> 'auto' and v_row.review_status = 'approved');

  v_done := (not v_has_quiz or v_row.quiz_passed) and v_project_ok;

  if v_done and v_row.status <> 'completed' then
    update public.user_lesson_progress
      set status = 'completed', completed_at = timezone('utc'::text, now())
    where id = v_row.id;

    if v_row.xp_awarded = 0 and v_lesson.xp_reward > 0 then
      update public.user_lesson_progress set xp_awarded = v_lesson.xp_reward where id = v_row.id;
      update public.user_profiles set points = points + v_lesson.xp_reward where id = p_user_id;
    end if;
  end if;
end;
$$;

revoke all on function internal.refresh_lesson_completion(uuid, uuid) from public;

-- 5. Soumission du micro-projet (selon le mode)
create or replace function public.submit_lesson_project(p_lesson_id uuid, p_submission text)
returns jsonb
language plpgsql
security definer
set search_path = public, internal, pg_temp
as $$
declare
  v_user uuid := auth.uid();
  v_lesson public.track_lessons%rowtype;
  v_track_id uuid;
  v_submission text := btrim(coalesce(p_submission, ''));
  v_mode text;
  v_row public.user_lesson_progress%rowtype;
begin
  if v_user is null then
    return jsonb_build_object('error', 'not_authenticated');
  end if;
  if length(v_submission) < 20 then
    return jsonb_build_object('error', 'submission_too_short');
  end if;
  if length(v_submission) > 5000 then
    return jsonb_build_object('error', 'submission_too_long');
  end if;

  select l.* into v_lesson from public.track_lessons l where l.id = p_lesson_id and l.is_published = true;
  if v_lesson.id is null then
    return jsonb_build_object('error', 'lesson_not_found');
  end if;

  select m.track_id into v_track_id from public.track_modules m where m.id = v_lesson.module_id and m.is_published = true;
  if v_track_id is null then
    return jsonb_build_object('error', 'lesson_not_found');
  end if;

  if not internal.is_module_unlocked(v_user, v_lesson.module_id) then
    return jsonb_build_object('error', 'module_locked');
  end if;

  v_mode := coalesce(nullif(v_lesson.micro_project ->> 'validation', ''), 'auto');

  -- Heuristique: certaines taches exigent un lien.
  if v_mode = 'auto' and coalesce(v_lesson.micro_project ->> 'requires_link', '') = 'true' and v_submission !~* 'https?://' then
    return jsonb_build_object('error', 'link_required');
  end if;

  insert into public.user_lesson_progress (user_id, lesson_id, project_submission, project_submitted_at)
  values (v_user, p_lesson_id, v_submission, timezone('utc'::text, now()))
  on conflict (user_id, lesson_id) do update
    set project_submission = excluded.project_submission,
        project_submitted_at = timezone('utc'::text, now());

  -- Modes de revue: passe en attente (sauf deja approuve).
  if v_mode in ('peer', 'mentor', 'ai') then
    update public.user_lesson_progress
      set review_status = case when review_status = 'approved' then 'approved' else 'pending' end
    where user_id = v_user and lesson_id = p_lesson_id;
  end if;

  perform internal.refresh_lesson_completion(v_user, p_lesson_id);
  perform internal.sync_track_progress(v_user, v_track_id);

  select * into v_row from public.user_lesson_progress where user_id = v_user and lesson_id = p_lesson_id;

  return jsonb_build_object(
    'submitted', true,
    'status', v_row.status,
    'reviewStatus', v_row.review_status,
    'validation', v_mode,
    'xpAwarded', v_row.xp_awarded
  );
end;
$$;

revoke all on function public.submit_lesson_project(uuid, text) from public;
grant execute on function public.submit_lesson_project(uuid, text) to authenticated;

-- 6. File de revue pour l'appelant (selon son role/tier)
create or replace function public.list_review_queue(p_limit integer default 30)
returns jsonb
language sql
stable
security definer
set search_path = public, internal, pg_temp
as $$
  with caller as (
    select auth.uid() as uid, (select role from public.user_profiles where id = auth.uid()) as role
  )
  select coalesce(jsonb_agg(item order by submitted_at asc), '[]'::jsonb)
  from (
    select
      p.project_submitted_at as submitted_at,
      jsonb_build_object(
        'author_id', p.user_id,
        'author', case when btrim(up.public_name) = '' then 'Membre anonyme' else up.public_name end,
        'avatar_url', up.avatar_url,
        'lesson_id', l.id,
        'lesson_title', l.title,
        'track_title', t.title,
        'submission', p.project_submission,
        'brief', coalesce(l.micro_project ->> 'brief', ''),
        'validation', coalesce(nullif(l.micro_project ->> 'validation', ''), 'auto'),
        'submitted_at', p.project_submitted_at
      ) as item
    from caller c
    join public.user_lesson_progress p on p.review_status = 'pending' and p.user_id <> c.uid
    join public.track_lessons l on l.id = p.lesson_id
    join public.track_modules m on m.id = l.module_id
    join public.learning_tracks t on t.id = m.track_id
    join public.user_profiles up on up.id = p.user_id
    where (
      coalesce(nullif(l.micro_project ->> 'validation', ''), 'auto') = 'peer'
      or (c.role in ('mentor', 'admin') and coalesce(nullif(l.micro_project ->> 'validation', ''), 'auto') in ('mentor', 'ai'))
    )
    and not exists (
      select 1 from public.project_reviews r
      where r.author_id = p.user_id and r.lesson_id = l.id and r.reviewer_id = c.uid
    )
    order by p.project_submitted_at asc
    limit greatest(1, least(coalesce(p_limit, 30), 50))
  ) ranked;
$$;

revoke all on function public.list_review_queue(integer) from public;
grant execute on function public.list_review_queue(integer) to authenticated;

-- 7. Soumettre une revue (verdict + commentaire)
create or replace function public.submit_project_review(p_author uuid, p_lesson uuid, p_verdict text, p_comment text)
returns jsonb
language plpgsql
security definer
set search_path = public, internal, pg_temp
as $$
declare
  v_reviewer uuid := auth.uid();
  v_role text;
  v_mode text;
  v_track uuid;
  v_comment text := left(btrim(coalesce(p_comment, '')), 2000);
begin
  if v_reviewer is null then
    return jsonb_build_object('error', 'not_authenticated');
  end if;
  if v_reviewer = p_author then
    return jsonb_build_object('error', 'cannot_review_self');
  end if;
  if p_verdict not in ('approved', 'changes') then
    return jsonb_build_object('error', 'invalid_verdict');
  end if;
  if p_verdict = 'changes' and length(v_comment) < 5 then
    return jsonb_build_object('error', 'comment_required');
  end if;

  select role into v_role from public.user_profiles where id = v_reviewer;
  v_mode := internal.lesson_validation_mode(p_lesson);

  if v_mode = 'peer' then
    null; -- tout membre peut revoir un micro-projet peer
  elsif v_mode in ('mentor', 'ai') then
    if v_role not in ('mentor', 'admin') then
      return jsonb_build_object('error', 'forbidden');
    end if;
  else
    return jsonb_build_object('error', 'not_reviewable');
  end if;

  if not exists (
    select 1 from public.user_lesson_progress
    where user_id = p_author and lesson_id = p_lesson and review_status = 'pending'
  ) then
    return jsonb_build_object('error', 'not_pending');
  end if;

  insert into public.project_reviews (author_id, lesson_id, reviewer_id, verdict, comment)
  values (p_author, p_lesson, v_reviewer, p_verdict, v_comment);

  if p_verdict = 'approved' then
    update public.user_lesson_progress
      set review_status = 'approved', review_feedback = v_comment
    where user_id = p_author and lesson_id = p_lesson;

    select m.track_id into v_track from public.track_lessons l join public.track_modules m on m.id = l.module_id where l.id = p_lesson;
    perform internal.refresh_lesson_completion(p_author, p_lesson);
    if v_track is not null then
      perform internal.sync_track_progress(p_author, v_track);
    end if;
  else
    update public.user_lesson_progress
      set review_status = 'changes_requested', review_feedback = v_comment
    where user_id = p_author and lesson_id = p_lesson;
  end if;

  -- Petite recompense au relecteur (incitation facon ALX).
  update public.user_profiles set points = points + 10 where id = v_reviewer;

  return jsonb_build_object('ok', true, 'verdict', p_verdict);
end;
$$;

revoke all on function public.submit_project_review(uuid, uuid, text, text) from public;
grant execute on function public.submit_project_review(uuid, uuid, text, text) to authenticated;
