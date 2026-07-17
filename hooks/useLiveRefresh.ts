"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

const INTERVAL_MS = 30_000;

export function useLiveRefresh() {
  const router = useRouter();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    function startPolling() {
      intervalRef.current = setInterval(() => {
        router.refresh();
      }, INTERVAL_MS);
    }

    function stopPolling() {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    if (document.visibilityState === "visible") {
      startPolling();
    }

    function onVisibilityChange() {
      if (document.visibilityState === "visible") {
        router.refresh();
        startPolling();
      } else {
        stopPolling();
      }
    }

    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      stopPolling();
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [router]);
}
