import Link from "next/link";

export default function CommunitySection() {
  return (
    <section className="py-28" id="communaute">
      <div className="max-w-[1320px] mx-auto px-8">
        <div className="bg-[#111] border border-white/[0.07] rounded-3xl p-8 sm:p-10 lg:p-14 relative overflow-hidden" style={{ borderColor: "rgba(79,142,247,0.12)", boxShadow: "0 0 80px rgba(79,142,247,0.05)" }}>
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
          <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-violet-500/[0.05] rounded-full filter blur-3xl" />
          <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-500/[0.04] rounded-full filter blur-3xl" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <div className="section-label mb-4">COMMUNAUTE</div>
              <h2 className="font-valorax gradient-text mb-6" style={{ fontSize: "clamp(32px, 3vw, 48px)", letterSpacing: "-0.02em" }}>
                UNE COMMUNAUTE
                <br />
                QUI CONSTRUIT
              </h2>
              <p className="font-body-readable text-[#666] text-[15px] leading-relaxed mb-8">
                Avance avec d'autres créateurs et partage tes progrès. Seul on va vite, ensemble on va loin.
              </p>
              <Link href="/communaute" id="communaute-cta-link" className="btn-primary glow-btn inline-flex items-center gap-2" style={{ fontSize: "14px", padding: "14px 28px" }}>
                <iconify-icon icon="lucide:users" style={{ fontSize: "16px" }} />
                Rejoindre la communauté
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-[#0D0D0D] border border-white/[0.06] rounded-xl p-4 card-hover">
                <iconify-icon icon="lucide:trophy" className="text-yellow-400 mb-3" style={{ fontSize: "20px" }} />
                <div className="font-venite text-[12px] text-white mb-1">CHALLENGES</div>
                <p className="font-body-readable text-[11px] text-[#555]">Défis hebdomadaires et mensuels pour progresser.</p>
              </div>
              <div className="bg-[#0D0D0D] border border-white/[0.06] rounded-xl p-4 card-hover">
                <iconify-icon icon="lucide:users-2" className="text-[#4F8EF7] mb-3" style={{ fontSize: "20px" }} />
                <div className="font-venite text-[12px] text-white mb-1">GROUPES D'ETUDE</div>
                <p className="font-body-readable text-[11px] text-[#555]">Étudie et construis avec d'autres membres.</p>
              </div>
              <div className="bg-[#0D0D0D] border border-white/[0.06] rounded-xl p-4 card-hover">
                <iconify-icon icon="lucide:share-2" className="text-[#9B6DFF] mb-3" style={{ fontSize: "20px" }} />
                <div className="font-venite text-[12px] text-white mb-1">PARTAGE DE PROJETS</div>
                <p className="font-body-readable text-[11px] text-[#555]">Publication et mise en avant de tes créations.</p>
              </div>
              <div className="bg-[#0D0D0D] border border-white/[0.06] rounded-xl p-4 card-hover">
                <iconify-icon icon="lucide:bar-chart-2" className="text-green-400 mb-3" style={{ fontSize: "20px" }} />
                <div className="font-venite text-[12px] text-white mb-1">CLASSEMENTS</div>
                <p className="font-body-readable text-[11px] text-[#555]">Suis ta progression et tes succès.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
