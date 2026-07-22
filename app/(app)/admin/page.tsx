import { cookies } from "next/headers";
import PageHeader from "../../../components/app-shell/PageHeader";
import AdminOverview from "../../../components/admin/AdminOverview";
import { buildAuthUsersLookup, mergeProfilesWithAuthUsers } from "../../../lib/adminUsers";
import { getPlatformStats } from "../../../lib/platformStats";
import { buildPageMetadata } from "../../../lib/seo";
import { listPublishedTracks } from "../../../lib/tracks";
import { isMissingSchemaError } from "../../../lib/utils";
import { createClient } from "../../../utils/supabase/server";
import { createAdminClient } from "../../../utils/supabase/admin";
import { getLocale } from "../../../lib/i18n";
import { getServerLocale } from "../../../lib/serverLocale";

// Étoile du nord de la plateforme : % de membres avec un projet en ligne,
// puis % avec un premier euro déclaré. Calculée en service role : les
// policies RLS ne permettent pas de compter les projets des autres membres.
async function getNorthStar() {
  try {
    const admin = createAdminClient();
    const [{ count: members }, projectRows] = await Promise.all([
      admin.from("user_profiles").select("id", { count: "exact", head: true }),
      admin.from("user_projects").select("user_id, live_url, status, has_declared_first_euro").limit(10000)
    ]);
    const projects = projectRows.data || [];
    const withLive = new Set(
      projects.filter((r) => (r.live_url && r.live_url.trim()) || r.status === "published").map((r) => r.user_id)
    ).size;
    const withEuro = new Set(
      projects.filter((r) => r.has_declared_first_euro === true).map((r) => r.user_id)
    ).size;
    const total = members || 0;
    return {
      ready: true,
      members: total,
      withLive,
      withEuro,
      pctLive: total ? Math.round((withLive / total) * 100) : 0,
      pctEuro: total ? Math.round((withEuro / total) * 100) : 0
    };
  } catch {
    return { ready: false, members: 0, withLive: 0, withEuro: 0, pctLive: 0, pctEuro: 0 };
  }
}

export const dynamic = "force-dynamic";
export const revalidate = 0;

const ADMIN_USERS_SELECT = "id, role, points, grade, referral_code, referred_by, created_at, updated_at";
const ADMIN_TRACKS_SELECT = "id, slug, title, is_published, is_active, sort_order, updated_at";

export async function generateMetadata() {
  const locale = await getServerLocale();
  const { t } = getLocale(locale);
  return buildPageMetadata({ title: t("adminOverview.metaTitle"), description: t("adminOverview.metaDesc"), path: "/admin", noIndex: true });
}

function isMissingTableError(error: unknown, table: string) {
  return isMissingSchemaError(error, [table]);
}

export default async function AdminOverviewPage() {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

  const [usersResult, tracksResult, platformStats, northStar] = await Promise.all([
    supabase.from("user_profiles").select(ADMIN_USERS_SELECT).order("points", { ascending: false }).limit(300),
    supabase
      .from("learning_tracks")
      .select(ADMIN_TRACKS_SELECT)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true })
      .limit(300),
    getPlatformStats(supabase),
    getNorthStar()
  ]);

  const usersSchemaReady = !isMissingTableError(usersResult.error, "user_profiles");
  const tracksSchemaReady = !isMissingTableError(tracksResult.error, "learning_tracks");

  const baseUsers = !usersSchemaReady || usersResult.error ? [] : usersResult.data || [];
  const authUsersById = baseUsers.length ? await buildAuthUsersLookup() : {};
  const users = mergeProfilesWithAuthUsers(baseUsers, authUsersById);
  const tracks = !tracksSchemaReady || tracksResult.error ? [] : tracksResult.data || [];

  const systemIssues = [];
  const locale = await getServerLocale();
  const { t } = getLocale(locale);

  if (!usersSchemaReady) {
    systemIssues.push(t("adminOverview.tableUserProfiles"));
  }
  if (!tracksSchemaReady) {
    systemIssues.push(t("adminOverview.tableLearningTracks"));
  }
  if (tracksSchemaReady && !tracksResult.error && tracks.length === 0) {
    systemIssues.push(t("adminOverview.noTracks"));
  }

  return (
    <>
      <PageHeader title={t("admin.centreTitle")} subtitle={t("admin.centreSubtitle")} />
      <AdminOverview users={users} tracks={tracks} platformStats={platformStats} systemIssues={systemIssues} northStar={northStar} />
    </>
  );
}
