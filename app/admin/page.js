import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AdminUsersManager from "../../components/AdminUsersManager";
import { getUserAccessContext, isBootstrapAdminEmail } from "../../lib/auth";
import { createClient } from "../../utils/supabase/server";
import { buildPageMetadata } from "../../lib/seo";

export const metadata = buildPageMetadata({
  title: "Admin",
  description: "Espace administration TakaCode pour gerer roles, points, grades et referral.",
  path: "/admin",
  noIndex: true
});

function isMissingProfilesTableError(error) {
  const code = typeof error?.code === "string" ? error.code : "";
  const message = typeof error?.message === "string" ? error.message.toLowerCase() : "";

  return (
    code === "PGRST205" ||
    code === "42P01" ||
    message.includes("user_profiles") ||
    message.includes("schema cache")
  );
}

function resolveAppUrl() {
  const candidates = [
    process.env.NEXT_PUBLIC_APP_URL,
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${String(process.env.VERCEL_PROJECT_PRODUCTION_URL).replace(/^https?:\/\//i, "")}`
      : "",
    "https://takacode.vercel.app"
  ];

  for (const candidate of candidates) {
    const value = String(candidate || "").trim();
    if (!value) {
      continue;
    }

    if (/^https?:\/\//i.test(value)) {
      return value;
    }

    return `https://${value.replace(/^\/+/, "")}`;
  }

  return "https://takacode.vercel.app";
}

export default async function AdminPage() {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/signin?next=/admin");
  }

  const accessContext = await getUserAccessContext(supabase, user);

  if (!accessContext.hasRole(["admin"])) {
    redirect("/dashboard");
  }

  const { data: users, error } = await supabase
    .from("user_profiles")
    .select("id, role, points, grade, referral_code, referred_by, created_at, updated_at")
    .order("points", { ascending: false })
    .limit(250);

  const appUrl = resolveAppUrl();
  const currentAdminEmail = typeof user?.email === "string" ? user.email : "";
  const roleLabel = String(accessContext.role || "user").toLowerCase();
  const fromBootstrapList = isBootstrapAdminEmail(currentAdminEmail);
  const missingSchema = isMissingProfilesTableError(error);

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white px-6 py-20 md:py-24">
      <div className="w-full max-w-[1280px] mx-auto space-y-6">
        <section className="rounded-3xl border border-white/[0.08] bg-[#111] p-6 md:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="section-label mb-2">ADMINISTRATION</div>
              <h1 className="font-valorax text-[36px] leading-[0.9]">PILOTER TAKACODE</h1>
              <p className="font-body-readable text-[14px] text-[#888] mt-3 max-w-[780px]">
                Gere les roles, les points, les grades et le parrainage depuis cet espace.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Link href="/dashboard" className="btn-secondary">
                Retour dashboard
              </Link>
              <form action="/auth/signout" method="post">
                <button type="submit" className="btn-secondary">
                  Deconnexion
                </button>
              </form>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 xl:grid-cols-[1.15fr_0.85fr] gap-4">
          <article className="rounded-2xl border border-white/[0.08] bg-[#111] p-5 md:p-6">
            <div className="section-label mb-2">PITCH APP DEPLOYEE</div>
            <h2 className="font-valorax text-[26px] leading-[0.95]">PRESENTATION POWERPOINT</h2>
            <p className="font-body-readable text-[13px] text-[#8d8d8d] mt-3 max-w-[760px]">
              Deck de presentation genere au format .pptx avec direction visuelle TakaCode pour pitcher l'application deployee.
            </p>

            <div className="flex flex-wrap items-center gap-2.5 mt-5">
              <a href="/api/admin/pitch-deck" className="btn-primary">
                Telecharger le pitch (.pptx)
              </a>
              <a href={appUrl} target="_blank" rel="noreferrer" className="btn-secondary">
                Ouvrir l'app deployee
              </a>
            </div>

            <p className="font-body-readable text-[11px] text-[#666] mt-3">
              URL cible: <span className="text-[#8fd1ff]">{appUrl}</span>
            </p>
          </article>

          <article className="rounded-2xl border border-white/[0.08] bg-[#111] p-5 md:p-6">
            <div className="section-label mb-2">ACCES ADMIN</div>
            <h2 className="font-valorax text-[24px] leading-[0.95]">INFOS D'ACCES</h2>

            <div className="mt-4 space-y-2.5">
              <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] px-3.5 py-3 text-[12px] font-body-readable text-[#cfcfcf]">
                <span className="text-[#666]">URL admin:</span> /admin
              </div>
              <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] px-3.5 py-3 text-[12px] font-body-readable text-[#cfcfcf]">
                <span className="text-[#666]">Compte connecte:</span> {currentAdminEmail || "non disponible"}
              </div>
              <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] px-3.5 py-3 text-[12px] font-body-readable text-[#cfcfcf]">
                <span className="text-[#666]">Role detecte:</span> {roleLabel}
              </div>
            </div>

            <div
              className={`mt-3 rounded-xl px-3.5 py-3 text-[11px] font-body-readable border ${
                fromBootstrapList
                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-200"
                  : "border-blue-500/25 bg-blue-500/10 text-blue-100"
              }`}
            >
              {fromBootstrapList
                ? "Ce compte est configure dans TAKACODE_ADMIN_EMAILS."
                : "Ce compte est admin via user_profiles/app_metadata (pas via TAKACODE_ADMIN_EMAILS)."}
            </div>

            <p className="font-body-readable text-[11px] text-[#6f6f6f] mt-3">
              Pour ajouter un autre admin: execute `supabase/sql/002_bootstrap_admin.sql` en remplacant EMAIL_PLACEHOLDER.
            </p>
          </article>
        </section>

        {missingSchema ? (
          <section className="rounded-2xl border border-amber-500/25 bg-amber-500/10 p-5">
            <h2 className="font-valorax text-[24px] mb-2">CONFIGURATION BASE REQUISE</h2>
            <p className="text-[13px] text-amber-100/90 font-body-readable mb-3">
              La table <code>user_profiles</code> n'existe pas encore. Execute les scripts SQL pour activer le systeme
              roles/points/referral.
            </p>
            <p className="text-[12px] text-amber-100/80 font-body-readable">
              Fichiers: <code>supabase/sql/001_roles_points_referrals.sql</code> puis <code>supabase/sql/002_bootstrap_admin.sql</code>.
            </p>
          </section>
        ) : null}

        {!missingSchema && error ? (
          <section className="rounded-2xl border border-red-500/25 bg-red-500/10 p-5">
            <h2 className="font-valorax text-[24px] mb-2">ERREUR DE CHARGEMENT</h2>
            <p className="text-[13px] text-red-200 font-body-readable">{error.message}</p>
          </section>
        ) : null}

        {!missingSchema && !error ? <AdminUsersManager initialUsers={users || []} /> : null}
      </div>
    </main>
  );
}
