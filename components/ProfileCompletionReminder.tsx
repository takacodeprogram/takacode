"use client";

import Link from "next/link";
import { useState } from "react";
import { useI18n } from "./I18nProvider";

interface Props {
  missingCountry?: boolean;
  missingBio?: boolean;
  missingAvatar?: boolean;
  missingPublicName?: boolean;
  locale?: string;
}

export default function ProfileCompletionReminder({
  missingCountry = false,
  missingBio = false,
  missingAvatar = false,
  missingPublicName = false,
  locale = "fr"
}: Props) {
  const { t } = useI18n();
  const [dismissed, setDismissed] = useState(false);

  const missing = [
    missingCountry ? t("profileReminder.country", "Pays (pour le globe)") : null,
    missingPublicName ? t("profileReminder.publicName", "Nom public") : null,
    missingBio ? t("profileReminder.bio", "Bio courte") : null,
    missingAvatar ? t("profileReminder.avatar", "Avatar") : null
  ].filter(Boolean) as string[];

  if (!missing.length || dismissed) return null;

  const profileHref = locale === "en" ? "/dashboard/profile" : "/dashboard/profile";

  return (
    <div className="rounded-2xl border border-blue-500/25 bg-gradient-to-r from-blue-500/10 via-violet-500/5 to-transparent p-4 mb-4 flex items-start gap-3">
      <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/25 flex items-center justify-center shrink-0">
        <iconify-icon icon="lucide:user-plus" style={{ color: "#4F8EF7", fontSize: "18px" }} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <h4 className="text-[13px] font-semibold text-[var(--text-primary)]">
            {t("profileReminder.title", "Complète ton profil pour apparaître sur le globe")}
          </h4>
          {missingCountry ? (
            <span className="text-[9px] font-semibold uppercase tracking-widest px-1.5 py-0.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-300">
              {t("profileReminder.important", "Important")}
            </span>
          ) : null}
        </div>
        <p className="text-[12px] text-[var(--muted-3)] mb-2">
          {t(
            "profileReminder.description",
            "Renseigne au moins ton pays pour que les autres membres puissent te voir sur la carte communautaire. Un profil complet augmente aussi ta visibilité."
          )}
        </p>
        <div className="text-[11px] text-[var(--muted-4)] mb-3">
          {t("profileReminder.missingLabel", "Il manque")} :
          <span className="ml-1.5 text-[var(--muted-2)]">{missing.join(" · ")}</span>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Link
            href={profileHref}
            className="btn-primary inline-flex items-center gap-2 text-[12px]"
            style={{ padding: "8px 16px" }}
          >
            {t("profileReminder.cta", "Compléter mon profil")}
            <iconify-icon icon="lucide:arrow-right" style={{ fontSize: "13px" }} />
          </Link>
          <button
            type="button"
            onClick={() => setDismissed(true)}
            className="text-[11px] text-[var(--muted-4)] hover:text-[var(--text-primary)]"
          >
            {t("profileReminder.later", "Plus tard")}
          </button>
        </div>
      </div>
      <button
        type="button"
        onClick={() => setDismissed(true)}
        className="text-[var(--muted-4)] hover:text-[var(--text-primary)] p-1 shrink-0"
        aria-label={t("common.close", "Fermer")}
      >
        <iconify-icon icon="lucide:x" style={{ fontSize: "14px" }} />
      </button>
    </div>
  );
}
