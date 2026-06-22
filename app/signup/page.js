import AuthOnboardingPage from "../../components/AuthOnboardingPage";
import { buildPageMetadata } from "../../lib/seo";

export const metadata = buildPageMetadata({
  title: "Inscription",
  description: "Cree ton compte TakaCode et commence a construire des projets reels avec des parcours guides.",
  path: "/signup",
  noIndex: true
});

export default function SignUpPage() {
  return <AuthOnboardingPage initialMode="signup" />;
}
