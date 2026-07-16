import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import PageHeader from "../../../../../components/app-shell/PageHeader";
import TrackForm from "../../../../../components/admin/TrackForm";
import { buildPageMetadata } from "../../../../../lib/seo";
import { createClient } from "../../../../../utils/supabase/server";

const TRACK_COLUMNS =
  "id, slug, goal_key, title, summary, description, level_label, duration_weeks, accent_color, icon, objective, resources, next_session, is_published, is_active, created_by, is_pending";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = buildPageMetadata({
  title: "Ma proposition",
  description: "Editer une proposition de parcours.",
  path: "/dashboard/mentor",
  noIndex: true
});

export default async function MentorEditTrackPage({ params }: { params: Promise<Record<string, string>> }) {
  const resolvedParams = await Promise.resolve(params);
  const trackId = String(resolvedParams?.trackId || "").trim();

  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/signin?next=/dashboard/mentor");
  }

  const { data: track } = await supabase.from("learning_tracks").select(TRACK_COLUMNS).eq("id", trackId).maybeSingle();
  if (!track || track.created_by !== user.id) {
    notFound();
  }

  return (
    <>
      <PageHeader title={track.title} subtitle="Ma proposition" backHref="/dashboard/mentor" backLabel="Mes propositions" />

      {track.is_pending ? (
        <TrackForm mode="edit" track={track} proposal userId={user.id} redirectBase="/dashboard/mentor" />
      ) : (
        <div className="rounded-xl border border-white/[0.08] bg-[#111] px-4 py-4 text-[12px] text-[#a5a5a5] font-body-readable">
          {track.is_published
            ? "Cette proposition a été validée et publiée. Merci pour ta contribution !"
            : "Cette proposition n'a pas été retenue. Tu peux en proposer une nouvelle."}
        </div>
      )}
    </>
  );
}
