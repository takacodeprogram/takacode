import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AccountSecurity from "../../../../components/AccountSecurity";
import PageHeader from "../../../../components/app-shell/PageHeader";
import ProfileEditor from "../../../../components/ProfileEditor";
import GradeProgress from "../../../../components/GradeProgress";
import ReferralLink from "../../../../components/ReferralLink";
import ShareButtons from "../../../../components/effects/ShareButtons";
import { resolveAvatarUrl } from "../../../../lib/avatar";
import { getUserAccessContext } from "../../../../lib/auth";
import { formatDisplayName } from "../../../../lib/displayName";
import { getLocale } from "../../../../lib/i18n";
import { buildPageMetadata } from "../../../../lib/seo";
import { getServerLocale } from "../../../../lib/serverLocale";
import { DEFAULT_LOCALE } from "../../../../lib/i18n";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "../../../../utils/supabase/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata() {
  const localeServer = await getServerLocale();
  const { t } = getLocale(localeServer);
  return buildPageMetadata({
    title: t("dashboardProfile.title"),
    description: t("dashboardProfile.title"),
    path: "/dashboard/profile",
    noIndex: true
  });
}

async function getProfileFields(supabase: SupabaseClient, userId: string) {
  const { data, error } = await supabase
    .from("user_profiles")
    .select("bio, bio_format, socials, skills, avatar_url, public_name, country_code")
    .eq("id", userId)
    .maybeSingle();

  if (error || !data) {
    return { bio: "", bioFormat: "text", socials: {}, skills: [], avatarUrl: "", publicName: "", countryCode: "" };
  }

  return {
    bio: typeof data.bio === "string" ? data.bio : "",
    bioFormat: typeof data.bio_format === "string" ? data.bio_format : "text",
    socials: data.socials && typeof data.socials === "object" ? data.socials : {},
    skills: Array.isArray(data.skills) ? data.skills : [],
    avatarUrl: typeof data.avatar_url === "string" ? data.avatar_url : "",
    publicName: typeof data.public_name === "string" ? data.public_name : "",
    countryCode: typeof data.country_code === "string" ? data.country_code : ""
  };
}

export default async function ProfilePage() {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    const l = await getServerLocale();
    const p = l === DEFAULT_LOCALE ? "" : `/${l}`;
    redirect(`${p}/signin?next=${p}/dashboard/profile`);
  }

  const locale = await getServerLocale();
  const { t } = getLocale(locale);
  const accessContext = await getUserAccessContext(supabase, user);
  const displayName = formatDisplayName(user);
  const email = user.email ?? "";
  const points = Number.isFinite(Number(accessContext.profile?.points)) ? Number(accessContext.profile!.points) : 0;
  const grade = accessContext.profile?.grade || "Starter";
  const roleLabel = (accessContext.role || "user").toUpperCase();
  const referralCode = typeof accessContext.profile?.referral_code === "string"
    ? accessContext.profile!.referral_code.trim().toUpperCase()
    : "";

  const profileFields = await getProfileFields(supabase, user.id);
  const googleAvatar = typeof user.user_metadata?.avatar_url === "string" ? user.user_metadata.avatar_url : "";
  const avatarUrl = resolveAvatarUrl(profileFields.avatarUrl, googleAvatar);
  const lastSignInAt = typeof user.last_sign_in_at === "string" ? user.last_sign_in_at : null;

  return (
    <>
      <PageHeader title={t("dashboardProfile.title")} subtitle={displayName} />

      <div className="grid xl:grid-cols-[0.9fr_1.1fr] gap-6">
        <section className="space-y-4">
          <article className="rounded-2xl border border-white/[0.08] bg-[#111] p-5">
            <div className="flex items-center gap-4 mb-4">
              {avatarUrl ? (
                <img src={avatarUrl} alt="" className="w-14 h-14 rounded-full border border-white/10 object-cover" />
              ) : (
                <div className="w-14 h-14 rounded-full border border-white/10 bg-gradient-to-br from-blue-400 to-cyan-500" />
              )}
              <div className="min-w-0">
                <div className="text-[15px] text-white font-semibold leading-tight">{displayName}</div>
                <div className="text-[11px] text-[#777] font-body-readable">{email}</div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="rounded-lg border border-white/[0.08] bg-white/[0.02] px-2.5 py-2">
                <div className="text-[9px] text-[#666] uppercase tracking-widest">{t("dashboardProfile.points")}</div>
                <div className="text-[13px] text-white font-semibold">{points}</div>
              </div>
              <div className="rounded-lg border border-white/[0.08] bg-white/[0.02] px-2.5 py-2">
                <div className="text-[9px] text-[#666] uppercase tracking-widest">{t("dashboardProfile.grade")}</div>
                <div className="text-[13px] text-white font-semibold">{grade}</div>
              </div>
              <div className="rounded-lg border border-white/[0.08] bg-white/[0.02] px-2.5 py-2">
                <div className="text-[9px] text-[#666] uppercase tracking-widest">{t("dashboardProfile.role")}</div>
                <div className="text-[13px] text-white font-semibold">{roleLabel}</div>
              </div>
            </div>
          </article>

          <GradeProgress points={points} />

          <div className="rounded-2xl border border-white/[0.08] bg-[#111] p-4">
            <div className="text-[10px] text-[#777] uppercase tracking-widest mb-2">{t("dashboardProfile.shareProgress")}</div>
            <ShareButtons text={t("dashboardProfile.shareText").replace("{grade}", grade).replace("{points}", String(points))} />
          </div>

          {referralCode ? <ReferralLink code={referralCode} /> : null}

          <AccountSecurity userId={user.id} lastSignInAt={lastSignInAt} />
        </section>

        <div className="space-y-4">
          <ProfileEditor
            initialBio={profileFields.bio}
            initialBioFormat={profileFields.bioFormat}
            initialSocials={profileFields.socials}
            initialSkills={profileFields.skills}
            initialAvatarUrl={profileFields.avatarUrl}
            initialPublicName={profileFields.publicName}
            initialCountryCode={profileFields.countryCode}
            realName={displayName}
            seedBase={profileFields.publicName || displayName}
          />
        </div>
      </div>
    </>
  );
}
