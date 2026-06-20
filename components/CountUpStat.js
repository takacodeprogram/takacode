"use client";

import { useEffect, useState } from "react";

function formatNumberWithSpaces(value) {
  return String(value).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

export default function CountUpStat({ end, suffix = "", duration = 1400, className = "" }) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let frameId;
    let startTime;

    const step = (timestamp) => {
      if (startTime === undefined) {
        startTime = timestamp;
      }

      const progress = Math.min((timestamp - startTime) / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const nextValue = Math.round(end * easedProgress);

      setValue(nextValue);

      if (progress < 1) {
        frameId = requestAnimationFrame(step);
      }
    };

    frameId = requestAnimationFrame(step);

    return () => {
      if (frameId) {
        cancelAnimationFrame(frameId);
      }
    };
  }, [duration, end]);

  return (
    <div className={className}>
      <span className="font-venite-italic">{formatNumberWithSpaces(value)}</span>
      {suffix ? <span className="font-body-readable not-italic">{suffix}</span> : null}
    </div>
  );
}