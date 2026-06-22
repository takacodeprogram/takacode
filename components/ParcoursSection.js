import Link from "next/link";

export default function ParcoursSection() {
  return (
    <section className="py-28" id="parcours">
      <div className="max-w-[1320px] mx-auto px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between mb-16">
          <div>
            <div className="section-label mb-4">CATALOGUE</div>
            <h2 className="font-valorax gradient-text" style={{ fontSize: "clamp(36px, 3.5vw, 54px)", letterSpacing: "-0.02em" }}>
              PARCOURS DISPONIBLES
            </h2>
          </div>
          <Link href="/parcours" id="parcours-all-link" className="btn-secondary inline-flex items-center gap-2 self-start lg:self-auto">
            Tous les parcours
            <iconify-icon icon="lucide:arrow-right" style={{ fontSize: "14px" }} />
          </Link>
        </div>

        {/* Core highlighted parcours cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
          <div className="bg-[#111] border border-white/[0.07] rounded-2xl p-6 card-hover project-card">
            <div className="flex items-start justify-between mb-5">
              <div className="w-11 h-11 rounded-xl bg-blue-500/10 border border-blue-500/15 flex items-center justify-center">
                <iconify-icon icon="lucide:code-2" className="text-[#4F8EF7]" style={{ fontSize: "20px" }} />
              </div>
              <span className="level-beginner text-[10px] font-semibold px-2.5 py-1 rounded-full">Debutant</span>
            </div>
            <div className="font-venite text-[14px] text-white mb-2">DEVELOPPEMENT WEB</div>
            <p className="font-body-readable text-[12px] text-[#666] leading-relaxed mb-5">HTML, CSS, JavaScript, React et Node.js. Construis des sites web et applications completes de A a Z.</p>
            <div className="font-body-readable flex items-center gap-4 mb-5 text-[11px] text-[#555]">
              <span className="flex items-center gap-1.5"><iconify-icon icon="lucide:clock" /> 12 semaines</span>
              <span className="flex items-center gap-1.5"><iconify-icon icon="lucide:book" /> 48 ressources</span>
              <span className="flex items-center gap-1.5"><iconify-icon icon="lucide:layers" /> 8 projets</span>
            </div>
            <Link href="/parcours" id="parcours-web-link" className="w-full btn-secondary flex items-center justify-center gap-2 text-[12px]" style={{ padding: "10px 20px" }}>
              Decouvrir <iconify-icon icon="lucide:arrow-right" style={{ fontSize: "13px" }} />
            </Link>
          </div>

          <div className="bg-[#151515] border rounded-2xl p-6 card-hover project-card" style={{ borderColor: "rgba(155,109,255,0.2)", boxShadow: "0 0 40px rgba(155,109,255,0.06)" }}>
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/30 to-transparent rounded-t-2xl" />
            <div className="flex items-start justify-between mb-5">
              <div className="w-11 h-11 rounded-xl bg-violet-500/10 border border-violet-500/15 flex items-center justify-center">
                <iconify-icon icon="lucide:cpu" className="text-[#9B6DFF]" style={{ fontSize: "20px" }} />
              </div>
              <span className="level-intermediate text-[10px] font-semibold px-2.5 py-1 rounded-full">Intermediaire</span>
            </div>
            <div className="font-venite text-[14px] text-white mb-2">AUTOMATISATION ET IA</div>
            <p className="font-body-readable text-[12px] text-[#666] leading-relaxed mb-5">ChatGPT, agents IA, Make, n8n et Zapier. Automatise des taches et construis des workflows intelligents.</p>
            <div className="font-body-readable flex items-center gap-4 mb-5 text-[11px] text-[#555]">
              <span className="flex items-center gap-1.5"><iconify-icon icon="lucide:clock" /> 8 semaines</span>
              <span className="flex items-center gap-1.5"><iconify-icon icon="lucide:book" /> 36 ressources</span>
              <span className="flex items-center gap-1.5"><iconify-icon icon="lucide:layers" /> 6 projets</span>
            </div>
            <Link
              href="/parcours"
              id="parcours-ia-link"
              className="w-full btn-secondary flex items-center justify-center gap-2 text-[12px]"
              style={{ padding: "10px 20px", borderColor: "rgba(155,109,255,0.25)" }}
            >
              Decouvrir <iconify-icon icon="lucide:arrow-right" style={{ fontSize: "13px" }} />
            </Link>
          </div>

          <div className="bg-[#111] border border-white/[0.07] rounded-2xl p-6 card-hover project-card">
            <div className="flex items-start justify-between mb-5">
              <div className="w-11 h-11 rounded-xl bg-cyan-500/10 border border-cyan-500/15 flex items-center justify-center">
                <iconify-icon icon="lucide:bar-chart-3" className="text-[#22D3EE]" style={{ fontSize: "20px" }} />
              </div>
              <span className="level-intermediate text-[10px] font-semibold px-2.5 py-1 rounded-full">Intermediaire</span>
            </div>
            <div className="font-venite text-[14px] text-white mb-2">ANALYSE DE DONNEES</div>
            <p className="font-body-readable text-[12px] text-[#666] leading-relaxed mb-5">Excel, Power BI, Tableau et Python. Analyse, visualise et prends de meilleures decisions grace aux donnees.</p>
            <div className="font-body-readable flex items-center gap-4 mb-5 text-[11px] text-[#555]">
              <span className="flex items-center gap-1.5"><iconify-icon icon="lucide:clock" /> 10 semaines</span>
              <span className="flex items-center gap-1.5"><iconify-icon icon="lucide:book" /> 42 ressources</span>
              <span className="flex items-center gap-1.5"><iconify-icon icon="lucide:layers" /> 5 projets</span>
            </div>
            <Link href="/parcours" id="parcours-data-link" className="w-full btn-secondary flex items-center justify-center gap-2 text-[12px]" style={{ padding: "10px 20px" }}>
              Decouvrir <iconify-icon icon="lucide:arrow-right" style={{ fontSize: "13px" }} />
            </Link>
          </div>
        </div>

        {/* Secondary compact parcours cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          <div className="bg-[#111] border border-white/[0.07] rounded-2xl p-5 card-hover project-card">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/15 flex items-center justify-center mb-4">
              <iconify-icon icon="lucide:wallet" className="text-cyan-400" style={{ fontSize: "18px" }} />
            </div>
            <div className="font-venite text-[12px] text-white mb-1.5">WEB3 ET BLOCKCHAIN</div>
            <p className="font-body-readable text-[11px] text-[#555] leading-relaxed mb-4">Wallets, smart contracts et creation de dApps connectees au web.</p>
            <div className="font-body-readable flex items-center gap-3 mb-4 text-[10px] text-[#444]">
              <span className="flex items-center gap-1"><iconify-icon icon="lucide:clock" /> 10 sem.</span>
              <span className="level-intermediate text-[10px] font-medium px-2 py-0.5 rounded-full">Intermediaire</span>
            </div>
            <Link href="/parcours" id="parcours-web3-link" className="text-[11px] text-[#4F8EF7] font-medium flex items-center gap-1 hover:gap-2 transition-all">
              Decouvrir <iconify-icon icon="lucide:arrow-right" style={{ fontSize: "12px" }} />
            </Link>
          </div>

          <div className="bg-[#111] border border-white/[0.07] rounded-2xl p-5 card-hover project-card">
            <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/15 flex items-center justify-center mb-4">
              <iconify-icon icon="lucide:box" className="text-violet-400" style={{ fontSize: "18px" }} />
            </div>
            <div className="font-venite text-[12px] text-white mb-1.5">3D ET IMMERSIF</div>
            <p className="font-body-readable text-[11px] text-[#555] leading-relaxed mb-4">Modelisation 3D, animation et experiences interactives pour le web et le jeu.</p>
            <div className="font-body-readable flex items-center gap-3 mb-4 text-[10px] text-[#444]">
              <span className="flex items-center gap-1"><iconify-icon icon="lucide:clock" /> 12 sem.</span>
              <span className="level-intermediate text-[10px] font-medium px-2 py-0.5 rounded-full">Intermediaire</span>
            </div>
            <Link href="/parcours" id="parcours-3d-link" className="text-[11px] text-[#4F8EF7] font-medium flex items-center gap-1 hover:gap-2 transition-all">
              Decouvrir <iconify-icon icon="lucide:arrow-right" style={{ fontSize: "12px" }} />
            </Link>
          </div>

          <div className="bg-[#111] border border-white/[0.07] rounded-2xl p-5 card-hover project-card">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/15 flex items-center justify-center mb-4">
              <iconify-icon icon="lucide:video" className="text-red-400" style={{ fontSize: "18px" }} />
            </div>
            <div className="font-venite text-[12px] text-white mb-1.5">CREATION VIDEO</div>
            <p className="font-body-readable text-[11px] text-[#555] leading-relaxed mb-4">Montage video, YouTube et outils de creation de contenu IA.</p>
            <div className="font-body-readable flex items-center gap-3 mb-4 text-[10px] text-[#444]">
              <span className="flex items-center gap-1"><iconify-icon icon="lucide:clock" /> 7 sem.</span>
              <span className="level-beginner text-[10px] font-medium px-2 py-0.5 rounded-full">Debutant</span>
            </div>
            <Link href="/parcours" id="parcours-video-link" className="text-[11px] text-[#4F8EF7] font-medium flex items-center gap-1 hover:gap-2 transition-all">
              Decouvrir <iconify-icon icon="lucide:arrow-right" style={{ fontSize: "12px" }} />
            </Link>
          </div>

          <div className="bg-[#111] border border-white/[0.07] rounded-2xl p-5 card-hover project-card">
            <div className="w-10 h-10 rounded-xl bg-pink-500/10 border border-pink-500/15 flex items-center justify-center mb-4">
              <iconify-icon icon="lucide:music" className="text-pink-400" style={{ fontSize: "18px" }} />
            </div>
            <div className="font-venite text-[12px] text-white mb-1.5">MUSIQUE ET AUDIO</div>
            <p className="font-body-readable text-[11px] text-[#555] leading-relaxed mb-4">Creation musicale, podcasts et outils audio numeriques.</p>
            <div className="font-body-readable flex items-center gap-3 mb-4 text-[10px] text-[#444]">
              <span className="flex items-center gap-1"><iconify-icon icon="lucide:clock" /> 6 sem.</span>
              <span className="level-beginner text-[10px] font-medium px-2 py-0.5 rounded-full">Debutant</span>
            </div>
            <Link href="/parcours" id="parcours-musique-link" className="text-[11px] text-[#4F8EF7] font-medium flex items-center gap-1 hover:gap-2 transition-all">
              Decouvrir <iconify-icon icon="lucide:arrow-right" style={{ fontSize: "12px" }} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
