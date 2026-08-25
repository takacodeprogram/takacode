"use client";

import L from "./L";
import { useI18n } from "./I18nProvider";

// Les quatre facons dont une realisation TakaCode peut devenir une opportunite.
// L'ordre suit la chaine de la vision : preuve d'abord, demande economique ensuite.
const CARDS = [
  {
    key: "portfolio",
    icon: "lucide:folder-check",
    accent: "#4F8EF7",
    border: "border-blue-500/20",
    gradient: "from-blue-500/10 to-blue-600/5",
    href: "/projects",
    available: true
  },
  {
    key: "missions",
    icon: "lucide:briefcase",
    accent: "#10B981",
    border: "border-emerald-500/20",
    gradient: "from-emerald-500/10 to-green-600/5",
    href: "/community",
    available: false
  },
  {
    key: "mentors",
    icon: "lucide:users",
    accent: "#9B6DFF",
    border: "border-violet-500/20",
    gradient: "from-violet-500/10 to-purple-600/5",
    href: "/community",
    available: false
  },
  {
    key: "challenges",
    icon: "lucide:flame",
    accent: "#F59E0B",
    border: "border-amber-500/20",
    gradient: "from-amber-500/10 to-orange-600/5",
    href: "/tracks",
    available: false
  }
] as const;

export default function OpportunitiesSection() {
  const { t } = useI18n();

  return (
    <section className="py-24 md:py-28 px-8" id="opportunites">
      <div className="max-w-[1100px] mx-auto">
        <div className="text-center mb-14">
          <div className="section-label mb-3">{t("opportunitiesPage.sectionLabel")}</div>
          <h1
            className="font-valorax gradient-text mb-5"
            style={{ fontSize: "clamp(32px, 4vw, 52px)", letterSpacing: "-0.02em" }}
          >
            {t("opportunitiesPage.title")}
          </h1>
          <p className="font-body-readable text-[15px] text-[var(--muted-3)] max-w-[640px] mx-auto leading-relaxed">
            {t("opportunitiesPage.intro")}
          </p>
          <div className="mt-6 inline-flex items-center rounded-full border border-[var(--border-3)] bg-[var(--overlay-3)] px-4 py-2">
            <span className="font-body-readable text-[12px] text-[var(--muted-2)]">{t("opportunitiesPage.chain")}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-16">
          {CARDS.map((card) => (
            <div
              key={card.key}
              className={`relative rounded-2xl border ${card.border} bg-gradient-to-br ${card.gradient} p-7 h-full flex flex-col`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-11 h-11 rounded-xl border border-[var(--border-3)] bg-[var(--overlay-2)] flex items-center justify-center">
                  <iconify-icon icon={card.icon} style={{ color: card.accent, fontSize: "20px" }} />
                </div>
                <span
                  className="font-body-readable text-[10px] uppercase tracking-[0.12em] rounded-full border border-[var(--border-3)] px-2.5 py-1"
                  style={{ color: card.available ? "#22c55e" : "var(--muted-5)" }}
                >
                  {card.available ? t("opportunitiesPage.statusAvailable") : t("opportunitiesPage.statusPreparing")}
                </span>
              </div>

              <h2 className="font-venite-italic text-[18px] text-[var(--text-primary)] mb-2.5">
                {t(`opportunitiesPage.cards.${card.key}.title`)}
              </h2>
              <p className="font-body-readable text-[13px] text-[var(--muted-3)] leading-relaxed mb-6 flex-1">
                {t(`opportunitiesPage.cards.${card.key}.description`)}
              </p>

              <L
                href={card.href}
                id={`opportunities-${card.key}-cta`}
                className="font-body-readable text-[12px] inline-flex items-center gap-1.5 text-[var(--text-primary)] hover:opacity-80 transition-opacity"
              >
                {t(`opportunitiesPage.cards.${card.key}.cta`)}
                <iconify-icon icon="lucide:arrow-right" style={{ fontSize: "13px" }} />
              </L>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-[var(--border-3)] bg-[var(--surface-1)] p-8 md:p-10 mb-12">
          <div className="section-label mb-3">{t("opportunitiesPage.orgs.label")}</div>
          <h2 className="font-venite-italic text-[22px] text-[var(--text-primary)] mb-3">
            {t("opportunitiesPage.orgs.title")}
          </h2>
          <p className="font-body-readable text-[14px] text-[var(--muted-3)] leading-relaxed mb-6 max-w-[720px]">
            {t("opportunitiesPage.orgs.description")}
          </p>
          <L
            href="/community"
            id="opportunities-orgs-cta"
            className="btn-primary inline-flex items-center gap-2"
            style={{ fontSize: "13px", padding: "12px 24px" }}
          >
            {t("opportunitiesPage.orgs.cta")}
          </L>
        </div>

        <div className="border-t border-[var(--border-1)] pt-8">
          <div className="font-body-readable text-[12px] text-[var(--muted-2)] mb-1.5">
            {t("opportunitiesPage.honesty.title")}
          </div>
          <p className="font-body-readable text-[12px] text-[var(--muted-5)] leading-relaxed max-w-[720px]">
            {t("opportunitiesPage.honesty.description")}
          </p>
        </div>
      </div>
    </section>
  );
}
