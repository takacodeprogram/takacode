"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../utils/supabase/client";

const MODULE_SELECT = "id, slug, title, summary, sort_order, is_published, created_at";

function slugIsValid(slug) {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}

const INPUT = "auth-input text-[12px] w-full";
const EMPTY_MODULE = { slug: "", title: "", summary: "", sort_order: "100" };

export default function TrackElementsManager({ trackId, trackSlug, initialModules = [] }) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  const [modules, setModules] = useState(initialModules);
  const [createForm, setCreateForm] = useState(EMPTY_MODULE);
  const [editingId, setEditingId] = useState("");
  const [editForm, setEditForm] = useState(EMPTY_MODULE);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function reload() {
    const { data: mods } = await supabase
      .from("track_modules")
      .select(MODULE_SELECT)
      .eq("track_id", trackId)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });

    const moduleIds = (mods || []).map((m) => m.id);
    let byModule = {};
    if (moduleIds.length) {
      const { data: lessons } = await supabase
        .from("track_lessons")
        .select("id, module_id, slug, title, xp_reward, duration_minutes, sort_order, is_published")
        .in("module_id", moduleIds)
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: true });
      for (const lesson of lessons || []) {
        (byModule[lesson.module_id] = byModule[lesson.module_id] || []).push(lesson);
      }
    }

    setModules((mods || []).map((m) => ({ ...m, lessons: byModule[m.id] || [] })));
    router.refresh();
  }

  async function handleCreateModule(event) {
    event.preventDefault();
    setError("");
    const slug = createForm.slug.trim().toLowerCase();
    if (!slugIsValid(slug)) {
      setError("Slug de module invalide (minuscules, chiffres, tirets).");
      return;
    }
    if (!createForm.title.trim()) {
      setError("Le titre du module est obligatoire.");
      return;
    }

    setBusy(true);
    const { error: insertError } = await supabase.from("track_modules").insert({
      track_id: trackId,
      slug,
      title: createForm.title.trim(),
      summary: createForm.summary.trim(),
      sort_order: Math.max(1, Number.parseInt(createForm.sort_order, 10) || 100),
      is_published: true
    });
    setBusy(false);

    if (insertError) {
      setError(insertError.message);
      return;
    }
    setCreateForm(EMPTY_MODULE);
    await reload();
  }

  function startEdit(module) {
    setEditingId(module.id);
    setEditForm({
      slug: module.slug,
      title: module.title,
      summary: module.summary || "",
      sort_order: String(module.sort_order ?? 100)
    });
  }

  async function handleUpdateModule(moduleId) {
    setError("");
    setBusy(true);
    const { error: updateError } = await supabase
      .from("track_modules")
      .update({
        title: editForm.title.trim() || "Module",
        summary: editForm.summary.trim(),
        sort_order: Math.max(1, Number.parseInt(editForm.sort_order, 10) || 100)
      })
      .eq("id", moduleId);
    setBusy(false);
    if (updateError) {
      setError(updateError.message);
      return;
    }
    setEditingId("");
    await reload();
  }

  async function handleDeleteModule(moduleId) {
    if (!window.confirm("Supprimer ce module et toutes ses leçons ? Cette action est irréversible.")) {
      return;
    }
    setBusy(true);
    const { error: deleteError } = await supabase.from("track_modules").delete().eq("id", moduleId);
    setBusy(false);
    if (deleteError) {
      setError(deleteError.message);
      return;
    }
    await reload();
  }

  async function handleDeleteLesson(lessonId) {
    if (!window.confirm("Supprimer cette leçon ? Cette action est irréversible.")) {
      return;
    }
    setBusy(true);
    const { error: deleteError } = await supabase.from("track_lessons").delete().eq("id", lessonId);
    setBusy(false);
    if (deleteError) {
      setError(deleteError.message);
      return;
    }
    await reload();
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-venite text-[13px] tracking-widest text-[#888]">MODULES ET LECONS</h2>
        <span className="text-[11px] text-[#6d6d6d]">{modules.length} module(s)</span>
      </div>

      {error ? <div className="rounded-xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-[12px] text-red-200">{error}</div> : null}

      {modules.map((module, index) => (
        <div key={module.id} className="rounded-2xl border border-white/[0.08] bg-[#111] p-4">
          {editingId === module.id ? (
            <div className="space-y-2.5 mb-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                <input className={INPUT} value={editForm.title} onChange={(e) => setEditForm((c) => ({ ...c, title: e.target.value }))} placeholder="Titre" />
                <input className={INPUT} value={editForm.slug} disabled placeholder="slug" />
                <input className={INPUT} type="number" min="1" value={editForm.sort_order} onChange={(e) => setEditForm((c) => ({ ...c, sort_order: e.target.value }))} placeholder="ordre" />
              </div>
              <input className={INPUT} value={editForm.summary} onChange={(e) => setEditForm((c) => ({ ...c, summary: e.target.value }))} placeholder="Resume" />
              <div className="flex gap-2">
                <button type="button" disabled={busy} onClick={() => handleUpdateModule(module.id)} className="btn-secondary text-[11px] h-[34px] px-3">Enregistrer</button>
                <button type="button" onClick={() => setEditingId("")} className="text-[11px] text-[#888] hover:text-white px-2">Annuler</button>
              </div>
            </div>
          ) : (
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-start gap-3 min-w-0">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-blue-500/25 bg-blue-500/10 text-[11px] font-semibold text-blue-200 shrink-0">
                  {index + 1}
                </span>
                <div className="min-w-0">
                  <div className="text-[13px] text-white font-semibold leading-tight">{module.title}</div>
                  <div className="text-[11px] text-[#6d6d6d]">/{module.slug}{module.summary ? ` · ${module.summary}` : ""}</div>
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <button type="button" onClick={() => startEdit(module)} className="text-[#888] hover:text-white p-1" title="Éditer le module">
                  <iconify-icon icon="lucide:pencil" style={{ fontSize: "14px" }} />
                </button>
                <button type="button" onClick={() => handleDeleteModule(module.id)} className="text-red-400/70 hover:text-red-400 p-1" title="Supprimer le module">
                  <iconify-icon icon="lucide:trash-2" style={{ fontSize: "14px" }} />
                </button>
              </div>
            </div>
          )}

          <div className="space-y-2 pl-1">
            {module.lessons.map((lesson) => (
              <div key={lesson.id} className="flex items-center justify-between gap-3 rounded-lg border border-white/[0.06] bg-[#0f0f0f] px-3 py-2.5">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className={`h-2 w-2 rounded-full shrink-0 ${lesson.is_published ? "bg-emerald-400" : "bg-[#555]"}`} />
                  <div className="min-w-0">
                    <div className="text-[12px] text-[#d0d0d0] leading-tight truncate">{lesson.title}</div>
                    <div className="text-[10px] text-[#666]">/{lesson.slug} · {lesson.duration_minutes} min · {lesson.xp_reward} XP</div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <Link href={`/admin/parcours/${trackId}/lecons/${lesson.id}`} className="text-[#888] hover:text-white p-1" title="Éditer la leçon">
                    <iconify-icon icon="lucide:pencil" style={{ fontSize: "13px" }} />
                  </Link>
                  <button type="button" onClick={() => handleDeleteLesson(lesson.id)} className="text-red-400/70 hover:text-red-400 p-1" title="Supprimer la leçon">
                    <iconify-icon icon="lucide:trash-2" style={{ fontSize: "13px" }} />
                  </button>
                </div>
              </div>
            ))}

            <Link
              href={`/admin/parcours/${trackId}/lecons/nouveau?module=${module.id}`}
              className="inline-flex items-center gap-1.5 text-[11px] text-[#4F8EF7] hover:underline mt-1"
            >
              <iconify-icon icon="lucide:plus" style={{ fontSize: "12px" }} />
              Ajouter une leçon
            </Link>
          </div>
        </div>
      ))}

      <form onSubmit={handleCreateModule} className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4 space-y-2.5">
        <div className="text-[11px] text-[#8d8d8d] uppercase tracking-widest font-semibold">Nouveau module</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
          <input className={INPUT} value={createForm.title} onChange={(e) => setCreateForm((c) => ({ ...c, title: e.target.value }))} placeholder="Titre du module" />
          <input className={INPUT} value={createForm.slug} onChange={(e) => setCreateForm((c) => ({ ...c, slug: e.target.value }))} placeholder="slug (ex: bases-html)" />
          <input className={INPUT} type="number" min="1" value={createForm.sort_order} onChange={(e) => setCreateForm((c) => ({ ...c, sort_order: e.target.value }))} placeholder="ordre" />
        </div>
        <input className={INPUT} value={createForm.summary} onChange={(e) => setCreateForm((c) => ({ ...c, summary: e.target.value }))} placeholder="Resume (optionnel)" />
        <button type="submit" disabled={busy} className="btn-secondary text-[12px] h-[36px] px-4 inline-flex items-center gap-2">
          <iconify-icon icon="lucide:plus" style={{ fontSize: "13px" }} />
          Ajouter le module
        </button>
      </form>
    </section>
  );
}
