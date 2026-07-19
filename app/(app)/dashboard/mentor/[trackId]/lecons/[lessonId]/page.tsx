import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import PageHeader from "../../../../../../../components/app-shell/PageHeader";
import LessonForm from "../../../../../../../components/admin/LessonForm";
import { getAdminLesson, getAdminTrackCurriculum } from "../../../../../../../lib/adminCurriculum";
import { buildPageMetadata } from "../../../../../../../lib/seo";
import { createClient } from "../../../../../../../utils/supabase/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = buildPageMetadata({
  title: "Mentor - Editer lecon",
  description: "Éditer une leçon de mon parcours.",
  path: "/dashboard/mentor",
  noIndex: true
});

export default async function MentorEditLessonPage({ params }: { params: Promise<Record<string, string>> }) {
  const { trackId = "", lessonId = "" } = await params;
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/signin?next=/dashboard/mentor");

  const [{ data: track }, { lesson }, { modules }] = await Promise.all([
    supabase.from("learning_tracks").select("id, title, created_by").eq("id", trackId).maybeSingle(),
    getAdminLesson(supabase, lessonId),
    getAdminTrackCurriculum(supabase, trackId)
  ]);

  const moduleIds = new Set(modules.map((module) => module.id));
  if (!track || track.created_by !== user.id || !lesson || !moduleIds.has(String(lesson.module_id || ""))) notFound();

  return (
    <>
      <PageHeader title="EDITER LA LECON" subtitle={`${track.title} · ${String(lesson.title || "")}`} backHref={`/dashboard/mentor/${trackId}`} backLabel="Retour au parcours" />
      <LessonForm trackId={trackId} modules={modules} lesson={lesson as never} userId={user.id} />
    </>
  );
}

