"use client";

import { useMemo, useState } from "react";
import { createClient } from "../utils/supabase/client";
import { AVATAR_STYLES, dicebearUrl } from "../lib/avatar";
import { COUNTRY_OPTIONS } from "../lib/leaderboard";
import { generateUsername } from "../lib/username";
import { playPop } from "../components/effects/sound";

interface ProfileEditorProps {
  initialBio?: string;
  initialSocials?: Record<string, string>;
  initialSkills?: string[];
  initialAvatarUrl?: string;
  initialPublicName?: string;
  initialCountryCode?: string;
  realName?: string;
  seedBase?: string;
}

const SOCIAL_FIELDS: { key: string; label: string; placeholder: string; icon: string }[] = [
  { key: "github", label: "GitHub", placeholder: "https://github.com/toi", icon: "lucide:github" },
  { key: "linkedin", label: "LinkedIn", placeholder: "https://linkedin.com/in/toi", icon: "lucide:linkedin" },
  { key: "website", label: "Site web", placeholder: "https://ton-site.com", icon: "lucide:globe" },
  { key: "twitter", label: "X / Twitter", placeholder: "https://x.com/toi", icon: "lucide:twitter" }
];

function cleanUrl(value: string): string {
  const trimmed = String(value || "").trim();
  if (!trimmed) return "";
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

export default function ProfileEditor({
  initialBio = "",
  initialSocials = {},
  initialSkills = [],
  initialAvatarUrl = "",
  initialPublicName = "",
  initialCountryCode = "",
  realName = "",
  seedBase = "takacode"
}: ProfileEditorProps) {
  const supabase = useMemo(() => createClient(), []);

  const [avatarUrl, setAvatarUrl] = useState<string>(initialAvatarUrl || "");
  const [publicName, setPublicName] = useState<string>(initialPublicName || "");
  const [nameMode, setNameMode] = useState<string>(() => {
    if (initialPublicName && realName && initialPublicName.trim() === realName.trim()) return "real";
    if (initialPublicName) return "custom";
    return "generate";
  });
  const [shuffle, setShuffle] = useState<number>(0);
  const [bio, setBio] = useState<string>(initialBio || "");
  const [socials, setSocials] = useState<Record<string, string>>(() => {
    const base: Record<string, string> = {};
    for (const field of SOCIAL_FIELDS) {
      base[field.key] = typeof initialSocials?.[field.key] === "string" ? initialSocials[field.key] : "";
    }
    return base;
  });
  const [countryCode, setCountryCode] = useState<string>(initialCountryCode || "");
  const [skillsInput, setSkillsInput] = useState<string>(Array.isArray(initialSkills) ? initialSkills.join(", ") : "");
  const [saving, setSaving] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");

  const seed = `${(publicName || seedBase || "takacode").trim()}-${shuffle}`;
  const avatarOptions = useMemo(
    () => AVATAR_STYLES.map((style: string) => ({ style, url: dicebearUrl(style, seed) })),
    [seed]
  );

  function selectNameMode(mode: string) {
    setNameMode(mode);
    if (mode === "generate") {
      setPublicName(generateUsername());
    } else if (mode === "real") {
      setPublicName((realName || "").trim());
    } else if (mode === "custom") {
      setPublicName("");
    }
  }

  async function handleSave() {
    setSaving(true);
    setMessage("");
    setError("");

    const cleanedSocials: Record<string, string> = {};
    for (const field of SOCIAL_FIELDS) {
      const url = cleanUrl(socials[field.key]);
      if (url) cleanedSocials[field.key] = url;
    }
    const skills = skillsInput.split(/[\n,]/).map((s) => s.trim()).filter(Boolean).slice(0, 20);

    const { data, error: rpcError } = await supabase.rpc("update_my_profile", {
      p_bio: bio,
      p_socials: cleanedSocials,
      p_skills: skills,
      p_avatar_url: avatarUrl,
      p_public_name: publicName.trim(),
      p_country_code: countryCode
    });

    if (rpcError || (data && typeof data === "object" && "error" in data && data.error)) {
      setError(
        rpcError?.message?.includes("function")
          ? "Fonction de profil absente. Lance supabase/sql/012_profile_public.sql."
          : rpcError?.message || "Impossible d'enregistrer le profil."
      );
      setSaving(false);
      return;
    }

    setMessage("Profil enregistré.");
    playPop();
    setSaving(false);
  }

  return (
    <section className="rounded-2xl border border-white/[0.08] bg-[#111] p-5 space-y-5">
      <h2 className="font-venite text-[13px] tracking-widest text-[#888]">EDITER MON PROFIL</h2>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-[11px] text-[#8d8d8d] uppercase tracking-widest font-semibold">Avatar</label>
          <button type="button" onClick={() => setShuffle((s) => s + 1)} className="text-[11px] text-[#4F8EF7] hover:underline inline-flex items-center gap-1">
            <iconify-icon icon="lucide:dices" style={{ fontSize: "12px" }} />
            Autres propositions
          </button>
        </div>
        <div className="flex flex-wrap gap-2.5">
          {avatarOptions.map((option: { style: string; url: string }) => {
            const selected = avatarUrl === option.url;
            return (
              <button
                key={option.style}
                type="button"
                onClick={() => setAvatarUrl(option.url)}
                className={`h-14 w-14 rounded-full border overflow-hidden bg-white/[0.03] ${selected ? "border-[#4F8EF7] ring-2 ring-blue-500/30" : "border-white/[0.1] hover:border-white/[0.25]"}`}
                title={option.style}
              >
                <img src={option.url} alt={option.style} className="h-full w-full object-cover" />
              </button>
            );
          })}
          {avatarUrl ? (
            <button
              type="button"
              onClick={() => setAvatarUrl("")}
              className="h-14 w-14 rounded-full border border-white/[0.1] text-[#888] hover:text-white flex items-center justify-center"
              title="Retirer l'avatar"
            >
              <iconify-icon icon="lucide:user-x" style={{ fontSize: "18px" }} />
            </button>
          ) : null}
        </div>
      </div>

      <div>
        <label className="text-[11px] text-[#8d8d8d] uppercase tracking-widest font-semibold">Nom public (leaderboard)</label>
        <div className="flex flex-wrap gap-1.5 mt-1.5 mb-2">
          {[
            { key: "generate", label: "Generer un pseudo" },
            { key: "custom", label: "Ecrire le mien" },
            ...(realName ? [{ key: "real", label: "Mon vrai nom" }] : [])
          ].map((opt: { key: string; label: string }) => (
            <button
              key={opt.key}
              type="button"
              onClick={() => selectNameMode(opt.key)}
              className={`text-[11px] rounded-lg border px-2.5 py-1.5 transition-colors ${
                nameMode === opt.key
                  ? "border-blue-500/35 bg-blue-500/15 text-blue-100"
                  : "border-white/[0.1] bg-white/[0.02] text-[#bbb] hover:bg-white/[0.05]"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <input
            value={publicName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPublicName(e.target.value)}
            maxLength={40}
            disabled={nameMode === "real"}
            placeholder={nameMode === "generate" ? "Pseudo genere" : "Ton pseudo public (sinon: Membre anonyme)"}
            className="flex-1 rounded-lg border border-white/[0.08] bg-[#0f0f0f] px-3 py-2.5 font-body-readable text-[12px] text-[#d0d0d0] placeholder:text-[#555] focus:outline-none focus:border-blue-400/40 disabled:opacity-60"
          />
          {nameMode === "generate" ? (
            <button
              type="button"
              onClick={() => setPublicName(generateUsername())}
              className="btn-secondary inline-flex items-center gap-1.5 text-[12px] shrink-0"
              style={{ padding: "9px 12px" }}
            >
              <iconify-icon icon="lucide:dices" style={{ fontSize: "13px" }} />
              Regenerer
            </button>
          ) : null}
        </div>
        {nameMode === "real" ? (
          <p className="text-[10px] text-[#777] font-body-readable mt-1.5">Ton vrai nom sera affiche publiquement sur le classement.</p>
        ) : null}
      </div>

      <div>
        <label className="text-[11px] text-[#8d8d8d] uppercase tracking-widest font-semibold">Bio</label>
        <textarea
          value={bio}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setBio(e.target.value)}
          rows={4}
          maxLength={600}
          placeholder="Présente-toi: ton objectif, ton projet, ton parcours..."
          className="mt-1.5 w-full rounded-lg border border-white/[0.08] bg-[#0f0f0f] px-3 py-2.5 font-body-readable text-[12px] text-[#d0d0d0] leading-relaxed placeholder:text-[#555] focus:outline-none focus:border-blue-400/40"
        />
      </div>

      <div>
        <label className="text-[11px] text-[#8d8d8d] uppercase tracking-widest font-semibold">Pays (leaderboard)</label>
        <select
          value={countryCode}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setCountryCode(e.target.value)}
          className="mt-1.5 w-full rounded-lg border border-white/[0.08] bg-[#0f0f0f] px-3 py-2.5 font-body-readable text-[12px] text-[#d0d0d0] focus:outline-none focus:border-blue-400/40"
        >
          {COUNTRY_OPTIONS.map((opt: { code: string; label: string }) => (
            <option key={opt.code} value={opt.code}>{opt.label}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-[11px] text-[#8d8d8d] uppercase tracking-widest font-semibold">Reseaux</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-1.5">
          {SOCIAL_FIELDS.map((field: { key: string; label: string; placeholder: string; icon: string }) => (
            <div key={field.key} className="flex items-center gap-2 rounded-lg border border-white/[0.08] bg-[#0f0f0f] px-2.5">
              <iconify-icon icon={field.icon} style={{ fontSize: "14px", color: "#7f7f7f" }} />
              <input
                value={socials[field.key]}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSocials((c) => ({ ...c, [field.key]: e.target.value }))}
                placeholder={field.placeholder}
                className="flex-1 bg-transparent py-2.5 font-body-readable text-[12px] text-[#d0d0d0] placeholder:text-[#555] focus:outline-none"
              />
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className="text-[11px] text-[#8d8d8d] uppercase tracking-widest font-semibold">Competences</label>
        <input
          value={skillsInput}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSkillsInput(e.target.value)}
          placeholder="HTML, CSS, React, Supabase (séparées par des virgules)"
          className="mt-1.5 w-full rounded-lg border border-white/[0.08] bg-[#0f0f0f] px-3 py-2.5 font-body-readable text-[12px] text-[#d0d0d0] placeholder:text-[#555] focus:outline-none focus:border-blue-400/40"
        />
      </div>

      {error ? <div className="rounded-xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-[12px] text-red-200">{error}</div> : null}
      {message ? <div className="rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-4 py-3 text-[12px] text-emerald-200">{message}</div> : null}

      <button
        type="button"
        onClick={handleSave}
        disabled={saving}
        className={`btn-primary inline-flex items-center gap-2 text-[12px] ${saving ? "opacity-50 cursor-not-allowed" : ""}`}
        style={{ padding: "10px 18px" }}
      >
        {saving ? "Enregistrement..." : "Enregistrer"}
        <iconify-icon icon="lucide:save" style={{ fontSize: "13px" }} />
      </button>
    </section>
  );
}
