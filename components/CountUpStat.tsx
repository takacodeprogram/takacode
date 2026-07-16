"use client";

import { useEffect, useState } from "react";

interface Props {
  end: number;
  suffix?: string;
  duration?: number;
  className?: string;
}

function formatNumberWithSpaces(value: number): string {
  return String(value).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

export default function CountUpStat({ end, suffix = "", duration = 1400, className = "" }: Props) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let frameId: number;
    let startTime: number | undefined;

    const step = (timestamp: number) => {
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
