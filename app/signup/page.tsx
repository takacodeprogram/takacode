import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AuthOnboardingPage from "../../components/AuthOnboardingPage";
import { redirectLocale } from "../../lib/redirectLocale";
import { getUserAccessContext } from "../../lib/auth";
import { isOnboardingCompleted } from "../../lib/onboarding";
import { getLocale } from "../../lib/i18n";
import { getServerLocale } from "../../lib/serverLocale";
import { buildPageMetadata } from "../../lib/seo";
import { createClient } from "../../utils/supabase/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata() {
  const locale = await getServerLocale();
  const { t } = getLocale(locale);
  return buildPageMetadata({
    title: t("auth.signUp"),
    description: t("auth.signUpDesc"),
    path: "/signup",
    noIndex: true
  });
}

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
