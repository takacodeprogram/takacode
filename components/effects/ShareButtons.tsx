"use client";

import { useState } from "react";
import { useI18n } from "../I18nProvider";

interface ShareTarget {
  key: string;
  label: string;
  icon: string;
  href: string;
}

interface Props {
  text?: string;
  url?: string;
  compact?: boolean;
}

export default function ShareButtons({ text = "", url = "", compact = false }: Props) {
  const { t } = useI18n();
  const [copied, setCopied] = useState(false);

  const shareUrl = url || (typeof window !== "undefined" ? window.location.origin : "https://takacode.vercel.app");
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedText = encodeURIComponent(text);

  const targets: ShareTarget[] = [
    { key: "x", label: "X", icon: "lucide:twitter", href: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}` },
    { key: "linkedin", label: "LinkedIn", icon: "lucide:linkedin", href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}` },
    { key: "facebook", label: "Facebook", icon: "lucide:facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}` }
  ];

  function openShare(href: string) {
    if (typeof window !== "undefined") {
      window.open(href, "_blank", "noopener,noreferrer,width=600,height=520");
    }
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(`${text ? text + " " : ""}${shareUrl}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // ignore
    }
  }

  return (
    <div className="flex items-center justify-center gap-2 flex-wrap">
      {targets.map((target) => (
        <button
          key={target.key}
          type="button"
          onClick={() => openShare(target.href)}
          className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.1] bg-white/[0.03] hover:bg-white/[0.07] transition-colors px-2.5 py-1.5 text-[11px] text-[#d1d1d1]"
          aria-label={t("shareButtons.shareOn").replace("{name}", target.label)}
        >
          <iconify-icon icon={target.icon} style={{ fontSize: "13px", color: "#89c7ff" }} />
          {!compact ? target.label : null}
        </button>
      ))}
      <button
        type="button"
        onClick={copyLink}
        className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.1] bg-white/[0.03] hover:bg-white/[0.07] transition-colors px-2.5 py-1.5 text-[11px] text-[#d1d1d1]"
        aria-label={t("shareButtons.copyLink")}
      >
        <iconify-icon icon={copied ? "lucide:check" : "lucide:link"} style={{ fontSize: "13px", color: copied ? "#6ee7b7" : "#89c7ff" }} />
        {copied ? t("shareButtons.copied") : compact ? null : t("shareButtons.copy")}
      </button>
    </div>
  );
}
