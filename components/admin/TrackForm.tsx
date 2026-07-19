"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "../../utils/supabase/client";
import TrackLivePreview from "./TrackLivePreview";
import TrackVersionHistory from "./TrackVersionHistory";
import { useAutosave } from "../../hooks/useAutosave";
import { useToast } from "../Toast";

interface TrackData {
  id: string;
  slug?: string;
  goal_key?: string;
  title?: string;
  summary?: string;
  level_label?: string;
  duration_weeks?: number;
  sort_order?: number;
  accent_color?: string;
  icon?: string;
  objective?: string;
  resources?: string[];
  next_session?: string;
  is_published?: boolean;
  is_active?: boolean;
}

interface VersionEntry {
  id: string;
  track_id: string;
  snapshot: Record<string, unknown>;
  label: string | null;
  created_at: string;
}

interface TrackFormProps {
  mode?: "create" | "edit";
  track?: TrackData | null;
  proposal?: boolean;
  userId?: string;
  redirectBase?: string;
}

interface ValidationErrors {
  [key: string]: string;
}

const TRACK_SELECT = "id, slug, title, is_published, is_active";

const TABS = [
  { id: "identite", label: "Identité" },
  { id: "cible", label: "Cible" },
  { id: "promesse", label: "Promesse" },
  { id: "structure", label: "Structure" },
  { id: "publication", label: "Publication" },
] as const;

type TabId = (typeof TABS)[number]["id"];

const REQUIRED_FIELDS = ["title", "summary"];
const CREATE_REQUIRED = ["slug", ...REQUIRED_FIELDS];

function slugIsValid(slug: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}

function parseResources(value: string): string[] {
  return String(value || "")
    .split(/[\n,]/)
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 8);
}

function toResourcesInput(resources: string[] | undefined): string {
  if (!Array.isArray(resources)) return "";
  return resources.map((item) => String(item || "").trim()).filter(Boolean).join(", ");
}

function Field({ label, children, error }: { label: string; children: React.ReactNode; error?: string }) {
  return (
    <label className="block">
      <span className="text-[10px] text-[#8d8d8d] uppercase tracking-widest font-semibold">{label}</span>
      <div className="mt-1">{children}</div>
      {error && <p className="mt-1 text-[10px] text-red-400">{error}</p>}
    </label>
  );
}

const INPUT_CLASS = "auth-input text-[12px] w-full";
const ACTIVE_TAB_CLASS = "bg-white/[0.08] text-white border-white/20";
const INACTIVE_TAB_CLASS = "text-[#6d6d6d] hover:text-[#aaa] border-transparent";

function TabDot({ filled }: { filled: boolean }) {
  return <span className={`inline-block w-1.5 h-1.5 rounded-full ${filled ? "bg-emerald-400" : "bg-[#444]"}`} />;
}

export default function TrackForm({ mode = "create", track = null, proposal = false, userId = "", redirectBase = "/admin/parcours" }: TrackFormProps) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const { toast } = useToast();
  const isEdit = mode === "edit";

  const [form, setForm] = useState<Record<string, string>>(() => ({
    slug: track?.slug || "",
    goal_key: track?.goal_key || "other",
    title: track?.title || "",
    summary: track?.summary || "",
    level_label: track?.level_label || "Debutant",
    duration_weeks: String(track?.duration_weeks ?? 8),
    sort_order: String(track?.sort_order ?? 100),
    accent_color: track?.accent_color || "#4F8EF7",
    icon: track?.icon || "lucide:route",
    objective: track?.objective || "Construire un projet concret.",
    resources: toResourcesInput(track?.resources),
    next_session: track?.next_session || "Session annoncee bientôt",
    is_published: track ? String(track.is_published === true) : "true",
    is_active: track ? String(track.is_active !== false) : "true"
  }));
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>("identite");
  const [dirty, setDirty] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [showPreview, setShowPreview] = useState(false);
  const [showVersionPrompt, setShowVersionPrompt] = useState(false);
  const [versionLabel, setVersionLabel] = useState("");
  const [comparingVersionId, setComparingVersionId] = useState<string | null>(null);
  const [comparisonSnapshot, setComparisonSnapshot] = useState<Record<string, unknown> | null>(null);

  async function createVersion(label?: string) {
    if (!track?.id) return;
    await supabase.from("track_versions").insert({
      track_id: track.id,
      snapshot: buildPayload() as Record<string, unknown>,
      label: label || null,
    });
  }

  async function handleCreateManualVersion() {
    if (!track?.id || !versionLabel.trim()) return;
    await createVersion(versionLabel.trim());
    setShowVersionPrompt(false);
    setVersionLabel("");
    toast("Version créée avec succès", "success");
  }

  async function handleCompareVersion(version: VersionEntry) {
    setComparingVersionId(version.id);
    setComparisonSnapshot(version.snapshot as Record<string, unknown>);
  }

  function closeComparison() {
    setComparingVersionId(null);
    setComparisonSnapshot(null);
  }

  async function autosave(): Promise<boolean> {
    if (!isEdit || !track?.id) return true;
    const { error: saveError } = await supabase
      .from("learning_tracks")
      .update(buildPayload())
      .eq("id", track.id);
    if (saveError) return false;
    await createVersion("Sauvegarde automatique");
    return true;
  }

  const { status: autosaveStatus, cancel: cancelAutosave, markSaved } = useAutosave(
    autosave,
    [form, track?.id],
    4000
  );

  const requiredFields = isEdit ? REQUIRED_FIELDS : CREATE_REQUIRED;
  const filledCount = requiredFields.filter((f) => form[f]?.trim()).length;

  useEffect(() => {
    if (!dirty) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    addEventListener("beforeunload", handler);
    return () => removeEventListener("beforeunload", handler);
  }, [dirty]);

  function setField(key: string, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
    setDirty(true);
    if (errors[key]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  }

  function validate(): ValidationErrors {
    const errs: ValidationErrors = {};
    for (const field of requiredFields) {
      if (!form[field]?.trim()) {
        errs[field] = "Ce champ est obligatoire.";
      }
    }
    if (!isEdit) {
      const slug = form.slug?.trim().toLowerCase() || "";
      if (!slug) {
        errs.slug = "Le slug est obligatoire.";
      } else if (!slugIsValid(slug)) {
        errs.slug = "Lettres minuscules, chiffres et tirets uniquement.";
      }
    }
    return errs;
  }

  function tabHasErrors(tabId: TabId): boolean {
    const tabFields = fieldMap[tabId];
    return tabFields.some((f) => !!errors[f]);
  }

  function completeness(tabId: TabId): number {
    const tabFields = fieldMap[tabId];
    const required = tabFields.filter((f) => requiredFields.includes(f));
    if (required.length === 0) return 1;
    return required.filter((f) => form[f]?.trim()).length / required.length;
  }

  function fieldMapForTab(tabId: TabId): string[] {
    return fieldMap[tabId];
  }

  const fieldMap: Record<TabId, string[]> = {
    identite: isEdit ? ["title", "summary", "objective", "icon"] : ["slug", "title", "summary", "objective", "icon"],
    cible: ["goal_key", "level_label", "resources", "next_session"],
    promesse: ["objective"],
    structure: ["duration_weeks", "sort_order", "accent_color"],
    publication: ["is_published", "is_active"],
  };

  function buildPayload() {
    const summary = form.summary.trim();
    return {
      goal_key: form.goal_key.trim().toLowerCase() || "other",
      title: form.title.trim() || "Parcours",
      summary: summary || "Parcours en préparation.",
      description: summary || "Parcours en préparation.",
      level_label: form.level_label.trim() || "Debutant",
      duration_weeks: Math.max(1, Number.parseInt(form.duration_weeks, 10) || 8),
      sort_order: Math.max(1, Number.parseInt(form.sort_order, 10) || 100),
      accent_color: form.accent_color.trim() || "#4F8EF7",
      icon: form.icon.trim() || "lucide:route",
      objective: form.objective.trim() || "Construire un projet concret.",
      resources: parseResources(form.resources),
      next_session: form.next_session.trim() || "Session annoncee bientôt",
      is_published: proposal ? false : form.is_published === "true",
      is_active: proposal ? false : form.is_active === "true"
    };
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      const firstErrorField = Object.keys(errs)[0];
      const tab = Object.entries(fieldMap).find(([, fields]) => fields.includes(firstErrorField));
      if (tab) setActiveTab(tab[0] as TabId);
      return;
    }

    setSaving(true);
    cancelAutosave();
    if (isEdit) {
      const { error: updateError } = await supabase.from("learning_tracks").update(buildPayload()).eq("id", track!.id).select(TRACK_SELECT).single();
      if (updateError) {
        toast(updateError.message, "error");
        setSaving(false);
        return;
      }
      await createVersion("Sauvegarde manuelle");
      markSaved();
      toast("Parcours mis à jour.", "success");
      setDirty(false);
      setSaving(false);
      router.refresh();
      return;
    }

    const slug = form.slug.trim().toLowerCase();
    const insertPayload: Record<string, unknown> = { slug, ...buildPayload(), next_steps: [{ label: "Démarrer le parcours", state: "current" }] };
    if (proposal) {
      insertPayload.created_by = userId;
      insertPayload.is_pending = true;
    }

    const { data, error: insertError } = await supabase.from("learning_tracks").insert(insertPayload).select(TRACK_SELECT).single();
    if (insertError) {
      toast(insertError.message, "error");
      setSaving(false);
      return;
    }
    setDirty(false);
    router.push(`${redirectBase}/${(data as { id: string }).id}`);
  }

  function renderSectionFields(tabId: TabId) {
    switch (tabId) {
      case "identite":
        return (
          <>
            {!isEdit && (
              <Field label="Slug (url)" error={errors.slug}>
                <input className={INPUT_CLASS} placeholder="ex: automatisation-ia" value={form.slug} onChange={(e) => setField("slug", e.target.value)} />
              </Field>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Field label="Titre" error={errors.title}>
                <input className={INPUT_CLASS} value={form.title} onChange={(e) => setField("title", e.target.value)} />
              </Field>
              <Field label="Icone">
                <input className={INPUT_CLASS} value={form.icon} onChange={(e) => setField("icon", e.target.value)} />
              </Field>
            </div>
            <Field label="Resume" error={errors.summary}>
              <textarea className={`${INPUT_CLASS} min-h-[64px]`} value={form.summary} onChange={(e) => setField("summary", e.target.value)} />
            </Field>
            <Field label="Objectif">
              <textarea className={`${INPUT_CLASS} min-h-[64px]`} value={form.objective} onChange={(e) => setField("objective", e.target.value)} />
            </Field>
          </>
        );
      case "cible":
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Field label="goal_key">
                <input className={INPUT_CLASS} value={form.goal_key} onChange={(e) => setField("goal_key", e.target.value)} />
              </Field>
              <Field label="Niveau">
                <input className={INPUT_CLASS} value={form.level_label} onChange={(e) => setField("level_label", e.target.value)} />
              </Field>
            </div>
            <Field label="Session suivante">
              <input className={INPUT_CLASS} value={form.next_session} onChange={(e) => setField("next_session", e.target.value)} />
            </Field>
            <Field label="Ressources (separees par virgule)">
              <input className={INPUT_CLASS} value={form.resources} onChange={(e) => setField("resources", e.target.value)} />
            </Field>
          </>
        );
      case "promesse":
        return (
          <div className="space-y-3">
            <p className="text-[11px] text-[#6d6d6d] font-body-readable">
              Explique pourquoi ce parcours existe et ce que l'apprenant va construire.
            </p>
            <Field label="Objectif / Promesse">
              <textarea className={`${INPUT_CLASS} min-h-[100px]`} value={form.objective} onChange={(e) => setField("objective", e.target.value)} />
            </Field>
            {!isEdit && (
              <div className="rounded-xl border border-blue-500/25 bg-blue-500/10 px-3.5 py-2.5 text-[12px] text-blue-100 font-body-readable">
                Cette promesse sera affichee sur la carte du parcours dans le catalogue.
              </div>
            )}
          </div>
        );
      case "structure":
        return (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Field label="Durée (sem.)">
              <input type="number" min="1" className={INPUT_CLASS} value={form.duration_weeks} onChange={(e) => setField("duration_weeks", e.target.value)} />
            </Field>
            <Field label="Ordre">
              <input type="number" min="1" className={INPUT_CLASS} value={form.sort_order} onChange={(e) => setField("sort_order", e.target.value)} />
            </Field>
            <Field label="Couleur">
              <input className={INPUT_CLASS} value={form.accent_color} onChange={(e) => setField("accent_color", e.target.value)} />
            </Field>
            {isEdit && (
              <Field label="Slug">
                <div className="text-[11px] text-[#6d6d6d] h-[36px] flex items-center">/{track?.slug}</div>
              </Field>
            )}
          </div>
        );
      case "publication":
        if (proposal) {
          return (
            <div className="rounded-xl border border-blue-500/25 bg-blue-500/10 px-3.5 py-2.5 text-[12px] text-blue-100 font-body-readable">
              Cette proposition sera <span className="font-semibold">validée par un admin</span> avant d etre publiee.
            </div>
          );
        }
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-5">
              <label className="text-[11px] text-[#9b9b9b] flex items-center gap-1.5">
                <input type="checkbox" checked={form.is_published === "true"} onChange={(e) => setField("is_published", e.target.checked ? "true" : "false")} /> Publie
              </label>
              <label className="text-[11px] text-[#9b9b9b] flex items-center gap-1.5">
                <input type="checkbox" checked={form.is_active === "true"} onChange={(e) => setField("is_active", e.target.checked ? "true" : "false")} /> Actif
              </label>
            </div>
            {isEdit && track?.slug && (
              <div className="flex items-center gap-2">
                <Link href={`/parcours/${track.slug}`} target="_blank" rel="noopener noreferrer" className="text-[11px] text-[#4F8EF7] hover:underline inline-flex items-center gap-1">
                  <iconify-icon icon="lucide:external-link" style={{ fontSize: "12px" }} />
                  Voir en public
                </Link>
              </div>
            )}
          </div>
        );
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-white/[0.08] bg-[#111]">
      {/* Completeness bar */}
      <div className="px-5 pt-4 pb-2">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] text-[#6d6d6d] uppercase tracking-widest">
            Completeur : {filledCount}/{requiredFields.length}
          </span>
          <div className="flex-1 h-1 rounded-full bg-[#222] overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: `${(filledCount / requiredFields.length) * 100}%`,
                backgroundColor: filledCount === requiredFields.length ? "#34d399" : "#4F8EF7"
              }}
            />
          </div>
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex border-b border-white/[0.06] px-5 overflow-x-auto">
        {TABS.map((tab) => {
          const complete = completeness(tab.id);
          const hasErr = tabHasErrors(tab.id);
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2.5 text-[11px] font-medium border-b-2 transition-colors shrink-0 ${
                activeTab === tab.id ? ACTIVE_TAB_CLASS : INACTIVE_TAB_CLASS
              }`}
            >
              {hasErr ? (
                <span className="text-red-400" style={{ fontSize: "10px" }}>&#x26A0;</span>
              ) : (
                <TabDot filled={complete === 1} />
              )}
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Active section */}
      <div className="p-5 space-y-4">
        {renderSectionFields(activeTab)}
      </div>

      {/* Live preview + version history */}
      <div className="px-5 space-y-3">
        <button
          type="button"
          onClick={() => setShowPreview(!showPreview)}
          className="flex items-center gap-2 text-[10px] text-[#6d6d6d] uppercase tracking-widest hover:text-[#aaa] transition-colors"
        >
          <iconify-icon icon={showPreview ? "lucide:eye-off" : "lucide:eye"} style={{ fontSize: "12px" }} />
          Apercu public {showPreview ? "— masquer" : "— montrer"}
        </button>
        {showPreview && (
          <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="text-[10px] text-[#555] uppercase tracking-widest font-semibold self-end">Tel qu'affiché dans le catalogue</div>
            <TrackLivePreview
              data={{
                title: form.title || "",
                summary: form.summary || "",
                objective: form.objective || "",
                level_label: form.level_label || "",
                duration_weeks: form.duration_weeks || "",
                accent_color: form.accent_color || "#4F8EF7",
                icon: form.icon || "lucide:route",
                slug: track?.slug || form.slug || "",
              }}
            />
          </div>
        )}

        {track?.id && (
          <div className="space-y-3 border-t border-white/[0.06] pt-3">
            <div className="flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => setShowVersionPrompt(true)}
                className="flex items-center gap-2 text-[10px] text-[#6d6d6d] uppercase tracking-widest hover:text-[#aaa] transition-colors"
              >
                <iconify-icon icon="lucide:plus-circle" style={{ fontSize: "12px" }} />
                Créer une version manuelle
              </button>
              {showVersionPrompt && (
                <div className="flex items-center gap-2 ml-auto">
                  <input
                    type="text"
                    value={versionLabel}
                    onChange={(e) => setVersionLabel(e.target.value)}
                    placeholder="Label (ex: Avant refonte design)"
                    className="auth-input text-[11px] w-[200px]"
                    onKeyDown={(e) => e.key === "Enter" && handleCreateManualVersion()}
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={handleCreateManualVersion}
                    className="btn-primary text-[11px] px-3 py-1.5"
                  >
                    Créer
                  </button>
                  <button
                    type="button"
                    onClick={() => { setShowVersionPrompt(false); setVersionLabel(""); }}
                    className="text-[11px] text-[#888] hover:text-white px-2 py-1.5"
                  >
                    Annuler
                  </button>
                </div>
              )}
            </div>

            <TrackVersionHistory
              trackId={track.id}
              onRestore={(snapshot) => {
                const s = snapshot as Record<string, unknown>;
                setForm({
                  slug: String(s.slug || track?.slug || ""),
                  goal_key: String(s.goal_key || "other"),
                  title: String(s.title || ""),
                  summary: String(s.summary || ""),
                  level_label: String(s.level_label || "Debutant"),
                  duration_weeks: String(s.duration_weeks ?? 8),
                  sort_order: String(s.sort_order ?? 100),
                  accent_color: String(s.accent_color || "#4F8EF7"),
                  icon: String(s.icon || "lucide:route"),
                  objective: String(s.objective || ""),
                  resources: toResourcesInput((s.resources || []) as string[]),
                  next_session: String(s.next_session || ""),
                  is_published: String(s.is_published === true),
                  is_active: String(s.is_active !== false),
                });
                setDirty(true);
              }}
              onCompare={handleCompareVersion}
            />

            {comparingVersionId && comparisonSnapshot && (
              <div className="rounded-xl border border-blue-500/30 bg-blue-500/10 p-3">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] text-blue-100 uppercase tracking-widest font-semibold">Comparaison avec la version actuelle</span>
                  <button type="button" onClick={closeComparison} className="text-blue-300 hover:text-white text-[14px]">✕</button>
                </div>
                <div className="grid grid-cols-2 gap-4 text-[11px]">
                  {(() => {
                    const current = buildPayload();
                    const keys = new Set([...Object.keys(current), ...Object.keys(comparisonSnapshot)]);
                    return Array.from(keys).map((key) => {
                      const currentVal = current[key as keyof typeof current];
                      const oldVal = comparisonSnapshot[key];
                      const changed = JSON.stringify(currentVal) !== JSON.stringify(oldVal);
                      return (
                        <div key={key} className={`flex flex-col gap-1 ${changed ? "text-amber-300" : "text-[#666]"}`}>
                          <span className="uppercase tracking-widest font-semibold text-[9px]">{key}</span>
                          <div className="flex gap-2">
                            <span className="text-green-400">Actuel: {JSON.stringify(currentVal)}</span>
                            <span className="text-amber-400">Version: {JSON.stringify(oldVal)}</span>
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer with actions */}
      <div className="flex items-center justify-between gap-3 border-t border-white/[0.06] px-5 py-4">
        <div className="flex items-center gap-3">
          {autosaveStatus === "saving" && <span className="text-[10px] text-[#4F8EF7]">Enregistrement automatique...</span>}
          {autosaveStatus === "saved" && <span className="text-[10px] text-emerald-400">Brouillon sauvegarde</span>}
          {dirty && autosaveStatus !== "saving" && autosaveStatus !== "saved" && <span className="text-[10px] text-amber-400">Modifications non enregistrees</span>}
        </div>
        <div className="flex items-center gap-2">
          {isEdit && (
            <button
              type="button"
              onClick={() => {
                setDirty(false);
                router.push(redirectBase);
              }}
              className="text-[11px] text-[#888] hover:text-white px-3 py-2"
            >
              Annuler
            </button>
          )}
          <button type="submit" disabled={saving} className={`btn-primary inline-flex items-center gap-2 text-[12px] ${saving ? "opacity-50 cursor-not-allowed" : ""}`} style={{ padding: "10px 18px" }}>
            {saving ? "Enregistrement..." : isEdit ? "Enregistrer" : "Créer le parcours"}
            <iconify-icon icon="lucide:save" style={{ fontSize: "13px" }} />
          </button>
        </div>
      </div>
    </form>
  );
}
