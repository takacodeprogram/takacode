import Link from "next/link";
import logoLight4 from "../assets/logos-light-png/logo-light-4.png";

const SIDEBAR_LINKS = [
  { id: "side-dash", href: "/dashboard", icon: "lucide:layout-grid", label: "Dashboard", active: true },
  { id: "side-parcours", href: "/parcours", icon: "lucide:map", label: "Mes parcours" },
  { id: "side-sessions", href: "/communaute#sessions", icon: "lucide:video", label: "Sessions live", live: true },
  { id: "side-projects", href: "/projets", icon: "lucide:folder-code", label: "Mes projets" },
  { id: "side-community", href: "/communaute", icon: "lucide:users", label: "Communaute" },
  { id: "side-resources", href: "/ressources", icon: "lucide:book-open", label: "Ressources" }
];

const PROJECTS = [
  { title: "AgriConnect Web", subtitle: "Modifie il y a 4h", icon: "lucide:globe", color: "text-cyan-400", bg: "bg-cyan-500/10" },
  { title: "N8N Automate", subtitle: "Modifie il y a 2j", icon: "lucide:zap", color: "text-orange-400", bg: "bg-orange-500/10" }
];

const RECOMMENDED = [
  {
    tag: "GUIDE",
    tagClass: "bg-blue-500/10 text-blue-400",
    icon: "lucide:file-text",
    iconClass: "text-[#4F8EF7]",
    title: "Guide : structure d'un agent n8n",
    desc: "Apprends a optimiser tes workflows pour la performance.",
    meta: "12 min de lecture"
  },
  {
    tag: "VIDEO",
    tagClass: "bg-red-500/10 text-red-400",
    icon: "lucide:youtube",
    iconClass: "text-red-500",
    title: "Les bases du prompt engineering",
    desc: "Maitrise les instructions pour obtenir de meilleurs resultats.",
    meta: "18 min - Video"
  }
];

export default function AdminDashboardPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] flex text-white">
      <aside className="w-[280px] border-r border-white/[0.05] bg-[#0A0A0A] sticky top-0 h-screen z-40 p-6 hidden lg:flex lg:flex-col">
        <div className="flex items-center gap-3 mb-10 pl-2">
          <img src={logoLight4.src} alt="TakaCode" className="h-8 w-auto" />
          <span className="font-valorax text-sm tracking-widest">TAKACODE</span>
        </div>

        <nav className="space-y-2 flex-1">
          {SIDEBAR_LINKS.map((link) => (
            <Link
              key={link.id}
              id={link.id}
              href={link.href}
              className={[
                "flex items-center justify-between rounded-xl px-4 py-3 text-[14px] font-medium transition-all",
                link.active
                  ? "bg-blue-500/10 text-[#4F8EF7] border border-blue-500/15"
                  : "text-[#888] hover:text-white hover:bg-white/[0.04]"
              ].join(" ")}
            >
              <span className="flex items-center gap-3">
                <iconify-icon icon={link.icon} />
                {link.label}
              </span>
              {link.live ? <span className="h-2 w-2 rounded-full bg-red-500" /> : null}
            </Link>
          ))}
        </nav>

        <div className="pt-6 border-t border-white/[0.05] space-y-2">
          <Link
            href="/dashboard"
            id="side-settings"
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-[14px] font-medium text-[#888] hover:text-white hover:bg-white/[0.04] transition-all"
          >
            <iconify-icon icon="lucide:settings" />
            Parametres
          </Link>
          <Link
            href="/connexion"
            id="side-logout"
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-[14px] font-medium text-red-400/70 hover:text-red-400 hover:bg-red-400/5 transition-all"
          >
            <iconify-icon icon="lucide:log-out" />
            Deconnexion
          </Link>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto p-6 md:p-8">
        <div className="lg:hidden mb-6 flex items-center gap-2 overflow-x-auto pb-1">
          <Link href="/dashboard" className="shrink-0 rounded-lg border border-blue-500/20 bg-blue-500/10 px-3 py-2 text-[11px] font-semibold text-[#4F8EF7]">Dashboard</Link>
          <Link href="/parcours" className="shrink-0 rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-[11px] font-semibold text-[#bbb]">Parcours</Link>
          <Link href="/projets" className="shrink-0 rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-[11px] font-semibold text-[#bbb]">Projets</Link>
          <Link href="/communaute" className="shrink-0 rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-[11px] font-semibold text-[#bbb]">Communaute</Link>
        </div>

        <header className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between mb-10 animate-fade-up">
          <div>
            <h1 className="font-valorax text-3xl mb-1">DASHBOARD</h1>
            <div className="flex items-center gap-3">
              <span className="section-label">Bienvenue Kofi</span>
              <span className="text-[#444] text-xs">-</span>
              <span className="text-[#666] text-xs">Derniere connexion il y a 2h</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-white/[0.03] border border-white/[0.06] rounded-xl min-w-[240px]">
              <iconify-icon icon="lucide:search" className="text-[#666]" />
              <input
                type="text"
                placeholder="Rechercher un cours..."
                className="bg-transparent outline-none text-sm text-white w-full"
              />
            </div>

            <button className="relative p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-[#888] hover:text-white transition-all">
              <iconify-icon icon="lucide:bell" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full border-2 border-[#0A0A0A]" />
            </button>

            <div className="flex items-center gap-3 pl-1">
              <div className="text-right hidden sm:block">
                <div className="text-[13px] font-semibold">Kofi Mensah</div>
                <div className="text-[11px] text-[#4ADE80]">Niveau 12 - Explorateur</div>
              </div>
              <div className="w-10 h-10 rounded-full border border-white/10 bg-gradient-to-br from-blue-400 to-cyan-500" />
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2 space-y-8">
            <section className="animate-fade-up" style={{ animationDelay: "0.1s" }}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-venite text-[13px] tracking-widest text-[#888]">EN COURS</h2>
                <Link href="/parcours" className="text-[11px] text-[#4F8EF7] font-semibold hover:underline">Voir tout</Link>
              </div>

              <div className="bg-gradient-to-br from-[#111] to-[#0D0D0D] border border-white/[0.06] rounded-[20px] p-6 md:p-8">
                <div className="flex flex-col md:flex-row gap-8 items-center">
                  <div className="w-32 h-32 rounded-2xl bg-blue-500/10 border border-blue-500/10 flex items-center justify-center flex-shrink-0">
                    <iconify-icon icon="lucide:bot" className="text-6xl text-[#4F8EF7]" />
                  </div>

                  <div className="flex-1 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="bg-violet-500/10 border border-violet-500/20 rounded-full px-3 py-1 text-[11px] text-[#9B6DFF] font-semibold uppercase tracking-[0.05em]">
                        AUTOMATISATION ET IA
                      </span>
                      <span className="text-xs text-[#666]">Etape 4 / 12</span>
                    </div>

                    <h3 className="font-valorax text-xl">CONSTRUIRE UN AGENT IA AVEC N8N</h3>

                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-[#888]">Progression globale</span>
                        <span className="font-bold text-[#4F8EF7]">42%</span>
                      </div>
                      <div className="h-1 rounded bg-white/[0.05] overflow-hidden">
                        <div className="h-full rounded bg-gradient-to-r from-[#4F8EF7] to-[#9B6DFF]" style={{ width: "42%" }} />
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <Link href="/parcours" className="btn-primary">Reprendre</Link>
                      <Link href="/parcours" className="btn-secondary">Details</Link>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <section className="animate-fade-up" style={{ animationDelay: "0.2s" }}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-venite text-[13px] tracking-widest text-[#888]">SESSIONS LIVE</h2>
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
                  </span>
                </div>

                <div className="bg-[#111] border border-white/[0.06] rounded-[20px] p-6 space-y-5">
                  <div className="flex items-center gap-4 pb-4 border-b border-white/[0.04]">
                    <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/15 flex flex-col items-center justify-center">
                      <span className="text-[9px] text-[#888]">JUN</span>
                      <span className="text-lg font-bold text-red-500 leading-none">24</span>
                    </div>
                    <div>
                      <div className="text-[13px] font-semibold">Atelier webhooks</div>
                      <div className="text-[11px] text-[#555]">Aujourd'hui a 20:00 - Discord</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 opacity-50">
                    <div className="w-12 h-12 rounded-xl bg-white/[0.03] border border-white/[0.05] flex flex-col items-center justify-center">
                      <span className="text-[9px] text-[#888]">JUN</span>
                      <span className="text-lg font-bold text-[#666] leading-none">27</span>
                    </div>
                    <div>
                      <div className="text-[13px] font-semibold">Masterclass React</div>
                      <div className="text-[11px] text-[#555]">Jeudi - Twitch Live</div>
                    </div>
                  </div>

                  <Link
                    href="/communaute#sessions"
                    className="w-full py-3 bg-white/[0.02] border border-white/[0.06] rounded-xl text-[12px] font-semibold hover:bg-white/[0.04] transition-all inline-flex justify-center"
                  >
                    Acceder au calendrier
                  </Link>
                </div>
              </section>

              <section className="animate-fade-up" style={{ animationDelay: "0.3s" }}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-venite text-[13px] tracking-widest text-[#888]">MES PROJETS</h2>
                </div>

                <div className="space-y-4">
                  {PROJECTS.map((project) => (
                    <Link
                      key={project.title}
                      href="/projets"
                      className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-4 flex items-center justify-between hover:border-white/10 transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-lg ${project.bg} flex items-center justify-center`}>
                          <iconify-icon icon={project.icon} className={project.color} />
                        </div>
                        <div>
                          <div className="text-[13px] font-semibold">{project.title}</div>
                          <div className="text-[10px] text-[#444]">{project.subtitle}</div>
                        </div>
                      </div>
                      <iconify-icon icon="lucide:chevron-right" className="text-[#333]" />
                    </Link>
                  ))}

                  <Link
                    href="/projets"
                    className="w-full py-3 border border-dashed border-white/[0.1] rounded-xl text-[11px] text-[#555] font-medium hover:border-white/[0.2] hover:text-[#888] transition-all flex items-center justify-center gap-2"
                  >
                    <iconify-icon icon="lucide:plus-circle" />
                    Nouveau projet
                  </Link>
                </div>
              </section>
            </div>

            <section className="animate-fade-up" style={{ animationDelay: "0.4s" }}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-venite text-[13px] tracking-widest text-[#888]">RESSOURCES RECOMMANDEES</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {RECOMMENDED.map((item) => (
                  <Link
                    key={item.title}
                    href="/ressources"
                    className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5 hover:bg-white/[0.04] transition-all cursor-pointer group"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <iconify-icon icon={item.icon} className={`${item.iconClass} text-2xl`} />
                      <span className={`text-[9px] px-2 py-1 rounded ${item.tagClass}`}>{item.tag}</span>
                    </div>
                    <h4 className="text-sm font-semibold mb-2">{item.title}</h4>
                    <p className="text-[11px] text-[#555] leading-relaxed mb-4">{item.desc}</p>
                    <div className="flex items-center gap-2 text-[10px] text-[#444] font-medium">
                      {item.meta}
                      <iconify-icon icon="lucide:arrow-right" className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          </div>

          <div className="space-y-8">
            <section className="animate-fade-up" style={{ animationDelay: "0.2s" }}>
              <div className="bg-gradient-to-b from-[#151515] to-[#111] border border-white/[0.06] rounded-[20px] p-6">
                <h2 className="font-venite text-[11px] tracking-[0.2em] text-[#4F8EF7] mb-6">STATISTIQUES</h2>

                <div className="grid grid-cols-2 gap-4">
                  {[
                    ["Projets", "08"],
                    ["Sessions", "14"],
                    ["Badges", "03"],
                    ["Points", "420"]
                  ].map(([label, value]) => (
                    <div key={label} className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-4">
                      <div className="text-[#555] text-[10px] uppercase font-bold mb-1">{label}</div>
                      <div className="text-2xl font-valorax">{value}</div>
                    </div>
                  ))}
                </div>

                <div className="mt-8">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-[#888]">Niveau suivant</span>
                    <span className="text-xs text-[#4F8EF7]">80%</span>
                  </div>
                  <div className="h-1 rounded bg-white/[0.05] overflow-hidden">
                    <div className="h-full rounded bg-gradient-to-r from-[#4F8EF7] to-[#9B6DFF]" style={{ width: "80%" }} />
                  </div>
                </div>
              </div>
            </section>

            <section className="animate-fade-up" style={{ animationDelay: "0.3s" }}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-venite text-[13px] tracking-widest text-[#888]">BADGES</h2>
              </div>

              <div className="flex flex-wrap gap-3">
                <div className="w-12 h-12 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                  <iconify-icon icon="lucide:compass" className="text-blue-400" />
                </div>
                <div className="w-12 h-12 rounded-full bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                  <iconify-icon icon="lucide:rocket" className="text-violet-400" />
                </div>
                <div className="w-12 h-12 rounded-full bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
                  <iconify-icon icon="lucide:message-square" className="text-orange-400" />
                </div>
                <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center opacity-30">
                  <iconify-icon icon="lucide:lock" className="text-white" />
                </div>
              </div>
            </section>

            <section className="animate-fade-up" style={{ animationDelay: "0.4s" }}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-venite text-[13px] tracking-widest text-[#888]">ACTIVITE</h2>
              </div>

              <div className="space-y-4">
                {[
                  ["#4F8EF7", "Projet AgriConnect mis a jour", "Il y a 4 heures"],
                  ["#9B6DFF", "Participation a IA Live Atelier", "Hier, 20:15"],
                  ["#4ADE80", "Nouveau badge : Explorer", "2 jours avant"]
                ].map(([color, title, time]) => (
                  <div key={title} className="flex gap-4 items-start">
                    <span className="w-2 h-2 rounded-full mt-1.5" style={{ background: color }} />
                    <div className="flex-1">
                      <div className="text-[12px] text-white font-medium">{title}</div>
                      <div className="text-[10px] text-[#555]">{time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
