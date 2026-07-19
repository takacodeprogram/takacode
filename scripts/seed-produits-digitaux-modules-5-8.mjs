// Ajoute les modules 5 a 8 au parcours "Produits digitaux : creer et vendre".
// Met a jour la duree, les ressources et les prochaines etapes.
//
// Usage : node scripts/seed-produits-digitaux-modules-5-8.mjs
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

// --- Mise a jour du parcours ---
// On passe de 4 a 8 semaines, on ajoute les ressources et les etapes.
const { error: trackError } = await supabase
  .from("learning_tracks")
  .update({
    duration_weeks: 8,
    resources: ["Chariow", "systeme.io", "Gumroad", "Canva", "Maketou", "Stripe", "Claude", "CapCut"],
    next_steps: [
      { label: "Choisir son produit", state: "done" },
      { label: "Creer avec l'IA", state: "done" },
      { label: "Construire sa boutique", state: "done" },
      { label: "Lancer et encaisser", state: "done" },
      { label: "Vente et copywriting", state: "current" },
      { label: "Contenu qui vend", state: "locked" },
      { label: "Publicite payante", state: "locked" },
      { label: "Constance et passage a l'echelle", state: "locked" }
    ]
  })
  .eq("slug", "produits-digitaux");

if (trackError) {
  console.error("Erreur mise a jour parcours:", trackError.message);
  process.exit(1);
}
console.log("Parcours mis a jour (8 semaines, ressources, etapes).");

// --- Recuperation de l'ID du parcours ---
const { data: track, error: getError } = await supabase
  .from("learning_tracks")
  .select("id, slug")
  .eq("slug", "produits-digitaux")
  .single();

if (getError) {
  console.error("Erreur recuperation parcours:", getError.message);
  process.exit(1);
}

// --- Nouveaux modules ---
const MODULES = [
  // =====================================================
  // MODULE 5 - Vente et copywriting (Hormozi method)
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
        how_to_use: "Structure PAS (Probleme-Agiter-Solution) : (1) decris le probleme dans les mots de ta cible; (2) aggrave-le en montrant le cout de ne rien faire; (3) presente ta solution comme l'evidence. Chaque phrase supprime une objection. Lis a voix haute : si ca sonne faux, reecris. Utilise l'IA pour generer 10 variantes de titres, mais choisis avec TON oreille.",
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
          { label: "Olivier Roland - marketing par email", url: "https://www.youtube.com/@OlivierRoland", kind: "video", why: "Des vidéos completes sur comment construire et monetiser une liste email.", how: "Regarde ses vidéos sur l'email marketing et la newsletter." },
          { label: "Mlle Affiliation (Nina Habault) - email et affiliation", url: "https://www.youtube.com/@MlleWebmarketing", kind: "video", why: "Conseils pratiques sur l'email marketing et l'affiliation pour debutants.", how: "Cherche ses vidéos sur la creation de sequences d'emails." }
        ],
        quiz: [
          { q: "Pourquoi l'email surpasse-t-il les reseaux sociaux en conversion ?", choices: ["Parce que c'est plus beau", "Parce que tu parles a des gens qui ont choisi de te lire, dans leur boite personnelle", "Parce que c'est gratuit"], answer: 1, explanation: "Un abonne email est un prospect chaud : il a donne son adresse, il t'accorde son attention. C'est un signal fort." },
          { q: "Quel est le bon ratio contenu/promo dans une newsletter ?", choices: ["50/50", "80% valeur, 20% promotion", "100% promo"], answer: 1, explanation: "Meme ratio que le contenu public : la valeur construit la confiance, la promo recoite." },
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
        how_to_use: "Les 3 prerequisites avant toute pub : (1) taux de conversion organique d'au moins 3% (verifie avec tes stats actuelles); (2) un produit qui a deja fait au moins 5 ventes organiques; (3) un budget que tu peux perdre integralement sans mettre en danger ton activite. Commence avec un budget test de 50-100 euros, pas plus.",
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
          { q: "Pourquoi l'apprentissage fait-il partie de la routine ?", choices: ["Pour perdre du temps", "Pour rester competitif et identifier de nouvelles opportunites", "Parce que c'est obligatoire"], answer: 1, explanation: "Le marche digital evolue vite. Ceux qui n'apprennent pas sont depasses par ceux qui le font." }
        ],
        micro_project: {
          title: "Ton planning des 4 prochaines semaines",
          brief: "Cree ton calendrier de travail avec tes 3 routines hebdomadaires et planifie 4 semaines.",
          steps: [
            "Fixe tes 3 blocs horaires hebdomadaires (creation, vente, apprentissage)",
            "Pour chaque bloc, decide ce que tu vas produire pendant 4 semaines",
            "Note les jours et heures dans ton agenda",
            "Prevois 1 jour dans le mois pour faire le point et ajuster"
          ],
          deliverable: "Ton calendrier des 4 semaines : jours, heures, activites prevues pour chaque bloc.",
          validation: "ai",
          requires_link: false
        },
        xp_reward: 60,
        duration_minutes: 50,
        sort_order: 10
      },
      {
        slug: "automatisation-et-delegation",
        title: "Automatisation et delegation pour scale:",
        intro: "Quand les ventes arrivent regulierement, le piege est de tout faire soi-meme. L'automatisation et la delegation sont les seuls moyens de passer de 1 000 a 10 000 euros sans devenir esclave de ton business. Systeme.io, n8n, et les assistants IA permettent d'automatiser 80% des taches recurrentes.",
        why_important: "Le modele de revenu 'produit digital' promet la liberte. Mais sans automatisation, tu passes ton temps en support client, factures, creations de contenu repetitives. Les gros vendeurs comme Hormozi ou Botoyiye ont scale: parce qu'ils ont systematise chaque etape : vente, livraison, suivi, support.",
        how_to_use: "Identifie tes 5 taches les plus recurrentes et automatise-les une par une : (1) livraison du produit apres achat (automatique sur Systeme.io / Gumroad); (2) email de bienvenue + sequence (automation); (3) facturation et TVA (plateforme s'en charge); (4) reponses aux questions frequentes (FAQ + chatbot simple); (5) publication de contenu (planification hebdomadaire). Quand une tache revient plus de 2h par semaine, cherche a l'automatiser ou la deleguer.",
        objectives: [
          "Identifier tes 5 taches recurrentes et les automatiser",
          "Mettre en place des systemes de livraison et suivi automatises",
          "Comprendre quand et comment deleguer"
        ],
        resources: [
          { label: "Ludo Salenne - automatisation marketing", url: "https://www.youtube.com/@LudovicSalenne", kind: "video", why: "Strategies d'automatisation pour les entrepreneurs et createurs.", how: "Regarde ses videos sur l'automatisation des processus marketing." },
          { label: "Systeme.io - automatisations integrees", url: "https://systeme.io/", kind: "tool", why: "La plateforme gere livraison, emails, facturation automatiquement.", how: "Configure toutes les automatisations disponibles sur ta plateforme." },
          { label: "n8n (automatisation avancee)", url: "https://n8n.io/", kind: "tool", why: "Outil d'automatisation no-code : relie tes applis sans coder.", how: "Explore les templates d'automatisation pour vente et marketing." },
          { label: "Claude (assistant IA de support)", url: "https://claude.ai/", kind: "tool", why: "Repondre aux questions recurrentes des clients avec un prompt bien structure.", how: "Cree un prompt avec ta FAQ et utilise-le pour repondre plus vite." }
        ],
        quiz: [
          { q: "Quand faut-il automatiser une tache ?", choices: ["Jamais, tout faire soi-meme", "Quand elle revient plus de 2h par semaine", "Seulement quand on a 100 ventes/mois"], answer: 1, explanation: "2h par semaine, c'est 8h par mois. Automatiser libere du temps pour la creation et la croissance." },
          { q: "Que peut automatiser Systeme.io des le depart ?", choices: ["Rien, tout est manuel", "Livraison du produit, sequence d'emails, facturation", "Seulement les paiements"], answer: 1, explanation: "C'est l'avantage des plateformes tout-en-un : vente, livraison, suivi et facturation sont automatises." },
          { q: "Quand commencer a deleguer ?", choices: ["Des le debut", "Quand le revenu du produit depasse 3x le cout de delegation", "Jamais, il faut tout controler"], answer: 1, explanation: "La delegation est un investissement. Quand elle libere plus de temps qu'elle ne coute, c'est rentable." },
          { q: "Quel est l'ordre logique ?", choices: ["Deleguer d'abord, automatiser ensuite", "Automatiser d'abord ce qui peut l'etre, deleguer ensuite le reste", "Tout deleguer a une agence"], answer: 1, explanation: "Automatise ce qui est standardisable (livraison, emails, factures). Delegue ce qui demande un humain (design, montage video)." }
        ],
        micro_project: {
          title: "Ta feuille de route d'automatisation",
          brief: "Identifie tes 5 taches recurrentes et planifie comment les automatiser ou deleguer.",
          steps: [
            "Liste tes 5 taches les plus recurrentes liees a ton produit",
            "Pour chacune, determine si elle peut etre automatisee (outil), deleguee (personne), ou simplifiee (processus)",
            "Automatise la livraison sur ta plateforme de vente si ce n'est pas fait",
            "Configure un prompt IA pour les reponses support recurrentes"
          ],
          deliverable: "Ta liste de 5 taches avec pour chacune la solution (automatisation, delegation, simplification) et les outils identifies.",
          validation: "ai",
          requires_link: false
        },
        xp_reward: 65,
        duration_minutes: 55,
        sort_order: 20
      },
      {
        slug: "de-1-produit-a-une-gamme",
        title: "De 1 produit a une gamme qui dure",
        intro: "Les createurs de produits digitaux qui vivent de leur activite ont tous une gamme, pas un one-shot. Un premier produit valide la demande et t'apprend a vendre. Le deuxieme et le troisieme transforment l'essai en business. La gamme, c'est comment tu passes de 100 a 100 000 euros.",
        why_important: "Un seul produit a une duree de vie limitee. Une gamme cree des ventes croisees : les acheteurs du produit A acheteur aussi le produit B. C'est le modele d'Hormozi (offers, leads, models), de Botoyiye (formations, templates, Maketou), des top-sellers. Chaque nouveau produit augmente la valeur de TOUS les autres.",
        how_to_use: "Logique de gamme en entonnoir : (1) Produit d'appel a 5-15 euros (ebook, template simple) qui attire et construit la confiance; (2) Produit coeur a 29-97 euros (formation complete, bundle) pour la majorite des acheteurs; (3) Produit premium a 197-497 euros (coaching, programme avance) pour les clients engages. Chaque etape est un upsell naturel. Construis la gamme dans l'ordre, pas tout en meme temps. Premiere etape : le produit d'appel.",
        objectives: [
          "Concevoir une gamme de 3 produits (appel, coeur, premium)",
          "Comprendre la logique d'entonnoir et de vente croisee",
          "Planifier le developpement de ton deuxieme produit"
        ],
        resources: [
          { label: "Alex Hormozi - 100M Models (gamme et scaling)", url: "https://www.acquisition.com/models", kind: "doc", why: "Le troisieme livre d'Hormozi sur la construction d'un business scalable avec une gamme.", how: "Lis les chapitres sur la structure de gamme et l'entonnoir de produits." },
          { label: "Alex Hormozi - The Best Products To Sell (YouTube)", url: "https://www.youtube.com/watch?v=q2ax7q7cYDQ", kind: "video", why: "Hormozi explique pourquoi certains produits marchent mieux que d'autres pour scale:.",
          how: "Regarde la video et applique sa logique a ta gamme." },
          { label: "Cas Maketou (Wilson Botoyiye) - de 0 a 40 000 boutiques", url: "https://astucesdespro.com/maketou-la-plateforme-tout-en-un-pour-vendre-et-monetiser-vos-produits-digitaux/", kind: "article", why: "Comment Botoyiye a construit une plateforme qui sert des milliers de createurs.", how: "Lis et note comment il a scale: de sa propre vente a une plateforme multi-createurs." },
          { label: "Gumroad - les top-sellers et leurs gammes", url: "https://gumroad.com/discover", kind: "tool", why: "Observe les vendeurs qui reussissent : ils ont presque tous plusieurs produits.", how: "Trouve 3 top-sellers et analyse leur gamme (produit d'appel, coeur, premium)." }
        ],
        quiz: [
          { q: "Quels sont les 3 niveaux d'une gamme de produits digitaux ?", choices: ["Gratuit, payant, cher", "Produit d'appel (5-15), produit coeur (29-97), produit premium (197-497)", "Ebook, video, template"], answer: 1, explanation: "Chaque niveau cible un segment different et mene naturellement au suivant." },
          { q: "Pourquoi une gamme est-elle plus solide qu'un one-shot ?", choices: ["Parce que c'est plus beau", "Les ventes croisees augmentent la valeur client totale et la duree de vie du business", "Parce que c'est plus facile a gerer"], answer: 1, explanation: "Un client qui aime ton produit d'appel est un client chaud pour le produit coeur. La gamme multiplie la valeur de chaque client." },
          { q: "Quel produit construire en premier ?", choices: ["Le produit premium le plus cher", "Le produit d'appel : petit prix, valeur rapide, zero friction", "Les trois en meme temps"], answer: 1, explanation: "Le produit d'appel te permet d'acquérir des clients facilement et de construire une relation de confiance." },
          { q: "Quand ajouter un deuxieme produit ?", choices: ["Quand le premier fait au moins 10 ventes par mois", "Des le debut en meme temps", "Apres 3 ans"], answer: 0, explanation: "10 ventes/mois = demande validee et premiers revenus. C'est le bon moment pour reinvestir dans un deuxieme produit." }
        ],
        micro_project: {
          title: "Ta gamme de 3 produits dessinee",
          brief: "Concois ta gamme complete et planifie le developpement de ton deuxieme produit.",
          steps: [
            "Definis ton produit d'appel (5-15 euros) : quel probleme simple resout-il ?",
            "Definis ton produit coeur (29-97 euros) : la formation ou le bundle principal",
            "Definis ton produit premium (197-497 euros) : coaching, programme avance",
            "Planifie : quelle est la prochaine etape APRES ce parcours ?"
          ],
          deliverable: "Ta gamme complete (3 produits avec nom, prix, promesse) et la prochaine etape concerte pour le produit suivant.",
          validation: "ai",
          requires_link: false
        },
        xp_reward: 75,
        duration_minutes: 60,
        sort_order: 30
      }
    ]
  }
];

// --- Upsert des modules et lecons ---
const TRACK_ID = track.id;

for (const mod of MODULES) {
  const { lessons, ...moduleRow } = mod;

  const { data: moduleData, error: modError } = await supabase
    .from("track_modules")
    .upsert(
      { ...moduleRow, track_id: TRACK_ID, is_published: true },
      { onConflict: "track_id,slug" }
    )
    .select("id, slug")
    .single();

  if (modError) {
    console.error("Erreur module", mod.slug, ":", modError.message);
    process.exit(1);
  }

  console.log(`Module "${mod.title}" (${mod.slug}) : ${lessons.length} lecons`);

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

console.log("\nModules 5 a 8 ajoutes avec succes !");
console.log("Le parcours fait maintenant 8 modules, 24 lecons (12 originales + 12 nouvelles).");
