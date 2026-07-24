import PageHeader from "../../../../../components/app-shell/PageHeader";
import AffiliateForm from "../../../../../components/admin/AffiliateForm";
import { buildPageMetadata } from "../../../../../lib/seo";
import { getLocale } from "../../../../../lib/i18n";
import { getServerLocale } from "../../../../../lib/serverLocale";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata() {
  const locale = await getServerLocale();
  const { t } = getLocale(locale);
  return buildPageMetadata({ title: t("adminAffiliateNew.metaTitle"), description: t("adminAffiliateNew.metaDesc"), path: "/admin/affiliates/new", noIndex: true });
}

export default async function NewAffiliatePage() {
  const locale = await getServerLocale();
  const { t } = getLocale(locale);
  return (
    <>
      <PageHeader title={t("adminAffiliateNew.title")} subtitle={t("adminAffiliateNew.subtitle")} backHref="/admin/affiliates" backLabel={t("admin.backAffiliations")} />
      <AffiliateForm />
    </>
  );
}
