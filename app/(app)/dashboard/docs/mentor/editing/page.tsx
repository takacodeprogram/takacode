import { getLocale } from "../../../../../../lib/i18n";
import { getServerLocale } from "../../../../../../lib/serverLocale";
import PageHeader from "../../../../../../components/app-shell/PageHeader";
import DocContent from "../../DocContent";
import { buildPageMetadata } from "../../../../../../lib/seo";

export async function generateMetadata() {
  const localeServer = await getServerLocale();
  const { t } = getLocale(localeServer);
  return buildPageMetadata({
    title: t("dashboardDocsMentorEditing.title"),
    description: t("dashboardDocsMentorEditing.p1"),
    path: "/dashboard/docs/mentor/editing",
    noIndex: true
  });
}

export default async function MentorEditionDocPage() {
  const locale = await getServerLocale();
  const { t } = getLocale(locale);

  return (
    <>
      <PageHeader title={t("dashboardDocsMentorEditing.title")} subtitle={t("dashboardDocsMentorEditing.subtitle")} backHref="/dashboard/docs" />
      <DocContent>
        <h2>{t("dashboardDocsMentorEditing.h2")}</h2>
        <p>{t("dashboardDocsMentorEditing.p1")}</p>
        <ul>
          <li>{t("dashboardDocsMentorEditing.ul1_1").replace("{strong}", "<strong>").replace("{/strong}", "</strong>")}</li>
          <li>{t("dashboardDocsMentorEditing.ul1_2").replace("{strong}", "<strong>").replace("{/strong}", "</strong>")}</li>
          <li>{t("dashboardDocsMentorEditing.ul1_3").replace("{strong}", "<strong>").replace("{/strong}", "</strong>")}</li>
          <li>{t("dashboardDocsMentorEditing.ul1_4").replace("{strong}", "<strong>").replace("{/strong}", "</strong>")}</li>
          <li>{t("dashboardDocsMentorEditing.ul1_5").replace("{strong}", "<strong>").replace("{/strong}", "</strong>")}</li>
        </ul>

        <h3>{t("dashboardDocsMentorEditing.h3_2")}</h3>
        <p>{t("dashboardDocsMentorEditing.p2")}</p>
        <ul>
          <li>{t("dashboardDocsMentorEditing.ul2_1")}</li>
          <li>{t("dashboardDocsMentorEditing.ul2_2")}</li>
          <li>{t("dashboardDocsMentorEditing.ul2_3")}</li>
          <li>{t("dashboardDocsMentorEditing.ul2_4")}</li>
          <li>{t("dashboardDocsMentorEditing.ul2_5")}</li>
        </ul>

        <h3>{t("dashboardDocsMentorEditing.h3_3")}</h3>
        <p>{t("dashboardDocsMentorEditing.p3")}</p>
      </DocContent>
    </>
  );
}
