# Les fonctionnalités

> Catalogue de ce que TakaCode doit offrir, et à qui. Chaque fonctionnalité est rattachée
> à un jalon du **§07 de [VISION.md](VISION.md)**.
>
> Le système de projet est défini dans [SYSTEME_PROJET.md](SYSTEME_PROJET.md). Les
> mécanismes empruntés ailleurs sont justifiés dans [BENCHMARK.md](BENCHMARK.md). La
> traduction technique est dans [ROADMAP_REPOSITIONNEMENT.md](ROADMAP_REPOSITIONNEMENT.md).
>
> Écrit le 19 août 2026.

---

## 1. Les parties prenantes

Sept acteurs. Chacun vient chercher quelque chose de différent, et chacun doit avoir de
quoi rester.

| Acteur | Ce qu'il vient chercher | Ce qu'il apporte | Ce qui le fait partir |
| --- | --- | --- | --- |
| **Visiteur** | comprendre si c'est pour lui | rien encore | ne pas comprendre en 10 secondes |
| **Membre** | démarrer quelque chose | de l'attention | ne pas savoir par où commencer |
| **Builder** | terminer son projet | des projets, de l'activité | rester bloqué sans aide |
| **Contributor** | progresser en aidant | des relectures, des réponses | ne pas être reconnu |
| **Mentor** | transmettre, se faire un nom | de la qualité, du taux de complétion | s'épuiser sans contrepartie |
| **Expert** | des revenus, de la visibilité | de la crédibilité, l'encadrement des Missions | pas assez de demande |
| **Organisation** | un livrable à coût accessible | de l'argent, de vrais besoins | ne pas être livrée |
| **Sponsor** | des développeurs qui utilisent son outil | de l'argent, des crédits | une audience trop petite ou pas mesurée |

> **Le staff TakaCode n'est pas un acteur du produit**, c'est un rôle d'administration :
> valider les Mentors, cadrer les Missions, arbitrer les litiges, publier les Challenges.

### Ce que chaque acteur doit avoir dans le produit

**Visiteur** — page d'accueil qui montre des projets réels terminés, pas des promesses ·
compteur public de projets livrés · exploration des projets publiés sans compte · exemples
par type de projet, pas seulement du code.

**Membre** — création de projet en moins de 3 minutes · un « je ne sais pas quoi faire »
qui mène aux Challenges · un premier livrable atteignable dans la première session.

**Builder** — son plan de projet · le coach IA qui connaît son type de projet · les modèles
et kits · le journal de bord · le bouton « je suis bloqué » · la publication en un clic.

**Contributor** — file des projets à relire · grille de relecture fournie · compteur de
relectures utiles · progression visible vers le statut Mentor.

**Mentor** — candidature sur un parcours qu'il a terminé · ses Builders accompagnés ·
créneaux de sessions · statistiques de son impact (taux de complétion de ses Builders) ·
accès à la marketplace quand elle ouvre.

**Expert** — sa page publique · ses offres et ses prix · son agenda · ses revenus · les
Missions où il peut se porter responsable.

**Organisation** — dépôt de besoin en langage courant · aide au cadrage · vue de
l'avancement · validation des livrables · facture.

**Sponsor** — page de son parcours sponsorisé · statistiques d'usage · distribution de
crédits aux Builders · retour sur les projets construits avec son outil.

---

## 2. Le socle : projet, parcours, livrables

*Jalons J1 à J3.*

| # | Fonctionnalité | Ce que ça fait | Jalon |
| --- | --- | --- | --- |
| 2.1 | Types de projet | 8 types minimum, au-delà du logiciel | J2 |
| 2.2 | Frameworks de projet | la suite de phases par type | J2 |
| 2.3 | Génération du plan | le coach transforme un objectif en plan d'étapes | J1 |
| 2.4 | Plan modifiable | retirer, ajouter, réordonner une étape | J2 |
| 2.5 | Livrables typés | fin de `repo_url` / `live_url` — voir §6 du système de projet | J2 |
| 2.6 | Grille de validation visible | les critères sont affichés **avant** de commencer | J2 |
| 2.7 | Bibliothèque de modèles | les documents à remplir, par phase | J2 |
| 2.8 | Bibliothèque de kits de démarrage | déployables en moins de 30 minutes | J2 |
| 2.9 | Journal de bord | trace datée des décisions et blocages | J3 |
| 2.10 | Preuves | captures, chiffres, témoignages | J3 |
| 2.11 | Une seule barre de progression | parcours et projet ne font qu'un | J2 |
| 2.12 | Recalcul du plan | le projet change de direction sans repartir de zéro | J2 |
| 2.13 | Question à l'abandon | « qu'est-ce qui t'a bloqué ? » — la donnée la plus utile qu'on puisse collecter | J3 |

---

## 3. Le portfolio, ou preuve d'expérience

*Jalon J3.*

| # | Fonctionnalité | Détail |
| --- | --- | --- |
| 3.1 | Page publique de projet | objectif, plan suivi, livrables, preuves, journal de bord, rôle tenu |
| 3.2 | Profil public | tous les projets terminés, les domaines couverts, les validations obtenues |
| 3.3 | Attestation à la livraison | délivrée au projet terminé, vérifiable par un lien, pas un PDF |
| 3.4 | Étude de cas générée | le coach transforme le journal de bord en récit structuré : contexte, décisions, obstacles, résultat |
| 3.5 | Export | version imprimable, aperçu correct sur les réseaux, lien court |
| 3.6 | Compétences prouvées | déduites des livrables validés, pas déclarées par le Builder |
| 3.7 | Rôle tenu par projet | indispensable dès les projets à plusieurs |

> **3.4 est sous-estimé.** La plupart des Builders savent construire mais ne savent pas
> raconter. Transformer automatiquement leur journal de bord en étude de cas, c'est leur
> donner ce qui fait la différence en entretien — et c'est un usage évident du coach IA.

---

## 4. L'accompagnement et les sessions de déblocage

*Jalon J4. C'est ce qui fait monter le taux de projets terminés — donc ce qui fait tourner
la boucle du §05 de la vision.*

### 4.1 — Le bouton « je suis bloqué »
Présent sur chaque étape. Il ouvre un seul choix simple :

| Choix | Réponse attendue | Qui répond |
| --- | --- | --- |
| Demander au coach | immédiate | IA |
| Demander à la communauté | quelques heures | Contributors |
| M'inscrire à la prochaine session | jours fixes | Mentor |
| Demander une revue | 48 h | pairs + Mentor |
| Réserver un accompagnement | payant, quand la marketplace existe | Expert |

### 4.2 — Les cinq formats de session

| Format | Origine | Comment ça marche | Rythme |
| --- | --- | --- | --- |
| **Session de déblocage** | ALX (journée de pairs) | 10 Builders maximum, chacun expose son blocage en 3 minutes, le groupe cherche | hebdomadaire, par type de projet |
| **Session de construction** | buildspace | 2 h de travail en parallèle, caméra ouverte, on annonce ce qu'on va faire au début et ce qu'on a fait à la fin | 2 fois par semaine |
| **Séance de critique** | buildspace (*roast*) | on montre son travail **non terminé**, le groupe démonte. Volontaire, cadré, jamais imposé | toutes les 2 semaines |
| **Revue croisée** | Frontend Mentor | chacun relit le livrable d'un autre contre la grille écrite | à chaque livrable soumis |
| **Demo day** | buildspace | fin de saison de Challenge, chacun montre ce qu'il a livré | fin de chaque saison |

> **La séance de critique est la plus rentable et la plus négligée.** Montrer un travail non
> fini tôt évite des semaines dans la mauvaise direction. Elle demande une règle explicite :
> on critique le travail, jamais la personne, et on propose une correction avec chaque
> critique.

### 4.3 — Le binôme
*Emprunté à Microverse.* À l'entrée d'un Challenge, proposition d'un binôme sur le même
type de projet. Deux personnes qui se doivent un point hebdomadaire terminent beaucoup plus
souvent que deux personnes seules.

### 4.4 — Le mentorat
- Candidature possible **uniquement sur un parcours qu'on a soi-même terminé** (§04 de la
  vision).
- Un Mentor voit ses Builders, leurs blocages, leur avancement.
- Il dispose d'une **statistique de son impact** : taux de complétion de ses Builders.
  C'est ce qui fondera plus tard son prix sur la marketplace.
- Vérification possible d'un professionnel extérieur : parcours contrôlé par le staff.

### 4.5 — La reconnaissance de la contribution
Ce qui compte pour devenir Contributor puis Mentor, mesuré automatiquement :

| Action | Ce qu'elle vaut |
| --- | --- |
| Relecture avec commentaires exploitables | forte |
| Réponse marquée utile par le Builder bloqué | forte |
| Animation d'une session | très forte |
| Projet terminé et publié | forte |
| Simple message dans la communauté | faible |

---

## 5. Les Challenges

*Jalon J5. Format emprunté à buildspace : ce qui fait terminer, c'est la date et le public.*

| # | Fonctionnalité | Détail |
| --- | --- | --- |
| 5.1 | Le Challenge est une **saison datée** | date d'ouverture, date de demo day. Pas un exercice permanent |
| 5.2 | Brief complet | objectif, contexte, contraintes, livrables attendus, durée, critères d'évaluation |
| 5.3 | Niveau annoncé | débutant, intermédiaire, avancé. Évite l'abandon par mauvais calibrage |
| 5.4 | Solo ou équipe | avec `project_members` et un rôle par personne |
| 5.5 | Cohorte visible | on voit qui d'autre participe, et où ils en sont |
| 5.6 | Points d'étape hebdomadaires | session de construction dédiée à la cohorte |
| 5.7 | Demo day | chacun montre. Enregistré, republié |
| 5.8 | Galerie des réalisations | toutes les réponses au même brief, côte à côte |
| 5.9 | Un Challenge crée un projet normal | portfolio, relectures et classement fonctionnent sans rien changer |
| 5.10 | Challenge sponsorisé | une entreprise finance le Challenge et dote les prix. Voir §7 |

> **5.8 vaut plus qu'il n'en a l'air.** Voir dix réponses différentes au même brief est
> l'une des formes d'apprentissage les plus efficaces qui soient — et c'est ce qui permet
> ensuite de sélectionner objectivement pour une Mission.

---

## 6. Les Missions

*Jalons J6 (à la main) puis J7 (dans le produit). Circuit emprunté à Gitcoin.*

| # | Fonctionnalité | Détail |
| --- | --- | --- |
| 6.1 | Dépôt de besoin | l'organisation écrit en langage courant. Aucun formulaire technique |
| 6.2 | Cadrage assisté | le coach transforme le besoin en périmètre, livrables, budget indicatif |
| 6.3 | Validation humaine du cadrage | un membre du staff ou un Expert valide avant publication |
| 6.4 | **Critères d'acceptation écrits** | obligatoires avant publication. C'est ce qui évite le litige |
| 6.5 | Responsable de mission désigné | obligatoire à la création. Répond au risque n°2 de la vision |
| 6.6 | Candidature simple | le portfolio sélectionne, pas un dossier. Emprunté à Gitcoin |
| 6.7 | Constitution d'équipe | rôles explicites, avec `project_members` |
| 6.8 | Suivi côté organisation | avancement, livrables déposés, échanges |
| 6.9 | Validation des livrables | contre les critères écrits, par l'organisation |
| 6.10 | Fonds bloqués | à l'acceptation, libérés à la validation |
| 6.11 | Répartition automatique | équipe, responsable, plateforme (§06 de la vision) |
| 6.12 | Filet de sécurité | procédure prévue si l'équipe abandonne : reprise par le responsable |
| 6.13 | Attestation de mission | le livrable réel entre au portfolio des participants |
| 6.14 | Évaluation croisée | l'organisation note l'équipe, l'équipe note l'organisation |

---

## 7. Le sponsoring

*§06.5 de la vision. Cadre emprunté à DEV et daily.dev, dont la règle des 70 %.*

### 7.1 — Les quatre formes

| Forme | Ce que le sponsor obtient | Ce que les Builders obtiennent |
| --- | --- | --- |
| **Parcours sponsorisé** | son outil utilisé pour de vrai dans un parcours pertinent | des crédits, un kit de démarrage prêt, une documentation adaptée |
| **Challenge sponsorisé** | des dizaines de projets construits avec son outil, une galerie publique | une dotation, des prix, une visibilité |
| **Kit de démarrage sponsorisé** | son outil comme point de départ par défaut d'un type de projet | un démarrage plus rapide |
| **Prix et bourses** | association à des réussites concrètes | de l'argent, du matériel, de l'accès |

### 7.2 — Les règles non négociables

1. **La règle des 70 %.** Au moins 70 % de ce que paie un sponsor revient aux Builders :
   crédits, prix, kits, ressources. C'est ce qui donne une forme mesurable au principe
   « une présence pertinente, pas une recommandation artificielle ».
2. **Pertinence obligatoire.** Si l'outil n'est pas le bon pour ce type de projet, on ne le
   place pas, même payé. Un hébergeur n'a rien à faire dans un parcours podcast.
3. **Sponsoring déclaré.** Une mention visible sur chaque parcours ou Challenge sponsorisé.
4. **Alternative toujours disponible.** Le Builder peut faire le parcours avec un autre
   outil sans être bloqué.

### 7.3 — Ce qu'il faut pouvoir montrer à un sponsor

| Indicateur | Pourquoi il le demande |
| --- | --- |
| Builders actifs sur le parcours | taille de l'audience touchée |
| Projets terminés avec l'outil | preuve d'usage réel, pas de simple exposition |
| Crédits distribués et consommés | mesure de l'activation |
| Comptes créés chez le sponsor | conversion |
| Galerie publique des projets | vitrine réutilisable par le sponsor |

---

## 8. Le coach IA

*Transversal, cœur de J1.*

| # | Fonctionnalité | Détail |
| --- | --- | --- |
| 8.1 | Connaît le type de projet | change complètement sa façon d'aider |
| 8.2 | Transforme un objectif en plan | objectif → étapes → tâches → ressources → livrables |
| 8.3 | Lit les documents joints | déjà corrigé : PDF, Word, texte |
| 8.4 | Relit un livrable contre la grille | premier filtre immédiat, avant les pairs |
| 8.5 | Débloque | pose des questions avant de répondre, ne fait pas le travail à la place |
| 8.6 | Rédige l'étude de cas | à partir du journal de bord |
| 8.7 | Aide l'organisation à cadrer | besoin flou → périmètre, livrables, critères |
| 8.8 | Recommande au bon moment | un outil quand le besoin apparaît réellement dans le projet |
| 8.9 | Détecte le décrochage | 14 jours sans activité → relance avec la plus petite action possible |

> **8.5 est une règle, pas une option.** Un coach qui produit le livrable à la place du
> Builder détruit exactement ce que TakaCode vend : la preuve que la personne sait faire.

---

## 9. Ce qui se mesure

Tableau de bord interne, aligné sur le §05 de la vision.

| Famille | Indicateur | Pourquoi |
| --- | --- | --- |
| Découverte | visiteurs → comptes créés | le message passe-t-il ? |
| Démarrage | comptes → projets créés | l'entrée est-elle claire ? |
| Premier pas | projets avec un premier livrable en 7 jours | le meilleur signal précoce de complétion |
| **Complétion** | **taux de projets terminés** | **le moteur** |
| Blocage | temps moyen passé bloqué sur une étape | ce qu'il faut réduire |
| Abandon | motifs déclarés à l'abandon | ce qu'il faut corriger |
| Accompagnement | complétion avec mentor vs sans mentor | prouve la valeur du mentorat |
| Contribution | relectures et réponses utiles par semaine | santé de la communauté |
| Demande | missions publiées, livrées, satisfaction | validation du modèle |
| Revenus des membres | argent réellement reversé | l'impact réel |
| Opportunités | emplois, missions, activités lancées | la promesse tenue |

---

## 10. Le contexte d'usage, qu'on ne peut pas ignorer

Le public visé est majoritairement en Afrique de l'Ouest et centrale. Trois contraintes
matérielles qui décident du taux de complétion autant que la pédagogie.

| Contrainte | Ce qu'il faut prévoir |
| --- | --- |
| Connexion coûteuse et instable | pages légères, pas de vidéo obligatoire, ressources téléchargeables pour usage hors ligne |
| Mobile d'abord | tout le parcours doit être utilisable au téléphone, y compris déposer un livrable |
| Paiement | Mobile Money en encaissement **et** en reversement, avant toute autre méthode |
| Électricité | reprise là où on s'était arrêté, sauvegarde automatique, rien qui exige une session continue |
| Langue | français et anglais, avec un vocabulaire simple |

---

## 11. Récapitulatif par jalon

| Jalon | Fonctionnalités | Critère de sortie (vision) |
| --- | --- | --- |
| **J1** | 2.3 · 8.1 · 8.2 · 8.8 · textes du site | un visiteur comprend que ce n'est pas réservé à l'informatique |
| **J2** | 2.1 · 2.2 · 2.4 à 2.8 · 2.11 · 2.12 | une chaîne YouTube est aussi bien accompagnée qu'une application |
| **J3** | 2.9 · 2.10 · 2.13 · 3.1 à 3.7 · 8.6 | un profil suffit pour candidater |
| **J4** | 4.1 à 4.5 · 8.5 · 8.9 | des mentors font monter le taux de complétion |
| **J5** | 5.1 à 5.9 | plusieurs membres terminent le même Challenge |
| **J6** | aucune — vente manuelle | des entreprises ont payé |
| **J7** | 6.1 à 6.14 · 8.7 | une mission se gère sans intervention manuelle |
| **J8** | paiements · 5.10 · 7.1 à 7.3 · Taka+ · marketplace | on sait encaisser **et** reverser |
