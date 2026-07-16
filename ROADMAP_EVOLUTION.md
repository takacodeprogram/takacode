# Feuille de route d'evolution TakaCode

Ce document est la source de verite produit et technique. Chaque livraison visible recoit un numero de version, une entree dans `lib/productReleases.ts` et une mise a jour de la page `/dashboard/nouveautes`.

## Principes

- Conserver le design system, les couleurs, les composants et les typographies existants.
- Privilegier la boucle `idee -> plan -> apprentissage -> production -> feedback -> publication`.
- Livrer une version testable a la fois, avec typecheck, build et tests adaptes.
- Ne jamais exposer les reponses des quiz ni les cles IA au navigateur.
- Mesurer l'impact avant d'ajouter de nouveaux parcours ou des fonctions secondaires.

## V1.1 - Fondations de l'evolution (en cours)

Objectif : rendre les changements visibles et preparer une experience de chargement adaptee.

- [x] Migration TypeScript stricte et build de production.
- [x] Journal de versions centralise.
- [x] Page membre « Nouveautes » avec versions numerotees.
- [x] Loader de marque reserve a la homepage.
- [x] Skeleton generique pour les autres routes.
- [ ] Skeletons contextuels : dashboard, listes, formulaires et lecons.
- [ ] Protection des routes IA de test/debug et durcissement Supabase.
- [ ] CI : typecheck, build, tests et audit des dependances.

## V1.2 - Lecons et quiz moins previsibles

Objectif : evaluer la comprehension plutot que la memorisation de la position des reponses.

- [ ] Melanger deterministiquement les choix pour chaque tentative.
- [ ] Recalculer l'index de la bonne reponse uniquement cote serveur.
- [ ] Equilibrer automatiquement la position A/B/C/D dans les quiz existants.
- [ ] Ajouter un validateur admin : doublons, reponse absente, position dominante, explication vide.
- [ ] Ajouter une banque de questions par objectif pedagogique et niveau.
- [ ] Tirer un sous-ensemble different par utilisateur/tentative avec historique anti-repetition.
- [ ] Separer la vue publique des questions et les corrections privees.

### Quiz dynamiques par IA - evolution progressive

1. **V1.2A, sans IA** : permutation serveur des choix et tirage dans une banque validee.
2. **V1.2B, IA assistee** : l'IA propose des variantes, un admin les valide avant publication.
3. **V1.2C, personnalisation** : generation asynchrone par niveau et erreurs precedentes, avec cache, quotas et controle qualite.

Une question generee doit etre versionnee avec son modele, son prompt, sa reponse attendue et son statut de validation. L'IA ne doit jamais attribuer seule une recompense ou modifier directement la progression.

## V1.3 - Studio de creation de parcours et lecons

Objectif : remplacer l'edition JSON par une interface editoriale sure.

- [ ] Formulaire parcours par sections : identite, cible, promesse, structure, publication.
- [ ] Apercu public en direct et indicateur de completude.
- [ ] Modules et lecons ordonnables, duplication et sauvegarde brouillon.
- [ ] Editeur de ressources avec lignes label/URL/type/pourquoi/comment.
- [ ] Constructeur de quiz visuel avec ajout, suppression et reorganisation des choix.
- [ ] Constructeur de micro-projet avec validation auto/IA/pair/mentor.
- [ ] Validation inline, autosave, avertissement avant de quitter et historique des versions.
- [ ] Generation IA assistee d'un plan ou d'un quiz, toujours confirmee par l'editeur.

## V1.4 - Projet principal et prochaine action

Objectif : faire du dashboard le GPS quotidien du createur.

- [ ] Creation automatique du projet principal a la fin de l'onboarding.
- [ ] Jalons, taches, checklist, deadline et historique.
- [ ] Connexion entre taches, lecons, soumissions et deploiement.
- [ ] Bloc unique « Prochaine action » sur le dashboard.
- [ ] Sauvegarde des brouillons et historique des soumissions.
- [ ] Publication guidee : depot, hebergement, domaine, verification finale.

## V1.5 - Feedback IA robuste

- [ ] Grille d'evaluation versionnee par micro-projet.
- [ ] Feedback par critere et suggestions actionnables.
- [ ] Protection contre la prompt injection et anonymisation des donnees.
- [ ] Jobs asynchrones, timeouts, retries limites, quotas et fallback.
- [ ] Mesure de l'accord IA/mentor et possibilite de contestation.
- [ ] Journal du modele, du prompt, du cout et de la latence.

## V1.6 - Integrations et automatisation

- [ ] GitHub : depot, commits, README et preuve d'activite.
- [ ] Vercel/Netlify : statut du deploiement et URL publique.
- [ ] Supabase Storage : captures et livrables.
- [ ] Emails transactionnels : bienvenue, rappel, revue, live.
- [ ] Cron/Queues : rappels et travaux IA.
- [ ] Realtime : notifications et resultats de revue.
- [ ] Calendrier ICS/Google Calendar pour deadlines et sessions.

## V1.7 - Communaute et collaboration

- [ ] Publication moderee des projets termines.
- [ ] Likes, commentaires, questions et signalements.
- [ ] Profils publics et portfolio.
- [ ] Equipes, invitations, roles et attribution des taches.
- [ ] Badges fondes sur des realisations verifiables.

## Definition de termine

Une version est terminee lorsque :

1. les parcours principaux fonctionnent sur mobile et desktop ;
2. les erreurs et etats vides sont traites ;
3. l'accessibilite clavier est verifiee ;
4. le typecheck et le build passent ;
5. les regles RLS/API concernees sont testees ;
6. la page « Nouveautes » explique le changement en langage utilisateur.

