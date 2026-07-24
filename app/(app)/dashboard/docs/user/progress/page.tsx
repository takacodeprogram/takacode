import { getLocale } from "../../../../../../lib/i18n";
import { getServerLocale } from "../../../../../../lib/serverLocale";
import PageHeader from "../../../../../../components/app-shell/PageHeader";
import DocContent from "../../DocContent";
import { buildPageMetadata } from "../../../../../../lib/seo";

export async function generateMetadata() {
  const localeServer = await getServerLocale();
  const { t } = getLocale(localeServer);
  return buildPageMetadata({
    title: t("dashboardDocsUserProgress.title"),
    description: t("dashboardDocsUserProgress.p1"),
    path: "/dashboard/docs/user/progress",
    noIndex: true
  });
}

export default async function ProgressionDocPage() {
  const locale = await getServerLocale();
  const { t } = getLocale(locale);

  return (
    <>
      <PageHeader title={t("dashboardDocsUserProgress.title")} subtitle={t("dashboardDocsUserProgress.subtitle")} backHref="/dashboard/docs" />
      <DocContent>
        <h2>{t("dashboardDocsUserProgress.h2")}</h2>
        <p>{t("dashboardDocsUserProgress.p1")}</p>

        <h3>{t("dashboardDocsUserProgress.h3_1")}</h3>
        <ul>
          <li>{t("dashboardDocsUserProgress.ul1_1").replace("{strong}", "<strong>").replace("{/strong}", "</strong>")}</li>
          <li>{t("dashboardDocsUserProgress.ul1_2").replace("{strong}", "<strong>").replace("{/strong}", "</strong>")}</li>
          <li>{t("dashboardDocsUserProgress.ul1_3").replace("{strong}", "<strong>").replace("{/strong}", "</strong>")}</li>
          <li>{t("dashboardDocsUserProgress.ul1_4").replace("{strong}", "<strong>").replace("{/strong}", "</strong>")}</li>
          <li>{t("dashboardDocsUserProgress.ul1_5").replace("{strong}", "<strong>").replace("{/strong}", "</strong>")}</li>
        </ul>

        <h3>{t("dashboardDocsUserProgress.h3_2")}</h3>
        <p>{t("dashboardDocsUserProgress.p2")}</p>
        <ul>
          <li>{t("dashboardDocsUserProgress.ul2_1").replace("{strong}", "<strong>").replace("{/strong}", "</strong>")}</li>
          <li>{t("dashboardDocsUserProgress.ul2_2").replace("{strong}", "<strong>").replace("{/strong}", "</strong>")}</li>
          <li>{t("dashboardDocsUserProgress.ul2_3").replace("{strong}", "<strong>").replace("{/strong}", "</strong>")}</li>
          <li>{t("dashboardDocsUserProgress.ul2_4").replace("{strong}", "<strong>").replace("{/strong}", "</strong>")}</li>
        </ul>

        <h3>{t("dashboardDocsUserProgress.h3_3")}</h3>
        <p>{t("dashboardDocsUserProgress.p3")}</p>
      </DocContent>
    </>
  );
}
