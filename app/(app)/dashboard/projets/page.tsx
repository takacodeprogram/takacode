import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import PageHeader from "../../../../components/app-shell/PageHeader";
import { listUserProjects } from "../../../../lib/memberSpace";
import { buildPageMetadata } from "../../../../lib/seo";
import { listOwnProjects, statusLabel } from "../../../../lib/userProjects";
import { createClient } from "../../../../utils/supabase/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = buildPageMetadata({
  title: "Mes projets",
  description: "Les projets que tu construis et tes micro-projets soumis.",
  path: "/dashboard/projets",
  noIndex: true
});

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

export default async function MyProjectsPage() {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/signin?next=/dashboard/projets");
  }

  const [ownResult, microResult] = await Promise.all([
    listOwnProjects(supabase, user.id),
    listUserProjects(supabase, user.id, { limit: 50 })
  ]);

  const projects = ownResult.projects;
  const micros = microResult.projects;

  return (
    <>
      <PageHeader
        title="MES PROJETS"
        subtitle={`${projects.length} projet${projects.length > 1 ? "s" : ""}`}
        actions={
          <Link href="/dashboard/projets/nouveau" className="btn-primary inline-flex items-center gap-2 text-[12px]">
            <iconify-icon icon="lucide:plus" style={{ fontSize: "13px" }} />
            Nouveau projet
          </Link>
        }
      />

      {!ownResult.schemaReady ? (
        <div className="rounded-xl border border-amber-500/25 bg-amber-500/10 px-4 py-3 text-[12px] text-amber-100 font-body-readable mb-6">
          Table projets absente. Lance supabase/sql/008_user_projects.sql pour activer la creation de projets.
        </div>
      ) : null}

      {projects.length ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
          {projects.map((project) => (
            <Link
              key={project.id}
              href={`/dashboard/projets/${project.id}`}
              className="rounded-2xl border border-white/[0.08] bg-[#111] p-5 card-hover block"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="text-[14px] text-white font-semibold leading-tight">{project.title}</div>
                <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border shrink-0 ${statusChipClass(project.status)}`}>
                  {statusLabel(project.status)}
                </span>
              </div>
              {project.objective ? <p className="font-body-readable text-[12px] text-[#a5a5a5] leading-snug mb-2">{project.objective}</p> : null}
              <div className="flex items-center gap-3 text-[10px] text-[#666] font-body-readable">
                {project.trackTitle ? <span>{project.trackTitle}</span> : null}
                {project.deadline ? <span>Deadline {formatDate(project.deadline)}</span> : null}
              </div>
            </Link>
          ))}
        </div>
      ) : ownResult.schemaReady ? (
        <div className="rounded-2xl border border-white/[0.07] bg-[#111] p-10 flex flex-col items-center text-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-2xl border border-white/[0.08] bg-white/[0.02] flex items-center justify-center">
            <iconify-icon icon="lucide:rocket" className="text-[#4F8EF7]" style={{ fontSize: "26px" }} />
          </div>
          <div>
            <div className="font-venite text-[15px] text-white mb-1.5">CREE TON PREMIER PROJET</div>
            <p className="font-body-readable text-[13px] text-[#777] max-w-[440px]">
              Definis le projet que tu veux construire: titre, objectif, deadline. Il te servira de fil rouge pendant tes parcours.
            </p>
          </div>
          <Link href="/dashboard/projets/nouveau" className="btn-primary inline-flex items-center gap-2" style={{ fontSize: "13px", padding: "12px 24px" }}>
            <iconify-icon icon="lucide:plus" style={{ fontSize: "14px" }} />
            Nouveau projet
          </Link>
        </div>
      ) : null}

      {micros.length ? (
        <section>
          <h2 className="font-venite text-[13px] tracking-widest text-[#888] mb-3">MICRO-PROJETS REALISES</h2>
          <div className="space-y-2.5">
            {micros.map((project) => (
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
                    {project.status === "completed" ? "Valide" : "En cours"}
                  </span>
                </div>
                {project.trackSlug && project.lessonSlug ? (
                  <Link href={`/parcours/${project.trackSlug}/lecon/${project.lessonSlug}`} className="text-[11px] text-[#4F8EF7] hover:underline inline-flex items-center gap-1 mt-2">
                    Revoir la lecon
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
