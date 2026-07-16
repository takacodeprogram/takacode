import { cookies } from "next/headers";
import PageHeader from "../../../../components/app-shell/PageHeader";
import ReviewQueue from "../../../../components/ReviewQueue";
import { getReviewQueue } from "../../../../lib/reviews";
import { buildPageMetadata } from "../../../../lib/seo";
import { createClient } from "../../../../utils/supabase/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = buildPageMetadata({
  title: "Revues",
  description: "Relis les micro-projets des autres membres et donne ton retour.",
  path: "/dashboard/reviews",
  noIndex: true
});

export default async function ReviewsPage() {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

  const { items, schemaReady } = await getReviewQueue(supabase, 30);

  return (
    <>
      <PageHeader title="REVUES" subtitle="Relis et valide les micro-projets des autres" />

      <div className="rounded-xl border border-blue-500/20 bg-blue-500/[0.06] px-4 py-3 text-[12px] text-blue-100/90 font-body-readable mb-5">
        Aide la communaute : donne un retour constructif. Chaque revue te rapporte des points.
      </div>

      {!schemaReady ? (
        <div className="rounded-xl border border-amber-500/25 bg-amber-500/10 px-4 py-3 text-[12px] text-amber-100 font-body-readable">
          Revues bientot disponibles (execute supabase/sql/016_project_reviews.sql).
        </div>
      ) : (
        <ReviewQueue initialItems={items} />
      )}
    </>
  );
}
