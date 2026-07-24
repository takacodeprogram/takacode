"use client";

import L from "./L";
import { useEffect, useRef, useState } from "react";
import { useI18n } from "./I18nProvider";

const STEP_KEYS: Array<{ icon: string; key: string; accent: string }> = [
  { icon: "lucide:lightbulb", key: "idea", accent: "#4F8EF7" },
  { icon: "lucide:git-branch", key: "track", accent: "#22D3EE" },
  { icon: "lucide:book-open", key: "resources", accent: "#10B981" },
  { icon: "lucide:video", key: "sessions", accent: "#F59E0B" },
  { icon: "lucide:package", key: "publish", accent: "#9B6DFF" },
  { icon: "lucide:trending-up", key: "monetize", accent: "#EF4444" }
];

function StepCard({ icon, title, desc, index, isVisible, accent }: { icon: string; title: string; desc: string; index: number; isVisible: boolean; accent: string }) {
  return (
    <div
      className="text-center transition-all duration-700"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(30px)",
        transitionDelay: `${index * 120}ms`
      }}
    >
      <div
        className="w-[88px] h-[88px] rounded-2xl bg-[#111] border flex items-center justify-center mx-auto mb-5 transition-all duration-500 step-icon"
        style={{
          borderColor: isVisible ? `${accent}55` : "rgba(255,255,255,0.07)",
          boxShadow: isVisible ? `0 0 40px ${accent}22, 0 0 0 1px ${accent}22` : "none"
        }}
      >
        <iconify-icon icon={icon} style={{ fontSize: "28px", color: isVisible ? accent : "#666", transition: "color 0.5s" }} />
      </div>
      <div className="font-venite text-[12px] text-white mb-2">{title}</div>
      <p className="font-body-readable text-[11px] text-[#555] leading-relaxed transition-colors duration-500" style={{ color: isVisible ? "#888" : "#555" }}>
        {desc}
      </p>
    </div>
  );
}

export default function HowItWorksSection() {
  const { t } = useI18n();
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-28 overflow-hidden" id="comment-ca-marche" ref={sectionRef}>
      {/* CSS animations */}
      <style>{`
        @keyframes beam-move {
          0% { left: -4%; opacity: 0; }
          10% { opacity: 1; }
          85% { opacity: 1; }
          100% { left: 104%; opacity: 0; }
        }
        @keyframes beam-pulse {
          0%, 100% { box-shadow: 0 0 4px 2px rgba(79, 142, 247, 0.3); }
          50% { box-shadow: 0 0 12px 4px rgba(79, 142, 247, 0.6); }
        }
        .glow-line-beam {
          animation: beam-move 3.5s ease-in-out infinite;
        }
        .glow-line-beam::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(79,142,247,0.06) 0%, transparent 70%);
          pointer-events: none;
        }
        .step-icon:hover {
          transform: scale(1.06);
          border-color: rgba(255,255,255,0.15) !important;
        }
      `}</style>

      <div className="max-w-[1320px] mx-auto px-8">
        <div className="text-center mb-20">
          <div className="section-label mb-4">{t("process.sectionLabel")}</div>
          <h2 className="font-valorax gradient-text mb-5" style={{ fontSize: "clamp(36px, 3.5vw, 54px)", letterSpacing: "-0.02em" }}>
            {t("process.title")}
          </h2>
          <p className="font-body-readable text-[#666] text-[15px] max-w-md mx-auto">
            {t("process.subtitle")}
          </p>
        </div>

        <div className="relative">
          {/* Ligne lumineuse animée */}
          <div className="hidden xl:block absolute top-[44px] left-[calc(100%/12)] right-[calc(100%/12)] h-px z-0">
            <div className="relative w-full h-full">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
              <div className="glow-line-beam absolute top-1/2 -translate-y-1/2 w-[40px] h-[3px] rounded-full bg-gradient-to-r from-transparent via-[#4F8EF7] to-transparent" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5 relative z-10">
            {STEP_KEYS.map((step, index) => (
              <StepCard
                key={step.key}
                icon={step.icon}
                title={t(`process.steps.${step.key}.title`)}
                desc={t(`process.steps.${step.key}.desc`)}
                index={index}
                isVisible={visible}
                accent={step.accent}
              />
            ))}
          </div>
        </div>

        <div className="text-center mt-16 transition-all duration-1000" style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(20px)" }}>
          <L href="/projects" id="how-cta-link" className="btn-primary glow-btn inline-flex items-center gap-2" style={{ fontSize: "14px", padding: "14px 32px" }}>
            <iconify-icon icon="lucide:zap" style={{ fontSize: "16px" }} />
            {t("process.cta")}
          </L>
        </div>
      </div>
    </section>
  );
}
