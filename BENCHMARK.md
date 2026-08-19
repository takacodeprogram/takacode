# Ce qui se fait ailleurs, et ce qu'on en prend

> Document de veille. Il sert à une chose : ne pas réinventer des mécanismes qui
> fonctionnent déjà ailleurs, et ne pas copier ceux qui ont échoué.
>
> Rattaché à [VISION.md](VISION.md). Les mécanismes retenus sont repris dans
> [SYSTEME_PROJET.md](SYSTEME_PROJET.md) et [FONCTIONNALITES.md](FONCTIONNALITES.md).
>
> Recherche effectuée le 19 août 2026. Sources en fin de document.

---

## Résumé en une page

| Plateforme | Le mécanisme qui marche | On le prend ? |
| --- | --- | --- |
| **ALX Africa** | Pas de cours magistral. On donne un brief de projet, des ressources, et on laisse chercher. Journée d'apprentissage entre pairs en groupe de 10. Hubs physiques avec électricité et internet. | **Oui** — le brief plutôt que le cours, et la session de pairs. Pas les hubs (trop capitalistique). |
| **Metaschool** | On ne finit pas un cours, on *ship* un projet. 40 000 projets livrés, NFT/attestation à la livraison, points et niveaux. | **Oui** — la livraison comme unité, pas la leçon. L'attestation à la livraison. |
| **buildspace (Nights & Weekends)** | 6 semaines, une cohorte, n'importe quel type de projet (logiciel, art, matériel), check-in hebdomadaire, *roast* public, demo day final. Le programme est une **contrainte de temps**, pas un contenu. | **Oui, fortement** — c'est le modèle des Challenges. Le roast et le demo day surtout. |
| **Frontend Mentor** | Chaque soumission reçoit une revue IA ligne par ligne (bonnes pratiques, architecture, accessibilité, tests, qualité du README et des commits) **plus** une étape de revue par les pairs, présentée comme un moyen de progresser soi-même. | **Oui** — la double validation IA + pairs existe déjà chez nous, l'étape « relire les autres » est à ajouter. |
| **Microverse** | Chaque apprenant a un binôme de pair programming, une équipe de stand-up quotidien, un mentor et des relecteurs. Structure sociale obligatoire. | **En partie** — le binôme et le stand-up, oui. La contrainte quotidienne, non : nos Builders ne sont pas à plein temps. |
| **AltSchool Africa / Decagon** | Paiement différé ou part du salaire après embauche. AltSchool : 30 $/mois, ou 290 $ d'un coup, ou 500 $ après l'emploi. | **Non pour le modèle de paiement** (ça engage TakaCode sur le placement). **Oui pour le repère de prix** : c'est le niveau que le marché accepte. |
| **Gitcoin / Topcoder** | Une prime est postée, quelqu'un la réclame, un relecteur évalue contre des **critères d'acceptation écrits**, puis les fonds bloqués sont libérés. | **Oui** — c'est exactement le circuit des Missions : critères écrits d'abord, fonds bloqués, validation avant libération. |
| **DEV / daily.dev** | Une entreprise sponsorise une *learning track* entière autour de son outil. Recommandation : au moins 70 % du budget sponsor va vers du non-promotionnel (primes, crédits, contenu utile). | **Oui** — c'est le modèle des parcours sponsorisés, avec la règle des 70 % comme garde-fou. |

---

## 1. ALX Africa — le brief remplace le cours

**Ce qu'ils font.** Programme gratuit de 12 mois, construit sur le curriculum Holberton.
Il n'y a pas de cours magistral : l'apprenant reçoit un brief de projet, on lui indique où
chercher, et il doit s'en sortir. Une fois par semaine, une **journée d'apprentissage entre
pairs** réunit une dizaine de personnes qui s'entraident sur les tâches de la semaine.
Des hubs physiques fournissent électricité et connexion, ce qui répond à un vrai obstacle
matériel sur le continent.

**Ce qu'on prend.**

1. **Le brief plutôt que le cours.** Une leçon TakaCode ne doit pas expliquer une notion en
   vidéo puis proposer un exercice. Elle doit poser un livrable attendu, donner les
   ressources pour y arriver, et laisser chercher. C'est déjà l'esprit des micro-projets,
   il faut l'assumer complètement.
2. **La session de pairs en petit groupe.** Dix Builders, un créneau, les blocages de la
   semaine. Ça devient chez nous la **session de déblocage** (voir
   [FONCTIONNALITES.md](FONCTIONNALITES.md)).

**Ce qu'on ne prend pas.** Les hubs physiques : c'est un coût fixe énorme, et ce n'est pas
notre métier. En revanche l'obstacle est réel — d'où le mode faible connexion et le
téléchargement des ressources pour usage hors ligne.

**Ce qu'on fait mieux.** ALX forme des ingénieurs logiciels. Nous acceptons tout type de
projet, et nous allons jusqu'à la mission payée.

---

## 2. Metaschool — livrer, pas terminer

**Ce qu'ils font.** Plateforme d'apprentissage par projets web3 et IA. L'unité n'est pas la
leçon mais le projet livré : plus de 40 000 projets *shipped*, 150 000 développeurs, une
attestation on-chain à la livraison, des points, des niveaux, parfois des récompenses.

**Ce qu'on prend.**

1. **Le compteur de projets livrés comme métrique publique.** La vision dit que le vrai
   moteur est le taux de projets menés jusqu'au bout — alors ça doit être le chiffre affiché
   en page d'accueil, pas le nombre d'inscrits.
2. **Une attestation au moment de la livraison**, pas à la fin d'un cours. Une preuve
   vérifiable, rattachée au livrable, partageable.

**Ce qu'on ne prend pas.** La dépendance à un écosystème unique (web3). Et la
gamification par points seule : elle fait revenir, elle ne fait pas terminer.

---

## 3. buildspace — le temps comme contrainte

**Ce qu'ils font.** *Nights & Weekends* : six semaines, une centaine de personnes, chacune
avec son idée. Un point hebdomadaire, une séance publique où le projet se fait critiquer
(*roast*), et un demo day à la fin. N'importe quel type de projet est accepté : logiciel,
IA, mais aussi un vélo qui produit de l'électricité, de la musique ou un film. Le programme
ne fournit presque pas de contenu — il fournit une **contrainte de temps et un public**.

**Ce qu'on prend, et c'est le plus important de ce document.**

1. **Le Challenge n'est pas un exercice, c'est une saison.** Date de début, date de fin,
   cohorte, demo day. Ce qui fait terminer un projet, ce n'est pas la pédagogie, c'est la
   date et le fait que quelqu'un regarde.
2. **La séance de critique publique.** Montrer son travail non fini à des pairs qui le
   démontent, tôt. C'est inconfortable et c'est ce qui évite six mois de travail dans le
   vide.
3. **L'ouverture à tout type de projet** — validation directe du §02 de la vision.

**Le signal négatif.** buildspace a levé beaucoup, puis a arrêté. La leçon : une communauté
de builders motivés, sans mécanisme économique, ne se finance pas toute seule. D'où le fait
que chez nous les Challenges mènent aux Missions, qui elles paient.

---

## 4. Frontend Mentor — la revue comme produit

**Ce qu'ils font.** 130 projets réels sur cinq niveaux de difficulté. Chaque solution
soumise reçoit une **revue automatique ligne par ligne** : bonnes pratiques, architecture,
accessibilité, tests, organisation des fichiers, qualité des commits, qualité du README.
Et une **étape de revue par les pairs** est intégrée au parcours, présentée ainsi : relire
le travail des autres est un moyen puissant de progresser soi-même.

**Ce qu'on prend.**

1. **La grille de revue explicite.** Notre revue IA existe déjà, mais elle doit évaluer
   contre des critères écrits et visibles, connus du Builder **avant** qu'il commence.
2. **Relire est une contribution qui compte.** C'est le mécanisme qui alimente le statut
   Contributor du §04 de la vision : on devient Contributor en relisant, et le système le
   voit.
3. **Les niveaux de difficulté.** Un Challenge doit annoncer son niveau, sinon les
   débutants s'attaquent au mauvais projet et abandonnent.

---

## 5. Microverse — la structure sociale obligatoire

**Ce qu'ils font.** Chaque apprenant a un binôme de programmation, une équipe de stand-up,
un mentor et des relecteurs. Personne n'apprend seul, par construction.

**Ce qu'on prend.** Le **binôme** et le **point d'équipe régulier**. Le premier facteur
d'abandon d'un projet personnel, c'est d'être seul dessus.

**Ce qu'on ne prend pas.** Le rythme quotidien à plein temps. Nos Builders construisent à
côté d'un travail ou d'études — c'est justement pour ça que le modèle buildspace
(« nuits et week-ends ») nous correspond mieux.

---

## 6. AltSchool Africa, Decagon, Semicolon — le repère de prix

**Ce qu'ils font.** Formation en ingénierie logicielle, en ligne, avec paiement différé ou
part de salaire après embauche. AltSchool affiche 30 $/mois, 80 $/trimestre, 290 $ d'un
coup, ou 500 $ payables après l'obtention d'un emploi.

**Ce qu'on prend.** Uniquement le **repère de prix**. Un abonnement de 3 000 à 5 000 FCFA
par mois (soit environ 5 à 8 $) est en dessous de ce que ce marché accepte déjà — Taka+ est
donc positionné prudemment, ce qui est le bon choix pour une formule optionnelle.

**Ce qu'on ne prend surtout pas : le paiement après embauche.** Ce modèle engage la
plateforme sur le placement en emploi. Il oblige à sélectionner à l'entrée, à orienter vers
les métiers qui recrutent, et il transforme le projet de l'apprenant en variable
d'ajustement. Il est en contradiction directe avec le §02 de la vision — impossible de
promettre un emploi à quelqu'un qui lance un podcast.

---

## 7. Gitcoin et Topcoder — le circuit des primes

**Ce qu'ils font.** Une prime est publiée avec des **critères d'acceptation écrits**. Un
contributeur la réclame et exécute. Un relecteur évalue contre ces critères. Les fonds,
bloqués depuis le début, ne sont libérés qu'après acceptation.

**Ce qu'on prend, et c'est directement applicable aux Missions.**

1. **Les critères d'acceptation s'écrivent avant, pas après.** C'est ce qui protège les
   deux parties et évite le litige. Une Mission sans critères écrits ne doit pas pouvoir
   être publiée.
2. **Les fonds sont bloqués dès l'acceptation de la mission**, libérés à la validation.
   Le §08 risque n°4 de la vision décrit exactement ce circuit : encaisser → sécuriser →
   répartir → reverser.
3. **Une barrière d'entrée basse côté contributeur.** Gitcoin n'impose pas un long dossier
   de candidature. Candidater à une Mission doit rester simple : c'est le portfolio qui
   sélectionne, pas un formulaire.

---

## 8. DEV, daily.dev — comment se vend un parcours sponsorisé

**Ce qu'ils font.** Une entreprise finance une *learning track* complète construite autour
de son outil : des tutoriels concrets où l'outil est utilisé pour de vrai. Les guides du
secteur recommandent qu'**au moins 70 % du budget d'un sponsor aille vers du
non-promotionnel** — primes, crédits gratuits, contenu réellement utile — et constatent un
engagement 2,5 fois supérieur quand c'est le cas.

**Ce qu'on prend.**

1. **La règle des 70 %.** Elle donne une forme concrète au principe du §06 de la vision
   (« le sponsor finance une présence pertinente, pas une recommandation artificielle ») :
   au moins 70 % de ce que paie un sponsor doit revenir aux Builders sous forme de crédits,
   de primes ou de ressources.
2. **Les repères de prix.** Contenu sponsorisé : 500 à 2 000 $ la pièce pour une audience
   de 5 000 personnes. Programmes d'ambassadeurs : 500 à 3 000 $ par mois. C'est l'ordre de
   grandeur à viser pour un parcours sponsorisé, pas 50 $.

---

## 9. Ce que personne ne fait, et qui est notre place

Le benchmark fait apparaître trois trous.

**Trou n°1 — tout le monde s'arrête au logiciel.**
ALX, Microverse, Frontend Mentor, Boot.dev, Odin, Exercism : ingénierie logicielle. Seul
buildspace acceptait tout type de projet, et buildspace n'existe plus. **Personne
n'accompagne aujourd'hui quelqu'un qui veut lancer une chaîne YouTube, une formation en
ligne ou une activité freelance avec la même rigueur qu'un projet logiciel.**

**Trou n°2 — le portfolio n'est jamais relié à une demande réelle.**
Frontend Mentor a un portail de recrutement, Gitcoin a des primes, mais aucune plateforme
ne fait le trajet complet : j'apprends ici, je construis ici, je prouve ici, et une
entreprise me confie une mission payée ici. C'est le §03 de la vision, et c'est la partie
la plus difficile à copier parce qu'elle demande de vendre à des entreprises, pas seulement
de faire un produit.

**Trou n°3 — les mentors sont soit salariés, soit absents.**
Microverse et Decagon paient des mentors, ce qui plafonne leur croissance. Odin et Exercism
reposent sur du bénévolat pur, qui s'épuise. Le modèle du §04 — statut mérité d'abord, puis
marché d'expertise avec commission — est un troisième chemin que peu tentent.

---

## 10. La liste des mécanismes retenus

À reprendre tels quels dans les fonctionnalités :

| # | Mécanisme | Origine | Où ça atterrit |
| --- | --- | --- | --- |
| 1 | Le brief à la place du cours | ALX | Parcours, leçons |
| 2 | Session de pairs en petit groupe | ALX | Sessions de déblocage |
| 3 | Compteur public de projets livrés | Metaschool | Page d'accueil, profil |
| 4 | Attestation à la livraison | Metaschool | Portfolio |
| 5 | Le Challenge est une saison datée | buildspace | Challenges |
| 6 | Séance de critique publique du travail non fini | buildspace | Sessions |
| 7 | Demo day de fin de saison | buildspace | Challenges |
| 8 | Grille de revue visible avant de commencer | Frontend Mentor | Livrables |
| 9 | Relire les autres compte comme contribution | Frontend Mentor | Statut Contributor |
| 10 | Niveau de difficulté annoncé | Frontend Mentor | Challenges, parcours |
| 11 | Binôme de projet | Microverse | Projets à plusieurs |
| 12 | Critères d'acceptation écrits avant le travail | Gitcoin | Missions |
| 13 | Fonds bloqués jusqu'à validation | Gitcoin | Paiements |
| 14 | Candidature simple, sélection par le portfolio | Gitcoin | Missions |
| 15 | Règle des 70 % non-promotionnels | DEV, daily.dev | Sponsoring |

---

## Sources

- [ALX Africa — Software Engineering Programme Review (2026)](https://www.mctaba.com/learn/africa/alx-africa-review)
- [ALX Africa — présentation du programme et des hubs](https://www.alxafrica.com/from-learners-to-leaders-how-alx-is-building-nigerias-future-of-work/)
- [Mastercard Foundation — ALX All-Tech Training Programs](https://mastercardfdn.org/en/news/alx-kick-starts-inaugural-all-tech-training-programs-for-over-32000-learners-across-africa/)
- [Metaschool — Home for builders to learn AI and Web3](https://metaschool.so/)
- [Metaschool sur Product Hunt](https://www.producthunt.com/products/metaschool?launch=metaschool)
- [buildspace — Nights and Weekends](https://incubatorlist.com/buildspace-nights-and-weekends)
- [Review of Buildspace Nights & Weekends — Josh Finnie](https://www.joshfinnie.com/blog/review-of-buildspace-nights-weekends/)
- [Frontend Mentor](https://www.frontendmentor.io/)
- [Frontend Mentor for Teams — revue IA et revue par les pairs](https://teams.frontendmentor.io/)
- [Microverse — Course Report](https://www.coursereport.com/schools/microverse)
- [AltSchool Africa — programmes et tarifs](https://engineering.altschoolafrica.com/programs/ai-powered-fullstack-engineering)
- [Best Coding Bootcamps Nigeria 2026 — Decagon, AltSchool, Semicolon](https://www.mctaba.com/learn/nigeria/best-coding-bootcamps-nigeria)
- [Gitcoin — Bounties](https://gitcoin.co/mechanisms/bounties)
- [DEV Education Tracks](https://dev.to/deved)
- [daily.dev — Guide des sponsorings orientés développeurs](https://daily.dev/blog/the-complete-guide-for-developer-focused-sponsorships-in-2025)
