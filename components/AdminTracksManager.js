"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "../utils/supabase/client";

const TRACK_SELECT = "id, slug, goal_key, title, summary, level_label, duration_weeks, accent_color, icon, objective, resources, next_session, is_published, is_active, sort_order, updated_at";

const DEFAULT_CREATE_FORM = {
  slug: "",
  goal_key: "other",
  title: "",
  summary: "",
  level_label: "Debutant",
  duration_weeks: "8",
  sort_order: "100",
  accent_color: "#4F8EF7",
  icon: "lucide:route",
  objective: "Construire un projet concret.",
  resources: "",
  next_session: "Session annoncee bientot"
};

function normalizeTrack(track) {
  return {
    id: String(track?.id || "").trim(),
    slug: String(track?.slug || "").trim(),
    goal_key: String(track?.goal_key || track?.goalKey || "other").trim().toLowerCase() || "other",
    title: String(track?.title || "Parcours").trim() || "Parcours",
    summary: String(track?.summary || track?.description || "Parcours en preparation.").trim() || "Parcours en preparation.",
    level_label: String(track?.level_label || track?.levelLabel || "Debutant").trim() || "Debutant",
    duration_weeks: Math.max(1, Number.parseInt(String(track?.duration_weeks ?? track?.durationWeeks ?? 8), 10) || 8),
    sort_order: Math.max(1, Number.parseInt(String(track?.sort_order ?? track?.sortOrder ?? 100), 10) || 100),
    accent_color: String(track?.accent_color || track?.accentColor || "#4F8EF7").trim() || "#4F8EF7",
    icon: String(track?.icon || "lucide:route").trim() || "lucide:route",
    objective: String(track?.objective || "Construire un projet concret.").trim() || "Construire un projet concret.",
    resources: Array.isArray(track?.resources) ? track.resources : [],
    next_session: String(track?.next_session || track?.nextSession || "Session annoncee bientot").trim() || "Session annoncee bientot",
    is_published: track?.is_published === true || track?.isPublished === true,
    is_active: track?.is_active !== false && track?.isActive !== false
  };
}

function toResourcesInput(resources) {
  if (!Array.isArray(resources)) {
    return "";
  }

  return resources.map((item) => String(item || "").trim()).filter(Boolean).join(", ");
}

function parseResources(value) {
  return String(value || "")
    .split(/[\n,]/)
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 8);
}

function buildTrackDraft(track) {
  return {
    title: String(track.title || ""),
    summary: String(track.summary || ""),
    goal_key: String(track.goal_key || "other"),
    level_label: String(track.level_label || "Debutant"),
    duration_weeks: String(Number(track.duration_weeks || 8)),
    sort_order: String(Number(track.sort_order || 100)),
    accent_color: String(track.accent_color || "#4F8EF7"),
    icon: String(track.icon || "lucide:route"),
    objective: String(track.objective || "Construire un projet concret."),
    resources: toResourcesInput(track.resources),
    next_session: String(track.next_session || "Session annoncee bientot"),
    is_published: track.is_published === true,
    is_active: track.is_active !== false
  };
}

function buildInitialDrafts(tracks) {
  return Object.fromEntries(tracks.map((track) => [track.id, buildTrackDraft(track)]));
}

function sortTracks(list) {
  return [...list].sort((a, b) => {
    const sortGap = Number(a.sort_order || 100) - Number(b.sort_order || 100);
    if (sortGap !== 0) {
      return sortGap;
    }

    return String(a.title || "").localeCompare(String(b.title || ""), "fr");
  });
}

function slugIsValid(slug) {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}

function normalizeCreatePayload(values) {
  const slug = String(values.slug || "").trim().toLowerCase();
  const title = String(values.title || "").trim();
  const summary = String(values.summary || "").trim();

  return {
    slug,
    goal_key: String(values.goal_key || "other").trim().toLowerCase() || "other",
    title,
    summary,
    description: summary,
    level_label: String(values.level_label || "Debutant").trim() || "Debutant",
    duration_weeks: Math.max(1, Number.parseInt(String(values.duration_weeks || "8"), 10) || 8),
    sort_order: Math.max(1, Number.parseInt(String(values.sort_order || "100"), 10) || 100),
    accent_color: String(values.accent_color || "#4F8EF7").trim() || "#4F8EF7",
    icon: String(values.icon || "lucide:route").trim() || "lucide:route",
    objective: String(values.objective || "Construire un projet concret.").trim() || "Construire un projet concret.",
    resources: parseResources(values.resources),
    next_session: String(values.next_session || "Session annoncee bientot").trim() || "Session annoncee bientot",
    next_steps: [
      { label: "Demarrer le parcours", state: "current" },
      { label: "Completer le premier exercice", state: "locked" }
    ],
    is_published: true,
    is_active: true
  };
}

function normalizeUpdatePayload(values) {
  return {
    title: String(values.title || "").trim() || "Parcours",
    summary: String(values.summary || "").trim() || "Parcours en preparation.",
    description: String(values.summary || "").trim() || "Parcours en preparation.",
    goal_key: String(values.goal_key || "other").trim().toLowerCase() || "other",
    level_label: String(values.level_label || "Debutant").trim() || "Debutant",
    duration_weeks: Math.max(1, Number.parseInt(String(values.duration_weeks || "8"), 10) || 8),
    sort_order: Math.max(1, Number.parseInt(String(values.sort_order || "100"), 10) || 100),
    accent_color: String(values.accent_color || "#4F8EF7").trim() || "#4F8EF7",
    icon: String(values.icon || "lucide:route").trim() || "lucide:route",
    objective: String(values.objective || "Construire un projet concret.").trim() || "Construire un projet concret.",
    resources: parseResources(values.resources),
    next_session: String(values.next_session || "Session annoncee bientot").trim() || "Session annoncee bientot",
    is_published: values.is_published === true,
    is_active: values.is_active === true
  };
}

export default function AdminTracksManager({ initialTracks = [] }) {
  const supabase = useMemo(() => createClient(), []);

  const seededTracks = Array.isArray(initialTracks)
    ? sortTracks(initialTracks.map((track) => normalizeTrack(track)).filter((track) => track.id))
    : [];

  const [tracks, setTracks] = useState(seededTracks);
  const [drafts, setDrafts] = useState(() => buildInitialDrafts(seededTracks));
  const [createForm, setCreateForm] = useState(DEFAULT_CREATE_FORM);
  const [savingId, setSavingId] = useState("");
  const [creating, setCreating] = useState(false);
  const [loadingTracks, setLoadingTracks] = useState(false);
  const [didAutoReload, setDidAutoReload] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  async function reloadTracks(options = {}) {
    const showSuccess = options.showSuccess === true;

    setLoadingTracks(true);
    setErrorMessage("");

    const { data, error } = await supabase
      .from("learning_tracks")
      .select(TRACK_SELECT)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true })
      .limit(300);

    if (error) {
      setErrorMessage(error.message || "Impossible de charger les parcours.");
      setLoadingTracks(false);
      return;
    }

    const refreshedTracks = sortTracks((data || []).map((track) => normalizeTrack(track)).filter((track) => track.id));

    setTracks(refreshedTracks);
    setDrafts(buildInitialDrafts(refreshedTracks));
    setLoadingTracks(false);

    if (showSuccess) {
      if (refreshedTracks.length) {
        setSuccessMessage("Parcours synchronises depuis la base.");
      } else {
        setSuccessMessage("Aucun parcours trouve en base.");
      }
    }
  }

  useEffect(() => {
    if (tracks.length || didAutoReload) {
      return;
    }

    let cancelled = false;

    async function runAutoReload() {
      setDidAutoReload(true);
      setLoadingTracks(true);

      const { data, error } = await supabase
        .from("learning_tracks")
        .select(TRACK_SELECT)
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: true })
        .limit(300);

      if (cancelled) {
        return;
      }

      if (error) {
        setErrorMessage(error.message || "Impossible de charger les parcours.");
        setLoadingTracks(false);
        return;
      }

      const refreshedTracks = sortTracks((data || []).map((track) => normalizeTrack(track)).filter((track) => track.id));

      setTracks(refreshedTracks);
      setDrafts(buildInitialDrafts(refreshedTracks));
      setLoadingTracks(false);

      if (refreshedTracks.length) {
        setSuccessMessage("Parcours charges depuis la base.");
      }
    }

    runAutoReload();

    return () => {
      cancelled = true;
    };
  }, [didAutoReload, supabase, tracks.length]);

  async function handleSave(trackId) {
    const draft = drafts[trackId];
    if (!draft) {
      return;
    }

    setSavingId(trackId);
    setErrorMessage("");
    setSuccessMessage("");

    const payload = normalizeUpdatePayload(draft);

    const { data, error } = await supabase
      .from("learning_tracks")
      .update(payload)
      .eq("id", trackId)
      .select(TRACK_SELECT)
      .single();

    if (error) {
      setErrorMessage(error.message);
      setSavingId("");
      return;
    }

    const normalized = normalizeTrack(data);

    setTracks((current) =>
      sortTracks(current.map((item) => (item.id === trackId ? normalized : item)))
    );

    setDrafts((current) => ({
      ...current,
      [trackId]: buildTrackDraft(normalized)
    }));

    setSuccessMessage("Parcours mis a jour.");
    setSavingId("");
  }

  async function handleCreate(event) {
    event.preventDefault();

    const payload = normalizeCreatePayload(createForm);

    if (!slugIsValid(payload.slug)) {
      setErrorMessage("Le slug doit utiliser uniquement des lettres minuscules, chiffres et tirets.");
      return;
    }

    if (!payload.title || !payload.summary) {
      setErrorMessage("Titre et resume sont obligatoires.");
      return;
    }

    setCreating(true);
    setErrorMessage("");
    setSuccessMessage("");

    const { data, error } = await supabase
      .from("learning_tracks")
      .insert(payload)
      .select(TRACK_SELECT)
      .single();

    if (error) {
      setErrorMessage(error.message);
      setCreating(false);
      return;
    }

    const normalized = normalizeTrack(data);

    setTracks((current) => sortTracks([normalized, ...current]));

    setDrafts((current) => ({
      ...current,
      [normalized.id]: buildTrackDraft(normalized)
    }));

    setCreateForm(DEFAULT_CREATE_FORM);
    setSuccessMessage("Nouveau parcours cree.");
    setCreating(false);
  }

  function setDraftField(trackId, key, value) {
    setDrafts((current) => ({
      ...current,
      [trackId]: {
        ...current[trackId],
        [key]: value
      }
    }));
  }

  return (
    <section className="rounded-2xl border border-white/[0.08] bg-[#111] p-5 space-y-5">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h2 className="font-valorax text-xl">ADMINISTRER LES PARCOURS</h2>
          <p className="text-[12px] text-[#777] font-body-readable mt-1">
            Gere la publication, l'activation et les meta des parcours depuis le dashboard admin.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="rounded-lg border border-white/[0.08] bg-white/[0.02] px-3 py-1.5 text-[11px] text-[#bbb]">
            {tracks.length} parcours
          </div>
          <button
            type="button"
            className="btn-secondary h-[34px] px-3 text-[11px]"
            onClick={() => reloadTracks({ showSuccess: true })}
            disabled={loadingTracks}
          >
            {loadingTracks ? "Chargement..." : "Recharger"}
          </button>
        </div>
      </div>

      {errorMessage ? (
        <div className="rounded-xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-[12px] text-red-300">
          {errorMessage}
        </div>
      ) : null}

      {successMessage ? (
        <div className="rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-4 py-3 text-[12px] text-emerald-200">
          {successMessage}
        </div>
      ) : null}

      <form onSubmit={handleCreate} className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4 space-y-3">
        <div className="text-[11px] text-[#8d8d8d] uppercase tracking-widest font-semibold">Nouveau parcours</div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-2.5">
          <input className="auth-input text-[12px]" placeholder="slug (ex: automation-ia)" value={createForm.slug} onChange={(event) => setCreateForm((c) => ({ ...c, slug: event.target.value }))} />
          <input className="auth-input text-[12px]" placeholder="goal_key (ex: automation_ai)" value={createForm.goal_key} onChange={(event) => setCreateForm((c) => ({ ...c, goal_key: event.target.value }))} />
          <input className="auth-input text-[12px]" placeholder="titre" value={createForm.title} onChange={(event) => setCreateForm((c) => ({ ...c, title: event.target.value }))} />
          <input className="auth-input text-[12px]" placeholder="niveau (Debutant)" value={createForm.level_label} onChange={(event) => setCreateForm((c) => ({ ...c, level_label: event.target.value }))} />
          <input className="auth-input text-[12px] md:col-span-2" placeholder="resume" value={createForm.summary} onChange={(event) => setCreateForm((c) => ({ ...c, summary: event.target.value }))} />
          <input className="auth-input text-[12px]" placeholder="duree semaines" type="number" min="1" value={createForm.duration_weeks} onChange={(event) => setCreateForm((c) => ({ ...c, duration_weeks: event.target.value }))} />
          <input className="auth-input text-[12px]" placeholder="ordre" type="number" min="1" value={createForm.sort_order} onChange={(event) => setCreateForm((c) => ({ ...c, sort_order: event.target.value }))} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          <input className="auth-input text-[12px]" placeholder="couleur accent (#4F8EF7)" value={createForm.accent_color} onChange={(event) => setCreateForm((c) => ({ ...c, accent_color: event.target.value }))} />
          <input className="auth-input text-[12px]" placeholder="icone (lucide:route)" value={createForm.icon} onChange={(event) => setCreateForm((c) => ({ ...c, icon: event.target.value }))} />
          <input className="auth-input text-[12px] md:col-span-2" placeholder="objectif" value={createForm.objective} onChange={(event) => setCreateForm((c) => ({ ...c, objective: event.target.value }))} />
          <input className="auth-input text-[12px]" placeholder="session suivante" value={createForm.next_session} onChange={(event) => setCreateForm((c) => ({ ...c, next_session: event.target.value }))} />
          <input className="auth-input text-[12px]" placeholder="ressources (separees par virgule)" value={createForm.resources} onChange={(event) => setCreateForm((c) => ({ ...c, resources: event.target.value }))} />
        </div>
        <button type="submit" className="btn-secondary h-[38px] px-4 text-[12px]" disabled={creating}>
          {creating ? "Creation..." : "Creer le parcours"}
        </button>
      </form>

      <div className="space-y-3">
        {tracks.map((track) => {
          const draft = drafts[track.id] || {};
          const isSaving = savingId === track.id;

          return (
            <article key={track.id} className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4">
              <div className="flex items-center justify-between gap-3 flex-wrap mb-3">
                <div>
                  <div className="text-[13px] text-white font-semibold">{track.title}</div>
                  <div className="text-[11px] text-[#6d6d6d]">/{track.slug}</div>
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-[11px] text-[#9b9b9b] flex items-center gap-1.5">
                    <input
                      type="checkbox"
                      checked={draft.is_published === true}
                      onChange={(event) => setDraftField(track.id, "is_published", event.target.checked)}
                    />
                    Publie
                  </label>
                  <label className="text-[11px] text-[#9b9b9b] flex items-center gap-1.5">
                    <input
                      type="checkbox"
                      checked={draft.is_active === true}
                      onChange={(event) => setDraftField(track.id, "is_active", event.target.checked)}
                    />
                    Actif
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-2.5">
                <input className="auth-input text-[12px]" value={draft.title || ""} onChange={(event) => setDraftField(track.id, "title", event.target.value)} />
                <input className="auth-input text-[12px]" value={track.slug || ""} disabled />
                <input className="auth-input text-[12px]" value={draft.goal_key || ""} onChange={(event) => setDraftField(track.id, "goal_key", event.target.value)} />
                <input className="auth-input text-[12px]" value={draft.level_label || ""} onChange={(event) => setDraftField(track.id, "level_label", event.target.value)} />
                <input className="auth-input text-[12px]" type="number" min="1" value={draft.duration_weeks || "8"} onChange={(event) => setDraftField(track.id, "duration_weeks", event.target.value)} />
                <input className="auth-input text-[12px]" type="number" min="1" value={draft.sort_order || "100"} onChange={(event) => setDraftField(track.id, "sort_order", event.target.value)} />
                <input className="auth-input text-[12px]" value={draft.accent_color || "#4F8EF7"} onChange={(event) => setDraftField(track.id, "accent_color", event.target.value)} />
                <input className="auth-input text-[12px]" value={draft.icon || "lucide:route"} onChange={(event) => setDraftField(track.id, "icon", event.target.value)} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 mt-2.5">
                <textarea className="auth-input text-[12px] min-h-[72px]" value={draft.summary || ""} onChange={(event) => setDraftField(track.id, "summary", event.target.value)} />
                <textarea className="auth-input text-[12px] min-h-[72px]" value={draft.objective || ""} onChange={(event) => setDraftField(track.id, "objective", event.target.value)} />
                <input className="auth-input text-[12px]" value={draft.next_session || ""} onChange={(event) => setDraftField(track.id, "next_session", event.target.value)} />
                <input className="auth-input text-[12px]" value={draft.resources || ""} onChange={(event) => setDraftField(track.id, "resources", event.target.value)} />
              </div>

              <div className="mt-3 flex items-center gap-2.5 flex-wrap">
                <button type="button" className="btn-secondary h-[36px] px-3 text-[11px]" onClick={() => handleSave(track.id)} disabled={isSaving}>
                  {isSaving ? "Sauvegarde..." : "Sauvegarder"}
                </button>
                {track.slug ? (
                  <a href={`/parcours/${track.slug}`} className="text-[11px] text-[#4F8EF7] hover:underline">
                    Voir le detail public
                  </a>
                ) : null}
              </div>
            </article>
          );
        })}

        {!tracks.length ? (
          <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 py-4 text-[12px] text-[#808080] font-body-readable">
            <p className="text-[#a4a4a4] mb-1">Aucun parcours visible pour ce compte.</p>
            <p className="text-[#757575]">Si les parcours existent deja en base, verifie le role admin/RLS puis clique sur "Recharger".</p>
          </div>
        ) : null}
      </div>
    </section>
  );
}
