import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AuthOnboardingPage from "../../components/AuthOnboardingPage";
import { redirectLocale } from "../../lib/redirectLocale";
import { getUserAccessContext } from "../../lib/auth";
import { isOnboardingCompleted } from "../../lib/onboarding";
import { buildPageMetadata } from "../../lib/seo";
import { createClient } from "../../utils/supabase/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = buildPageMetadata({
  title: "Inscription",
  description: "Crée ton compte TakaCode et commence à construire des projets réels avec des parcours guides.",
  path: "/signup",
  noIndex: true
});

async function redirectIfAuthenticated() {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return;
  }

  const accessContext = await getUserAccessContext(supabase, user);

  if (accessContext.hasRole(["admin"])) {
    await redirectLocale("/admin");
  }

  const redirectTarget = isOnboardingCompleted(user) ? "/dashboard" : "/onboarding";
  await redirectLocale(redirectTarget);
}

export default async function SignUpPage() {
  await redirectIfAuthenticated();
  return <AuthOnboardingPage initialMode="signup" />;
}
