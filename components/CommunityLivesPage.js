import Link from "next/link";

const FEATURED_SERVERS = [
  {
    id: "discord-web-btn",
    icon: "lucide:code-2",
    title: "Developpement web",
    description: "HTML, CSS, JS, React, Node.js. Aide, revue de code et partage de projets.",
    channels: ["aide-debutants", "projets-showcase", "ressources-web"],
    members: "1 240 membres",
    online: "142 en ligne",
    iconShell: "bg-blue-500/10 border-blue-500/20",
    iconColor: "#4F8EF7",
    borderTone: "rgba(79,142,247,0.18)"
  },
  {
    id: "discord-ia-btn",
    icon: "lucide:bot",
    title: "IA et automatisation",
    description: "ChatGPT, n8n, Make et agents IA. Workflows robustes et automatisations metier.",
    channels: ["prompts-partage", "agents-ia", "automatisations"],
    members: "980 membres",
    online: "98 en ligne",
    iconShell: "bg-violet-500/10 border-violet-500/20",
    iconColor: "#9B6DFF",
    borderTone: "rgba(155,109,255,0.2)"
  },
  {
    id: "discord-data-btn",
    icon: "lucide:bar-chart-3",
    title: "Analyse de donnees",
    description: "Excel, Power BI, Tableau, Python. Collecte, analyse et visualisation de donnees.",
    channels: ["excel-power-bi", "python-data", "kobocollect"],
    members: "720 membres",
    online: "56 en ligne",
    iconShell: "bg-cyan-500/10 border-cyan-500/20",
    iconColor: "#22D3EE",
    borderTone: "rgba(34,211,238,0.16)"
  },
  {
    id: "discord-agri-btn",
    icon: "lucide:leaf",
    title: "Agritech et terrain",
    description: "KoboCollect, ODK et outils numeriques pour les projets terrain et agricoles.",
    channels: ["kobocollect-odk", "projets-terrain", "ressources-agri"],
    members: "480 membres",
    online: "29 en ligne",
    iconShell: "bg-green-500/10 border-green-500/20",
    iconColor: "#4ADE80",
    borderTone: "rgba(74,222,128,0.16)"
  }
];

const SECONDARY_SERVERS = [
  {
    id: "discord-video-btn",
    icon: "lucide:video",
    title: "Creation video",
    meta: "380 membres - 18 en ligne",
    shell: "bg-red-500/10 border-red-500/20",
    color: "#f87171"
  },
  {
    id: "discord-music-btn",
    icon: "lucide:music",
    title: "Musique et audio",
    meta: "290 membres - 12 en ligne",
    shell: "bg-pink-500/10 border-pink-500/20",
    color: "#f472b6"
  },
  {
    id: "discord-challenges-btn",
    icon: "lucide:trophy",
    title: "Challenges",
    meta: "620 membres - 34 en ligne",
    shell: "bg-orange-500/10 border-orange-500/20",
    color: "#fb923c"
  },
  {
    id: "discord-mentorat-btn",
    icon: "lucide:graduation-cap",
    title: "Mentorat",
    meta: "470 membres - 21 en ligne",
    shell: "bg-indigo-500/10 border-indigo-500/20",
    color: "#818cf8"
  }
];

const UPCOMING_SESSIONS = [
  { day: "LUN", date: "24", title: "Atelier webhooks", meta: "20:00 - Discord", tone: "#ef4444", live: true },
  { day: "MER", date: "26", title: "Build un mini SaaS", meta: "19:30 - Twitch", tone: "#4F8EF7" },
  { day: "VEN", date: "28", title: "Prompting avance", meta: "20:30 - Discord", tone: "#9B6DFF" },
  { day: "SAM", date: "29", title: "Code review publique", meta: "16:00 - Discord", tone: "#22D3EE" }
];

const SPEAKERS = [
  {
    name: "Kofi Mensah",
    role: "Automatisation et IA",
    sessions: "36 sessions",
    accent: "from-blue-400 to-cyan-500"
  },
  {
    name: "Awa N'Diaye",
    role: "Produit et no-code",
    sessions: "28 sessions",
    accent: "from-violet-400 to-fuchsia-500"
  },
  {
    name: "Ibrahim Diallo",
    role: "Data et dashboarding",
    sessions: "22 sessions",
    accent: "from-emerald-400 to-teal-500"
  },
  {
    name: "Nina Toure",
    role: "Frontend et UX",
    sessions: "31 sessions",
    accent: "from-orange-400 to-red-500"
  }
];

export default function CommunityLivesPage() {
  return (
    <main className="pt-[64px]">
      <section className="relative min-h-[calc(100vh-64px)] flex items-center overflow-hidden">
        <div className="hero-glow w-[580px] h-[580px] bg-blue-500/[0.08] -left-[140px] top-[70px]" />
        <div className="hero-glow w-[520px] h-[520px] bg-violet-500/[0.1] right-[40px] top-[120px]" />
        <div className="hero-glow w-[320px] h-[320px] bg-cyan-500/[0.07] left-[45%] bottom-[90px]" />

        <div
          className="absolute inset-0 pointer-events-none z-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.012) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.012) 1px, transparent 1px)",
            backgroundSize: "60px 60px"
          }}
        />

        <div className="relative z-10 max-w-[1320px] mx-auto px-6 md:px-8 w-full py-20">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            <div>
              <div className="animate-fade-up mb-7 flex flex-wrap items-center gap-3">
                <span className="tag-badge">
                  <span className="pulse-dot" />
                  Communaute active
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#5865F2]/30 bg-[#5865F2]/10 px-3 py-1 text-[10px] font-semibold text-[#7b8cff] uppercase tracking-[0.06em]">
                  <iconify-icon icon="ic:baseline-discord" style={{ fontSize: "11px" }} />
                  Discord
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#9147FF]/30 bg-[#9147FF]/10 px-3 py-1 text-[10px] font-semibold text-[#B87FFF] uppercase tracking-[0.06em]">
                  <iconify-icon icon="mdi:twitch" style={{ fontSize: "11px" }} />
                  Twitch
                </span>
              </div>

              <h1
                className="font-valorax animate-fade-up-d1 mb-6"
                style={{ fontSize: "clamp(46px, 5vw, 76px)", lineHeight: 0.92, letterSpacing: "-0.02em" }}
              >
                PRATIQUE,
                <br />
                <span className="gradient-text-blue">PARTAGE</span> ET
                <br />
                <span
                  style={{
                    background: "linear-gradient(135deg, #9B6DFF 0%, #4F8EF7 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text"
                  }}
                >
                  CONSTRUIS
                </span>
              </h1>

              <p className="animate-fade-up-d2 text-[#888] text-[15px] leading-relaxed mb-9 max-w-[520px] font-body-readable">
                Rejoins la communaute TakaCode sur Discord et Twitch. Serveurs thematiques, sessions lives pratiques,
                animateurs experimentes. Tu progresses plus vite en construisant avec les autres.
              </p>

              <div className="animate-fade-up-d3 flex flex-wrap items-center gap-4 mb-12">
                <Link href="#rejoindre" id="hero-discord-btn" className="btn-primary glow-btn inline-flex items-center gap-2">
                  <iconify-icon icon="ic:baseline-discord" style={{ fontSize: "17px" }} />
                  Rejoindre Discord
                </Link>
                <Link
                  href="#sessions"
                  id="hero-twitch-btn"
                  className="inline-flex items-center gap-2 rounded-[8px] bg-[#9147FF] px-6 py-3 text-[13px] font-semibold hover:bg-[#7b2fbe] transition-colors"
                >
                  <iconify-icon icon="mdi:twitch" style={{ fontSize: "17px" }} />
                  Voir les lives
                </Link>
                <Link href="#serveurs" id="hero-discover-btn" className="btn-secondary inline-flex items-center gap-2">
                  Explorer
                  <iconify-icon icon="lucide:arrow-right" style={{ fontSize: "14px" }} />
                </Link>
              </div>

              <div className="animate-fade-up-d4 grid grid-cols-2 md:grid-cols-4 gap-5 pt-8 border-t border-white/[0.06]">
                {[
                  ["2 400+", "Membres actifs"],
                  ["127", "Sessions realisees"],
                  ["8", "Serveurs Discord"],
                  ["340", "En ligne maintenant"]
                ].map(([value, label]) => (
                  <div key={label}>
                    <div className="stat-value text-[26px] text-white mb-1">{value}</div>
                    <div className="font-body-readable text-[12px] text-[#555] font-medium">{label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative float-anim">
              <div className="bg-[#111] border border-white/[0.07] rounded-2xl overflow-hidden" style={{ borderColor: "rgba(145,71,255,0.24)" }}>
                <div className="relative h-52" style={{ background: "linear-gradient(135deg, rgba(145,71,255,0.14) 0%, rgba(79,142,247,0.08) 100%)" }}>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button className="w-16 h-16 rounded-full bg-[#9147FF]/20 border border-[#9147FF]/35 flex items-center justify-center">
                      <iconify-icon icon="lucide:play" style={{ fontSize: "28px", marginLeft: "3px", color: "#9147FF" }} />
                    </button>
                  </div>

                  <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-red-500/15 border border-red-500/30 px-3 py-1 text-[10px] text-red-400 font-bold tracking-[0.09em]">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                    LIVE
                  </div>

                  <div className="absolute top-3 right-3 rounded-lg bg-black/60 px-3 py-1 inline-flex items-center gap-1.5">
                    <iconify-icon icon="lucide:eye" className="text-[#888]" style={{ fontSize: "11px" }} />
                    <span className="text-[11px] text-[#888]">847 spectateurs</span>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                    <div className="font-venite text-[11px] text-white mb-0.5">ATELIER AGENTS IA - N8N + MAKE</div>
                    <div className="text-[10px] text-[#666] font-body-readable">TakaCode_Live - Parcours Automatisation</div>
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-400 to-blue-500 flex items-center justify-center text-[11px] font-bold">
                        TC
                      </div>
                      <div>
                        <div className="text-[12px] font-semibold text-white">TakaCode_Live</div>
                        <div className="text-[10px] text-[#555] font-body-readable">Twitch - En direct</div>
                      </div>
                    </div>

                    <button className="inline-flex items-center gap-1.5 rounded-lg bg-[#9147FF] px-3 py-1.5 text-[11px] font-semibold hover:bg-[#7b2fbe] transition-colors">
                      <iconify-icon icon="lucide:heart" style={{ fontSize: "12px" }} />
                      Suivre
                    </button>
                  </div>

                  <div className="space-y-2 text-[10px] font-body-readable">
                    <div className="text-[#888]"><span className="text-[#4F8EF7] font-semibold">moussa_k</span> super atelier, je comprends enfin n8n</div>
                    <div className="text-[#888]"><span className="text-[#4ADE80] font-semibold">awa_dev</span> merci pour les explications claires</div>
                    <div className="text-[#888]"><span className="text-[#9B6DFF] font-semibold">ibrahim_s</span> question: comment gerer les webhooks ?</div>
                  </div>
                </div>
              </div>

              <div className="hidden sm:flex absolute -bottom-5 -left-10 rounded-xl border border-white/[0.08] bg-[#151515] p-3.5 shadow-xl items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#5865F2]/15 border border-[#5865F2]/25 flex items-center justify-center">
                  <iconify-icon icon="ic:baseline-discord" style={{ fontSize: "15px", color: "#5865F2" }} />
                </div>
                <div>
                  <div className="text-[11px] font-semibold text-white">340 en ligne</div>
                  <div className="text-[10px] text-[#555] font-body-readable">sur Discord maintenant</div>
                </div>
              </div>

              <div className="hidden sm:flex absolute -top-5 -right-8 rounded-xl border border-white/[0.08] bg-[#151515] p-3.5 shadow-xl items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/25 flex items-center justify-center">
                  <iconify-icon icon="lucide:calendar" style={{ fontSize: "14px", color: "#4F8EF7" }} />
                </div>
                <div>
                  <div className="text-[11px] font-semibold text-white">Prochaine session</div>
                  <div className="text-[10px] text-[#555] font-body-readable">Demain - 20h - 62 inscrits</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="border-y border-white/[0.04] py-5 overflow-hidden">
        <div className="scroll-container">
          <div className="scroll-track">
            <div className="flex gap-4 items-center">
              {[
                "#dev-web",
                "#ia-automatisation",
                "#donnees-analyse",
                "#agritech",
                "Atelier Live IA",
                "Live Coding Web",
                "#projets-showcase",
                "Q&R Hebdo",
                "Masterclass mensuelle"
              ].map((tag) => (
                <span key={tag} className="community-tag text-[11px]">
                  {tag}
                </span>
              ))}
            </div>
            <div className="flex gap-4 items-center ml-4">
              {[
                "#dev-web",
                "#ia-automatisation",
                "#donnees-analyse",
                "#agritech",
                "Atelier Live IA",
                "Live Coding Web",
                "#projets-showcase",
                "Q&R Hebdo",
                "Masterclass mensuelle"
              ].map((tag) => (
                <span key={`repeat-${tag}`} className="community-tag text-[11px]">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <section id="serveurs" className="py-24">
        <div className="max-w-[1320px] mx-auto px-6 md:px-8">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-14">
            <div>
              <div className="section-label mb-4">DISCORD</div>
              <h2 className="font-valorax gradient-text" style={{ fontSize: "clamp(34px, 3.5vw, 52px)" }}>
                SERVEURS THEMATIQUES
              </h2>
              <p className="text-[#666] text-[14px] mt-3 max-w-[600px] font-body-readable">
                Chaque theme a son serveur dedie. Trouve ta communaute, pose tes questions et partage tes projets.
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-[12px] text-[#555] mb-1 font-body-readable">Membres totaux</div>
                <div className="stat-value text-[24px] text-white">6 840</div>
              </div>
              <div className="w-px h-10 bg-white/[0.06]" />
              <div className="text-right">
                <div className="text-[12px] text-[#555] mb-1 font-body-readable">En ligne</div>
                <div className="stat-value text-[24px] text-[#4ADE80]">340</div>
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5">
            {FEATURED_SERVERS.map((server) => (
              <article
                key={server.id}
                className="card-hover rounded-2xl border border-white/[0.07] bg-[#111] p-6"
                style={{ borderColor: server.borderTone }}
              >
                <div className="flex items-start justify-between mb-5">
                  <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center ${server.iconShell}`}>
                    <iconify-icon icon={server.icon} style={{ fontSize: "22px", color: server.iconColor }} />
                  </div>
                  <div className="inline-flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#4ADE80] animate-pulse" />
                    <span className="text-[10px] text-[#4ADE80] font-body-readable">{server.online}</span>
                  </div>
                </div>

                <h3 className="font-venite text-[14px] text-white mb-2">{server.title}</h3>
                <p className="text-[12px] text-[#666] leading-relaxed mb-4 font-body-readable">{server.description}</p>

                <div className="space-y-1.5 mb-5 text-[11px] text-[#555] font-body-readable">
                  {server.channels.map((channel) => (
                    <div key={channel} className="flex items-center gap-2">
                      <span className="text-[#333]">#</span>
                      {channel}
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex -space-x-2">
                    <span className="w-7 h-7 rounded-full border-2 border-[#0A0A0A] bg-gradient-to-br from-blue-400 to-cyan-500" />
                    <span className="w-7 h-7 rounded-full border-2 border-[#0A0A0A] bg-gradient-to-br from-violet-400 to-pink-500" />
                    <span className="w-7 h-7 rounded-full border-2 border-[#0A0A0A] bg-gradient-to-br from-green-400 to-emerald-500" />
                    <span className="w-7 h-7 rounded-full border-2 border-[#0A0A0A] bg-[#202020] text-[8px] text-[#666] inline-flex items-center justify-center">
                      +
                    </span>
                  </div>
                  <span className="text-[10px] text-[#444] font-body-readable">{server.members}</span>
                </div>

                <Link
                  href="#rejoindre"
                  id={server.id}
                  className="w-full justify-center inline-flex items-center gap-2 rounded-lg bg-[#5865F2] px-3 py-2 text-[11px] font-semibold hover:bg-[#4752c4] transition-colors"
                >
                  <iconify-icon icon="ic:baseline-discord" style={{ fontSize: "14px" }} />
                  Rejoindre le serveur
                </Link>
              </article>
            ))}
          </div>

          <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5 mt-5">
            {SECONDARY_SERVERS.map((server) => (
              <article key={server.id} className="card-hover rounded-xl border border-white/[0.06] bg-[#111] p-4 flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl border flex items-center justify-center flex-shrink-0 ${server.shell}`}>
                  <iconify-icon icon={server.icon} style={{ fontSize: "16px", color: server.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-venite text-[11px] text-white">{server.title}</div>
                  <div className="text-[10px] text-[#555] font-body-readable">{server.meta}</div>
                </div>
                <Link href="#rejoindre" id={server.id} className="text-[10px] text-[#4F8EF7] hover:text-white transition-colors font-medium">
                  Rejoindre
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="sessions" className="py-24 border-y border-white/[0.05] bg-[#0d0d0d]">
        <div className="max-w-[1320px] mx-auto px-6 md:px-8">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-14">
            <div>
              <div className="section-label mb-4">LIVES</div>
              <h2 className="font-valorax gradient-text-violet" style={{ fontSize: "clamp(34px, 3.5vw, 52px)" }}>
                SESSIONS EN DIRECT
              </h2>
              <p className="text-[#666] text-[14px] mt-3 max-w-[620px] font-body-readable">
                Retrouve les prochaines sessions Twitch et Discord, avec themes concrets et exercices applicables.
              </p>
            </div>

            <Link href="#rejoindre" className="btn-secondary inline-flex items-center gap-2 w-fit">
              Recevoir le calendrier
              <iconify-icon icon="lucide:calendar" style={{ fontSize: "14px" }} />
            </Link>
          </div>

          <div className="grid lg:grid-cols-[1.3fr_1fr] gap-6">
            <article className="rounded-2xl border border-white/[0.07] bg-[#111] overflow-hidden">
              <div className="h-56 md:h-64 bg-gradient-to-br from-[#9B6DFF]/20 via-[#4F8EF7]/12 to-transparent relative">
                <div className="absolute top-4 left-4 inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/15 px-3 py-1 text-[10px] text-red-400 font-bold tracking-[0.08em]">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                  LIVE MAINTENANT
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full border border-white/20 bg-black/35 flex items-center justify-center">
                    <iconify-icon icon="lucide:play" style={{ fontSize: "34px", color: "white", marginLeft: "4px" }} />
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/85 to-transparent">
                  <div className="font-venite text-[13px] text-white mb-1">LIVE BUILD - AGENT IA AVEC N8N</div>
                  <div className="text-[11px] text-[#888] font-body-readable">+847 spectateurs - Twitch</div>
                </div>
              </div>

              <div className="p-5 md:p-6 flex flex-wrap gap-3 items-center justify-between">
                <div className="text-[12px] text-[#666] font-body-readable">Atelier pratique en cours avec exercices et Q&R.</div>
                <Link href="#rejoindre" className="inline-flex items-center gap-2 rounded-lg bg-[#9147FF] px-4 py-2 text-[12px] font-semibold hover:bg-[#7b2fbe] transition-colors">
                  <iconify-icon icon="mdi:twitch" style={{ fontSize: "15px" }} />
                  Rejoindre le live
                </Link>
              </div>
            </article>

            <article className="rounded-2xl border border-white/[0.07] bg-[#111] p-5 md:p-6">
              <h3 className="font-venite text-[12px] tracking-[0.14em] text-[#888] mb-5">PROCHAINES DATES</h3>
              <div className="space-y-3">
                {UPCOMING_SESSIONS.map((session) => (
                  <div key={`${session.day}-${session.date}`} className="cal-item rounded-xl border border-white/[0.06] bg-white/[0.02] p-3.5 flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl border border-white/[0.08] bg-black/25 flex flex-col items-center justify-center">
                      <span className="text-[9px] text-[#666]">{session.day}</span>
                      <span className="text-[16px] leading-none font-bold" style={{ color: session.tone }}>{session.date}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-[12px] font-semibold text-white">{session.title}</div>
                      <div className="text-[10px] text-[#666] font-body-readable">{session.meta}</div>
                    </div>
                    {session.live ? (
                      <span className="inline-flex items-center gap-1 rounded-full border border-red-500/30 bg-red-500/10 px-2 py-1 text-[9px] text-red-400 font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                        LIVE
                      </span>
                    ) : null}
                  </div>
                ))}
              </div>
            </article>
          </div>
        </div>
      </section>

      <section id="speakers" className="py-24">
        <div className="max-w-[1320px] mx-auto px-6 md:px-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-7 mb-12">
            <div>
              <div className="section-label mb-4">SPEAKERS</div>
              <h2 className="font-valorax gradient-text" style={{ fontSize: "clamp(32px, 3.2vw, 48px)" }}>
                EQUIPE LIVE
              </h2>
              <p className="text-[#666] text-[14px] mt-3 max-w-[620px] font-body-readable">
                Des animateurs specialistes qui partagent des cas reels, des systemes utilisables et leurs retours terrain.
              </p>
            </div>
            <Link href="#rejoindre" className="btn-secondary w-fit">Proposer un sujet</Link>
          </div>

          <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5">
            {SPEAKERS.map((speaker) => (
              <article key={speaker.name} className="speaker-card rounded-2xl border border-white/[0.07] bg-[#111] p-5">
                <div className={`w-full h-44 rounded-xl bg-gradient-to-br ${speaker.accent} mb-5`} />
                <div className="font-venite text-[14px] text-white mb-1">{speaker.name}</div>
                <div className="text-[12px] text-[#666] mb-3 font-body-readable">{speaker.role}</div>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1 text-[10px] text-[#888]">
                  <iconify-icon icon="lucide:video" style={{ fontSize: "12px" }} />
                  {speaker.sessions}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="stats" className="py-24 border-y border-white/[0.05] bg-[#0d0d0d]">
        <div className="max-w-[1320px] mx-auto px-6 md:px-8">
          <div className="section-label mb-4">STATISTIQUES</div>
          <h2 className="font-valorax gradient-text mb-11" style={{ fontSize: "clamp(32px, 3.2vw, 48px)" }}>
            ACTIVITE COMMUNAUTE
          </h2>

          <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5">
            {[
              ["6 840", "Membres sur les serveurs", "lucide:users", "#4F8EF7"],
              ["127", "Sessions live organisees", "lucide:video", "#9B6DFF"],
              ["14 200", "Messages cette semaine", "lucide:message-square", "#22D3EE"],
              ["93%", "Presence moyenne en live", "lucide:activity", "#4ADE80"]
            ].map(([value, label, icon, tone]) => (
              <article key={label} className="rounded-2xl border border-white/[0.07] bg-[#111] p-5 card-hover">
                <div className="w-10 h-10 rounded-xl border border-white/[0.1] bg-white/[0.02] flex items-center justify-center mb-4">
                  <iconify-icon icon={icon} style={{ fontSize: "18px", color: tone }} />
                </div>
                <div className="stat-value text-[30px] text-white mb-1">{value}</div>
                <div className="text-[12px] text-[#666] font-body-readable">{label}</div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="rejoindre" className="py-24">
        <div className="max-w-[1320px] mx-auto px-6 md:px-8">
          <div className="rounded-3xl border border-white/[0.07] bg-gradient-to-br from-[#111] via-[#101018] to-[#111] p-8 md:p-12 relative overflow-hidden">
            <div className="hero-glow w-[380px] h-[380px] bg-blue-500/[0.12] -left-[140px] top-0" />
            <div className="hero-glow w-[340px] h-[340px] bg-violet-500/[0.14] -right-[100px] bottom-[-80px]" />

            <div className="relative z-10 grid lg:grid-cols-[1.4fr_1fr] gap-8 items-center">
              <div>
                <div className="section-label mb-4">REJOINDRE</div>
                <h2 className="font-valorax gradient-text-blue mb-4" style={{ fontSize: "clamp(32px, 3.4vw, 52px)" }}>
                  ENTRE DANS LA SALLE DE BUILD
                </h2>
                <p className="text-[14px] text-[#888] max-w-[660px] leading-relaxed font-body-readable">
                  Accede aux channels prives, sessions lives et ressources de production. Tu peux commencer gratuitement,
                  puis rejoindre les parcours avances a ton rythme.
                </p>
              </div>

              <div className="rounded-2xl border border-white/[0.08] bg-black/25 p-5 space-y-4">
                <Link
                  href="/signup"
                  id="join-connexion-btn"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-white text-[#0A0A0A] px-4 py-3 text-[13px] font-semibold hover:bg-[#f0f0f0] transition-colors"
                >
                  <iconify-icon icon="lucide:log-in" style={{ fontSize: "16px" }} />
                  Creer mon compte
                </Link>

                <a
                  href="#"
                  id="join-discord-btn"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#5865F2] px-4 py-3 text-[13px] font-semibold hover:bg-[#4752c4] transition-colors"
                >
                  <iconify-icon icon="ic:baseline-discord" style={{ fontSize: "16px" }} />
                  Rejoindre Discord
                </a>

                <a
                  href="#"
                  id="join-twitch-btn"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#9147FF] px-4 py-3 text-[13px] font-semibold hover:bg-[#7b2fbe] transition-colors"
                >
                  <iconify-icon icon="mdi:twitch" style={{ fontSize: "16px" }} />
                  Suivre sur Twitch
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
