import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AdminDashboardPage from "../../components/AdminDashboardPage";
import { buildAuthUsersLookup, mergeProfilesWithAuthUsers } from "../../lib/adminUsers";
import { getUserAccessContext } from "../../lib/auth";
import { getOnboardingProfile, isOnboardingCompleted } from "../../lib/onboarding";
import { buildPageMetadata } from "../../lib/seo";
import {
  ensureUserPrimaryEnrollment,
  listRecommendedTracksForGoal,
  listUserTrackEnrollments,
  mapTrackToRecommendation
} from "../../lib/tracks";
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
  title: "Dashboard",
  description: "Tableau de bord personnel TakaCode pour suivre ta progression, tes parcours et tes objectifs.",
  path: "/dashboard",
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

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/signin?next=/dashboard");
  }

  const accessContext = await getUserAccessContext(supabase, user);

  if (!accessContext.hasRole(["user", "mentor", "admin"])) {
    redirect("/signin?error=forbidden");
  }

  if (accessContext.role !== "admin" && !isOnboardingCompleted(user)) {
    redirect("/onboarding");
  }

  const onboardingProfile = getOnboardingProfile(user);

  if (accessContext.role !== "admin") {
    await ensureUserPrimaryEnrollment(supabase, user.id, onboardingProfile.goalKey);
  }

  const enrollmentResult = await listUserTrackEnrollments(supabase, user.id, { limit: 8 });
  const enrolledTracks = enrollmentResult.enrollments.map((entry) => ({
    ...entry.track,
    enrollmentId: entry.id,
    progress: entry.progress,
    status: entry.status
  }));

  const excludedTrackIds = enrolledTracks.map((track) => track.id);
  const recommendedResult = await listRecommendedTracksForGoal(supabase, onboardingProfile.goalKey, {
    limit: 4,
    excludedTrackIds
  });
  const recommendedTracks = recommendedResult.tracks;

  const primaryTrack = enrolledTracks[0] || recommendedTracks[0] || null;
  const recommendation = primaryTrack
    ? mapTrackToRecommendation(primaryTrack, onboardingProfile.recommendation.parcoursTitle)
    : onboardingProfile.recommendation;

  const points = Number.isFinite(Number(accessContext.profile?.points)) ? Number(accessContext.profile?.points) : 0;

  let adminData = null;

  if (accessContext.role === "admin") {
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

    adminData = {
      users: mergedUsers,
      tracks: !tracksSchemaReady || tracksResult.error ? [] : tracksResult.data || [],
      usersSchemaReady,
      tracksSchemaReady,
      usersError: usersSchemaReady && usersResult.error ? usersResult.error.message || "Erreur user_profiles" : "",
      tracksError: tracksSchemaReady && tracksResult.error ? tracksResult.error.message || "Erreur learning_tracks" : "",
      appUrl: resolveAppUrl()
    };
  }

  return (
    <AdminDashboardPage
      user={{
        email: user.email ?? "",
        displayName: formatDisplayName(user),
        role: accessContext.role
      }}
      onboarding={{
        goalLabel: onboardingProfile.goalLabel,
        objective: recommendation.objective,
        progress: onboardingProfile.progress,
        nextSteps: recommendation.nextSteps,
        nextSession: recommendation.nextSession,
        parcoursTitle: recommendation.parcoursTitle,
        parcoursMeta: recommendation.parcoursMeta,
        resources: recommendation.resources,
        weeklyCommitmentLabel: onboardingProfile.weeklyCommitmentLabel,
        projectIdea: onboardingProfile.projectIdea,
        tools: onboardingProfile.tools
      }}
      tracks={{
        enrolled: enrolledTracks,
        recommended: recommendedTracks,
        schemaReady: enrollmentResult.schemaReady && recommendedResult.schemaReady
      }}
      gamification={{
        points,
        grade: accessContext.profile?.grade || "Starter",
        referralCode: accessContext.profile?.referral_code || ""
      }}
      adminData={adminData}
    />
  );
}
