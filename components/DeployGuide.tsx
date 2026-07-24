import Link from "next/link";

interface DeployGuideProps {
  repoUrl: string;
  liveUrl: string;
  projectId: string;
  projectTitle: string;
  t?: (key: string) => string;
}

function buildSteps(t?: (key: string) => string) {
  const k = (key: string) => (t ? t("deployGuide." + key) : key);
  return [
    {
      icon: "lucide:github",
      accent: "#22D3EE",
      title: k("step1Title"),
      description: k("step1Desc"),
      docsUrl: "https://docs.github.com/fr/get-started/quickstart/create-a-repo",
      actionLabel: k("step1Action"),
      actionUrl: "https://github.com/new"
    },
    {
      icon: "lucide:rocket",
      accent: "#10B981",
      title: k("step2Title"),
      description: k("step2Desc"),
      docsUrl: "https://vercel.com/docs/deployments/git",
      actionLabel: k("step2Action"),
      actionUrl: "https://vercel.com/new"
    },
    {
      icon: "lucide:globe",
      accent: "#4F8EF7",
      title: k("step3Title"),
      description: k("step3Desc"),
      docsUrl: "https://vercel.com/docs/projects/domains/add-a-domain",
      actionLabel: k("step3Action"),
      actionUrl: "https://vercel.com/docs/projects/domains/add-a-domain"
    }
  ];
}

function iconify(icon: string) {
  return <iconify-icon icon={icon} style={{ fontSize: "18px" }} />;
}

export default function DeployGuide({ repoUrl, liveUrl, projectTitle, t }: DeployGuideProps) {
  const k = (key: string) => (t ? t("deployGuide." + key) : key);
  const STEPS = buildSteps(t);
  const stepsDone = [
    Boolean(repoUrl),
    Boolean(liveUrl),
    false
  ];

  return (
    <div className="rounded-2xl border border-white/[0.08] bg-[#111] p-5 space-y-4">
      <div className="flex items-center gap-2.5 mb-1">
        <div className="w-8 h-8 rounded-lg border border-emerald-500/30 bg-emerald-500/10 inline-flex items-center justify-center">
          <iconify-icon icon="lucide:rocket" style={{ color: "#10B981", fontSize: "16px" }} />
        </div>
        <div>
          <div className="font-venite text-[11px] tracking-widest text-[#888] uppercase">{k("sectionLabel")}</div>
          <h3 className="font-venite-italic text-[14px] text-white">{k("title").replace("{name}", projectTitle)}</h3>
        </div>
      </div>

      <p className="font-body-readable text-[12px] text-[#a5a5a5] leading-relaxed">
        {k("intro")}
      </p>

      <div className="space-y-3">
        <DeployStep
          {...STEPS[0]}
          done={stepsDone[0]}
          value={repoUrl}
          t={t}
        />
        <DeployStep
          {...STEPS[1]}
          done={stepsDone[1]}
          value={liveUrl}
          disabled={!repoUrl}
          t={t}
        />
        <DeployStep
          {...STEPS[2]}
          done={stepsDone[2]}
          disabled={!liveUrl}
          t={t}
        />
      </div>
    </div>
  );
}

function DeployStep({
  icon: iconName,
  accent,
  title,
  description,
  actionLabel,
  actionUrl,
  docsUrl,
  done,
  value,
  disabled,
  t
}: {
  icon: string;
  accent: string;
  title: string;
  description: string;
  actionLabel: string;
  actionUrl: string;
  docsUrl: string;
  done: boolean;
  value?: string;
  disabled?: boolean;
  t?: (key: string) => string;
}) {
  return (
    <div
      className="rounded-xl border p-4 transition-all"
      style={{
        borderColor: done ? "rgba(16,185,129,0.3)" : disabled ? "rgba(255,255,255,0.04)" : `${accent}33`,
        background: done ? "rgba(16,185,129,0.08)" : disabled ? "rgba(255,255,255,0.01)" : `${accent}0d`,
        opacity: disabled ? 0.5 : 1
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <div
            className="w-9 h-9 rounded-xl border inline-flex items-center justify-center shrink-0 mt-0.5"
            style={{
              borderColor: done ? "rgba(16,185,129,0.4)" : `${accent}44`,
              background: done ? "rgba(16,185,129,0.15)" : `${accent}15`
            }}
          >
            {done ? (
              <iconify-icon icon="lucide:check" style={{ color: "#10B981", fontSize: "16px" }} />
            ) : iconify(iconName)}
          </div>
          <div>
            <div className="font-venite-italic text-[13px] text-white mb-1">{title}</div>
            <p className="font-body-readable text-[11px] text-[#a5a5a5] leading-relaxed">{description}</p>
            {value ? (
              <a
                href={value}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[11px] text-[#4F8EF7] hover:underline mt-1.5"
              >
                {value}
                <iconify-icon icon="lucide:external-link" style={{ fontSize: "10px" }} />
              </a>
            ) : null}
          </div>
        </div>

        {done ? (
          <span className="text-[10px] font-semibold px-2 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-200 shrink-0">
            {t ? t("deployGuide.done") : "Done"}
          </span>
        ) : (
          <div className="flex items-center gap-2 shrink-0">
            <a
              href={actionUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] font-semibold px-3 py-1.5 rounded-lg border transition-all inline-flex items-center gap-1.5"
              style={{
                borderColor: `${accent}55`,
                background: `${accent}1f`,
                color: "#ffffff"
              }}
            >
              {actionLabel}
              <iconify-icon icon="lucide:external-link" style={{ fontSize: "10px" }} />
            </a>
            <a
              href={docsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] text-[#888] hover:text-[#bbb] transition-colors"
              title={t ? t("deployGuide.viewDoc") : "View docs"}
            >
              <iconify-icon icon="lucide:book-open" style={{ fontSize: "14px" }} />
            </a>
          </div>
        )}
      </div>
    </div>
  );
}