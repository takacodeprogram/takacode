"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "../utils/supabase/client";

const AUTH_ERROR_MESSAGES = {
  forbidden: "Ton compte ne dispose pas du role requis pour acceder au dashboard.",
  oauth_callback_failed: "La connexion OAuth a echoue. Reessaie.",
  oauth_code_missing: "Code OAuth manquant. Relance la connexion.",
  oauth_denied: "Connexion OAuth annulee ou refusee."
};

function sanitizeNextPath(value) {
  if (typeof value !== "string") {
    return "/dashboard";
  }

  if (!value.startsWith("/") || value.startsWith("//")) {
    return "/dashboard";
  }

  return value;
}

function getPasswordStrength(password) {
  let score = 0;
  if (password.length >= 10) score += 25;
  if (/[a-z]/.test(password)) score += 20;
  if (/[A-Z]/.test(password)) score += 20;
  if (/[0-9]/.test(password)) score += 20;
  if (/[^a-zA-Z0-9]/.test(password)) score += 15;
  return Math.min(score, 100);
}

function getStrengthMeta(score) {
  if (score < 45) {
    return { label: "Securite faible", color: "#ef4444" };
  }

  if (score < 75) {
    return { label: "Securite moyenne", color: "#f97316" };
  }

  return { label: "Securite forte", color: "#22c55e" };
}

function buildOAuthRedirect(nextPath) {
  const url = new URL("/auth/callback", window.location.origin);
  if (nextPath && nextPath !== "/dashboard") {
    url.searchParams.set("next", nextPath);
  }
  return url.toString();
}

export default function AuthOnboardingPage({ initialMode = "signin" }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = useMemo(() => createClient(), []);

  const nextPath = sanitizeNextPath(searchParams.get("next"));
  const queryError = searchParams.get("error");
  const resetSuccess = searchParams.get("reset") === "success";

  const [mode, setMode] = useState(initialMode === "signup" ? "signup" : "signin");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [infoMessage, setInfoMessage] = useState("");

  const passwordStrength = getPasswordStrength(password);
  const strengthMeta = getStrengthMeta(passwordStrength);

  const activeErrorMessage = errorMessage || (queryError ? AUTH_ERROR_MESSAGES[queryError] ?? "Erreur d'authentification." : "");
  const activeInfoMessage = infoMessage || (resetSuccess ? "Mot de passe mis a jour. Connecte-toi avec le nouveau mot de passe." : "");

  async function handleOAuth(provider) {
    setLoading(true);
    setErrorMessage("");
    setInfoMessage("");

    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: buildOAuthRedirect(nextPath)
      }
    });

    if (error) {
      setErrorMessage(error.message);
      setLoading(false);
      return;
    }

    // Browser is redirected by Supabase for OAuth.
  }

  async function handleWalletLogin() {
    setLoading(true);
    setErrorMessage("");
    setInfoMessage("");

    const { error } = await supabase.auth.signInWithWeb3({
      chain: "ethereum",
      statement: "Connexion a TakaCode"
    });

    if (error) {
      setErrorMessage(error.message);
      setLoading(false);
      return;
    }

    router.push(nextPath);
    router.refresh();
  }

  async function handleSignIn(event) {
    event.preventDefault();

    setLoading(true);
    setErrorMessage("");
    setInfoMessage("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      setErrorMessage(error.message);
      setLoading(false);
      return;
    }

    router.push(nextPath);
    router.refresh();
  }

  async function handleSignUp(event) {
    event.preventDefault();

    if (password !== passwordConfirm) {
      setErrorMessage("Les mots de passe ne correspondent pas.");
      return;
    }

    if (passwordStrength < 75) {
      setErrorMessage("Utilise un mot de passe plus fort (min 10 caracteres, majuscule, chiffre, symbole).");
      return;
    }

    setLoading(true);
    setErrorMessage("");
    setInfoMessage("");

    const emailRedirectTo = buildOAuthRedirect(nextPath);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo,
        data: {
          first_name: firstName,
          last_name: lastName,
          role: "user"
        }
      }
    });

    if (error) {
      setErrorMessage(error.message);
      setLoading(false);
      return;
    }

    if (data.session) {
      router.push(nextPath);
      router.refresh();
      return;
    }

    setInfoMessage("Compte cree. Verifie ton email pour confirmer l'inscription.");
    setLoading(false);
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
            <h1 className="font-valorax text-[56px] leading-[0.9] gradient-text-blue">
              ACCEDE
              <br />
              A TON
              <br />
              ESPACE
            </h1>

            <p className="text-[#888] text-lg max-w-md font-body-readable">
              Connexion email, OAuth Google/GitHub et wallet Ethereum, avec un dashboard protege par role utilisateur.
            </p>

            <div className="space-y-5 pt-4">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0">
                  <iconify-icon icon="lucide:shield-check" className="text-[#4F8EF7] text-xl" />
                </div>
                <div>
                  <h3 className="text-sm text-white font-venite-italic">Acces securise</h3>
                  <p className="text-[13px] text-[#555] font-body-readable">Auth Supabase + controle de role avant dashboard.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center flex-shrink-0">
                  <iconify-icon icon="lucide:key-round" className="text-[#9B6DFF] text-xl" />
                </div>
                <div>
                  <h3 className="text-sm text-white font-venite-italic">Recuperation mot de passe</h3>
                  <p className="text-[13px] text-[#555] font-body-readable">Flux complet: forgot password + reset password.</p>
                </div>
              </div>
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

              <div className="grid grid-cols-2 gap-3 mb-4">
                <button
                  type="button"
                  className="btn-secondary flex items-center justify-center gap-2 py-3"
                  disabled={loading}
                  onClick={() => handleOAuth("google")}
                >
                  <iconify-icon icon="logos:google-icon" className="text-lg" />
                  <span className="text-[12px]">Google</span>
                </button>

                <button
                  type="button"
                  className="btn-secondary flex items-center justify-center gap-2 py-3"
                  disabled={loading}
                  onClick={() => handleOAuth("github")}
                >
                  <iconify-icon icon="logos:github-icon" className="text-lg" />
                  <span className="text-[12px]">GitHub</span>
                </button>
              </div>

              <button
                type="button"
                className="btn-secondary w-full flex items-center justify-center gap-2 py-3 mb-8"
                disabled={loading}
                onClick={handleWalletLogin}
              >
                <iconify-icon icon="lucide:wallet" className="text-lg" />
                <span className="text-[12px]">Wallet Ethereum</span>
              </button>

              <div className="flex items-center gap-4 mb-8">
                <div className="h-px flex-1 bg-white/[0.05]" />
                <span className="text-[11px] text-[#444] uppercase font-bold">ou</span>
                <div className="h-px flex-1 bg-white/[0.05]" />
              </div>

              {activeErrorMessage ? (
                <div className="mb-4 rounded-xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-[12px] text-red-300">
                  {activeErrorMessage}
                </div>
              ) : null}

              {activeInfoMessage ? (
                <div className="mb-4 rounded-xl border border-blue-500/25 bg-blue-500/10 px-4 py-3 text-[12px] text-blue-200">
                  {activeInfoMessage}
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
                        onChange={(event) => setFirstName(event.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[12px] text-[#555] ml-1">Nom</label>
                      <input
                        type="text"
                        className="auth-input"
                        value={lastName}
                        onChange={(event) => setLastName(event.target.value)}
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
                    onChange={(event) => setEmail(event.target.value)}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[12px] text-[#555] ml-1">Mot de passe</label>
                  <input
                    type="password"
                    className="auth-input"
                    placeholder="********"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                  />
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
                    <input
                      type="password"
                      className="auth-input"
                      placeholder="********"
                      value={passwordConfirm}
                      onChange={(event) => setPasswordConfirm(event.target.value)}
                      required
                    />
                  </div>
                ) : null}

                {mode === "signin" ? (
                  <div className="flex items-center justify-end">
                    <Link href="/forgot-password" className="text-[12px] text-[#4F8EF7] hover:underline">
                      Mot de passe oublie ?
                    </Link>
                  </div>
                ) : null}

                <button type="submit" className="btn-primary w-full h-[48px]" disabled={loading}>
                  {loading ? "Chargement..." : mode === "signin" ? "Se connecter" : "Creer mon compte"}
                </button>
              </form>

              <div className="mt-8 pt-8 border-t border-white/[0.05] text-center text-[13px] text-[#666]">
                {mode === "signin" ? (
                  <>
                    Pas encore de compte ?{" "}
                    <button
                      type="button"
                      className="text-white font-medium hover:underline"
                      onClick={() => {
                        setMode("signup");
                        setErrorMessage("");
                        setInfoMessage("");
                      }}
                    >
                      S'inscrire
                    </button>
                  </>
                ) : (
                  <>
                    Deja membre ?{" "}
                    <button
                      type="button"
                      className="text-white font-medium hover:underline"
                      onClick={() => {
                        setMode("signin");
                        setErrorMessage("");
                        setInfoMessage("");
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