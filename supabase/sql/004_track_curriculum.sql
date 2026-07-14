-- TakaCode - Curriculum: modules, lecons, quiz, micro projets, progression et XP
-- Run this after 003_learning_tracks.sql

create schema if not exists internal;
create extension if not exists pgcrypto;

-- =============================================================================
-- 1. Tables
-- =============================================================================

create table if not exists public.track_modules (
  id uuid primary key default gen_random_uuid(),
  track_id uuid not null references public.learning_tracks (id) on delete cascade,
  slug text not null,
  title text not null,
  summary text not null default '',
  sort_order integer not null default 100,
  is_published boolean not null default true,
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now()),
  unique (track_id, slug)
);

create table if not exists public.track_lessons (
  id uuid primary key default gen_random_uuid(),
  module_id uuid not null references public.track_modules (id) on delete cascade,
  slug text not null,
  title text not null,
  intro text not null default '',
  why_important text not null default '',
  how_to_use text not null default '',
  objectives jsonb not null default '[]'::jsonb check (jsonb_typeof(objectives) = 'array'),
  resources jsonb not null default '[]'::jsonb check (jsonb_typeof(resources) = 'array'),
  quiz jsonb not null default '[]'::jsonb check (jsonb_typeof(quiz) = 'array'),
  micro_project jsonb not null default '{}'::jsonb check (jsonb_typeof(micro_project) = 'object'),
  xp_reward integer not null default 50 check (xp_reward >= 0),
  duration_minutes integer not null default 45 check (duration_minutes > 0),
  sort_order integer not null default 100,
  is_published boolean not null default true,
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now()),
  unique (module_id, slug)
);

create table if not exists public.user_lesson_progress (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  lesson_id uuid not null references public.track_lessons (id) on delete cascade,
  quiz_score integer not null default 0,
  quiz_total integer not null default 0,
  quiz_passed boolean not null default false,
  project_submission text not null default '',
  project_submitted_at timestamptz,
  status text not null default 'in_progress' check (status in ('in_progress', 'completed')),
  completed_at timestamptz,
  xp_awarded integer not null default 0,
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now()),
  unique (user_id, lesson_id)
);

create index if not exists track_modules_track_idx on public.track_modules (track_id, sort_order);
create index if not exists track_lessons_module_idx on public.track_lessons (module_id, sort_order);
create index if not exists user_lesson_progress_user_idx on public.user_lesson_progress (user_id, updated_at desc);
create index if not exists user_lesson_progress_lesson_idx on public.user_lesson_progress (lesson_id);

create or replace function internal.tg_set_updated_at()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  new.updated_at := timezone('utc'::text, now());
  return new;
end;
$$;

revoke all on function internal.tg_set_updated_at() from public;

drop trigger if exists trg_track_modules_updated_at on public.track_modules;
create trigger trg_track_modules_updated_at
before update on public.track_modules
for each row
execute function internal.tg_set_updated_at();

drop trigger if exists trg_track_lessons_updated_at on public.track_lessons;
create trigger trg_track_lessons_updated_at
before update on public.track_lessons
for each row
execute function internal.tg_set_updated_at();

drop trigger if exists trg_user_lesson_progress_updated_at on public.user_lesson_progress;
create trigger trg_user_lesson_progress_updated_at
before update on public.user_lesson_progress
for each row
execute function internal.tg_set_updated_at();

-- =============================================================================
-- 2. RLS
-- =============================================================================

alter table public.track_modules enable row level security;
alter table public.track_lessons enable row level security;
alter table public.user_lesson_progress enable row level security;

drop policy if exists track_modules_public_read on public.track_modules;
create policy track_modules_public_read
on public.track_modules
for select
to anon, authenticated
using (
  is_published = true
  and exists (
    select 1
    from public.learning_tracks t
    where t.id = track_id
      and t.is_published = true
      and t.is_active = true
  )
);

drop policy if exists track_modules_admin_all on public.track_modules;
create policy track_modules_admin_all
on public.track_modules
for all
to authenticated
using (internal.is_admin((select auth.uid())))
with check (internal.is_admin((select auth.uid())));

drop policy if exists track_lessons_public_read on public.track_lessons;
create policy track_lessons_public_read
on public.track_lessons
for select
to anon, authenticated
using (
  is_published = true
  and exists (
    select 1
    from public.track_modules m
    join public.learning_tracks t on t.id = m.track_id
    where m.id = module_id
      and m.is_published = true
      and t.is_published = true
      and t.is_active = true
  )
);

drop policy if exists track_lessons_admin_all on public.track_lessons;
create policy track_lessons_admin_all
on public.track_lessons
for all
to authenticated
using (internal.is_admin((select auth.uid())))
with check (internal.is_admin((select auth.uid())));

drop policy if exists user_lesson_progress_select_self_or_admin on public.user_lesson_progress;
create policy user_lesson_progress_select_self_or_admin
on public.user_lesson_progress
for select
to authenticated
using ((select auth.uid()) = user_id or internal.is_admin((select auth.uid())));

grant select on public.track_modules to anon, authenticated;
grant select on public.track_lessons to anon, authenticated;
grant insert, update, delete on public.track_modules to authenticated;
grant insert, update, delete on public.track_lessons to authenticated;
grant select on public.user_lesson_progress to authenticated;

-- Les ecritures de progression passent uniquement par les RPC security definer.

-- =============================================================================
-- 3. Fonctions internes (deblocage, completion, sync progression)
-- =============================================================================

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
    left join public.user_lesson_progress p
      on p.user_id = p_user_id
     and p.lesson_id = l2.id
     and p.status = 'completed'
    where m2.track_id = v_track_id
      and m2.is_published = true
      and (
        m2.sort_order < v_sort
        or (m2.sort_order = v_sort and m2.created_at < v_created)
      )
      and p.id is null
  );
end;
$$;

revoke all on function internal.is_module_unlocked(uuid, uuid) from public;

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
  v_done boolean;
begin
  select * into v_lesson from public.track_lessons where id = p_lesson_id;
  select * into v_row from public.user_lesson_progress where user_id = p_user_id and lesson_id = p_lesson_id;

  if v_lesson.id is null or v_row.id is null then
    return;
  end if;

  v_has_quiz := jsonb_array_length(coalesce(v_lesson.quiz, '[]'::jsonb)) > 0;
  v_has_project := coalesce(v_lesson.micro_project ->> 'title', '') <> '';

  v_done := (not v_has_quiz or v_row.quiz_passed)
    and (not v_has_project or v_row.project_submitted_at is not null);

  if v_done and v_row.status <> 'completed' then
    update public.user_lesson_progress
      set status = 'completed',
          completed_at = timezone('utc'::text, now())
    where id = v_row.id;

    if v_row.xp_awarded = 0 and v_lesson.xp_reward > 0 then
      update public.user_lesson_progress
        set xp_awarded = v_lesson.xp_reward
      where id = v_row.id;

      update public.user_profiles
        set points = points + v_lesson.xp_reward
      where id = p_user_id;
    end if;
  end if;
end;
$$;

revoke all on function internal.refresh_lesson_completion(uuid, uuid) from public;

create or replace function internal.sync_track_progress(p_user_id uuid, p_track_id uuid)
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_total integer;
  v_done integer;
  v_progress integer;
  v_status text;
begin
  select
    count(*),
    count(*) filter (where p.status = 'completed')
    into v_total, v_done
  from public.track_lessons l
  join public.track_modules m on m.id = l.module_id and m.is_published = true
  left join public.user_lesson_progress p
    on p.user_id = p_user_id and p.lesson_id = l.id
  where m.track_id = p_track_id
    and l.is_published = true;

  if coalesce(v_total, 0) = 0 then
    return;
  end if;

  v_progress := floor((v_done::numeric / v_total::numeric) * 100);
  v_status := case when v_done >= v_total then 'completed' else 'in_progress' end;

  insert into public.user_track_enrollments (user_id, track_id, status, progress)
  values (p_user_id, p_track_id, v_status, v_progress)
  on conflict (user_id, track_id) do update
    set status = excluded.status,
        progress = excluded.progress;
end;
$$;

revoke all on function internal.sync_track_progress(uuid, uuid) from public;

-- =============================================================================
-- 4. RPC publiques (validation quiz + soumission micro projet)
-- =============================================================================

create or replace function public.submit_lesson_quiz(p_lesson_id uuid, p_answers jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public, internal, pg_temp
as $$
declare
  v_user uuid := auth.uid();
  v_lesson public.track_lessons%rowtype;
  v_track_id uuid;
  v_quiz jsonb;
  v_total integer;
  v_score integer := 0;
  v_pass boolean := false;
  v_expected integer;
  v_answer integer;
  v_row public.user_lesson_progress%rowtype;
  v_feedback jsonb := '[]'::jsonb;
  i integer;
begin
  if v_user is null then
    return jsonb_build_object('error', 'not_authenticated');
  end if;

  select l.* into v_lesson
  from public.track_lessons l
  where l.id = p_lesson_id and l.is_published = true;

  if v_lesson.id is null then
    return jsonb_build_object('error', 'lesson_not_found');
  end if;

  select m.track_id into v_track_id
  from public.track_modules m
  where m.id = v_lesson.module_id and m.is_published = true;

  if v_track_id is null then
    return jsonb_build_object('error', 'lesson_not_found');
  end if;

  if not internal.is_module_unlocked(v_user, v_lesson.module_id) then
    return jsonb_build_object('error', 'module_locked');
  end if;

  v_quiz := coalesce(v_lesson.quiz, '[]'::jsonb);
  v_total := jsonb_array_length(v_quiz);

  if v_total = 0 then
    v_pass := true;
  else
    if p_answers is null or jsonb_typeof(p_answers) <> 'array' or jsonb_array_length(p_answers) <> v_total then
      return jsonb_build_object('error', 'invalid_answers');
    end if;

    for i in 0 .. v_total - 1 loop
      v_expected := coalesce(nullif(v_quiz -> i ->> 'answer', '')::integer, -1);
      begin
        v_answer := coalesce(nullif(p_answers ->> i, '')::integer, -2);
      exception when others then
        v_answer := -2;
      end;

      if v_answer = v_expected then
        v_score := v_score + 1;
      end if;

      v_feedback := v_feedback || jsonb_build_array(
        jsonb_build_object(
          'correct', v_answer = v_expected,
          'answer', v_expected,
          'explanation', coalesce(v_quiz -> i ->> 'explanation', '')
        )
      );
    end loop;

    v_pass := v_score * 100 >= v_total * 70;
  end if;

  insert into public.user_lesson_progress (user_id, lesson_id, quiz_score, quiz_total, quiz_passed)
  values (v_user, p_lesson_id, v_score, v_total, v_pass)
  on conflict (user_id, lesson_id) do update
    set quiz_score = greatest(public.user_lesson_progress.quiz_score, excluded.quiz_score),
        quiz_total = excluded.quiz_total,
        quiz_passed = public.user_lesson_progress.quiz_passed or excluded.quiz_passed;

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

revoke all on function public.submit_lesson_quiz(uuid, jsonb) from public;
grant execute on function public.submit_lesson_quiz(uuid, jsonb) to authenticated;

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

  select l.* into v_lesson
  from public.track_lessons l
  where l.id = p_lesson_id and l.is_published = true;

  if v_lesson.id is null then
    return jsonb_build_object('error', 'lesson_not_found');
  end if;

  select m.track_id into v_track_id
  from public.track_modules m
  where m.id = v_lesson.module_id and m.is_published = true;

  if v_track_id is null then
    return jsonb_build_object('error', 'lesson_not_found');
  end if;

  if not internal.is_module_unlocked(v_user, v_lesson.module_id) then
    return jsonb_build_object('error', 'module_locked');
  end if;

  insert into public.user_lesson_progress (user_id, lesson_id, project_submission, project_submitted_at)
  values (v_user, p_lesson_id, v_submission, timezone('utc'::text, now()))
  on conflict (user_id, lesson_id) do update
    set project_submission = excluded.project_submission,
        project_submitted_at = coalesce(public.user_lesson_progress.project_submitted_at, excluded.project_submitted_at);

  perform internal.refresh_lesson_completion(v_user, p_lesson_id);
  perform internal.sync_track_progress(v_user, v_track_id);

  select * into v_row
  from public.user_lesson_progress
  where user_id = v_user and lesson_id = p_lesson_id;

  return jsonb_build_object(
    'submitted', true,
    'status', v_row.status,
    'xpAwarded', v_row.xp_awarded
  );
end;
$$;

revoke all on function public.submit_lesson_project(uuid, text) from public;
grant execute on function public.submit_lesson_project(uuid, text) to authenticated;
