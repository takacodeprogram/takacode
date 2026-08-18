# Roadmap de repositionnement — de « projet digital » à « projet → expérience → opportunité »

> Traduction du cadrage [VISION.md](VISION.md) / [BUSINESS_MODEL.md](BUSINESS_MODEL.md)
> en changements applicatifs concrets. Plan d'implémentation — pas du code.
>
> L'exécution (versions, livraisons, `lib/productReleases.ts`) reste pilotée par
> [ROADMAP_EVOLUTION.md](ROADMAP_EVOLUTION.md).
>
> Rédigé le 18 août 2026.

---

## 0. Le principe : réorienter la finalité, pas reconstruire

**Rien de ce qui existe n'est à jeter.** Tracks, Projects, Community, Leaderboard,
sessions live, mentors, projets publiés, le concept « learn by building » : tout est
déjà compatible avec la nouvelle promesse. Ce qui change, c'est **la finalité du
système** et **la définition du mot « projet »**.

```
Aujourd'hui : Parcours → Projet → Publication → Monétisation
Demain      : Parcours → Projet → Expérience → Portfolio → Opportunité
              (et la voie « → Publication → Monétisation » reste entière)
```

## 1. Ce qui est déjà en place et sert directement

| Existant | Rôle dans la nouvelle vision |
|---|---|
| `learning_tracks` / `track_modules` / `track_lessons` | Les parcours, quel que soit le type de projet |
| `user_projects` (+ `project_reviews`, `project_likes`, `project_comments`) | Le projet BUILD ; base du portfolio |
| `user_profiles` (rôles, points, parrainage) | Base de la progression Builder → Expert |
| RPC de projets publiés + profil public | Base du portfolio vérifiable |
| `live_sessions` | Base des sessions mentor, puis des sessions payantes |
| `affiliate_links` | Source de revenus déjà active, à conserver telle quelle |
| Coach IA agentique (`app/api/assistant/chat/route.ts`) | Le générateur de parcours par type de projet |
| `lib/currency.ts` (« premier euro » → « premier revenu ») | Déjà généralisé, à réutiliser |

## 2. Les frictions actuelles avec la nouvelle vision

Constats vérifiés dans le code, par ordre de blocage :

1. **Le projet est implicitement logiciel.**
   `user_projects` porte `repo_url` et `live_url` comme seuls livrables
   ([supabase/sql/008_user_projects.sql](supabase/sql/008_user_projects.sql)).
   Une formation en ligne, une chaîne YouTube ou un podcast n'ont ni repo ni URL de
   démo — ils ont une chaîne, une playlist, une page de vente, un flux RSS, un PDF.

2. **La copy annonce l'ancienne promesse.**
   `BUILD YOUR PROJECT. / DEPLOY & MONETIZE.` ([lib/i18n.ts:2445](lib/i18n.ts:2445)),
   « chaque parcours est lié à un archétype de projet (site vitrine, SaaS, e-commerce,
   blog, app mobile, API) » ([lib/i18n.ts:2867](lib/i18n.ts:2867)) — la liste est
   exclusivement logicielle.

3. **Le rôle mentor est un attribut, pas un statut mérité.**
   `role text check (role in ('user','mentor','admin'))`
   ([supabase/sql/001_roles_points_referrals.sql:9](supabase/sql/001_roles_points_referrals.sql:9)).
   Aucune progression, aucun critère, aucune trace de ce que le mentor a lui-même terminé.

4. **Il n'existe qu'une seule entrée : mon idée.** Pas de CHALLENGES, pas de MISSIONS,
   pas d'organisations. Le deuxième côté du marché n'existe pas dans le schéma.

5. **`revenue_model` est un enum fermé** (`vente | abonnement | publicite | affiliation |
   freelance`, [supabase/migrations/20260718110000_project_revenue_model.sql](supabase/migrations/20260718110000_project_revenue_model.sql)) —
   il manque au minimum la vente de formation, le sponsoring et les dons/adhésions.

6. **Le prompt système du coach parle « projet et apprentissage » sans typer le projet**
   ([app/api/assistant/chat/route.ts:88](app/api/assistant/chat/route.ts:88)). Il ne sait
   pas qu'accompagner une chaîne YouTube n'a rien à voir avec accompagner un SaaS.

7. **`/pricing` est une page vide** ([app/pricing/page.tsx](app/pricing/page.tsx)) — ce
   qui est cohérent tant qu'il n'y a rien à vendre, et à reprendre à l'activation de Taka+.

## 3. Les chantiers

Ordonnés par dépendance. Chaque chantier est livrable seul.

---

### C1 — Généraliser le projet · *prérequis de tout le reste*

**But :** qu'un projet non-logiciel soit un citoyen de première classe.

**Schéma**
- `user_projects.project_type` : `logiciel | boutique | formation | contenu_video |
  podcast | newsletter | freelance | produit_digital | autre`. Valeur par défaut
  déduite du parcours, modifiable.
- Remplacer `repo_url` / `live_url` par une table `project_deliverables`
  (`project_id`, `kind`, `label`, `url`, `sort_order`) où `kind` dépend du type :
  repo, démo, chaîne, playlist, page de vente, épisode, flux RSS, fichier, capture.
  *Garder `repo_url` / `live_url` en lecture pendant la migration, les alimenter comme
  deux livrables de type `repo` et `demo` pour ne rien casser côté RPC publiques.*
- Élargir le check de `revenue_model` (ajouter `formation`, `sponsoring`, `dons`,
  `services`), ou le remplacer par une table de référence.
- `learning_tracks` : ajouter `project_type` pour que la recommandation de parcours
  parte du type de projet visé.

**Code**
- `lib/userProjects` / `lib/getPublicProject.ts` / `lib/publicProfile.ts` : lecture des livrables.
- RPC publiques de projets (`supabase/migrations/2026071822*`, `2026071900*`) : elles
  sérialisent explicitement `repo_url` / `revenue_model` — à faire évoluer ensemble.
- Dashboard projet + formulaire de création : champs dynamiques selon `project_type`.

**Risque :** les RPC `security definer` listent les colonnes une à une ; toute
généralisation les impacte. À traiter en une seule migration cohérente, avec les tests
`lib/*.test.ts` correspondants.

---

### C2 — Le portfolio comme produit

**But :** que le profil public cesse d'être une carte de visite et devienne **la preuve**.

- Profil public = liste de projets terminés, avec livrables, rôle tenu, durée,
  compétences mobilisées, et validations (IA / pairs / mentor).
- Distinguer visuellement **projet terminé** de **projet publié** : la vision fait de la
  complétion la métrique n°1, elle doit être visible.
- Export / partage : lien public propre, aperçu social, version imprimable.
- Ajouter la notion de **rôle tenu sur un projet** (indispensable dès les projets à
  plusieurs en C4/C5) : `project_members (project_id, user_id, role, is_lead)`.

---

### C3 — La progression Builder → Contributor → Mentor → Expert

**But :** faire du mentor un statut mérité, condition du modèle de mentorat bénévole.

- Séparer **rôle système** (`user | admin`, permissions) et **niveau communautaire**
  (`builder | contributor | mentor | expert`). Ne pas surcharger `user_profiles.role`,
  dont le check est utilisé par les policies RLS.
- Critères explicites et automatiques : nombre de projets terminés, reviews utiles
  rendues, réponses acceptées en communauté, parcours complétés.
- Candidature au mentorat **sur un parcours qu'on a soi-même terminé** — c'est la règle
  qui rend le mentorat crédible sans salarier personne.
- Table `mentorships (mentor_id, builder_id, project_id, track_id, status, started_at)`.

**Pourquoi maintenant et pas plus tard :** le vivier de mentors est le goulot
d'étranglement de MISSIONS (C5). Il se construit en amont, pas au moment où on en a besoin.

---

### C4 — CHALLENGES

**But :** donner un projet à ceux qui n'ont pas d'idée, et créer de la collaboration.

- Table `challenges` (titre, brief, `project_type`, difficulté, livrables attendus,
  dates, parcours associé) + `challenge_participations` (solo ou équipe, via `project_members`).
- Un challenge produit **un `user_projects` normal** : le portfolio, les reviews et le
  leaderboard fonctionnent sans modification.
- Réutiliser `project_reviews` pour l'évaluation, et `live_sessions` pour les points d'étape.

**Valeur secondaire, sous-estimée :** les challenges produisent des livrables
**comparables entre membres** — c'est ce qui rend la sélection sur MISSIONS possible
et défendable.

---

### C5 — MISSIONS et organisations

**But :** ouvrir le deuxième côté du marché.

- Table `organizations` (nom, secteur, contact, pays) + `organization_members`.
- Table `missions` (organisation, besoin brut, brief structuré, `project_type`, budget,
  échéance, statut : `soumise | cadrée | ouverte | en_cours | livrée | clôturée`).
- `mission_applications` (candidatures), `mission_team` (mentor responsable + participants),
  et une mission produit là aussi **un projet** rattaché.
- Espace organisation : soumettre un besoin, suivre l'avancement, valider le livrable.
- **Un mentor responsable nommé, obligatoire, dès la création de la mission.**

**Ce chantier n'est pas d'abord technique.** Les 5 à 10 premières missions se vendent et
se pilotent à la main, hors produit. On ne construit `missions` qu'après avoir vérifié
que des organisations paient — c'est l'hypothèse la plus coûteuse de la vision.

---

### C6 — Paiement, marketplace et Taka+

**But :** encaisser, et surtout **reverser**.

- **Rail de paiement d'abord** : mobile money (Wave, Orange Money, MTN MoMo) en
  encaissement *et* en reversement. En zone FCFA, la carte bancaire n'est pas le sujet.
  Rien d'autre dans ce chantier n'a de sens tant que ce point n'est pas résolu.
- Séquestre : fonds retenus jusqu'à validation du livrable, + procédure de litige.
- Taka+ : gating des fonctionnalités premium (modèles IA supérieurs, quotas, analytics,
  portfolio avancé). Reprendre `app/pricing/page.tsx`, aujourd'hui une page vitrine vide.
  **Ajouter des capacités, ne jamais retirer du gratuit existant.**
- Marketplace : commencer par les **sessions d'expertise** (ticket faible, risque faible)
  avant les prestations (ticket élevé, risque de litige).
- Commissions et reversements : table `transactions` + `payouts`, traçabilité complète.

**Ordre imposé par le business model :** Taka+ avant marketplace, marketplace après
liquidité (≥ 200 projets terminés, ≥ 30 mentors).

---

### C7 — Copy, i18n et prompt de l'agent

**But :** que le discours corresponde à la promesse, partout.

- **Hero** : remplacer `BUILD YOUR PROJECT. / DEPLOY & MONETIZE.`
  ([lib/i18n.ts:2445](lib/i18n.ts:2445)) par la nouvelle formulation.
  ⚠️ Le hero utilise les polices display **VALORAX / VENITE, sans glyphes accentués**
  (voir [INVENTAIRE_POLICES_DISPLAY.md](INVENTAIRE_POLICES_DISPLAY.md)) : toute
  formulation française du titre doit être sans accents, ou changer de police.
- **Archétypes de projet** ([lib/i18n.ts:2867](lib/i18n.ts:2867)) : la liste « site
  vitrine, SaaS, e-commerce, blog, app mobile, API » doit inclure formation en ligne,
  chaîne vidéo, podcast, newsletter, produit téléchargeable, activité freelance.
- **« Premier euro »** ([lib/i18n.ts:1253](lib/i18n.ts:1253), `membersEuro`,
  `membersWithEuro`) : `lib/currency.ts` a déjà généralisé le concept en « premier
  revenu » — aligner les libellés restants.
- **Prompt système du coach** ([app/api/assistant/chat/route.ts:88](app/api/assistant/chat/route.ts:88)) :
  injecter le `project_type` et adapter l'accompagnement. Un parcours « chaîne YouTube »
  (niche → branding → workflow vidéo → publication → acquisition → monétisation) n'a
  rien à voir avec un parcours SaaS. C'est le changement le plus visible pour
  l'utilisateur, et le moins cher à livrer.
- Faire tourner `node scripts/fix-french-content.mjs --apply` après toute modification
  de contenu en base (voir README).

**C7 est livrable immédiatement, indépendamment de tout le reste.** C'est le meilleur
rapport signal/effort du repositionnement.

---

## 4. Ordre d'exécution proposé

| Jalon | Contenu | Condition de sortie |
|---|---|---|
| **J1** | C7 (copy + prompt agent typé) | La promesse affichée = la promesse réelle |
| **J2** | C1 (projet généralisé) | Un projet « chaîne YouTube » est aussi bien traité qu'un SaaS |
| **J3** | C2 (portfolio comme preuve) | Un profil public suffit à candidater quelque part |
| **J4** | C3 (progression + mentorat) | ≥ 30 membres de niveau Mentor, mentorats actifs |
| **J5** | C4 (challenges) | Des livrables comparables entre membres |
| **J6** | 5–10 missions vendues **à la main**, hors produit | Des organisations ont payé |
| **J7** | C5 (missions dans le produit) | Une mission se pilote sans intervention manuelle |
| **J8** | C6 (paiement, Taka+, marketplace) | Encaissement **et** reversement fonctionnels |

Les jalons J1→J3 sont du produit pur et peuvent être menés sans validation marché.
**J6 est un jalon commercial, pas technique** — et c'est lui qui autorise J7 et J8.

## 5. Ce qu'on ne fait pas maintenant

- Refondre le design ou l'architecture : rien dans la vision ne l'exige.
- Ouvrir la marketplace avant la liquidité.
- Construire l'espace organisation avant d'avoir vendu des missions à la main.
- Faire payer quoi que ce soit qui est gratuit aujourd'hui.
- Renommer les entités existantes : `user_projects` reste `user_projects`, un challenge
  et une mission produisent des projets ordinaires. Moins de concepts, plus de réemploi.
