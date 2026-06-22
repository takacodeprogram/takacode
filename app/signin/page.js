import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AuthOnboardingPage from "../../components/AuthOnboardingPage";
import { getUserAccessContext } from "../../lib/auth";
import { isOnboardingCompleted } from "../../lib/onboarding";
import { buildPageMetadata } from "../../lib/seo";
import { createClient } from "../../utils/supabase/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = buildPageMetadata({
  title: "Connexion",
  description: "Reconnecte-toi a ton espace TakaCode pour reprendre tes projets, tes parcours et tes sessions live.",
  path: "/signin",
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
    redirect("/admin");
  }

  const redirectTarget = isOnboardingCompleted(user) ? "/dashboard" : "/onboarding";
  redirect(redirectTarget);
}

export default async function SignInPage() {
  await redirectIfAuthenticated();
  return <AuthOnboardingPage initialMode="signin" />;
}
