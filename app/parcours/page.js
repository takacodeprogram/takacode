import FlowHtmlPage from "../../components/FlowHtmlPage";
import { getFlowPageContent } from "../../lib/flowPageContent";
import { buildPageMetadata } from "../../lib/seo";

export const metadata = buildPageMetadata({
  title: "Parcours",
  description: "Explore les parcours TakaCode pour apprendre en pratiquant et construire des projets de bout en bout.",
  path: "/parcours"
});

export default async function ParcoursPage() {
  const flow = await getFlowPageContent("02-takacode-d-tail-parcours.html", "parcours");
  return <FlowHtmlPage styles={flow.styles} bodyHtml={flow.bodyHtml} />;
}
