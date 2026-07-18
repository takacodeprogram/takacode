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
loadEnv(".env.local"); loadEnv(".env");
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const MISSING_APO = /\b(l|d|qu|n|j|c|s|m|t) (un|une|il|elle|on|est|etait|IA|ia|utilisateur|application|outil|apprentissage|erreur|autre|abord|idee|explique|ajouter|avoir|etre|aide|API|expliquer|entre|eux|elles|ils|y|a|en|au|aux)\b/;
const ACCENT = /[éèêàçùûîôëïÉÈÀÇ]/;
const MOJI = /Ã|â€|�/;

function stats(name, texts) {
  let total = 0, withAccent = 0, missApo = 0, moji = 0;
  const samples = [];
  for (const t of texts) {
    if (!t) continue;
    total++;
    if (ACCENT.test(t)) withAccent++;
    if (MOJI.test(t)) { moji++; samples.push(["MOJI", t.slice(0, 90)]); }
    const m = t.match(MISSING_APO);
    if (m) { missApo++; if (samples.length < 8) samples.push(["APO", t.slice(Math.max(0, t.indexOf(m[0]) - 30), t.indexOf(m[0]) + 50)]); }
  }
  console.log(`\n${name}: ${total} textes | avec accents: ${withAccent} (${Math.round(withAccent/Math.max(1,total)*100)}%) | apostrophes manquantes: ${missApo} | mojibake: ${moji}`);
  for (const [k, s] of samples.slice(0, 8)) console.log(`  [${k}] ...${s.replace(/\n/g, " ")}...`);
}

function flat(v, out) {
  if (typeof v === "string") out.push(v);
  else if (Array.isArray(v)) v.forEach((x) => flat(x, out));
  else if (v && typeof v === "object") Object.values(v).forEach((x) => flat(x, out));
  return out;
}

const { data: lessons } = await supabase.from("track_lessons").select("slug, title, intro, why_important, how_to_use, objectives, resources, quiz, micro_project");
const lessonTexts = [];
for (const l of lessons || []) flat([l.title, l.intro, l.why_important, l.how_to_use, l.objectives, l.resources, l.quiz, l.micro_project], lessonTexts);
stats("track_lessons (contenu parcours)", lessonTexts);

const { data: qs, error: qe } = await supabase.from("lesson_quiz_questions").select("question, choices, explanation").limit(2000);
if (qe) console.log("bank error:", qe.message);
const qTexts = [];
for (const q of qs || []) flat([q.question, q.choices, q.explanation], qTexts);
stats("lesson_quiz_questions (banque quiz)", qTexts);

const { data: tracks } = await supabase.from("learning_tracks").select("title, summary, description, objective");
stats("learning_tracks", flat(tracks || [], []));
const { data: mods } = await supabase.from("track_modules").select("title, summary");
stats("track_modules", flat(mods || [], []));
