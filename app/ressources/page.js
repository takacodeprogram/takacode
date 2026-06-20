import FlowHtmlPage from "../../components/FlowHtmlPage";
import { getFlowPageContent } from "../../lib/flowPageContent";

export default async function RessourcesPage() {
  const flow = await getFlowPageContent("04-takacode-dashboard-utilisateur.html", "ressources");
  return <FlowHtmlPage styles={flow.styles} bodyHtml={flow.bodyHtml} />;
}