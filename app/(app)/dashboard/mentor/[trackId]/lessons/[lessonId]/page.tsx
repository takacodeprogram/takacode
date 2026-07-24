import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";

import PageHeader from "../../../../../../../components/app-shell/PageHeader";
import LessonForm from "../../../../../../../components/admin/LessonForm";
import { getAdminLesson, getAdminTrackCurriculum } from "../../../../../../../lib/adminCurriculum";
import { getLocale } from "../../../../../../../lib/i18n";
import { getServerLocale } from "../../../../../../../lib/serverLocale";
import { buildPageMetadata } from "../../../../../../../lib/seo";
import { localePath } from "../../../../../../../lib/localeHelpers";
import { DEFAULT_LOCALE } from "../../../../../../../lib/i18n";
import { createClient } from "../../../../../../../utils/supabase/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata() {
  const localeServer = await getServerLocale();
  const { t } = getLocale(localeServer);
  return buildPageMetadata({
    title: t("dashboardMentorLesson.title"),
    description: t("dashboardMentorLesson.title"),
    path: "/dashboard/mentor",
    noIndex: true
  });
}

export default async function MentorEditLessonPage({ params }: { params: Promise<Record<string, string>> }) {
  const { trackId = "", lessonId = "" } = await params;
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);
  const locale = await getServerLocale();
  const { t } = getLocale(locale);
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    const p = locale === DEFAULT_LOCALE ? "" : `/${locale}`;
    redirect(`${p}/signin?next=${p}/dashboard/mentor`);
  }

  const [{ data: track }, { lesson }, { modules }] = await Promise.all([
    supabase.from("learning_tracks").select("id, title, created_by").eq("id", trackId).maybeSingle(),
    getAdminLesson(supabase, lessonId),
    getAdminTrackCurriculum(supabase, trackId)
  ]);

  const moduleIds = new Set(modules.map((module) => module.id));
  if (!track || track.created_by !== user.id || !lesson || !moduleIds.has(String(lesson.module_id || ""))) notFound();

  return (
    <>
      <PageHeader title={t("dashboardMentorLesson.title")} subtitle={`${track.title} · ${String(lesson.title || "")}`} backHref={localePath(`/dashboard/mentor/${trackId}`, locale)} backLabel={t("dashboardMentorLesson.backLabel")} />
      <LessonForm trackId={trackId} modules={modules} lesson={lesson as never} userId={user.id} />
    </>
  );
}
