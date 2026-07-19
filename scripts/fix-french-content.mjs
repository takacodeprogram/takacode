// Corrige le francais du contenu parcours/quiz en base :
//  1. apostrophes manquantes ("d un" -> "d'un", "qu elle" -> "qu'elle"...)
//  2. accents manquants via un dictionnaire adapte au corpus TakaCode
//
// Usage :
//   node scripts/fix-french-content.mjs           # dry-run : rapport sans ecrire
//   node scripts/fix-french-content.mjs --apply   # applique les corrections
//
// Rejouable a volonte (idempotent). A relancer apres un re-seed des parcours.
// Les champs techniques (slug, url, icon...) ne sont jamais touches.
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";

function loadEnv(file) {
  try {
    for (const line of readFileSync(file, "utf8").split(/\r?\n/)) {
      const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim().replace(/^"|"$/g, "");
    }
  } catch {}
}
loadEnv(".env.local");
loadEnv(".env");

const APPLY = process.argv.includes("--apply");
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY manquants (.env.local)");
  process.exit(1);
}
const supabase = createClient(url, key);

import { fixText } from "./french-rules.mjs";

// Champs techniques a ne jamais toucher dans les jsonb
const SKIP_KEYS = new Set(["slug", "url", "icon", "kind", "id", "key", "state", "status", "level", "answer", "validation", "difficulty", "source", "requires_link", "resource_url"]);

function fixValue(value, parentKey = "") {
  if (SKIP_KEYS.has(parentKey)) return value;
  if (typeof value === "string") return fixText(value);
  if (Array.isArray(value)) return value.map((v) => fixValue(v, parentKey));
  if (value && typeof value === "object") {
    const out = {};
    for (const [k, v] of Object.entries(value)) out[k] = fixValue(v, k);
    return out;
  }
  return value;
}

// ---------------------------------------------------------------------------
// Application table par table
// ---------------------------------------------------------------------------
let totalChanged = 0;
const samples = [];

async function processTable(table, idCol, fields) {
  const { data, error } = await supabase.from(table).select([idCol, ...fields].join(", "));
  if (error) {
    console.log(`${table}: ERREUR ${error.message}`);
    return;
  }
  let changed = 0;
  for (const row of data || []) {
    const patch = {};
    for (const f of fields) {
      const fixed = fixValue(row[f], f);
      if (JSON.stringify(fixed) !== JSON.stringify(row[f])) {
        patch[f] = fixed;
        if (samples.length < 12 && typeof row[f] === "string") {
          samples.push({ table, before: row[f].slice(0, 80), after: fixed.slice(0, 80) });
        }
      }
    }
    if (Object.keys(patch).length) {
      changed++;
      if (APPLY) {
        const { error: upErr } = await supabase.from(table).update(patch).eq(idCol, row[idCol]);
        if (upErr) console.log(`  update ${table}/${row[idCol]}: ${upErr.message}`);
      }
    }
  }
  totalChanged += changed;
  console.log(`${table}: ${changed}/${(data || []).length} lignes a corriger${APPLY ? " -> corrigees" : ""}`);
}

console.log(APPLY ? "=== MODE APPLY ===" : "=== DRY-RUN (ajoute --apply pour ecrire) ===");
await processTable("learning_tracks", "id", ["title", "summary", "description", "objective", "resources", "next_steps"]);
await processTable("track_modules", "id", ["title", "summary"]);
await processTable("track_lessons", "id", ["title", "intro", "why_important", "how_to_use", "objectives", "resources", "quiz", "micro_project"]);
await processTable("lesson_quiz_questions", "id", ["prompt", "choices", "explanation", "objective"]);

console.log(`\nTotal: ${totalChanged} lignes${APPLY ? " corrigees" : " a corriger"}`);
console.log("\n=== Echantillons avant/apres ===");
for (const s of samples) {
  console.log(`- [${s.table}]\n  AVANT: ${s.before}\n  APRES: ${s.after}`);
}
