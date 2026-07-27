"use client";

import { useEffect, useState } from "react";
import { createClient } from "../utils/supabase/client";
import GlobalAssistant from "./GlobalAssistant";

// Client mount pour l'assistant IA global.
// On sonde la session côté client (le layout est cache par Next et changerait
// tout le rendu SSR pour un simple check auth). Une fois la session confirmée,
// le widget flottant apparaît sur toutes les pages.

interface Props {
  initialAuthenticated: boolean;
}

export default function GlobalAssistantMount({ initialAuthenticated }: Props) {
  const [authenticated, setAuthenticated] = useState<boolean>(initialAuthenticated);

  useEffect(() => {
    let mounted = true;
    const supabase = createClient();
    supabase.auth.getSession().then(({ data }) => {
      if (mounted) setAuthenticated(Boolean(data.session?.user));
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (mounted) setAuthenticated(Boolean(session?.user));
    });
    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  if (!authenticated) return null;
  return <GlobalAssistant />;
}
