import Link from "next/link";
import { cookies } from "next/headers";
import PageHeader from "../../../../components/app-shell/PageHeader";
import { getCommunityProjects } from "../../../../lib/community";
import { getPlatformStats } from "../../../../lib/platformStats";
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
    title: t("dashboardCommunity.title"),
    description: t("dashboardCommunity.emptyDesc"),
    path: "/dashboard/community",
    noIndex: true
  });
}

function formatDate(value: string | null | undefined) {
  if (!value) return "";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "";
  return parsed.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" });
}

export default async function CommunityFeedPage() {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

  const locale = await getServerLocale();
  const { t } = getLocale(locale);

  const [projectsResult, stats] = await Promise.all([
    getCommunityProjects(supabase, 12),
    getPlatformStats(supabase)
  ]);

  const projects = projectsResult.projects;

  return (
    <>
      <PageHeader title={t("dashboardCommunity.title")} subtitle={`${projects.length} projets · ${stats.totalLikes ?? "—"} likes`} />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <div className="rounded-2xl border border-white/[0.08] bg-[#111] px-4 py-4 text-center">
          <iconify-icon icon="lucide:users" style={{ fontSize: "18px", color: "#4F8EF7" }} />
          <div className="text-[20px] text-white font-semibold mt-1">{stats.members ?? "—"}</div>
          <div className="text-[10px] text-[#666] font-body-readable">{t("dashboardCommunity.members")}</div>
        </div>
        <div className="rounded-2xl border border-white/[0.08] bg-[#111] px-4 py-4 text-center">
          <iconify-icon icon="lucide:folder-code" style={{ fontSize: "18px", color: "#4F8EF7" }} />
          <div className="text-[20px] text-white font-semibold mt-1">{stats.submittedProjects ?? "—"}</div>
          <div className="text-[10px] text-[#666] font-body-readable">{t("dashboardCommunity.projects")}</div>
        </div>
        <div className="rounded-2xl border border-white/[0.08] bg-[#111] px-4 py-4 text-center">
          <iconify-icon icon="lucide:heart" style={{ fontSize: "18px", color: "#f43f5e" }} />
          <div className="text-[20px] text-white font-semibold mt-1">{stats.totalLikes ?? "—"}</div>
          <div className="text-[10px] text-[#666] font-body-readable">{t("dashboardCommunity.likes")}</div>
        </div>
        <div className="rounded-2xl border border-white/[0.08] bg-[#111] px-4 py-4 text-center">
          <iconify-icon icon="lucide:check-circle" style={{ fontSize: "18px", color: "#4F8EF7" }} />
          <div className="text-[20px] text-white font-semibold mt-1">{stats.completedLessons ?? "—"}</div>
          <div className="text-[10px] text-[#666] font-body-readable">{t("dashboardCommunity.lessons")}</div>
        </div>
      </div>

      {projects.length > 0 ? (
        <div className="space-y-2.5">
          {projects.map((project) => (
            <Link
              key={project.id}
              href={localePath(`/projects/${project.id}`, locale)}
              className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.01] px-4 py-3 hover:border-white/[0.15] transition-all"
            >
              <div className="w-8 h-8 rounded-lg border border-white/[0.06] bg-white/[0.02] flex items-center justify-center shrink-0">
                <iconify-icon icon="lucide:folder" style={{ color: "#4F8EF7", fontSize: "15px" }} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[13px] text-white font-semibold leading-tight">{project.title}</div>
                <div className="text-[11px] text-[#888] font-body-readable">
                  {project.author} · {project.track || t("dashboardCommunity.noTrack")}
                  {project.likeCount > 0 ? ` · ${project.likeCount} like${project.likeCount > 1 ? "s" : ""}` : ""}
                </div>
              </div>
              <iconify-icon icon="lucide:arrow-right" style={{ fontSize: "14px", color: "#555" }} className="shrink-0" />
            </Link>
          ))}
          <Link href={localePath("/community", locale)} className="block text-center text-[12px] text-[#4F8EF7] hover:underline mt-3">
            {t("dashboardCommunity.viewCommunity")}
          </Link>
        </div>
      ) : (
        <div className="rounded-2xl border border-white/[0.07] bg-[#111] p-10 flex flex-col items-center text-center gap-4">
          <div className="w-14 h-14 rounded-2xl border border-white/[0.08] bg-white/[0.02] flex items-center justify-center">
            <iconify-icon icon="lucide:users" className="text-[#4F8EF7]" style={{ fontSize: "26px" }} />
          </div>
          <div>
            <div className="font-venite text-[15px] text-white mb-1.5">{t("dashboardCommunity.emptyTitle")}</div>
            <p className="font-body-readable text-[13px] text-[#777] max-w-[460px]">
              {t("dashboardCommunity.emptyDesc")}
            </p>
          </div>
          <Link href={localePath("/dashboard/tracks", locale)} className="btn-primary inline-flex items-center gap-2" style={{ fontSize: "13px", padding: "12px 24px" }}>
            <iconify-icon icon="lucide:play" style={{ fontSize: "14px" }} />
            {t("dashboardCommunity.advanceTrack")}
          </Link>
        </div>
      )}
    </>
  );
}
