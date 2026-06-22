import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AdminDashboardPage from "../../components/AdminDashboardPage";
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

export const metadata = buildPageMetadata({
  title: "Dashboard",
  description: "Tableau de bord personnel TakaCode pour suivre ta progression, tes parcours et tes objectifs.",
  path: "/dashboard",
  noIndex: true
});

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
    />
  );
}
