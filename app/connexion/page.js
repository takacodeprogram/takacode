import { redirect } from "next/navigation";
import { buildPageMetadata } from "../../lib/seo";

export const metadata = buildPageMetadata({
  title: "Connexion",
  description: "Redirection vers la page de connexion TakaCode.",
  path: "/connexion",
  noIndex: true
});

export default function ConnexionPage() {
  redirect("/signin");
}
