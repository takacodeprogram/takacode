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

const QUICK_ACTIONS = [
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

export default function AdminDashboardPage({ user, onboarding }) {
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
            href="/auth/signout"
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

        <header className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between mb-8 animate-fade-up">
          <div>
            <h1 className="font-valorax text-3xl mb-1">DASHBOARD</h1>
            <div className="flex items-center gap-3">
              <span className="section-label">Bienvenue {displayName}</span>
              <span className="text-[#444] text-xs">-</span>
              <span className="text-[#666] text-xs">Ton espace personnalise est actif</span>
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

        <section className="rounded-3xl border border-white/[0.08] bg-gradient-to-br from-[#121212] via-[#101018] to-[#121212] p-6 md:p-8 mb-8 animate-fade-up-d1">
          <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-6">
            <div>
              <div className="section-label mb-3">Objectif actuel</div>
              <h2 className="font-valorax text-[clamp(30px,4.4vw,52px)] leading-[0.9] mb-3">BONJOUR {firstName.toUpperCase()}</h2>
              <p className="font-body-readable text-[15px] text-[#a5a5a5] max-w-[720px] leading-relaxed">{goalLabel}</p>
            </div>

            <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 min-w-[220px]">
              <div className="text-[10px] text-[#666] uppercase tracking-widest mb-1">Parcours recommande</div>
              <div className="text-[13px] font-semibold">{parcoursTitle}</div>
              <div className="text-[11px] text-[#777] font-body-readable">{parcoursMeta}</div>
            </div>
          </div>

          <div className="mt-7">
            <div className="flex items-center justify-between text-[12px] mb-2">
              <span className="text-[#888]">Progression</span>
              <span className="font-bold text-[#4F8EF7]">{progress}%</span>
            </div>
            <div className="h-1.5 rounded bg-white/[0.06] overflow-hidden">
              <div className="h-full rounded bg-gradient-to-r from-[#4F8EF7] to-[#9B6DFF]" style={{ width: `${progress}%` }} />
            </div>
          </div>

          <div className="mt-7 grid sm:grid-cols-2 gap-3">
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

          <div className="mt-6 rounded-xl border border-blue-500/25 bg-blue-500/10 px-4 py-3 flex items-center gap-3">
            <iconify-icon icon="lucide:calendar-clock" style={{ color: "#4F8EF7", fontSize: "16px" }} />
            <div className="text-[12px] text-blue-100 font-body-readable">Session live: {nextSession}</div>
          </div>
        </section>

        <div className="grid xl:grid-cols-[1.4fr_1fr] gap-6">
          <section className="rounded-2xl border border-white/[0.08] bg-[#111] p-5 animate-fade-up-d2">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-venite text-[13px] tracking-widest text-[#888]">OBJECTIF</h3>
              <Link href="/parcours" className="text-[11px] text-[#4F8EF7] hover:underline">Voir le parcours</Link>
            </div>

            <p className="font-body-readable text-[14px] text-[#9a9a9a] leading-relaxed mb-5">{objective}</p>

            <div className="space-y-2.5 mb-6">
              {resources.map((resource) => (
                <div key={resource} className="rounded-xl border border-white/[0.08] bg-white/[0.02] px-3.5 py-3 flex items-center gap-3">
                  <iconify-icon icon="lucide:file-text" style={{ color: "#9B6DFF", fontSize: "15px" }} />
                  <span className="text-[12px] text-[#c4c4c4] font-body-readable">{resource}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              <Link href="/parcours" className="btn-primary">Commencer le parcours</Link>
              <Link href="/projets" className="btn-secondary">Lancer un projet</Link>
            </div>
          </section>

          <section className="space-y-4 animate-fade-up-d3">
            <article className="rounded-2xl border border-white/[0.08] bg-[#111] p-5">
              <h3 className="font-venite text-[12px] tracking-widest text-[#888] mb-3">PROFIL</h3>
              <div className="text-[13px] text-white font-semibold mb-1">{displayName}</div>
              <div className="text-[11px] text-[#777] font-body-readable mb-1">{email}</div>
              <div className="text-[11px] text-[#4ADE80] font-body-readable">{onboarding?.weeklyCommitmentLabel || "2 a 5h"} par semaine</div>
              {onboarding?.projectIdea ? (
                <div className="mt-4 rounded-xl border border-white/[0.08] bg-white/[0.02] px-3.5 py-3">
                  <div className="text-[10px] text-[#666] uppercase tracking-widest mb-1">Ton idee</div>
                  <div className="text-[12px] text-[#c9c9c9] font-body-readable">{onboarding.projectIdea}</div>
                </div>
              ) : null}
            </article>

            <article className="rounded-2xl border border-white/[0.08] bg-[#111] p-5">
              <h3 className="font-venite text-[12px] tracking-widest text-[#888] mb-3">ACTIONS RAPIDES</h3>
              <div className="space-y-2.5">
                {QUICK_ACTIONS.map((action) => (
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
            </article>

            <Link
              href="/auth/signout"
              className="w-full rounded-xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-[12px] font-semibold text-red-300 hover:bg-red-500/15 transition-colors inline-flex items-center justify-center gap-2"
            >
              <iconify-icon icon="lucide:log-out" style={{ fontSize: "14px" }} />
              Se deconnecter
            </Link>
          </section>
        </div>
      </main>
    </div>
  );
}