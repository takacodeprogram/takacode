export interface StarterTemplate {
  id: string;
  domain: string;
  title: string;
  summary: string;
  icon: string;
  accent: string;
  level: string;
  objective: string;
  starterRepoUrl: string;
  deployUrl: string;
  features: string[];
  stack: string[];
}

export const STARTER_TEMPLATES: StarterTemplate[] = [
  {
    id: "site-vitrine",
    domain: "Web",
    title: "Site vitrine pro",
    summary: "Landing page avec hero, services, temoignages et formulaire de contact. Pret en 30 min.",
    icon: "lucide:globe",
    accent: "#4F8EF7",
    level: "Débutant",
    objective: "Creer un site vitrine professionnel deploye, avec formulaire de contact et design responsive.",
    starterRepoUrl: "https://github.com/vercel/next.js/tree/canary/examples/landing-page",
    deployUrl: "https://vercel.com/new",
    features: [
      "Hero section avec CTA",
      "Grille de services/offres",
      "Formulaire de contact operationnel",
      "Responsive mobile-first"
    ],
    stack: ["Next.js", "Tailwind", "Vercel"]
  },
  {
    id: "dashboard-kpi",
    domain: "Data",
    title: "Dashboard KPI",
    summary: "Tableau de bord avec graphiques, filtres et export. Connecte a une API ou CSV.",
    icon: "lucide:bar-chart-3",
    accent: "#10B981",
    level: "Débutant",
    objective: "Construire un dashboard de suivi de performance avec donnees dynamiques.",
    starterRepoUrl: "https://github.com/vercel/next.js/tree/canary/examples/with-mdx",
    deployUrl: "https://vercel.com/new",
    features: [
      "Graphiques interactifs (Chart.js/Recharts)",
      "Filtres par periode et categorie",
      "Export PDF des KPI",
      "Donnees mock ou API connectee"
    ],
    stack: ["Next.js", "Chart.js", "Tailwind", "Vercel"]
  },
  {
    id: "api-backend",
    domain: "Web",
    title: "API REST + Base",
    summary: "Backend complet avec Supabase, auth et endpoints REST securises.",
    icon: "lucide:server",
    accent: "#9B6DFF",
    level: "Intermédiaire",
    objective: "Creer une API REST complete avec authentification et base de donnees.",
    starterRepoUrl: "https://github.com/vercel/next.js/tree/canary/examples/api-routes",
    deployUrl: "https://vercel.com/new",
    features: [
      "Routes API RESTful",
      "Authentification JWT",
      "CRUD complet avec Supabase",
      "Middleware de validation"
    ],
    stack: ["Next.js", "Supabase", "Tailwind", "Vercel"]
  },
  {
    id: "saas-boilerplate",
    domain: "Web",
    title: "Boilerplate SaaS",
    summary: "Structure SaaS complete : auth, abonnements Stripe, dashboard utilisateur.",
    icon: "lucide:rocket",
    accent: "#F59E0B",
    level: "Expert",
    objective: "Lancer un produit SaaS avec paiements recurrents et espace membre.",
    starterRepoUrl: "https://github.com/vercel/next.js/tree/canary/examples/with-stripe-typescript",
    deployUrl: "https://vercel.com/new",
    features: [
      "Authentification multi-roles",
      "Abonnements Stripe recurrents",
      "Dashboard membre integre",
      "Pages pricing et onboarding"
    ],
    stack: ["Next.js", "Supabase", "Stripe", "Vercel"]
  },
  {
    id: "blog-cms",
    domain: "Web",
    title: "Blog / CMS",
    summary: "Blog avec editeur rich text, categories, tags et SEO integre.",
    icon: "lucide:file-text",
    accent: "#22D3EE",
    level: "Débutant",
    objective: "Publier un blog avec editeur de contenu et referencement optimise.",
    starterRepoUrl: "https://github.com/vercel/next.js/tree/canary/examples/blog-starter",
    deployUrl: "https://vercel.com/new",
    features: [
      "Editeur rich text (MDX)",
      "Categories et tags",
      "Flux RSS et sitemap",
      "SEO optimise"
    ],
    stack: ["Next.js", "MDX", "Tailwind", "Vercel"]
  },
  {
    id: "mobile-app",
    domain: "Mobile",
    title: "App mobile (PWA)",
    summary: "Application mobile progressive avec navigation, offline et notifications.",
    icon: "lucide:smartphone",
    accent: "#06B6D4",
    level: "Intermédiaire",
    objective: "Creer une PWA installable sur mobile avec navigation et mode hors-ligne.",
    starterRepoUrl: "https://github.com/vercel/next.js/tree/canary/examples/progressive-web-app",
    deployUrl: "https://vercel.com/new",
    features: [
      "Installee sur ecran d'accueil (PWA)",
      "Navigation multi-ecrans",
      "Mode hors-ligne (service worker)",
      "Notifications push"
    ],
    stack: ["Next.js", "PWA", "Tailwind", "Vercel"]
  },
  {
    id: "agent-ia",
    domain: "IA",
    title: "Agent IA chatbot",
    summary: "Chatbot IA avec historique, contexte et人格e personnalisable.",
    icon: "lucide:bot",
    accent: "#22D3EE",
    level: "Intermédiaire",
    objective: "Deployer un assistant IA conversationnel avec memoire et contexte.",
    starterRepoUrl: "https://github.com/vercel/next.js/tree/canary/examples/with-ai",
    deployUrl: "https://vercel.com/new",
    features: [
      "Chat en temps reel (streaming)",
      "Memoire de conversation",
      "Personnalite configurable",
      "Mode sombre/clair"
    ],
    stack: ["Next.js", "OpenAI", "Supabase", "Vercel"]
  },
  {
    id: "ecommerce",
    domain: "Web",
    title: "Boutique en ligne",
    summary: "Catalogue produits, panier, checkout Stripe et tableau de bord ventes.",
    icon: "lucide:shopping-cart",
    accent: "#EF4444",
    level: "Expert",
    objective: "Lancer une boutique en ligne avec paiements et gestion de stock.",
    starterRepoUrl: "https://github.com/vercel/next.js/tree/canary/examples/with-stripe-typescript",
    deployUrl: "https://vercel.com/new",
    features: [
      "Catalogue produits avec images",
      "Panier persistant",
      "Paiement Stripe securise",
      "Dashboard ventes et commandes"
    ],
    stack: ["Next.js", "Stripe", "Supabase", "Vercel"]
  }
];

export function getTemplateById(id: string): StarterTemplate | undefined {
  return STARTER_TEMPLATES.find((t) => t.id === id);
}

export function getTemplatesByDomain(domain: string): StarterTemplate[] {
  return STARTER_TEMPLATES.filter((t) => t.domain.toLowerCase() === domain.toLowerCase());
}

export const TEMPLATE_DOMAINS = Array.from(new Set(STARTER_TEMPLATES.map((t) => t.domain)));