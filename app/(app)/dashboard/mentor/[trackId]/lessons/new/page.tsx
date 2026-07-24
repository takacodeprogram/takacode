import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";

import PageHeader from "../../../../../../../components/app-shell/PageHeader";
import LessonForm from "../../../../../../../components/admin/LessonForm";
import { getAdminTrackCurriculum } from "../../../../../../../lib/adminCurriculum";
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
    title: t("dashboardMentorNewLesson.title"),
    description: t("dashboardMentorNewLesson.title"),
    path: "/dashboard/mentor",
    noIndex: true
  });
}

export default async function MentorNewLessonPage({ params, searchParams }: { params: Promise<Record<string, string>>; searchParams?: Promise<Record<string, string>> }) {
  const { trackId = "" } = await params;
  const query = searchParams ? await searchParams : {};
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);
  const locale = await getServerLocale();
  const { t } = getLocale(locale);
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    const p = locale === DEFAULT_LOCALE ? "" : `/${locale}`;
    redirect(`${p}/signin?next=${p}/dashboard/mentor`);
  }

  const { data: track } = await supabase.from("learning_tracks").select("id, title, created_by").eq("id", trackId).maybeSingle();
  if (!track || track.created_by !== user.id) notFound();

  const { modules } = await getAdminTrackCurriculum(supabase, trackId);
  const defaultModuleId = modules.some((module) => module.id === query.module) ? query.module : modules[0]?.id || "";

  return (
    <>
      <PageHeader title={t("dashboardMentorNewLesson.title")} subtitle={track.title} backHref={localePath(`/dashboard/mentor/${trackId}`, locale)} backLabel={t("dashboardMentorNewLesson.backLabel")} />
      <LessonForm trackId={trackId} modules={modules} defaultModuleId={defaultModuleId} userId={user.id} />
    </>
  );
}
