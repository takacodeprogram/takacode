"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import logoLight4 from "../assets/logos-light-png/logo-light-4.png";

function getPasswordStrength(password) {
  let score = 0;
  if (password.length >= 8) score += 33;
  if (/[A-Z]/.test(password)) score += 33;
  if (/[0-9!@#$%^&*]/.test(password)) score += 34;
  return Math.min(score, 100);
}

export default function AuthOnboardingPage() {
  const [step, setStep] = useState("login");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerPasswordConfirm, setRegisterPasswordConfirm] = useState("");

  const emailIsValid = useMemo(() => {
    if (!registerEmail) return true;
    return /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(registerEmail);
  }, [registerEmail]);

  const passwordStrength = useMemo(() => getPasswordStrength(registerPassword), [registerPassword]);

  const strengthMeta = useMemo(() => {
    if (passwordStrength <= 33) {
      return { label: "Securite : faible", color: "#ef4444" };
    }
    if (passwordStrength <= 66) {
      return { label: "Securite : moyenne", color: "#f97316" };
    }
    return { label: "Securite : forte", color: "#22c55e" };
  }, [passwordStrength]);

  const passwordMatch = !registerPasswordConfirm || registerPassword === registerPasswordConfirm;
  const onboardingStepIndex = step === "onboarding-1" ? 1 : step === "onboarding-2" ? 2 : step === "onboarding-3" ? 3 : 0;

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center px-6 py-12 relative overflow-hidden text-white">
      <div className="hero-glow w-[600px] h-[600px] bg-blue-500/[0.04] -left-[100px] top-[10%]" />
      <div className="hero-glow w-[500px] h-[500px] bg-violet-500/[0.06] -right-[100px] bottom-[10%]" />

      <div className="fixed top-8 left-8 z-50 animate-fade-up">
        <Link
          href="/"
          id="nav-back-landing"
          className="inline-flex items-center gap-3 rounded-xl border border-white/[0.08] bg-black/30 px-3 py-2 group"
        >
          <span className="w-8 h-8 rounded-lg border border-white/[0.12] bg-white/[0.04] inline-flex items-center justify-center text-[#8ba1ff] group-hover:text-white transition-colors">
            <iconify-icon icon="lucide:arrow-left" style={{ fontSize: "16px" }} />
          </span>
          <img src={logoLight4.src} alt="TakaCode" className="h-11 w-auto opacity-95 transition-opacity group-hover:opacity-100" />
          <span className="text-[11px] font-semibold text-[#666] tracking-widest uppercase group-hover:text-[#9a9a9a] transition-colors">
            Retour au site
          </span>
        </Link>
      </div>

      <div className="fixed bottom-8 right-8 z-50 animate-fade-up-d2 hidden sm:block">
        <Link
          href="/communaute#rejoindre"
          id="nav-discord-link"
          className="flex items-center gap-3 bg-[#5865F2]/10 hover:bg-[#5865F2]/20 border border-[#5865F2]/20 px-4 py-2 rounded-xl transition-all group"
        >
          <iconify-icon icon="ic:baseline-discord" className="text-[#5865F2] text-xl" />
          <span className="text-[11px] font-semibold text-white tracking-wide uppercase">Communaute</span>
        </Link>
      </div>

      <div className="relative z-10 w-full max-w-[1200px] grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="hidden lg:block space-y-10 animate-fade-up">
          <h1 className="font-valorax text-[56px] leading-[0.9] gradient-text-blue">
            TRANSFORME
            <br />
            TES IDEES
            <br />
            EN REALITE
          </h1>

          <p className="text-[#888] text-lg max-w-md font-body-readable">
            L'atelier numerique ou l'on apprend en construisant des projets concrets avec l'IA.
          </p>

          <div className="space-y-6 pt-4">
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0">
                <iconify-icon icon="lucide:zap" className="text-[#4F8EF7] text-xl" />
              </div>
              <div>
                <h3
                  className="text-sm text-white"
                  style={{ fontFamily: "'VENITE', 'Poppins', sans-serif", fontStyle: "italic" }}
                >
                  Workflow IA optimise
                </h3>
                <p
                  className="text-[13px] text-[#555]"
                  style={{ fontFamily: "'VENITE', 'Poppins', sans-serif", fontStyle: "italic" }}
                >
                  Gagne des semaines de travail grace a nos parcours assistes.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center flex-shrink-0">
                <iconify-icon icon="mdi:twitch" className="text-[#9B6DFF] text-xl" />
              </div>
              <div>
                <h3
                  className="text-sm text-white"
                  style={{ fontFamily: "'VENITE', 'Poppins', sans-serif", fontStyle: "italic" }}
                >
                  Sessions live hebdomadaires
                </h3>
                <p
                  className="text-[13px] text-[#555]"
                  style={{ fontFamily: "'VENITE', 'Poppins', sans-serif", fontStyle: "italic" }}
                >
                  Apprends en direct avec des experts sur Twitch et Discord.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-12 border-t border-white/[0.05] max-w-xs">
            <p className="text-[13px] italic text-[#666] mb-4 font-body-readable">
              "TakaCode a change ma vision du dev. J'ai lance mon SaaS en 1 mois."
            </p>
            <div className="flex items-center gap-3">
              <div className="flex">
                <div className="w-8 h-8 rounded-full border-2 border-[#111] bg-gradient-to-br from-blue-400 to-indigo-500" />
                <div className="w-8 h-8 -ml-2.5 rounded-full border-2 border-[#111] bg-gradient-to-br from-violet-400 to-pink-500" />
                <div className="w-8 h-8 -ml-2.5 rounded-full border-2 border-[#111] bg-gradient-to-br from-green-400 to-emerald-500" />
              </div>
              <span className="text-[11px] font-medium text-[#444]">+2 400 membres deja inscrits</span>
            </div>
          </div>
        </div>

        <div className="w-full">
          <div className="bg-[#111] border border-white/[0.07] rounded-3xl p-8 sm:p-10 shadow-2xl relative">
          {step === "login" ? (
            <div className="onboarding-step animate-fade-up">
              <div className="mb-8">
                <span className="text-[11px] font-semibold text-[#4F8EF7] uppercase tracking-widest">Connexion</span>
                <h2 className="font-valorax text-3xl mt-2">BON RETOUR</h2>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <button type="button" id="login-google" className="btn-secondary flex items-center justify-center gap-2 py-3">
                  <iconify-icon icon="logos:google-icon" className="text-lg" />
                  <span className="text-[12px]">Google</span>
                </button>
                <button type="button" id="login-github" className="btn-secondary flex items-center justify-center gap-2 py-3">
                  <iconify-icon icon="logos:github-icon" className="text-lg" />
                  <span className="text-[12px]">GitHub</span>
                </button>
              </div>

              <div className="flex items-center gap-4 mb-8">
                <div className="h-px flex-1 bg-white/[0.05]" />
                <span className="text-[11px] text-[#444] uppercase font-bold">ou</span>
                <div className="h-px flex-1 bg-white/[0.05]" />
              </div>

              <form
                className="space-y-4"
                onSubmit={(event) => {
                  event.preventDefault();
                  if (!loginEmail || !loginPassword) return;
                  setStep("onboarding-1");
                }}
              >
                <div className="space-y-1.5">
                  <label className="text-[12px] text-[#555] ml-1">Email</label>
                  <input
                    id="login-email"
                    type="email"
                    placeholder="nom@exemple.com"
                    className="auth-input"
                    value={loginEmail}
                    onChange={(event) => setLoginEmail(event.target.value)}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[12px] text-[#555] ml-1">Mot de passe</label>
                  <input
                    id="login-password"
                    type="password"
                    placeholder="********"
                    className="auth-input"
                    value={loginPassword}
                    onChange={(event) => setLoginPassword(event.target.value)}
                    required
                  />
                </div>

                <div className="flex items-center justify-between py-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded border-white/10 bg-white/5" />
                    <span className="text-[12px] text-[#888]">Se souvenir de moi</span>
                  </label>
                  <button type="button" className="text-[12px] text-[#4F8EF7] hover:underline">Mot de passe oublie ?</button>
                </div>

                <button type="submit" id="login-btn" className="btn-primary w-full h-[48px]">Se connecter</button>
              </form>

              <div className="mt-8 pt-8 border-t border-white/[0.05] text-center">
                <p className="text-[#555] text-[13px]">
                  Pas encore de compte ?{" "}
                  <button
                    type="button"
                    id="to-register-link"
                    onClick={() => setStep("register")}
                    className="text-white font-medium hover:underline"
                  >
                    S'inscrire gratuitement
                  </button>
                </p>
              </div>
            </div>
          ) : null}

          {step === "register" ? (
            <div className="onboarding-step animate-fade-up">
              <div className="mb-8">
                <span className="text-[11px] font-semibold text-[#9B6DFF] uppercase tracking-widest">Inscription</span>
                <h2 className="font-valorax text-3xl mt-2">CREER UN COMPTE</h2>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <button type="button" className="btn-secondary flex items-center justify-center gap-2 py-3">
                  <iconify-icon icon="logos:google-icon" className="text-lg" />
                  <span className="text-[12px]">Google</span>
                </button>
                <button type="button" className="btn-secondary flex items-center justify-center gap-2 py-3">
                  <iconify-icon icon="logos:github-icon" className="text-lg" />
                  <span className="text-[12px]">GitHub</span>
                </button>
              </div>

              <form
                className="space-y-4"
                onSubmit={(event) => {
                  event.preventDefault();
                  if (!emailIsValid || !passwordMatch || !firstName || !lastName || !registerEmail || !registerPassword) {
                    return;
                  }
                  setStep("onboarding-1");
                }}
              >
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[12px] text-[#555] ml-1">Prenom</label>
                    <input type="text" placeholder="Jean" className="auth-input" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[12px] text-[#555] ml-1">Nom</label>
                    <input type="text" placeholder="Dupont" className="auth-input" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[12px] text-[#555] ml-1">Email professionnel</label>
                  <input
                    type="email"
                    placeholder="jean@entreprise.com"
                    className="auth-input"
                    value={registerEmail}
                    onChange={(event) => setRegisterEmail(event.target.value)}
                    style={!emailIsValid ? { borderColor: "#ef4444" } : undefined}
                    required
                  />
                  {!emailIsValid ? <p className="text-[10px] text-red-500 mt-1">Veuillez entrer un email valide.</p> : null}
                </div>

                <div className="space-y-1.5">
                  <label className="text-[12px] text-[#555] ml-1">Mot de passe</label>
                  <input
                    type="password"
                    placeholder="********"
                    className="auth-input"
                    value={registerPassword}
                    onChange={(event) => setRegisterPassword(event.target.value)}
                    required
                  />
                  <div className="h-1 rounded bg-[#222] mt-1 overflow-hidden">
                    <div className="h-full transition-all" style={{ width: `${passwordStrength}%`, backgroundColor: strengthMeta.color }} />
                  </div>
                  <p className="text-[10px] text-[#444] mt-1">{strengthMeta.label}</p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[12px] text-[#555] ml-1">Confirmer le mot de passe</label>
                  <input
                    type="password"
                    placeholder="********"
                    className="auth-input"
                    value={registerPasswordConfirm}
                    onChange={(event) => setRegisterPasswordConfirm(event.target.value)}
                    required
                  />
                  {!passwordMatch ? <p className="text-[10px] text-red-500 mt-1">Les mots de passe ne correspondent pas.</p> : null}
                </div>

                <button type="submit" id="register-btn" className="btn-primary w-full h-[48px] mt-4">Creer mon profil</button>
              </form>

              <div className="mt-6 pt-6 border-t border-white/[0.05] text-center">
                <p className="text-[#555] text-[13px]">
                  Deja membre ?{" "}
                  <button type="button" onClick={() => setStep("login")} className="text-white font-medium hover:underline">
                    Se connecter
                  </button>
                </p>
              </div>
            </div>
          ) : null}

          {step === "onboarding-1" ? (
            <div className="onboarding-step animate-fade-up">
              <div className="flex items-center justify-between mb-8">
                <div className="flex gap-1.5">
                  {[1, 2, 3].map((index) => (
                    <span
                      key={index}
                      className="h-2 rounded-full transition-all"
                      style={{
                        width: index <= onboardingStepIndex ? "24px" : "8px",
                        background: index <= onboardingStepIndex ? "#4F8EF7" : "rgba(255,255,255,0.1)"
                      }}
                    />
                  ))}
                </div>
                <span className="text-[11px] text-[#555] font-medium">ETAPE 1 SUR 3</span>
              </div>

              <div className="mb-8">
                <h2 className="font-valorax text-2xl mb-3">TON DOMAINE</h2>
                <p className="text-[#666] text-sm">Quel parcours t'interesse aujourd'hui ?</p>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {[
                  ["lucide:code-2", "#4F8EF7", "Developpement web", "SaaS, React, Node.js et APIs."],
                  ["lucide:bot", "#9B6DFF", "IA et automatisation", "Make, n8n et agents intelligents."],
                  ["lucide:bar-chart-3", "#22D3EE", "Data analytics", "Collecte terrain et visualisation."]
                ].map(([icon, color, title, desc], index) => (
                  <button
                    key={title}
                    type="button"
                    className={`w-full text-left bg-[#111] border rounded-2xl p-5 flex items-center gap-4 transition-all ${index === 0 ? "border-blue-500/30 bg-blue-500/5" : "border-white/[0.07] hover:border-blue-500/30 hover:-translate-y-[2px]"}`}
                  >
                    <span className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${color}1A` }}>
                      <iconify-icon icon={icon} style={{ fontSize: "24px", color }} />
                    </span>
                    <span className="flex-1">
                      <span className="font-venite text-[13px] text-white block">{title}</span>
                      <span className="text-[11px] text-[#555]">{desc}</span>
                    </span>
                  </button>
                ))}
              </div>

              <div className="mt-10 flex gap-3">
                <button type="button" className="btn-secondary flex-1" onClick={() => setStep("onboarding-2")}>Passer</button>
                <button type="button" className="btn-primary flex-[2]" onClick={() => setStep("onboarding-2")}>Continuer</button>
              </div>
            </div>
          ) : null}

          {step === "onboarding-2" ? (
            <div className="onboarding-step animate-fade-up">
              <div className="flex items-center justify-between mb-8">
                <div className="flex gap-1.5">
                  {[1, 2, 3].map((index) => (
                    <span
                      key={index}
                      className="h-2 rounded-full transition-all"
                      style={{
                        width: index <= onboardingStepIndex ? "24px" : "8px",
                        background: index <= onboardingStepIndex ? "#4F8EF7" : "rgba(255,255,255,0.1)"
                      }}
                    />
                  ))}
                </div>
                <span className="text-[11px] text-[#555] font-medium">ETAPE 2 SUR 3</span>
              </div>

              <div className="mb-8">
                <h2 className="font-valorax text-2xl mb-3">TON OBJECTIF</h2>
                <p className="text-[#666] text-sm">Que souhaites-tu accomplir ?</p>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {[
                  ["lucide:rocket", "#4F8EF7", "Creer mon premier SaaS", "Lancer un produit fonctionnel."],
                  ["lucide:zap", "#9B6DFF", "Booster ma productivite", "Automatiser les taches repetitives."],
                  ["mdi:twitch", "#22D3EE", "Rejoindre des lives", "Pratiquer en direct chaque semaine."]
                ].map(([icon, color, title, desc]) => (
                  <button
                    key={title}
                    type="button"
                    className="w-full text-left bg-[#111] border border-white/[0.07] rounded-2xl p-5 flex items-center justify-between transition-all hover:border-blue-500/30 hover:-translate-y-[2px]"
                  >
                    <span>
                      <span className="font-venite text-[12px] text-white mb-1 block">{title}</span>
                      <span className="text-[11px] text-[#555]">{desc}</span>
                    </span>
                    <iconify-icon icon={icon} style={{ fontSize: "22px", color }} />
                  </button>
                ))}
              </div>

              <div className="mt-10 flex gap-3">
                <button type="button" className="btn-secondary flex-1" onClick={() => setStep("onboarding-1")}>Retour</button>
                <button type="button" className="btn-primary flex-[2]" onClick={() => setStep("onboarding-3")}>Derniere etape</button>
              </div>
            </div>
          ) : null}

          {step === "onboarding-3" ? (
            <div className="onboarding-step animate-fade-up text-center">
              <div className="w-24 h-24 rounded-full bg-blue-500/10 flex items-center justify-center mx-auto mb-8">
                <iconify-icon icon="lucide:party-popper" style={{ fontSize: "52px", color: "#4F8EF7" }} />
              </div>

              <h2 className="font-valorax text-3xl mb-4">C'EST PRET</h2>
              <p className="text-[#888] text-sm max-w-xs mx-auto mb-10 font-body-readable">
                Tes preferences sont enregistrees. Bienvenue dans l'aventure TakaCode.
              </p>

              <div className="bg-[#151515] p-6 rounded-2xl border border-white/[0.05] text-left flex items-center gap-4 mb-8">
                <div className="flex flex-shrink-0">
                  <div className="w-8 h-8 rounded-full border-2 border-[#111] bg-gradient-to-br from-blue-400 to-indigo-500" />
                  <div className="w-8 h-8 -ml-2.5 rounded-full border-2 border-[#111] bg-gradient-to-br from-violet-400 to-pink-500" />
                </div>
                <div>
                  <div className="text-[13px] font-semibold">Session live</div>
                  <div className="text-[11px] text-[#555]">Prochain meet : Demain 20h00</div>
                </div>
                <iconify-icon icon="lucide:calendar" className="ml-auto text-[#4F8EF7]" />
              </div>

              <Link href="/dashboard" id="finish-flow-btn" className="btn-primary w-full h-[52px] inline-flex items-center justify-center">
                Acceder au dashboard
              </Link>
            </div>
          ) : null}
        </div>
        </div>
      </div>
    </div>
  );
}



