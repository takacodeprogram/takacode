-- TakaCode - Masquer les parcours vides (aucune lecon publiee)
-- Run this after 008_user_projects.sql
--
-- Depublie et desactive les parcours qui n'ont aucune lecon publiee, pour qu'ils
-- disparaissent du catalogue, des recommandations et du dashboard (tout filtre
-- deja is_published + is_active). Les donnees sont conservees: ajoute des lecons
-- puis republie le parcours depuis l'admin pour le faire reapparaitre.

update public.learning_tracks t
set is_published = false,
    is_active = false,
    updated_at = timezone('utc'::text, now())
where not exists (
  select 1
  from public.track_modules m
  join public.track_lessons l on l.module_id = m.id and l.is_published = true
  where m.track_id = t.id
    and m.is_published = true
);
