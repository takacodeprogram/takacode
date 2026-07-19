// Seed du parcours "Media Buyer : publicite payante".
// Cree le parcours, ses 4 modules et 12 lecons.
//
// Usage : node scripts/seed-media-buyer.mjs
// Idempotent : upsert par slug (parcours, modules, lecons).
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
  slug: "media-buyer",
  goal_key: "paid_ads",
  title: "Media Buyer : publicite payante",
  summary: "Facebook Ads, Google Ads, TikTok Ads : maitrise l'art d'acheter du trafic rentable et deviens un media buyer qui genere des ventes.",
  description:
    "Le media buying est la competence la mieux payee du marketing digital. Un bon media buyer peut generer des dizaines de milliers d'euros de ventes avec un budget de 1000 euros. Ce parcours t'apprend a configurer, lancer et optimiser des campagnes publicitaires sur les 3 plus grandes plateformes : Facebook/Instagram Ads, Google Ads et TikTok Ads. Tu apprendras le tracking, l'analyse des donnees, l'optimisation du CPA et du ROAS, et les strategies de scaling. Chaque module est un palier vers la maitrise : tu passes de zero a un media buyer operationnel qui peut gerer des budgets de facon rentable.",
  level_label: "Execution",
  duration_weeks: 6,
  accent_color: "#EF4444",
  icon: "lucide:megaphone",
  objective: "Gerer un budget publicitaire de 1000 euros avec un ROAS positif et des campagnes optimisees.",
  resources: ["Meta Business Suite", "Google Ads", "TikTok Ads", "Google Analytics", "Pixel", "Claude", "Merchant Center", "Google Shopping", "GTM", "Canva", "YouTube: Marketing Mania", "YouTube: Theophile Eliet", "YouTube: Yann Leonardi", "YouTube: Le Parfait Show", "YouTube: FormationsMarketingFR", "YouTube: Ludo Salenne", "YouTube: Social Scaling"],
  next_session: "Mercredi 20h00",
  next_steps: [
    { label: "Fondamentaux du media buying", state: "current" },
    { label: "Facebook et Instagram Ads", state: "locked" },
    { label: "Google Ads et tracking", state: "locked" },
    { label: "Scaling et optimisation", state: "locked" }
  ],
  sort_order: 44,
  is_published: true,
  is_active: true
};

const MODULES = [
  // =====================================================
  // MODULE 1 - Fondamentaux du media buying
  // =====================================================
  {
    slug: "fondamentaux-media-buying",
    title: "Fondamentaux du media buying",
    summary: "Vocabulaire, ecosysteme, metriques et preparation avant de lancer ta premiere campagne.",
    sort_order: 10,
    lessons: [
      {
        slug: "vocabulaire-et-ecosysteme",
        title: "Vocabulaire et ecosysteme du media buying",
        intro: "Media buyer = tu achetes de l'attention pour la transformer en ventes. Chaque plateforme (Meta, Google, TikTok) est un marche aux encheres ou tu enchieris pour apparaitre devant ta cible. Comprendre le vocabulaire (CPM, CPC, CPA, ROAS, CTR, CVR) est le prerequis absolu avant de depenser le premier euro.",
        why_important: "Sans maitriser les metriques de base, tu pilotes a l'aveugle. Les media buyers qui reussissent parlent le langage des chiffres : ils savent instantanement si une campagne est rentable ou non, et pourquoi. Chaque metrique raconte une histoire sur ce qui marche et ce qui ne marche pas.",
        how_to_use: "Memorise les 6 metriques cles : CPM (cout pour 1000 impressions), CPC (cout par clic), CPA (cout par action/vente), CTR (taux de clic), CVR (taux de conversion), ROAS (retour sur depenses pub). Pour chacune, comprends : comment elle se calcule, quel est un bon chiffre pour ton secteur, et comment l'ameliorer. Utilise Claude pour generer des exemples concrets adaptes a ton produit.",
        objectives: [
          "Maitriser les 6 metriques cles du media buying",
          "Comprendre le fonctionnement des encheres publicitaires",
          "Savoir quel KPI suivre selon l'objectif de campagne"
        ],
        resources: [
          { label: "Yann Leonardi - Growth Marketing (chaine YouTube)", url: "https://www.youtube.com/@YannLeonardi", kind: "video", why: "L'une des meilleures chaines francaises pour comprendre les metriques et strategie de croissance.", how: "Regarde ses videos sur les fondamentaux de la pub et les KPI." },
          { label: "Centre d'aide Meta Business Suite", url: "https://www.facebook.com/business/help", kind: "doc", why: "La documentation officielle pour comprendre les metriques Meta.", how: "Lis les definitions du CPM, CPC, CPA, ROAS dans l'aide Meta." },
          { label: "Stratege Marketing - metriques expliquees", url: "https://www.youtube.com/@Strategemarketing", kind: "video", why: "Des centaines de concepts marketing expliques simplement, dont les metriques pub.", how: "Cherche les definitions de CPA, ROAS, CTR et CPM." },
          { label: "Google Ads Help Center", url: "https://support.google.com/google-ads/", kind: "doc", why: "Le centre d'aide officiel pour comprendre les metriques Google Ads.", how: "Lis les articles sur les encheres et le Quality Score." }
        ],
        quiz: [
          { q: "Que signifie CPA ?", choices: ["Cout Par Action (ou Cout Par Acquisition)", "Cout Par Abonne", "Campagne Publicitaire Active"], answer: 0, explanation: "Le CPA est ce que tu paies pour chaque action souhaitee (vente, lead, inscription). C'est la metrique roi." },
          { q: "Quel est un bon ROAS pour un produit digital a 47 euros ?", choices: ["1 (1 euro gagne pour 1 euro depense)", "Au moins 3 a 5 (3-5 euros gagnes pour 1 euro depense)", "10 minimum"], answer: 1, explanation: "Un ROAS de 3-5 est bon pour la plupart des produits. En dessous de 1, tu perds de l'argent." },
          { q: "Que mesure le CTR ?", choices: ["Le nombre de clics", "La proportion de personnes qui cliquent parmi celles qui voient la pub", "Le cout par clic"], answer: 1, explanation: "CTR = clics / impressions x 100. Un CTR de 1-3% est standard, au-dela c'est excellent." },
          { q: "Qu'est-ce que l'enchere publicitaire ?", choices: ["Un tirage au sort", "Un systeme ou les annonceurs enchierissent pour atteindre une audience ciblee", "Un prix fixe par vue"], answer: 1, explanation: "Chaque plateforme est un marche : tu definis ton enchere max, et la plateforme decide si ton annonce est diffusee." }
        ],
        micro_project: {
          title: "Ton glossaire des metriques et ton tableau de bord",
          brief: "Cree ton glossaire personnel des 6 metriques et calcule les seuils de rentabilite pour TON produit.",
          steps: [
            "Note pour chaque metrique : definition, formule, bon chiffre pour ton secteur",
            "Calcule le CPA maximum acceptable pour ton produit (prix produit x marge souhaitee)",
            "Calcule le ROAS minimum pour etre rentable",
            "Cree un tableau de bord (Notion, Google Sheets) pour suivre ces chiffres"
          ],
          deliverable: "Ton glossaire des 6 metriques et ton tableau de bord avec tes seuils de rentabilite.",
          validation: "ai",
          requires_link: false
        },
        xp_reward: 55,
        duration_minutes: 45,
        sort_order: 10
      },
      {
        slug: "pixel-et-tracking",
        title: "Le pixel et le tracking : les fondations techniques",
        intro: "Sans tracking, tu voles a l'aveugle. Le pixel est un morceau de code qui collecte les donnees de navigation de tes visiteurs et les renvoie a la plateforme publicitaire. Il permet le ciblage, le retargeting et la mesure des conversions. C'est le cœur technique du media buying.",
        why_important: "Un pixel mal installe = des donnees fausses = des decisions de campagne erronees. Les erreurs de tracking sont la cause numero 1 des campaigns qui semblent ne pas marcher. Avant de lancer la moindre campagne, ton tracking doit etre parfait.",
        how_to_use: "Cree ton pixel dans Meta Business Suite (Events Manager), installe-le sur ton site (via Google Tag Manager si possible), et configure les evenements standards : PageView, ViewContent, AddToCart, Purchase. Teste avec l'extension Meta Pixel Helper pour verifier que tout est correct. Meme demarche pour Google Ads (Google Tag) et TikTok.",
        objectives: [
          "Installer et configurer le pixel Meta (Facebook/Instagram)",
          "Configurer les evenements de conversion standards",
          "Verifier le tracking avec les outils de debug"
        ],
        resources: [
          { label: "Meta Pixel Helper (extension Chrome)", url: "https://chrome.google.com/webstore/detail/meta-pixel-helper/", kind: "tool", why: "L'outil indispensable pour verifier que ton pixel fonctionne correctement.", how: "Installe l'extension et navigue sur ton site pour verifier les evenements." },
          { label: "Centre d'aide Meta - Pixel et conversions", url: "https://www.facebook.com/business/help/952192354873755", kind: "doc", why: "Documentation officielle sur l'installation et la configuration du pixel.", how: "Suis le guide d'installation du pixel et des evenements standards." },
          { label: "Google Tag Manager", url: "https://tagmanager.google.com/", kind: "tool", why: "Le gestionnaire de balises universel : installe et gere tous tes pixels depuis un seul endroit.", how: "Cree un compte GTM et configure le pixel Meta via un tag personnalise." },
          { label: "Ludo Salenne - tracking et automatisation", url: "https://www.youtube.com/@LudovicSalenne", kind: "video", why: "Des tutos concrets sur l'installation du tracking et l'automatisation marketing.", how: "Regarde ses videos sur la mise en place du pixel et du tracking." }
        ],
        quiz: [
          { q: "A quoi sert un pixel publicitaire ?", choices: ["A afficher des pubs plus belles", "A collecter des donnees de navigation pour le ciblage, le retargeting et la mesure", "A payer moins cher les pubs"], answer: 1, explanation: "Le pixel est l'oeil de tes campagnes : sans lui, aucune donnee ne remonte pour optimiser." },
          { q: "Quel evenement est le plus important pour un site e-commerce ?", choices: ["PageView", "Purchase (achat)", "Scroll (defilement)"], answer: 1, explanation: "Purchase est l'evenement de conversion ultime. C'est lui qui permet d'optimiser pour les ventes." },
          { q: "Pourquoi utiliser Google Tag Manager ?", choices: ["C'est obligatoire", "Pour centraliser tous les pixels et scripts en un seul endroit, sans toucher au code du site", "Pour rendre le site plus rapide"], answer: 1, explanation: "GTM te permet d'ajouter, modifier ou supprimer des pixels sans faire de demande a ton developpeur." },
          { q: "Comment verifier que ton pixel fonctionne ?", choices: ["Tu ne peux pas", "Avec l'extension Meta Pixel Helper : elle montre en temps reel les evenements captures", "En appelant Facebook"], answer: 1, explanation: "Pixel Helper est le debugueur officiel : installe-le et verifie que chaque page declenche les bons evenements." }
        ],
        micro_project: {
          title: "Ton tracking installe et verifie",
          brief: "Installe le pixel Meta sur ta page de vente et verifie les evenements de conversion.",
          steps: [
            "Cree un pixel dans Meta Events Manager",
            "Configure Google Tag Manager et ajoute le pixel Meta via GTM",
            "Configure les evenements : PageView, ViewContent, Purchase (ou Lead)",
            "Teste avec Pixel Helper et corrige les erreurs"
          ],
          deliverable: "Le screenshot de Pixel Helper montrant les evenements actifs, ou la description detaillee de ta configuration.",
          validation: "ai",
          requires_link: false
        },
        xp_reward: 65,
        duration_minutes: 55,
        sort_order: 20
      },
      {
        slug: "ciblage-et-audiences",
        title: "Ciblage et construction d'audiences",
        intro: "Le media buying, c'est 50% de tracking, 50% de ciblage. Une bonne audience est la difference entre une campagne rentable et un budget brule. Les plateformes proposent des ciblages demographics, par centres d'interet, des audiences personnalisees et des lookalikes.",
        why_important: "Les algorithmes des plateformes sont devenus tres performants, mais ils ont besoin de signaux de qualite. Une audience bien construite donne a l'algorithme les bonnes informations pour trouver les acheteurs potentiels. Les audiences personnalisees (a partir de tes donnees) convertissent 3 a 5 fois mieux que les audiences froides.",
        how_to_use: "Construis 3 types d'audiences : (1) Audience froide par interets - les gens qui s'interessent a des sujets lies a ton produit; (2) Audience personnalisee - visiteurs du site, acheteurs passes, liste email; (3) Lookalike - une audience qui ressemble a tes meilleurs clients, creee a partir d'une source de 100+ personnes. Pour chaque audience, estime la taille (entre 500k et 5M pour une campagne froide).",
        objectives: [
          "Creer des audiences froides par interets et demographics",
          "Construire des audiences personnalisees a partir de tes donnees",
          "Comprendre les lookalike et leur utilisation"
        ],
        resources: [
          { label: "Meta Business Suite - Audiences", url: "https://www.facebook.com/business/help/1647490070135311", kind: "doc", why: "Documentation officielle sur la creation d'audiences dans Meta.", how: "Lis les guides sur les audiences personnalisees, lookalikes et sauvegardees." },
          { label: "Yann Leonardi - ciblage et audiences", url: "https://www.youtube.com/@YannLeonardi", kind: "video", why: "Strategies avancees de ciblage et construction d'audiences.", how: "Regarde ses videos sur les audiences froides, chaudes et lookalikes." },
          { label: "Google Ads - Audiences", url: "https://support.google.com/google-ads/answer/2497941", kind: "doc", why: "Guide officiel sur les types d'audiences dans Google Ads.", how: "Explore les segments d'audience, in-market et affinite." },
          { label: "Stratege Marketing - ciblage publicitaire", url: "https://www.youtube.com/@Strategemarketing", kind: "video", why: "Les bases du ciblage publicitaire expliquees simplement.", how: "Regarde les videos sur le ciblage par centre d'interet et demographics." }
        ],
        quiz: [
          { q: "Quels sont les 3 types d'audiences cles ?", choices: ["Grande, moyenne, petite", "Froide (interets), personnalisee (donnees), lookalike (similitude)", "Jeune, adulte, senior"], answer: 1, explanation: "Chaque type d'audience sert un objectif different : acquisition froide, retargeting, scaling." },
          { q: "Quelle audience convertit le mieux ?", choices: ["L'audience froide la plus large", "L'audience personnalisee (visiteurs, emails)", "Toutes les audiences convertissent pareil"], answer: 1, explanation: "Les audiences personnalisees touchent des gens qui connaissent deja ta marque : la confiance est deja la." },
          { q: "Quelle est la taille ideale d'une audience froide ?", choices: ["10 000 personnes", "Entre 500 000 et 5 millions de personnes", "50 millions minimum"], answer: 1, explanation: "Une audience trop petite limite la diffusion et augmente les couts. 500k-5M est le sweet spot pour la plupart des niches." },
          { q: "Combien de personnes faut-il pour creer un lookalike ?", choices: ["50 minimum", "100 minimum, plus c'est qualifie mieux c'est", "1000 minimum"], answer: 1, explanation: "100 personnes qualifiees (acheteurs) suffisent pour generer un lookalike. Plus la source est qualifiee, meilleur est le resultat." }
        ],
        micro_project: {
          title: "Tes 3 audiences construites",
          brief: "Cree tes 3 types d'audiences dans Meta Business Suite (sans les utiliser en campagne).",
          steps: [
            "Cree une audience froide par centres d'interet lies a ton produit (taille 500k-5M)",
            "Cree une audience personnalisee 'visiteurs du site (30 jours)'",
            "Cree un lookalike a partir de ta liste d'emails ou de tes acheteurs (si tu en as assez)",
            "Note la taille estimee de chaque audience et leur potentiel pour ton produit"
          ],
          deliverable: "La description de tes 3 audiences (criteres de ciblage, taille estimee, objectif) pretes a etre utilisees.",
          validation: "ai",
          requires_link: false
        },
        xp_reward: 60,
        duration_minutes: 50,
        sort_order: 30
      }
    ]
  },

  // =====================================================
  // MODULE 2 - Facebook et Instagram Ads
  // =====================================================
  {
    slug: "facebook-instagram-ads",
    title: "Facebook et Instagram Ads",
    summary: "Configurer, lancer et optimiser des campagnes qui convertissent sur Meta.",
    sort_order: 20,
    lessons: [
      {
        slug: "structure-de-campagne-meta",
        title: "La structure de campagne Meta (CBO, Ad Sets, Ads)",
        intro: "Meta organise les campagnes en 3 niveaux : Campagne (objectif), Ad Set (ciblage + budget), Ad (creatives). Le CBO (Campaign Budget Optimization) laisse Meta repartir le budget entre les ad sets les plus performants. Maitriser cette structure est la base de tout media buyer Meta.",
        why_important: "Une campagne mal structuree brule le budget sur des ad sets qui ne marchent pas. Le CBO est un outil puissant mais mal compris : mal utilise, il peut aussi disperser ton budget. La structure determine tout ce qui suit : tests, optimisations, scaling.",
        how_to_use: "Objectif de campagne = Conversions (pour la plupart des produits). Dans l'ad set : definis ton audience, ton budget (commence par 10-15 euros/jour avec CBO), ton placement (Advantage+ laisse Meta optimiser). Cree 3 ads par ad set avec des angles differents. Laisse tourner au moins 7 jours avant de toucher a quoi que ce soit.",
        objectives: [
          "Comprendre la structure campagne / ad set / ad",
          "Configurer une campagne avec CBO (Campaign Budget Optimization)",
          "Creer 3 ads avec des angles differents pour le test"
        ],
        resources: [
          { label: "Yann Leonardi - structure de campagne Meta", url: "https://www.youtube.com/@YannLeonardi", kind: "video", why: "Tuto complet sur la structure de campagne, le CBO et les placements.", how: "Regarde et suis sa methode pour creer ta premiere campagne." },
          { label: "Meta Business Suite - Creer une campagne", url: "https://www.facebook.com/business/help/101560555380314", kind: "doc", why: "Guide officiel pas a pas pour creer une campagne.", how: "Configure une campagne test sans la lancer pour explorer les options." },
          { label: "Ludo Salenne - campagnes Meta qui convertissent", url: "https://www.youtube.com/@LudovicSalenne", kind: "video", why: "Conseils concrets sur la configuration des campagnes Meta.", how: "Cherche ses videos sur la creation de campagnes et les placements." },
          { label: "Stratege Marketing - Facebook Ads pour debutants", url: "https://www.youtube.com/@Strategemarketing", kind: "video", why: "Les bases de Facebook Ads expliques pas a pas.", how: "Regarde les videos sur la creation de campagne et les objectifs." }
        ],
        quiz: [
          { q: "Quels sont les 3 niveaux d'une campagne Meta ?", choices: ["Groupe, Annonce, Budget", "Campagne, Ad Set, Ad", "Objectif, Budget, Creative"], answer: 1, explanation: "Campagne = objectif, Ad Set = ciblage + budget, Ad = la creative diffusee." },
          { q: "Qu'est-ce que le CBO ?", choices: ["Cout Budget Optimise", "Campaign Budget Optimization : Meta repartit le budget entre les ad sets", "Un type de creative"], answer: 1, explanation: "Le CBO laisse Meta allouer le budget la ou il performe le mieux automatiquement." },
          { q: "Combien d'ads creer par ad set pour un test ?", choices: ["1 seule", "3 ads avec des angles differents", "10 ads minimum"], answer: 1, explanation: "3 ads permet de tester des angles sans disperser le budget. Trop d'ads = pas assez de donnees par creative." },
          { q: "Quand analyser les resultats d'une campagne ?", choices: ["Apres 24 heures", "Apres au moins 7 jours et 50 evenements de conversion", "Toutes les heures"], answer: 1, explanation: "L'algorithme a besoin de temps et de donnees pour optimiser. 50 conversions est le seuil de significativite." }
        ],
        micro_project: {
          title: "Ta campagne structuree (non lancee)",
          brief: "Configure completement une campagne Meta sans la lancer, avec 3 ads.",
          steps: [
            "Cree une campagne vide (objectif Conversions) dans Meta Business Suite",
            "Cree un ad set avec ton audience froide, budget 10 euros/jour, CBO active",
            "Cree 3 ads (images + textes) avec des angles differents (promesse, temoignage, urgence)",
            "Prends une capture d'ecran de la configuration"
          ],
          deliverable: "La description de ta structure : objectif, audience, budget, et les 3 angles de tes ads.",
          validation: "ai",
          requires_link: false
        },
        xp_reward: 65,
        duration_minutes: 55,
        sort_order: 10
      },
      {
        slug: "creatives-qui-convertissent",
        title: "Creatives et copy qui convertissent sur Meta",
        intro: "Sur Meta, la creative est le premier facteur de performance. Une bonne image + un bon texte + un appel a l'action clair peuvent multiplier le ROAS par 5 par rapport a une creative moyenne. Le copywriting pour les pubs est different de celui d'une page de vente : il doit accrocher EN UNE SECONDE dans un fil d'actualite sature.",
        why_important: "Les utilisateurs scannent leur fil d'actualite en 1 a 3 secondes par post. Si ta creative n'arrete pas le regard des la premiere seconde, le reste n'existe pas. La difference entre un CTR de 0.5% et 3% est souvent juste la creative.",
        how_to_use: "Regle des 3 angles : (1) Promesse directe - le resultat que ton produit apporte; (2) Temoignage - un avant/apres d'un vrai client; (3) Urgence/curiosite - une question ou une offre limitee. Pour chaque angle, cree 2-3 variantes visuelles. Teste en priorite le texte au-dessus du pli (primary text) et le visuel. Utilise des videos courtes (15-30 secondes) si possible : elles performent souvent mieux que les images.",
        objectives: [
          "Concevoir 3 angles de creatives pour ton produit",
          "Ecrire des accroches qui arretent le scroll en 1 seconde",
          "Comprendre pourquoi la video surpasse l'image sur Meta"
        ],
        resources: [
          { label: "Marketing Mania - analyse de pubs qui marchent", url: "https://www.youtube.com/@MarketingMania", kind: "video", why: "Stanislas decortique pourquoi certaines pubs fonctionnent et d'autres non.", how: "Regarde ses videos sur les pubs Facebook et l'analyse de creatives." },
          { label: "Meta Creative Hub", url: "https://www.facebook.com/ads/creativehub", kind: "tool", why: "L'outil officiel pour previsualiser et tester tes creatives avant de les lancer.", how: "Cree tes 3 ads dans Creative Hub et compare le rendu sur mobile." },
          { label: "Bibliotheque de pubs Meta", url: "https://www.facebook.com/ads/library/", kind: "tool", why: "Vois les pubs que tes concurrents diffusent. Inspiration et analyse de ce qui marche.", how: "Cherche 3 concurrents et analyse leurs creatives : angle, format, texte." },
          { label: "Canva (creatives pub)", url: "https://www.canva.com/", kind: "tool", why: "Modeles de pubs Facebook/Instagram prets a l'emploi.", how: "Utilise les templates 'Facebook Ad' dans Canva pour creer tes visuels." }
        ],
        quiz: [
          { q: "Quels sont les 3 angles de creatives recommandes ?", choices: ["Rouge, bleu, vert", "Promesse directe, temoignage, urgence/curiosite", "Video, image, carousel"], answer: 1, explanation: "Les angles sont le fond (la promesse), pas la forme. Teste 3 angles pour trouver celui qui resonne." },
          { q: "Quel format de creative performe generalement le mieux ?", choices: ["Les images statiques", "Les videos courtes (15-30 secondes)", "Les carrousels de 10 images"], answer: 1, explanation: "La video retient l'attention plus longtemps et permet de montrer le produit en action : meilleur CTR et engagement." },
          { q: "Combien de secondes pour accrocher dans le fil d'actualite ?", choices: ["10 secondes", "1 a 3 secondes max", "30 secondes"], answer: 1, explanation: "Le temps d'un scroll. Si ta creative n'arrete pas le regard instantanement, elle est ignoree." },
          { q: "Ou trouver l'inspiration pour tes creatives ?", choices: ["En copiant les concurrents a l'identique", "Dans la bibliotheque de pubs Meta : analyse ce qui marche dans ta niche", "En inventant tout sans reference"], answer: 1, explanation: "La bibliotheque Meta (ads library) est la meilleure source d'inspiration : tu vois les pubs actives de tous les annonceurs." }
        ],
        micro_project: {
          title: "Tes 3 creatives pretes a tester",
          brief: "Cree 3 ads completes (visuel + texte) avec des angles differents.",
          steps: [
            "Angle 1 : promesse directe - le resultat principal de ton produit en image + texte",
            "Angle 2 : temoignage - une citation ou un avant/apres d'un client (ou simule)",
            "Angle 3 : curiosite/urgence - une question qui interpelle ou une offre limitee",
            "Previsualise chaque ad dans Meta Creative Hub pour verifier le rendu mobile"
          ],
          deliverable: "Tes 3 ads : texte + visuel, avec l'angle de chacune et pourquoi tu penses qu'elle va marcher.",
          validation: "ai",
          requires_link: false
        },
        xp_reward: 65,
        duration_minutes: 55,
        sort_order: 20
      },
      {
        slug: "optimisation-meta",
        title: "Optimisation et analyse des campagnes Meta",
        intro: "Lancer une campagne n'est que le debut. Le vrai travail du media buyer commence APRES le lancement : analyser les donnees, identifier ce qui marche, couper ce qui ne marche pas, et optimiser en continu. Les media buyers qui performent passent 80% de leur temps sur l'optimisation.",
        why_important: "Sans optimisation, tu laisses la campagne tourner a perte. Chaque jour sans ajustement, c'est du budget perdu. Les optimisations incrementales (ajuster les audiences, couper les placements faibles, changer les creatives) peuvent ameliorer le ROAS de 50 a 200% sur 30 jours.",
        how_to_use: "Routine d'analyse hebdomadaire : (1) Verts les metriques de chaque ad set - CPA, ROAS, CTR, frequence; (2) Coupe les ad sets avec CPA > 2x ton objectif et plus de 10 euros depenses; (3) Duplique les ad sets qui performent bien avec un budget legerement augmente; (4) Remplace les creatives usees (frequence > 3-4); (5) Note les apprentissages pour la prochaine campagne. Ajustements par paliers de 20% max, jamais de changements brusques.",
        objectives: [
          "Mettre en place une routine d'analyse hebdomadaire",
          "Savoir quand couper un ad set et quand le renforcer",
          "Comprendre les signaux d'alerte (frequence elevee, CPA en hausse)"
        ],
        resources: [
          { label: "Yann Leonardi - optimisation de campagnes", url: "https://www.youtube.com/@YannLeonardi", kind: "video", why: "Strategies avancees d'optimisation et d'analyse de campagnes Meta.", how: "Regarde ses videos sur l'optimisation post-lancement." },
          { label: "Ludo Salenne - analyse et optimisation", url: "https://www.youtube.com/@LudovicSalenne", kind: "video", why: "Methodes concretes pour analyser et optimiser les performances.", how: "Cherche ses videos sur le suivi des KPI et l'optimisation." },
          { label: "Meta Business Suite - Rapports", url: "https://www.facebook.com/business/help/547984493726244", kind: "doc", why: "Guide officiel pour personnaliser tes rapports et visualiser les bonnes donnees.", how: "Configure un rapport sur mesure avec CPA, ROAS, CTR, frequence." },
          { label: "Claude (analyse de campagne)", url: "https://claude.ai/", kind: "tool", why: "Analyse tes resultats de campagne avec l'IA pour identifier des axes d'amelioration.", how: "Exporte tes donnees de campagne et demande une analyse des optimisations." }
        ],
        quiz: [
          { q: "Quand couper un ad set qui ne performe pas ?", choices: ["Apres 1 jour et 5 euros", "Apres 10 euros depenses et CPA > 2x l'objectif", "Jamais, il faut laisser tourner"], answer: 1, explanation: "10 euros est un budget suffisant pour un premier signal. Si le CPA est le double de ton objectif, coupe." },
          { q: "Qu'est-ce qu'une frequence elevee indique ?", choices: ["Que la campagne marche bien", "Que la meme personne voit ta pub trop souvent (usure creative)", "Que le budget est trop bas"], answer: 1, explanation: "Frequence > 3-4 = les gens commencent a ignorer ta pub. Change la creative ou elargis l'audience." },
          { q: "Quelle est la regle de scaling d'un ad set qui marche ?", choices: ["Multiplier le budget par 10 d'un coup", "Augmenter par paliers de 20% tous les 3 jours", "Ne jamais augmenter"], answer: 1, explanation: "Un scaling trop brutal casse l'algorithme. 20% tous les 3 jours permet a la campagne de stabiliser." },
          { q: "Quel KPI est le meilleur indicateur de sante d'une campagne ?", choices: ["Le nombre de likes", "Le ROAS et le CPA ensemble : rentabilite et cout d'acquisition", "Les impressions"], answer: 1, explanation: "Le ROAS seul peut etre bon avec peu de volume. Le CPA seul peut etre bas sans rentabilite. Les deux ensemble donnent la vraie sante." }
        ],
        micro_project: {
          title: "Ton plan d'analyse et d'optimisation",
          brief: "Prepare ta routine d'analyse hebdomadaire et les regles de decisions pour tes campagnes.",
          steps: [
            "Definis tes seuils : CPA max acceptable, ROAS minimum, frequence maximale",
            "Cree un tableau de bord (Google Sheets/Notion) avec les KPIs a suivre",
            "Etablis tes regles : quand couper, quand dupliquer, quand changer les creatives",
            "Redige un modele de rapport hebdomadaire que tu pourras remplir chaque semaine"
          ],
          deliverable: "Ton tableau de bord KPI, tes regles de decision, et ton modele de rapport hebdomadaire.",
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
  // MODULE 3 - Google Ads et tracking avance
  // =====================================================
  {
    slug: "google-ads-et-tracking",
    title: "Google Ads et tracking avance",
    summary: "Search Ads, Google Shopping Ads, Display, YouTube Ads, tracking cross-plateforme et gestion des blocages.",
    sort_order: 30,
    lessons: [
      {
        slug: "google-search-ads",
        title: "Google Search Ads : etre trouve quand on cherche ton produit",
        intro: "Google Search Ads est le canal ou l'intention est la plus forte : les gens CHERCHENT deja ce que tu vends. Tu ne les interromps pas (comme sur Meta), tu reponds a leur recherche. C'est le canal au ROAS le plus eleve mais aussi le plus technique a configurer.",
        why_important: "Quand quelqu'un tape 'comment vendre des produits digitaux' ou 'template notion gestion projet', il a un probleme ET une intention d'acheter une solution. Apparaitre en premiere position sur cette recherche, c'est capter un client chaud qui est deja en phase d'achat. Le Search convertit souvent 2 a 3 fois mieux que le social.",
        how_to_use: "Structure : 1 campagne = 1 theme de mots-cles. Dans chaque campagne : (1) Groupe d'annonces 1 - mots-cles generiques (haut de l'entonnoir); (2) Groupe d'annonces 2 - mots-cles specifiques (bas de l'entonnoir, intention d'achat). Utilise les types de correspondance : exacte (le plus precis), phrase, large (le plus large). Commence par des mots-cles en exacte avec un petit budget, puis elargis progressivement.",
        objectives: [
          "Comprendre la structure campagne/groupe/mot-cle dans Google Ads",
          "Maitriser les types de correspondance des mots-cles",
          "Lancer une premiere campagne Search avec des mots-cles en exacte"
        ],
        resources: [
          { label: "Google Ads Help Center - Mots-cles", url: "https://support.google.com/google-ads/answer/6324", kind: "doc", why: "Guide officiel sur les types de correspondance et la structure de mots-cles.", how: "Lis les sections sur les types de correspondance exacte, phrase et large." },
          { label: "Yann Leonardi - Google Ads", url: "https://www.youtube.com/@YannLeonardi", kind: "video", why: "Tutos sur la structure de campagne Google Ads et l'optimisation.", how: "Regarde ses videos sur la creation d'une campagne Search." },
          { label: "Google Keyword Planner", url: "https://ads.google.com/home/tools/keyword-planner/", kind: "tool", why: "L'outil officiel pour trouver des mots-cles et estimer leur volume.", how: "Entre ton produit ou sujet et collecte les mots-cles avec volume et concurrence." },
          { label: "Stratege Marketing - Google Ads", url: "https://www.youtube.com/@Strategemarketing", kind: "video", why: "Les bases de Google Ads expliquees simplement en francais.", how: "Regarde les videos sur les campagnes Search et le Quality Score." }
        ],
        quiz: [
          { q: "Quel type de correspondance de mots-cles est le plus precis ?", choices: ["Large", "Exacte (entre crochets)", "Phrase"], answer: 1, explanation: "L'exacte ne declenche l'annonce que pour le mot-cle EXACT ou ses variantes proches. C'est le plus controlable." },
          { q: "Pourquoi le Search Ads convertit-il souvent mieux que le social ?", choices: ["Parce que c'est moins cher", "Parce que l'utilisateur CHERCHE activement une solution - intention forte", "Parce qu'il y a plus de trafic"], answer: 1, explanation: "Sur Search, l'utilisateur exprime un besoin. Tu ne le surprends pas, tu reponds a sa demande." },
          { q: "Quelle est la structure de campagne recommandee ?", choices: ["Tous les mots-cles dans une seule campagne", "1 campagne = 1 theme, avec groupes d'annonces par intention", "Un groupe d'annonces par mot-cle"], answer: 1, explanation: "1 theme = 1 campagne permet de controler le budget par sujet et d'avoir des annonces pertinentes pour chaque groupe." },
          { q: "Quel outil utiliser pour trouver des mots-cles ?", choices: ["Google Trends", "Google Keyword Planner", "Google Analytics"], answer: 1, explanation: "Keyword Planner est fait pour ca : volume de recherche, concurrence, suggestions de mots-cles lies." }
        ],
        micro_project: {
          title: "Ta liste de mots-cles et ta campagne Search",
          brief: "Utilise Keyword Planner pour trouver tes mots-cles et structure ta premiere campagne Search.",
          steps: [
            "Entre 5 a 10 mots-cles principaux lies a ton produit dans Keyword Planner",
            "Collecte les suggestions et note le volume et la concurrence pour chaque mot-cle",
            "Structure : 1 campagne avec 2 groupes d'annonces (generique et specifique)",
            "Selectionne 10 mots-cles en exacte pour commencer"
          ],
          deliverable: "Ta liste de 10 mots-cles en exacte avec volume et concurrence, et la structure de ta campagne (2 groupes d'annonces).",
          validation: "ai",
          requires_link: false
        },
        xp_reward: 65,
        duration_minutes: 55,
        sort_order: 10
      },
      {
        slug: "display-et-youtube-ads",
        title: "Display et YouTube Ads pour le retargeting",
        intro: "Google Display Network (GDN) touche des millions de sites partenaires avec des bannieres ou des annonces natives. YouTube Ads touche les spectateurs AVANT ou PENDANT les videos. Ces deux canaux sont excellents pour le retargeting et la notoriete, moins pour la conversion directe a froid.",
        why_important: "Le Display et YouTube sont les meilleurs canaux pour rester dans l'esprit de quelqu'un qui t'a deja visite. Combine au Search, ils forment un entonnoir complet : Search capte l'intention, Display/YouTube retargettent ceux qui n'ont pas converti, et rappellent ta marque.",
        how_to_use: "YouTube Ads : cree une campagne Video View (vues) ou Traffic (clics). Utilise des videos de 15-30 secondes qui accrochent des les 5 premieres secondes. Cible les audiences personnalisees (visiteurs du site). Pour le Display : cree des bannieres simples (texte ou image) et cible les memes audiences. Budget : 5-10 euros/jour par campagne de retargeting.",
        objectives: [
          "Configurer une campagne YouTube Ads pour le retargeting",
          "Comprendre le Display Network et ses formats",
          "Construire un entonnoir Search + Display/YouTube"
        ],
        resources: [
          { label: "Google Ads Help Center - YouTube Ads", url: "https://support.google.com/google-ads/answer/6340491", kind: "doc", why: "Guide officiel sur les campagnes video YouTube Ads.", how: "Lis les sections sur les types de campagnes video et le ciblage." },
          { label: "Web Marketing Tuto - YouTube Ads", url: "https://www.youtube.com/@WebMarketingTuto", kind: "video", why: "Tutoriels concrets sur la configuration de campagnes YouTube Ads.", how: "Cherche ses videos sur la creation d'une campagne video." },
          { label: "Google Display Network Guide", url: "https://support.google.com/google-ads/answer/2404199", kind: "doc", why: "Guide officiel sur le Display Network et les formats disponibles.", how: "Lis les sections sur les ciblages Display et les bonnes pratiques." },
          { label: "Yann Leonardi - retargeting Google", url: "https://www.youtube.com/@YannLeonardi", kind: "video", why: "Strategies de retargeting cross-canal avec Google.", how: "Regarde ses videos sur la construction d'un entonnoir Google." }
        ],
        quiz: [
          { q: "Quel est le meilleur usage du Display/YouTube au debut ?", choices: ["Acquisition froide massive", "Retargeting des visiteurs de ton site", "Notoriete de marque a grande echelle"], answer: 1, explanation: "Le Display/YouTube en retargeting touche des gens qui connaissent deja ton site. C'est le meilleur ROI au debut." },
          { q: "Quelle duree de video pour une YouTube Ads de retargeting ?", choices: ["10-15 minutes", "15-30 secondes avec accroche des 5 premieres secondes", "2-3 minutes minimum"], answer: 1, explanation: "Le retargeting video doit etre court et percutant : le spectateur connait deja ta marque." },
          { q: "Qu'est-ce que le Google Display Network ?", choices: ["Un reseau de sites partenaires qui affichent des annonces display", "Un type de mot-cle", "Un outil d'analyse"], answer: 0, explanation: "GDN c'est des millions de sites, apps et videos partenaires ou tes annonces display peuvent apparaitre." },
          { q: "Quel budget pour une campagne de retargeting Display/YouTube ?", choices: ["50 euros/jour minimum", "5 a 10 euros/jour suffisent pour commencer", "C'est gratuit"], answer: 1, explanation: "Le retargeting touche une audience plus petite (visiteurs du site), donc un budget modeste suffit." }
        ],
        micro_project: {
          title: "Ta campagne de retargeting YouTube/Display",
          brief: "Configure une campagne de retargeting sur YouTube ou Display (sans la lancer).",
          steps: [
            "Cree une audience personnalisee 'visiteurs du site (30 jours)' dans Google Ads",
            "Configure une campagne Video (objectif Traffic ou Vues) avec cette audience",
            "Prepare le script d'une video de 20-30 secondes pour le retargeting",
            "Note : budget 5-10 euros/jour, duree illimitee, ajustement hebdomadaire"
          ],
          deliverable: "Ta configuration de campagne (audience, budget, format), le script de ta video de retargeting.",
          validation: "ai",
          requires_link: false
        },
        xp_reward: 60,
        duration_minutes: 50,
        sort_order: 20
      },
      {
        slug: "tracking-avance-google-analytics",
        title: "Tracking avance avec Google Analytics 4 et les conversions",
        intro: "Le tracking cross-canal est le super-pouvoir du media buyer avance. Google Analytics 4 (GA4) te permet de voir le parcours complet d'un client : il a vu ta pub Facebook, puis a cherche ton nom sur Google, puis est revenu directement et a achete. Sans GA4, tu vois seulement le dernier clic et tu sous-estimes l'impact de chaque canal.",
        why_important: "La plupart des acheteurs voient plusieurs pubs avant d'acheter. Sans vue d'ensemble, tu coupes les canaux qui assistent la vente (Display, YouTube) parce qu'ils semblent 'ne pas convertir', alors qu'ils sont essentiels. GA4 te donne la vue macro.",
        how_to_use: "Installe GA4 sur ton site (via GTM si possible). Configure les evenements cles : page_view, scroll, click sur le bouton d'achat, purchase. Importe les conversions Google Ads et Meta dans GA4. Utilise les rapports 'Entonnoir d'acquisition' et 'Parcours' pour comprendre comment les canaux interagissent. Le modele d'attribution 'base sur les donnees' est le plus precis.",
        objectives: [
          "Installer et configurer GA4 sur ta page de vente",
          "Configurer les evenements de conversion dans GA4",
          "Comprendre les modeles d'attribution cross-canal"
        ],
        resources: [
          { label: "Google Analytics 4 - Guide de demarrage", url: "https://support.google.com/analytics/answer/9304153", kind: "doc", why: "Le guide officiel pour configurer GA4 et les evenements.", how: "Suis le guide d'installation de GA4 sur ton site." },
          { label: "Yann Leonardi - GA4 et tracking", url: "https://www.youtube.com/@YannLeonardi", kind: "video", why: "Tutos sur la configuration de GA4 et l'analyse des donnees.", how: "Regarde ses videos sur la mise en place de GA4 et les evenements." },
          { label: "Web Marketing Tuto - Google Analytics", url: "https://www.youtube.com/@WebMarketingTuto", kind: "video", why: "Tutoriels Google Analytics 4 pour debutants en francais.", how: "Cherche ses videos sur les rapports GA4 et les conversions." },
          { label: "Claude (analyse GA4)", url: "https://claude.ai/", kind: "tool", why: "Analyse tes rapports GA4 avec l'IA pour comprendre le comportement utilisateur.", how: "Exporte tes donnees GA4 et demande une analyse des parcours de conversion." }
        ],
        quiz: [
          { q: "Pourquoi GA4 est-il important pour un media buyer ?", choices: ["Il remplace Meta Ads", "Il montre le parcours cross-canal : comment chaque canal contribue a la vente", "Il sert juste a compter les visites"], answer: 1, explanation: "GA4 te montre que le Display a assiste la vente meme si le clic final etait Google Search. Sans lui, tu sous-estimes les canaux d'assistance." },
          { q: "Qu'est-ce qu'un modele d'attribution ?", choices: ["Un modele qui attribue les ventes aux bons canaux selon des regles definies", "Un type de pixel", "Un rapport de campagne"], answer: 0, explanation: "L'attribution repond a la question : quel canal a vraiment genere cette vente ? Le modele base sur les donnees est le plus fiable." },
          { q: "Quel evenement GA4 est le plus important pour un site e-commerce ?", choices: ["page_view", "purchase (achat)", "first_visit"], answer: 1, explanation: "Purchase est l'evenement de conversion ultime. Il doit etre configure correctement pour remonter dans tous les canaux." },
          { q: "Par quoi commencer l'installation GA4 ?", choices: ["Par configurer tous les rapports", "Par installer le tag GA4 sur ton site (via GTM de preference)", "Par importer les donnees Meta dans GA4"], answer: 1, explanation: "Le tag GA4 collecte les donnees de base. Ensuite tu ajoutes les evenements et les integrations." }
        ],
        micro_project: {
          title: "Ton GA4 installe et tes evenements configures",
          brief: "Installe GA4 sur ton site et configure les evenements de conversion cles.",
          steps: [
            "Cree un compte GA4 et installe le tag sur ton site (via GTM)",
            "Configure les evenements : page_view (automatique), scroll, click_achat, purchase",
            "Marque purchase comme evenement de conversion",
            "Connecte GA4 a Google Ads et importe les conversions"
          ],
          deliverable: "La confirmation que GA4 collecte des donnees (screenshot du flux en temps reel) et la liste des evenements configures.",
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
  // MODULE 4 - Scaling et optimisation avancee
  // =====================================================
  {
    slug: "scaling-et-optimisation",
    title: "Scaling et optimisation avancee",
    summary: "Strategies de scaling, tests A/B, Meta Andromeda, automatisation et gestion de budget multi-plateforme.",
    sort_order: 40,
    lessons: [
      {
        slug: "scaling-des-campagnes",
        title: "Scaling : quand et comment augmenter son budget",
        intro: "Le scaling est le moment ou le media buyer passe de 'est-ce que ca marche ?' a 'comment faire 10x plus ?'. Augmenter le budget trop vite casse les performances. La bonne methode est progressive et basee sur des regles strictes. Les meilleurs media buyers scalent avec une discipline presque chirurgicale.",
        why_important: "Scaler trop vite (doublement du budget) detruit les performances parce que l'algorithme doit trouver de nouveaux utilisateurs. Scaler trop lentement laisse de l'argent sur la table. La methode des paliers de 20% tous les 3 jours est la plus eprouvee par les media buyers professionnels.",
        how_to_use: "Regles de scaling : (1) Ne scale que les ad sets qui ont au moins 50 conversions et un CPA dans l'objectif; (2) Augmente par paliers de 20% maximum, jamais plus; (3) Attends 3 jours entre chaque palier pour laisser l'algorithme s'adapter; (4) Si le CPA augmente de plus de 30% apres un scaling, reviens au budget precedent. Pour les campagnes Meta, utilise le CBO avec un budget total et laisse Meta repartir entre les ad sets.",
        objectives: [
          "Maitriser la methode de scaling par paliers de 20%",
          "Savoir identifier quand un ad set est pret a etre scale",
          "Comprendre les limites du scaling (audience saturee, creative fatigue)"
        ],
        resources: [
          { label: "Yann Leonardi - scaling de campagnes", url: "https://www.youtube.com/@YannLeonardi", kind: "video", why: "Strategies avancees de scaling pour les campagnes Meta et Google.", how: "Regarde ses videos sur le scaling progressif et les regles de croissance." },
          { label: "Ludo Salenne - scaling et automatisation", url: "https://www.youtube.com/@LudovicSalenne", kind: "video", why: "Methodes concretes pour scaler ses campagnes sans casser les performances.", how: "Cherche ses videos sur les budgets et le scaling progressif." },
          { label: "Meta Blueprint - scaling", url: "https://www.facebook.com/business/learn/courses/", kind: "doc", why: "Les cours officiels Meta sur le scaling et la gestion de budget.", how: "Suis le cours sur le budget optimization et le scaling." },
          { label: "Claude (calculateur de scaling)", url: "https://claude.ai/", kind: "tool", why: "Simule des scenarios de scaling avec l'IA pour planifier tes budgets.", how: "Donne tes donnees de campagne actuelles et demande un plan de scaling sur 30 jours." }
        ],
        quiz: [
          { q: "Quelle est la regle de scaling la plus eprouvee ?", choices: ["Doubler le budget tous les jours", "Augmenter par paliers de 20% tous les 3 jours", "Multiplier par 10 d'un coup"], answer: 1, explanation: "Le scaling progressif permet a l'algorithme de trouver de nouveaux utilisateurs sans perdre les performances." },
          { q: "Quand un ad set est-il pret a etre scale ?", choices: ["Apres 5 conversions", "Apres au moins 50 conversions et un CPA dans l'objectif", "Des le premier jour"], answer: 1, explanation: "50 conversions donnent suffisamment de donnees a l'algorithme pour que le scaling soit stable." },
          { q: "Que faire si le CPA augmente de plus de 30% apres un scaling ?", choices: ["Continuer, ca va se stabiliser", "Revenir au budget precedent", "Arreter definitivement la campagne"], answer: 1, explanation: "Un CPA qui explose apres un scaling signale que l'audience n'est pas prete pour ce budget. Reviens en arriere et attend." },
          { q: "Quelle est la limite ultime du scaling d'une audience ?", choices: ["Il n'y a pas de limite", "La saturation de l'audience (frequence > 4, CPA qui augmente)", "Le budget max de la plateforme"], answer: 1, explanation: "Quand la meme audience voit ta pub trop souvent, la performance decline. Il faut alors elargir l'audience ou creer une nouvelle creative." }
        ],
        micro_project: {
          title: "Ton plan de scaling sur 30 jours",
          brief: "Cree un plan de scaling progressif base sur tes objectifs de budget et de ROAS.",
          steps: [
            "Definis ton budget de depart et ton budget cible sur 30 jours",
            "Etablis les paliers de 20% et les dates d'augmentation",
            "Definis tes regles : conditions pour scale:, arret, retour en arriere",
            "Redige un script d'analyse pour chaque palier (quoi verifier avant d'augmenter)"
          ],
          deliverable: "Ton plan de scaling avec paliers, dates, conditions et script d'analyse.",
          validation: "ai",
          requires_link: false
        },
        xp_reward: 70,
        duration_minutes: 55,
        sort_order: 10
      },
      {
        slug: "tests-ab-et-experimentation",
        title: "Tests A/B et experimentation continue",
        intro: "Les meilleurs media buyers ne cessent jamais de tester. Le test A/B est la methode scientifique appliquee a la publicite : tu changes UNE variable a la fois, tu mesures l'impact, tu conclus. Creative, audience, offre, placement : chaque variable est une opportunite d'amelioration.",
        why_important: "Sans tests, tu supposes que ce que tu fais est optimal. Avec les tests, tu LE SAIS. Les tests A/B bien conduits permettent des gains de 20 a 50% sur le ROAS en quelques semaines. C'est le levier le plus sous-estime des debutants.",
        how_to_use: "Methode : (1) Choisis UNE variable a tester (creative, texte, audience); (2) Cree 2 versions (A et B) qui ne different que sur cette variable; (3) Lance avec le meme budget et la meme cible; (4) Laisse tourner jusqu'a au moins 50 conversions par version; (5) Analyse : quelle version a le meilleur CPA/ROAS ?; (6) Garde la gagnante et re-test avec une nouvelle variable. Ne JAMAIS arreter un test avant d'avoir assez de donnees.",
        objectives: [
          "Concevoir un test A/B valide (une seule variable changee)",
          "Comprendre la significativite statistique (50 conversions minimum)",
          "Mettre en place un cycle d'amelioration continue"
        ],
        resources: [
          { label: "Yann Leonardi - tests A/B publicitaires", url: "https://www.youtube.com/@YannLeonardi", kind: "video", why: "Methodes pour concevoir et analyser des tests A/B valides.", how: "Regarde ses videos sur l'experimentation et les tests de creatives." },
          { label: "Meta Business Suite - Test A/B", url: "https://www.facebook.com/business/help/1731771897982451", kind: "doc", why: "Guide officiel pour creer des tests A/B dans Meta.", how: "Configure un test A/B dans l'interface Meta pour explorer les options." },
          { label: "Stratege Marketing - Test A/B explique", url: "https://www.youtube.com/@Strategemarketing", kind: "video", why: "Concept de test A/B explique simplement.", how: "Regarde les videos sur le split testing et l'experimentation." },
          { label: "Google Optimize (outil de test)", url: "https://optimize.google.com/", kind: "tool", why: "Outil gratuit de test A/B pour les pages de vente (complement des tests pub).", how: "Configure un test A/B sur ta page de vente pour optimiser le taux de conversion." }
        ],
        quiz: [
          { q: "Quelle est la regle d'or d'un test A/B valide ?", choices: ["Tester tout en meme temps", "Changer UNE variable a la fois", "Ne jamais faire de test"], answer: 1, explanation: "Si tu changes 2 variables (creative + texte), tu ne sais pas laquelle a fait la difference. UNE variable a la fois." },
          { q: "Combien de conversions faut-il pour qu'un test soit significatif ?", choices: ["5 par version", "Au moins 50 par version", "10 par version"], answer: 1, explanation: "50 conversions par version donnent une fiabilite statistique suffisante pour prendre une decision." },
          { q: "Que faire de la version perdante ?", choices: ["La supprimer definitivement", "Analyser POURQUOI elle a perdu (apprentissage), puis la remplacer par une nouvelle variante", "La relancer plus tard"], answer: 1, explanation: "Une version perdante t'apprend quelque chose sur ta cible. Documente l'apprentissage et cree une nouvelle variante." },
          { q: "Quel est le rythme ideal d'experimentation ?", choices: ["Un test par an", "Un cycle de test par semaine ou deux semaines", "Jamais, une fois que ca marche on touche a rien"], answer: 1, explanation: "Les marches et les audiences evoluent. Un test toutes les 1-2 semaines permet d'ameliorer continuellement." }
        ],
        micro_project: {
          title: "Ton plan de tests A/B sur 4 semaines",
          brief: "Concois un plan de 4 tests A/B consecutifs pour ameliorer tes campagnes.",
          steps: [
            "Semaine 1 : test de creative (variante A vs variante B)",
            "Semaine 2 : test d'audience (audience froide vs lookalike)",
            "Semaine 3 : test d'offre ou de texte (promesse directe vs question)",
            "Semaine 4 : test de placement (Facebook vs Instagram vs Advantage+)"
          ],
          deliverable: "Ton plan de 4 tests A/B (variable testee, duree, budget, critere de victoire).",
          validation: "ai",
          requires_link: false
        },
        xp_reward: 65,
        duration_minutes: 50,
        sort_order: 20
      },
      {
        slug: "media-buyer-au-quotidien",
        title: "Le media buyer au quotidien : routines et outils",
        intro: "Etre media buyer, c'est un metier de routine et de discipline. Les meilleurs ont des systemes : checklists quotidiennes, tableaux de bord, processus de decision. Ils ne laissent rien a l'intuition. Ce module synthetise tout ce que tu as appris dans un plan d'action quotidien.",
        why_important: "Sans routine, tu oublies de verifier un indicateur, tu rates un signal d'alerte, tu laisses une campagne tourner a perte. Les media buyers qui gerent des budgets de 100 000 euros par mois ont des systemes qui ne dependent pas de leur humeur du jour. La discipline bat l'intuition.",
        how_to_use: "Routine quotidienne (15 min) : (1) Verifie les alertes Meta/Google - campagnes desactivees, erreurs de paiement; (2) Regarde les metriques du jour hier : CPA, ROAS, depenses; (3) Note un ajustement a faire aujourd'hui. Routine hebdomadaire (1h) : (1) Analyse des campagnes de la semaine; (2) Decision de scaling/coupure; (3) Preparation des nouvelles creatives; (4) Planification de la semaine suivante. Outils : Google Sheets (suivi), Meta Business Suite, Google Ads, GA4, Claude (analyse).",
        objectives: [
          "Mettre en place une routine quotidienne de 15 minutes",
          "Mettre en place une routine hebdomadaire d'1 heure",
          "Creer ton kit d'outils de media buyer"
        ],
        resources: [
          { label: "Ludo Salenne - routines de travail", url: "https://www.youtube.com/@LudovicSalenne", kind: "video", why: "Methodes de travail et routines pour les entrepreneurs du digital.", how: "Regarde ses videos sur l'organisation et les tableaux de bord." },
          { label: "Google Sheets (tableau de bord)", url: "https://sheets.google.com/", kind: "tool", why: "Le tableau de bord universel pour suivre tes metriques de campagne.", how: "Cree un tableau avec : campagne, budget, depenses, CPA, ROAS, statut." },
          { label: "Meta Business Suite (app mobile)", url: "https://www.facebook.com/business/help/2449863813390463", kind: "tool", why: "L'app mobile pour verifier tes campagnes en 2 minutes depuis ton telephone.", how: "Telecharge l'app et configure les notifications d'alerte." },
          { label: "Claude (assistant quotidien)", url: "https://claude.ai/", kind: "tool", why: "Analyse rapide de tes donnees, generation de rapports, suggestions d'optimisation.", how: "Chaque semaine, copie tes donnees de campagne et demande une analyse a Claude." }
        ],
        quiz: [
          { q: "Combien de temps pour la routine quotidienne d'un media buyer ?", choices: ["1 heure", "15 minutes suffisent (verification rapide des alertes et metriques)", "5 heures"], answer: 1, explanation: "La routine quotidienne est une veille rapide : alerte, metrique du jour, un ajustement. Le vrai travail est hebdomadaire." },
          { q: "Quelle est la difference entre la routine quotidienne et hebdomadaire ?", choices: ["Aucune, c'est la meme", "Quotidien = veille rapide (15 min), Hebdomadaire = analyse et decisions (1h)", "Hebdomadaire est plus courte"], answer: 1, explanation: "Le quotidien surveille, l'hebdomadaire analyse et decide. Les deux sont complementaires." },
          { q: "Quel outil est indispensable pour le suivi quotidien ?", choices: ["Un tableau de bord (Google Sheets, Meta Business Suite app)", "Un carnet papier", "Un comptable"], answer: 0, explanation: "Un tableau de bord centralise tes KPIs et te permet de voir en un coup d'oeil la sante de tes campagnes." },
          { q: "Quelle est la qualite principale d'un bon media buyer ?", choices: ["La creativite", "La discipline et la rigueur dans le suivi des donnees", "La vitesse d'execution"], answer: 1, explanation: "La creativite sert a concevoir les campagnes. La discipline sert a les optimiser et a ne pas laisser l'ego prendre des decisions." }
        ],
        micro_project: {
          title: "Ton kit de media buyer : routines et tableau de bord",
          brief: "Cree tes routines quotidienne et hebdomadaire, et ton tableau de bord de suivi des campagnes.",
          steps: [
            "Redige ta routine quotidienne (checklist de 15 minutes : alertes, metrique, 1 action)",
            "Redige ta routine hebdomadaire (analyse 1h : coupures, scaling, nouvelles ads)",
            "Cree ton tableau de bord (Google Sheets ou Notion) avec les KPIs a suivre",
            "Note les outils que tu utiliseras : Meta, Google, GA4, Claude, Sheets"
          ],
          deliverable: "Tes 2 routines ecrites (quotidienne et hebdomadaire) et ton tableau de bord avec les KPIs.",
          validation: "ai",
          requires_link: false
        },
        xp_reward: 60,
        duration_minutes: 45,
        sort_order: 30
      }
    ]
  }
];

// --- Upsert du parcours ---
const { data: track, error: trackError } = await supabase
  .from("learning_tracks")
  .upsert(TRACK, { onConflict: "slug" })
  .select("id, slug")
  .single();

if (trackError) {
  console.error("Erreur parcours:", trackError.message);
  process.exit(1);
}

console.log(`Parcours "${TRACK.title}" (${track.slug}) cree/mis a jour.`);

// --- Upsert des modules et lecons ---
for (const mod of MODULES) {
  const { lessons, ...moduleRow } = mod;

  const { data: moduleData, error: modError } = await supabase
    .from("track_modules")
    .upsert(
      { ...moduleRow, track_id: track.id, is_published: true },
      { onConflict: "track_id,slug" }
    )
    .select("id, slug")
    .single();

  if (modError) {
    console.error("Erreur module", mod.slug, ":", modError.message);
    process.exit(1);
  }

  console.log(`Module "${mod.title}" : ${lessons.length} lecons`);

  for (const lesson of lessons) {
    const { error: lesError } = await supabase
      .from("track_lessons")
      .upsert(
        { ...lesson, module_id: moduleData.id, is_published: true },
        { onConflict: "module_id,slug" }
      );

    if (lesError) {
      console.error("Erreur lecon", lesson.slug, ":", lesError.message);
      process.exit(1);
    }
  }

  console.log(`  -> ${lessons.length} lecons upserted.`);
}

console.log("\nParcours Media Buyer cree avec succes : 4 modules, 12 lecons.");

// Note : 3 lecons supplementaires ont ete ajoutees via seed-media-buyer-enrich.mjs
// (Google Shopping Ads, Eviter les blocages, Meta Andromeda) = 15 lecons total.
