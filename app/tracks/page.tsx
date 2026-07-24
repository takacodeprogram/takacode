import Link from "next/link";
import { cookies } from "next/headers";
import Navbar from "../../components/Navbar";
import FooterSection from "../../components/FooterSection";
import { buildPageMetadata } from "../../lib/seo";
import { createClient } from "../../utils/supabase/server";
import { listPublishedTracks } from "../../lib/tracks";
import { orderTracksByGuidance } from "../../lib/trackGuidance";
import { getServerLocale } from "../../lib/serverLocale";
import { localePath } from "../../lib/localeHelpers";
import { getLocale, type Locale } from "../../lib/i18n";
import { buildTrackCompetencies, getLevelChipClass } from "../../lib/track-helpers";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata() {
  const locale = await getServerLocale();
  const { t } = getLocale(locale);
  return buildPageMetadata({
    title: t("tracksPage.title"),
    description: t("tracksPage.description"),
    path: "/tracks"
  });
}

function GuestCTA({ locale }: { locale: Locale }) {
  const { t } = getLocale(locale);
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <Navbar />
      <main className="pt-[64px]">
        <section className="py-24 md:py-28 px-8">
          <div className="max-w-[600px] mx-auto text-center">
            <div className="w-16 h-16 rounded-2xl border border-white/[0.08] bg-white/[0.02] flex items-center justify-center mx-auto mb-6">
              <iconify-icon icon="lucide:book-open" className="text-[#4F8EF7]" style={{ fontSize: "30px" }} />
            </div>
            <div className="section-label mb-3">{t("tracksPage.guestCTA.sectionLabel")}</div>
            <h1 className="font-valorax gradient-text" style={{ fontSize: "clamp(32px, 4vw, 52px)", letterSpacing: "-0.02em" }}>
              {t("tracksPage.guestCTA.title")}
            </h1>
            <p className="font-body-readable text-[14px] text-[#888] mt-3 mb-8 leading-relaxed">
              {t("tracksPage.guestCTA.description")}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href={localePath("/signin", locale)} className="btn-primary inline-flex items-center gap-2" style={{ fontSize: "13px", padding: "12px 24px" }}>
                <iconify-icon icon="lucide:log-in" style={{ fontSize: "14px" }} />
                {t("tracksPage.guestCTA.signIn")}
              </Link>
              <Link href={localePath("/signup", locale)} className="btn-secondary inline-flex items-center gap-2" style={{ fontSize: "13px", padding: "12px 24px" }}>
                <iconify-icon icon="lucide:user-plus" style={{ fontSize: "14px" }} />
                {t("tracksPage.guestCTA.signUp")}
              </Link>
            </div>
          </div>
        </section>
      </main>
      <hr className="section-divider" />
      <FooterSection />
    </div>
  );
}

export default async function TracksPage() {
  let supabase;
  let user = null;
  let locale: Locale = "en";

  try {
    const cookieStore = await cookies();
    supabase = await createClient(cookieStore);
    const { data: { user: u } } = await supabase.auth.getUser();
    user = u;
    locale = await getServerLocale();
  } catch {
    return <GuestCTA locale="en" />;
  }

  if (!user) return <GuestCTA locale={locale} />;

  const { t } = getLocale(locale);
  const allTracksResult = await listPublishedTracks(supabase, { locale });
  const allTracks = orderTracksByGuidance(allTracksResult.tracks);
  const schemaReady = allTracksResult.schemaReady;
  const hasError = Boolean(allTracksResult.error);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <Navbar />
      <main className="pt-[64px]">
        <section className="py-24 md:py-28 px-8">
          <div className="max-w-[1320px] mx-auto space-y-8">
            <div className="max-w-[940px]">
              <div className="section-label mb-4">{t("tracksPage.sectionLabel")}</div>
              <h1 className="font-valorax gradient-text text-[clamp(34px,4vw,56px)] leading-[0.92]">{t("tracksPage.title")}</h1>
              <p className="font-body-readable text-[15px] text-[#8d8d8d] mt-4">
                {t("tracksPage.description")}
              </p>
            </div>

            {!schemaReady ? (
              <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-[12px] text-amber-100">
                {t("tracksPage.schemaNotReady")}
              </div>
            ) : null}

            {hasError ? (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-[12px] text-red-200">
                {t("tracksPage.loadError")}
              </div>
            ) : null}

            {allTracks.length ? (
              <section className="rounded-2xl border border-white/[0.08] bg-[#111] p-5 md:p-6">
                <div className="flex items-center justify-between gap-3 flex-wrap mb-4">
                  <h2 className="font-venite-italic text-[16px] text-white">{t("tracksPage.availableTitle")}</h2>
                  <span className="text-[11px] text-[#8e8e8e] font-body-readable">{t("tracksPage.activeCount").replace("{n}", String(allTracks.length))}</span>
                </div>

                <div className="rounded-xl border border-blue-500/20 bg-blue-500/[0.06] px-4 py-3 mb-5 flex items-start gap-2.5">
                  <iconify-icon icon="lucide:route" style={{ fontSize: "16px", color: "#4F8EF7" }} />
                  <p className="font-body-readable text-[12px] text-blue-100/90 leading-relaxed">
                    <span className="font-semibold text-white">{t("tracksPage.orderHint")}</span>
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {allTracks.map((track, index) => {
                    const competencies = buildTrackCompetencies(track).slice(0, 3);
                    const levelChipClass = getLevelChipClass(track.levelLabel);
                    const trackData = track as unknown as { modules?: number; lesson_count?: number };
                    const metaStr = trackData.modules ? `${trackData.modules} modules` : trackData.lesson_count ? `${trackData.lesson_count} modules` : "";

                    return (
                      <article key={track.id} className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4 card-hover project-card">
                        <div className="flex items-center justify-between gap-3 mb-3">
                          <span className="text-[10px] px-2 py-1 rounded-full border border-blue-400/25 bg-blue-500/10 text-blue-200 font-semibold">
                            {t("tracksPage.stepLabel").replace("{n}", String(index + 1))}
                          </span>
                          <span className={`${levelChipClass} text-[10px] font-semibold px-2.5 py-1 rounded-full`}>
                            {track.levelLabel}
                          </span>
                        </div>

                        <h3 className="font-venite-italic text-[14px] text-white leading-tight mb-1.5">{track.title}</h3>
                        <p className="font-body-readable text-[11px] text-[#6f6f6f] mb-3">{metaStr}</p>

                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {competencies.map((competence) => (
                            <span key={`${track.id}-${competence}`} className="text-[10px] px-2 py-1 rounded-full border border-white/[0.08] bg-white/[0.03] text-[#9f9f9f]">
                              {competence}
                            </span>
                          ))}
                        </div>

                        <Link href={localePath(`/tracks/${track.slug}`, locale)} className="inline-flex items-center gap-2 text-[11px] text-[#4F8EF7] font-semibold hover:underline">
                          {t("tracksPage.viewDetails")}
                          <iconify-icon icon="lucide:arrow-right" style={{ fontSize: "12px" }} />
                        </Link>
                      </article>
                    );
                  })}
                </div>
              </section>
            ) : null}

            {!allTracks.length && schemaReady && !hasError ? (
              <div className="rounded-2xl border border-white/[0.08] bg-[#111] p-6 text-[13px] text-[#888] font-body-readable">
                {t("tracksPage.empty")}
              </div>
            ) : null}
          </div>
        </section>
      </main>
      <hr className="section-divider" />
      <FooterSection />
    </div>
  );
}
