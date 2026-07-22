import Link from "next/link";
import { cookies } from "next/headers";
import PageHeader from "../../../../components/app-shell/PageHeader";
import { categoryLabel, listAllAffiliates } from "../../../../lib/affiliate";
import { buildPageMetadata } from "../../../../lib/seo";
import { createClient } from "../../../../utils/supabase/server";
import { localePath } from "../../../../lib/localeHelpers";
import { getServerLocale } from "../../../../lib/serverLocale";
import { getLocale } from "../../../../lib/i18n";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata() {
  const locale = await getServerLocale();
  const { t } = getLocale(locale);
  return buildPageMetadata({ title: t("adminAffiliates.metaTitle"), description: t("adminAffiliates.metaDesc"), path: "/admin/affiliates", noIndex: true });
}

export default async function AdminAffiliatesPage() {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

  const locale = await getServerLocale();
  const { t } = getLocale(locale);

  const { links, schemaReady, error } = await listAllAffiliates(supabase);

  return (
    <>
      <PageHeader
        title={t("adminAffiliates.title")}
        subtitle={`${links.length} lien${links.length > 1 ? "s" : ""}`}
        backHref="/admin"
        backLabel={t("admin.backAdmin")}
        actions={
          <Link href={localePath("/admin/affiliates/new", locale)} className="btn-primary inline-flex items-center gap-2 text-[12px]">
            <iconify-icon icon="lucide:plus" style={{ fontSize: "13px" }} />
            {t("adminAffiliates.newLink")}
          </Link>
        }
      />

      {!schemaReady ? (
        <div className="rounded-xl border border-amber-500/25 bg-amber-500/10 px-4 py-3 text-[12px] text-amber-100 font-body-readable">
          {t("adminAffiliates.tableMissing")}
        </div>
      ) : error ? (
        <div className="rounded-xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-[12px] text-red-200 font-body-readable">{error.message || t("admin.error")}</div>
      ) : links.length ? (
        <div className="space-y-2.5">
          {links.map((link) => (
            <Link key={link.id} href={localePath(`/admin/affiliates/${link.id}`, locale)} className="flex items-center justify-between gap-3 rounded-xl border border-white/[0.08] bg-[#111] px-4 py-3.5 card-hover">
              <div className="min-w-0">
                <div className="text-[13px] text-white font-semibold leading-tight truncate">{link.title || link.provider}</div>
                <div className="text-[11px] text-[#6d6d6d] font-body-readable">{link.provider} · {categoryLabel(link.category)}</div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${link.isPublished ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-200" : "border-white/[0.12] bg-white/[0.03] text-[#888]"}`}>
                  {link.isPublished ? t("admin.publishedLabel") : t("admin.hiddenLabel")}
                </span>
                <iconify-icon icon="lucide:chevron-right" style={{ fontSize: "16px", color: "#666" }} />
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-white/[0.07] bg-[#111] p-8 text-center">
          <p className="font-body-readable text-[13px] text-[#777] mb-4">{t("adminAffiliates.empty")}</p>
          <Link href={localePath("/admin/affiliates/new", locale)} className="btn-primary inline-flex items-center gap-2 text-[12px]">
            <iconify-icon icon="lucide:plus" style={{ fontSize: "13px" }} />
            {t("adminAffiliates.addFirst")}
          </Link>
        </div>
      )}
    </>
  );
}
