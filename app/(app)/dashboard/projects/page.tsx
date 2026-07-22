import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import PageHeader from "../../../../components/app-shell/PageHeader";
import Pagination from "../../../../components/Pagination";
import { listUserProjects } from "../../../../lib/memberSpace";
import { getLocale } from "../../../../lib/i18n";
import { buildPageMetadata } from "../../../../lib/seo";
import { localePath } from "../../../../lib/localeHelpers";
import { getServerLocale } from "../../../../lib/serverLocale";
import { listOwnProjects, statusLabel } from "../../../../lib/userProjects";
import { getTemplateById } from "../../../../lib/starterTemplates";
import { createClient } from "../../../../utils/supabase/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata() {
  const localeServer = await getServerLocale();
  const { t } = getLocale(localeServer);
  return buildPageMetadata({
    title: t("dashboardProjects.title"),
    description: t("dashboardProjects.emptyDesc"),
    path: "/dashboard/projects",
    noIndex: true
  });
}

function formatDate(value: string | null | undefined) {
  if (!value) return "";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "";
  return parsed.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" });
}

function statusChipClass(status: string) {
  if (status === "published") return "border-emerald-500/30 bg-emerald-500/10 text-emerald-200";
  if (status === "archived") return "border-white/[0.12] bg-white/[0.03] text-[#888]";
  if (status === "idea") return "border-violet-500/30 bg-violet-500/10 text-violet-200";
  return "border-blue-400/35 bg-blue-500/15 text-blue-200";
}

const PER_PAGE = 12;

export default async function MyProjectsPage(props: { searchParams: Promise<{ page?: string }> }) {
  const searchParams = await props.searchParams;
  const currentPage = Math.max(1, parseInt(searchParams.page || "1", 10) || 1);
  const offset = (currentPage - 1) * PER_PAGE;

  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/signin?next=/dashboard/projects");
  }

  const locale = await getServerLocale();
  const { t } = getLocale(locale);

  const [ownResult, microResult] = await Promise.all([
    listOwnProjects(supabase, user.id, { limit: PER_PAGE + 1, offset }),
    listUserProjects(supabase, user.id, { limit: 50 })
  ]);

  const rawProjects = ownResult.projects.filter((p) => p.status === "published");
  const hasNextPage = rawProjects.length > PER_PAGE;
  const projects = hasNextPage ? rawProjects.slice(0, PER_PAGE) : rawProjects;

  return (
    <>
      <PageHeader
        title={t("dashboardProjects.title")}
        subtitle={`${projects.length} projet${projects.length > 1 ? "s" : ""}`}
        actions={
          <Link href={localePath("/dashboard/projects/new", locale)} className="btn-primary inline-flex items-center gap-2 text-[12px]">
            <iconify-icon icon="lucide:plus" style={{ fontSize: "13px" }} />
            {t("dashboardProjects.newProject")}
          </Link>
        }
      />

      {!ownResult.schemaReady ? (
        <div className="rounded-xl border border-amber-500/25 bg-amber-500/10 px-4 py-3 text-[12px] text-amber-100 font-body-readable mb-6">
          {t("dashboardProjects.schemaNotReady")}
        </div>
      ) : null}

      {projects.length ? (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
            {projects.map((project) => {
              const template = project.templateId ? getTemplateById(project.templateId) : null;
              const revenueLabels: Record<string, string> = {};
              return (
                <Link
                  key={project.id}
                  href={localePath(`/dashboard/projects/${project.id}`, locale)}
                  className="rounded-2xl border border-white/[0.08] bg-[#111] p-5 card-hover block"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="text-[14px] text-white font-semibold leading-tight flex items-center gap-2">
                      {project.title}
                      {project.hasDeclaredFirstEuro ? (
                        <span className="inline-flex items-center gap-1 text-[9px] font-semibold px-1.5 py-0.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-200">
                          <iconify-icon icon="lucide:badge-check" style={{ fontSize: "9px" }} />
                          {t("dashboardProjects.firstEuro")}
                        </span>
                      ) : null}
                    </div>
                    <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border shrink-0 ${statusChipClass(project.status)}`}>
                      {statusLabel(project.status)}
                    </span>
                  </div>
                  {project.objective ? <p className="font-body-readable text-[12px] text-[#a5a5a5] leading-snug mb-2">{project.objective}</p> : null}
                  <div className="flex items-center gap-2 flex-wrap text-[10px] text-[#666] font-body-readable">
                    {project.revenueModel ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border border-emerald-500/20 bg-emerald-500/8 text-emerald-200/80">
                        {revenueLabels[project.revenueModel] || project.revenueModel}
                      </span>
                    ) : null}
                    {template ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border border-blue-400/20 bg-blue-500/8 text-blue-200/80">
                        {template.title}
                      </span>
                    ) : null}
                    {project.trackTitle ? <span>{project.trackTitle}</span> : null}
                    {project.deadline ? <span>{t("dashboardProjects.deadline")} {formatDate(project.deadline)}</span> : null}
                  </div>
                </Link>
              );
            })}
          </div>
          {projects.length > 0 ? <Pagination currentPage={currentPage} hasNextPage={hasNextPage} baseUrl="/dashboard/projects" /> : null}
        </>
      ) : ownResult.schemaReady ? (
        <div className="rounded-2xl border border-white/[0.07] bg-[#111] p-10 flex flex-col items-center text-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-2xl border border-white/[0.08] bg-white/[0.02] flex items-center justify-center">
            <iconify-icon icon="lucide:rocket" className="text-[#4F8EF7]" style={{ fontSize: "26px" }} />
          </div>
          <div>
            <div className="font-venite text-[15px] text-white mb-1.5">{t("dashboardProjects.emptyTitle")}</div>
            <p className="font-body-readable text-[13px] text-[#777] max-w-[440px]">
              {t("dashboardProjects.emptyDesc")}
            </p>
          </div>
          <Link href={localePath("/dashboard/projects/new", locale)} className="btn-primary inline-flex items-center gap-2" style={{ fontSize: "13px", padding: "12px 24px" }}>
            <iconify-icon icon="lucide:plus" style={{ fontSize: "14px" }} />
            {t("dashboardProjects.newProject")}
          </Link>
        </div>
      ) : null}

      {microResult.projects.length ? (
        <section>
          <h2 className="font-venite text-[13px] tracking-widest text-[#888] mb-3">{t("dashboardProjects.microProjects")}</h2>
          <div className="space-y-2.5">
            {microResult.projects.map((project) => (
              <article key={project.lessonId} className="rounded-xl border border-white/[0.08] bg-[#111] p-4">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div className="min-w-0">
                    <div className="text-[12px] text-white font-semibold leading-tight">{project.lessonTitle}</div>
                    <div className="text-[11px] text-[#7a7a7a] font-body-readable">
                      {project.trackTitle}
                      {project.submittedAt ? ` · ${formatDate(project.submittedAt)}` : ""}
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border shrink-0 ${
                      project.status === "completed"
                        ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-200"
                        : "border-blue-400/35 bg-blue-500/15 text-blue-200"
                    }`}
                  >
                    {project.status === "completed" ? t("dashboardProjects.completed") : t("dashboardProjects.inProgress")}
                  </span>
                </div>
                {project.trackSlug && project.lessonSlug ? (
                  <Link href={localePath(`/tracks/${project.trackSlug}/lesson/${project.lessonSlug}`, locale)} className="text-[11px] text-[#4F8EF7] hover:underline inline-flex items-center gap-1 mt-2">
                    {t("dashboardProjects.reviewLesson")}
                    <iconify-icon icon="lucide:arrow-right" style={{ fontSize: "11px" }} />
                  </Link>
                ) : null}
              </article>
            ))}
          </div>
        </section>
      ) : null}
    </>
  );
}
