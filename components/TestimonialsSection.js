export default function TestimonialsSection() {
  return (
    <section className="py-28">
      <div className="max-w-[1320px] mx-auto px-8">
        <div className="text-center mb-16">
          <div className="section-label mb-4">TEMOIGNAGES</div>
          <h2 className="font-valorax gradient-text" style={{ fontSize: "clamp(36px, 3.5vw, 54px)", letterSpacing: "-0.02em" }}>
            ILS ONT CONSTRUIT
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="bg-[#111] border border-white/[0.07] rounded-2xl p-7 testimonial-card card-hover">
            <div className="flex items-center gap-1 mb-5">
              <iconify-icon icon="lucide:star" className="text-yellow-400" style={{ fontSize: "14px" }} />
              <iconify-icon icon="lucide:star" className="text-yellow-400" style={{ fontSize: "14px" }} />
              <iconify-icon icon="lucide:star" className="text-yellow-400" style={{ fontSize: "14px" }} />
              <iconify-icon icon="lucide:star" className="text-yellow-400" style={{ fontSize: "14px" }} />
              <iconify-icon icon="lucide:star" className="text-yellow-400" style={{ fontSize: "14px" }} />
            </div>
            <p className="font-body-readable text-[13px] text-[#888] leading-relaxed mb-6 italic">
              "Je suis venu sans aucune experience en programmation. En 3 mois, j'ai lance mon premier site e-commerce. TakaCode est vraiment different des autres plateformes."
            </p>
            <div className="flex items-center gap-3 pt-5 border-t border-white/[0.05]">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-cyan-500 flex-shrink-0" />
              <div>
                <div className="text-[13px] font-semibold text-white">Kofi Mensah</div>
                <div className="font-body-readable text-[11px] text-[#555]">Parcours Developpement Web</div>
              </div>
            </div>
          </div>

          <div className="bg-[#151515] border rounded-2xl p-7 testimonial-card card-hover" style={{ borderColor: "rgba(79,142,247,0.15)", boxShadow: "0 0 40px rgba(79,142,247,0.06)" }}>
            <div className="flex items-center gap-1 mb-5">
              <iconify-icon icon="lucide:star" className="text-yellow-400" style={{ fontSize: "14px" }} />
              <iconify-icon icon="lucide:star" className="text-yellow-400" style={{ fontSize: "14px" }} />
              <iconify-icon icon="lucide:star" className="text-yellow-400" style={{ fontSize: "14px" }} />
              <iconify-icon icon="lucide:star" className="text-yellow-400" style={{ fontSize: "14px" }} />
              <iconify-icon icon="lucide:star" className="text-yellow-400" style={{ fontSize: "14px" }} />
            </div>
            <p className="font-body-readable text-[13px] text-[#888] leading-relaxed mb-6 italic">
              "Les sessions live ont tout change pour moi. Pouvoir coder en temps reel avec quelqu'un qui m'aide, c'est exactement ce qu'il me manquait pour progresser rapidement."
            </p>
            <div className="flex items-center gap-3 pt-5 border-t border-white/[0.05]">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-400 to-pink-500 flex-shrink-0" />
              <div>
                <div className="text-[13px] font-semibold text-white">Fatou Diallo</div>
                <div className="font-body-readable text-[11px] text-[#555]">Parcours Automatisation IA</div>
              </div>
            </div>
          </div>

          <div className="bg-[#111] border border-white/[0.07] rounded-2xl p-7 testimonial-card card-hover">
            <div className="flex items-center gap-1 mb-5">
              <iconify-icon icon="lucide:star" className="text-yellow-400" style={{ fontSize: "14px" }} />
              <iconify-icon icon="lucide:star" className="text-yellow-400" style={{ fontSize: "14px" }} />
              <iconify-icon icon="lucide:star" className="text-yellow-400" style={{ fontSize: "14px" }} />
              <iconify-icon icon="lucide:star" className="text-yellow-400" style={{ fontSize: "14px" }} />
              <iconify-icon icon="lucide:star" className="text-yellow-400" style={{ fontSize: "14px" }} />
            </div>
            <p className="font-body-readable text-[13px] text-[#888] leading-relaxed mb-6 italic">
              "J'ai cree un dashboard de suivi pour mon projet agricole grace au parcours Agritech. L'assistant IA m'a guide etape par etape. Incroyable pour quelqu'un qui ne savait pas coder."
            </p>
            <div className="flex items-center gap-3 pt-5 border-t border-white/[0.05]">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex-shrink-0" />
              <div>
                <div className="text-[13px] font-semibold text-white">Amara Toure</div>
                <div className="font-body-readable text-[11px] text-[#555]">Parcours Agritech & Donnees</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
