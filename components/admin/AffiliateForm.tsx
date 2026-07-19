"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../utils/supabase/client";
import { AFFILIATE_CATEGORIES } from "../../lib/affiliate";
import type { AffiliateCategory } from "../../lib/affiliate";

interface AffiliateLinkData {
  id: string;
  provider?: string;
  category?: string;
  title?: string;
  description?: string;
  url?: string;
  logoUrl?: string;
  sortOrder?: number;
  isPublished?: boolean;
  trackSlug?: string;
}

interface AffiliateFormProps {
  link?: AffiliateLinkData | null;
}

const INPUT = "auth-input text-[12px] w-full";

function cleanUrl(value: string): string {
  const trimmed = String(value || "").trim();
  if (!trimmed) return "";
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-[10px] text-[#8d8d8d] uppercase tracking-widest font-semibold">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}

export default function AffiliateForm({ link = null }: AffiliateFormProps) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const isEdit = Boolean(link);

  const [form, setForm] = useState<Record<string, string | boolean>>(() => ({
    provider: link?.provider || "",
    category: link?.category || "outil",
    title: link?.title || "",
    description: link?.description || "",
    url: link?.url || "",
    logo_url: link?.logoUrl || "",
    sort_order: String(link?.sortOrder ?? 100),
    track_slug: link?.trackSlug || "",
    is_published: link ? link.isPublished === true : true
  }));
  const [saving, setSaving] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  function setField(key: string, value: string | boolean) {
    setForm((c) => ({ ...c, [key]: value }));
  }

  function buildPayload() {
    return {
      provider: String(form.provider).trim() || "Fournisseur",
      category: String(form.category),
      title: String(form.title).trim() || String(form.provider).trim() || "Offre",
      description: String(form.description).trim(),
      url: cleanUrl(String(form.url)),
      logo_url: cleanUrl(String(form.logo_url)),
      sort_order: Math.max(1, Number.parseInt(String(form.sort_order), 10) || 100),
      track_slug: String(form.track_slug || "").trim() || null,
      is_published: form.is_published === true
    };
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setMessage("");
    if (!String(form.provider).trim()) {
      setError("Le fournisseur est obligatoire.");
      return;
    }
    setSaving(true);

    if (isEdit) {
      const { error: updateError } = await supabase.from("affiliate_links").update(buildPayload()).eq("id", link!.id);
      setSaving(false);
      if (updateError) {
        setError(updateError.message);
        return;
      }
      setMessage("Lien enregistre.");
      router.refresh();
      return;
    }

    const { error: insertError } = await supabase.from("affiliate_links").insert(buildPayload());
    setSaving(false);
    if (insertError) {
      setError(insertError.message.includes("affiliate_links") ? "Table absente. Lance supabase/sql/015_affiliate_links.sql." : insertError.message);
      return;
    }
    router.push("/admin/affiliations");
  }

  async function handleDelete() {
    if (!window.confirm("Supprimer ce lien d'affiliation ?")) return;
    setDeleting(true);
    const { error: deleteError } = await supabase.from("affiliate_links").delete().eq("id", link!.id);
    setDeleting(false);
    if (deleteError) {
      setError(deleteError.message);
      return;
    }
    router.push("/admin/affiliations");
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-white/[0.08] bg-[#111] p-5 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Field label="Fournisseur"><input className={INPUT} value={String(form.provider)} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setField("provider", e.target.value)} placeholder="Ex: Hostinger" /></Field>
        <Field label="Categorie">
          <select className={INPUT} value={String(form.category)} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setField("category", e.target.value)}>
            {AFFILIATE_CATEGORIES.map((c: AffiliateCategory) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Titre"><input className={INPUT} value={String(form.title)} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setField("title", e.target.value)} placeholder="Ex: Hébergement web Hostinger" /></Field>
      <Field label="Description"><textarea className={`${INPUT} min-h-[64px]`} value={String(form.description)} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setField("description", e.target.value)} /></Field>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Field label="Lien d'affiliation"><input className={INPUT} value={String(form.url)} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setField("url", e.target.value)} placeholder="https://..." /></Field>
        <Field label="Logo (URL, optionnel)"><input className={INPUT} value={String(form.logo_url)} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setField("logo_url", e.target.value)} placeholder="https://.../logo.png" /></Field>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Field label="Parcours associé (slug, optionnel)">
          <input className={INPUT} value={String(form.track_slug)} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setField("track_slug", e.target.value)} placeholder="Ex: media-buyer, produits-digitaux" />
        </Field>
        <label className="text-[11px] text-[#9b9b9b] flex items-center gap-1.5" style={{ maxWidth: 140, alignSelf: "end", paddingBottom: "4px" }}>
          Ordre
          <input type="number" min="1" className="auth-input text-[12px] w-[80px]" value={String(form.sort_order)} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setField("sort_order", e.target.value)} />
        </label>
        <label className="text-[11px] text-[#9b9b9b] flex items-center gap-1.5" style={{ alignSelf: "end", paddingBottom: "4px" }}>
          <input type="checkbox" checked={form.is_published === true} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setField("is_published", e.target.checked)} /> Publie
        </label>
      </div>

      {error ? <div className="rounded-xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-[12px] text-red-200">{error}</div> : null}
      {message ? <div className="rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-4 py-3 text-[12px] text-emerald-200">{message}</div> : null}

      <div className="flex items-center gap-3 flex-wrap">
        <button type="submit" disabled={saving} className={`btn-primary inline-flex items-center gap-2 text-[12px] ${saving ? "opacity-50 cursor-not-allowed" : ""}`} style={{ padding: "10px 18px" }}>
          {saving ? "Enregistrement..." : isEdit ? "Enregistrer" : "Ajouter le lien"}
          <iconify-icon icon="lucide:save" style={{ fontSize: "13px" }} />
        </button>
        {isEdit ? (
          <button type="button" onClick={handleDelete} disabled={deleting} className="text-[12px] text-red-400/80 hover:text-red-400 inline-flex items-center gap-1.5">
            <iconify-icon icon="lucide:trash-2" style={{ fontSize: "13px" }} />
            {deleting ? "Suppression..." : "Supprimer"}
          </button>
        ) : null}
      </div>
    </form>
  );
}
