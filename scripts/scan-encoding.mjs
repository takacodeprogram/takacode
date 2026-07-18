// Scanne le contenu parcours/quiz en base pour trouver les soucis
// d'accents (mojibake) et d'apostrophes (doubles '' ou sequences echappees).
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { resolve } from "path";

const root = "C:/Users/takac/OneDrive/Desktop/00_tous_les_dossiers/02_projets_dev/projet_takacode";

function loadEnv(file) {
  try {
    const text = readFileSync(resolve(root, file), "utf8");
    for (const line of text.split(/\r?\n/)) {
      const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim().replace(/^"|"$/g, "");
    }
  } catch {}
}
loadEnv(".env.local");
loadEnv(".env");

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
if (!url || !key) {
  console.log("ENV manquante: url=" + Boolean(url) + " key=" + Boolean(key));
  process.exit(1);
}

const supabase = createClient(url, key);

// Patterns problematiques
const PATTERNS = [
  { name: "mojibake-e-aigu (Ã©)", re: /Ã©/ },
  { name: "mojibake-e-grave (Ã¨)", re: /Ã¨/ },
  { name: "mojibake-a-grave (Ã )", re: /Ã / },
  { name: "mojibake-apostrophe (â€™)", re: /â€™/ },
  { name: "mojibake-generic (Ã)", re: /Ã[-¿]/ },
  { name: "replacement-char (�)", re: /�/ },
  { name: "double-apostrophe ('')", re: /[a-zA-Z]''[a-zA-Z]/ },
  { name: "apostrophe-typographique (’)", re: /’/ },
  { name: "backslash-u escape", re: /\\u00[0-9a-f]{2}/i },
  { name: "html-entity (&#39; &eacute;...)", re: /&#?[a-z0-9]{2,6};/i }
];

function scanText(where, text, hits) {
  if (typeof text !== "string" || !text) return;
  for (const p of PATTERNS) {
    if (p.re.test(text)) {
      const m = text.match(p.re);
      const idx = text.search(p.re);
      const excerpt = text.slice(Math.max(0, idx - 40), idx + 40).replace(/\n/g, " ");
      hits.push({ where, pattern: p.name, excerpt });
    }
  }
}

function scanValue(where, value, hits) {
  if (typeof value === "string") return scanText(where, value, hits);
  if (Array.isArray(value)) return value.forEach((v, i) => scanValue(`${where}[${i}]`, v, hits));
  if (value && typeof value === "object") {
    for (const [k, v] of Object.entries(value)) scanValue(`${where}.${k}`, v, hits);
  }
}

const hits = [];

const { data: tracks, error: e1 } = await supabase.from("learning_tracks").select("slug, title, summary, description, objective");
if (e1) console.log("tracks error:", e1.message);
for (const t of tracks || []) {
  for (const f of ["title", "summary", "description", "objective"]) scanText(`track:${t.slug}.${f}`, t[f], hits);
}

const { data: modules, error: e2 } = await supabase.from("track_modules").select("slug, title, summary");
if (e2) console.log("modules error:", e2.message);
for (const m of modules || []) {
  for (const f of ["title", "summary"]) scanText(`module:${m.slug}.${f}`, m[f], hits);
}

const { data: lessons, error: e3 } = await supabase
  .from("track_lessons")
  .select("slug, title, intro, why_important, how_to_use, objectives, resources, quiz, micro_project");
if (e3) console.log("lessons error:", e3.message);
for (const l of lessons || []) {
  for (const f of ["title", "intro", "why_important", "how_to_use"]) scanText(`lesson:${l.slug}.${f}`, l[f], hits);
  for (const f of ["objectives", "resources", "quiz", "micro_project"]) scanValue(`lesson:${l.slug}.${f}`, l[f], hits);
}

// Banque de questions si elle existe
const { data: bank, error: e4 } = await supabase.from("lesson_questions").select("id, question, choices, explanation").limit(1000);
if (!e4) {
  for (const q of bank || []) {
    scanText(`bank:${q.id}.question`, q.question, hits);
    scanValue(`bank:${q.id}.choices`, q.choices, hits);
    scanText(`bank:${q.id}.explanation`, q.explanation, hits);
  }
} else {
  console.log("(pas de table lesson_questions: " + e4.message.slice(0, 60) + ")");
}

console.log(`\n=== ${hits.length} occurrences trouvees ===`);
const byPattern = {};
for (const h of hits) byPattern[h.pattern] = (byPattern[h.pattern] || 0) + 1;
console.log(JSON.stringify(byPattern, null, 2));
console.log("\n=== Echantillons (30 max) ===");
for (const h of hits.slice(0, 30)) {
  console.log(`[${h.pattern}] ${h.where}\n   ...${h.excerpt}...`);
}
