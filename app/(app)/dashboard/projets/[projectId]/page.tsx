import Link from "next/link";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import DeployGuide from "../../../../../components/DeployGuide";
import PageHeader from "../../../../../components/app-shell/PageHeader";
import ProjectForm from "../../../../../components/ProjectForm";
import { getTrackCurriculum } from "../../../../../lib/curriculum";
import { buildPageMetadata } from "../../../../../lib/seo";
import { getTemplateById } from "../../../../../lib/starterTemplates";
import { orderTracksByGuidance } from "../../../../../lib/trackGuidance";
import { listPublishedTracks } from "../../../../../lib/tracks";
import { getOwnProject, listProjectDeliverables } from "../../../../../lib/userProjects";
import { createClient } from "../../../../../utils/supabase/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = buildPageMetadata({
  title: "Mon projet",
  description: "Edite ton projet.",
  path: "/dashboard/projets",
  noIndex: true
});

function formatDate(value: string | null | undefined) {
  if (!value) return "";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "";
  return parsed.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" });
}

export default async function EditProjectPage({ params }: { params: Promise<Record<string, string>> }) {
  const resolvedParams = await Promise.resolve(params);
  const projectId = String(resolvedParams?.projectId || "").trim();

  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/signin?next=/dashboard/projets");
  }

  const [{ project }, { tracks }, deliverables] = await Promise.all([
    getOwnProject(supabase, user.id, projectId),
    listPublishedTracks(supabase, { limit: 40 }),
    listProjectDeliverables(supabase, user.id, projectId)
  ]);

  if (!project) {
    notFound();
  }

  const template = project.templateId ? getTemplateById(project.templateId) : null;

  // Parcours accelerateur lie au projet : sa progression vit ici.
  const linkedTrack = project.trackId ? tracks.find((t) => t.id === project.trackId) || null : null;
  const curriculum = project.trackId ? await getTrackCurriculum(supabase, project.trackId, user.id) : null;
  const linkedTrackSlug = linkedTrack?.slug || project.trackSlug || "";

  // Suggestions uniquement quand aucun parcours n'est lie : d'abord le domaine
  // du template, sinon l'ordre conseille du catalogue.
  let suggestedTracks: typeof tracks = [];
  if (!project.trackId) {
    if (template) {
      const domain = template.domain.toLowerCase();
      suggestedTracks = tracks
        .filter((t) => `${t.title} ${t.description || ""}`.toLowerCase().includes(domain))
        .slice(0, 4);
    }
    if (!suggestedTracks.length) {
      suggestedTracks = orderTracksByGuidance(tracks).slice(0, 3);
    }
  }

  return (
    <>
      <PageHeader title={project.title} subtitle="Editer mon projet" backHref="/dashboard/projets" backLabel="Mes projets" />
      <div className="grid xl:grid-cols-[1.4fr_0.9fr] gap-6">
        <div className="space-y-5">
          <ProjectForm userId={user.id} tracks={tracks} project={project} />

          {deliverables.length > 0 ? (
            <div className="rounded-2xl border border-white/[0.08] bg-[#111] p-5">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-9 h-9 rounded-xl border border-emerald-500/30 bg-emerald-500/10 inline-flex items-center justify-center">
                  <iconify-icon icon="lucide:package" style={{ color: "#6ee7b7", fontSize: "17px" }} />
                </div>
                <div>
                  <div className="font-venite text-[10px] tracking-widest text-[#888] uppercase">Livrables</div>
                  <h3 className="font-venite-italic text-[13px] text-white leading-tight">{deliverables.length} micro-projet{deliverables.length > 1 ? "s" : ""} realise{deliverables.length > 1 ? "s" : ""}</h3>
                </div>
              </div>
              <div className="space-y-2">
                {deliverables.map((d) => (
                  <Link
                    key={d.lessonId}
                    href={`/parcours/${d.trackSlug}/lecon/${d.lessonSlug}`}
                    className="flex items-center gap-2.5 rounded-xl border border-white/[0.06] bg-white/[0.01] px-3.5 py-2.5 hover:border-white/[0.15] transition-all"
                  >
                    <div className="w-7 h-7 rounded-lg border border-white/[0.06] bg-white/[0.02] flex items-center justify-center">
                      <iconify-icon icon="lucide:file-code" style={{ color: "#9b9b9b", fontSize: "13px" }} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-[12px] text-white font-semibold leading-tight truncate">{d.lessonTitle}</div>
                      <div className="text-[10px] text-[#888] font-body-readable">{d.trackTitle} · {formatDate(d.submittedAt)}</div>
                    </div>
                    <span className={`shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                      d.status === "completed" ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-200" :
                      d.reviewStatus === "changes_requested" ? "border-amber-500/30 bg-amber-500/10 text-amber-100" :
                      "border-blue-400/30 bg-blue-500/10 text-blue-200"
                    }`}>
                      {d.status === "completed" ? "Valide" : d.reviewStatus === "changes_requested" ? "A ameliorer" : "Soumis"}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        <div className="space-y-5">
          {project.trackId ? (
            <div className="rounded-2xl border border-[#4F8EF7]/25 bg-[#111] p-5">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-9 h-9 rounded-xl border border-[#4F8EF7]/40 bg-[#4F8EF7]/15 inline-flex items-center justify-center">
                  <iconify-icon icon="lucide:zap" style={{ color: "#4F8EF7", fontSize: "17px" }} />
                </div>
                <div className="min-w-0">
                  <div className="font-venite text-[10px] tracking-widest text-[#888] uppercase">Parcours accelerateur</div>
                  <h3 className="font-venite-italic text-[13px] text-white leading-tight truncate">
                    {linkedTrack?.title || project.trackTitle || "Parcours"}
                  </h3>
                </div>
                {curriculum?.hasCurriculum ? (
                  <span className="ml-auto shrink-0 text-[11px] text-[#89c7ff] font-semibold">{curriculum.progressPercent}%</span>
                ) : null}
              </div>

              {curriculum?.hasCurriculum ? (
                <div className="h-1.5 rounded bg-white/[0.06] overflow-hidden mb-3">
                  <div className="h-full rounded bg-gradient-to-r from-[#4F8EF7] to-[#9B6DFF]" style={{ width: `${curriculum.progressPercent}%` }} />
                </div>
              ) : null}

              <p className="font-body-readable text-[11px] text-[#a5b8d8] leading-relaxed mb-3">
                Chaque lecon validee fait avancer ce projet : les micro-projets du parcours sont
                tes livrables (listes ci-contre).
              </p>

              {curriculum?.nextLesson && linkedTrackSlug ? (
                <Link
                  href={`/parcours/${linkedTrackSlug}/lecon/${curriculum.nextLesson.lessonSlug}`}
                  className="btn-primary inline-flex items-center gap-2 text-[12px] w-full justify-center"
                  style={{ padding: "10px 14px" }}
                >
                  Continuer le sprint : {curriculum.nextLesson.title.length > 28 ? `${curriculum.nextLesson.title.slice(0, 28)}...` : curriculum.nextLesson.title}
                  <iconify-icon icon="lucide:arrow-right" style={{ fontSize: "13px" }} />
                </Link>
              ) : linkedTrackSlug ? (
                <Link
                  href={`/parcours/${linkedTrackSlug}`}
                  className="btn-secondary inline-flex items-center gap-2 text-[12px] w-full justify-center"
                  style={{ padding: "10px 14px" }}
                >
                  {curriculum?.hasCurriculum ? "Parcours termine — revoir le programme" : "Ouvrir le parcours"}
                  <iconify-icon icon="lucide:arrow-right" style={{ fontSize: "13px" }} />
                </Link>
              ) : null}
            </div>
          ) : null}

          <DeployGuide
            repoUrl={project.repoUrl}
            liveUrl={project.liveUrl}
            projectId={project.id}
            projectTitle={project.title}
          />

          {suggestedTracks.length > 0 ? (
            <div className="rounded-2xl border border-white/[0.08] bg-[#111] p-5">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-9 h-9 rounded-xl border border-[#F59E0B]/40 bg-[#F59E0B]/15 inline-flex items-center justify-center">
                  <iconify-icon icon="lucide:map" style={{ color: "#F59E0B", fontSize: "17px" }} />
                </div>
                <div>
                  <div className="font-venite text-[10px] tracking-widest text-[#888] uppercase">Choisis ton accelerateur</div>
                  <h3 className="font-venite-italic text-[13px] text-white leading-tight">
                    {template ? `Pour ton ${template.title}` : "Parcours conseilles pour ce projet"}
                  </h3>
                </div>
              </div>
              <p className="font-body-readable text-[11px] text-[#8d8d8d] leading-snug mb-3">
                Ce projet n'a pas encore de parcours accelerateur. Choisis-en un dans le champ
                "Parcours accelerateur" du formulaire : sa progression s'affichera ici.
              </p>
              <div className="space-y-2">
                {suggestedTracks.map((track) => (
                  <Link
                    key={track.id}
                    href={`/parcours/${track.slug}`}
                    className="flex items-center gap-2.5 rounded-xl border border-white/[0.06] bg-white/[0.01] px-3.5 py-2.5 hover:border-white/[0.15] transition-all"
                  >
                    <iconify-icon icon={track.icon} style={{ color: track.accentColor, fontSize: "15px" }} />
                    <div className="min-w-0">
                      <div className="text-[12px] text-white font-semibold leading-tight truncate">{track.title}</div>
                      <div className="text-[10px] text-[#888] font-body-readable truncate">{track.levelLabel}{track.durationWeeks ? ` · ${track.durationWeeks} sem` : ""}</div>
                    </div>
                    <iconify-icon icon="lucide:arrow-right" style={{ fontSize: "13px", color: "#666" }} className="ml-auto shrink-0" />
                  </Link>
                ))}
              </div>
              <Link href="/parcours" className="block text-center text-[11px] text-[#4F8EF7] hover:underline mt-3">
                Voir tous les parcours
              </Link>
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
}
