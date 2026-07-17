import { useEffect, useRef } from "react";

const TRACKED_KEY = "tk_session_tracked";

export function useSessionTracker() {
  const calledRef = useRef(false);

  useEffect(() => {
    if (calledRef.current) return;
    try {
      if (localStorage.getItem(TRACKED_KEY)) return;
    } catch {
      return;
    }

    calledRef.current = true;

    fetch("/api/auth/track-session", { method: "POST" })
      .then((res) => {
        if (res.ok) {
          try { localStorage.setItem(TRACKED_KEY, "1"); } catch {}
        }
      })
      .catch(() => {});
  }, []);
}