import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { redirectLocale } from "../../lib/redirectLocale";
import { getUserAccessContext } from "../../lib/auth";
import { isOnboardingCompleted } from "../../lib/onboarding";
import { buildPageMetadata } from "../../lib/seo";
import { createClient } from "../../utils/supabase/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = buildPageMetadata({
  title: "Connexion",
  description: "Redirection vers la page de connexion TakaCode.",
  path: "/login",
  noIndex: true
});

export default async function ConnexionPage() {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    await redirectLocale("/signin");
  }

  const accessContext = await getUserAccessContext(supabase, user);
  if (accessContext.hasRole(["admin"])) {
    await redirectLocale("/admin");
  }

  await redirectLocale(isOnboardingCompleted(user) ? "/dashboard" : "/onboarding");
}
