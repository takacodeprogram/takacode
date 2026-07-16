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
-- Monte TOUS les projets soumis avec la boucle complete de reviews :
-- chaque soumission avec toutes ses reviews (IA, pairs, mentor),
-- le nombre de demandes d'amelioration, et le statut final.
create or replace function public.list_review_history(p_limit integer default 50)
returns jsonb
language sql
stable
security definer
set search_path = public, internal, pg_temp
as $$
  with submissions as (
    -- 1. Tous les projets soumis (une ligne par soumission)
    select
      p.user_id as author_id,
      p.lesson_id,
      p.project_submission,
      p.review_status,
      p.review_feedback,
      p.project_submitted_at
    from public.user_lesson_progress p
    where p.project_submitted_at is not null
  ),
  reviews_agg as (
    -- 2. Aggregate les reviews pour chaque soumission
    select
      s.author_id,
      s.lesson_id,
      s.project_submission,
      s.review_status,
      s.review_feedback,
      s.project_submitted_at,
      -- Compter les reviews et les ameliorations
      coalesce(r_agg.total_reviews, 0) as total_reviews,
      coalesce(r_agg.improvement_count, 0) as improvement_count,
      coalesce(r_agg.review_validated, false) as review_validated,
      -- Derniere review
      r_agg.last_verdict,
      r_agg.last_comment,
      r_agg.last_review_method,
      r_agg.last_reviewer_name,
      r_agg.last_reviewed_at,
      -- Est-ce valide (une seule validation suffit)
      r_agg.review_validated,
      -- Toutes les reviews (tableau JSON)
      coalesce(r_agg.all_reviews, '[]'::jsonb) as all_reviews
    from submissions s
    left join (
      select
        r.author_id,
        r.lesson_id,
        count(*) as total_reviews,
        count(*) filter (where r.verdict = 'changes') as improvement_count,
        -- Une seule validation suffit : si au moins un verdict = 'approved', c'est valide
        (count(*) filter (where r.verdict = 'approved') > 0) as review_validated,
        (array_agg(r.verdict order by r.created_at desc))[1] as last_verdict,
        (array_agg(r.comment order by r.created_at desc))[1] as last_comment,
        (array_agg(r.review_method order by r.created_at desc))[1] as last_review_method,
        (array_agg(
          case
            when r.reviewer_id = internal.ai_reviewer_id() then 'IA automatique'
            else coalesce(nullif(btrim((select up2.public_name from public.user_profiles up2 where up2.id = r.reviewer_id)), ''), 'Membre anonyme')
          end
          order by r.created_at desc
        ))[1] as last_reviewer_name,
        (array_agg(r.created_at order by r.created_at desc))[1] as last_reviewed_at,
        -- Construire le tableau de toutes les reviews
        coalesce(jsonb_agg(
          jsonb_build_object(
            'verdict', r.verdict,
            'comment', r.comment,
            'review_method', r.review_method,
            'reviewer_name', case
              when r.reviewer_id = internal.ai_reviewer_id() then 'IA automatique'
              else coalesce(nullif(btrim((select up2.public_name from public.user_profiles up2 where up2.id = r.reviewer_id)), ''), 'Membre anonyme')
            end,
            'created_at', r.created_at
          ) order by r.created_at asc
        ), '[]'::jsonb) as all_reviews
      from public.project_reviews r
      group by r.author_id, r.lesson_id
    ) r_agg on r_agg.author_id = s.author_id and r_agg.lesson_id = s.lesson_id
  )
  select coalesce(jsonb_agg(item), '[]'::jsonb)
  from (
    select
      jsonb_build_object(
        'author_id', ra.author_id,
        'author', case when btrim(up.public_name) = '' then 'Membre anonyme' else up.public_name end,
        'avatar_url', up.avatar_url,
        'lesson_id', ra.lesson_id,
        'lesson_title', l.title,
        'track_title', t.title,
        'submission', ra.project_submission,
        'review_status', ra.review_status,
        'review_feedback', ra.review_feedback,
        'total_reviews', ra.total_reviews,
        'improvement_count', ra.improvement_count,
        'is_validated', ra.review_validated,
        'last_verdict', ra.last_verdict,
        'last_comment', ra.last_comment,
        'last_review_method', ra.last_review_method,
        'last_reviewer_name', ra.last_reviewer_name,
        'last_reviewed_at', ra.last_reviewed_at,
        'all_reviews', ra.all_reviews,
        'submitted_at', ra.project_submitted_at
      ) as item
    from reviews_agg ra
    join public.user_profiles up on up.id = ra.author_id
    join public.track_lessons l on l.id = ra.lesson_id
    join public.track_modules m on m.id = l.module_id
    join public.learning_tracks t on t.id = m.track_id
    order by ra.project_submitted_at desc
    limit greatest(1, least(coalesce(p_limit, 50), 200))
  ) ranked;
$$;

revoke all on function public.list_review_history(integer) from public;
grant execute on function public.list_review_history(integer) to authenticated;
