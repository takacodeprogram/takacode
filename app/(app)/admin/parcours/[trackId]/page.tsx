import Link from "next/link";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import PageHeader from "../../../../../components/app-shell/PageHeader";
import TrackElementsManager from "../../../../../components/admin/TrackElementsManager";
import TrackForm from "../../../../../components/admin/TrackForm";
import { getAdminTrack, getAdminTrackCurriculum } from "../../../../../lib/adminCurriculum";
import { buildPageMetadata } from "../../../../../lib/seo";
import { createClient } from "../../../../../utils/supabase/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = buildPageMetadata({
  title: "Admin - Parcours",
  description: "Gérer un parcours et ses leçons.",
  path: "/admin/parcours",
  noIndex: true
});

export default async function AdminTrackDetailPage({ params }: { params: Promise<Record<string, string>> }) {
  const resolvedParams = await Promise.resolve(params);
  const trackId = String(resolvedParams?.trackId || "").trim();

  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

  const { track, schemaReady } = await getAdminTrack(supabase, trackId);

  if (!schemaReady) {
    return (
      <>
        <PageHeader title="PARCOURS" backHref="/admin/parcours" backLabel="Parcours" />
        <div className="rounded-xl border border-amber-500/25 bg-amber-500/10 px-4 py-3 text-[12px] text-amber-100 font-body-readable">
          Tables parcours manquantes. Lance les migrations SQL 003 et 004.
        </div>
      </>
    );
  }

  if (!track) {
    notFound();
  }

  const { modules } = await getAdminTrackCurriculum(supabase, trackId);
  const t = track as Record<string, unknown>;

  return (
    <>
      <PageHeader
        title={String(t.title || "")}
        subtitle={`/${String(t.slug || "")}`}
        backHref="/admin/parcours"
        backLabel="Parcours"
        actions={
          <Link href={`/parcours/${String(t.slug || "")}`} className="btn-secondary inline-flex items-center gap-2 text-[12px]">
            <iconify-icon icon="lucide:external-link" style={{ fontSize: "13px" }} />
            Voir en public
          </Link>
        }
      />

      <div className="space-y-6">
        <section>
          <h2 className="font-venite text-[13px] tracking-widest text-[#888] mb-3">INFORMATIONS DU PARCOURS</h2>
          <TrackForm mode="edit" track={track as never} />
        </section>

        <TrackElementsManager trackId={String(t.id || "")} trackSlug={String(t.slug || "")} initialModules={modules} />
      </div>
    </>
  );
}
