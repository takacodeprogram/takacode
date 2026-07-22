import { getLocale } from "../../../../../../lib/i18n";
import { getServerLocale } from "../../../../../../lib/serverLocale";
import PageHeader from "../../../../../../components/app-shell/PageHeader";
import DocContent from "../../DocContent";
import { buildPageMetadata } from "../../../../../../lib/seo";

export async function generateMetadata() {
  const localeServer = await getServerLocale();
  const { t } = getLocale(localeServer);
  return buildPageMetadata({
    title: t("dashboardDocsAdminSessions.title"),
    description: t("dashboardDocsAdminSessions.p1"),
    path: "/dashboard/docs/admin/sessions",
    noIndex: true
  });
}

export default async function AdminSessionsDocPage() {
  const locale = await getServerLocale();
  const { t } = getLocale(locale);

  return (
    <>
      <PageHeader title={t("dashboardDocsAdminSessions.title")} subtitle={t("dashboardDocsAdminSessions.subtitle")} backHref="/dashboard/docs" />
      <DocContent>
        <h2>{t("dashboardDocsAdminSessions.h2")}</h2>
        <p>{t("dashboardDocsAdminSessions.p1")}</p>

        <h3>{t("dashboardDocsAdminSessions.h3_1")}</h3>
        <ul>
          <li>{t("dashboardDocsAdminSessions.ul1_1")}</li>
          <li>{t("dashboardDocsAdminSessions.ul1_2")}</li>
          <li>{t("dashboardDocsAdminSessions.ul1_3")}</li>
          <li>{t("dashboardDocsAdminSessions.ul1_4")}</li>
        </ul>

        <h3>{t("dashboardDocsAdminSessions.h3_2")}</h3>
        <p>{t("dashboardDocsAdminSessions.p2")}</p>

        <h3>{t("dashboardDocsAdminSessions.h3_3")}</h3>
        <p>{t("dashboardDocsAdminSessions.p3")}</p>
      </DocContent>
    </>
  );
}
