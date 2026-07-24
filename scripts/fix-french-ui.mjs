// Corrige le français (accents, apostrophes) des textes UI dans app/ et components/,
// SAUF les zones affichées en polices display VALORAX / VENITE qui n'ont pas les
// glyphes accentués. Zones protégées :
//   - classes : font-valorax, font-venite, font-venite-italic, section-label
//   - balises h1..h6 (VALORAX par défaut via globals.css)
//   - props/clés title= / title: / subtitle= / subtitle: (PageHeader, CelebrationOverlay)
//
// Usage :
//   node scripts/fix-french-ui.mjs --inventory   # liste les textes en police display
//   node scripts/fix-french-ui.mjs               # dry-run : rapport des corrections
//   node scripts/fix-french-ui.mjs --apply       # applique les corrections
//
// Conservateur par construction :
//   - seules les chaînes entre guillemets doubles/backticks CONTENANT UN ESPACE
//     sont traitées (jamais les slugs, urls, ids, valeurs techniques sans espace)
//   - exception : les chaînes précédées de `label:` (toujours de l'affichage)
//   - les segments avec / : { } @ sont ignorés (urls, lucide:, template strings)
//   - le texte JSX entre > et < est traité ; les lignes de prose pure aussi
import { readFileSync, writeFileSync, readdirSync, statSync } from "fs";
import { join } from "path";
import { fixText } from "./french-rules.mjs";

const MODE = process.argv.includes("--apply") ? "apply" : process.argv.includes("--inventory") ? "inventory" : "dry";
const ROOTS = ["app", "components"];

const DISPLAY_LINE = /font-valorax|font-venite|section-label|<h[1-6][\s>]/;
const TITLE_PROP = /(?:\btitle|\bsubtitle)\s*[=:]\s*$/;

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    if (entry === "node_modules" || entry.startsWith(".")) continue;
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) walk(full, out);
    else if (/\.tsx$/.test(entry)) out.push(full);
  }
  return out;
}

// Corrige une chaîne quotée si elle ressemble à du texte naturel.
function fixQuoted(inner, before) {
  if (/[\/:{}@#]/.test(inner)) return inner; // url, lucide:, hex, template
  // Liste d'identifiants (select SQL, colonnes) : "id, role, points, grade..."
  const tokens = inner.split(",");
  if (tokens.length > 1 && tokens.every((t) => /^[a-z0-9_*]+$/.test(t.trim()))) return inner;
  const isLabel = /\blabel\s*:\s*$/.test(before);
  if (!inner.includes(" ") && !isLabel) return inner; // slug/valeur technique probable
  if (TITLE_PROP.test(before)) return inner; // titre display (VALORAX/VENITE)
  return fixText(inner);
}

// Corrige le texte JSX (entre > et <) d'un segment de code non quoté.
function fixJsxText(code) {
  return code.replace(/>([^<>{}]*[A-Za-z][^<>{}]*)</g, (m, text) => `>${fixText(text)}<`);
}

// Ligne de prose pure (texte JSX multi-ligne, sans code).
function isProseLine(trimmed) {
  return trimmed.length > 2
    && /^[A-Za-zÀ-ÿŒœ]/.test(trimmed)
    && / /.test(trimmed)
    && !/[={};<>"'`]/.test(trimmed)
    && !/^[A-Za-z_$][\w$]*\s*:/.test(trimmed) // cle d'objet ("role: profile.role,")
    && !/[\w$]\.[\w$]/.test(trimmed) // acces membre ("profile.role")
    && !/\b(return|const|let|var|case|import|export|await|function)\b/.test(trimmed);
}

function processLine(line) {
  const trimmed = line.trim();
  if (isProseLine(trimmed)) {
    return line.replace(trimmed, fixText(trimmed));
  }

  // Découpe en segments quotés (") (`) et non quotés. Les chaînes entre
  // apostrophes simples sont laissées telles quelles (une apostrophe ajoutée
  // casserait la syntaxe).
  let out = "";
  let i = 0;
  while (i < line.length) {
    const ch = line[i];
    if (ch === '"' || ch === "`") {
      const end = line.indexOf(ch, i + 1);
      if (end === -1) { out += line.slice(i); break; }
      const inner = line.slice(i + 1, end);
      out += ch + fixQuoted(inner, out) + ch;
      i = end + 1;
    } else if (ch === "'") {
      const end = line.indexOf("'", i + 1);
      if (end === -1) { out += line.slice(i); break; }
      out += line.slice(i, end + 1);
      i = end + 1;
    } else {
      // segment de code jusqu'à la prochaine quote
      const next = [...['"', "'", "`"].map((q) => line.indexOf(q, i)).filter((x) => x !== -1)];
      const end = next.length ? Math.min(...next) : line.length;
      out += fixJsxText(line.slice(i, end));
      i = end;
    }
  }
  return out;
}

const files = ROOTS.flatMap((r) => walk(r));
let totalFiles = 0;
let totalLines = 0;
const samples = [];
const inventory = [];

for (const file of files) {
  const src = readFileSync(file, "utf8");
  const lines = src.split("\n");
  const fixed = [];
  let displayDepth = 0; // > 0 : on est dans un bloc display multi-ligne
  let changedInFile = 0;

  for (const line of lines) {
    const isDisplayStart = DISPLAY_LINE.test(line);
    const inDisplay = isDisplayStart || displayDepth > 0;

    if (inDisplay && MODE === "inventory") {
      const texts = [...line.matchAll(/>([^<>{}]+)</g)].map((m) => m[1].trim()).filter((t) => /[A-Za-z]/.test(t));
      for (const t of texts) inventory.push({ file, text: t });
    }

    if (isDisplayStart && !/<\//.test(line)) {
      displayDepth = 1; // ouvre un bloc : on saute jusqu'à la fermeture
    } else if (displayDepth > 0 && /<\//.test(line)) {
      displayDepth = 0;
    }

    if (inDisplay) {
      fixed.push(line);
      continue;
    }

    const result = processLine(line);
    if (result !== line) {
      changedInFile++;
      totalLines++;
      if (samples.length < 25) samples.push({ file, before: line.trim().slice(0, 90), after: result.trim().slice(0, 90) });
    }
    fixed.push(result);
  }

  if (changedInFile > 0) {
    totalFiles++;
    if (MODE === "apply") writeFileSync(file, fixed.join("\n"));
    if (MODE !== "inventory") console.log(`${file}: ${changedInFile} ligne(s)`);
  }
}

if (MODE === "inventory") {
  const byFile = {};
  for (const { file, text } of inventory) (byFile[file] ||= new Set()).add(text);
  const md = [
    "# Inventaire des textes en polices display (VALORAX / VENITE)",
    "",
    "Généré par `node scripts/fix-french-ui.mjs --inventory`.",
    "Ces textes restent SANS accents : les polices display n'ont pas les glyphes accentués.",
    ""
  ];
  for (const [file, texts] of Object.entries(byFile)) {
    md.push(`## ${file}`);
    for (const t of texts) md.push(`- ${t}`);
    md.push("");
  }
  writeFileSync("INVENTAIRE_POLICES_DISPLAY.md", md.join("\n"));
  console.log(`Inventaire : ${inventory.length} textes display dans ${Object.keys(byFile).length} fichiers -> INVENTAIRE_POLICES_DISPLAY.md`);
} else {
  console.log(`\n${MODE === "apply" ? "APPLIQUÉ" : "DRY-RUN"} : ${totalLines} ligne(s) dans ${totalFiles} fichier(s)`);
  for (const s of samples) {
    console.log(`- ${s.file}\n  AVANT: ${s.before}\n  APRES: ${s.after}`);
  }
}
