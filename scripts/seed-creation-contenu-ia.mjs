// Seed du parcours "Création de contenu avec l'IA" (YouTube faceless).
//
// Usage : node scripts/seed-creation-contenu-ia.mjs
// Idempotent : upsert par slug (parcours, modules, leçons). Contenu accentué.
// Nécessite SUPABASE_SERVICE_ROLE_KEY dans .env.local.
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

const TRACK = {
  slug: "creation-contenu-ia",
  goal_key: "videos_youtube",
  title: "Création de contenu avec l'IA",
  summary: "Lance une chaîne YouTube faceless rentable : scripts, voix, montage et monétisation, avec l'IA comme équipe de production.",
  description:
    "Tu crées une chaîne YouTube sans montrer ton visage : l'IA écrit avec toi, génère la voix off et les visuels, et toi tu gardes la direction créative. Le fil rouge du parcours : éviter le contenu robotique. Tu étudies des chaînes faceless qui marchent (comme Emotion26), tu écris des scripts qui sonnent humain, tu produis des vidéos rythmées, et tu poses les bases de la monétisation (Programme Partenaire, affiliation, produits).",
  level_label: "Débutant",
  duration_weeks: 4,
  accent_color: "#F97316",
  icon: "lucide:clapperboard",
  objective: "Publier tes premières vidéos faceless et poser un plan de monétisation crédible.",
  resources: ["YouTube Creators", "ElevenLabs", "CapCut", "VidIQ"],
  next_session: "Jeudi 19h00",
  next_steps: [
    { label: "Fondations du faceless", state: "current" },
    { label: "Scripts et voix naturels", state: "locked" },
    { label: "Production vidéo", state: "locked" },
    { label: "Publier et monétiser", state: "locked" }
  ],
  sort_order: 5,
  is_published: true,
  is_active: true
};

const MODULES = [
  {
    slug: "fondations-du-faceless",
    title: "Fondations du contenu faceless",
    summary: "Comprendre le modèle, choisir sa niche et assembler sa boîte à outils IA.",
    sort_order: 10,
    lessons: [
      {
        slug: "comprendre-le-contenu-faceless",
        title: "Comprendre le contenu faceless",
        intro: "Une chaîne faceless est une chaîne YouTube où le créateur n'apparaît pas à l'écran : histoires racontées, documentaires, listes, ambiances, vulgarisation. C'est le terrain idéal pour créer avec l'IA, à condition de comprendre ce qui fait qu'une chaîne marche.",
        why_important: "Le faceless supprime la barrière du \"je n'ose pas me montrer\" et permet de produire vite avec l'IA. Mais 90 % des chaînes faceless échouent parce qu'elles publient du contenu générique. Comprendre les modèles qui fonctionnent t'évite des mois d'erreurs.",
        how_to_use: "Étudie 3 chaînes faceless qui marchent dans ta langue — par exemple Emotion26 sur YouTube, souvent citée côté francophone. Pour chacune, analyse : le format, la durée des vidéos, le rythme de publication, les titres et les miniatures. Note ce qui te donne envie de cliquer et de rester.",
        objectives: [
          "Définir ce qu'est une chaîne faceless et ses principaux formats",
          "Analyser 3 chaînes qui fonctionnent (format, rythme, titres)",
          "Identifier le format qui te correspond"
        ],
        resources: [
          { label: "YouTube Creators (site officiel)", url: "https://www.youtube.com/creators/", kind: "doc", why: "Les bases officielles pour comprendre comment fonctionne une chaîne.", how: "Parcours la section démarrage et note les 3 conseils qui te parlent le plus." },
          { label: "Emotion26 (exemple de chaîne faceless)", url: "https://www.youtube.com/results?search_query=emotion26", kind: "video", why: "Un exemple concret de chaîne faceless francophone à analyser : format, narration, rythme.", how: "Regarde 2 vidéos en entier et note comment l'histoire te retient jusqu'au bout." },
          { label: "Think Media (chaîne YouTube)", url: "https://www.youtube.com/@ThinkMedia", kind: "video", why: "Des centaines de tutoriels sur la croissance d'une chaîne YouTube.", how: "Cherche leurs vidéos sur les chaînes faceless et les niches rentables." }
        ],
        quiz: [
          { q: "Qu'est-ce qu'une chaîne faceless ?", choices: ["Une chaîne où le créateur n'apparaît pas à l'écran", "Une chaîne sans abonnés", "Une chaîne privée"], answer: 0, explanation: "Faceless = sans visage : la valeur vient du contenu (histoire, images, voix), pas de la personne." },
          { q: "Pourquoi la plupart des chaînes faceless échouent-elles ?", choices: ["Parce que YouTube les pénalise", "Parce qu'elles publient du contenu générique sans identité", "Parce qu'il faut montrer son visage pour être monétisé"], answer: 1, explanation: "YouTube ne pénalise pas le faceless : c'est le contenu générique et sans personnalité qui ne retient personne." },
          { q: "Quelle est la meilleure première étape avant de lancer sa chaîne ?", choices: ["Acheter du matériel professionnel", "Étudier des chaînes qui marchent dans sa niche", "Publier 50 vidéos le plus vite possible"], answer: 1, explanation: "Analyser ce qui fonctionne déjà (format, titres, rythme) t'évite de repartir de zéro." },
          { q: "Lequel de ces formats est adapté au faceless ?", choices: ["Le vlog quotidien face caméra", "Les histoires racontées avec des visuels et une voix off", "L'interview en plateau"], answer: 1, explanation: "Histoires, documentaires, listes, vulgarisation : tous ces formats vivent très bien sans visage à l'écran." }
        ],
        micro_project: {
          title: "Analyse de 3 chaînes faceless",
          brief: "Choisis 3 chaînes faceless qui marchent (par exemple Emotion26 et 2 autres dans la niche qui t'attire) et analyse ce qui fait leur succès.",
          steps: [
            "Pour chaque chaîne : note le format, la durée moyenne et la fréquence de publication",
            "Analyse 3 titres et miniatures : quelle promesse font-ils au spectateur ?",
            "Regarde une vidéo en entier et note où ton attention décroche (et pourquoi)",
            "Conclus : quel format veux-tu adopter et pourquoi"
          ],
          deliverable: "Ton analyse des 3 chaînes (format, titres, rétention) et le format que tu choisis pour ta chaîne, avec tes raisons.",
          validation: "ai"
        },
        xp_reward: 50,
        duration_minutes: 45,
        sort_order: 10
      },
      {
        slug: "choisir-sa-niche",
        title: "Choisir sa niche et son angle",
        intro: "Une niche, c'est l'intersection entre ce qui t'intéresse, ce que les gens cherchent, et ce qui peut se monétiser. Sans niche claire, l'algorithme ne sait pas à qui montrer tes vidéos.",
        why_important: "L'algorithme YouTube recommande tes vidéos à une audience précise. Une chaîne qui parle de tout n'est recommandée à personne. Une niche + un angle personnel = une chaîne identifiable que l'algorithme sait pousser.",
        how_to_use: "Utilise Google Trends pour vérifier l'intérêt dans le temps, puis VidIQ ou TubeBuddy pour estimer la concurrence sur les mots-clés. Croise avec tes propres centres d'intérêt : tu vas produire des dizaines de vidéos, autant que le sujet te porte.",
        objectives: [
          "Évaluer la demande d'une niche avec Google Trends",
          "Estimer la concurrence avec VidIQ ou TubeBuddy",
          "Formuler un angle qui différencie ta chaîne"
        ],
        resources: [
          { label: "Google Trends", url: "https://trends.google.com/trends/", kind: "tool", why: "Vérifier si l'intérêt pour ta niche monte, stagne ou décline.", how: "Compare 3 niches candidates sur 5 ans et sur ta zone géographique." },
          { label: "VidIQ", url: "https://vidiq.com/", kind: "tool", why: "Volume de recherche et concurrence des mots-clés directement sur YouTube.", how: "Installe l'extension gratuite et analyse 5 mots-clés de ta niche." },
          { label: "TubeBuddy", url: "https://www.tubebuddy.com/", kind: "tool", why: "Alternative à VidIQ avec un explorateur de mots-clés efficace.", how: "Utilise le Keyword Explorer pour trouver des sujets peu concurrentiels." }
        ],
        quiz: [
          { q: "Qu'est-ce qu'une bonne niche YouTube ?", choices: ["Un sujet dont personne ne parle jamais", "L'intersection entre ton intérêt, la demande et la monétisation possible", "Le sujet le plus populaire du moment"], answer: 1, explanation: "Sans demande pas d'audience, sans intérêt personnel pas de régularité, sans monétisation pas de revenu." },
          { q: "Pourquoi une chaîne \"qui parle de tout\" a-t-elle du mal à percer ?", choices: ["YouTube interdit les chaînes généralistes", "L'algorithme ne sait pas à quelle audience la recommander", "Les vidéos coûtent plus cher à produire"], answer: 1, explanation: "L'algorithme recommande en fonction des habitudes d'une audience : une chaîne cohérente est plus facile à pousser." },
          { q: "À quoi sert l'angle d'une chaîne ?", choices: ["À la différencier des autres chaînes de la même niche", "À choisir la musique de fond", "À éviter les droits d'auteur"], answer: 0, explanation: "La niche dit de quoi tu parles ; l'angle dit comment toi tu en parles — c'est lui qui crée l'identité." },
          { q: "Que t'indique Google Trends ?", choices: ["Le nombre d'abonnés d'une chaîne", "L'évolution de l'intérêt de recherche pour un sujet dans le temps", "Le revenu moyen d'une niche"], answer: 1, explanation: "Trends montre si un sujet monte ou décline : idéal pour éviter les niches en fin de vie." }
        ],
        micro_project: {
          title: "Ta niche validée par les données",
          brief: "Choisis ta niche en croisant tes intérêts avec des données réelles de demande et de concurrence.",
          steps: [
            "Liste 3 niches qui t'intéressent vraiment",
            "Compare-les sur Google Trends (5 ans) et note la tendance",
            "Analyse la concurrence sur 5 mots-clés avec VidIQ ou TubeBuddy",
            "Choisis ta niche et formule ton angle en une phrase"
          ],
          deliverable: "Tes 3 niches candidates avec les données observées, ta niche finale et ton angle en une phrase (ex : \"des histoires vraies de survie racontées comme des thrillers\").",
          validation: "ai"
        },
        xp_reward: 50,
        duration_minutes: 40,
        sort_order: 20
      },
      {
        slug: "la-boite-a-outils-ia",
        title: "La boîte à outils IA du créateur",
        intro: "Une vidéo faceless assemble 4 briques : un script, une voix off, des visuels et un montage. Pour chaque brique, il existe des outils IA gratuits ou abordables. Ta mission : constituer TA chaîne de production.",
        why_important: "Le bon outil au bon endroit divise ton temps de production par 5. Mais empiler les outils sans méthode produit du contenu incohérent : tu dois comprendre le rôle de chaque brique avant d'automatiser.",
        how_to_use: "Crée un compte sur chaque outil et fais un test minuscule : un paragraphe de script avec Claude ou ChatGPT, 30 secondes de voix avec ElevenLabs, 3 clips trouvés sur Pexels, un bout de montage dans CapCut. L'objectif est de toucher toute la chaîne, pas de produire une vraie vidéo.",
        objectives: [
          "Identifier les 4 briques d'une vidéo faceless",
          "Tester un outil IA pour chaque brique",
          "Choisir ta chaîne de production de départ"
        ],
        resources: [
          { label: "Claude (assistant IA)", url: "https://claude.ai/", kind: "tool", why: "Excellent pour écrire et surtout réécrire des scripts avec un ton naturel.", how: "Demande-lui un plan de vidéo sur ton sujet, puis critique et affine le résultat." },
          { label: "ElevenLabs (voix off IA)", url: "https://elevenlabs.io/", kind: "tool", why: "Les voix IA les plus naturelles du marché, avec un plan gratuit pour tester.", how: "Génère 30 secondes de voix sur ton texte et écoute ce qui sonne encore robotique." },
          { label: "Pexels (banque de vidéos gratuites)", url: "https://www.pexels.com/", kind: "tool", why: "Des milliers de clips vidéo libres d'utilisation pour ton b-roll.", how: "Cherche 3 clips correspondant à ton sujet et vérifie la licence." },
          { label: "CapCut (montage gratuit)", url: "https://www.capcut.com/", kind: "tool", why: "Montage simple et complet : sous-titres automatiques, transitions, export HD.", how: "Importe ta voix et tes clips, et assemble 20 secondes de vidéo test." }
        ],
        quiz: [
          { q: "Quelles sont les 4 briques d'une vidéo faceless ?", choices: ["Script, voix off, visuels, montage", "Caméra, micro, lumière, fond vert", "Titre, miniature, tags, description"], answer: 0, explanation: "Chaque vidéo faceless assemble ces 4 briques — et chacune peut être accélérée par l'IA." },
          { q: "Quel est le risque d'empiler les outils IA sans méthode ?", choices: ["YouTube supprime la chaîne", "Un contenu incohérent, sans identité", "Les outils deviennent payants"], answer: 1, explanation: "Les outils exécutent ; la cohérence (ton, style, rythme) vient de toi." },
          { q: "Pourquoi tester chaque outil sur un échantillon minuscule d'abord ?", choices: ["Pour économiser les crédits gratuits", "Pour comprendre le rôle et les limites de chaque brique avant de produire", "Parce que les outils limitent la durée"], answer: 1, explanation: "Un petit test par brique t'apprend plus vite que de viser une vidéo complète du premier coup." },
          { q: "Où trouver du b-roll libre d'utilisation ?", choices: ["En téléchargeant des vidéos YouTube existantes", "Sur des banques comme Pexels ou Pixabay", "Sur n'importe quel site avec clic droit + enregistrer"], answer: 1, explanation: "Réutiliser des vidéos YouTube sans autorisation = réclamation de droits d'auteur. Les banques libres sont faites pour ça." }
        ],
        micro_project: {
          title: "Ta première mini-production test",
          brief: "Touche les 4 briques de la chaîne de production en produisant 20 à 30 secondes de vidéo test sur ta niche.",
          steps: [
            "Écris 5 phrases de script avec Claude ou ChatGPT, puis réécris-les à ta façon",
            "Génère la voix off avec ElevenLabs (ou enregistre ta propre voix)",
            "Trouve 3 clips de b-roll sur Pexels",
            "Assemble le tout dans CapCut avec des sous-titres"
          ],
          deliverable: "Décris ce que tu as produit : les outils utilisés, ce qui a bien marché, ce qui sonnait robotique, et le lien vers ton test si tu l'as uploadé.",
          validation: "ai"
        },
        xp_reward: 60,
        duration_minutes: 50,
        sort_order: 30
      }
    ]
  },
  {
    slug: "scripts-et-voix-naturels",
    title: "Scripts et voix : éviter le robotique",
    summary: "Le cœur du parcours : écrire et sonner humain alors que l'IA produit la matière.",
    sort_order: 20,
    lessons: [
      {
        slug: "ecrire-un-script-qui-ne-sonne-pas-ia",
        title: "Écrire un script qui ne sonne pas IA",
        intro: "Tout le monde reconnaît un texte 100 % IA : formules creuses (\"plongeons dans le vif du sujet\"), phrases interminables, zéro opinion. Un bon script IA est un script co-écrit : l'IA propose la structure et la matière, toi tu imposes la voix.",
        why_important: "La rétention est LA métrique de YouTube : si les gens partent au bout de 30 secondes, l'algorithme arrête de te recommander. Un script qui sonne humain — rythmé, concret, avec une vraie personnalité — est ce qui garde les gens jusqu'au bout.",
        how_to_use: "Applique la méthode en 3 passes : (1) demande à l'IA un plan et un premier jet en lui donnant ton angle et des exemples de ton ton ; (2) réécris chaque paragraphe à ta main en langage parlé, phrases courtes ; (3) lis le script À VOIX HAUTE — chaque phrase où tu bloques doit être réécrite.",
        objectives: [
          "Construire un hook qui retient dans les 15 premières secondes",
          "Repérer et éliminer les formules typiques de l'IA",
          "Appliquer la méthode des 3 passes (plan IA, réécriture, lecture à voix haute)"
        ],
        resources: [
          { label: "Claude (co-écriture de script)", url: "https://claude.ai/", kind: "tool", why: "Donne-lui ton angle, ton ton et des exemples : il propose, tu disposes.", how: "Demande un plan en 5 parties avec un hook, puis critique chaque partie avant le premier jet." },
          { label: "YouTube Creators : bases de la narration", url: "https://www.youtube.com/creators/", kind: "doc", why: "Les conseils officiels sur la structure d'une vidéo qui retient.", how: "Cherche les contenus sur le storytelling et la rétention." },
          { label: "Think Media : scripts YouTube", url: "https://www.youtube.com/@ThinkMedia", kind: "video", why: "Des exemples concrets de structures de scripts qui fonctionnent.", how: "Regarde une vidéo sur l'écriture de hooks et note la structure proposée." }
        ],
        quiz: [
          { q: "Qu'est-ce qu'un hook ?", choices: ["Le générique de la chaîne", "Les premières secondes qui donnent une raison de rester", "Le lien en description"], answer: 1, explanation: "Le hook pose une promesse, une question ou une tension : sans lui, le spectateur zappe avant 15 secondes." },
          { q: "Lequel de ces signes trahit un script 100 % IA ?", choices: ["Des phrases courtes et concrètes", "Des formules creuses comme \"plongeons dans le vif du sujet\"", "Une anecdote personnelle"], answer: 1, explanation: "Les formules passe-partout, l'absence d'opinion et les phrases interminables sont les marqueurs classiques du texte IA brut." },
          { q: "Pourquoi lire son script à voix haute ?", choices: ["Pour vérifier l'orthographe", "Parce qu'un script est fait pour être entendu : chaque blocage signale une phrase à réécrire", "Pour mémoriser le texte"], answer: 1, explanation: "Un script YouTube est de l'oral écrit. S'il est dur à dire, il sera dur à écouter." },
          { q: "Quel est le bon rôle de l'IA dans l'écriture ?", choices: ["Écrire le script final sans intervention", "Proposer structure et matière que tu réécris avec ta voix", "Choisir la niche à ta place"], answer: 1, explanation: "L'IA accélère la matière première ; la personnalité, les opinions et le rythme viennent de toi." }
        ],
        micro_project: {
          title: "Ton premier script co-écrit",
          brief: "Écris le script complet (60-90 secondes) de ta première vidéo en appliquant la méthode des 3 passes.",
          steps: [
            "Demande à l'IA un plan avec hook sur un sujet de ta niche",
            "Génère un premier jet, puis réécris-le entièrement en langage parlé",
            "Traque et supprime les formules IA (liste-les !)",
            "Lis à voix haute et corrige chaque phrase où tu bloques"
          ],
          deliverable: "Ton script final + la liste des formules IA que tu as supprimées + ce que ta réécriture a changé (ton, rythme, opinions).",
          validation: "ai"
        },
        xp_reward: 60,
        duration_minutes: 50,
        sort_order: 10
      },
      {
        slug: "voix-off-naturelle",
        title: "Une voix off qui sonne naturelle",
        intro: "La voix porte toute la vidéo faceless. Une voix IA mal réglée — débit constant, zéro pause, intonation plate — fait fuir en 10 secondes. Bien réglée et bien scriptée, elle devient difficile à distinguer d'une vraie voix.",
        why_important: "Les spectateurs pardonnent des visuels moyens, jamais une voix pénible. C'est le facteur n°1 de rétention sur le faceless. Et c'est aussi là que se joue le \"trop robotique\" que tu veux éviter.",
        how_to_use: "Dans ElevenLabs, teste plusieurs voix sur LE MÊME paragraphe et compare. Joue avec les réglages (stabilité, similarité). Surtout : travaille le texte lui-même — la ponctuation crée les pauses, les phrases courtes créent le rythme, les questions créent les variations d'intonation. Alternative : enregistre ta propre voix, même imparfaite, elle a déjà ce que l'IA imite.",
        objectives: [
          "Comparer plusieurs voix IA sur un même texte",
          "Utiliser la ponctuation et la structure des phrases pour créer un rythme naturel",
          "Décider entre voix IA et vraie voix pour ta chaîne"
        ],
        resources: [
          { label: "ElevenLabs", url: "https://elevenlabs.io/", kind: "tool", why: "Référence des voix IA naturelles, multilingue, plan gratuit.", how: "Teste 3 voix sur le même paragraphe et règle stabilité/similarité pour chacune." },
          { label: "CapCut (voix et sous-titres)", url: "https://www.capcut.com/", kind: "tool", why: "Pour poser ta voix sur la timeline et vérifier le rythme avec les sous-titres.", how: "Importe ta voix off et regarde si le rythme tient sans les visuels." },
          { label: "Pixabay (musiques libres)", url: "https://pixabay.com/", kind: "tool", why: "Musiques de fond libres qui habillent la voix sans l'écraser.", how: "Choisis une musique à -20 dB sous ta voix et écoute le rendu." }
        ],
        quiz: [
          { q: "Quel est le signe le plus flagrant d'une voix off robotique ?", choices: ["Un débit constant sans pauses ni variations", "Un accent régional", "Une voix grave"], answer: 0, explanation: "L'humain respire, accélère, ralentit. Le débit métronome est le marqueur n°1 du robotique." },
          { q: "Comment créer des pauses naturelles dans une voix IA ?", choices: ["Impossible, c'est aléatoire", "Par la ponctuation et la structure du texte (points, virgules, questions)", "En baissant le volume"], answer: 1, explanation: "Les moteurs de voix suivent la ponctuation : le texte EST le réglage principal." },
          { q: "Pourquoi tester plusieurs voix sur le même paragraphe ?", choices: ["Pour dépenser les crédits gratuits", "Pour comparer objectivement le rendu à texte identique", "Parce que chaque voix a un prix différent"], answer: 1, explanation: "À texte égal, les différences de naturel entre voix sautent aux oreilles." },
          { q: "Ta propre voix, même imparfaite, a un avantage sur l'IA. Lequel ?", choices: ["Elle est gratuite et déjà authentiquement humaine", "Elle est toujours mieux enregistrée", "YouTube la met en avant"], answer: 0, explanation: "L'authenticité est exactement ce que l'IA imite. Une vraie voix, même simple, part avec une longueur d'avance." }
        ],
        micro_project: {
          title: "Ta voix off de référence",
          brief: "Produis la voix off de ton script de la leçon précédente et rends-la aussi naturelle que possible.",
          steps: [
            "Génère la voix off avec 2 voix différentes dans ElevenLabs (ou enregistre la tienne)",
            "Retravaille la ponctuation du script pour améliorer pauses et rythme, puis régénère",
            "Compare les versions et choisis ta voix de chaîne",
            "Note les réglages retenus pour les réutiliser"
          ],
          deliverable: "Décris ta comparaison (voix testées, réglages, ce qui a amélioré le naturel) et ta décision finale : quelle voix pour ta chaîne et pourquoi.",
          validation: "ai"
        },
        xp_reward: 55,
        duration_minutes: 45,
        sort_order: 20
      },
      {
        slug: "garder-l-humain-dans-la-boucle",
        title: "Garder l'humain dans la boucle",
        intro: "La règle d'or du contenu IA : l'IA produit, l'humain dirige et incarne. Les chaînes faceless qui durent ont toutes une personnalité reconnaissable — un ton, des opinions, des anecdotes, des choix. C'est précisément ce qu'aucun prompt ne génère tout seul.",
        why_important: "YouTube renforce ses règles sur le contenu \"produit en masse et répétitif\". Au-delà des règles, l'audience sent le contenu sans âme et ne s'abonne pas. Ta personnalité est ton seul avantage face aux milliers de chaînes qui utilisent les mêmes outils que toi.",
        how_to_use: "Définis la charte de ta chaîne : ton ton (complice ? mystérieux ? direct ?), tes marqueurs récurrents (une phrase d'ouverture, une façon de conclure), ta position (qu'est-ce que TU penses ?). Puis applique la règle 80/20 : l'IA fait 80 % du volume, tu fais les 20 % qui créent l'identité — et ces 20 % font 100 % de la différence.",
        objectives: [
          "Définir la charte éditoriale de ta chaîne (ton, marqueurs, position)",
          "Appliquer la règle 80/20 : l'IA produit, tu incarnes",
          "Connaître les règles YouTube sur le contenu répétitif produit en masse"
        ],
        resources: [
          { label: "Règles de monétisation YouTube", url: "https://support.google.com/youtube/answer/72851", kind: "doc", why: "Les critères officiels du Programme Partenaire, dont les règles sur le contenu répétitif.", how: "Lis la section sur le contenu produit en masse : ta charte doit t'en éloigner clairement." },
          { label: "Emotion26 (analyse de la personnalité)", url: "https://www.youtube.com/results?search_query=emotion26", kind: "video", why: "Repère les marqueurs d'identité d'une chaîne faceless qui fidélise.", how: "Regarde 2 vidéos et liste : phrases récurrentes, ton, façon d'ouvrir et de conclure." },
          { label: "Claude (ton éditeur, pas ton auteur)", url: "https://claude.ai/", kind: "tool", why: "Utilisé en éditeur, il t'aide à renforcer TA voix au lieu de la remplacer.", how: "Colle un de tes textes et demande : \"garde mon ton, améliore seulement le rythme\"." }
        ],
        quiz: [
          { q: "Que dit la règle 80/20 du contenu IA ?", choices: ["80 % de vidéos, 20 % de shorts", "L'IA produit 80 % du volume, l'humain apporte les 20 % qui créent l'identité", "80 % de b-roll, 20 % de texte"], answer: 1, explanation: "Les 20 % humains — ton, opinions, anecdotes, choix — font toute la différence perçue." },
          { q: "Pourquoi une charte éditoriale ?", choices: ["C'est obligatoire pour être monétisé", "Pour garder une identité cohérente vidéo après vidéo", "Pour protéger ses droits d'auteur"], answer: 1, explanation: "La cohérence du ton et des marqueurs transforme des vues en abonnés." },
          { q: "Que risque une chaîne au contenu répétitif produit en masse ?", choices: ["Rien de particulier", "L'exclusion du Programme Partenaire (démonétisation)", "Une simple baisse de qualité vidéo"], answer: 1, explanation: "YouTube exclut du Programme Partenaire les contenus produits en masse sans valeur ajoutée originale." },
          { q: "Quel est le meilleur usage de l'IA pour préserver ta voix ?", choices: ["Lui demander d'écrire tout le contenu final", "L'utiliser comme éditeur qui améliore TES textes", "Copier les scripts des chaînes concurrentes"], answer: 1, explanation: "En mode éditeur, l'IA polit ton style au lieu de le remplacer par le sien." }
        ],
        micro_project: {
          title: "La charte de ta chaîne",
          brief: "Rédige la charte éditoriale qui rendra ta chaîne reconnaissable entre mille.",
          steps: [
            "Définis ton ton en 3 adjectifs et ta promesse en une phrase",
            "Invente 2 marqueurs récurrents (ouverture, conclusion, phrase fétiche...)",
            "Écris ta position : ce que ta chaîne pense/défend que les autres n'osent pas",
            "Liste 3 choses que ta chaîne ne fera jamais (anti-charte)"
          ],
          deliverable: "Ta charte complète : ton, promesse, marqueurs, position, anti-charte — et comment elle t'éloigne du contenu générique.",
          validation: "ai"
        },
        xp_reward: 60,
        duration_minutes: 40,
        sort_order: 30
      }
    ]
  },
  {
    slug: "production-video-faceless",
    title: "Production vidéo faceless",
    summary: "Visuels, montage rythmé, titres et miniatures qui donnent envie de cliquer.",
    sort_order: 30,
    lessons: [
      {
        slug: "visuels-broll-et-montage",
        title: "Visuels, b-roll et montage rythmé",
        intro: "En faceless, l'image doit bouger : un plan statique de plus de 5 secondes fait décrocher. Le trio gagnant : du b-roll cohérent, des sous-titres dynamiques et un montage qui suit le rythme de la voix.",
        why_important: "Le montage est le deuxième pilier de la rétention après le script. Les mêmes 60 secondes de voix peuvent retenir ou faire fuir selon le rythme des plans, la présence de sous-titres et la cohérence visuelle.",
        how_to_use: "Dans CapCut : importe ta voix off d'abord, puis pose les visuels SUR le rythme de la voix (change de plan à chaque idée, toutes les 3 à 5 secondes). Active les sous-titres automatiques et corrige-les. Ajoute une musique de fond discrète (bien plus basse que la voix) et 2-3 effets sonores aux moments clés.",
        objectives: [
          "Monter au rythme de la voix (un plan par idée, 3-5 secondes)",
          "Utiliser sous-titres automatiques et musique au bon niveau",
          "Assurer la cohérence visuelle (couleurs, style, transitions sobres)"
        ],
        resources: [
          { label: "CapCut", url: "https://www.capcut.com/", kind: "tool", why: "Montage gratuit avec sous-titres automatiques et export sans filigrane en HD.", how: "Monte ta première vidéo : voix d'abord, visuels ensuite, sous-titres corrigés." },
          { label: "Pexels Vidéos", url: "https://www.pexels.com/videos/", kind: "tool", why: "Le plus grand choix de b-roll gratuit et libre de droits.", how: "Construis une mini-bibliothèque de 10 clips cohérents avec ton style." },
          { label: "DaVinci Resolve", url: "https://www.blackmagicdesign.com/products/davinciresolve", kind: "tool", why: "L'option pro et gratuite quand tu voudras aller plus loin que CapCut.", how: "Garde-le pour plus tard : commence simple avec CapCut." }
        ],
        quiz: [
          { q: "Quelle durée maximale pour un même plan en faceless ?", choices: ["15 secondes", "3 à 5 secondes en général", "1 minute"], answer: 1, explanation: "Changer de plan régulièrement relance l'attention — c'est le b.a.-ba de la rétention visuelle." },
          { q: "Pourquoi monter la voix off en premier ?", choices: ["Pour gagner de la place disque", "Parce que les visuels se calent sur le rythme de la voix, pas l'inverse", "C'est une obligation de CapCut"], answer: 1, explanation: "La voix porte la narration : les plans viennent l'illustrer au bon moment." },
          { q: "À quoi servent les sous-titres dynamiques ?", choices: ["À remplacer la voix off", "À retenir l'attention et rendre la vidéo regardable sans le son", "À améliorer le référencement uniquement"], answer: 1, explanation: "Une grande partie des vues se fait sans le son : les sous-titres gardent ces spectateurs." },
          { q: "Comment régler la musique de fond ?", choices: ["Au même volume que la voix", "Nettement en dessous de la voix", "Uniquement sur l'intro"], answer: 1, explanation: "La musique habille, la voix raconte : si la musique couvre la voix, le spectateur part." }
        ],
        micro_project: {
          title: "Ta première vidéo montée",
          brief: "Monte ta première vidéo complète (60-90 secondes) avec le script et la voix des leçons précédentes.",
          steps: [
            "Pose ta voix off sur la timeline CapCut",
            "Ajoute un plan par idée (3-5 secondes max chacun)",
            "Active et corrige les sous-titres automatiques",
            "Ajoute musique discrète + 2 effets sonores, puis exporte en HD"
          ],
          deliverable: "Le lien vers ta vidéo exportée (YouTube en non répertorié, ou Drive) + ce que tu as appris sur le rythme au montage.",
          validation: "ai"
        },
        xp_reward: 60,
        duration_minutes: 60,
        sort_order: 10
      },
      {
        slug: "titres-et-miniatures",
        title: "Titres et miniatures qui font cliquer",
        intro: "Personne ne voit ton montage si personne ne clique. Le duo titre + miniature est ta vitrine : il doit faire une promesse claire et créer une curiosité que la vidéo tiendra. Promettre sans tenir = clickbait = rétention qui s'effondre.",
        why_important: "Le CTR (taux de clic) décide si YouTube continue de montrer ta vidéo. Un bon contenu avec une mauvaise miniature reste invisible. C'est aussi un terrain de jeu idéal pour l'IA : générer des variantes et les tester.",
        how_to_use: "Pour chaque vidéo, écris 5 titres candidats (avec l'aide de l'IA) et garde celui qui combine promesse + curiosité en moins de 60 caractères. Crée la miniature dans Canva : 1 idée visuelle forte, 3-4 mots max, contraste élevé, lisible en tout petit. Inspire-toi des miniatures des chaînes que tu as analysées au module 1.",
        objectives: [
          "Écrire des titres qui combinent promesse et curiosité",
          "Créer une miniature lisible et contrastée dans Canva",
          "Comprendre le lien CTR + rétention = recommandation"
        ],
        resources: [
          { label: "Canva", url: "https://www.canva.com/", kind: "tool", why: "Création de miniatures simple avec des centaines de modèles YouTube.", how: "Pars d'un modèle, réduis à 3-4 mots, vérifie la lisibilité en taille réduite." },
          { label: "VidIQ (analyse des titres)", url: "https://vidiq.com/", kind: "tool", why: "Voir les titres qui performent dans ta niche.", how: "Analyse les 10 vidéos les plus vues de ta niche : quelles promesses font leurs titres ?" },
          { label: "YouTube Creators", url: "https://www.youtube.com/creators/", kind: "doc", why: "Les bonnes pratiques officielles sur titres et miniatures.", how: "Cherche les contenus sur les miniatures et note les règles de lisibilité." }
        ],
        quiz: [
          { q: "Que mesure le CTR ?", choices: ["Le temps de visionnage", "La proportion de personnes qui cliquent quand la vidéo leur est montrée", "Le nombre d'abonnés gagnés"], answer: 1, explanation: "CTR = clics / impressions. C'est la première porte : sans clic, pas de visionnage." },
          { q: "Quel est le problème du clickbait (promettre sans tenir) ?", choices: ["C'est interdit par YouTube", "Les gens partent vite, la rétention s'effondre et la vidéo n'est plus recommandée", "Ça coûte plus cher"], answer: 1, explanation: "YouTube croise CTR ET rétention : un clic déçu se paie cash sur la recommandation." },
          { q: "Combien de mots maximum sur une miniature ?", choices: ["Une phrase complète", "3 à 4 mots", "Aucun texte autorisé"], answer: 1, explanation: "La miniature s'affiche en tout petit : au-delà de 4 mots, elle devient illisible." },
          { q: "Bonne pratique pour choisir un titre ?", choices: ["Prendre le premier qui vient", "Écrire plusieurs variantes et choisir celle qui combine promesse + curiosité", "Copier le titre d'une vidéo concurrente"], answer: 1, explanation: "Générer des variantes (l'IA aide bien) puis sélectionner est la méthode des chaînes qui percent." }
        ],
        micro_project: {
          title: "Le packaging de ta première vidéo",
          brief: "Crée le titre et la miniature de ta première vidéo, avec variantes et justification.",
          steps: [
            "Génère 5 titres candidats avec l'IA et choisis le meilleur (explique pourquoi)",
            "Crée 2 miniatures différentes dans Canva",
            "Teste leur lisibilité en taille réduite (zoom arrière)",
            "Choisis ta combinaison finale titre + miniature"
          ],
          deliverable: "Tes 5 titres avec le gagnant justifié + la description de tes 2 miniatures et celle retenue (lien Canva ou upload si possible).",
          validation: "ai"
        },
        xp_reward: 55,
        duration_minutes: 45,
        sort_order: 20
      }
    ]
  },
  {
    slug: "publier-et-monetiser",
    title: "Publier, analyser, monétiser",
    summary: "Lancer la chaîne, lire les bonnes métriques et construire le chemin vers le premier euro.",
    sort_order: 40,
    lessons: [
      {
        slug: "lancer-et-optimiser-sa-chaine",
        title: "Lancer et optimiser sa chaîne",
        intro: "Ta chaîne est ta vitrine : nom, bannière, description et organisation doivent dire en 3 secondes de quoi tu parles et pourquoi s'abonner. Ensuite vient la règle qui fait tout : la régularité.",
        why_important: "L'algorithme apprend de chaque publication. Une chaîne optimisée et régulière (même 1 vidéo/semaine) accumule des signaux ; une chaîne irrégulière repart de zéro à chaque fois. Les métadonnées (titre, description, tags) aident YouTube à comprendre à qui te recommander.",
        how_to_use: "Crée ta chaîne avec le nom choisi au module 1. Rédige une description qui dit : ce que tu publies, pour qui, à quelle fréquence. Fais ta bannière dans Canva. Publie ta première vidéo avec un titre travaillé, une description de 2-3 phrases contenant tes mots-clés, et des tags cohérents. Fixe ton rythme de publication et tiens-le.",
        objectives: [
          "Créer une chaîne dont l'identité est claire en 3 secondes",
          "Publier avec des métadonnées propres (titre, description, tags)",
          "Fixer un rythme de publication tenable"
        ],
        resources: [
          { label: "Aide YouTube (créer et gérer sa chaîne)", url: "https://support.google.com/youtube/", kind: "doc", why: "La documentation officielle pour la configuration de la chaîne.", how: "Suis le guide de création de chaîne et vérifie chaque paramètre de base." },
          { label: "Canva (bannière de chaîne)", url: "https://www.canva.com/", kind: "tool", why: "Modèles de bannières YouTube aux bonnes dimensions.", how: "Crée une bannière qui reprend la promesse de ta charte en une phrase." },
          { label: "VidIQ (tags et mots-clés)", url: "https://vidiq.com/", kind: "tool", why: "Suggestions de tags et mots-clés pour tes premières vidéos.", how: "Prépare une liste de 10 mots-clés de ta niche à réutiliser." }
        ],
        quiz: [
          { q: "Que doit comprendre un visiteur en 3 secondes sur ta chaîne ?", choices: ["Ton matériel de tournage", "De quoi tu parles et pourquoi s'abonner", "Ton âge et ta ville"], answer: 1, explanation: "Nom + bannière + description = ta promesse. Si elle est floue, pas d'abonnement." },
          { q: "Pourquoi la régularité compte-t-elle autant ?", choices: ["YouTube facture les chaînes inactives", "L'algorithme et l'audience apprennent à compter sur toi ; chaque vidéo nourrit la suivante", "C'est purement psychologique"], answer: 1, explanation: "La régularité accumule des signaux pour l'algorithme et crée un rendez-vous pour l'audience." },
          { q: "À quoi servent les métadonnées (titre, description, tags) ?", choices: ["À décorer la page", "À aider YouTube à comprendre le sujet et à qui recommander la vidéo", "À éviter les droits d'auteur"], answer: 1, explanation: "Les métadonnées sont le contexte que tu donnes à l'algorithme pour bien te classer." },
          { q: "Quel rythme de publication choisir au début ?", choices: ["Une vidéo par jour absolument", "Un rythme que tu peux tenir sur la durée (ex : 1/semaine)", "Publier seulement quand l'inspiration vient"], answer: 1, explanation: "Mieux vaut 1 vidéo/semaine pendant 6 mois que 5 vidéos en 1 semaine puis plus rien." }
        ],
        micro_project: {
          title: "Ta chaîne en ligne",
          brief: "Crée ta chaîne, optimise-la et publie ta première vidéo.",
          steps: [
            "Crée la chaîne : nom, bannière Canva, description avec ta promesse",
            "Publie ta première vidéo avec titre, description et tags travaillés",
            "Fixe ton rythme de publication et bloque le créneau dans ton agenda",
            "Planifie les 3 prochains sujets"
          ],
          deliverable: "Le lien de ta chaîne + ta première vidéo publiée + ton rythme choisi et tes 3 prochains sujets.",
          validation: "ai",
          requires_link: true
        },
        xp_reward: 70,
        duration_minutes: 50,
        sort_order: 10
      },
      {
        slug: "analyser-et-monetiser",
        title: "Analyser, itérer et monétiser",
        intro: "Publier n'est que le début : les chaînes qui percent lisent leurs statistiques et itèrent. Et dès le départ, tu construis ton chemin vers le premier euro — sans attendre les seuils du Programme Partenaire.",
        why_important: "YouTube Studio te dit exactement quoi améliorer : le CTR juge ton packaging, la rétention juge ton contenu. Côté revenus, le Programme Partenaire (1 000 abonnés + 4 000 h de visionnage) n'est qu'UNE voie — l'affiliation, tes produits ou tes services peuvent générer ton premier euro bien avant.",
        how_to_use: "Après chaque vidéo, regarde 3 chiffres dans YouTube Studio : impressions, CTR, courbe de rétention (où les gens partent-ils ?). Tire UNE leçon par vidéo et applique-la à la suivante. En parallèle, choisis ta première source de revenu réaliste : lien d'affiliation en description, produit numérique, prestation — et relie-la à ton projet TakaCode pour déclarer ton premier euro.",
        objectives: [
          "Lire CTR, impressions et rétention dans YouTube Studio",
          "Itérer : une leçon appliquée par vidéo",
          "Choisir ta première source de revenu (avant même le Programme Partenaire)"
        ],
        resources: [
          { label: "Programme Partenaire YouTube (conditions)", url: "https://support.google.com/youtube/answer/72851", kind: "doc", why: "Les conditions officielles de monétisation par la pub (seuils, règles de contenu).", how: "Note les seuils et vérifie que ta chaîne respecte les règles sur l'originalité." },
          { label: "Aide YouTube Analytics", url: "https://support.google.com/youtube/", kind: "doc", why: "Comprendre chaque métrique de YouTube Studio.", how: "Cherche \"analytics\" et lis les pages sur la rétention et le CTR." },
          { label: "TakaCode : ton cockpit projet", url: "https://takacode.vercel.app/dashboard", kind: "tool", why: "Ta chaîne EST ton projet : suis ta progression vers le premier euro ici.", how: "Renseigne le modèle de revenu de ton projet et déclare ton premier euro le jour venu." }
        ],
        quiz: [
          { q: "Quels sont les seuils du Programme Partenaire YouTube (voie classique) ?", choices: ["100 abonnés et 100 vues", "1 000 abonnés et 4 000 heures de visionnage sur 12 mois", "10 000 abonnés uniquement"], answer: 1, explanation: "1 000 abonnés + 4 000 h (ou le seuil Shorts) : c'est la voie pub — pas la seule voie de revenu." },
          { q: "Que t'apprend la courbe de rétention ?", choices: ["Le revenu de la vidéo", "À quels moments précis les spectateurs quittent la vidéo", "Le nombre de partages"], answer: 1, explanation: "Chaque chute de la courbe pointe un passage à améliorer : hook trop lent, longueur, rythme..." },
          { q: "Comment gagner son premier euro AVANT le Programme Partenaire ?", choices: ["Impossible avant 1 000 abonnés", "Affiliation, produits numériques ou prestations liés à ta niche", "En achetant des vues"], answer: 1, explanation: "Un lien d'affiliation pertinent en description peut convertir dès tes premières centaines de vues." },
          { q: "Quelle est la bonne méthode d'itération ?", choices: ["Tout changer à chaque vidéo", "Tirer une leçon des stats par vidéo et l'appliquer à la suivante", "Ne rien changer pendant 50 vidéos"], answer: 1, explanation: "Une amélioration ciblée par vidéo = progression mesurable sans perdre ton identité." }
        ],
        micro_project: {
          title: "Ton plan premier euro",
          brief: "Analyse tes premières statistiques et construis ton plan de monétisation réaliste.",
          steps: [
            "Relève impressions, CTR et rétention de ta première vidéo dans YouTube Studio",
            "Identifie UNE amélioration pour la prochaine vidéo",
            "Choisis ta première source de revenu (affiliation, produit, prestation) et explique pourquoi",
            "Renseigne le modèle de revenu dans ton projet TakaCode"
          ],
          deliverable: "Tes 3 chiffres + l'amélioration choisie + ton plan premier euro : quelle source, quelle mise en place, quel objectif de date.",
          validation: "ai"
        },
        xp_reward: 70,
        duration_minutes: 50,
        sort_order: 20
      }
    ]
  }
];

async function main() {
  // 1. Parcours
  const { data: track, error: trackError } = await supabase
    .from("learning_tracks")
    .upsert(TRACK, { onConflict: "slug" })
    .select("id, slug")
    .single();
  if (trackError) {
    console.error("learning_tracks:", trackError.message);
    process.exit(1);
  }
  console.log(`Parcours "${track.slug}" OK (${track.id})`);

  // 2. Modules + leçons
  for (const mod of MODULES) {
    const { lessons, ...moduleRow } = mod;
    const { data: moduleData, error: moduleError } = await supabase
      .from("track_modules")
      .upsert({ ...moduleRow, track_id: track.id, is_published: true }, { onConflict: "track_id,slug" })
      .select("id, slug")
      .single();
    if (moduleError) {
      console.error(`module ${mod.slug}:`, moduleError.message);
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
    console.log(`  Module "${moduleData.slug}" OK (${lessons.length} lecons)`);
  }

  console.log("\nSeed termine. Le parcours est publie.");
}

await main();
