import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AdminDashboardPage from "../../components/AdminDashboardPage";
import { buildAuthUsersLookup, mergeProfilesWithAuthUsers } from "../../lib/adminUsers";
import { getUserAccessContext } from "../../lib/auth";
import { getPlatformStats } from "../../lib/platformStats";
import { buildPageMetadata } from "../../lib/seo";
import { listPublishedTracks } from "../../lib/tracks";
import { createClient } from "../../utils/supabase/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const ADMIN_USERS_SELECT = "id, role, points, grade, referral_code, referred_by, created_at, updated_at";
const ADMIN_TRACKS_SELECT = [
  "id",
  "slug",
  "goal_key",
  "title",
  "summary",
  "level_label",
  "duration_weeks",
  "accent_color",
  "icon",
  "objective",
  "resources",
  "next_session",
  "is_published",
  "is_active",
  "sort_order",
  "updated_at"
].join(", ");

export const metadata = buildPageMetadata({
  title: "Admin",
  description: "Espace administration TakaCode pour piloter utilisateurs, roles et parcours avec le layout dashboard.",
  path: "/admin",
  noIndex: true
});

function isMissingProfilesTableError(error) {
  const code = typeof error?.code === "string" ? error.code : "";
  const message = typeof error?.message === "string" ? error.message.toLowerCase() : "";

  return (
    code === "PGRST205" ||
    code === "42P01" ||
    message.includes("user_profiles") ||
    message.includes("schema cache")
  );
}

function isMissingTracksTableError(error) {
  const code = typeof error?.code === "string" ? error.code : "";
  const message = typeof error?.message === "string" ? error.message.toLowerCase() : "";

  return (
    code === "PGRST205" ||
    code === "42P01" ||
    message.includes("learning_tracks") ||
    message.includes("schema cache")
  );
}

function resolveAppUrl() {
  const candidates = [
    process.env.NEXT_PUBLIC_APP_URL,
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${String(process.env.VERCEL_PROJECT_PRODUCTION_URL).replace(/^https?:\/\//i, "")}`
      : "",
    "https://takacode.vercel.app"
  ];

  for (const candidate of candidates) {
    const value = String(candidate || "").trim();
    if (!value) {
      continue;
    }

    if (/^https?:\/\//i.test(value)) {
      return value;
    }

    return `https://${value.replace(/^\/+/, "")}`;
  }

  return "https://takacode.vercel.app";
}

function formatDisplayName(user) {
  const fullName = typeof user?.user_metadata?.full_name === "string" ? user.user_metadata.full_name.trim() : "";
  if (fullName) {
    return fullName;
  }

  const firstName = typeof user?.user_metadata?.first_name === "string" ? user.user_metadata.first_name.trim() : "";
  const lastName = typeof user?.user_metadata?.last_name === "string" ? user.user_metadata.last_name.trim() : "";
  const fromParts = [firstName, lastName].filter(Boolean).join(" ");

  if (fromParts) {
    return fromParts;
  }

  if (typeof user?.email === "string" && user.email.includes("@")) {
    return user.email.split("@")[0];
  }

  return "Membre";
}

export default async function AdminPage() {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/signin?next=/admin");
  }

  const accessContext = await getUserAccessContext(supabase, user);

  if (!accessContext.hasRole(["admin"])) {
    redirect("/dashboard");
  }

  const [usersResult, tracksResult] = await Promise.all([
    supabase
      .from("user_profiles")
      .select(ADMIN_USERS_SELECT)
      .order("points", { ascending: false })
      .limit(300),
    supabase
      .from("learning_tracks")
      .select(ADMIN_TRACKS_SELECT)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true })
      .limit(300)
  ]);

  const usersSchemaReady = !isMissingProfilesTableError(usersResult.error);
  const tracksSchemaReady = !isMissingTracksTableError(tracksResult.error);

  const baseUsers = !usersSchemaReady || usersResult.error ? [] : usersResult.data || [];
  const authUsersById = baseUsers.length ? await buildAuthUsersLookup() : {};
  const mergedUsers = mergeProfilesWithAuthUsers(baseUsers, authUsersById);

  const baseTracks = !tracksSchemaReady || tracksResult.error ? [] : tracksResult.data || [];
  let visibleTracks = baseTracks;

  if (tracksSchemaReady && !tracksResult.error && baseTracks.length === 0) {
    const fallbackTracksResult = await listPublishedTracks(supabase, { limit: 300 });
    if (fallbackTracksResult.schemaReady && !fallbackTracksResult.error && fallbackTracksResult.tracks.length) {
      visibleTracks = fallbackTracksResult.tracks;
    }
  }

  const points = Number.isFinite(Number(accessContext.profile?.points)) ? Number(accessContext.profile?.points) : 0;
  const platformStats = await getPlatformStats(supabase);

  return (
    <AdminDashboardPage
      user={{
        email: user.email ?? "",
        displayName: formatDisplayName(user),
        role: accessContext.role
      }}
      onboarding={{}}
      tracks={{
        enrolled: [],
        recommended: [],
        schemaReady: true
      }}
      gamification={{
        points,
        grade: accessContext.profile?.grade || "Starter",
        referralCode: accessContext.profile?.referral_code || ""
      }}
      adminData={{
        users: mergedUsers,
        tracks: visibleTracks,
        usersSchemaReady,
        tracksSchemaReady,
        usersError: usersSchemaReady && usersResult.error ? usersResult.error.message || "Erreur user_profiles" : "",
        tracksError: tracksSchemaReady && tracksResult.error ? tracksResult.error.message || "Erreur learning_tracks" : "",
        appUrl: resolveAppUrl(),
        platformStats
      }}
      currentPath="/admin"
    />
  );
}
