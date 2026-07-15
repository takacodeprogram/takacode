import { cookies } from "next/headers";
import PageHeader from "../../../../components/app-shell/PageHeader";
import ReviewHistory from "../../../../components/admin/ReviewHistory";
import { buildPageMetadata } from "../../../../lib/seo";
import { createClient } from "../../../../utils/supabase/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = buildPageMetadata({
  title: "Historique des revues",
  description: "Historique des revues de micro-projets avec methode (IA, pairs, mentor, heuristique).",
  path: "/admin/revues",
  noIndex: true
});

export default async function AdminReviewsPage() {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

  const { data, error } = await supabase.rpc("list_review_history", { p_limit: 100 });

  const items = Array.isArray(data) ? data : [];

  return (
    <>
      <PageHeader
        title="HISTORIQUE DES REVUES"
        subtitle="Micro-projets revus : IA, pairs, mentor ou heuristique"
        backHref="/admin"
        backLabel="Admin"
      />

      {!error && items.length === 0 ? (
        <div className="rounded-2xl border border-white/[0.07] bg-[#111] p-10 text-center font-body-readable text-[13px] text-[#777]">
          Aucune revue pour l'instant.
        </div>
      ) : error ? (
        <div className="rounded-xl border border-amber-500/25 bg-amber-500/10 px-4 py-3 text-[12px] text-amber-100 font-body-readable">
          Impossible de charger l&apos;historique. Execute supabase/sql/021_ai_review_support.sql pour activer cette fonctionnalite.
        </div>
      ) : (
        <ReviewHistory items={items} />
      )}
    </>
  );
}
