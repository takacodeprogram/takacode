-- TakaCode - Revue des micro-projets : la soumission debloque la progression
-- Run this after 016_project_reviews.sql (017 = dedupe affiliation, independant).
--
-- Avant: un micro-projet en mode peer/mentor/ai bloquait le module suivant
-- jusqu'a l'approbation. Desormais la SOUMISSION suffit a franchir la lecon et
-- debloquer la suite ; l'XP et la validation finale (status='completed') restent
-- conditionnes a l'approbation de la revue (voir refresh_lesson_completion de 016).

create schema if not exists internal;

-- 1. "Lecon franchie pour la progression" : quiz reussi (si present) + micro-projet
--    soumis (si present). Independant de l'etat de revue. C'est ce gate qui debloque
--    le module suivant, pas la completion finale.
create or replace function internal.lesson_cleared(p_user_id uuid, p_lesson_id uuid)
returns boolean
language plpgsql
stable
security definer
set search_path = public, pg_temp
as $$
declare
  v_lesson public.track_lessons%rowtype;
  v_row public.user_lesson_progress%rowtype;
  v_has_quiz boolean;
  v_has_project boolean;
begin
  select * into v_lesson from public.track_lessons where id = p_lesson_id;
  if v_lesson.id is null then
    return false;
  end if;

  select * into v_row from public.user_lesson_progress
  where user_id = p_user_id and lesson_id = p_lesson_id;
  if v_row.id is null then
    return false;
  end if;

  -- Deja completee = franchie.
  if v_row.status = 'completed' then
    return true;
  end if;

  v_has_quiz := jsonb_array_length(coalesce(v_lesson.quiz, '[]'::jsonb)) > 0;
  v_has_project := coalesce(v_lesson.micro_project ->> 'title', '') <> '';

  return (not v_has_quiz or v_row.quiz_passed)
     and (not v_has_project or v_row.project_submitted_at is not null);
end;
$$;

revoke all on function internal.lesson_cleared(uuid, uuid) from public;
grant execute on function internal.lesson_cleared(uuid, uuid) to authenticated;

-- 2. Deblocage de module base sur "franchie" et non "completee".
--    Un module s'ouvre des que toutes les lecons publiees des modules precedents
--    sont franchies (soumises), meme si une revue est encore en attente.
create or replace function internal.is_module_unlocked(p_user_id uuid, p_module_id uuid)
returns boolean
language plpgsql
stable
security definer
set search_path = public, pg_temp
as $$
declare
  v_track_id uuid;
  v_sort integer;
  v_created timestamptz;
begin
  select track_id, sort_order, created_at
    into v_track_id, v_sort, v_created
  from public.track_modules
  where id = p_module_id;

  if v_track_id is null then
    return false;
  end if;

  return not exists (
    select 1
    from public.track_modules m2
    join public.track_lessons l2 on l2.module_id = m2.id and l2.is_published = true
    where m2.track_id = v_track_id
      and m2.is_published = true
      and (
        m2.sort_order < v_sort
        or (m2.sort_order = v_sort and m2.created_at < v_created)
      )
      and not internal.lesson_cleared(p_user_id, l2.id)
  );
end;
$$;

revoke all on function internal.is_module_unlocked(uuid, uuid) from public;
grant execute on function internal.is_module_unlocked(uuid, uuid) to authenticated;
