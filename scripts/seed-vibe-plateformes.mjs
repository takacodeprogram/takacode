// Ajoute le module "Plateformes de vibe coding" (Lovable, Bolt, v0) au
// parcours full-vibe-coding existant.
//
// Usage : node scripts/seed-vibe-plateformes.mjs
// Idempotent (upsert par slug). Contenu accentué (skill francais-accents).
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
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const MODULE = {
  slug: "plateformes-de-vibe-coding",
  title: "Plateformes de vibe coding",
  summary: "Lovable, Bolt et v0 : construire une vraie application par la conversation, puis récupérer son code.",
  sort_order: 90,
  lessons: [
    {
      slug: "panorama-lovable-bolt-v0",
      title: "Panorama : Lovable, Bolt et v0",
      intro: "Une nouvelle génération de plateformes construit des applications complètes à partir d'une conversation : Lovable (app full-stack avec base de données), Bolt (projets web dans le navigateur), v0 de Vercel (interfaces et composants). Chacune a sa zone de génie — et ses limites.",
      why_important: "Choisir la bonne plateforme pour le bon besoin change tout : v0 excelle pour générer des interfaces, Bolt pour prototyper vite un projet web, Lovable pour une application avec données et authentification. Les confondre mène à des frustrations évitables.",
      how_to_use: "Teste la MÊME idée simple (par exemple une page d'inscription à une newsletter avec confirmation) sur deux plateformes différentes. Compare : qualité du résultat, facilité d'itération par prompts, possibilité de récupérer le code. Note ce que chaque plateforme a compris — et raté.",
      objectives: [
        "Situer Lovable, Bolt et v0 et leurs zones de génie",
        "Tester une même idée sur deux plateformes",
        "Évaluer qualité, itération et récupération du code"
      ],
      resources: [
        { label: "Lovable", url: "https://lovable.dev/", kind: "tool", why: "Applications full-stack par la conversation, avec base de données et authentification intégrées.", how: "Crée un compte gratuit et décris une application simple pour voir ce qu'il produit." },
        { label: "Bolt", url: "https://bolt.new/", kind: "tool", why: "Projets web générés et exécutés directement dans le navigateur : idéal pour prototyper.", how: "Lance la même idée que sur Lovable et compare le résultat." },
        { label: "v0 (Vercel)", url: "https://v0.dev/", kind: "tool", why: "Le spécialiste des interfaces : composants et pages de grande qualité visuelle.", how: "Demande l'interface de ton idée et observe la qualité du design généré." }
      ],
      quiz: [
        { q: "Quelle est la zone de génie de v0 ?", choices: ["Les bases de données", "Les interfaces et composants visuels", "Les bots de trading"], answer: 1, explanation: "v0 est le spécialiste de l'interface ; pour la logique et les données, d'autres outils prennent le relais." },
        { q: "Pourquoi tester la même idée sur deux plateformes ?", choices: ["Pour perdre du temps", "Pour comparer objectivement qualité, itération et récupération du code", "Parce qu'une seule ne suffit jamais"], answer: 1, explanation: "À idée constante, les différences de compréhension et de résultat sautent aux yeux." },
        { q: "Quel critère est essentiel avant d'investir du temps sur une plateforme ?", choices: ["La couleur du logo", "La possibilité de récupérer son code (export, GitHub)", "Le nombre d'utilisateurs"], answer: 1, explanation: "Sans récupération du code, ton projet appartient à la plateforme — pas à toi." }
      ],
      micro_project: {
        title: "Le duel des plateformes",
        brief: "Confronte deux plateformes sur la même idée et tire un verdict argumenté.",
        steps: [
          "Décris une idée simple et précise (une page, une fonction)",
          "Construis-la sur deux plateformes différentes",
          "Compare : compréhension, qualité, itération, export du code",
          "Rends ton verdict : quelle plateforme pour quel usage"
        ],
        deliverable: "Tes deux liens (ou captures) et ton verdict argumenté : forces, faiblesses et usage recommandé de chaque plateforme.",
        validation: "ai"
      },
      xp_reward: 55,
      duration_minutes: 50,
      sort_order: 10
    },
    {
      slug: "construire-avec-lovable",
      title: "Construire une vraie application avec Lovable",
      intro: "Lovable assemble interface, base de données et authentification à partir de tes prompts. La méthode qui marche : décrire le POURQUOI et le comportement attendu, itérer par petites touches, et vérifier chaque écran comme un utilisateur réel.",
      why_important: "C'est l'application directe du vibe coding appris dans ce parcours : cadrage clair, itérations courtes, vérification systématique. Lovable te donne une application déployée en heures — à condition de piloter, pas de subir.",
      how_to_use: "Pars de TON projet TakaCode (ou d'une version simplifiée) : décris l'application en une phrase de mission plus 3 fonctionnalités maximum. Construis fonctionnalité par fonctionnalité — jamais tout d'un coup. Après chaque itération, teste comme un utilisateur : clique partout, cherche ce qui casse, décris précisément le problème dans ton prompt suivant.",
      objectives: [
        "Cadrer une application en mission + 3 fonctionnalités",
        "Itérer par petites touches vérifiées",
        "Connecter les données (base intégrée) et publier"
      ],
      resources: [
        { label: "Documentation Lovable", url: "https://docs.lovable.dev/", kind: "doc", why: "Les guides officiels : prompts efficaces, base de données, publication.", how: "Lis les bonnes pratiques de prompting avant de commencer." },
        { label: "Lovable", url: "https://lovable.dev/", kind: "tool", why: "Ton atelier pour cette leçon.", how: "Construis fonctionnalité par fonctionnalité, en testant après chaque prompt." },
        { label: "Claude (préparation des prompts)", url: "https://claude.ai/", kind: "tool", why: "Préparer un cahier des charges clair AVANT Lovable améliore chaque itération.", how: "Fais rédiger ta phrase de mission et tes 3 fonctionnalités en spécifications claires." }
      ],
      quiz: [
        { q: "Quelle est la bonne façon de démarrer sur Lovable ?", choices: ["Tout décrire d'un coup en un prompt géant", "Une mission claire + 3 fonctionnalités maximum, construites une par une", "Laisser la plateforme deviner"], answer: 1, explanation: "Les petites itérations vérifiées gardent le contrôle ; le prompt géant produit un résultat incontrôlable." },
        { q: "Que faire après chaque itération ?", choices: ["Enchaîner immédiatement", "Tester comme un utilisateur réel et décrire précisément ce qui casse", "Supprimer le projet"], answer: 1, explanation: "La vérification systématique est le coeur du vibe coding : tu pilotes avec tes retours." },
        { q: "Qu'apporte Lovable par rapport à un générateur d'interface ?", choices: ["Rien de plus", "Base de données et authentification intégrées : une application complète", "Uniquement des couleurs"], answer: 1, explanation: "C'est sa zone de génie : le full-stack conversationnel, données comprises." }
      ],
      micro_project: {
        title: "Ton application Lovable en ligne",
        brief: "Construis et publie une application réelle (ton projet TakaCode ou une version simplifiée).",
        steps: [
          "Rédige mission + 3 fonctionnalités avec l'aide de l'IA",
          "Construis fonctionnalité par fonctionnalité en testant à chaque fois",
          "Ajoute la persistance des données (base intégrée)",
          "Publie et relie le lien à ton projet TakaCode"
        ],
        deliverable: "Le lien de ton application publiée et le récit de tes itérations (ce qui a marché du premier coup, ce qui a résisté).",
        validation: "ai",
        requires_link: true
      },
      xp_reward: 70,
      duration_minutes: 70,
      sort_order: 20
    },
    {
      slug: "du-prototype-au-code-owne",
      title: "Du prototype au code que tu possèdes",
      intro: "Une plateforme de vibe coding est un accélérateur, pas une maison définitive : tarifs qui montent, limites techniques, dépendance. La sortie de secours s'appelle export GitHub — ton code chez toi, déployé sur Vercel, modifiable avec Claude Code ou Cursor.",
      why_important: "La différence entre un utilisateur captif et un créateur libre tient à cette compétence : récupérer le code généré, le comprendre dans les grandes lignes, et continuer à le faire évoluer hors de la plateforme. C'est aussi le pont vers le parcours Dev web assisté par IA.",
      how_to_use: "Exporte ton projet Lovable (ou Bolt) vers GitHub. Clone-le, ouvre-le avec ton assistant IA (Claude Code, Cursor) et fais-lui expliquer la structure : où est l'interface, où sont les données, où est la logique. Fais UNE modification hors plateforme (un texte, une couleur, une petite fonctionnalité), redéploie sur Vercel : la boucle d'indépendance est bouclée.",
      objectives: [
        "Exporter son projet vers GitHub",
        "Faire expliquer la structure du code par l'IA",
        "Modifier et redéployer hors de la plateforme"
      ],
      resources: [
        { label: "GitHub", url: "https://github.com/", kind: "tool", why: "Ton code chez toi : la condition de l'indépendance.", how: "Connecte l'export de ta plateforme et vérifie que le dépôt est complet." },
        { label: "Vercel", url: "https://vercel.com/", kind: "tool", why: "Déployer le code exporté comme n'importe quel projet — vu au module déploiement.", how: "Importe le dépôt GitHub et vérifie que l'application tourne hors plateforme." },
        { label: "Parcours Dev web assisté par IA (TakaCode)", url: "https://takacode.vercel.app/parcours/dev-web-assiste-ia", kind: "doc", why: "La suite logique : comprendre et faire évoluer le code que les plateformes génèrent.", how: "Si le code exporté te semble opaque, ce parcours est ta prochaine étape." }
      ],
      quiz: [
        { q: "Pourquoi exporter son code vers GitHub ?", choices: ["Pour la décoration", "Pour posséder son projet et pouvoir évoluer hors de la plateforme", "C'est obligatoire pour publier"], answer: 1, explanation: "Sans export, tarifs et limites de la plateforme deviennent TES tarifs et TES limites." },
        { q: "Quelle est la première chose à faire avec le code exporté ?", choices: ["Tout réécrire", "Se le faire expliquer par l'IA : interface, données, logique", "Le supprimer"], answer: 1, explanation: "Comprendre les grandes lignes suffit pour reprendre le contrôle — l'IA est ton guide de lecture." },
        { q: "Qu'est-ce qui prouve ton indépendance vis-à-vis de la plateforme ?", choices: ["Un abonnement annuel", "Une modification faite hors plateforme et redéployée avec succès", "Un logo personnalisé"], answer: 1, explanation: "Modifier et redéployer toi-même : la boucle complète sans la plateforme." }
      ],
      micro_project: {
        title: "Ton indépendance prouvée",
        brief: "Exporte, comprends, modifie et redéploie ton application hors plateforme.",
        steps: [
          "Exporte ton projet vers GitHub et vérifie le dépôt",
          "Fais expliquer la structure du code par ton assistant IA",
          "Fais une modification hors plateforme (texte, style ou petite fonctionnalité)",
          "Redéploie sur Vercel et mets à jour ton projet TakaCode"
        ],
        deliverable: "Le lien du dépôt GitHub, la modification effectuée et le lien de l'application redéployée hors plateforme.",
        validation: "ai",
        requires_link: true
      },
      xp_reward: 70,
      duration_minutes: 60,
      sort_order: 30
    }
  ]
};

async function main() {
  const { data: track, error: trackError } = await supabase
    .from("learning_tracks")
    .select("id, slug")
    .eq("slug", "full-vibe-coding")
    .single();
  if (trackError || !track) {
    console.error("Parcours full-vibe-coding introuvable :", trackError?.message);
    process.exit(1);
  }

  const { lessons, ...moduleRow } = MODULE;
  const { data: moduleData, error: moduleError } = await supabase
    .from("track_modules")
    .upsert({ ...moduleRow, track_id: track.id, is_published: true }, { onConflict: "track_id,slug" })
    .select("id, slug")
    .single();
  if (moduleError) {
    console.error("module:", moduleError.message);
    process.exit(1);
  }

  for (const lesson of lessons) {
    const { error: lessonError } = await supabase
      .from("track_lessons")
      .upsert({ ...lesson, module_id: moduleData.id, is_published: true }, { onConflict: "module_id,slug" });
    if (lessonError) {
      console.error(`  lecon ${lesson.slug}:`, lessonError.message);
      process.exit(1);
    }
  }
  console.log(`Module "${moduleData.slug}" ajouté à full-vibe-coding (${lessons.length} leçons).`);
}

await main();
