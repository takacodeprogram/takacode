import FlowHtmlPage from "../../components/FlowHtmlPage";
import { getFlowPageContent } from "../../lib/flowPageContent";

export default async function ProjetsPage() {
  const flow = await getFlowPageContent("03-takacode-project-builder.html", "projets");
  return <FlowHtmlPage styles={flow.styles} bodyHtml={flow.bodyHtml} />;
}