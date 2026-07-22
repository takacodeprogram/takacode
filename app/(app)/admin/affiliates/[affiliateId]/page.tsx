import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import PageHeader from "../../../../../components/app-shell/PageHeader";
import AffiliateForm from "../../../../../components/admin/AffiliateForm";
import { getAffiliate } from "../../../../../lib/affiliate";
import { buildPageMetadata } from "../../../../../lib/seo";
import { createClient } from "../../../../../utils/supabase/server";
import { getLocale } from "../../../../../lib/i18n";
import { getServerLocale } from "../../../../../lib/serverLocale";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata() {
  const locale = await getServerLocale();
  const { t } = getLocale(locale);
  return buildPageMetadata({ title: t("adminAffiliateDetail.metaTitle"), description: t("adminAffiliateDetail.metaDesc"), path: "/admin/affiliates", noIndex: true });
}

export default async function EditAffiliatePage({ params }: { params: Promise<Record<string, string>> }) {
  const resolvedParams = await Promise.resolve(params);
  const affiliateId = String(resolvedParams?.affiliateId || "").trim();

  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

  const { link } = await getAffiliate(supabase, affiliateId);
  if (!link) {
    notFound();
  }

  const locale = await getServerLocale();
  const { t } = getLocale(locale);
  return (
    <>
      <PageHeader title={link.title || link.provider} subtitle={t("adminAffiliateDetail.subtitle")} backHref="/admin/affiliates" backLabel={t("admin.backAffiliations")} />
      <AffiliateForm link={link} />
    </>
  );
}
