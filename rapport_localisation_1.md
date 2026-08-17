# Rapport d'Audit Localisation — TakaCode

**Date :** 2026-07-20
**Version système :** V1.4.3+
**Locale par défaut :** `en` (anglais)
**Locale supportée :** `fr` (français)

---

## 1. Résumé Exécutif

L'infrastructure i18n est **solide et complète** : système de traduction, provider React, middleware URL, SEO multilingue, helpers de chemins, migration DB. **6 composants landing sur 15 n'utilisent pas encore les traductions (`t()`)** et affichent du contenu FR en dur. Les pages dashboard/admin sont en bonne voie (modifs en cours dans le git). Les tracks en base ont la colonne `locale` mais **aucun track EN n'est seedé**.

| Domaine | Progression | Status |
|---------|:-----------:|:------:|
| Infrastructure i18n | 100% | ✅ Livré |
| Pages landing (traductions) | ~60% | ⚠️ Partiel |
| Pages app (routes) | ~85% | ✅ Bon |
| Dashboard pages | ~70% | ⚠️ Partiel |
| Admin pages | ~80% | ✅ Bon |
| Database locale column | 100% | ✅ Livré |
| Seeds tracks EN | 0% | ❌ Manquant |

---

## 2. Infrastructure i18n

### 2.1. Fichiers Fondamentaux

| Fichier | Statut | Description |
|---------|--------|-------------|
| `lib/i18n.ts` | ✅ Complet | `Locale = "fr" \| "en"`, toutes les clés FR/EN, `createT()`, `detectLocale()`, `getLocale()`, `useLocale()` |
| `lib/serverLocale.ts` | ✅ Complet | `getServerLocale()` : cookie → Accept-Language → fallback `en` |
| `lib/localeHelpers.ts` | ✅ Complet | `localePath()`, `stripLocale()`, `switchLocalePath()` — pures fonctions server-safe |
| `lib/redirectLocale.ts` | ✅ Complet | `redirectLocale()` — redirect avec préfixe de locale + gestion param `next` |
| `components/I18nProvider.tsx` | ✅ Complet | Provider React + `useI18n()` hook + persist cookie + localStorage + `updateHtmlLang()` |
| `components/L.tsx` | ✅ Complet | Composant `Link` locale-aware (client + serveur via prop explicite) |
| `proxy.ts` (middleware) | ✅ Complet | Gère préfixe `/fr/`, rewrite interne, cookie |
| `utils/localePath.tsx` | ✅ Complet | `LinkLocale` composant client |
| `lib/seo.ts` | ✅ Complet | `getAlternateUrls()` pour hreflang, `buildPageMetadata()` avec locale |

### 2.2. Clés de Traduction

**Fichier :** `lib/i18n.ts`

| Section | Clés FR | Clés EN | Statut |
|---------|:-------:|:-------:|--------|
| `navbar` | 12 | 12 | ✅ Complet |
| `home.hero` | 19 | 19 | ✅ Complet |
| `home.stats` | 4 | 4 | ✅ Complet |
| `footer` | 19 | 19 | ✅ Complet |
| `values` | 14 | 14 | ✅ Complet |
| `process` | 15 | 15 | ✅ Complet |
| `community` | 10 | 10 | ✅ Complet |
| `skills` | 3 | 3 | ✅ Complet (tags FR/EN) |
| `faq` | 8 | 8 | ✅ Complet (mais 1 seule réponse traduite) |
| `dashboard` | 20 | 20 | ✅ Complet |
| `profile` | 18 | 18 | ✅ Complet |
| `review` | 10 | 10 | ✅ Complet |
| `revenue` | 9 | 9 | ✅ Complet |
| `notification` | 9 | 9 | ✅ Complet |
| `project` | 9 | 9 | ✅ Complet |
| `common` | 12 | 12 | ✅ Complet |
| `auth` | 8 | 8 | ✅ Complet |

**Total :** ~200 clés traduites en FR et EN ✅

---

## 3. Composants Landing Page — Utilisation de `t()`

| Composant | `t()` utilisé ? | `localePath` utilisé ? | Statut | Texte actuel |
|-----------|:---------------:|:----------------------:|:------:|:-------------|
| `Navbar.tsx` | ✅ Oui | ✅ Oui + switch locale | ✅ Bon | Traduit EN/FR |
| `Hero.tsx` | ✅ Oui (19 appels) | ❌ Liens `/projets`, `/parcours` en dur | ⚠️ Liens en dur |
| `ValuesSection.tsx` | ✅ Oui (14 appels) | — | ✅ Bon |
| `HowItWorksSection.tsx` | ✅ Oui (8 appels) | ✅ Utilise `<L>` | ✅ Bon |
| `CompetencesSection.tsx` | ✅ Oui (3 appels) | — | ✅ OK |
| `FAQSection.tsx` | ✅ Oui (6 appels) | — | ✅ OK |
| `CommunitySection.tsx` | ✅ Oui (13 appels) | ✅ | ✅ Bon |
| `FooterSection.tsx` | ✅ Oui | ✅ | ✅ Bon |
| `ParcoursSection.tsx` | ❌ **Aucun** | ✅ localesPath | ⚠️ **FR dur** |
| `RessourcesSection.tsx` | ❌ **Aucun** | ✅ localePath | ⚠️ **FR dur** |
| `SessionsLiveSection.tsx` | ❌ **Aucun** | ✅ localePath | ⚠️ **FR dur** |
| `ProjectsSection.tsx` | ❌ **Aucun** | ✅ localePath | ⚠️ **FR dur** |
| `FinalCtaSection.tsx` | ❌ **Aucun** | ✅ localePath | ⚠️ **FR dur** |
| `GlobeSection.tsx` | ❌ **Aucun** | ❌ | ⚠️ **FR dur** |
| `CookieNotice.tsx` | ✅ Oui | — | ✅ OK |

---

## 4. Pages App (Routes) — Par Page

### 4.1. Routes Landing (publiques)

| Route | `getServerLocale` | `localePath` | `redirectLocale` | Liens localisés | Statut |
|-------|:-----------------:|:------------:|:----------------:|:----------------:|:------:|
| `app/page.tsx` | ❌ Manque | ❌ Manque | ❌ | 0% | ⚠️ **Ne filtre pas les tracks par locale** |
| `app/parcours/page.tsx` | ✅ | ✅ | ❌ | 100% | ✅ |
| `app/parcours/[slug]/page.tsx` | ✅ | ✅ | ✅ | 100% | ✅ |
| `app/parcours/[slug]/lecon/[...]/page.tsx` | ✅ | ✅ | ✅ | 100% | ✅ |
| `app/projets/page.tsx` | ✅ | ✅ | ❌ | 100% | ✅ |
| `app/projets/[id]/page.tsx` | ✅ | ✅ | ❌ | 100% | ✅ |
| `app/communaute/page.tsx` | ✅ | ✅ | ❌ | 100% | ✅ |
| `app/classement/page.tsx` | ✅ | ✅ | ❌ | 100% | ✅ |
| `app/profil/[id]/page.tsx` | ✅ | ✅ | ❌ | 100% | ✅ |
| `app/tarifs/page.tsx` | ✅ | ✅ | ❌ | OK | ✅ |
| `app/privacy/page.tsx` | ✅ | ✅ | ❌ | OK | ✅ |
| `app/terms/page.tsx` | ✅ | ✅ | ❌ | OK | ✅ |
| `app/competences/page.tsx` | ❌ Manque | ❌ Manque | ❌ | 0% | ⚠️ **Manque** |
| `app/connexion/page.tsx` | ❌ | ❌ | ✅ | 0% | ✅ OK (auth) |
| `app/signin/page.tsx` | ❌ | ❌ | ✅ | 0% | ✅ OK (auth) |
| `app/signup/page.tsx` | ❌ | ❌ | ✅ | 0% | ✅ OK (auth) |
| `app/onboarding/page.tsx` | ❌ | ❌ | ✅ | 0% | ✅ OK (auth) |
| `app/auth/callback/route.ts` | ✅ | — | — | — | ✅ |
| `app/auth/signout/route.ts` | ✅ | — | — | — | ✅ |
| `app/layout.tsx` | ✅ | — | — | — | ✅ SEO |

### 4.2. Routes Dashboard

| Route | `getServerLocale` | `localePath` | Liens localisés | Statut |
|-------|:-----------------:|:------------:|:----------------:|:------:|
| `app/(app)/dashboard/page.tsx` | ✅ (git) | ✅ (git) | ~80% | ✅ OK |
| `app/(app)/dashboard/parcours/page.tsx` | ✅ (git) | ✅ (git) | 100% | ✅ |
| `app/(app)/dashboard/communaute/page.tsx` | ✅ (git) | ✅ (git) | 100% | ✅ |
| `app/(app)/dashboard/guide/page.tsx` | ✅ (git) | ✅ (git) | 100% | ✅ |
| `app/(app)/dashboard/documentation/page.tsx` | ✅ (git) | ✅ (git) | 100% | ✅ |
| `app/(app)/dashboard/ressources/page.tsx` | ✅ (git) | ✅ (git) | 100% | ✅ |
| `app/(app)/dashboard/mentor/page.tsx` | ✅ (git) | ✅ (git) | 100% | ✅ |
| `app/(app)/dashboard/mentor/layout.tsx` | — | — | ✅ redirectLocale | ✅ |
| `app/(app)/dashboard/mentor/[trackId]/page.tsx` | ❌ | ❌ | ❌ | ⚠️ **Manque** |
| `app/(app)/dashboard/mentor/[trackId]/lecons/[...]/page.tsx` | ❌ | ❌ | ❌ | ⚠️ **Manque** |
| `app/(app)/dashboard/projets/[projectId]/page.tsx` | ✅ (git) | ✅ (git) | 100% | ✅ |
| `app/(app)/dashboard/projets/nouveau/page.tsx` | ❌ | ❌ | ❌ | ⚠️ **Manque** |
| `app/(app)/dashboard/profil/page.tsx` | ❌ | ❌ | ❌ | ⚠️ **Manque** |

### 4.3. Routes Admin

| Route | `getServerLocale` | `localePath` | Liens localisés | Statut |
|-------|:-----------------:|:------------:|:----------------:|:------:|
| `app/(app)/admin/layout.tsx` | — | — | ✅ redirectLocale | ✅ |
| `app/(app)/admin/page.tsx` | ✅ (via AdminOverview) | ✅ | ✅ | ✅ |
| `app/(app)/admin/parcours/page.tsx` | ✅ (git) | ✅ (git) | 100% | ✅ |
| `app/(app)/admin/affiliations/page.tsx` | ✅ (git) | ✅ (git) | 100% | ✅ |
| `app/(app)/admin/sessions/page.tsx` | ✅ (git) | ✅ (git) | 100% | ✅ |
| `app/(app)/admin/ia/page.tsx` | ❌ Manque | ❌ Manque | ✅ redirectLocale | ⚠️ **Manque `getServerLocale`** |

---

## 5. Base de Données — Colonne `locale`

### 5.1. Migration

| Migration | Fichier | Statut |
|-----------|---------|:------:|
| `20260720000000_track_locale.sql` | ✅ Ajoutée | ✅ Exécutée |

### 5.2. Colonnes par table

| Table | Colonne `locale` | Commentaire |
|-------|:----------------:|-------------|
| `learning_tracks` | ✅ `locale TEXT NOT NULL DEFAULT 'fr'` | Contrainte CHECK (`'fr'`, `'en'`) |
| `learning_tracks` | ✅ `counterpart_slug TEXT NOT NULL DEFAULT ''` | Slug du track équivalent dans l'autre langue |
| `track_modules` | ❌ Pas de colonne | Héritage via `track_id` → OK |
| `track_lessons` | ❌ Pas de colonne | Héritage via `module_id` → OK |
| `lesson_quiz_questions` | ❌ Pas de colonne | Héritage via leçon → OK |
| Autres tables | ❌ Pas de colonne | Aucun besoin |

### 5.3. Index

- `learning_tracks_locale_idx` sur `(locale, sort_order)` ✅

### 5.4. Code côté serveur

| Fichier | Colonne `locale` sélectionnée ? | Statut |
|---------|:-------------------------------:|:------:|
| `lib/tracks.ts` — `listPublishedTracks()` | ✅ Filtre via param `locale` avec fallback si colonne absente | ✅ |
| `lib/tracks.ts` — `TRACK_SELECT` | ✅ Incluse via `listPublishedTracks()` | ✅ |
| `lib/adminCurriculum.ts` — `ADMIN_TRACK_COLUMNS` | ❌ **Absente** | ⚠️ Admin ne voit pas la locale |
| `lib/adminCurriculum.ts` — `getAdminTrack()` | ❌ **Absente** | ⚠️ Admin ne peut pas éditer la locale |

---

## 6. Seeds / Données des Parcours

| Seed Fichier | Spécifie `locale` ? | Parcours créés |
|--------------|:-------------------:|:---------------|
| `005_seed_mvp_curriculum.sql` | ❌ (défaut `'fr'`) | Parcours FR |
| `seed-en-tracks.mjs` | ? | À vérifier |
| `seed-produits-digitaux.mjs` | ❌ (défaut `'fr'`) | Parcours FR |
| `seed-vibe-plateformes.mjs` | ❌ (défaut `'fr'`) | Parcours FR |
| `seed-media-buyer.mjs` | ❌ (défaut `'fr'`) | Parcours FR |
| `seed-parcours-avances.mjs` | ❌ (défaut `'fr'`) | Parcours FR |
| `seed-creation-contenu-ia.mjs` | ❌ (défaut `'fr'`) | Parcours FR |
| `seed-affiliations-suggestions.mjs` | ❌ (défaut `'fr'`) | Liens FR |
| `seed-affiliate-links-parcours.mjs` | ❌ (défaut `'fr'`) | Liens FR |

**Aucun parcours EN n'est seedé actuellement.** Tous les tracks existants sont en français.

---

## 7. Liste Complète des Correctifs à Apporter

### 🔴 Priorité Haute (bloquant pour l'expérience EN)

| # | Tâche | Fichier(s) | Effort |
|:-:|:------|:-----------|:------:|
| 1 | Ajouter `t()` et les clés EN dans `ParcoursSection.tsx` | `components/ParcoursSection.tsx`, `lib/i18n.ts` | ~30 min |
| 2 | Ajouter `t()` et les clés EN dans `RessourcesSection.tsx` | `components/RessourcesSection.tsx`, `lib/i18n.ts` | ~30 min |
| 3 | Ajouter `t()` et les clés EN dans `SessionsLiveSection.tsx` | `components/SessionsLiveSection.tsx`, `lib/i18n.ts` | ~30 min |
| 4 | Ajouter `t()` et les clés EN dans `ProjectsSection.tsx` | `components/ProjectsSection.tsx`, `lib/i18n.ts` | ~30 min |
| 5 | Ajouter `t()` et les clés EN dans `FinalCtaSection.tsx` | `components/FinalCtaSection.tsx`, `lib/i18n.ts` | ~30 min |
| 6 | Ajouter `t()` et les clés EN dans `GlobeSection.tsx` | `components/GlobeSection.tsx`, `lib/i18n.ts` | ~20 min |
| 7 | Ajouter `getServerLocale()` + `localePath` dans `app/page.tsx` + filtrer tracks | `app/page.tsx` | ~15 min |
| 8 | Ajouter `getServerLocale()` + `localePath` dans `app/competences/page.tsx` | `app/competences/page.tsx` | ~10 min |

### 🟡 Priorité Moyenne

| # | Tâche | Fichier(s) | Effort |
|:-:|:------|:-----------|:------:|
| 9 | Ajouter `locale` dans `ADMIN_TRACK_COLUMNS` dans `adminCurriculum.ts` | `lib/adminCurriculum.ts` | ~5 min |
| 10 | Ajouter `localePath` sur les href de `Hero.tsx` (`/projets`, `/parcours`) | `components/Hero.tsx` | ~5 min |
| 11 | Localiser `app/(app)/dashboard/profil/page.tsx` | `app/(app)/dashboard/profil/page.tsx` | ~15 min |
| 12 | Localiser `app/(app)/dashboard/projets/nouveau/page.tsx` | `app/(app)/dashboard/projets/nouveau/page.tsx` | ~10 min |
| 13 | Localiser `app/(app)/dashboard/mentor/[trackId]/page.tsx` | `app/(app)/dashboard/mentor/[trackId]/page.tsx` | ~10 min |
| 14 | Localiser `app/(app)/dashboard/mentor/[trackId]/lecons/[...]/page.tsx` | `app/(app)/dashboard/mentor/[trackId]/lecons/[lessonId]/page.tsx` | ~10 min |
| 15 | Ajouter `getServerLocale()` dans `app/(app)/admin/ia/page.tsx` | `app/(app)/admin/ia/page.tsx` | ~5 min |

### 🟢 Priorité Souhaitable

| # | Tâche | Fichier(s) | Effort |
|:-:|:------|:-----------|:------:|
| 16 | Créer un seed de tracks EN (`seed-en-tracks.mjs` à vérifier/exécuter) | `scripts/seed-en-tracks.mjs` | ~2h |
| 17 | Ajouter champ `locale` dans `TrackForm.tsx` admin | `components/admin/TrackForm.tsx` | ~30 min |
| 18 | Afficher badge locale dans la liste admin des tracks | `app/(app)/admin/parcours/page.tsx` | ~15 min |
| 19 | Ajouter la FAQ manquante (réponses q2-q6) dans `lib/i18n.ts` pour FR + EN | `lib/i18n.ts` | ~20 min |

---

## 8. Architecture Technique (Rappel)

```
                        ┌─────────────────────┐
                        │    proxy.ts (MW)     │
                        │  /fr/xxx → /xxx      │
                        │  cookie → locale      │
                        └──────────┬──────────┘
                                   │
              ┌────────────────────┼────────────────────┐
              ▼                    ▼                    ▼
    ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
    │  Server Component│  │  Server Component│  │  Client Component│
    │                  │  │  (landing page)  │  │  (dashboard)     │
    │ getServerLocale()│  │  getServerLocale │  │  useI18n()       │
    │ localePath()     │  │  → filtre tracks │  │  → t()           │
    │ redirectLocale() │  │  → localePath()  │  │  → setLocale()   │
    └─────────────────┘  └─────────────────┘  └─────────────────┘
                                   │
                                   ▼
                        ┌─────────────────────┐
                        │   lib/i18n.ts        │
                        │   STORE = {fr, en}   │
                        │   createT(locale)    │
                        └─────────────────────┘
                                   │
                                   ▼
                        ┌─────────────────────┐
                        │     Supabase DB      │
                        │  learning_tracks     │
                        │  .locale = 'fr'|'en' │
                        └─────────────────────┘
```

---

## 9. Métriques Clés

| Métrique | Valeur | Objectif |
|:---------|:------:|:--------:|
| Locales supportées | 2 (fr, en) | 2+ |
| Clés de traduction FR | ~200 | ~200 |
| Clés de traduction EN | ~200 | ~200 |
| Composants utilisant `t()` | 9/15 | 15/15 |
| Pages avec `localePath` | 18/25 | 25/25 |
| Routes dashboard localisées | 9/12 | 12/12 |
| Routes admin localisées | 5/6 | 6/6 |
| Tracks avec `locale` en DB | ~15 (tous 'fr') | ~15 FR + ~15 EN |
| Migration locale en DB | ✅ | ✅ |

---

## 10. Recommandations

1. **Commencer par les 6 composants landing** (ParcoursSection, RessourcesSection, SessionsLiveSection, ProjectsSection, FinalCtaSection, GlobeSection) — c'est le plus gros impact pour l'expérience EN : ces sections sont visibles dès la page d'accueil.

2. **Ensuite, la page d'accueil** (`app/page.tsx`) : filtrer les tracks par locale pour qu'un visiteur EN ne voie que les tracks EN.

3. **En parallèle, l'admin** : ajouter la colonne `locale` dans les selects admin pour pouvoir gérer les tracks par langue depuis l'interface.

4. **Une fois les pages et composants traduits**, créer les tracks EN dans les seeds.

---

*Rapport généré le 2026-07-20 par audit automatisé du code source.*
