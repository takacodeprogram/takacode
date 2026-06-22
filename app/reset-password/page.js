import ResetPasswordPageClient from "../../components/ResetPasswordPageClient";
import { buildPageMetadata } from "../../lib/seo";

export const metadata = buildPageMetadata({
  title: "Reinitialisation du mot de passe",
  description: "Definis un nouveau mot de passe pour reprendre ton parcours sur TakaCode.",
  path: "/reset-password",
  noIndex: true
});

export default function ResetPasswordPage() {
  return <ResetPasswordPageClient />;
}
