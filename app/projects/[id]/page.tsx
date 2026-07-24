import Link from "next/link";
import { cookies } from "next/headers";
import FooterSection from "../../../components/FooterSection";
import LikeButton from "../../../components/LikeButton";
import Navbar from "../../../components/Navbar";
import RichTextRenderer from "../../../components/RichTextRenderer";
import { getPublicProject } from "../../../lib/getPublicProject";
import { localePath } from "../../../lib/localeHelpers";
import { getServerLocale } from "../../../lib/serverLocale";
import { buildPageMetadata } from "../../../lib/seo";
import { getProjectLikeCount, getUserLikedProjects, getVisitorLikedProjects } from "../../../lib/projectLikes";
import { getTemplateById } from "../../../lib/starterTemplates";
import { createClient } from "../../../utils/supabase/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata({ params }: { params: Promise<Record<string, string>> }) {
  const { id } = await params;
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);
  const project = await getPublicProject(supabase, id);

  if (!project) {
    return buildPageMetadata({ title: "Projet introuvable", path: "/projects" });
  }

  return buildPageMetadata({
    title: `${project.title} — Projet TakaCode`,
    description: project.description?.substring(0, 150) || `Projet ${project.title} realise par ${project.author}`,
    path: `/projects/${id}`
  });
}

function formatDate(value: string | null | undefined) {
  if (!value) return "";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "";
  return parsed.toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" });
}

function getGradeColor(grade: string): string {
  const map: Record<string, string> = {
    Starter: "#888",
    "Starter+": "#4F8EF7",
    Builder: "#9B6DFF",
    Master: "#F59E0B",
    Legend: "#EF4444"
  };
  return map[grade] || "#888";
}

export default async function PublicProjectPage({ params }: { params: Promise<Record<string, string>> }) {
  const { id } = await params;
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);
  const project = await getPublicProject(supabase, id);

  if (!project) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-white">
        <Navbar />
        <main className="pt-[64px]">
          <section className="py-24 md:py-28 px-8">
            <div className="max-w-[930px] mx-auto text-center">
              <div className="section-label mb-4">PROJET INTROUVABLE</div>
              <h1 className="font-valorax gradient-text text-[clamp(34px,4vw,56px)] leading-[0.92] mb-6">
                PROJET NON TROUVE
              </h1>
              <p className="font-body-readable text-[14px] text-[#888] mb-8">Ce projet n&apos;existe pas ou n&apos;a pas été publie.</p>
              <Link href="/projects" className="btn-primary inline-flex items-center gap-2 text-[13px]" style={{ padding: "12px 24px" }}>
                <iconify-icon icon="lucide:arrow-left" style={{ fontSize: "14px" }} />
                Retour aux projets
              </Link>
            </div>
          </section>
        </main>
        <hr className="section-divider" />
        <FooterSection />
      </div>
    );
  }

  const {
    data: { user }
  } = await supabase.auth.getUser();

  const locale = await getServerLocale();

  const visitorId = cookieStore.get("tk_visitor")?.value;

  const [likeCount, userLikedProjects, visitorLikedProjects] = await Promise.all([
    getProjectLikeCount(supabase, id),
    user ? getUserLikedProjects(supabase, user.id) : Promise.resolve([] as string[]),
    visitorId && !user ? getVisitorLikedProjects(supabase, visitorId) : Promise.resolve([] as string[])
  ]);

  const likedByVisitor = visitorId && !user ? visitorLikedProjects.includes(id) : false;

  const template = project.templateId ? getTemplateById(project.templateId) : null;
  const gradeColor = getGradeColor(project.authorGrade);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <Navbar />
      <main className="pt-[64px]">
        <section className="py-24 md:py-28 px-8">
          <div className="max-w-[930px] mx-auto">
            <Link href={localePath("/projects", locale)} className="inline-flex items-center gap-1.5 text-[12px] text-[#666] hover:text-white transition-colors mb-6">
              <iconify-icon icon="lucide:arrow-left" style={{ fontSize: "13px" }} />
              Retour aux projets
            </Link>

            <div className="rounded-2xl border border-white/[0.08] bg-[#111] p-6 md:p-8 mb-6">
              <div className="flex items-start justify-between gap-4 mb-6">
                <div className="min-w-0">
                  <div className="text-[10px] text-[#666] uppercase tracking-widest font-semibold mb-1">Projet</div>
                  <h1 className="font-valorax text-[clamp(26px,4vw,42px)] leading-[0.92] mb-2">{project.title}</h1>
                  <div className="flex flex-wrap items-center gap-2">
                    {project.hasDeclaredFirstEuro ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-200">
                        <iconify-icon icon="lucide:badge-check" style={{ fontSize: "10px" }} />
                        1er euro
                      </span>
                    ) : null}
                    {project.revenueModel ? (
                      <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-200/80">
                        {project.revenueModel}
                      </span>
                    ) : null}
                    {template ? (
                      <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full border border-blue-500/20 bg-blue-500/10 text-blue-200/80">
                        {template.title}
                      </span>
                    ) : null}
                  </div>
                </div>
                <LikeButton
                  projectId={id}
                  initialCount={likeCount}
                  initialLiked={user ? userLikedProjects.includes(id) : likedByVisitor}
                  userId={user?.id}
                />
              </div>

              {project.objective ? (
                <div className="mb-5">
                  <div className="text-[10px] text-[#666] uppercase tracking-widest font-semibold mb-1">Objectif</div>
                  <p className="font-body-readable text-[14px] text-[#c9c9c9] leading-relaxed">{project.objective}</p>
                </div>
              ) : null}

              {project.description ? (
                <div className="mb-5">
                  <div className="text-[10px] text-[#666] uppercase tracking-widest font-semibold mb-1">Description</div>
                  <RichTextRenderer content={project.description} format={project.descriptionFormat as "text" | "markdown" | "html"} />
                </div>
              ) : null}

              <div className="flex flex-wrap items-center gap-3 mb-6">
                {project.liveUrl ? (
                  <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="btn-primary inline-flex items-center gap-2 text-[12px]" style={{ padding: "10px 18px" }}>
                    <iconify-icon icon="lucide:external-link" style={{ fontSize: "13px" }} />
                    Voir le projet en ligne
                  </a>
                ) : null}
                {project.repoUrl && project.repoIsPublic ? (
                  <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary inline-flex items-center gap-2 text-[12px]" style={{ padding: "10px 18px" }}>
                    <iconify-icon icon="lucide:code-2" style={{ fontSize: "13px" }} />
                    Code source
                  </a>
                ) : null}
              </div>

              <div className="flex flex-wrap items-center gap-4 text-[11px] text-[#585858] font-body-readable pt-5 border-t border-white/[0.06]">
                {project.track ? <span>Parcours: {project.track}</span> : null}
                {project.deadline ? <span>Deadline: {formatDate(project.deadline)}</span> : null}
                <span>Publie le {formatDate(project.createdAt)}</span>
              </div>
            </div>

            <div className="rounded-2xl border border-white/[0.08] bg-[#111] p-5 md:p-6">
              <div className="text-[10px] text-[#666] uppercase tracking-widest font-semibold mb-3">Réalise par</div>
              <Link href={localePath(`/profile/${project.authorId}`, locale)} className="flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-xl border-2 border-white/[0.1] overflow-hidden shrink-0">
                  <img src={project.avatarUrl} alt={project.author} className="w-full h-full object-cover" />
                </div>
                <div className="min-w-0">
                  <div className="font-venite-italic text-[15px] text-white group-hover:text-[#4F8EF7] transition-colors">{project.author}</div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full border" style={{ borderColor: `${gradeColor}55`, background: `${gradeColor}1f`, color: gradeColor }}>
                      {project.authorGrade}
                    </span>
                    {project.track ? <span className="text-[11px] text-[#666]">{project.track}</span> : null}
                  </div>
                </div>
                <iconify-icon icon="lucide:arrow-right" style={{ fontSize: "16px", color: "#555" }} className="ml-auto shrink-0 group-hover:text-[#4F8EF7] transition-colors" />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <hr className="section-divider" />
      <FooterSection />
    </div>
  );
}
