export default function ValuesSection() {
  return (
    <section className="py-28 relative overflow-hidden" id="valeurs">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-violet-900/[0.02] to-transparent pointer-events-none" />
      <div className="max-w-[1320px] mx-auto px-8">
        <div className="mb-16">
          <div className="section-label mb-4">PLATEFORME</div>
          <h2 className="font-valorax gradient-text" style={{ fontSize: "clamp(36px, 3.5vw, 54px)", letterSpacing: "-0.02em" }}>
            UN CADRE POUR PROGRESSER ET CONSTRUIRE
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          <div className="bg-[#111] border border-white/[0.07] rounded-2xl p-6 card-hover cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/15 flex items-center justify-center mb-5">
              <iconify-icon icon="lucide:map" className="text-[#4F8EF7]" style={{ fontSize: "18px" }} />
            </div>
            <div className="font-venite text-[13px] text-white mb-3">PARCOURS GUIDES</div>
            <p className="font-body-readable text-[12px] text-[#666] leading-relaxed">
              Un chemin clair pour savoir quoi apprendre, quoi pratiquer et comment progresser, même en partant de zéro.
            </p>
          </div>

          <div className="bg-[#111] border border-white/[0.07] rounded-2xl p-6 card-hover cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/15 flex items-center justify-center mb-5">
              <iconify-icon icon="lucide:bot" className="text-[#9B6DFF]" style={{ fontSize: "18px" }} />
            </div>
            <div className="font-venite text-[13px] text-white mb-3">IA COMME ACCELERATEUR</div>
            <p className="font-body-readable text-[12px] text-[#666] leading-relaxed">
              Utilise l'intelligence artificielle pour aller plus vite, mieux comprendre et transformer tes idées en actions concrètes.
            </p>
          </div>

          <div className="bg-[#151515] border border-white/[0.07] rounded-2xl p-6 card-hover cursor-pointer" style={{ borderColor: "rgba(79,142,247,0.12)", boxShadow: "0 0 40px rgba(79,142,247,0.06)" }}>
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/15 flex items-center justify-center mb-5">
              <iconify-icon icon="lucide:hammer" className="text-[#22D3EE]" style={{ fontSize: "18px" }} />
            </div>
            <div className="font-venite text-[13px] text-white mb-3">APPRENDRE EN CONSTRUISANT</div>
            <p className="font-body-readable text-[12px] text-[#666] leading-relaxed">
              Progresse grâce aux ressources, exercices, projets et sessions pratiques, pas seulement avec de la théorie.
            </p>
          </div>

          <div className="bg-[#111] border border-white/[0.07] rounded-2xl p-6 card-hover cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/15 flex items-center justify-center mb-5">
              <iconify-icon icon="lucide:layers" className="text-orange-400" style={{ fontSize: "18px" }} />
            </div>
            <div className="font-venite text-[13px] text-white mb-3">PROJETS REELS</div>
            <p className="font-body-readable text-[12px] text-[#666] leading-relaxed">
              Construis des réalisations concrètes que tu peux utiliser, partager ou développer davantage.
            </p>
          </div>

          <div className="bg-[#111] border border-white/[0.07] rounded-2xl p-6 card-hover cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-green-500/10 border border-green-500/15 flex items-center justify-center mb-5">
              <iconify-icon icon="lucide:users" className="text-green-400" style={{ fontSize: "18px" }} />
            </div>
            <div className="font-venite text-[13px] text-white mb-3">COMMUNAUTE ACTIVE</div>
            <p className="font-body-readable text-[12px] text-[#666] leading-relaxed">
              Ne construis plus seul. Échange, collabore et progresse avec d'autres créateurs.
            </p>
          </div>

          <div className="bg-[#111] border border-white/[0.07] rounded-2xl p-6 card-hover cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/15 flex items-center justify-center mb-5">
              <iconify-icon icon="lucide:book-open" className="text-[#4F8EF7]" style={{ fontSize: "18px" }} />
            </div>
            <div className="font-venite text-[13px] text-white mb-3">RESSOURCES SELECTIONNEES</div>
            <p className="font-body-readable text-[12px] text-[#666] leading-relaxed">
              Guides, vidéos, outils et templates soigneusement choisis pour t'aider à avancer plus vite.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
