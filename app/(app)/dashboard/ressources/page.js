import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import PageHeader from "../../../../components/app-shell/PageHeader";
import { listUserResources } from "../../../../lib/memberSpace";
import { buildPageMetadata } from "../../../../lib/seo";
import { createClient } from "../../../../utils/supabase/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = buildPageMetadata({
  title: "Mes ressources",
  description: "Toutes les ressources selectionnees dans tes parcours, au meme endroit.",
  path: "/dashboard/ressources",
  noIndex: true
});

function resourceIcon(kind) {
  if (kind === "video") return "lucide:play-circle";
  if (kind === "tool") return "lucide:wrench";
  if (kind === "repo") return "lucide:github";
  return "lucide:file-text";
}

export default async function MyResourcesPage() {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/signin?next=/dashboard/ressources");
  }

  const { resources } = await listUserResources(supabase, user.id, { limit: 80 });

  return (
    <>
      <PageHeader
        title="MES RESSOURCES"
        subtitle={`${resources.length} ressource${resources.length > 1 ? "s" : ""} issue${resources.length > 1 ? "s" : ""} de tes parcours`}
      />

      {resources.length ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {resources.map((resource) => (
            <a
              key={resource.url}
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-xl border border-white/[0.08] bg-[#111] p-4 card-hover"
            >
              <div className="flex items-center gap-2.5 mb-1.5">
                <iconify-icon icon={resourceIcon(resource.kind)} style={{ fontSize: "14px", color: "#89c7ff" }} />
                <span className="font-body-readable text-[12px] text-white font-semibold leading-tight">{resource.label}</span>
                <iconify-icon icon="lucide:external-link" style={{ fontSize: "11px", color: "#666" }} />
              </div>
              {resource.why ? (
                <p className="font-body-readable text-[11px] text-[#9b9b9b] leading-snug mb-1.5">{resource.why}</p>
              ) : null}
              <div className="text-[10px] text-[#666] font-body-readable">
                {resource.trackTitle} · {resource.lessonTitle}
              </div>
            </a>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-white/[0.07] bg-[#111] p-10 flex flex-col items-center text-center gap-4">
          <div className="w-14 h-14 rounded-2xl border border-white/[0.08] bg-white/[0.02] flex items-center justify-center">
            <iconify-icon icon="lucide:book-open" className="text-[#4F8EF7]" style={{ fontSize: "26px" }} />
          </div>
          <div>
            <div className="font-venite text-[15px] text-white mb-1.5">PAS ENCORE DE RESSOURCES</div>
            <p className="font-body-readable text-[13px] text-[#777] max-w-[440px]">
              Inscris-toi a un parcours: toutes les ressources selectionnees de ses lecons apparaitront ici.
            </p>
          </div>
          <Link href="/dashboard/parcours" className="btn-primary inline-flex items-center gap-2" style={{ fontSize: "13px", padding: "12px 24px" }}>
            <iconify-icon icon="lucide:map" style={{ fontSize: "14px" }} />
            Voir mes parcours
          </Link>
        </div>
      )}
    </>
  );
}
