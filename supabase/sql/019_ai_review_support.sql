-- TakaCode - Support pour les revues IA
-- Run this after 018_review_progression.sql
--
-- Ajoute review_method sur project_reviews pour tracer l'origine de la revue
-- (ai, peer, mentor, heuristic) et cree submit_ai_review qui contourne
-- le controle de self-review en utilisant un reviewer systeme.

create schema if not exists internal;

-- 1. Colonne review_method sur l'historique des revues
alter table public.project_reviews
  add column if not exists review_method text not null default 'peer'
    check (review_method in ('ai', 'peer', 'mentor', 'heuristic'));

-- 2. UUID systeme pour les revues IA (constant, jamais expose en RLS)
-- On utilise un UUID fixe pour identifier les revues automatiques.
-- Pas de row auth.users : c'est un identifiant factice, pas un vrai user.
create or replace function internal.ai_reviewer_id()
returns uuid
language sql
stable
as $$
  select '00000000-0000-0000-0000-000000000001'::uuid;
$$;

-- 3. RPC pour les revues IA : meme logique que submit_project_review
--    mais sans verification de self-review et avec reviewer_id = systeme.
create or replace function public.submit_ai_review(p_author uuid, p_lesson uuid, p_verdict text, p_comment text)
returns jsonb
language plpgsql
security definer
set search_path = public, internal, pg_temp
as $$
declare
  v_mode text;
  v_track uuid;
  v_comment text := left(btrim(coalesce(p_comment, '')), 2000);
  v_reviewer uuid := internal.ai_reviewer_id();
begin
  if p_verdict not in ('approved', 'changes') then
    return jsonb_build_object('error', 'invalid_verdict');
  end if;

  v_mode := internal.lesson_validation_mode(p_lesson);

  -- Seuls les modes 'ai' et 'mentor' acceptent une revue IA.
  if v_mode not in ('ai', 'mentor') then
    return jsonb_build_object('error', 'not_reviewable');
  end if;

  if not exists (
    select 1 from public.user_lesson_progress
    where user_id = p_author and lesson_id = p_lesson and review_status = 'pending'
  ) then
    return jsonb_build_object('error', 'not_pending');
  end if;

  insert into public.project_reviews (author_id, lesson_id, reviewer_id, verdict, comment, review_method)
  values (p_author, p_lesson, v_reviewer, p_verdict, v_comment, 'ai');

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

  return jsonb_build_object('ok', true, 'verdict', p_verdict, 'feedback', v_comment);
end;
$$;

revoke all on function public.submit_ai_review(uuid, uuid, text, text) from public;
grant execute on function public.submit_ai_review(uuid, uuid, text, text) to authenticated;

-- 4. Mettre a jour les revues peer/mentor existantes avec review_method
update public.project_reviews set review_method = 'peer'
where review_method = 'peer' and reviewer_id <> internal.ai_reviewer_id();

-- 5. RPC pour l'historique des revues (admin only)
create or replace function public.list_review_history(p_limit integer default 50)
returns jsonb
language sql
stable
security definer
set search_path = public, internal, pg_temp
as $$
  select coalesce(jsonb_agg(item order by r.created_at desc), '[]'::jsonb)
  from (
    select
      jsonb_build_object(
        'author_id', r.author_id,
        'author', case when btrim(up.public_name) = '' then 'Membre anonyme' else up.public_name end,
        'avatar_url', up.avatar_url,
        'lesson_id', r.lesson_id,
        'lesson_title', l.title,
        'track_title', t.title,
        'submission', p.project_submission,
        'verdict', r.verdict,
        'comment', r.comment,
        'review_method', r.review_method,
        'reviewer_name', case
          when r.reviewer_id = internal.ai_reviewer_id() then 'IA automatique'
          else case when btrim(rup.public_name) = '' then 'Membre anonyme' else rup.public_name end
        end,
        'created_at', r.created_at
      ) as item
    from public.project_reviews r
    join public.user_profiles up on up.id = r.author_id
    join public.track_lessons l on l.id = r.lesson_id
    join public.track_modules m on m.id = l.module_id
    join public.learning_tracks t on t.id = m.track_id
    left join public.user_lesson_progress p on p.user_id = r.author_id and p.lesson_id = r.lesson_id
    left join public.user_profiles rup on rup.id = r.reviewer_id
    order by r.created_at desc
    limit greatest(1, least(coalesce(p_limit, 50), 200))
  ) ranked;
$$;

revoke all on function public.list_review_history(integer) from public;
grant execute on function public.list_review_history(integer) to authenticated;
