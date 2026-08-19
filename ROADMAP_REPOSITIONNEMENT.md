# Ce que le repositionnement change dans l'application

> Ce document développe le **§07 de [VISION.md](VISION.md)**. La vision donne les huit
> jalons et leur critère de validation. Ici, on dit ce que chaque jalon implique
> concrètement : base de données, pages, textes, coach IA.
>
> C'est un plan, pas du code. Le suivi des versions livrées reste dans
> [ROADMAP_EVOLUTION.md](ROADMAP_EVOLUTION.md). Le détail du modèle économique est dans
> [BUSINESS_MODEL.md](BUSINESS_MODEL.md).
>
> **À lire avant celui-ci :** [SYSTEME_PROJET.md](SYSTEME_PROJET.md) définit ce qu'est un
> projet (anatomie, frameworks, modèles, kits, lien parcours ↔ projet) et
> [FONCTIONNALITES.md](FONCTIONNALITES.md) liste ce qu'il faut construire, par acteur et
> par jalon. Ce document-ci ne traite que de la traduction dans le schéma et les pages.
>
> Vocabulaire : celui du §04 de la vision — **Visiteur**, **Membre**, **Builder**,
> **Contributor**, **Mentor**, **Expert**.
>
> Écrit le 18 août 2026, revu le 19 août 2026.

---

## 0. Le principe : changer la finalité, pas tout refaire

**Il n'y a rien à jeter.** Les parcours, les projets, la communauté, le classement, les
sessions live, les mentors, les projets publiés : tout ça sert déjà. Ce qui change, c'est
**où on emmène les gens**, et **ce qu'on appelle un projet**.

```
Avant      : Parcours → Projet → Publication → Revenus
Maintenant : Parcours → Projet → Réalisation → Preuve d'expérience → Opportunité
             (et le chemin « → Publication → Revenus » reste entier)
```

## 1. Ce qui existe déjà et sert directement

| Ce qui existe | À quoi ça sert maintenant |
| --- | --- |
| `learning_tracks`, `track_modules`, `track_lessons` | les parcours, quel que soit le type de projet |
| `user_projects`, `project_reviews`, `project_likes`, `project_comments` | le projet BUILD, et la base du portfolio |
| `user_profiles` (rôles, points, parrainage) | la base des rôles Visiteur → Expert |
| les RPC de projets publiés et le profil public | la base de la preuve d'expérience |
| `live_sessions` | les sessions avec un Mentor, puis les sessions payantes |
| `affiliate_links` | une source de revenus déjà active, à garder telle quelle |
| le coach IA ([app/api/assistant/chat/route.ts](app/api/assistant/chat/route.ts)) | ce qui transforme un objectif en parcours |
| [lib/currency.ts](lib/currency.ts) | le « premier euro » est déjà devenu « premier revenu » |

## 2. Ce qui coince aujourd'hui

Vérifié dans le code, du plus bloquant au moins bloquant.

**1. Un projet est forcément un projet informatique.**
Dans [supabase/sql/008_user_projects.sql](supabase/sql/008_user_projects.sql), un projet
n'a que deux liens : `repo_url` (le code) et `live_url` (la démo). Une formation en ligne,
une chaîne YouTube ou un podcast n'ont ni l'un ni l'autre. Ils ont une chaîne, une
playlist, une page de vente, un fichier.

**2. Les textes du site annoncent encore l'ancienne promesse.**
Le titre de la page d'accueil dit `BUILD YOUR PROJECT. / DEPLOY & MONETIZE.`
([lib/i18n.ts:2445](lib/i18n.ts:2445)). Et la liste des types de projets — « site vitrine,
SaaS, e-commerce, blog, app mobile, API » ([lib/i18n.ts:2867](lib/i18n.ts:2867)) — ne
contient que de l'informatique.

**3. Être Mentor, c'est une case cochée, pas quelque chose qu'on gagne.**
Le rôle est un simple champ à trois valeurs : `role in ('user','mentor','admin')`
([supabase/sql/001_roles_points_referrals.sql:9](supabase/sql/001_roles_points_referrals.sql:9)).
Aucune progression, aucun critère, et nulle part la trace de ce que le Mentor a lui-même
réalisé — alors que c'est précisément ce qui doit fonder son statut.

**4. Il n'y a qu'une seule porte d'entrée : BUILD.**
Pas de Challenges, pas de Missions, pas d'organisations. Le second côté de la plateforme
n'existe nulle part dans la base de données.

**5. La liste des façons de gagner de l'argent est trop courte.**
`revenue_model` n'accepte que `vente`, `abonnement`, `publicite`, `affiliation`,
`freelance` ([supabase/migrations/20260718110000_project_revenue_model.sql](supabase/migrations/20260718110000_project_revenue_model.sql)).
Il manque au minimum la vente de formation, le sponsoring et les dons.

**6. Le coach IA ne sait pas de quel type de projet on parle.**
Ses instructions ([app/api/assistant/chat/route.ts:88](app/api/assistant/chat/route.ts:88))
lui disent d'aider « sur son projet et son apprentissage », sans jamais préciser de quoi
il s'agit. Or accompagner une chaîne YouTube n'a rien à voir avec accompagner un SaaS.

**7. La page tarifs est vide.**
[app/pricing/page.tsx](app/pricing/page.tsx) ne contient que deux boutons. C'est cohérent
tant qu'il n'y a rien à vendre, à reprendre au moment de Taka+.

---

## 3. Les huit jalons

---

### J1 — Clarifier le positionnement

> **Validation (vision) :** un nouveau Visiteur comprend immédiatement que TakaCode aide à
> réaliser des projets, pas uniquement des projets informatiques.

**Textes du site**

- **Titre de la page d'accueil.** Remplacer `BUILD YOUR PROJECT. / DEPLOY & MONETIZE.`
  ([lib/i18n.ts:2445](lib/i18n.ts:2445)).
  ⚠️ Ce titre utilise les polices VALORAX et VENITE, **qui n'ont pas les caractères
  accentués** (voir [INVENTAIRE_POLICES_DISPLAY.md](INVENTAIRE_POLICES_DISPLAY.md)). Une
  formulation française doit donc être sans accents, ou il faut changer de police.
- **Liste des types de projets** ([lib/i18n.ts:2867](lib/i18n.ts:2867)) : ajouter formation
  en ligne, chaîne YouTube, podcast, newsletter, produit digital, activité freelance,
  agent IA / automatisation.
- **« Premier euro »** ([lib/i18n.ts:1253](lib/i18n.ts:1253), `membersEuro`,
  `membersWithEuro`) : [lib/currency.ts](lib/currency.ts) parle déjà de « premier revenu ».
  Il reste des libellés à aligner.
- **Vocabulaire.** Les pages publiques (accueil, tarifs, parcours vus sans compte, textes
  pour Google) parlent à un **Visiteur** : elles ne doivent ni l'appeler « Membre », ni
  supposer qu'il a déjà un projet. L'espace connecté parle à un **Membre**, l'espace projet
  à un **Builder**. Les textes actuels sont déjà corrects sur ce point
  (`noAccountPrompt: "Pas encore membre ?"`, [lib/i18n.ts:1145](lib/i18n.ts:1145)) — c'est
  la nouvelle copy qu'il faut écrire du bon point de vue.

**Coach IA**

- Lui transmettre le type de projet et adapter son accompagnement
  ([app/api/assistant/chat/route.ts:88](app/api/assistant/chat/route.ts:88)). Un parcours
  « chaîne YouTube » (choisir une niche, créer l'identité, définir le processus de
  production, publier) n'a rien à voir avec un parcours SaaS.
- C'est ce que le Membre verra le plus, pour le moins de travail.

**À faire après toute modification de contenu en base :**
`node scripts/fix-french-content.mjs --apply` (voir le README).

**J1 est livrable tout de suite, sans attendre le reste.**

---

### J2 — Généraliser le système de projets

> **Validation (vision) :** une chaîne YouTube peut être accompagnée aussi efficacement
> qu'une application.

**Base de données**

- Ajouter `user_projects.project_type` : `logiciel`, `agent_ia`, `boutique`, `formation`,
  `contenu_video`, `podcast`, `newsletter`, `freelance`, `produit_digital`, `autre`.
  Valeur devinée depuis le parcours choisi, modifiable ensuite.
- Remplacer `repo_url` et `live_url` par une table `project_deliverables`
  (`project_id`, `kind`, `label`, `url`, `sort_order`). Le champ `kind` dépend du type de
  projet : dépôt de code, application publiée, chaîne, playlist, boutique, épisode,
  document, produit téléchargeable, page de vente, portfolio, premier client.
  *Pendant la transition, garder `repo_url` et `live_url` en lecture et les remplir comme
  deux entrées de cette table, pour ne rien casser.*
- Élargir `revenue_model` (ajouter `formation`, `sponsoring`, `dons`, `services`), ou le
  sortir dans une table de référence.
- Ajouter `learning_tracks.project_type`, pour recommander un parcours à partir du type de
  projet visé.

**Code**

- `lib/userProjects`, [lib/getPublicProject.ts](lib/getPublicProject.ts),
  [lib/publicProfile.ts](lib/publicProfile.ts) : lire les nouveaux livrables.
- Les fonctions SQL qui renvoient les projets publics (`supabase/migrations/2026071822*`,
  `2026071900*`) listent les colonnes une par une, `repo_url` et `revenue_model` compris.
  Elles doivent évoluer dans la même migration.
- Formulaire de création et page projet : afficher les champs selon le type de projet.

**Attention :** ces fonctions SQL sont des `security definer`, c'est-à-dire qu'elles
s'exécutent avec des droits élevés et contournent les règles d'accès habituelles. À
modifier avec les tests correspondants.

---

### J3 — Transformer le profil en preuve d'expérience

> **Validation (vision) :** quelqu'un peut partager son profil TakaCode dans une
> candidature ou auprès d'un client.

- Chaque projet terminé enrichit automatiquement le profil : livrables, rôle tenu, durée,
  compétences mobilisées, validations reçues (IA, pairs, Mentor).
- Distinguer clairement **projet terminé** et **projet publié**. La vision fait du taux de
  projets menés jusqu'au bout le moteur de la plateforme : il doit se voir.
- Rendre le profil partageable : adresse propre, aperçu correct sur les réseaux, version
  imprimable.
- Créer `project_members` (`project_id`, `user_id`, `role`, `is_lead`). Indispensable dès
  qu'il y a des projets à plusieurs (J5 et J7).

---

### J4 — Déployer contribution et mentorat

> **Validation (vision) :** des mentors accompagnent réellement des Builders et
> contribuent à augmenter le taux de projets terminés.

- Séparer deux choses aujourd'hui mélangées : les **droits techniques** (`user | admin`,
  utilisés par les règles de sécurité de la base) et le **rôle dans la communauté**
  (`visiteur | membre | builder | contributor | mentor | expert`). Ne pas surcharger
  `user_profiles.role`, dont les valeurs servent aux policies RLS.
- Attribuer les rôles automatiques (Membre à l'inscription, Builder au premier projet) et
  calculer les rôles mérités sur activité réelle : projets terminés, relectures utiles,
  réponses acceptées, parcours complétés.
- **On ne peut se porter candidat Mentor que sur un parcours qu'on a soi-même terminé.**
  C'est la règle qui fonde tout le §04 de la vision.
- Permettre la vérification d'un professionnel extérieur, qui peut devenir Mentor sans
  avoir suivi le parcours sur la plateforme.
- Créer `mentorships` (`mentor_id`, `builder_id`, `project_id`, `track_id`, `status`,
  `started_at`).

**Pourquoi ce jalon vient avant les Missions :** un vivier de Mentors ne se fabrique pas
en un mois. Il se construit avant d'en avoir besoin.

---

### J5 — Lancer les Challenges

> **Validation (vision) :** plusieurs membres terminent un même Challenge avec des
> résultats différents et publiables.

- Créer `challenges` : objectif, contexte, contraintes, livrables attendus, durée
  indicative, critères d'évaluation, `project_type`, parcours associé.
- Créer `challenge_participations` (individuel ou en équipe, via `project_members`).
- Un Challenge crée **un projet normal** dans `user_projects`. Le portfolio, les
  relectures et le classement fonctionnent alors sans rien changer.
- Réutiliser `project_reviews` pour l'évaluation et `live_sessions` pour les points
  d'étape.

**L'effet qu'on oublie :** comme plusieurs personnes traitent le même problème avec des
approches différentes, on obtient des réalisations comparables. C'est ce qui permettra
de choisir qui envoyer sur une Mission, et de justifier ce choix.

---

### J6 — Vendre les premières Missions manuellement

> **Validation (vision) : des entreprises ont réellement payé.**

**Rien à développer.** Cinq à dix Missions vendues au téléphone, pilotées dans un tableur
et un fil de discussion. Un responsable nommé sur chacune.

Ce qu'on cherche à apprendre pendant ces missions, et qu'on ne peut apprendre autrement :

- combien de temps prend réellement le cadrage d'un besoin flou ;
- si la répartition 55-65 / 15-20 / 20-25 tient (voir [BUSINESS_MODEL.md](BUSINESS_MODEL.md)) ;
- ce qui casse quand une équipe de Membres livre à un vrai client ;
- ce que l'entreprise regarde vraiment au moment de valider.

**C'est une validation commerciale, pas technique.** Elle conditionne J7 et J8.

---

### J7 — Intégrer Missions dans TakaCode

> Seulement après J6.

- Créer `organizations` (nom, secteur, contact, pays) et `organization_members`.
- Créer `missions` : organisation, besoin brut, périmètre, livrables, `project_type`,
  budget, échéance, état (`soumise`, `cadrée`, `ouverte`, `en_cours`, `livrée`, `clôturée`).
- Créer `mission_applications` (candidatures) et `mission_team` (responsable de mission et
  participants). Une Mission crée elle aussi un projet normal.
- Espace entreprise : déposer un besoin, suivre l'avancement, valider les livrables.
- **Un responsable de mission est désigné dès la création. Ce n'est pas optionnel** —
  c'est ce qui répond au risque n°2 de la vision.

---

### J8 — Construire l'infrastructure économique

> On automatise ce qui fonctionne déjà.

- **Le circuit d'argent d'abord**, dans les quatre étapes de la vision :
  `encaisser → sécuriser → répartir → reverser`, via Mobile Money (Wave, Orange Money,
  MTN MoMo). Tant que ce circuit n'est pas fiable, le reste n'a pas de sens.
- Blocage des fonds jusqu'à validation du livrable, et procédure en cas de désaccord.
- Taka+ : réserver certaines fonctions aux abonnés (coach IA plus performant, quotas,
  analyses, portfolio enrichi). Reprendre [app/pricing/page.tsx](app/pricing/page.tsx),
  aujourd'hui vide. **On ajoute des fonctions payantes, on n'en retire jamais du gratuit.**
- Marketplace d'expertise : commencer par les sessions individuelles (petits montants, peu
  de risque) avant les prestations.
- Créer `transactions` et `payouts` pour tracer tout ce qui entre et sort, plus la
  facturation.

---

## 4. Ce qu'on ne fait pas maintenant

- Refaire le design ou l'architecture : rien dans la vision ne l'exige.
- Ouvrir la Marketplace avant d'avoir du monde des deux côtés (repère : 200 projets
  terminés, 30 Mentors).
- Construire l'espace entreprise avant d'avoir vendu des Missions à la main.
- Faire payer quoi que ce soit qui est gratuit aujourd'hui.
- Renommer les tables existantes. `user_projects` reste `user_projects`. Un Challenge et
  une Mission créent des projets ordinaires. Moins de concepts, plus de réutilisation.
