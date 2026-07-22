"use client";

import L from "./L";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { sanitizeAuthEmail, toAuthErrorMessage } from "../lib/authErrors";
import { createClient } from "../utils/supabase/client";
import { useToast } from "./Toast";
import { useI18n } from "./I18nProvider";

interface AuthOnboardingPageProps {
  initialMode?: string;
}

function sanitizeNextPath(value: string | null): string {
  if (typeof value !== "string") {
    return "/dashboard";
  }

  if (!value.startsWith("/") || value.startsWith("//")) {
    return "/dashboard";
  }

  return value;
}

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

function buildOAuthRedirect(nextPath: string): string {
  const url = new URL("/auth/callback", window.location.origin);
  if (nextPath && nextPath !== "/dashboard") {
    url.searchParams.set("next", nextPath);
  }
  return url.toString();
}

export default function AuthOnboardingPage({ initialMode = "signin" }: AuthOnboardingPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = useMemo(() => createClient(), []);
  const { toast } = useToast();
  const { t } = useI18n();

  const nextPath = sanitizeNextPath(searchParams.get("next"));
  const resetSuccess = searchParams.get("reset") === "success";
  const referralFromQuery = searchParams.get("ref");

  const [mode, setMode] = useState<string>(initialMode === "signup" ? "signup" : "signin");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordConfirm, setPasswordConfirm] = useState<string>("");
  const [referralCode, setReferralCode] = useState<string>(
    typeof referralFromQuery === "string" ? referralFromQuery.trim().toUpperCase() : ""
  );
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const passwordStrength = getPasswordStrength(password);
  const strengthMeta = getStrengthMeta(passwordStrength);

  useEffect(() => {
    let isMounted = true;

    async function redirectIfSessionExists() {
      const pushAuthenticatedRoute = (role: string, onboardingCompleted: boolean) => {
        if (role === "admin") {
          router.replace("/admin");
          return;
        }

        router.replace(onboardingCompleted ? "/dashboard" : "/onboarding");
      };

      try {
        const response = await fetch("/auth/session", {
          method: "GET",
          credentials: "include",
          cache: "no-store"
        });

        if (response.ok) {
          const payload = await response.json();

          if (!isMounted) {
            return;
          }

          if (payload?.authenticated) {
            const role = typeof payload?.role === "string" ? payload.role.toLowerCase() : "user";
            pushAuthenticatedRoute(role, payload?.onboardingCompleted === true);
            return;
          }
        }
      } catch {
        // Fallback to browser session lookup below.
      }

      try {
        const {
          data: { session }
        } = await supabase.auth.getSession();

        const user = session?.user;

        if (!isMounted || !user) {
          return;
        }

        const role = typeof user?.app_metadata?.role === "string" ? user.app_metadata.role.toLowerCase() : "user";
        const onboardingCompleted = user?.user_metadata?.onboarding_completed === true;

        pushAuthenticatedRoute(role, onboardingCompleted);
      } catch {
        // Keep auth form visible when user data cannot be loaded.
      }
    }

    redirectIfSessionExists();

    return () => {
      isMounted = false;
    };
  }, [router, supabase]);

  const showResetSuccessState = mode === "signin" && resetSuccess;

  async function handleOAuth(provider: string) {
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: provider as any,
        options: {
          redirectTo: buildOAuthRedirect(nextPath)
        }
      });

      if (error) {
        toast(toAuthErrorMessage(error, t("auth.oauthError")), "error");
        setLoading(false);
        return;
      }
    } catch {
      toast(t("auth.networkError"), "error");
      setLoading(false);
    }
  }

  async function handleWalletLogin() {
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithWeb3({
        chain: "ethereum",
        statement: "Connexion à TakaCode"
      });

      if (error) {
        toast(toAuthErrorMessage(error, t("auth.walletError")), "error");
        setLoading(false);
        return;
      }

      router.push(nextPath);
      router.refresh();
    } catch {
      toast(t("auth.networkError"), "error");
      setLoading(false);
    }
  }

  async function handleSignIn(event: React.FormEvent) {
    event.preventDefault();

    const normalizedEmail = sanitizeAuthEmail(email);
    if (!normalizedEmail) {
      toast(t("auth.enterEmailError"), "error");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password
      });

      if (error) {
        toast(toAuthErrorMessage(error, t("auth.signInError")), "error");
        setLoading(false);
        return;
      }

      router.push(nextPath);
      router.refresh();
    } catch {
      toast(t("auth.networkError"), "error");
      setLoading(false);
    }
  }

  async function handleSignUp(event: React.FormEvent) {
    event.preventDefault();

    const normalizedEmail = sanitizeAuthEmail(email);
    if (!normalizedEmail) {
      toast(t("auth.validEmailError"), "error");
      return;
    }

    if (password !== passwordConfirm) {
      toast(t("auth.passwordMismatch"), "error");
      return;
    }

    if (passwordStrength < 75) {
      toast(t("auth.weakPasswordError"), "error");
      return;
    }

    setLoading(true);

    const emailRedirectTo = buildOAuthRedirect(nextPath);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: normalizedEmail,
        password,
        options: {
          emailRedirectTo,
          data: {
            first_name: firstName,
            last_name: lastName,
            role: "user",
            referral_code: referralCode ? referralCode.trim().toUpperCase() : undefined
          }
        }
      });

      if (error) {
        toast(toAuthErrorMessage(error, t("auth.signUpError")), "error");
        setLoading(false);
        return;
      }

      if (data.session) {
        router.push(nextPath);
        router.refresh();
        return;
      }

      toast(t("auth.checkEmail"), "info");
      setLoading(false);
    } catch {
      toast(t("auth.networkError"), "error");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] px-6 py-20 md:py-24 relative overflow-hidden text-white">
      <div className="hero-glow w-[620px] h-[620px] bg-blue-500/[0.04] -left-[120px] top-[12%]" />
      <div className="hero-glow w-[520px] h-[520px] bg-violet-500/[0.06] -right-[90px] bottom-[10%]" />

      <div className="relative z-10 w-full max-w-[1120px] mx-auto">
        <div className="mb-8 animate-fade-up">
          <L
            href="/"
            id="nav-back-landing"
            className="inline-flex items-center gap-2 rounded-xl border border-white/[0.08] bg-black/30 px-4 py-2.5 group"
          >
            <span className="w-7 h-7 rounded-lg border border-white/[0.12] bg-white/[0.04] inline-flex items-center justify-center text-[#8ba1ff] group-hover:text-white transition-colors">
              <iconify-icon icon="lucide:arrow-left" style={{ fontSize: "15px" }} />
            </span>
            <span className="text-[11px] font-semibold text-[#666] tracking-widest uppercase group-hover:text-[#9a9a9a] transition-colors">
              {t("auth.backToSite")}
            </span>
          </L>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="hidden lg:block space-y-10 animate-fade-up">
            {mode === "signup" ? (
              <>
                <div className="section-label">{t("auth.signUpHeroBadge")}</div>
                <h1 className="font-valorax text-[56px] leading-[0.9] gradient-text-blue">
                  {t("auth.signUpHeroTitle1")}<br />
                  {t("auth.signUpHeroTitle2")}
                </h1>
                <p className="text-[#888] text-lg max-w-xl font-body-readable">{t("auth.signUpHeroDesc")}</p>
                <div className="space-y-5 pt-4">
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-xl border flex items-center justify-center flex-shrink-0 bg-blue-500/10 border-blue-500/20">
                      <iconify-icon icon="lucide:book-open" style={{ color: "#4F8EF7", fontSize: "22px" }} />
                    </div>
                    <div>
                      <h3 className="text-sm text-white font-venite-italic">{t("auth.signUpHighlight1Title")}</h3>
                      <p className="text-[13px] text-[#555] font-body-readable">{t("auth.signUpHighlight1Desc")}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-xl border flex items-center justify-center flex-shrink-0 bg-violet-500/10 border-violet-500/20">
                      <iconify-icon icon="lucide:users" style={{ color: "#9B6DFF", fontSize: "22px" }} />
                    </div>
                    <div>
                      <h3 className="text-sm text-white font-venite-italic">{t("auth.signUpHighlight2Title")}</h3>
                      <p className="text-[13px] text-[#555] font-body-readable">{t("auth.signUpHighlight2Desc")}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-xl border flex items-center justify-center flex-shrink-0 bg-cyan-500/10 border-cyan-500/20">
                      <iconify-icon icon="lucide:zap" style={{ color: "#22D3EE", fontSize: "22px" }} />
                    </div>
                    <div>
                      <h3 className="text-sm text-white font-venite-italic">{t("auth.signUpHighlight3Title")}</h3>
                      <p className="text-[13px] text-[#555] font-body-readable">{t("auth.signUpHighlight3Desc")}</p>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="section-label">{t("auth.signInHeroBadge")}</div>
                <h1 className="font-valorax text-[56px] leading-[0.9] gradient-text-blue">
                  {t("auth.signInHeroTitle1")}<br />
                  {t("auth.signInHeroTitle2")}
                </h1>
                <p className="text-[#888] text-lg max-w-xl font-body-readable">{t("auth.signInHeroDesc")}</p>
                <div className="space-y-5 pt-4">
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-xl border flex items-center justify-center flex-shrink-0 bg-blue-500/10 border-blue-500/20">
                      <iconify-icon icon="lucide:rocket" style={{ color: "#4F8EF7", fontSize: "22px" }} />
                    </div>
                    <div>
                      <h3 className="text-sm text-white font-venite-italic">{t("auth.signInHighlight1Title")}</h3>
                      <p className="text-[13px] text-[#555] font-body-readable">{t("auth.signInHighlight1Desc")}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-xl border flex items-center justify-center flex-shrink-0 bg-violet-500/10 border-violet-500/20">
                      <iconify-icon icon="lucide:users" style={{ color: "#9B6DFF", fontSize: "22px" }} />
                    </div>
                    <div>
                      <h3 className="text-sm text-white font-venite-italic">{t("auth.signInHighlight2Title")}</h3>
                      <p className="text-[13px] text-[#555] font-body-readable">{t("auth.signInHighlight2Desc")}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-xl border flex items-center justify-center flex-shrink-0 bg-cyan-500/10 border-cyan-500/20">
                      <iconify-icon icon="lucide:chart-column-increasing" style={{ color: "#22D3EE", fontSize: "22px" }} />
                    </div>
                    <div>
                      <h3 className="text-sm text-white font-venite-italic">{t("auth.signInHighlight3Title")}</h3>
                      <p className="text-[13px] text-[#555] font-body-readable">{t("auth.signInHighlight3Desc")}</p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="w-full">
            <div className="bg-[#111] border border-white/[0.07] rounded-3xl p-8 sm:p-10 shadow-2xl relative onboarding-step animate-fade-up">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <span className="text-[11px] font-semibold text-[#4F8EF7] uppercase tracking-widest">{t("auth.authLabel")}</span>
                  <h2 className="font-valorax text-3xl mt-2">{mode === "signin" ? t("auth.signInTitle") : t("auth.signUpTitle")}</h2>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                <button
                  type="button"
                  className="btn-secondary flex items-center justify-center gap-2 py-3"
                  disabled={loading}
                  onClick={() => handleOAuth("google")}
                >
                  <iconify-icon icon="logos:google-icon" className="text-lg" />
                  <span className="text-[12px]">{t("auth.continueWithGoogle")}</span>
                </button>

                <button
                  type="button"
                  className="btn-secondary flex items-center justify-center gap-2 py-3"
                  disabled={loading}
                  onClick={() => handleOAuth("github")}
                >
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white">
                    <iconify-icon icon="logos:github-icon" style={{ fontSize: "14px" }} />
                  </span>
                  <span className="text-[12px]">{t("auth.continueWithGithub")}</span>
                </button>
              </div>

              <button
                type="button"
                className="btn-secondary w-full flex items-center justify-center gap-2 py-3 mb-8"
                disabled={loading}
                onClick={handleWalletLogin}
              >
                <iconify-icon icon="lucide:wallet" className="text-lg" />
                <span className="text-[12px]">{t("auth.continueWithWallet")}</span>
              </button>

              <div className="flex items-center gap-4 mb-8">
                <div className="h-px flex-1 bg-white/[0.05]" />
                <span className="text-[11px] text-[#444] uppercase font-bold">{t("auth.orDivider")}</span>
                <div className="h-px flex-1 bg-white/[0.05]" />
              </div>

              {showResetSuccessState ? (
                <div className="mb-4 rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-4 py-4 text-emerald-100">
                  <div className="text-[10px] font-semibold tracking-[0.16em] uppercase text-emerald-300 mb-1">{t("auth.resetBadge")}</div>
                  <div className="text-[14px] font-semibold mb-1">{t("auth.resetTitle")}</div>
                  <p className="text-[12px] text-emerald-100/80 mb-2">{t("auth.resetDescription")}</p>
                  <L href="/signin?next=/dashboard" className="text-[12px] font-semibold text-emerald-200 hover:text-white transition-colors">
                    {t("auth.resetContinue")}
                  </L>
                </div>
              ) : null}

              {mode === "signup" && referralCode ? (
                <div className="mb-4 rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-4 py-3 text-[12px] text-emerald-200">
                  {t("auth.referralDetected")} <span className="font-semibold">{referralCode}</span>
                </div>
              ) : null}

              <form className="space-y-4" onSubmit={mode === "signin" ? handleSignIn : handleSignUp}>
                {mode === "signup" ? (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[12px] text-[#555] ml-1">{t("auth.signUpFirstName")}</label>
                      <input
                        type="text"
                        className="auth-input"
                        value={firstName}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => setFirstName(event.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[12px] text-[#555] ml-1">{t("auth.signUpLastName")}</label>
                      <input
                        type="text"
                        className="auth-input"
                        value={lastName}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => setLastName(event.target.value)}
                        required
                      />
                    </div>
                  </div>
                ) : null}

                <div className="space-y-1.5">
                  <label className="text-[12px] text-[#555] ml-1">{t("auth.email")}</label>
                  <input
                    type="email"
                    className="auth-input"
                    placeholder={t("auth.emailPlaceholder")}
                    value={email}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => setEmail(event.target.value)}
                    required
                  />
                </div>

                {mode === "signup" ? (
                  <div className="space-y-1.5">
                    <label className="text-[12px] text-[#555] ml-1">{t("auth.signUpReferralCode")}</label>
                    <input
                      type="text"
                      className="auth-input uppercase"
                      placeholder={t("auth.signUpReferralPlaceholder")}
                      value={referralCode}
                      maxLength={16}
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) => setReferralCode(event.target.value.toUpperCase())}
                    />
                  </div>
                ) : null}

                <div className="space-y-1.5">
                  <label className="text-[12px] text-[#555] ml-1">{t("auth.password")}</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      className="auth-input pr-[92px]"
                      placeholder="********"
                      value={password}
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) => setPassword(event.target.value)}
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
                  {mode === "signup" ? (
                    <>
                      <div className="h-1 rounded bg-[#222] mt-1 overflow-hidden">
                        <div className="h-full transition-all" style={{ width: `${passwordStrength}%`, backgroundColor: strengthMeta.color }} />
                      </div>
                      <p className="text-[10px] text-[#666] mt-1">{passwordStrength < 45 ? t("auth.passwordWeak") : passwordStrength < 75 ? t("auth.passwordMedium") : t("auth.passwordStrong")}</p>
                    </>
                  ) : null}
                </div>

                {mode === "signup" ? (
                  <div className="space-y-1.5">
                    <label className="text-[12px] text-[#555] ml-1">{t("auth.signUpConfirmPassword")}</label>
                    <div className="relative">
                      <input
                        type={showPasswordConfirm ? "text" : "password"}
                        className="auth-input pr-[92px]"
                        placeholder="********"
                        value={passwordConfirm}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => setPasswordConfirm(event.target.value)}
                        required
                      />
                      <button
                        type="button"
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-[11px] text-[#8FA8FF] hover:text-white transition-colors"
                        onClick={() => setShowPasswordConfirm((current) => !current)}
                      >
                        {showPasswordConfirm ? t("auth.hidePassword") : t("auth.showPassword")}
                      </button>
                    </div>
                  </div>
                ) : null}

                {mode === "signin" ? (
                  <div className="flex items-center justify-end">
                    <L href="/forgot-password" className="text-[12px] text-[#4F8EF7] hover:underline">
                      {t("auth.forgotPassword")}
                    </L>
                  </div>
                ) : null}

                <button type="submit" className="btn-primary w-full h-[48px]" disabled={loading}>
                  {loading ? t("common.loading") : mode === "signin" ? t("auth.signIn") : t("auth.signUpCreateAccount")}
                </button>
              </form>

              <div className="mt-8 pt-8 border-t border-white/[0.05] text-center text-[13px] text-[#666]">
                {mode === "signin" ? (
                  <>
                    {t("auth.noAccountPrompt")}{" "}
                    <button
                      type="button"
                      className="text-white font-medium hover:underline"
                      onClick={() => {
                        setMode("signup");
                      }}
                    >
                      {t("auth.createAccountLink")}
                    </button>
                  </>
                ) : (
                  <>
                    {t("auth.hasAccountPrompt")}{" "}
                    <button
                      type="button"
                      className="text-white font-medium hover:underline"
                      onClick={() => {
                        setMode("signin");
                      }}
                    >
                      {t("auth.signInLink")}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
