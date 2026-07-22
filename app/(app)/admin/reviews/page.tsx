import { cookies } from "next/headers";
import PageHeader from "../../../../components/app-shell/PageHeader";
import ReviewHistory from "../../../../components/admin/ReviewHistory";
import { buildPageMetadata } from "../../../../lib/seo";
import { createClient } from "../../../../utils/supabase/server";
import { getLocale } from "../../../../lib/i18n";
import { getServerLocale } from "../../../../lib/serverLocale";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata() {
  const locale = await getServerLocale();
  const { t } = getLocale(locale);
  return buildPageMetadata({ title: t("adminReviews.metaTitle"), description: t("adminReviews.metaDesc"), path: "/admin/reviews", noIndex: true });
}

export default async function AdminReviewsPage() {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

  const { data, error } = await supabase.rpc("list_review_history", { p_limit: 100 });

  const locale = await getServerLocale();
  const { t } = getLocale(locale);

  const raw = Array.isArray(data) ? data : [];
  const items = raw.map((row: Record<string, unknown>) => ({
    id: (row.lesson_id as string) || (row.id as string) || crypto.randomUUID(),
    reviewer_name: (row.last_reviewer_name as string) || t("adminReviews.examiner"),
    reviewer_avatar: (row.avatar_url as string) || "",
    status: (row.review_status as string) || "pending",
    notes: (row.review_feedback as string) || "",
    created_at: (row.last_reviewed_at as string) || "",
    project_title: (row.lesson_title as string) || "",
    ai_feedback: (row.ai_feedback as string) || "",
    score: typeof row.score === "number" ? row.score : undefined
  }));

  return (
    <>
      <PageHeader
        title={t("adminReviews.title")}
        subtitle={t("adminReviews.subtitle")}
        backHref="/admin"
        backLabel={t("admin.backAdminShort")}
      />

      {!error && items.length === 0 ? (
        <div className="rounded-2xl border border-white/[0.07] bg-[#111] p-10 text-center font-body-readable text-[13px] text-[#777]">
          {t("adminReviews.empty")}
        </div>
      ) : error ? (
        <div className="rounded-xl border border-amber-500/25 bg-amber-500/10 px-4 py-3 text-[12px] text-amber-100 font-body-readable">
          {t("adminReviews.notAvailable")}
        </div>
      ) : (
        <ReviewHistory reviews={items} />
      )}
    </>
  );
}
