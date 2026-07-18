import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
function loadEnv(f){try{for(const l of readFileSync(f,"utf8").split(/\r?\n/)){const m=l.match(/^([A-Z0-9_]+)=(.*)$/);if(m&&!process.env[m[1]])process.env[m[1]]=m[2].trim().replace(/^"|"$/g,"");}}catch{}}
loadEnv(".env.local");loadEnv(".env");
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const texts = [];
function flat(v){if(typeof v==="string")texts.push(v);else if(Array.isArray(v))v.forEach(flat);else if(v&&typeof v==="object")Object.values(v).forEach(flat);}
const {data:l}=await sb.from("track_lessons").select("title,intro,why_important,how_to_use,objectives,resources,quiz,micro_project");(l||[]).forEach(flat);
const {data:q}=await sb.from("lesson_quiz_questions").select("prompt,choices,explanation,objective");(q||[]).forEach(flat);
const {data:t}=await sb.from("learning_tracks").select("title,summary,description,objective");(t||[]).forEach(flat);
const {data:m}=await sb.from("track_modules").select("title,summary");(m||[]).forEach(flat);
// mots candidats: contiennent e, minuscules, purement alpha, pas d'accent deja
const freq = {};
for (const txt of texts) {
  if (/^https?:/.test(txt)) continue;
  for (const w of txt.split(/[^a-zA-Zàâéèêëîïôûùç']+/)) {
    const lw = w.toLowerCase();
    if (lw.length < 4 || !/e/.test(lw) || /[àâéèêëîïôûùç]/.test(lw)) continue;
    freq[lw] = (freq[lw] || 0) + 1;
  }
}
const sorted = Object.entries(freq).sort((a,b)=>b[1]-a[1]);
console.log(sorted.slice(0, 220).map(([w,c])=>`${w}:${c}`).join(" "));
