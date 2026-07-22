import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import PageHeader from "../../../../components/app-shell/PageHeader";
import { getLocale } from "../../../../lib/i18n";
import { buildPageMetadata } from "../../../../lib/seo";
import { localePath } from "../../../../lib/localeHelpers";
import { getServerLocale } from "../../../../lib/serverLocale";
import { createClient } from "../../../../utils/supabase/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata() {
  const localeServer = await getServerLocale();
  const { t } = getLocale(localeServer);
  return buildPageMetadata({
    title: t("dashboardMentor.title"),
    description: t("dashboardMentor.subtitle"),
    path: "/dashboard/mentor",
    noIndex: true
  });
}

function statusOf(track: Record<string, unknown>, t: (key: string) => string) {
  if (track.is_pending) return { label: t("dashboardMentor.pending"), cls: "border-amber-500/30 bg-amber-500/10 text-amber-100" };
  if (track.is_published) return { label: t("dashboardMentor.published"), cls: "border-emerald-500/30 bg-emerald-500/10 text-emerald-200" };
  return { label: t("dashboardMentor.rejected"), cls: "border-red-500/30 bg-red-500/10 text-red-200" };
}

export default async function MentorHomePage() {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/signin?next=/dashboard/mentor");
  }

  const { data } = await supabase
    .from("learning_tracks")
    .select("id, slug, title, is_published, is_pending, is_active, updated_at")
    .eq("created_by", user.id)
    .order("updated_at", { ascending: false });

  const locale = await getServerLocale();
  const { t } = getLocale(locale);
  const tracks = data || [];

  return (
    <>
      <PageHeader
        title={t("dashboardMentor.title")}
        subtitle={t("dashboardMentor.subtitle")}
        actions={
          <Link href={localePath("/dashboard/mentor/new", locale)} className="btn-primary inline-flex items-center gap-2 text-[12px]">
            <iconify-icon icon="lucide:plus" style={{ fontSize: "13px" }} />
            {t("dashboardMentor.proposeTrack")}
          </Link>
        }
      />

      <div className="rounded-xl border border-blue-500/20 bg-blue-500/[0.06] px-4 py-3 text-[12px] text-blue-100/90 font-body-readable mb-5">
        {t("dashboardMentor.info").replace("{strong}", "<span class=\"font-semibold\">").replace("{/strong}", "</span>")}
      </div>

      {tracks.length ? (
        <div className="space-y-2.5">
          {tracks.map((track) => {
            const status = statusOf(track, t);
            return (
              <div key={track.id} className="flex items-center justify-between gap-3 rounded-xl border border-white/[0.08] bg-[#111] px-4 py-3.5">
                <div className="min-w-0">
                  <div className="text-[13px] text-white font-semibold leading-tight truncate">{track.title}</div>
                  <div className="text-[11px] text-[#6d6d6d] font-body-readable">/{track.slug}</div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${status.cls}`}>{status.label}</span>
                  {track.is_pending ? (
                    <Link href={localePath(`/dashboard/mentor/${track.id}`, locale)} className="text-[#888] hover:text-white p-1" title={t("dashboardMentor.edit")}>
                      <iconify-icon icon="lucide:pencil" style={{ fontSize: "14px" }} />
                    </Link>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl border border-white/[0.07] bg-[#111] p-8 text-center">
          <p className="font-body-readable text-[13px] text-[#777] mb-4">{t("dashboardMentor.empty")}</p>
          <Link href={localePath("/dashboard/mentor/new", locale)} className="btn-primary inline-flex items-center gap-2 text-[12px]">
            <iconify-icon icon="lucide:plus" style={{ fontSize: "13px" }} />
            {t("dashboardMentor.firstProposal")}
          </Link>
        </div>
      )}
    </>
  );
}
