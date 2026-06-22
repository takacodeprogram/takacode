import FlowHtmlPage from "../../components/FlowHtmlPage";
import { getFlowPageContent } from "../../lib/flowPageContent";
import { buildPageMetadata } from "../../lib/seo";

export const metadata = buildPageMetadata({
  title: "Projets",
  description: "Consulte des projets reels crees par la communaute TakaCode et publie tes propres realisations.",
  path: "/projets"
});

export default async function ProjetsPage() {
  const flow = await getFlowPageContent("03-takacode-project-builder.html", "projets");
  return <FlowHtmlPage styles={flow.styles} bodyHtml={flow.bodyHtml} />;
}
