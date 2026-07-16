import Link from "next/link";

export default function SessionsLiveSection() {
  return (
    <section className="py-28 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-900/[0.03] to-transparent pointer-events-none" />
      <div className="max-w-[1320px] mx-auto px-8">
        <div className="section-label mb-4">LIVE</div>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between mb-14">
          <h2 className="font-valorax gradient-text" style={{ fontSize: "clamp(36px, 3.5vw, 54px)", letterSpacing: "-0.02em" }}>
            APPRENDRE ENSEMBLE
          </h2>
          <Link href="/communaute" id="sessions-all-link" className="btn-secondary inline-flex items-center gap-2 self-start lg:self-auto">
            Voir toutes les sessions
            <iconify-icon icon="lucide:arrow-right" style={{ fontSize: "14px" }} />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div>
            <p className="font-body-readable text-[#666] text-[15px] leading-relaxed mb-8">
              Participe a des sessions de pratique en direct avec la communaute. Pose des questions, construis avec d'autres, avance plus vite.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                  <iconify-icon icon="lucide:wrench" className="text-[#4F8EF7]" style={{ fontSize: "12px" }} />
                </div>
                <span className="font-body-readable text-[13px] text-[#888]">Ateliers pratiques</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-lg bg-violet-500/10 flex items-center justify-center flex-shrink-0">
                  <iconify-icon icon="lucide:help-circle" className="text-[#9B6DFF]" style={{ fontSize: "12px" }} />
                </div>
                <span className="font-body-readable text-[13px] text-[#888]">Questions & reponses</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-lg bg-cyan-500/10 flex items-center justify-center flex-shrink-0">
                  <iconify-icon icon="lucide:users-2" className="text-[#22D3EE]" style={{ fontSize: "12px" }} />
                </div>
                <span className="font-body-readable text-[13px] text-[#888]">Construction collaborative</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-lg bg-orange-500/10 flex items-center justify-center flex-shrink-0">
                  <iconify-icon icon="lucide:bug" className="text-orange-400" style={{ fontSize: "12px" }} />
                </div>
                <span className="font-body-readable text-[13px] text-[#888]">Debogage en direct</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-lg bg-green-500/10 flex items-center justify-center flex-shrink-0">
                  <iconify-icon icon="lucide:presentation" className="text-green-400" style={{ fontSize: "12px" }} />
                </div>
                <span className="font-body-readable text-[13px] text-[#888]">Masterclass & Demos</span>
              </div>
            </div>
          </div>

          {/* Upcoming sessions list */}
          <div className="space-y-3">
            <div className="bg-[#111] border border-white/[0.07] rounded-xl p-5 card-hover flex items-center gap-3 sm:gap-5">
              <div className="w-14 h-14 rounded-xl bg-blue-500/10 border border-blue-500/15 flex flex-col items-center justify-center flex-shrink-0">
                <div className="font-body-readable text-[10px] text-[#555] font-medium">JUN</div>
                <div className="text-[18px] font-bold text-[#4F8EF7] leading-none">24</div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-venite text-[13px] text-white mb-1">ATELIER AGENTS IA</div>
                <div className="font-body-readable text-[11px] text-[#555]">Construire son premier agent IA avec n8n</div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="flex items-center justify-end gap-1.5 mb-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                  <span className="font-body-readable text-[11px] text-green-400">Live</span>
                </div>
                <div className="font-body-readable text-[11px] text-[#555]">47 inscrits</div>
              </div>
            </div>

            <div className="bg-[#111] border border-white/[0.07] rounded-xl p-5 card-hover flex items-center gap-3 sm:gap-5">
              <div className="w-14 h-14 rounded-xl bg-violet-500/10 border border-violet-500/15 flex flex-col items-center justify-center flex-shrink-0">
                <div className="font-body-readable text-[10px] text-[#555] font-medium">JUN</div>
                <div className="text-[18px] font-bold text-[#9B6DFF] leading-none">27</div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-venite text-[13px] text-white mb-1">MASTERCLASS WEB3</div>
                <div className="font-body-readable text-[11px] text-[#555]">Creer ta premiere dApp avec wallet connecte</div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="flex items-center justify-end gap-1.5 mb-1">
                  <iconify-icon icon="lucide:calendar" className="text-[#555]" style={{ fontSize: "11px" }} />
                  <span className="font-body-readable text-[11px] text-[#555]">A venir</span>
                </div>
                <div className="font-body-readable text-[11px] text-[#555]">23 inscrits</div>
              </div>
            </div>

            <div className="bg-[#111] border border-white/[0.07] rounded-xl p-5 card-hover flex items-center gap-3 sm:gap-5">
              <div className="w-14 h-14 rounded-xl bg-cyan-500/10 border border-cyan-500/15 flex flex-col items-center justify-center flex-shrink-0">
                <div className="font-body-readable text-[10px] text-[#555] font-medium">JUL</div>
                <div className="text-[18px] font-bold text-[#22D3EE] leading-none">02</div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-venite text-[13px] text-white mb-1">WORKSHOP 3D IMMERSIF</div>
                <div className="font-body-readable text-[11px] text-[#555]">Intro Three.js et React Three Fiber en direct</div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="flex items-center justify-end gap-1.5 mb-1">
                  <iconify-icon icon="lucide:calendar" className="text-[#555]" style={{ fontSize: "11px" }} />
                  <span className="font-body-readable text-[11px] text-[#555]">A venir</span>
                </div>
                <div className="font-body-readable text-[11px] text-[#555]">18 inscrits</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}