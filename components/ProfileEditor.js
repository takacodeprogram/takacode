"use client";

import { useMemo, useState } from "react";
import { createClient } from "../utils/supabase/client";

const SOCIAL_FIELDS = [
  { key: "github", label: "GitHub", placeholder: "https://github.com/toi", icon: "lucide:github" },
  { key: "linkedin", label: "LinkedIn", placeholder: "https://linkedin.com/in/toi", icon: "lucide:linkedin" },
  { key: "website", label: "Site web", placeholder: "https://ton-site.com", icon: "lucide:globe" },
  { key: "twitter", label: "X / Twitter", placeholder: "https://x.com/toi", icon: "lucide:twitter" }
];

function cleanUrl(value) {
  const trimmed = String(value || "").trim();
  if (!trimmed) {
    return "";
  }
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

export default function ProfileEditor({ initialBio = "", initialSocials = {}, initialSkills = [] }) {
  const supabase = useMemo(() => createClient(), []);

  const [bio, setBio] = useState(initialBio || "");
  const [socials, setSocials] = useState(() => {
    const base = {};
    for (const field of SOCIAL_FIELDS) {
      base[field.key] = typeof initialSocials?.[field.key] === "string" ? initialSocials[field.key] : "";
    }
    return base;
  });
  const [skillsInput, setSkillsInput] = useState(Array.isArray(initialSkills) ? initialSkills.join(", ") : "");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSave() {
    setSaving(true);
    setMessage("");
    setError("");

    const cleanedSocials = {};
    for (const field of SOCIAL_FIELDS) {
      const url = cleanUrl(socials[field.key]);
      if (url) {
        cleanedSocials[field.key] = url;
      }
    }

    const skills = skillsInput
      .split(/[\n,]/)
      .map((item) => item.trim())
      .filter(Boolean)
      .slice(0, 20);

    const { data, error: rpcError } = await supabase.rpc("update_my_profile", {
      p_bio: bio,
      p_socials: cleanedSocials,
      p_skills: skills
    });

    if (rpcError || data?.error) {
      setError(
        rpcError?.message?.includes("function")
          ? "Fonction de profil absente. Lance supabase/sql/007_user_profile_fields.sql."
          : rpcError?.message || "Impossible d'enregistrer le profil."
      );
      setSaving(false);
      return;
    }

    setMessage("Profil enregistre.");
    setSaving(false);
  }

  return (
    <section className="rounded-2xl border border-white/[0.08] bg-[#111] p-5 space-y-4">
      <h2 className="font-venite text-[13px] tracking-widest text-[#888]">EDITER MON PROFIL</h2>

      <div>
        <label className="text-[11px] text-[#8d8d8d] uppercase tracking-widest font-semibold">Bio</label>
        <textarea
          value={bio}
          onChange={(event) => setBio(event.target.value)}
          rows={4}
          maxLength={600}
          placeholder="Presente-toi en quelques lignes: ton objectif, ton projet, ton parcours..."
          className="mt-1.5 w-full rounded-lg border border-white/[0.08] bg-[#0f0f0f] px-3 py-2.5 font-body-readable text-[12px] text-[#d0d0d0] leading-relaxed placeholder:text-[#555] focus:outline-none focus:border-blue-400/40"
        />
      </div>

      <div>
        <label className="text-[11px] text-[#8d8d8d] uppercase tracking-widest font-semibold">Reseaux</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-1.5">
          {SOCIAL_FIELDS.map((field) => (
            <div key={field.key} className="flex items-center gap-2 rounded-lg border border-white/[0.08] bg-[#0f0f0f] px-2.5">
              <iconify-icon icon={field.icon} style={{ fontSize: "14px", color: "#7f7f7f" }} />
              <input
                value={socials[field.key]}
                onChange={(event) => setSocials((current) => ({ ...current, [field.key]: event.target.value }))}
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
          onChange={(event) => setSkillsInput(event.target.value)}
          placeholder="HTML, CSS, React, Supabase (separees par des virgules)"
          className="mt-1.5 w-full rounded-lg border border-white/[0.08] bg-[#0f0f0f] px-3 py-2.5 font-body-readable text-[12px] text-[#d0d0d0] placeholder:text-[#555] focus:outline-none focus:border-blue-400/40"
        />
      </div>

      {error ? (
        <div className="rounded-xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-[12px] text-red-200">{error}</div>
      ) : null}
      {message ? (
        <div className="rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-4 py-3 text-[12px] text-emerald-200">{message}</div>
      ) : null}

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
