# Analyse complete du projet TakaCode

## 1. Vue d'ensemble

**Stack :** Next.js 16 (App Router) + Supabase (Postgres, Auth, RLS) + React 19 + Tailwind CSS  
**Deploiement :** Vercel  
**Langue :** Francais (sans accents dans les titres/labels, accents conserves dans le corps)  
**Fonction principale :** Plateforme d'apprentissage par projet (construction de projets reels : web, IA, data, web3, 3D, mobile, business)

---

## 2. Architecture du projet

```
takacode/
├── app/                  # Pages et routes Next.js 14 App Router
│   ├── (app)/            # Layout protege (auth requiree)
│   │   ├── admin/        # Pages admin (CRUD parcours/lecons/utilisateurs/affiliations/sessions)
│   │   └── dashboard/    # Espace membre (parcours, projets, ressources, profil, etc.)
│   ├── api/              # Route handlers (tracks, lessons, debug)
│   ├── parcours/         # Pages publiques parcours (+ detail + lecon)
│   ├── communaute/       # Galerie projets communautaires
│   ├── competences/      # Page "ce que tu peux creer"
│   ├── projets/          # Catalogue projets
│   ├── classement/       # Leaderboard public
│   ├── connexion/ signin/ signup/ forgot-password/ reset-password/  # Auth
│   ├── tarifs/           # Page tarifs
│   ├── privacy/ terms/ cookies/  # Pages legales
│   └── onboarding/       # Questionnaire onboarding
├── components/           # Composants React reutilisables
│   ├── app-shell/        # Dashboard layout (AppShell, Nav, GuidedTour, PageHeader)
│   ├── admin/            # Formulaires admin (TrackForm, LessonForm, ReviewHistory...)
│   ├── public-tour/      # Visite guidee pages publiques
│   └── effects/          # Animations et effets visuels
├── lib/                  # Fonctions metier (23 modules)
├── supabase/sql/         # 26 migrations SQL incrementales
├── public/               # Assets statiques
└── utils/                # Utilitaires
```

---

## 3. Base de donnees (26 migrations)

### 3.1 Tables principales

| Table | Description | Migrations |
|---|---|---|
| `auth.users` | Users Supabase (gere par Auth) | 001 |
| `public.user_profiles` | Profils: role, points, grade, referral_code, referred_by | 001, 007, 012 |
| `public.referral_events` | Parrainage: referrer, referred, points_awarded | 001 |
| `public.learning_tracks` | Parcours: slug, goal_key, title, level_label, resources, next_steps | 003 |
| `public.user_track_enrollments` | Inscriptions aux parcours: user_id, track_id, status, progress | 003 |
| `public.track_modules` | Modules d'un parcours: track_id, slug, title, sort_order | 004 |
| `public.track_lessons` | Lecons: module_id, quiz, micro_project, xp_reward | 004, 019 |
| `public.user_lesson_progress` | Progression: quiz_score, project_submission, status, review_status | 004, 016, 018 |
| `public.user_projects` | Projets perso (table laterale) | 008 |
| `public.live_sessions` | Sessions live: title, scheduled_at, join_url, replay_url | 010 |
| `public.affiliate_links` | Liens d'affiliation: provider, category, url, logo | 015, 017 |
| `public.project_reviews` | Revue des micro-projets: author_id, reviewer_id, verdict | 016 |
| `public.notifications` | Notifications: user_id, type, title, body, link | 026 |

### 3.2 RPCs (fonctions cote serveur)

| Fonction | Role |
|---|---|
| `internal.compute_grade(p_points)` | Calcule le grade (Starter → Legend) |
| `internal.is_admin(p_user_id)` | Verifie si un user est admin |
| `internal.tg_user_profiles_derive_fields()` | Trigger: derive grade, referral_code, updated_at |
| `internal.tg_auth_users_create_profile()` | Trigger: cree le profil a l'inscription + parrainage |
| `internal.is_module_unlocked()` | Verifie si un module est debloque |
| `internal.refresh_lesson_completion()` | Recalcule la completion lecon + XP |
| `internal.sync_track_progress()` | Synchronise la progression du parcours |
| `internal.lesson_cleared()` | Verifie si une lecon est "franchie" (soumise) |
| `public.submit_lesson_quiz()` | Soumet un quiz (score, correction) |
| `public.submit_lesson_project()` | Soumet un micro-projet (selon mode validation) |
| `public.submit_project_review()` | Soumet une revue (approve/changes) |
| `public.list_review_queue()` | File d'attente des revues (peer/mentor) |
| `public.platform_stats()` | Statistiques globales |
| `public.public_leaderboard()` | Classement public |
| `public.community_projects()` | Projets communautaires |
| `public.create_notification()` | Cree une notification |
| `public.list_notifications()` | Liste les notifications |
| `public.count_unread_notifications()` | Compte les non-lues |
| `public.mark_notification_read()` | Marque comme lue |

### 3.3 Niveaux de validation des micro-projets

Chaque lecon peut avoir un `micro_project.validation` :
- `auto` (defaut) → soumission = valide
- `ai` → revue par IA (fallback multi-provider)
- `peer` → revue par un pair
- `mentor` → revue par un mentor/admin

### 3.4 Systeme de gamification

- **Points XP** `user_profiles.points` : gagnes en completant des lecons
- **Grades** : Starter (0) → Starter+ (250) → Builder (700) → Master (1500) → Legend (3000)
- **Parrainage** : 100 points pour le parrain a l'inscription du filleul
- **Recompense reviewer** : 10 points par revue soumise

---

## 4. Modules lib/ (23 fichiers)

| Module | Fonctions exportees | Description |
|---|---|---|
| `tracks.js` | `listPublishedTracks`, `listRecommendedTracksForGoal`, `listUserTrackEnrollments`, `ensureUserTrackEnrollment`, `ensureUserPrimaryEnrollment`, `mapTrackToRecommendation`, `normalizeTrackRow`, `formatTrackMeta` | CRUD parcours et inscriptions |
| `parcours.js` | `getLevelChipClass`, `toProgress`, `toTextList`, `buildTrackCompetencies`, `getStepUi`, `buildStepRows` | Helpers UI pour l'affichage parcours |
| `curriculum.js` | `getTrackCurriculum`, `findLessonInCurriculum` | Chargement du curriculum (modules + lecons + progression) |
| `reviews.js` | `getReviewQueue` | File de revue des micro-projets |
| `memberSpace.js` | `listUserProjects`, `listUserResources` | Projets et ressources de l'espace membre |
| `userProjects.js` | `listOwnProjects`, `getOwnProject`, `statusLabel` | Projets personnels de l'utilisateur |
| `onboarding.js` | `GOAL_OPTIONS`, `LEVEL_OPTIONS`, `findGoalOption`, `buildOnboardingRecommendation`, `isOnboardingCompleted`, `getOnboardingProfile` | Questionnaire onboarding (buts, niveaux, recommandations) |
| `affiliate.js` | `AFFILIATE_CATEGORIES`, `listPublishedAffiliates`, `listAllAffiliates`, `getAffiliate`, `categoryLabel` | Gestion des liens d'affiliation |
| `aiReview.js` | `getAIReviewConfig`, `isAIReviewAvailable`, `reviewProject` | Service de revue IA avec fallback multi-provider (OpenRouter, Gemini, HuggingFace) |
| `auth.js` | `getUserRole`, `userHasRole`, `getUserProfile`, `getUserAccessContext`, `isBootstrapAdminEmail`, `normalizeRole`, `hasRole` | Gestion des roles et profils |
| `authErrors.js` | `toAuthErrorMessage`, `isValidAuthEmail`, `sanitizeAuthEmail` | Messages d'erreur auth traduits |
| `grades.js` | `GRADES`, `getGradeProgress` | Grades et progression XP |
| `liveSessions.js` | `getMemberSessions`, `listAllSessions`, `getSession` | Sessions live |
| `community.js` | `getCommunityProjects` | Projets communautaires |
| `leaderboard.js` | `getPublicLeaderboard` | Classement |
| `platformStats.js` | `getPlatformStats` | Statistiques globales |
| `seo.js` | `buildPageMetadata`, `SEO_DEFAULTS` | Metadata SEO/OG |
| `trackGuidance.js` | `getTrackGuidance`, `orderTracksByGuidance`, `missingPrerequisites`, `guidanceLevelChip` | Ordre conseille des parcours |
| `avatar.js` | `dicebearUrl`, `resolveAvatarUrl`, `getInitials` | Avatars DiceBear |
| `displayName.js` | `formatDisplayName` | Nom d'affichage |
| `username.js` | `generateUsername` | Generation pseudo aleatoire |
| `adminCurriculum.js` | `listAdminTracks`, `getAdminTrack`, `getAdminTrackCurriculum`, `getAdminLesson` | CRUD admin |
| `adminUsers.js` | `buildAuthUsersLookup`, `mergeProfilesWithAuthUsers` | Gestion admin des utilisateurs |

---

## 5. Routes de l'application

### 5.1 Pages publiques

| Route | Composant/Purpose |
|---|---|
| `/` | Landing page (Hero, HowItWorks, Competences, Community, FAQ, etc.) |
| `/parcours` | Catalogue des parcours |
| `/parcours/[slug]` | Detail d'un parcours (competences, curriculum, progression) |
| `/parcours/[slug]/lecon/[lessonSlug]` | Lecon individuelle (quiz, micro-projet, ressources) |
| `/competences` | "Ce que tu peux creer" (tags defilants) |
| `/projets` | Catalogue des projets |
| `/communaute` | Galerie projets communautaires |
| `/classement` | Leaderboard public |
| `/tarifs` | Offres et tarifs |
| `/connexion` / `/signin` / `/signup` | Pages auth |
| `/onboarding` | Questionnaire post-inscription |
| `/privacy` / `/terms` / `/cookies` | Pages legales |

### 5.2 Dashboard (espace membre)

| Route | Purpose |
|---|---|
| `/dashboard` | Accueil: progression, stats, quick links, GuidedTour |
| `/dashboard/parcours` | Mes parcours inscrits |
| `/dashboard/projets` | Mes projets personnels (+ creation) |
| `/dashboard/ressources` | Ressources agregees de tous les parcours |
| `/dashboard/guide` | Guide de demarrage |
| `/dashboard/profil` | Edition profil |
| `/dashboard/communaute` | Communaute (vitrine) |
| `/dashboard/sessions` | Sessions live |
| `/dashboard/reviews` | File de revue (peer review) |
| `/dashboard/outils` | Outils recommandes (affiliation) |
| `/dashboard/mentor` | Proposer un parcours (mentor) |

### 5.3 Admin

| Route | Purpose |
|---|---|
| `/admin` | Vue d'ensemble |
| `/admin/parcours` | CRUD parcours |
| `/admin/parcours/nouveau` / `/[trackId]` | Creation/edition parcours |
| `/admin/parcours/[trackId]/lecons` | Curriculum (modules + lecons) |
| `/admin/revues` | Historique des revues |
| `/admin/utilisateurs` | Gestion utilisateurs |
| `/admin/sessions` | CRUD sessions live |
| `/admin/affiliations` | CRUD liens d'affiliation |
| `/admin/ia` | Configuration IA Review |

### 5.4 API Routes

| Route | Purpose |
|---|---|
| `api/tracks/...` | Endpoints tracks |
| `api/lessons/...` | Endpoints lecons (quiz, project, ai-review) |
| `api/debug/...` | Outils de debug |

---

## 6. Composants cles

### Layouts
- **`app/(app)/layout.js`** : Layout protege par auth + AppShell
- **`app/layout.js`** : Layout racine (SEO defaults)
- **`components/app-shell/AppShell.js`** : Dashboard shell (sidebar, header, NotificationBell, GuidedTour)
- **`components/app-shell/appNav.js`** : Navigation dashboard

### Pages publiques
- **`components/Navbar.js`** : Navbar public
- **`components/Hero.js`** : Hero landing
- **`components/CompetencesSection.js`** : Tags defilants
- **`components/CommunitySection.js`** : Section communaute
- **`components/FAQSection.js`** : FAQ
- **`components/FooterSection.js`** : Footer
- **`components/ParcoursSection.js`** : Liste parcours
- **`components/ProjectsSection.js`** : Liste projets

### Visites guidees
- **`components/app-shell/GuidedTour.js`** : Tour dashboard (sidebar highlight)
- **`components/public-tour/PublicTour.js`** : Tour pages publiques (overlay cards)

### Auth
- **`components/AuthOnboardingPage.js`** : Pages connexion/inscription
- **`components/OnboardingExperiencePage.js`** : Questionnaire onboarding
- **`components/ForgotPasswordPageClient.js`** : Mot de passe oublie
- **`components/ResetPasswordPageClient.js`** : Reset mot de passe

### Admin
- **`components/admin/TrackForm.js`** : Formulaire parcours
- **`components/admin/LessonForm.js`** : Formulaire lecon
- **`components/admin/TrackElementsManager.js`** : Gestion modules/lecons
- **`components/admin/ReviewHistory.js`** : Historique revues
- **`components/admin/AdminOverview.js`** : Dashboard admin
- **`components/admin/AffiliateForm.js`** : Formulaire affiliation
- **`components/admin/SessionForm.js`** : Formulaire session live
- **`components/admin/PendingTracksReview.js`** : Validation tracks mentor

---

## 7. Diagramme des flux

```
Utilisateur
  │
  ├── Auth (connexion/inscription)
  │   └── Onboarding questionnaire
  │       └── Recommendation parcours automatique
  │
  ├── Parcours (learning_tracks)
  │   ├── Modules (track_modules)
  │   │   └── Lecons (track_lessons)
  │   │       ├── Quiz (submit_lesson_quiz)
  │   │       ├── Micro-projet (submit_lesson_project)
  │   │       │   └── Revue (auto / ai / peer / mentor)
  │   │       └── Ressources
  │   └── Progression (user_lesson_progress + user_track_enrollments)
  │
  ├── Projets personnels (user_projects)
  ├── Sessions live (live_sessions)
  ├── Communaute (community_projects RPC)
  └── Gamification
      ├── Points XP → Grades
      └── Parrainage → Bonus points
```

---

## 8. Points d'amelioration potentiels

### 8.1 Code et architecture

| Probleme | Recommandation |
|---|---|
| **Pas de TypeScript** | Migrer vers TypeScript pour la securite de type. Les `normalizeText()`, `isFinite()` partout montrent le besoin |
| **Pas de tests** | Ajouter des tests (Jest/Vitest) pour les lib/ modules et les RPCs. Les branches `if (error)` sont critique |
| **23 fichiers lib/ sans namespace** | Les modules sont plats. Envisager des sous-dossiers : `lib/tracks/`, `lib/curriculum/`, `lib/auth/` |
| **Pas de validation Zod** | Les donnees entrantes (RPC, API) ne sont pas validatees avec un schema. `normalize*` fait office de validateur ad-hoc |
| **Pattern `normalize*` repete** | Chaque module redefinit `normalizeText()`, `normalizeArray()`, `isMissingSchemaError()`. Factoriser dans `lib/utils.js` |
| **Schema readiness fragile** | Le pattern `schemaReady` est decent mais pourrait etre un hook personnalise `useSchemaReady` |
| **Pas de React Query / SWR** | Les chargements data sont ad-hoc. Ajouter une couche de cache/fetch |

### 8.2 Fonctionnalites manquantes ou incompletes

| Fonctionnalite | Statut | Priorite |
|---|---|---|
| **Paiements/abonnements** | Non implemente (page tarifs statique) | Haute |
| **Recherche plein texte** | Non implementee | Haute |
| **Mode sombre** | Non implemente | Haute |
| **PWA (offline)** | Non implementee | Haute |
| **WebSockets pour sessions live** | Non implemente (replay seulement) | Haute |
| **Mentions/notifications en temps reel** | Notifications seulement (RPC, pas de Realtime) | Haute |
| **Email automatique** | Non implemente (juste Supabase Auth emails) | Haute |
| **Forum/commentaires** | Non implemente (peer review basique) | Haute |
| **Export certificat/competences** | Non implemente | Haute |
| **Internationalisation (i18n)** | Non implementee (francais seulement) | Haute |
| **Plan de repas/calendrier etudiant** | Non implemente (next_session statique) | Haute |
| **Upload fichiers projets** | Soumission texte seulement, pas d'upload | Haute |
| **Analytics utilisateur avance** | Seulement `platform_stats` RPC basique | Haute |
| **Backup/restore BDD** | Aucun script de backup | Haute |
| **Cache Redis/CDN** | Non configure | Haute |
| **CI/CD tests automatiques** | Non configure | Haute |

### 8.3 Securite

| Probleme | Recommandation |
|---|---|
| **RLS bien faite** (bon point) | Mais `user_lesson_progress` n'a pas de RLS INSERT/UPDATE (tout passe par RPC) |
| `grant update (role, points) on user_profiles to authenticated` | Trop permissif. Tout membre peut tenter de s'auto-promouvoir admin (RLS empeche, mais la grant est large) |
| **Cle API IA en env** | Correct (process.env), mais ajouter rotation automatique |
| **Rate limiting API** | Aucun rate limiting sur les routes API (abuser de l'IA review = cout) |
| **SQL injectable dans `excludedTrackIds`** | `"in", "(" + excludedTrackIds.join(",") + ")"` → dangereux. Utiliser `.in()` directement |

### 8.4 Performance

| Probleme | Recommandation |
|---|---|
| **N+1 queries dans memberSpace** | `listUserResources` fait 3 requetes sequentielles au lieu d'une avec jointure |
| **Pas de pagination sur les listes** | `listPublishedTracks`, `listAdminTracks`, etc. ont un limit mais pas de pagination offset/cursor |
| **RPC `list_review_queue` peut etre lourde** | Plusieurs JOIN + sous-requetes. Ajouter un index sur `review_status` |
| **Images non optimisees** | Vite, utiliser `next/image` partout |

### 8.5 UX / Frontend

| Probleme | Recommandation |
|---|---|
| **Pas de squelette/loading unifie** | Un `loading.js` global mais pas de squelette par composant |
| **Gestion erreur utilisateur basique** | Les erreurs Supabase sont `console.log` -> toast/snackbar |
| **Accessibilite (a11y)** | Non auditee. Ajouter labels ARIA, focus management |
| **Formulaires sans validation cote client** | `TrackForm`, `LessonForm` se fient a Supabase pour les erreurs |
| **Pas de mode hors-ligne** | Rien n'est prevu pour le offline |

### 8.6 Maintenance

| Probleme | Recommandation |
|---|---|
| **26 migrations SQL non versionnees** | Utiliser Supabase CLI + un dossier `migrations/` chronologique |
| **Pas de seed data standardise** | Les seeds sont dans les migrations (003, 005, 020, 022). Les separer |
| **.env.local non documente** | Documenter toutes les variables d'env dans `.env.example` |
| **Logs: 50+ fichiers .log a la racine** | Nettoyer les logs ou les mettre dans `logs/.gitignore` |
| **Build logs nombreux** | Les fichiers `.build-*.log` polluent la racine. Nettoyer |

---

## 9. Statistiques du projet

- **Fichiers** : ~33 composants, 23 modules lib, 26 migrations SQL
- **Pages** : ~30 pages (publiques + dashboard + admin)
- **Tables Supabase** : 12 tables
- **RPCs serveur** : 15+
- **Triggers DB** : 6
- **Indexes** : ~20
- **Lignes de code** : ~7000-9000 estime (sans node_modules)

---

## 10. Recommandations rapides (Top 3)

1. **Migration TypeScript** : Commencer par `lib/` → composants → pages. Ajouter `tsconfig.json`
2. **Tests** : Ecrire des tests pour les RPCs (pgTAP ou direct SQL) et les modules `lib/` (Vitest)
3. **Paiement Stripe** : Implementer les abonnements pour monétiser la plateforme

---

## 11. Conventions du code

- **Fonctions async** retournent `{ data, error, schemaReady }` pattern
- **Donnees normalisees** : les `normalize*()` fonctions assurent des defaults
- **Pas de librairie UI** : styling Tailwind inline (pas de shadcn/ui, pas de MUI)
- **Icones** : Lucide via `iconify-icon` web component
- **Polices** : `font-valorax`, `font-venite-italic`, `font-body-readable`
- **Couleurs** : Variables Tailwind custom, palette bleu/violet/cyan/emeraude
- **Accents** : Supprimes des titres/labels, conserves dans le corps de texte
- **Onboarding** : Stocke dans `user_metadata` (pas de table dediee)
