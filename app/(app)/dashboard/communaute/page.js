import Link from "next/link";
import PageHeader from "../../../../components/app-shell/PageHeader";
import { buildPageMetadata } from "../../../../lib/seo";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = buildPageMetadata({
  title: "Communaute",
  description: "Le fil de la communaute TakaCode: projets publies, entraide et partages.",
  path: "/dashboard/communaute",
  noIndex: true
});

export default function CommunityFeedPage() {
  return (
    <>
      <PageHeader title="COMMUNAUTE" subtitle="Le fil des membres" />

      <div className="rounded-2xl border border-white/[0.07] bg-[#111] p-10 flex flex-col items-center text-center gap-4">
        <div className="w-14 h-14 rounded-2xl border border-white/[0.08] bg-white/[0.02] flex items-center justify-center">
          <iconify-icon icon="lucide:users" className="text-[#4F8EF7]" style={{ fontSize: "26px" }} />
        </div>
        <div>
          <div className="font-venite text-[15px] text-white mb-1.5">LE FIL DEMARRE BIENTOT</div>
          <p className="font-body-readable text-[13px] text-[#777] max-w-[460px]">
            Le fil de la communaute affichera les projets publies par les membres, avec likes, commentaires et entraide.
            Termine un parcours et publie ton projet pour l'alimenter.
          </p>
        </div>
        <Link href="/dashboard/parcours" className="btn-primary inline-flex items-center gap-2" style={{ fontSize: "13px", padding: "12px 24px" }}>
          <iconify-icon icon="lucide:play" style={{ fontSize: "14px" }} />
          Avancer sur un parcours
        </Link>
      </div>
    </>
  );
}
