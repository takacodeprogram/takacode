# Etat operationnel TakaCode

Date : 2026-07-18 (audit complet — remplace le rapport du 2026-07-14)

## Resume

Plateforme "GPS des createurs de projets" : le membre cree un projet digital, se forme
via des parcours accelerateurs, construit de vrais livrables, publie et vise son premier
euro. Stack : Next.js 16 (App Router, TypeScript strict) + Supabase (Postgres, Auth,
RLS, Storage) + Tailwind. Deploiement Vercel. Build de production vert.

## Etat verifie en base (audit du 2026-07-18)

Sondage direct de la base de production via service role :

- 4 parcours publies, 55 lecons, ~280 questions dans la banque de quiz
- Contenu francais corrige (accents + apostrophes) sur parcours, modules, lecons, quiz
- Colonnes/tables presentes : `user_projects.revenue_model/template_id/first_euro_at`,
  `user_lesson_progress.project_id`, `notifications`, `track_versions`, `user_sessions`,
  `lesson_quiz_questions`, `project_reviews.review_method`
- RPC operationnelles : `public_leaderboard` (admins exclus, avec pays), `platform_stats`,
  `submit_lesson_quiz/project`, `submit_ai_review` (service_role uniquement)

## Domaines livres

### Boucle projet (produit central)
- Cockpit projet sur le dashboard : pipeline Idee -> Construction -> En ligne -> Cash,
  deadline (J-x), progression vers la mise en ligne, badge modele de revenu
- Prochaine action contextuelle (creer -> editer -> GitHub -> deployer -> partager)
- Editeur projet : templates starter (8 kits), statut, deadline, modele de revenu,
  liens repo/live, upload de fichiers (bucket `project_files`)
- Parcours accelerateur : lier un parcours = inscription auto ; progression + CTA
  "Continuer le sprint" sur la page projet ; livrables (micro-projets) lies au projet
- Premier euro : declaration via `/api/projects/first-euro` + badge ; stade Cash visible
- Vitrine homepage dynamique des projets publies ; profils publics

### Apprentissage
- Modules -> lecons -> ressources -> quiz -> micro-projet -> validation -> deblocage
- Quiz corriges serveur (70 % requis, reessais illimites), questions melangees,
  banque de questions avec sous-ensembles non predictibles
- Micro-projets : validation auto (heuristique), IA, pairs ou mentor selon complexite ;
  la soumission debloque la suite, l'XP arrive a l'approbation ; re-soumission apres
  "ameliorations demandees"
- Revue IA multi-provider gratuite (OpenRouter, Gemini, HuggingFace) avec fallback en
  chaine ; verdict applique cote serveur uniquement ; bascule automatique en revue
  manuelle si IA indisponible ; test de connexion dans l'admin
- Guidage : ordre conseille des parcours, prerequis suggeres, sprints/milestones

### Gamification & communaute
- XP, grades, classement public (admins exclus, drapeaux pays), partage social
- Notifications in-app, sons, confettis, celebrations
- Parrainage (lien copiable), communaute (projets publies), sessions live (admin)
- Revue par les pairs facon ALX avec XP relecteur

### Administration & studio
- CRUD parcours/modules/lecons, studio 5 sections avec drag & drop, autosave,
  historique de versions, apercu live, banque de questions, generation IA de plan
- Gestion utilisateurs, roles avec confirmation + audit, mentors (parcours a valider)
- Liens d'affiliation (dedupliques), sessions live, test IA review

### Securite
- RPC security definer partout ; verdict IA en service_role uniquement
- RLS sur toutes les tables membres ; reponses de quiz jamais envoyees au client
- Tracking sessions/IP, suppression de compte, mots de passe renforces

## Installation d'une base neuve

1. Variables : copier `.env.example` vers `.env.local` et remplir (Supabase + admin
   emails + providers IA review optionnels).
2. Scripts numerotes dans le SQL Editor, dans l'ordre :
   `supabase/sql/001` -> `supabase/sql/026` (remplacer EMAIL_PLACEHOLDER dans 002).
3. Migrations CLI : `supabase db push` (dossier `supabase/migrations/`, 12 fichiers :
   banque de questions, durcissement RPC, versions de parcours, profil avance,
   storage fichiers projet, modele de revenu, premier euro, liaison livrables,
   classement).
4. Admin : `node scripts/bootstrap-admin.mjs --email toi@exemple.com --password ...`
5. Apres tout re-seed de contenu : `node scripts/fix-french-content.mjs --apply`
   (restaure accents/apostrophes, idempotent).

## APIs actives

- Auth : `/auth/callback`, `/auth/session`, `/auth/signout`
- Lecons : `/api/lessons/quiz`, `/api/lessons/quiz-questions`, `/api/lessons/project`,
  `/api/lessons/ai-review` (+ `/test`)
- Projets : `/api/projects/first-euro`
- Parcours : `/api/tracks/recommendation`
- Debug (admin) : `/api/debug/ai-review`

## Reste a faire

Voir `ROADMAP_EVOLUTION.md` -> section "Reste a faire — priorites" :
finitions V1.4.2 (onboarding avec modele de revenu, etoile du nord admin),
V1.5 monetisation (Stripe), contenu (Lovable, lecons bonus), collaboration projet,
dette technique (components/node_modules parasite, accents des libelles UI).
