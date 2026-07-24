import { getLocale } from "../../../../../../lib/i18n";
import { getServerLocale } from "../../../../../../lib/serverLocale";
import PageHeader from "../../../../../../components/app-shell/PageHeader";
import DocContent from "../../DocContent";
import { buildPageMetadata } from "../../../../../../lib/seo";

export async function generateMetadata() {
  const localeServer = await getServerLocale();
  const { t } = getLocale(localeServer);
  return buildPageMetadata({
    title: t("dashboardDocsMentorQuestions.title"),
    description: t("dashboardDocsMentorQuestions.p1"),
    path: "/dashboard/docs/mentor/questions",
    noIndex: true
  });
}

export default async function MentorQuestionsDocPage() {
  const locale = await getServerLocale();
  const { t } = getLocale(locale);

  return (
    <>
      <PageHeader title={t("dashboardDocsMentorQuestions.title")} subtitle={t("dashboardDocsMentorQuestions.subtitle")} backHref="/dashboard/docs" />
      <DocContent>
        <h2>{t("dashboardDocsMentorQuestions.h2")}</h2>
        <p>{t("dashboardDocsMentorQuestions.p1")}</p>

        <h3>{t("dashboardDocsMentorQuestions.h3_1")}</h3>
        <ul>
          <li>{t("dashboardDocsMentorQuestions.ul1_1").replace("{strong}", "<strong>").replace("{/strong}", "</strong>")}</li>
          <li>{t("dashboardDocsMentorQuestions.ul1_2").replace("{strong}", "<strong>").replace("{/strong}", "</strong>")}</li>
          <li>{t("dashboardDocsMentorQuestions.ul1_3").replace("{strong}", "<strong>").replace("{/strong}", "</strong>")}</li>
          <li>{t("dashboardDocsMentorQuestions.ul1_4").replace("{strong}", "<strong>").replace("{/strong}", "</strong>")}</li>
          <li>{t("dashboardDocsMentorQuestions.ul1_5").replace("{strong}", "<strong>").replace("{/strong}", "</strong>")}</li>
          <li>{t("dashboardDocsMentorQuestions.ul1_6").replace("{strong}", "<strong>").replace("{/strong}", "</strong>")}</li>
          <li>{t("dashboardDocsMentorQuestions.ul1_7").replace("{strong}", "<strong>").replace("{/strong}", "</strong>")}</li>
        </ul>

        <h3>{t("dashboardDocsMentorQuestions.h3_2")}</h3>
        <p>{t("dashboardDocsMentorQuestions.p2")}</p>
        <ul>
          <li>{t("dashboardDocsMentorQuestions.ul2_1")}</li>
          <li>{t("dashboardDocsMentorQuestions.ul2_2")}</li>
          <li>{t("dashboardDocsMentorQuestions.ul2_3")}</li>
          <li>{t("dashboardDocsMentorQuestions.ul2_4")}</li>
        </ul>

        <h3>{t("dashboardDocsMentorQuestions.h3_3")}</h3>
        <p>{t("dashboardDocsMentorQuestions.p3")}</p>

        <h3>{t("dashboardDocsMentorQuestions.h3_4")}</h3>
        <ul>
          <li>{t("dashboardDocsMentorQuestions.ul4_1").replace("{strong}", "<strong>").replace("{/strong}", "</strong>")}</li>
          <li>{t("dashboardDocsMentorQuestions.ul4_2").replace("{strong}", "<strong>").replace("{/strong}", "</strong>")}</li>
          <li>{t("dashboardDocsMentorQuestions.ul4_3").replace("{strong}", "<strong>").replace("{/strong}", "</strong>")}</li>
        </ul>
      </DocContent>
    </>
  );
}
