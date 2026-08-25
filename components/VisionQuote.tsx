"use client";

import { useEffect, useRef, useState } from "react";
import { useI18n } from "./I18nProvider";

export default function VisionQuote() {
  const { t } = useI18n();
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-20 relative overflow-hidden" ref={ref}>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/[0.03] rounded-full filter blur-[100px]" />
      </div>

      <div
        className="relative z-10 max-w-[880px] mx-auto px-8 text-center transition-all duration-1000"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(20px)",
        }}
      >
        <div className="mb-6">
          <iconify-icon
            icon="lucide:quote"
            className="text-[#4F8EF7]/30"
            style={{ fontSize: "32px" }}
          />
        </div>

        <blockquote className="font-valorax text-[var(--text-primary)] mb-8" style={{ fontSize: "clamp(19px, 2.1vw, 27px)", lineHeight: 1.15, letterSpacing: "-0.01em" }}>
          {t("visionQuote.line1")}
          <br />
          <span className="gradient-text-blue">{t("visionQuote.line2")}</span>
        </blockquote>

        <p className="font-body-readable text-[var(--muted-4)] text-[14px] leading-relaxed max-w-[600px] mx-auto">
          {t("visionQuote.desc")}
        </p>
      </div>
    </section>
  );
}
