import Link from "next/link";
import Navbar from "../../components/Navbar";
import FooterSection from "../../components/FooterSection";
import { buildPageMetadata } from "../../lib/seo";

export const metadata = buildPageMetadata({
  title: "Tarifs",
  description: "Construis, lance et monétise ton projet digital avec TakaCode. Offre gratuite, premium et accompagnement.",
  path: "/tarifs"
});

const PLANS = [
  {
    id: "free",
    name: "Gratuit",
    price: "0",
    period: "",
    desc: "Tout ce qu'il faut pour commencer ton projet.",
    features: [
      "Tous les parcours et lecons",
      "Constructeur de projet visuel",
      "Revisions IA (1/semaine)",
      "Communauté et classement",
      "Ressources selectionnees",
    ],
    cta: "Commencer gratuitement",
    href: "/signup",
    highlight: false,
  },
  {
    id: "premium",
    name: "Premium",
    price: "12",
    period: "/mois",
    desc: "Pour accélérer et lancer ton projet plus vite.",
    features: [
      "Tout le plan Gratuit",
      "Revisions IA illimitées",
      "Kits de demarrage premium (templates, composants)",
      "Guides deploiement + domaine",
      "Guides monetisation (Stripe, pubs, produits digitaux)",
      "Support prioritaire",
    ],
    cta: "Passer a Premium",
    href: "/signup",
    highlight: true,
  },
  {
    id: "launch",
    name: "Launch",
    price: "39",
    period: "/mois",
    desc: "Accompagnement personnalise pour lancer et rentabiliser.",
    features: [
      "Tout le plan Premium",
      "Mentorat 1:1 (2 seances/mois)",
      "Revue de portfolio + optimisation",
      "Conseils marketing et SEO",
      "Mise en relation freelance",
      "Accès aux opportunites de projets",
    ],
    cta: "Reserver ma place",
    href: "/signup",
    highlight: false,
  },
];

function CheckIcon() {
  return (
    <svg className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

export default function TarifsPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <Navbar />
      <main className="pt-[64px]">
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-900/[0.04] via-transparent to-violet-900/[0.04] pointer-events-none" />
          <div className="max-w-[1100px] mx-auto px-8 relative z-10">
            <div className="text-center mb-14">
              <div className="section-label mb-4">TARIFS</div>
              <h1 className="font-valorax gradient-text mb-5" style={{ fontSize: "clamp(36px, 4.5vw, 64px)", letterSpacing: "-0.02em" }}>
                CONSTRUIS, LANCE, GAGNE
              </h1>
              <p className="font-body-readable text-[#888] text-[14px] leading-relaxed max-w-[580px] mx-auto">
                TakaCode t aide a realiser des projets digitaux de A a Z. 
                Gratuit pour apprendre et construire. Premium pour lancer et monétiser.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {PLANS.map((plan) => (
                <article
                  key={plan.id}
                  className={`rounded-2xl border p-6 flex flex-col ${
                    plan.highlight
                      ? "border-blue-500/30 bg-blue-500/[0.04] relative"
                      : "border-white/[0.08] bg-white/[0.02]"
                  }`}
                >
                  {plan.highlight && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-500 text-[10px] font-semibold uppercase tracking-widest px-3 py-1 rounded-full">
                      Populaire
                    </div>
                  )}
                  <div className="mb-6">
                    <div className="font-venite text-[11px] tracking-widest text-[#888] mb-2">{plan.name}</div>
                    <div className="flex items-baseline gap-1">
                      <span className="font-valorax text-[32px] text-white">{plan.price}</span>
                      {plan.period && <span className="text-[12px] text-[#666]">{plan.period}</span>}
                    </div>
                    <p className="text-[11px] text-[#6d6d6d] mt-2 font-body-readable">{plan.desc}</p>
                  </div>
                  <ul className="space-y-2.5 mb-8 flex-1">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-[12px] text-[#b0b0b0] font-body-readable">
                        <CheckIcon />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={plan.href}
                    className={`w-full text-center text-[12px] py-3 rounded-lg font-semibold transition-all ${
                      plan.highlight
                        ? "bg-blue-500 text-white hover:bg-blue-400"
                        : "border border-white/[0.12] text-[#ccc] hover:border-white/25 hover:text-white"
                    }`}
                  >
                    {plan.cta}
                  </Link>
                </article>
              ))}
            </div>

            <div className="mt-16 rounded-2xl border border-white/[0.06] bg-white/[0.015] p-8 max-w-[800px] mx-auto">
              <h2 className="font-venite text-[13px] tracking-widest text-center text-[#888] mb-6">TU CONSTRUIS, TU GAGNES</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                {[
                  { icon: "lucide:code", title: "Construis", desc: "Apprends en realisant des projets concrets avec des ressources curiees." },
                  { icon: "lucide:rocket", title: "Lance", desc: "Deploie ton projet, obtiens un domaine et partage-le au monde." },
                  { icon: "lucide:wallet", title: "Monetise", desc: "Ajoute un modele economique a ton projet : pubs, Stripe, produits digitaux." },
                ].map((item) => (
                  <div key={item.title}>
                    <div className="w-10 h-10 rounded-xl border border-white/[0.08] bg-white/[0.03] flex items-center justify-center mx-auto mb-3">
                      <iconify-icon icon={item.icon} style={{ fontSize: "18px", color: "#4F8EF7" }} />
                    </div>
                    <div className="font-venite text-[11px] tracking-widest text-white mb-1.5">{item.title}</div>
                    <p className="text-[11px] text-[#6d6d6d] font-body-readable leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-12 text-center">
              <p className="text-[11px] text-[#555] font-body-readable max-w-[500px] mx-auto">
                TakaCode est en construction active. Les formules Premium et Launch seront disponibles progressivement. 
                En attendant, tout est gratuit.
              </p>
            </div>
          </div>
        </section>
      </main>
      <hr className="section-divider" />
      <FooterSection />
    </div>
  );
}
