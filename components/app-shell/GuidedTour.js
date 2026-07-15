"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";

const STORAGE_KEY = "tk_tour_done_v1";

const STEPS = [
  {
    id: "welcome",
    icon: "lucide:sparkles",
    title: "Bienvenue dans ton espace !",
    body: "Faisons un petit tour des sections clés pour que tu puisses profiter pleinement de TakaCode. 🚀",
    center: true
  },
  {
    id: "dashboard",
    icon: "lucide:layout-grid",
    title: "Tableau de bord",
    body: "Ta vue d'ensemble : progression dans tes parcours, statistiques (points, grade) et accès rapide vers l'essentiel."
  },
  {
    id: "parcours",
    icon: "lucide:map",
    title: "Mes parcours",
    body: "Les parcours que tu suis, avec leurs modules, leçons, quiz et micro-projets à valider pour progresser."
  },
  {
    id: "projets",
    icon: "lucide:folder-code",
    title: "Mes projets",
    body: "Crée tes projets personnels et partage-les avec la communauté pour montrer ton travail."
  },
  {
    id: "reviews",
    icon: "lucide:git-pull-request",
    title: "Revues",
    body: "Soumets tes micro-projets pour validation et review ceux des autres membres (pairs ou mentors)."
  },
  {
    id: "ressources",
    icon: "lucide:book-open",
    title: "Ressources",
    body: "Bibliothèque de ressources externes recommandées pour approfondir chaque sujet."
  },
  {
    id: "sessions",
    icon: "lucide:video",
    title: "Sessions live",
    body: "Rejoins les sessions en direct : coding sessions, Q&A, ateliers avec la communauté.",
    live: true
  },
  {
    id: "communaute",
    icon: "lucide:users",
    title: "Communauté",
    body: "Échange avec les autres créateurs, découvre leurs projets et partage les tiens."
  },
  {
    id: "outils",
    icon: "lucide:wrench",
    title: "Outils",
    body: "Les services et outils recommandés par TakaCode : hébergement, IA, noms de domaine, déploiement…"
  },
  {
    id: "profil",
    icon: "lucide:user",
    title: "Profil",
    body: "Gère ton identité, ton avatar DiceBear, tes informations et tes préférences."
  },
  {
    id: "done",
    icon: "lucide:rocket",
    title: "Prêt à créer ! 💪",
    body: "Tu connais maintenant toutes les sections. Explore, apprends et construis ton projet. Ce guide reste accessible depuis ton Tableau de bord si besoin.",
    center: true
  }
];

const STEP_DESKTOP_IDS = STEPS.filter((s) => !s.center).map((s) => s.id);

export default function GuidedTour() {
  const pathname = usePathname();
  const [active, setActive] = useState(false);
  const [current, setCurrent] = useState(0);
  const [targetRect, setTargetRect] = useState(null);
  const tooltipRef = useRef(null);
  const highlightRef = useRef(null);

  // Determine if we should show the tour (only on /dashboard, once per user)
  useEffect(() => {
    if (pathname !== "/dashboard") {
      setActive(false);
      return;
    }
    const done = localStorage.getItem(STORAGE_KEY);
    if (!done) {
      const timer = setTimeout(() => setActive(true), 600);
      return () => clearTimeout(timer);
    }
  }, [pathname]);

  // Recompute target position on each step change
  useEffect(() => {
    if (!active) return;
    const step = STEPS[current];
    if (!step || step.center) {
      setTargetRect(null);
      return;
    }

    const el = document.querySelector(`[data-tour="${step.id}"]`);
    if (el) {
      const rect = el.getBoundingClientRect();
      setTargetRect(rect);
      el.scrollIntoView({ block: "center", behavior: "smooth" });
    } else {
      setTargetRect(null);
    }
  }, [current, active]);

  const totalSteps = useMemo(() => STEP_DESKTOP_IDS.length, []);

  const next = useCallback(() => {
    if (current < STEPS.length - 1) {
      setCurrent((c) => c + 1);
    } else {
      finish();
    }
  }, [current]);

  const prev = useCallback(() => {
    if (current > 0) setCurrent((c) => c - 1);
  }, []);

  const finish = useCallback(() => {
    setActive(false);
    setCurrent(0);
    setTargetRect(null);
    localStorage.setItem(STORAGE_KEY, "1");
  }, []);

  const skip = useCallback(() => finish(), [finish]);

  // Keyboard: arrow keys to navigate
  useEffect(() => {
    if (!active) return;
    function onKey(e) {
      if (e.key === "ArrowRight" || e.key === "Enter") next();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "Escape") finish();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, next, prev, finish]);

  if (!active) return null;

  const step = STEPS[current];
  const isCenter = step.center;
  const stepInTour = STEP_DESKTOP_IDS.indexOf(step.id);
  const tourProgress = stepInTour >= 0 ? stepInTour + 1 : null;
  const isFirst = current === 0;
  const isLast = current === STEPS.length - 1;

  const highlightStyle = targetRect
    ? {
        position: "fixed",
        top: targetRect.top - 4,
        left: targetRect.left - 4,
        width: targetRect.width + 8,
        height: targetRect.height + 8,
        zIndex: 200,
        borderRadius: "14px",
        border: "2px solid #4F8EF7",
        boxShadow: "0 0 20px rgba(79, 142, 247, 0.3)",
        pointerEvents: "none",
        transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)"
      }
    : null;

  // Tooltip positioned to the right of the target
  const tooltipStyleDesktop = targetRect
    ? {
        position: "fixed",
        top: Math.max(20, Math.min(targetRect.top + targetRect.height / 2 - 80, window.innerHeight - 220)),
        left: targetRect.right + 20,
        maxWidth: 320,
        zIndex: 201
      }
    : null;

  // Tooltip pointing down (for left-side position, fallback)
  // We'll use a smart positioning approach

  // --- Shared card content ---
  function renderCardContent() {
    return (
      <>
        {/* Header: icon + step counter */}
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-500/15 flex items-center justify-center">
              <iconify-icon icon={step.icon} style={{ fontSize: "14px", color: "#4F8EF7" }} />
            </div>
            {tourProgress ? (
              <span className="text-[10px] text-[#4F8EF7] font-semibold uppercase tracking-widest">
                {tourProgress}/{totalSteps}
              </span>
            ) : null}
          </div>
          <button
            type="button"
            onClick={skip}
            className="w-6 h-6 rounded-lg flex items-center justify-center text-[#555] hover:text-white hover:bg-white/[0.06] transition-all"
            title="Passer le guide"
          >
            <iconify-icon icon="lucide:x" style={{ fontSize: "14px" }} />
          </button>
        </div>

        {/* Title & body */}
        {step.live ? (
          <div className="flex items-center gap-1.5 mb-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            <span className="text-[9px] text-red-400 uppercase tracking-widest font-semibold">En direct</span>
          </div>
        ) : null}
        <div className="text-[15px] font-semibold leading-tight mb-1.5">{step.title}</div>
        <p className="text-[12px] text-[#b0b0b0] leading-relaxed font-body-readable mb-4">{step.body}</p>

        {/* Navigation buttons */}
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            {!isFirst ? (
              <button
                type="button"
                onClick={prev}
                className="text-[11px] text-[#666] hover:text-white px-2.5 py-1.5 rounded-lg hover:bg-white/[0.04] transition-all"
              >
                ← Précédent
              </button>
            ) : null}
          </div>
          <div className="flex items-center gap-2">
            {isCenter && !isLast ? (
              <button
                type="button"
                onClick={skip}
                className="text-[10px] text-[#555] hover:text-[#888] transition-colors"
              >
                Passer
              </button>
            ) : null}
            <button
              type="button"
              onClick={isLast ? finish : next}
              className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-4 py-2 rounded-xl transition-all ${
                isLast
                  ? "bg-gradient-to-r from-[#4F8EF7] to-[#9B6DFF] text-white hover:shadow-lg hover:shadow-blue-500/20"
                  : "bg-white/[0.08] text-white hover:bg-white/[0.12]"
              }`}
            >
              {isLast ? "C'est parti ! 🚀" : "Suivant →"}
            </button>
          </div>
        </div>
      </>
    );
  }

  // --- Center overlay (welcome / done) ---
  if (isCenter) {
    return (
      <div className="fixed inset-0 z-[300] flex items-center justify-center p-6" style={{ background: "rgba(0,0,0,0.65)" }} role="dialog" aria-modal="true" aria-label="Guide interactif">
        <div
          className="w-full max-w-sm rounded-2xl border border-white/[0.10] bg-[#0F0F0F]/95 backdrop-blur-xl p-6 animate-fade-up-d1"
          style={{ boxShadow: "0 24px 60px rgba(0,0,0,0.6)" }}
        >
          {renderCardContent()}
        </div>
      </div>
    );
  }

  // --- Desktop: tooltip positioned next to target + highlight ---
  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-[199]" style={{ background: "rgba(0,0,0,0.45)" }} onClick={skip} role="presentation" />

      {/* Target highlight ring */}
      {highlightStyle ? <div style={highlightStyle} ref={highlightRef} /> : null}

      {/* Tooltip card */}
      <div
        ref={tooltipRef}
        className="hidden lg:block w-[300px] sm:w-[320px] rounded-2xl border border-white/[0.10] bg-[#0F0F0F]/95 backdrop-blur-xl p-5 animate-fade-up-d1"
        style={{ ...tooltipStyleDesktop, boxShadow: "0 16px 40px rgba(0,0,0,0.5)" }}
      >
        {renderCardContent()}
      </div>

      {/* Mobile fallback: bottom sheet */}
      <div className="block lg:hidden fixed bottom-0 left-0 right-0 z-[250] p-4 animate-fade-up-d1">
        <div
          className="rounded-2xl border border-white/[0.10] bg-[#0F0F0F] p-5"
          style={{ boxShadow: "0 -8px 40px rgba(0,0,0,0.6)" }}
        >
          {renderCardContent()}
        </div>
      </div>
    </>
  );
}
