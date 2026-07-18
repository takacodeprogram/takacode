"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { sanitizeAuthEmail, toAuthErrorMessage } from "../lib/authErrors";
import { createClient } from "../utils/supabase/client";
import { useToast } from "./Toast";

interface AuthOnboardingPageProps {
  initialMode?: string;
}

interface HighlightItem {
  icon: string;
  iconColor: string;
  shellClass: string;
  title: string;
  text: string;
}

interface AuthModeCopy {
  badge: string;
  titleLines: string[];
  description: string;
  highlights: HighlightItem[];
}

const AUTH_ERROR_MESSAGES: Record<string, string> = {
  forbidden: "Ton compte ne dispose pas du rôle requis pour accéder au dashboard.",
  oauth_callback_failed: "La connexion n'a pas abouti. Réessaie.",
  oauth_code_missing: "La connexion a été interrompue. Réessaie.",
  oauth_denied: "Connexion annulée ou refusée.",
  auth_config_missing: "Configuration auth manquante. Contacte l'administrateur.",
  auth_network: "Problème réseau pendant la connexion OAuth. Réessaie."
};

const AUTH_MODE_COPY: Record<string, AuthModeCopy> = {
  signup: {
    badge: "COMMUNAUTE TAKACODE",
    titleLines: ["COMMENCE TON", "PROCHAIN PROJET"],
    description:
      "Crée ton compte et accède aux parcours, ressources, sessions live et à une communauté qui apprend en construisant.",
    highlights: [
      {
        icon: "lucide:book-open",
        iconColor: "#4F8EF7",
        shellClass: "bg-blue-500/10 border-blue-500/20",
        title: "Apprends avec methode",
        text: "Parcours guidés, ressources sélectionnées et exercices pratiques pour progresser à ton rythme."
      },
      {
        icon: "lucide:users",
        iconColor: "#9B6DFF",
        shellClass: "bg-violet-500/10 border-violet-500/20",
        title: "Construis avec la communaute",
        text: "Participe aux sessions live, échange avec d'autres créateurs et avance ensemble."
      },
      {
        icon: "lucide:zap",
        iconColor: "#22D3EE",
        shellClass: "bg-cyan-500/10 border-cyan-500/20",
        title: "Accelere avec l'IA",
        text: "Profite des meilleurs outils d'IA pour comprendre plus vite et transformer tes idées en projets concrets."
      }
    ]
  },
  signin: {
    badge: "BON RETOUR",
    titleLines: ["RETROUVE TES PROJETS", "ET CONTINUE A AVANCER"],
    description:
      "Reconnecte-toi pour reprendre ton parcours, participer aux sessions live et poursuivre tes réalisations.",
    highlights: [
      {
        icon: "lucide:rocket",
        iconColor: "#4F8EF7",
        shellClass: "bg-blue-500/10 border-blue-500/20",
        title: "Reprends la ou tu t'es arrete",
        text: "Tes parcours, ressources et projets t'attendent."
      },
      {
        icon: "lucide:users",
        iconColor: "#9B6DFF",
        shellClass: "bg-violet-500/10 border-violet-500/20",
        title: "Retrouve la communaute",
        text: "Échange avec d'autres créateurs et participe aux prochaines sessions."
      },
      {
        icon: "lucide:chart-column-increasing",
        iconColor: "#22D3EE",
        shellClass: "bg-cyan-500/10 border-cyan-500/20",
        title: "Continue a progresser",
        text: "Chaque étape te rapproche un peu plus de ton prochain projet."
      }
    ]
  }
};

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

  const nextPath = sanitizeNextPath(searchParams.get("next"));
  const queryError = searchParams.get("error");
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
  const modeCopy = AUTH_MODE_COPY[mode] ?? AUTH_MODE_COPY.signin;

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
        toast(toAuthErrorMessage(error, "Impossible de démarrer la connexion OAuth."), "error");
        setLoading(false);
        return;
      }
    } catch {
      toast("Problème réseau. Réessaie dans un instant.", "error");
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
        toast(toAuthErrorMessage(error, "Impossible de connecter le wallet."), "error");
        setLoading(false);
        return;
      }

      router.push(nextPath);
      router.refresh();
    } catch {
      toast("Problème réseau. Réessaie dans un instant.", "error");
      setLoading(false);
    }
  }

  async function handleSignIn(event: React.FormEvent) {
    event.preventDefault();

    const normalizedEmail = sanitizeAuthEmail(email);
    if (!normalizedEmail) {
      toast("Entre ton email pour te connecter.", "error");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password
      });

      if (error) {
        toast(toAuthErrorMessage(error, "Connexion impossible pour le moment."), "error");
        setLoading(false);
        return;
      }

      router.push(nextPath);
      router.refresh();
    } catch {
      toast("Problème réseau. Réessaie dans un instant.", "error");
      setLoading(false);
    }
  }

  async function handleSignUp(event: React.FormEvent) {
    event.preventDefault();

    const normalizedEmail = sanitizeAuthEmail(email);
    if (!normalizedEmail) {
      toast("Entre une adresse email valide.", "error");
      return;
    }

    if (password !== passwordConfirm) {
      toast("Les mots de passe ne correspondent pas.", "error");
      return;
    }

    if (passwordStrength < 75) {
      toast("Utilise un mot de passe plus solide (min 10 caractères, majuscule, chiffre, symbole).", "error");
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
        toast(toAuthErrorMessage(error, "Inscription impossible pour le moment."), "error");
        setLoading(false);
        return;
      }

      if (data.session) {
        router.push(nextPath);
        router.refresh();
        return;
      }

      toast("Compte créé. Vérifie ton email pour confirmer ton inscription.", "info");
      setLoading(false);
    } catch {
      toast("Problème réseau. Réessaie dans un instant.", "error");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] px-6 py-20 md:py-24 relative overflow-hidden text-white">
      <div className="hero-glow w-[620px] h-[620px] bg-blue-500/[0.04] -left-[120px] top-[12%]" />
      <div className="hero-glow w-[520px] h-[520px] bg-violet-500/[0.06] -right-[90px] bottom-[10%]" />

      <div className="relative z-10 w-full max-w-[1120px] mx-auto">
        <div className="mb-8 animate-fade-up">
          <Link
            href="/"
            id="nav-back-landing"
            className="inline-flex items-center gap-2 rounded-xl border border-white/[0.08] bg-black/30 px-4 py-2.5 group"
          >
            <span className="w-7 h-7 rounded-lg border border-white/[0.12] bg-white/[0.04] inline-flex items-center justify-center text-[#8ba1ff] group-hover:text-white transition-colors">
              <iconify-icon icon="lucide:arrow-left" style={{ fontSize: "15px" }} />
            </span>
            <span className="text-[11px] font-semibold text-[#666] tracking-widest uppercase group-hover:text-[#9a9a9a] transition-colors">
              Retour au site
            </span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="hidden lg:block space-y-10 animate-fade-up">
            <div className="section-label">{modeCopy.badge}</div>

            <h1 className="font-valorax text-[56px] leading-[0.9] gradient-text-blue">
              {modeCopy.titleLines.map((line: string, index: number) => (
                <span key={line}>
                  {line}
                  {index < modeCopy.titleLines.length - 1 ? <br /> : null}
                </span>
              ))}
            </h1>

            <p className="text-[#888] text-lg max-w-xl font-body-readable">{modeCopy.description}</p>

            <div className="space-y-5 pt-4">
              {modeCopy.highlights.map((item: HighlightItem) => (
                <div key={item.title} className="flex items-start gap-4">
                  <div className={`w-11 h-11 rounded-xl border flex items-center justify-center flex-shrink-0 ${item.shellClass}`}>
                    <iconify-icon icon={item.icon} style={{ color: item.iconColor, fontSize: "22px" }} />
                  </div>
                  <div>
                    <h3 className="text-sm text-white font-venite-italic">{item.title}</h3>
                    <p className="text-[13px] text-[#555] font-body-readable">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="w-full">
            <div className="bg-[#111] border border-white/[0.07] rounded-3xl p-8 sm:p-10 shadow-2xl relative onboarding-step animate-fade-up">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <span className="text-[11px] font-semibold text-[#4F8EF7] uppercase tracking-widest">Authentification</span>
                  <h2 className="font-valorax text-3xl mt-2">{mode === "signin" ? "SE CONNECTER" : "CREER UN COMPTE"}</h2>
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
                  <span className="text-[12px]">Continuer avec Google</span>
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
                  <span className="text-[12px]">Continuer avec GitHub</span>
                </button>
              </div>

              <button
                type="button"
                className="btn-secondary w-full flex items-center justify-center gap-2 py-3 mb-8"
                disabled={loading}
                onClick={handleWalletLogin}
              >
                <iconify-icon icon="lucide:wallet" className="text-lg" />
                <span className="text-[12px]">Continuer avec Wallet Ethereum</span>
              </button>

              <div className="flex items-center gap-4 mb-8">
                <div className="h-px flex-1 bg-white/[0.05]" />
                <span className="text-[11px] text-[#444] uppercase font-bold">ou</span>
                <div className="h-px flex-1 bg-white/[0.05]" />
              </div>

              {showResetSuccessState ? (
                <div className="mb-4 rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-4 py-4 text-emerald-100">
                  <div className="text-[10px] font-semibold tracking-[0.16em] uppercase text-emerald-300 mb-1">C'EST BON !</div>
                  <div className="text-[14px] font-semibold mb-1">TON MOT DE PASSE A ETE MIS A JOUR</div>
                  <p className="text-[12px] text-emerald-100/80 mb-2">Tu peux maintenant te reconnecter et reprendre là où tu t'étais arrêté.</p>
                  <Link href="/signin?next=/dashboard" className="text-[12px] font-semibold text-emerald-200 hover:text-white transition-colors">
                    Continuer mon parcours
                  </Link>
                </div>
              ) : null}

              {mode === "signup" && referralCode ? (
                <div className="mb-4 rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-4 py-3 text-[12px] text-emerald-200">
                  Code parrainage détecté: <span className="font-semibold">{referralCode}</span>
                </div>
              ) : null}

              <form className="space-y-4" onSubmit={mode === "signin" ? handleSignIn : handleSignUp}>
                {mode === "signup" ? (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[12px] text-[#555] ml-1">Prenom</label>
                      <input
                        type="text"
                        className="auth-input"
                        value={firstName}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => setFirstName(event.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[12px] text-[#555] ml-1">Nom</label>
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
                  <label className="text-[12px] text-[#555] ml-1">Email</label>
                  <input
                    type="email"
                    className="auth-input"
                    placeholder="nom@exemple.com"
                    value={email}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => setEmail(event.target.value)}
                    required
                  />
                </div>

                {mode === "signup" ? (
                  <div className="space-y-1.5">
                    <label className="text-[12px] text-[#555] ml-1">Code de parrainage (facultatif)</label>
                    <input
                      type="text"
                      className="auth-input uppercase"
                      placeholder="ABC123DEF0"
                      value={referralCode}
                      maxLength={16}
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) => setReferralCode(event.target.value.toUpperCase())}
                    />
                  </div>
                ) : null}

                <div className="space-y-1.5">
                  <label className="text-[12px] text-[#555] ml-1">Mot de passe</label>
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
                      {showPassword ? "Masquer" : "Afficher"}
                    </button>
                  </div>
                  {mode === "signup" ? (
                    <>
                      <div className="h-1 rounded bg-[#222] mt-1 overflow-hidden">
                        <div className="h-full transition-all" style={{ width: `${passwordStrength}%`, backgroundColor: strengthMeta.color }} />
                      </div>
                      <p className="text-[10px] text-[#666] mt-1">{strengthMeta.label}</p>
                    </>
                  ) : null}
                </div>

                {mode === "signup" ? (
                  <div className="space-y-1.5">
                    <label className="text-[12px] text-[#555] ml-1">Confirmer le mot de passe</label>
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
                        {showPasswordConfirm ? "Masquer" : "Afficher"}
                      </button>
                    </div>
                  </div>
                ) : null}

                {mode === "signin" ? (
                  <div className="flex items-center justify-end">
                    <Link href="/forgot-password" className="text-[12px] text-[#4F8EF7] hover:underline">
                      Mot de passe oublié ?
                    </Link>
                  </div>
                ) : null}

                <button type="submit" className="btn-primary w-full h-[48px]" disabled={loading}>
                  {loading ? "Chargement..." : mode === "signin" ? "Se connecter" : "Créer mon compte"}
                </button>
              </form>

              <div className="mt-8 pt-8 border-t border-white/[0.05] text-center text-[13px] text-[#666]">
                {mode === "signin" ? (
                  <>
                    Pas encore membre ?{" "}
                    <button
                      type="button"
                      className="text-white font-medium hover:underline"
                      onClick={() => {
                        setMode("signup");
                      }}
                    >
                      Créer un compte
                    </button>
                  </>
                ) : (
                  <>
                    Déjà membre ?{" "}
                    <button
                      type="button"
                      className="text-white font-medium hover:underline"
                      onClick={() => {
                        setMode("signin");
                      }}
                    >
                      Se connecter
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
