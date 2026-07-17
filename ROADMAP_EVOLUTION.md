# Feuille de route d'evolution TakaCode

Ce document est la source de verite produit et technique. Chaque livraison visible recoit un numero de version, une entree dans `lib/productReleases.ts` et une mise a jour de la page `/dashboard/nouveautes`.

## Principes

- Conserver le design system, les couleurs, les composants et les typographies existants.
- Privilegier la boucle `idee -> plan -> apprentissage -> production -> feedback -> publication`.
- Livrer une version testable a la fois, avec typecheck, build et tests adaptes.
- Ne jamais exposer les reponses des quiz ni les cles IA au navigateur.
- Mesurer l'impact avant d'ajouter de nouveaux parcours ou des fonctions secondaires.
- La page Nouveautes ne montre que les changements visibles par l'utilisateur.

## V1.0 — MVP pedagogique (livree)

Objectif : premier parcours complet, de la lecon au micro-projet valide.

- [x] Parcours, modules, lecons, ressources et quiz
- [x] Micro-projets avec validation auto, IA, pair ou mentor
- [x] Progression, XP, grades et classement
- [x] Dashboard membre, administration, sessions et affiliations

## V1.1 — Fondations et securite (livree)

Objectif : base fiable, mots de passe renforces, documentation, performances et acces proteges.

- [x] Migration TypeScript stricte et build de production
- [x] Journal de versions centralise + page Nouveautes
- [x] Loader de marque + skeletons contextuels
- [x] Routes IA et RPC privees reservees aux admins
- [x] Mots de passe : 8 caracteres, minuscules/majuscules/chiffres/symboles
- [x] Documentation utilisateur (5 pages), mentor (4 pages), admin (3 pages)
- [x] CI : typecheck, build, lint, audit dependances
- [x] Protection mots de passe compromis documentee

## V1.2 — Quiz moins previsibles (livree)

Objectif : evaluer la comprehension plutot que la memorisation.

- [x] Melange deterministe des choix par utilisateur
- [x] Correction preservee cote serveur
- [x] Equilibrage automatique des positions A/B/C/D
- [x] Validateur admin : doublons, reponse absente, position dominante, explication vide
- [x] Banque de questions privee par objectif, ressource et niveau de difficulte
- [x] Edition par admin et mentor proprietaire
- [x] Tirage d'un sous-ensemble different par utilisateur/tentative
- [x] Historique anti-repetition (user_seen_questions)
- [x] Separation vue publique (prompt+choix) / corrections privees (reponse+explication)

### Quiz dynamiques par IA — evolution progressive

1. **V1.2A, sans IA** : permutation serveur des choix par utilisateur, puis tirage dans une banque validee. ✅
2. **V1.2B, IA assistee** : l'IA propose des variantes, un admin les valide avant publication.
3. **V1.2C, personnalisation** : generation asynchrone par niveau et erreurs precedentes, avec cache, quotas et controle qualite.

Une question generee doit etre versionnee avec son modele, son prompt, sa reponse attendue et son statut de validation. L'IA ne doit jamais attribuer seule une recompense ou modifier directement la progression.

## V1.3 — Studio de creation de parcours (en cours)

Objectif : remplacer l'edition JSON par une interface editoriale sure.

### Livre
- [x] Constructeur de micro-projet visuel (MicroProjectBuilder)
- [x] Editeur de ressources visuel (ResourcesEditor)
- [x] Banque de questions comme editeur principal des quiz (QuestionBankEditor)

### Restant
- [ ] Formulaire parcours par sections : identite, cible, promesse, structure, publication
- [ ] Apercu public en direct et indicateur de completude
- [ ] Modules et lecons ordonnables par glisser-deposer, duplication et sauvegarde brouillon
- [ ] Validation inline, autosave, avertissement avant de quitter et historique des versions
- [ ] Generation IA assistee d'un plan ou d'un quiz, toujours confirmee par l'editeur

## V1.4 — Projet principal et prochaine action

Objectif : faire du dashboard le GPS quotidien du createur.

- [ ] Creation automatique du projet principal a la fin de l'onboarding
- [ ] Jalons, taches, checklist, deadline et historique
- [ ] Connexion entre taches, lecons, soumissions et deploiement
- [ ] Bloc unique « Prochaine action » sur le dashboard
- [ ] Sauvegarde des brouillons et historique des soumissions
- [ ] Publication guidee : depot, hebergement, domaine, verification finale

## V1.5 — Feedback IA robuste

- [ ] Grille d'evaluation versionnee par micro-projet
- [ ] Feedback par critere et suggestions actionnables
- [ ] Protection contre la prompt injection et anonymisation des donnees
- [ ] Jobs asynchrones, timeouts, retries limites, quotas et fallback
- [ ] Mesure de l'accord IA/mentor et possibilite de contestation
- [ ] Journal du modele, du prompt, du cout et de la latence

## V1.6 — Integrations et automatisation

- [ ] GitHub : depot, commits, README et preuve d'activite
- [ ] Vercel/Netlify : statut du deploiement et URL publique
- [ ] Supabase Storage : captures et livrables
- [ ] Emails transactionnels : bienvenue, rappel, revue, live
- [ ] Cron/Queues : rappels et travaux IA
- [ ] Realtime : notifications et resultats de revue
- [ ] Calendrier ICS/Google Calendar pour deadlines et sessions

## V1.7 — Communaute et collaboration

- [ ] Publication moderee des projets termines
- [ ] Likes, commentaires, questions et signalements
- [ ] Profils publics et portfolio
- [ ] Equipes, invitations, roles et attribution des taches
- [ ] Badges fondes sur des realisations verifiables

## Definition de termine

Une version est terminee lorsque :

1. les parcours principaux fonctionnent sur mobile et desktop ;
2. les erreurs et etats vides sont traites ;
3. l'accessibilite clavier est verifiee ;
4. le typecheck et le build passent ;
5. les regles RLS/API concernees sont testees ;
6. la page « Nouveautes » explique le changement en langage utilisateur.
