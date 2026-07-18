# TakaCode

Le GPS des createurs de projets : chaque membre cree un projet digital, se forme via
des parcours accelerateurs (IA, dev web, vibe coding...), construit de vrais livrables
valides par IA/pairs/mentors, publie son projet et vise son premier euro.

**Stack** : Next.js 16 (App Router, TypeScript strict) · Supabase (Postgres, Auth, RLS,
Storage) · Tailwind · deploye sur Vercel.

**Docs** :
- [ROADMAP_EVOLUTION.md](./ROADMAP_EVOLUTION.md) — source de verite produit (versions, reste a faire)
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
