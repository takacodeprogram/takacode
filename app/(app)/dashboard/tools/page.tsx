import { cookies } from "next/headers";
import { getLocale } from "../../../../lib/i18n";
import { getServerLocale } from "../../../../lib/serverLocale";
import PageHeader from "../../../../components/app-shell/PageHeader";
import AffiliateBlock from "../../../../components/AffiliateBlock";
import { listPublishedAffiliates } from "../../../../lib/affiliate";
import { buildPageMetadata } from "../../../../lib/seo";
import { createClient } from "../../../../utils/supabase/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata() {
  const localeServer = await getServerLocale();
  const { t } = getLocale(localeServer);
  return buildPageMetadata({
    title: t("dashboardTools.title"),
    description: t("dashboardTools.subtitle"),
    path: "/dashboard/tools",
    noIndex: true
  });
}

export default async function OutilsPage() {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);
  const locale = await getServerLocale();
  const { t } = getLocale(locale);

  const { links, schemaReady } = await listPublishedAffiliates(supabase);

  return (
    <>
      <PageHeader title={t("dashboardTools.title")} subtitle={t("dashboardTools.subtitle")} />

      {!schemaReady ? (
        <div className="rounded-xl border border-amber-500/25 bg-amber-500/10 px-4 py-3 text-[12px] text-amber-100 font-body-readable">
          {t("dashboardTools.schemaNotReady")}
        </div>
      ) : links.length ? (
        <AffiliateBlock links={links} heading="" grouped />
      ) : (
        <div className="rounded-2xl border border-white/[0.07] bg-[#111] p-8 text-center font-body-readable text-[13px] text-[#777]">
          {t("dashboardTools.empty")}
        </div>
      )}
    </>
  );
}
