import Link from "next/link";

export default function RessourcesSection() {
  return (
    <section className="py-28" id="ressources">
      <div className="max-w-[1320px] mx-auto px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div>
            <div className="section-label mb-4">BIBLIOTHEQUE</div>
            <h2 className="font-valorax gradient-text mb-6" style={{ fontSize: "clamp(36px, 3.5vw, 54px)", letterSpacing: "-0.02em" }}>
              RESSOURCES POUR AVANCER
            </h2>
            <p className="font-body-readable text-[#666] text-[15px] leading-relaxed mb-8 max-w-[420px]">
              Guides, tutoriels, templates, prompts, outils recommandes et bien plus. Tout ce dont tu as besoin pour progresser.
            </p>

            {/* Resource category pills */}
            <div className="flex flex-wrap gap-3 mb-10">
              <span className="community-tag">Guides</span>
              <span className="community-tag">Tutoriels</span>
              <span className="community-tag">Videos</span>
              <span className="community-tag">Templates</span>
              <span className="community-tag">Prompts IA</span>
              <span className="community-tag">Outils</span>
              <span className="community-tag">Cheat Sheets</span>
              <span className="community-tag">Bibliotheque IA</span>
            </div>

            <Link href="/ressources" id="ressources-cta-link" className="btn-primary glow-btn inline-flex items-center gap-2" style={{ fontSize: "14px", padding: "14px 28px" }}>
              Explorer les ressources
              <iconify-icon icon="lucide:arrow-right" style={{ fontSize: "16px" }} />
            </Link>
          </div>

          {/* Resource inventory cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-[#111] border border-white/[0.07] rounded-2xl p-5 card-hover">
              <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/15 flex items-center justify-center mb-4">
                <iconify-icon icon="lucide:file-text" className="text-[#4F8EF7]" style={{ fontSize: "16px" }} />
              </div>
              <div className="font-venite text-[12px] text-white mb-1.5">GUIDES</div>
              <p className="font-body-readable text-[11px] text-[#555] mb-3">Explications simples et structurees pour chaque concept cle.</p>
              <div className="font-body-readable text-[10px] text-[#444]">124 guides disponibles</div>
            </div>

            <div className="bg-[#111] border border-white/[0.07] rounded-2xl p-5 card-hover">
              <div className="w-9 h-9 rounded-xl bg-red-500/10 border border-red-500/15 flex items-center justify-center mb-4">
                <iconify-icon icon="lucide:play-circle" className="text-red-400" style={{ fontSize: "16px" }} />
              </div>
              <div className="font-venite text-[12px] text-white mb-1.5">VIDEOS</div>
              <p className="font-body-readable text-[11px] text-[#555] mb-3">Demonstrations et tutoriels pratiques en video.</p>
              <div className="font-body-readable text-[10px] text-[#444]">89 videos</div>
            </div>

            <div className="bg-[#151515] border border-white/[0.07] rounded-2xl p-5 card-hover" style={{ borderColor: "rgba(79,142,247,0.12)" }}>
              <div className="w-9 h-9 rounded-xl bg-violet-500/10 border border-violet-500/15 flex items-center justify-center mb-4">
                <iconify-icon icon="lucide:layout-template" className="text-[#9B6DFF]" style={{ fontSize: "16px" }} />
              </div>
              <div className="font-venite text-[12px] text-white mb-1.5">MODELES ET TEMPLATES</div>
              <p className="font-body-readable text-[11px] text-[#555] mb-3">Templates de prompts, documents et modeles reutilisables.</p>
              <div className="font-body-readable text-[10px] text-[#444]">67 templates</div>
            </div>

            <div className="bg-[#111] border border-white/[0.07] rounded-2xl p-5 card-hover">
              <div className="w-9 h-9 rounded-xl bg-orange-500/10 border border-orange-500/15 flex items-center justify-center mb-4">
                <iconify-icon icon="lucide:wrench" className="text-orange-400" style={{ fontSize: "16px" }} />
              </div>
              <div className="font-venite text-[12px] text-white mb-1.5">OUTILS</div>
              <p className="font-body-readable text-[11px] text-[#555] mb-3">Une selection d'outils pour aller plus loin rapidement.</p>
              <div className="font-body-readable text-[10px] text-[#444]">200+ outils references</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}