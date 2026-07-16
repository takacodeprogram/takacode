import Link from "next/link";
import { cookies } from "next/headers";
import PageHeader from "../../../../components/app-shell/PageHeader";
import PendingTracksReview from "../../../../components/admin/PendingTracksReview";
import { listAdminTracks } from "../../../../lib/adminCurriculum";
import { buildPageMetadata } from "../../../../lib/seo";
import { createClient } from "../../../../utils/supabase/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = buildPageMetadata({
  title: "Admin - Parcours",
  description: "Gestion des parcours et de leurs lecons.",
  path: "/admin/parcours",
  noIndex: true
});

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

  const { tracks, schemaReady, error } = await listAdminTracks(supabase);

  // Requete gardee: propositions mentor en attente (necessite la migration 014).
  const { data: pendingData } = await supabase
    .from("learning_tracks")
    .select("id, slug, title")
    .eq("is_pending", true)
    .order("updated_at", { ascending: false });
  const pending = pendingData || [];
  const pendingIds = new Set(pending.map((t) => t.id));
  const visibleTracks = tracks.filter((t) => !pendingIds.has(t.id));

  return (
    <>
      <PageHeader
        title="PARCOURS"
        subtitle={`${tracks.length} parcours`}
        backHref="/admin"
        backLabel="Centre admin"
        actions={
          <Link href="/admin/parcours/nouveau" className="btn-primary inline-flex items-center gap-2 text-[12px]">
            <iconify-icon icon="lucide:plus" style={{ fontSize: "13px" }} />
            Nouveau parcours
          </Link>
        }
      />

      <PendingTracksReview initialPending={pending} />

      {!schemaReady ? (
        <div className="rounded-xl border border-amber-500/25 bg-amber-500/10 px-4 py-3 text-[12px] text-amber-100 font-body-readable">
          Tables parcours manquantes. Lance supabase/sql/003_learning_tracks.sql et 004_track_curriculum.sql.
        </div>
      ) : error ? (
        <div className="rounded-xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-[12px] text-red-200 font-body-readable">
          {error.message || "Erreur de chargement."}
        </div>
      ) : visibleTracks.length ? (
        <div className="space-y-2.5">
          {visibleTracks.map((track) => (
            <Link
              key={track.id}
              href={`/admin/parcours/${track.id}`}
              className="flex items-center justify-between gap-3 rounded-xl border border-white/[0.08] bg-[#111] px-4 py-3.5 card-hover"
            >
              <div className="min-w-0">
                <div className="text-[13px] text-white font-semibold leading-tight truncate">{track.title}</div>
                <div className="text-[11px] text-[#6d6d6d] font-body-readable">
                  /{track.slug} · {track.level_label}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <StatusBadge ok={track.is_published === true} labelOn="Publié" labelOff="Brouillon" />
                <StatusBadge ok={track.is_active !== false} labelOn="Actif" labelOff="Inactif" />
                <iconify-icon icon="lucide:chevron-right" style={{ fontSize: "16px", color: "#666" }} />
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-white/[0.07] bg-[#111] p-8 text-center">
          <p className="font-body-readable text-[13px] text-[#777] mb-4">Aucun parcours pour l'instant.</p>
          <Link href="/admin/parcours/nouveau" className="btn-primary inline-flex items-center gap-2 text-[12px]">
            <iconify-icon icon="lucide:plus" style={{ fontSize: "13px" }} />
            Creer le premier parcours
          </Link>
        </div>
      )}
    </>
  );
}
