// Seed du parcours "Produits digitaux : créer et vendre".
//
// Usage : node scripts/seed-produits-digitaux.mjs
// Idempotent : upsert par slug (parcours, modules, leçons).
// Contenu accentué (skill .claude/skills/francais-accents : le contenu BDD est
// en français correct ; slugs et valeurs techniques sans accents).
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
  slug: "produits-digitaux",
  goal_key: "digital_business",
  title: "Produits digitaux : créer et vendre",
  summary: "Ebooks, templates, mini-formations : crée un produit une fois, vends-le à l'infini — la voie la plus directe vers ton premier euro.",
  description:
    "Le parcours Build to Earn de TakaCode : tu choisis un produit digital adapté à tes compétences (ebook, template Notion ou Canva, mini-formation, micro-outil), tu valides la demande AVANT de créer, tu le produis avec l'IA comme assistant, puis tu montes ta boutique (Gumroad, Ko-fi, Lemon Squeezy), tu écris une page de vente qui convertit et tu lances. Chaque micro-projet est une brique de ton vrai produit : à la fin, ta boutique est en ligne et ton plan premier euro est actif dans ton cockpit projet.",
  level_label: "Débutant",
  duration_weeks: 4,
  accent_color: "#F59E0B",
  icon: "lucide:package",
  objective: "Mettre en vente ton premier produit digital et encaisser ton premier euro.",
  resources: ["Gumroad", "Ko-fi", "Lemon Squeezy", "Canva"],
  next_session: "Mardi 19h00",
  next_steps: [
    { label: "Choisir son produit", state: "current" },
    { label: "Créer avec l'IA", state: "locked" },
    { label: "Construire sa boutique", state: "locked" },
    { label: "Lancer et encaisser", state: "locked" }
  ],
  sort_order: 6,
  is_published: true,
  is_active: true
};

const MODULES = [
  {
    slug: "choisir-son-produit",
    title: "Choisir son produit digital",
    summary: "Panorama des produits, choix selon tes forces, et validation AVANT de créer.",
    sort_order: 10,
    lessons: [
      {
        slug: "panorama-des-produits-digitaux",
        title: "Le panorama des produits digitaux",
        intro: "Un produit digital se crée une fois et se vend à l'infini, sans stock ni livraison : ebook, template (Notion, Canva, code), mini-formation, presets, micro-outil. C'est le modèle de revenu avec la marge la plus élevée qui existe — à condition de choisir le bon produit.",
        why_important: "Choisir le bon TYPE de produit avant de créer t'évite l'erreur classique : passer deux mois sur un produit que personne n'attend. Chaque type a son effort de création, son prix moyen et son canal de vente naturels.",
        how_to_use: "Explore les marketplaces pour voir ce qui se vend vraiment : parcours les produits populaires sur Gumroad, les templates Notion les plus téléchargés, les boutiques Ko-fi de créateurs. Note les prix pratiqués et les promesses des pages de vente.",
        objectives: [
          "Citer les 5 grandes familles de produits digitaux et leurs prix moyens",
          "Comprendre l'économie du digital (création unique, vente illimitée)",
          "Repérer ce qui se vend déjà dans les marketplaces"
        ],
        resources: [
          { label: "Gumroad (marketplace)", url: "https://gumroad.com/", kind: "tool", why: "LA plateforme de référence pour vendre des produits digitaux, avec une section découverte.", how: "Parcours la section Discover et note 5 produits qui se vendent bien dans un domaine qui t'attire." },
          { label: "Templates Notion (galerie officielle)", url: "https://www.notion.com/templates", kind: "doc", why: "Des milliers de templates, gratuits et payants : un marché entier à observer.", how: "Regarde les templates payants les mieux classés : quels problèmes résolvent-ils ?" },
          { label: "Ko-fi (boutiques de créateurs)", url: "https://ko-fi.com/", kind: "tool", why: "Boutique + dons + abonnements, très utilisé par les petits créateurs francophones.", how: "Explore quelques boutiques de créateurs et note comment ils présentent leurs produits." }
        ],
        quiz: [
          { q: "Quel est l'avantage économique principal d'un produit digital ?", choices: ["Il se crée une fois et se vend à l'infini, sans stock", "Il est toujours gratuit à produire", "Il se vend plus cher qu'un produit physique"], answer: 0, explanation: "Pas de stock, pas de livraison, marge quasi totale : c'est le levier du digital." },
          { q: "Lequel de ces produits N'EST PAS un produit digital ?", choices: ["Un template Notion", "Un coaching en visio à l'heure", "Un ebook PDF"], answer: 1, explanation: "Le coaching vend ton temps (service) : il ne se duplique pas. Un produit digital se vend sans toi." },
          { q: "Pourquoi observer les marketplaces avant de créer ?", choices: ["Pour copier un produit existant à l'identique", "Pour voir ce qui se vend réellement, à quel prix, avec quelle promesse", "C'est obligatoire légalement"], answer: 1, explanation: "Les best-sellers d'une marketplace sont une étude de marché gratuite : demande prouvée, prix de référence." },
          { q: "Quel produit demande le MOINS d'effort de création pour commencer ?", choices: ["Une formation vidéo de 10 heures", "Un template ou un guide court qui résout UN problème précis", "Un logiciel complet"], answer: 1, explanation: "Commencer petit : un produit d'entrée simple valide ta capacité à vendre avant d'investir des semaines." }
        ],
        micro_project: {
          title: "Ton étude de marché express",
          brief: "Observe ce qui se vend déjà pour repérer les opportunités de ta future boutique.",
          steps: [
            "Choisis 2 marketplaces (Gumroad, templates Notion, Ko-fi...)",
            "Liste 5 produits qui se vendent bien : type, prix, promesse de la page",
            "Note pour chacun le problème précis qu'il résout",
            "Repère un manque ou un angle que tu pourrais couvrir"
          ],
          deliverable: "Ta liste des 5 produits observés (type, prix, promesse, problème résolu) et l'opportunité que tu as repérée.",
          validation: "ai"
        },
        xp_reward: 50,
        duration_minutes: 40,
        sort_order: 10
      },
      {
        slug: "choisir-selon-tes-forces",
        title: "Choisir selon tes forces et ton audience",
        intro: "Le bon produit est à l'intersection de trois cercles : ce que tu sais faire (ou apprendre vite), ce que des gens cherchent activement, et ce que tu peux créer en moins d'un mois. Ta matrice de décision remplace l'intuition.",
        why_important: "Un produit aligné avec tes compétences se crée 5 fois plus vite et sonne authentique. Un produit aligné avec une demande réelle se vend sans forcer. Il te faut les deux — et un premier produit VOLONTAIREMENT petit.",
        how_to_use: "Remplis la matrice : liste tes compétences et sujets maîtrisés, croise avec les recherches (Google Trends, marketplaces de la leçon 1), puis note chaque idée sur 3 critères : demande (1-5), effort (1-5, inversé), envie (1-5). Le meilleur score gagne. Demande à l'IA de challenger ton choix.",
        objectives: [
          "Construire ta matrice compétences x demande x effort",
          "Distinguer produit d'entrée (petit prix) et produit phare",
          "Choisir UN produit réalisable en moins d'un mois"
        ],
        resources: [
          { label: "Google Trends", url: "https://trends.google.com/trends/", kind: "tool", why: "Vérifier que l'intérêt pour ton sujet est stable ou croissant.", how: "Compare tes 3 sujets candidats sur 5 ans, en France ou sur ta zone cible." },
          { label: "Claude (challenger de choix)", url: "https://claude.ai/", kind: "tool", why: "Excellent pour stress-tester une idée : demande-lui les 5 raisons pour lesquelles ton produit pourrait ne pas se vendre.", how: "Colle ta matrice et demande une critique honnête de ton choix." },
          { label: "Centre d'aide Gumroad", url: "https://help.gumroad.com/", kind: "doc", why: "Les guides officiels sur ce qui marche pour les créateurs débutants.", how: "Lis les articles sur le choix et le lancement d'un premier produit." }
        ],
        quiz: [
          { q: "Quels sont les 3 cercles de la matrice de choix ?", choices: ["Compétences, demande, effort de création", "Prix, couleur, plateforme", "Marketing, design, code"], answer: 0, explanation: "Un produit à l'intersection des trois se crée vite, se vend bien et reste motivant." },
          { q: "Pourquoi commencer par un produit d'entrée (petit prix) ?", choices: ["Parce que les gros produits sont interdits aux débutants", "Pour valider vite ta capacité à créer ET à vendre, avec un risque minimal", "Parce que ça rapporte plus"], answer: 1, explanation: "Le premier produit t'apprend tout le cycle : création, page de vente, lancement. Petit = rapide = apprentissage rapide." },
          { q: "Ton produit devrait être réalisable en...", choices: ["Moins d'un mois", "Un an minimum pour la qualité", "Un week-end obligatoirement"], answer: 0, explanation: "Au-delà d'un mois sans feedback du marché, le risque de créer dans le vide explose." },
          { q: "Quel est le bon usage de l'IA à cette étape ?", choices: ["Lui laisser choisir le produit à ta place", "Challenger ton choix : lui demander pourquoi ça pourrait échouer", "Ignorer l'IA pour cette étape"], answer: 1, explanation: "L'IA est un excellent avocat du diable : elle expose les faiblesses que ton enthousiasme masque." }
        ],
        micro_project: {
          title: "Ta matrice de décision",
          brief: "Choisis TON produit avec une matrice, pas une intuition.",
          steps: [
            "Liste 5 compétences ou sujets que tu maîtrises",
            "Croise avec ta veille de la leçon 1 : 3 idées de produits candidates",
            "Note chaque idée : demande /5, effort inversé /5, envie /5",
            "Choisis le gagnant et fais challenger ce choix par l'IA"
          ],
          deliverable: "Ta matrice complète (3 idées notées), le produit choisi, et les 2 objections de l'IA avec tes réponses.",
          validation: "ai"
        },
        xp_reward: 55,
        duration_minutes: 45,
        sort_order: 20
      },
      {
        slug: "valider-avant-de-creer",
        title: "Valider la demande AVANT de créer",
        intro: "La règle d'or des produits digitaux : ne crée rien avant d'avoir un signal de demande. Une page d'attente, quelques conversations ou une pré-vente te disent en une semaine ce que deux mois de création ne garantissent pas.",
        why_important: "80 % des produits qui ne se vendent pas ont été créés sans validation. Une pré-vente à 5 euros vaut mieux que 100 avis polis : les gens votent avec leur carte, pas avec leurs encouragements.",
        how_to_use: "Monte une validation minimale en 2 heures : une page simple qui décrit le produit (promesse, sommaire, prix) avec un bouton de pré-commande (Stripe Payment Links ou Gumroad en mode pré-vente) ou un formulaire d'intérêt (Tally). Partage-la à 20 personnes de ta cible et compte les signaux réels.",
        objectives: [
          "Créer une page de validation en moins de 2 heures",
          "Distinguer signal réel (paiement, email) et signal poli (like)",
          "Décider objectivement : créer, pivoter ou abandonner"
        ],
        resources: [
          { label: "Stripe Payment Links", url: "https://stripe.com/payment-links", kind: "tool", why: "Un lien de paiement en 5 minutes, sans site : parfait pour une pré-vente.", how: "Crée un lien de pré-commande à petit prix pour ton produit." },
          { label: "Tally (formulaires gratuits)", url: "https://tally.so/", kind: "tool", why: "Le formulaire le plus simple pour collecter des emails d'intérêt.", how: "Crée un formulaire « préviens-moi à la sortie » avec 2 questions sur le besoin." },
          { label: "Canva (page simple)", url: "https://www.canva.com/", kind: "tool", why: "Pour maquetter une page de présentation propre sans coder.", how: "Une page : promesse, 3 bénéfices, sommaire, prix, bouton." }
        ],
        quiz: [
          { q: "Quel est le signal de validation le plus fiable ?", choices: ["Des likes sur ton post", "Un paiement ou une pré-commande", "Un ami qui dit « super idée »"], answer: 1, explanation: "Les gens votent avec leur carte. Tout le reste est de la politesse." },
          { q: "Combien de temps devrait prendre ta validation minimale ?", choices: ["Deux mois", "Environ 2 heures de mise en place, une semaine de signaux", "Une heure par an"], answer: 1, explanation: "La validation doit être rapide et peu coûteuse : c'est son intérêt face à la création à l'aveugle." },
          { q: "Ta page de validation doit contenir au minimum...", choices: ["La promesse, le sommaire, le prix et un appel à l'action", "Uniquement ton CV", "Le produit complet téléchargeable"], answer: 0, explanation: "On valide la PROMESSE et le PRIX, pas le produit fini — qui n'existe pas encore." },
          { q: "Personne ne pré-commande après 20 partages ciblés. Que fais-tu ?", choices: ["Tu crées quand même, ils ont tort", "Tu pivotes la promesse ou le produit, puis tu re-testes", "Tu abandonnes définitivement les produits digitaux"], answer: 1, explanation: "Un non du marché est une information, pas une condamnation : ajuste l'angle, le prix ou la cible et re-teste." }
        ],
        micro_project: {
          title: "Ta page de validation en ligne",
          brief: "Monte ta validation minimale et récolte tes premiers signaux réels.",
          steps: [
            "Rédige la promesse et le sommaire de ton produit (avec l'aide de l'IA, puis à ta voix)",
            "Crée la page ou le formulaire (Tally, Payment Link ou Gumroad pré-vente)",
            "Partage à au moins 10 personnes de ta cible",
            "Compte les signaux réels (emails, clics, pré-commandes) et conclus"
          ],
          deliverable: "Le lien de ta page de validation, le nombre de personnes touchées, les signaux obtenus et ta décision (créer, pivoter, re-tester).",
          validation: "ai",
          requires_link: true
        },
        xp_reward: 65,
        duration_minutes: 55,
        sort_order: 30
      }
    ]
  },
  {
    slug: "creer-avec-l-ia",
    title: "Créer son produit avec l'IA",
    summary: "Ebook, template ou mini-formation : produire vite et bien, sans contenu générique.",
    sort_order: 20,
    lessons: [
      {
        slug: "creer-un-ebook-ou-guide",
        title: "Créer un ebook ou un guide avec l'IA",
        intro: "Un bon ebook ne se juge pas au nombre de pages mais au problème qu'il résout. L'IA accélère la structure et les premiers jets ; ta valeur ajoutée, ce sont tes exemples, ton expérience et ta méthode — la règle 80/20 vue dans le parcours création de contenu s'applique à l'identique.",
        why_important: "Les acheteurs détectent immédiatement un PDF généré en un prompt : générique, verbeux, sans vécu. Ce qui se vend, c'est un guide actionnable avec des exemples réels et une voix. C'est aussi ce qui t'évite les remboursements et les mauvais avis.",
        how_to_use: "Méthode en 4 temps : (1) plan détaillé co-écrit avec l'IA à partir de ta promesse validée ; (2) premier jet chapitre par chapitre, que tu réécris avec tes exemples ; (3) relecture par l'IA en mode éditeur (« garde mon ton, améliore le rythme ») ; (4) mise en page propre dans Canva et export PDF.",
        objectives: [
          "Structurer un guide autour d'UN problème et d'UN résultat",
          "Appliquer la règle 80/20 : l'IA produit, tu incarnes",
          "Mettre en page un PDF professionnel dans Canva"
        ],
        resources: [
          { label: "Claude (co-écriture)", url: "https://claude.ai/", kind: "tool", why: "Structure, premiers jets et relecture éditoriale en gardant TA voix.", how: "Donne ta promesse validée et demande un plan en chapitres orientés action." },
          { label: "Canva (mise en page ebook)", url: "https://www.canva.com/", kind: "tool", why: "Des centaines de modèles d'ebooks : couverture, sommaire, pages types.", how: "Pars d'un modèle, applique tes couleurs, exporte en PDF haute qualité." },
          { label: "Google Docs (écriture)", url: "https://docs.google.com/", kind: "tool", why: "Écrire et structurer avant la mise en page, avec commentaires pour tes relecteurs.", how: "Rédige tout le contenu ici, fais relire une personne de ta cible avant Canva." }
        ],
        quiz: [
          { q: "Qu'est-ce qui fait la valeur d'un ebook payant ?", choices: ["Son nombre de pages", "Le problème précis qu'il résout, avec des exemples et une méthode", "Sa couverture uniquement"], answer: 1, explanation: "On achète un résultat, pas du volume. 30 pages actionnables battent 200 pages de remplissage." },
          { q: "Quel est le signe d'un ebook « généré en un prompt » ?", choices: ["Des exemples concrets et personnels", "Un texte générique, verbeux, sans vécu ni opinion", "Un sommaire clair"], answer: 1, explanation: "C'est exactement ce que la règle 80/20 corrige : l'IA produit la matière, toi tu apportes le vécu." },
          { q: "Quel est le bon ordre de production ?", choices: ["Mise en page d'abord, contenu ensuite", "Plan, jet par chapitre réécrit, relecture IA, puis mise en page", "Tout écrire d'un coup sans plan"], answer: 1, explanation: "Le plan verrouille la structure, la réécriture apporte ta voix, la mise en page vient en dernier." },
          { q: "Pourquoi faire relire par une personne de ta cible avant publication ?", choices: ["Pour la politesse", "Pour vérifier que le guide est actionnable par quelqu'un qui a VRAIMENT le problème", "Ce n'est pas utile si l'IA a relu"], answer: 1, explanation: "L'IA vérifie la forme ; seul un lecteur cible vérifie que le contenu tient sa promesse." }
        ],
        micro_project: {
          title: "Le premier chapitre de ton produit",
          brief: "Produis le plan complet et le premier chapitre fini de ton ebook ou guide (ou l'équivalent pour ton produit).",
          steps: [
            "Co-écris le plan en chapitres avec l'IA à partir de ta promesse validée",
            "Rédige le premier chapitre : jet IA puis réécriture avec TES exemples",
            "Passe une relecture IA en mode éditeur (garde ta voix)",
            "Mets en page ce chapitre dans Canva (couverture + 3-5 pages)"
          ],
          deliverable: "Ton plan complet + le premier chapitre mis en page (colle le texte et décris la mise en page, ou donne un lien de partage).",
          validation: "ai"
        },
        xp_reward: 60,
        duration_minutes: 60,
        sort_order: 10
      },
      {
        slug: "creer-des-templates",
        title: "Créer des templates qui font gagner du temps",
        intro: "Un template se vend s'il transforme des heures de travail en minutes : tableau de bord Notion, kit de visuels Canva, starter de code. La valeur est dans le temps gagné ET dans la documentation qui rend le template utilisable sans toi.",
        why_important: "Le template est le produit digital le plus rapide à créer quand tu utilises déjà l'outil au quotidien : tu vends ton organisation. Mais un template sans guide d'utilisation génère du support et des remboursements.",
        how_to_use: "Pars d'un système que TU utilises vraiment (ton suivi de projet Notion, tes visuels de chaîne, ton starter de code). Nettoie-le, généralise-le (enlève tes données), documente chaque section (une vidéo Loom de 5 minutes suffit), puis prépare le lien de duplication ou l'archive.",
        objectives: [
          "Transformer un système personnel en template vendable",
          "Documenter l'utilisation (guide ou vidéo courte)",
          "Préparer la livraison (lien de duplication, archive, licence)"
        ],
        resources: [
          { label: "Notion (templates et duplication)", url: "https://www.notion.com/", kind: "tool", why: "Le format de template le plus vendu : un lien de duplication suffit à livrer.", how: "Duplique ton système, retire tes données, active le partage en mode duplication." },
          { label: "Loom (vidéo de démo)", url: "https://www.loom.com/", kind: "tool", why: "Enregistrer une démo de 5 minutes qui sert de documentation ET d'argument de vente.", how: "Filme un tour du template : à quoi sert chaque section, comment démarrer." },
          { label: "GitHub (starters de code)", url: "https://github.com/", kind: "tool", why: "Pour vendre un starter de code : dépôt privé + accès à l'achat, avec un README solide.", how: "Si ton template est du code, soigne le README comme une page de vente." }
        ],
        quiz: [
          { q: "Qu'est-ce qui fait la valeur d'un template ?", choices: ["Sa complexité", "Le temps qu'il fait gagner et sa facilité de prise en main", "Le nombre de pages"], answer: 1, explanation: "On achète des heures économisées. Un template simple et bien documenté bat une usine à gaz." },
          { q: "Pourquoi partir d'un système que tu utilises vraiment ?", choices: ["C'est plus rapide et le template est déjà validé par l'usage", "C'est interdit de faire autrement", "Pour éviter de payer Notion"], answer: 0, explanation: "Ton usage quotidien a déjà éliminé ce qui ne marche pas : tu vends un système éprouvé." },
          { q: "Que doit contenir la documentation minimale ?", choices: ["Rien, un bon template s'explique tout seul", "Comment démarrer et à quoi sert chaque section (guide ou vidéo courte)", "L'historique complet de tes modifications"], answer: 1, explanation: "Sans documentation, chaque vente génère des questions de support — ou un remboursement." },
          { q: "Comment livre-t-on un template Notion ?", choices: ["En envoyant son mot de passe Notion", "Par un lien de duplication partagé après l'achat", "En recréant le template chez chaque client"], answer: 1, explanation: "Le lien de duplication livre instantanément une copie indépendante à chaque acheteur." }
        ],
        micro_project: {
          title: "Ton template prêt à vendre",
          brief: "Transforme un de tes systèmes en template livrable (ou avance ton produit principal s'il n'est pas un template).",
          steps: [
            "Choisis un système que tu utilises (Notion, Canva, code...) et duplique-le",
            "Nettoie et généralise : retire tes données, ajoute des exemples fictifs",
            "Documente : guide écrit court ou vidéo Loom de 5 minutes",
            "Prépare la livraison : lien de duplication ou archive + licence simple"
          ],
          deliverable: "La description de ton template (problème résolu, temps gagné), le lien de démo ou de duplication, et ta documentation.",
          validation: "ai"
        },
        xp_reward: 60,
        duration_minutes: 55,
        sort_order: 20
      },
      {
        slug: "packager-une-mini-formation",
        title: "Packager une mini-formation",
        intro: "Une mini-formation n'est pas un cours universitaire : 60 à 90 minutes de vidéos courtes qui mènent à UN résultat concret. Si tu as suivi le parcours Création de contenu avec l'IA, tu as déjà toutes les compétences de production — ici tu apprends à les packager en produit payant.",
        why_important: "La formation est le produit digital au panier moyen le plus élevé (30 à 200 euros et plus). Le format court à résultat unique se crée en semaines, pas en mois, et se vend mieux qu'un cours-fleuve inachevable.",
        how_to_use: "Structure : un résultat final annoncé, 5 à 10 leçons de 5-10 minutes, un livrable par leçon. Produis avec les techniques du parcours contenu (script 3 passes, voix, montage). Héberge simplement : systeme.io (gratuit pour commencer, en français) ou directement en fichiers sur Gumroad ou Ko-fi.",
        objectives: [
          "Structurer une formation courte autour d'UN résultat",
          "Réutiliser les compétences de production vidéo (scripts, voix, montage)",
          "Choisir un hébergement simple (systeme.io, Gumroad, Ko-fi)"
        ],
        resources: [
          { label: "systeme.io", url: "https://systeme.io/", kind: "tool", why: "Plateforme française tout-en-un (formation + paiement + emails), plan gratuit.", how: "Crée un compte gratuit et explore la création d'un espace de formation." },
          { label: "Loom (leçons vidéo simples)", url: "https://www.loom.com/", kind: "tool", why: "Enregistrer écran + voix sans montage complexe : parfait pour des leçons de 5-10 minutes.", how: "Enregistre une leçon test de 5 minutes avec partage d'écran." },
          { label: "Parcours Création de contenu avec l'IA (TakaCode)", url: "https://takacode.vercel.app/parcours/creation-contenu-ia", kind: "doc", why: "Les techniques de script, voix off et montage s'appliquent directement à tes leçons.", how: "Si tu ne l'as pas suivi, fais au moins le module scripts et voix." }
        ],
        quiz: [
          { q: "Qu'est-ce qu'une bonne mini-formation ?", choices: ["10 heures de théorie exhaustive", "60-90 minutes de leçons courtes qui mènent à UN résultat concret", "Une seule vidéo d'une heure sans structure"], answer: 1, explanation: "Le format court à résultat unique se crée vite, se termine (vraiment) et se recommande." },
          { q: "Pourquoi un livrable par leçon ?", choices: ["Pour faire joli", "Pour que l'apprenant progresse concrètement et aille au bout", "C'est une obligation des plateformes"], answer: 1, explanation: "Chaque leçon qui produit quelque chose maintient la motivation — exactement comme les micro-projets TakaCode." },
          { q: "Quel est l'avantage du panier moyen d'une formation ?", choices: ["Il est identique à celui d'un ebook", "Il est nettement plus élevé (30-200 euros et plus)", "Les formations sont toujours gratuites"], answer: 1, explanation: "La transformation promise (résultat guidé) justifie un prix supérieur au simple contenu." },
          { q: "Pour héberger sa première formation simplement...", choices: ["Développer sa propre plateforme", "Utiliser systeme.io, Gumroad ou Ko-fi", "Envoyer les vidéos par email une par une"], answer: 1, explanation: "L'hébergement clé en main règle paiement et accès : ton énergie va au contenu." }
        ],
        micro_project: {
          title: "Le squelette de ta formation (ou la structure finale de ton produit)",
          brief: "Structure complète + une première leçon produite, ou l'avancement équivalent de ton produit choisi.",
          steps: [
            "Définis le résultat final en une phrase (« à la fin, tu sauras... »)",
            "Découpe en 5-10 leçons avec un livrable chacune",
            "Produis la leçon 1 (Loom ou technique du parcours contenu)",
            "Choisis ton hébergement et justifie le choix"
          ],
          deliverable: "Ta structure complète (résultat + leçons + livrables), le lien ou la description de la leçon 1, et ton choix d'hébergement.",
          validation: "ai"
        },
        xp_reward: 65,
        duration_minutes: 60,
        sort_order: 30
      }
    ]
  },
  {
    slug: "construire-sa-boutique",
    title: "Construire sa boutique",
    summary: "Plateforme de vente, page qui convertit et prix assumé.",
    sort_order: 30,
    lessons: [
      {
        slug: "choisir-sa-plateforme-de-vente",
        title: "Choisir sa plateforme de vente",
        intro: "Gumroad, Ko-fi, Lemon Squeezy, Stripe Payment Links : toutes encaissent pour toi, mais elles diffèrent sur les frais, la gestion de la TVA, et ce qu'elles offrent autour (emails, affiliation, abonnements). Le bon choix dépend de ton produit et de ton pays.",
        why_important: "La TVA sur les produits digitaux en Europe est un casse-tête : les plateformes « marchand de référence » (Gumroad, Lemon Squeezy) la gèrent À TA PLACE. C'est souvent l'argument décisif pour commencer sereinement.",
        how_to_use: "Compare sur 4 critères : frais par vente, gestion de la TVA (marchand de référence ou pas), fonctionnalités (emails aux acheteurs, codes promo, affiliation), simplicité. Crée ton compte sur la plateforme choisie et configure ta boutique : nom, description, moyen de paiement.",
        objectives: [
          "Comparer les plateformes sur frais, TVA et fonctionnalités",
          "Comprendre la notion de « marchand de référence » (merchant of record)",
          "Créer et configurer ta boutique"
        ],
        resources: [
          { label: "Gumroad", url: "https://gumroad.com/", kind: "tool", why: "Le plus simple pour démarrer : marchand de référence, boutique en 10 minutes.", how: "Crée ton compte, configure ta boutique et regarde les frais par vente." },
          { label: "Lemon Squeezy", url: "https://www.lemonsqueezy.com/", kind: "tool", why: "Marchand de référence aussi, apprécié pour les produits plus « tech » et les licences.", how: "Compare ses frais et fonctionnalités avec Gumroad pour TON produit." },
          { label: "Ko-fi", url: "https://ko-fi.com/", kind: "tool", why: "Frais réduits et communauté : bon choix pour les créateurs avec audience.", how: "Regarde la partie boutique (Ko-fi Shop) et ses conditions." }
        ],
        quiz: [
          { q: "Que fait un « marchand de référence » (merchant of record) pour toi ?", choices: ["Il crée ton produit", "Il gère la TVA et la conformité des paiements à ta place", "Il fait ta publicité gratuitement"], answer: 1, explanation: "C'est LA simplification administrative : la plateforme vend officiellement et te reverse ta part." },
          { q: "Quels critères comparer entre plateformes ?", choices: ["Uniquement la couleur du site", "Frais par vente, gestion TVA, fonctionnalités, simplicité", "Le nombre d'employés de l'entreprise"], answer: 1, explanation: "Ces 4 critères couvrent l'essentiel ; le reste est du détail au démarrage." },
          { q: "Pourquoi ne PAS développer sa propre plateforme de paiement au début ?", choices: ["C'est illégal", "Des semaines de travail pour réinventer ce qui existe en 10 minutes ailleurs", "Les clients n'aiment pas les sites personnels"], answer: 1, explanation: "Ton énergie doit aller au produit et à la vente, pas à l'infrastructure." },
          { q: "Un lien Stripe Payment Links est idéal pour...", choices: ["Vendre vite sans boutique complète (pré-ventes, offres ponctuelles)", "Remplacer toute une plateforme", "Gérer automatiquement la TVA européenne"], answer: 0, explanation: "Rapide et flexible, mais sans les services d'un marchand de référence : parfait en appoint." }
        ],
        micro_project: {
          title: "Ta boutique configurée",
          brief: "Choisis ta plateforme avec un comparatif et configure ta boutique.",
          steps: [
            "Compare 3 plateformes sur les 4 critères pour TON produit",
            "Choisis et justifie en 2 phrases",
            "Crée ta boutique : nom, bio, visuel de bannière",
            "Configure le paiement et crée le brouillon de ta fiche produit"
          ],
          deliverable: "Ton comparatif, la plateforme choisie avec justification, et le lien de ta boutique (même vide).",
          validation: "ai",
          requires_link: true
        },
        xp_reward: 55,
        duration_minutes: 45,
        sort_order: 10
      },
      {
        slug: "page-de-vente-qui-convertit",
        title: "La page de vente qui convertit",
        intro: "Une page de vente n'est pas une description : c'est un argumentaire. Promesse claire, bénéfices avant caractéristiques, preuve, réponse aux objections, appel à l'action. L'IA t'aide à structurer — la sincérité et les preuves viennent de toi.",
        why_important: "À trafic égal, une bonne page vend 3 à 10 fois plus qu'une fiche produit paresseuse. C'est l'actif le plus rentable de ta boutique : chaque heure investie ici paie sur toutes les ventes futures.",
        how_to_use: "Structure éprouvée : (1) titre = la promesse ; (2) le problème vécu par ta cible, dans SES mots ; (3) la solution et ce que contient le produit ; (4) bénéfices concrets (pas « 50 pages » mais « le plan exact pour... ») ; (5) preuve (démo, extraits, premiers retours) ; (6) FAQ qui lève les objections ; (7) prix et garantie. Écris le premier jet avec l'IA, réécris dans les mots de ta cible (reprends ceux entendus pendant la validation).",
        objectives: [
          "Structurer une page de vente en 7 blocs",
          "Transformer les caractéristiques en bénéfices",
          "Lever les objections avec preuve, FAQ et garantie"
        ],
        resources: [
          { label: "Claude (copy et objections)", url: "https://claude.ai/", kind: "tool", why: "Structurer l'argumentaire et générer la liste des objections probables de ta cible.", how: "Demande les 10 objections types pour ton produit, puis rédige une FAQ qui y répond." },
          { label: "Centre d'aide Gumroad (pages produit)", url: "https://help.gumroad.com/", kind: "doc", why: "Les bonnes pratiques officielles des fiches produit qui convertissent.", how: "Lis les guides sur la description produit et les visuels." },
          { label: "Canva (visuels de la page)", url: "https://www.canva.com/", kind: "tool", why: "Mockups du produit, aperçus des pages, bannières : la preuve visuelle.", how: "Crée 3 visuels : couverture 3D, aperçu du contenu, bannière de boutique." }
        ],
        quiz: [
          { q: "Quelle est la différence entre caractéristique et bénéfice ?", choices: ["Aucune", "La caractéristique décrit le produit, le bénéfice décrit le résultat pour l'acheteur", "Le bénéfice est le prix"], answer: 1, explanation: "« 50 pages » est une caractéristique ; « le plan exact pour lancer en 30 jours » est un bénéfice." },
          { q: "Que met-on dans le titre de la page ?", choices: ["Le nom technique du fichier", "La promesse principale du produit", "La date de création"], answer: 1, explanation: "Le titre vend le résultat : c'est la première (et parfois la seule) chose lue." },
          { q: "À quoi sert la FAQ d'une page de vente ?", choices: ["À remplir la page", "À lever une par une les objections qui bloquent l'achat", "À expliquer ta biographie"], answer: 1, explanation: "Chaque objection non traitée est une vente perdue ; la FAQ les traite sans alourdir l'argumentaire." },
          { q: "Pourquoi reprendre les mots entendus pendant la validation ?", choices: ["Par flemme d'écrire", "Parce que ta cible se reconnaît dans SES propres mots, pas dans ton jargon", "Pour éviter le plagiat"], answer: 1, explanation: "Le meilleur copywriting est celui de tes futurs clients : tu ne fais que le restituer." }
        ],
        micro_project: {
          title: "Ta page de vente complète",
          brief: "Rédige et publie la page de vente de ton produit sur ta boutique.",
          steps: [
            "Rédige les 7 blocs (premier jet IA, réécriture dans les mots de ta cible)",
            "Crée 3 visuels dans Canva (couverture, aperçu, bannière)",
            "Fais générer les 10 objections par l'IA et réponds-y dans la FAQ",
            "Publie la page sur ta boutique (produit en brouillon ou pré-vente si pas fini)"
          ],
          deliverable: "Le lien de ta page de vente publiée + les 3 objections les plus dures et tes réponses.",
          validation: "ai",
          requires_link: true
        },
        xp_reward: 65,
        duration_minutes: 60,
        sort_order: 20
      },
      {
        slug: "fixer-son-prix",
        title: "Fixer son prix sans se saborder",
        intro: "Le prix ne se devine pas, il se positionne : par rapport à la valeur créée, aux alternatives, et à ta stratégie (produit d'entrée ou produit phare). L'erreur numéro un des débutants n'est pas de vendre trop cher — c'est de vendre trop bas.",
        why_important: "Un prix trop bas ne rassure pas : il inquiète (« si c'est si bien, pourquoi 3 euros ? ») et il t'oblige à des volumes irréalistes. Le bon prix finance la suite : ton temps, tes outils, tes prochains produits.",
        how_to_use: "Méthode : (1) liste la valeur créée (temps gagné, résultat obtenu — chiffre-les) ; (2) repère les prix des alternatives observées à la leçon 1 ; (3) positionne-toi dans la fourchette, pas en dessous ; (4) structure l'offre : un prix de lancement limité dans le temps plutôt qu'un prix bradé permanent, un bundle si tu as plusieurs produits. Teste et ajuste : le prix n'est jamais gravé.",
        objectives: [
          "Positionner un prix par la valeur et les alternatives, pas par la peur",
          "Utiliser prix de lancement et bundles sans se brader",
          "Savoir quand et comment ajuster un prix"
        ],
        resources: [
          { label: "Gumroad (codes promo et versions)", url: "https://gumroad.com/", kind: "tool", why: "Gérer un prix de lancement propre : code limité dans le temps plutôt que prix cassé.", how: "Repère comment créer un code promo et des paliers de prix (versions)." },
          { label: "Lemon Squeezy", url: "https://www.lemonsqueezy.com/", kind: "tool", why: "Paliers, licences et abonnements si ton produit s'y prête.", how: "Regarde les options de tarification proposées pour ton type de produit." },
          { label: "Claude (test de positionnement)", url: "https://claude.ai/", kind: "tool", why: "Simuler la perception : demande comment ta cible percevrait 3 niveaux de prix.", how: "Présente ton produit et 3 prix candidats ; analyse les perceptions simulées." }
        ],
        quiz: [
          { q: "Quelle est l'erreur de prix la plus fréquente des débutants ?", choices: ["Vendre beaucoup trop cher", "Vendre trop bas par peur", "Ne pas afficher de prix"], answer: 1, explanation: "Le prix plancher attire les chasseurs de gratuit, inquiète les vrais acheteurs et ne finance rien." },
          { q: "Comment positionner son prix ?", choices: ["Au hasard", "Par la valeur créée et les prix des alternatives", "Toujours à 9,99"], answer: 1, explanation: "Valeur chiffrée + fourchette du marché = un prix défendable que tu peux assumer sur ta page." },
          { q: "Prix de lancement ou prix bradé permanent ?", choices: ["Prix bradé pour toujours", "Prix de lancement limité dans le temps, puis prix normal", "Aucune promo jamais"], answer: 1, explanation: "L'urgence honnête du lancement récompense les premiers ; le prix bradé permanent détruit la valeur perçue." },
          { q: "Ton produit ne se vend pas à 29 euros. Première hypothèse à tester ?", choices: ["Le prix est forcément trop haut : passe à 2 euros", "La promesse ou la preuve de la page ne convainc pas encore", "Les produits digitaux ne marchent pas"], answer: 1, explanation: "Avant de toucher au prix, vérifie promesse, preuve et trafic : c'est là que se perdent la plupart des ventes." }
        ],
        micro_project: {
          title: "Ta grille de prix assumée",
          brief: "Fixe le prix de ton produit avec une justification solide, et structure ton offre de lancement.",
          steps: [
            "Chiffre la valeur créée (temps gagné, résultat) pour ton acheteur",
            "Relève les prix de 3 alternatives",
            "Fixe ton prix et ton offre de lancement (durée limitée)",
            "Écris en 3 phrases la justification que tu pourrais dire à un client"
          ],
          deliverable: "Ton prix final, l'offre de lancement, le comparatif des alternatives et ta justification en 3 phrases.",
          validation: "ai"
        },
        xp_reward: 55,
        duration_minutes: 40,
        sort_order: 30
      }
    ]
  },
  {
    slug: "lancer-et-encaisser",
    title: "Lancer, encaisser, itérer",
    summary: "La séquence de lancement, le marketing de contenu, et le premier euro déclaré.",
    sort_order: 40,
    lessons: [
      {
        slug: "la-sequence-de-lancement",
        title: "La séquence de lancement",
        intro: "Un lancement n'est pas un post unique le jour J : c'est une séquence d'une semaine qui chauffe ton audience avant d'ouvrir les ventes. Teasing, coulisses, preuve, ouverture, rappel : chaque jour a un rôle.",
        why_important: "Le même produit, posté une fois, fait 3 ventes ; lancé en séquence, il en fait 30. Le lancement est aussi ton meilleur crash-test : les questions reçues nourrissent ta FAQ et ta V2.",
        how_to_use: "Séquence type sur 7 jours : J-5 teasing du problème ; J-3 coulisses de la création ; J-1 annonce avec la promesse et l'heure d'ouverture ; Jour J ouverture avec l'offre de lancement ; J+2 preuve sociale (premiers retours) ; J+4 rappel de fin d'offre. Diffuse partout où ta cible existe déjà : tes réseaux, les communautés pertinentes, la communauté TakaCode — et Product Hunt si ton produit est un outil.",
        objectives: [
          "Planifier une séquence de lancement sur 7 jours",
          "Choisir les canaux où ta cible existe déjà",
          "Transformer les retours du lancement en améliorations"
        ],
        resources: [
          { label: "Product Hunt", url: "https://www.producthunt.com/", kind: "tool", why: "Le lancement de référence pour les outils et templates « tech ».", how: "Observe 3 lancements réussis dans ta catégorie : visuels, accroche, premiers commentaires." },
          { label: "Communauté TakaCode", url: "https://takacode.vercel.app/communaute", kind: "doc", why: "Des créateurs qui comprennent ta démarche : parfait pour tes premiers retours honnêtes.", how: "Partage ton lancement et demande des retours francs sur ta page de vente." },
          { label: "Canva (visuels de lancement)", url: "https://www.canva.com/", kind: "tool", why: "Préparer d'un coup tous les visuels de la séquence.", how: "Crée les 6 visuels de ta séquence en une session, avec un fil visuel commun." }
        ],
        quiz: [
          { q: "Pourquoi une séquence plutôt qu'un post unique ?", choices: ["Pour spammer", "Parce que l'audience a besoin d'être chauffée : le jour J ne surprend personne, il conclut", "C'est identique"], answer: 1, explanation: "Teasing, coulisses et preuve construisent l'attente ; l'ouverture ne fait que la convertir." },
          { q: "Où diffuser son lancement ?", choices: ["Partout au hasard", "Là où ta cible existe déjà : tes réseaux, les communautés pertinentes", "Uniquement par SMS"], answer: 1, explanation: "Un canal où ta cible est déjà présente vaut dix canaux génériques." },
          { q: "Que faire des questions reçues pendant le lancement ?", choices: ["Les ignorer", "Les transformer en FAQ et en améliorations du produit", "Supprimer les commentaires"], answer: 1, explanation: "Chaque question est une objection documentée gratuitement : ta page et ta V2 s'en nourrissent." },
          { q: "Product Hunt est surtout pertinent pour...", choices: ["Tous les produits sans exception", "Les outils, templates et produits « tech »", "Les produits physiques"], answer: 1, explanation: "L'audience de Product Hunt cherche des outils : un ebook grand public y performera moins." }
        ],
        micro_project: {
          title: "Ton plan de lancement écrit",
          brief: "Prépare ta séquence complète de lancement, prête à dérouler.",
          steps: [
            "Écris les 6 messages de la séquence (J-5 à J+4), premier jet IA puis ta voix",
            "Crée les visuels associés dans Canva",
            "Liste tes canaux : où ta cible existe-t-elle déjà ?",
            "Fixe la date d'ouverture et la durée de l'offre de lancement"
          ],
          deliverable: "Ta séquence complète (6 messages), tes canaux choisis et ta date de lancement.",
          validation: "ai"
        },
        xp_reward: 60,
        duration_minutes: 50,
        sort_order: 10
      },
      {
        slug: "vendre-par-le-contenu",
        title: "Vendre par le contenu, sans forcer",
        intro: "Après le pic du lancement, c'est le contenu qui vend en continu : chaque vidéo, post ou article qui aide ta cible amène des visiteurs vers ta boutique. Si tu as une chaîne faceless (parcours Création de contenu), elle devient ton canal de vente permanent.",
        why_important: "Le contenu crée la confiance avant la transaction : on achète à ceux qui nous ont déjà aidés. C'est le cercle vertueux TakaCode : ton contenu attire, ton produit monétise, tes revenus financent la suite.",
        how_to_use: "La règle : aider d'abord, mentionner ensuite. Chaque contenu résout un petit problème de ta cible et mentionne naturellement ton produit comme la suite logique (« le plan complet est dans mon guide »). Ratio sain : 80 % de valeur pure, 20 % de mention produit. Mets le lien partout : description, épingle, bio.",
        objectives: [
          "Relier ton contenu à ton produit sans matraquage",
          "Appliquer le ratio 80/20 valeur/mention",
          "Installer les liens boutique aux bons endroits"
        ],
        resources: [
          { label: "Parcours Création de contenu avec l'IA (TakaCode)", url: "https://takacode.vercel.app/parcours/creation-contenu-ia", kind: "doc", why: "Le parcours complet pour créer le canal qui vendra ton produit en continu.", how: "Si ce n'est pas fait, suis-le en parallèle : les deux parcours se nourrissent." },
          { label: "YouTube Creators", url: "https://www.youtube.com/creators/", kind: "doc", why: "Les bonnes pratiques officielles pour mentionner ses produits sans pénaliser ses vidéos.", how: "Regarde les règles sur les liens en description et les mentions commerciales." },
          { label: "Ko-fi (lien en bio)", url: "https://ko-fi.com/", kind: "tool", why: "Une page unique qui regroupe boutique et liens : idéale pour les bios de réseaux.", how: "Configure ta page comme hub : produit en avant, réseaux en dessous." }
        ],
        quiz: [
          { q: "Pourquoi le contenu vend-il mieux que la publicité brute au début ?", choices: ["Il est plus cher", "Il crée la confiance : on achète à ceux qui nous ont déjà aidés", "Il est obligatoire"], answer: 1, explanation: "La confiance précède la transaction — le contenu la construit gratuitement et durablement." },
          { q: "Quel est le ratio sain valeur/mention produit ?", choices: ["100 % de promo", "Environ 80 % de valeur pure, 20 % de mention", "50/50 strict"], answer: 1, explanation: "Trop de promo tue l'audience ; la mention naturelle en fin de contenu utile convertit mieux." },
          { q: "Comment mentionner son produit naturellement ?", choices: ["En majuscules toutes les 30 secondes", "Comme la suite logique du contenu (« le plan complet est dans mon guide »)", "Ne jamais le mentionner"], answer: 1, explanation: "Le contenu résout un petit problème ; le produit résout le grand : la transition est naturelle." },
          { q: "Où placer le lien de ta boutique ?", choices: ["Nulle part, on doit le deviner", "Description, commentaire épinglé, bio, page hub", "Uniquement sur ta carte de visite"], answer: 1, explanation: "Chaque point de contact doit mener à la boutique en un clic." }
        ],
        micro_project: {
          title: "Ton premier contenu qui vend",
          brief: "Crée un contenu 80/20 qui aide ta cible et mène naturellement à ton produit.",
          steps: [
            "Choisis un petit problème de ta cible lié à ton produit",
            "Crée le contenu (vidéo, post ou article) qui le résout vraiment",
            "Ajoute la mention naturelle et le lien boutique",
            "Publie et installe le lien dans ta bio et tes descriptions"
          ],
          deliverable: "Le lien de ton contenu publié et la façon dont il mène à ton produit.",
          validation: "ai",
          requires_link: true
        },
        xp_reward: 60,
        duration_minutes: 50,
        sort_order: 20
      },
      {
        slug: "premier-euro-et-suite",
        title: "Le premier euro, et la suite",
        intro: "Encaisser son premier euro change tout : ce n'est plus un projet, c'est un business. Cette leçon boucle la boucle TakaCode : tu mesures, tu itères, tu déclares ton premier euro dans ton cockpit projet — et tu prépares le produit suivant.",
        why_important: "Le premier euro prouve le système entier : produit, page, prix, canal. Ensuite, tout est optimisation : plus de trafic, meilleure conversion, produits complémentaires. Les créateurs qui durent construisent une GAMME, pas un one-shot.",
        how_to_use: "Mesure 3 chiffres chaque semaine : visiteurs de la page, taux de conversion (ventes/visiteurs), panier moyen. Une amélioration par semaine, pas dix. Soigne l'après-vente : email de remerciement, demande d'avis, support rapide — les avis nourrissent ta page. Et déclare ton premier euro dans ton cockpit TakaCode : c'est le badge qui compte.",
        objectives: [
          "Suivre visiteurs, conversion et panier moyen",
          "Installer l'après-vente (remerciement, avis, support)",
          "Déclarer ton premier euro et planifier le produit suivant"
        ],
        resources: [
          { label: "Ton cockpit projet TakaCode", url: "https://takacode.vercel.app/dashboard", kind: "tool", why: "Ta boutique EST ton projet : mets le lien en ligne, le modèle de revenu « vente », et déclare ton premier euro.", how: "Renseigne l'URL de ta boutique dans ton projet et clique « Déclarer mon premier euro » le jour venu." },
          { label: "Centre d'aide Gumroad (statistiques)", url: "https://help.gumroad.com/", kind: "doc", why: "Comprendre les statistiques de vues et de conversion de ta boutique.", how: "Repère où lire visiteurs et conversion, et note tes chiffres de départ." },
          { label: "Tally (retours acheteurs)", url: "https://tally.so/", kind: "tool", why: "Un mini-formulaire post-achat pour récolter avis et idées d'amélioration.", how: "Crée un formulaire de 3 questions envoyé après chaque vente." }
        ],
        quiz: [
          { q: "Que prouve le premier euro encaissé ?", choices: ["Rien de spécial", "Que tout le système fonctionne : produit, page, prix, canal", "Que tu peux arrêter de travailler"], answer: 1, explanation: "Une vente réelle valide la chaîne entière — ensuite, on optimise ce qui existe." },
          { q: "Quels sont les 3 chiffres à suivre chaque semaine ?", choices: ["Abonnés, likes, partages", "Visiteurs de la page, taux de conversion, panier moyen", "Uniquement le chiffre d'affaires"], answer: 1, explanation: "Ces 3 chiffres localisent le problème : pas de visiteurs = canal ; visiteurs sans ventes = page ou prix." },
          { q: "Pourquoi demander un avis après chaque vente ?", choices: ["Pour flatter ton ego", "Parce que la preuve sociale nourrit ta page et augmente la conversion", "C'est inutile"], answer: 1, explanation: "Les avis sont le carburant de la conversion : chaque acheteur satisfait en attire d'autres." },
          { q: "Après un premier produit qui se vend, la stratégie des créateurs qui durent est...", choices: ["S'arrêter là", "Construire une gamme : produits complémentaires pour la même audience", "Changer complètement de domaine à chaque produit"], answer: 1, explanation: "La même audience achète plusieurs fois : produit d'entrée, produit phare, offre groupée." }
        ],
        micro_project: {
          title: "Ton tableau de bord premier euro",
          brief: "Boucle la boucle : mesure, après-vente, déclaration du premier euro et plan de la suite.",
          steps: [
            "Relève tes 3 chiffres (visiteurs, conversion, panier) et choisis UNE amélioration",
            "Installe ton après-vente : message de remerciement + formulaire d'avis",
            "Mets à jour ton projet TakaCode : lien boutique, modèle « vente », premier euro si encaissé",
            "Esquisse ton produit suivant (complémentaire pour la même audience)"
          ],
          deliverable: "Tes 3 chiffres, l'amélioration choisie, le lien de ta boutique active et ton idée de produit suivant.",
          validation: "ai",
          requires_link: true
        },
        xp_reward: 70,
        duration_minutes: 50,
        sort_order: 30
      }
    ]
  }
];

async function main() {
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

  console.log("\nSeed terminé. Le parcours Produits digitaux est publié.");
}

await main();
