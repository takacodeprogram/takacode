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

### Page d'accueil

Remplacer les formulations trop centrées sur :

> BUILD / DEPLOY / MONETIZE

par la nouvelle promesse.

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