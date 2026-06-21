import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import OnboardingExperiencePage from "../../components/OnboardingExperiencePage";
import { userHasRole } from "../../lib/auth";
import { isOnboardingCompleted } from "../../lib/onboarding";
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

export default async function OnboardingPage() {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/signin?next=/onboarding");
  }

  if (!userHasRole(user, ["user", "admin"])) {
    redirect("/signin?error=forbidden");
  }

  if (isOnboardingCompleted(user)) {
    redirect("/dashboard");
  }

  return (
    <OnboardingExperiencePage
      user={{
        displayName: formatDisplayName(user),
        email: user.email ?? "",
        metadata: user.user_metadata ?? {}
      }}
    />
  );
}