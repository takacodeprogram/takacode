import { getLocale } from "../../../../../../lib/i18n";
import { getServerLocale } from "../../../../../../lib/serverLocale";
import PageHeader from "../../../../../../components/app-shell/PageHeader";
import DocContent from "../../DocContent";
import { buildPageMetadata } from "../../../../../../lib/seo";

export async function generateMetadata() {
  const localeServer = await getServerLocale();
  const { t } = getLocale(localeServer);
  return buildPageMetadata({
    title: t("dashboardDocsAdminAffiliates.title"),
    description: t("dashboardDocsAdminAffiliates.p1"),
    path: "/dashboard/docs/admin/affiliates",
    noIndex: true
  });
}

export default async function AdminAffiliationsDocPage() {
  const locale = await getServerLocale();
  const { t } = getLocale(locale);

  return (
    <>
      <PageHeader title={t("dashboardDocsAdminAffiliates.title")} subtitle={t("dashboardDocsAdminAffiliates.subtitle")} backHref="/dashboard/docs" />
      <DocContent>
        <h2>{t("dashboardDocsAdminAffiliates.h2")}</h2>
        <p>{t("dashboardDocsAdminAffiliates.p1")}</p>

        <h3>{t("dashboardDocsAdminAffiliates.h3_1")}</h3>
        <ul>
          <li>{t("dashboardDocsAdminAffiliates.ul1_1").replace("{strong}", "<strong>").replace("{/strong}", "</strong>")}</li>
          <li>{t("dashboardDocsAdminAffiliates.ul1_2")}</li>
          <li>{t("dashboardDocsAdminAffiliates.ul1_3")}</li>
        </ul>

        <h3>{t("dashboardDocsAdminAffiliates.h3_2")}</h3>
        <p>{t("dashboardDocsAdminAffiliates.p2")}</p>
        <ul>
          <li>{t("dashboardDocsAdminAffiliates.ul2_1")}</li>
          <li>{t("dashboardDocsAdminAffiliates.ul2_2")}</li>
          <li>{t("dashboardDocsAdminAffiliates.ul2_3")}</li>
        </ul>
      </DocContent>
    </>
  );
}
