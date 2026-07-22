import Link from "next/link";
import { cookies } from "next/headers";
import { localePath } from "../lib/localeHelpers";
import { getServerLocale } from "../lib/serverLocale";
import { getLocale } from "../lib/i18n";
import { listPublishedProjects } from "../lib/userProjects";
import { createClient } from "../utils/supabase/server";

function formatDate(value: string | null | undefined, locale: string) {
  if (!value) return "";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "";
  const dateLocale = locale === "en" ? "en-US" : "fr-FR";
  return parsed.toLocaleDateString(dateLocale, { day: "2-digit", month: "2-digit", year: "numeric" });
}

export default async function ProjectsSection() {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);
  const locale = await getServerLocale();
  const { t } = getLocale(locale);
  const { projects } = await listPublishedProjects(supabase, 6);

  return (
    <section className="py-28" id="projets">
      <div className="max-w-[1320px] mx-auto px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between mb-5">
          <div>
            <div className="section-label mb-4">{t("projectsSection.sectionLabel")}</div>
            <h2
              className="font-valorax gradient-text"
              style={{ fontSize: "clamp(28px, 3vw, 46px)", letterSpacing: "-0.02em", maxWidth: "600px" }}
            >
              {t("projectsSection.title1")}
              <br />
              {t("projectsSection.title2")}
            </h2>
          </div>
          <Link href={localePath("/projects", locale)} id="projets-all-link" className="btn-secondary inline-flex items-center gap-2 self-start lg:self-auto">
            {t("projectsSection.viewAll")}
            <iconify-icon icon="lucide:arrow-right" style={{ fontSize: "14px" }} />
          </Link>
        </div>
        <p className="font-body-readable text-[#666] text-[14px] mb-14">{t("projectsSection.emptyLabel")}</p>

        {projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.slice(0, 6).map((project) => (
              <article key={project.id} className="bg-[#111] border border-white/[0.07] rounded-2xl p-5 card-hover">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl border border-blue-500/30 bg-blue-500/10 flex items-center justify-center">
                    <iconify-icon icon="lucide:folder" style={{ color: "#4F8EF7", fontSize: "18px" }} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10px] text-[#777] uppercase tracking-widest">{t("projectsSection.projectLabel")}</div>
                    <h3 className="font-venite-italic text-[14px] text-white leading-tight truncate">{project.title}</h3>
                  </div>
                  {project.hasDeclaredFirstEuro ? (
                    <span className="ml-auto inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-200 shrink-0">
                      <iconify-icon icon="lucide:badge-check" style={{ fontSize: "10px" }} />
                      {t("projectsSection.firstEuro")}
                    </span>
                  ) : null}
                </div>
                {project.objective ? (
                  <p className="font-body-readable text-[11px] text-[#a5a5a5] leading-relaxed mb-3 line-clamp-2">{project.objective}</p>
                ) : null}
                <div className="flex items-center gap-3 text-[10px] text-[#585858] font-body-readable">
                  {project.revenueModel ? <span>{t("projectsSection.revenueModel")} {project.revenueModel}</span> : null}
                  {project.publishedAt ? <span>{t("projectsSection.publishedOn")} {formatDate(project.publishedAt, locale)}</span> : null}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-white/[0.07] bg-[#111] p-10 flex flex-col items-center text-center gap-4">
            <div className="w-14 h-14 rounded-2xl border border-white/[0.08] bg-white/[0.02] flex items-center justify-center">
              <iconify-icon icon="lucide:rocket" className="text-[#4F8EF7]" style={{ fontSize: "26px" }} />
            </div>
            <div>
              <div className="font-venite text-[15px] text-white mb-1.5">{t("projectsSection.emptyTitle")}</div>
              <p className="font-body-readable text-[13px] text-[#777] max-w-[460px]">
                {t("projectsSection.emptyDesc")}
              </p>
            </div>
            <Link href={localePath("/projects", locale)} id="projets-start-link" className="btn-primary inline-flex items-center gap-2" style={{ fontSize: "13px", padding: "12px 24px" }}>
              <iconify-icon icon="lucide:play" style={{ fontSize: "14px" }} />
              {t("projectsSection.startProject")}
            </Link>
          </div>
        )}

        <div className="flex items-center justify-center mt-10">
          <Link href={localePath("/signup", locale)} id="projets-publish-link" className="btn-secondary flex items-center gap-2" style={{ fontSize: "13px", padding: "12px 24px" }}>
            <iconify-icon icon="lucide:upload" style={{ fontSize: "14px" }} />
            {t("projectsSection.joinAndPublish")}
          </Link>
        </div>
      </div>
    </section>
  );
}
