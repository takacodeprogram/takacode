"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toAuthErrorMessage } from "../lib/authErrors";
import { createClient } from "../utils/supabase/client";

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

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [infoMessage, setInfoMessage] = useState("");
  const [loading, setLoading] = useState(false);

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
          setInfoMessage("Ouvre cette page depuis le lien recu par email pour choisir ton nouveau mot de passe.");
        }
      } catch {
        if (isMounted) {
          setInfoMessage("Impossible de verifier la session. Recharge la page depuis le lien recu par email.");
        }
      }
    }

    verifySession();

    return () => {
      isMounted = false;
    };
  }, [supabase]);

  async function handleSubmit(event) {
    event.preventDefault();

    if (password !== confirmPassword) {
      setErrorMessage("Les mots de passe ne correspondent pas.");
      return;
    }

    if (strength < 75) {
      setErrorMessage("Choisis un mot de passe plus solide (min 10 caracteres, majuscule, chiffre, symbole).");
      return;
    }

    setLoading(true);
    setErrorMessage("");
    setInfoMessage("");

    try {
      const { error } = await supabase.auth.updateUser({ password });

      if (error) {
        setErrorMessage(toAuthErrorMessage(error, "Impossible de mettre a jour le mot de passe."));
        return;
      }

      await supabase.auth.signOut();
      router.replace("/signin?reset=success");
      router.refresh();
    } catch {
      setErrorMessage("Probleme reseau. Reessaie dans un instant.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white px-6 py-20 md:py-24 flex items-center justify-center">
      <div className="w-full max-w-[560px] bg-[#111] border border-white/[0.07] rounded-3xl p-8 sm:p-10">
        <div className="section-label mb-4">NOUVEAU MOT DE PASSE</div>
        <h1 className="font-valorax text-[34px] mb-4">PRET A REPRENDRE ?</h1>
        <p className="font-body-readable text-[14px] text-[#888] leading-relaxed mb-8">
          Choisis un nouveau mot de passe pour retrouver ton espace et poursuivre tes projets.
        </p>

        {errorMessage ? (
          <div className="mb-4 rounded-xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-[12px] text-red-300">
            {errorMessage}
          </div>
        ) : null}

        {infoMessage ? (
          <div className="mb-4 rounded-xl border border-blue-500/25 bg-blue-500/10 px-4 py-3 text-[12px] text-blue-200">
            {infoMessage}
          </div>
        ) : null}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-1.5">
            <label className="text-[12px] text-[#555] ml-1">Nouveau mot de passe</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className="auth-input pr-[92px]"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="********"
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
            <div className="h-1 rounded bg-[#222] mt-1 overflow-hidden">
              <div className="h-full transition-all" style={{ width: `${strength}%`, backgroundColor: strengthMeta.color }} />
            </div>
            <p className="text-[10px] text-[#666] mt-1">{strengthMeta.label}</p>
          </div>

          <div className="space-y-1.5">
            <label className="text-[12px] text-[#555] ml-1">Confirmer le mot de passe</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                className="auth-input pr-[92px]"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="********"
                required
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-[11px] text-[#8FA8FF] hover:text-white transition-colors"
                onClick={() => setShowConfirmPassword((current) => !current)}
              >
                {showConfirmPassword ? "Masquer" : "Afficher"}
              </button>
            </div>
          </div>

          <button type="submit" className="btn-primary w-full h-[48px]" disabled={loading}>
            {loading ? "Mise a jour..." : "Reprendre mon parcours"}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-white/[0.05] text-[13px] flex items-center justify-between">
          <Link href="/signin" className="text-[#888] hover:text-white transition-colors">
            Retour a la connexion
          </Link>
          <Link href="/forgot-password" className="text-[#4F8EF7] hover:underline">
            Nouveau lien
          </Link>
        </div>
      </div>
    </main>
  );
}
