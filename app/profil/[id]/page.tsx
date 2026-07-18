import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import FooterSection from "../../../components/FooterSection";
import Navbar from "../../../components/Navbar";
import { buildPageMetadata } from "../../../lib/seo";
import { getPublicProfile } from "../../../lib/publicProfile";
import { createClient } from "../../../utils/supabase/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata({ params }: { params: Promise<Record<string, string>> }) {
  const { id } = await params;
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);
  const profile = await getPublicProfile(supabase, id);

  return buildPageMetadata({
    title: profile ? `Profil de ${profile.publicName}` : "Profil",
    description: profile?.bio ? profile.bio.substring(0, 150) : "Profil membre TakaCode",
    path: `/profil/${id}`
  });
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

function iconify(icon: string, size = "14px", color?: string) {
  return <iconify-icon icon={icon} style={{ fontSize: size, color }} />;
}

export default async function PublicProfilePage({ params }: { params: Promise<Record<string, string>> }) {
  const { id } = await params;
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);
  const profile = await getPublicProfile(supabase, id);

  if (!profile) notFound();

  const gradeColor = getGradeColor(profile.grade);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <Navbar />
      <main className="pt-[64px]">
        <section className="py-24 md:py-28 px-8">
          <div className="max-w-[800px] mx-auto">
            <div className="rounded-2xl border border-white/[0.08] bg-[#111] p-6 md:p-8">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-8">
                <div className="w-20 h-20 rounded-2xl border-2 border-white/[0.1] overflow-hidden shrink-0">
                  <img src={profile.avatarUrl} alt={profile.publicName} className="w-full h-full object-cover" />
                </div>
                <div className="text-center sm:text-left min-w-0">
                  <h1 className="font-valorax text-[clamp(22px,3vw,32px)] leading-[0.95] mb-1">{profile.publicName.toUpperCase()}</h1>
                  <div className="flex items-center justify-center sm:justify-start gap-3 flex-wrap">
                    <span
                      className="text-[11px] font-semibold px-2.5 py-1 rounded-full border"
                      style={{ borderColor: `${gradeColor}55`, background: `${gradeColor}1f`, color: gradeColor }}
                    >
                      {profile.grade}
                    </span>
                    {profile.countryCode ? (
                      <span className="text-[11px] text-[#888]">{profile.countryCode}</span>
                    ) : null}
                    <span className="text-[11px] text-[#666]">{profile.points} XP</span>
                  </div>
                </div>
              </div>

              {profile.bio ? (
                <div className="mb-6">
                  <div className="text-[10px] text-[#666] uppercase tracking-widest font-semibold mb-1.5">Bio</div>
                  <p className="font-body-readable text-[13px] text-[#b5b5b5] leading-relaxed">{profile.bio}</p>
                </div>
              ) : null}

              {profile.skills.length > 0 ? (
                <div className="mb-6">
                  <div className="text-[10px] text-[#666] uppercase tracking-widest font-semibold mb-2">Competences</div>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.map((skill) => (
                      <span key={skill} className="text-[11px] px-2.5 py-1 rounded-full border border-white/[0.08] bg-white/[0.02] text-[#aaa]">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}

              {Object.keys(profile.socials).length > 0 ? (
                <div className="mb-6">
                  <div className="text-[10px] text-[#666] uppercase tracking-widest font-semibold mb-2">Liens</div>
                  <div className="flex flex-wrap gap-3">
                    {Object.entries(profile.socials).map(([platform, url]) => (
                      <a key={platform} href={String(url)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-[12px] text-[#4F8EF7] hover:underline">
                        {iconify(`lucide:${platform === "github" ? "github" : platform === "twitter" ? "twitter" : "link"}`, "13px")}
                        {platform}
                      </a>
                    ))}
                  </div>
                </div>
              ) : null}

              <div className="pt-5 border-t border-white/[0.06]">
                <div className="text-[11px] text-[#555] font-body-readable">
                  Membre depuis {profile.memberSince ? new Date(profile.memberSince).toLocaleDateString("fr-FR", { year: "numeric", month: "long" }) : "inconnu"}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <hr className="section-divider" />
      <FooterSection />
    </div>
  );
}
