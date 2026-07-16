import Link from "next/link";
import PageHeader from "../../../../components/app-shell/PageHeader";
import PublicTour from "../../../../components/public-tour/PublicTour";
import { TOUR_STEPS } from "../../../../components/app-shell/tourSteps";
import { buildPageMetadata } from "../../../../lib/seo";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = buildPageMetadata({
  title: "Guide de demarrage",
  description: "Découvre les sections de ton espace TakaCode.",
  path: "/dashboard/guide",
  noIndex: true
});

const LINKS: Record<string, string> = {
  dashboard: "/dashboard",
  parcours: "/dashboard/parcours",
  projets: "/dashboard/projets",
  reviews: "/dashboard/reviews",
  ressources: "/dashboard/ressources",
  sessions: "/dashboard/sessions",
  communaute: "/dashboard/communaute",
  outils: "/dashboard/outils",
  profil: "/dashboard/profil"
};

export default function GuidePage() {
  const steps = TOUR_STEPS.filter((step) => !step.center);

  return (
    <>
      <PageHeader title="GUIDE DE DEMARRAGE" subtitle="Les sections de ton espace" />

      <div className="rounded-xl border border-blue-500/20 bg-blue-500/[0.06] px-4 py-3 text-[12px] text-blue-100/90 font-body-readable mb-5">
        Bienvenue ! Voici un tour rapide de ton espace. Clique sur une section pour t'y rendre.
      </div>

      <div className="space-y-3">
        {steps.map((step, index) => {
          const href = LINKS[step.id];
          const card = (
            <div className="flex items-start gap-3.5 rounded-2xl border border-white/[0.08] bg-[#111] p-4 card-hover">
              <div className="w-10 h-10 rounded-xl bg-blue-500/15 flex items-center justify-center shrink-0">
                <iconify-icon icon={step.icon} style={{ fontSize: "18px", color: "#4F8EF7" }} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-[#4F8EF7] font-semibold">{index + 1}</span>
                  <div className="text-[14px] text-white font-semibold leading-tight">{step.title}</div>
                  {step.live ? <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" /> : null}
                </div>
                <p className="font-body-readable text-[12px] text-[#a5a5a5] leading-relaxed mt-1">{step.body}</p>
              </div>
              {href ? <iconify-icon icon="lucide:arrow-right" style={{ fontSize: "15px", color: "#666" }} /> : null}
            </div>
          );

          return href ? (
            <Link key={step.id} href={href} className="block">
              {card}
            </Link>
          ) : (
            <div key={step.id}>{card}</div>
          );
        })}
      </div>

      <div className="mt-6">
        <Link href="/dashboard" className="btn-primary inline-flex items-center gap-2 text-[12px]" style={{ padding: "10px 18px" }}>
          <iconify-icon icon="lucide:rocket" style={{ fontSize: "14px" }} />
          Commencer a construire
        </Link>
      </div>

      <PublicTour />
    </>
  );
}
