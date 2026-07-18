# Feuille de route TakaCode — Projet & Monetisation

Ce document est la source de verite produit et technique. Chaque livraison visible recoit un numero de version, une entree dans `lib/productReleases.ts` et une mise a jour de la page `/dashboard/nouveautes`.

## Mission

**Aider chaque membre a creer un projet digital et a le monetiser.**

Tout ce qui est construit — parcours, outils, templates, communaute — converge vers ce seul objectif. Le projet est l'entite centrale de la plateforme. Les parcours ne sont que des acccelerateurs pour concevoir, lancer et rentabiliser un projet.

## Principes

- Le projet est le point de depart et d'arrivee : tout utilisateur cree son projet avant (ou en parallele) de suivre un parcours.
- Les parcours sont lies a un type de projet concret (site vitrine, SaaS, e-commerce, application mobile, blog monétise...). Pas de parcours « generaux ».
- La publication et la monetisation sont des etapes obligatoires du cycle de vie d'un projet sur TakaCode.
- Un projet n'est pas un exercice : il doit pouvoir etre mis en ligne et generer des revenus.
- Les templates, quiz, ressources et revues sont au service du projet, pas l'inverse.
- Privilegier la boucle `idee -> projet -> construction -> publication -> monetisation -> iteration`.
- Ne jamais exposer les reponses des quiz ni les cles IA au navigateur.
- La page Nouveautes ne montre que les changements visibles par l'utilisateur.
- Tout plan tarifaire doit apporter de la valeur mesurable (temps gagne, projet lance, revenu genere).

## V1.0 — Fondations projet (livree)

Objectif : poser la base technique pour qu'un membre puisse creer, suivre et valider des etapes autour d'un projet.

- [x] Inscription, connexion, profil membre
- [x] Premier projet cree automatiquement a la fin de l'onboarding
- [x] Parcours, modules, lecons, quiz (support a la construction du projet)
- [x] Micro-projets (soumissions de livrables)
- [x] Progression, XP, grades et classement
- [x] Dashboard membre, administration, sessions et affiliations

## V1.1 — Selection et deploiement (livree)

Objectif : donner au membre les outils pour choisir le bon type de projet et le mettre en ligne.

- [x] 8 Starter kits prets a deployer (site vitrine, SaaS, dashboard, IA, e-commerce, blog, mobile PWA, chatbot)
- [x] Publication guidee : GitHub → Vercel/Netlify → domaine personnalise
- [x] Bloc Prochaine action intelligent sur le dashboard (adapte a l'etat du projet)
- [x] Migration TypeScript stricte et build de production
- [x] Documentation projet (guides deploiement, templates, publication)
- [x] Mots de passe renforces et securite des acces
- [x] Loader de marque et skeletons contextuels

## V1.2 — Parcours projets (livree)

Objectif : chaque parcours est lie a un archetype de projet et guide sa realisation complete.

- [x] Parcours reorganises par type de projet (site vitrine, SaaS, e-commerce, blog, app, IA, API, dashboard)
- [x] Contenu des parcours oriente livraison (pas de theorie sans application directe)
- [x] Banque de questions liees aux objectifs du projet
- [x] Quiz melanges et non predictibles
- [x] Editeur parcours pour les createurs de contenu
- [x] Constructeur de micro-projet visuel

## V1.3 — Studio de creation (livree)

Objectif : permettre aux mentors et admins de creer facilement des parcours projets.

- [x] Formulaire parcours en 5 sections (identite, cible, promesse, structure, publication)
- [x] Glisser-deposer des modules et lecons, duplication et brouillon
- [x] Validation inline, autosave, historique des versions
- [x] Apercu public en direct et indicateur de completude
- [x] Editeur de ressources et banque de questions
- [x] Generation IA assistee d'un plan de parcours (admin seulement)

## V1.4 — Tracking et monitoring projet (livree)

Objectif : le membre voit l'avancement de son projet et son impact.

- [x] Drapeau pays sur le leaderboard + selection dans le profil
- [x] Derniere connexion et appareils connectes visibles
- [x] Tracking IP et session
- [x] Suppression et desactivation de compte
- [x] Sons et animations sur les actions cles
- [x] Bandeau d'annonce des nouveautes
- [x] Tour guide mis a jour

## V1.4.1 — Fiabilite revue IA & classement (livree)

Objectif : consolider ce qui existe avant d'attaquer la monetisation.

- [x] Revue IA multi-provider gratuite (OpenRouter :free, Gemini, HuggingFace) avec fallback en chaine
- [x] Declenchement automatique a la soumission : validation + XP si approuve, observations si ameliorations demandees
- [x] Sans IA configuree : bascule automatique en revue manuelle (pairs/mentors/admins selon la complexite)
- [x] Verdict IA applique uniquement cote serveur (service_role) — pas d'auto-approbation possible
- [x] Echec quiz : reessais illimites (70 % requis) ; echec micro-projet : feedback + re-soumission, progression non bloquee
- [x] Classement public : exclusion de TOUS les admins (role profil + app_metadata) et synchronisation des roles

## V1.5 — Monetisation (a livrer)

Objectif : le membre peut generer des revenus avec son projet.

- [ ] Offre Premium : revisions IA illimitees, kits de demarrage, guides monetisation
- [ ] Offre Launch : mentorat 1:1, portfolio, mise en relation freelance
- [ ] Parcours « Build to Earn » : construire un produit digital rentable
- [ ] Integration Stripe pour les projets utilisateurs
- [ ] Guides pratiques : pubs, abonnements, produits digitaux, affiliation
- [ ] Page Tarifs dynamique (Free / Premium / Launch)
- [ ] Abonnements Stripe recurrents
- [ ] Calcul du potentiel de revenu par type de projet

## V1.6 — Marketing & acquisition

Objectif : le membre sait comment attirer des visiteurs et clients vers son projet.

- [ ] Parcours SEO : referencement naturel pour son projet
- [ ] Parcours Reseaux sociaux : strategies de publication par plateforme
- [ ] Landing page builder : page d'accueil pour son projet
- [ ] Guides email marketing : newsletter, sequences, conversion
- [ ] Analytics embarqué : vue des visites sur le projet publie
- [ ] A/B testing de pages et d'offres

## V1.7 — Revenus recurrents & scaling

Objectif : le membre transforme son projet en source de revenus stable.

- [ ] Parcours Abonnements : Stripe, factures, metering
- [ ] Parcours Produits digitaux : ebooks, formations, templates
- [ ] Parcours Affiliation : programmes partenaires, tracking
- [ ] Dashboard revenus : MRR, conversions, couts d'acquisition
- [ ] Templates de factures et conditions de vente
- [ ] Export comptable et declarations

## V1.8 — Communaute & marketplace

Objectif : les membres echangent, collaborent et se recommandent.

- [ ] Publication moderee des projets termines
- [ ] Likes, commentaires, questions et signalements
- [ ] Profils publics et portfolio (lien vers le projet en ligne)
- [ ] Equipes, invitations, roles et attribution des taches
- [ ] Badges fondes sur des realisations verifiables (projet lance, premier revenu...)
- [ ] Marketplace de services : dev, design, redaction, SEO
- [ ] Systeme de recommandation et reviews

## Definition de termine

Une version est terminee lorsque :

1. le cycle projet (idee → monetisation) est operationnel pour la cible visee ;
2. les erreurs et etats vides sont traites ;
3. l'accessibilite clavier est verifiee ;
4. le typecheck et le build passent ;
5. les regles RLS/API concernees sont testees ;
6. la page « Nouveautes » explique le changement en langage utilisateur.
