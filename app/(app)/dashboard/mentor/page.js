import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import PageHeader from "../../../../components/app-shell/PageHeader";
import { buildPageMetadata } from "../../../../lib/seo";
import { createClient } from "../../../../utils/supabase/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = buildPageMetadata({
  title: "Proposer un parcours",
  description: "Propose des parcours, valides par l'admin avant publication.",
  path: "/dashboard/mentor",
  noIndex: true
});

function statusOf(track) {
  if (track.is_pending) return { label: "En attente de validation", cls: "border-amber-500/30 bg-amber-500/10 text-amber-100" };
  if (track.is_published) return { label: "Publié", cls: "border-emerald-500/30 bg-emerald-500/10 text-emerald-200" };
  return { label: "Refusé", cls: "border-red-500/30 bg-red-500/10 text-red-200" };
}

export default async function MentorHomePage() {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/signin?next=/dashboard/mentor");
  }

  const { data } = await supabase
    .from("learning_tracks")
    .select("id, slug, title, is_published, is_pending, is_active, updated_at")
    .eq("created_by", user.id)
    .order("updated_at", { ascending: false });

  const tracks = data || [];

  return (
    <>
      <PageHeader
        title="MES PROPOSITIONS"
        subtitle="Parcours proposés à la communauté"
        actions={
          <Link href="/dashboard/mentor/nouveau" className="btn-primary inline-flex items-center gap-2 text-[12px]">
            <iconify-icon icon="lucide:plus" style={{ fontSize: "13px" }} />
            Proposer un parcours
          </Link>
        }
      />

      <div className="rounded-xl border border-blue-500/20 bg-blue-500/[0.06] px-4 py-3 text-[12px] text-blue-100/90 font-body-readable mb-5">
        En tant que mentor, tes parcours sont <span className="font-semibold">valides par un admin</span> avant d'etre visibles publiquement.
      </div>

      {tracks.length ? (
        <div className="space-y-2.5">
          {tracks.map((track) => {
            const status = statusOf(track);
            return (
              <div key={track.id} className="flex items-center justify-between gap-3 rounded-xl border border-white/[0.08] bg-[#111] px-4 py-3.5">
                <div className="min-w-0">
                  <div className="text-[13px] text-white font-semibold leading-tight truncate">{track.title}</div>
                  <div className="text-[11px] text-[#6d6d6d] font-body-readable">/{track.slug}</div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${status.cls}`}>{status.label}</span>
                  {track.is_pending ? (
                    <Link href={`/dashboard/mentor/${track.id}`} className="text-[#888] hover:text-white p-1" title="Editer">
                      <iconify-icon icon="lucide:pencil" style={{ fontSize: "14px" }} />
                    </Link>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl border border-white/[0.07] bg-[#111] p-8 text-center">
          <p className="font-body-readable text-[13px] text-[#777] mb-4">Tu n'as pas encore propose de parcours.</p>
          <Link href="/dashboard/mentor/nouveau" className="btn-primary inline-flex items-center gap-2 text-[12px]">
            <iconify-icon icon="lucide:plus" style={{ fontSize: "13px" }} />
            Proposer mon premier parcours
          </Link>
        </div>
      )}
    </>
  );
}
