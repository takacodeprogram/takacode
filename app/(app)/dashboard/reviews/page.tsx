import { cookies } from "next/headers";
import PageHeader from "../../../../components/app-shell/PageHeader";
import ReviewQueue from "../../../../components/ReviewQueue";
import { getReviewQueue } from "../../../../lib/reviews";
import { getLocale } from "../../../../lib/i18n";
import { getServerLocale } from "../../../../lib/serverLocale";
import { buildPageMetadata } from "../../../../lib/seo";
import { createClient } from "../../../../utils/supabase/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata() {
  const localeServer = await getServerLocale();
  const { t } = getLocale(localeServer);
  return buildPageMetadata({
    title: t("dashboardReviews.title"),
    description: t("dashboardReviews.subtitle"),
    path: "/dashboard/reviews",
    noIndex: true
  });
}

export default async function ReviewsPage() {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);
  const locale = await getServerLocale();
  const { t } = getLocale(locale);

  const { items, schemaReady } = await getReviewQueue(supabase, 30);

  return (
    <>
      <PageHeader title={t("dashboardReviews.title")} subtitle={t("dashboardReviews.subtitle")} />

      <div className="rounded-xl border border-blue-500/20 bg-blue-500/[0.06] px-4 py-3 text-[12px] text-blue-100/90 font-body-readable mb-5">
        {t("dashboardReviews.info")}
      </div>

      {!schemaReady ? (
        <div className="rounded-xl border border-amber-500/25 bg-amber-500/10 px-4 py-3 text-[12px] text-amber-100 font-body-readable">
          {t("dashboardReviews.schemaNotReady")}
        </div>
      ) : (
        <ReviewQueue initialItems={items} />
      )}
    </>
  );
}
