import Link from "next/link";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import PageHeader from "../../../../../components/app-shell/PageHeader";
import TrackElementsManager from "../../../../../components/admin/TrackElementsManager";
import TrackForm from "../../../../../components/admin/TrackForm";
import { getAdminTrack, getAdminTrackCurriculum } from "../../../../../lib/adminCurriculum";
import { buildPageMetadata } from "../../../../../lib/seo";
import { createClient } from "../../../../../utils/supabase/server";
import { getLocale } from "../../../../../lib/i18n";
import { getServerLocale } from "../../../../../lib/serverLocale";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata() {
  const locale = await getServerLocale();
  const { t } = getLocale(locale);
  return buildPageMetadata({ title: t("adminTrackDetail.metaTitle"), description: t("adminTrackDetail.metaDesc"), path: "/admin/tracks", noIndex: true });
}

export default async function AdminTrackDetailPage({ params }: { params: Promise<Record<string, string>> }) {
  const resolvedParams = await Promise.resolve(params);
  const trackId = String(resolvedParams?.trackId || "").trim();

  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

  const locale = await getServerLocale();
  const { t } = getLocale(locale);

  const { track, schemaReady } = await getAdminTrack(supabase, trackId);

  if (!schemaReady) {
    return (
      <>
        <PageHeader title={t("adminTracks.title")} backHref="/admin/tracks" backLabel={t("admin.backTracks")} />
        <div className="rounded-xl border border-amber-500/25 bg-amber-500/10 px-4 py-3 text-[12px] text-amber-100 font-body-readable">
          {t("adminTrackDetail.tableMissing")}
        </div>
      </>
    );
  }

  if (!track) {
    notFound();
  }

  const { modules } = await getAdminTrackCurriculum(supabase, trackId);
  const tr = track as Record<string, unknown>;

  return (
    <>
      <PageHeader
        title={String(tr.title || "")}
        subtitle={`/${String(tr.slug || "")}`}
        backHref="/admin/tracks"
        backLabel={t("admin.backTracks")}
        actions={
          <Link href={`/tracks/${String(tr.slug || "")}`} className="btn-secondary inline-flex items-center gap-2 text-[12px]">
            <iconify-icon icon="lucide:external-link" style={{ fontSize: "13px" }} />
            {t("admin.seePublic")}
          </Link>
        }
      />

      <div className="space-y-6">
        <section>
          <h2 className="font-venite text-[13px] tracking-widest text-[#888] mb-3">{t("adminTrackDetail.trackInfo")}</h2>
          <TrackForm mode="edit" track={track as never} />
        </section>

        <TrackElementsManager trackId={String(tr.id || "")} trackSlug={String(tr.slug || "")} initialModules={modules} />
      </div>
    </>
  );
}
