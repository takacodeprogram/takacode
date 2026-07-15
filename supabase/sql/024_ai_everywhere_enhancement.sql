-- TakaCode - Renforce l'usage de l'IA dans chaque lecon du parcours "Dev assiste par IA"
-- Ajoute des ressources IA, des objectifs IA, et des etapes micro-projet IA
-- dans CHAQUE lecon du parcours dev-web-assiste-ia
--
-- Run this after 023_mentor_track_guide.sql

do $$
declare
  v_track_id uuid;
  v_module record;
  v_lesson record;

  -- Cursor pour parcourir toutes les lecons du parcours
  lesson_cur cursor for
    select l.id as lesson_id, l.slug, l.title, l.intro, l.why_important, l.how_to_use,
           l.objectives, l.resources, l.quiz, l.micro_project,
           m.title as module_title, m.slug as module_slug
    from public.track_lessons l
    join public.track_modules m on m.id = l.module_id
    join public.learning_tracks t on t.id = m.track_id
    where t.slug = 'dev-web-assiste-ia'
    order by m.sort_order, l.sort_order;
begin
  select id into v_track_id from public.learning_tracks where slug = 'dev-web-assiste-ia';
  if v_track_id is null then
    raise notice 'Parcours dev-web-assiste-ia non trouve.';
    return;
  end if;

  -- Parcours de mise a jour de chaque lecon avec integration IA renforcee
  for v_lesson in lesson_cur loop

    -- === MODULE 1 : Fondations HTML/CSS ===

    if v_lesson.slug = 'html-structurer-une-page' then
      update public.track_lessons set
        why_important = 'Tout le web repose sur HTML. Savoir le lire te permet de comprendre ce que l''IA genere et de repérer ses erreurs. Avec l''IA comme copilote, tu peux apprendre le HTML 2x plus vite en lui demandant d''expliquer chaque balise.',
        how_to_use = 'Suis le guide MDN, puis utilise une IA (ChatGPT, Claude, Copilot) pour : (1) t''expliquer le HTML d''une page existante, (2) generer du HTML que tu liras et comprendras, (3) corriger les erreurs de ton code.',
        objectives = '["Structurer une page avec les balises essentielles", "Utiliser les balises semantiques (header, main, footer...)", "Lire le HTML d''une page existante", "Demander a une IA d''expliquer et de generer du HTML"]'::jsonb,
        resources = '[
          {"label": "Structurer le web avec HTML (MDN)", "url": "https://developer.mozilla.org/fr/docs/Learn_web_development/Core/Structuring_content", "kind": "doc", "why": "LA reference du web, gratuite et en francais.", "how": "Suis les 3 premieres sections et code les exemples toi-meme."},
          {"label": "HTML Tutorial (W3Schools)", "url": "https://www.w3schools.com/html/", "kind": "doc", "why": "Des exemples interactifs a modifier directement.", "how": "Utilise les editeurs Try it Yourself."},
          {"label": "Copilot GitHub (outil IA)", "url": "https://github.com/features/copilot", "kind": "tool", "why": "L''IA qui complete ton code HTML en temps reel dans VS Code.", "how": "Installe l''extension VS Code et demande-lui de generer du HTML."},
          {"label": "ChatGPT / Claude (assistant IA)", "url": "https://chat.openai.com/", "kind": "tool", "why": "Pour te faire expliquer le HTML, corriger ton code, et generer des exemples.", "how": "Colle ton code et demande : ''Explique-moi ce HTML et corrige les erreurs''."}
        ]'::jsonb,
        micro_project = '{
          "title": "Ta page profil avec l''IA comme assistant",
          "brief": "Code une page profil en HTML. Utilise l''IA pour : generer un template de base, t''expliquer les balises que tu ne connais pas, et corriger ton code.",
          "steps": [
            "Demande a une IA de generer un template HTML de page profil",
            "Lis et comprends chaque balise (demande des explications si besoin)",
            "Modifie le template avec tes propres informations",
            "Valide ton code sur validator.w3.org",
            "Demande a l''IA de corriger les erreurs si le validator en trouve"
          ],
          "deliverable": "Colle ton code HTML et decris comment l''IA t''a aide a le comprendre."
        }'::jsonb
      where id = v_lesson.lesson_id;

    elsif v_lesson.slug = 'css-styler-ta-page' then
      update public.track_lessons set
        why_important = 'Le CSS fait la difference entre une page brute et un produit credible. C''est la premiere chose que tu voudras ajuster dans du code genere par IA. Savoir lire et modifier le CSS te permet de personnaliser ce que l''IA genere.',
        how_to_use = 'Suis le guide MDN, puis utilise l''IA pour : (1) generer des styles CSS, (2) expliquer les proprietes que tu ne comprends pas, (3) adapter un design existant.',
        objectives = '["Utiliser selecteurs et proprietes de base", "Maitriser le modele de boite (marges, padding, bordures)", "Creer une mise en page avec flexbox", "Demander a une IA de generer et expliquer du CSS"]'::jsonb,
        resources = '[
          {"label": "Apprendre a styler le HTML avec CSS (MDN)", "url": "https://developer.mozilla.org/fr/docs/Learn_web_development/Core/Styling_basics", "kind": "doc", "why": "Le parcours CSS de reference.", "how": "Suis les premieres sections."},
          {"label": "Flexbox Froggy", "url": "https://flexboxfroggy.com/#fr", "kind": "tool", "why": "Apprendre flexbox en jouant.", "how": "Termine les 24 niveaux."},
          {"label": "GitHub Copilot (CSS)", "url": "https://github.com/features/copilot", "kind": "tool", "why": "Le Copilot genere du CSS contextuel a partir de tes commentaires.", "how": "Ecris un commentaire comme ''// style le header en noir avec du blanc'' et observe."},
          {"label": "ChatGPT pour CSS", "url": "https://chat.openai.com/", "kind": "tool", "why": "Pour obtenir des styles CSS personnalises et comprendre pourquoi quelque chose ne marche pas.", "how": "Decris le look voulu et demande du CSS adapte a ton HTML."}
        ]'::jsonb,
        micro_project = '{
          "title": "Ta page profil stylee avec l''IA",
          "brief": "Style ta page profil HTML avec du CSS. Utilise l''IA pour generer des styles, expliquer les proprietes, et resoudre les problemes de mise en page.",
          "steps": [
            "Demande a l''IA de generer un CSS pour ta page profil",
            "Lis et comprends chaque propriete (demande des explications)",
            "Modifie les couleurs, polices et espacements a ton gout",
            "Si flexbox ne marche pas, colle le code dans l''IA et demande de l''aide",
            "Verifie le responsive en redimensionnant le navigateur"
          ],
          "deliverable": "Colle ton CSS et explique ce que l''IA t''a appris sur les proprietes utilisees."
        }'::jsonb
      where id = v_lesson.lesson_id;

    -- === MODULE 2 : JavaScript ===

    elsif v_lesson.slug = 'bases-javascript' then
      update public.track_lessons set
        why_important = 'JavaScript est le langage le plus utilise au monde et la base de React et Next.js. Le comprendre te rend autonome face au code genere par l''IA. Tu pourras lire, modifier et deboguer ce que l''IA produit.',
        how_to_use = 'Suis les guides MDN et javascript.info, puis utilise l''IA pour : (1) t''expliquer les concepts flous, (2) generer des exemples de code, (3) corriger tes erreurs.',
        objectives = '["Manipuler variables, conditions et boucles", "Ecrire et appeler des fonctions", "Lire un script simple et predire son resultat", "Utiliser l''IA pour generer et expliquer du JavaScript"]'::jsonb,
        resources = '[
          {"label": "Premiers pas en JavaScript (MDN)", "url": "https://developer.mozilla.org/fr/docs/Learn_web_development/Core/Scripting", "kind": "doc", "why": "Le parcours officiel pour debuter.", "how": "Suis les sections variables, maths, texte et logique."},
          {"label": "The Modern JavaScript Tutorial", "url": "https://javascript.info/", "kind": "doc", "why": "Le tutoriel JS le plus complet du web.", "how": "Utilise la partie 1 (fundamentals)."},
          {"label": "GitHub Copilot (JS)", "url": "https://github.com/features/copilot", "kind": "tool", "why": "Complete tes fonctions JS en temps reel.", "how": "Ecris le debut d''une fonction et laisse Copilot la terminer."},
          {"label": "ChatGPT pour debugger", "url": "https://chat.openai.com/", "kind": "tool", "why": "Colle ton code JS avec une erreur et l''IA t''expliquera le probleme.", "how": "Teste avec des erreurs courantes (undefined, null, types)."}
        ]'::jsonb,
        micro_project = '{
          "title": "Mini calculateur assiste par IA",
          "brief": "Code un script JS qui calcule le budget mensuel d''un projet. Utilise l''IA pour generer la structure, expliquer les concepts, et debugger.",
          "steps": [
            "Decris a l''IA ce que tu veux calculer et demande un squelette de code",
            "Lis et comprends chaque ligne (demande des explications)",
            "Ajoute les conditions et boucles toi-meme",
            "Si tu bloques, colle ton code dans l''IA et demande de l''aide",
            "Teste avec 3 jeux de donnees differents"
          ],
          "deliverable": "Colle ton code final et decris a quel moment l''IA t''a le plus aide."
        }'::jsonb
      where id = v_lesson.lesson_id;

    elsif v_lesson.slug = 'dom-et-interactivite' then
      update public.track_lessons set
        why_important = 'Le DOM est le pont entre ton code et l''utilisateur. C''est aussi ce que React automatise. Comprendre le DOM te permet de comprendre ce que React fait sous le capot, et l''IA peut t''aider a construire des interactions complexes.',
        how_to_use = 'Suis le guide MDN, puis utilise l''IA pour : (1) generer des event listeners, (2) expliquer les erreurs DOM courantes, (3) construire des interactions plus complexes.',
        objectives = '["Selectionner et modifier des elements avec JavaScript", "Reagir aux evenements (clic, saisie)", "Construire une petite interaction complete", "Utiliser l''IA pour accelerer la construction du DOM"]'::jsonb,
        resources = '[
          {"label": "Introduction aux evenements (MDN)", "url": "https://developer.mozilla.org/fr/docs/Learn_web_development/Core/Scripting/Events", "kind": "doc", "why": "Comprendre comment le code reagit aux actions.", "how": "Code les exemples toi-meme."},
          {"label": "Manipuler des documents (MDN)", "url": "https://developer.mozilla.org/fr/docs/Learn_web_development/Core/Scripting/DOM_scripting", "kind": "doc", "why": "La reference sur querySelector.", "how": "Lis et reproduis la section active learning."},
          {"label": "Copilot pour le DOM", "url": "https://github.com/features/copilot", "kind": "tool", "why": "Copilot complete les selections et event listeners.", "how": "Ecris un commentaire et laisse Copilot generer le code DOM."},
          {"label": "ChatGPT : expliquer le DOM", "url": "https://chat.openai.com/", "kind": "tool", "why": "Pour comprendre pourquoi un element ne se modifie pas.", "how": "Colle ton code HTML+JS et demande : ''Pourquoi mon bouton ne fonctionne pas ?''"}
        ]'::jsonb,
        micro_project = '{
          "title": "Ta todo-list avec l''IA comme pair programmeur",
          "brief": "Construis une todo-list complete. Utilise l''IA comme pair programmeur : elle genere, tu lis et comprends.",
          "steps": [
            "Decris la todo-list a l''IA et demande le HTML + JS de base",
            "Lis et comprends chaque partie du code genere",
            "Ajoute la fonctionnalite ''marquer comme faite'' en demandant a l''IA",
            "Si quelque chose ne marche pas, debogue avec l''IA",
            "Ajoute des animations CSS en demandant a l''IA"
          ],
          "deliverable": "Colle le code complet et decris ton workflow avec l''IA."
        }'::jsonb
      where id = v_lesson.lesson_id;

    -- === MODULE 3 : Git et GitHub ===

    elsif v_lesson.slug = 'git-versionner' then
      update public.track_lessons set
        why_important = 'Git est le filet de securite du vibe coding. Chaque commit te permet de revenir en arriere si l''IA genere du code qui casse ton projet. Et l''IA peut t''aider a formuler des messages de commit propres.',
        how_to_use = 'Lis le guide Pro Git, puis utilise l''IA pour : (1) t''expliquer les commandes Git, (2) generer des messages de commit, (3) resoudre les conflits de fusion.',
        objectives = '["Initialiser un depot et faire des commits", "Lire l''historique de ton projet", "Comprendre les branches", "Utiliser l''IA pour formuler des messages de commit"]'::jsonb,
        resources = '[
          {"label": "Pro Git : demarrage rapide", "url": "https://git-scm.com/book/fr/v2/D%C3%A9marrage-rapide", "kind": "doc", "why": "Le livre officiel de Git en francais.", "how": "Lis les chapitres 1 et 2."},
          {"label": "Learn Git Branching", "url": "https://learngitbranching.js.org/?locale=fr_FR", "kind": "tool", "why": "Visualiser les branches en jouant.", "how": "Fais les 4 premiers niveaux."},
          {"label": "ChatGPT pour Git", "url": "https://chat.openai.com/", "kind": "tool", "why": "Pour formuler des messages de commit et resoudre des problemes Git.", "how": "Decris ton changement et demande un message de commit clair."},
          {"label": "Copilot pour Git", "url": "https://github.com/features/copilot", "kind": "tool", "why": "Suggere des messages de commit dans VS Code.", "how": "Ouvre le panel Git et laisse Copilot proposer."}
        ]'::jsonb,
        micro_project = '{
          "title": "Ton historique Git propre avec l''IA",
          "brief": "Mets ta todo-list sous Git avec un historique propre. Utilise l''IA pour formuler tes messages de commit.",
          "steps": [
            "Initialise git dans le dossier de ta todo-list",
            "Decris chaque changement a l''IA et demande un message de commit",
            "Fais 3 commits avec les messages proposes par l''IA",
            "Affiche l''historique avec git log",
            "Demande a l''IA d''expliquer les concepts que tu ne maitrises pas"
          ],
          "deliverable": "Colle git log --oneline et tes 3 messages de commit."
        }'::jsonb
      where id = v_lesson.lesson_id;

    elsif v_lesson.slug = 'github-publier' then
      update public.track_lessons set
        why_important = 'Ton GitHub est ton CV de createur. L''IA peut t''aider a rediger un README percutant, a organiser ton depot, et a preparer ton portfolio.',
        how_to_use = 'Suis le guide Hello World, puis utilise l''IA pour : (1) rediger le README, (2) organiser la structure du depot, (3) preparer une description engageante.',
        objectives = '["Pousser un depot local vers GitHub", "Rediger un README utile avec l''aide de l''IA", "Comprendre le principe des pull requests"]'::jsonb,
        resources = '[
          {"label": "Hello World (GitHub Docs)", "url": "https://docs.github.com/en/get-started/start-your-journey/hello-world", "kind": "doc", "why": "Le tutoriel officiel GitHub.", "how": "Suis-le en entier."},
          {"label": "About READMEs (GitHub Docs)", "url": "https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-readmes", "kind": "doc", "why": "La structure recommandee d''un README.", "how": "Applique-la a ton projet."},
          {"label": "ChatGPT pour README", "url": "https://chat.openai.com/", "kind": "tool", "why": "Pour generer un README complet et professionnel.", "how": "Decris ton projet et demande un README au format Markdown."},
          {"label": "Copilot pour GitHub", "url": "https://github.com/features/copilot", "kind": "tool", "why": "Pour documenter ton code automatiquement.", "how": "Utilise les commentaires generees par Copilot."}
        ]'::jsonb,
        micro_project = '{
          "title": "Ton depot GitHub professionnel avec l''IA",
          "brief": "Publie ta todo-list sur GitHub avec un README genere par l''IA et personnalise.",
          "steps": [
            "Cree le depot GitHub et pousse ton code",
            "Demande a l''IA de generer un README complet pour ton projet",
            "Personnalise le README avec tes informations",
            "Ajoute une description du depot sur GitHub",
            "Verifie que la page du depot est claire"
          ],
          "deliverable": "Colle le lien de ton depot GitHub et le README que l''IA a genere."
        }'::jsonb
      where id = v_lesson.lesson_id;

    -- === MODULE 4 : React et Next.js ===

    elsif v_lesson.slug = 'react-penser-en-composants' then
      update public.track_lessons set
        why_important = 'React est la bibliotheque d''interface la plus demandee. Les composants sont le vocabulaire de l''IA quand elle genere du front-end. Comprendre React te permet de piloter l''IA au lieu de la subir.',
        how_to_use = 'Suis le tutoriel react.dev, puis utilise l''IA pour : (1) generer des composants, (2) expliquer le JSX, (3) convertir du HTML en React.',
        objectives = '["Creer des composants avec props", "Gerer un etat local avec useState", "Comprendre le re-rendu automatique", "Utiliser l''IA pour generer et expliquer des composants React"]'::jsonb,
        resources = '[
          {"label": "Quick Start (react.dev)", "url": "https://react.dev/learn", "kind": "doc", "why": "Le tutoriel officiel React.", "how": "Fais Quick Start puis Tutorial: Tic-Tac-Toe."},
          {"label": "Penser en React (react.dev)", "url": "https://fr.react.dev/learn/thinking-in-react", "kind": "doc", "why": "La methode officielle pour decomposer une interface.", "how": "Applique les 5 etapes au micro projet."},
          {"label": "Copilot pour React", "url": "https://github.com/features/copilot", "kind": "tool", "why": "Copilot genere des composants React a partir de commentaires.", "how": "Ecris // composant Button avec label et onClick et observe."},
          {"label": "ChatGPT pour React", "url": "https://chat.openai.com/", "kind": "tool", "why": "Pour convertir du HTML en React, expliquer les hooks, et resoudre des erreurs.", "how": "Colle du HTML et demande : ''Convertis ce HTML en composant React''."}
        ]'::jsonb,
        micro_project = '{
          "title": "Ta carte profil en React avec l''IA",
          "brief": "Recree ta page profil en composant React. Utilise l''IA pour generer le composant, expliquer le JSX, et ajouter des fonctionnalites.",
          "steps": [
            "Demande a l''IA de convertir ton HTML en composant React",
            "Lis et comprends le JSX genere",
            "Ajoute les props pour personnaliser chaque carte",
            "Ajoute un bouton like avec useState en demandant a l''IA",
            "Teste et debogue avec l''IA si besoin"
          ],
          "deliverable": "Colle le code de ton composant et explique comment l''IA t''a aide a comprendre React."
        }'::jsonb
      where id = v_lesson.lesson_id;

    elsif v_lesson.slug = 'nextjs-application-complete' then
      update public.track_lessons set
        why_important = 'Next.js est le standard pour les apps React en production. L''IA peut t''aider a creer des pages, des routes, et a configurer le projet, mais tu dois comprendre la structure pour piloter.',
        how_to_use = 'Suis le cours Next.js Learn, puis utilise l''IA pour : (1) generer des pages, (2) configurer le routing, (3) integrer Supabase.',
        objectives = '["Creer une application Next.js avec plusieurs pages", "Comprendre le routing par dossiers (App Router)", "Distinguer composants serveur et client", "Utiliser l''IA pour generer des pages et configurer Next.js"]'::jsonb,
        resources = '[
          {"label": "Next.js Learn", "url": "https://nextjs.org/learn", "kind": "doc", "why": "Le cours officiel gratuit.", "how": "Fais les chapitres 1 a 5."},
          {"label": "App Router (Next.js Docs)", "url": "https://nextjs.org/docs/app", "kind": "doc", "why": "La reference du routing moderne.", "how": "Lis l''introduction."},
          {"label": "Copilot pour Next.js", "url": "https://github.com/features/copilot", "kind": "tool", "why": "Copilot connait Next.js et genere des pages et layouts.", "how": "Cree un dossier app/contact et laisse Copilot generer page.js."},
          {"label": "ChatGPT pour Next.js", "url": "https://chat.openai.com/", "kind": "tool", "why": "Pour comprendre le Server Components, les layouts, et les API routes.", "how": "Demande : ''Explique-moi la difference entre composant serveur et client dans Next.js''."}
        ]'::jsonb,
        micro_project = '{
          "title": "Ton application Next.js avec l''IA",
          "brief": "Cree une app Next.js de 3 pages. Utilise l''IA pour generer les pages, configurer le layout, et integrer la navigation.",
          "steps": [
            "Cree l''app avec npx create-next-app",
            "Demande a l''IA de generer le layout avec navigation",
            "Cree les 3 pages en demandant a l''IA de les generer",
            "Comprends la structure generee (dossiers = routes)",
            "Teste et ajuste avec l''IA si besoin"
          ],
          "deliverable": "Colle la structure des dossiers et le code du layout genere par l''IA."
        }'::jsonb
      where id = v_lesson.lesson_id;

    -- === MODULE 5 : Backend et mise en ligne ===

    elsif v_lesson.slug = 'supabase-base-de-donnees' then
      update public.track_lessons set
        why_important = 'Supabase te donne le backend complet. L''IA peut t''aider a creer les tables, les policies RLS, et a connecter le tout a ton app, mais tu dois comprendre le schema pour eviter les failles.',
        how_to_use = 'Suis le quickstart Supabase, puis utilise l''IA pour : (1) generer des schemas de tables, (2) expliquer la RLS, (3) connecter Supabase a Next.js.',
        objectives = '["Creer un projet Supabase et une table", "Lire et ecrire des donnees depuis Next.js", "Comprendre l''authentification et la RLS", "Utiliser l''IA pour generer des schemas SQL et des policies"]'::jsonb,
        resources = '[
          {"label": "Use Supabase with Next.js", "url": "https://supabase.com/docs/guides/getting-started/quickstarts/nextjs", "kind": "doc", "why": "Le quickstart officiel.", "how": "Suis-le en entier."},
          {"label": "Row Level Security (Supabase Docs)", "url": "https://supabase.com/docs/guides/database/postgres/row-level-security", "kind": "doc", "why": "La securite des donnees.", "how": "Lis l''introduction."},
          {"label": "ChatGPT pour SQL/Supabase", "url": "https://chat.openai.com/", "kind": "tool", "why": "Pour generer des schemas de tables, des policies RLS, et du code Supabase.", "how": "Decris ta table et demande : ''Genere le SQL pour creer cette table avec RLS''."},
          {"label": "Copilot pour Supabase", "url": "https://github.com/features/copilot", "kind": "tool", "why": "Complete le code Supabase client dans VS Code.", "how": "Utilise les commentaires pour guider Copilot."}
        ]'::jsonb,
        micro_project = '{
          "title": "Tes donnees reelles avec l''IA",
          "brief": "Connecte ton app Next.js a Supabase. Utilise l''IA pour generer le schema SQL, les policies, et le code de connexion.",
          "steps": [
            "Decris ta table a l''IA et demande le SQL de creation",
            "Cree la table dans Supabase Dashboard",
            "Demande a l''IA de generer les policies RLS",
            "Connecte ton app avec les cles d''environnement",
            "Affiche les donnees sur une page en utilisant le code genere par l''IA"
          ],
          "deliverable": "Colle le SQL genere par l''IA et le code de connexion."
        }'::jsonb
      where id = v_lesson.lesson_id;

    elsif v_lesson.slug = 'api-connecter-des-services' then
      update public.track_lessons set
        why_important = 'Les APIs demultiplient ce que ton application peut faire. C''est aussi comme ca que tu integreras l''IA dans tes produits : via des APIs d''IA (OpenAI, Anthropic, etc.).',
        how_to_use = 'Lis le guide MDN sur fetch, puis utilise l''IA pour : (1) generer des appels API, (2) expliquer le JSON, (3) integrer une API d''IA dans ton projet.',
        objectives = '["Comprendre requete, reponse et JSON", "Utiliser fetch pour appeler une API", "Gerer les erreurs et les etats de chargement", "Integrer une API d''IA (OpenAI, Anthropic) dans son projet"]'::jsonb,
        resources = '[
          {"label": "Utiliser l''API Fetch (MDN)", "url": "https://developer.mozilla.org/fr/docs/Web/API/Fetch_API/Using_Fetch", "kind": "doc", "why": "La reference de l''appel reseau.", "how": "Code l''exemple de base."},
          {"label": "Public APIs (GitHub)", "url": "https://github.com/public-apis/public-apis", "kind": "repo", "why": "Un catalogue d''APIs gratuites.", "how": "Choisis une API sans auth."},
          {"label": "OpenAI API Docs", "url": "https://platform.openai.com/docs", "kind": "doc", "why": "Pour integrer l''IA dans tes projets.", "how": "Explore les endpoints chat completions."},
          {"label": "ChatGPT pour les APIs", "url": "https://chat.openai.com/", "kind": "tool", "why": "Pour generer du code d''appel API et comprendre les reponses.", "how": "Demande : ''Genere un fetch pour appeler cette API avec cette donnee''."}
        ]'::jsonb,
        micro_project = '{
          "title": "Ton app connectee a l''IA",
          "brief": "Ajoute une page qui appelle une API d''IA (ou une API publique) et affiche le resultat. Utilise l''IA pour generer le code d''appel.",
          "steps": [
            "Choisis une API (publique ou d''IA)",
            "Demande a l''IA de generer le code fetch pour cette API",
            "Integre le code dans ton application",
            "Ajoute un etat de chargement et un message d''erreur",
            "Affiche le resultat de la reponse"
          ],
          "deliverable": "Colle le code de l''appel API et le resultat affiche."
        }'::jsonb
      where id = v_lesson.lesson_id;

    elsif v_lesson.slug = 'deploiement-mise-en-ligne' then
      update public.track_lessons set
        why_important = 'Le deploiement est l''etape finale. L''IA peut t''aider a resoudre les erreurs de build, a configurer les variables d''environnement, et a optimiser ton application pour la production.',
        how_to_use = 'Suis le guide Vercel, puis utilise l''IA pour : (1) resoudre les erreurs de build, (2) configurer les variables d''environnement, (3) optimiser les performances.',
        objectives = '["Deployer ton application Next.js sur Vercel", "Configurer les variables d''environnement en production", "Verifier et partager ton application publiee", "Resoudre les erreurs de deploiement avec l''IA"]'::jsonb,
        resources = '[
          {"label": "Getting started (Vercel Docs)", "url": "https://vercel.com/docs/getting-started-with-vercel", "kind": "doc", "why": "Le guide officiel du deploiement.", "how": "Suis les etapes."},
          {"label": "Deploying (Next.js Docs)", "url": "https://nextjs.org/docs/app/getting-started/deploying", "kind": "doc", "why": "Les specificites Next.js.", "how": "Parcours la page."},
          {"label": "ChatGPT pour le deploiement", "url": "https://chat.openai.com/", "kind": "tool", "why": "Pour resoudre les erreurs de build Vercel et configurer les variables.", "how": "Colle l''erreur et demande : ''Comment resoudre cette erreur Vercel ?''."},
          {"label": "Vercel AI SDK", "url": "https://sdk.vercel.ai/docs", "kind": "doc", "why": "Pour integrer l''IA dans ton app deployee.", "how": "Decouvre comment ajouter l''IA a ton projet Next.js."}
        ]'::jsonb,
        micro_project = '{
          "title": "Ton application publiee et connectee a l''IA",
          "brief": "Deploie ton application complete sur Vercel. Utilise l''IA pour resoudre les erreurs de build et ajouter une fonctionnalite IA.",
          "steps": [
            "Pousse sur GitHub et importe dans Vercel",
            "Si erreur de build, colle l''erreur dans l''IA et corrige",
            "Configure les variables d''environnement",
            "Ajoute une petite fonctionnalite IA (ex: chatbot simple)",
            "Teste en production et partage l''URL"
          ],
          "deliverable": "Colle l''URL de ton application et decris la fonctionnalite IA integree."
        }'::jsonb
      where id = v_lesson.lesson_id;
    end if;

  end loop;

  raise notice 'Parcours dev-web-assiste-ia mis a jour : integration IA renforcee dans chaque lecon.';
end;
$$;
