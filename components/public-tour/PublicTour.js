"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { GUIDE_STEPS, LECON_STEPS, PARCOURS_DETAIL_STEPS, PARCOURS_PAGE_STEPS } from "./steps";

const STORAGE_KEY_PREFIX = "tk_tour_";
const TOUR_DELAY_MS = 800;

function getTourKey(pathname) {
  if (pathname.startsWith("/parcours/") && pathname.includes("/lecon/")) return "lecon";
  if (pathname.startsWith("/parcours/") && pathname !== "/parcours") return "detail";
  if (pathname === "/parcours") return "parcours";
  if (pathname === "/dashboard/guide") return "guide";
  return null;
}

function getSteps(tourKey) {
  if (tourKey === "parcours") return PARCOURS_PAGE_STEPS;
  if (tourKey === "detail") return PARCOURS_DETAIL_STEPS;
  if (tourKey === "lecon") return LECON_STEPS;
  if (tourKey === "guide") return GUIDE_STEPS;
  return [];
}

export default function PublicTour() {
  const pathname = usePathname();
  const [active, setActive] = useState(false);
  const [current, setCurrent] = useState(0);
  const dialogRef = useRef(null);

  const tourKey = getTourKey(pathname);
  const steps = getSteps(tourKey);
  const isLast = current === steps.length - 1;
  const isFirst = current === 0;

  useEffect(() => {
    if (!tourKey) {
      setActive(false);
      return;
    }
    const key = STORAGE_KEY_PREFIX + tourKey;
    const done = localStorage.getItem(key);
    if (!done) {
      const timer = setTimeout(() => setActive(true), TOUR_DELAY_MS);
      return () => clearTimeout(timer);
    } else {
      setActive(false);
    }
  }, [tourKey]);

  useEffect(() => {
    setCurrent(0);
  }, [tourKey]);

  const next = useCallback(() => {
    if (current < steps.length - 1) setCurrent((c) => c + 1);
    else finish();
  }, [current, steps.length]);

  const prev = useCallback(() => {
    if (current > 0) setCurrent((c) => c - 1);
  }, []);

  const finish = useCallback(() => {
    setActive(false);
    setCurrent(0);
    if (tourKey) localStorage.setItem(STORAGE_KEY_PREFIX + tourKey, "1");
  }, [tourKey]);

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

  if (!active || !steps.length) return null;

  const step = steps[current];

  return (
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center p-6"
      style={{ background: "rgba(0,0,0,0.65)" }}
      role="dialog"
      aria-modal="true"
      aria-label="Guide interactif"
    >
      <div
        ref={dialogRef}
        className="w-full max-w-sm rounded-2xl border border-white/[0.10] bg-[#0F0F0F]/95 backdrop-blur-xl p-6 animate-fade-up-d1"
        style={{ boxShadow: "0 24px 60px rgba(0,0,0,0.6)" }}
      >
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-500/15 flex items-center justify-center">
              <iconify-icon icon={step.icon} style={{ fontSize: "14px", color: "#4F8EF7" }} />
            </div>
            <span className="text-[10px] text-[#4F8EF7] font-semibold uppercase tracking-widest">
              {current + 1}/{steps.length}
            </span>
          </div>
          <button
            type="button"
            onClick={finish}
            className="w-6 h-6 rounded-lg flex items-center justify-center text-[#555] hover:text-white hover:bg-white/[0.06] transition-all"
            title="Passer le guide"
          >
            <iconify-icon icon="lucide:x" style={{ fontSize: "14px" }} />
          </button>
        </div>

        <div className="text-[15px] font-semibold leading-tight mb-1.5">{step.title}</div>
        <p className="text-[12px] text-[#b0b0b0] leading-relaxed font-body-readable mb-4">{step.body}</p>

        <div className="flex items-center justify-between">
          <div>
            {!isFirst && (
              <button
                type="button"
                onClick={prev}
                className="text-[11px] text-[#666] hover:text-white px-2.5 py-1.5 rounded-lg hover:bg-white/[0.04] transition-all"
              >
                ← Precedent
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={finish}
              className="text-[10px] text-[#555] hover:text-[#888] transition-colors"
            >
              Passer
            </button>
            <button
              type="button"
              onClick={isLast ? finish : next}
              className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-4 py-2 rounded-xl transition-all ${
                isLast
                  ? "bg-gradient-to-r from-[#4F8EF7] to-[#9B6DFF] text-white hover:shadow-lg hover:shadow-blue-500/20"
                  : "bg-white/[0.08] text-white hover:bg-white/[0.12]"
              }`}
            >
              {isLast ? "C'est parti !" : "Suivant →"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
