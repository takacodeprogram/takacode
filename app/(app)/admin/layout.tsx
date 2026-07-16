import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getUserAccessContext } from "../../../lib/auth";
import { createClient } from "../../../utils/supabase/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// Garde de role: tout /admin/* exige le role admin.
export default async function AdminLayout({ children }) {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/signin?next=/admin");
  }

  const accessContext = await getUserAccessContext(supabase, user);

  if (accessContext.role !== "admin") {
    redirect("/dashboard");
  }

  return children;
}
