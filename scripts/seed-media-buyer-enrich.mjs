// Enrichit le parcours Media Buyer : ajoute Google Shopping Ads,
// gestion des blocages de comptes, Meta Andromeda, et meilleures ressources YouTube.
//
// Usage : node scripts/seed-media-buyer-enrich.mjs
// Idempotent : upsert par slug (modules, lecons). Met a jour les ressources du parcours.
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

// --- Recuperation du parcours ---
const { data: track, error: trackError } = await supabase
  .from("learning_tracks")
  .select("id, slug")
  .eq("slug", "media-buyer")
  .single();

if (trackError) {
  console.error("Erreur: parcours media-buyer introuvable:", trackError.message);
  process.exit(1);
}

console.log(`Parcours "${track.slug}" trouve (id=${track.id}).`);

// --- Mise a jour des ressources du parcours ---
const { error: updateTrackError } = await supabase
  .from("learning_tracks")
  .update({
    resources: [
      "Meta Business Suite", "Google Ads", "TikTok Ads", "Google Analytics", "Pixel", "Claude",
      "Merchant Center", "Google Shopping", "GTM", "Canva",
      "YouTube: Marketing Mania", "YouTube: Theophile Eliet",
      "YouTube: Yann Leonardi", "YouTube: Le Parfait Show",
      "YouTube: FormationsMarketingFR", "YouTube: Ludo Salenne",
      "YouTube: Social Scaling", "YouTube: Web Marketing Tuto"
    ]
  })
  .eq("id", track.id);

if (updateTrackError) {
  console.error("Erreur mise a jour ressources:", updateTrackError.message);
  process.exit(1);
}

console.log("Ressources du parcours mises a jour.");

// --- Recuperation des modules ---
const { data: modules, error: modError } = await supabase
  .from("track_modules")
  .select("id, slug")
  .eq("track_id", track.id);

if (modError) {
  console.error("Erreur chargement modules:", modError.message);
  process.exit(1);
}

const modMap = {};
for (const m of modules) modMap[m.slug] = m.id;

// ============================================
// MODULE 3 - Google Ads et tracking avance
// Ajout : Google Shopping Ads
// ============================================
const module3Id = modMap["google-ads-et-tracking"];
if (!module3Id) {
  console.error("Module google-ads-et-tracking introuvable.");
  process.exit(1);
}

const shoppingLesson = {
  slug: "google-shopping-ads",
  title: "Google Shopping Ads : le feed avant le budget",
  intro: "Google Shopping Ads est le format le plus rentable pour l'e-commerce : l'utilisateur voit l'image, le prix et le nom du produit AVANT de cliquer. Contrairement au Search, tu ne cibles pas des mots-cles : Google lit ton flux produit (feed Merchant Center) pour decider a quelles requetes ton produit correspond. En 2026, la performance Shopping se joue a 70% sur la qualite du feed, pas sur les encheres.",
  why_important: "Un feed bien optimise gagne 40 a 60% d'impressions supplementaires sans changer les encheres (FeedOps 2026). Shopping convertit environ 30% mieux que les annonces texte parce que l'acheteur voit le produit avant de cliquer. Si tu vends des produits physiques ou meme des produits digitaux sur une plateforme catalogue, Google Shopping est le canal le plus direct vers l'acheteur chaud.",
  how_to_use: "Structure ton feed : titre = Marque + Type de produit + Attribut principal + Variante (150 caracteres max). Image : fond blanc, 1500x1500 pixels minimum. Ajoute GTIN (code-barres) pour chaque produit. Cree 2 campagnes : (1) Standard Shopping pour le controle sur tes meilleurs SKU, (2) Performance Max pour le volume. Budget : 10-20 euros/jour pour demarrer. tROAS (ROAS cible) seulement apres 50 conversions/mois. Avant, utilise Maximize Conversions.",
  objectives: [
    "Creer et optimiser un feed produit Merchant Center",
    "Comprendre la difference entre Standard Shopping et Performance Max",
    "Lancer une premiere campagne Shopping rentable"
  ],
  resources: [
    { label: "Le Decodeur Marketing - Google Shopping Ads 2026", url: "https://decodeur-marketing.fr/blog/google-shopping-ads-2026", kind: "doc", why: "Reference complete sur le feed Shopping, les strategies d'encheres et l'architecture hybride.", how: "Lis l'article pour comprendre la logique feed-first et les benchmarks ROAS par secteur." },
    { label: "SteerAds - Google Ads e-commerce playbook 2026", url: "https://steerads.com/fr/blog/google-ads-ecommerce-playbook-2026", kind: "doc", why: "Stack PPC e-commerce complet : remarketing, RLSA, segmentation par marge.", how: "Applique la methode des 6 briques pour structurer ton compte." },
    { label: "Google Merchant Center Help", url: "https://support.google.com/merchants/", kind: "doc", why: "Documentation officielle pour la configuration du feed et le respect des regles.", how: "Configure ton compte Merchant Center et soumets ton feed." },
    { label: "Lionel Z - Structure campagnes Shopping 2026", url: "https://lionelz.com/fr/blog/structure-campagnes-shopping-google-ads-2026/", kind: "doc", why: "Guide pratique sur la structure hybride PMax + Standard Shopping.", how: "Utilise les custom labels pour segmenter tes produits par marge et performance." },
    { label: "Le Parfait Show - Google Shopping et e-commerce", url: "https://www.youtube.com/@LeParfaitShow", kind: "video", why: "Etudes de cas concrets sur des boutiques e-commerce qui scalent avec Google Shopping.", how: "Regarde ses videos sur la structure de campagnes et l'optimisation de feed." },
    { label: "FormationsMarketingFR - Google Ads gratuit", url: "https://www.youtube.com/@FormationsMarketingFR", kind: "video", why: "Tutos pas-a-pas completement gratuits sur Google Ads et Shopping.", how: "Suis son tutoriel de A a Z pour creer ta premiere campagne Shopping." }
  ],
  quiz: [
    { q: "Quel est le premier levier de performance sur Google Shopping ?", choices: ["Les encheres tROAS", "La qualite du feed produit (titres, images, GTIN)", "Le budget journalier"], answer: 1, explanation: "Un feed bien construit peut gagner 40-60% d'impressions sans changer les encheres. Le budget vient apres." },
    { q: "Quelle est la difference fondamentale entre Shopping et Search Ads ?", choices: ["Shopping est moins cher", "Shopping n'utilise pas de mots-cles : Google lit le feed pour matcher les requetes", "Shopping est reserve aux grandes marques"], answer: 1, explanation: "Dans Shopping, c'est ton feed produit qui determine quand tes annonces apparaissent. Pas de mots-cles a choisir." },
    { q: "A partir de combien de conversions/mois le tROAS est-il fiable ?", choices: ["5 conversions", "30-50 conversions par mois", "Des la premiere conversion"], answer: 1, explanation: "Le Smart Bidding a besoin de 30-50 conversions/mois pour calibrer ses encheres. En dessous, utilise Maximize Conversions." },
    { q: "Quelle est la strategie recommandee pour les e-commercants en 2026 ?", choices: ["100% Performance Max", "100% Standard Shopping", "Strategie hybride : PMax pour le volume + Standard Shopping pour le controle"], answer: 2, explanation: "PMax scale le catalogue general, Standard Shopping garde la main sur les SKU a forte marge. Google rapporte 15% de conversions incrementales avec l'approche hybride." }
  ],
  micro_project: {
    title: "Ton feed Merchant Center et ta campagne Shopping",
    brief: "Cree ton compte Merchant Center, prepare ton feed avec 10 produits optimises, et configure une campagne Standard Shopping sans la lancer.",
    steps: [
      "Cree un compte Google Merchant Center",
      "Prepare un feed avec 10 produits : titres optimises (marque + type + attribut), images fond blanc 1500x1500, prix exacts",
      "Ajoute les GTIN ou MPN pour chaque produit si disponibles",
      "Cree une campagne Standard Shopping dans Google Ads avec ces 10 produits, budget 10 euros/jour, sans la lancer"
    ],
    deliverable: "La capture d'ecran de ton feed valide dans Merchant Center et la configuration de ta campagne Shopping.",
    validation: "ai",
    requires_link: false
  },
  xp_reward: 70,
  duration_minutes: 60,
  sort_order: 15
};

const { error: shoppingErr } = await supabase
  .from("track_lessons")
  .upsert({ ...shoppingLesson, module_id: module3Id, is_published: true }, { onConflict: "module_id,slug" });

if (shoppingErr) {
  console.error("Erreur lecon google-shopping-ads:", shoppingErr.message);
} else {
  console.log("Lecon 'Google Shopping Ads' ajoutee/mise a jour.");
}

// ============================================
// MODULE 3 - Ajout : Eviter les blocages de comptes
// ============================================
const blocageLesson = {
  slug: "eviter-blocages-comptes",
  title: "Eviter les blocages de comptes et desapprobations",
  intro: "Rien n'est plus frustrant qu'un compte publicitaire desactive en plein lancement. Meta, Google et TikTok ont des politiques strictes et leurs algorithmes peuvent bloquer un compte pour des raisons parfois obscures. Comprendre POURQUOI les blocages arrivent est le meilleur moyen de les eviter. La plupart des blocages sont evites avec des regles simples.",
  why_important: "Un compte bloque, c'est des jours voire des semaines de perdues. Les recours sont longs et incertains. Pour un media buyer, la continuite des campagnes est critique : chaque jour d'arret, c'est du chiffre d'affaires perdu. Les media buyers professionnels ont des comptes de backup et des processus pour eviter les drapeaux rouges.",
  how_to_use: "Regles d'or Meta : (1) Utilise un profil personnel VRAI (photo, amis, historique) - les profils frais sont les plus bloques; (2) Ajoute une carte bancaire valide et verifie ton identite des que possible; (3) Ne cree pas plusieurs comptes publicitaires - un seul BM (Business Manager) bien configure; (4) Evite les contenus choquants, avant/apres trompeurs, promesses irrealistes; (5) Respecte les regles de ciblage (pas de discrimination, pas de ciblage de mineurs). Google Ads : evite les pages de destination trompeuses, les produits contrefaits, et les promesses financieres sans fondement. TikTok : les regles sont encore plus strictes sur le contenu politique et les produits reglementes.",
  objectives: [
    "Comprendre les causes principales de blocage Meta, Google et TikTok",
    "Mettre en place des pratiques de prevention",
    "Savoir quoi faire en cas de blocage (processus de recours)"
  ],
  resources: [
    { label: "Theophile Eliet - Eviter le blocage Facebook Ads", url: "https://www.youtube.com/@TheophileEliet", kind: "video", why: "Retour d'experience sur les blocages de comptes publicitaires et comment les eviter.", how: "Regarde ses videos sur la securisation des comptes Meta Business Manager." },
    { label: "Social Scaling - Comptes backup et securite", url: "https://www.youtube.com/@SocialScaling", kind: "video", why: "Strategies de backup et regles pour ne jamais perdre un compte.", how: "Cherche ses videos sur la securisation des comptes publicitaires." },
    { label: "Meta - Politiques publicitaires", url: "https://www.facebook.com/policies/ads/", kind: "doc", why: "Le texte officiel des regles publicitaires Meta. A lire absolument avant de lancer.", how: "Lis les sections sur les contenus restricts et interdits pour ta niche." },
    { label: "Google Ads - Politiques", url: "https://support.google.com/adspolicy/", kind: "doc", why: "Les regles Google Ads officielles. Les desapprobations sont souvent liees a la page de destination.", how: "Verifie que ta page de destination respecte les policy Google avant de lancer." },
    { label: "FormationsMarketingFR - Eviter les blocages Google Ads", url: "https://www.youtube.com/@FormationsMarketingFR", kind: "video", why: "Tuto gratuit sur les erreurs de configuration qui causent des blocages.", how: "Suis ses conseils pour preparer ton compte Google Ads avant le lancement." },
    { label: "Centre d'aide Meta - Desapprobations", url: "https://www.facebook.com/business/help/251786009299856", kind: "doc", why: "Comment faire appel d'une decision de desapprobation ou de blocage.", how: "Lis la procedure de recours et prepare les justificatifs necessaires." }
  ],
  quiz: [
    { q: "Quelle est la cause N.1 de blocage d'un compte Meta Ads ?", choices: ["Budget trop faible", "Profil personnel frais ou fake + contenu trompeur / promesses irrealistes", "Trop d'annonces"], answer: 1, explanation: "Un profil sans historique et des promesses 'gagnez 10 000 euros par jour' sont les premiers drapeaux rouges de Meta." },
    { q: "Combien de Business Managers faut-il avoir idealement ?", choices: ["Un seul, bien configure avec verifications", "Au moins 3 de backup", "Autant que possible"], answer: 0, explanation: "Un seul BM bien configure et verifie est plus sur que plusieurs BM suspects. Garde des acces admin a des collaborateurs de confiance." },
    { q: "Que faire si ton compte est bloque par erreur ?", choices: ["Creer un nouveau compte immediatement", "Suivre la procedure de recours officielle avec des justificatifs", "Attendre que ca se debloque tout seul"], answer: 1, explanation: "Le recours officiel est la seule voie. Creer un nouveau compte apres un blocage aggrave la situation." },
    { q: "Quel type de contenu est le plus a risque sur Google Ads ?", choices: ["Les annonces textuelles", "Les pages de destination trompeuses ou les produits contrefaits", "Les annonces display"], answer: 1, explanation: "Google sanctionne severement les pages de destination qui ne correspondent pas a l'annonce ou qui trompent l'utilisateur." }
  ],
  micro_project: {
    title: "Ton audit de conformite et ton plan de backup",
    brief: "Audite tes comptes publicitaires actuels et prepare un plan pour eviter les blocages.",
    steps: [
      "Verifie que ton profil personnel Facebook est authentique (photo, amis, historique, pas de faux nom)",
      "Configure les verifications de ton Business Manager (identite, entreprise, paiement)",
      "Lis les politiques publicitaires Meta pour ta niche et note les regles qui s'appliquent a ton produit",
      "Cree un document 'Plan de continuite' : marche a suivre si un compte est bloque (backup, recours, delais)"
    ],
    deliverable: "Ton plan de continuite ecrit avec les etapes precises en cas de blocage, et la confirmation que ton BM est verifie.",
    validation: "ai",
    requires_link: false
  },
  xp_reward: 55,
  duration_minutes: 45,
  sort_order: 25
};

const { error: blocageErr } = await supabase
  .from("track_lessons")
  .upsert({ ...blocageLesson, module_id: module3Id, is_published: true }, { onConflict: "module_id,slug" });

if (blocageErr) {
  console.error("Erreur lecon eviter-blocages-comptes:", blocageErr.message);
} else {
  console.log("Lecon 'Eviter les blocages de comptes' ajoutee/mise a jour.");
}

// ============================================
// MODULE 4 - Scaling et optimisation avancee
// Ajout : Meta Andromeda
// ============================================
const module4Id = modMap["scaling-et-optimisation"];
if (!module4Id) {
  console.error("Module scaling-et-optimisation introuvable.");
  process.exit(1);
}

const andromedaLesson = {
  slug: "meta-andromeda",
  title: "Meta Andromeda : l'IA qui transforme le media buying",
  intro: "Meta Andromeda est le nouveau moteur de retrieval (recuperation) de Meta, deploye depuis fin 2024. Ce n'est pas un type de campagne ni un bouton dans Ads Manager : c'est l'infrastructure qui decide quelles annonces sont ELIGIBLES pour etre montrees a chaque utilisateur. Avant Andromeda, le ciblage etait base sur des segments d'audience fixes. Maintenant, Andromeda lit le contenu de tes creatives (image, video, texte) et les fait correspondre aux utilisateurs de facon dynamique. Ta creative EST devenue ton ciblage.",
  why_important: "Andromeda a change les regles du jeu. Les audiences manuelles (interet, demographie) ont beaucoup moins d'impact qu'avant. Ce qui compte maintenant : (1) la diversite de tes creatives - Andromeda a besoin d'au moins 15-20 concepts distincts par ad set pour bien matcher; (2) la qualite de tes signaux de conversion - Pixel + CAPI avec deduplication; (3) la simplification de la structure de campagne - CBO, Advantage+ placements, audiences larges. Les media buyers qui ne s'adaptent pas voient leurs CPA grimper et leur ROAS baisser.",
  how_to_use: "Strategie Andromeda en 2026 : (1) Passe de 3-6 ads par ad set a 15-20+ concepts distincts (pas des variations de couleur : de VRAIS angles differents); (2) Utilise Advantage+ Shopping Campaigns pour le scaling, Advantage+ Creative pour les tests automatiques; (3) Installe le Conversions API (CAPI) avec deduplication - c'est indispensable maintenant; (4) Supprime les audiences trop etroites - laisse Andromeda trouver les acheteurs a partir de tes creatives; (5) Teste 5-10 nouvelles creatives par semaine, coupe les underperformers apres 1000 impressions; (6) Garde 20-30% de budget sur des campagnes manuelles pour le controle de la qualite des placements (Hawke Media rapporte que les campagnes 100% Advantage+ derivent vers des placements bas de gamme).",
  objectives: [
    "Comprendre le fonctionnement de Meta Andromeda (retrieval engine)",
    "Adapter sa strategie creative a Andromeda : diversite, volume, concepts distincts",
    "Mettre en place les signaux techniques (Pixel, CAPI, deduplication) optimises pour Andromeda"
  ],
  resources: [
    { label: "AdBid - Meta Andromeda Complete Guide 2026", url: "https://adbid.me/blog/meta-andromeda-guide-2026", kind: "doc", why: "Guide complet sur Andromeda : comment ca marche, les strategies d'optimisation, les 4 etapes du processus.", how: "Lis les sections sur le fonctionnement et l'optimisation des campagnes pour Andromeda." },
    { label: "Matheus Vizotto - Meta AI Reality Check 2026", url: "https://matheusvizotto.com/blog/meta-ai-ad-creation-andromeda-reality-check-2026", kind: "doc", why: "Analyse critique : ce que Meta dit vs ce que les agences constatent reellement. Resultats mitiges.", how: "Lis pour comprendre les limites d'Andromeda et quand garder le controle manuel." },
    { label: "Servo - Creative Is Your Targeting (Andromeda)", url: "https://servoad.com/blog/meta-andromeda-creative-is-targeting-2026", kind: "doc", why: "Framework complet pour la production creative a l'ere d'Andromeda : matrice de diversite, 50/20/30 split.", how: "Applique le modele de diversite creative pour structurer ta production." },
    { label: "Social Scaling (J7 Media) - Tests Andromeda", url: "https://www.youtube.com/@SocialScaling", kind: "video", why: "Chaine 100% Facebook Ads qui teste les strategies Andromeda en conditions reelles avec des budgets consequents.", how: "Regarde ses videos sur les tests de campagnes, la video segmentee et le cost cap." },
    { label: "Marketing Mania - Analyse campagnes Meta", url: "https://www.youtube.com/@MarketingMania", kind: "video", why: "Decryptage de pourquoi certaines pubs marchent et d'autres non dans l'ere Andromeda.", how: "Regarde ses analyses de campagnes pour comprendre comment Andromeda selectionne les gagnantes." },
    { label: "Space Ads Agency - Andromeda Guide", url: "https://www.spaceads.agency/blog/meta-andromeda-what-it-is-and-how-to-adapt-your-meta-ads-in-2026", kind: "doc", why: "Guide pratique 2026 d'une agence qui gere des budgets reels : comprendre GEM, Adaptive Ranking, et le stack technique.", how: "Lis la section sur les prerequis techniques (Pixel, CAPI, GA4) avant de changer ta strategie." },
    { label: "Meta Engineering - Andromeda (Dec 2024)", url: "https://engineering.fb.com/", kind: "doc", why: "L'article fondateur de l'equipe engineering Meta : architecture deep neural network, NVIDIA Grace Hopper.", how: "Lis pour comprendre le cadre technique (optionnel mais puissant pour la credibilite)." }
  ],
  quiz: [
    { q: "Qu'est-ce que Meta Andromeda ?", choices: ["Un nouveau type de campagne dans Ads Manager", "Le moteur de retrieval (recuperation) qui filtre les annonces eligibles AVANT l'enchere", "Un outil de creation de contenu"], answer: 1, explanation: "Andromeda est l'infrastructure qui decide quelles annonces sont candidates pour etre montrees. Il n'y a pas de bouton 'activer Andromeda'." },
    { q: "Combien de concepts de creatives distincts recommande-t-on par ad set sous Andromeda ?", choices: ["3-6 comme avant", "15-20 concepts distincts, pas des variations de couleur", "1 seul tres bon"], answer: 1, explanation: "Andromeda matche chaque creative a un type d'utilisateur different. Plus ta bibliotheque de concepts est diverse, meilleur est le matching. 15-20+ est le standard 2026." },
    { q: "Quel est le risque principal des campagnes 100% Advantage+ ?", choices: ["Aucun, c'est recommande", "Les placements derivent vers des inventaires bas de gamme sans controle manuel", "C'est plus cher"], answer: 1, explanation: "Selon Hawke Media et d'autres agences, les campagnes Advantage+ sans supervision peuvent diffuser sur des placements de qualite inferieure. Garde un oeil et des campagnes de controle." },
    { q: "Quel outil technique est devenu INDISPENSABLE sous Andromeda ?", choices: ["Le Pixel seul suffit", "Le Conversions API (CAPI) avec deduplication Pixel + serveur", "Google Analytics"], answer: 1, explanation: "Andromeda a besoin de signaux de qualite. Le Pixel seul perd des evenements a cause des bloqueurs de pub et des restrictions iOS. CAPI + Pixel + deduplication = signal fiable." }
  ],
  micro_project: {
    title: "Ton audit Andromeda et ta nouvelle strategie creative",
    brief: "Audite ton setup technique (Pixel, CAPI, deduplication), puis cree 15 concepts de creatives distincts pour un produit.",
    steps: [
      "Audite ton installation : Pixel installe ? CAPI configure ? Deduplication avec event_id en place ? Event Match Quality > 7/10 ?",
      "Liste 15 angles marketing distincts pour TON produit (promesse directe, temoignage, curiosite, urgence, comparaison, avant/apres, demonstration, FAQ, etc.)",
      "Pour chaque angle, note le concept creative : accroche, visuel propose, appel a l'action",
      "Structure ta production avec la methode 50/20/30 : 50% derives des winners, 20% angles adjacents, 30% hypotheses audacieuses"
    ],
    deliverable: "Ton audit technique (Pixel/CAPI/Event Match Quality) et ta matrice de 15 concepts distincts avec la repartition 50/20/30.",
    validation: "ai",
    requires_link: false
  },
  xp_reward: 75,
  duration_minutes: 65,
  sort_order: 25
};

const { error: andromedaErr } = await supabase
  .from("track_lessons")
  .upsert({ ...andromedaLesson, module_id: module4Id, is_published: true }, { onConflict: "module_id,slug" });

if (andromedaErr) {
  console.error("Erreur lecon meta-andromeda:", andromedaErr.message);
} else {
  console.log("Lecon 'Meta Andromeda' ajoutee/mise a jour.");
}

console.log("\nEnrichissement termine : 3 lecons ajoutees (Google Shopping, Blocages, Andromeda) + ressources mises a jour.");
