"use client";

import Link from "next/link";
import { useI18n } from "./I18nProvider";

interface NextActionProject {
  id: string;
  title: string;
  status: string;
  repoUrl: string;
  liveUrl: string;
}

interface NextActionBlockProps {
  project: NextActionProject | null;
  hasEnrollment: boolean;
  hasOnboarding: boolean;
}

function iconify(icon: string) {
  return <iconify-icon icon={icon} style={{ fontSize: "14px" }} />;
}

export default function NextActionBlock({ project, hasEnrollment, hasOnboarding }: NextActionBlockProps) {
  const { t } = useI18n();

  if (!hasOnboarding) {
    return (
      <ActionCard
        icon="lucide:compass"
        accent="#22D3EE"
        title={t("nextAction.noOnboardingTitle")}
        description={t("nextAction.noOnboardingDesc")}
        href="/onboarding"
        label={t("nextAction.noOnboardingLabel")}
      />
    );
  }

  if (!hasEnrollment && !project) {
    return (
      <ActionCard
        icon="lucide:map"
        accent="#4F8EF7"
        title={t("nextAction.noTrackTitle")}
        description={t("nextAction.noTrackDesc")}
        href="/tracks"
        label={t("nextAction.noTrackLabel")}
      />
    );
  }

  if (!project) {
    return (
      <ActionCard
        icon="lucide:folder-code"
        accent="#9B6DFF"
        title={t("nextAction.noProjectTitle")}
        description={t("nextAction.noProjectDesc")}
        href="/dashboard/projects/new"
        label={t("nextAction.noProjectLabel")}
      />
    );
  }

  if (project.status === "idea") {
    return (
      <ActionCard
        icon="lucide:pencil-line"
        accent="#F59E0B"
        title={t("nextAction.ideaTitle")}
        description={t("nextAction.ideaDesc")}
        href={`/dashboard/projects/${project.id}`}
        label={t("nextAction.ideaLabel")}
      />
    );
  }

  if (!project.repoUrl) {
    return (
      <ActionCard
        icon="lucide:github"
        accent="#22D3EE"
        title={t("nextAction.noRepoTitle")}
        description={t("nextAction.noRepoDesc")}
        href={`/dashboard/projects/${project.id}`}
        label={t("nextAction.noRepoLabel")}
      />
    );
  }

  if (!project.liveUrl) {
    return (
      <ActionCard
        icon="lucide:rocket"
        accent="#10B981"
        title={t("nextAction.noLiveTitle")}
        description={t("nextAction.noLiveDesc")}
        href={`/dashboard/projects/${project.id}`}
        label={t("nextAction.noLiveLabel")}
      />
    );
  }

  return (
    <ActionCard
      icon="lucide:share-2"
      accent="#38BDF8"
      title={t("nextAction.doneTitle")}
      description={t("nextAction.doneDesc")}
      href={`/dashboard/projects/${project.id}`}
      label={t("nextAction.doneLabel")}
    />
  );
}

function ActionCard({
  icon: iconName,
  accent,
  title,
  description,
  href,
  label
}: {
  icon: string;
  accent: string;
  title: string;
  description: string;
  href: string;
  label: string;
}) {
  const { t } = useI18n();
  return (
    <div
      className="rounded-2xl border p-5"
      style={{
        borderColor: `${accent}33`,
        background: `linear-gradient(145deg, ${accent}12, rgba(255,255,255,0.02))`
      }}
    >
      <div className="flex items-center gap-3 mb-3">
        <div
          className="w-10 h-10 rounded-xl border inline-flex items-center justify-center"
          style={{
            borderColor: `${accent}55`,
            background: `${accent}1f`
          }}
        >
          {iconify(iconName)}
        </div>
        <div>
          <div className="font-venite text-[10px] tracking-widest text-[#888] uppercase">{t("nextAction.label")}</div>
          <h3 className="font-venite-italic text-[14px] text-white leading-tight">{title}</h3>
        </div>
      </div>
      <p className="font-body-readable text-[12px] text-[#a5a5a5] leading-relaxed mb-4">{description}</p>
      <Link
        href={href}
        className="inline-flex items-center gap-2 text-[12px] font-semibold px-4 py-2.5 rounded-xl border transition-all"
        style={{
          borderColor: `${accent}55`,
          background: `${accent}1f`,
          color: "#ffffff"
        }}
      >
        {label}
        <iconify-icon icon="lucide:arrow-right" style={{ fontSize: "12px" }} />
      </Link>
    </div>
  );
}