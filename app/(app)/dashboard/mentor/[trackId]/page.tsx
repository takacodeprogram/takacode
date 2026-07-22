import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";

import PageHeader from "../../../../../components/app-shell/PageHeader";
import TrackForm from "../../../../../components/admin/TrackForm";
import TrackElementsManager from "../../../../../components/admin/TrackElementsManager";
import { getAdminTrackCurriculum } from "../../../../../lib/adminCurriculum";
import { getLocale } from "../../../../../lib/i18n";
import { buildPageMetadata } from "../../../../../lib/seo";
import { getServerLocale } from "../../../../../lib/serverLocale";
import { localePath } from "../../../../../lib/localeHelpers";
import { DEFAULT_LOCALE } from "../../../../../lib/i18n";
import { createClient } from "../../../../../utils/supabase/server";

const TRACK_COLUMNS =
  "id, slug, goal_key, title, summary, description, level_label, duration_weeks, accent_color, icon, objective, resources, next_session, is_published, is_active, created_by, is_pending, locale";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata() {
  const localeServer = await getServerLocale();
  const { t } = getLocale(localeServer);
  return buildPageMetadata({
    title: t("dashboardMentorEdit.subtitle"),
    description: t("dashboardMentorEdit.subtitle"),
    path: "/dashboard/mentor",
    noIndex: true
  });
}

export default async function MentorEditTrackPage({ params }: { params: Promise<Record<string, string>> }) {
  const resolvedParams = await Promise.resolve(params);
  const trackId = String(resolvedParams?.trackId || "").trim();

  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);
  const locale = await getServerLocale();

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    const p = locale === DEFAULT_LOCALE ? "" : `/${locale}`;
    redirect(`${p}/signin?next=${p}/dashboard/mentor`);
  }

  const { data: track } = await supabase.from("learning_tracks").select(TRACK_COLUMNS).eq("id", trackId).maybeSingle();
  if (!track || track.created_by !== user.id) {
    notFound();
  }

  const { t } = getLocale(locale);
  const { modules } = await getAdminTrackCurriculum(supabase, trackId);

  return (
    <>
      <PageHeader title={track.title} subtitle={t("dashboardMentorEdit.subtitle")} backHref={localePath("/dashboard/mentor", locale)} backLabel={t("dashboardMentorEdit.backLabel")} />

      {track.is_pending ? (
        <TrackForm mode="edit" track={track} proposal userId={user.id} redirectBase="/dashboard/mentor" />
      ) : (
        <div className="rounded-xl border border-white/[0.08] bg-[#111] px-4 py-4 text-[12px] text-[#a5a5a5] font-body-readable">
          {track.is_published
            ? t("dashboardMentorEdit.published")
            : t("dashboardMentorEdit.rejected")}
        </div>
      )}

      <div className="mt-6">
        <TrackElementsManager
          trackId={trackId}
          trackSlug={track.slug}
          initialModules={modules}
          basePath={`/dashboard/mentor/${trackId}`}
        />
      </div>
    </>
  );
}
