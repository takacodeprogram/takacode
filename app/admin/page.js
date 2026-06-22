import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AdminUsersManager from "../../components/AdminUsersManager";
import { getUserAccessContext } from "../../lib/auth";
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
              <Link href="/auth/signout" className="btn-secondary">
                Deconnexion
              </Link>
            </div>
          </div>
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
