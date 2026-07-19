export default function ValuesSection() {
  return (
    <section className="py-28 relative overflow-hidden" id="valeurs">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-violet-900/[0.02] to-transparent pointer-events-none" />
      <div className="max-w-[1320px] mx-auto px-8">
        <div className="mb-16">
          <div className="section-label mb-4">Plateforme</div>
<h2 className="font-valorax gradient-text" style={{ fontSize: "clamp(36px, 3.5vw, 54px)", letterSpacing: "-0.02em" }}>
Un cadre pour créer et monétiser
</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          <div className="bg-[#111] border border-white/[0.07] rounded-2xl p-6 card-hover cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/15 flex items-center justify-center mb-5">
              <iconify-icon icon="lucide:target" className="text-[#4F8EF7]" style={{ fontSize: "18px" }} />
            </div>
            <div className="font-venite text-[13px] text-white mb-3">Projet central</div>
            <p className="font-body-readable text-[12px] text-[#666] leading-relaxed">
              Tout commence par ton projet. Les parcours, ressources et outils sont la pour t'aider a le réaliser, pas l'inverse.
            </p>
          </div>

          <div className="bg-[#111] border border-white/[0.07] rounded-2xl p-6 card-hover cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/15 flex items-center justify-center mb-5">
              <iconify-icon icon="lucide:bot" className="text-[#9B6DFF]" style={{ fontSize: "18px" }} />
            </div>
            <div className="font-venite text-[13px] text-white mb-3">IA accélératrice</div>
            <p className="font-body-readable text-[12px] text-[#666] leading-relaxed">
              Utilise l'IA pour coder plus vite, mieux concevoir et automatiser les tâches repetitives de ton projet.
            </p>
          </div>

          <div className="bg-[#151515] border border-white/[0.07] rounded-2xl p-6 card-hover cursor-pointer" style={{ borderColor: "rgba(79,142,247,0.12)", boxShadow: "0 0 40px rgba(79,142,247,0.06)" }}>
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/15 flex items-center justify-center mb-5">
              <iconify-icon icon="lucide:hammer" className="text-[#22D3EE]" style={{ fontSize: "18px" }} />
            </div>
            <div className="font-venite text-[13px] text-white mb-3">Apprendre en construisant</div>
            <p className="font-body-readable text-[12px] text-[#666] leading-relaxed">
              Progresse en produisant des livrables concrets, pas seulement en accumulant de la théorie.
            </p>
          </div>

          <div className="bg-[#111] border border-white/[0.07] rounded-2xl p-6 card-hover cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/15 flex items-center justify-center mb-5">
              <iconify-icon icon="lucide:wallet" className="text-orange-400" style={{ fontSize: "18px" }} />
            </div>
            <div className="font-venite text-[13px] text-white mb-3">Monétisation</div>
            <p className="font-body-readable text-[12px] text-[#666] leading-relaxed">
              Chaque projet est concu pour pouvoir être monétise : abonnements, produits, pubs, affiliation.
            </p>
          </div>

          <div className="bg-[#111] border border-white/[0.07] rounded-2xl p-6 card-hover cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-green-500/10 border border-green-500/15 flex items-center justify-center mb-5">
              <iconify-icon icon="lucide:users" className="text-green-400" style={{ fontSize: "18px" }} />
            </div>
            <div className="font-venite text-[13px] text-white mb-3">Communauté active</div>
            <p className="font-body-readable text-[12px] text-[#666] leading-relaxed">
              Ne construis plus seul. Échange, collabore et progresse avec d'autres créateurs.
            </p>
          </div>

          <div className="bg-[#111] border border-white/[0.07] rounded-2xl p-6 card-hover cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/15 flex items-center justify-center mb-5">
              <iconify-icon icon="lucide:rocket" className="text-[#4F8EF7]" style={{ fontSize: "18px" }} />
            </div>
            <div className="font-venite text-[13px] text-white mb-3">Du déploiement au revenu</div>
            <p className="font-body-readable text-[12px] text-[#666] leading-relaxed">
              De la première ligne de code a la première vente, on t'accompagne à chaque étape.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
