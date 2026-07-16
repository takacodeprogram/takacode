import { cookies } from "next/headers";
import PageHeader from "../../../../components/app-shell/PageHeader";
import AffiliateBlock from "../../../../components/AffiliateBlock";
import { listPublishedAffiliates } from "../../../../lib/affiliate";
import { buildPageMetadata } from "../../../../lib/seo";
import { createClient } from "../../../../utils/supabase/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = buildPageMetadata({
  title: "Outils recommandes",
  description: "Les outils et fournisseurs recommandes pour construire ton projet.",
  path: "/dashboard/outils",
  noIndex: true
});

export default async function OutilsPage() {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

  const { links, schemaReady } = await listPublishedAffiliates(supabase);

  return (
    <>
      <PageHeader title="OUTILS RECOMMANDES" subtitle="Pour construire et mettre en ligne ton projet" />

      {!schemaReady ? (
        <div className="rounded-xl border border-amber-500/25 bg-amber-500/10 px-4 py-3 text-[12px] text-amber-100 font-body-readable">
          Section outils bientot disponible (execute supabase/sql/015_affiliate_links.sql).
        </div>
      ) : links.length ? (
        <AffiliateBlock links={links} heading="" grouped />
      ) : (
        <div className="rounded-2xl border border-white/[0.07] bg-[#111] p-8 text-center font-body-readable text-[13px] text-[#777]">
          Aucun outil recommande pour l'instant.
        </div>
      )}
    </>
  );
}
