"use client";

import L from "./L";
import { useMemo, useState } from "react";
import { isValidAuthEmail, sanitizeAuthEmail, toAuthErrorMessage } from "../lib/authErrors";
import { createClient } from "../utils/supabase/client";
import { useI18n } from "./I18nProvider";

export default function ForgotPasswordPageClient() {
  const { t } = useI18n();
  const supabase = useMemo(() => createClient(), []);
  const [email, setEmail] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [emailSent, setEmailSent] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    const normalizedEmail = sanitizeAuthEmail(email);

    if (!isValidAuthEmail(normalizedEmail)) {
      setErrorMessage(t("auth.forgotPasswordInvalidEmail"));
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(normalizedEmail, {
        redirectTo: `${window.location.origin}/reset-password`
      });

      if (error) {
        setErrorMessage(toAuthErrorMessage(error, t("auth.forgotPasswordSendError")));
        return;
      }

      setEmail(normalizedEmail);
      setEmailSent(true);
    } catch {
      setErrorMessage(t("auth.forgotPasswordNetworkError"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white px-6 py-20 md:py-24 flex items-center justify-center">
      <div className="w-full max-w-[560px] bg-[#111] border border-white/[0.07] rounded-3xl p-8 sm:p-10">
        <div className="section-label mb-4">{emailSent ? t("auth.forgotPasswordSentBadge") : t("auth.forgotPasswordBadge")}</div>
        <h1 className="font-valorax text-[34px] mb-4">{emailSent ? t("auth.forgotPasswordSentTitle") : t("auth.forgotPasswordTitle")}</h1>

        {emailSent ? (
          <>
            <p className="font-body-readable text-[14px] text-[#888] leading-relaxed mb-3">
              {t("auth.forgotPasswordSentDesc")} <span className="text-white">{email}</span>.
            </p>
            <p className="font-body-readable text-[14px] text-[#888] leading-relaxed mb-8">
              {t("auth.forgotPasswordSentHint")}
            </p>
          </>
        ) : (
          <>
            <p className="font-body-readable text-[14px] text-[#888] leading-relaxed mb-6">
              {t("auth.forgotPasswordDesc")}
            </p>
            <div className="mb-8 rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 py-3">
              <div className="text-[12px] text-white font-medium mb-1">{t("auth.forgotPasswordWaiting")}</div>
              <p className="text-[12px] text-[#777] font-body-readable">{t("auth.forgotPasswordWaitingSub")}</p>
            </div>
          </>
        )}

        {errorMessage ? (
          <div className="mb-4 rounded-xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-[12px] text-red-300">
            {errorMessage}
          </div>
        ) : null}

        {!emailSent ? (
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-1.5">
              <label className="text-[12px] text-[#555] ml-1">{t("auth.email")}</label>
              <input
                type="email"
                className="auth-input"
                value={email}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => setEmail(event.target.value)}
                placeholder={t("auth.emailPlaceholder")}
                required
              />
            </div>

            <button type="submit" className="btn-primary w-full h-[48px]" disabled={loading}>
              {loading ? t("auth.forgotPasswordLoading") : t("auth.forgotPasswordSubmit")}
            </button>
          </form>
        ) : null}

        <div className="mt-8 pt-6 border-t border-white/[0.05] flex items-center justify-between text-[13px]">
          <L href="/signin" className="text-[#888] hover:text-white transition-colors">
            {t("auth.forgotPasswordBack")}
          </L>

          {emailSent ? (
            <button
              type="button"
              className="text-[#4F8EF7] hover:underline"
              onClick={() => {
                setEmailSent(false);
                setErrorMessage("");
              }}
            >
              {t("auth.forgotPasswordResend")}
            </button>
          ) : (
            <L href="/signup" className="text-[#4F8EF7] hover:underline">
              {t("auth.forgotPasswordSignUp")}
            </L>
          )}
        </div>
      </div>
    </main>
  );
}
