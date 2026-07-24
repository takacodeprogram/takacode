"use client";

import L from "./L";
import { useEffect, useState } from "react";
import { useI18n } from "./I18nProvider";

const STORAGE_KEY = "tk_cookie_consent_v1";

export default function CookieNotice() {
  const { t } = useI18n();
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
        aria-label={t("cookieNotice.title")}
      >
        <div className="flex items-start gap-2.5 flex-1 min-w-0">
          <iconify-icon icon="lucide:cookie" style={{ fontSize: "18px", color: "#4F8EF7" }} />
          <p className="font-body-readable text-[12px] text-[#b0b0b0] leading-relaxed">
            {t("cookieNotice.desc")}{" "}
            <L href="/cookies" className="text-[#89c7ff] hover:underline">
              {t("cookieNotice.learnMore")}
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
            {t("cookieNotice.essentialOnly")}
          </button>
          <button
            type="button"
            onClick={() => decide("all")}
            className="btn-primary inline-flex items-center gap-1.5 text-[12px]"
            style={{ padding: "8px 16px" }}
          >
            {t("cookieNotice.accept")}
          </button>
        </div>
      </div>
    </div>
  );
}
