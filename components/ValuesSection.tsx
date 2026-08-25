"use client";

import { useI18n } from "./I18nProvider";

const CARDS = [
  { key: "project", icon: "lucide:target", accent: "#4F8EF7" },
  { key: "ai", icon: "lucide:bot", accent: "#9B6DFF" },
  { key: "resources", icon: "lucide:library", accent: "#22D3EE" },
  { key: "outcome", icon: "lucide:package-check", accent: "#F59E0B" },
  { key: "community", icon: "lucide:users", accent: "#10B981" },
  { key: "opportunity", icon: "lucide:door-open", accent: "#EC4899" }
] as const;

export default function ValuesSection() {
  const { t } = useI18n();

  return (
    <section className="py-28 relative overflow-hidden" id="valeurs">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-violet-900/[0.02] to-transparent pointer-events-none" />
      <div className="max-w-[1320px] mx-auto px-8">
        <div className="mb-16">
          <div className="section-label mb-4">{t("values.sectionLabel")}</div>
          <h2 className="font-valorax gradient-text" style={{ fontSize: "clamp(30px, 3vw, 46px)", letterSpacing: "-0.02em" }}>
            {t("values.title")}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {CARDS.map((card, index) => (
            <div
              key={card.key}
              className="bg-[var(--surface-1)] border border-[var(--border-3)] rounded-2xl p-6 card-hover"
              style={
                index === CARDS.length - 1
                  ? { borderColor: `${card.accent}25`, boxShadow: `0 0 40px ${card.accent}10` }
                  : undefined
              }
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-5"
                style={{ backgroundColor: `${card.accent}15`, border: `1px solid ${card.accent}28` }}
              >
                <iconify-icon icon={card.icon} style={{ fontSize: "18px", color: card.accent }} />
              </div>
              <div className="font-venite text-[13px] text-[var(--text-primary)] mb-3 leading-snug">
                {t(`values.cards.${card.key}.title`)}
              </div>
              <p className="font-body-readable text-[12px] text-[var(--muted-4)] leading-relaxed">
                {t(`values.cards.${card.key}.desc`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
