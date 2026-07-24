import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { redirectLocale } from "../../../../lib/redirectLocale";
import { getUserAccessContext } from "../../../../lib/auth";
import { createClient } from "../../../../utils/supabase/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// Réservé aux mentors (et admins).
export default async function MentorLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    await redirectLocale("/signin?next=/dashboard/mentor");
  }

  const accessContext = await getUserAccessContext(supabase, user);
  if (!["mentor", "admin"].includes(accessContext.role)) {
    await redirectLocale("/dashboard");
  }

  return children;
}
