"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { PRODUCT_RELEASES, LATEST_PRODUCT_VERSION } from "../lib/productReleases";

const DISMISSED_KEY = "tk_release_dismissed";

export default function ReleaseBanner() {
  const [visible, setVisible] = useState<boolean>(false);
  const [dismissed, setDismissed] = useState<boolean>(true);

  const latest = useMemo(() => PRODUCT_RELEASES[0], []);

  useEffect(() => {
    const stored = localStorage.getItem(DISMISSED_KEY);
    if (stored === LATEST_PRODUCT_VERSION) {
      setDismissed(true);
      return;
    }
    if (latest.status === "planifiee") {
      setDismissed(true);
      return;
    }
    const timer = setTimeout(() => setVisible(true), 1200);
    setDismissed(false);
    return () => clearTimeout(timer);
  }, [latest.status]);

  const handleDismiss = useCallback(() => {
    setVisible(false);
    localStorage.setItem(DISMISSED_KEY, LATEST_PRODUCT_VERSION);
  }, []);

  if (!visible || dismissed) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm animate-fade-up-d1">
      <div className="rounded-2xl border border-[#4F8EF7]/30 bg-[#0F0F0F]/95 backdrop-blur-xl p-4 shadow-2xl" style={{ boxShadow: "0 8px 32px rgba(79,142,247,0.15)" }}>
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] text-emerald-400 font-semibold uppercase tracking-widest">Nouveau</span>
          </div>
          <button
            type="button"
            onClick={handleDismiss}
            className="w-6 h-6 rounded-lg flex items-center justify-center text-[#555] hover:text-white hover:bg-white/[0.06] transition-all"
          >
            <iconify-icon icon="lucide:x" style={{ fontSize: "14px" }} />
          </button>
        </div>
        <div className="font-venite-italic text-[14px] text-white mb-1">Version {LATEST_PRODUCT_VERSION}</div>
        <p className="font-body-readable text-[12px] text-[#b0b0b0] leading-relaxed mb-3">
          {latest.title} : {latest.summary}
        </p>
        <Link
          href="/dashboard/nouveautes"
          onClick={handleDismiss}
          className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#4F8EF7] hover:underline"
        >
          Voir les nouveautes
          <iconify-icon icon="lucide:arrow-right" style={{ fontSize: "11px" }} />
        </Link>
      </div>
    </div>
  );
}