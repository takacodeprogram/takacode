import ForgotPasswordPageClient from "../../components/ForgotPasswordPageClient";
import { buildPageMetadata } from "../../lib/seo";

export const metadata = buildPageMetadata({
  title: "Mot de passe oublie",
  description: "Recupere l'acces a ton espace TakaCode avec un lien de reinitialisation de mot de passe.",
  path: "/forgot-password",
  noIndex: true
});

export default function ForgotPasswordPage() {
  return <ForgotPasswordPageClient />;
}
