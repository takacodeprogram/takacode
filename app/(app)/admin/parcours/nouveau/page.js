import PageHeader from "../../../../../components/app-shell/PageHeader";
import TrackForm from "../../../../../components/admin/TrackForm";
import { buildPageMetadata } from "../../../../../lib/seo";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = buildPageMetadata({
  title: "Admin - Nouveau parcours",
  description: "Creer un parcours.",
  path: "/admin/parcours/nouveau",
  noIndex: true
});

export default function NewTrackPage() {
  return (
    <>
      <PageHeader title="NOUVEAU PARCOURS" subtitle="Creer un parcours" backHref="/admin/parcours" backLabel="Parcours" />
      <TrackForm mode="create" />
    </>
  );
}
