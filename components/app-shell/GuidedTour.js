"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { TOUR_STEPS as STEPS } from "./tourSteps";

const STORAGE_KEY = "tk_tour_done_v1";

const STEP_DESKTOP_IDS = STEPS.filter((s) => !s.center).map((s) => s.id);

function isDesktop() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(min-width: 1024px)").matches;
}

export default function GuidedTour() {
  const pathname = usePathname();
  const [active, setActive] = useState(false);
  const [current, setCurrent] = useState(0);
  const [targetRect, setTargetRect] = useState(null);
  const tooltipRef = useRef(null);
  const highlightRef = useRef(null);

  // Le tour cible des elements de la sidebar (caches sur mobile) -> desktop uniquement.
  // Sur mobile, on renvoie vers la page guide dediee /dashboard/guide.
  useEffect(() => {
    if (pathname !== "/dashboard" || !isDesktop()) {
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

  const tooltipStyleDesktop = targetRect
    ? {
        position: "fixed",
        top: Math.max(20, Math.min(targetRect.top + targetRect.height / 2 - 80, window.innerHeight - 220)),
        left: targetRect.right + 20,
        maxWidth: 320,
        zIndex: 201
      }
    : null;

  function renderCardContent() {
    return (
      <>
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

        {step.live ? (
          <div className="flex items-center gap-1.5 mb-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            <span className="text-[9px] text-red-400 uppercase tracking-widest font-semibold">En direct</span>
          </div>
        ) : null}
        <div className="text-[15px] font-semibold leading-tight mb-1.5">{step.title}</div>
        <p className="text-[12px] text-[#b0b0b0] leading-relaxed font-body-readable mb-4">{step.body}</p>

        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            {!isFirst ? (
              <button
                type="button"
                onClick={prev}
                className="text-[11px] text-[#666] hover:text-white px-2.5 py-1.5 rounded-lg hover:bg-white/[0.04] transition-all"
              >
                ← Precedent
              </button>
            ) : null}
          </div>
          <div className="flex items-center gap-2">
            {isCenter && !isLast ? (
              <button type="button" onClick={skip} className="text-[10px] text-[#555] hover:text-[#888] transition-colors">
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

  if (isCenter) {
    return (
      <div className="fixed inset-0 z-[300] flex items-center justify-center p-6" style={{ background: "rgba(0,0,0,0.65)" }} role="dialog" aria-modal="true" aria-label="Guide interactif">
        <div className="w-full max-w-sm rounded-2xl border border-white/[0.10] bg-[#0F0F0F]/95 backdrop-blur-xl p-6 animate-fade-up-d1" style={{ boxShadow: "0 24px 60px rgba(0,0,0,0.6)" }}>
          {renderCardContent()}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="fixed inset-0 z-[199]" style={{ background: "rgba(0,0,0,0.45)" }} onClick={skip} role="presentation" />
      {highlightStyle ? <div style={highlightStyle} ref={highlightRef} /> : null}
      <div
        ref={tooltipRef}
        className="hidden lg:block w-[320px] rounded-2xl border border-white/[0.10] bg-[#0F0F0F]/95 backdrop-blur-xl p-5 animate-fade-up-d1"
        style={{ ...tooltipStyleDesktop, boxShadow: "0 16px 40px rgba(0,0,0,0.5)" }}
      >
        {renderCardContent()}
      </div>
    </>
  );
}
