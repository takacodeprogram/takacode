// Ajoute des ressources externes (cours, vidéos, articles) aux leçons existantes
// Idempotent : met à jour par slug de leçon
// Usage : node scripts/seed-enrich-external-resources.mjs
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
function loadEnv(f){try{for(const l of readFileSync(f,"utf8").split(/\r?\n/)){const m=l.match(/^([A-Z0-9_]+)=(.*)$/);if(m&&!process.env[m[1]])process.env[m[1]]=m[2].trim().replace(/^"|"$/g,"");}}catch{}}
loadEnv(".env.local");loadEnv(".env");
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const UPDATES = [
  // 1. Anthropic Prompt Engineering Interactive Tutorial (cours officiel gratuit)
  // Leçon : system-prompt-et-user-prompt (ia-fondamentaux)
  {
    slug: "system-prompt-et-user-prompt",
    resource: {
      label: "Anthropic Prompt Engineering Interactive Tutorial (EN, 2-5h, gratuit)",
      url: "https://github.com/anthropics/prompt-eng-interactive-tutorial",
      kind: "course",
      why: "Le cours officiel d'Anthropic pour maîtriser le prompt engineering sur Claude. Couvre structure, rôle, formatage, chaîne de réflexion et utilisation d'outils — avec exercices interactifs sur l'API live.",
      how: "Suis le tutoriel dans l'ordre : beginner puis advanced. Chaque notebook contient des exercices pratiques à exécuter avec ta propre clé API Claude."
    }
  },
  // 2. Claude AI Full Course - Build & Automate Anything (vidéo 5h)
  // Leçon : iterer-efficacement (full-vibe-coding) — n'a qu'1 ressource actuellement
  {
    slug: "iterer-efficacement",
    resource: {
      label: "Claude AI FULL COURSE — Build & Automate Anything (EN, 5h)",
      url: "https://www.youtube.com/watch?v=g_DgRYRVz5k",
      kind: "video",
      why: "Un cours complet qui montre comment construire des projets réels avec Claude : landing pages, pipelines SEO, clones GitHub, automatisation multi-plateforme. Parfait pour voir le cycle itératif en action.",
      how: "Regarde les 10 projets présentés dans la vidéo. Crée un Projet Claude dédié et suis les étapes avec ton propre cas d'usage."
    }
  },
  // 3. Build a $10,000 Website With Free AI Tools (article / vidéo)
  // Leçon : deployer-sur-vercel (full-vibe-coding) ou creer-un-ebook-ou-guide
  // On le met dans deployer-sur-vercel car c'est un projet web complet livré
  {
    slug: "deployer-sur-vercel",
    resource: {
      label: "Build a $10,000 Website With Free AI Tools (EN, no code)",
      url: "https://www.nocode.mba/articles/premium-website-ai-tools",
      kind: "article",
      why: "Un guide pas à pas pour créer un site web premium avec Bolt, Claude et des outils gratuits — sans écrire de code. Montre comment le résultat peut valoir 10 000 $ sur le marché.",
      how: "Suis le guide en parallèle avec ton propre projet. Utilise les prompts donnés pour Bolt et Claude, puis personnalise le résultat avec tes propres couleurs et contenu."
    }
  }
];

for (const { slug, resource } of UPDATES) {
  const { data: lesson, error: fetchError } = await sb
    .from("track_lessons")
    .select("id, resources, slug")
    .eq("slug", slug)
    .single();

  if (fetchError || !lesson) {
    console.log(`ERREUR : leçon "${slug}" introuvable — ${fetchError?.message || "lesson is null"}`);
    continue;
  }

  const existing = Array.isArray(lesson.resources) ? lesson.resources : [];
  // Évite les doublons par URL
  if (existing.some((r) => r.url === resource.url)) {
    console.log(`DOUBLON ignoré : "${resource.label}" déjà dans "${slug}"`);
    continue;
  }

  const updated = [...existing, resource];
  const { error: updateError } = await sb
    .from("track_lessons")
    .update({ resources: updated })
    .eq("id", lesson.id);

  if (updateError) {
    console.log(`ERREUR mise à jour "${slug}" : ${updateError.message}`);
  } else {
    console.log(`OK "${slug}" ← "${resource.label}"`);
  }
}

console.log("\nTerminé. Les ressources sont visibles dans les pages de leçon concernées.");
