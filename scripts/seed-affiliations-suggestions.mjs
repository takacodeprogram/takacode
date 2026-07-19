// Seed d'entrees d'affiliation SUGGEREES, creees DEPUBLIEES :
// l'admin remplace l'URL officielle par SON lien affilie puis publie.
// Idempotent : upsert par (provider, title). Usage : node scripts/seed-affiliations-suggestions.mjs
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
function loadEnv(f){try{for(const l of readFileSync(f,"utf8").split(/\r?\n/)){const m=l.match(/^([A-Z0-9_]+)=(.*)$/);if(m&&!process.env[m[1]])process.env[m[1]]=m[2].trim().replace(/^"|"$/g,"");}}catch{}}
loadEnv(".env.local");loadEnv(".env");
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const NOTE = " [Suggestion : remplace cette URL officielle par TON lien affilie puis publie.]";
const LINKS = [
  { provider: "Hostinger", category: "hebergement", title: "Hostinger VPS", description: "VPS pour heberger n8n, chatbots et bots 24h/24 (modeles preconfigures)." + NOTE, url: "https://www.hostinger.com/vps", track_slug: "automatisation-ia", sort_order: 10 },
  { provider: "Hostinger", category: "hebergement", title: "Hostinger VPS pour bots de trading", description: "Le meme VPS, pour faire tourner un bot de trading en continu avec surveillance." + NOTE, url: "https://www.hostinger.com/vps", track_slug: "bot-trading-ia", sort_order: 11 },
  { provider: "Hostinger", category: "hebergement", title: "Hostinger Hebergement WordPress", description: "Hebergement WordPress optimise pour sites vitrines et blogs." + NOTE, url: "https://www.hostinger.com/wordpress-hosting", track_slug: "", sort_order: 12 },
  { provider: "Hostinger", category: "hebergement", title: "Hostinger Hebergement Web", description: "Hebergement web mutualise pour les premiers sites." + NOTE, url: "https://www.hostinger.com/web-hosting", track_slug: "bases-internet", sort_order: 13 },
  { provider: "Hostinger", category: "hebergement", title: "Hostinger Cloud / Node.js", description: "Pour les applications Node.js et projets qui depassent le mutualise." + NOTE, url: "https://www.hostinger.com/cloud-hosting", track_slug: "dev-web-assiste-ia", sort_order: 14 },
  { provider: "Vercel", category: "deploiement", title: "Vercel", description: "Deploiement des projets Next.js du parcours dev web (pas de programme d'affiliation public connu : lien direct)." + NOTE, url: "https://vercel.com/", track_slug: "dev-web-assiste-ia", sort_order: 20 },
  { provider: "systeme.io", category: "outil", title: "systeme.io", description: "Tunnel de vente, formations et emails — programme d'affiliation disponible." + NOTE, url: "https://systeme.io/", track_slug: "produits-digitaux", sort_order: 30 },
  { provider: "Chariow", category: "outil", title: "Chariow", description: "Boutique de produits digitaux avec paiements mobile money (marche africain)." + NOTE, url: "https://chariow.com/", track_slug: "produits-digitaux", sort_order: 31 },
  { provider: "ElevenLabs", category: "ia", title: "ElevenLabs", description: "Voix off IA pour chaines faceless — programme d'affiliation disponible." + NOTE, url: "https://elevenlabs.io/", track_slug: "creation-contenu-ia", sort_order: 40 },
  { provider: "TradingView", category: "outil", title: "TradingView", description: "Graphiques, Pine Script et alertes — programme de parrainage disponible." + NOTE, url: "https://www.tradingview.com/", track_slug: "bot-trading-ia", sort_order: 41 }
];

for (const link of LINKS) {
  const { error } = await sb.from("affiliate_links").upsert({ ...link, is_published: false }, { onConflict: "provider,title" });
  console.log(`${error ? "ERREUR" : "OK"} ${link.provider} — ${link.title}${error ? " : " + error.message : ""}`);
}
console.log("\nEntrees creees DEPUBLIEES : remplace les URLs par tes liens affilies dans /admin/affiliations puis publie.");
