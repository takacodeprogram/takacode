import { getLocale } from "../../../../../../lib/i18n";
import { getServerLocale } from "../../../../../../lib/serverLocale";
import PageHeader from "../../../../../../components/app-shell/PageHeader";
import DocContent from "../../DocContent";
import { buildPageMetadata } from "../../../../../../lib/seo";

export async function generateMetadata() {
  const localeServer = await getServerLocale();
  const { t } = getLocale(localeServer);
  return buildPageMetadata({
    title: t("dashboardDocsUserTracks.title"),
    description: t("dashboardDocsUserTracks.p1"),
    path: "/dashboard/docs/user/tracks",
    noIndex: true
  });
}

export default async function ParcoursDocPage() {
  const locale = await getServerLocale();
  const { t } = getLocale(locale);

  return (
    <>
      <PageHeader title={t("dashboardDocsUserTracks.title")} subtitle={t("dashboardDocsUserTracks.subtitle")} backHref="/dashboard/docs" />
      <DocContent>
        <h2>{t("dashboardDocsUserTracks.h2")}</h2>
        <p>{t("dashboardDocsUserTracks.p1").replace("{strong}", "<strong>").replace("{/strong}", "</strong>")}</p>

        <h3>{t("dashboardDocsUserTracks.h3_1")}</h3>
        <ol>
          <li>{t("dashboardDocsUserTracks.ol1_1").replace("{strong}", "<strong>").replace("{/strong}", "</strong>")}</li>
          <li>{t("dashboardDocsUserTracks.ol1_2")}</li>
          <li>{t("dashboardDocsUserTracks.ol1_3")}</li>
          <li>{t("dashboardDocsUserTracks.ol1_4")}</li>
        </ol>

        <h3>{t("dashboardDocsUserTracks.h3_2")}</h3>
        <p>{t("dashboardDocsUserTracks.p2")}</p>
        <ul>
          <li>{t("dashboardDocsUserTracks.ul2_1").replace("{strong}", "<strong>").replace("{/strong}", "</strong>")}</li>
          <li>{t("dashboardDocsUserTracks.ul2_2").replace("{strong}", "<strong>").replace("{/strong}", "</strong>")}</li>
          <li>{t("dashboardDocsUserTracks.ul2_3").replace("{strong}", "<strong>").replace("{/strong}", "</strong>")}</li>
          <li>{t("dashboardDocsUserTracks.ul2_4").replace("{strong}", "<strong>").replace("{/strong}", "</strong>")}</li>
        </ul>

        <h3>{t("dashboardDocsUserTracks.h3_3")}</h3>
        <p>{t("dashboardDocsUserTracks.p3")}</p>

        <h3>{t("dashboardDocsUserTracks.h3_4")}</h3>
        <ul>
          <li>{t("dashboardDocsUserTracks.ul4_1")}</li>
          <li>{t("dashboardDocsUserTracks.ul4_2")}</li>
          <li>{t("dashboardDocsUserTracks.ul4_3")}</li>
          <li>{t("dashboardDocsUserTracks.ul4_4")}</li>
        </ul>
      </DocContent>
    </>
  );
}
