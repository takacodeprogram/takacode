import Link from "next/link";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import DeployGuide from "../../../../../components/DeployGuide";
import PageHeader from "../../../../../components/app-shell/PageHeader";
import ProjectForm from "../../../../../components/ProjectForm";
import { buildPageMetadata } from "../../../../../lib/seo";
import { getTemplateById } from "../../../../../lib/starterTemplates";
import { listPublishedTracks } from "../../../../../lib/tracks";
import { getOwnProject } from "../../../../../lib/userProjects";
import { createClient } from "../../../../../utils/supabase/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = buildPageMetadata({
  title: "Mon projet",
  description: "Edite ton projet.",
  path: "/dashboard/projets",
  noIndex: true
});

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

  const [{ project }, { tracks }] = await Promise.all([
    getOwnProject(supabase, user.id, projectId),
    listPublishedTracks(supabase, { limit: 40 })
  ]);

  if (!project) {
    notFound();
  }

  const template = project.templateId ? getTemplateById(project.templateId) : null;

  const domainRevenueMap: Record<string, string[]> = {
    Web: ["vente", "abonnement", "publicite", "affiliation"],
    Mobile: ["vente", "abonnement", "publicite"],
    Data: ["freelance", "abonnement"],
    IA: ["abonnement", "freelance", "vente"]
  };

  const suggestedDomains = template
    ? [template.domain]
    : (domainRevenueMap[project.revenueModel] ? ["Web", "Data"] : []);

  const suggestedTracks = suggestedDomains.length
    ? tracks.filter((t) => {
        const trackDomain = (String((t as Record<string, unknown>).description || "") + String((t as Record<string, unknown>).title || "")).toLowerCase();
        return suggestedDomains.some((d) => trackDomain.includes(d.toLowerCase()));
      }).slice(0, 4)
    : [];

  return (
    <>
      <PageHeader title={project.title} subtitle="Editer mon projet" backHref="/dashboard/projets" backLabel="Mes projets" />
      <div className="grid xl:grid-cols-[1.4fr_0.9fr] gap-6">
        <ProjectForm userId={user.id} tracks={tracks} project={project} />
        <div className="space-y-5">
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
                  <div className="font-venite text-[10px] tracking-widest text-[#888] uppercase">Parcours suggeres</div>
                  <h3 className="font-venite-italic text-[13px] text-white leading-tight">
                    {template ? `Pour ton ${template.title}` : "Pour ton modele de revenu"}
                  </h3>
                </div>
              </div>
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
                      <div className="text-[10px] text-[#888] font-body-readable truncate">{track.lessonCount} lecons</div>
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
