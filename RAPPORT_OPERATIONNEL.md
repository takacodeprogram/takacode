# Etat operationnel TakaCode

Date: 2026-07-14

## Resume
- Moteur d'apprentissage MVP livre : modules -> lecons -> ressources -> quiz -> micro projet -> validation -> deblocage du module suivant.
- 3 parcours MVP seedes avec contenu complet (27 lecons, 81 questions de quiz, 27 micro projets) :
  - Parcours IA commun (`ia-fondamentaux`) : LLM, tokens, context window, prompts, few-shot, chain of thought, loop engineering, agents, MCP, RAG.
  - Parcours Full Vibe Coding (`full-vibe-coding`) : outils IA, cadrage, iteration, bonnes pratiques, GitHub, deploiement Vercel.
  - Parcours Developpement Web assiste par IA (`dev-web-assiste-ia`) : HTML, CSS, JavaScript, DOM, Git, GitHub, React, Next.js, Supabase, API, deploiement.
- Chaque lecon guide vers les meilleures ressources du web (MDN, react.dev, Next.js Learn, Supabase Docs, docs Anthropic, git-scm, Vercel...) avec pour chacune : pourquoi elle compte et comment l'utiliser.
- Gamification branchee : chaque lecon validee attribue son XP (colonne `points` de `user_profiles`, grades automatiques).
- Design system existant strictement respecte : la page lecon et la section programme reutilisent les classes/cartes/chips existantes.

## Nouveau perimetre livre

### Base de donnees (a executer dans Supabase)
- `supabase/sql/004_track_curriculum.sql` : tables `track_modules`, `track_lessons`, `user_lesson_progress` ; RPC `submit_lesson_quiz` et `submit_lesson_project` (security definer : correction serveur, anti-triche, XP, sync progression enrollment) ; RLS completes.
- `supabase/sql/005_seed_mvp_curriculum.sql` : seed idempotent des 3 parcours MVP avec tout leur contenu.

### Regles metier implementees
- Quiz corrige uniquement cote serveur (les bonnes reponses ne sont jamais envoyees au client avant soumission).
- Quiz valide a partir de 70% de bonnes reponses ; reessai illimite.
- Lecon validee = quiz reussi + micro projet soumis (20 a 5000 caracteres).
- Deblocage : le module N+1 s'ouvre quand toutes les lecons du module N sont validees (verifie cote serveur dans les RPC, pas seulement dans l'UI).
- XP attribue une seule fois par lecon ; la progression du parcours (`user_track_enrollments.progress`) est recalculee automatiquement.

### Frontend
- `/parcours/[slug]` : section "Programme du parcours" (modules numerotes, lecons avec etats valide/en cours/verrouille, duree + XP + quiz + micro projet). CTA "Continuer" pointe vers la prochaine lecon non validee.
- `/parcours/[slug]/lecon/[lessonSlug]` : page lecon complete (connexion requise, redirection si module verrouille) avec explication, pourquoi c'est important, comment travailler, objectifs, ressources selectionnees, quiz interactif avec feedback et explications, micro projet avec soumission, bandeau de validation + XP, navigation lecon precedente/suivante.
- `components/LessonExperience.js` : experience interactive client (quiz, micro projet, etats).
- `lib/curriculum.js` : chargement du programme, calcul des etats de deblocage, progression.

### APIs
- `POST /api/lessons/quiz` : correction du quiz via RPC.
- `POST /api/lessons/project` : soumission du micro projet via RPC.

## Validation technique
- Commande : `npx next build` (voir note dependances ci-dessous).
- Seed valide par script : JSON parse OK, 3 parcours / 27 lecons / 81 questions, index de reponses coherents, URLs https valides.

## Pages operationnelles

### Pages publiques (contenu)
- `/`, `/communaute`, `/competences`, `/projets`, `/ressources`, `/tarifs`, `/privacy`, `/terms`
- `/parcours` (liste), `/parcours/[slug]` (detail + programme)

### Pages auth / compte
- `/signin`, `/signup`, `/connexion`, `/forgot-password`, `/reset-password`, `/onboarding`

### Pages app securisees
- `/dashboard` (vue user + control center admin)
- `/admin`
- `/parcours/[slug]/lecon/[lessonSlug]` (nouvelle - connexion requise)

## APIs operationnelles
- `/auth/callback`, `/auth/session`, `/auth/signout`
- `/api/tracks/recommendation`
- `/api/admin/pitch-deck`
- `/api/lessons/quiz` (nouvelle)
- `/api/lessons/project` (nouvelle)

## Prerequis pour avoir les donnees completes
- Variables env Supabase configurees.
- Tables SQL initialisees dans l'ordre :
  1. `supabase/sql/001_roles_points_referrals.sql`
  2. `supabase/sql/002_bootstrap_admin.sql`
  3. `supabase/sql/003_learning_tracks.sql`
  4. `supabase/sql/004_track_curriculum.sql` (nouveau)
  5. `supabase/sql/005_seed_mvp_curriculum.sql` (nouveau)
- Compte admin avec role `admin` dans `user_profiles`.

## Notes et decisions
- Les 14 parcours catalogue existants sont conserves (l'onboarding s'appuie sur leurs `goal_key`). Les 3 parcours MVP s'ajoutent en tete de liste (sort_order 1-3). Pour reduire le catalogue aux 3 parcours MVP, il suffit d'une mise a jour `is_published = false` sur les autres : decision produit a prendre, aucune modification de code necessaire.
- Les reponses de quiz restent stockees dans `track_lessons.quiz` (lisible par requete directe pour un utilisateur techniquement averti) : correction serveur en place, isolation complete possible plus tard via une vue dediee si besoin.
- Dependances `three`, `@react-three/fiber`, `@react-three/drei` requises par le loader 3D (`components/SkullLoader3D.js`, travail precedent non commite) : installation ajoutee pour reparer le build.

## Prochaines etapes suggerees (hors perimetre de cette session)
- Onboarding : ajouter l'etape "Quelle approche ?" (No Code / Full Vibe Coding / Dev assiste par IA) menant aux parcours MVP.
- Admin : CRUD modules/lecons + gestion des liens d'affiliation.
- Gestion de projet utilisateur (projet principal, taches, deadline) et publication communaute.
