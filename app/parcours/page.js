import FlowHtmlPage from "../../components/FlowHtmlPage";
import { getFlowPageContent } from "../../lib/flowPageContent";

export default async function ParcoursPage() {
  const flow = await getFlowPageContent("02-takacode-d-tail-parcours.html", "parcours");
  return <FlowHtmlPage styles={flow.styles} bodyHtml={flow.bodyHtml} />;
}