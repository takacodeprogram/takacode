import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AppShell from "../../components/app-shell/AppShell";
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

  return (
    <AppShell
      user={{
        email: user.email ?? "",
        displayName: formatDisplayName(user),
        role: accessContext.role
      }}
    >
      {children}
    </AppShell>
  );
}
