"use client";

import { useEffect, useState } from "react";
import LoaderVisual from "./LoaderVisual";

export default function StartupLoader() {
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    const minDurationMs = 900;
    const startTime = Date.now();
    let timer: ReturnType<typeof setTimeout> | undefined;

    const hideLoader = () => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, minDurationMs - elapsed);
      timer = setTimeout(() => setIsHidden(true), remaining);
    };

    if (document.readyState === "complete") {
      hideLoader();
    } else {
      window.addEventListener("load", hideLoader, { once: true });
    }

    return () => {
      window.removeEventListener("load", hideLoader);
      if (timer) clearTimeout(timer);
    };
  }, []);

  return (
    <div className={`startup-loader${isHidden ? " hidden" : ""}`} aria-hidden={isHidden}>
      <LoaderVisual />
    </div>
  );
}
