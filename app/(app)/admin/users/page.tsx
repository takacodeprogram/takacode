import { cookies } from "next/headers";
import PageHeader from "../../../../components/app-shell/PageHeader";
import AdminUsersManager from "../../../../components/AdminUsersManager";
import { buildAuthUsersLookup, mergeProfilesWithAuthUsers } from "../../../../lib/adminUsers";
import { buildPageMetadata } from "../../../../lib/seo";
import { isMissingSchemaError } from "../../../../lib/utils";
import { createClient } from "../../../../utils/supabase/server";
import { getLocale } from "../../../../lib/i18n";
import { getServerLocale } from "../../../../lib/serverLocale";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const ADMIN_USERS_SELECT = "id, role, points, grade, referral_code, referred_by, created_at, updated_at";

export async function generateMetadata() {
  const locale = await getServerLocale();
  const { t } = getLocale(locale);
  return buildPageMetadata({ title: t("adminUsers.metaTitle"), description: t("adminUsers.metaDesc"), path: "/admin/users", noIndex: true });
}

function isMissingProfilesTableError(error: unknown) {
  return isMissingSchemaError(error, ["user_profiles"]);
}

export default async function AdminUsersPage() {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

  const locale = await getServerLocale();
  const { t } = getLocale(locale);

  const {
    data: { user: currentUser }
  } = await supabase.auth.getUser();

  const usersResult = await supabase
    .from("user_profiles")
    .select(ADMIN_USERS_SELECT)
    .order("points", { ascending: false })
    .limit(300);

  const schemaReady = !isMissingProfilesTableError(usersResult.error);
  const baseUsers = !schemaReady || usersResult.error ? [] : usersResult.data || [];
  const authUsersById = baseUsers.length ? await buildAuthUsersLookup() : {};
  const users = mergeProfilesWithAuthUsers(baseUsers, authUsersById);

  return (
    <>
      <PageHeader title={t("adminUsers.title")} subtitle={`${users.length} ${users.length > 1 ? "comptes" : "compte"}`} backHref="/admin" backLabel={t("admin.backAdmin")} />

      {!schemaReady ? (
        <div className="rounded-xl border border-amber-500/25 bg-amber-500/10 px-4 py-3 text-[12px] text-amber-100 font-body-readable">
          {t("adminUsers.tableMissing")}
        </div>
      ) : usersResult.error ? (
        <div className="rounded-xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-[12px] text-red-200 font-body-readable">
          {usersResult.error.message || t("adminUsers.loadError")}
        </div>
      ) : (
        <AdminUsersManager initialUsers={users} currentUserId={currentUser?.id || ""} />
      )}
    </>
  );
}
