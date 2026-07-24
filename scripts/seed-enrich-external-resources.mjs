// Ajoute des ressources externes aux leçons FR et EN (idempotent, upsert par slug+URL)
// Usage : node scripts/seed-enrich-external-resources.mjs
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
function loadEnv(f){try{for(const l of readFileSync(f,"utf8").split(/\r?\n/)){const m=l.match(/^([A-Z0-9_]+)=(.*)$/);if(m&&!process.env[m[1]])process.env[m[1]]=m[2].trim().replace(/^"|"$/g,"");}}catch{}}
loadEnv(".env.local");loadEnv(".env");
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const UPDATES = [
  // ── FR : full-vibe-coding ──────────────────────────────────────────
  {
    slug: "panorama-outils-vibe-coding",
    resource: {
      label: "Claude Code 101 (EN, cours officiel gratuit)",
      url: "https://anthropic.skilljar.com/claude-code-101",
      kind: "course",
      why: "Le cours d'introduction officiel d'Anthropic pour prendre en main Claude Code. Idéal pour découvrir l'outil depuis zéro.",
      how: "Crée un compte gratuit sur skilljar.com et suis le module. Il dure environ 30 minutes et couvre l'installation, les commandes de base et le flux de travail."
    }
  },
  {
    slug: "panorama-outils-vibe-coding",
    resource: {
      label: "Claude Code in Action (EN, démos officielles)",
      url: "https://anthropic.skilljar.com/claude-code-in-action",
      kind: "course",
      why: "Des démonstrations filmées par l'équipe Anthropic montrant Claude Code en situation réelle : debugging, refactoring, déploiement.",
      how: "Regarde les démos qui correspondent à ton stack technique. Reproduis les étapes sur ton propre projet pendant la vidéo."
    }
  },
  {
    slug: "panorama-outils-vibe-coding",
    resource: {
      label: "Claude Code — Documentation complète (EN)",
      url: "https://code.claude.com/docs/en/overview",
      kind: "doc",
      why: "La référence officielle de tout ce que Claude Code peut faire : commandes, configuration, hooks, skills, MCP, routines.",
      how: "Parcourt la doc en entier une première fois pour connaître les possibilités, puis reviens-y comme référence quand tu cherches une fonction spécifique."
    }
  },
  {
    slug: "prise-en-main-outil",
    resource: {
      label: "CLAUDE.md — Donner de la mémoire à Claude (EN)",
      url: "https://code.claude.com/docs/en/claude-md",
      kind: "doc",
      why: "Le fichier CLAUDE.md est le moyen le plus puissant de configurer le comportement de Claude pour ton projet : règles, conventions, stack technique.",
      how: "Crée un fichier CLAUDE.md à la racine de ton projet avec les instructions générales. Mets à jour au fur et à mesure que le projet évolue."
    }
  },
  {
    slug: "prise-en-main-outil",
    resource: {
      label: "Skills — Enseigner des workflows réutilisables à Claude (EN)",
      url: "https://code.claude.com/docs/en/skills",
      kind: "doc",
      why: "Les Skills permettent de sauvegarder des instructions précises pour des tâches répétitives et de les réutiliser en une commande.",
      how: "Identifie une tâche que tu fais souvent (ex: 'créer un composant React avec tests'), crée un Skill, et teste-le sur le champ."
    }
  },
  {
    slug: "cadrer-ton-projet",
    resource: {
      label: "Prompt Engineering Guide officiel (Anthropic, EN)",
      url: "https://docs.claude.com/en/docs/build-with-claude/prompt-engineering/overview",
      kind: "doc",
      why: "Le guide officiel d'Anthropic pour écrire des prompts efficaces : structure, rôle, formatage XML, chaîne de réflexion, exemples.",
      how: "Lis les sections 'Be clear and direct' et 'Give Claude a role' avant de rédiger ton brief projet. Applique chaque technique à ton prompt."
    }
  },
  {
    slug: "iterer-efficacement",
    resource: {
      label: "Anthropic Prompt Engineering Interactive Tutorial (EN, gratuit, 2-5h)",
      url: "https://github.com/anthropics/prompt-eng-interactive-tutorial",
      kind: "course",
      why: "Le cours interactif officiel d'Anthropic pour maîtriser le prompt engineering. Exercices pratiques avec l'API Claude en Jupyter Notebook.",
      how: "Clone le repo et suis les notebooks dans l'ordre : beginner puis advanced. Exécute chaque exercice avec ta propre clé API."
    }
  },
  {
    slug: "iterer-efficacement",
    resource: {
      label: "Routines — Automatiser des tâches 24/7 avec Claude (EN)",
      url: "https://code.claude.com/docs/en/routines",
      kind: "doc",
      why: "Les Routines permettent de programmer des tâches répétitives qui s'exécutent automatiquement : revue de code quotidienne, génération de rapports, surveillance.",
      how: "Commence par une routine simple (ex: 'vérifier les dépendances obsolètes chaque lundi'). Passe à des routines plus complexes au fil du temps."
    }
  },
  {
    slug: "limites-et-bonnes-pratiques",
    resource: {
      label: "Claude Code Ultimate Guide (EN, guide communauté)",
      url: "https://github.com/FlorianBruniaux/claude-code-ultimate-guide",
      kind: "doc",
      why: "Un guide complet maintenu par la communauté qui compile les meilleures pratiques, astuces et workflows pour Claude Code.",
      how: "Parcourt la table des matières, trouve les sections qui s'appliquent à ton projet, et applique les recommandations une par une."
    }
  },
  {
    slug: "limites-et-bonnes-pratiques",
    resource: {
      label: "Awesome Claude Code — Skills, hooks, plugins (EN)",
      url: "https://github.com/hesreallyhim/awesome-claude-code",
      kind: "repo",
      why: "Une collection organisée de ressources communautaires : Skills prêts à l'emploi, hooks personnalisés, plugins et astuces avancées.",
      how: "Explore le dépôt et installe les Skills qui correspondent à ton stack. N'hésite pas à en créer et à contribuer."
    }
  },
  {
    slug: "deployer-sur-vercel",
    resource: {
      label: "Build a $10,000 Website With Free AI Tools (EN, no code)",
      url: "https://www.nocode.mba/articles/premium-website-ai-tools",
      kind: "article",
      why: "Un guide pas à pas pour créer un site web premium avec Bolt, Claude et des outils gratuits — sans écrire de code.",
      how: "Suis le guide en parallèle avec ton propre projet. Utilise les prompts donnés et personnalise le résultat avec tes couleurs et contenu."
    }
  },

  // ── FR : ia-fondamentaux ───────────────────────────────────────────
  {
    slug: "agents-ia",
    resource: {
      label: "Agent Architecture (LangChain, EN)",
      url: "https://langchain.com/blog?category_equal=%5B%22Agent+Architecture%22%5D",
      kind: "article",
      why: "Les articles du blog LangChain sur l'architecture des agents IA. Une référence pour comprendre comment concevoir des agents complexes : planification, mémoire, outils, exécution.",
      how: "Commence par l'article le plus récent. Prends des notes sur les patterns d'architecture (ReAct, plan-and-execute, etc.) et réfléchis à comment les appliquer à ton projet."
    }
  },
  {
    slug: "agents-ia",
    resource: {
      label: "Anthropic Academy — 13 cours gratuits avec certificat (EN)",
      url: "https://anthropic.skilljar.com",
      kind: "course",
      why: "La plateforme de formation officielle d'Anthropic avec 13 cours couvrant tout l'écosystème Claude : prompt engineering, agents, Claude Code, MCP, sécurité, déploiement.",
      how: "Inscris-toi gratuitement et commence par les cours 'Claude 101' et 'Prompt Engineering Fundamentals'. Passe ensuite aux cours avancés sur les agents et MCP."
    }
  },
  {
    slug: "system-prompt-et-user-prompt",
    resource: {
      label: "Anthropic Prompt Engineering Interactive Tutorial (EN, gratuit, 2-5h)",
      url: "https://github.com/anthropics/prompt-eng-interactive-tutorial",
      kind: "course",
      why: "Le cours interactif officiel d'Anthropic. Couvre structure de prompt, rôle, formatage, chaîne de réflexion, outils — avec exercices sur l'API live.",
      how: "Clone le repo et suis les notebooks beginner. Chaque exercice te fait tester un concept différent sur l'API réelle."
    }
  },
  {
    slug: "mcp-connecter-ia",
    resource: {
      label: "MCP — Connecter Claude à Slack, GitHub, Drive (EN, doc officielle)",
      url: "https://code.claude.com/docs/en/mcp",
      kind: "doc",
      why: "La documentation officielle du Model Context Protocol (MCP) qui permet à Claude de se connecter à tes outils du quotidien : Slack, GitHub, Google Drive, bases de données.",
      how: "Configure d'abord le serveur MCP pour GitHub (le plus utile pour commencer). Ajoute ensuite Slack ou Drive selon tes besoins. Teste chaque connexion avec une commande simple."
    }
  },

  // ── EN : ai-foundations-en ──────────────────────────────────────────
  {
    slug: "anatomy-of-a-good-prompt-en",
    resource: {
      label: "Anthropic Prompt Engineering Guide (official)",
      url: "https://docs.claude.com/en/docs/build-with-claude/prompt-engineering/overview",
      kind: "doc",
      why: "The official Anthropic guide to writing effective prompts: structure, roles, XML formatting, chain-of-thought, and examples.",
      how: "Read the 'Be clear and direct' and 'Give Claude a role' sections first. Apply each technique while drafting your own prompts."
    }
  },
  {
    slug: "anatomy-of-a-good-prompt-en",
    resource: {
      label: "Anthropic Prompt Engineering Interactive Tutorial (free, 2-5h)",
      url: "https://github.com/anthropics/prompt-eng-interactive-tutorial",
      kind: "course",
      why: "Anthropic's official hands-on tutorial. Covers prompt structure, role assignment, formatting, chain-of-thought, and tool use with live API exercises.",
      how: "Clone the repo and follow the notebooks in order: beginner then advanced. Run each exercise with your own Claude API key."
    }
  },
  {
    slug: "what-is-an-llm-en",
    resource: {
      label: "Anthropic Academy — 13 free courses with certificates",
      url: "https://anthropic.skilljar.com",
      kind: "course",
      why: "Anthropic's official learning platform with 13 free courses covering the entire Claude ecosystem: fundamentals, prompting, agents, code, MCP, security.",
      how: "Sign up for free and start with 'Claude 101' and 'Prompt Engineering Fundamentals' to build a solid foundation."
    }
  },
  {
    slug: "verify-and-avoid-hallucinations-en",
    resource: {
      label: "Agent Architecture (LangChain blog, EN)",
      url: "https://langchain.com/blog?category_equal=%5B%22Agent+Architecture%22%5D",
      kind: "article",
      why: "LangChain's blog series on agent architecture patterns. Covers planning, memory, tool use, execution loops — essential for building reliable AI agents.",
      how: "Start with the most recent article. Note the architecture patterns (ReAct, plan-and-execute) and think about how to apply verification steps to prevent hallucinations."
    }
  },
  {
    slug: "ai-in-your-real-workflow-en",
    resource: {
      label: "Skills — Teach Claude reusable workflows (official docs)",
      url: "https://code.claude.com/docs/en/skills",
      kind: "doc",
      why: "Skills let you save precise instructions for repetitive tasks and reuse them with a single command — perfect for integrating Claude into your daily workflow.",
      how: "Identify a task you do often (e.g., 'write a React component with tests'), create a Skill, and test it immediately."
    }
  },
  {
    slug: "ai-in-your-real-workflow-en",
    resource: {
      label: "Routines — Automate tasks 24/7 with Claude (official docs)",
      url: "https://code.claude.com/docs/en/routines",
      kind: "doc",
      why: "Routines let you schedule recurring tasks that run automatically: daily code reviews, report generation, monitoring — Claude works while you sleep.",
      how: "Start with a simple routine (e.g., 'check for outdated dependencies every Monday'). Graduate to more complex workflows over time."
    }
  },
  {
    slug: "ai-in-your-real-workflow-en",
    resource: {
      label: "Claude Code 101 (official free course)",
      url: "https://anthropic.skilljar.com/claude-code-101",
      kind: "course",
      why: "Anthropic's official introduction to Claude Code. Covers installation, basic commands, and workflow — perfect for integrating AI into your development pipeline.",
      how: "Create a free account on skilljar.com and take the course. It takes about 30 minutes and gives you a solid foundation."
    }
  },
  {
    slug: "ship-something-with-ai-en",
    resource: {
      label: "Claude Code in Action (official demos)",
      url: "https://anthropic.skilljar.com/claude-code-in-action",
      kind: "course",
      why: "Recorded demonstrations by the Anthropic team showing real-world Claude Code usage: debugging, refactoring, deployment.",
      how: "Watch the demos relevant to your tech stack. Reproduce the steps on your own project while watching."
    }
  },
  {
    slug: "ship-something-with-ai-en",
    resource: {
      label: "Claude Code — Complete documentation (official)",
      url: "https://code.claude.com/docs/en/overview",
      kind: "doc",
      why: "The official reference for everything Claude Code can do: commands, configuration, hooks, skills, MCP, routines.",
      how: "Skim the full docs once to know what's possible, then come back as a reference when you need a specific feature."
    }
  },
  {
    slug: "ai-in-your-real-workflow-en",
    resource: {
      label: "CLAUDE.md — Give Claude project memory (official docs)",
      url: "https://code.claude.com/docs/en/claude-md",
      kind: "doc",
      why: "The CLAUDE.md file is the most powerful way to configure Claude's behavior for your project: rules, conventions, tech stack, preferences.",
      how: "Create a CLAUDE.md at the root of your project with general instructions. Update it as your project evolves."
    }
  },
  {
    slug: "verify-and-avoid-hallucinations-en",
    resource: {
      label: "MCP — Connect Claude to Slack, GitHub, Drive (official docs)",
      url: "https://code.claude.com/docs/en/mcp",
      kind: "doc",
      why: "The Model Context Protocol (MCP) lets Claude connect to your everyday tools: Slack, GitHub, Google Drive, databases — enabling verification against real data.",
      how: "Set up the GitHub MCP server first (most useful). Add Slack or Drive as needed. Test each connection with a simple command."
    }
  },

  // ── EN : digital-products-en ────────────────────────────────────────
  {
    slug: "build-with-ai-en",
    resource: {
      label: "Claude Code 101 (official free course)",
      url: "https://anthropic.skilljar.com/claude-code-101",
      kind: "course",
      why: "Anthropic's official course to get started with Claude Code — perfect for building and automating digital products with AI.",
      how: "Complete the course and immediately apply what you learn to build your digital product."
    }
  },
  {
    slug: "build-with-ai-en",
    resource: {
      label: "Skills — Teach Claude reusable workflows (official docs)",
      url: "https://code.claude.com/docs/en/skills",
      kind: "doc",
      why: "Create reusable workflows for tasks like product descriptions, landing pages, customer emails — automate your product creation process.",
      how: "Build Skills for each step of your product creation pipeline: research, creation, packaging, marketing. Iterate and improve them over time."
    }
  },
  {
    slug: "build-with-ai-en",
    resource: {
      label: "Build a $10,000 Website With Free AI Tools (no code guide)",
      url: "https://www.nocode.mba/articles/premium-website-ai-tools",
      kind: "article",
      why: "A step-by-step guide to building a premium website with Bolt, Claude, and free tools — no coding required. Shows how the result can be worth $10K on the market.",
      how: "Follow the guide alongside your own product. Use the provided prompts for Bolt and Claude, then customize with your own branding and content."
    }
  },
  {
    slug: "store-page-and-price-en",
    resource: {
      label: "Claude Code in Action (official demos)",
      url: "https://anthropic.skilljar.com/claude-code-in-action",
      kind: "course",
      why: "See how Claude Code is used in real scenarios: building storefronts, handling payments, deploying — practical demonstrations you can apply directly.",
      how: "Watch the demos relevant to building a product page. Apply the techniques to build or improve your own store page."
    }
  },
  {
    slug: "launch-and-first-revenue-en",
    resource: {
      label: "Routines — Automate tasks 24/7 (official docs)",
      url: "https://code.claude.com/docs/en/routines",
      kind: "doc",
      why: "Automate post-launch tasks: customer follow-ups, sales reports, analytics checks — so you focus on growing revenue, not repetitive work.",
      how: "Set up routines for daily sales summaries, weekly customer check-ins, and monthly revenue reports."
    }
  },
  {
    slug: "launch-and-first-revenue-en",
    resource: {
      label: "Claude Code Ultimate Guide (community, EN)",
      url: "https://github.com/FlorianBruniaux/claude-code-ultimate-guide",
      kind: "doc",
      why: "A comprehensive community-maintained guide with best practices, tips, and workflows for Claude Code — including monetization patterns.",
      how: "Browse the table of contents and find sections relevant to launching and selling digital products."
    }
  },
  {
    slug: "launch-and-first-revenue-en",
    resource: {
      label: "Awesome Claude Code — Skills, hooks, plugins (community)",
      url: "https://github.com/hesreallyhim/awesome-claude-code",
      kind: "repo",
      why: "A curated collection of community resources: ready-to-use Skills, custom hooks, plugins, and advanced tips for Claude Code.",
      how: "Explore the repo and install Skills relevant to your product. Contribute your own as you build."
    }
  }
];

async function applyUpdates(updates) {
  for (const { slug, resource } of updates) {
    const { data: lesson, error: fetchError } = await sb
      .from("track_lessons")
      .select("id, resources, slug")
      .eq("slug", slug)
      .single();

    if (fetchError || !lesson) {
      console.log(`SKIP "${slug}" — introuvable (${fetchError?.message || "null"})`);
      continue;
    }

    const existing = Array.isArray(lesson.resources) ? lesson.resources : [];
    if (existing.some((r) => r.url === resource.url)) {
      console.log(`DUP "${slug}" ← "${resource.label}" (déjà présent)`);
      continue;
    }

    const updated = [...existing, resource];
    const { error: updateError } = await sb
      .from("track_lessons")
      .update({ resources: updated })
      .eq("id", lesson.id);

    if (updateError) {
      console.log(`ERR "${slug}" ← "${resource.label}" : ${updateError.message}`);
    } else {
      console.log(`OK  "${slug}" ← "${resource.label}"`);
    }
  }
}

await applyUpdates(UPDATES);
console.log("\nTerminé. Ressources ajoutées aux leçons FR et EN.");
