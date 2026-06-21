"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { createClient } from "../../utils/supabase/client";

export default function ForgotPasswordPage() {
  const supabase = useMemo(() => createClient(), []);
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setErrorMessage("");

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    });

    if (error) {
      setErrorMessage(error.message);
      setLoading(false);
      return;
    }

    setEmailSent(true);
    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white px-6 py-20 md:py-24 flex items-center justify-center">
      <div className="w-full max-w-[560px] bg-[#111] border border-white/[0.07] rounded-3xl p-8 sm:p-10">
        <div className="section-label mb-4">{emailSent ? "EMAIL ENVOYE" : "RECUPERATION"}</div>
        <h1 className="font-valorax text-[34px] mb-4">{emailSent ? "VERIFIE TA BOITE DE RECEPTION" : "BESOIN D'UN NOUVEAU MOT DE PASSE ?"}</h1>

        {emailSent ? (
          <>
            <p className="font-body-readable text-[14px] text-[#888] leading-relaxed mb-3">
              Nous venons de t'envoyer un lien pour reinitialiser ton mot de passe.
            </p>
            <p className="font-body-readable text-[14px] text-[#888] leading-relaxed mb-8">
              Tu pourras bientot reprendre ton parcours et continuer a construire.
            </p>
          </>
        ) : (
          <>
            <p className="font-body-readable text-[14px] text-[#888] leading-relaxed mb-6">
              Pas d'inquietude. Indique ton adresse email et nous t'enverrons un lien pour retrouver ton espace TakaCode.
            </p>
            <div className="mb-8 rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 py-3">
              <div className="text-[12px] text-white font-medium mb-1">Tes projets t'attendent</div>
              <p className="text-[12px] text-[#777] font-body-readable">Reviens continuer ce que tu as commence.</p>
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
              <label className="text-[12px] text-[#555] ml-1">Email</label>
              <input
                type="email"
                className="auth-input"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="nom@exemple.com"
                required
              />
            </div>

            <button type="submit" className="btn-primary w-full h-[48px]" disabled={loading}>
              {loading ? "Envoi..." : "Envoyer le lien"}
            </button>
          </form>
        ) : null}

        <div className="mt-8 pt-6 border-t border-white/[0.05] flex items-center justify-between text-[13px]">
          <Link href="/signin" className="text-[#888] hover:text-white transition-colors">
            Retour a la connexion
          </Link>

          {emailSent ? (
            <button
              type="button"
              className="text-[#4F8EF7] hover:underline"
              onClick={() => {
                setEmailSent(false);
                setErrorMessage("");
              }}
            >
              Renvoyer un lien
            </button>
          ) : (
            <Link href="/signup" className="text-[#4F8EF7] hover:underline">
              Creer un compte
            </Link>
          )}
        </div>
      </div>
    </main>
  );
}
