-- Corrige les notifications qui menaient sur des 404.
--
-- Cause : list_review_queue ne renvoyait pas les slugs de lecon/parcours.
-- ReviewQueue construisait donc p_link = '/parcours//lecon/' (slugs vides).
-- L'ancien flux IA ecrivait aussi '/parcours/lecon/<uuid>' (URL inexistante).

-- 1. list_review_queue renvoie desormais lesson_slug et track_slug.
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
        'lesson_slug', l.slug,
        'track_title', t.title,
        'track_slug', t.slug,
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
      or (c.role in ('mentor', 'admin') and coalesce(nullif(l.micro_project ->> 'validation', ''), 'auto') in ('peer', 'mentor', 'ai'))
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

-- 2. Repare les liens de notifications deja en base.
-- 2a. Ancien format IA '/parcours/lecon/<uuid>' -> vraie URL par jointure.
update public.notifications n
set link = '/parcours/' || t.slug || '/lecon/' || l.slug
from public.track_lessons l
join public.track_modules m on m.id = l.module_id
join public.learning_tracks t on t.id = m.track_id
where n.link = '/parcours/lecon/' || l.id::text;

-- 2b. Restes irreparables (slugs vides ou uuid de lecon supprimee) -> lien vide
--     (la cloche affiche la notification sans naviguer).
update public.notifications
set link = ''
where link like '/parcours//lecon/%'
   or link like '/parcours/lecon/%';
