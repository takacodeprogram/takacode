"use client";

import L from "./L";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toAuthErrorMessage } from "../lib/authErrors";
import { createClient } from "../utils/supabase/client";
import { useToast } from "./Toast";
import { useI18n } from "./I18nProvider";

function getPasswordStrength(password: string): number {
  let score = 0;
  if (password.length >= 10) score += 25;
  if (/[a-z]/.test(password)) score += 20;
  if (/[A-Z]/.test(password)) score += 20;
  if (/[0-9]/.test(password)) score += 20;
  if (/[^a-zA-Z0-9]/.test(password)) score += 15;
  return Math.min(score, 100);
}

interface StrengthMeta {
  label: string;
  color: string;
}

function getStrengthMeta(score: number): StrengthMeta {
  if (score < 45) {
    return { label: "Mot de passe faible", color: "#ef4444" };
  }

  if (score < 75) {
    return { label: "Mot de passe moyen", color: "#f97316" };
  }

  return { label: "Mot de passe solide", color: "#22c55e" };
}

export default function ResetPasswordPageClient() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const { toast } = useToast();
  const { t } = useI18n();

  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const strength = getPasswordStrength(password);
  const strengthMeta = getStrengthMeta(strength);

  useEffect(() => {
    let isMounted = true;

    async function verifySession() {
      try {
        const {
          data: { session }
        } = await supabase.auth.getSession();

        if (!session && isMounted) {
          toast(t("auth.resetPasswordNoSession"), "info");
        }
      } catch {
        if (isMounted) {
          toast(t("auth.resetPasswordSessionError"), "info");
        }
      }
    }

    verifySession();

    return () => {
      isMounted = false;
    };
  }, [supabase]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (password !== confirmPassword) {
      toast(t("auth.resetPasswordMismatch"), "error");
      return;
    }

    if (strength < 75) {
      toast(t("auth.resetPasswordWeakError"), "error");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({ password });

      if (error) {
        toast(toAuthErrorMessage(error, t("auth.resetPasswordUpdateError")), "error");
        return;
      }

      await supabase.auth.signOut();
      router.replace("/signin?reset=success");
      router.refresh();
    } catch {
      toast(t("auth.resetPasswordNetworkError"), "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white px-6 py-20 md:py-24 flex items-center justify-center">
      <div className="w-full max-w-[560px] bg-[#111] border border-white/[0.07] rounded-3xl p-8 sm:p-10">
        <div className="section-label mb-4">{t("auth.resetPasswordBadge")}</div>
        <h1 className="font-valorax text-[34px] mb-4">{t("auth.resetPasswordTitle")}</h1>
        <p className="font-body-readable text-[14px] text-[#888] leading-relaxed mb-8">
          {t("auth.resetPasswordDesc")}
        </p>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-1.5">
            <label className="text-[12px] text-[#555] ml-1">{t("auth.resetPasswordNewLabel")}</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className="auth-input pr-[92px]"
                value={password}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => setPassword(event.target.value)}
                placeholder="********"
                required
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-[11px] text-[#8FA8FF] hover:text-white transition-colors"
                onClick={() => setShowPassword((current) => !current)}
              >
                {showPassword ? t("auth.hidePassword") : t("auth.showPassword")}
              </button>
            </div>
            <div className="h-1 rounded bg-[#222] mt-1 overflow-hidden">
              <div className="h-full transition-all" style={{ width: `${strength}%`, backgroundColor: strengthMeta.color }} />
            </div>
            <p className="text-[10px] text-[#666] mt-1">{strength < 45 ? t("auth.passwordWeak") : strength < 75 ? t("auth.passwordMedium") : t("auth.passwordStrong")}</p>
          </div>

          <div className="space-y-1.5">
            <label className="text-[12px] text-[#555] ml-1">{t("auth.resetPasswordConfirmLabel")}</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                className="auth-input pr-[92px]"
                value={confirmPassword}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(event.target.value)}
                placeholder="********"
                required
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-[11px] text-[#8FA8FF] hover:text-white transition-colors"
                onClick={() => setShowConfirmPassword((current) => !current)}
              >
                {showConfirmPassword ? t("auth.hidePassword") : t("auth.showPassword")}
              </button>
            </div>
          </div>

          <button type="submit" className="btn-primary w-full h-[48px]" disabled={loading}>
            {loading ? t("auth.resetPasswordLoading") : t("auth.resetPasswordSubmit")}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-white/[0.05] text-[13px] flex items-center justify-between">
          <L href="/signin" className="text-[#888] hover:text-white transition-colors">
            {t("auth.resetPasswordBack")}
          </L>
          <L href="/forgot-password" className="text-[#4F8EF7] hover:underline">
            {t("auth.resetPasswordNewLink")}
          </L>
        </div>
      </div>
    </main>
  );
}
