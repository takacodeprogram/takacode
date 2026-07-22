import Link from "next/link";
import { formatTrackMeta } from "../lib/tracks";
import { getLevelChipClass } from "../lib/track-helpers";
import { localePath } from "../lib/localeHelpers";
import { getServerLocale } from "../lib/serverLocale";
import { getLocale } from "../lib/i18n";
import type { Track } from "../lib/tracks";
import type { Locale } from "../lib/i18n";

interface Props {
  tracks?: Track[];
}

export default async function ParcoursSection({ tracks = [] }: Props) {
  const locale: Locale = await getServerLocale();
  const { t } = getLocale(locale);
  const featuredTracks = tracks.slice(0, 3);
  const secondaryTracks = tracks.slice(3, 7);

  return (
    <section className="py-28" id="parcours">
      <div className="max-w-[1320px] mx-auto px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between mb-16">
          <div>
            <div className="section-label mb-4">{t("parcoursSection.sectionLabel")}</div>
            <h2 className="font-valorax gradient-text" style={{ fontSize: "clamp(36px, 3.5vw, 54px)", letterSpacing: "-0.02em" }}>
              {t("parcoursSection.title")}
            </h2>
          </div>
          <Link href={localePath("/tracks", locale)} id="parcours-all-link" className="btn-secondary inline-flex items-center gap-2 self-start lg:self-auto">
            {t("parcoursSection.viewAll")}
            <iconify-icon icon="lucide:arrow-right" style={{ fontSize: "14px" }} />
          </Link>
        </div>

        {featuredTracks.length ? (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
              {featuredTracks.map((track) => (
                <article key={track.id} className="bg-[#111] border border-white/[0.07] rounded-2xl p-6 card-hover project-card">
                  <div className="flex items-start justify-between mb-5">
                    <div
                      className="w-11 h-11 rounded-xl border flex items-center justify-center"
                      style={{
                        borderColor: `${track.accentColor}55`,
                        background: `${track.accentColor}22`
                      }}
                    >
                      <iconify-icon icon={track.icon} style={{ color: track.accentColor, fontSize: "20px" }} />
                    </div>
                    <span className={getLevelChipClass(track.levelLabel) + " text-[10px] font-semibold px-2.5 py-1 rounded-full"}>{track.levelLabel}</span>
                  </div>
                  <div className="font-venite text-[14px] text-white mb-2">{track.title.toUpperCase()}</div>
                  <p className="font-body-readable text-[12px] text-[#666] leading-relaxed mb-5">{track.summary}</p>
                  <div className="font-body-readable flex items-center gap-4 mb-5 text-[11px] text-[#555]">
                    <span className="flex items-center gap-1.5"><iconify-icon icon="lucide:clock" /> {track.durationWeeks} {t("parcoursSection.weeks")}</span>
                    <span className="flex items-center gap-1.5"><iconify-icon icon="lucide:book" /> {formatTrackMeta(track)}</span>
                  </div>
                  <Link href={localePath("/tracks", locale)} className="w-full btn-secondary flex items-center justify-center gap-2 text-[12px]" style={{ padding: "10px 20px" }}>
                    {t("parcoursSection.discover")} <iconify-icon icon="lucide:arrow-right" style={{ fontSize: "13px" }} />
                  </Link>
                </article>
              ))}
            </div>

            {secondaryTracks.length ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
                {secondaryTracks.map((track) => (
                  <article key={track.id} className="bg-[#111] border border-white/[0.07] rounded-2xl p-5 card-hover project-card">
                    <div
                      className="w-10 h-10 rounded-xl border flex items-center justify-center mb-4"
                      style={{
                        borderColor: `${track.accentColor}55`,
                        background: `${track.accentColor}22`
                      }}
                    >
                      <iconify-icon icon={track.icon} style={{ color: track.accentColor, fontSize: "18px" }} />
                    </div>
                    <div className="font-venite text-[12px] text-white mb-1.5">{track.title.toUpperCase()}</div>
                    <p className="font-body-readable text-[11px] text-[#555] leading-relaxed mb-4">{track.summary}</p>
                    <div className="font-body-readable flex items-center gap-3 mb-4 text-[10px] text-[#444]">
                      <span className="flex items-center gap-1"><iconify-icon icon="lucide:clock" /> {track.durationWeeks} {t("parcoursSection.shortWeeks")}</span>
                      <span className={getLevelChipClass(track.levelLabel) + " text-[10px] font-medium px-2 py-0.5 rounded-full"}>{track.levelLabel}</span>
                    </div>
                    <Link href={localePath("/tracks", locale)} className="text-[11px] text-[#4F8EF7] font-medium flex items-center gap-1 hover:gap-2 transition-all">
                      {t("parcoursSection.discover")} <iconify-icon icon="lucide:arrow-right" style={{ fontSize: "12px" }} />
                    </Link>
                  </article>
                ))}
              </div>
            ) : null}
          </>
        ) : (
          <div className="rounded-2xl border border-white/[0.08] bg-[#111] p-6 text-[13px] text-[#888] font-body-readable">
            {t("parcoursSection.empty")}
          </div>
        )}
      </div>
    </section>
  );
}
