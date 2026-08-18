# TakaCode

**Une idee devient un projet. Un projet devient une opportunite.**

TakaCode aide chacun a transformer une idee, une competence ou une envie d'entreprendre
en projet reel, termine, publie et valorisable. Un projet n'est pas forcement du code :
un SaaS, un agent IA, une boutique en ligne, une formation, une chaine YouTube, un
podcast, une activite freelance ou un produit digital sont tous des projets, avec des
livrables differents. L'objectif n'est pas simplement d'apprendre — **l'objectif est de
faire**.

Trois facons de commencer : **BUILD** (« j'ai une idee »), **CHALLENGES** (« je veux
construire, mais je ne sais pas quoi »), **MISSIONS** (« je veux travailler sur un vrai
besoin »).

Tout est explique dans [VISION.md](./VISION.md), y compris les **roles** a respecter dans
les docs comme dans les textes du site : *Visiteur* (pas encore de compte), *Membre*,
*Builder*, *Contributor*, *Mentor*, *Expert*.

> **TakaCode — Passe de « je sais faire » a « je l'ai fait ».**

**Stack** : Next.js 16 (App Router, TypeScript strict) · Supabase (Postgres, Auth, RLS,
Storage) · Tailwind · deploye sur Vercel.

**Docs** :
- [VISION.md](./VISION.md) — le document de reference : probleme, projet, entrees, roles, boucle, modele, jalons, risques
- [BUSINESS_MODEL.md](./BUSINESS_MODEL.md) — le detail du modele economique (§06 de la vision)
- [ROADMAP_REPOSITIONNEMENT.md](./ROADMAP_REPOSITIONNEMENT.md) — ce que chaque jalon implique dans l'app (§07 de la vision)
- [ROADMAP_EVOLUTION.md](./ROADMAP_EVOLUTION.md) — les versions livrees et ce qu'il reste a faire
- [RAPPORT_OPERATIONNEL.md](./RAPPORT_OPERATIONNEL.md) — etat operationnel courant (audit, installation)
- [ANALYSIS_GUIDE.md](./ANALYSIS_GUIDE.md) — guide d'architecture pour developpeurs
- [INSTRUCTIONS.md](./INSTRUCTIONS.md) — prompt produit d'origine (historique)

## Lancer en local

```bash
npm install
npm run dev
```

## Variables d'environnement

Copie `.env.example` vers `.env.local` et remplis les valeurs. L'essentiel :

```env
# Supabase (requis)
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...   # scripts admin + verdict IA cote serveur

# Admins bootstrap (fallback par email avant le bootstrap DB)
TAKACODE_ADMIN_EMAILS=toi@exemple.com

# Revue IA des micro-projets (optionnel — bascule en revue manuelle sinon)
AI_REVIEW_PROVIDER=openrouter          # openrouter | gemini | huggingface
AI_REVIEW_FALLBACK=gemini,huggingface
AI_REVIEW_OPENROUTER_API_KEY=sk-or-v1-...
```

Le detail complet (modeles par provider, cles specifiques) est dans `.env.example`.

## Initialiser la base Supabase

Deux familles de scripts, dans cet ordre :

1. **Scripts numerotes** (SQL Editor Supabase) : execute `supabase/sql/001` a
   `supabase/sql/026` dans l'ordre. Dans `002_bootstrap_admin.sql`, remplace
   `EMAIL_PLACEHOLDER` par ton email. Le seed des parcours est dans `005` (puis
   `019`-`025` pour la banque de questions et les contenus additionnels).
2. **Migrations CLI** : `supabase db push` applique `supabase/migrations/`
   (banque de questions, durcissement des RPC, versions de parcours, profil avance,
   storage des fichiers projet, modele de revenu, premier euro, classement).

Puis :

```bash
# Creer / promouvoir un admin
node scripts/bootstrap-admin.mjs --email toi@exemple.com --password "MotDePasseFort"

# Restaurer accents et apostrophes du contenu (a relancer apres tout re-seed)
node scripts/fix-french-content.mjs --apply

# Seed du parcours "Creation de contenu avec l'IA" (YouTube faceless)
node scripts/seed-creation-contenu-ia.mjs

# Seed du parcours "Produits digitaux : creer et vendre" (Build to Earn)
node scripts/seed-produits-digitaux.mjs

# Seed des parcours avances : automatisations/chatbots, web3, bot de trading
node scripts/seed-parcours-avances.mjs

# Seed des suggestions de liens d'affiliation (creees depubliees)
node scripts/seed-affiliations-suggestions.mjs

# Module "Plateformes de vibe coding" (Lovable, Bolt, v0) dans full-vibe-coding
node scripts/seed-vibe-plateformes.mjs
```

## Build

```bash
npm run build
npm start
```

## Reperes codebase

- `app/(app)/dashboard` — espace membre (cockpit projet, parcours, projets, reviews...)
- `app/(app)/admin` — administration + studio de creation de parcours
- `app/parcours/[slug]/lecon/[lessonSlug]` — experience lecon (quiz, micro-projet)
- `lib/` — acces donnees et logique (curriculum, aiReview, userProjects, tracks...)
- `supabase/sql` + `supabase/migrations` — schema, RPC security definer, seeds
- `scripts/` — bootstrap admin, correction du contenu francais
