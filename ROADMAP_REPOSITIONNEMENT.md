# Ce que le repositionnement change dans l'application

> Ce document traduit la vision de TakaCode en évolution concrète du produit :
> base de données, interfaces, contenus, moteur de ressources, Coach IA, projets,
> portfolio, communauté, Missions et économie.
>
> Ce n'est pas une spécification technique exhaustive ni du code.
>
> Les principes fonctionnels sont définis dans :
>
> - [VISION.md](./VISION.md) — pourquoi TakaCode existe et où il va ;
> - [SYSTEME_PROJET.md](./SYSTEME_PROJET.md) — comment fonctionne un projet ;
> - [FONCTIONNALITES.md](./FONCTIONNALITES.md) — ce que la plateforme doit permettre ;
> - [BUSINESS_MODEL.md](./BUSINESS_MODEL.md) — comment le modèle économique fonctionne.
>
> Ce document répond à une seule question :
>
> **dans quel ordre devons-nous faire évoluer l'application pour transformer la vision
> en produit réel sans reconstruire inutilement ce qui existe déjà ?**

---

# 01 — Le principe : changer la finalité, pas tout refaire

Le repositionnement de TakaCode ne signifie pas reconstruire toute l'application.

Une grande partie de l'existant reste utile :

- parcours ;
- projets ;
- profils ;
- communauté ;
- reviews ;
- sessions ;
- Mentors ;
- Coach IA ;
- projets publiés ;
- système d'affiliation.

Ce qui change profondément est **la finalité du système**.

Avant, la logique était principalement :

```text
Parcours
→ Projet numérique
→ Publication
→ Monétisation
```

La nouvelle logique devient :

```text
Orientation
→ Projet
→ Ressources utiles au moment du besoin
→ Réalisation
→ Preuve d'expérience
→ Opportunité
```

La monétisation d'un projet reste possible :

```text
Projet
→ Publication
→ Utilisateurs
→ Revenus
```

Mais ce n'est plus la seule finalité.

Un projet peut également conduire à :

```text
Projet
→ Portfolio
→ Client
```

ou :

```text
Projet
→ Expérience
→ Mission
```

ou :

```text
Projet
→ Compétence démontrée
→ Emploi
```

ou :

```text
Projet
→ Produit
→ Activité entrepreneuriale
```

Le produit doit donc être pensé autour d'une idée beaucoup plus large :

> **aider une personne à trouver une direction, apprendre ce dont elle a besoin,
> réaliser quelque chose de concret et transformer progressivement cette réalisation
> en opportunité.**

---

# 02 — Ce que nous conservons

Le repositionnement doit réutiliser au maximum l'existant.

| Existant | Nouvelle fonction |
| --- | --- |
| `learning_tracks`, modules, lessons | base du plan guidé d'un projet |
| `user_projects` | cœur du système BUILD, Challenges et Missions |
| `project_reviews` | validation et feedback |
| projets publiés | base du portfolio |
| profils publics | preuve d'expérience |
| communauté | entraide et contribution |
| `live_sessions` | déblocage, mentorat, sessions collectives |
| Mentors | accompagnement humain |
| Coach IA | orientation, structuration, compréhension, déblocage et feedback |
| affiliation | recommandation contextualisée d'outils |
| système de revenus | base de la valorisation économique |

Le principe technique est :

> **réutiliser avant de remplacer.**

---

# 03 — Les principales limites actuelles

## 3.1 — Le projet est encore trop associé au développement logiciel

Le modèle actuel repose notamment sur :

- `repo_url` ;
- `live_url`.

Cela fonctionne pour une application.

Beaucoup moins pour :

- une activité freelance ;
- une chaîne YouTube ;
- un podcast ;
- une newsletter ;
- une formation créée par un Builder ;
- un produit digital ;
- un projet data ;
- une automatisation ;
- une activité entrepreneuriale.

Le système doit donc passer de :

> **projet informatique**

à :

> **projet produisant des livrables.**

---

## 3.2 — Le produit suppose encore trop souvent que l'utilisateur sait déjà quoi faire

Or certains membres arriveront sans :

- idée ;
- compétence clairement identifiée ;
- projet ;
- connaissance des métiers numériques ;
- orientation professionnelle précise.

Le système doit donc pouvoir commencer **avant le projet**.

---

## 3.3 — Les parcours ressemblent encore trop à des formations

Le repositionnement impose une distinction fondamentale.

TakaCode n'a pas vocation à produire une formation complète pour chaque sujet.

La logique cible est :

```text
Projet
→ Étape
→ Besoin
→ Ressource
→ Action
→ Livrable
```

Les ressources peuvent provenir de :

- documentations officielles ;
- YouTube ;
- articles ;
- tutoriels ;
- cours ouverts ;
- GitHub ;
- communautés ;
- outils ;
- autres ressources pertinentes.

---

## 3.4 — Les ressources ne constituent pas encore un véritable moteur

Il faut pouvoir savoir :

- quelle ressource correspond à quelle étape ;
- pour quel niveau ;
- dans quelle langue ;
- pour quel objectif ;
- quelle partie consulter ;
- si elle est toujours valide ;
- quelle alternative existe.

Sans cela, TakaCode risque de devenir soit une plateforme de cours, soit un simple catalogue de liens.

---

## 3.5 — Le Coach IA manque de contexte

Le Coach doit comprendre :

```text
Qui est cette personne ?
Que veut-elle obtenir ?
Quel est son niveau ?
Quel projet réalise-t-elle ?
À quelle étape est-elle ?
Qu'a-t-elle déjà essayé ?
Quelle ressource utilise-t-elle ?
Où est-elle bloquée ?
```

Sans ce contexte, il reste un chatbot généraliste.

---

## 3.6 — Le portfolio ne démontre pas encore suffisamment l'expérience

Un projet terminé doit pouvoir produire automatiquement :

- livrables ;
- preuves ;
- compétences mobilisées ;
- rôle tenu ;
- validations ;
- journal de bord ;
- étude de cas.

Le profil doit progressivement devenir une **preuve d'expérience**.

---

## 3.7 — Les rôles communautaires ne reflètent pas suffisamment l'expérience

Être Mentor ne doit pas simplement être une valeur dans une colonne.

Les rôles doivent progressivement être fondés sur :

- réalisations ;
- contributions ;
- expérience ;
- validations ;
- activité réelle.

Les droits techniques doivent rester séparés des rôles communautaires.

---

## 3.8 — BUILD est encore la seule véritable porte d'entrée

La cible est :

```text
BUILD       → J'ai une idée.
CHALLENGES  → Je veux construire mais je ne sais pas quoi.
MISSIONS    → Je veux contribuer à un besoin réel.
```

Ces trois portes doivent utiliser **le même moteur de projet**.

---

# 04 — Principe de la roadmap

Nous ne construisons pas toutes les fonctionnalités de la vision immédiatement.

Chaque jalon doit résoudre **un risque précis**.

La règle est :

> **ne pas construire le jalon suivant tant que l'hypothèse principale du précédent
> n'est pas suffisamment validée.**

---

# J1 — Clarifier le positionnement

## Objectif

Faire comprendre immédiatement que TakaCode aide à **passer à l'action** et ne concerne
pas uniquement les développeurs ayant déjà une idée.

Le Visiteur doit comprendre qu'il peut venir :

- avec une idée ;
- sans idée ;
- avec une compétence ;
- sans compétence directement valorisable ;
- pour construire ;
- pour apprendre en construisant ;
- pour se réorienter ;
- pour entreprendre ;
- pour chercher progressivement des opportunités.

## À modifier

### Navigation

La navigation doit refléter le parcours, pas l'ancien catalogue.

```text
Accueil · Explorer · Challenges · Projets · Communauté · Opportunités
```

Puis, à droite :

```text
Connexion · Commencer
```

Chaque entrée porte un rôle précis :

| Entrée | Rôle | Page actuelle |
| --- | --- | --- |
| **Accueil** | comprendre la promesse | `/` |
| **Explorer** | découvrir les voies, métiers et types de projets | `/skills` |
| **Challenges** | trouver un projet prêt à réaliser | `/tracks` |
| **Projets** | voir et créer des réalisations | `/projects` |
| **Communauté** | entraide, sessions, contribution | `/community` |
| **Opportunités** | portfolio, Missions, Mentors, programmes | `/opportunities` |

Le classement reste accessible, mais depuis le pied de page : c'est un signal
d'activité, pas une porte d'entrée du parcours.

`Opportunités` est délibérément publiée avant que les Missions ne soient
automatisées (J9 / J10). La page indique clairement ce qui est disponible et ce
qui est en préparation. Elle sert d'abord à rendre visible la fin de la chaîne :

```text
Projet → Réalisation → Preuve d'expérience → Opportunité
```

### Page d'accueil

Remplacer les formulations trop centrées sur :

> BUILD / DEPLOY / MONETIZE

par la nouvelle promesse.

Le hero devient :

```text
TAKACODE · DE L'ORIENTATION A L'ACTION

APPRENDRE
CONSTRUIRE
PROGRESSER

Trouve une direction, apprends en construisant et transforme tes projets en
expériences que tu peux montrer et valoriser.

[ Explorer ]   [ Créer ]

Ressources ouvertes · Coach IA · Communauté · Mentors
```

Les trois mots sont **empilés, sans puce**. Ce n'est pas un choix esthétique :
en VALORAX, `APPRENDRE • CONSTRUIRE` mesure 992 px alors que la demi-colonne du
hero en fait 588 px. Sur une seule ligne, le navigateur coupe où il peut et la
hauteur du hero double. Empilés à `clamp(38px, 4.4vw, 62px)`, les trois mots
mesurent 447, 455 et 497 px : ils tiennent, et le bloc reste compact.

La description tient en **un seul paragraphe**. Deux paragraphes séparés
cassaient le rythme entre le titre et les boutons.

Trois points sont volontaires :

1. **`Explorer` avant `Créer`.** Une personne sans idée ne doit pas se sentir
   exclue dès le premier écran.
2. **La micro-copy nomme les quatre moyens** : ressources ouvertes, Coach IA,
   communauté, mentors. Elle dit ce que TakaCode met à disposition, sans
   promettre un résultat garanti.
3. **Le titre reste sans accent.** C'est une convention typographique de la marque,
   appliquée à tout texte rendu en police display (VALORAX, VENITE, `.section-label`,
   `.font-venite`, `.font-venite-italic`). Les paragraphes en `font-body-readable`
   gardent leurs accents. Voir [INVENTAIRE_POLICES_DISPLAY.md](./INVENTAIRE_POLICES_DISPLAY.md).

   *Précision technique, vérifiée dans les fichiers de police :*

   - **VALORAX** mappe bien `É`, `À`, `Ç` dans sa table `cmap`, mais leurs
     charstrings CFF font **3 octets** — un glyphe vide. Là où `E` en occupe 70,
     `É` n'en occupe 3 : il ne dessine rien. Un titre accentué en VALORAX affiche
     donc un **trou blanc** à la place de la lettre. Ce n'est pas une préférence,
     c'est un défaut de rendu.
   - **VENITE** dessine réellement ses accents (`É` = 132 octets de contours). Les
     sur-titres `.section-label` et `.font-venite` peuvent donc les porter.

   Comme `.font-valorax` applique `text-transform: uppercase`, écrire ces titres
   sans accent reste conforme à l'usage français, qui rend l'accent facultatif sur
   les capitales.

   Ne pas se fier à la seule présence dans la `cmap` : c'est ce raccourci qui avait
   laissé passer « TAKACODE CHANGE ÇA » avec un blanc à la place du `Ç`.

### La section « L'approche »

Elle suit le hero et donne le cadre en six moments :

```text
L'APPROCHE

UN CADRE POUR
PASSER A L'ACTION.

Pas besoin d'attendre de tout maîtriser avant de commencer.
Sur TakaCode, le projet guide l'apprentissage : tu avances, apprends ce qui
devient nécessaire et l'appliques immédiatement.
```

| # | Sur-titre | Titre | Icône | Accent |
| --- | --- | --- | --- | --- |
| 1 | S'ORIENTER | Trouver une direction | `lucide:compass` | `#4F8EF7` |
| 2 | STRUCTURER | Transformer l'idee en plan | `lucide:route` | `#22D3EE` |
| 3 | APPRENDRE | Apprendre au bon moment | `lucide:book-open` | `#10B981` |
| 4 | CONSTRUIRE | Produire du concret | `lucide:hammer` | `#F59E0B` |
| 5 | SE DEBLOQUER | Trouver de l'aide | `lucide:life-buoy` | `#9B6DFF` |
| 6 | PROUVER | Montrer ce que tu sais faire | `lucide:badge-check` | `#EC4899` |

Les icônes illustrent **l'action du moment, pas un outil** : une boussole pour
choisir une direction, un itinéraire pour planifier, une bouée pour se débloquer,
un badge vérifié pour prouver. L'ancien pas final `monetize` (`lucide:trending-up`,
rouge) disparaît : la valorisation ne se réduit pas au revenu.

L'ordre des six moments reprend la chaîne de la vision :

```text
Orientation → Structuration → Apprentissage → Réalisation → Déblocage → Preuve
```

### La section « Ton point de départ »

Elle suit « L'approche » et doit apporter une information **différente** : non plus
comment TakaCode fonctionne, mais **comment y entrer selon sa situation**.

```text
TON POINT DE DEPART

TU PEUX COMMENCER
D'OU TU ES.

Tu n'as pas besoin d'avoir déjà un projet, une compétence précise ou un plan clair.
TakaCode s'adapte à ce que tu cherches aujourd'hui.
```

| Porte | Situation du visiteur | Icône | Destination |
| --- | --- | --- | --- |
| **EXPLORER** | « Je ne sais pas encore quoi faire. » | `lucide:telescope` | `/skills` |
| **BUILD** | « J'ai une idée à réaliser. » | `lucide:hammer` | `/projects` |
| **CHALLENGES** | « Je veux pratiquer sur un projet concret. » | `lucide:flame` | `/tracks` |
| **MISSIONS** | « Je veux travailler sur un vrai besoin. » | `lucide:briefcase` | `/opportunities` |

`EXPLORER` est la porte ajoutée par le repositionnement : les trois portes
historiques supposaient toutes que le visiteur savait déjà quoi construire.

Les cartes sont rangées **par distance à l'action** : de celui qui cherche encore une
direction à celui qui veut un besoin réel. La longue-vue distingue volontairement
`EXPLORER` de la boussole de « L'approche » : ici on regarde le paysage, là-bas on
choisit un cap.

### La carte du hero

L'illustration de droite doit raconter la même chaîne que le reste de la page :

```text
TON PARCOURS — De la direction à la preuve

DIRECTION      Trouvée
CONSTRUCTION   En cours
PREUVE         À venir
```

Elle remplace l'ancienne progression `IDEE → CONSTRUCTION → REALISE`, qui
s'arrêtait au projet terminé. Les chiffres inventés de la carte « session live »
(« Dans 2h - 34 inscrits ») sont retirés : une landing ne doit pas afficher de
statistiques fabriquées.

### Pied de page

Le copyright et la signature doivent porter la même promesse que le hero :

```text
© 2026 TakaCode — Apprendre, construire, progresser. Tous droits réservés.
Ressources ouvertes, Coach IA, communauté et mentors au service de tes réalisations.
```

Version anglaise :

```text
© 2026 TakaCode — Learn, build, grow. All rights reserved.
Open resources, an AI Coach, a community and mentors — all serving what you build.
```

### Langues

Chaque texte de positionnement existe en français et en anglais dans
`lib/i18n.ts`. Aucune chaîne de la navigation, du hero ou du pied de page ne
doit être écrite en dur dans un composant.

### Types de projets

Ajouter notamment :

- logiciel ;
- SaaS ;
- agent IA ;
- automatisation ;
- data ;
- boutique ;
- activité freelance ;
- produit digital ;
- formation créée par un Builder ;
- chaîne vidéo ;
- podcast ;
- newsletter ;
- autres projets numériques.

### Vocabulaire

Respecter :

- Visiteur ;
- Membre ;
- Builder ;
- Contributor ;
- Mentor ;
- Expert ;
- Organisation ;
- Partenaire.

## Critère de sortie

Une personne découvrant TakaCode comprend rapidement :

> **« Je peux commencer même si je ne sais pas encore exactement quoi construire. »**

---

# J2 — Construire l'orientation

## Pourquoi maintenant

Si TakaCode prétend accompagner des personnes avec ou sans idée, le produit doit réellement
savoir quoi faire lorsqu'une personne répond :

> « Je ne sais pas. »

## Construire

### Diagnostic d'entrée

Collecter progressivement :

- objectif ;
- expérience ;
- compétences ;
- intérêts ;
- disponibilité ;
- équipement ;
- contraintes ;
- motivation principale.

### Nouvelle logique d'onboarding

```text
Pourquoi es-tu ici ?
        ↓
Sais-tu déjà ce que tu veux réaliser ?
       ↙ ↘
     Oui   Non
      ↓     ↓
    BUILD  Orientation
             ↓
      métier / domaine / Challenge
```

### Coach IA

Ajouter un mode :

> **Orientation**

distinct du mode :

> **Projet**

## Attention

Ne pas construire un test d'orientation de 50 questions.

L'objectif est d'obtenir :

> **une prochaine action raisonnable.**

## Critère de sortie

Une personne sans projet peut terminer l'onboarding avec une direction exploitable.

---

# J3 — Généraliser le moteur de projet

## Objectif

Faire fonctionner le même système pour différents types de réalisations.

## Base de données

Ajouter ou généraliser :

```text
project_types
project_frameworks
framework_phases
project_plan_steps
project_tasks
project_deliverables
project_proofs
project_journal
project_members
validation_rubrics
```

### `user_projects`

Ajouter notamment :

- `project_type` ;
- `objective` ;
- `target_audience` ;
- `success_criteria` ;
- `deadline`.

### Livrables

Ne plus considérer `repo_url` et `live_url` comme le modèle universel.

Créer un système générique :

```text
project_deliverables
```

Un livrable peut être :

- dépôt ;
- application ;
- document ;
- vidéo ;
- chaîne ;
- playlist ;
- dashboard ;
- dataset ;
- automatisation ;
- page de vente ;
- portfolio ;
- proposition commerciale ;
- produit ;
- autre.

Pendant la migration, conserver les anciens champs pour compatibilité.

## Critère de sortie

> **Une chaîne YouTube, une activité freelance ou un projet Data peuvent être accompagnés
> avec la même rigueur qu'un SaaS.**

---

# J4 — Construire le moteur de ressources

## Pourquoi c'est un jalon à part entière

C'est ce qui permet à TakaCode de ne pas devenir une plateforme traditionnelle de cours.

Créer notamment :

```text
resource_library
step_resources
resource_reports
```

Une ressource doit pouvoir contenir :

- URL ;
- titre ;
- source ;
- format ;
- langue ;
- niveau ;
- durée ;
- gratuit / payant ;
- date de vérification ;
- statut ;
- objectif pédagogique ou pratique.

La relation avec une étape doit préciser :

- pourquoi cette ressource ;
- ce qu'il faut comprendre ;
- quelle partie consulter ;
- ce qu'il faut faire ensuite.

## Interface

Une étape pourrait afficher :

```text
CE QUE TU DOIS PRODUIRE

Landing page fonctionnelle

POUR Y ARRIVER

1. Comprendre la structure d'une landing page
   → ressource recommandée

2. Construire la première version
   → template facultatif

3. Vérifier les critères
   → checklist

LIVRABLE

URL + capture
```

## Maintenance

Prévoir :

- signalement d'un lien mort ;
- ressource obsolète ;
- alternative ;
- date de dernière vérification ;
- suggestion de remplacement.

## Critère de sortie

Un projet peut être accompagné de bout en bout principalement grâce à des ressources
externes correctement contextualisées.

---

# J5 — Transformer le Coach IA en véritable copilote

## Principe

L'IA est un accélérateur.

Elle ne doit pas remplacer la réalisation.

Le Coach doit recevoir :

```text
profil
+ objectif
+ niveau
+ projet
+ framework
+ étape
+ ressources
+ livrables
+ journal
+ historique des blocages
```

## Modes

Le Coach peut progressivement disposer de plusieurs contextes :

### ORIENT

Trouver une direction.

### PLAN

Transformer un objectif en projet.

### LEARN

Expliquer ce qui est nécessaire à l'étape.

### BUILD

Aider pendant la réalisation.

### UNBLOCK

Diagnostiquer un blocage.

### REVIEW

Analyser un livrable.

### REFLECT

Aider à documenter ce qui a été appris.

### SHOW

Transformer le projet en étude de cas ou présentation.

## Garde-fou

Éviter :

```text
Demande
→ IA produit tout
→ Builder copie
→ validation
```

Favoriser :

```text
Question
→ explication
→ tentative
→ feedback
→ correction
→ livrable
```

## Critère de sortie

Le Coach augmente la capacité du membre à avancer sans transformer TakaCode en générateur
automatique de projets.

---

# J6 — Transformer le profil en preuve d'expérience

## Objectif

Faire du projet terminé un actif professionnel.

Créer ou enrichir :

```text
project_proofs
project_members
deliverable_reviews
project_skills
```

Chaque projet terminé peut alimenter :

- portfolio ;
- rôle ;
- compétences ;
- livrables ;
- preuves ;
- validations ;
- durée ;
- journal ;
- étude de cas.

## Profil public

Prévoir :

- URL partageable ;
- aperçu réseaux sociaux ;
- projets ;
- contributions ;
- compétences démontrées ;
- Missions ;
- éventuellement export PDF.

## Distinctions importantes

```text
Projet commencé ≠ projet terminé
Projet terminé ≠ projet publié
Projet publié ≠ projet valorisé
```

## Critère de sortie

Un membre peut envoyer son profil TakaCode à :

- un client ;
- un recruteur ;
- une organisation ;
- un partenaire.

---

# J7 — Déployer contribution et mentorat

## Séparer deux systèmes

### Droits techniques

```text
user
admin
```

### Rôles communautaires

```text
membre
builder
contributor
mentor
expert
```

Ne pas utiliser le même champ pour les deux.

## Progression

Exemple :

```text
Membre
   ↓ premier projet
Builder
   ↓ contributions utiles
Contributor
   ↓ expérience + candidature
Mentor
   ↓ expertise avancée
Expert
```

Ce n'est pas nécessairement une progression strictement linéaire.

Un professionnel extérieur peut être validé directement.

## Construire

```text
mentorships
contributions
mentor_domains
mentor_availability
```

Réutiliser :

```text
live_sessions
project_reviews
```

## Critère de sortie

L'accompagnement humain contribue réellement à augmenter la complétion des projets.

---

# J8 — Lancer les Challenges

## Objectif

Résoudre :

> **« Je veux construire mais je ne sais pas quoi. »**

Créer :

```text
challenges
challenge_participations
challenge_cohorts
```

Un Challenge contient :

- problème ;
- contexte ;
- objectif ;
- niveau ;
- durée ;
- contraintes ;
- livrables ;
- critères ;
- ressources ;
- framework.

## Principe technique

Un Challenge ne crée pas un second moteur.

Lorsqu'un membre rejoint un Challenge :

```text
Challenge
   ↓
user_project
   ↓
même moteur projet
```

## Critère de sortie

Plusieurs personnes terminent un même Challenge avec des réalisations différentes.

---

# J9 — Vendre les premières Missions manuellement

## Rien ou presque à développer

Avant de créer une marketplace complexe :

> **vendre 5 à 10 Missions réelles.**

Les gérer initialement avec :

- outils existants ;
- tableur ;
- messagerie ;
- suivi manuel.

## Ce qu'il faut apprendre

- les organisations paient-elles réellement ?
- pour quels besoins ?
- quel budget ?
- combien coûte le cadrage ?
- quels profils fonctionnent ?
- quels problèmes apparaissent ?
- que considère le client comme un livrable acceptable ?
- quel accompagnement est nécessaire ?
- combien TakaCode peut raisonnablement prendre ?

## Critère de sortie

> **Des organisations ont payé pour des Missions et accepté des livrables.**

C'est une validation commerciale.

---

# J10 — Intégrer les Missions

Seulement après validation de J9.

Créer :

```text
organizations
organization_members
missions
mission_applications
mission_team
mission_milestones
```

Une Mission contient :

- besoin brut ;
- organisation ;
- périmètre ;
- livrables ;
- budget ;
- échéance ;
- compétences ;
- critères d'acceptation ;
- responsable.

## Coach IA

Peut aider à transformer :

```text
« Nous avons besoin d'améliorer notre gestion clients. »
```

en :

```text
problème
→ contexte
→ résultat attendu
→ périmètre
→ livrables
→ compétences
→ estimation
```

Une validation humaine reste obligatoire avant publication.

## Même moteur

```text
Mission
   ↓
Projet
   ↓
Équipe
   ↓
Plan
   ↓
Livrables
   ↓
Validation client
```

## Critère de sortie

Une Mission peut être pilotée de bout en bout dans TakaCode.

---

# J11 — Construire l'infrastructure économique

On automatise ce qui a déjà démontré son utilité.

## Priorité

```text
Encaisser
→ Sécuriser
→ Répartir
→ Reverser
```

Créer notamment :

```text
transactions
payouts
payment_disputes
```

Prévoir selon les marchés :

- Mobile Money ;
- cartes ;
- virements ;
- solutions internationales.

## Taka+

Le premium doit vendre :

> **accélération + personnalisation + puissance**

et non retirer au gratuit ce qu'il permet déjà.

Exemples :

- Coach IA avancé ;
- quotas supérieurs ;
- analyses ;
- mémoire projet avancée ;
- portfolio enrichi ;
- gestion multi-projets.

## Marketplace Expert

Commencer par :

> sessions individuelles.

Puis élargir uniquement si la demande existe.

## Critère de sortie

TakaCode sait correctement :

> **encaisser → sécuriser → répartir → reverser.**

---

# J12 — Partenaires et programmes d'impact

Ce jalon devient important pour travailler avec :

- entreprises ;
- fondations ;
- ONG ;
- programmes jeunesse ;
- institutions ;
- bailleurs.

Créer progressivement :

```text
partners
programs
program_cohorts
program_participants
program_metrics
```

Un programme peut financer :

> « 500 jeunes accompagnés vers une première réalisation numérique valorisable. »

## Dashboard

Mesurer notamment :

```text
Inscrits
↓
Orientés
↓
Projet commencé
↓
Premier livrable
↓
Projet terminé
↓
Portfolio
↓
Mission / client / emploi / activité
```

## Principe

Ne pas présenter :

> nombre d'inscrits

comme :

> impact.

L'impact recherché se situe plus loin dans la chaîne.

## Critère de sortie

Un partenaire peut financer une cohorte et comprendre ce que les bénéficiaires ont
réellement réalisé.

---

# 05 — Ce qu'on ne construit pas maintenant

## Une bibliothèque gigantesque de cours

Non.

Utiliser d'abord les ressources existantes.

---

## Une marketplace complète

Non.

Valider manuellement la demande avant.

---

## Un LMS complexe

Non.

TakaCode n'a pas besoin de reproduire une plateforme traditionnelle de formation.

---

## Une IA qui fait tout

Non.

L'objectif est d'augmenter la capacité du Builder.

---

## Un réseau social généraliste

Non.

Les interactions communautaires doivent principalement aider à :

> construire, débloquer, revoir, terminer.

---

## Une infrastructure partenaire complète avant d'avoir des partenaires

Non.

Commencer avec des rapports simples.

---

## Une refonte technique totale

Non.

Réutiliser les structures existantes lorsqu'elles restent adaptées.

---

# 06 — Ordre de dépendance

La roadmap n'est pas une simple liste.

Les jalons dépendent les uns des autres.

```text
J1 Positionnement
        ↓
J2 Orientation
        ↓
J3 Moteur projet
        ↓
J4 Ressources
        ↓
J5 Coach IA
        ↓
J6 Preuve d'expérience
        ↓
J7 Communauté / Mentorat
        ↓
J8 Challenges
        ↓
J9 Missions manuelles
        ↓
J10 Missions intégrées
        ↓
J11 Économie
        ↓
J12 Programmes d'impact
```

Certaines tâches peuvent être développées en parallèle.

Mais la **validation produit** doit respecter cette logique.

---

# 07 — Les validations les plus importantes

| Jalon | Question à valider |
| --- | --- |
| J1 | Les gens comprennent-ils TakaCode ? |
| J2 | Une personne sans idée trouve-t-elle une direction ? |
| J3 | Plusieurs types de projets fonctionnent-ils réellement ? |
| J4 | Peut-on accompagner sans produire nous-mêmes tous les cours ? |
| J5 | L'IA aide-t-elle réellement à avancer ? |
| J6 | Les réalisations deviennent-elles des preuves crédibles ? |
| J7 | L'entraide augmente-t-elle la complétion ? |
| J8 | Les Challenges permettent-ils de commencer sans idée ? |
| J9 | Des organisations paient-elles ? |
| J10 | Les Missions peuvent-elles être opérées dans TakaCode ? |
| J11 | L'économie fonctionne-t-elle de manière fiable ? |
| J12 | Peut-on démontrer un impact à un partenaire ? |

---

# 08 — La règle anti-surconstruction

Avant chaque développement important, poser trois questions :

### 1.

**Ce problème existe-t-il réellement chez nos utilisateurs ?**

### 2.

**Peut-on le résoudre manuellement avant de l'automatiser ?**

### 3.

**Un outil ou une ressource existante peut-il déjà résoudre une partie du problème ?**

Si oui :

> **intégrer ou orchestrer avant de reconstruire.**

Cette règle vaut autant pour les ressources pédagogiques que pour les fonctionnalités.

---

# 09 — La trajectoire produit

Le repositionnement peut finalement être résumé ainsi :

```text
TakaCode aujourd'hui
        ↓
Élargir ce qu'on appelle un projet
        ↓
Permettre de commencer sans idée
        ↓
Transformer le parcours en plan de réalisation
        ↓
Connecter les bonnes ressources aux bonnes étapes
        ↓
Faire du Coach IA un accélérateur contextuel
        ↓
Transformer les réalisations en preuves d'expérience
        ↓
Faire circuler l'expérience dans la communauté
        ↓
Proposer des Challenges
        ↓
Connecter les Builders à des besoins réels
        ↓
Créer une économie autour de cette activité
        ↓
Mesurer l'impact professionnel et économique
```

---

# 10 — Ce qui ne doit jamais être perdu pendant le développement

À mesure que TakaCode devient plus complexe, quatre principes doivent rester visibles.

### 1. Le projet avant le cours

> On apprend parce qu'on cherche à réaliser quelque chose.

### 2. Les ressources avant la production systématique de formations

> Si une excellente ressource existe déjà, TakaCode l'utilise et la contextualise.

### 3. L'IA comme accélérateur, pas comme substitut

> Elle aide à comprendre, décider, construire, corriger et avancer.

### 4. La réalisation avant les métriques superficielles

> Le succès n'est pas le nombre de vidéos regardées ou de messages envoyés.

Le succès est progressivement :

```text
Je trouve une direction.
        ↓
Je commence.
        ↓
Je construis.
        ↓
Je termine.
        ↓
Je peux montrer ce que j'ai fait.
        ↓
Cette réalisation m'ouvre une opportunité.
```

# C'est cette transformation que toute l'évolution technique de TakaCode doit servir.

---

# 11 — La refonte project-first : modèle cible et chemin de migration

> Cette section répond à la question laissée ouverte par
> [SYSTEME_PROJET.md](./SYSTEME_PROJET.md) §30 : **le modèle exact**.
>
> Les jalons J3, J4 et J8 ci-dessus donnent la liste des tables. Ici : les colonnes,
> la correspondance avec l'existant, l'ordre des migrations et l'impact sur l'admin
> et le dashboard.

## 11.1 — Le constat

L'application a **deux moteurs**, et c'est le mauvais qui porte la progression.

Le moteur pédagogique, celui qui compte aujourd'hui :

```text
learning_tracks
  └── track_modules
        └── track_lessons     (objectives, resources, quiz, micro_project, xp_reward)
              └── user_lesson_progress   (quiz_score, quiz_total)

user_track_enrollments (progress 0-100)
```

Cours, leçons, quiz, XP : un LMS complet. C'est lui qui alimente les grades, le
classement et le sentiment d'avancer.

Le moteur de projet, celui qui devrait compter :

```text
user_projects (title, description, objective, status, deadline,
               repo_url, live_url, track_id, revenue_model,
               template_id, first_euro_at, has_declared_first_euro)
```

Une fiche descriptive avec deux URLs. Ni étapes, ni tâches, ni livrables, ni
preuves, ni critères, ni journal. Vérification faite en base : **aucune** des
tables listées en J3 et J4 n'existe encore.

Conséquence directe : `SYSTEME_PROJET.md` §29 interdit deux progressions
séparées, et l'application en a exactement deux.

## 11.2 — Le principe de la bascule

> **Une seule unité de progression : le projet. Tout le reste l'alimente.**

Cela ne veut pas dire supprimer les parcours. Cela veut dire changer leur rôle.

| Aujourd'hui | Demain |
| --- | --- |
| Le parcours est le produit, le projet une annexe | Le projet est le produit, le framework un gabarit |
| On avance en terminant des leçons | On avance en produisant des livrables |
| Une ressource est une étape | Une ressource sert à franchir une étape |
| Le quiz valide l'apprentissage | Le livrable et ses critères valident l'étape |
| La progression vit dans `user_lesson_progress` | La progression vit dans `project_plan_steps` |

## 11.3 — Le modèle cible

Conventions reprises des migrations existantes : clés primaires `uuid`
(`gen_random_uuid()`), horodatages `timestamptz` UTC
(`timezone('utc'::text, now())`), dates simples en `date` (ISO 8601), RLS activée
sur toute table portant de la donnée membre.

### Les gabarits (contenu éditorial, côté admin)

```text
project_types
  id, slug, label, description, icon, accent_color, sort_order, is_active

project_frameworks            ← ce que deviennent les learning_tracks
  id, project_type_id, slug, title, summary, level_label,
  duration_weeks, locale, is_published, sort_order

framework_phases              ← ce que deviennent les track_modules
  id, framework_id, slug, title, objective, expected_outcome, sort_order

phase_step_templates          ← ce que deviennent les track_lessons
  id, phase_id, slug, title, why, deliverable_type,
  acceptance_criteria (jsonb), estimated_minutes, sort_order
```

Types de départ : `saas`, `web_app`, `site_web`, `agent_ia`, `automatisation`,
`data`, `ecommerce`, `contenu_video`, `podcast`, `newsletter`, `produit_digital`,
`formation`, `freelance`, `service_numerique`.

### Le projet réel (donnée membre)

```text
user_projects (généralisée)
  -- conservés
  id, user_id, title, description, objective, deadline, created_at, updated_at
  -- ajoutés
  project_type_id     → remplace l'implicite « c'est du code »
  framework_id        → remplace track_id
  target_audience, success_criteria
  status              → contrainte élargie (cf. 11.4)
  completed_at, published_at, valorised_at
  visibility          → private | unlisted | public
  -- dépréciés, conservés le temps de la migration
  track_id, repo_url, live_url, revenue_model, template_id,
  first_euro_at, has_declared_first_euro

project_plan_steps            ← c'est ICI que vit la progression
  id, project_id, step_template_id (nullable), phase_slug,
  title, why, deliverable_type, acceptance_criteria (jsonb),
  status (todo | doing | blocked | done | skipped),
  position, started_at, completed_at

project_tasks
  id, step_id, label, is_done, position

project_deliverables          ← ce qui remplace repo_url et live_url
  id, project_id, step_id (nullable), kind, title,
  url, file_path, body, created_at,
  validation_level (auto | ai | peer | contributor | mentor | client),
  validated_at, validated_by

project_proofs                ← « ça a marché », pas seulement « j'ai fait »
  id, project_id, kind, label, value_numeric, value_text, url, observed_at

project_journal
  id, project_id, entry_type (decision | difficulty | learning | pivot),
  body, created_at

project_members
  id, project_id, user_id, role, joined_at

project_opportunities         ← c'est ici qu'atterrit first_euro_at
  id, project_id, kind (client | job | mission | activity | revenue | other),
  label, amount, currency, declared_at, is_verified
```

`step_template_id` est nullable : une étape peut venir d'un framework **ou** être
ajoutée par le membre. Le plan appartient au Builder, pas au gabarit.

`project_deliverables.kind` : `repo`, `app`, `document`, `video`, `channel`,
`playlist`, `dashboard`, `dataset`, `automation`, `landing`, `portfolio`,
`proposal`, `product`, `other`.

### Les ressources

```text
resource_library
  id, url, title, source, format, locale, level, duration_minutes,
  is_free, status (active | stale | dead), last_checked_at, created_by

step_resources                ← une ressource n'existe jamais sans motif
  id, step_template_id, resource_id, why, what_to_understand,
  which_part, is_primary, position

resource_reports
  id, resource_id, reported_by, reason, created_at, resolved_at
```

## 11.4 — Les états d'un projet

La contrainte actuelle, `('idea', 'in_progress', 'published', 'archived')`,
confond « terminé » et « publié » et ignore « valorisé ».

```text
idea → planned → in_progress → completed → published → valorised
                      ↓
                  paused / abandoned
```

Le J6 ci-dessus le dit déjà : **projet commencé ≠ terminé ≠ publié ≠ valorisé.**

## 11.5 — Correspondance ancien vers nouveau

| Table actuelle | Devient | Traitement |
| --- | --- | --- |
| `learning_tracks` | `project_frameworks` | migration de données, colonnes reprises |
| `track_modules` | `framework_phases` | migration directe |
| `track_lessons` | `phase_step_templates` + `step_resources` + critères | **éclatement** : le contenu se sépare des ressources |
| `track_lessons.quiz` | — | conservé, sorti du chemin critique (cf. 11.8) |
| `track_lessons.micro_project` | `deliverable_type` + `acceptance_criteria` | extraction |
| `track_lessons.resources` | `resource_library` + `step_resources` | normalisation du `jsonb` |
| `user_track_enrollments` | absorbée par `user_projects` | s'inscrire devient créer un projet |
| `user_lesson_progress` | `project_plan_steps.status` | **la progression change de table** |
| `user_projects.repo_url` / `live_url` | `project_deliverables` | 1 ligne par URL non vide |
| `user_projects.first_euro_at` | `project_opportunities` (`kind = revenue`) | 1 ligne si déclaré |
| `project_reviews` | `deliverable_reviews` | renommage, rattachement au livrable |

## 11.6 — Ordre des migrations

Chaque étape est livrable seule et réversible. On **n'efface rien** tant que la
lecture n'est pas basculée.

| # | Contenu | Critère de sortie |
| --- | --- | --- |
| **M1** | `project_types`, `project_frameworks`, `framework_phases`, `phase_step_templates` ; colonnes ajoutées à `user_projects` ; contrainte `status` élargie | rien ne casse, anciennes colonnes intactes |
| **M2** | `project_plan_steps`, `project_tasks` ; générateur `framework → plan` | un projet neuf a un plan ; un projet existant fonctionne sans |
| **M3** | `project_deliverables`, `project_proofs`, `project_journal`, `project_opportunities` ; migration des URL et du premier revenu | l'UI lit les livrables, retombe sur les anciennes colonnes si vide |
| **M4** | `resource_library`, `step_resources`, `resource_reports` ; import des `jsonb` dédoublonnés par URL | une étape affiche ses ressources avec leur motif |
| **M5** | bascule des grades et du classement sur les livrables validés et les projets terminés | personne ne perd son avancement (cf. 11.8) |
| **M6** | `challenges`, `challenge_participations`, `challenge_cohorts` | rejoindre un Challenge crée un `user_project` — **aucun second moteur** |
| **M7** | dépréciation de `track_id`, `repo_url`, `live_url`, `revenue_model`, `first_euro_at` | plus aucune lecture des anciennes colonnes |

## 11.7 — Impact sur l'admin et le dashboard

L'admin est aujourd'hui un **studio de cours**.

| Aujourd'hui | Demain |
| --- | --- |
| `/admin/tracks` | `/admin/frameworks` — gabarits par type de projet |
| `/admin/tracks/[id]/lessons/[id]` | `/admin/frameworks/[id]/phases/[id]/steps/[id]` — livrable attendu, critères, ressources |
| — | `/admin/resources` — bibliothèque, validité, signalements |
| — | `/admin/challenges` — briefs, niveaux, cohortes |
| — | `/admin/project-types` |
| `/admin/reviews` | conservé, rattaché aux livrables |
| `/admin/users`, `/admin/ai`, `/admin/sessions`, `/admin/affiliates` | inchangés |

On ne rédige plus une leçon : on **décrit ce que le Builder doit produire et à
quelles conditions c'est terminé**.

Le dashboard s'organise autour des parcours suivis ; il doit s'organiser autour du
projet en cours.

| Aujourd'hui | Demain |
| --- | --- |
| `/dashboard` — progression de parcours, XP | **le projet en cours et sa prochaine étape** |
| `/dashboard/tracks` — mes parcours inscrits | fusionné dans le projet : un framework ne se « suit » plus |
| `/dashboard/projects/[id]` — fiche et 2 URLs | **le cœur** : plan, étapes, tâches, livrables, journal, critères |
| `/dashboard/resources` | ressources **de l'étape en cours**, pas un catalogue |
| `/dashboard/reviews` | revues de livrables |
| — | `/dashboard/portfolio` — ce qui est public, ce qui reste privé |

Les rôles suivent J7 : droits techniques (`user`, `admin`) séparés des rôles
communautaires (`membre`, `builder`, `contributor`, `mentor`, `expert`).

## 11.8 — Ce qui casse, et comment l'éviter

### Les XP, les grades et le classement

`lib/grades.ts` et la RPC `public_leaderboard` comptent des leçons et des quiz.
Basculer la progression sans précaution ferait **perdre visuellement leur
avancement** à des membres.

À M5 : recalculer en conservant l'acquis, une leçon validée devenant une étape
terminée. Personne n'est remis à zéro, et le changement passe par
`/dashboard/changelog` comme toute livraison visible.

### Les quiz

Ils n'ont pas de place dans le modèle cible mais ils existent, ils sont seedés et
portent une banque de questions. On ne les supprime pas : on les sort du chemin
critique. Ils pourront redevenir un outil de **vérification de compréhension** au
service d'une étape (SYSTEME_PROJET §12), pas une condition de progression.

### Les parcours publiés

Ils deviennent des frameworks. Leur contenu n'est pas perdu : il se répartit entre
`phase_step_templates` (ce qu'il faut produire) et `resource_library` (ce qui aide
à le produire). C'est un travail éditorial parcours par parcours, pas seulement
une migration SQL.

### Le contenu francophone

`scripts/fix-french-content.mjs` et `scripts/fix-french-ui.mjs` visent les tables
actuelles. Ils devront couvrir les nouvelles, **et enfin scanner `lib/i18n.ts`** —
angle mort qui a laissé passer quatre titres accentués illisibles en VALORAX.

## 11.9 — Hors périmètre de cette refonte

* Missions et espace organisation : ils dépendent d'une validation commerciale
  (J9), pas d'un schéma.
* Paiement, escrow, reversements.
* Marketplace d'expertise.
* Refonte visuelle : le design system reste tel quel.
* Suppression des quiz.

## 11.10 — Critères de sortie

1. Un membre mène une **chaîne YouTube** ou une **activité freelance** avec la même
   rigueur qu'un SaaS — sans `repo_url`.
2. Il existe **une seule barre de progression**, et elle mesure des livrables.
3. Une ressource ne s'affiche jamais sans **pourquoi elle est là maintenant**.
4. Un projet terminé produit un **portfolio partageable** sans ressaisie.
5. L'admin crée un framework complet **sans écrire une seule leçon**.
6. Rejoindre un Challenge crée un projet dans **le même moteur**.

> **Aujourd'hui le projet est une annexe du parcours. Demain le parcours est un
> gabarit au service du projet.**

Tant que la progression vit dans `user_lesson_progress`, TakaCode reste une
plateforme de cours qui affiche un projet à côté.