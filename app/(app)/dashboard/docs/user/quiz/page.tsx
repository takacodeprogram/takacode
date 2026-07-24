import { getLocale } from "../../../../../../lib/i18n";
import { getServerLocale } from "../../../../../../lib/serverLocale";
import PageHeader from "../../../../../../components/app-shell/PageHeader";
import DocContent from "../../DocContent";
import { buildPageMetadata } from "../../../../../../lib/seo";

export async function generateMetadata() {
  const localeServer = await getServerLocale();
  const { t } = getLocale(localeServer);
  return buildPageMetadata({
    title: t("dashboardDocsUserQuiz.title"),
    description: t("dashboardDocsUserQuiz.p1"),
    path: "/dashboard/docs/user/quiz",
    noIndex: true
  });
}

export default async function QuizDocPage() {
  const locale = await getServerLocale();
  const { t } = getLocale(locale);

  return (
    <>
      <PageHeader title={t("dashboardDocsUserQuiz.title")} subtitle={t("dashboardDocsUserQuiz.subtitle")} backHref="/dashboard/docs" />
      <DocContent>
        <h2>{t("dashboardDocsUserQuiz.h2")}</h2>
        <p>{t("dashboardDocsUserQuiz.p1")}</p>

        <h3>{t("dashboardDocsUserQuiz.h3_1")}</h3>
        <ol>
          <li>{t("dashboardDocsUserQuiz.ol1_1")}</li>
          <li>{t("dashboardDocsUserQuiz.ol1_2")}</li>
          <li>{t("dashboardDocsUserQuiz.ol1_3").replace("{strong}", "<strong>").replace("{/strong}", "</strong>")}</li>
          <li>{t("dashboardDocsUserQuiz.ol1_4")}</li>
        </ol>

        <h3>{t("dashboardDocsUserQuiz.h3_2")}</h3>
        <ul>
          <li>{t("dashboardDocsUserQuiz.ul2_1").replace("{strong}", "<strong>").replace("{/strong}", "</strong>")}</li>
          <li>{t("dashboardDocsUserQuiz.ul2_2")}</li>
          <li>{t("dashboardDocsUserQuiz.ul2_3")}</li>
          <li>{t("dashboardDocsUserQuiz.ul2_4")}</li>
        </ul>

        <h3>{t("dashboardDocsUserQuiz.h3_3")}</h3>
        <p>{t("dashboardDocsUserQuiz.p3").replace("{strong}", "<strong>").replace("{/strong}", "</strong>")}</p>

        <h3>{t("dashboardDocsUserQuiz.h3_4")}</h3>
        <ul>
          <li>{t("dashboardDocsUserQuiz.ul4_1")}</li>
          <li>{t("dashboardDocsUserQuiz.ul4_2")}</li>
          <li>{t("dashboardDocsUserQuiz.ul4_3")}</li>
        </ul>
      </DocContent>
    </>
  );
}
