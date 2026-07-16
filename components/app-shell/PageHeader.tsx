import Link from "next/link";
import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  backHref?: string;
  backLabel?: string;
  actions?: ReactNode;
}

export default function PageHeader({ title, subtitle, backHref, backLabel, actions }: PageHeaderProps) {
  return (
    <header className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between mb-7 animate-fade-up">
      <div>
        {backHref ? (
          <Link
            href={backHref}
            className="inline-flex items-center gap-1.5 text-[11px] text-[#7d7d7d] hover:text-white transition-colors mb-2"
          >
            <iconify-icon icon="lucide:arrow-left" style={{ fontSize: "12px" }} />
            {backLabel || "Retour"}
          </Link>
        ) : null}
        <h1 className="font-valorax text-2xl md:text-3xl mb-1">{title}</h1>
        {subtitle ? <p className="section-label">{subtitle}</p> : null}
      </div>

      {actions ? <div className="flex flex-wrap items-center gap-2.5">{actions}</div> : null}
    </header>
  );
}
