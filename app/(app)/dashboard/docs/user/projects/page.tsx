import { getLocale } from "../../../../../../lib/i18n";
import { getServerLocale } from "../../../../../../lib/serverLocale";
import PageHeader from "../../../../../../components/app-shell/PageHeader";
import DocContent from "../../DocContent";
import { buildPageMetadata } from "../../../../../../lib/seo";

export async function generateMetadata() {
  const localeServer = await getServerLocale();
  const { t } = getLocale(localeServer);
  return buildPageMetadata({
    title: t("dashboardDocsUserProjects.title"),
    description: t("dashboardDocsUserProjects.p1"),
    path: "/dashboard/docs/user/projects",
    noIndex: true
  });
}

export default async function ProjetsDocPage() {
  const locale = await getServerLocale();
  const { t } = getLocale(locale);

  return (
    <>
      <PageHeader title={t("dashboardDocsUserProjects.title")} subtitle={t("dashboardDocsUserProjects.subtitle")} backHref="/dashboard/docs" />
      <DocContent>
        <h2>{t("dashboardDocsUserProjects.h2")}</h2>
        <p>{t("dashboardDocsUserProjects.p1")}</p>

        <h3>{t("dashboardDocsUserProjects.h3_1")}</h3>
        <p>{t("dashboardDocsUserProjects.p2").replace("{strong}", "<strong>").replace("{/strong}", "</strong>")}</p>
        <ul>
          <li>{t("dashboardDocsUserProjects.ul2_1")}</li>
          <li>{t("dashboardDocsUserProjects.ul2_2")}</li>
          <li>{t("dashboardDocsUserProjects.ul2_3")}</li>
        </ul>

        <h3>{t("dashboardDocsUserProjects.h3_2")}</h3>
        <p>{t("dashboardDocsUserProjects.p3")}</p>
        <ul>
          <li>{t("dashboardDocsUserProjects.ul3_1")}</li>
          <li>{t("dashboardDocsUserProjects.ul3_2")}</li>
          <li>{t("dashboardDocsUserProjects.ul3_3")}</li>
        </ul>

        <h3>{t("dashboardDocsUserProjects.h3_3")}</h3>
        <p>{t("dashboardDocsUserProjects.p4")}</p>
        <ol>
          <li>{t("dashboardDocsUserProjects.ol4_1")}</li>
          <li>{t("dashboardDocsUserProjects.ol4_2")}</li>
          <li>{t("dashboardDocsUserProjects.ol4_3")}</li>
          <li>{t("dashboardDocsUserProjects.ol4_4")}</li>
        </ol>

        <h3>{t("dashboardDocsUserProjects.h3_4")}</h3>
        <p>{t("dashboardDocsUserProjects.p5")}</p>
        <ul>
          <li>{t("dashboardDocsUserProjects.ul5_1").replace("{strong}", "<strong>").replace("{/strong}", "</strong>")}</li>
          <li>{t("dashboardDocsUserProjects.ul5_2").replace("{strong}", "<strong>").replace("{/strong}", "</strong>")}</li>
          <li>{t("dashboardDocsUserProjects.ul5_3").replace("{strong}", "<strong>").replace("{/strong}", "</strong>")}</li>
          <li>{t("dashboardDocsUserProjects.ul5_4").replace("{strong}", "<strong>").replace("{/strong}", "</strong>")}</li>
        </ul>
        <p>{t("dashboardDocsUserProjects.p6")}</p>

        <h3>{t("dashboardDocsUserProjects.h3_5")}</h3>
        <ul>
          <li>{t("dashboardDocsUserProjects.ul6_1").replace("{strong}", "<strong>").replace("{/strong}", "</strong>")}</li>
          <li>{t("dashboardDocsUserProjects.ul6_2").replace("{strong}", "<strong>").replace("{/strong}", "</strong>")}</li>
          <li>{t("dashboardDocsUserProjects.ul6_3").replace("{strong}", "<strong>").replace("{/strong}", "</strong>")}</li>
          <li>{t("dashboardDocsUserProjects.ul6_4").replace("{strong}", "<strong>").replace("{/strong}", "</strong>")}</li>
        </ul>
      </DocContent>
    </>
  );
}
