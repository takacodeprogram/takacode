import Link from "next/link";
import { cookies } from "next/headers";
import FooterSection from "../../../components/FooterSection";
import Navbar from "../../../components/Navbar";
import RichTextRenderer from "../../../components/RichTextRenderer";
import { buildPageMetadata } from "../../../lib/seo";
import { getPublicProfile, getUserPublishedProjects } from "../../../lib/publicProfile";
import { localePath } from "../../../lib/localeHelpers";
import { getServerLocale } from "../../../lib/serverLocale";
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
    path: `/profile/${id}`
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

function formatDate(value: string | null | undefined) {
  if (!value) return "";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "";
  return parsed.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" });
}

export default async function PublicProfilePage({ params }: { params: Promise<Record<string, string>> }) {
  const { id } = await params;
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);
  const profile = await getPublicProfile(supabase, id);

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-white">
        <Navbar />
        <main className="pt-[64px]">
          <section className="py-24 md:py-28 px-8">
            <div className="max-w-[800px] mx-auto text-center">
              <div className="section-label mb-4">PROFIL INTROUVABLE</div>
              <h1 className="font-valorax gradient-text text-[clamp(34px,4vw,56px)] leading-[0.92] mb-6">
                MEMBRE INCONNU
              </h1>
              <p className="font-body-readable text-[14px] text-[#888] mb-8">Ce profil n&apos;existe pas ou n&apos;est pas accessible.</p>
              <Link href="/community" className="btn-primary inline-flex items-center gap-2 text-[13px]" style={{ padding: "12px 24px" }}>
                <iconify-icon icon="lucide:arrow-left" style={{ fontSize: "14px" }} />
                Retour a la communauté
              </Link>
            </div>
          </section>
        </main>
        <hr className="section-divider" />
        <FooterSection />
      </div>
    );
  }

  const locale = await getServerLocale();
  const gradeColor = getGradeColor(profile.grade);
  const projects = await getUserPublishedProjects(supabase, id);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <Navbar />
      <main className="pt-[64px]">
        <section className="py-24 md:py-28 px-8">
          <div className="max-w-[800px] mx-auto">
            <div className="rounded-2xl border border-white/[0.08] bg-[#111] p-6 md:p-8 mb-6">
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
                    {projects.length > 0 ? (
                      <span className="text-[11px] text-[#666]">{projects.length} projet{projects.length > 1 ? "s" : ""} publie{projects.length > 1 ? "s" : ""}</span>
                    ) : null}
                  </div>
                </div>
              </div>

              {profile.bio ? (
                <div className="mb-6">
                  <div className="text-[10px] text-[#666] uppercase tracking-widest font-semibold mb-1.5">Bio</div>
                  <RichTextRenderer content={profile.bio} format={profile.bioFormat as "text" | "markdown" | "html"} />
                </div>
              ) : null}

              {profile.skills.length > 0 ? (
                <div className="mb-6">
                  <div className="text-[10px] text-[#666] uppercase tracking-widest font-semibold mb-2">Compétences</div>
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

            {projects.length > 0 ? (
              <div className="rounded-2xl border border-white/[0.08] bg-[#111] p-5 md:p-6">
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-9 h-9 rounded-xl border border-blue-500/30 bg-blue-500/10 inline-flex items-center justify-center">
                    <iconify-icon icon="lucide:folder" style={{ color: "#4F8EF7", fontSize: "17px" }} />
                  </div>
                  <div>
                    <div className="font-venite text-[10px] tracking-widest text-[#888] uppercase">Projets publies</div>
                    <h3 className="font-venite-italic text-[13px] text-white leading-tight">{projects.length} projet{projects.length > 1 ? "s" : ""}</h3>
                  </div>
                </div>
                <div className="space-y-3">
                  {projects.map((p) => (
                    <Link
                      key={p.id}
                      href={localePath(`/projects/${p.id}`, locale)}
                      className="flex items-start gap-3 rounded-xl border border-white/[0.06] bg-white/[0.01] px-3.5 py-3 hover:border-white/[0.15] transition-all"
                    >
                      <div className="w-8 h-8 rounded-lg border border-white/[0.06] bg-white/[0.02] flex items-center justify-center shrink-0">
                        <iconify-icon icon="lucide:file-code" style={{ color: "#9b9b9b", fontSize: "14px" }} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[13px] text-white font-semibold leading-tight">{p.title}</span>
                          {p.hasDeclaredFirstEuro ? (
                            <span className="inline-flex items-center gap-1 text-[9px] font-semibold px-1.5 py-0.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-200">
                              <iconify-icon icon="lucide:badge-check" style={{ fontSize: "9px" }} />
                              1er euro
                            </span>
                          ) : null}
                        </div>
                        {p.objective ? (
                          <p className="text-[11px] text-[#999] font-body-readable mt-0.5 line-clamp-2">{p.objective}</p>
                        ) : null}
                        <div className="flex items-center gap-3 mt-1.5 text-[10px] text-[#666] font-body-readable">
                          {p.revenueModel ? <span>{p.revenueModel}</span> : null}
                          {p.likeCount > 0 ? (
                            <span className="inline-flex items-center gap-1">
                              <iconify-icon icon="lucide:heart" style={{ fontSize: "10px" }} />
                              {p.likeCount}
                            </span>
                          ) : null}
                          <span>Publie le {formatDate(p.createdAt)}</span>
                        </div>
                      </div>
                      <iconify-icon icon="lucide:arrow-right" style={{ fontSize: "14px", color: "#555" }} className="shrink-0 mt-1.5" />
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </section>
      </main>
      <hr className="section-divider" />
      <FooterSection />
    </div>
  );
}
