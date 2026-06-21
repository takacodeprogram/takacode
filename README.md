# TakaCode

Site Next.js pour TakaCode (pages publiques, auth/onboarding, dashboard prive, integration Supabase SSR).

## Lancer en local

```bash
npm install
npm run dev
```

## Variables d'environnement

Cree un fichier `.env.local` avec:

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...

# Requis pour creer/promouvoir un admin via script Node
SUPABASE_SERVICE_ROLE_KEY=...

# Optionnel: fallback admin par email (utile avant bootstrap DB)
TAKACODE_ADMIN_EMAILS=toi@exemple.com,coadmin@exemple.com

# Optionnel: mot de passe par defaut pour scripts
SUPABASE_TAKACODE_PASSWORD=...
```

## Activer roles, points, grades et referral (Supabase SQL)

Execute ces scripts dans l'ordre dans le SQL Editor Supabase:

1. `supabase/sql/001_roles_points_referrals.sql`
2. `supabase/sql/002_bootstrap_admin.sql` (remplace `EMAIL_PLACEHOLDER`)

Ce socle cree:
- `public.user_profiles` (role, points, grade, referral_code)
- `public.referral_events` (historique des gains de parrainage)
- les triggers pour creation auto de profil et attribution des points referral
- les policies RLS admin/utilisateur

## Creer ou promouvoir un admin (script)

```bash
node scripts/bootstrap-admin.mjs --email toi@exemple.com --password "TonMotDePasseFort"
```

Options:
- `--name "Nom Admin"`
- `--points 2000`

## Build

```bash
npm run build
npm start
```
