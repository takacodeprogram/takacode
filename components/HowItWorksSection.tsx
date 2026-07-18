import Link from "next/link";

export default function HowItWorksSection() {
  return (
    <section className="py-28" id="comment-ca-marche">
      <div className="max-w-[1320px] mx-auto px-8">
        <div className="text-center mb-20">
          <div className="section-label mb-4">PROCESSUS</div>
          <h2 className="font-valorax gradient-text mb-5" style={{ fontSize: "clamp(36px, 3.5vw, 54px)", letterSpacing: "-0.02em" }}>
            COMMENT CA MARCHE
          </h2>
          <p className="font-body-readable text-[#666] text-[15px] max-w-md mx-auto">
            De ton idee a ton projet rentable, un chemin clair et guide.
          </p>
        </div>

        <div className="relative">
          <div className="hidden xl:block absolute top-[44px] left-[calc(100%/12)] right-[calc(100%/12)] h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent z-0" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5 relative z-10">
            <div className="text-center">
              <div className="w-[88px] h-[88px] rounded-2xl bg-[#111] border border-white/[0.07] flex items-center justify-center mx-auto mb-5 card-hover" style={{ borderColor: "rgba(79,142,247,0.2)", boxShadow: "0 0 30px rgba(79,142,247,0.08)" }}>
                <iconify-icon icon="lucide:lightbulb" className="text-[#4F8EF7]" style={{ fontSize: "28px" }} />
              </div>
              <div className="font-venite text-[12px] text-white mb-2">TON IDEE</div>
              <p className="font-body-readable text-[11px] text-[#555] leading-relaxed">Tu as une idee de projet ou un probleme a resoudre. On t aide a la structurer.</p>
            </div>

            <div className="text-center">
              <div className="w-[88px] h-[88px] rounded-2xl bg-[#111] border border-white/[0.07] flex items-center justify-center mx-auto mb-5 card-hover">
                <iconify-icon icon="lucide:git-branch" className="text-[#888]" style={{ fontSize: "28px" }} />
              </div>
              <div className="font-venite text-[12px] text-white mb-2">LE PARCOURS LIE</div>
              <p className="font-body-readable text-[11px] text-[#555] leading-relaxed">Choisis le parcours qui correspond a ton archetype de projet (site, SaaS, e-commerce...).</p>
            </div>

            <div className="text-center">
              <div className="w-[88px] h-[88px] rounded-2xl bg-[#111] border border-white/[0.07] flex items-center justify-center mx-auto mb-5 card-hover">
                <iconify-icon icon="lucide:book-open" className="text-[#888]" style={{ fontSize: "28px" }} />
              </div>
              <div className="font-venite text-[12px] text-white mb-2">RESSOURCES + IA</div>
              <p className="font-body-readable text-[11px] text-[#555] leading-relaxed">Accede aux ressources, templates, outils IA et exercices pour construire ton projet.</p>
            </div>

            <div className="text-center">
              <div className="w-[88px] h-[88px] rounded-2xl bg-[#111] border border-white/[0.07] flex items-center justify-center mx-auto mb-5 card-hover">
                <iconify-icon icon="lucide:video" className="text-[#888]" style={{ fontSize: "28px" }} />
              </div>
              <div className="font-venite text-[12px] text-white mb-2">SESSIONS + MENTOR</div>
              <p className="font-body-readable text-[11px] text-[#555] leading-relaxed">Participe a des sessions live et fais reviewer tes livrables par un mentor.</p>
            </div>

            <div className="text-center">
              <div className="w-[88px] h-[88px] rounded-2xl bg-[#111] border border-white/[0.07] flex items-center justify-center mx-auto mb-5 card-hover">
                <iconify-icon icon="lucide:package" className="text-[#888]" style={{ fontSize: "28px" }} />
              </div>
              <div className="font-venite text-[12px] text-white mb-2">PUBLICATION</div>
              <p className="font-body-readable text-[11px] text-[#555] leading-relaxed">Deploie ton projet en ligne : GitHub, Vercel, domaine personnalise.</p>
            </div>

            <div className="text-center">
              <div className="w-[88px] h-[88px] rounded-2xl bg-[#111] border border-white/[0.07] flex items-center justify-center mx-auto mb-5 card-hover" style={{ borderColor: "rgba(155,109,255,0.2)", boxShadow: "0 0 30px rgba(155,109,255,0.06)" }}>
                <iconify-icon icon="lucide:trending-up" className="text-[#9B6DFF]" style={{ fontSize: "28px" }} />
              </div>
              <div className="font-venite text-[12px] text-white mb-2">MONETISATION</div>
              <p className="font-body-readable text-[11px] text-[#555] leading-relaxed">Genere des revenus : abonnements, produits digitaux, publicite, affiliation.</p>
            </div>
          </div>
        </div>

        <div className="text-center mt-16">
          <Link href="/projets" id="how-cta-link" className="btn-primary glow-btn inline-flex items-center gap-2" style={{ fontSize: "14px", padding: "14px 32px" }}>
            <iconify-icon icon="lucide:zap" style={{ fontSize: "16px" }} />
            Commencer mon projet
          </Link>
        </div>
      </div>
    </section>
  );
}
