import FlowHtmlPage from "../../components/FlowHtmlPage";
import { getFlowPageContent } from "../../lib/flowPageContent";
import { buildPageMetadata } from "../../lib/seo";

export const metadata = buildPageMetadata({
  title: "Ressources",
  description: "Retrouve tes ressources, sessions, recommandations et actions rapides pour avancer sur TakaCode.",
  path: "/ressources"
});

export default async function RessourcesPage() {
  const flow = await getFlowPageContent("04-takacode-dashboard-utilisateur.html", "ressources");
  return <FlowHtmlPage styles={flow.styles} bodyHtml={flow.bodyHtml} />;
}
