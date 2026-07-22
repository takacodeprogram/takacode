"use client";

import L from "./L";
import { useEffect, useState } from "react";

const STORAGE_KEY = "tk_cookie_consent_v1";

export default function CookieNotice() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) {
        setVisible(true);
      }
    } catch {
      // ignore
    }
  }, []);

  function decide(value: string) {
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch {
      // ignore
    }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[400] p-3 sm:p-4">
      <div
        className="max-w-[900px] mx-auto rounded-2xl border border-white/[0.1] bg-[#0F0F0F]/95 backdrop-blur-xl p-4 flex flex-col sm:flex-row sm:items-center gap-3"
        style={{ boxShadow: "0 -8px 40px rgba(0,0,0,0.5)" }}
        role="dialog"
        aria-label="Consentement cookies"
      >
        <div className="flex items-start gap-2.5 flex-1 min-w-0">
          <iconify-icon icon="lucide:cookie" style={{ fontSize: "18px", color: "#4F8EF7" }} />
          <p className="font-body-readable text-[12px] text-[#b0b0b0] leading-relaxed">
            TakaCode utilise des cookies essentiels (session, preferences) pour fonctionner. Aucune pub, aucun traceur tiers.{" "}
            <L href="/cookies" className="text-[#89c7ff] hover:underline">
              En savoir plus
            </L>
            .
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => decide("essential")}
            className="text-[12px] text-[#888] hover:text-white px-3 py-2 rounded-lg hover:bg-white/[0.05] transition-colors"
          >
            Essentiels seulement
          </button>
          <button
            type="button"
            onClick={() => decide("all")}
            className="btn-primary inline-flex items-center gap-1.5 text-[12px]"
            style={{ padding: "8px 16px" }}
          >
            J'ai compris
          </button>
        </div>
      </div>
    </div>
  );
}
