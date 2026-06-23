import Link from "next/link";
import logoLight4 from "../assets/logos-light-png/logo-light-4.png";
import AdminControlCenter from "./AdminControlCenter";

const SIDEBAR_LINKS = [
  { id: "side-dash", href: "/dashboard", matchPrefix: "/dashboard", icon: "lucide:layout-grid", label: "Dashboard" },
  { id: "side-admin", href: "/admin", matchPrefix: "/admin", icon: "lucide:shield-check", label: "Centre admin", adminOnly: true },
  { id: "side-parcours", href: "/parcours", matchPrefix: "/parcours", icon: "lucide:map", label: "Mes parcours" },
  { id: "side-sessions", href: "/communaute#sessions", matchPrefix: "/communaute", icon: "lucide:video", label: "Sessions live", live: true },
  { id: "side-projects", href: "/projets", matchPrefix: "/projets", icon: "lucide:folder-code", label: "Mes projets" },
  { id: "side-community", href: "/communaute", matchPrefix: "/communaute", icon: "lucide:users", label: "Communaute" },
  { id: "side-resources", href: "/ressources", matchPrefix: "/ressources", icon: "lucide:book-open", label: "Ressources" }
];

const USER_QUICK_ACTIONS = [
  { label: "Continuer mon parcours", href: "/parcours", icon: "lucide:play-circle" },
  { label: "Explorer les ressources", href: "/ressources", icon: "lucide:book-marked" },
  { label: "Rejoindre la session live", href: "/communaute#sessions", icon: "lucide:calendar" }
];

const FALLBACK_STEPS = [
  { label: "Decouvrir les bases", state: "done" },
  { label: "Lancer le premier exercice", state: "current" },
  { label: "Construire un mini projet", state: "locked" }
];

function getInitials(value) {
  const tokens = String(value || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (!tokens.length) {
    return "ME";
  }

  if (tokens.length === 1) {
    return tokens[0].slice(0, 2).toUpperCase();
  }

  return `${tokens[0][0]}${tokens[tokens.length - 1][0]}`.toUpperCase();
}

function getStepUi(state) {
  if (state === "done") {
    return {
      icon: "lucide:check",
      chip: "bg-emerald-500/10 border-emerald-500/35 text-emerald-300"
    };
  }

  if (state === "current") {
    return {
      icon: "lucide:hourglass",
      chip: "bg-blue-500/10 border-blue-500/35 text-blue-200"
    };
  }

  return {
    icon: "lucide:lock",
    chip: "bg-white/[0.03] border-white/[0.1] text-[#777]"
  };
}

function formatTrackMetaForCard(track) {
  const duration = Number.isFinite(Number(track?.durationWeeks)) ? Number(track.durationWeeks) : 0;
  const durationLabel = duration > 0 ? String(duration) + " semaines" : "Progressif";
  const level = typeof track?.levelLabel === "string" && track.levelLabel.trim() ? track.levelLabel.trim() : "Tous niveaux";
  return durationLabel + " - " + level;
}

function formatHeaderSubtitle(isAdmin) {
  if (isAdmin) {
    return "Pilotage global de la plateforme";
  }

  return "Ton espace personnel est actif";
}

function normalizePathname(value) {
  const normalized = String(value || "")
    .split("?")[0]
    .split("#")[0]
    .trim();

  if (!normalized) {
    return "/dashboard";
  }

  if (normalized !== "/" && normalized.endsWith("/")) {
    return normalized.slice(0, -1);
  }

  return normalized;
}

function isLinkActive(currentPath, link) {
  const targetPrefix = String(link?.matchPrefix || link?.href || "").split("#")[0].trim();
  if (!targetPrefix) {
    return false;
  }

  return currentPath === targetPrefix || currentPath.startsWith(targetPrefix + "/");
}

export default function AdminDashboardPage({ user, onboarding, tracks, gamification, adminData, currentPath = "/dashboard" }) {
  const displayName = user?.displayName || "Membre";
  const firstName = displayName.split(" ")[0] || "Membre";
  const email = user?.email || "membre@takacode.app";
  const roleLabel = (user?.role || "user").toUpperCase();
  const initials = getInitials(displayName);

  const goalLabel = onboarding?.goalLabel || "Construire un projet digital";
  const objective = onboarding?.objective || "Construire ton premier projet concret.";
  const progress = Math.max(0, Math.min(Number(onboarding?.progress ?? 8), 100));
  const nextSession = onboarding?.nextSession || "Mercredi 20h00";
  const parcoursTitle = onboarding?.parcoursTitle || "Parcours personnalise";
  const parcoursMeta = onboarding?.parcoursMeta || "12 semaines - Debutant";
  const nextSteps = Array.isArray(onboarding?.nextSteps) && onboarding.nextSteps.length ? onboarding.nextSteps : FALLBACK_STEPS;
  const resources = Array.isArray(onboarding?.resources) && onboarding.resources.length
    ? onboarding.resources
    : ["Guide de demarrage", "Projet d'introduction", "Session live de lancement"];

  const points = Math.max(0, Number(gamification?.points ?? 0));
  const grade = typeof gamification?.grade === "string" && gamification.grade.trim() ? gamification.grade : "Starter";
  const referralCode = typeof gamification?.referralCode === "string" ? gamification.referralCode.trim().toUpperCase() : "";
  const referralHref = referralCode ? `/signup?ref=${encodeURIComponent(referralCode)}` : "";
  const isAdmin = (user?.role || "").toLowerCase() === "admin";

  const enrolledTracks = Array.isArray(tracks?.enrolled) ? tracks.enrolled : [];
  const recommendedTracks = Array.isArray(tracks?.recommended) ? tracks.recommended : [];
  const visibleUserTracks = (enrolledTracks.length ? enrolledTracks : recommendedTracks).slice(0, 3);

  const adminUsers = Array.isArray(adminData?.users) ? adminData.users : [];
  const adminTracks = Array.isArray(adminData?.tracks) ? adminData.tracks : [];
  const usersSchemaReady = adminData?.usersSchemaReady !== false;
  const tracksSchemaReady = adminData?.tracksSchemaReady !== false;
  const usersError = typeof adminData?.usersError === "string" ? adminData.usersError : "";
  const tracksError = typeof adminData?.tracksError === "string" ? adminData.tracksError : "";
  const appUrl = typeof adminData?.appUrl === "string" && adminData.appUrl.trim()
    ? adminData.appUrl.trim()
    : "https://takacode.vercel.app";
  const normalizedCurrentPath = normalizePathname(currentPath);
  const sidebarLinks = SIDEBAR_LINKS.filter((link) => !link.adminOnly || isAdmin);

  const mobileLinks = [
    { href: "/dashboard", label: "Dashboard", matchPrefix: "/dashboard" },
    isAdmin ? { href: "/admin", label: "Admin", matchPrefix: "/admin" } : null,
    { href: "/parcours", label: "Parcours", matchPrefix: "/parcours" },
    { href: "/projets", label: "Projets", matchPrefix: "/projets" },
    { href: "/communaute", label: "Communaute", matchPrefix: "/communaute" }
  ].filter(Boolean);

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex text-white">
      <aside className="w-[280px] border-r border-white/[0.05] bg-[#0A0A0A] sticky top-0 h-screen z-40 p-6 hidden lg:flex lg:flex-col">
        <div className="mb-10 pl-2">
          <img src={logoLight4.src} alt="TakaCode" className="nav-logo-image" />
        </div>

        <nav className="space-y-2 flex-1">
          {sidebarLinks.map((link) => (
            <Link
              key={link.id}
              id={link.id}
              href={link.href}
              className={[
                "flex items-center justify-between rounded-xl px-4 py-3 text-[14px] font-medium transition-all",
                isLinkActive(normalizedCurrentPath, link)
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
          <form action="/auth/signout" method="post">
            <button
              type="submit"
              id="side-logout"
              className="w-full flex items-center gap-3 rounded-xl px-4 py-3 text-[14px] font-medium text-red-400/70 hover:text-red-400 hover:bg-red-400/5 transition-all"
            >
              <iconify-icon icon="lucide:log-out" />
              Deconnexion
            </button>
          </form>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto p-6 md:p-8 pt-10 md:pt-12">
        <div className="lg:hidden mb-6 flex items-center gap-2 overflow-x-auto pb-1">
          {mobileLinks.map((link) => {
            const active = isLinkActive(normalizedCurrentPath, link);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={[
                  "shrink-0 rounded-lg px-3 py-2 text-[11px] font-semibold border",
                  active
                    ? "border-blue-500/20 bg-blue-500/10 text-[#4F8EF7]"
                    : "border-white/[0.08] bg-white/[0.03] text-[#bbb]"
                ].join(" ")}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        <header className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between mb-8 animate-fade-up">
          <div>
            <h1 className="font-valorax text-3xl mb-1">DASHBOARD</h1>
            <div className="flex items-center gap-3">
              <span className="section-label">Bienvenue {displayName}</span>
              <span className="text-[#444] text-xs">-</span>
              <span className="text-[#666] text-xs">{formatHeaderSubtitle(isAdmin)}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <div className="flex items-center gap-3 pl-1">
              <div className="text-right hidden sm:block">
                <div className="text-[13px] font-semibold">{displayName}</div>
                <div className="text-[11px] text-[#4ADE80]">Role {roleLabel}</div>
                <div className="text-[10px] text-[#555]">{email}</div>
              </div>
              <div className="w-10 h-10 rounded-full border border-white/10 bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center text-[11px] font-semibold">{initials}</div>
            </div>
          </div>
        </header>

        {isAdmin ? (
          <>
            <section className="rounded-3xl border border-white/[0.08] bg-gradient-to-br from-[#121212] via-[#101018] to-[#121212] p-6 md:p-8 mb-6 animate-fade-up-d1">
              <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">
                <div>
                  <div className="section-label mb-2">Administration</div>
                  <h2 className="font-valorax text-[clamp(30px,4.2vw,50px)] leading-[0.92]">PILOTAGE CENTRAL</h2>
                  <p className="font-body-readable text-[14px] text-[#9a9a9a] mt-3 max-w-[760px]">
                    Espace admin simplifie pour gerer comptes, roles, parcours et operations systeme sans surcharger la page.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  <a href={appUrl} target="_blank" rel="noreferrer" className="btn-secondary">Voir l'app</a>
                  <Link href="/admin" className="btn-secondary">Aller sur /admin</Link>
                  <a href="/api/admin/pitch-deck" className="btn-primary">Pitch deck</a>
                </div>
              </div>

              <div className="mt-6 flex items-center flex-wrap gap-2.5 text-[11px]">
                <span className="rounded-full border border-white/[0.1] bg-white/[0.03] px-3 py-1.5 text-[#b8b8b8]">
                  {adminUsers.length} utilisateurs charges
                </span>
                <span className="rounded-full border border-white/[0.1] bg-white/[0.03] px-3 py-1.5 text-[#b8b8b8]">
                  {adminTracks.length} parcours charges
                </span>
                <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-emerald-200">
                  Control center actif
                </span>
              </div>
            </section>

            <AdminControlCenter
              users={adminUsers}
              tracks={adminTracks}
              usersSchemaReady={usersSchemaReady}
              tracksSchemaReady={tracksSchemaReady}
              usersError={usersError}
              tracksError={tracksError}
              appUrl={appUrl}
            />
          </>
        ) : (
          <>
            <section className="rounded-3xl border border-white/[0.08] bg-gradient-to-br from-[#121212] via-[#101018] to-[#121212] p-6 md:p-8 mb-6 animate-fade-up-d1">
              <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-6">
                <div>
                  <div className="section-label mb-2">Mon cap</div>
                  <h2 className="font-valorax text-[clamp(28px,4vw,44px)] leading-[0.94]">BONJOUR {firstName.toUpperCase()}</h2>
                  <p className="font-body-readable text-[14px] text-[#a5a5a5] max-w-[720px] leading-relaxed mt-2">{goalLabel}</p>
                </div>

                <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 min-w-[220px]">
                  <div className="text-[10px] text-[#666] uppercase tracking-widest mb-1">Parcours recommande</div>
                  <div className="text-[13px] font-semibold">{parcoursTitle}</div>
                  <div className="text-[11px] text-[#777] font-body-readable">{parcoursMeta}</div>
                </div>
              </div>

              <div className="mt-6">
                <div className="flex items-center justify-between text-[12px] mb-2">
                  <span className="text-[#888]">Progression</span>
                  <span className="font-bold text-[#4F8EF7]">{progress}%</span>
                </div>
                <div className="h-1.5 rounded bg-white/[0.06] overflow-hidden">
                  <div className="h-full rounded bg-gradient-to-r from-[#4F8EF7] to-[#9B6DFF]" style={{ width: `${progress}%` }} />
                </div>
              </div>

              <div className="mt-5 rounded-xl border border-blue-500/25 bg-blue-500/10 px-4 py-3 flex items-center gap-3">
                <iconify-icon icon="lucide:calendar-clock" style={{ color: "#4F8EF7", fontSize: "16px" }} />
                <div className="text-[12px] text-blue-100 font-body-readable">Session live: {nextSession}</div>
              </div>
            </section>

            <div className="grid xl:grid-cols-[1.35fr_0.95fr] gap-6">
              <section className="rounded-2xl border border-white/[0.08] bg-[#111] p-5 animate-fade-up-d2">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-venite text-[13px] tracking-widest text-[#888]">PLAN DE PROGRESSION</h3>
                  <Link href="/parcours" className="text-[11px] text-[#4F8EF7] hover:underline">Voir le parcours</Link>
                </div>

                <p className="font-body-readable text-[14px] text-[#9a9a9a] leading-relaxed mb-5">{objective}</p>

                <div className="space-y-2.5 mb-5">
                  {nextSteps.map((stepItem) => {
                    const ui = getStepUi(stepItem.state);
                    return (
                      <div key={stepItem.label} className="rounded-xl border border-white/[0.08] bg-white/[0.02] px-3.5 py-3 flex items-center gap-3">
                        <span className={`inline-flex h-7 w-7 items-center justify-center rounded-full border ${ui.chip}`}>
                          <iconify-icon icon={ui.icon} style={{ fontSize: "12px" }} />
                        </span>
                        <span className="text-[12px] text-[#cfcfcf] font-body-readable">{stepItem.label}</span>
                      </div>
                    );
                  })}
                </div>

                <div className="space-y-2.5 mb-6">
                  {resources.map((resource) => (
                    <div key={resource} className="rounded-xl border border-white/[0.08] bg-white/[0.02] px-3.5 py-3 flex items-center gap-3">
                      <iconify-icon icon="lucide:file-text" style={{ color: "#9B6DFF", fontSize: "15px" }} />
                      <span className="text-[12px] text-[#c4c4c4] font-body-readable">{resource}</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-3">
                  <Link href="/parcours" className="btn-primary">Commencer</Link>
                  <Link href="/projets" className="btn-secondary">Lancer un projet</Link>
                </div>
              </section>

              <section className="space-y-4 animate-fade-up-d3">
                <article className="rounded-2xl border border-white/[0.08] bg-[#111] p-5">
                  <h3 className="font-venite text-[12px] tracking-widest text-[#888] mb-3">PROFIL</h3>
                  <div className="text-[13px] text-white font-semibold mb-1">{displayName}</div>
                  <div className="text-[11px] text-[#777] font-body-readable mb-1">{email}</div>
                  <div className="text-[11px] text-[#4ADE80] font-body-readable">{onboarding?.weeklyCommitmentLabel || "2 a 5h"} par semaine</div>

                  <div className="mt-4 grid grid-cols-3 gap-2">
                    <div className="rounded-lg border border-white/[0.08] bg-white/[0.02] px-2.5 py-2">
                      <div className="text-[9px] text-[#666] uppercase tracking-widest">Points</div>
                      <div className="text-[12px] text-white font-semibold">{points}</div>
                    </div>
                    <div className="rounded-lg border border-white/[0.08] bg-white/[0.02] px-2.5 py-2">
                      <div className="text-[9px] text-[#666] uppercase tracking-widest">Grade</div>
                      <div className="text-[12px] text-white font-semibold">{grade}</div>
                    </div>
                    <div className="rounded-lg border border-white/[0.08] bg-white/[0.02] px-2.5 py-2">
                      <div className="text-[9px] text-[#666] uppercase tracking-widest">Role</div>
                      <div className="text-[12px] text-white font-semibold">{roleLabel}</div>
                    </div>
                  </div>

                  {referralCode ? (
                    <div className="mt-4 rounded-xl border border-blue-500/25 bg-blue-500/10 px-3.5 py-3">
                      <div className="text-[10px] text-blue-200 uppercase tracking-widest mb-1">Code parrainage</div>
                      <div className="text-[12px] text-white font-semibold mb-1">{referralCode}</div>
                      <Link href={referralHref} className="text-[11px] text-blue-200 hover:text-white transition-colors">
                        Lien d'inscription
                      </Link>
                    </div>
                  ) : null}
                </article>

                <article className="rounded-2xl border border-white/[0.08] bg-[#111] p-5">
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <h3 className="font-venite text-[12px] tracking-widest text-[#888]">PARCOURS ACTIFS</h3>
                    <Link href="/parcours" className="text-[11px] text-[#4F8EF7] hover:underline">Voir tous</Link>
                  </div>

                  {visibleUserTracks.length ? (
                    <div className="space-y-2.5">
                      {visibleUserTracks.map((track) => (
                        <div key={track.id || track.slug || track.title} className="rounded-xl border border-white/[0.08] bg-white/[0.02] px-3.5 py-3">
                          <div className="flex items-center justify-between gap-2 mb-1.5">
                            <div className="text-[12px] text-white font-semibold leading-tight">{track.title}</div>
                            {Number.isFinite(Number(track.progress)) ? (
                              <span className="text-[10px] text-[#6ec3ff] font-semibold">{Math.max(0, Math.min(Number(track.progress), 100))}%</span>
                            ) : null}
                          </div>
                          <div className="text-[10px] text-[#666] font-body-readable">{formatTrackMetaForCard(track)}</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] px-3.5 py-3 text-[11px] text-[#777] font-body-readable">
                      Ton parcours apparaitra ici apres ton onboarding.
                    </div>
                  )}
                </article>

                <article className="rounded-2xl border border-white/[0.08] bg-[#111] p-5">
                  <h3 className="font-venite text-[12px] tracking-widest text-[#888] mb-3">ACTIONS RAPIDES</h3>
                  <div className="space-y-2.5 mb-3">
                    {USER_QUICK_ACTIONS.map((action) => (
                      <Link
                        key={action.label}
                        href={action.href}
                        className="w-full rounded-xl border border-white/[0.08] bg-white/[0.02] px-3.5 py-3 text-[12px] font-semibold text-[#d1d1d1] hover:bg-white/[0.05] transition-colors inline-flex items-center gap-2"
                      >
                        <iconify-icon icon={action.icon} style={{ color: "#4F8EF7", fontSize: "14px" }} />
                        {action.label}
                      </Link>
                    ))}
                  </div>

                  <form action="/auth/signout" method="post" className="w-full">
                    <button
                      type="submit"
                      className="w-full rounded-xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-[12px] font-semibold text-red-300 hover:bg-red-500/15 transition-colors inline-flex items-center justify-center gap-2"
                    >
                      <iconify-icon icon="lucide:log-out" style={{ fontSize: "14px" }} />
                      Se deconnecter
                    </button>
                  </form>
                </article>
              </section>
            </div>
          </>
        )}
      </main>
    </div>
  );
}


