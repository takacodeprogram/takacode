"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { createClient } from "../../utils/supabase/client";

export default function ForgotPasswordPage() {
  const supabase = useMemo(() => createClient(), []);
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [infoMessage, setInfoMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setErrorMessage("");
    setInfoMessage("");

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    });

    if (error) {
      setErrorMessage(error.message);
      setLoading(false);
      return;
    }

    setInfoMessage("Email envoye. Verifie ta boite de reception pour reinitialiser le mot de passe.");
    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white px-6 py-20 md:py-24 flex items-center justify-center">
      <div className="w-full max-w-[520px] bg-[#111] border border-white/[0.07] rounded-3xl p-8 sm:p-10">
        <div className="section-label mb-4">SECURITE</div>
        <h1 className="font-valorax text-[34px] mb-4">MOT DE PASSE OUBLIE</h1>
        <p className="font-body-readable text-[14px] text-[#888] leading-relaxed mb-8">
          Saisis ton email. On t'enverra un lien pour definir un nouveau mot de passe.
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

        <div className="mt-8 pt-6 border-t border-white/[0.05] flex items-center justify-between text-[13px]">
          <Link href="/signin" className="text-[#888] hover:text-white transition-colors">
            Retour a la connexion
          </Link>
          <Link href="/signup" className="text-[#4F8EF7] hover:underline">
            Creer un compte
          </Link>
        </div>
      </div>
    </main>
  );
}