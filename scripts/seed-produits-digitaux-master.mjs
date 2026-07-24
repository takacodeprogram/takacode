// Seed master du parcours "Produits digitaux : creer et vendre".
// Fusion des seeds originaux : modules 1-4 + modules 5-8.
//
// Usage : node scripts/seed-produits-digitaux-master.mjs
// Idempotent : upsert par slug (parcours, modules, lecons).
// Slugs et valeurs techniques sans accents ; contenu BDD en francais correct.
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
  title: "Produits digitaux : creer et vendre",
  summary: "Ebooks, templates, mini-formations : cree un produit une fois, vends-le a l'infini - la voie la plus directe vers ton premier euro.",
  description:
    "Le parcours Build to Earn de TakaCode : tu choisis un produit digital adapte a tes competences (ebook, template Notion ou Canva, mini-formation, micro-outil), tu valides la demande AVANT de creer, tu le produis avec l'IA comme assistant, puis tu montes ta boutique sur une plateforme adaptee a TON marche - Chariow ou systeme.io pour encaisser en mobile money (Orange Money, MTN MoMo, Wave) si ton audience est africaine, Gumroad ou Lemon Squeezy pour l'international. Tu ecris une page de vente qui convertit et tu lances la ou ton audience vit vraiment (WhatsApp, Facebook, YouTube). Chaque micro-projet est une brique de ton vrai produit : a la fin, ta boutique est en ligne et ton plan premier euro est actif dans ton cockpit projet.",
  level_label: "Débutant",
  duration_weeks: 8,
  accent_color: "#F59E0B",
  icon: "lucide:package",
  objective: "Mettre en vente ton premier produit digital et encaisser ton premier euro.",
  resources: ["Chariow", "systeme.io", "Gumroad", "Canva", "Maketou", "Stripe", "Claude", "CapCut"],
  next_session: "Mardi 19h00",
  next_steps: [
    { label: "Choisir son produit", state: "done" },
    { label: "Creer avec l'IA", state: "done" },
    { label: "Construire sa boutique", state: "done" },
    { label: "Lancer et encaisser", state: "done" },
    { label: "Vente et copywriting", state: "current" },
    { label: "Contenu qui vend", state: "locked" },
    { label: "Publicite payante", state: "locked" },
    { label: "Constance et passage a l'echelle", state: "locked" }
  ],
  sort_order: 6,
  is_published: true,
  is_active: true
};

const MODULES = [
  // =====================================================
  // MODULE 1 - Choisir son produit digital
  // =====================================================
  {
    slug: "choisir-son-produit",
    title: "Choisir son produit digital",
    summary: "Panorama des produits, choix selon tes forces, et validation AVANT de creer.",
    sort_order: 10,
    lessons: [
      {
        slug: "panorama-des-produits-digitaux",
        title: "Le panorama des produits digitaux",
        intro: "Un produit digital se cree une fois et se vend a l'infini, sans stock ni livraison : ebook, template (Notion, Canva, code), mini-formation, presets, micro-outil. C'est le modele de revenu avec la marge la plus elevee qui existe - a condition de choisir le bon produit.",
        why_important: "Choisir le bon TYPE de produit avant de creer t'evite l'erreur classique : passer deux mois sur un produit que personne n'attend. Chaque type a son effort de creation, son prix moyen et son canal de vente naturels.",
        how_to_use: "Explore les marketplaces pour voir ce qui se vend vraiment : parcours les produits populaires sur Gumroad, les templates Notion les plus telecharges, les boutiques Ko-fi de createurs. Note les prix pratiques et les promesses des pages de vente.",
        objectives: [
          "Citer les 5 grandes familles de produits digitaux et leurs prix moyens",
          "Comprendre l'economie du digital (creation unique, vente illimitee)",
          "Reperer ce qui se vend deja dans les marketplaces"
        ],
        resources: [
          { label: "Gumroad (marketplace)", url: "https://gumroad.com/", kind: "tool", why: "LA plateforme de reference pour vendre des produits digitaux, avec une section decouverte.", how: "Parcours la section Discover et note 5 produits qui se vendent bien dans un domaine qui t'attire." },
          { label: "Templates Notion (galerie officielle)", url: "https://www.notion.com/templates", kind: "doc", why: "Des milliers de templates, gratuits et payants : un marche entier a observer.", how: "Regarde les templates payants les mieux classes : quels problemes resolvent-ils ?" },
          { label: "Ko-fi (boutiques de createurs)", url: "https://ko-fi.com/", kind: "tool", why: "Boutique + dons + abonnements, tres utilise par les petits createurs francophones.", how: "Explore quelques boutiques de createurs et note comment ils presentent leurs produits." }
        ],
        quiz: [
          { q: "Quel est l'avantage economique principal d'un produit digital ?", choices: ["Il se cree une fois et se vend a l'infini, sans stock", "Il est toujours gratuit a produire", "Il se vend plus cher qu'un produit physique"], answer: 0, explanation: "Pas de stock, pas de livraison, marge quasi totale : c'est le levier du digital." },
          { q: "Lequel de ces produits N'EST PAS un produit digital ?", choices: ["Un template Notion", "Un coaching en visio a l'heure", "Un ebook PDF"], answer: 1, explanation: "Le coaching vend ton temps (service) : il ne se duplique pas. Un produit digital se vend sans toi." },
          { q: "Pourquoi observer les marketplaces avant de creer ?", choices: ["Pour copier un produit existant a l'identique", "Pour voir ce qui se vend reellement, a quel prix, avec quelle promesse", "C'est obligatoire legalement"], answer: 1, explanation: "Les best-sellers d'une marketplace sont une etude de marche gratuite : demande prouvee, prix de reference." },
          { q: "Quel produit demande le MOINS d'effort de creation pour commencer ?", choices: ["Une formation video de 10 heures", "Un template ou un guide court qui resout UN probleme precis", "Un logiciel complet"], answer: 1, explanation: "Commencer petit : un produit d'entree simple valide ta capacite a vendre avant d'investir des semaines." }
        ],
        micro_project: {
          title: "Ton etude de marche express",
          brief: "Observe ce qui se vend deja pour reperer les opportunites de ta future boutique.",
          steps: [
            "Choisis 2 marketplaces (Gumroad, templates Notion, Ko-fi...)",
            "Liste 5 produits qui se vendent bien : type, prix, promesse de la page",
            "Note pour chacun le probleme precis qu'il resout",
            "Repere un manque ou un angle que tu pourrais couvrir"
          ],
          deliverable: "Ta liste des 5 produits observes (type, prix, promesse, probleme resolu) et l'opportunite que tu as reperee.",
          validation: "ai"
        },
        xp_reward: 50,
        duration_minutes: 40,
        sort_order: 10
      },
      {
        slug: "choisir-selon-tes-forces",
        title: "Choisir selon tes forces et ton audience",
        intro: "Le bon produit est a l'intersection de trois cercles : ce que tu sais faire (ou apprendre vite), ce que des gens cherchent activement, et ce que tu peux creer en moins d'un mois. Ta matrice de decision remplace l'intuition.",
        why_important: "Un produit aligne avec tes competences se cree 5 fois plus vite et sonne authentique. Un produit aligne avec une demande reelle se vend sans forcer. Il te faut les deux - et un premier produit VOLONTAIREMENT petit.",
        how_to_use: "Remplis la matrice : liste tes competences et sujets maitrises, croise avec les recherches (Google Trends, marketplaces de la lecon 1), puis note chaque idee sur 3 criteres : demande (1-5), effort (1-5, inverse), envie (1-5). Le meilleur score gagne. Demande a l'IA de challenger ton choix.",
        objectives: [
          "Construire ta matrice competences x demande x effort",
          "Distinguer produit d'entree (petit prix) et produit phare",
          "Choisir UN produit realisable en moins d'un mois"
        ],
        resources: [
          { label: "Google Trends", url: "https://trends.google.com/trends/", kind: "tool", why: "Verifier que l'interet pour ton sujet est stable ou croissant.", how: "Compare tes 3 sujets candidats sur 5 ans, en France ou sur ta zone cible." },
          { label: "Claude (challenger de choix)", url: "https://claude.ai/", kind: "tool", why: "Excellent pour stress-tester une idee : demande-lui les 5 raisons pour lesquelles ton produit pourrait ne pas se vendre.", how: "Colle ta matrice et demande une critique honnete de ton choix." },
          { label: "Centre d'aide Gumroad", url: "https://help.gumroad.com/", kind: "doc", why: "Les guides officiels sur ce qui marche pour les createurs debutants.", how: "Lis les articles sur le choix et le lancement d'un premier produit." }
        ],
        quiz: [
          { q: "Quels sont les 3 cercles de la matrice de choix ?", choices: ["Competences, demande, effort de creation", "Prix, couleur, plateforme", "Marketing, design, code"], answer: 0, explanation: "Un produit a l'intersection des trois se cree vite, se vend bien et reste motivant." },
          { q: "Pourquoi commencer par un produit d'entree (petit prix) ?", choices: ["Parce que les gros produits sont interdits aux debutants", "Pour valider vite ta capacite a creer ET a vendre, avec un risque minimal", "Parce que ca rapporte plus"], answer: 1, explanation: "Le premier produit t'apprend tout le cycle : creation, page de vente, lancement. Petit = rapide = apprentissage rapide." },
          { q: "Ton produit devrait etre realisable en...", choices: ["Moins d'un mois", "Un an minimum pour la qualite", "Un week-end obligatoirement"], answer: 0, explanation: "Au-dela d'un mois sans feedback du marche, le risque de creer dans le vide explose." },
          { q: "Quel est le bon usage de l'IA a cette etape ?", choices: ["Lui laisser choisir le produit a ta place", "Challenger ton choix : lui demander pourquoi ca pourrait echouer", "Ignorer l'IA pour cette etape"], answer: 1, explanation: "L'IA est un excellent avocat du diable : elle expose les faiblesses que ton enthousiasme masque." }
        ],
        micro_project: {
          title: "Ta matrice de decision",
          brief: "Choisis TON produit avec une matrice, pas une intuition.",
          steps: [
            "Liste 5 competences ou sujets que tu maitrises",
            "Croise avec ta veille de la lecon 1 : 3 idees de produits candidates",
            "Note chaque idee : demande /5, effort inverse /5, envie /5",
            "Choisis le gagnant et fais challenger ce choix par l'IA"
          ],
          deliverable: "Ta matrice complete (3 idees notees), le produit choisi, et les 2 objections de l'IA avec tes reponses.",
          validation: "ai"
        },
        xp_reward: 55,
        duration_minutes: 45,
        sort_order: 20
      },
      {
        slug: "valider-avant-de-creer",
        title: "Valider la demande AVANT de creer",
        intro: "La regle d'or des produits digitaux : ne cree rien avant d'avoir un signal de demande. Une page d'attente, quelques conversations ou une pre-vente te disent en une semaine ce que deux mois de creation ne garantissent pas.",
        why_important: "80 % des produits qui ne se vendent pas ont ete crees sans validation. Une pre-vente a 5 euros vaut mieux que 100 avis polis : les gens votent avec leur carte, pas avec leurs encouragements.",
        how_to_use: "Monte une validation minimale en 2 heures : une page simple qui decrit le produit (promesse, sommaire, prix) avec un bouton de pre-commande (Stripe Payment Links ou Gumroad en mode pre-vente) ou un formulaire d'interet (Tally). Partage-la a 20 personnes de ta cible et compte les signaux reels.",
        objectives: [
          "Creer une page de validation en moins de 2 heures",
          "Distinguer signal reel (paiement, email) et signal poli (like)",
          "Decider objectivement : creer, pivoter ou abandonner"
        ],
        resources: [
          { label: "Stripe Payment Links", url: "https://stripe.com/payment-links", kind: "tool", why: "Un lien de paiement en 5 minutes, sans site : parfait pour une pre-vente.", how: "Cree un lien de pre-commande a petit prix pour ton produit." },
          { label: "Tally (formulaires gratuits)", url: "https://tally.so/", kind: "tool", why: "Le formulaire le plus simple pour collecter des emails d'interet.", how: "Cree un formulaire 'previens-moi a la sortie' avec 2 questions sur le besoin." },
          { label: "Canva (page simple)", url: "https://www.canva.com/", kind: "tool", why: "Pour maquetter une page de presentation propre sans coder.", how: "Une page : promesse, 3 benefices, sommaire, prix, bouton." }
        ],
        quiz: [
          { q: "Quel est le signal de validation le plus fiable ?", choices: ["Des likes sur ton post", "Un paiement ou une pre-commande", "Un ami qui dit 'super idee'"], answer: 1, explanation: "Les gens votent avec leur carte. Tout le reste est de la politesse." },
          { q: "Combien de temps devrait prendre ta validation minimale ?", choices: ["Deux mois", "Environ 2 heures de mise en place, une semaine de signaux", "Une heure par an"], answer: 1, explanation: "La validation doit etre rapide et peu couteuse : c'est son interet face a la creation a l'aveugle." },
          { q: "Ta page de validation doit contenir au minimum...", choices: ["La promesse, le sommaire, le prix et un appel a l'action", "Uniquement ton CV", "Le produit complet telechargeable"], answer: 0, explanation: "On valide la PROMESSE et le PRIX, pas le produit fini - qui n'existe pas encore." },
          { q: "Personne ne pre-commande apres 20 partages cibles. Que fais-tu ?", choices: ["Tu crees quand meme, ils ont tort", "Tu pivotes la promesse ou le produit, puis tu re-testes", "Tu abandonnes definitivement les produits digitaux"], answer: 1, explanation: "Un non du marche est une information, pas une condamnation : ajuste l'angle, le prix ou la cible et re-teste." }
        ],
        micro_project: {
          title: "Ta page de validation en ligne",
          brief: "Monte ta validation minimale et recolte tes premiers signaux reels.",
          steps: [
            "Redige la promesse et le sommaire de ton produit (avec l'aide de l'IA, puis a ta voix)",
            "Cree la page ou le formulaire (Tally, Payment Link ou Gumroad pre-vente)",
            "Partage a au moins 10 personnes de ta cible",
            "Compte les signaux reels (emails, clics, pre-commandes) et conclus"
          ],
          deliverable: "Le lien de ta page de validation, le nombre de personnes touchees, les signaux obtenus et ta decision (creer, pivoter, re-tester).",
          validation: "ai",
          requires_link: true
        },
        xp_reward: 65,
        duration_minutes: 55,
        sort_order: 30
      }
    ]
  },

  // =====================================================
  // MODULE 2 - Creer son produit avec l'IA
  // =====================================================
  {
    slug: "creer-avec-l-ia",
    title: "Creer son produit avec l'IA",
    summary: "Ebook, template ou mini-formation : produire vite et bien, sans contenu generique.",
    sort_order: 20,
    lessons: [
      {
        slug: "creer-un-ebook-ou-guide",
        title: "Creer un ebook ou un guide avec l'IA",
        intro: "Un bon ebook ne se juge pas au nombre de pages mais au probleme qu'il resout. L'IA accelere la structure et les premiers jets ; ta valeur ajoutee, ce sont tes exemples, ton experience et ta methode - la regle 80/20 vue dans le parcours creation de contenu s'applique a l'identique.",
        why_important: "Les acheteurs detectent immediatement un PDF genere en un prompt : generique, verbeux, sans vecu. Ce qui se vend, c'est un guide actionnable avec des exemples reels et une voix. C'est aussi ce qui t'evite les remboursements et les mauvais avis.",
        how_to_use: "Methode en 4 temps : (1) plan detaille co-ecrit avec l'IA a partir de ta promesse validee ; (2) premier jet chapitre par chapitre, que tu recris avec tes exemples ; (3) relecture par l'IA en mode editeur ('garde mon ton, ameliore le rythme') ; (4) mise en page propre dans Canva et export PDF.",
        objectives: [
          "Structurer un guide autour d'UN probleme et d'UN resultat",
          "Appliquer la regle 80/20 : l'IA produit, tu incarnes",
          "Mettre en page un PDF professionnel dans Canva"
        ],
        resources: [
          { label: "Claude (co-ecriture)", url: "https://claude.ai/", kind: "tool", why: "Structure, premiers jets et relecture editoriale en gardant TA voix.", how: "Donne ta promesse validee et demande un plan en chapitres orientes action." },
          { label: "Canva (mise en page ebook)", url: "https://www.canva.com/", kind: "tool", why: "Des centaines de modeles d'ebooks : couverture, sommaire, pages types.", how: "Pars d'un modele, applique tes couleurs, exporte en PDF haute qualite." },
          { label: "Google Docs (ecriture)", url: "https://docs.google.com/", kind: "tool", why: "Ecrire et structurer avant la mise en page, avec commentaires pour tes relecteurs.", how: "Redige tout le contenu ici, fais relire une personne de ta cible avant Canva." }
        ],
        quiz: [
          { q: "Qu'est-ce qui fait la valeur d'un ebook payant ?", choices: ["Son nombre de pages", "Le probleme precis qu'il resout, avec des exemples et une methode", "Sa couverture uniquement"], answer: 1, explanation: "On achete un resultat, pas du volume. 30 pages actionnables battent 200 pages de remplissage." },
          { q: "Quel est le signe d'un ebook 'genere en un prompt' ?", choices: ["Des exemples concrets et personnels", "Un texte generique, verbeux, sans vecu ni opinion", "Un sommaire clair"], answer: 1, explanation: "C'est exactement ce que la regle 80/20 corrige : l'IA produit la matiere, toi tu apportes le vecu." },
          { q: "Quel est le bon ordre de production ?", choices: ["Mise en page d'abord, contenu ensuite", "Plan, jet par chapitre recrit, relecture IA, puis mise en page", "Tout ecrire d'un coup sans plan"], answer: 1, explanation: "Le plan verrouille la structure, la recriture apporte ta voix, la mise en page vient en dernier." },
          { q: "Pourquoi faire relire par une personne de ta cible avant publication ?", choices: ["Pour la politesse", "Pour verifier que le guide est actionnable par quelqu'un qui a VRAIMENT le probleme", "Ce n'est pas utile si l'IA a relu"], answer: 1, explanation: "L'IA verifie la forme ; seul un lecteur cible verifie que le contenu tient sa promesse." }
        ],
        micro_project: {
          title: "Le premier chapitre de ton produit",
          brief: "Produis le plan complet et le premier chapitre fini de ton ebook ou guide (ou l'equivalent pour ton produit).",
          steps: [
            "Co-ecris le plan en chapitres avec l'IA a partir de ta promesse validee",
            "Redige le premier chapitre : jet IA puis recriture avec TES exemples",
            "Passe une relecture IA en mode editeur (garde ta voix)",
            "Mets en page ce chapitre dans Canva (couverture + 3-5 pages)"
          ],
          deliverable: "Ton plan complet + le premier chapitre mis en page (colle le texte et decris la mise en page, ou donne un lien de partage).",
          validation: "ai"
        },
        xp_reward: 60,
        duration_minutes: 60,
        sort_order: 10
      },
      {
        slug: "creer-des-templates",
        title: "Creer des templates qui font gagner du temps",
        intro: "Un template se vend s'il transforme des heures de travail en minutes : tableau de bord Notion, kit de visuels Canva, starter de code. La valeur est dans le temps gagne ET dans la documentation qui rend le template utilisable sans toi.",
        why_important: "Le template est le produit digital le plus rapide a creer quand tu utilises deja l'outil au quotidien : tu vends ton organisation. Mais un template sans guide d'utilisation genere du support et des remboursements.",
        how_to_use: "Pars d'un systeme que TU utilises vraiment (ton suivi de projet Notion, tes visuels de chaine, ton starter de code). Nettoie-le, generalise-le (enleve tes donnees), documente chaque section (une video Loom de 5 minutes suffit), puis prepare le lien de duplication ou l'archive.",
        objectives: [
          "Transformer un systeme personnel en template vendable",
          "Documenter l'utilisation (guide ou video courte)",
          "Preparer la livraison (lien de duplication, archive, licence)"
        ],
        resources: [
          { label: "Notion (templates et duplication)", url: "https://www.notion.com/", kind: "tool", why: "Le format de template le plus vendu : un lien de duplication suffit a livrer.", how: "Duplique ton systeme, retire tes donnees, active le partage en mode duplication." },
          { label: "Loom (video de demo)", url: "https://www.loom.com/", kind: "tool", why: "Enregistrer une demo de 5 minutes qui sert de documentation ET d'argument de vente.", how: "Filme un tour du template : a quoi sert chaque section, comment demarrer." },
          { label: "GitHub (starters de code)", url: "https://github.com/", kind: "tool", why: "Pour vendre un starter de code : depot prive + acces a l'achat, avec un README solide.", how: "Si ton template est du code, soigne le README comme une page de vente." }
        ],
        quiz: [
          { q: "Qu'est-ce qui fait la valeur d'un template ?", choices: ["Sa complexite", "Le temps qu'il fait gagner et sa facilite de prise en main", "Le nombre de pages"], answer: 1, explanation: "On achete des heures economisees. Un template simple et bien documente bat une usine a gaz." },
          { q: "Pourquoi partir d'un systeme que tu utilises vraiment ?", choices: ["C'est plus rapide et le template est deja valide par l'usage", "C'est interdit de faire autrement", "Pour eviter de payer Notion"], answer: 0, explanation: "Ton usage quotidien a deja elimine ce qui ne marche pas : tu vends un systeme eprouve." },
          { q: "Que doit contenir la documentation minimale ?", choices: ["Rien, un bon template s'explique tout seul", "Comment demarrer et a quoi sert chaque section (guide ou video courte)", "L'historique complet de tes modifications"], answer: 1, explanation: "Sans documentation, chaque vente genere des questions de support - ou un remboursement." },
          { q: "Comment livre-t-on un template Notion ?", choices: ["En envoyant son mot de passe Notion", "Par un lien de duplication partage apres l'achat", "En recreant le template chez chaque client"], answer: 1, explanation: "Le lien de duplication livre instantanement une copie independante a chaque acheteur." }
        ],
        micro_project: {
          title: "Ton template pret a vendre",
          brief: "Transforme un de tes systemes en template livrable (ou avance ton produit principal s'il n'est pas un template).",
          steps: [
            "Choisis un systeme que tu utilises (Notion, Canva, code...) et duplique-le",
            "Nettoie et generalise : retire tes donnees, ajoute des exemples fictifs",
            "Documente : guide ecrit court ou video Loom de 5 minutes",
            "Prepare la livraison : lien de duplication ou archive + licence simple"
          ],
          deliverable: "La description de ton template (probleme resolu, temps gagne), le lien de demo ou de duplication, et ta documentation.",
          validation: "ai"
        },
        xp_reward: 60,
        duration_minutes: 55,
        sort_order: 20
      },
      {
        slug: "packager-une-mini-formation",
        title: "Packager une mini-formation",
        intro: "Une mini-formation n'est pas un cours universitaire : 60 a 90 minutes de videos courtes qui menent a UN resultat concret. Si tu as suivi le parcours Creation de contenu avec l'IA, tu as deja toutes les competences de production - ici tu apprends a les packager en produit payant.",
        why_important: "La formation est le produit digital au panier moyen le plus eleve (30 a 200 euros et plus). Le format court a resultat unique se cree en semaines, pas en mois, et se vend mieux qu'un cours-fleuve inachevable.",
        how_to_use: "Structure : un resultat final annonce, 5 a 10 lecons de 5-10 minutes, un livrable par lecon. Produis avec les techniques du parcours contenu (script 3 passes, voix, montage). Heberge simplement : systeme.io (gratuit pour commencer, en francais) ou directement en fichiers sur Gumroad ou Ko-fi.",
        objectives: [
          "Structurer une formation courte autour d'UN resultat",
          "Reutiliser les competences de production video (scripts, voix, montage)",
          "Choisir un hebergement simple (systeme.io, Gumroad, Ko-fi)"
        ],
        resources: [
          { label: "systeme.io", url: "https://systeme.io/", kind: "tool", why: "Plateforme francaise tout-en-un (formation + paiement + emails), plan gratuit.", how: "Cree un compte gratuit et explore la creation d'un espace de formation." },
          { label: "Loom (lecons video simples)", url: "https://www.loom.com/", kind: "tool", why: "Enregistrer ecran + voix sans montage complexe : parfait pour des lecons de 5-10 minutes.", how: "Enregistre une lecon test de 5 minutes avec partage d'ecran." },
          { label: "Parcours Creation de contenu avec l'IA (TakaCode)", url: "https://takacode.vercel.app/parcours/creation-contenu-ia", kind: "doc", why: "Les techniques de script, voix off et montage s'appliquent directement a tes lecons.", how: "Si tu ne l'as pas suivi, fais au moins le module scripts et voix." }
        ],
        quiz: [
          { q: "Qu'est-ce qu'une bonne mini-formation ?", choices: ["10 heures de theorie exhaustive", "60-90 minutes de lecons courtes qui menent a UN resultat concret", "Une seule video d'une heure sans structure"], answer: 1, explanation: "Le format court a resultat unique se cree vite, se termine (vraiment) et se recommande." },
          { q: "Pourquoi un livrable par lecon ?", choices: ["Pour faire joli", "Pour que l'apprenant progresse concretement et aille au bout", "C'est une obligation des plateformes"], answer: 1, explanation: "Chaque lecon qui produit quelque chose maintient la motivation - exactement comme les micro-projets TakaCode." },
          { q: "Quel est l'avantage du panier moyen d'une formation ?", choices: ["Il est identique a celui d'un ebook", "Il est nettement plus eleve (30-200 euros et plus)", "Les formations sont toujours gratuites"], answer: 1, explanation: "La transformation promise (resultat guide) justifie un prix superieur au simple contenu." },
          { q: "Pour heberger sa premiere formation simplement...", choices: ["Developper sa propre plateforme", "Utiliser systeme.io, Gumroad ou Ko-fi", "Envoyer les videos par email une par une"], answer: 1, explanation: "L'hebergement cle en main regle paiement et acces : ton energie va au contenu." }
        ],
        micro_project: {
          title: "Le squelette de ta formation (ou la structure finale de ton produit)",
          brief: "Structure complete + une premiere lecon produite, ou l'avancement equivalent de ton produit choisi.",
          steps: [
            "Definis le resultat final en une phrase ('a la fin, tu sauras...')",
            "Decoupe en 5-10 lecons avec un livrable chacune",
            "Produis la lecon 1 (Loom ou technique du parcours contenu)",
            "Choisis ton hebergement et justifie le choix"
          ],
          deliverable: "Ta structure complete (resultat + lecons + livrables), le lien ou la description de la lecon 1, et ton choix d'hebergement.",
          validation: "ai"
        },
        xp_reward: 65,
        duration_minutes: 60,
        sort_order: 30
      }
    ]
  },

  // =====================================================
  // MODULE 3 - Construire sa boutique
  // =====================================================
  {
    slug: "construire-sa-boutique",
    title: "Construire sa boutique",
    summary: "Plateforme de vente, page qui convertit et prix assume.",
    sort_order: 30,
    lessons: [
      {
        slug: "choisir-sa-plateforme-de-vente",
        title: "Choisir sa plateforme de vente",
        intro: "Gumroad, Ko-fi, Lemon Squeezy, Stripe Payment Links : toutes encaissent pour toi, mais elles different sur les frais, la gestion de la TVA, et ce qu'elles offrent autour (emails, affiliation, abonnements). Le bon choix depend de ton produit et de ton pays.",
        why_important: "La TVA sur les produits digitaux en Europe est un casse-tete : les plateformes 'marchand de reference' (Gumroad, Lemon Squeezy) la gerent A TA PLACE. C'est souvent l'argument decisif pour commencer sereinement.",
        how_to_use: "Compare sur 4 criteres : frais par vente, gestion de la TVA (marchand de reference ou pas), fonctionnalites (emails aux acheteurs, codes promo, affiliation), simplicite. Cree ton compte sur la plateforme choisie et configure ta boutique : nom, description, moyen de paiement.",
        objectives: [
          "Comparer les plateformes sur frais, TVA et fonctionnalites",
          "Comprendre la notion de 'marchand de reference' (merchant of record)",
          "Creer et configurer ta boutique"
        ],
        resources: [
          { label: "Gumroad", url: "https://gumroad.com/", kind: "tool", why: "Le plus simple pour demarrer : marchand de reference, boutique en 10 minutes.", how: "Cree ton compte, configure ta boutique et regarde les frais par vente." },
          { label: "Lemon Squeezy", url: "https://www.lemonsqueezy.com/", kind: "tool", why: "Marchand de reference aussi, apprecie pour les produits plus 'tech' et les licences.", how: "Compare ses frais et fonctionnalites avec Gumroad pour TON produit." },
          { label: "Ko-fi", url: "https://ko-fi.com/", kind: "tool", why: "Frais reduits et communaute : bon choix pour les createurs avec audience.", how: "Regarde la partie boutique (Ko-fi Shop) et ses conditions." }
        ],
        quiz: [
          { q: "Que fait un 'marchand de reference' (merchant of record) pour toi ?", choices: ["Il cree ton produit", "Il gere la TVA et la conformite des paiements a ta place", "Il fait ta publicite gratuitement"], answer: 1, explanation: "C'est LA simplification administrative : la plateforme vend officiellement et te reverse ta part." },
          { q: "Quels criteres comparer entre plateformes ?", choices: ["Uniquement la couleur du site", "Frais par vente, gestion TVA, fonctionnalites, simplicite", "Le nombre d'employes de l'entreprise"], answer: 1, explanation: "Ces 4 criteres couvrent l'essentiel ; le reste est du detail au demarrage." },
          { q: "Pourquoi ne PAS developper sa propre plateforme de paiement au debut ?", choices: ["C'est illegal", "Des semaines de travail pour reinventer ce qui existe en 10 minutes ailleurs", "Les clients n'aiment pas les sites personnels"], answer: 1, explanation: "Ton energie doit aller au produit et a la vente, pas a l'infrastructure." },
          { q: "Un lien Stripe Payment Links est ideal pour...", choices: ["Vendre vite sans boutique complete (pre-ventes, offres ponctuelles)", "Remplacer toute une plateforme", "Gerer automatiquement la TVA europeenne"], answer: 0, explanation: "Rapide et flexible, mais sans les services d'un marchand de reference : parfait en appoint." }
        ],
        micro_project: {
          title: "Ta boutique configuree",
          brief: "Choisis ta plateforme avec un comparatif et configure ta boutique.",
          steps: [
            "Compare 3 plateformes sur les 4 criteres pour TON produit",
            "Choisis et justifie en 2 phrases",
            "Cree ta boutique : nom, bio, visuel de banniere",
            "Configure le paiement et cree le brouillon de ta fiche produit"
          ],
          deliverable: "Ton comparatif, la plateforme choisie avec justification, et le lien de ta boutique (meme vide).",
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
        intro: "Une page de vente n'est pas une description : c'est un argumentaire. Promesse claire, benefices avant caracteristiques, preuve, reponse aux objections, appel a l'action. L'IA t'aide a structurer - la sincerite et les preuves viennent de toi.",
        why_important: "A trafic egal, une bonne page vend 3 a 10 fois plus qu'une fiche produit paresseuse. C'est l'actif le plus rentable de ta boutique : chaque heure investie ici paie sur toutes les ventes futures.",
        how_to_use: "Structure eprouvee : (1) titre = la promesse ; (2) le probleme vecu par ta cible, dans SES mots ; (3) la solution et ce que contient le produit ; (4) benefices concrets (pas '50 pages' mais 'le plan exact pour...') ; (5) preuve (demo, extraits, premiers retours) ; (6) FAQ qui leve les objections ; (7) prix et garantie. Ecris le premier jet avec l'IA, recris dans les mots de ta cible (reprends ceux entendus pendant la validation).",
        objectives: [
          "Structurer une page de vente en 7 blocs",
          "Transformer les caracteristiques en benefices",
          "Lever les objections avec preuve, FAQ et garantie"
        ],
        resources: [
          { label: "Claude (copy et objections)", url: "https://claude.ai/", kind: "tool", why: "Structurer l'argumentaire et generer la liste des objections probables de ta cible.", how: "Demande les 10 objections types pour ton produit, puis redige une FAQ qui y repond." },
          { label: "Centre d'aide Gumroad (pages produit)", url: "https://help.gumroad.com/", kind: "doc", why: "Les bonnes pratiques officielles des fiches produit qui convertissent.", how: "Lis les guides sur la description produit et les visuels." },
          { label: "Canva (visuels de la page)", url: "https://www.canva.com/", kind: "tool", why: "Mockups du produit, apercus des pages, bannieres : la preuve visuelle.", how: "Cree 3 visuels : couverture 3D, apercu du contenu, banniere de boutique." }
        ],
        quiz: [
          { q: "Quelle est la difference entre caracteristique et benefice ?", choices: ["Aucune", "La caracteristique decrit le produit, le benefice decrit le resultat pour l'acheteur", "Le benefice est le prix"], answer: 1, explanation: "'50 pages' est une caracteristique ; 'le plan exact pour lancer en 30 jours' est un benefice." },
          { q: "Que met-on dans le titre de la page ?", choices: ["Le nom technique du fichier", "La promesse principale du produit", "La date de creation"], answer: 1, explanation: "Le titre vend le resultat : c'est la premiere (et parfois la seule) chose lue." },
          { q: "A quoi sert la FAQ d'une page de vente ?", choices: ["A remplir la page", "A lever une par une les objections qui bloquent l'achat", "A expliquer ta biographie"], answer: 1, explanation: "Chaque objection non traitee est une vente perdue ; la FAQ les traite sans alourdir l'argumentaire." },
          { q: "Pourquoi reprendre les mots entendus pendant la validation ?", choices: ["Par flemme d'ecrire", "Parce que ta cible se reconnait dans SES propres mots, pas dans ton jargon", "Pour eviter le plagiat"], answer: 1, explanation: "Le meilleur copywriting est celui de tes futurs clients : tu ne fais que le restituer." }
        ],
        micro_project: {
          title: "Ta page de vente complete",
          brief: "Redige et publie la page de vente de ton produit sur ta boutique.",
          steps: [
            "Redige les 7 blocs (premier jet IA, recriture dans les mots de ta cible)",
            "Cree 3 visuels dans Canva (couverture, apercu, banniere)",
            "Fais generer les 10 objections par l'IA et reponds-y dans la FAQ",
            "Publie la page sur ta boutique (produit en brouillon ou pre-vente si pas fini)"
          ],
          deliverable: "Le lien de ta page de vente publiee + les 3 objections les plus dures et tes reponses.",
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
        intro: "Le prix ne se devine pas, il se positionne : par rapport a la valeur creee, aux alternatives, et a ta strategie (produit d'entree ou produit phare). L'erreur numero un des debutants n'est pas de vendre trop cher - c'est de vendre trop bas.",
        why_important: "Un prix trop bas ne rassure pas : il inquiete ('si c'est si bien, pourquoi 3 euros ?') et il t'oblige a des volumes irrealistes. Le bon prix finance la suite : ton temps, tes outils, tes prochains produits.",
        how_to_use: "Methode : (1) liste la valeur creee (temps gagne, resultat obtenu - chiffre-les) ; (2) reperes les prix des alternatives observees a la lecon 1 ; (3) positionne-toi dans la fourchette, pas en dessous ; (4) structure l'offre : un prix de lancement limite dans le temps plutot qu'un prix brade permanent, un bundle si tu as plusieurs produits. Teste et ajuste : le prix n'est jamais grave.",
        objectives: [
          "Positionner un prix par la valeur et les alternatives, pas par la peur",
          "Utiliser prix de lancement et bundles sans se brader",
          "Savoir quand et comment ajuster un prix"
        ],
        resources: [
          { label: "Gumroad (codes promo et versions)", url: "https://gumroad.com/", kind: "tool", why: "Gerer un prix de lancement propre : code limite dans le temps plutot que prix casse.", how: "Repere comment creer un code promo et des paliers de prix (versions)." },
          { label: "Lemon Squeezy", url: "https://www.lemonsqueezy.com/", kind: "tool", why: "Paliers, licences et abonnements si ton produit s'y prete.", how: "Regarde les options de tarification proposees pour ton type de produit." },
          { label: "Claude (test de positionnement)", url: "https://claude.ai/", kind: "tool", why: "Simuler la perception : demande comment ta cible percevrait 3 niveaux de prix.", how: "Presente ton produit et 3 prix candidats ; analyse les perceptions simulees." }
        ],
        quiz: [
          { q: "Quelle est l'erreur de prix la plus frequente des debutants ?", choices: ["Vendre beaucoup trop cher", "Vendre trop bas par peur", "Ne pas afficher de prix"], answer: 1, explanation: "Le prix plancher attire les chasseurs de gratuit, inquiete les vrais acheteurs et ne finance rien." },
          { q: "Comment positionner son prix ?", choices: ["Au hasard", "Par la valeur creee et les prix des alternatives", "Toujours a 9,99"], answer: 1, explanation: "Valeur chiffree + fourchette du marche = un prix defendable que tu peux assumer sur ta page." },
          { q: "Prix de lancement ou prix brade permanent ?", choices: ["Prix brade pour toujours", "Prix de lancement limite dans le temps, puis prix normal", "Aucune promo jamais"], answer: 1, explanation: "L'urgence honnete du lancement recompense les premiers ; le prix brade permanent detruit la valeur percue." },
          { q: "Ton produit ne se vend pas a 29 euros. Premiere hypothese a tester ?", choices: ["Le prix est forcement trop haut : passe a 2 euros", "La promesse ou la preuve de la page ne convainc pas encore", "Les produits digitaux ne marchent pas"], answer: 1, explanation: "Avant de toucher au prix, verifie promesse, preuve et trafic : c'est la que se perdent la plupart des ventes." }
        ],
        micro_project: {
          title: "Ta grille de prix assume",
          brief: "Fixe le prix de ton produit avec une justification solide, et structure ton offre de lancement.",
          steps: [
            "Chiffre la valeur creee (temps gagne, resultat) pour ton acheteur",
            "Releve les prix de 3 alternatives",
            "Fixe ton prix et ton offre de lancement (duree limitee)",
            "Ecris en 3 phrases la justification que tu pourrais dire a un client"
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

  // =====================================================
  // MODULE 4 - Lancer, encaisser, iterer
  // =====================================================
  {
    slug: "lancer-et-encaisser",
    title: "Lancer, encaisser, iterer",
    summary: "La sequence de lancement, le marketing de contenu, et le premier euro declare.",
    sort_order: 40,
    lessons: [
      {
        slug: "la-sequence-de-lancement",
        title: "La sequence de lancement",
        intro: "Un lancement n'est pas un post unique le jour J : c'est une sequence d'une semaine qui chauffe ton audience avant d'ouvrir les ventes. Teasing, coulisses, preuve, ouverture, rappel : chaque jour a un role.",
        why_important: "Le meme produit, poste une fois, fait 3 ventes ; lance en sequence, il en fait 30. Le lancement est aussi ton meilleur crash-test : les questions recues nourrissent ta FAQ et ta V2.",
        how_to_use: "Sequence type sur 7 jours : J-5 teasing du probleme ; J-3 coulisses de la creation ; J-1 annonce avec la promesse et l'heure d'ouverture ; Jour J ouverture avec l'offre de lancement ; J+2 preuve sociale (premiers retours) ; J+4 rappel de fin d'offre. Diffuse partout ou ta cible existe deja : tes reseaux, les communautes pertinentes, la communaute TakaCode - et Product Hunt si ton produit est un outil.",
        objectives: [
          "Planifier une sequence de lancement sur 7 jours",
          "Choisir les canaux ou ta cible existe deja",
          "Transformer les retours du lancement en ameliorations"
        ],
        resources: [
          { label: "Product Hunt", url: "https://www.producthunt.com/", kind: "tool", why: "Le lancement de reference pour les outils et templates 'tech'.", how: "Observe 3 lancements reussis dans ta categorie : visuels, accroche, premiers commentaires." },
          { label: "Communaute TakaCode", url: "https://takacode.vercel.app/communaute", kind: "doc", why: "Des createurs qui comprennent ta demarche : parfait pour tes premiers retours honnetes.", how: "Partage ton lancement et demande des retours francs sur ta page de vente." },
          { label: "Canva (visuels de lancement)", url: "https://www.canva.com/", kind: "tool", why: "Preparer d'un coup tous les visuels de la sequence.", how: "Cree les 6 visuels de ta sequence en une session, avec un fil visuel commun." }
        ],
        quiz: [
          { q: "Pourquoi une sequence plutot qu'un post unique ?", choices: ["Pour spammer", "Parce que l'audience a besoin d'etre chauffee : le jour J ne surprend personne, il conclut", "C'est identique"], answer: 1, explanation: "Teasing, coulisses et preuve construisent l'attente ; l'ouverture ne fait que la convertir." },
          { q: "Ou diffuser son lancement ?", choices: ["Partout au hasard", "La ou ta cible existe deja : tes reseaux, les communautes pertinentes", "Uniquement par SMS"], answer: 1, explanation: "Un canal ou ta cible est deja presente vaut dix canaux generiques." },
          { q: "Que faire des questions recues pendant le lancement ?", choices: ["Les ignorer", "Les transformer en FAQ et en ameliorations du produit", "Supprimer les commentaires"], answer: 1, explanation: "Chaque question est une objection documentee gratuitement : ta page et ta V2 s'en nourrissent." },
          { q: "Product Hunt est surtout pertinent pour...", choices: ["Tous les produits sans exception", "Les outils, templates et produits 'tech'", "Les produits physiques"], answer: 1, explanation: "L'audience de Product Hunt cherche des outils : un ebook grand public y performera moins." }
        ],
        micro_project: {
          title: "Ton plan de lancement ecrit",
          brief: "Prepare ta sequence complete de lancement, prete a derouler.",
          steps: [
            "Ecris les 6 messages de la sequence (J-5 a J+4), premier jet IA puis ta voix",
            "Cree les visuels associes dans Canva",
            "Liste tes canaux : ou ta cible existe-t-elle deja ?",
            "Fixe la date d'ouverture et la duree de l'offre de lancement"
          ],
          deliverable: "Ta sequence complete (6 messages), tes canaux choisis et ta date de lancement.",
          validation: "ai"
        },
        xp_reward: 60,
        duration_minutes: 50,
        sort_order: 10
      },
      {
        slug: "vendre-par-le-contenu",
        title: "Vendre par le contenu, sans forcer",
        intro: "Apres le pic du lancement, c'est le contenu qui vend en continu : chaque video, post ou article qui aide ta cible amene des visiteurs vers ta boutique. Si tu as une chaine faceless (parcours Creation de contenu), elle devient ton canal de vente permanent.",
        why_important: "Le contenu cree la confiance avant la transaction : on achete a ceux qui nous ont deja aides. C'est le cercle vertueux TakaCode : ton contenu attire, ton produit monetise, tes revenus financent la suite.",
        how_to_use: "La regle : aider d'abord, mentionner ensuite. Chaque contenu resout un petit probleme de ta cible et mentionne naturellement ton produit comme la suite logique ('le plan complet est dans mon guide'). Ratio sain : 80 % de valeur pure, 20 % de mention produit. Mets le lien partout : description, epingle, bio.",
        objectives: [
          "Relier ton contenu a ton produit sans matraquage",
          "Appliquer le ratio 80/20 valeur/mention",
          "Installer les liens boutique aux bons endroits"
        ],
        resources: [
          { label: "Parcours Creation de contenu avec l'IA (TakaCode)", url: "https://takacode.vercel.app/parcours/creation-contenu-ia", kind: "doc", why: "Le parcours complet pour creer le canal qui vendra ton produit en continu.", how: "Si ce n'est pas fait, suis-le en parallele : les deux parcours se nourrissent." },
          { label: "YouTube Creators", url: "https://www.youtube.com/creators/", kind: "doc", why: "Les bonnes pratiques officielles pour mentionner ses produits sans penaliser ses videos.", how: "Regarde les regles sur les liens en description et les mentions commerciales." },
          { label: "Ko-fi (lien en bio)", url: "https://ko-fi.com/", kind: "tool", why: "Une page unique qui regroupe boutique et liens : ideale pour les bios de reseaux.", how: "Configure ta page comme hub : produit en avant, reseaux en dessous." }
        ],
        quiz: [
          { q: "Pourquoi le contenu vend-il mieux que la publicite brute au debut ?", choices: ["Il est plus cher", "Il cree la confiance : on achete a ceux qui nous ont deja aides", "Il est obligatoire"], answer: 1, explanation: "La confiance precede la transaction - le contenu la construit gratuitement et durablement." },
          { q: "Quel est le ratio sain valeur/mention produit ?", choices: ["100 % de promo", "Environ 80 % de valeur pure, 20 % de mention", "50/50 strict"], answer: 1, explanation: "Trop de promo tue l'audience ; la mention naturelle en fin de contenu utile convertit mieux." },
          { q: "Comment mentionner son produit naturellement ?", choices: ["En majuscules toutes les 30 secondes", "Comme la suite logique du contenu ('le plan complet est dans mon guide')", "Ne jamais le mentionner"], answer: 1, explanation: "Le contenu resout un petit probleme ; le produit resout le grand : la transition est naturelle." },
          { q: "Ou placer le lien de ta boutique ?", choices: ["Nulle part, on doit le deviner", "Description, commentaire epingle, bio, page hub", "Uniquement sur ta carte de visite"], answer: 1, explanation: "Chaque point de contact doit mener a la boutique en un clic." }
        ],
        micro_project: {
          title: "Ton premier contenu qui vend",
          brief: "Cree un contenu 80/20 qui aide ta cible et mene naturellement a ton produit.",
          steps: [
            "Choisis un petit probleme de ta cible lie a ton produit",
            "Cree le contenu (video, post ou article) qui le resout vraiment",
            "Ajoute la mention naturelle et le lien boutique",
            "Publie et installe le lien dans ta bio et tes descriptions"
          ],
          deliverable: "Le lien de ton contenu publie et la facon dont il mene a ton produit.",
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
        intro: "Encaisser son premier euro change tout : ce n'est plus un projet, c'est un business. Cette lecon boucle la boucle TakaCode : tu mesures, tu iteres, tu declares ton premier euro dans ton cockpit projet - et tu prepares le produit suivant.",
        why_important: "Le premier euro prouve le systeme entier : produit, page, prix, canal. Ensuite, tout est optimisation : plus de trafic, meilleure conversion, produits complementaires. Les createurs qui durent construisent une GAMME, pas un one-shot.",
        how_to_use: "Mesure 3 chiffres chaque semaine : visiteurs de la page, taux de conversion (ventes/visiteurs), panier moyen. Une amelioration par semaine, pas dix. Soigne l'apres-vente : email de remerciement, demande d'avis, support rapide - les avis nourrissent ta page. Et declare ton premier euro dans ton cockpit TakaCode : c'est le badge qui compte.",
        objectives: [
          "Suivre visiteurs, conversion et panier moyen",
          "Installer l'apres-vente (remerciement, avis, support)",
          "Declarer ton premier euro et planifier le produit suivant"
        ],
        resources: [
          { label: "Ton cockpit projet TakaCode", url: "https://takacode.vercel.app/dashboard", kind: "tool", why: "Ta boutique EST ton projet : mets le lien en ligne, le modele de revenu 'vente', et declare ton premier euro.", how: "Renseigne l'URL de ta boutique dans ton projet et clique 'Declarer mon premier euro' le jour venu." },
          { label: "Google Analytics (suivi)", url: "https://analytics.google.com/", kind: "tool", why: "Pour suivre le trafic sur ta page de vente gratuitement.", how: "Installe GA4 sur ta page et configure les evenements d'achat." },
          { label: "Claude (analyse hebdo)", url: "https://claude.ai/", kind: "tool", why: "Analyse tes chiffres chaque semaine : fais parler les tendances.", how: "Chaque lundi, colle tes stats de la semaine et demande ce qui merite attention." }
        ],
        quiz: [
          { q: "Que prouve le premier euro ?", choices: ["Que le produit est rentable", "Que le systeme entier marche : produit, page, prix, canal", "Que tu peux arreter de travailler"], answer: 1, explanation: "Le premier euro valide la chaine complete. C'est le premier des 10 000 suivants." },
          { q: "Quels 3 chiffres suivre chaque semaine ?", choices: ["Follows, likes, partages", "Visiteurs, taux de conversion, panier moyen", "CA, benefice, marge"], answer: 1, explanation: "Ces 3-la te disent si ta page attire, convainc et vend assez cher." },
          { q: "Quelle est la prochaine etape apres le premier euro ?", choices: ["Preparer le produit suivant ou le produit complementaire", "Arreter la", "Tout recommencer de zero"], answer: 0, explanation: "Les createurs qui durent construisent une gamme. Chaque nouveau produit vend aux acheteurs deja conquis." },
          { q: "Pourquoi soigner l'apres-vente des le premier euro ?", choices: ["Pour etre sympa", "Parce que les avis et les recommandations generent les ventes suivantes", "C'est obligatoire"], answer: 1, explanation: "Un client satisfait achete le produit suivant ET en parle autour de lui." }
        ],
        micro_project: {
          title: "Ton plan d'apres-lancement",
          brief: "Prepare tes outils de suivi et ton plan pour le produit suivant.",
          steps: [
            "Installe le suivi : note tes 3 chiffres de depart (visiteurs, conversion, panier moyen)",
            "Planifie ton email de remerciement apres-vente pour les premiers acheteurs",
            "Reflechis a ton prochain produit : complementaire ou nouveau marche ?",
            "Declare ton premier euro dans ton cockpit TakaCode (quand il arrivera)"
          ],
          deliverable: "Tes 3 chiffres de depart, ton email de remerciement type, et l'idee de ton prochain produit.",
          validation: "ai"
        },
        xp_reward: 60,
        duration_minutes: 50,
        sort_order: 30
      }
    ]
  },

  // =====================================================
  // MODULE 5 - Vente et copywriting
  // =====================================================
  {
    slug: "vente-et-copywriting",
    title: "Vente et copywriting",
    summary: "L'offre irresistible, la page qui convertit a 10%+, et la methode Hormozi pour vendre sans forcer.",
    sort_order: 50,
    lessons: [
      {
        slug: "l-offre-irresistible",
        title: "L'offre irresistible (methode Hormozi)",
        intro: "Alex Hormozi a popularise un concept simple : une offre n'est pas un prix + un produit. C'est une promesse si forte que le client a peur de dire non. Dans son livre $100M Offers, il montre que le marketing ne peut pas compenser une offre faible : tout commence par l'offre elle-meme.",
        why_important: "A trafic et prix egaux, une offre bien construite convertit 5 a 10 fois plus. Les plus gros vendeurs de produits digitaux (Hormozi, Wilson Botoyiye, les top-sellers Gumroad) ne gagnent pas par hasard : ils ont une offre qui tient la route avant meme d'ecrire une ligne de pub.",
        how_to_use: "Applique le Grand Slam Offer framework d'Hormozi : (1) hyper-specifie ta cible (pas 'entrepreneurs' mais 'freelances qui veulent automatiser leur facturation'); (2) promets un resultat mesurable ('doubler ton chiffre en 90 jours'); (3) ajoute une garantie forte ('satisfait ou rembourse integralement sous 30 jours'); (4) accumule les bonus jusqu'a ce que l'offre paraisse valoir 10x le prix; (5) fixe un prix qui reflete la valeur, pas le cout de production.",
        objectives: [
          "Comprendre le Grand Slam Offer framework d'Alex Hormozi",
          "Identifier les 5 composants d'une offre irresistible",
          "Reecrire ton offre avec garantie, bonus et ciblage renforce"
        ],
        resources: [
          { label: "Alex Hormozi - How to Craft Offers So Good People Feel Stupid Saying No", url: "https://www.youtube.com/watch?v=oQjFBOoBFSs", kind: "video", why: "La video de reference d'Hormozi sur la creation d'offre, 60 minutes de masterclass.", how: "Regarde-la et note les 5 composants du Grand Slam Offer." },
          { label: "Alex Hormozi - $100M Offers (livre)", url: "https://www.acquisition.com/offers", kind: "doc", why: "Le livre fondateur : la methode complete pour construire une offre a 100 millions.", how: "Lis les 3 premiers chapitres et applique a TON produit." },
          { label: "Alex Hormozi - Sell Stuff People Don't Stop Buying", url: "https://www.youtube.com/watch?v=YhSdZTlOzqY", kind: "video", why: "La video ou Hormozi explique pourquoi choisir un produit que les gens continuent d'acheter.", how: "Regarde-la pour verifier que ton produit a une demande recurrente." },
          { label: "Kreezalid - Creer une offre irresistible selon Alex Hormozi", url: "https://fr.kreezalid.com/acquisition/creer-une-offre-irresistible-selon-alex-hormozi-la-cle-du-succes-pour-votre-marketplace-de-services/", kind: "article", why: "Un article en francais qui synthetise la methode Hormozi etape par etape.", how: "Lis-le et compare avec ta propre offre." },
          { label: "Claude (stress-test d'offre)", url: "https://claude.ai/", kind: "tool", why: "Demande a l'IA de jouer le role de ta cible et de challenger ton offre.", how: "Presente ton offre a Claude et demande : pourquoi dirais-je non ?" }
        ],
        quiz: [
          { q: "Selon Hormozi, par quoi commence la performance marketing ?", choices: ["Par le budget publicitaire", "Par l'offre elle-meme", "Par le design du site"], answer: 1, explanation: "Aucune pub ne peut compenser une offre faible. L'offre est le fondation." },
          { q: "Qu'est-ce qu'un Grand Slam Offer ?", choices: ["Une offre a 1 million d'euros", "Une offre si forte que le client a peur de dire non", "Un produit gratuit"], answer: 1, explanation: "C'est le concept central d'Hormozi : une offre qui accumule valeur, garantie et bonus jusqu'a devenir irresistible." },
          { q: "Quels sont les 5 composants d'un Grand Slam Offer ?", choices: ["Design, logo, couleurs, police, images", "Cible hyper-specifique, resultat mesure, garantie forte, bonus accumules, prix refletant la valeur", "Produit, prix, promotion, place, personnes"], answer: 1, explanation: "Chaque composant augmente la valeur percue sans augmenter le cout de production." },
          { q: "Wilson Botoyiye a genere 500 000 euros via systeme.io. Quel etait son avantage principal ?", choices: ["Un budget pub important", "Une offre bien construite sur une cible precise avec des paiements adaptes au marche africain", "Il a eu de la chance"], answer: 1, explanation: "Botoyiye a combine une offre solide avec des moyens de paiement adaptes (Mobile Money) pour une cible mal desservie." }
        ],
        micro_project: {
          title: "Ton offer reecrite en Grand Slam",
          brief: "Reecris ton offre avec les 5 composants du Grand Slam Offer framework.",
          steps: [
            "Hyper-specifie ta cible (une phrase precise)",
            "Formule le resultat promis de maniere mesurable",
            "Ajoute une garantie forte (30 jours satisfait ou rembourse)",
            "Liste 2 a 5 bonus qui augmentent la valeur percue sans cout de production"
          ],
          deliverable: "Ton offre complete : cible, promesse, garantie, bonus, prix justifie.",
          validation: "ai",
          requires_link: false
        },
        xp_reward: 70,
        duration_minutes: 60,
        sort_order: 10
      },
      {
        slug: "copywriting-qui-vend",
        title: "Copywriting qui vend sans forcer",
        intro: "Le copywriting n'est pas une manipulation : c'est l'art de parler le langage de ta cible pour lui montrer que TU as la solution a SON probleme. Les meilleurs vendeurs de produits digitaux (Hormozi, les top-sellers Gumroad) ecrivent comme ils parlent : simplement, directement, avec des mots qui resonnent.",
        why_important: "Sur une page de vente, chaque mot est un cout d'opportunite. Les visiteurs ne lisent pas, ils scannent. Si ton titre n'accroche pas en 3 secondes, le reste n'existe pas. Le copywriting trie les pages qui vendent de celles qui decrivent.",
        how_to_use: "Structure PAS (Probleme-Agiter-Solution) : (1) decris le probleme dans les mots de ta cible; (2) aggrave-le en montrant le cout de ne rien faire; (3) presente ta solution comme l'evidence. Chaque phrase supprime une objection. Lis a voix haute : si ca sonne faux, recris. Utilise l'IA pour generer 10 variantes de titres, mais choisis avec TON oreille.",
        objectives: [
          "Maitriser la structure PAS (Probleme-Agiter-Solution)",
          "Ecrire un titre qui accroche en 3 secondes",
          "Transformer 10 caracteristiques en 10 beneces"
        ],
        resources: [
          { label: "Marketing Mania (chaine YouTube copywriting)", url: "https://www.youtube.com/@MarketingMania", kind: "video", why: "Stanislas Leloup analyse les meilleures pages de vente et techniques de copy.", how: "Regarde 2 videos sur le copywriting et note les techniques." },
          { label: "Alex Hormozi - How to Sell Anything (YouTube)", url: "https://www.youtube.com/watch?v=-wTiaoqSrqs", kind: "video", why: "Hormozi explique sa philosophie de vente en moins de 40 minutes.", how: "Regarde et note les 3 principes de vente qu'il repete." },
          { label: "Yann Leonardi - Growth Marketing (chaine YouTube)", url: "https://www.youtube.com/@YannLeonardi", kind: "video", why: "Strategies de croissance et copywriting avance pour produits digitaux.", how: "Cherche ses videos sur le copywriting et l'ecriture qui convertit." },
          { label: "Stratege Marketing (chaine YouTube)", url: "https://www.youtube.com/@Strategemarketing", kind: "video", why: "Des centaines de concepts marketing expliques simplement, dont le copywriting.", how: "Regarde les videos sur la persuasion et l'ecriture persuasive." },
          { label: "Claude (generation de variantes)", url: "https://claude.ai/", kind: "tool", why: "Generer 10 titres, 10 accroches, 10 appels a l'action en un prompt.", how: "Donne ta promesse et demande 10 variantes de titre avec un angle different chacune." }
        ],
        quiz: [
          { q: "Que signifie PAS en copywriting ?", choices: ["Preparer-Argumenter-Vendre", "Probleme-Agiter-Solution", "Produit-Avis-Satisfaction"], answer: 1, explanation: "PAS est la structure de vente la plus efficace : montre le probleme, amplifie la douleur, presente la solution." },
          { q: "Quel est le temps moyen pour accrocher un visiteur ?", choices: ["30 secondes", "3 secondes", "1 minute"], answer: 1, explanation: "Un visiteur decide de rester ou de partir en 3 secondes. Tout se joue sur le titre et le premier paragraphe." },
          { q: "Pourquoi lire sa page a voix haute ?", choices: ["Pour verifier le rythme et la naturalite", "C'est une tradition", "Pour ennuyer les voisins"], answer: 0, explanation: "Si ca sonne faux a l'oral, ca sonne faux a la lecture. La vente est une conversation." },
          { q: "Quelle est la difference entre caracteristique et benefice ?", choices: ["Aucune", "La caracteristique decrit le produit, le benefice decrit le RESULTAT pour l'acheteur", "Le benefice est moins important"], answer: 1, explanation: "Personne n'achete des '50 pages'. On achete 'le plan exact pour gagner 3h par semaine'." }
        ],
        micro_project: {
          title: "Ta page PAS reecrite",
          brief: "Reecris ta page de vente avec la structure PAS et un nouveau titre accrocheur.",
          steps: [
            "Ecris 10 variantes de titre pour ton produit (IA puis tri manuel)",
            "Structure ta page en PAS : probleme (leurs mots), agite (cout de l'inaction), solution (ton produit)",
            "Ajoute un appel a l'action qui repete la promesse",
            "Enregistre-toi en train de la lire a voix haute et ajuste les passages qui sonnent faux"
          ],
          deliverable: "Ton nouveau titre, la structure PAS de ta page (3 blocs), et ton appel a l'action final.",
          validation: "ai",
          requires_link: false
        },
        xp_reward: 65,
        duration_minutes: 55,
        sort_order: 20
      },
      {
        slug: "preuve-sociale-et-garantie",
        title: "Preuve sociale et garantie qui rassurent",
        intro: "Dans le digital, personne ne te connait. La preuve sociale (temoignages, avis, etudes de cas, chiffres) est ton meilleur argument de vente. La garantie est ton meilleur levier pour faire sauter le dernier frein a l'achat. Les deux travaillent ensemble.",
        why_important: "Un visiteur arrive sur ta page avec des doutes : 'est-ce que ca marche vraiment ?', 'et si ce n'est pas pour moi ?'. La preuve sociale repond au premier doute, la garantie au second. Sans elles, tu relies toute la persuasion au seul poids de tes mots.",
        how_to_use: "Collecte les temoignages tot : meme 2-3 retours de beta-testeurs ou de premiers acheteurs valent mieux que rien. Structure chaque temoignage : probleme AVANT, resultat APRES (chiffre si possible). Pour la garantie, va au-dela du 'satisfait ou rembourse' standard : offre un delai de 30 a 60 jours, sans condition, sans formulaire. Plus la garantie est forte, plus les gens osent acheter.",
        objectives: [
          "Collecter et structurer des temoignages qui convainquent",
          "Choisir une garantie adaptee a ton produit",
          "Installer preuve sociale et garantie sur ta page de vente"
        ],
        resources: [
          { label: "Cas Wilson Botoyiye et Maketou - reussite dans le digital africain", url: "https://africa3i.bj/wilson-botoyiye-lalchimiste-du-digital-beninois-qui-bouscule-lafrique-francophone/", kind: "article", why: "L'histoire d'un createur africain qui a utilise la preuve sociale pour legitimer sa plateforme.", how: "Lis l'article et note comment il utilise les chiffres et les temoignages." },
          { label: "Gumroad - Getting Your First Sale", url: "https://help.gumroad.com/article/71-getting-your-first-sale", kind: "doc", why: "Les conseils officiels Gumroad sur comment obtenir les premieres ventes et avis.", how: "Lis les sections sur les temoignages et la preuve sociale." },
          { label: "Systeme.io - generer des avis", url: "https://systeme.io/", kind: "tool", why: "La plateforme permet de collecter et d'afficher automatiquement des avis.", how: "Configure le module d'avis sur ta page de vente." },
          { label: "Marketing Mania - analyse de pages qui convertissent", url: "https://www.youtube.com/@MarketingMania", kind: "video", why: "Stanislas decortique pourquoi certaines pages vendent et d'autres non.", how: "Cherche ses videos sur la preuve sociale et regarde les exemples." }
        ],
        quiz: [
          { q: "Quelle est la preuve sociale la plus efficace pour un debutant ?", choices: ["Un logo d'entreprise connue", "2-3 temoignages concrets avec avant/apres chiffres", "Le nombre d'abonnes Instagram"], answer: 1, explanation: "Un temoignage specifique ('j'ai gagne 2h par jour') bat n'importe quel logo ou chiffre d'audience." },
          { q: "Pourquoi une garantie forte (30-60 jours) est-elle strategique ?", choices: ["Elle coute cher en remboursements", "Elle fait sauter le dernier frein a l'achat et augmente les ventes plus que les remboursements", "C'est obligatoire par la loi"], answer: 1, explanation: "Hormozi le montre : une garantie forte augmente le taux de conversion de 20 a 40%, et les remboursements restent sous 5%." },
          { q: "Combien de temoignages faut-il pour commencer ?", choices: ["50 minimum", "2-3 deja suffisent si ils sont specifiques et credibles", "Aucun, ce n'est pas important"], answer: 1, explanation: "3 temoignages qui montrent un avant/apres concret valent mieux que 50 avis generiques." },
          { q: "Quel est le meilleur format de temoignage ?", choices: ["Une note sur 5 etoiles", "Probleme AVANT + solution TROUVEE + resultat APRES (si possible chiffre)", "Un simple 'super produit'"], answer: 1, explanation: "Le format narratif avant/apres est le plus persuasif car le lecteur s'identifie au probleme de depart." }
        ],
        micro_project: {
          title: "Ton mur de preuve et ta garantie",
          brief: "Collecte tes premiers temoignages et rege la garantie de ton produit.",
          steps: [
            "Contacte 3 personnes qui ont vu ton produit (beta-testeurs, amis cibles) et demande un retour structure : probleme avant, ce qu'ils ont gagne",
            "Ecris la section preuve sociale de ta page de vente avec leurs mots",
            "Choisis ta garantie (delai, conditions) et ajoute-la a ta page",
            "Ajoute une section 'Qui a utilise ce produit' avec les temoignages"
          ],
          deliverable: "Tes 3 temoignages structures (probleme, solution, resultat), le texte de ta garantie, et les phrases que tu as ajoutees a ta page.",
          validation: "ai",
          requires_link: false
        },
        xp_reward: 60,
        duration_minutes: 45,
        sort_order: 30
      }
    ]
  },

  // =====================================================
  // MODULE 6 - Creation de contenu qui vend
  // =====================================================
  {
    slug: "creation-de-contenu-qui-vend",
    title: "Creation de contenu qui vend",
    summary: "Construire une audience qui achete par la valeur : contenu organique, storytelling et entonnoir de vente naturel.",
    sort_order: 60,
    lessons: [
      {
        slug: "strategie-de-contenu-pour-produits-digitaux",
        title: "Strategie de contenu pour produits digitaux",
        intro: "Vendre par le contenu, c'est construire la confiance AVANT la transaction. Chaque contenu que tu publies est une porte d'entree vers ta boutique. La strategie, c'est de savoir QUEL contenu publier, SUR quel canal, et COMMENT il mene a ton produit sans forcer.",
        why_important: "Les acheteurs de produits digitaux sont des apprenants : ils cherchent des solutions a leurs problemes. Si ton contenu les aide gratuitement, tu deviens leur reference naturelle. Quand ils seront prets a acheter, ils viendront chez TOI. C'est le modele des plus gros vendeurs : Hormozi, Botoyiye, les top-sellers Gumroad.",
        how_to_use: "Carte des contenus : liste les 10 problemes les plus frequents de ta cible. Pour chaque probleme, cree un contenu gratuit (video, post, article) qui le resout. Dans chaque contenu, mentionne ton produit comme la suite logique ('la methode complete est dans mon guide, lien en description'). Publie sur 1 canal principal (YouTube, TikTok, Instagram, ou blog) et repurpose sur les autres.",
        objectives: [
          "Creer une carte de 10 contenus lies a ton produit",
          "Choisir ton canal principal selon ta cible",
          "Planifier un mois de publication"
        ],
        resources: [
          { label: "Olivier Roland - chaine YouTube business digital", url: "https://www.youtube.com/@OlivierRoland", kind: "video", why: "Reference francophone sur le business en ligne et la creation de contenu.", how: "Regarde ses videos sur la strategie de contenu pour blog/YouTube." },
          { label: "Web Marketing Tuto - chaine YouTube", url: "https://www.youtube.com/@WebMarketingTuto", kind: "video", why: "Tutoriels concrets pour creer du contenu et generer du trafic.", how: "Cherche ses videos sur la creation de contenu SEO et les articles de blog." },
          { label: "Ludo Salenne - strategies contenu et prospection", url: "https://www.youtube.com/@LudovicSalenne", kind: "video", why: "Strategies pour gagner des clients via le contenu et l'automatisation.", how: "Regarde ses videos sur l'inbound marketing et la creation de contenu." },
          { label: "Dan Noel - decoder les algorithmes", url: "https://www.youtube.com/@DanNoel", kind: "video", why: "Comprendre comment marchent les algorithmes des reseaux sociaux.", how: "Regarde ses videos pour savoir quel format de contenu privilegier sur chaque plateforme." },
          { label: "Notion (carte editoriale)", url: "https://www.notion.com/", kind: "tool", why: "Pour structurer ton calendrier de contenu et suivre ta production.", how: "Cree un tableau avec : probleme, titre, format, canal, date." }
        ],
        quiz: [
          { q: "Quel est le meilleur canal pour commencer quand on vend des formations ?", choices: ["Snapchat", "YouTube (video longue) ou un blog specialise", "Tous les canaux en meme temps"], answer: 1, explanation: "Les formats longs (YouTube, blog) construisent une autorite durable et sont indexes par Google. Commence par UN canal, maîtrise-le." },
          { q: "Combien de contenus lies a ton produit devrais-tu avoir dans ta carte editoriale ?", choices: ["2-3", "Environ 10 problemes different de ta cible", "100 minimum"], answer: 1, explanation: "10 problemes = 10 contenus. Chaque contenu est une porte d'entree vers ton produit." },
          { q: "Comment mentionner son produit sans faire de la pub forcee ?", choices: ["En le mettant en avant des la premiere seconde", "Comme la solution naturelle au probleme resolu dans le contenu", "Ne jamais le mentionner"], answer: 1, explanation: "Aide d'abord, mentionne ensuite. Le produit est la suite logique, pas l'intrusion." },
          { q: "Quel est le piege a eviter absolument ?", choices: ["Publier sur trop de canaux a la fois et s'epuiser", "Publier uniquement du contenu long", "Ne faire que des videos"], answer: 0, explanation: "Un canal bien fait vaut 5 canaux survoles. La constance bat la dispersion." }
        ],
        micro_project: {
          title: "Ta carte editoriale du mois",
          brief: "Cree ta carte de 10 contenus et planifie ton mois de publication.",
          steps: [
            "Liste 10 problemes de ta cible auxquels ton produit repond",
            "Pour chaque probleme, definis le type de contenu (video, post, article)",
            "Choisis TON canal principal (la ou ta cible est deja)",
            "Planifie 1 mois : 1 contenu par semaine minimum (4 contenus)"
          ],
          deliverable: "Ta liste de 10 problemes, ton canal choisi avec justification, et ton calendrier du mois (4 dates, 4 sujets).",
          validation: "ai",
          requires_link: false
        },
        xp_reward: 65,
        duration_minutes: 55,
        sort_order: 10
      },
      {
        slug: "storytelling-qui-vend",
        title: "Storytelling qui vend : ton parcours est ton argument",
        intro: "Les gens n'achetent pas un produit, ils achetent une transformation. Et la transformation la plus puissante, c'est la tienne : d'ou tu viens, ce que tu as appris, comment tu en es arrive la. Ton histoire personnelle est ton actif marketing le plus sous-estime.",
        why_important: "Dans un marche sature de produits similaires, la DIFFERENCE c'est TOI. Personne d'autre n'a ton parcours, tes echecs, tes apprentissages. Wilson Botoyiye ne vend pas juste une plateforme : il vend l'histoire du jeune Beninois qui a reussi dans le digital africain. Hormozi ne vend pas des offres : il vend l'histoire du gars de gym qui a batit un empire.",
        how_to_use: "Structure HEROS : (1) Hero - presente-toi dans ta vie d'avant (le probleme que tu avais); (2) Epreuve - ce qui t'a pousse a changer; (3) Revelation - ce que tu as decouvert (la methode, l'outil); (4) Offre - comment tu aides les autres a faire pareil; (5) Solution - ton produit comme la voie. Ecris ton histoire en 300-500 mots et utilise-la sur ta page de vente, dans tes videos, dans ta bio.",
        objectives: [
          "Ecrire ton histoire personnelle liee a ton produit",
          "Utiliser la structure HEROS pour capter l'attention",
          "Integrer ton histoire dans ta page de vente et tes contenus"
        ],
        resources: [
          { label: "David Laroche - interviews d'entrepreneurs", url: "https://www.youtube.com/@DavidLarocheOfficiel", kind: "video", why: "Des interviews d'entrepreneurs qui racontent leur parcours. Chaque histoire est une lecon de storytelling.", how: "Regarde 2 interviews et note comment ils structurent leur recit." },
          { label: "Marketing Mania - storytelling en marketing", url: "https://www.youtube.com/@MarketingMania", kind: "video", why: "Stanislas analyse comment les marques utilisent le storytelling pour vendre.", how: "Cherche ses videos sur le storytelling et les recits de marque." },
          { label: "Behind the Skill - medias et stories", url: "https://www.youtube.com/@BehindtheSkill", kind: "video", why: "Interviews et success stories d'entrepreneurs et createurs de contenu.", how: "Regarde comment les invites racontent leur parcours et ce qui a marche." },
          { label: "Article Wilson Botoyiye - son parcours", url: "https://www.lanation.bj/numerique/innovation-technologique-wilson-botoyiye-lambition-numerique-dune-generation-africaine", kind: "article", why: "L'histoire inspirente d'un createur africain parti de rien.", how: "Lis l'article et identifie la structure de son recit (probleme, epreuve, revelation, offre)." }
        ],
        quiz: [
          { q: "Que signifie HEROS dans le storytelling de vente ?", choices: ["Hero, Epreuve, Revelation, Offre, Solution", "Heureux, Etonne, Ravi, Optimiste, Satisfait", "Habile, Efficace, Rapide, Organise, Simple"], answer: 0, explanation: "La structure HEROS suit la transformation : ta vie d'avant, le declic, la decouverte, l'offre, la solution." },
          { q: "Pourquoi ton histoire personnelle est-elle un actif marketing ?", choices: ["Parce que personne d'autre ne peut la copier", "Parce qu'elle est plus interessante que le produit", "Parce qu'elle remplace la page de vente"], answer: 0, explanation: "Dans un marche sature, TON parcours est unique. C'est ton avantage concurrentiel le plus durable." },
          { q: "Ou utiliser ton histoire ?", choices: ["Uniquement sur ta page 'A propos'", "Page de vente, videos, bio, email de bienvenue - partout ou un prospect te decouvre", "Nulle part, ce n'est pas professionnel"], answer: 1, explanation: "Ton histoire humanise ta marque a chaque point de contact. C'est ce qui cree la connexion avant la vente." },
          { q: "Quel est l'exemple d'Hormozi en storytelling ?", choices: ["Il cache son parcours", "Il raconte comment il est passe du fitness a un empire de 250M$ en partant de zero", "Il ne parle jamais de lui"], answer: 1, explanation: "Hormozi raconte constamment son parcours : gars de gym, premiers echecs, puis la construction d'Acquisition.com." }
        ],
        micro_project: {
          title: "Ton histoire HEROS",
          brief: "Ecris ton histoire personnelle avec la structure HEROS et prevois ou tu vas l'utiliser.",
          steps: [
            "Ecris ta vie d'avant : quel probleme avais-tu avant de decouvrir ta solution ?",
            "L'epreuve : qu'est-ce qui t'a pousse a changer ?",
            "La revelation : qu'as-tu decouvert qui a tout change ?",
            "L'offre et la solution : comment ton produit aide les autres a vivre la meme transformation ?"
          ],
          deliverable: "Ton histoire HEROS en 300-500 mots et la liste de 3 endroits ou tu vas la publier (page de vente, bio, video).",
          validation: "ai",
          requires_link: false
        },
        xp_reward: 60,
        duration_minutes: 50,
        sort_order: 20
      },
      {
        slug: "email-marketing-pour-produits-digitaux",
        title: "Email marketing : la vente qui dure",
        intro: "L'email est le canal de vente le plus rentable pour les produits digitaux : tu parles a des personnes qui ont DEJA choisi de te lire. Un email bien ecrit convertit 5 a 10 fois mieux qu'un post Instagram. Et contrairement aux reseaux sociaux, TU possedes ta liste.",
        why_important: "Les reseaux sociaux changent leurs algorithmes tous les 6 mois. Ta liste email, elle, t'appartient. Les plus gros vendeurs de produits digitaux (Hormozi, les createurs Systeme.io) font 60 a 80% de leurs ventes par email. C'est le canal le plus sous-estime des debutants.",
        how_to_use: "Sequence d'automation en 5 emails pour tout nouvel acheteur : (1) bienvenue + livraison du produit; (2) comment tirer le meilleur parti du produit; (3) conseil bonus lie a son probleme; (4) temoignage d'un autre client; (5) suggestion du produit suivant. En parallele, une newsletter hebdomadaire : 80% valeur, 20% promotion. Systeme.io fait tout ca gratuitement pour commencer.",
        objectives: [
          "Installer une sequence d'automation de 5 emails",
          "Rediger une newsletter qui vend sans forcer",
          "Comprendre pourquoi l'email surpasse les reseaux sociaux en conversion"
        ],
        resources: [
          { label: "Systeme.io - email marketing gratuit", url: "https://systeme.io/", kind: "tool", why: "Plateforme tout-en-un avec emailing integre (gratuit jusqu'a 5000 abonnes).", how: "Configure ta sequence d'automation de 5 emails pour les nouveaux acheteurs." },
          { label: "MailerLite (alternative email)", url: "https://www.mailerlite.com/", kind: "tool", why: "Solution email simple et puissante, plan gratuit jusqu'a 1000 abonnes.", how: "Compare ses fonctionnalites avec Systeme.io pour choisir." },
          { label: "Olivier Roland - marketing par email", url: "https://www.youtube.com/@OlivierRoland", kind: "video", why: "Des videos completes sur comment construire et monetiser une liste email.", how: "Regarde ses videos sur l'email marketing et la newsletter." },
          { label: "Mlle Affiliation (Nina Habault) - email et affiliation", url: "https://www.youtube.com/@MlleWebmarketing", kind: "video", why: "Conseils pratiques sur l'email marketing et l'affiliation pour debutants.", how: "Cherche ses videos sur la creation de sequences d'emails." }
        ],
        quiz: [
          { q: "Pourquoi l'email surpasse-t-il les reseaux sociaux en conversion ?", choices: ["Parce que c'est plus beau", "Parce que tu parles a des gens qui ont choisi de te lire, dans leur boite personnelle", "Parce que c'est gratuit"], answer: 1, explanation: "Un abonne email est un prospect chaud : il a donne son adresse, il t'accorde son attention. C'est un signal fort." },
          { q: "Quel est le bon ratio contenu/promo dans une newsletter ?", choices: ["50/50", "80% valeur, 20% promotion", "100% promo"], answer: 1, explanation: "Meme ratio que le contenu public : la valeur construit la confiance, la promo recolte." },
          { q: "Qu'est-ce qu'une sequence d'automation ?", choices: ["Des emails envoyes automatiquement en fonction d'une action (achat, inscription)", "Un email ecrit par un robot chaque jour", "Une newsletter hebdomadaire"], answer: 0, explanation: "L'automation delivre le bon message au bon moment sans que tu y penses : l'email de bienvenue, le suivi, la recommandation." },
          { q: "Combien d'emails dans la sequence d'accueil recommandee ?", choices: ["1 seul", "Environ 5 emails qui accompagnent le client pas a pas", "20 emails minimum"], answer: 1, explanation: "5 emails couvrent l'essentiel : accueil, prise en main, valeur ajoutee, preuve sociale, prochaine vente." }
        ],
        micro_project: {
          title: "Ta sequence d'accueil de 5 emails",
          brief: "Redige la sequence d'automation pour tes futurs acheteurs et planifie ta newsletter.",
          steps: [
            "Email 1 : bienvenue + livraison du produit (merci, lien, premiere action)",
            "Email 2 : comment utiliser le produit pour des resultats rapides",
            "Email 3 : conseil bonus lie a leur probleme (valeur pure)",
            "Email 4 : temoignage d'un autre client (preuve sociale)",
            "Email 5 : suggestion de ton produit complementaire ou partage"
          ],
          deliverable: "Tes 5 emails rediges (1-2 paragraphes chacun) et la plateforme que tu vas utiliser (Systeme.io, MailerLite...).",
          validation: "ai",
          requires_link: false
        },
        xp_reward: 70,
        duration_minutes: 60,
        sort_order: 30
      }
    ]
  },

  // =====================================================
  // MODULE 7 - Publicite payante
  // =====================================================
  {
    slug: "publicite-payante",
    title: "Publicite payante et acquisition",
    summary: "Facebook Ads, budgets demarrage, retargeting et scaling : passer de 10 a 100 ventes avec la pub.",
    sort_order: 70,
    lessons: [
      {
        slug: "fondations-de-la-pub-payante",
        title: "Les fondations de la publicite payante",
        intro: "La publicite payante est un accelerateur, pas une bouee de sauvetage. Si ton produit, ta page et ton offre ne convertissent pas en organique, la pub ne fera qu'accelerer l'echec. Les fondations : un produit valide, une page qui convertit a 3% minimum, et un budget que tu peux perdre.",
        why_important: "Les plus gros vendeurs de produits digitaux (les top Gumroad, les createurs Systeme.io, les infopreneurs) utilisent tous la pub. Mais ils ont commence APRES avoir valide leur produit en organique. La pub est un levier, pas une solution magique. Sans fondations solides, tu brules ton budget.",
        how_to_use: "Les 3 prerequis avant toute pub : (1) taux de conversion organique d'au moins 3% (verifie avec tes stats actuelles); (2) un produit qui a deja fait au moins 5 ventes organiques; (3) un budget que tu peux perdre integralement sans mettre en danger ton activite. Commence avec un budget test de 50-100 euros, pas plus.",
        objectives: [
          "Verifier que ton produit est pret pour la pub (3 prerequis)",
          "Comprendre le modele economique d'une campagne (CPA, ROAS)",
          "Fixer un budget test qui ne met pas en danger ton activite"
        ],
        resources: [
          { label: "Yann Leonardi - Growth Marketing (Facebook Ads)", url: "https://www.youtube.com/@YannLeonardi", kind: "video", why: "Strategies avancees de croissance et publicite payante par un expert.", how: "Regarde ses videos sur les fondamentaux de Facebook Ads pour debutants." },
          { label: "Ludo Salenne - publicite et acquisition", url: "https://www.youtube.com/@LudovicSalenne", kind: "video", why: "Conseils concrets sur la pub Facebook et les strategies d'acquisition.", how: "Cherche ses videos sur les budgets demarrage et le ciblage." },
          { label: "Centre d'aide Facebook Ads", url: "https://www.facebook.com/business/help", kind: "doc", why: "La documentation officielle pour comprendre le fonctionnement des campagnes.", how: "Lis les articles sur la creation de campagne et le suivi des conversions." },
          { label: "Systeme.io - Ads Manager integre", url: "https://systeme.io/", kind: "tool", why: "Certaines plateformes permettent de lancer des pubs sans quitter l'outil.", how: "Explore les options publicitaires de ta plateforme de vente." }
        ],
        quiz: [
          { q: "Quels sont les 3 prerequis avant de lancer des pubs ?", choices: ["Un logo, un site, un compte bancaire", "Taux de conversion organique > 3%, 5 ventes deja faites, budget jetable", "1000 abonnes Instagram, 500 euros, un designer"], answer: 1, explanation: "La pub accelere ce qui marche deja. Sans validation prealable, chaque euro de pub est une perte seche." },
          { q: "Que signifie CPA ?", choices: ["Cout Par Action (cout par vente ou lead)", "Client Paye Avant", "Campagne Publicitaire Active"], answer: 0, explanation: "Le CPA est la metrique cle : combien tu paies pour chaque vente. Si CPA > prix du produit, tu perds de l'argent." },
          { q: "Pourquoi commencer avec un budget de 50-100 euros ?", choices: ["Pour impressionner les clients", "Pour tester, apprendre et ajuster sans risquer des sommes importantes", "C'est le minimum autorise par Facebook"], answer: 1, explanation: "Les premieres campagnes servent a collecter des donnees, pas a faire des ventes. Petit budget = petit risque." },
          { q: "Quel budget NE DOIS-TU PAS utiliser pour la pub ?", choices: ["Ton budget loisirs", "L'argent que tu ne peux pas te permettre de perdre", "L'argent de ton compte epargne"], answer: 1, explanation: "La pub comporte un risque : si le produit ou la page ne convertit pas, tu perds cet argent. N'utilise que ce que tu peux perdre." }
        ],
        micro_project: {
          title: "Ton plan de campagne test",
          brief: "Prepare tout ce qu'il faut pour lancer ta premiere campagne test sans depenser un euro.",
          steps: [
            "Verifie les 3 prerequis : note ton taux de conversion, confirme 5 ventes, definis ton budget max",
            "Calcule ton seuil de rentabilite : prix du produit / CPA acceptable",
            "Definis ta cible : qui veux-tu toucher ? (interets, comportements, demographie)",
            "Prepare 3 variantes de creatives (image + titre + texte) pour le test A/B"
          ],
          deliverable: "Ton budget test, ton CPA cible, ta cible definie, et 3 variantes de pub pretes a etre lancees.",
          validation: "ai",
          requires_link: false
        },
        xp_reward: 65,
        duration_minutes: 55,
        sort_order: 10
      },
      {
        slug: "lancer-sa-premiere-campagne",
        title: "Lancer sa premiere campagne Facebook/Instagram",
        intro: "La premiere campagne est un apprentissage, pas un lancement de rocket. Tu ne cherches pas la rentabilite immediate : tu cherches des donnees. Quel message accroche ? Quelle creative convertit ? Quel cout par vente est realiste ? Les reponses viennent avec les premiers euros depenses.",
        why_important: "90% des debutants abandonnent la pub apres la premiere campagne parce qu'ils attendaient la rentabilite immediate. Une campagne d'apprentissage de 2-3 semaines avec petit budget te donne les donnees pour scale: efficacement ensuite. C'est le chemin qu'ont pris tous les gros vendeurs.",
        how_to_use: "Structure de campagne type : (1) Objectif : Conversions (achat); (2) Ciblage : interests lies a ta niche + lookalike si tu as deja 100 emails; (3) Budget : 5-10 euros/jour; (4) Creatives : 3 variantes en test A/B; (5) Duree : minimum 7 jours pour que l'algorithme apprenne. Ne touche a rien pendant 7 jours. Ajuste ensuite.",
        objectives: [
          "Lancer une campagne Facebook Ads avec objectif conversions",
          "Mettre en place un test A/B de 3 creatives",
          "Lire les premiers resultats : CPA, CTR, impressions"
        ],
        resources: [
          { label: "Yann Leonardi - lancer ses premieres pubs", url: "https://www.youtube.com/@YannLeonardi", kind: "video", why: "Tutoriel pas a pas pour configurer une campagne Facebook Ads.", how: "Suis ses etapes pour creer ta premiere campagne." },
          { label: "Meta Business Suite - documentation campagnes", url: "https://www.facebook.com/business/ads", kind: "doc", why: "Le guide officiel pour creer et gerer des campagnes publicitaires.", how: "Configure ton compte publicitaire et explore les parametres." },
          { label: "Stratege Marketing - Facebook Ads explique", url: "https://www.youtube.com/@Strategemarketing", kind: "video", why: "Les concepts de base de la publicite Facebook expliques simplement.", how: "Regarde les videos sur le pixel Facebook, le ciblage et le budget." },
          { label: "Claude - optimisation de campagne", url: "https://claude.ai/", kind: "tool", why: "Analyse tes resultats de campagne avec l'IA pour identifier les axes d'amelioration.", how: "Importe tes stats de campagne et demande une analyse des optimisations possibles." }
        ],
        quiz: [
          { q: "Quel est l'objectif de la premiere campagne ?", choices: ["Faire 100 ventes tout de suite", "Collecter des donnees : apprendre ce qui marche et optimiser", "Depenser tout le budget d'un coup"], answer: 1, explanation: "La premiere campagne est un investissement en apprentissage, pas en ventes. Des donnees solides valent plus que 2 ventes hasardeuses." },
          { q: "Combien de temps laisser une campagne tourner avant d'ajuster ?", choices: ["24 heures", "Au moins 7 jours", "Un mois"], answer: 1, explanation: "L'algorithme Facebook a besoin d'au moins 7 jours pour collecter suffisamment de donnees et optimiser la diffusion." },
          { q: "Pourquoi tester 3 creatives differentes ?", choices: ["Pour faire joli", "Pour identifier quel message et quel visuel resonnent le mieux avec ta cible", "Parce que Facebook l'impose"], answer: 1, explanation: "Le test A/B est le seul moyen de savoir ce qui marche vraiment. L'intuition est souvent fausse." },
          { q: "Quel budget journalier minimum pour une campagne test ?", choices: ["50 euros/jour", "5-10 euros/jour", "200 euros/jour"], answer: 1, explanation: "Avec 5-10 euros/jour et 7 jours, tu as depense 35-70 euros. C'est suffisant pour collecter des donnees significatives a petit risque." }
        ],
        micro_project: {
          title: "Ta campagne test prete a etre lancee",
          brief: "Configure completement ta campagne Facebook Ads (sans la lancer) pour qu'elle soit prete quand tu auras valide tes prerequis.",
          steps: [
            "Cree ton compte publicitaire Meta Business Suite",
            "Installe le pixel Facebook sur ta page de vente (ou verification que c'est fait)",
            "Cree une campagne factice (sans lancer) : objectif conversions, ciblage, budget",
            "Prepare 3 creatives differentes (image + texte) avec des angles differents"
          ],
          deliverable: "La capture d'ecran de ta campagne configuree (ou la description detaillee : ciblage, budget, duree) et tes 3 creatives pretes.",
          validation: "ai",
          requires_link: false
        },
        xp_reward: 70,
        duration_minutes: 60,
        sort_order: 20
      },
      {
        slug: "retargeting-et-scaling",
        title: "Retargeting et scaling des campagnes",
        intro: "97% des visiteurs n'achetent pas du premier coup. Le retargeting (ou reciblage) est la technique qui consiste a montrer ta pub a ceux qui sont DEJA venus sur ta page mais n'ont pas achete. C'est la campagne la plus rentable pour tout vendeur de produits digitaux.",
        why_important: "Un visiteur qui connait deja ton produit convertit 3 a 5 fois mieux qu'un visiteur froid. Le retargeting capte cette audience chaude a un cout par clic bien plus bas. C'est le levier le plus rentable avant de scale: vers des audiences froides plus larges.",
        how_to_use: "Mets en place 2 campagnes de retargeting : (1) visiteurs de la page produit (7 jours) - montre un temoignage ou une offre limitee; (2) visiteurs qui ont commence l'achat mais n'ont pas finalise (abandon de panier) - offre un petit geste ou un rappel. Budget : 30-50% de ton budget total de pub. Quand tu as des donnees solides (>50 ventes), scale: en augmentant le budget par paliers de 20% tous les 3 jours.",
        objectives: [
          "Installer le pixel et le retargeting sur ta page de vente",
          "Creer une campagne specifique pour les visiteurs chauds",
          "Comprendre les regles de scaling progressif"
        ],
        resources: [
          { label: "Yann Leonardi - retargeting et scaling", url: "https://www.youtube.com/@YannLeonardi", kind: "video", why: "Strategies avancees pour le retargeting et le scaling des campagnes.", how: "Regarde ses videos sur le reciblage et l'augmentation des budgets." },
          { label: "Ludo Salenne - automatisation et retargeting", url: "https://www.youtube.com/@LudovicSalenne", kind: "video", why: "Comment automatiser ses campagnes de retargeting pour maximiser le ROAS.", how: "Cherche ses videos sur le retargeting et les sequences de reciblage." },
          { label: "Centre d'aide Meta - audiences personnalisees", url: "https://www.facebook.com/business/help/341425252616329", kind: "doc", why: "Documentation officielle sur la creation d'audiences de retargeting.", how: "Configure une audience personnalisee 'visiteurs de la page produit (7 jours)'." },
          { label: "Web Marketing Tuto - Facebook Ads avance", url: "https://www.youtube.com/@WebMarketingTuto", kind: "video", why: "Tutoriels avances sur les strategies publicitaires et le retargeting.", how: "Cherche ses videos sur les audiences personnalisees et le reciblage." }
        ],
        quiz: [
          { q: "Pourquoi le retargeting est-il si rentable ?", choices: ["Parce que c'est gratuit", "Parce qu'il touche des gens qui connaissent DEJA ton produit et ont montre de l'interet", "Parce que Facebook le subventionne"], answer: 1, explanation: "Une audience chaude convertit 3 a 5 fois mieux. Le retargeting capte cette audience a moindre cout." },
          { q: "Quel budget consacrer au retargeting ?", choices: ["10% du budget total", "30 a 50% du budget total", "100% du budget"], answer: 1, explanation: "Le retargeting est la campagne la plus rentable. Il merite une part significative du budget." },
          { q: "Quelle est la regle de scaling recommandee ?", choices: ["Doubler le budget tous les jours", "Augmenter par paliers de 20% tous les 3 jours", "Garder le meme budget toujours"], answer: 1, explanation: "Un scaling trop brutal casse l'algorithme. Des paliers de 20% avec 3 jours de stabilisation permettent une croissance saine." },
          { q: "Quand commencer a scale: vers des audiences froides ?", choices: ["Des la premiere campagne", "Apres avoir valide le produit et collecte au moins 50 ventes", "Jamais, rester sur le retargeting"], answer: 1, explanation: "Les donnees de 50+ ventes permettent de creer des lookalike audiences et de scale: vers du trafic froid avec une base solide." }
        ],
        micro_project: {
          title: "Ton plan de retargeting et scaling",
          brief: "Prepare tes campagnes de retargeting et definis ta strategie de scaling.",
          steps: [
            "Configure ton pixel Facebook (ou verifie qu'il est actif sur ta page de vente)",
            "Cree une audience personnalisee 'visiteurs page produit (7 jours)'",
            "Redige 2 pubs de retargeting : une avec temoignage, une avec offre limitee",
            "Definis ton plan de scaling : budget actuel, paliers de 20%, objectif final"
          ],
          deliverable: "Tes 2 pubs de retargeting redigees, ton audience personnalisee configuree, et ton plan de scaling (palier 1, palier 2, palier 3).",
          validation: "ai",
          requires_link: false
        },
        xp_reward: 65,
        duration_minutes: 55,
        sort_order: 30
      }
    ]
  },

  // =====================================================
  // MODULE 8 - Constance et passage a l'echelle
  // =====================================================
  {
    slug: "constance-et-passage-a-lechelle",
    title: "Constance et passage a l'echelle",
    summary: "Systemes, routines, automatisation et scaling multiplie-produits pour vivre de tes creations.",
    sort_order: 80,
    lessons: [
      {
        slug: "creer-des-systemes-qui-tiennent",
        title: "Creer des systemes qui tiennent dans la duree",
        intro: "La constance est le super-pouvoir des vendeurs de produits digitaux qui reussissent. Mais la constance ne se decrete pas : elle se construit avec des systemes. Un systeme, c'est une routine que tu suis SANS y penser, pas une motivation qui fluctue chaque semaine.",
        why_important: "Wilson Botoyiye et les plus gros createurs ne sont pas les plus talentueux : ils sont les plus reguliers. Botoyiye a publie du contenu et vendu ses produits pendant des annees avant d'atteindre 500 000 euros. Hormozi a fait du contenu gratuit pendant 5 ans avant de lancer ses livres. La constance bat le talent a long terme.",
        how_to_use: "Installe 3 routines minimales hebdomadaires : (1) Creation - 2 a 4 heures par semaine dediees a la production de contenu (bloque dans ton agenda); (2) Vente - 1 heure de suivi des ventes, reponse aux emails, ajustement de la page; (3) Apprentissage - 1 heure pour etudier ce qui marche (analyser les concurrents, lire, regarder une formation). La cle : des blocs horaires fixes, pas du 'quand j'ai le temps'.",
        objectives: [
          "Installer 3 routines hebdomadaires minimales",
          "Comprendre que la constance est un systeme, pas une motivation",
          "Planifier 4 semaines de travail sur ton produit"
        ],
        resources: [
          { label: "Olivier Roland - productivite et systemes", url: "https://www.youtube.com/@OlivierRoland", kind: "video", why: "Des videos sur la mise en place de systemes de travail durables pour entrepreneurs.", how: "Regarde ses videos sur la productivite et les routines d'entrepreneur." },
          { label: "Yann Le Nen - organisation pour createurs", url: "https://www.youtube.com/@YannLeNenOfficiel", kind: "video", why: "Conseils pour les createurs de contenu et entrepreneurs sur l'organisation.", how: "Cherche ses videos sur les routines et la gestion du temps." },
          { label: "Ludo Salenne - automatisation des processus", url: "https://www.youtube.com/@LudovicSalenne", kind: "video", why: "Comment automatiser les taches recurrentes pour liberer du temps.", how: "Regarde ses videos sur les systemes d'automatisation et les workflows." },
          { label: "Article Wilson Botoyiye - la discipline et la constance", url: "https://beninintelligent.bj/2026/04/23/wilson-botoyiye-batisseur-dune-vision-digitale-en-afrique-francophone/", kind: "article", why: "L'histoire d'un createur qui insiste sur la discipline et l'apprentissage continu.", how: "Lis l'article et note les habitudes qu'il mentionne." }
        ],
        quiz: [
          { q: "Qu'est-ce qui distingue les createurs qui durent de ceux qui abandonnent ?", choices: ["Le talent", "La constance basee sur des systemes, pas sur la motivation", "Le budget de depart"], answer: 1, explanation: "La motivation fluctue. Les systemes, eux, tiennent. Les plus grands succes (Botoyiye, Hormozi) sont des histoires de constance." },
          { q: "Combien d'heures par semaine pour les routines minimales ?", choices: ["20 heures", "4 a 6 heures (creation, vente, apprentissage)", "1 heure"], answer: 1, explanation: "2-4h de creation, 1h de vente, 1h d'apprentissage : meme a cote d'un emploi, c'est tenable." },
          { q: "Quelle est la cle pour que les routines tiennent ?", choices: ["Attendre d'etre motive", "Des blocs horaires FIXES dans l'agenda, pas du 'quand j'ai le temps'", "Travailler le week-end uniquement"], answer: 1, explanation: "Les blocs horaires recurrents transforment une intention en habitude. Le 'quand j'ai le temps' est l'ennemi de la constance." },
          { q: "Quel est le prochain palier apres avoir stabilise ses routines ?", choices: ["Arreter la creation de contenu", "Creer un deuxieme produit puis un troisieme : construire une gamme", "Tout automatiser et ne plus rien faire"], answer: 1, explanation: "La gamme est le moteur de croissance : chaque nouveau produit vend aux clients deja conquis." }
        ],
        micro_project: {
          title: "Ton plan de constance sur 4 semaines",
          brief: "Planifie tes 4 premieres semaines de travail sur ton produit avec les 3 routines.",
          steps: [
            "Bloque dans ton agenda les creneaux fixes pour les 3 routines (creation, vente, apprentissage)",
            "Semaine 1 : cree ton premier contenu qui vend (module 6)",
            "Semaine 2 : lance ta sequence email",
            "Semaine 3 : analyse tes premiers chiffres et ajuste",
            "Semaine 4 : planifie ton prochain produit"
          ],
          deliverable: "Ton calendrier des 4 semaines avec les 3 routines bloquees et les objectifs de chaque semaine.",
          validation: "ai",
          requires_link: false
        },
        xp_reward: 70,
        duration_minutes: 60,
        sort_order: 10
      }
    ]
  }
];

// --- Upsert du parcours ---
const { data: track, error: upsertTrackErr } = await supabase
  .from("learning_tracks")
  .upsert(TRACK, { onConflict: "slug" })
  .select("id, slug")
  .single();

if (upsertTrackErr) {
  console.error("Erreur parcours:", upsertTrackErr.message);
  process.exit(1);
}

console.log(`Parcours "${TRACK.title}" (${track.slug}) cree/mis a jour.`);

// --- Upsert des modules et lecons ---
for (const mod of MODULES) {
  const { lessons, ...moduleRow } = mod;

  const { data: moduleData, error: modErr } = await supabase
    .from("track_modules")
    .upsert(
      { ...moduleRow, track_id: track.id, is_published: true },
      { onConflict: "track_id,slug" }
    )
    .select("id, slug")
    .single();

  if (modErr) {
    console.error("Erreur module", mod.slug, ":", modErr.message);
    process.exit(1);
  }

  console.log(`Module "${mod.title}" : ${lessons.length} lecons`);

  for (const lesson of lessons) {
    const { error: lesErr } = await supabase
      .from("track_lessons")
      .upsert(
        { ...lesson, module_id: moduleData.id, is_published: true },
        { onConflict: "module_id,slug" }
      );

    if (lesErr) {
      console.error("Erreur lecon", lesson.slug, ":", lesErr.message);
      process.exit(1);
    }
  }

  console.log(`  -> ${lessons.length} lecons upserted.`);
}

const totalLessons = MODULES.reduce((acc, m) => acc + m.lessons.length, 0);
console.log(`\nSeed master termine : ${MODULES.length} modules, ${totalLessons} lecons.`);
