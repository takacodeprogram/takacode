import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import PageHeader from "../../../../../../../components/app-shell/PageHeader";
import LessonForm from "../../../../../../../components/admin/LessonForm";
import { getAdminLesson, getAdminTrack, getAdminTrackCurriculum } from "../../../../../../../lib/adminCurriculum";
import { buildPageMetadata } from "../../../../../../../lib/seo";
import { createClient } from "../../../../../../../utils/supabase/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = buildPageMetadata({
  title: "Admin - Editer lecon",
  description: "Editer une lecon.",
  path: "/admin/parcours",
  noIndex: true
});

export default async function EditLessonPage({ params }) {
  const resolvedParams = await Promise.resolve(params);
  const trackId = String(resolvedParams?.trackId || "").trim();
  const lessonId = String(resolvedParams?.lessonId || "").trim();

  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

  const [{ track }, { lesson }, { modules }] = await Promise.all([
    getAdminTrack(supabase, trackId),
    getAdminLesson(supabase, lessonId),
    getAdminTrackCurriculum(supabase, trackId)
  ]);

  if (!track || !lesson) {
    notFound();
  }

  return (
    <>
      <PageHeader
        title="EDITER LA LECON"
        subtitle={`${track.title} · ${lesson.title}`}
        backHref={`/admin/parcours/${trackId}`}
        backLabel="Retour au parcours"
      />
      <LessonForm trackId={trackId} modules={modules} lesson={lesson} />
    </>
  );
}
