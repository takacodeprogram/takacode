import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import PageHeader from "../../../../../../../components/app-shell/PageHeader";
import LessonForm from "../../../../../../../components/admin/LessonForm";
import { getAdminLesson, getAdminTrack, getAdminTrackCurriculum } from "../../../../../../../lib/adminCurriculum";
import { buildPageMetadata } from "../../../../../../../lib/seo";
import { createClient } from "../../../../../../../utils/supabase/server";
import { getLocale } from "../../../../../../../lib/i18n";
import { getServerLocale } from "../../../../../../../lib/serverLocale";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata() {
  const locale = await getServerLocale();
  const { t } = getLocale(locale);
  return buildPageMetadata({ title: t("adminLessonEdit.metaTitle"), description: t("adminLessonEdit.metaDesc"), path: "/admin/tracks", noIndex: true });
}

export default async function EditLessonPage({ params }: { params: Promise<Record<string, string>> }) {
  const resolvedParams = await Promise.resolve(params);
  const trackId = String(resolvedParams?.trackId || "").trim();
  const lessonId = String(resolvedParams?.lessonId || "").trim();

  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

  const locale = await getServerLocale();
  const { t } = getLocale(locale);

  const {
    data: { user }
  } = await supabase.auth.getUser();

  const [{ track: rawTrack }, { lesson: rawLesson }, { modules }] = await Promise.all([
    getAdminTrack(supabase, trackId),
    getAdminLesson(supabase, lessonId),
    getAdminTrackCurriculum(supabase, trackId)
  ]);

  if (!rawTrack || !rawLesson) {
    notFound();
  }

  const track = rawTrack as Record<string, unknown>;
  const lesson = rawLesson as Record<string, unknown>;

  return (
    <>
      <PageHeader
        title={t("adminLessonEdit.title")}
        subtitle={`${String(track.title || "")} · ${String(lesson.title || "")}`}
        backHref={`/admin/tracks/${trackId}`}
        backLabel={t("adminLessonEdit.backToTrack")}
      />
      <LessonForm trackId={trackId} modules={modules} lesson={rawLesson as never} userId={user?.id || ""} />
    </>
  );
}
