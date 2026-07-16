import Link from "next/link";
import FooterSection from "../../components/FooterSection";
import Navbar from "../../components/Navbar";
import { buildPageMetadata } from "../../lib/seo";

export const metadata = buildPageMetadata({
  title: "Projets",
  description: "Catalogue clair des projets TakaCode avec objectif, livrable final, compétences et stack recommandé.",
  path: "/projets"
});

const PROJECT_FORMATS = [
  {
    id: "web",
    icon: "lucide:globe",
    accent: "#4F8EF7",
    title: "Site web ou portfolio",
    summary: "Projet rapide pour présenter ton offre, tes services ou ton profil.",
    cadence: "1 à 2 semaines",
    audience: "Debutant"
  },
  {
    id: "app",
    icon: "lucide:layout-dashboard",
    accent: "#9B6DFF",
    title: "Application web",
    summary: "Outil SaaS, panel admin ou plateforme métier connectée à des données.",
    cadence: "2 à 5 semaines",
    audience: "Debutant +"
  },
  {
    id: "mobile",
    icon: "lucide:smartphone",
    accent: "#22D3EE",
    title: "Application mobile",
    summary: "Prototype Android/iOS pour terrain, suivi d'équipe ou service client.",
    cadence: "3 à 6 semaines",
    audience: "Intermediaire"
  },
  {
    id: "automation",
    icon: "lucide:bot",
    accent: "#06B6D4",
    title: "Workflow IA et automation",
    summary: "Automatiser un process répétitif avec IA, n8n ou Make.",
    cadence: "1 à 3 semaines",
    audience: "Intermediaire"
  },
  {
    id: "data",
    icon: "lucide:bar-chart-3",
    accent: "#10B981",
    title: "Dashboard data",
    summary: "Transformer des données brutes en décision claire via KPI et visualisations.",
    cadence: "1 à 3 semaines",
    audience: "Debutant +"
  },
  {
    id: "business",
    icon: "lucide:rocket",
    accent: "#F59E0B",
    title: "Projet business digital",
    summary: "Monter une offre en ligne, tunnel de vente et preuve de traction.",
    cadence: "2 à 6 semaines",
    audience: "Intermediaire"
  }
];

const PROJECT_LIBRARY = [
  {
    id: "site-vitrine",
    title: "Site vitrine pro en 7 jours",
    domain: "Web",
    icon: "lucide:globe",
    accent: "#4F8EF7",
    levelLabel: "Debutant",
    durationLabel: "7 jours",
    objective: "Mettre en ligne une présence web claire avec page d'accueil, services et contact.",
    deliverable: "Site déployé + formulaire contact actif",
    competencies: [
      "Structurer HTML/CSS propre",
      "Rendre le design mobile-first",
      "Connecter un formulaire fonctionnel"
    ],
    stack: ["HTML", "Tailwind", "Next.js", "Vercel"],
    parcoursHref: "/parcours/site-web"
  },
  {
    id: "dashboard-kpi",
    title: "Dashboard KPI ventes",
    domain: "Data",
    icon: "lucide:bar-chart-3",
    accent: "#10B981",
    levelLabel: "Debutant +",
    durationLabel: "10 jours",
    objective: "Centraliser ventes et performance pour lire les chiffres en 1 minute.",
    deliverable: "Dashboard avec KPI, filtres et export PDF",
    competencies: [
      "Nettoyer des données CSV",
      "Construire des indicateurs clés",
      "Présenter insights actionnables"
    ],
    stack: ["Excel", "Power BI", "Looker Studio"],
    parcoursHref: "/parcours/analyse-donnees"
  },
  {
    id: "agent-support",
    title: "Agent support client",
    domain: "IA",
    icon: "lucide:bot",
    accent: "#22D3EE",
    levelLabel: "Intermediaire",
    durationLabel: "12 jours",
    objective: "Automatiser les demandes récurrentes sans perdre la qualité des réponses.",
    deliverable: "Agent IA branché à une base FAQ métier",
    competencies: [
      "Designer un workflow n8n",
      "Structurer prompts et garde-fous",
      "Suivre taux de resolution"
    ],
    stack: ["n8n", "OpenAI", "Supabase", "Webhook"],
    parcoursHref: "/parcours/automatisation-ia"
  },
  {
    id: "mobile-terrain",
    title: "App mobile suivi terrain",
    domain: "Mobile",
    icon: "lucide:smartphone",
    accent: "#06B6D4",
    levelLabel: "Intermediaire",
    durationLabel: "3 semaines",
    objective: "Digitaliser les relevés terrain avec synchronisation et historique.",
    deliverable: "Prototype mobile testable avec formulaires",
    competencies: [
      "Concevoir écrans clairs",
      "Gérer navigation et offline",
      "Synchroniser vers backend"
    ],
    stack: ["React Native", "Expo", "Supabase"],
    parcoursHref: "/parcours/application-mobile"
  },
  {
    id: "mvp-business",
    title: "MVP business digital",
    domain: "Business",
    icon: "lucide:rocket",
    accent: "#F59E0B",
    levelLabel: "Build",
    durationLabel: "4 semaines",
    objective: "Passer d'une idée à une offre monetizable avec premiers utilisateurs.",
    deliverable: "Landing + offre + tunnel de vente",
    competencies: [
      "définir positionnement clair",
      "Construire une offre vendable",
      "Mesurer conversion et revenu"
    ],
    stack: ["Notion", "Stripe", "Email", "Analytics"],
    parcoursHref: "/parcours/business-digital"
  },
  {
    id: "dapp-community",
    title: "dApp communaute",
    domain: "Web3",
    icon: "lucide:wallet",
    accent: "#38BDF8",
    levelLabel: "Build",
    durationLabel: "4 a 6 semaines",
    objective: "Créer une app communautaire avec authentification wallet et badges on-chain.",
    deliverable: "dApp MVP avec smart contract de base",
    competencies: [
      "Ecrire un smart contract simple",
      "Connecter wallet au front",
      "déployer et tester la dApp"
    ],
    stack: ["Solidity", "Ethers", "Next.js", "WalletConnect"],
    parcoursHref: "/parcours/web3-blockchain"
  }
];

function getLevelChipClass(levelLabel: string) {
  const normalized = String(levelLabel || "").toLowerCase();

  if (normalized.includes("debutant")) {
    return "level-beginner";
  }

  if (normalized.includes("inter") || normalized.includes("build") || normalized.includes("execution")) {
    return "level-intermediate";
  }

  return "level-advanced";
}

export default function ProjetsPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <Navbar />
      <main className="pt-[64px]">
        <section className="py-24 md:py-28 px-8">
          <div className="max-w-[1320px] mx-auto space-y-10">
            <div className="max-w-[930px]">
              <div className="section-label mb-4">PROJETS</div>
              <h1 className="font-valorax gradient-text text-[clamp(34px,4vw,56px)] leading-[0.92]">
                CATALOGUE CLAIR DES PROJETS A CONSTRUIRE
              </h1>
              <p className="font-body-readable text-[15px] text-[#8d8d8d] mt-4 leading-relaxed">
                Cette page te montre exactement quoi construire: objectif, livrable final, compétences acquises et stack recommandé.
                Tu peux choisir un projet puis ouvrir le parcours associé pour le réaliser.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <article className="rounded-xl border border-white/[0.08] bg-[#111] px-4 py-4">
                <div className="text-[10px] text-[#666] uppercase tracking-widest mb-1">Bibliotheque</div>
                <div className="font-venite-italic text-[20px] text-white">{PROJECT_LIBRARY.length} PROJETS</div>
                <p className="font-body-readable text-[11px] text-[#767676] mt-1">Des exemples concrets prêts à lancer.</p>
              </article>
              <article className="rounded-xl border border-white/[0.08] bg-[#111] px-4 py-4">
                <div className="text-[10px] text-[#666] uppercase tracking-widest mb-1">Formats</div>
                <div className="font-venite-italic text-[20px] text-white">{PROJECT_FORMATS.length} DOMAINES</div>
                <p className="font-body-readable text-[11px] text-[#767676] mt-1">Web, data, IA, mobile, business, web3.</p>
              </article>
              <article className="rounded-xl border border-white/[0.08] bg-[#111] px-4 py-4">
                <div className="text-[10px] text-[#666] uppercase tracking-widest mb-1">Lecture rapide</div>
                <div className="font-venite-italic text-[20px] text-white">4 INFOS CLEFS</div>
                <p className="font-body-readable text-[11px] text-[#767676] mt-1">Objectif, livrable, compétences, stack.</p>
              </article>
            </div>

            <section className="rounded-2xl border border-white/[0.08] bg-[#111] p-5 md:p-6">
              <h2 className="font-venite-italic text-[16px] text-white mb-4">COMMENT CHOISIR TON PROJET</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4">
                  <div className="text-[10px] text-[#4F8EF7] font-semibold mb-2">ETAPE 1</div>
                  <div className="font-body-readable text-[12px] text-[#cdcdcd]">Choisis le domaine qui correspond à ton objectif actuel.</div>
                </div>
                <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4">
                  <div className="text-[10px] text-[#4F8EF7] font-semibold mb-2">ETAPE 2</div>
                  <div className="font-body-readable text-[12px] text-[#cdcdcd]">Lis le livrable final pour vérifier ce que tu vas vraiment sortir.</div>
                </div>
                <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4">
                  <div className="text-[10px] text-[#4F8EF7] font-semibold mb-2">ETAPE 3</div>
                  <div className="font-body-readable text-[12px] text-[#cdcdcd]">Ouvre le parcours associé et lance ton exécution depuis le dashboard.</div>
                </div>
              </div>
            </section>
          </div>
        </section>

        <section className="px-8 pb-12">
          <div className="max-w-[1320px] mx-auto">
            <div className="flex items-center justify-between gap-4 flex-wrap mb-5">
              <h2 className="font-venite-italic text-[16px] text-white">FORMATS DISPONIBLES</h2>
              <Link href="/parcours" className="text-[12px] text-[#4F8EF7] hover:underline">
                Voir tous les parcours
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {PROJECT_FORMATS.map((format) => (
                <article key={format.id} className="rounded-xl border border-white/[0.08] bg-[#111] p-4 card-hover project-card">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div
                      className="w-10 h-10 rounded-xl border flex items-center justify-center"
                      style={{
                        borderColor: `${format.accent}55`,
                        background: `${format.accent}1f`
                      }}
                    >
                      <iconify-icon icon={format.icon} style={{ color: format.accent, fontSize: "18px" }} />
                    </div>
                    <span className="text-[10px] px-2 py-1 rounded-full border border-white/[0.1] text-[#909090]">{format.audience}</span>
                  </div>

                  <h3 className="font-venite-italic text-[14px] text-white mb-2">{format.title}</h3>
                  <p className="font-body-readable text-[12px] text-[#7d7d7d] leading-relaxed mb-3">{format.summary}</p>
                  <div className="text-[11px] text-[#585858] font-body-readable">Rythme moyen: {format.cadence}</div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="px-8 pb-24">
          <div className="max-w-[1320px] mx-auto">
            <div className="flex items-center justify-between gap-4 flex-wrap mb-6">
              <div>
                <h2 className="font-venite-italic text-[16px] text-white mb-1">PROJETS DETAILLES</h2>
                <p className="font-body-readable text-[12px] text-[#727272]">Chaque carte décrit clairement le résultat attendu et les compétences que tu vas gagner.</p>
              </div>
              <Link href="/dashboard" className="btn-secondary inline-flex items-center gap-2 text-[12px]" style={{ padding: "10px 16px" }}>
                Lancer depuis mon dashboard
                <iconify-icon icon="lucide:arrow-right" style={{ fontSize: "13px" }} />
              </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {PROJECT_LIBRARY.map((project) => (
                <article key={project.id} className="bg-[#111] border border-white/[0.07] rounded-2xl p-6 card-hover project-card">
                  <div className="flex items-center justify-between gap-3 flex-wrap mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-11 h-11 rounded-xl border flex items-center justify-center"
                        style={{
                          borderColor: `${project.accent}55`,
                          background: `${project.accent}1f`
                        }}
                      >
                        <iconify-icon icon={project.icon} style={{ color: project.accent, fontSize: "20px" }} />
                      </div>
                      <div>
                        <div className="text-[10px] text-[#777] uppercase tracking-widest">{project.domain}</div>
                        <h3 className="font-venite-italic text-[15px] text-white leading-tight">{project.title}</h3>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`${getLevelChipClass(project.levelLabel)} text-[10px] font-semibold px-2.5 py-1 rounded-full`}>
                        {project.levelLabel}
                      </span>
                      <span className="text-[10px] px-2.5 py-1 rounded-full border border-white/[0.1] text-[#9a9a9a]">{project.durationLabel}</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="text-[10px] text-[#666] uppercase tracking-widest mb-1">Objectif</div>
                      <p className="font-body-readable text-[12px] text-[#c9c9c9] leading-relaxed">{project.objective}</p>
                    </div>

                    <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] px-3.5 py-3">
                      <div className="text-[10px] text-[#666] uppercase tracking-widest mb-1">Livrable final</div>
                      <p className="font-body-readable text-[12px] text-[#bfbfbf]">{project.deliverable}</p>
                    </div>

                    <div>
                      <div className="text-[10px] text-[#666] uppercase tracking-widest mb-2">Competences acquises</div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {project.competencies.map((competence) => (
                          <div
                            key={`${project.id}-${competence}`}
                            className="rounded-lg border border-white/[0.08] bg-[#0f0f0f] px-3 py-2 text-[11px] text-[#bdbdbd] font-body-readable flex items-center gap-2"
                          >
                            <iconify-icon icon="lucide:check" style={{ color: "#4F8EF7", fontSize: "12px" }} />
                            <span>{competence}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="text-[10px] text-[#666] uppercase tracking-widest mb-2">Stack recommande</div>
                      <div className="flex flex-wrap gap-1.5">
                        {project.stack.map((tool) => (
                          <span
                            key={`${project.id}-${tool}`}
                            className="text-[10px] px-2 py-1 rounded-full border border-white/[0.08] bg-white/[0.03] text-[#a1a1a1]"
                          >
                            {tool}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2.5">
                    <Link
                      href={project.parcoursHref}
                      className="btn-secondary inline-flex items-center gap-2 text-[12px]"
                      style={{ padding: "10px 16px" }}
                    >
                      Voir le parcours associe
                      <iconify-icon icon="lucide:route" style={{ fontSize: "13px" }} />
                    </Link>
                    <Link
                      href="/dashboard"
                      className="btn-secondary inline-flex items-center gap-2 text-[12px]"
                      style={{ padding: "10px 16px" }}
                    >
                      Demarrer ce projet
                      <iconify-icon icon="lucide:play" style={{ fontSize: "13px" }} />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
      <hr className="section-divider" />
      <FooterSection />
    </div>
  );
}

