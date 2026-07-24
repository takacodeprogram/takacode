import Link from "next/link";
import { cookies } from "next/headers";
import FooterSection from "../../components/FooterSection";
import Navbar from "../../components/Navbar";
import { listPublishedProjects } from "../../lib/userProjects";
import { localePath } from "../../lib/localeHelpers";
import { getServerLocale } from "../../lib/serverLocale";
import { getLocale } from "../../lib/i18n";
import { buildPageMetadata } from "../../lib/seo";
import { createClient } from "../../utils/supabase/server";
import type { Locale } from "../../lib/i18n";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata() {
  const locale = await getServerLocale();
  const { t } = getLocale(locale);
  return buildPageMetadata({
    title: t("projetsPage.title"),
    description: t("projetsPage.description"),
    path: "/projects",
    locale
  });
}

function getLevelChipClass(levelLabel: string) {
  const normalized = String(levelLabel || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  if (normalized.includes("debutant")) return "level-beginner";
  if (normalized.includes("inter")) return "level-intermediate";
  if (normalized.includes("expert")) return "level-expert";
  return "level-advanced";
}

function formatDate(value: string | null | undefined) {
  if (!value) return "";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "";
  return parsed.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" });
}

export default async function ProjetsPage() {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);
  const locale = await getServerLocale();
  const { t } = getLocale(locale);
  const { projects } = await listPublishedProjects(supabase, 50);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <Navbar />
      <main className="pt-[64px]">
        <section className="py-24 md:py-28 px-8">
          <div className="max-w-[1320px] mx-auto space-y-10">
            <div className="max-w-[930px]">
              <div className="section-label mb-4">{t("projetsPage.sectionLabel")}</div>
<h1 className="font-valorax gradient-text text-[clamp(34px,4vw,56px)] leading-[0.92]">
{t("projetsPage.title")}
</h1>
              <p className="font-body-readable text-[15px] text-[#8d8d8d] mt-4 leading-relaxed">
                {t("projetsPage.description")}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <article className="rounded-xl border border-white/[0.08] bg-[#111] px-4 py-4">
                <div className="text-[10px] text-[#666] uppercase tracking-widest mb-1">{t("projetsPage.stats.library.label")}</div>
                <div className="font-venite-italic text-[20px] text-white">{projects.length} {locale === "fr" ? "projets" : "projects"}</div>
                <p className="font-body-readable text-[11px] text-[#767676] mt-1">{t("projetsPage.stats.library.desc")}</p>
              </article>
              <article className="rounded-xl border border-white/[0.08] bg-[#111] px-4 py-4">
                <div className="text-[10px] text-[#666] uppercase tracking-widest mb-1">{t("projetsPage.stats.goal.label")}</div>
                <div className="font-venite-italic text-[20px] text-white">{t("projetsPage.stats.goal.value")}</div>
                <p className="font-body-readable text-[11px] text-[#767676] mt-1">{t("projetsPage.stats.goal.desc")}</p>
              </article>
              <article className="rounded-xl border border-white/[0.08] bg-[#111] px-4 py-4">
                <div className="text-[10px] text-[#666] uppercase tracking-widest mb-1">{t("projetsPage.stats.next.label")}</div>
                <div className="font-venite-italic text-[20px] text-white">{t("projetsPage.stats.next.value")}</div>
                <p className="font-body-readable text-[11px] text-[#767676] mt-1">{t("projetsPage.stats.next.desc")}</p>
              </article>
            </div>
          </div>
        </section>

        <section className="px-8 pb-24">
          <div className="max-w-[1320px] mx-auto">
            {projects.length ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  {projects.map((project) => (
                  <Link key={project.id} href={localePath(`/projects/${project.id}`, locale)} className="bg-[#111] border border-white/[0.07] rounded-2xl p-6 card-hover block">
                    <div className="flex items-center justify-between gap-3 flex-wrap mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl border border-blue-500/30 bg-blue-500/10 flex items-center justify-center">
                          <iconify-icon icon="lucide:folder" style={{ color: "#4F8EF7", fontSize: "20px" }} />
                        </div>
                        <div>
                          <div className="text-[10px] text-[#777] uppercase tracking-widest">{t("projetsPage.projectCard.label")}</div>
                          <h3 className="font-venite-italic text-[15px] text-white leading-tight">{project.title}</h3>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {project.hasDeclaredFirstEuro ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-200">
                            <iconify-icon icon="lucide:badge-check" style={{ fontSize: "10px" }} />
                            {locale === "fr" ? "1er euro" : "1st euro"}
                          </span>
                        ) : null}
                        <span className="level-beginner text-[10px] font-semibold px-2.5 py-1 rounded-full">{project.status}</span>
                      </div>
                    </div>

                    {project.objective ? (
                      <div className="mb-4">
                        <div className="text-[10px] text-[#666] uppercase tracking-widest mb-1">{t("projetsPage.projectCard.objective")}</div>
                        <p className="font-body-readable text-[12px] text-[#c9c9c9] leading-relaxed">{project.objective}</p>
                      </div>
                    ) : null}

                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-[#585858] font-body-readable">
                      {project.trackTitle ? <span>{t("projetsPage.projectCard.track")}: {project.trackTitle}</span> : null}
                      {project.deadline ? <span>{t("projetsPage.projectCard.deadline")}: {formatDate(project.deadline)}</span> : null}
                      {project.publishedAt ? <span>{t("projetsPage.projectCard.publishedOn")} {formatDate(project.publishedAt)}</span> : null}
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-white/[0.07] bg-[#111] p-16 text-center">
                <div className="w-14 h-14 rounded-2xl border border-white/[0.08] bg-white/[0.02] flex items-center justify-center mx-auto mb-4">
                  <iconify-icon icon="lucide:rocket" className="text-[#4F8EF7]" style={{ fontSize: "26px" }} />
                </div>
                <div className="font-venite text-[15px] text-white mb-1.5">{t("projetsPage.empty.title")}</div>
                <p className="font-body-readable text-[13px] text-[#777] max-w-[460px] mx-auto mb-6">
                  {t("projetsPage.empty.desc")}
                </p>
                <Link href={localePath("/signup", locale)} className="btn-primary inline-flex items-center gap-2" style={{ fontSize: "13px", padding: "12px 24px" }}>
                  <iconify-icon icon="lucide:plus" style={{ fontSize: "14px" }} />
                  {t("projetsPage.empty.cta")}
                </Link>
              </div>
            )}
          </div>
        </section>
      </main>
      <hr className="section-divider" />
      <FooterSection />
    </div>
  );
}
