# Le système de projet

> Ce document définit ce qu'est un projet sur TakaCode, de quoi il est composé, comment il
> se relie à un parcours, et ce que la plateforme lui fournit : cadres, modèles et kits de
> démarrage.
>
> Il développe le **§02 de [VISION.md](VISION.md)** — « un projet ne signifie pas forcément
> coder ». Les fonctionnalités qui en découlent sont dans
> [FONCTIONNALITES.md](FONCTIONNALITES.md). Les mécanismes empruntés à d'autres
> plateformes sont justifiés dans [BENCHMARK.md](BENCHMARK.md).
>
> Écrit le 19 août 2026.

---

## 1. Le principe : le parcours est le plan du projet

C'est l'idée centrale, et elle change tout le reste.

Sur une plateforme de formation classique, il y a d'un côté un cours, de l'autre — parfois
— un projet d'application. Les deux vivent séparément. On peut finir le cours sans avoir
rien construit.

**Sur TakaCode, ce sont les mêmes objets.** Le parcours n'est pas un programme
pédagogique à côté du projet : c'est le **plan du projet**, découpé en étapes. Chaque
étape produit un morceau du projet.

```
Parcours classique :   Leçon 1 → Leçon 2 → Leçon 3 → Quiz → Certificat
                       (à la fin, on n'a rien construit)

Parcours TakaCode :    Étape 1 → livrable 1 ─┐
                       Étape 2 → livrable 2 ─┼→ LE PROJET
                       Étape 3 → livrable 3 ─┘
                       (à la fin, le projet existe)
```

**Trois conséquences immédiates.**

1. **Avancer dans le parcours, c'est avancer dans le projet.** Il n'y a pas deux barres de
   progression. Terminer une étape ajoute un livrable au projet. On ne peut pas « finir le
   parcours » sans que le projet existe.
2. **Un parcours sans projet n'a pas de sens.** Personne ne « suit un parcours » sur
   TakaCode. On démarre un projet, et le parcours apparaît comme son plan.
3. **Le parcours s'adapte au projet, pas l'inverse.** Deux personnes qui lancent une chaîne
   YouTube n'ont pas la même niche, le même matériel, le même temps disponible. Le
   coach IA part du parcours type et le personnalise.

---

## 2. L'anatomie d'un projet

Un projet TakaCode est composé de douze éléments. Ils valent pour tous les types de projet.

### 2.1 — Identité
Ce qui permet de reconnaître le projet.

| Champ | Exemple (chaîne YouTube) | Exemple (SaaS) |
| --- | --- | --- |
| Titre | « Chaîne faceless sur la finance perso » | « FactureRapide » |
| Type | contenu vidéo | logiciel / SaaS |
| Résumé | Une vidéo par semaine expliquant l'épargne aux 20-30 ans en Afrique de l'Ouest | Facturation simplifiée pour freelances en zone FCFA |
| Visuel | miniature de la chaîne | capture de l'écran principal |
| Domaines | finance, montage vidéo, écriture | développement web, paiement, design |

### 2.2 — Intention
Pourquoi ce projet existe, et à quoi on saura qu'il a réussi.

- **Objectif** — ce qu'on veut obtenir, en une phrase.
- **Pour qui** — la personne à qui ça s'adresse. Pas « tout le monde ».
- **Critère de réussite** — un fait vérifiable, pas un sentiment.
  *Bon :* « 10 vidéos publiées et 500 abonnés. » *Mauvais :* « une belle chaîne. »
- **Échéance visée** — une date. Sans date, un projet personnel ne se termine pas.

### 2.3 — Cadre
Le **framework de projet** : la suite de phases propre à ce type de projet. Voir §3.

### 2.4 — Plan
Le framework appliqué à ce projet précis, découpé en étapes puis en tâches. C'est le
parcours. Il est modifiable : le Builder peut retirer une étape qui ne le concerne pas.

### 2.5 — Ressources
Ce que la plateforme fournit pour avancer : modèles, kits de démarrage, outils recommandés,
lectures, exemples de projets similaires déjà terminés.

### 2.6 — Livrables
Ce que le projet produit réellement. C'est la partie qui remplace `repo_url` et `live_url`.
Voir §6 pour la liste exhaustive par type.

### 2.7 — Preuves
Ce qui atteste que le livrable est réel et qu'il a produit un effet : captures d'écran,
chiffres (abonnés, ventes, visites, téléchargements), témoignage d'un utilisateur, capture
d'un premier paiement reçu.

Un livrable montre qu'on a fait. Une preuve montre que ça a marché.

### 2.8 — Accompagnement
Qui aide, et comment : le coach IA en continu, la communauté à la demande, un mentor
attribué, les sessions de déblocage, un binôme.

### 2.9 — Validation
Qui dit que c'est bon, et selon quels critères. Quatre niveaux, cumulables :

| Niveau | Qui valide | Ce que ça vaut |
| --- | --- | --- |
| Auto-déclaré | le Builder | rien en soi, sert au suivi |
| IA | le coach, contre une grille écrite | un premier filtre, immédiat |
| Pairs | d'autres Builders ou Contributors | crédible, et ça fait progresser le relecteur |
| Mentor | un Mentor du domaine | c'est ce qui compte pour une Mission |
| Client | l'organisation, sur une Mission | la validation la plus forte |

**La grille de validation est visible avant de commencer.** Le Builder sait sur quoi il
sera évalué au moment où il attaque, pas après.

### 2.10 — Publication
La page publique du projet. C'est ce qu'on envoie à un recruteur ou à un client.

### 2.11 — Valorisation
Ce que le projet a rapporté : revenus générés, opportunité obtenue, mission décrochée,
réutilisation du projet comme base d'un autre.

### 2.12 — Journal de bord
La trace datée de ce qui s'est passé : décisions, blocages, essais ratés, ce qui a été
changé et pourquoi.

> **Pourquoi c'est important et souvent oublié.** Un recruteur ou un client regarde le
> résultat, mais ce qui le convainc, c'est le raisonnement. Le journal de bord transforme
> « j'ai fait un site » en « voilà comment j'ai décidé, ce qui a raté, et ce que j'ai
> corrigé ». C'est le §01 de la vision — *je peux le montrer, l'expliquer et documenter mon
> travail* — rendu concret.

---

## 3. Les frameworks de projet

Un **framework de projet** est la suite de phases type d'une catégorie de projet. Il ne
change pas d'un Builder à l'autre. C'est le squelette.

### 3.1 — Logiciel / SaaS
```
Problème → Utilisateur cible → Périmètre minimal → Maquette → Modèle de données
→ Développement → Tests → Déploiement → Premiers utilisateurs → Monétisation
```

### 3.2 — Agent IA / automatisation
```
Tâche répétitive identifiée → Mesure du temps perdu → Choix des outils → Prototype
→ Fiabilisation → Mise en production → Mesure du gain → Réutilisation ou vente
```

### 3.3 — Boutique en ligne
```
Produit → Fournisseur ou stock → Positionnement prix → Catalogue → Plateforme
→ Paiement → Livraison → Lancement → Acquisition → Premières commandes
```

### 3.4 — Formation en ligne
```
Expertise → Public cible → Promesse → Programme → Production du contenu
→ Plateforme d'hébergement → Page de vente → Tarification → Lancement → Premiers élèves
```

### 3.5 — Chaîne vidéo
```
Niche → Étude des chaînes existantes → Identité → Format → Processus de production
→ 3 premières vidéos → Publication régulière → Miniatures et titres → Audience
→ Monétisation
```

### 3.6 — Podcast / newsletter
```
Angle → Public → Format et fréquence → Nom et identité → Production du n°1
→ Plateforme de diffusion → 5 premiers numéros → Distribution → Régularité → Revenus
```

### 3.7 — Activité freelance
```
Compétence vendable → Offre précise → Prix → Portfolio → Présence en ligne
→ Prospection → Premier devis → Premier client → Livraison → Recommandation
```

### 3.8 — Produit digital
```
Besoin → Format du produit → Production → Mise en forme → Page de vente
→ Plateforme de paiement → Prix → Lancement → Premières ventes → Itération
```

**Règle :** un framework a entre 8 et 12 phases. Moins, il est trop vague pour guider.
Plus, il décourage avant d'avoir commencé.

---

## 4. Les modèles (templates)

Un **modèle** est un document à remplir. Il ne fait pas le travail, il évite la page
blanche et impose de répondre aux bonnes questions.

| Modèle | À quelle phase | Ce qu'il contient |
| --- | --- | --- |
| Fiche projet | au démarrage, tous types | objectif, cible, critère de réussite, échéance |
| Fiche utilisateur cible | phase 2, tous types | qui, quel problème, comment il fait aujourd'hui |
| Périmètre minimal | logiciel, boutique, SaaS | ce qui est dans la v1, ce qui est explicitement dehors |
| Modèle de données | logiciel, SaaS | tables, champs, relations |
| Plan de programme | formation | modules, objectifs pédagogiques, durée |
| Script vidéo | vidéo, formation | accroche, corps, appel à l'action |
| Calendrier éditorial | vidéo, podcast, newsletter | 8 semaines de publications planifiées |
| Fiche produit | boutique | photos, description, prix, marge |
| Page de vente | formation, produit digital, freelance | promesse, preuves, objections, prix, garantie |
| Grille tarifaire | freelance, formation | offres, ce qui est inclus, ce qui ne l'est pas |
| Proposition commerciale | freelance | contexte client, livrables, délai, prix |
| Plan de lancement | tous types | J-14, J-7, jour J, J+7 |
| Journal de bord | tous types | date, décision, blocage, résultat |
| Brief de mission | Missions | besoin, périmètre, livrables, critères d'acceptation, budget |

---

## 5. Les kits de démarrage (starter kits)

Un **kit de démarrage** n'est pas un document : c'est un point de départ déjà fonctionnel.
On le prend, on le modifie, on gagne des jours.

| Kit | Pour | Contenu |
| --- | --- | --- |
| Application web | logiciel, SaaS | dépôt prêt à déployer : authentification, base de données, page d'accueil, déploiement configuré |
| Agent IA | agent IA | squelette d'appel à un modèle, gestion des clés, exemple d'outil, garde-fous |
| Automatisation | automatisation | scénario type déclencheur → action, avec journalisation |
| Boutique | boutique | structure de catalogue, fiches produits, paiement mobile money, page de commande |
| Espace de formation | formation | arborescence des modules, page de vente, tunnel d'inscription, accès aux vidéos |
| Production vidéo | vidéo | structure de dossiers, modèle de miniature, préréglages de montage, checklist de publication |
| Podcast | podcast | modèle de flux RSS, habillage sonore, structure d'épisode |
| Newsletter | newsletter | page d'inscription, modèle d'email, séquence de bienvenue |
| Portfolio freelance | freelance | page personnelle, présentation de 3 études de cas, formulaire de contact |
| Produit téléchargeable | produit digital | mise en page du document, page de vente, livraison automatique après paiement |

**Deux règles pour les kits.**

1. **Un kit doit être déployable en moins de 30 minutes.** Au-delà, il devient lui-même un
   obstacle.
2. **Un kit n'est jamais imposé.** Un Builder qui veut tout construire lui-même doit
   pouvoir ignorer le kit sans que le parcours se bloque.

> Les kits sont aussi le meilleur endroit pour les liens d'affiliation du §06 de la vision.
> Le kit « application web » a besoin d'un hébergement ; la recommandation apparaît là, au
> moment exact où le besoin existe.

---

## 6. Les livrables, par type de projet

C'est la liste qui remplace « dépôt GitHub + URL de démo ». Elle doit être exhaustive,
parce qu'un type de livrable manquant rend un type de projet impossible à suivre.

| Type de projet | Livrables acceptés |
| --- | --- |
| **Logiciel / SaaS** | dépôt de code · application en ligne · vidéo de démonstration · documentation · page de tarifs |
| **Agent IA / automatisation** | dépôt · scénario exporté · démonstration avant/après · mesure du temps gagné |
| **Boutique en ligne** | boutique en ligne · fiche produit · première commande · tableau de bord des ventes |
| **Formation en ligne** | espace de formation · plan de programme · module publié · page de vente · premier élève inscrit |
| **Chaîne vidéo** | chaîne · playlist · vidéo publiée · miniature · statistiques d'audience |
| **Podcast** | flux RSS · épisode publié · page du podcast · statistiques d'écoute |
| **Newsletter** | page d'inscription · numéro publié · nombre d'abonnés |
| **Activité freelance** | portfolio · étude de cas · proposition commerciale · contrat signé · premier paiement |
| **Produit digital** | fichier téléchargeable · page de vente · première vente |
| **Tous types** | journal de bord · capture d'écran · témoignage · attestation TakaCode |

**Chaque livrable porte :** un type, un intitulé, un lien ou un fichier, une date, un état
(brouillon, soumis, validé), et le niveau de validation obtenu (§2.9).

---

## 7. Le lien permanent parcours ↔ projet

C'est le mécanisme le plus important à implémenter correctement.

### 7.1 — Comment il se crée
1. Un Membre crée un projet et décrit son objectif.
2. Le coach IA identifie le **type de projet** et propose le **framework** correspondant.
3. Le framework est instancié en un **plan** : les phases deviennent des étapes du parcours.
4. Chaque étape reçoit son **livrable attendu**, son **modèle**, ses **ressources** et sa
   **grille de validation**.

### 7.2 — Comment il vit
- Terminer une étape → un livrable entre dans le projet. Pas de livrable, pas d'étape
  terminée.
- La progression du parcours **est** la progression du projet. Un seul pourcentage.
- Le Builder peut **retirer une étape** qui ne le concerne pas, ou **en ajouter une**. Le
  plan lui appartient.
- Si le projet change de direction, le coach recalcule le plan à partir de l'étape en cours
  — sans effacer ce qui a déjà été livré.

### 7.3 — Ce que ça interdit
- Un parcours qui ne produit aucun livrable.
- Une leçon qui n'a pas de contribution identifiable au projet.
- Un projet sans plan.
- Deux barres de progression.

### 7.4 — La leçon devient un brief
Conséquence directe du mécanisme n°1 du benchmark (ALX). Une étape de parcours contient :

| Bloc | Contenu |
| --- | --- |
| Ce qu'on cherche à obtenir | le livrable attendu, décrit précisément |
| Pourquoi cette étape | à quoi elle sert dans le projet |
| Comment s'y prendre | la démarche, pas la solution |
| Ressources | modèle, kit, lectures, exemples de projets terminés |
| Grille de validation | les critères, visibles avant de commencer |
| Où demander de l'aide | coach IA, communauté, prochaine session de déblocage |

---

## 8. Trois exemples déroulés

### 8.1 — « Je veux lancer une chaîne YouTube faceless sur la finance personnelle »

| Étape | Livrable attendu | Modèle / kit | Validation |
| --- | --- | --- | --- |
| 1. Choisir la niche | Fiche niche : sujet, angle, public, 3 chaînes concurrentes analysées | Fiche projet, fiche public cible | IA |
| 2. Valider la demande | 10 sujets de vidéos avec volume de recherche estimé | Modèle de recherche de sujets | IA |
| 3. Créer l'identité | Nom, logo, bannière, description de chaîne | Kit production vidéo | Pairs |
| 4. Définir le format | Durée, structure type, voix, style visuel | Script vidéo | IA |
| 5. Monter le processus | Chaîne de production : script → voix → montage → miniature | Kit production vidéo | Mentor |
| 6. Produire la vidéo 1 | Vidéo publiée | Script vidéo, préréglages | Pairs + Mentor |
| 7. Produire les vidéos 2 et 3 | 2 vidéos publiées | — | Pairs |
| 8. Planifier 8 semaines | Calendrier éditorial rempli | Calendrier éditorial | IA |
| 9. Optimiser | 3 miniatures testées, titres réécrits | Modèle miniature | Pairs |
| 10. Monétiser | Dossier de monétisation : affiliation, sponsors, produit | Grille tarifaire | Mentor |

**Livrables finaux :** la chaîne, une playlist, 10 vidéos, les statistiques d'audience, le
journal de bord.
**Preuve :** le nombre d'abonnés et de vues à la fin, capture à l'appui.

### 8.2 — « Je veux créer une formation en ligne sur la comptabilité pour commerçants »

| Étape | Livrable attendu | Modèle / kit | Validation |
| --- | --- | --- | --- |
| 1. Cadrer l'expertise | Fiche projet : ce que je sais faire, pour qui | Fiche projet | IA |
| 2. Interroger 5 personnes de la cible | 5 comptes rendus d'entretien | Guide d'entretien | Mentor |
| 3. Écrire la promesse | Une phrase : à la fin, l'élève sait faire X | Page de vente (bloc promesse) | Pairs |
| 4. Structurer le programme | Plan : modules, objectifs, durée | Plan de programme | Mentor |
| 5. Produire le module 1 | Module 1 en ligne | Script vidéo, kit formation | Pairs |
| 6. Produire les modules restants | Formation complète | — | IA |
| 7. Monter l'espace | Espace de formation accessible | Kit espace de formation | IA |
| 8. Écrire la page de vente | Page de vente publiée | Page de vente | Mentor |
| 9. Fixer le prix | Grille tarifaire justifiée | Grille tarifaire | Mentor |
| 10. Lancer | Plan de lancement exécuté | Plan de lancement | — |
| 11. Premier élève | Une inscription payante | — | Preuve |

### 8.3 — « Je veux devenir freelance en design graphique »

| Étape | Livrable attendu | Modèle / kit | Validation |
| --- | --- | --- | --- |
| 1. Choisir la spécialité | Fiche offre : ce que je vends, à qui, pas à qui | Fiche projet | IA |
| 2. Fixer les prix | Grille tarifaire avec 3 offres | Grille tarifaire | Mentor |
| 3. Monter le portfolio | 3 études de cas en ligne | Kit portfolio freelance | Pairs + Mentor |
| 4. Créer la présence | Profil professionnel complet et cohérent | — | Pairs |
| 5. Bâtir la liste de prospects | 30 prospects qualifiés | Modèle de prospection | IA |
| 6. Prospecter | 30 messages envoyés, réponses consignées | Modèle de prospection | — |
| 7. Premier devis | Proposition commerciale envoyée | Proposition commerciale | Mentor |
| 8. Premier client | Contrat signé | — | Preuve |
| 9. Livrer | Travail livré et accepté | — | Client |
| 10. Capitaliser | Témoignage obtenu, étude de cas ajoutée | — | Pairs |

> Remarquer ce qui se passe à l'étape 8 : le premier client d'un Builder freelance est
> exactement ce que le §01 de la vision appelle l'étape 4 — *quelqu'un est prêt à me payer
> pour le faire*. Le système de projet mène jusque-là par construction.

---

## 9. Les états d'un projet

```
idée → en cours → terminé → publié → valorisé
                     ↓
                  en pause / abandonné
```

| État | Ce que ça veut dire | Compté dans les statistiques ? |
| --- | --- | --- |
| Idée | déclaré, pas commencé | non |
| En cours | au moins une étape franchie | oui, en activation |
| **Terminé** | tous les livrables obligatoires sont validés | **oui — c'est LA métrique** |
| Publié | page publique visible | oui |
| Valorisé | a produit un revenu ou une opportunité | oui, en impact |
| En pause | inactif depuis 30 jours, relançable | signalé au Builder |
| Abandonné | déclaré abandonné par le Builder | oui — et on demande pourquoi |

> **Demander pourquoi à l'abandon** est une petite fonctionnalité à fort rendement. C'est
> la seule façon d'apprendre ce qui bloque réellement, et donc d'améliorer le taux de
> projets terminés — le moteur décrit au §05 de la vision.

---

## 10. Ce que ça implique dans la base de données

Résumé technique, détaillé dans [ROADMAP_REPOSITIONNEMENT.md](ROADMAP_REPOSITIONNEMENT.md).

| Table | Rôle |
| --- | --- |
| `project_types` | les 8+ types, avec leur framework associé |
| `project_frameworks` / `framework_phases` | les phases types par type de projet |
| `user_projects` | + `project_type`, `objective`, `target_audience`, `success_criteria`, `deadline` |
| `project_plan_steps` | le plan instancié : les étapes du projet, liées aux leçons du parcours |
| `project_deliverables` | les livrables : type, intitulé, lien, état, niveau de validation |
| `project_proofs` | les preuves : captures, chiffres, témoignages |
| `project_journal` | le journal de bord daté |
| `project_members` | qui travaille dessus, avec quel rôle |
| `templates` | les modèles, par type de projet et par phase |
| `starter_kits` | les kits, par type de projet |
| `validation_rubrics` | les grilles de validation, visibles avant de commencer |
