"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../utils/supabase/client";

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

export default function ResetPasswordPage() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [infoMessage, setInfoMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const strength = getPasswordStrength(password);
  const strengthMeta = getStrengthMeta(strength);

  useEffect(() => {
    let isMounted = true;

    async function verifySession() {
      const {
        data: { session }
      } = await supabase.auth.getSession();

      if (!session && isMounted) {
        setInfoMessage("Ouvre cette page depuis le lien recu par email pour reinitialiser ton mot de passe.");
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
      setErrorMessage("Mot de passe trop faible. Utilise au moins 10 caracteres avec majuscule, chiffre et symbole.");
      return;
    }

    setLoading(true);
    setErrorMessage("");
    setInfoMessage("");

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setErrorMessage(error.message);
      setLoading(false);
      return;
    }

    await supabase.auth.signOut();
    router.replace("/signin?reset=success");
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white px-6 py-20 md:py-24 flex items-center justify-center">
      <div className="w-full max-w-[560px] bg-[#111] border border-white/[0.07] rounded-3xl p-8 sm:p-10">
        <div className="section-label mb-4">SECURITE</div>
        <h1 className="font-valorax text-[34px] mb-4">NOUVEAU MOT DE PASSE</h1>
        <p className="font-body-readable text-[14px] text-[#888] leading-relaxed mb-8">
          Definis un mot de passe fort puis reconnecte-toi.
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
            <input
              type="password"
              className="auth-input"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="********"
              required
            />
            <div className="h-1 rounded bg-[#222] mt-1 overflow-hidden">
              <div className="h-full transition-all" style={{ width: `${strength}%`, backgroundColor: strengthMeta.color }} />
            </div>
            <p className="text-[10px] text-[#666] mt-1">{strengthMeta.label}</p>
          </div>

          <div className="space-y-1.5">
            <label className="text-[12px] text-[#555] ml-1">Confirmer le mot de passe</label>
            <input
              type="password"
              className="auth-input"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              placeholder="********"
              required
            />
          </div>

          <button type="submit" className="btn-primary w-full h-[48px]" disabled={loading}>
            {loading ? "Mise a jour..." : "Mettre a jour"}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-white/[0.05] text-[13px]">
          <Link href="/signin" className="text-[#888] hover:text-white transition-colors">
            Retour a la connexion
          </Link>
        </div>
      </div>
    </main>
  );
}