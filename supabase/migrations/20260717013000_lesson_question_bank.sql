-- Banque de questions coherente avec les objectifs et ressources des lecons.
-- Les corrections restent privees. Edition reservee aux admins et au mentor
-- proprietaire du parcours tant que ses droits sur le parcours sont valides.

create or replace function internal.can_edit_lesson_content(p_user_id uuid, p_lesson_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public, internal, pg_temp
as $$
  select coalesce(
    internal.is_admin(p_user_id)
    or exists (
      select 1
      from public.track_lessons lesson
      join public.track_modules module on module.id = lesson.module_id
      join public.learning_tracks track on track.id = module.track_id
      where lesson.id = p_lesson_id
        and track.created_by = p_user_id
        and internal.is_mentor(p_user_id)
    ),
    false
  );
$$;

revoke all on function internal.can_edit_lesson_content(uuid, uuid) from public;
grant execute on function internal.can_edit_lesson_content(uuid, uuid) to authenticated;

create or replace function internal.can_edit_track_content(p_user_id uuid, p_track_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public, internal, pg_temp
as $$
  select coalesce(
    internal.is_admin(p_user_id)
    or exists (
      select 1
      from public.learning_tracks track
      where track.id = p_track_id
        and track.created_by = p_user_id
        and internal.is_mentor(p_user_id)
    ),
    false
  );
$$;

revoke all on function internal.can_edit_track_content(uuid, uuid) from public;
grant execute on function internal.can_edit_track_content(uuid, uuid) to authenticated;

drop policy if exists track_modules_owner_manage on public.track_modules;
create policy track_modules_owner_manage
on public.track_modules
for all
to authenticated
using (internal.can_edit_track_content((select auth.uid()), track_id))
with check (internal.can_edit_track_content((select auth.uid()), track_id));

drop policy if exists track_lessons_owner_manage on public.track_lessons;
create policy track_lessons_owner_manage
on public.track_lessons
for all
to authenticated
using (internal.can_edit_lesson_content((select auth.uid()), id))
with check (
  exists (
    select 1
    from public.track_modules module
    where module.id = module_id
      and internal.can_edit_track_content((select auth.uid()), module.track_id)
  )
);

create table if not exists public.lesson_quiz_questions (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null references public.track_lessons(id) on delete cascade,
  prompt text not null check (char_length(btrim(prompt)) between 8 and 1000),
  choices jsonb not null check (
    jsonb_typeof(choices) = 'array'
    and jsonb_array_length(choices) between 2 and 6
  ),
  correct_answer smallint not null check (
    correct_answer >= 0
    and correct_answer < jsonb_array_length(choices)
  ),
  explanation text not null default '' check (char_length(explanation) <= 3000),
  objective text not null default '' check (char_length(objective) <= 500),
  resource_url text not null default '' check (resource_url = '' or resource_url ~ '^https://' or resource_url ~ '^/'),
  difficulty text not null default 'standard' check (difficulty in ('foundation', 'standard', 'challenge')),
  source text not null default 'manual' check (source in ('manual', 'ai', 'legacy')),
  status text not null default 'draft' check (status in ('draft', 'approved', 'archived')),
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now())
);

create index if not exists lesson_quiz_questions_lesson_status_idx
  on public.lesson_quiz_questions (lesson_id, status, difficulty, created_at);

alter table public.lesson_quiz_questions enable row level security;

alter table public.lesson_quiz_questions
  drop constraint if exists lesson_quiz_questions_resource_url_check;
alter table public.lesson_quiz_questions
  add constraint lesson_quiz_questions_resource_url_check
  check (resource_url = '' or resource_url ~ '^https://' or resource_url ~ '^/');

drop policy if exists lesson_quiz_questions_editor_select on public.lesson_quiz_questions;
create policy lesson_quiz_questions_editor_select
on public.lesson_quiz_questions
for select
to authenticated
using (internal.can_edit_lesson_content((select auth.uid()), lesson_id));

drop policy if exists lesson_quiz_questions_editor_insert on public.lesson_quiz_questions;
create policy lesson_quiz_questions_editor_insert
on public.lesson_quiz_questions
for insert
to authenticated
with check (
  internal.can_edit_lesson_content((select auth.uid()), lesson_id)
  and created_by = (select auth.uid())
);

drop policy if exists lesson_quiz_questions_editor_update on public.lesson_quiz_questions;
create policy lesson_quiz_questions_editor_update
on public.lesson_quiz_questions
for update
to authenticated
using (internal.can_edit_lesson_content((select auth.uid()), lesson_id))
with check (
  internal.can_edit_lesson_content((select auth.uid()), lesson_id)
  and updated_by = (select auth.uid())
);

drop policy if exists lesson_quiz_questions_editor_delete on public.lesson_quiz_questions;
create policy lesson_quiz_questions_editor_delete
on public.lesson_quiz_questions
for delete
to authenticated
using (internal.can_edit_lesson_content((select auth.uid()), lesson_id));

grant select, insert, update, delete on public.lesson_quiz_questions to authenticated;

drop trigger if exists trg_lesson_quiz_questions_updated_at on public.lesson_quiz_questions;
create trigger trg_lesson_quiz_questions_updated_at
before update on public.lesson_quiz_questions
for each row execute function internal.tg_set_updated_at();

-- Reprise idempotente des quiz historiques. La premiere ressource et le premier
-- objectif servent de rattachement initial ; l'editeur pourra ensuite les affiner.
insert into public.lesson_quiz_questions (
  lesson_id,
  prompt,
  choices,
  correct_answer,
  explanation,
  objective,
  resource_url,
  difficulty,
  source,
  status,
  created_by
)
select
  lesson.id,
  coalesce(nullif(btrim(question.item ->> 'q'), ''), nullif(btrim(question.item ->> 'question'), '')),
  question.item -> 'choices',
  (question.item ->> 'answer')::smallint,
  coalesce(question.item ->> 'explanation', ''),
  coalesce(lesson.objectives ->> 0, ''),
  coalesce(lesson.resources -> 0 ->> 'url', ''),
  'standard',
  'legacy',
  'approved',
  track.created_by
from public.track_lessons lesson
join public.track_modules module on module.id = lesson.module_id
join public.learning_tracks track on track.id = module.track_id
cross join lateral jsonb_array_elements(coalesce(lesson.quiz, '[]'::jsonb)) with ordinality as question(item, position)
where jsonb_typeof(question.item -> 'choices') = 'array'
  and jsonb_array_length(question.item -> 'choices') between 2 and 6
  and coalesce(question.item ->> 'q', question.item ->> 'question', '') <> ''
  and (question.item ->> 'answer') ~ '^[0-9]+$'
  and (question.item ->> 'answer')::integer < jsonb_array_length(question.item -> 'choices')
  and not exists (
    select 1
    from public.lesson_quiz_questions existing
    where existing.lesson_id = lesson.id
      and existing.prompt = coalesce(nullif(btrim(question.item ->> 'q'), ''), nullif(btrim(question.item ->> 'question'), ''))
  );
