"use client";

import { useEffect, useRef, useState } from "react";
import Confetti from "./Confetti";
import ShareButtons from "./ShareButtons";
import { isMuted, playFail, playSuccess, setMuted } from "./sound";

interface Props {
  open?: boolean;
  variant?: "success" | "fail";
  title?: string;
  message?: string;
  xp?: number;
  ctaLabel?: string;
  onCta?: () => void;
  onClose?: () => void;
  shareText?: string;
  shareUrl?: string;
}

export default function CelebrationOverlay({
  open = false,
  variant = "success",
  title = "",
  message = "",
  xp = 0,
  ctaLabel = "",
  onCta,
  onClose,
  shareText = "",
  shareUrl = ""
}: Props) {
  const [confettiKey, setConfettiKey] = useState(0);
  const [muted, setMutedState] = useState(false);
  const wasOpen = useRef(false);

  useEffect(() => {
    setMutedState(isMuted());
  }, []);

  useEffect(() => {
    if (open && !wasOpen.current) {
      wasOpen.current = true;
      if (variant === "success") {
        setConfettiKey((key) => key + 1);
        playSuccess();
      } else {
        playFail();
      }
    }
    if (!open) {
      wasOpen.current = false;
    }
  }, [open, variant]);

  if (!open) {
    return null;
  }

  const isSuccess = variant === "success";

  function toggleMute() {
    const next = !muted;
    setMuted(next);
    setMutedState(next);
  }

  return (
    <>
      {isSuccess ? <Confetti fireKey={confettiKey} /> : null}

      <div
        className="fixed inset-0 z-[55] flex items-center justify-center p-5"
        style={{ background: "rgba(0,0,0,0.62)", backdropFilter: "blur(4px)" }}
        role="dialog"
        aria-modal="true"
        onClick={onClose}
      >
        <div
          className="celebrate-pop relative w-full max-w-[400px] rounded-2xl border border-white/[0.1] bg-[#111] p-7 text-center"
          style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }}
          onClick={(event: React.MouseEvent) => event.stopPropagation()}
        >
          <button
            type="button"
            onClick={toggleMute}
            className="absolute top-3 right-3 text-[#666] hover:text-white transition-colors p-1"
            aria-label={muted ? "Activer le son" : "Couper le son"}
            title={muted ? "Activer le son" : "Couper le son"}
          >
            <iconify-icon icon={muted ? "lucide:volume-x" : "lucide:volume-2"} style={{ fontSize: "16px" }} />
          </button>

          <div
            className={`${isSuccess ? "celebrate-badge" : "celebrate-shake"} mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border`}
            style={
              isSuccess
                ? { borderColor: "rgba(52,211,153,0.4)", background: "rgba(52,211,153,0.12)" }
                : { borderColor: "rgba(245,158,11,0.4)", background: "rgba(245,158,11,0.12)" }
            }
          >
            <iconify-icon
              icon={isSuccess ? "lucide:party-popper" : "lucide:rotate-ccw"}
              style={{ fontSize: "30px", color: isSuccess ? "#34D399" : "#F59E0B" }}
            />
          </div>

          <h2 className="font-valorax text-[22px] leading-tight mb-2">{title}</h2>
          {message ? <p className="font-body-readable text-[13px] text-[#a5a5a5] leading-relaxed mb-4">{message}</p> : null}

          {isSuccess && xp > 0 ? (
            <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-400/30 bg-blue-500/10 px-3.5 py-1.5 text-[12px] font-semibold text-[#89c7ff] mb-5">
              <iconify-icon icon="lucide:zap" style={{ fontSize: "13px" }} />
              +{xp} XP
            </div>
          ) : null}

          {isSuccess && shareText ? (
            <div className="mb-5">
              <div className="text-[10px] text-[#777] uppercase tracking-widest mb-2">Partage ta victoire</div>
              <ShareButtons text={shareText} url={shareUrl} />
            </div>
          ) : null}

          <div className="flex items-center justify-center gap-2.5 flex-wrap">
            {ctaLabel ? (
              <button
                type="button"
                onClick={onCta}
                className="btn-primary inline-flex items-center gap-2 text-[12px]"
                style={{ padding: "10px 20px" }}
              >
                {ctaLabel}
                <iconify-icon icon="lucide:arrow-right" style={{ fontSize: "13px" }} />
              </button>
            ) : null}
            <button type="button" onClick={onClose} className="text-[12px] text-[#888] hover:text-white px-3 py-2">
              Fermer
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
