import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
function loadEnv(f){try{for(const l of readFileSync(f,"utf8").split(/\r?\n/)){const m=l.match(/^([A-Z0-9_]+)=(.*)$/);if(m&&!process.env[m[1]])process.env[m[1]]=m[2].trim().replace(/^"|"$/g,"");}}catch{}}
loadEnv(".env.local");loadEnv(".env");
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const { data: tracks } = await sb.from("learning_tracks").select("id, slug, title, goal_key, sort_order, is_published").order("sort_order");
for (const t of tracks || []) {
  const { data: mods } = await sb.from("track_modules").select("id").eq("track_id", t.id);
  const modIds = (mods || []).map((m) => m.id);
  let lessons = 0, noQuiz = 0, noProject = 0, noResources = 0;
  if (modIds.length) {
    const { data: ls } = await sb.from("track_lessons").select("quiz, micro_project, resources").in("module_id", modIds);
    lessons = (ls || []).length;
    for (const l of ls || []) {
      if (!Array.isArray(l.quiz) || !l.quiz.length) noQuiz++;
      if (!l.micro_project || !l.micro_project.title) noProject++;
      if (!Array.isArray(l.resources) || !l.resources.length) noResources++;
    }
  }
  console.log(`${String(t.sort_order).padStart(2)} ${t.is_published ? "PUB" : "off"} ${t.slug} [${t.goal_key}] : ${modIds.length} modules, ${lessons} lecons${noQuiz ? `, ${noQuiz} sans quiz` : ""}${noProject ? `, ${noProject} sans micro-projet` : ""}${noResources ? `, ${noResources} sans ressources` : ""}`);
}
