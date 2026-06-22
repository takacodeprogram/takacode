import AuthOnboardingPage from "../../components/AuthOnboardingPage";
import { buildPageMetadata } from "../../lib/seo";

export const metadata = buildPageMetadata({
  title: "Connexion",
  description: "Reconnecte-toi a ton espace TakaCode pour reprendre tes projets, tes parcours et tes sessions live.",
  path: "/signin",
  noIndex: true
});

export default function SignInPage() {
  return <AuthOnboardingPage initialMode="signin" />;
}
