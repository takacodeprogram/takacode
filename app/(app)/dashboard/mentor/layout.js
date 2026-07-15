import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getUserAccessContext } from "../../../../lib/auth";
import { createClient } from "../../../../utils/supabase/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// Reserve aux mentors (et admins).
export default async function MentorLayout({ children }) {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/signin?next=/dashboard/mentor");
  }

  const accessContext = await getUserAccessContext(supabase, user);
  if (!["mentor", "admin"].includes(accessContext.role)) {
    redirect("/dashboard");
  }

  return children;
}
