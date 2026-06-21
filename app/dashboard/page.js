import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AdminDashboardPage from "../../components/AdminDashboardPage";
import { getUserAccessContext } from "../../lib/auth";
import { getOnboardingProfile, isOnboardingCompleted } from "../../lib/onboarding";
import { createClient } from "../../utils/supabase/server";

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
        objective: onboardingProfile.recommendation.objective,
        progress: onboardingProfile.progress,
        nextSteps: onboardingProfile.recommendation.nextSteps,
        nextSession: onboardingProfile.recommendation.nextSession,
        parcoursTitle: onboardingProfile.recommendation.parcoursTitle,
        parcoursMeta: onboardingProfile.recommendation.parcoursMeta,
        resources: onboardingProfile.recommendation.resources,
        weeklyCommitmentLabel: onboardingProfile.weeklyCommitmentLabel,
        projectIdea: onboardingProfile.projectIdea,
        tools: onboardingProfile.tools
      }}
      gamification={{
        points,
        grade: accessContext.profile?.grade || "Starter",
        referralCode: accessContext.profile?.referral_code || ""
      }}
    />
  );
}
