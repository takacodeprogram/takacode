// Reparation ponctuelle : la premiere version de la regle d'elision voyait une
// frontiere apres les lettres accentuees ("affiliés et" -> "affiliés'et").
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
function loadEnv(f){try{for(const l of readFileSync(f,"utf8").split(/\r?\n/)){const m=l.match(/^([A-Z0-9_]+)=(.*)$/);if(m&&!process.env[m[1]])process.env[m[1]]=m[2].trim().replace(/^"|"$/g,"");}}catch{}}
loadEnv(".env.local");loadEnv(".env");
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const APPLY = process.argv.includes("--apply");

// 1. lettre accentuee + apostrophe + lettre => espace (jamais legitime en francais)
// 2. "et publié <determinant/pronom>" => imperatif corrompu -> "et publie"
const DET = "(ton|ta|tes|le|la|les|un|une|ce|cette|tes|son|sa|ses)";
// Imperatifs corrompus en participes par l'ancien dictionnaire
// ("Connecte ton depot" -> "Connecté ton dépôt").
const IMP = { connecté: "connecte", optimisé: "optimise", organisé: "organise", automatisé: "automatise", personnalisé: "personnalise", sécurisé: "sécurise", publié: "publie" };
function repair(t) {
  let out = t.replace(/([à-ÿÀ-Ÿ])'([A-Za-zÀ-ÿ])/g, "$1 $2");
  for (const [bad, good] of Object.entries(IMP)) {
    const capBad = bad.charAt(0).toUpperCase() + bad.slice(1);
    const capGood = good.charAt(0).toUpperCase() + good.slice(1);
    // Participe + determinant = imperatif corrompu, SAUF apres l'auxiliaire
    // avoir ("as publié le projet" reste un vrai participe).
    const notAux = "(?<!\\b(?:ai|as|a|avons|avez|ont|déjà|deja|été) )";
    out = out.replace(new RegExp(`${notAux}\\b${bad} (?=${DET}\\b)`, "g"), `${good} `);
    out = out.replace(new RegExp(`${notAux}${capBad} (?=${DET}\\b)`, "g"), `${capGood} `);
  }
  return out;
}
function walk(v) {
  if (typeof v === "string") return repair(v);
  if (Array.isArray(v)) return v.map(walk);
  if (v && typeof v === "object") { const o = {}; for (const [k, x] of Object.entries(v)) o[k] = walk(x); return o; }
  return v;
}
let total = 0;
const samples = [];
async function table(name, id, fields) {
  const { data, error } = await sb.from(name).select([id, ...fields].join(", "));
  if (error) return console.log(name, "ERR", error.message);
  let n = 0;
  for (const row of data || []) {
    const patch = {};
    for (const f of fields) {
      const r = walk(row[f]);
      if (JSON.stringify(r) !== JSON.stringify(row[f])) {
        patch[f] = r;
        if (samples.length < 10 && typeof row[f] === "string") samples.push([row[f].slice(0, 70), r.slice(0, 70)]);
      }
    }
    if (Object.keys(patch).length) { n++; if (APPLY) await sb.from(name).update(patch).eq(id, row[id]); }
  }
  total += n;
  console.log(`${name}: ${n} ligne(s) a reparer${APPLY ? " -> reparees" : ""}`);
}
await table("learning_tracks", "id", ["title", "summary", "description", "objective", "resources", "next_steps"]);
await table("track_modules", "id", ["title", "summary"]);
await table("track_lessons", "id", ["title", "intro", "why_important", "how_to_use", "objectives", "resources", "quiz", "micro_project"]);
await table("lesson_quiz_questions", "id", ["prompt", "choices", "explanation", "objective"]);
console.log("Total:", total);
for (const [b, a] of samples) console.log(`AVANT: ${b}\nAPRES: ${a}`);
