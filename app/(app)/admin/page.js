import { cookies } from "next/headers";
import PageHeader from "../../../components/app-shell/PageHeader";
import AdminOverview from "../../../components/admin/AdminOverview";
import { buildAuthUsersLookup, mergeProfilesWithAuthUsers } from "../../../lib/adminUsers";
import { getPlatformStats } from "../../../lib/platformStats";
import { buildPageMetadata } from "../../../lib/seo";
import { listPublishedTracks } from "../../../lib/tracks";
import { createClient } from "../../../utils/supabase/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const ADMIN_USERS_SELECT = "id, role, points, grade, referral_code, referred_by, created_at, updated_at";
const ADMIN_TRACKS_SELECT = "id, slug, title, is_published, is_active, sort_order, updated_at";

export const metadata = buildPageMetadata({
  title: "Admin",
  description: "Centre d'administration TakaCode.",
  path: "/admin",
  noIndex: true
});

function isMissingTableError(error, table) {
  const code = typeof error?.code === "string" ? error.code : "";
  const message = typeof error?.message === "string" ? error.message.toLowerCase() : "";
  return code === "PGRST205" || code === "42P01" || message.includes(table) || message.includes("schema cache");
}

export default async function AdminOverviewPage() {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

  const [usersResult, tracksResult, platformStats] = await Promise.all([
    supabase.from("user_profiles").select(ADMIN_USERS_SELECT).order("points", { ascending: false }).limit(300),
    supabase
      .from("learning_tracks")
      .select(ADMIN_TRACKS_SELECT)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true })
      .limit(300),
    getPlatformStats(supabase)
  ]);

  const usersSchemaReady = !isMissingTableError(usersResult.error, "user_profiles");
  const tracksSchemaReady = !isMissingTableError(tracksResult.error, "learning_tracks");

  const baseUsers = !usersSchemaReady || usersResult.error ? [] : usersResult.data || [];
  const authUsersById = baseUsers.length ? await buildAuthUsersLookup() : {};
  const users = mergeProfilesWithAuthUsers(baseUsers, authUsersById);
  const tracks = !tracksSchemaReady || tracksResult.error ? [] : tracksResult.data || [];

  const systemIssues = [];
  if (!usersSchemaReady) {
    systemIssues.push("Table user_profiles manquante. Lance supabase/sql/001_roles_points_referrals.sql.");
  }
  if (!tracksSchemaReady) {
    systemIssues.push("Table learning_tracks manquante. Lance supabase/sql/003_learning_tracks.sql.");
  }
  if (tracksSchemaReady && !tracksResult.error && tracks.length === 0) {
    systemIssues.push("Aucun parcours en base. Verifie les seeds et les policies RLS admin.");
  }

  return (
    <>
      <PageHeader title="CENTRE ADMIN" subtitle="Pilotage de la plateforme" />
      <AdminOverview users={users} tracks={tracks} platformStats={platformStats} systemIssues={systemIssues} />
    </>
  );
}
