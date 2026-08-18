# Ce que le repositionnement change dans l'application

> Ce document traduit [VISION.md](VISION.md) et [BUSINESS_MODEL.md](BUSINESS_MODEL.md) en
> travaux concrets. C'est un plan, pas du code.
>
> Le suivi des versions et des livraisons reste dans
> [ROADMAP_EVOLUTION.md](ROADMAP_EVOLUTION.md).
>
> Vocabulaire : voir le §2 de [VISION.md](VISION.md#2-qui-est-qui-et-comment-on-lappelle).
> Une **personne** n'a pas de compte, un **membre** en a un, un **Builder** a un projet en
> cours, puis viennent Contributor, Mentor et Expert. Cette règle vaut aussi pour les
> textes du site : voir le chantier C7.
>
> Écrit le 18 août 2026, revu le 19 août 2026.

---

## 0. L'idée générale : changer la finalité, pas tout refaire

**Il n'y a rien à jeter.** Les parcours, les projets, la communauté, le classement, les
sessions live, les mentors, les projets publiés : tout ça sert déjà. Ce qui change, c'est
**où on emmène les gens**, et **ce qu'on appelle un projet**.

```
Avant     : Parcours → Projet → Publication → Revenus
Maintenant: Parcours → Projet → Expérience → Portfolio → Opportunité
            (et le chemin « → Publication → Revenus » reste entier)
```

## 1. Ce qui existe déjà et qui sert directement

| Ce qui existe | À quoi ça sert maintenant |
|---|---|
| `learning_tracks`, `track_modules`, `track_lessons` | les parcours, quel que soit le type de projet |
| `user_projects`, `project_reviews`, `project_likes`, `project_comments` | le projet personnel, et la base du portfolio |
| `user_profiles` (rôles, points, parrainage) | la base de la progression Builder → Expert |
| les RPC de projets publiés et le profil public | la base du portfolio qu'on peut montrer |
| `live_sessions` | les sessions avec un mentor, puis les sessions payantes |
| `affiliate_links` | une source de revenus déjà active, à garder telle quelle |
| le coach IA ([app/api/assistant/chat/route.ts](app/api/assistant/chat/route.ts)) | ce qui construira le parcours selon le type de projet |
| [lib/currency.ts](lib/currency.ts) | le « premier euro » est déjà devenu « premier revenu » |

## 2. Ce qui coince aujourd'hui

Vérifié dans le code, du plus bloquant au moins bloquant.

**1. Un projet est forcément un projet informatique.**
Dans [supabase/sql/008_user_projects.sql](supabase/sql/008_user_projects.sql), un projet
n'a que deux liens : `repo_url` (le code) et `live_url` (la démo). Une formation en
ligne, une chaîne YouTube ou un podcast n'ont ni l'un ni l'autre. Ils ont une chaîne, une
playlist, une page de vente, un fichier PDF.

**2. Les textes du site annoncent encore l'ancienne promesse.**
Le titre de la page d'accueil dit `BUILD YOUR PROJECT. / DEPLOY & MONETIZE.`
([lib/i18n.ts:2445](lib/i18n.ts:2445)). Et la liste des types de projets proposés — « site
vitrine, SaaS, e-commerce, blog, app mobile, API » ([lib/i18n.ts:2867](lib/i18n.ts:2867))
— ne contient que de l'informatique.

**3. Être mentor, c'est une case cochée, pas quelque chose qu'on gagne.**
Le rôle est un simple champ à trois valeurs : `role in ('user','mentor','admin')`
([supabase/sql/001_roles_points_referrals.sql:9](supabase/sql/001_roles_points_referrals.sql:9)).
Il n'y a aucune progression, aucun critère, et nulle part la trace de ce que le mentor a
lui-même terminé.

**4. Il n'y a qu'une seule porte d'entrée : mon idée.**
Pas de challenges, pas de missions, pas d'entreprises. Le deuxième côté de la plateforme
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
[app/pricing/page.tsx](app/pricing/page.tsx) ne contient que deux boutons. C'est normal
tant qu'il n'y a rien à vendre, mais c'est à reprendre quand Taka+ arrivera.

## 3. Les chantiers

Rangés par dépendance : chacun peut être livré seul, mais ceux du haut débloquent ceux du
bas.

---

### C1 — Un projet peut être autre chose que du code

*À faire en premier : tout le reste en dépend.*

**Base de données**

- Ajouter `user_projects.project_type` : `logiciel`, `boutique`, `formation`,
  `contenu_video`, `podcast`, `newsletter`, `freelance`, `produit_digital`, `autre`.
  Valeur devinée à partir du parcours choisi, modifiable ensuite.
- Remplacer `repo_url` et `live_url` par une table `project_deliverables`
  (`project_id`, `kind`, `label`, `url`, `sort_order`). Le champ `kind` dépend du type de
  projet : dépôt de code, démo, chaîne, playlist, page de vente, épisode, flux RSS,
  fichier, capture d'écran.
  *Pendant la transition, on garde `repo_url` et `live_url` en lecture et on les remplit
  comme deux entrées de cette table, pour ne rien casser.*
- Élargir la liste de `revenue_model` (ajouter `formation`, `sponsoring`, `dons`,
  `services`), ou la sortir dans une table à part.
- Ajouter `learning_tracks.project_type`, pour pouvoir recommander un parcours à partir
  du type de projet visé.

**Code**

- `lib/userProjects`, [lib/getPublicProject.ts](lib/getPublicProject.ts),
  [lib/publicProfile.ts](lib/publicProfile.ts) : lire les nouveaux livrables.
- Les fonctions SQL qui renvoient les projets publics (`supabase/migrations/2026071822*`,
  `2026071900*`) listent les colonnes une par une, `repo_url` et `revenue_model` compris.
  Elles doivent évoluer en même temps, dans une seule migration.
- Formulaire de création et page projet : afficher les champs selon le type de projet.

**Attention :** ces fonctions SQL sont des `security definer`, c'est-à-dire qu'elles
s'exécutent avec des droits élevés et contournent les règles d'accès habituelles. Il faut
les modifier avec les tests correspondants, pas à la va-vite.

---

### C2 — Faire du portfolio une vraie preuve

Aujourd'hui, le profil public est une carte de visite. Il doit devenir ce qu'on montre à
un recruteur ou à un client.

- Afficher les projets terminés avec : les livrables, le rôle qu'on a tenu, le temps que
  ça a pris, les compétences utilisées, et les validations reçues (IA, pairs, mentor).
- Distinguer clairement **projet terminé** et **projet publié**. La vision fait du nombre
  de projets terminés le chiffre le plus important : il doit se voir.
- Permettre de partager : une adresse propre, un aperçu correct sur les réseaux, une
  version imprimable.
- Créer `project_members` (`project_id`, `user_id`, `role`, `is_lead`). Indispensable dès
  qu'on aura des projets à plusieurs (C4 et C5).

---

### C3 — La progression Builder → Contributor → Mentor → Expert

Sans ça, il n'y a pas de mentors bénévoles crédibles, donc pas de missions.

- Séparer deux choses aujourd'hui mélangées : les **droits techniques**
  (`user | admin`, utilisés par les règles de sécurité de la base) et le **niveau dans la
  communauté** (`builder | contributor | mentor | expert`). Ne pas surcharger
  `user_profiles.role`, dont les valeurs servent aux règles d'accès.
- Définir des critères automatiques : nombre de projets terminés, relectures utiles,
  réponses acceptées dans la communauté, parcours complétés.
- On ne peut se porter candidat mentor que **sur un parcours qu'on a soi-même terminé**.
  C'est cette règle qui rend le mentorat sérieux.
- Créer `mentorships` (`mentor_id`, `builder_id`, `project_id`, `track_id`, `status`,
  `started_at`).

**Pourquoi maintenant et pas plus tard :** les missions ont besoin de mentors. Un vivier
de mentors ne se fabrique pas en un mois, il se construit avant d'en avoir besoin.

---

### C4 — Les challenges

- Créer `challenges` (titre, énoncé, `project_type`, difficulté, ce qu'on attend, dates,
  parcours associé) et `challenge_participations` (seul ou en équipe, via
  `project_members`).
- Un challenge crée **un projet normal** dans `user_projects`. Comme ça, le portfolio, les
  relectures et le classement fonctionnent sans rien changer.
- Réutiliser `project_reviews` pour l'évaluation et `live_sessions` pour les points
  d'étape.

**L'intérêt qu'on oublie :** comme tout le monde travaille sur le même énoncé, on obtient
des travaux comparables entre eux. C'est ce qui permettra de choisir qui envoyer sur une
mission payée, et de justifier ce choix.

---

### C5 — Les missions et les organisations

- Créer `organizations` (nom, secteur, contact, pays) et `organization_members`.
- Créer `missions` (organisation, besoin brut, énoncé clarifié, `project_type`, budget,
  échéance, état : `soumise`, `cadrée`, `ouverte`, `en_cours`, `livrée`, `clôturée`).
- Créer `mission_applications` (candidatures) et `mission_team` (le mentor responsable et
  les participants). Une mission crée elle aussi un projet normal.
- Créer un espace organisation : déposer un besoin, suivre l'avancement, valider le
  travail livré.
- **Un mentor responsable doit être désigné dès la création de la mission. Ce n'est pas
  optionnel.**

**Ce chantier n'est pas d'abord technique.** Les cinq à dix premières missions se vendent
et se pilotent à la main. On ne construit ces tables qu'une fois qu'on sait que des
entreprises paient.

---

### C6 — Le paiement, l'abonnement et la place de marché

- **Le paiement d'abord.** Mobile money (Wave, Orange Money, MTN MoMo), pour encaisser
  **et** pour payer les membres. En zone FCFA, la carte bancaire n'est pas le sujet. Tant
  que ce point n'est pas réglé, rien d'autre dans ce chantier n'a de sens.
- Bloquer l'argent jusqu'à validation du travail, et prévoir une procédure en cas de
  désaccord.
- Taka+ : réserver certaines fonctions aux abonnés (meilleurs modèles IA, quotas plus
  élevés, statistiques, portfolio complet). Reprendre
  [app/pricing/page.tsx](app/pricing/page.tsx), aujourd'hui vide.
  **On ajoute des fonctions payantes, on n'en retire jamais du gratuit.**
- Place de marché : commencer par les heures de conseil (petits montants, peu de risque)
  avant les prestations (gros montants, litiges possibles).
- Créer `transactions` et `payouts`, pour garder la trace de tout ce qui entre et sort.

**L'ordre est imposé par le business model :** Taka+ avant la place de marché, et la
place de marché seulement quand il y a assez de monde (au moins 200 projets terminés et
30 mentors).

---

### C7 — Les textes du site et les instructions du coach IA

**But :** que ce qu'on affiche corresponde à ce qu'on fait.

- **Le titre de la page d'accueil.** Remplacer `BUILD YOUR PROJECT. / DEPLOY & MONETIZE.`
  ([lib/i18n.ts:2445](lib/i18n.ts:2445)).
  ⚠️ Ce titre utilise les polices VALORAX et VENITE, **qui n'ont pas les caractères
  accentués** (voir [INVENTAIRE_POLICES_DISPLAY.md](INVENTAIRE_POLICES_DISPLAY.md)). Une
  formulation française doit donc être sans accents, ou il faut changer de police.
- **La liste des types de projets** ([lib/i18n.ts:2867](lib/i18n.ts:2867)) : ajouter
  formation en ligne, chaîne vidéo, podcast, newsletter, produit à télécharger, activité
  freelance.
- **« Premier euro »** ([lib/i18n.ts:1253](lib/i18n.ts:1253), `membersEuro`,
  `membersWithEuro`) : [lib/currency.ts](lib/currency.ts) parle déjà de « premier
  revenu ». Il reste des libellés à aligner.
- **Les instructions du coach IA**
  ([app/api/assistant/chat/route.ts:88](app/api/assistant/chat/route.ts:88)) : lui donner
  le type de projet et adapter sa façon d'aider. Un parcours « chaîne YouTube » (choisir
  sa niche, son image, sa méthode de production, publier, gagner des abonnés, monétiser)
  n'a rien à voir avec un parcours SaaS. C'est ce que le membre verra le plus, et c'est le
  moins cher à faire.
- **Le vocabulaire.** Les pages publiques (accueil, tarifs, parcours vus sans compte,
  textes pour Google) parlent à une **personne** qui n'a pas de compte : elles ne doivent
  ni l'appeler « membre », ni supposer qu'elle a déjà un projet. L'espace connecté parle à
  un **membre**, et la page projet à un **Builder**. Bonne nouvelle : les textes actuels
  sont déjà corrects sur ce point (`noAccountPrompt: "Pas encore membre ?"`,
  [lib/i18n.ts:1145](lib/i18n.ts:1145)). C'est surtout la nouvelle copy qu'il faut écrire
  du bon point de vue.
- Relancer `node scripts/fix-french-content.mjs --apply` après toute modification de
  contenu en base (voir le README).

**C7 peut être livré tout de suite, sans attendre le reste.** C'est ce qui se voit le
plus pour le moins de travail.

---

## 4. Dans quel ordre

| Étape | Ce qu'on fait | Quand on peut passer à la suite |
|---|---|---|
| **J1** | C7 : textes du site et coach IA qui connaît le type de projet | ce qu'on annonce correspond à ce qu'on fait |
| **J2** | C1 : un projet peut être autre chose que du code | une chaîne YouTube est aussi bien traitée qu'un SaaS |
| **J3** | C2 : le portfolio devient une preuve | un profil public suffit pour candidater quelque part |
| **J4** | C3 : la progression et le mentorat | 30 mentors, des mentorats en cours |
| **J5** | C4 : les challenges | on a des travaux comparables entre membres |
| **J6** | 5 à 10 missions vendues à la main, sans rien développer | des entreprises ont payé pour de vrai |
| **J7** | C5 : les missions dans l'application | une mission se gère sans intervention manuelle |
| **J8** | C6 : paiement, Taka+, place de marché | on sait encaisser **et** payer les membres |

J1 à J3 ne demandent aucune validation commerciale : c'est du produit, on peut y aller.
**J6 n'est pas une étape technique, c'est une étape commerciale** — et c'est elle qui
autorise J7 et J8.

## 5. Ce qu'on ne fait pas maintenant

- Refaire le design ou l'architecture : rien dans la vision ne l'exige.
- Ouvrir la place de marché avant d'avoir du monde des deux côtés.
- Construire l'espace organisation avant d'avoir vendu des missions à la main.
- Faire payer quoi que ce soit qui est gratuit aujourd'hui.
- Renommer les tables existantes. `user_projects` reste `user_projects`. Un challenge et
  une mission créent des projets ordinaires. Moins de concepts, plus de réutilisation.
