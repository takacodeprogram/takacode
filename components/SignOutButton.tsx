"use client";

import { useRouter } from "next/navigation";
import { createClient } from "../utils/supabase/client";
import { useI18n } from "./I18nProvider";

interface SignOutButtonProps {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export default function SignOutButton({ className, style, children }: SignOutButtonProps) {
  const { t } = useI18n();
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/signin");
  }

  return (
    <button type="button" onClick={handleSignOut} className={className} style={style}>
      {children || t("navbar.seDeconnecter")}
    </button>
  );
}
