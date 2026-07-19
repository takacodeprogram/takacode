-- Add "Plateformes vibe coding" module to full-vibe-coding track
-- Run after 005_seed_mvp_curriculum.sql

do $seed$
declare
  v_track_id uuid;
  v_module_id uuid;
  v_lesson_id uuid;
  v_quiz_id uuid;
  v_resource_id uuid;
  v_micro_project_id uuid;
begin
  -- Get track id
  select id into v_track_id from learning_tracks where slug = 'full-vibe-coding';
  
  if v_track_id is null then
    raise exception 'Track full-vibe-coding not found';
  end if;

  -- Insert new module "Plateformes vibe coding" with sort_order 15 (between 10 and 20)
  insert into track_modules (track_id, slug, title, summary, sort_order)
  values (
    v_track_id,
    'plateformes-vibe-coding',
    'Plateformes vibe coding',
    'Lovable, Bolt, v0 : panorama, projet concret et critères de choix.',
    15
  )
  returning id into v_module_id;

  -- Lesson 1: Panorama des plateformes (Lovable, Bolt, v0)
  insert into track_lessons (module_id, slug, title, intro, why_important, how_to_use, objectives, xp_reward, duration_minutes, sort_order)
  values (
    v_module_id,
    'panorama-plateformes',
    'Panorama : Lovable, Bolt, v0',
    'Lovable, Bolt et v0 sont des plateformes no-code/low-code qui génèrent des applications complètes (frontend + backend + base de données) à partir d\'une description en langage naturel. Lovable cible les fondateurs non-tech (supabase intégré, export GitHub), Bolt mise sur la vitesse (stack complète en minutes), v0 (Vercel) génère du React/Next.js prêt à déployer.',
    'Ces plateformes changent la donne : elles permettent de passer de l\'idée au produit testable en heures, sans écrire de code. Choisir la bonne selon ton besoin (full-stack vs frontend, verrouillage vs exportable) évite des migrations coûteuses plus tard.',
    'Parcours la démo de chaque plateforme, note leurs forces/limites, et identifie laquelle correspond à ton cas d\'usage (MVP complet, landing page, app interne, etc.).',
    '["Connaitre les 3 plateformes majeures et leurs philosophies", "Comprendre lovable (full-stack Supabase, export GitHub), Bolt (vitesse, stack complète), v0 (React/Next.js Vercel-ready)", "Identifier la plateforme adaptée à ton projet"]',
    50,
    45,
    10
  )
  returning id into v_lesson_id;

  -- Resources for lesson 1
  insert into track_lesson_resources (lesson_id, label, url, kind, why, how, sort_order) values
  (v_lesson_id, 'Lovable — Documentation', 'https://docs.lovable.dev', 'doc', 'La référence officielle : comment créer, itérer et exporter.', 'Lis le Getting Started et la section Export to GitHub.', 10),
  (v_lesson_id, 'Bolt.new — Documentation', 'https://bolt.new/docs', 'doc', 'Guide de prise en main et bonnes pratiques pour Bolt.', 'Suis le quickstart pour comprendre le workflow prompt -> preview -> export.', 20),
  (v_lesson_id, 'v0 by Vercel — Documentation', 'https://v0.dev/docs', 'doc', 'Documentation de v0 : prompts, frameworks, déploiement.', 'Regarde les exemples de prompts et la section Deployment.', 30);

  -- Quiz for lesson 1
  insert into track_lesson_quizzes (lesson_id, question, choices, correct_index, explanation, sort_order) values
  (v_lesson_id, 'Quelle plateforme intègre nativement Supabase (base de données + auth) ?', '["Lovable", "Bolt", "v0"]', 0, 'Lovable a Supabase intégré : tu as une vraie BDD et de l\'auth sans configuration.', 10),
  (v_lesson_id, 'Quelle plateforme génère du code React/Next.js prêt pour Vercel ?', '["Lovable", "Bolt", "v0"]', 2, 'v0 est fait par Vercel : il sort du Next.js/React natif, déployable en 1 clic sur Vercel.', 20),
  (v_lesson_id, 'Quel est le point fort de Bolt ?', '["Le moins cher", "La vitesse : stack complète générée en minutes", "Le plus de templates"]', 1, 'Bolt mise sur la génération ultra-rapide d\'une app complète (frontend + backend + DB).', 30);

  -- Micro-project for lesson 1
  insert into track_lesson_micro_projects (lesson_id, title, brief, steps, deliverable, sort_order) values
  (v_lesson_id, 'Ton comparatif plateformes', 'Compare Lovable, Bolt et v0 sur ton cas d\'usage et décide laquelle tester en premier.',
   '["Teste la démo de chaque plateforme (prompts simples)", "Note pour chacune : full-stack vs frontend, export GitHub, verrouillage, coût, courbe d\'apprentissage", "Choisis ta plateforme de test et justifie en 3 lignes"]',
   'Colle ton tableau comparatif et ta décision justifiée.',
   10);

  -- Lesson 2: Projet concret sur Lovable (full-stack avec Supabase)
  insert into track_lessons (module_id, slug, title, intro, why_important, how_to_use, objectives, xp_reward, duration_minutes, sort_order)
  values (
    v_module_id,
    'projet-lovable',
    'Projet concret : créer une app full-stack avec Lovable',
    'Lovable permet de générer une application complète avec base de données (Supabase), authentification, et API en décrivant ton idée en langage naturel. Tu peux itérer en conversation, prévisualiser en temps réel, et exporter le code sur GitHub pour continuer en local.',
    'C\'est le test décisif : tu valides si une plateforme no-code peut porter ton MVP jusqu\'à la mise en production, et tu apprends à structurer tes prompts pour obtenir une architecture propre.',
    'Suis le guide : crée un projet Lovable, décris ton MVP en 3 prompts itératifs, configure l\'auth et la BDD via l\'interface, prévisualise, puis exporte sur GitHub.',
    '["Créer un projet Lovable et configurer Supabase (DB + Auth)", 'Itérer en conversation pour construire les fonctionnalités clés", "Prévisualiser, tester, et exporter le code complet sur GitHub"]',
    80,
    60,
    20
  )
  returning id into v_lesson_id;

  -- Resources for lesson 2
  insert into track_lesson_resources (lesson_id, label, url, kind, why, how, sort_order) values
  (v_lesson_id, 'Lovable — Getting Started', 'https://docs.lovable.dev/getting-started', 'doc', 'Le guide officiel pas à pas pour ton premier projet.', 'Suis-le jusqu\'à ton premier projet déployé.', 10),
  (v_lesson_id, 'Lovable — Export to GitHub', 'https://docs.lovable.dev/guides/export-to-github', 'doc', 'Comment récupérer ton code et continuer en local.', 'Applique la procédure d\'export sur ton projet de test.', 20),
  (v_lesson_id, 'Supabase — Database & Auth via Lovable', 'https://docs.lovable.dev/guides/supabase', 'doc', 'Gérer la BDD et l\'auth depuis l\'interface Lovable.', 'Configure au moins une table et l\'auth email/mot de passe.', 30);

  -- Quiz for lesson 2
  insert into track_lesson_quizzes (lesson_id, question, choices, correct_index, explanation, sort_order) values
  (v_lesson_id, 'Que fait l\'export GitHub de Lovable ?', '["Il supprime le projet Lovable", 'Il pousse le code complet (frontend + supabase config) vers un dépôt GitHub', "Il ne garde que le design"]', 1, 'L\'export GitHub te donne le code source complet pour continuer en local ou déployer ailleurs.', 10),
  (v_lesson_id, 'Comment configurer l\'authentification dans Lovable ?', '["En écrivant du code SQL", 'Via l\'interface Lovable : onglet Auth, active email/password ou OAuth', "Ce n'est pas possible"]', 1, 'Lovable expose une UI pour activer l\'auth Supabase sans écrire de code.', 20),
  (v_lesson_id, 'Pourquoi itérer en plusieurs prompts plutôt qu\'un seul gros prompt ?', '["Pour payer moins cher", 'Chaque itération affine l\'architecture et évite les régressions', "L'IA refuse les longs prompts"]', 1, 'Prompts courts + vérification = architecture plus propre et contrôlable.', 30);

  -- Micro-project for lesson 2
  insert into track_lesson_micro_projects (lesson_id, title, brief, steps, deliverable, sort_order) values
  (v_lesson_id, 'Ton app Lovable sur GitHub', 'Crée une mini-app (ex: liste de tâches avec auth) sur Lovable, configure la BDD et l\'auth, exporte sur GitHub.',
   '["Crée le projet Lovable et décris ton MVP en 1er prompt", "Ajoute une table (ex: tasks) et active l\'auth email", "Itère pour avoir CRUD + liste filtrée par utilisateur", "Exporte sur GitHub et vérifie le code généré"]',
   'Colle le lien GitHub + capture de l\'app fonctionnelle + 1 ligne sur ce qui t\'a surpris.',
   10);

  -- Lesson 3: Critères de choix et migration (lock-in, export, hébergement)
  insert into track_lessons (module_id, slug, title, intro, why_important, how_to_use, objectives, xp_reward, duration_minutes, sort_order)
  values (
    v_module_id,
    'choisir-et-migrer',
    'Choisir sa plateforme et préparer la migration',
    'Chaque plateforme a un niveau de verrouillage (lock-in) différent : Lovable et Bolt exportent du code (GitHub), v0 sort du Next.js natif Vercel. Le vrai critère, c\'est : est-ce que je peux récupérer mon code, l\'héberger où je veux, et continuer à le faire évoluer sans la plateforme ?',
    'Commencer sur une plateforme no-code est rapide, mais si tu ne peux pas en sortir proprement, tu es coincé. Anticiper la migration (structure du code, variables d\'env, CI/CD) te garde le contrôle sur ton produit.',
    'Analyse ton projet test exporté : structure des dossiers, fichiers de config, dépendances. Note ce qui est standard (Next.js, Supabase client) vs spécifique à la plateforme. Prépare un plan de migration vers Vercel + ton propre repo.',
    '["Évaluer le lock-in de chaque plateforme (export code, config, données)", "Comprendre la structure d\'un projet exporté (Next.js, Supabase, env)", "Préparer un plan de migration vers hébergement propre (Vercel + GitHub + Supabase direct)"]',
    70,
    50,
    30
  )
  returning id into v_lesson_id;

  -- Resources for lesson 3
  insert into track_lesson_resources (lesson_id, label, url, kind, why, how, sort_order) values
  (v_lesson_id, 'Lovable — Export & Self-hosting', 'https://docs.lovable.dev/guides/self-hosting', 'doc', 'Comment héberger toi-même un projet Lovable exporté.', 'Lis la section architecture et déploiement.', 10),
  (v_lesson_id, 'Next.js — Deployment (Vercel Docs)', 'https://nextjs.org/docs/app/building-your-application/deploying', 'doc', 'La référence pour déployer du Next.js où tu veux.', 'Identifie les étapes pour ton projet exporté.', 20),
  (v_lesson_id, 'Supabase — Local Development', 'https://supabase.com/docs/guides/local-development', 'doc', 'Développer avec Supabase en local sans la plateforme.', 'Note la CLI et les commandes de migration.', 30);

  -- Quiz for lesson 3
  insert into track_lesson_quizzes (lesson_id, question, choices, correct_index, explanation, sort_order) values
  (v_lesson_id, 'Qu\'est-ce que le lock-in ?', '["Un verrou physique", 'La difficulté de quitter une plateforme pour une autre', "Un type de base de données"]', 1, 'Plus le lock-in est fort, plus il coûte cher de migrer ton app ailleurs.', 10),
  (v_lesson_id, 'Quelle plateforme a le lock-in le plus faible pour un dev ?', '["Lovable (export GitHub complet)", "Bolt (export GitHub complet)", "v0 (Next.js natif, déployable partout)"]', 2, 'v0 génère du Next.js standard : zéro code propriétaire, déployable sur n\'importe quel hébergeur supportant Next.js.', 20),
  (v_lesson_id, 'Que vérifier dans un projet exporté avant de migrer ?', '["Que le README est joli", 'Structure Next.js standard, variables d\'env, migrations Supabase, CI/CD', "La taille des images"]', 1, 'Un code exportable propre = dossiers standards, pas de logique magique côté plateforme, config externe.', 30);

  -- Micro-project for lesson 3
  insert into track_lesson_micro_projects (lesson_id, title, brief, steps, deliverable, sort_order) values
  (v_lesson_id, 'Ton plan de migration', 'Analyse ton projet Lovable exporté et prépare la migration vers ton propre stack (GitHub + Vercel + Supabase direct).',
   '["Clone ton repo GitHub exporté et explore la structure", "Identifie ce qui est standard Next.js vs spécifique Lovable", "Liste les variables d\'env à recréer sur Vercel", "Note les migrations Supabase à rejouer (ou lien vers projet Supabase existant)"]',
   'Colle ton analyse (3-5 points) et ton plan d\'action en 3 étapes.',
   10);

  -- Update track next_steps to include the new module
  update learning_tracks
  set next_steps = '[
    {"label": "Choisir tes outils IA", "state": "current"},
    {"label": "Explorer les plateformes (Lovable, Bolt, v0)", "state": "locked"},
    {"label": "Construire ton projet avec l'IA", "state": "locked"},
    {"label": "Livrer et publier", "state": "locked"}
  ]'::jsonb
  where id = v_track_id;

end $seed$;