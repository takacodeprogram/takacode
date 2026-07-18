import Link from "next/link";
import CountUpStat from "./CountUpStat";

interface HeroStatProps {
  value: string | number | null | undefined;
  suffix?: string;
  label: string;
}

interface Stats {
  members?: number | null;
  submittedProjects?: number | null;
  publishedTracks?: number | null;
}

function HeroStat({ value, suffix = "", label }: HeroStatProps) {
  const hasValue = Number.isFinite(Number(value));

  return (
    <div>
      {hasValue ? (
        <CountUpStat end={Number(value)} suffix={suffix} className="stat-value text-[28px] text-white mb-0.5" />
      ) : (
        <div className="stat-value text-[28px] text-white mb-0.5">—</div>
      )}
      <div className="font-body-readable text-[12px] text-[#555] font-medium">{label}</div>
    </div>
  );
}

export default function Hero({ stats = null }: { stats?: Stats | null }) {
  return (
    <section className="relative pt-[64px] min-h-screen flex items-center overflow-hidden" id="hero">
      <div className="hero-glow w-[700px] h-[700px] bg-blue-500/[0.06] -left-[200px] top-[50px]" />
      <div className="hero-glow w-[500px] h-[500px] bg-violet-500/[0.08] right-[100px] top-[100px]" />
      <div className="hero-glow w-[400px] h-[400px] bg-blue-400/[0.04] left-[40%] bottom-0" />

      <div className="relative z-10 max-w-[1320px] mx-auto px-8 w-full py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-center">
          <div>
            <div className="animate-fade-up mb-7">
              <span className="tag-badge font-venite-italic">
                <span
                  className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block"
                  style={{ animation: "pulse-glow 2s ease-in-out infinite" }}
                />
                PLATEFORME DE CREATION DE PROJETS
              </span>
            </div>

            <h1 className="font-valorax animate-fade-up-d1 mb-6 hero-title">
              CREE TON PROJET.
              <br />
              <span className="gradient-text-blue">PUBLIE ET MONETISE.</span>
            </h1>

            <p className="animate-fade-up-d2 font-body-readable text-[#9A9A9A] text-[15px] leading-relaxed mb-9 max-w-[460px]">
              TakaCode t'aide a transformer tes idees en projets digitaux concrets, les publier en ligne et generer des revenus. Parcours guides, templates, IA et communaute pour accelerer chaque etape.
            </p>

            <div className="animate-fade-up-d3 flex flex-col sm:flex-row sm:items-center gap-4 mb-12">
              <Link
                href="/projets"
                id="hero-cta-primary"
                className="btn-primary glow-btn flex items-center justify-center gap-2"
                style={{ fontSize: "14px", padding: "14px 28px" }}
              >
                Commencer un projet
              </Link>
              <Link
                href="/parcours"
                id="hero-cta-secondary"
                className="btn-secondary flex items-center justify-center gap-2"
                style={{ fontSize: "14px", padding: "14px 28px" }}
              >
                Explorer les parcours projets
              </Link>
            </div>

            <div className="animate-fade-up-d4 grid grid-cols-3 gap-4 sm:gap-8 pt-8 border-t border-white/[0.06] max-w-[520px]">
              <HeroStat value={stats?.members} label="Membres inscrits" />
              <HeroStat value={stats?.submittedProjects} label="Projets realises" />
              <HeroStat value={stats?.publishedTracks} label="Parcours projets" />
            </div>
          </div>

          <div className="float-anim relative pt-20 pb-20 sm:pt-12 sm:pb-12">
            <div className="bg-[#111] border border-white/[0.07] rounded-2xl px-6 py-8 glow-blue relative overflow-hidden z-10">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.02] to-violet-500/[0.03]" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <div className="section-label font-venite-italic mb-1">ROADMAP PROJET</div>
                    <div className="font-body-readable text-[12px] text-[#555]">Progression active</div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-green-400" style={{ animation: "pulse-glow 2s ease infinite" }} />
                    <span className="font-body-readable text-[11px] text-green-400">En cours</span>
                  </div>
                </div>

                <div className="space-y-4 roadmap-progress-list">
                  <div className="roadmap-progress-item roadmap-progress-item-1">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-venite-italic text-[12px] text-[#888]">IDEE</span>
                      <span className="font-body-readable text-[11px] text-green-400">Complete</span>
                    </div>
                    <div className="h-1 bg-white/[0.05] rounded-full overflow-hidden">
                      <div
                        className="progress-bar h-full roadmap-progress-fill"
                        style={{ "--target-width": "100%", "--progress-delay": "0.1s", "--progress-start": "#22c55e", "--progress-end": "#86efac", "--progress-accent": "#dcfce7", "--progress-glow": "rgba(34,197,94,0.45)" } as React.CSSProperties}
                      />
                    </div>
                  </div>

                  <div className="roadmap-progress-item roadmap-progress-item-2">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-venite-italic text-[12px] text-[#888]">PARCOURS</span>
                      <span className="font-body-readable text-[11px] text-[#4F8EF7]">En cours</span>
                    </div>
                    <div className="h-1 bg-white/[0.05] rounded-full overflow-hidden">
                      <div
                        className="progress-bar h-full roadmap-progress-fill"
                        style={{ "--target-width": "62%", "--progress-delay": "0.28s", "--progress-start": "#4F8EF7", "--progress-end": "#22D3EE", "--progress-accent": "#bfdbfe", "--progress-glow": "rgba(79,142,247,0.42)" } as React.CSSProperties}
                      />
                    </div>
                  </div>

                  <div className="roadmap-progress-item roadmap-progress-item-3">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-venite-italic text-[12px] text-[#555]">MONETISATION</span>
                      <span className="font-body-readable text-[11px] text-[#555]">A venir</span>
                    </div>
                    <div className="h-1 bg-white/[0.05] rounded-full overflow-hidden">
                      <div
                        className="progress-bar h-full roadmap-progress-fill"
                        style={{ "--target-width": "15%", "--progress-delay": "0.46s", "--progress-start": "#f59e0b", "--progress-end": "#f97316", "--progress-accent": "#fdba74", "--progress-glow": "rgba(245,158,11,0.4)" } as React.CSSProperties}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div
              className="absolute bottom-4 left-2 sm:-bottom-6 sm:-left-6 bg-[#151515] border border-white/[0.07] rounded-xl p-3.5 shadow-xl w-[250px] z-0"
              style={{ animation: "float 5s ease-in-out 1s infinite" }}
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                  <span className="font-venite-italic text-[10px] text-green-400">OK</span>
                </div>
                <div>
                  <div className="font-venite-italic text-[11px] text-white">PROJET PUBLIE</div>
                  <div className="font-body-readable text-[10px] text-[#555]">Application web</div>
                </div>
              </div>
            </div>

            <div
              className="absolute top-4 right-2 sm:-top-6 sm:-right-4 bg-[#151515] border border-white/[0.07] rounded-xl p-3.5 shadow-xl z-0"
              style={{ animation: "float 5s ease-in-out 0.5s infinite" }}
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                  <span className="font-venite-italic text-[10px] text-blue-400">LIVE</span>
                </div>
                <div>
                  <div className="font-venite-italic text-[11px] text-white">SESSION LIVE</div>
                  <div className="font-body-readable text-[10px] text-[#555]">Dans 2h - 34 inscrits</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
