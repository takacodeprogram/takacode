import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import PageHeader from "../../../../../components/app-shell/PageHeader";
import AffiliateForm from "../../../../../components/admin/AffiliateForm";
import { getAffiliate } from "../../../../../lib/affiliate";
import { buildPageMetadata } from "../../../../../lib/seo";
import { createClient } from "../../../../../utils/supabase/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = buildPageMetadata({
  title: "Admin - Lien d'affiliation",
  description: "Éditer un lien d'affiliation.",
  path: "/admin/affiliations",
  noIndex: true
});

export default async function EditAffiliatePage({ params }: { params: Promise<Record<string, string>> }) {
  const resolvedParams = await Promise.resolve(params);
  const affiliateId = String(resolvedParams?.affiliateId || "").trim();

  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

  const { link } = await getAffiliate(supabase, affiliateId);
  if (!link) {
    notFound();
  }

  return (
    <>
      <PageHeader title={link.title || link.provider} subtitle="Editer le lien" backHref="/admin/affiliations" backLabel="Affiliations" />
      <AffiliateForm link={link} />
    </>
  );
}
