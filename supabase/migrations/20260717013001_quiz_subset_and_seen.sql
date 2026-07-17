-- Suivi des questions deja vues par utilisateur pour le tirage anti-repetition
-- et nouvelle RPC de correction qui utilise la banque de questions normalisee.

-- =============================================================================
-- 1. Table de suivi : questions deja presentees a l'utilisateur
-- =============================================================================

create table if not exists public.user_seen_questions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  question_id uuid not null references public.lesson_quiz_questions(id) on delete cascade,
  seen_count smallint not null default 1,
  last_seen_at timestamptz not null default now(),
  unique(user_id, question_id)
);

alter table public.user_seen_questions enable row level security;

create policy "users manage own seen questions"
  on public.user_seen_questions
  for all
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

grant select, insert, update, delete on public.user_seen_questions to authenticated;

-- =============================================================================
-- 2. Nouvelle RPC : soumission de quiz depuis la banque de questions
-- =============================================================================

create or replace function public.submit_lesson_quiz_from_bank(
  p_lesson_id uuid,
  p_answers jsonb,          -- [{"question_id": "uuid", "answer": 0}, ...]
  p_question_ids uuid[]     -- ordre dans lequel les questions ont ete presentees
)
returns jsonb
language plpgsql
security definer
set search_path = public, internal, pg_temp
as $$
declare
  v_user uuid := auth.uid();
  v_track_id uuid;
  v_lesson_id uuid;
  v_total integer;
  v_score integer := 0;
  v_pass boolean := false;
  v_answer_obj jsonb;
  v_qid uuid;
  v_submitted_answer integer;
  v_expected_answer integer;
  v_explanation text;
  v_feedback jsonb := '[]'::jsonb;
  v_row public.user_lesson_progress%rowtype;
  i integer;
begin
  if v_user is null then
    return jsonb_build_object('error', 'not_authenticated');
  end if;

  -- Verifier que la lecon existe et est publiee
  select l.id, l.module_id into v_lesson_id, v_track_id
  from public.track_lessons l
  where l.id = p_lesson_id and l.is_published = true;

  if v_lesson_id is null then
    return jsonb_build_object('error', 'lesson_not_found');
  end if;

  -- Recuperer le track_id
  select m.track_id into v_track_id
  from public.track_modules m
  where m.id = v_track_id and m.is_published = true;

  if v_track_id is null then
    return jsonb_build_object('error', 'lesson_not_found');
  end if;

  -- Verifier le deverrouillage du module
  if not internal.is_module_unlocked(v_user, v_track_id) then
    return jsonb_build_object('error', 'module_locked');
  end if;

  v_total := coalesce(jsonb_array_length(p_answers), 0);

  if v_total = 0 then
    v_pass := true;
  else
    if p_answers is null or jsonb_typeof(p_answers) <> 'array' then
      return jsonb_build_object('error', 'invalid_answers');
    end if;

    for i in 0 .. v_total - 1 loop
      v_answer_obj := p_answers -> i;

      -- Extraire question_id et answer
      begin
        v_qid := (v_answer_obj ->> 'question_id')::uuid;
      exception when others then
        v_qid := null;
      end;

      v_submitted_answer := coalesce(nullif(v_answer_obj ->> 'answer', '')::integer, -2);

      -- Chercher la bonne reponse dans la banque
      select q.correct_answer, coalesce(q.explanation, '')
      into v_expected_answer, v_explanation
      from public.lesson_quiz_questions q
      where q.id = v_qid and q.lesson_id = p_lesson_id and q.status = 'approved';

      if not found then
        continue;
      end if;

      if v_submitted_answer = v_expected_answer then
        v_score := v_score + 1;
      end if;

      v_feedback := v_feedback || jsonb_build_array(
        jsonb_build_object(
          'correct', v_submitted_answer = v_expected_answer,
          'answer', v_expected_answer,
          'explanation', v_explanation
        )
      );
    end loop;

    v_pass := v_score * 100 >= v_total * 70;
  end if;

  -- Enregistrer la progression
  insert into public.user_lesson_progress (user_id, lesson_id, quiz_score, quiz_total, quiz_passed)
  values (v_user, p_lesson_id, v_score, v_total, v_pass)
  on conflict (user_id, lesson_id) do update
    set quiz_score = greatest(public.user_lesson_progress.quiz_score, excluded.quiz_score),
        quiz_total = excluded.quiz_total,
        quiz_passed = public.user_lesson_progress.quiz_passed or excluded.quiz_passed;

  -- Enregistrer les questions vues (anti-repetition)
  if p_question_ids is not null and array_length(p_question_ids, 1) > 0 then
    insert into public.user_seen_questions (user_id, question_id, seen_count, last_seen_at)
    select v_user, unnest(p_question_ids), 1, now()
    on conflict (user_id, question_id) do update
      set seen_count = public.user_seen_questions.seen_count + 1,
          last_seen_at = now();
  end if;

  perform internal.refresh_lesson_completion(v_user, p_lesson_id);
  perform internal.sync_track_progress(v_user, v_track_id);

  select * into v_row
  from public.user_lesson_progress
  where user_id = v_user and lesson_id = p_lesson_id;

  return jsonb_build_object(
    'score', v_score,
    'total', v_total,
    'passed', v_pass,
    'status', v_row.status,
    'xpAwarded', v_row.xp_awarded,
    'feedback', v_feedback
  );
end;
$$;

revoke all on function public.submit_lesson_quiz_from_bank(uuid, jsonb, uuid[]) from public;
grant execute on function public.submit_lesson_quiz_from_bank(uuid, jsonb, uuid[]) to authenticated;
