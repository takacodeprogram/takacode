import { getLocale } from "../../../../../../lib/i18n";
import { getServerLocale } from "../../../../../../lib/serverLocale";
import PageHeader from "../../../../../../components/app-shell/PageHeader";
import DocContent from "../../DocContent";
import { buildPageMetadata } from "../../../../../../lib/seo";

export async function generateMetadata() {
  const localeServer = await getServerLocale();
  const { t } = getLocale(localeServer);
  return buildPageMetadata({
    title: t("dashboardDocsAdminRoles.title"),
    description: t("dashboardDocsAdminRoles.p1"),
    path: "/dashboard/docs/admin/roles",
    noIndex: true
  });
}

export default async function AdminRolesDocPage() {
  const locale = await getServerLocale();
  const { t } = getLocale(locale);

  return (
    <>
      <PageHeader title={t("dashboardDocsAdminRoles.title")} subtitle={t("dashboardDocsAdminRoles.subtitle")} backHref="/dashboard/docs" />
      <DocContent>
        <h2>{t("dashboardDocsAdminRoles.h2")}</h2>
        <p>{t("dashboardDocsAdminRoles.p1")}</p>
        <ul>
          <li>{t("dashboardDocsAdminRoles.ul1_1").replace("{strong}", "<strong>").replace("{/strong}", "</strong>")}</li>
          <li>{t("dashboardDocsAdminRoles.ul1_2").replace("{strong}", "<strong>").replace("{/strong}", "</strong>")}</li>
          <li>{t("dashboardDocsAdminRoles.ul1_3").replace("{strong}", "<strong>").replace("{/strong}", "</strong>")}</li>
        </ul>

        <h3>{t("dashboardDocsAdminRoles.h3_2")}</h3>
        <p>{t("dashboardDocsAdminRoles.p2").replace("{strong}", "<strong>").replace("{/strong}", "</strong>")}</p>
        <ul>
          <li>{t("dashboardDocsAdminRoles.ul2_1")}</li>
          <li>{t("dashboardDocsAdminRoles.ul2_2")}</li>
          <li>{t("dashboardDocsAdminRoles.ul2_3")}</li>
        </ul>

        <h3>{t("dashboardDocsAdminRoles.h3_3")}</h3>
        <p>{t("dashboardDocsAdminRoles.p3")}</p>
      </DocContent>
    </>
  );
}
