// Seed les liens d'affiliation pour les plateformes utilisees dans les parcours
// Idempotent : upsert par provider + title
// Usage: node scripts/seed-affiliate-links-parcours.mjs

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "http://localhost:54321",
  process.env.SUPABASE_SERVICE_ROLE_KEY || ""
);

const AFFILIATES = [
  // --- Media Buyer ---
  {
    provider: "Meta Business Suite",
    category: "outil",
    title: "Meta Business Suite",
    description: "Gerer tes campagnes Facebook et Instagram Ads, suivre les performances et optimiser tes audiences.",
    url: "https://business.facebook.com",
    logo_url: "",
    sort_order: 10,
    track_slug: "media-buyer"
  },
  {
    provider: "Google Ads",
    category: "outil",
    title: "Google Ads",
    description: "Creer et gerer des campagnes search, display et shopping sur le plus grand moteur de recherche.",
    url: "https://ads.google.com",
    logo_url: "",
    sort_order: 20,
    track_slug: "media-buyer"
  },
  {
    provider: "TikTok Ads",
    category: "outil",
    title: "TikTok Ads",
    description: "Lancer des campagnes publicitaires sur TikTok pour toucher une audience engagee.",
    url: "https://ads.tiktok.com",
    logo_url: "",
    sort_order: 30,
    track_slug: "media-buyer"
  },
  {
    provider: "Canva",
    category: "outil",
    title: "Canva Pro",
    description: "Creer des visuels pub, bannieres et creas sans competences en design.",
    url: "https://www.canva.com",
    logo_url: "",
    sort_order: 40,
    track_slug: "media-buyer"
  },
  {
    provider: "Google Analytics",
    category: "outil",
    title: "Google Analytics 4",
    description: "Analyser le trafic, les conversions et le comportement des visiteurs sur ton site.",
    url: "https://analytics.google.com",
    logo_url: "",
    sort_order: 50,
    track_slug: "media-buyer"
  },
  {
    provider: "Google Merchant Center",
    category: "outil",
    title: "Google Merchant Center",
    description: "Soumettre ton catalogue produits pour les campagnes Google Shopping.",
    url: "https://merchants.google.com",
    logo_url: "",
    sort_order: 60,
    track_slug: "media-buyer"
  },
  {
    provider: "Google Tag Manager",
    category: "outil",
    title: "Google Tag Manager",
    description: "Gerer tes tags et pixels de tracking sans toucher au code du site.",
    url: "https://tagmanager.google.com",
    logo_url: "",
    sort_order: 70,
    track_slug: "media-buyer"
  },
  {
    provider: "Claude",
    category: "ia",
    title: "Claude (Anthropic)",
    description: "Assistant IA pour t'aider a rediger tes copy, creas et strategies publicitaires.",
    url: "https://claude.ai",
    logo_url: "",
    sort_order: 80,
    track_slug: "media-buyer"
  },
  {
    provider: "Pixel",
    category: "outil",
    title: "Meta Pixel",
    description: "Installer et configurer le pixel Meta pour tracker les conversions et optimiser tes campagnes.",
    url: "https://www.facebook.com/business/help/952192354298755",
    logo_url: "",
    sort_order: 90,
    track_slug: "media-buyer"
  },
  // --- Produits Digitaux ---
  {
    provider: "Chariow",
    category: "outil",
    title: "Chariow",
    description: "Plateforme tout-en-un pour creer et vendre tes produits digitaux : formations, ebooks, templates.",
    url: "https://chariow.com",
    logo_url: "",
    sort_order: 10,
    track_slug: "produits-digitaux"
  },
  {
    provider: "systeme.io",
    category: "outil",
    title: "systeme.io",
    description: "Plateforme marketing tout-en-un : email, tunnel de vente, boutique, blog, affiliation.",
    url: "https://systeme.io",
    logo_url: "",
    sort_order: 20,
    track_slug: "produits-digitaux"
  },
  {
    provider: "Gumroad",
    category: "outil",
    title: "Gumroad",
    description: "Plateforme de vente de produits digitaux simple et rapide : ebooks, templates, logiciels.",
    url: "https://gumroad.com",
    logo_url: "",
    sort_order: 30,
    track_slug: "produits-digitaux"
  },
  {
    provider: "Canva",
    category: "outil",
    title: "Canva Pro",
    description: "Creer les visuels de ton produit digital : couvertures, templates, presentations.",
    url: "https://www.canva.com",
    logo_url: "",
    sort_order: 40,
    track_slug: "produits-digitaux"
  },
  {
    provider: "Maketou",
    category: "outil",
    title: "Maketou",
    description: "Catalogue de templates Notion, Canva et outils pour creanciers de produits digitaux.",
    url: "https://maketou.com",
    logo_url: "",
    sort_order: 50,
    track_slug: "produits-digitaux"
  },
  {
    provider: "Stripe",
    category: "backend",
    title: "Stripe",
    description: "Solution de paiement en ligne pour accepter les reglements de tes produits digitaux.",
    url: "https://stripe.com",
    logo_url: "",
    sort_order: 60,
    track_slug: "produits-digitaux"
  },
  {
    provider: "Lemon Squeezy",
    category: "outil",
    title: "Lemon Squeezy",
    description: "Alternative a Gumroad pour vendre des produits digitaux avec paiements integres.",
    url: "https://lemonsqueezy.com",
    logo_url: "",
    sort_order: 70,
    track_slug: "produits-digitaux"
  },
  {
    provider: "CapCut",
    category: "outil",
    title: "CapCut",
    description: "Editeur video gratuit et puissant pour creer du contenu promotionnel pour tes produits.",
    url: "https://capcut.com",
    logo_url: "",
    sort_order: 80,
    track_slug: "produits-digitaux"
  },
  {
    provider: "Claude",
    category: "ia",
    title: "Claude (Anthropic)",
    description: "Assistant IA pour t'aider a rediger les pages de vente, emails et contenu de tes produits.",
    url: "https://claude.ai",
    logo_url: "",
    sort_order: 90,
    track_slug: "produits-digitaux"
  }
];

async function main() {
  console.log(`Seeding ${AFFILIATES.length} affiliate links...`);

  for (const aff of AFFILIATES) {
    const { error } = await supabase.from("affiliate_links").upsert(
      {
        provider: aff.provider,
        category: aff.category,
        title: aff.title,
        description: aff.description,
        url: aff.url,
        logo_url: aff.logo_url,
        sort_order: aff.sort_order,
        track_slug: aff.track_slug
      },
      { onConflict: "provider,title", ignoreDuplicates: false }
    );

    if (error) {
      console.error(`  Error upserting ${aff.provider}: ${error.message}`);
    } else {
      console.log(`  OK ${aff.provider} (${aff.track_slug})`);
    }
  }

  console.log("Done!");
  process.exit(0);
}

main();
