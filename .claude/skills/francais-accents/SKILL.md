---
name: francais-accents
description: Corrige le francais (accents, apostrophes) du contenu BDD et des textes UI de TakaCode, en preservant les zones en polices display VALORAX/VENITE qui n'ont pas les glyphes accentues. A utiliser apres un re-seed, un ajout de contenu, ou quand du texte sans accents apparait sur le site.
---

# Français & accents TakaCode

## La règle typographique du projet

Les polices display **VALORAX** et **VENITE** (assets/font-valorax, assets/font-venite-adoremus)
**n'ont pas les glyphes accentués**. Tout texte affiché avec elles doit rester SANS accents.
Tout le reste du site (corps de texte, navigation, contenu BDD) doit être en français correct
(accents + apostrophes).

**Zones display (JAMAIS d'accents)** :
- classes CSS : `font-valorax`, `font-venite`, `font-venite-italic`, `section-label`
- balises `h1`…`h6` (VALORAX par défaut via `app/globals.css`, règle « Global title rule »)
- props `title=` / `subtitle=` de `PageHeader` et clé `title:` de `setCelebration`
  (rendues en VALORAX/section-label)

**Tout le reste (accents OBLIGATOIRES)** : `font-body-readable`, texte par défaut,
placeholders, descriptions, contenu des parcours/quiz en base.

## Les 3 outils (dans `scripts/`)

Le moteur de règles est partagé : `scripts/french-rules.mjs` (élisions déterministes,
« à + infinitif » sur liste blanche, dictionnaire ~350 mots, bigrammes pour les ambigus).

| Commande | Rôle |
|---|---|
| `node scripts/fix-french-ui.mjs --inventory` | Liste les textes en polices display → `INVENTAIRE_POLICES_DISPLAY.md` |
| `node scripts/fix-french-ui.mjs` puis `--apply` | Corrige les textes UI dans `app/` et `components/` (hors zones display) |
| `node scripts/fix-french-content.mjs` puis `--apply` | Corrige le contenu BDD (parcours, modules, leçons, banque de quiz) |
| `node scripts/repair-elision.mjs` puis `--apply` | Répare les corruptions connues d'anciennes versions du moteur |

## Procédure

1. **Toujours dry-run d'abord** (sans `--apply`) et LIRE les échantillons AVANT/APRES.
2. Appliquer, puis vérifier :
   - `npx next build` doit rester vert ;
   - `git diff` : contrôler qu'aucune ligne `href=`, `value=`, slug, `select(...)`,
     clé d'objet ou nom d'icône n'a changé ;
   - insertions = suppressions dans `git diff --stat` (corrections ligne à ligne).
3. Pour la BDD : relancer `fix-french-content.mjs --apply` après **tout re-seed**
   (les seeds SQL historiques sont sans accents ; les nouveaux seeds comme
   `seed-creation-contenu-ia.mjs` sont déjà accentués).

## Pièges connus (déjà rencontrés — ne pas les réintroduire)

- **`\b` de JS est ASCII** : « affiliés et » a une fausse frontière après « é ».
  Toujours utiliser les frontières `B_START`/`B_END` de `french-rules.mjs`.
- **Impératif vs participe** : ne JAMAIS mapper un verbe en `-e` vers un participe `-é`
  dans le dictionnaire (`connecte→connecté` a corrompu « Connecte ton dépôt »).
  Les participes se traitent par bigrammes contextuels (« créé par », « a généré »).
- **Chaînes techniques** : listes de colonnes SQL (`"id, role, points"`), slugs,
  URLs, `lucide:`, valeurs d'enum en base (`"publicite"`, `"vente"`) ne doivent
  jamais être touchées. `fix-french-ui.mjs` les protège ; en édition manuelle, vérifier.
- **Chaînes entre apostrophes simples** : y insérer une apostrophe casse la syntaxe JS ;
  le script les ignore (convertir la chaîne en guillemets doubles d'abord si besoin).
- **Mots indécidables** (`publie`, `ou`, `sur`, `des`, `resume` isolés) : on ne les
  corrige pas automatiquement — bigrammes contextuels uniquement.
- **Noms de produits et domaines** : `systeme.io` ne doit jamais devenir `système.io`.
  `B_END` refuse « .lettre » pour ça ; en écrivant du contenu, garder les noms de
  marques tels quels même s'ils ressemblent à des mots français.
- **Marques anglaises** : « Think Media » ne doit jamais devenir « Think Média ».
  Liste `PROTECTED` dans `french-rules.mjs` (placeholder avant pipeline, restauration
  après) — y ajouter toute nouvelle marque contenant un mot corrigeable.

## Étendre le dictionnaire

Un mot sans accent apparaît encore sur le site ? L'ajouter dans `WORDS` (ou `BIGRAMS`
si ambigu) dans `scripts/french-rules.mjs`, en minuscules (la variante Capitalisée est
générée). Puis relancer les deux dry-runs et vérifier les échantillons.

## Écrire du nouveau texte

- Titres/headings (h1-h6, valorax/venite, `title=` de PageHeader) : MAJUSCULES sans accents.
- Tout autre texte : français correct avec accents et apostrophes, directement à l'écriture.
