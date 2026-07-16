import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import PageHeader from "../../../../../../../components/app-shell/PageHeader";
import LessonForm from "../../../../../../../components/admin/LessonForm";
import { getAdminTrack, getAdminTrackCurriculum } from "../../../../../../../lib/adminCurriculum";
import { buildPageMetadata } from "../../../../../../../lib/seo";
import { createClient } from "../../../../../../../utils/supabase/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = buildPageMetadata({
  title: "Admin - Nouvelle lecon",
  description: "Creer une lecon.",
  path: "/admin/parcours",
  noIndex: true
});

export default async function NewLessonPage({ params, searchParams }: { params: Promise<Record<string, string>>; searchParams?: Promise<Record<string, string>> }) {
  const resolvedParams = await Promise.resolve(params);
  const resolvedSearch = await Promise.resolve(searchParams);
  const trackId = String(resolvedParams?.trackId || "").trim();
  const defaultModuleId = String(resolvedSearch?.module || "").trim();

  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

  const { track: rawTrack } = await getAdminTrack(supabase, trackId);
  if (!rawTrack) {
    notFound();
  }

  const track = rawTrack as Record<string, unknown>;

  const { modules } = await getAdminTrackCurriculum(supabase, trackId);

  return (
    <>
      <PageHeader
        title="NOUVELLE LECON"
        subtitle={String(track.title || "")}
        backHref={`/admin/parcours/${trackId}`}
        backLabel="Retour au parcours"
      />

      {modules.length ? (
        <LessonForm trackId={trackId} modules={modules} defaultModuleId={defaultModuleId} />
      ) : (
        <div className="rounded-xl border border-amber-500/25 bg-amber-500/10 px-4 py-3 text-[12px] text-amber-100 font-body-readable">
          Cree d'abord un module dans ce parcours avant d'ajouter une lecon.
        </div>
      )}
    </>
  );
}
