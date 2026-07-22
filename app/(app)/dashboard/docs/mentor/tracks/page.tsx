import { getLocale } from "../../../../../../lib/i18n";
import { getServerLocale } from "../../../../../../lib/serverLocale";
import PageHeader from "../../../../../../components/app-shell/PageHeader";
import DocContent from "../../DocContent";
import { buildPageMetadata } from "../../../../../../lib/seo";

export async function generateMetadata() {
  const localeServer = await getServerLocale();
  const { t } = getLocale(localeServer);
  return buildPageMetadata({
    title: t("dashboardDocsMentorTracks.title"),
    description: t("dashboardDocsMentorTracks.p1"),
    path: "/dashboard/docs/mentor/tracks",
    noIndex: true
  });
}

export default async function MentorParcoursDocPage() {
  const locale = await getServerLocale();
  const { t } = getLocale(locale);

  return (
    <>
      <PageHeader title={t("dashboardDocsMentorTracks.title")} subtitle={t("dashboardDocsMentorTracks.subtitle")} backHref="/dashboard/docs" />
      <DocContent>
        <h2>{t("dashboardDocsMentorTracks.h2")}</h2>
        <p>{t("dashboardDocsMentorTracks.p1").replace("{strong}", "<strong>").replace("{/strong}", "</strong>")}</p>

        <h3>{t("dashboardDocsMentorTracks.h3_1")}</h3>
        <ul>
          <li>{t("dashboardDocsMentorTracks.ul1_1").replace("{strong}", "<strong>").replace("{/strong}", "</strong>")}</li>
          <li>{t("dashboardDocsMentorTracks.ul1_2").replace("{strong}", "<strong>").replace("{/strong}", "</strong>")}</li>
          <li>{t("dashboardDocsMentorTracks.ul1_3").replace("{strong}", "<strong>").replace("{/strong}", "</strong>")}</li>
          <li>{t("dashboardDocsMentorTracks.ul1_4").replace("{strong}", "<strong>").replace("{/strong}", "</strong>")}</li>
          <li>{t("dashboardDocsMentorTracks.ul1_5").replace("{strong}", "<strong>").replace("{/strong}", "</strong>")}</li>
        </ul>

        <h3>{t("dashboardDocsMentorTracks.h3_2")}</h3>
        <p>{t("dashboardDocsMentorTracks.p2")}</p>

        <h3>{t("dashboardDocsMentorTracks.h3_3")}</h3>
        <p>{t("dashboardDocsMentorTracks.p3")}</p>
      </DocContent>
    </>
  );
}
