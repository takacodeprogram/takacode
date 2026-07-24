"use client";

import dynamic from "next/dynamic";
import { useI18n } from "./I18nProvider";
import type { GlobeMarker } from "./Globe3D";

const Globe3D = dynamic(() => import("./Globe3D"), { ssr: false });

interface GlobeSectionProps {
  markers: GlobeMarker[];
}

export default function GlobeSection({ markers }: GlobeSectionProps) {
  const { t } = useI18n();
  return (
    <section className="py-24 md:py-28 px-8">
      <div className="max-w-[900px] mx-auto">
        <div className="text-center mb-10">
          <div className="section-label mb-3">{t("globe.sectionLabel")}</div>
<h2 className="font-valorax gradient-text" style={{ fontSize: "clamp(28px, 3.5vw, 44px)", letterSpacing: "-0.02em" }}>
{t("globe.title")}
</h2>
          <p className="font-body-readable text-[14px] text-[#888] mt-3">
            {markers.length} {t("globe.subtitle")}
          </p>
        </div>
        <div className="rounded-2xl border border-white/[0.08] bg-[#0D0D0D] p-4 md:p-6">
          <Globe3D markers={markers} />
        </div>
      </div>
    </section>
  );
}
