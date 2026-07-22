import { getLocale } from "../../../../../../lib/i18n";
import { getServerLocale } from "../../../../../../lib/serverLocale";
import PageHeader from "../../../../../../components/app-shell/PageHeader";
import DocContent from "../../DocContent";
import { buildPageMetadata } from "../../../../../../lib/seo";

export async function generateMetadata() {
  const localeServer = await getServerLocale();
  const { t } = getLocale(localeServer);
  return buildPageMetadata({
    title: t("dashboardDocsMentorReviews.title"),
    description: t("dashboardDocsMentorReviews.p1"),
    path: "/dashboard/docs/mentor/reviews",
    noIndex: true
  });
}

export default async function MentorReviewsDocPage() {
  const locale = await getServerLocale();
  const { t } = getLocale(locale);

  return (
    <>
      <PageHeader title={t("dashboardDocsMentorReviews.title")} subtitle={t("dashboardDocsMentorReviews.subtitle")} backHref="/dashboard/docs" />
      <DocContent>
        <h2>{t("dashboardDocsMentorReviews.h2")}</h2>
        <p>{t("dashboardDocsMentorReviews.p1").replace("{strong}", "<strong>").replace("{/strong}", "</strong>")}</p>

        <h3>{t("dashboardDocsMentorReviews.h3_1")}</h3>
        <ol>
          <li>{t("dashboardDocsMentorReviews.ol1_1")}</li>
          <li>{t("dashboardDocsMentorReviews.ol1_2")}</li>
          <li>{t("dashboardDocsMentorReviews.ol1_3")}</li>
          <li>{t("dashboardDocsMentorReviews.ol1_4")}</li>
          <li>{t("dashboardDocsMentorReviews.ol1_5")}</li>
        </ol>

        <h3>{t("dashboardDocsMentorReviews.h3_2")}</h3>
        <ul>
          <li>{t("dashboardDocsMentorReviews.ul2_1")}</li>
          <li>{t("dashboardDocsMentorReviews.ul2_2")}</li>
          <li>{t("dashboardDocsMentorReviews.ul2_3")}</li>
          <li>{t("dashboardDocsMentorReviews.ul2_4")}</li>
        </ul>

        <h3>{t("dashboardDocsMentorReviews.h3_3")}</h3>
        <p>{t("dashboardDocsMentorReviews.p3")}</p>
      </DocContent>
    </>
  );
}
