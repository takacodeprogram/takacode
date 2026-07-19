"use client";

import { useRouter } from "next/navigation";
import { createClient } from "../utils/supabase/client";

interface SignOutButtonProps {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export default function SignOutButton({ className, style, children }: SignOutButtonProps) {
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/signin");
  }

  return (
    <button type="button" onClick={handleSignOut} className={className} style={style}>
      {children || "Se déconnecter"}
    </button>
  );
}
