-- TakaCode - Activer la validation IA pour tous les micro-projets
-- Met a jour le champ validation: "ai" dans tous les micro_project JSONB
-- qui ont un titre (c'est-a-dire tous les micro-projets actifs)
--
-- Run this after 024_ai_everywhere_enhancement.sql

-- 1. Ajouter le champ validation: "ai" a tous les micro-projets sans ce champ
update public.track_lessons
set micro_project = jsonb_set(
  coalesce(micro_project, '{}'::jsonb),
  '{validation}',
  '"ai"'
)
where micro_project ->> 'title' is not null
  and micro_project ->> 'title' <> ''
  and (micro_project ->> 'validation' is null or micro_project ->> 'validation' = '' or micro_project ->> 'validation' = 'auto');

-- 2. Verifier que la fonction submit_ai_review existe
-- Si elle n'existe pas, la creer (secours si 021 n'a pas ete execute)
do $$
begin
  if not exists (
    select 1 from pg_proc where proname = 'submit_ai_review'
  ) then
    raise notice 'La fonction submit_ai_review n''existe pas. Execute 021_ai_review_support.sql.';
  end if;
end;
$$;

-- 3. Compter les micro-projets mis a jour
do $$
declare
  v_count integer;
begin
  select count(*) into v_count
  from public.track_lessons
  where micro_project ->> 'title' is not null
    and micro_project ->> 'title' <> ''
    and micro_project ->> 'validation' = 'ai';
  raise notice 'Micro-projets avec validation IA : %', v_count;
end;
$$;
