import { useEffect, useRef, useState } from "react";

export type AutosaveStatus = "idle" | "unsaved" | "saving" | "saved";

export function useAutosave(
  save: () => Promise<boolean>,
  deps: unknown[],
  delay = 3000
) {
  const [status, setStatus] = useState<AutosaveStatus>("idle");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    setStatus("unsaved");

    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(async () => {
      setStatus("saving");
      const ok = await save();
      if (mountedRef.current) {
        setStatus(ok ? "saved" : "unsaved");
      }
    }, delay);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, deps);

  function cancel() {
    if (timerRef.current) clearTimeout(timerRef.current);
    setStatus("idle");
  }

  function markSaved() {
    setStatus("saved");
  }

  return { status, cancel, markSaved };
}
