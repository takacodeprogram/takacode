import PageHeader from "../../../../../components/app-shell/PageHeader";
import AffiliateForm from "../../../../../components/admin/AffiliateForm";
import { buildPageMetadata } from "../../../../../lib/seo";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = buildPageMetadata({
  title: "Admin - Nouveau lien",
  description: "Ajouter un lien d'affiliation.",
  path: "/admin/affiliations/nouveau",
  noIndex: true
});

export default function NewAffiliatePage() {
  return (
    <>
      <PageHeader title="NOUVEAU LIEN" subtitle="Ajouter un lien d'affiliation" backHref="/admin/affiliations" backLabel="Affiliations" />
      <AffiliateForm />
    </>
  );
}
