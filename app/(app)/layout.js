import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AppShell from "../../components/app-shell/AppShell";
import { resolveAvatarUrl } from "../../lib/avatar";
import { getUserAccessContext } from "../../lib/auth";
import { formatDisplayName } from "../../lib/displayName";
import { createClient } from "../../utils/supabase/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AppLayout({ children }) {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/signin?next=/dashboard");
  }

  const accessContext = await getUserAccessContext(supabase, user);

  // Requete gardee: si la colonne avatar_url n'existe pas encore (012), pas de crash.
  const { data: avatarRow } = await supabase.from("user_profiles").select("avatar_url").eq("id", user.id).maybeSingle();
  const googleAvatar = typeof user.user_metadata?.avatar_url === "string" ? user.user_metadata.avatar_url : "";
  const avatarUrl = resolveAvatarUrl(avatarRow?.avatar_url, googleAvatar);

  return (
    <AppShell
      user={{
        email: user.email ?? "",
        displayName: formatDisplayName(user),
        role: accessContext.role,
        avatarUrl
      }}
    >
      {children}
    </AppShell>
  );
}
