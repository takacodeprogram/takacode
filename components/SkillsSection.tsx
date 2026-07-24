"use client";

import { useI18n } from "./I18nProvider";

const ROW1_TAGS: Array<{ icon: string }> = [
  { icon: "lucide:globe" },
  { icon: "lucide:layout-dashboard" },
  { icon: "lucide:zap" },
  { icon: "lucide:bot" },
  { icon: "lucide:wallet" },
  { icon: "lucide:box" },
  { icon: "lucide:music" },
  { icon: "lucide:mic" },
  { icon: "lucide:youtube" },
  { icon: "lucide:video" },
  { icon: "lucide:bar-chart-3" }
];

const ROW2_TAGS: Array<{ icon: string }> = [
  { icon: "lucide:pie-chart" },
  { icon: "lucide:wallet" },
  { icon: "lucide:box" },
  { icon: "lucide:package" },
  { icon: "lucide:trending-up" },
  { icon: "lucide:wrench" },
  { icon: "lucide:message-square" },
  { icon: "lucide:smartphone" },
  { icon: "lucide:cpu" }
];

function SkillsRow({ tags, t, rowKey }: { tags: Array<{ icon: string }>; t: (key: string, fallback?: string) => string; rowKey: string }) {
  return (
    <>
      {tags.map((tag, index) => (
        <span key={index} className="community-tag flex items-center gap-2">
          <iconify-icon icon={tag.icon} /> {t(`skills.${rowKey}.${index}`)}
        </span>
      ))}
    </>
  );
}

export default function CompetencesSection() {
  const { t } = useI18n();
  return (
    <section className="py-28 overflow-hidden" id="competences">
      <div className="max-w-[1320px] mx-auto px-8 mb-14">
        <div className="section-label mb-4">{t("skills.sectionLabel")}</div>
        <h2 className="font-valorax gradient-text" style={{ fontSize: "clamp(36px, 3.5vw, 54px)", letterSpacing: "-0.02em" }}>
          {t("skills.title")}
        </h2>
      </div>

      <div className="scroll-container overflow-hidden mb-4">
        <div className="scroll-track flex gap-3">
          <SkillsRow tags={ROW1_TAGS} t={t} rowKey="tagsRow1" />
          <div className="flex gap-3 ml-3" aria-hidden="true">
            <SkillsRow tags={ROW1_TAGS} t={t} rowKey="tagsRow1" />
          </div>
        </div>
      </div>

      <div className="scroll-container overflow-hidden">
        <div className="scroll-track flex gap-3" style={{ animationDirection: "reverse", animationDuration: "25s" }}>
          <SkillsRow tags={ROW2_TAGS} t={t} rowKey="tagsRow2" />
          <div className="flex gap-3 ml-3" aria-hidden="true">
            <SkillsRow tags={ROW2_TAGS} t={t} rowKey="tagsRow2" />
          </div>
        </div>
      </div>
    </section>
  );
}
