"use client";

import L from "./L";
import { useEffect, useRef, useState } from "react";
import { useI18n } from "./I18nProvider";

const ENTRIES = [
  {
    key: "build",
    icon: "lucide:hammer",
    accent: "#4F8EF7",
    gradient: "from-blue-500/10 to-blue-600/5",
    border: "border-blue-500/20",
    href: "/projects",
  },
  {
    key: "challenges",
    icon: "lucide:flame",
    accent: "#F59E0B",
    gradient: "from-amber-500/10 to-orange-600/5",
    border: "border-amber-500/20",
    href: "/tracks",
  },
  {
    key: "missions",
    icon: "lucide:briefcase",
    accent: "#10B981",
    gradient: "from-emerald-500/10 to-green-600/5",
    border: "border-emerald-500/20",
    href: "/community",
  },
] as const;

export default function EntryPointsSection() {
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
    <section className="py-28 relative overflow-hidden" id="portes" ref={sectionRef}>
      <div className="max-w-[1320px] mx-auto px-8">
        <div className="text-center mb-16">
          <div className="section-label mb-4">{t("entryPoints.sectionLabel")}</div>
          <h2
            className="font-valorax gradient-text mb-5"
            style={{ fontSize: "clamp(36px, 3.5vw, 54px)", letterSpacing: "-0.02em" }}
          >
            {t("entryPoints.title")}
          </h2>
          <p className="font-body-readable text-[var(--muted-4)] text-[15px] max-w-lg mx-auto">
            {t("entryPoints.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {ENTRIES.map((entry, index) => (
            <L
              key={entry.key}
              href={entry.href}
              id={`entry-${entry.key}`}
              className="block group"
            >
              <div
                className={`relative rounded-2xl border ${entry.border} bg-gradient-to-br ${entry.gradient} p-8 h-full transition-all duration-500 hover:scale-[1.02] hover:shadow-xl cursor-pointer`}
                style={{
                  opacity: visible ? 1 : 0,
                  transform: visible ? "translateY(0)" : "translateY(30px)",
                  transitionDelay: `${index * 150}ms`,
                }}
              >
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center mb-6 transition-all duration-500"
                  style={{
                    backgroundColor: `${entry.accent}15`,
                    border: `1px solid ${entry.accent}30`,
                    boxShadow: visible ? `0 0 30px ${entry.accent}15` : "none",
                  }}
                >
                  <iconify-icon
                    icon={entry.icon}
                    style={{ fontSize: "24px", color: entry.accent }}
                  />
                </div>

                <div
                  className="font-venite text-[18px] mb-3"
                  style={{ color: entry.accent }}
                >
                  {t(`entryPoints.cards.${entry.key}.title`)}
                </div>

                <div className="font-body-readable text-[14px] text-[var(--text-primary)] font-medium mb-3">
                  {t(`entryPoints.cards.${entry.key}.headline`)}
                </div>

                <p className="font-body-readable text-[13px] text-[var(--muted-4)] leading-relaxed mb-6">
                  {t(`entryPoints.cards.${entry.key}.desc`)}
                </p>

                <div
                  className="inline-flex items-center gap-2 font-body-readable text-[12px] font-semibold transition-all duration-300 group-hover:gap-3"
                  style={{ color: entry.accent }}
                >
                  {t(`entryPoints.cards.${entry.key}.cta`)}
                  <iconify-icon
                    icon="lucide:arrow-right"
                    style={{ fontSize: "14px" }}
                  />
                </div>
              </div>
            </L>
          ))}
        </div>
      </div>
    </section>
  );
}
