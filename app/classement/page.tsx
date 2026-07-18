import Link from "next/link";
import { cookies } from "next/headers";
import FooterSection from "../../components/FooterSection";
import Navbar from "../../components/Navbar";
import { getInitials } from "../../lib/avatar";
import { getPublicLeaderboard, getCountryFlag } from "../../lib/leaderboard";
import { buildPageMetadata } from "../../lib/seo";
import { createClient } from "../../utils/supabase/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = buildPageMetadata({
  title: "Classement",
  description: "Le classement public des membres TakaCode : les plus actifs et leurs grades.",
  path: "/classement"
});

const MEDALS = ["#F5C542", "#C0C7D0", "#CD8B4A"];

function Avatar({ url, name, size = 40 }: { url: string; name: string; size?: number }) {
  if (url) {
    return <img src={url} alt="" className="rounded-full border border-white/10 object-cover bg-white/[0.03]" style={{ width: size, height: size }} />;
  }
  return (
    <div
      className="rounded-full border border-white/10 bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center font-semibold text-white"
      style={{ width: size, height: size, fontSize: size * 0.32 }}
    >
      {getInitials(name)}
    </div>
  );
}

export default async function LeaderboardPage() {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);
  const { entries, schemaReady } = await getPublicLeaderboard(supabase, 50);

  const podium = entries.slice(0, 3);
  const rest = entries.slice(3);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <Navbar />
      <main className="pt-[64px]">
        <section className="py-24 md:py-28 px-8">
          <div className="max-w-[900px] mx-auto">
            <div className="text-center mb-12">
              <div className="section-label mb-3">CLASSEMENT</div>
              <h1 className="font-valorax gradient-text" style={{ fontSize: "clamp(32px, 4vw, 52px)", letterSpacing: "-0.02em" }}>
                LES MEMBRES LES PLUS ACTIFS
              </h1>
              <p className="font-body-readable text-[14px] text-[#888] mt-3">Gagne des points en validant tes lecons et micro-projets.</p>
            </div>

            {!schemaReady ? (
              <div className="rounded-xl border border-amber-500/25 bg-amber-500/10 px-4 py-3 text-[12px] text-amber-100 font-body-readable text-center">
                Classement bientot disponible (execute supabase/sql/012_profile_public.sql).
              </div>
            ) : entries.length === 0 ? (
              <div className="rounded-2xl border border-white/[0.07] bg-[#111] p-10 text-center font-body-readable text-[13px] text-[#777]">
                Le classement se remplit des les premiers points gagnes. Sois le premier !
              </div>
            ) : (
              <>
                    {podium.length ? (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                    {podium.map((entry, index) => (
                      <Link
                        key={entry.rank}
                        href={`/profil/${entry.id}`}
                        className={`rounded-2xl border bg-[#111] p-5 text-center card-hover block ${index === 0 ? "border-[#F5C542]/40 sm:-mt-2" : "border-white/[0.08]"}`}
                      >
                        <div className="flex justify-center mb-3 relative">
                          <Avatar url={entry.avatarUrl} name={entry.publicName} size={index === 0 ? 64 : 54} />
                          <span
                            className="absolute -bottom-1 h-6 w-6 rounded-full flex items-center justify-center text-[11px] font-bold text-black"
                            style={{ background: MEDALS[index] || "#888" }}
                          >
                            {entry.rank}
                          </span>
                        </div>
                        <div className="text-[13px] text-white font-semibold truncate">
                          {getCountryFlag(entry.countryCode) ? <span className="mr-1.5">{getCountryFlag(entry.countryCode)}</span> : null}
                          {entry.publicName}
                        </div>
                        <div className="text-[11px] text-[#89c7ff]">{entry.grade}</div>
                        <div className="text-[15px] font-bold mt-1">{entry.points} <span className="text-[10px] text-[#888] font-normal">XP</span></div>
                      </Link>
                    ))}
                  </div>
                ) : null}

                {rest.length ? (
                  <div className="rounded-2xl border border-white/[0.08] bg-[#111] divide-y divide-white/[0.05]">
                    {rest.map((entry) => (
                      <Link key={entry.rank} href={`/profil/${entry.id}`} className="flex items-center gap-3 px-4 py-3 hover:bg-white/[0.02] transition-colors">
                        <span className="w-7 text-center text-[12px] text-[#888] font-semibold">{entry.rank}</span>
                        <Avatar url={entry.avatarUrl} name={entry.publicName} size={36} />
                        <div className="flex-1 min-w-0">
                          <div className="text-[13px] text-white font-semibold truncate">
                            {getCountryFlag(entry.countryCode) ? <span className="mr-1.5">{getCountryFlag(entry.countryCode)}</span> : null}
                            {entry.publicName}
                          </div>
                          <div className="text-[10px] text-[#777]">{entry.grade}</div>
                        </div>
                        <div className="text-[13px] text-[#6ec3ff] font-semibold shrink-0">{entry.points} XP</div>
                      </Link>
                    ))}
                  </div>
                ) : null}
              </>
            )}
          </div>
        </section>
      </main>
      <hr className="section-divider" />
      <FooterSection />
    </div>
  );
}
