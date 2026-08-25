-- =============================================================================
-- Premier framework : chaine video (cf. SYSTEME_PROJET.md §22)
--
-- Choisi volontairement comme premier cas : il n'a ni depot ni URL de
-- production. Si le moteur de projet le porte correctement, c'est qu'il a
-- cesse d'etre un moteur pour projets informatiques.
--
-- Rejouable : tout est en "on conflict do update".
-- =============================================================================

insert into public.project_frameworks
  (project_type_id, slug, title, summary, level_label, duration_weeks, locale, is_published, sort_order)
select
  pt.id,
  'chaine-video-fr',
  'Lancer une chaine video',
  'De la niche aux trois premieres videos publiees, avec un systeme de production que tu peux tenir.',
  'Debutant',
  8,
  'fr',
  true,
  10
from public.project_types pt
where pt.slug = 'contenu_video'
on conflict (slug) do update set
  title = excluded.title,
  summary = excluded.summary,
  project_type_id = excluded.project_type_id,
  is_published = excluded.is_published;

insert into public.framework_phases (framework_id, slug, title, objective, expected_outcome, sort_order)
select f.id, v.slug, v.title, v.objective, v.expected_outcome, v.sort_order
from public.project_frameworks f
cross join (values
  ('cadrage',     'Cadrer',           'Savoir a qui tu parles et de quoi.',
   'Une niche formulee en une phrase et un profil d''audience.', 1),
  ('analyse',     'Observer',         'Comprendre ce qui existe deja avant de produire.',
   'Une analyse de cinq chaines comparables.', 2),
  ('identite',    'Construire',       'Donner un visage a la chaine.',
   'Une chaine creee, nommee et habillee.', 3),
  ('production',  'Outiller',         'Pouvoir produire sans repartir de zero a chaque fois.',
   'Un systeme de production documente et un premier script.', 4),
  ('publication', 'Publier',          'Sortir du travail invisible.',
   'Trois videos en ligne.', 5),
  ('mesure',      'Mesurer',          'Decider a partir de faits, pas d''impressions.',
   'Un rythme planifie et un tableau de suivi.', 6)
) as v(slug, title, objective, expected_outcome, sort_order)
where f.slug = 'chaine-video-fr'
on conflict (framework_id, slug) do update set
  title = excluded.title,
  objective = excluded.objective,
  expected_outcome = excluded.expected_outcome,
  sort_order = excluded.sort_order;

-- Les etapes. Chacune dit CE QU'IL FAUT PRODUIRE et A QUELLES CONDITIONS c'est
-- termine : les criteres sont connus avant de commencer (SYSTEME_PROJET §16).

insert into public.phase_step_templates
  (phase_id, slug, title, why, deliverable_type, acceptance_criteria, estimated_minutes, sort_order)
select p.id, v.slug, v.title, v.why, v.deliverable_type, v.criteria::jsonb, v.minutes, v.sort_order
from public.framework_phases p
join public.project_frameworks f on f.id = p.framework_id
cross join (values
  ('cadrage', 'definir-niche', 'Definir ta niche',
   'Une chaine qui parle a tout le monde n''accroche personne.',
   'document',
   '["La niche tient en une phrase","Tu peux citer trois sujets de video","Tu sais a qui elle s''adresse"]',
   60, 1),
  ('cadrage', 'decrire-audience', 'Decrire ton audience',
   'Tu ecris pour quelqu''un de precis, pas pour une moyenne.',
   'document',
   '["Un profil type ecrit","Le probleme que tu resous pour lui","Ou il regarde deja des videos"]',
   45, 2),
  ('analyse', 'analyser-chaines', 'Analyser cinq chaines comparables',
   'Observer ce qui marche evite de reinventer et montre ou est la place libre.',
   'document',
   '["Cinq chaines listees avec leur angle","Ce qui fonctionne chez elles","Ce que tu feras differemment"]',
   90, 1),
  ('identite', 'nom-identite', 'Choisir un nom et une identite',
   'Le nom et le visuel sont ce que l''on voit avant le contenu.',
   'document',
   '["Un nom disponible","Une banniere","Un avatar"]',
   90, 1),
  ('identite', 'creer-chaine', 'Creer la chaine',
   'Tant que la chaine n''existe pas, le projet reste une intention.',
   'channel',
   '["La chaine est accessible en ligne","La description explique la promesse en deux phrases"]',
   30, 2),
  ('production', 'workflow', 'Documenter ton systeme de production',
   'Sans systeme, chaque video recoute autant que la premiere.',
   'document',
   '["Les etapes de l''idee a la publication","Les outils utilises","Le temps estime par video"]',
   60, 1),
  ('production', 'script-1', 'Ecrire le script de la premiere video',
   'Le montage ne rattrape pas un script absent.',
   'document',
   '["Une accroche de moins de quinze secondes","Un plan en trois parties","Un appel a l''action"]',
   90, 2),
  ('publication', 'video-1', 'Publier la premiere video',
   'La premiere publication est le vrai passage a l''action.',
   'video',
   '["La video est en ligne","Une miniature","Un titre et une description"]',
   180, 1),
  ('publication', 'video-2-3', 'Publier deux autres videos',
   'Une video est un essai. Trois videos sont un format.',
   'video',
   '["Deux videos supplementaires publiees","Le meme format tenu","Le workflow reutilise sans improvisation"]',
   300, 2),
  ('mesure', 'calendrier', 'Planifier huit semaines',
   'Un rythme tenable vaut mieux qu''un demarrage rapide puis l''abandon.',
   'document',
   '["Huit semaines planifiees","Un rythme que tu peux tenir","Les sujets listes"]',
   45, 1),
  ('mesure', 'suivi', 'Mettre en place ton tableau de suivi',
   'Sans chiffres, tu ajustes au ressenti.',
   'dashboard',
   '["Vues, duree moyenne et abonnes suivis","Une observation ecrite apres trois videos"]',
   45, 2)
) as v(phase_slug, slug, title, why, deliverable_type, criteria, minutes, sort_order)
where f.slug = 'chaine-video-fr' and p.slug = v.phase_slug
on conflict (phase_id, slug) do update set
  title = excluded.title,
  why = excluded.why,
  deliverable_type = excluded.deliverable_type,
  acceptance_criteria = excluded.acceptance_criteria,
  estimated_minutes = excluded.estimated_minutes,
  sort_order = excluded.sort_order;
