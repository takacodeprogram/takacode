import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import PageHeader from "../../../../components/app-shell/PageHeader";
import { listUserProjects } from "../../../../lib/memberSpace";
import { buildPageMetadata } from "../../../../lib/seo";
import { createClient } from "../../../../utils/supabase/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = buildPageMetadata({
  title: "Mes projets",
  description: "Les micro-projets que tu as soumis dans tes parcours.",
  path: "/dashboard/projets",
  noIndex: true
});

function formatDate(value) {
  if (!value) {
    return "";
  }
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return "";
  }
  return parsed.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" });
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

  const { projects } = await listUserProjects(supabase, user.id, { limit: 50 });
  const completed = projects.filter((entry) => entry.status === "completed").length;

  return (
    <>
      <PageHeader
        title="MES PROJETS"
        subtitle={`${projects.length} micro-projet${projects.length > 1 ? "s" : ""} soumis · ${completed} valide${completed > 1 ? "s" : ""}`}
      />

      {projects.length ? (
        <div className="space-y-3">
          {projects.map((project) => (
            <article key={project.lessonId} className="rounded-2xl border border-white/[0.08] bg-[#111] p-5">
              <div className="flex items-start justify-between gap-3 flex-wrap mb-2">
                <div className="min-w-0">
                  <div className="text-[13px] text-white font-semibold leading-tight">{project.lessonTitle}</div>
                  <div className="text-[11px] text-[#7a7a7a] font-body-readable">
                    {project.trackTitle}
                    {project.submittedAt ? ` · soumis le ${formatDate(project.submittedAt)}` : ""}
                  </div>
                </div>
                <span
                  className={[
                    "text-[10px] font-semibold px-2.5 py-1 rounded-full border shrink-0",
                    project.status === "completed"
                      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-200"
                      : "border-blue-400/35 bg-blue-500/15 text-blue-200"
                  ].join(" ")}
                >
                  {project.status === "completed" ? "Valide" : "En cours"}
                </span>
              </div>

              {project.submission ? (
                <p className="font-body-readable text-[12px] text-[#a5a5a5] leading-relaxed line-clamp-3 mb-3 whitespace-pre-wrap">
                  {project.submission.length > 320 ? `${project.submission.slice(0, 320)}...` : project.submission}
                </p>
              ) : null}

              {project.trackSlug && project.lessonSlug ? (
                <Link
                  href={`/parcours/${project.trackSlug}/lecon/${project.lessonSlug}`}
                  className="text-[11px] text-[#4F8EF7] hover:underline inline-flex items-center gap-1"
                >
                  Revoir la lecon
                  <iconify-icon icon="lucide:arrow-right" style={{ fontSize: "11px" }} />
                </Link>
              ) : null}
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-white/[0.07] bg-[#111] p-10 flex flex-col items-center text-center gap-4">
          <div className="w-14 h-14 rounded-2xl border border-white/[0.08] bg-white/[0.02] flex items-center justify-center">
            <iconify-icon icon="lucide:folder-code" className="text-[#4F8EF7]" style={{ fontSize: "26px" }} />
          </div>
          <div>
            <div className="font-venite text-[15px] text-white mb-1.5">AUCUN PROJET SOUMIS</div>
            <p className="font-body-readable text-[13px] text-[#777] max-w-[440px]">
              Realise le micro-projet d'une lecon pour le retrouver ici, avec son statut de validation.
            </p>
          </div>
          <Link href="/dashboard/parcours" className="btn-primary inline-flex items-center gap-2" style={{ fontSize: "13px", padding: "12px 24px" }}>
            <iconify-icon icon="lucide:play" style={{ fontSize: "14px" }} />
            Continuer un parcours
          </Link>
        </div>
      )}
    </>
  );
}
