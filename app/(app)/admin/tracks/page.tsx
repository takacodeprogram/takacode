import Link from "next/link";
import { cookies } from "next/headers";
import PageHeader from "../../../../components/app-shell/PageHeader";
import PendingTracksReview from "../../../../components/admin/PendingTracksReview";
import { listAdminTracks } from "../../../../lib/adminCurriculum";
import { buildPageMetadata } from "../../../../lib/seo";
import { createClient } from "../../../../utils/supabase/server";
import { localePath } from "../../../../lib/localeHelpers";
import { getServerLocale } from "../../../../lib/serverLocale";
import { getLocale } from "../../../../lib/i18n";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata() {
  const locale = await getServerLocale();
  const { t } = getLocale(locale);
  return buildPageMetadata({ title: t("adminTracks.metaTitle"), description: t("adminTracks.metaDesc"), path: "/admin/tracks", noIndex: true });
}

function StatusBadge({ ok, labelOn, labelOff }: { ok: boolean; labelOn: string; labelOff: string }) {
  return (
    <span
      className={[
        "text-[10px] font-semibold px-2 py-0.5 rounded-full border",
        ok ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-200" : "border-white/[0.12] bg-white/[0.03] text-[#888]"
      ].join(" ")}
    >
      {ok ? labelOn : labelOff}
    </span>
  );
}

export default async function AdminTracksListPage() {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

  const locale = await getServerLocale();
  const { t } = getLocale(locale);

  const { tracks, schemaReady, error } = await listAdminTracks(supabase);

  const { data: pendingData } = await supabase
    .from("learning_tracks")
    .select("id, slug, title")
    .eq("is_pending", true)
    .order("updated_at", { ascending: false });
  const pending = pendingData || [];
  const pendingIds = new Set(pending.map((tt) => tt.id));
  const visibleTracks = tracks.filter((tt) => !pendingIds.has(tt.id));

  return (
    <>
      <PageHeader
        title={t("adminTracks.title")}
        subtitle={`${tracks.length} ${tracks.length > 1 ? "parcours" : "parcours"}`}
        backHref="/admin"
        backLabel={t("admin.backAdmin")}
        actions={
          <Link href={localePath("/admin/tracks/new", locale)} className="btn-primary inline-flex items-center gap-2 text-[12px]">
            <iconify-icon icon="lucide:plus" style={{ fontSize: "13px" }} />
            {t("adminTracks.newTrack")}
          </Link>
        }
      />

      <PendingTracksReview initialPending={pending} />

      {!schemaReady ? (
        <div className="rounded-xl border border-amber-500/25 bg-amber-500/10 px-4 py-3 text-[12px] text-amber-100 font-body-readable">
          {t("adminTracks.tableMissing")}
        </div>
      ) : error ? (
        <div className="rounded-xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-[12px] text-red-200 font-body-readable">
          {error.message || t("adminTracks.loadError")}
        </div>
      ) : visibleTracks.length ? (
        <div className="space-y-2.5">
          {visibleTracks.map((track) => (
            <Link
              key={track.id}
              href={localePath(`/admin/tracks/${track.id}`, locale)}
              className="flex items-center justify-between gap-3 rounded-xl border border-white/[0.08] bg-[#111] px-4 py-3.5 card-hover"
            >
              <div className="min-w-0">
                <div className="text-[13px] text-white font-semibold leading-tight truncate">{track.title}</div>
                <div className="text-[11px] text-[#6d6d6d] font-body-readable">
                  /{track.slug} · {track.level_label}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <StatusBadge ok={track.is_published === true} labelOn={t("admin.publishedLabel")} labelOff={t("admin.draftLabel")} />
                <StatusBadge ok={track.is_active !== false} labelOn={t("admin.activeLabel")} labelOff={t("admin.inactiveLabel")} />
                <iconify-icon icon="lucide:chevron-right" style={{ fontSize: "16px", color: "#666" }} />
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-white/[0.07] bg-[#111] p-8 text-center">
          <p className="font-body-readable text-[13px] text-[#777] mb-4">{t("adminTracks.empty")}</p>
          <Link href={localePath("/admin/tracks/new", locale)} className="btn-primary inline-flex items-center gap-2 text-[12px]">
            <iconify-icon icon="lucide:plus" style={{ fontSize: "13px" }} />
            {t("adminTracks.createFirst")}
          </Link>
        </div>
      )}
    </>
  );
}
