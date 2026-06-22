import Link from "next/link";

export default function ProjectsSection() {
  return (
    <section className="py-28" id="projets">
      <div className="max-w-[1320px] mx-auto px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between mb-5">
          <div>
            <div className="section-label mb-4">GALERIE</div>
            <h2
              className="font-valorax gradient-text"
              style={{ fontSize: "clamp(28px, 3vw, 46px)", letterSpacing: "-0.02em", maxWidth: "600px" }}
            >
              DES PROJETS REELS.
              <br />
              PAS SEULEMENT DE LA THEORIE.
            </h2>
          </div>
          <Link href="/projets" id="projets-all-link" className="btn-secondary inline-flex items-center gap-2 self-start lg:self-auto">
            Voir tous les projets
            <iconify-icon icon="lucide:arrow-right" style={{ fontSize: "14px" }} />
          </Link>
        </div>
        <p className="font-body-readable text-[#666] text-[14px] mb-14">Decouvrez les realisations des membres de la communaute.</p>

        {/* Community project cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
          <div className="bg-[#111] border border-white/[0.07] rounded-2xl overflow-hidden card-hover project-card">
            <div className="h-44 bg-[#0D0D0D] relative overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  className="w-full h-full"
                  style={{ background: "linear-gradient(135deg, rgba(79,142,247,0.08) 0%, rgba(0,0,0,0) 60%), linear-gradient(225deg, rgba(155,109,255,0.06) 0%, rgba(0,0,0,0) 60%)" }}
                >
                  <div className="flex items-center justify-center h-full">
                    <iconify-icon icon="lucide:wallet" className="text-[#333]" style={{ fontSize: "48px" }} />
                  </div>
                </div>
              </div>
              <div className="absolute top-3 left-3">
                <span className="tag-badge">Web3</span>
              </div>
            </div>
            <div className="p-5">
              <div className="font-venite text-[13px] text-white mb-2">DAPP GESTION COMMUNAUTE</div>
              <p className="font-body-readable text-[11px] text-[#555] mb-4">Application Web3 pour gerer membres, badges et paiements on-chain d'une communaute.</p>
              <div className="font-body-readable flex flex-wrap gap-1.5 mb-4">
                <span className="text-[10px] bg-white/[0.04] border border-white/[0.06] text-[#666] px-2 py-0.5 rounded-full">Solidity</span>
                <span className="text-[10px] bg-white/[0.04] border border-white/[0.06] text-[#666] px-2 py-0.5 rounded-full">WalletConnect</span>
                <span className="text-[10px] bg-white/[0.04] border border-white/[0.06] text-[#666] px-2 py-0.5 rounded-full">Next.js</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-violet-500" />
                  <span className="font-body-readable text-[11px] text-[#666]">Moussa K.</span>
                </div>
                <Link href="/projets" id="project-1-link" className="text-[11px] text-[#4F8EF7] font-medium flex items-center gap-1 hover:gap-2 transition-all">
                  Voir <iconify-icon icon="lucide:arrow-right" style={{ fontSize: "11px" }} />
                </Link>
              </div>
            </div>
          </div>

          <div className="bg-[#111] border border-white/[0.07] rounded-2xl overflow-hidden card-hover project-card">
            <div className="h-44 bg-[#0D0D0D] relative overflow-hidden">
              <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(34,211,238,0.08) 0%, rgba(0,0,0,0) 60%)" }}>
                <div className="flex items-center justify-center h-full">
                  <iconify-icon icon="lucide:music-2" className="text-[#333]" style={{ fontSize: "48px" }} />
                </div>
              </div>
              <div className="absolute top-3 left-3">
                <span className="tag-badge">Musique</span>
              </div>
            </div>
            <div className="p-5">
              <div className="font-venite text-[13px] text-white mb-2">STUDIO AUDIO EN LIGNE</div>
              <p className="font-body-readable text-[11px] text-[#555] mb-4">Plateforme pour composer, mixer et publier des contenus musicaux et audio avec assistance IA.</p>
              <div className="font-body-readable flex flex-wrap gap-1.5 mb-4">
                <span className="text-[10px] bg-white/[0.04] border border-white/[0.06] text-[#666] px-2 py-0.5 rounded-full">Ableton</span>
                <span className="text-[10px] bg-white/[0.04] border border-white/[0.06] text-[#666] px-2 py-0.5 rounded-full">FL Studio</span>
                <span className="text-[10px] bg-white/[0.04] border border-white/[0.06] text-[#666] px-2 py-0.5 rounded-full">AI Audio</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-400 to-green-500" />
                  <span className="font-body-readable text-[11px] text-[#666]">Awa D.</span>
                </div>
                <Link href="/projets" id="project-2-link" className="text-[11px] text-[#4F8EF7] font-medium flex items-center gap-1 hover:gap-2 transition-all">
                  Voir <iconify-icon icon="lucide:arrow-right" style={{ fontSize: "11px" }} />
                </Link>
              </div>
            </div>
          </div>

          <div className="bg-[#111] border border-white/[0.07] rounded-2xl overflow-hidden card-hover project-card">
            <div className="h-44 bg-[#0D0D0D] relative overflow-hidden">
              <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(155,109,255,0.08) 0%, rgba(0,0,0,0) 60%)" }}>
                <div className="flex items-center justify-center h-full">
                  <iconify-icon icon="lucide:box" className="text-[#333]" style={{ fontSize: "48px" }} />
                </div>
              </div>
              <div className="absolute top-3 left-3">
                <span className="tag-badge">3D</span>
              </div>
            </div>
            <div className="p-5">
              <div className="font-venite text-[13px] text-white mb-2">CONFIGURATEUR 3D PRODUIT</div>
              <p className="font-body-readable text-[11px] text-[#555] mb-4">Experience 3D interactive permettant de personnaliser un produit en temps reel.</p>
              <div className="font-body-readable flex flex-wrap gap-1.5 mb-4">
                <span className="text-[10px] bg-white/[0.04] border border-white/[0.06] text-[#666] px-2 py-0.5 rounded-full">Three.js</span>
                <span className="text-[10px] bg-white/[0.04] border border-white/[0.06] text-[#666] px-2 py-0.5 rounded-full">Blender</span>
                <span className="text-[10px] bg-white/[0.04] border border-white/[0.06] text-[#666] px-2 py-0.5 rounded-full">React Three Fiber</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-400 to-pink-500" />
                  <span className="font-body-readable text-[11px] text-[#666]">Ibrahim S.</span>
                </div>
                <Link href="/projets" id="project-3-link" className="text-[11px] text-[#4F8EF7] font-medium flex items-center gap-1 hover:gap-2 transition-all">
                  Voir <iconify-icon icon="lucide:arrow-right" style={{ fontSize: "11px" }} />
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center mt-10">
          <Link href="/projets" id="projets-publish-link" className="btn-secondary flex items-center gap-2" style={{ fontSize: "13px", padding: "12px 24px" }}>
            <iconify-icon icon="lucide:upload" style={{ fontSize: "14px" }} />
            Publier mon projet
          </Link>
        </div>
      </div>
    </section>
  );
}