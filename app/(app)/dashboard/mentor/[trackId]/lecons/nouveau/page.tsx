import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import PageHeader from "../../../../../../../components/app-shell/PageHeader";
import LessonForm from "../../../../../../../components/admin/LessonForm";
import { getAdminTrackCurriculum } from "../../../../../../../lib/adminCurriculum";
import { buildPageMetadata } from "../../../../../../../lib/seo";
import { createClient } from "../../../../../../../utils/supabase/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = buildPageMetadata({
  title: "Mentor - Nouvelle lecon",
  description: "Ajouter une leçon a mon parcours.",
  path: "/dashboard/mentor",
  noIndex: true
});

export default async function MentorNewLessonPage({ params, searchParams }: { params: Promise<Record<string, string>>; searchParams?: Promise<Record<string, string>> }) {
  const { trackId = "" } = await params;
  const query = searchParams ? await searchParams : {};
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/signin?next=/dashboard/mentor");

  const { data: track } = await supabase.from("learning_tracks").select("id, title, created_by").eq("id", trackId).maybeSingle();
  if (!track || track.created_by !== user.id) notFound();

  const { modules } = await getAdminTrackCurriculum(supabase, trackId);
  const defaultModuleId = modules.some((module) => module.id === query.module) ? query.module : modules[0]?.id || "";

  return (
    <>
      <PageHeader title="NOUVELLE LECON" subtitle={track.title} backHref={`/dashboard/mentor/${trackId}`} backLabel="Retour au parcours" />
      <LessonForm trackId={trackId} modules={modules} defaultModuleId={defaultModuleId} userId={user.id} />
    </>
  );
}

