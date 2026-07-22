# Feuille de route TakaCode — Projet & Monetisation

Ce document est la source de verite produit et technique. Chaque livraison visible recoit un numero de version, une entree dans `lib/productReleases.ts` et une mise a jour de la page `/dashboard/nouveautes`.

## Mission

**Aider chaque membre a creer un projet digital et a le monetiser.**

Tout ce qui est construit — parcours, outils, templates, communaute — converge vers ce seul objectif. Le projet est l'entite centrale de la plateforme. Les parcours ne sont que des accelerateurs pour concevoir, lancer et rentabiliser un projet.

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
- **La qualité du code et les tests sont des prerequis, pas des options.** Aucune version ne livre une fonctionnalite sans ses tests.

---

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

- [x] Revue IA multi-provider gratuite (OpenRouter, Gemini, HuggingFace) avec fallback en chaine
- [x] Declenchement automatique a la soumission : validation + XP si approuve, observations si ameliorations demandees
- [x] Sans IA configuree : bascule automatique en revue manuelle (pairs/mentors/admins selon la complexite)
- [x] Verdict IA applique uniquement cote serveur (service_role) — pas d'auto-approbation possible
- [x] Echec quiz : reessais illimites (70 % requis) ; echec micro-projet : feedback + re-soumission, progression non bloquee
- [x] Classement public : exclusion de TOUS les admins (role profil + app_metadata) et synchronisation des roles

## V1.4.2 — Convergence : le projet est le produit (livree)

Objectif : chaque ecran repond a « ou en est mon projet, et quelle action le rapproche du cash ? ».
Le produit central est la boucle Idee -> Projet -> Construction -> Publication -> Cash.
Les parcours sont des accelerateurs injectes au bon moment de cette boucle, jamais le centre.

- [x] Dashboard cockpit projet : pipeline Idee/Construction/En ligne/Cash, deadline, progression vers la mise en ligne
- [x] Prochaine action projet en tete de colonne (l'action qui rapproche du cash)
- [x] Parcours reframes en « accelerateurs » au service du projet (dashboard)
- [x] Relation projet <-> parcours clarifiee : lier un parcours = s'y inscrire ; sa progression et le CTA "Continuer le sprint" vivent sur la page projet ; suggestions seulement sans parcours lie
- [x] Micro-projets lies AU projet du membre (project_id sur la progression, livrables listes sur la page projet)
- [x] Modele de revenu vise sur le projet (vente, abonnement, pub, affiliation, freelance) + badge cockpit
- [x] Stade Cash visible : « 0 EUR — objectif premier euro », declaration du premier euro + badge
- [x] Vitrine dynamique des projets publies (homepage) + profils publics cliquables depuis le classement
- [x] Qualite contenu : accents et apostrophes restaures dans tout le contenu parcours/quiz (scripts/fix-french-content.mjs, rejouable apres re-seed)
- [x] Onboarding qui debouche sur un projet NOMME + modele de revenu choisi des l'inscription (etape 4 : nom du projet + piste de monetisation ; anti-doublon si l'onboarding est refait)
- [x] Parcours "Creation de contenu avec l'IA" (YouTube faceless) : 4 modules / 10 lecons accentuees — anti-robotique (scripts, voix, regle 80/20), etude de chaines (ex. Emotion26), production, monetisation (seed : scripts/seed-creation-contenu-ia.mjs)
- [x] Etoile du nord mesuree (admin) : carte en tete du centre admin — % de membres avec projet en ligne et % avec premier euro declare (calcul service role, jauges + valeurs absolues)
---

## V1.4.3 — Fondations i18n & multi-devise (i18n livrée, multi-devise en cours) 🔴

> **Pourquoi maintenant :** Le marche africain est notre coeur de cible. Les membres utilisent
> le franc CFA (XOF/XAF), le naira (NGN), le cedi (GHS), le dirham (MAD), etc. — pas seulement l'euro.
> L'internationalisation (i18n) et le multi-devise sont des prerequis pour scale.

### Priorite : LIVREE — les fondations sont posees, les chantiers restants sont integres aux sprints

#### Internationalisation (i18n) 🌍

- [x] **Fondation i18n** : `lib/i18n.ts` avec systeme de traduction (fr + en), detection locale, helpers serveur/client
- [x] **Provider React** : `<I18nProvider>` avec `useI18n()` hook, persistance cookie + localStorage
- [x] **Switch EN/FR** dans la navbar (composant Navbar.tsx via `setLocale()`)
- [x] **SEO multilingue** : balises `hreflang`, `getAlternateUrls()`, metadata par locale, URLs `/en/...` via proxy middleware
- [x] **Redirection locale-aware** : `redirectLocale()` preserve la locale dans les redirects auth
- [x] **Helpers de chemin** : `localePath()`, `stripLocale()`, `switchLocalePath()`, composant `<L>` locale-aware
- [x] **Middleware i18n** : `proxy.ts` gere le prefixe `/fr/` et `/en/` dans les URLs
- [ ] **Pages landing traduites (6 composants)** : `ParcoursSection`, `RessourcesSection`, `SessionsLiveSection`, `ProjectsSection`, `FinalCtaSection`, `GlobeSection` — contenu FR dur, pas de `t()`
- [ ] **Filtre locale sur les tracks** : `app/page.tsx` ne filtre pas les tracks par locale
- [ ] **Colonne locale dans l'admin** : `lib/adminCurriculum.ts` ne selectionne pas la colonne `locale`
- [ ] **Seeds EN** : tous les parcours seedes sont en `locale='fr'` (defaut), aucun track EN

> **Voir `RAPPORT_LOCALISATION.md`** pour l'audit complet : page par page, composant par composant.

#### Multi-devise "Premier revenu" 💶

- [x] **Fondation multi-devise** : `lib/currency.ts` avec 15 devises (EUR, USD, XOF, XAF, GNF, MAD, NGN, etc.)
- [x] **Composant `DeclareFirstRevenue`** remplace `DeclareFirstEuro` avec selecteur de devise et montant
- [ ] **Migration BDD** : `has_declared_first_revenue` + `first_revenue_currency` + `first_revenue_amount` remplacent `has_declared_first_euro`
- [ ] **RPC API** : `/api/projects/first-revenue` accepte `{ projectId, amount, currency }`
- [ ] **Rapports admin** : stats de revenus par devise, conversion automatique vers EUR pour le reporting
- [ ] **Affichage cockpit** : "0 XOF — objectif premier revenu" au lieu de "0 EUR"

---

## V1.4.4 — Livraisons restantes immediates 🔴

> **Pourquoi maintenant :** Les features sont pretes en base/code mais pas encore accessibles.

- [ ] **Publier les 3 parcours avancés** : UPDATE learning_tracks SET is_published=true WHERE slug IN ('automatisation-ia','web3-blockchain','bot-trading-ia')
- [ ] **Publier les 10 suggestions d'affiliation** dans `/admin/affiliations`
- [ ] **Appliquer migration `027_add_vibe_platforms_module.sql`** (module "Plateformes vibe coding")
- [ ] **Verifier SEO preview** : partager un parcours → l'image OG doit afficher le titre + la couleur accent

---

## V1.5 — Tests & Fondations solides ✅ (EN COURS)

> **Progression :** 14 fichiers de tests, 328 tests passent, 0 erreurs TypeScript, rate limiting en place, validation Zod deployee.

### Priorite : REALISEE (sauf items deferes)

Objectif : chaque module critique a ses tests, les erreurs TypeScript sont traitees, la dette architecturale la plus dangereuse est resolue.

#### Tests unitaires — lib/ (vitest) — 14 fichiers, 328 tests ✅

- [x] Configurer vitest + coverage (v8)
- [x] `lib/grades.ts` — 18 tests
- [x] `lib/tracks.ts` — 8 tests
- [x] `lib/userProjects.ts` — 15 tests
- [x] `lib/onboarding.ts` — 32 tests
- [x] `lib/auth.ts` — 19 tests
- [x] `lib/aiReview.ts` — 34 tests (fallback multi-provider, extraction JSON, configuration)
- [x] `lib/displayName.ts` — 14 tests
- [x] `lib/username.ts` — 8 tests
- [x] `lib/avatar.ts` — 26 tests
- [x] `lib/parcours.ts` — 44 tests
- [x] `lib/curriculum.ts` — 32 tests
- [x] `lib/affiliate.ts` — 18 tests
- [x] `lib/community.ts` — 23 tests
- [x] `lib/validation.ts` — 37 tests (schemas Zod)

#### Securite & dette urgente

- [x] **SQL injection** : corrigee (UUID regex + `.not()` boucle)
- [x] **Rate limiting** : implemente sur 5 routes API critiques (IA review, project, quiz)
- [x] **Validation Zod** : 6 schemas deployes sur toutes les routes API
- [x] **Erreurs TypeScript** : 0 erreurs residuelles
- [x] **CI/CD** : GitHub Actions avec typecheck, build, lint, audit
- [ ] **React Query** : deferé (migration incrementale au fil des versions)
- [ ] **Lib/ refactor** : deferé (sous-dossiers dans lib/)
- [ ] **Harmonisation accents UI** : tache transverse
- [ ] **.env.example sync** : a creer

---

## V1.6 — Communaute & Lien social 🟠

> **Statut : partiellement livré (V1.8 initial).** Les fondations de la communaute sont posees.
> Les items restants sont a completer dans le cadre du planning 8 semaines.

### Priorite : HAUTE

Objectif : les membres echangent, collaborent, se recommandent. Le site devient vivant.

- [x] **Fil d'activite** sur /communaute (nouveaux projets, projets publies, jalons, premier euro)
- [x] **Commentaires** sur projets publies (RLS + RPC create_comment, list_comments)
- [x] **Likes** et compteur sur les projets (composant LikeButton)
- [x] **Filtres** projets publies/En cours + tri (recent, popularite)
- [x] **Badge "Projet en ligne"** affiche sur la carte projet + profil
- [x] **Page projet publique** (/projets/[id]) avec description, URLs, auteur, badges
- [ ] **Profil public enrichi** : bio, skills, projets publies, badges, lien portfolio, statistiques
- [ ] **Notifications temps reel** (Supabase Realtime) pour commentaires, likes, mentions
- [ ] **Invitation a collaborer** sur son projet (email/in-app)
- [ ] **Publication moderee** des projets termines (workflow soumettre -> file admin -> modere -> publie)
- [ ] **Recherche full-text** sur projets publies (pg_trgm)
- [ ] **Questions et signalements** sur les projets
- [ ] **Equipes, invitations, roles** et attribution des taches
- [ ] **Marketplace de services** : dev, design, redaction, SEO (commission plateforme)

---

## V1.7 — Engagement & Retention (1-2 semaines) 🟡

> **Pourquoi maintenant :** la retention est le moteur de la croissance. Les streaks, le partage social
> et le portfolio automatique creent des habitudes et du bouche-a-oreille.

### Priorite : MOYENNE-HAUTE

Objectif : chaque membre a une raison quotidienne de revenir, et chaque projet termine est une vitrine virale.

#### Streaks de connexion

- [ ] Colonne `current_streak INT`, `longest_streak INT`, `last_active_date DATE` dans `user_profiles`
- [ ] RPC `check_streak()` : verifie et met a jour la serie chaque jour
- [ ] Affichage streak dans le dashboard : "🔥 7 jours de suite !"
- [ ] XP bonus progressif : jour 3 (x1.5), jour 7 (x2), jour 30 (x3)
- [ ] Badges de serie : bronze (7j), argent (30j), or (90j), diamant (365j)
- [ ] Notification push/email en cas de streak sur le point de casser
- [ ] Animation confettis a chaque milestone de streak

#### Portfolio automatique

- [ ] Page `/portefolio/[username]` auto-generee depuis les projets publies
- [ ] Template de portfolio : photo, bio, skills, projets, badges, lien GitHub
- [ ] Partage social : "Decouvre mon projet sur TakaCode" (LinkedIn, Twitter, WhatsApp)
- [ ] QR code unique du portfolio (imprimable, partageable)
- [ ] Badge "Pro certifie" pour les profils completes

#### Partages & viralite

- [ ] Bouton "Partager ma progression" sur chaque jalon (lecon terminee, projet publie, premier euro)
- [ ] Generation d'image OG dynamique (progression, grade, projet)
- [ ] Lien de parrainage integre au partage social
- [ ] Calendrier personnel : "Objectif : finir le parcours X avant le [date]"

---

## V1.8 — Assistant IA & Apprentissage adaptatif (2-3 semaines) 🟣

> **Pourquoi maintenant :** c'est LA difference concurrentielle. Aucune plateforme d'apprentissage
> n'offre un tuteur IA contextuel dans chaque lecon + un parcours qui s'adapte au membre.

### Priorite : MOYENNE (apres communaute et retention)

Objectif : chaque membre a un tuteur IA personnel qui adapte le contenu, repond aux questions et suggere la meilleure etape suivante.

#### Tuteur IA contextuel

- [ ] **Chatbot contextuel** dans chaque lecon : le membre pose une question, l'IA repond avec le contexte de la lecon
- [ ] **Bouton "Explique-moi autrement"** : reformule la lecon en fonction du niveau du membre
- [ ] **Historique des questions** par lecon (visible pour le membre)
- [ ] **Mode oral** : le membre parle, l'IA ecoute et repond (Web Speech API)
- [ ] **Suggestions automatiques** : "Les membres qui ont lu cette lecon ont aussi demande..."

#### Parcours personnalise dynamique

- [ ] **Analyse du profil** : l'IA analyse les resultats quiz, le temps passe, le type de projet
- [ ] **Recommandation dynamique** : prochain module suggere en fonction des forces/faiblesses
- [ ] **Contournement intelligent** : sauter les modules deja maitrises (test de niveau)
- [ ] **Difficulte adaptative** : si le membre reussit tous les quiz, accelerer ; sinon, proposer des ressources supplementaires
- [ ] **Alerte "zone de confusion"** : detecter les lecons ou le membre bloque et proposer de l'aide

#### Revue de code IA (GitHub)

- [ ] **Connexion GitHub OAuth** optionnelle pour le depot du projet
- [ ] **Revue automatique** du code du projet a chaque push
- [ ] **Suggestions d'amelioration** : performance, securite, bonnes pratiques
- [ ] **Badge "Code audite par IA"** sur les projets revus

#### Generation de quiz

- [ ] **Generation automatique** de questions de quiz a partir du contenu d'une lecon
- [ ] **Variation infinie** : chaque membre voit des questions differentes
- [ ] **Analyse semantique** : detecter les concepts mal compris et generer des questions de rattrapage

---

## V1.9 — Contenu & Experience (2 semaines) 🔵

> **Pourquoi maintenant :** le polish transforme un bon produit en produit professionnel.
> PWA et dark mode sont particulierement attendus sur le marche africain (data saver, batterie).
> On en profite pour enrichir le contenu pedagogique (lecons bonus, banque de questions).

### Priorite : MOYENNE

Objectif : le site est accessible, utilisable hors-ligne, s'adapte aux preferences, et le contenu est enrichi.

#### Mode sombre / theme clair

- [ ] **Bascule clair/sombre** avec persistance dans les preferences
- [ ] **Palette de couleurs** qui s'inverse proprement (gradients, cartes, sidebar)
- [ ] **Navigation et formulaires** adaptes au mode clair
- [ ] **Images et logos** avec variante claire

#### PWA offline

- [ ] **Service worker** : mise en cache des pages statiques et des lecons recentes
- [ ] **Manifest.json** : icone, splash screen, theme color
- [ ] **Lecons consultables hors-ligne** : le contenu texte des 10 dernieres lecons est disponible sans connexion
- [ ] **Quiz offline** : les reponses sont stockees et synchronisees a la reconnexion
- [ ] **Banniere "Install TakaCode"** sur mobile

#### Accessibilite (a11y)

- [ ] **Labels ARIA** sur tous les composants interactifs
- [ ] **Navigation clavier** complete (Tab, Enter, Escape, fleches)
- [ ] **Contraste** verifie (WCAG AA minimum)
- [ ] **Annonces** pour lecteurs d'ecran (toasts, notifications, chargements)
- [ ] **Mode contraste eleve** pour les lecons (lecture facile)
- [ ] **Police lisible** : taille minimum 14px pour le corps de texte

#### Enrichissement contenu

- [ ] **Lecons bonus optionnelles** : Flexbox Froggy, Grid Garden, Tailwind CSS (liens interactifs)
- [ ] **Enrichir la banque de questions** des nouveaux parcours (minimum 10 questions par module)
- [ ] **Modules plateformes** : integrer Lovable, Bolt, v0 dans le parcours Vibe Coding (fait en partie, verifier)

#### Export & hors-ligne

- [ ] **Export PDF** des lecons (imprimer, relire hors-ligne)
- [ ] **Export certificat** de completion de parcours (PDF verifiable)
- [ ] **Raccourcis clavier** dans l'apprentissage : `j/k` navigation, `q` quiz, `s` soumettre
- [ ] **Mode concentrateur** : cacher la sidebar pour se focaliser sur la lecon

---

## V2.0 — Marketplace & Monetisation (3-4 semaines) 🟢

> **Pourquoi maintenant :** les membres construisent des projets mais ne peuvent pas encore les
> monetiser DIRECTEMENT depuis la plateforme. La marketplace est le pont entre "j'ai construit"
> et "je gagne de l'argent". L'automatisation IA avancee devient le moteur de la croissance.

### Priorite : HAUTE (montee apres les retours communaute)

Objectif : chaque membre peut creer, vendre et gagner de l'argent sans quitter TakaCode.

#### 🏪 Marketplace de produits digitaux (PRIORITE #1)

- [ ] **Table `digital_products`** : id, user_id, title, description, price, currency, file_url, preview_url, category, status
- [ ] **Page de creation de produit** : titre, description, prix (multi-devise), fichier, image, categorie
- [ ] **Page de vente automatique** : template personnalisable, livraison automatique du fichier/lien
- [ ] **Catalogue communautaire** : tous les produits digitaux des membres visible sur `/marketplace`
- [ ] **Taux de commission** : 10% TakaCode, 90% createur (5% a volume)
- [ ] **Paiement unifie** : Stripe + Orange Money + MTN MoMo + Wave (portefeuille TakaCode intermediaire)
- [ ] **Badge "Vendeur"** sur les profils des createurs actifs

#### 🤖 Automatisation IA complete — FEATURE PAYANTE

> **Decision strategique :** l'automatisation IA poussee (tuteur contextuel, parcours adaptatif,
> generation de quiz, revue de code GitHub) est une feature payante (plan Premium/Launch).
> La revue IA basique (micro-projets) reste gratuite.

- [ ] **Plan Gratuit** : revue IA basique (micro-projets), 3 revues/jour, fallback multi-provider
- [ ] **Plan Premium** (payant) : tuteur IA contextuel, parcours adaptatif, generation quiz, revue code GitHub
- [ ] **Plan Launch** (payant) : tout Premium + AI Project Coach, coaching groupe, templates premium
- [ ] **Gates intelligentes** : proposer l'upgrade au moment du blocage (echec quiz, revue en attente)

#### Abonnements Stripe

- [ ] **Integration Stripe Connect** (paiements recurrents en EUR, USD, XOF via conversion)
- [ ] **Page tarifs dynamique** synchronisee avec les plans Stripe
- [ ] **Portail client Stripe** : gestion de l'abonnement par le membre

#### Suivi des revenus multi-devise

- [ ] **Tableau de bord revenus** : total gagne, par mois, par source, avec conversion devise
- [ ] **Calendrier des revenus** : visualisation des entrees par jour/semaine/mois
- [ ] **Objectif de revenu mensuel** avec barre de progression (choix de la devise)
- [ ] **Paiement automatique** des commissions d'affiliation et ventes marketplace (Stripe / Mobile Money)

---

## V2.1 — Scale & Communaute V2 (2-3 semaines) 🔵

> **Pourquoi maintenant :** la base est solide, la monetisation tourne. On peut passer a l'echelle
> avec des fonctionnalites avancees et un modele B2B.

### Priorite : BASSE (apres monetisation)

Objectif : la plateforme devient un ecosysteme avec des classes, des evenements et un vrai reseau professionnel.

- [ ] **Classes/Groupes** : un mentor cree une classe, invite des membres, suit leur progression (modele B2B ecoles)
- [ ] **Hackathons mensuels** : theme, jury, lots, classement en direct
- [ ] **Streaming de code en direct** (Twitch-like) : les membres regardent un projet se construire en temps reel
- [ ] **Guildes** : groupes WhatsApp/Telegram par parcours, geres depuis la plateforme
- [ ] **Sessions live interactives** : Q&A, code en direct, chat integre
- [ ] **API publique** : les projets et profils publies sont accessibles via API (pour portfolio externe, embed)
- [ ] **Badges sur realisations verifiables** : "Projet audite", "Membre actif 1 an", "Createur certifie"
- [ ] **Analyse de tendances** : temps reel sur les projets les plus populaires, les competences recherchees
- [ ] **Recommandation de mentors** : matching IA entre membres et mentors selon les besoins

---

## Definition de termine

Une version est terminee lorsque :

1. le cycle projet (idee → monetisation) est operationnel pour la cible visee ;
2. les erreurs et etats vides sont traites ;
3. l'accessibilite clavier est verifiee ;
4. le typecheck et le build passent ;
5. les regles RLS/API concernees sont testees ;
6. la page « Nouveautes » explique le changement en langage utilisateur ;
7. **les nouveaux modules ont leurs tests unitaires** (vitest) ;
8. **les nouvelles RPCs ont leurs tests** (pgTAP ou script SQL).

---

## Annexes

### Strategie de versionning

| Version | Objectif | Effort | Public cible |
|:-------:|:---------|:------:|:-------------|
| V1.5 | Securiser le code | 1-2 sem | Technique (interne) |
| V1.6 | Retention sociale | 2 sem | Membres actifs |
| V1.7 | Habitude quotidienne | 1-2 sem | Tous membres |
| V1.8 | Apprentissage IA | 2-3 sem | Apprenants |
| V1.9 | Polish & offline | 1-2 sem | Mobile (Afrique) |
| V2.0 | Revenus | 2-3 sem | Createurs monetises |
| V2.1 | Scale & B2B | 2-3 sem | Ecoles, mentors |

### Risques et mitigation

| Risque | Mitigation |
|:-------|:-----------|
| **V1.5 (tests) ralentit la livraison** | Les tests sont ecrits EN PARALLELE des features (TDD) |
| **IA (V1.8) coute en API** | Utiliser le meme systeme de fallback multi-provider que la revue IA |
| **Monetisation (V2.0) trop tardive** | Les affiliations rapportent DEJA ; Stripe n'est pas le seul levier |
| **PWA offline (V1.9) complexe** | Commencer par les lecons statiques en cache, etendre progressivement |
| **Streaks (V1.7) creent de l'anxiete** | Option de "freeze" (2 jours de repos par mois), jamais de perte d'XP acquise |

---

## Planning Semaine par Semaine — 2 prochains mois (20 juillet — 13 septembre 2026)

> Chaque semaine a un **objectif unique**, des **livrables concrets** et une **validation**.
> Les versions s'enchainent sans overlap : on termine une version avant de commencer la suivante.

### Semaine 1 — 20 au 26 juillet 🧪 V1.5.1 — Tests unitaires & dette critique

**Objectif :** la base de tests est posee, les failles de securite les plus graves sont corrigees.

| Jour | Livrables |
|:-----|:----------|
| Lun 20 | Config vitest + coverage + premier test qui passe sur `lib/grades.ts` |
| Mar 21 | Tests `lib/tracks.ts` (CRUD, inscription, progression) |
| Mer 22 | Tests `lib/userProjects.ts` + `lib/onboarding.ts` |
| Jeu 23 | Tests `lib/auth.ts` + `lib/aiReview.ts` |
| Ven 24 | Fix **SQL injection** (`excludedTrackIds`) + **Rate limiting** API |
| Sam 25 | Correction **3 erreurs TypeScript** residuelles + `lib/displayName.ts` tests |
| Dim 26 | **Validation :** `npx vitest` vert, `npx tsc --noEmit` vert, build OK, regression rapide |

**Jalon de fin de semaine :** ✅ Les 7 modules `lib/` critiques sont testés, les 3 erreurs TS sont corrigées, le rate limiter est en place.

---

### Semaine 2 — 27 juillet au 2 août 🔒 V1.5.2 — Securite, RPC, E2E & CI/CD

**Objectif :** les RPCs SQL sont testees, les tests E2E couvrent le parcours critique, la CI/CD protege le main.

| Jour | Livrables |
|:-----|:----------|
| Lun 27 | Tests RPC SQL : `submit_lesson_quiz`, `submit_lesson_project`, `community_projects` |
| Mar 28 | Tests RPC SQL : `public_leaderboard`, `create_project_comment` |
| Mer 29 | **Validation Zod** : schemas pour toutes les entrees API |
| Jeu 30 | **Playwright E2E** : test onboarding complet + test cycle lecon |
| Ven 31 | **Playwright E2E** : test dashboard + navigation publique |
| Sam 1 | **CI/CD GitHub Actions** : tests a chaque push + harmonisation accents UI |
| Dim 2 | **Validation + regression :** tous les tests passent, build OK, `.env.example` sync |

> ℹ️ React Query est deferé : la migration sera faite de manière incrémentale, un composant à la fois,
> au fil des versions V1.6-V1.9. Pas de sprint dédié.

**Jalon de fin de semaine :** ✅ Les RPCs critiques sont testees, l'onboarding est automatise en E2E, la CI/CD tourne sur GitHub.

---

### Semaine 3 — 3 au 9 août 💬 V1.6.1 — Activite, commentaires & likes

**Objectif :** les membres peuvent voir un fil d'activite, commenter et liker les projets.

| Jour | Livrables |
|:-----|:----------|
| Lun 3 | **Fil d'activite** sur /communaute (RPC `activity_feed` + composant UI) |
| Mar 4 | **Commentaires** : RPC `create_comment`, `list_comments`, composant de saisie |
| Mer 5 | **Likes** : table `project_likes`, RPC `toggle_like`, compteur UI |
| Jeu 6 | **Filtres** : publies/en cours + tri recent/popularite |
| Ven 7 | **Badge "Projet en ligne"** : affichage carte projet + profil |
| Sam 8 | **Page projet publique** (/projets/[id]) : description, URLs, auteur, badges |
| Dim 9 | **Validation + regression :** les 4 fonctionnalites marchent, tous les tests passent, build OK |

**Jalon de fin de semaine :** ✅ Le fil d'activite, les commentaires, les likes, les filtres et la page projet publique sont en ligne.

---

### Semaine 4 — 10 au 16 août 👥 V1.6.2 — Profils enrichis, notifications, marketplace

**Objectif :** les profils montrent tout le parcours du membre, les notifications sont temps reel, la marketplace est amorcee.

| Jour | Livrables |
|:-----|:----------|
| Lun 10 | **Profil public enrichi** : bio, skills, projets publies, badges, stats, lien portfolio |
| Mar 11 | **Notifications temps reel** (Supabase Realtime) : commentaire, like, mention |
| Mer 12 | **Invitation a collaborer** : email + in-app, workflow acceptation/refus |
| Jeu 13 | **Publication moderee** : workflow soumettre -> file admin -> modere -> publie |
| Ven 14 | **Recherche full-text** (pg_trgm) sur les projets + questions et signalements |
| Sam 15 | **Equipes** : creer, inviter, roles (lecture/edition/admin) |
| Dim 16 | **Marketplace de services** : page, depots de services, commission plateforme + **regression** |

**Jalon de fin de semaine :** ✅ V1.6 livree — la communaute est vivante, les profils sont riches, la marketplace est en place.

---

### Semaine 5 — 17 au 23 août 🔥 V1.7 — Streaks, portfolio & partage social

**Objectif :** chaque membre a une raison quotidienne de revenir (streaks) et chaque projet termine devient une vitrine virale (portfolio automatique + partage).

| Jour | Livrables |
|:-----|:----------|
| Lun 17 | **Migration SQL** : `current_streak INT`, `longest_streak INT`, `last_active_date DATE` dans `user_profiles` |
| Mar 18 | **RPC `check_streak()`** : verifie et met a jour la serie chaque jour + trigger auth |
| Mer 19 | **Affichage streak dashboard** + XP bonus progressif (x1.5, x2, x3) |
| Jeu 20 | **Badges de serie** (bronze/argent/or/diamant) + confettis aux milestones |
| Ven 21 | **Portfolio automatique** : page `/portefolio/[username]` + template |
| Sam 22 | **Partage social** : boutons LinkedIn/Twitter/WhatsApp sur les jalons |
| Dim 23 | **Calendrier personnel** + **notification streak en danger** (email/notif) + **regression** |

**Jalon de fin de semaine :** ✅ V1.7 livree — les streaks tournent, les portfolios sont en ligne, le partage social est actif.

---

### Semaine 6 — 24 au 30 août 🤖 V1.8.1 — Tuteur IA contextuel dans les lecons

**Objectif :** chaque lecon a un assistant IA qui repond aux questions du membre et reformule le contenu.

| Jour | Livrables |
|:-----|:----------|
| Lun 24 | **Backend tuteur IA** : API route `/api/lessons/tutor` avec contexte de lecon + fallback provider |
| Mar 25 | **UI Chatbot** : composant flottant dans la lecon, historique des messages |
| Mer 26 | **Bouton "Explique-moi autrement"** : reformulation automatique selon le niveau du membre |
| Jeu 27 | **Suggestions automatiques** : "Les membres ont aussi demande..." + questions frequentes |
| Ven 28 | **Historique des questions** : page dediee `/dashboard/tutor-history` |
| Sam 29 | **Mode oral** (Web Speech API) : parler a l'assistant + reponse vocale |
| Dim 30 | **Tests** : simulation de questions, verification du fallback provider + **regression** |

> ℹ️ Prérequis : GitHub OAuth app doit être enregistrée AVANT la semaine 7 (callback URL, client ID/secret, scope).

**Jalon de fin de semaine :** ✅ Le tuteur IA repond dans chaque lecon, le mode oral marche, l'historique est consultable.

---

### Semaine 7 — 31 aout au 6 septembre 🧠 V1.8.2 — Parcours personnalise & revue de code

**Objectif :** le parcours s'adapte au membre (forces/faiblesses) et le depot GitHub est analyse par l'IA.

| Jour | Livrables |
|:-----|:----------|
| Lun 31 | **Analyse du profil** : collecte des resultats quiz, temps passe, type de projet |
| Mar 1 | **Recommandation dynamique** : prochain module suggere selon les forces/faiblesses |
| Mer 2 | **Contournement intelligent** + difficulte adaptative |
| Jeu 3 | **Alerte "zone de confusion"** : detecter les lecons bloquantes et proposer de l'aide |
| Ven 4 | **Revue de code IA GitHub OAuth** : connexion depot + analyse a chaque push |
| Sam 5 | **Badge "Code audite par IA"** + generation automatique de quiz |
| Dim 6 | **Tests** : scenarios de personnalisation, revue de code simulatee + **regression** |

**Jalon de fin de semaine :** ✅ V1.8 livree — le parcours s'adapte, le code GitHub est audite, les quiz sont generes automatiquement.

---

### Semaine 8 — 7 au 13 septembre 🌙 V1.9 — Mode sombre, PWA offline & contenu enrichi

**Objectif :** le site s'adapte au theme prefere, les lecons sont consultables offline, le contenu est enrichi.

> ⚠️ **Perimetre reduit volontairement :** l'accessibilite WCAG AA complete et l'export PDF/certificat
> sont deplaces en V2.x pour tenir le planning des 8 semaines. On livre l'essentiel utilisateur.

| Jour | Livrables |
|:-----|:----------|
| Lun 7 | **Mode sombre/clair** : bascule, persistance, palette de couleurs inversee |
| Mar 8 | **PWA** : service worker, manifest.json, installation sur mobile |
| Mer 9 | **Lecons consultables hors-ligne** : cache des 10 dernieres lecons + synchro quiz offline |
| Jeu 10 | **Lecons bonus** : Flexbox Froggy, Grid Garden, Tailwind (liens interactifs integres dans les lecons) |
| Ven 11 | **Enrichir banque de questions** : 10+ questions par module sur les nouveaux parcours |
| Sam 12 | **Raccourcis clavier** + mode concentrateur |
| Dim 13 | **Validation + regression + mise a jour Nouveautes** |

**Jalon de fin de semaine :** ✅ V1.9 livree — mode sombre, PWA offline, contenu enrichi.

---

### Deferé en V2.x — Accessibilite & export

Ces items sont identifies mais sortis du perimetre des 8 premieres semaines :

- **Accessibilite WCAG AA** complete (labels ARIA, navigation clavier, annonces lecteur d'ecran)
- **Export PDF** des lecons et certificat de completion verifiable
- **Mode contraste eleve** pour les lecons

---

### Semaine 9+ — A partir du 14 septembre 💰 V2.0 — Monetisation

*(si les 8 premieres semaines tiennent le planning — sinon, ce planning glisse d'autant)*

| Jour | Livrables |
|:-----|:----------|
| Lun 14 | Stripe Connect setup + webhooks + table `subscriptions` |
| Mar 15 | Page tarifs dynamique synchronisee Stripe |
| Mer 16 | Plans Premium / Launch avec gates |
| Jeu 17 | Portail client Stripe |
| Ven 18 | Certification verifiee + badge LinkedIn |
| Sam 19 | Marketplace mentors + templates premium |
| Dim 20 | Tableau de bord revenus + rapports affiliation + regression |

---

### Synthese visuelle — Calendrier 8 semaines

```
Juillet                   Aout                            Septembre
20  27   3   10  17  24  31   7   14
│   │   │   │   │   │   │   │   │
███ V1.5.1 ███ V1.5.2 ███ V1.6.1 ███ V1.6.2 ███ V1.7 ███ V1.8.1 ███ V1.8.2 ███ V1.9 ███
Tests     Securite   Commu     Commu     Streaks   Tuteur    Parcours  Polish
unitaires +RPC/E2E   +Likes    +Profil   +Portfolio IA        perso     +PWA
                      +Comms    +Notif              +Chatbot  +Revue    +Contenu
                                +Market                       code
```

### Regles du jeu

1. **Une semaine = un objectif.** Pas de multitasking entre versions.
2. **Tout livrable a son test.** On n'ajoute pas de code sans test qui va avec.
3. **Le vendredi est le jour de buffer.** Si la semaine derive, on rattrape vendredi.
4. **Le dimanche est le jour de validation.** On ne commence pas la semaine suivante si la precedente n'est pas validee.
5. **Si une version glisse d'une semaine**, on ne la compresse pas : on decale tout le planning. La qualite prime.

---

## Idées complémentaires — au-delà du planning 8 semaines

> Cette section rassemble des concepts créatifs qui ne sont pas dans la roadmap immédiate
> mais qui pourraient être intégrés lors des phases de `V2.x` ou comme features transverses.
> Classés par impact estimé (🔴 fort / 🟠 moyen / 🟡 complémentaire).

### 🟡 AI Project Coach — Un coach IA de bout en bout

Un assistant qui suit le membre de l'idée au cash, différemment du tuteur IA (V1.8) :

- **Phase Idée :** l'IA pose des questions pour cadrer le projet, challenger le modele de revenu, estimer le temps
- **Phase Construction :** l'IA analyse la progression, detecte les blocages, propose des ajustements de deadline
- **Phase Cash :** l'IA suggere des strategies de monetisation selon le type de projet et le marché
- **Dashboard coach :** un fil de discussion permanent avec l'IA dédié au projet, pas à la leçon
- **Rapport hebdomadaire :** "Cette semaine tu as avancé sur X, tu es en retard sur Y, voici ce qu'il faut prioriser"

> 💡 Différence avec V1.8 : le tuteur IA aide sur le contenu pedagogique ; le Project Coach aide sur le PROJET lui-meme.

---

### 🟡 Study Buddy — Matching IA entre membres

L'IA match les membres par niveau, projet similaire et disponibilité :

- **Paires d'apprentissage :** deux membres au meme niveau avancent ensemble sur un parcours
- **Groupes de projet :** 3-5 membres avec des competences complementaires forment une equipe autour d'un projet commun
- **Check-in automatique :** "Vous etes jumelé avec X depuis 3 jours. Comment ca se passe ?"
- **XP duo :** bonus quand les deux membres d'une paire valident une lecon le meme jour
- **Badge "Team Player"** : pour ceux qui completent un projet en groupe

> 💡 Impact retention fort : les membres qui apprennent en groupe reviennent 2x plus.

---

### 🟠 Code Playground — Environnement d'execution dans le navigateur

Un bac à sable pour exécuter du code sans quitter la plateforme :

- **Editeur HTML/CSS/JS** embeddé dans chaque lecon de code
- **Apercu en direct** : chaque modification s'affiche instantanément (façon CodePen/JSFiddle)
- **Templates de démarrage** : "Pars de ce squelette React" directement dans la leçon
- **Partage de snippet** : les membres peuvent partager leur code playground avec la communauté
- **Versionning** : chaque version du code playground est sauvegardée (revient en arrière si besoin)

> 💡 Utilise `@uiw/react-codemirror` déjà dans les dépendances — extension naturelle.

---

### 🟠 Voice Learning — Apprendre en écoutant

Transformer les leçons en contenu audio :

- **Lecture audio automatique** de chaque leçon (synthèse vocale IA)
- **Mode podcast** : enchainement automatique des leçons en playlist
- **Download MP3** pour écouter hors-ligne (dans les transports, en cuisinant)
- **Bookmarks vocaux** : "Reprendre à 12:34"
- **Vitesse ajustable** : 1x, 1.25x, 1.5x, 2x

> 💡 Ciblé marché africain : beaucoup de membres apprennent sur mobile dans les transports.

---

### 🟠 Digital Twin — Jumeau numérique du membre

L'IA construit un profil de compétences dynamique :

- **Carte de compétences** : chaque leçon validée ajoute une competences à la carte
- **Niveau estimé** : basé sur les quiz, les projets et le temps passé (pas seulement les XP)
- **Profil exportable** : JSON structuré avec toutes les competences, niveau, projets realisés
- **Analyse des écarts** : "Pour decrocher un contrat freelance en dev web, il te manque la compétence X"
- **Recommandation de carrière** : "Avec ton profil, les missions les plus demandeuses sont..."

> 💡 Monétisable en V2.0 : le rapport de compétences détaillé peut être une feature Premium.

---

### 🟡 Gamification Avancée — Au-delà des streaks

- **Défis hebdomadaires :** "Complete 3 leçons cette semaine pour gagner 200 XP bonus"
- **Séries de quiz parfait :** badge "Perfect Quiz Streak" (10 quiz d'affilée sans erreur)
- **Palier de projet :** badge "Full Stack" (projet front + back + BDD), badge "Deployed" (projet mis en ligne)
- **Compétition amicale :** comparer sa progression avec un ami sur le même parcours
- **Classement par pays :** voir le top 10 de son pays (déjà les drapeaux sont la — à exploiter)
- **Niveaux débloquables :** débloquer des fonctionnalités (mode sombre, statistiques avancées) en atteignant certains grades

---

### 🟡 Automatisation de l'admin — Gagner du temps côté admin

- **Génération automatique de contenu** : l'IA crée un plan de module + quiz + micro-projet à partir d'un titre
- **Modération IA des commentaires** : détection des spams et contenus inappropriés avant validation humaine
- **Rapport de santé** : alerte si un parcours a un taux d'abandon élevé (les membres décrochent à une leçon spécifique)
- **Suggestions d'amélioration** : l'IA analyse les feedbacks des membres et propose des améliorations de contenu
- **Onboarding automatisé des mentors** : formulaire de candidature, vérification IA, activation

---

> **L'i18n est transverse a toutes les versions.** Voir section `V1.4.3` ci-dessus pour le statut detaille
> et `RAPPORT_LOCALISATION.md` pour l'audit complet. Chaque nouvelle page est concue bilingue.

---

### 🟡 Projets Open Source — Contribution et visibilité

- **Takatack** : la plateforme elle-même devient un projet open source que les membres peuvent contribuer (issue, PR, review)
- **Badge "Contributeur"** : pour ceux qui participent au code de la plateforme
- **GitHub OAuth** (déjà en V1.8.2) + section "Mes contributions" sur le profil
- **Hackathon de contribution** : un week-end par mois, les membres améliorent la plateforme
- **Roadmap publique** : les issues GitHub visibles depuis le dashboard

---

### 🟡 Mobile App — Au-delà de la PWA

Si la PWA (V1.9) montre un bon engagement mobile, envisager :

- **React Native / Expo** app pour iOS et Android
- **Notifications push natives** (APNs / FCM)
- **Camera/QR code** natif pour scanner les QR codes de portfolio
- **Paiement in-app** (Stripe ou Mobile Money directement dans l'app)
- **Widget "Streak"** sur l'écran d'accueil du téléphone
- **Sync offline avancée** : télécharger un parcours complet et le suivre sans connexion

---

### 🟡 Analyse de données & Insights

- **Heatmap des parcours** : visualiser où les membres passent du temps, où ils décrochent
- **Taux de conversion ideal→cash** : quel pourcentage de membres avec une idée arrivent au premier euro
- **Prédiction de réussite** : l'IA predit, à 2 semaines d'inscription, si le membre va publier son projet
- **Benchmark communautaire** : "Tu es dans le top 15% des membres de ton parcours"
- **Rapport de progression visuel** : graphique montrant l'evolution des competences dans le temps

---

### 🟡 Intégrations tierces

- **Calendrier Google / Outlook** : synchroniser les deadlines du projet
- **Slack / Discord** : notifications de progression, jalons, commentaires
- **Notion** : exporter les leçons et ressources dans un workspace Notion
- **GitHub** (déjà en V1.8.2) : plus poussé — créer automatiquement un repo au démarrage du projet
- **Vercel / Netlify API** : déploiement en 1 clic depuis le dashboard (sans quitter TakaCode)

---

### 🔥 Top 3 des idées à prioriser (si on devait en choisir 3)

| Idée | Effort | Impact | Pourquoi |
|:-----|:------:|:------:|:---------|
| **AI Project Coach** | 1-2 sem | 🔴 Fort | Différenciation ultime : aucun concurrent n'a ça |
| **Code Playground** | 1 sem | 🟠 Moyen | Utilise les dépendances existantes, UX immédiate |
| **Study Buddy** | 1-2 sem | 🟠 Moyen | Rétention x2, peu de code, beaucoup de valeur sociale |

---

### Comment intégrer ces idées au planning

Chaque idée peut être :

1. **Greffée dans une version existante** : "Code Playground" comme feature transverse ajoutée aux leçons (pendant V1.8 ou V1.9)
2. **Devenue une version à part entière** : "V2.2 — AI Project Coach" après la monetisation
3. **Feature Premium** : "Digital Twin" et "Voice Learning" comme argument de vente du plan Launch
4. **Quick win** : les défis hebdomadaires (gamification avancée) peuvent être ajoutés en 2-3 jours pendant V1.7

> 💡 Conseil : garder cette liste comme **backlog glissant** — à chaque fin de version, on pioche 1-2 idées à intégrer dans la version suivante.

---

## Build to Earn — La plateforme de business digitaux 🚀

> **Vision :** TakaCode n'est pas qu'une plateforme d'apprentissage. C'est l'endroit où les membres
> **construisent** des business digitaux et **gagnent** de l'argent. Le parcours d'apprentissage n'est
> que le tremplin — le vrai produit, c'est le business que le membre lance depuis la plateforme.
>
> Objectif : **devenir incontournable dans le digital** en Afrique francophone et au-delà.

---

### 💰 V3.0 — Place de marché digitale intégrée (4-6 semaines)

> **Pourquoi maintenant :** les membres construisent des projets, mais ils ne peuvent pas encore les
> monétiser DIRECTEMENT depuis la plateforme. La place de marché est le pont entre "j'ai construit"
> et "je gagne de l'argent". Tout ce qui suit est ce pont.

#### 3.1 — Paiements unifiés (le socle)

- [ ] **Stripe Connect** (cartes bancaires, cartes internationales)
- [ ] **Orange Money API** (paiement direct depuis le dashboard — mobile money francophone)
- [ ] **MTN MoMo API** (paiement direct — mobile money Afrique anglophone et francophone)
- [ ] **Wave API** (paiement direct — Sénégal, Côte d'Ivoire, Burkina, Bénin)
- [ ] **Conversion automatique** entre moyens de paiement (le membre voit tout en CFA/EUR)
- [ ] **Portefeuille TakaCode** : solde interne (dépôt, vente, retrait) — réduit les frais de transaction
- [ ] **Paiement en plusieurs fois** via Mobile Money (Wave et Orange Money le permettent)

> 💡 **Avantage concurrentiel :** AUCUNE plateforme d'apprentissage n'intègre le Mobile Money africain.
> Les membres n'auront pas besoin de quitter TakaCode pour encaisser.

---

#### 3.2 — Boutique de produits digitaux intégrée

Chaque membre peut **créer et vendre** depuis son dashboard TakaCode :

- [ ] **Création de produit** : titre, description, prix, fichier/lien, image, catégorie
- [ ] **Livraison automatique** : après paiement, le fichier/lien est délivré automatiquement
- [ ] **Pages de vente** : générées automatiquement (template personnalisable)
- [ ] **Taux de commission** : 10% TakaCode, 90% créateur (objectif : descendre à 5% à volume)
- [ ] **Licence de revente** : option "Private Label Rights" — les membres peuvent revendre ce qu'ils achètent
- [ ] **Produits physiques** : pour les membres qui vendent des impression, t-shirts, livres (print-on-demand)
- [ ] **Catalogue communautaire** : tous les produits digitaux des membres en un seul endroit

> **Exemple :** Un membre suit le parcours "Création de contenu avec l'IA", crée un pack de 10 prompts
> pour générer des scripts YouTube, et le vend 5€ sur la boutique TakaCode. La plateforme prend 0,50€.

---

#### 3.3 — Marketplace Freelance & Services

- [ ] **Dépôt de mission** : un client (externe ou membre) poste un besoin
- [ ] **Catalogue de freelances** : profil, compétences, projets réalisés, note
- [ ] **Soumission** : les freelances candidate avec leur offre
- [ ] **Contrat sécurisé** : les fonds sont séquestrés (Stripe Connect ou portefeuille TakaCode)
- [ ] **Commission TakaCode** : 10% sur chaque mission
- [ ] **Système de feedback** : client note le freelance, freelance note le client
- [ ] **Missions réservées** : certains projets premium réservés aux membres certifiés

> **Pourquoi c'est incontournable :** les membres construisent des compétences SUR TakaCode.
> Ils doivent pouvoir trouver des clients SUR TakaCode. Boucle fermée.

---

#### 3.4 — SaaS Builder & Abonnements

- [ ] **Création de SaaS en 5 étapes** : idée → fonctionnalités → pricing → page produit → déploiement
- [ ] **Intégration Stripe/Orange Money** pour les encaissements récurrents
- [ ] **Espace membre intégré** : chaque SaaS créé reçoit un sous-domaine `nom.takacode.app`
- [ ] **Dashboard de suivi** : nombre d'abonnés, revenus mensuels récurrents (MRR), churn
- [ ] **Templates SaaS prêts à personnaliser** : SaaS de facturation, SaaS de réservation, SaaS de contenu payant
- [ ] **API keys** : les membres peuvent exposer une API depuis leur SaaS

> **Exemple :** Un membre crée "PlanifPro", un SaaS de prise de rendez-vous pour artisans.
> Il le vend à 10€/mois à 20 clients = 200€/mois de revenu. TakaCode prend 20€. Tout est géré depuis la plateforme.

---

#### 3.5 — Revente & White Label

- [ ] **Programme de revente** : les membres peuvent revendre les templates et formations de la plateforme
- [ ] **Marque blanche** : un membre peut proposer les parcours TakaCode sous SA propre marque à ses clients
- [ ] **Commission de parrainage à 2 niveaux** : 10% sur les achats du filleul, 5% sur ceux de son filleul
- [ ] **Pack "Prêt à revendre"** : formations, templates, scripts prêts à être marqués et revendus
- [ ] **Licence entreprise** : une entreprise achète un accès à la plateforme pour ses employés (B2B)

> **Exemple :** Un influenceur digital revend le parcours "Création de contenu avec l'IA" sous sa marque
> à 100 personnes. TakaCode gère la livraison, l'influenceur touche 50% de commission.

---

#### 3.6 — Financement de projets (Crowdfunding)

- [ ] **Campagne de financement** : un membre présente son projet et fixe un objectif de collecte
- [ ] **Paiement via portefeuille TakaCode** : les membres peuvent investir
- [ ] **Contreparties** : accès anticipé, réduction, part des revenus futurs
- [ ] **Badge "Backer"** : pour ceux qui financent des projets
- [ ] **Suivi des fonds** : transparent, avec paliers de déblocage
- [ ] **Commission TakaCode** : 5% sur les fonds collectés (uniquement si l'objectif est atteint)

> **Pourquoi c'est puissant :** un membre qui a une idée mais pas les moyens de la builder trouve
> le financement DIRECTEMENT sur la plateforme où il a appris. Boucle complète.

---

### 🎯 Indicateurs clés de la vision Build to Earn

| Métrique | Objectif à 12 mois | Pourquoi c'est important |
|:---------|:------------------:|:-------------------------|
| **Membres ayant déclaré leur 1er euro** | 30% des inscrits | Indicateur n°1 de la mission |
| **Produits digitaux vendus/mois** | 1000+ | Volume de la marketplace |
| **Revenu moyen par créateur/mois** | 150€ | Preuve que "ça marche" |
| **Missions freelance réalisées/mois** | 200 | Vitalité de la marketplace services |
| **SaaS actifs créés sur la plateforme** | 50 | Indicateur d'innovation |
| **Revenu TakaCode/mois** | 5000€ | Viabilité du modèle (affiliations + commissions) |

---

### 🏆 Comment TakaCode devient incontournable

| Levier | Comment on l'active | Pourquoi personne d'autre ne le fait |
|:-------|:--------------------|:-------------------------------------|
| **Mobile Money intégré** | Orange Money, MTN MoMo, Wave via API directes | Aucune plateforme éducative ne le fait (barrière technique) |
| **Boucle fermée** | Apprendre → Construire → Vendre → Gagner TOUT sur TakaCode | Les concurrents séparent apprentissage et vente |
| **Écosystème plutôt que cours** | Le membre arrive pour apprendre, reste pour vendre, revient pour grandir | Churn proche de zéro |
| **Coût d'entrée zéro** | Créer un compte, apprendre, construire : gratuit. Payer uniquement sur les ventes | Pas de barrière à l'entrée |
| **IA partout** | Assistant IA, revue de code, tuteur, project coach | L'IA multiplie la productivité du membre |
| **Communauté qui paie** | Les membres deviennent clients les uns des autres | Marché captif qui se nourrit lui-même |
| **Marque blanche** | N'importe qui peut revendre sous sa marque | Viralité exponentielle (influenceurs, formateurs) |

---

### 📈 Scénario de déploiement recommandé

```
Phase 1 (V2.0 — existant)  ██ Stripe Connect + abonnements Premium/Launch
Phase 2 (V3.1 — 4-6 sem)   ██ Paiements Mobile Money (Orange, MTN, Wave) — ⚠️ documents entreprise requis
Phase 3 (V3.2 — 3 sem)     ██ Boutique produits digitaux intégrée
Phase 4 (V3.3 — 4 sem)     ██ SaaS Builder + sous-domaines
Phase 5 (V3.4 — 3 sem)     ██ Marketplace Freelance + Contrats sécurisés — ⚠️ validation légale
Phase 6 (V3.5 — 2 sem)     ██ Revente & Marque blanche — ⚠️ cadre juridique PLR
Phase 7 (V3.6 — 4-6 sem)   ██ Crowdfunding — ⚠️ régulation AMF à vérifier
```

> ⚠️ **Prérequis légal :** les phases marquées ⚠️ nécessitent une validation juridique avant implémentation
> (fonds séquestrés, crowd equity, droits de revente). Prévoir un budget conseil juridique.
>
> ⚠️ **Prérequis opérationnel (Phase 2) :** l'intégration Orange Money / MTN MoMo / Wave nécessite
> des documents d'entreprise (RCCM, patente, identification fiscale). À préparer AVANT la phase 2.
>
> Soit environ **8-10 mois** pour la vision Build to Earn complète (estimations réalistes).
> Chaque phase est autonome : on peut s'arrêter à n'importe quelle phase et déjà générer des revenus.
> La V2.1 (Scale & Communauté V2) reste entre V2.0 et V3.1 — elle n'est pas remplacée.

---

### 🔥 Pourquoi TakaCode gagne sur ce modèle

| Concurrent | Force | Faiblesse | Notre avantage |
|:-----------|:------|:----------|:---------------|
| **Gumroad** | Vente de produits digitaux simple | Pas d'apprentissage, pas de communauté africaine | Apprendre + Vendre + Mobile Money |
| **systeme.io** | Tout-en-un marketing | Pas de code, pas de projets techniques | Projets digitaux réels, pas juste des formations |
| **Ko-fi** | Dons et tips | Pas de structure de projet, pas de parcours | Projets professionnels, pas de petits dons |
| **Lemon Squeezy** | Paiements SaaS internationaux | Pas axé Afrique, pas de communauté | Mobile Money africain, communauté locale |
| **Chariow** | Mobile Money africain | Pas de formation, pas de communauté | Formation + Vente, écosystème complet |
| **OpenClassrooms** | Formation reconnue | Pas de vente, pas de business | Apprendre POUR vendre, pas juste apprendre |

> **Positionnement unique :** TakaCode est le seul endroit où un créateur africain peut
> **apprendre → builder → vendre → gagner → grandir** sans jamais quitter la plateforme.

---

### 👑 Le "tout-en-un" du créateur digital africain

```
┌─────────────────────────────────────────────────────────────┐
│                    TAKACODE                                  │
│  La seule plateforme dont tu as besoin                      │
│                                                              │
│  1. J'APPRENDS  →  Parcours, quiz, micro-projets             │
│  2. JE BUILD    →  Projet, template, SaaS, code              │
│  3. JE VENDS    →  Boutique, freelance, abonnements          │
│  4. JE GAGNE    →  Orange Money, MTN MoMo, Wave, Stripe     │
│  5. JE GRANDIS  →  Communauté, mentoring, certification      │
└─────────────────────────────────────────────────────────────┘
```

> **C'est ça, être incontournable.** Quand un créateur digital a TOUT ce dont il a besoin
> au même endroit, il n'a aucune raison d'aller ailleurs.

---

## Correctif UX : Filtrage intelligent des parcours selon le projet du membre 🧭

> **Problème identifié :** quand un membre a un projet "Site web" en cours, la page des parcours
> lui montre TOUS les parcours (dont ceux sur "Bot de trading", "Web3", etc.) qui ne sont pas
> pertinents pour lui. Il doit chercher manuellement ce qui correspond à son projet.
>
> **Solution :** ne montrer QUE les parcours liés au `goal_key` du projet en cours.
> Un bouton "Voir plus de parcours" affiche le reste.

### Logique de filtrage

```
Projet du membre (ex: "Application mobile")
    ↓
goal_key = "mobile_app"
    ↓
Page parcours → filtres par défaut : goal_key = "mobile_app"
    ↓
Bouton "Voir plus de parcours" → désactive le filtre, montre tout
```

### Détail technique

- [ ] **API** : modifier `listPublishedTracks()` dans `lib/tracks.ts` pour accepter un paramètre optionnel `goalKey`
- [ ] **UI Dashboard** : sur `/dashboard/parcours`, détecter le `goal_key` du projet principal du membre
- [ ] **Filtre par défaut** : si un projet actif existe, ne montrer que les parcours avec `goal_key` correspondant
- [ ] **CTA "Voir plus de parcours"** : lien qui recharge la liste sans filtre (visible uniquement si un filtre est actif)
- [ ] **Badge indicateur** : "🎯 Parcours recommandés pour ton projet" en-tête de la section filtrée
- [ ] **Message si aucun parcours filtré** : "Aucun parcours spécifique à ce type de projet. Voir tous les parcours."
- [ ] **Admin** : page d'administration continue d'afficher TOUS les parcours (pas de filtre — l'admin doit tout voir)
- [ ] **Page publique /parcours** : pas de filtre non plus (le visiteur n'a pas de projet)

> 💡 **Prévu dans la semaine 3** du planning (V1.6.1 en complément du fil d'activité).

---

## Assistant IA multi-agents 🤖

> **Évolution de V1.8 :** au lieu d'un seul assistant IA générique, un écosystème d'agents spécialisés
> qui travaillent en parallèle. Chaque agent a un role précis, un modèle de connaissances, et des outils dédiés.

### Architecture multi-agents

```
┌─────────────────────────────────────────────────────┐
│                    Orchestrateur                      │
│  Recoit la demande, route vers le bon agent           │
├─────────────────────────────────────────────────────┤
│                                                       │
│   Agent 1         Agent 2         Agent 3             │
│   🎓 Tuteur       🧭 Guide        📝 Correcteur       │
│   Répond aux      Suggère le     Corrige les          │
│   questions sur   prochain       micro-projets        │
│   la leçon en     module selon   et les quiz          │
│   cours           le profil                          │
│                                                       │
│   Agent 4         Agent 5         Agent 6             │
│   🔍 Veille       💰 Business     👥 Communauté       │
│   Scanne le web   Conseille      Match les           │
│   pour mettre     sur la         membres pour         │
│   à jour les      monétisation   du pair-learning     │
│   parcours        du projet                           │
│                                                       │
└─────────────────────────────────────────────────────┘
```

#### Agent 1 — Tuteur pédagogique (V1.8)
- Répond aux questions sur la leçon en cours
- Reformule, donne des exemples, adapte le niveau
- Utilise le contenu de la leçon comme contexte

#### Agent 2 — Guide de parcours (V1.8)
- Analyse la progression du membre
- Suggère le prochain module optimal
- Détecte les zones de confusion et propose des ressources

#### Agent 3 — Correcteur de micro-projets
- Évalue les soumissions (déjà en partie avec la revue IA actuelle)
- Donne un feedback détaillé avec pistes d'amélioration
- Note automatiquement la qualité (lisibilité, complétude, pertinence)

#### Agent 4 — Veille technologique automatique 🔬

> **Ce que le membre a demandé :** un agent qui met à jour les parcours automatiquement.

- [ ] **Scanne quotidiennement** les sources officielles : docs Next.js, React, Supabase, etc.
- [ ] **Détecte les changements** : nouvelle version d'une librairie, dépréciation, breaking change
- [ ] **Génère des mises à jour** : patch notes, nouvelles leçons, mise à jour des ressources
- [ ] **Soumet une proposition** de mise à jour du parcours (file d'attente pour validation admin)
- [ ] **Badge "Contenu frais"** sur les leçons mises à jour depuis moins de 7 jours
- [ ] **Notification admin** : "Le parcours X a été mis à jour par l'agent de veille. Valider les changements ?"
- [ ] **Alerte breaking change** : "React 19 a déprécié Y — 3 leçons sont impactées dans le parcours Z"

> **Impact :** les parcours restent à jour SANS effort humain. Différenciation concurrentielle MAJEURE.
> Aucune plateforme d'apprentissage ne fait de veille technologique automatisée.

#### Agent 5 — Coach business
- Conseille sur le modèle de revenu à choisir
- Analyse le marché et la concurrence pour l'idée du membre
- Suggère des stratégies de pricing, positionnement, acquisition
- Intégré au Project Coach (voir idées complémentaires)

#### Agent 6 — Matchmaking communauté
- Propose des binômes de pair-learning (comme le Study Buddy)
- Suggère des mentors selon les objectifs du membre
- Recommande des projets complémentaires pour collaborer

---

### 🧪 Phase 0 : Agent de veille (quick win prioritaire)

Parmi tous les agents, l'**Agent 4 (Veille technologique)** est le plus différenciant
et peut être mis en place rapidement :

| Jour | Livrable |
|:-----|:---------|
| Jour 1 | Script de crawl des docs officielles (Next.js, React, Supabase, Tailwind, TypeScript) |
| Jour 2 | Comparaison avec le contenu existant en BDD (détection de différences) |
| Jour 3 | Génération de propositions de mise à jour + file de validation admin |
| Jour 4 | Interface admin "Propositions de mise à jour" + notifications |
| Jour 5 | Test + déploiement |

> **Ressource :** l'infrastructure IA existante (multi-provider avec fallback) est réutilisable.
> L'agent de veille utilise le même système que la revue IA.

---

## 🔮 Vision 2030 — TakaCode dans 4 ans

> **Où sera TakaCode en 2030 ?** Voici une vision ambitieuse mais cohérente avec la trajectoire
> actuelle. Chaque année, la plateforme franchit un palier.

### 2027 — L'écosystème Build to Earn

- La boutique digitale et le Mobile Money tournent à plein régime
- 500+ produits digitaux vendus par mois sur la plateforme
- Les premiers membres gagnent leur vie avec TakaCode (revenu principal > 1000€/mois)
- Programme de parrainage à 2 niveaux : les membres deviennent des ambassadeurs
- Première levée de fonds (seed round) pour accélérer

### 2028 — L'IA native

- Les 6 agents IA sont en production (tuteur, guide, correcteur, veille, business, matchmaking)
- Les parcours se mettent à jour automatiquement via l'agent de veille
- L'assistant IA est devenu LE point d'entrée : les membres discutent avec l'IA pour tout
- Le parcours personnalisé dynamique est mature (chaque membre a un chemin unique)
- Génération automatique de nouveaux parcours par l'IA (squelette + contenu + quiz)
- **Révolution :** un membre peut générer un parcours sur n'importe quel sujet en 30 minutes

### 2029 — La plateforme incontournable

- **100 000+ membres actifs** mensuels
- **10 000+ créateurs** qui gagnent de l'argent sur la plateforme
- Reconnaissance : TakaCode est cité comme "le WP pour les créateurs digitaux africains"
- Partenariats avec les opérateurs télécom (Orange, MTN) pour des offres data gratuites sur la plateforme
- **App mobile native** : tout le parcours est disponible hors-ligne, synchro automatique
- Mode B2B : écoles, universités, entreprises utilisent TakaCode pour former leurs équipes
- **Certification reconnue** par les entreprises partenaires (embauche prioritaire des certifiés)

### 2030 — L'infrastructure du digital africain

- **1 million+ de membres** (cumulé depuis le lancement)
- **50 000+ projets digitaux** lancés depuis la plateforme
- **100M€+ de revenus générés** par les membres (cumulé)
- TakaCode est **incontournable** : tout créateur digital en Afrique francophone passe par la plateforme
- **Fondation TakaCode** : programme de bourses pour les jeunes talents africains
- **Académie physique** : 5 campus (Abidjan, Dakar, Yaoundé, Cotonou, Kinshasa) avec des espaces de coworking
- **Réseau de mentors** : 10 000+ mentors certifiés actifs
- **API ouverte** : les services TakaCode (paiement, certification, matching) sont utilisés par d'autres plateformes
- **Assistant IA personnel** : chaque membre a un jumeau IA qui connaît son parcours, ses compétences, ses objectifs et l'accompagne au quotidien
- **Place de marché de projets** : les entreprises déposent des briefs, les membres les réalisent et sont payés — le tout sans quitter TakaCode
- **TakaCode OS** : le système d'exploitation du créateur digital (tout-en-un : apprendre, builder, vendre, gérer, grandir)

### Jalons clés de la décennie

```
2026 ─── Lancement du planning 8 semaines + Build to Earn V3.x
  │
2027 ─── Écosystème Build to Earn mature + premiers revenus significatifs
  │
2028 ─── Agents IA généralisés + génération automatique de parcours
  │
2029 ─── 100k membres + app native + certification reconnue + B2B
  │
2030 ─── 1M membres + 5 campus + TakaCode OS + fondation
  │
2031+ ── Expansion panafricaine (anglophone + lusophone)
```

### 😱 Ce qui semble fou aujourd'hui mais sera normal en 2030

| Aujourd'hui en 2026 | En 2030 |
|:--------------------|:--------|
| "Apprendre à coder" | "Parler à l'IA pour builder" (le code est abstrait) |
| "Chercher un freelance sur Malt/Fiverr" | "Demander à TakaCode de matcher un créateur certifié" |
| "Créer un site avec Wix" | "Créer une app complète en 30 min avec l'IA TakaCode" |
| "Payer par carte bancaire" | "Payer par Mobile Money, crypto, ou crédit TakaCode" |
| "Diplôme universitaire" | "Certification TakaCode vérifiée sur la blockchain" |
| "Apprendre seul chez soi" | "Apprendre en communauté, en binôme IA, en réalité mixte" |
| "Un créateur = un freelance" | "Un créateur = un entrepreneur avec son équipe et ses outils" |
| "Plateforme éducative" | "Système d'exploitation complet du créateur digital" |

> **Cette vision 2030 n'est pas un fantasme : c'est la trajectoire logique de ce qui est déjà
> en construction.** Chaque version de la roadmap est un pas vers ce futur.
>
> **La seule limite, c'est la conviction.** Et celle-ci est déjà là.
