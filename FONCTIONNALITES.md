# Les fonctionnalités de TakaCode

> Ce document décrit ce que TakaCode doit offrir, à qui, et dans quel ordre.
>
> Il traduit la vision produit définie dans [VISION.md](./VISION.md) en fonctionnalités concrètes.
>
> Le principe directeur est :
>
> **TakaCode n'est pas une plateforme de cours.**
>
> La plateforme aide une personne à :
>
> **s'orienter → trouver les bonnes ressources → apprendre au moment du besoin → construire → terminer → prouver → accéder progressivement à des opportunités.**
>
> Les ressources utilisées peuvent provenir de documentations officielles, vidéos YouTube, articles, tutoriels, dépôts GitHub, cours ouverts ou autres ressources accessibles sur Internet.
>
> TakaCode les sélectionne, les organise et les contextualise autour des étapes d'un projet.
>
> L'intelligence artificielle intervient comme **outil d'orientation, de compréhension, de feedback et d'accélération**, sans se substituer à l'apprentissage ni à la réalisation du membre.
>
> Le système de projet est défini dans [SYSTEME_PROJET.md](./SYSTEME_PROJET.md).
>
> Les mécanismes inspirés d'autres plateformes sont documentés dans [BENCHMARK.md](./BENCHMARK.md).
>
> Le modèle économique est détaillé dans [BUSINESS_MODEL.md](./BUSINESS_MODEL.md).
>
> La traduction technique et les jalons sont décrits dans [ROADMAP_REPOSITIONNEMENT.md](./ROADMAP_REPOSITIONNEMENT.md).

---

# 01 — Les parties prenantes

TakaCode ne s'adresse pas à un seul type d'utilisateur.

L'écosystème comprend plusieurs acteurs qui peuvent évoluer d'un rôle à l'autre.

| Acteur                   | Ce qu'il cherche                                                              | Ce qu'il apporte                                | Principal risque de départ                            |
| ------------------------ | ----------------------------------------------------------------------------- | ----------------------------------------------- | ----------------------------------------------------- |
| **Visiteur**             | comprendre si TakaCode peut l'aider                                           | attention                                       | ne pas comprendre la proposition en quelques secondes |
| **Membre**               | trouver une direction ou commencer à agir                                     | activité, données de progression                | ne pas savoir par où commencer                        |
| **Builder**              | réaliser un projet                                                            | projets, livrables, expérience                  | abandonner ou rester bloqué                           |
| **Contributor**          | progresser en aidant les autres                                               | feedback, réponses, revues                      | contribuer sans reconnaissance                        |
| **Mentor**               | transmettre son expérience                                                    | accompagnement, hausse du taux de complétion    | surcharge et épuisement                               |
| **Expert**               | valoriser une expertise avancée                                               | qualité, crédibilité, accompagnement spécialisé | manque de demande                                     |
| **Organisation**         | faire réaliser un besoin réel                                                 | Missions, budget, expérience professionnelle    | qualité insuffisante ou non-livraison                 |
| **Partenaire / Sponsor** | soutenir un public, un outil ou un parcours pertinent                         | crédits, financement, outils, opportunités      | faible impact ou manque de transparence               |
| **Bailleur / Programme** | financer de l'insertion, de l'employabilité ou de l'autonomisation économique | financement d'impact                            | absence de résultats mesurables                       |

Le staff TakaCode constitue un rôle d'administration et de régulation.

Il intervient notamment pour :

* valider certains Mentors ou Experts ;
* maintenir les ressources et parcours ;
* cadrer les Missions ;
* arbitrer les litiges ;
* publier les Challenges ;
* garantir les règles de la plateforme ;
* suivre la qualité et l'impact.

---

# 02 — L'onboarding et l'orientation

## Le premier problème à résoudre n'est pas toujours « quel projet veux-tu faire ? »

Certains membres arrivent avec une idée précise.

D'autres arrivent avec seulement une intention :

> « Je veux travailler dans le numérique. »

> « Je veux apprendre quelque chose qui peut me permettre de gagner de l'argent. »

> « Je veux me reconvertir. »

> « Je veux construire quelque chose mais je ne sais pas quoi. »

TakaCode doit donc commencer avant le projet lorsque cela est nécessaire.

## Fonctionnalités

| #   | Fonctionnalité                     | Ce que ça fait                                                                                            |
| --- | ---------------------------------- | --------------------------------------------------------------------------------------------------------- |
| 2.1 | Diagnostic d'entrée                | identifie objectif, niveau, expérience, disponibilité, équipement et contraintes                          |
| 2.2 | Question d'intention               | « Pourquoi es-tu ici ? » : apprendre, construire, trouver une voie, entreprendre, obtenir de l'expérience |
| 2.3 | Exploration des métiers numériques | présente des voies de manière concrète, avec exemples de projets et débouchés                             |
| 2.4 | Exploration par type de projet     | permet de découvrir ce qu'on peut construire avant de choisir un métier                                   |
| 2.5 | Recommandation de point de départ  | propose BUILD, CHALLENGES ou une exploration guidée                                                       |
| 2.6 | Niveau estimé                      | débutant complet, débutant autonome, intermédiaire, avancé                                                |
| 2.7 | Contraintes prises en compte       | mobile uniquement, connexion limitée, disponibilité faible, langue                                        |
| 2.8 | Objectif à court terme             | transforme une intention vague en première réalisation atteignable                                        |
| 2.9 | Réorientation                      | permet de changer de voie sans perdre l'historique ni les réalisations                                    |

## Règle produit

L'onboarding ne doit pas devenir un test scolaire de cinquante questions.

Il doit permettre de répondre rapidement à :

> **« Où veux-tu aller et quelle est la meilleure première action pour toi ? »**

---

# 03 — Les trois portes d'entrée

## BUILD

### « J'ai quelque chose que je veux réaliser. »

Le membre possède déjà une idée.

Fonctionnalités :

* création de projet guidée ;
* objectif en langage naturel ;
* clarification par le Coach IA ;
* choix du résultat attendu ;
* génération d'un plan initial ;
* adaptation du plan ;
* recommandations de ressources ;
* suivi jusqu'à publication.

---

## CHALLENGES

### « Je veux construire mais je ne sais pas encore quoi. »

Les Challenges sont des projets prêts à réaliser.

Ils permettent :

* de découvrir un domaine ;
* de tester une compétence ;
* d'apprendre par la pratique ;
* de construire un portfolio ;
* de rencontrer d'autres Builders.

---

## MISSIONS

### « Je veux contribuer à un vrai besoin. »

Une organisation propose un besoin réel.

TakaCode transforme ce besoin en projet cadré avec :

* objectifs ;
* compétences nécessaires ;
* équipe ;
* Mentor ou responsable ;
* critères d'acceptation ;
* livrables ;
* budget ;
* validation.

---

# 04 — Le cœur du système : le projet

Le projet constitue l'unité principale de TakaCode.

Il ne s'agit pas uniquement d'un dépôt GitHub ou d'une URL.

Un projet peut être :

* SaaS ;
* application ;
* agent IA ;
* automatisation ;
* projet data ;
* boutique en ligne ;
* activité freelance ;
* produit digital ;
* chaîne YouTube ;
* podcast ;
* newsletter ;
* formation ;
* service numérique ;
* campagne digitale ;
* projet proposé par une organisation.

## Fonctionnalités

| #    | Fonctionnalité             | Ce que ça fait                                                      |
| ---- | -------------------------- | ------------------------------------------------------------------- |
| 4.1  | Types de projet            | modèles adaptés aux différentes catégories                          |
| 4.2  | Framework de projet        | définit les grandes phases selon le type                            |
| 4.3  | Objectif final             | décrit clairement ce qui doit exister lorsque le projet est terminé |
| 4.4  | Génération du plan         | Coach IA : objectif → étapes → tâches → ressources → livrables      |
| 4.5  | Plan modifiable            | ajouter, retirer, réordonner, fusionner une étape                   |
| 4.6  | Recalcul du parcours       | adapte la suite lorsque le projet change                            |
| 4.7  | Étapes                     | unités principales de progression                                   |
| 4.8  | Tâches                     | actions concrètes à exécuter                                        |
| 4.9  | Livrables                  | preuves attendues pour terminer une étape                           |
| 4.10 | Critères de validation     | visibles avant de commencer                                         |
| 4.11 | Journal de bord            | décisions, apprentissages, difficultés, changements                 |
| 4.12 | Pièces et preuves          | fichiers, captures, liens, chiffres, témoignages                    |
| 4.13 | Membres du projet          | rôles explicites pour les projets en équipe                         |
| 4.14 | Progression unique         | une seule progression projet + apprentissage                        |
| 4.15 | Reprise après interruption | reprend exactement là où le membre s'est arrêté                     |
| 4.16 | Analyse d'abandon          | demande ce qui a empêché la poursuite                               |

---

# 05 — Le moteur Ressources → Action

## TakaCode ne crée pas une bibliothèque de cours

La plateforme doit disposer d'un système permettant de rattacher des ressources externes directement aux besoins du projet.

Une ressource existe dans TakaCode parce qu'elle aide à réaliser une action.

La logique est :

> **Étape → Besoin → Ressource → Compréhension → Action → Livrable**

## Types de ressources

* documentation officielle ;
* vidéo YouTube ;
* article ;
* tutoriel ;
* dépôt GitHub ;
* cours ouvert ;
* template ;
* outil interactif ;
* communauté ;
* guide ;
* exemple ;
* ressource créée exceptionnellement par TakaCode.

## Fonctionnalités

| #    | Fonctionnalité                 | Ce que ça fait                                                 |
| ---- | ------------------------------ | -------------------------------------------------------------- |
| 5.1  | Bibliothèque de ressources     | conserve les ressources validées                               |
| 5.2  | Ressource liée à une étape     | aucune ressource sans contexte d'utilisation                   |
| 5.3  | Objectif de consultation       | explique ce que le membre doit en retirer                      |
| 5.4  | Partie utile                   | indique éventuellement la section, vidéo ou chapitre pertinent |
| 5.5  | Niveau                         | débutant, intermédiaire, avancé                                |
| 5.6  | Langue                         | permet des alternatives selon la langue                        |
| 5.7  | Durée indicative               | évite de proposer 5 heures de contenu pour une notion simple   |
| 5.8  | Ressource principale           | celle à commencer en priorité                                  |
| 5.9  | Alternatives                   | autres formats ou sources                                      |
| 5.10 | Alternative faible connexion   | texte, PDF ou ressource légère lorsque possible                |
| 5.11 | Ressource gratuite prioritaire | privilégie l'accès libre                                       |
| 5.12 | Statut de validité             | active, obsolète, à vérifier                                   |
| 5.13 | Date de vérification           | permet la maintenance                                          |
| 5.14 | Signalement communautaire      | lien mort, contenu dépassé, mauvaise qualité                   |
| 5.15 | Suggestion de remplacement IA  | aide à trouver une alternative                                 |
| 5.16 | Téléchargement hors ligne      | lorsque les droits et le format le permettent                  |

## Règle fondamentale

> **TakaCode ne recommande pas une ressource parce qu'elle existe. Elle la recommande parce qu'elle permet de franchir une étape.**

---

# 06 — Le Coach IA

L'intelligence artificielle est transversale à la plateforme.

Elle ne doit pas être un chatbot générique.

Le Coach IA connaît autant que possible :

* le profil ;
* l'objectif ;
* le type de projet ;
* le niveau ;
* les contraintes ;
* les étapes ;
* les ressources utilisées ;
* les livrables ;
* l'historique ;
* les blocages.

## Fonctionnalités

| #    | Fonctionnalité                  | Détail                                                                 |
| ---- | ------------------------------- | ---------------------------------------------------------------------- |
| 6.1  | Orientation                     | aide à clarifier une voie ou un objectif                               |
| 6.2  | Génération de projet            | transforme une idée en plan exploitable                                |
| 6.3  | Recommandation de ressources    | propose la bonne ressource au bon moment                               |
| 6.4  | Explication contextualisée      | explique une notion en lien avec le projet                             |
| 6.5  | Lecture de ressources           | aide à comprendre une documentation ou un fichier                      |
| 6.6  | Déblocage                       | identifie le problème avant de proposer une solution                   |
| 6.7  | Décomposition                   | transforme une tâche trop grande en actions                            |
| 6.8  | Feedback                        | analyse un livrable par rapport à une grille                           |
| 6.9  | Vérification de compréhension   | pose des questions ou demande une explication                          |
| 6.10 | Étude de cas                    | transforme le journal de bord en présentation professionnelle          |
| 6.11 | Analyse de progression          | détecte ralentissements ou incohérences                                |
| 6.12 | Détection de décrochage         | propose une petite action lorsque l'activité s'arrête                  |
| 6.13 | Préparation à la demande d'aide | résume le problème avant escalade vers un humain                       |
| 6.14 | Cadrage de Mission              | transforme un besoin d'organisation en première proposition structurée |
| 6.15 | Aide à la présentation          | prépare pitch, documentation ou démonstration                          |

---

## Ce que le Coach IA ne doit pas faire

Le Coach IA ne doit pas transformer TakaCode en machine à produire des livrables sans apprentissage.

Il doit éviter autant que possible :

> « Voici ton projet complet, copie-colle et valide l'étape. »

Il doit favoriser :

> **comprendre → essayer → obtenir un feedback → corriger → terminer.**

Certaines validations peuvent demander au membre :

* d'expliquer un choix ;
* de modifier une partie ;
* de répondre à quelques questions ;
* de démontrer le fonctionnement ;
* de documenter son processus.

---

# 07 — Le système de déblocage

## Le bouton « Je suis bloqué »

Présent directement dans le contexte du projet.

Il ne doit pas ouvrir un simple forum.

Il propose plusieurs niveaux d'aide.

| Niveau                   | Réponse                   | Acteur                  |
| ------------------------ | ------------------------- | ----------------------- |
| **Coach IA**             | immédiate                 | IA                      |
| **Communauté**           | asynchrone                | Contributors / Builders |
| **Session de déblocage** | programmée                | Mentor / groupe         |
| **Revue**                | feedback structuré        | pairs / Mentor          |
| **Expert**               | accompagnement spécialisé | payant selon le cas     |

La logique est :

> **utiliser le niveau d'accompagnement le moins coûteux capable de résoudre correctement le problème.**

---

# 08 — Les sessions communautaires

## Session de déblocage

Petit groupe.

Chaque Builder arrive avec :

* ce qu'il veut faire ;
* ce qu'il a essayé ;
* où il est bloqué.

Objectif :

> repartir avec une prochaine action.

---

## Session de construction

Plusieurs membres travaillent simultanément.

Début :

> « Voici ce que je vais terminer. »

Fin :

> « Voici ce que j'ai réellement fait. »

---

## Revue croisée

Un membre analyse le travail d'un autre à l'aide d'une grille.

Cela permet :

* d'apprendre ;
* de contribuer ;
* de développer le regard critique ;
* d'alimenter la réputation Contributor.

---

## Critique de projet

Le membre présente un projet encore incomplet.

Règle :

> **on critique le travail, jamais la personne.**

Toute critique importante doit idéalement proposer :

* raison ;
* amélioration possible.

---

## Demo Day

Moment final d'un Challenge ou d'une cohorte.

Les membres présentent ce qu'ils ont réellement réalisé.

Le Demo Day peut être ouvert :

* à la communauté ;
* aux Mentors ;
* aux Experts ;
* aux organisations ;
* aux partenaires.

---

# 09 — Binômes et groupes de progression

La solitude est un facteur important d'abandon.

TakaCode peut proposer un **Build Buddy**.

Il ne doit pas nécessairement travailler sur le même projet.

Le binôme sert principalement à :

* annoncer son objectif ;
* faire un point régulier ;
* partager les blocages ;
* maintenir une forme de responsabilité mutuelle.

Fonctionnalités :

* proposition de binôme ;
* compatibilité par rythme et objectif ;
* check-in hebdomadaire ;
* changement de binôme ;
* désactivation facultative.

Le système reste volontaire.

---

# 10 — Le portfolio et les preuves d'expérience

Le portfolio doit être construit automatiquement à partir de ce que le membre fait réellement.

Il ne doit pas reposer uniquement sur des compétences déclaratives.

## Fonctionnalités

| #     | Fonctionnalité                     | Détail                                     |
| ----- | ---------------------------------- | ------------------------------------------ |
| 10.1  | Profil public                      | présente réalisations et contributions     |
| 10.2  | Page publique de projet            | objectif, étapes, livrables, résultat      |
| 10.3  | Compétences démontrées             | liées aux réalisations validées            |
| 10.4  | Rôle tenu                          | important pour les projets collectifs      |
| 10.5  | Journal transformé en étude de cas | Coach IA                                   |
| 10.6  | Preuves                            | captures, résultats, chiffres, liens       |
| 10.7  | Attestation de réalisation         | liée au projet, vérifiable                 |
| 10.8  | Contributions                      | reviews, aide, mentorat                    |
| 10.9  | Missions                           | expériences réelles clairement identifiées |
| 10.10 | Export                             | partage candidature, client, réseaux       |
| 10.11 | Lien court                         | profil partageable                         |
| 10.12 | Confidentialité                    | choisir ce qui est public ou privé         |

## Principe

> **Une compétence déclarée vaut peu. Une réalisation documentée vaut davantage.**

---

# 11 — La contribution et la réputation

TakaCode doit permettre à l'expérience de circuler dans la communauté.

Un membre ayant progressé peut commencer à aider.

## Actions valorisées

| Action                               | Valeur indicative |
| ------------------------------------ | ----------------- |
| Projet terminé                       | Forte             |
| Revue détaillée et utile             | Forte             |
| Réponse marquée comme utile          | Forte             |
| Animation de session                 | Très forte        |
| Contribution à une ressource         | Moyenne à forte   |
| Signalement d'une ressource obsolète | Moyenne           |
| Simple message communautaire         | Faible            |

La réputation ne doit pas être un simple compteur de présence.

Elle doit refléter :

> **ce que la personne a réalisé et l'aide qu'elle a réellement apportée.**

---

# 12 — Le Mentor

## Être Mentor se mérite

Un Mentor doit disposer de preuves d'expérience dans le domaine où il accompagne.

Il peut provenir :

* de la communauté ;
* de l'extérieur avec vérification.

## Fonctionnalités Mentor

* candidature ;
* domaines d'accompagnement ;
* projets terminés ;
* Builders suivis ;
* vue des blocages ;
* disponibilité ;
* sessions ;
* feedback ;
* historique ;
* réputation ;
* taux de complétion de ses Builders ;
* accès aux Missions compatibles ;
* accès à la marketplace lorsque disponible.

## Limitation de charge

Pour éviter l'épuisement :

* nombre de Builders limité ;
* priorité à l'accompagnement collectif ;
* escalade IA → Contributor → Mentor ;
* disponibilité explicitement déclarée.

---

# 13 — L'Expert

L'Expert intervient lorsque le problème dépasse le mentorat communautaire.

Il peut proposer :

* audit ;
* coaching ;
* conseil ;
* architecture ;
* revue spécialisée ;
* accompagnement ;
* intervention sur Mission.

## Fonctionnalités

* page publique ;
* domaines ;
* preuves ;
* tarifs ;
* agenda ;
* réservation ;
* paiement ;
* reviews ;
* Missions compatibles ;
* revenus ;
* facturation selon évolution du produit.

---

# 14 — Les Challenges

Les Challenges sont des projets guidés prêts à réaliser.

Ils servent notamment aux membres qui ne possèdent pas encore leur propre idée.

## Fonctionnalités

| #     | Fonctionnalité                      | Détail                               |
| ----- | ----------------------------------- | ------------------------------------ |
| 14.1  | Challenge permanent                 | réalisable à tout moment             |
| 14.2  | Challenge saisonnier                | cohorte avec dates                   |
| 14.3  | Brief                               | contexte et problème                 |
| 14.4  | Objectif                            | résultat attendu                     |
| 14.5  | Niveau                              | débutant, intermédiaire, avancé      |
| 14.6  | Durée indicative                    | aide à choisir                       |
| 14.7  | Ressources                          | sélectionnées selon les étapes       |
| 14.8  | Livrables                           | preuves attendues                    |
| 14.9  | Critères                            | visibles dès le début                |
| 14.10 | Solo / équipe                       | selon Challenge                      |
| 14.11 | Cohorte                             | participants visibles                |
| 14.12 | Check-ins                           | progression                          |
| 14.13 | Revue croisée                       | feedback                             |
| 14.14 | Demo Day                            | pour les saisons                     |
| 14.15 | Galerie                             | compare les différentes réalisations |
| 14.16 | Portfolio                           | réalisation ajoutée automatiquement  |
| 14.17 | Challenge sponsorisé                | financement / crédits / récompenses  |
| 14.18 | Challenge proposé par un partenaire | avec validation TakaCode             |

---

# 15 — Les Missions

Les Missions permettent de passer de la pratique à un besoin réel.

## Dépôt côté organisation

L'organisation ne doit pas avoir besoin de maîtriser le vocabulaire technique.

Elle décrit :

> **« Voici mon problème. »**

Le système aide à transformer cela en :

* périmètre ;
* résultats ;
* livrables ;
* compétences ;
* durée ;
* budget indicatif ;
* critères d'acceptation.

## Fonctionnalités

| #     | Fonctionnalité          | Détail                              |
| ----- | ----------------------- | ----------------------------------- |
| 15.1  | Dépôt de besoin         | langage naturel                     |
| 15.2  | Cadrage IA              | première structuration              |
| 15.3  | Validation humaine      | obligatoire avant publication       |
| 15.4  | Critères d'acceptation  | obligatoires                        |
| 15.5  | Compétences nécessaires | sert au matching                    |
| 15.6  | Responsable Mission     | obligatoire                         |
| 15.7  | Budget                  | visible selon règles                |
| 15.8  | Candidature             | simple et fondée sur le portfolio   |
| 15.9  | Matching                | recommande des profils              |
| 15.10 | Équipe                  | rôles explicites                    |
| 15.11 | Jalons                  | suivi intermédiaire                 |
| 15.12 | Livrables               | dépôt centralisé                    |
| 15.13 | Validation organisation | par rapport aux critères            |
| 15.14 | Paiement sécurisé       | lorsque infrastructure disponible   |
| 15.15 | Répartition             | équipe / Mentor / TakaCode          |
| 15.16 | Filet de sécurité       | reprise en cas d'abandon            |
| 15.17 | Évaluation croisée      | organisation ↔ équipe               |
| 15.18 | Portfolio               | expérience ajoutée aux participants |
| 15.19 | Étude de cas            | générée si autorisée                |
| 15.20 | Confidentialité         | pour les Missions non publiques     |

---

# 16 — Les organisations

L'espace organisation doit rester simple.

## Fonctionnalités

* créer un compte organisation ;
* déposer un besoin ;
* recevoir une proposition de cadrage ;
* échanger avec TakaCode ;
* valider le périmètre ;
* suivre l'équipe ;
* voir les jalons ;
* consulter les livrables ;
* valider ;
* payer ;
* noter l'expérience ;
* proposer une autre Mission.

L'organisation ne doit pas avoir à comprendre le fonctionnement interne de TakaCode.

Elle achète :

> **un résultat correctement cadré et suivi.**

---

# 17 — Les partenaires et sponsors

Les partenaires peuvent intervenir de plusieurs manières.

## Partenariat outil

Exemples :

* crédits cloud ;
* logiciel ;
* API ;
* domaine ;
* hébergement.

## Challenge sponsorisé

Le partenaire peut fournir :

* dotation ;
* prix ;
* Mentors ;
* Experts ;
* visibilité ;
* opportunités.

## Programme d'impact

Un bailleur, une fondation ou une entreprise peut financer :

> un groupe de bénéficiaires.

Exemple :

> « Accompagner 500 jeunes vers leur premier projet numérique. »

## Fonctionnalités

| #    | Fonctionnalité               | Détail                                |
| ---- | ---------------------------- | ------------------------------------- |
| 17.1 | Espace partenaire            | gestion du programme                  |
| 17.2 | Parcours / Challenge associé | programme financé                     |
| 17.3 | Crédits distribués           | suivi                                 |
| 17.4 | Bénéficiaires                | cohortes                              |
| 17.5 | Dashboard impact             | progression, complétion, réalisations |
| 17.6 | Galerie                      | projets réalisés                      |
| 17.7 | Opportunités                 | Missions, stages, emplois, prix       |
| 17.8 | Rapport                      | résultats exportables                 |

## Règles

Le sponsoring doit être :

* déclaré ;
* pertinent ;
* non bloquant ;
* transparent.

Une alternative doit rester possible lorsque le sponsor fournit un outil.

---

# 18 — Les programmes financés et l'impact

Cette fonctionnalité devient importante si TakaCode travaille avec des bailleurs, fondations ou institutions.

Un programme peut définir :

* public cible ;
* nombre de participants ;
* pays ;
* durée ;
* types de projets ;
* résultats attendus ;
* budget ;
* indicateurs.

## Indicateurs possibles

* membres onboardés ;
* personnes ayant choisi une voie ;
* projets commencés ;
* premier livrable ;
* projets terminés ;
* compétences démontrées ;
* portfolios créés ;
* Challenges réussis ;
* Missions réalisées ;
* activités lancées ;
* premiers clients déclarés ;
* emplois obtenus déclarés ;
* revenus générés lorsque mesurables.

## Principe

> **Ne jamais confondre activité et impact.**

Former 1 000 personnes n'est pas automatiquement un impact.

Il faut pouvoir montrer :

> **combien ont réellement avancé vers une réalisation et une opportunité.**

---

# 19 — Taka+

Taka+ ne doit pas bloquer la fonction fondamentale de TakaCode.

Le premium vend surtout :

> **accélération + personnalisation + puissance.**

## Fonctionnalités potentielles

* quotas Coach IA augmentés ;
* modèles IA plus performants ;
* mémoire projet avancée ;
* analyse approfondie ;
* recommandations avancées ;
* comparaison de stratégies ;
* portfolio premium ;
* analytics ;
* outils de productivité ;
* exports avancés ;
* fonctionnalités de gestion multi-projets.

Le gratuit doit néanmoins permettre :

> **de réaliser un premier projet réel.**

---

# 20 — Le système de paiement

Le système économique doit gérer quatre opérations.

> **Encaisser → Sécuriser → Répartir → Reverser**

Cela concerne notamment :

* Missions ;
* marketplace ;
* Experts ;
* Mentors ;
* prix de Challenges ;
* Taka+.

## Moyens de paiement

Priorité selon les marchés :

* Mobile Money ;
* cartes ;
* virements ;
* solutions internationales.

## Fonctionnalités

* paiement ;
* escrow ou mécanisme équivalent ;
* commissions ;
* split ;
* reversement ;
* remboursements ;
* litiges ;
* historique ;
* factures ;
* justificatifs.

---

# 21 — La faible connexion et le mobile

TakaCode doit être conçu pour fonctionner dans des contextes où :

* la connexion est instable ;
* le coût de la data est élevé ;
* l'ordinateur n'est pas toujours disponible ;
* l'électricité peut être irrégulière.

## Fonctionnalités

### Mobile first

Toutes les actions principales doivent être utilisables au téléphone :

* onboarding ;
* ressources ;
* Coach IA ;
* progression ;
* dépôt de livrable ;
* communauté.

### Pages légères

Éviter :

* vidéos automatiques ;
* médias lourds ;
* interfaces inutilement complexes.

### Mode faible connexion

* sauvegarde progressive ;
* chargement minimal ;
* reprise après coupure ;
* cache lorsque possible.

### Ressources alternatives

Lorsque possible :

> documentation texte avant vidéo lourde.

### Sauvegarde automatique

Aucune progression ne doit être perdue après une coupure.

---

# 22 — Les langues

TakaCode doit au minimum être pensé pour :

* français ;
* anglais.

Le vocabulaire doit rester simple.

Le Coach IA peut également faciliter :

* explication simplifiée ;
* traduction contextuelle ;
* reformulation.

À terme, d'autres langues locales ou internationales pourront être intégrées selon les usages réels.

---

# 23 — Les notifications et la lutte contre l'abandon

TakaCode ne doit pas envoyer des notifications simplement pour augmenter le temps passé.

Chaque notification doit favoriser une action utile.

Exemples :

> « Tu es à une étape de ton premier livrable. »

> « Tu avais bloqué sur cette tâche. Voici la plus petite action pour reprendre. »

> « Ton Build Buddy a terminé son objectif de la semaine. »

> « Une revue de ton projet est disponible. »

> « Une Mission correspond à tes réalisations. »

## Détection de décrochage

Le système doit pouvoir identifier :

* projet sans activité ;
* étape bloquée longtemps ;
* ressource commencée sans retour au projet ;
* livrable jamais terminé.

Le Coach IA peut alors proposer :

> **la plus petite action possible pour reprendre.**

---

# 24 — La mesure

## La North Star Metric

> **Nombre de membres ayant terminé une réalisation valorisable grâce à TakaCode.**

À maturité, une seconde métrique devient centrale :

> **Nombre de membres ayant transformé une réalisation en opportunité.**

## Tableau de bord

| Famille          | Indicateur                                 |
| ---------------- | ------------------------------------------ |
| Acquisition      | visiteurs                                  |
| Compréhension    | visiteur → compte                          |
| Orientation      | membres ayant choisi une voie              |
| Activation       | premier projet                             |
| Premier succès   | premier livrable                           |
| Ressources       | ressource consultée → action réalisée      |
| Complétion       | projets terminés                           |
| Abandon          | motifs                                     |
| Blocage          | temps moyen bloqué                         |
| IA               | blocages résolus par Coach                 |
| Humain           | escalades vers communauté / Mentor         |
| Contribution     | reviews et réponses utiles                 |
| Portfolio        | profils avec réalisations                  |
| Challenges       | participation / complétion                 |
| Missions         | publiées / attribuées / livrées            |
| Qualité          | satisfaction organisation                  |
| Revenus membres  | montants reversés                          |
| Opportunités     | emploi, mission, client, activité déclarés |
| Impact programme | progression des cohortes financées         |

---

# 25 — Les métriques à ne pas idolâtrer

Ces chiffres peuvent être utiles mais ne doivent pas diriger seuls le produit :

* inscriptions ;
* pages vues ;
* temps passé ;
* messages envoyés au Coach ;
* vidéos regardées ;
* ressources enregistrées ;
* points.

Une personne qui passe cinquante heures sur TakaCode sans rien réaliser n'est pas nécessairement une réussite.

---

# 26 — Les principaux risques produit

## Risque : devenir une plateforme de cours

### Réponse

Ressources externes par défaut.

---

## Risque : devenir un catalogue de liens

### Réponse

Chaque ressource est liée à :

> action + livrable.

---

## Risque : les membres consomment mais ne construisent pas

### Réponse

Toujours ramener à :

> **« Quelle est ta prochaine action ? »**

---

## Risque : trop d'abandons

### Réponse

* micro-objectifs ;
* Build Buddy ;
* Coach IA ;
* déblocage ;
* notifications utiles ;
* reprise simplifiée.

---

## Risque : IA = illusion de compétence

### Réponse

* explications ;
* questions ;
* modifications ;
* démonstrations ;
* validation contextualisée.

---

## Risque : Mentor surchargé

### Réponse

> **IA → communauté → Contributor → Mentor → Expert**

---

## Risque : Missions de mauvaise qualité

### Réponse

* sélection ;
* Mentor responsable ;
* jalons ;
* critères d'acceptation ;
* revue.

---

## Risque : marketplace sans activité

### Réponse

Commencer manuellement.

---

## Risque : ressources obsolètes

### Réponse

* dates de vérification ;
* signalements ;
* alternatives ;
* maintenance.

---

# 27 — Priorisation produit

TakaCode ne doit pas construire toutes ces fonctionnalités simultanément.

## J1 — Positionnement et onboarding

Construire :

* nouveau message ;
* onboarding ;
* orientation initiale ;
* clarification BUILD / CHALLENGES / MISSIONS ;
* Coach IA contextuel minimal.

### Critère de sortie

Un nouveau membre comprend :

> **où commencer.**

---

## J2 — Système de projet généralisé

Construire :

* types de projet ;
* framework ;
* plan ;
* étapes ;
* tâches ;
* livrables ;
* critères ;
* progression.

### Critère de sortie

Une activité freelance ou une chaîne YouTube peut être accompagnée avec la même rigueur qu'un SaaS.

---

## J3 — Moteur de ressources

Construire :

* bibliothèque ;
* ressources liées aux étapes ;
* alternatives ;
* niveaux ;
* langues ;
* vérification ;
* signalements.

### Critère de sortie

Un parcours complet peut fonctionner **sans créer une formation TakaCode complète**.

---

## J4 — Coach IA

Renforcer :

* contexte ;
* ressources ;
* déblocage ;
* feedback ;
* décrochage ;
* compréhension.

### Critère de sortie

Le Coach aide réellement à avancer sans devenir un générateur de livrables à copier.

---

## J5 — Portfolio et preuve d'expérience

Construire :

* profil ;
* projets publics ;
* preuves ;
* compétences ;
* études de cas ;
* exports.

### Critère de sortie

Un membre peut partager son profil avec un client ou un recruteur.

---

## J6 — Communauté et mentorat

Construire :

* reviews ;
* bouton bloqué ;
* Contributors ;
* Mentors ;
* sessions ;
* Build Buddy.

### Critère de sortie

L'accompagnement augmente réellement le taux de complétion.

---

## J7 — Challenges

Construire :

* briefs ;
* niveaux ;
* cohortes ;
* livrables ;
* galerie ;
* Demo Day.

### Critère de sortie

Plusieurs membres terminent un même Challenge avec des réalisations différentes.

---

## J8 — Missions manuelles

Pas de gros développement.

Vendre et gérer :

> **5 à 10 Missions réelles.**

### Critère de sortie

Des organisations paient et les livrables sont acceptés.

---

## J9 — Missions intégrées

Construire :

* espace organisation ;
* candidatures ;
* matching ;
* équipe ;
* suivi ;
* validation.

### Critère de sortie

Une Mission peut être pilotée dans TakaCode.

---

## J10 — Économie

Construire progressivement :

* paiements ;
* Mobile Money ;
* reversements ;
* Taka+ ;
* sessions Experts ;
* commissions.

### Critère de sortie

TakaCode sait :

> **encaisser → sécuriser → répartir → reverser.**

---

## J11 — Partenaires et programmes d'impact

Construire :

* espaces partenaires ;
* cohortes ;
* sponsoring ;
* dashboards d'impact ;
* rapports.

### Critère de sortie

Une organisation peut financer un groupe et mesurer les réalisations produites.

---

# 28 — Le test ultime d'une fonctionnalité

Avant de développer une fonctionnalité, poser cette question :

> **Est-ce qu'elle augmente la probabilité qu'une personne trouve une direction, réalise quelque chose de concret ou transforme cette réalisation en opportunité ?**

Si la réponse est non :

> **elle n'est probablement pas prioritaire.**

Une autre question doit accompagner la première :

> **Est-ce qu'une ressource, l'IA, la communauté ou un processus manuel peut résoudre le problème avant que nous développions une nouvelle fonctionnalité ?**

TakaCode ne doit pas seulement éviter de recréer les formations existantes.

Il doit aussi éviter de recréer inutilement des outils qui existent déjà.

---

# En résumé

L'expérience TakaCode doit pouvoir ressembler à ceci :

> **Je ne sais pas quoi faire.**

↓

TakaCode m'aide à trouver une direction.

↓

> **Je choisis quelque chose à construire.**

↓

Le projet est transformé en étapes.

↓

> **Je découvre ce dont j'ai besoin pour avancer.**

↓

TakaCode me propose une ressource pertinente.

↓

> **J'apprends juste ce dont j'ai besoin maintenant.**

↓

Je l'applique immédiatement.

↓

> **Je suis bloqué.**

↓

Le Coach IA m'aide.

Si nécessaire :

↓

la communauté, un Contributor, un Mentor ou un Expert intervient.

↓

> **Je termine.**

↓

Mon projet devient une preuve d'expérience.

↓

> **Je peux le montrer.**

↓

Je peux ensuite :

* lancer mon activité ;
* obtenir un client ;
* candidater ;
* participer à une Mission ;
* entreprendre ;
* aider d'autres membres.

Et progressivement :

> **celui qui avait besoin d'aide peut devenir celui qui aide.**

# **C'est cette boucle que les fonctionnalités de TakaCode doivent servir.**
