import Link from "next/link";
import { cookies } from "next/headers";
import Navbar from "../../components/Navbar";
import FooterSection from "../../components/FooterSection";
import { buildPageMetadata } from "../../lib/seo";
import { createClient } from "../../utils/supabase/server";
import CommunityContent from "../../components/CommunityContent";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = buildPageMetadata({
  title: "Communaute",
  description: "La communauté TakaCode: membres actifs, projets publiés et sessions live à venir.",
  path: "/communaute"
});

export default async function CommunautePage() {
  let user = null;

  try {
    const cookieStore = await cookies();
    const supabase = await createClient(cookieStore);
    const { data: { user: u } } = await supabase.auth.getUser();
    user = u;
  } catch {
    return <GuestCTA />;
  }

  if (!user) return <GuestCTA />;

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <Navbar />
      <CommunityContent />
      <hr className="section-divider" />
      <FooterSection />
    </div>
  );
}

function GuestCTA() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <Navbar />
      <main className="pt-[64px]">
        <section className="py-24 md:py-28 px-8">
          <div className="max-w-[600px] mx-auto text-center">
            <div className="w-16 h-16 rounded-2xl border border-white/[0.08] bg-white/[0.02] flex items-center justify-center mx-auto mb-6">
              <iconify-icon icon="lucide:users" className="text-[#4F8EF7]" style={{ fontSize: "30px" }} />
            </div>
            <div className="section-label mb-3">COMMUNAUTE</div>
            <h1 className="font-valorax gradient-text" style={{ fontSize: "clamp(32px, 4vw, 52px)", letterSpacing: "-0.02em" }}>
              REJOINS LA COMMUNAUTE
            </h1>
            <p className="font-body-readable text-[14px] text-[#888] mt-3 mb-8 leading-relaxed">
              Connecte-toi ou crée un compte pour découvrir les projets, le classement et les prochaines sessions live.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/signin" className="btn-primary inline-flex items-center gap-2" style={{ fontSize: "13px", padding: "12px 24px" }}>
                <iconify-icon icon="lucide:log-in" style={{ fontSize: "14px" }} />
                Se connecter
              </Link>
              <Link href="/signup" className="btn-secondary inline-flex items-center gap-2" style={{ fontSize: "13px", padding: "12px 24px" }}>
                <iconify-icon icon="lucide:user-plus" style={{ fontSize: "14px" }} />
                Créer un compte
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
