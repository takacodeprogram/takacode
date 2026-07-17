"use client";

import Link from "next/link";
import { useMemo, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../utils/supabase/client";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface LessonEntry {
  id: string;
  module_id: string;
  slug: string;
  title: string;
  xp_reward: number;
  duration_minutes: number;
  sort_order: number;
  is_published: boolean;
}

interface ModuleEntry {
  id: string;
  slug: string;
  title: string;
  summary?: string;
  sort_order: number;
  is_published: boolean;
  created_at: string;
  lessons: LessonEntry[];
}

interface Props {
  trackId: string;
  trackSlug: string;
  initialModules?: ModuleEntry[];
  basePath?: string;
}

const MODULE_SELECT = "id, slug, title, summary, sort_order, is_published, created_at";
const LESSON_PREFIX = "lesson-";

function slugIsValid(slug: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}

function makeCopySlug(slug: string): string {
  const match = slug.match(/^(.*?)(?:-(\d+))?$/);
  if (!match) return slug + "-copie";
  const base = match[1];
  const num = match[2] ? Number(match[2]) + 1 : 2;
  return `${base}-${num}`;
}

const INPUT = "auth-input text-[12px] w-full";
const EMPTY_MODULE = { slug: "", title: "", summary: "", sort_order: "100" };

function SortableModuleCard({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };
  return (
    <div ref={setNodeRef} style={style} className="rounded-2xl border border-white/[0.08] bg-[#111] p-4">
      <div className="flex items-start gap-2">
        <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing text-[#444] hover:text-[#888] mt-0.5 shrink-0" style={{ fontSize: "15px" }}>
          <iconify-icon icon="lucide:grip-vertical" />
        </div>
        <div className="flex-1 min-w-0">{children}</div>
      </div>
    </div>
  );
}

function SortableLessonRow({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };
  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-2 rounded-lg border border-white/[0.06] bg-[#0f0f0f] px-3 py-2.5">
      <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing text-[#444] hover:text-[#888] shrink-0" style={{ fontSize: "14px" }}>
        <iconify-icon icon="lucide:grip-vertical" />
      </div>
      {children}
    </div>
  );
}

export default function TrackElementsManager({ trackId, initialModules = [], basePath = `/admin/parcours/${trackId}` }: Props) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [modules, setModules] = useState<ModuleEntry[]>(initialModules);
  const [createForm, setCreateForm] = useState<typeof EMPTY_MODULE>(EMPTY_MODULE);
  const [editingId, setEditingId] = useState("");
  const [editForm, setEditForm] = useState<typeof EMPTY_MODULE>(EMPTY_MODULE);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const moduleIds = useMemo(() => modules.map((m) => m.id), [modules]);

  const lessonIdsByModule = useMemo(() => {
    const map: Record<string, string[]> = {};
    for (const m of modules) {
      map[m.id] = m.lessons.map((l) => `${LESSON_PREFIX}${l.id}`);
    }
    return map;
  }, [modules]);

  async function reload() {
    const { data: mods } = await supabase
      .from("track_modules")
      .select(MODULE_SELECT)
      .eq("track_id", trackId)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });

    const mids = ((mods || []) as { id: string }[]).map((m) => m.id);
    const byModule: Record<string, LessonEntry[]> = {};
    if (mids.length) {
      const { data: lessons } = await supabase
        .from("track_lessons")
        .select("id, module_id, slug, title, xp_reward, duration_minutes, sort_order, is_published")
        .in("module_id", mids)
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: true });
      for (const lesson of lessons || []) {
        (byModule[(lesson as LessonEntry).module_id] = byModule[(lesson as LessonEntry).module_id] || []).push(lesson as LessonEntry);
      }
    }

    setModules(((mods || []) as ModuleEntry[]).map((m) => ({ ...m, lessons: byModule[m.id] || [] })));
    router.refresh();
  }

  async function batchUpdate(items: { id: string; sort_order: number; table: string }[]) {
    for (const item of items) {
      await supabase.from(item.table as "track_modules" | "track_lessons").update({ sort_order: item.sort_order }).eq("id", item.id);
    }
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const activeStr = String(active.id);
    const overStr = String(over.id);
    const isLesson = activeStr.startsWith(LESSON_PREFIX);

    if (isLesson) {
      const lessonId = activeStr.replace(LESSON_PREFIX, "");
      const overLessonId = overStr.replace(LESSON_PREFIX, "");

      let moduleIdx = -1;
      for (let i = 0; i < modules.length; i++) {
        if (modules[i].lessons.some((l) => l.id === lessonId || l.id === overLessonId)) {
          moduleIdx = i;
          break;
        }
      }
      if (moduleIdx === -1) return;

      const lessons = modules[moduleIdx].lessons;
      const oldIdx = lessons.findIndex((l) => l.id === lessonId);
      const newIdx = lessons.findIndex((l) => l.id === overLessonId);
      if (oldIdx === -1 || newIdx === -1) return;

      const reordered = arrayMove(lessons, oldIdx, newIdx).map((l, i) => ({ ...l, sort_order: (i + 1) * 10 }));
      const next = [...modules];
      next[moduleIdx] = { ...next[moduleIdx], lessons: reordered };
      setModules(next);
      await batchUpdate(reordered.map((l) => ({ id: l.id, sort_order: l.sort_order, table: "track_lessons" })));
    } else {
      const oldIdx = modules.findIndex((m) => m.id === activeStr);
      const newIdx = modules.findIndex((m) => m.id === overStr);
      if (oldIdx === -1 || newIdx === -1) return;

      const reordered = arrayMove(modules, oldIdx, newIdx).map((m, i) => ({ ...m, sort_order: (i + 1) * 10 }));
      setModules(reordered);
      await batchUpdate(reordered.map((m) => ({ id: m.id, sort_order: m.sort_order, table: "track_modules" })));
    }
  }

  async function handleCreateModule(event: React.FormEvent) {
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

  function startEdit(module: ModuleEntry) {
    setEditingId(module.id);
    setEditForm({
      slug: module.slug,
      title: module.title,
      summary: module.summary || "",
      sort_order: String(module.sort_order ?? 100)
    });
  }

  async function handleUpdateModule(moduleId: string) {
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

  async function handleDeleteModule(moduleId: string) {
    if (!window.confirm("Supprimer ce module et toutes ses lecons ? Cette action est irreversible.")) return;
    setBusy(true);
    await supabase.from("track_modules").delete().eq("id", moduleId);
    setBusy(false);
    await reload();
  }

  async function handleDuplicateModule(module: ModuleEntry) {
    setBusy(true);
    const newSlug = makeCopySlug(module.slug);
    const { data: newMod, error: insertError } = await supabase
      .from("track_modules")
      .insert({
        track_id: trackId,
        slug: newSlug,
        title: `${module.title} (copie)`,
        summary: module.summary || "",
        sort_order: module.sort_order + 1,
        is_published: false
      })
      .select("id")
      .single();

    if (insertError || !newMod) {
      setError(insertError?.message || "Erreur duplication module");
      setBusy(false);
      return;
    }

    for (const lesson of module.lessons) {
      const { data: lessonData } = await supabase.from("track_lessons").select("*").eq("id", lesson.id).single();
      if (lessonData) {
        const { id: _id, created_at: _ca, ...lessonFields } = lessonData as Record<string, unknown>;
        await supabase.from("track_lessons").insert({
          ...lessonFields,
          module_id: newMod.id,
          slug: makeCopySlug(lesson.slug),
          title: `${lesson.title} (copie)`,
          sort_order: lesson.sort_order + 1,
          is_published: false
        });
      }
    }
    setBusy(false);
    await reload();
  }

  async function handleDeleteLesson(lessonId: string) {
    if (!window.confirm("Supprimer cette lecon ? Cette action est irreversible.")) return;
    setBusy(true);
    await supabase.from("track_lessons").delete().eq("id", lessonId);
    setBusy(false);
    await reload();
  }

  async function handleDuplicateLesson(lesson: LessonEntry, moduleId: string) {
    setBusy(true);
    const { data: lessonData } = await supabase.from("track_lessons").select("*").eq("id", lesson.id).single();
    if (lessonData) {
      const { id: _id, created_at: _ca, ...lessonFields } = lessonData as Record<string, unknown>;
      const { error: insertError } = await supabase.from("track_lessons").insert({
        ...lessonFields,
        module_id: moduleId,
        slug: makeCopySlug(lesson.slug),
        title: `${lesson.title} (copie)`,
        sort_order: lesson.sort_order + 1,
        is_published: false
      });
      if (insertError) setError(insertError.message);
    }
    setBusy(false);
    await reload();
  }

  async function toggleModulePublish(moduleId: string, current: boolean) {
    await supabase.from("track_modules").update({ is_published: !current }).eq("id", moduleId);
    await reload();
  }

  async function toggleLessonPublish(lessonId: string, current: boolean) {
    await supabase.from("track_lessons").update({ is_published: !current }).eq("id", lessonId);
    await reload();
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-venite text-[13px] tracking-widest text-[#888]">MODULES ET LECONS</h2>
        <span className="text-[11px] text-[#6d6d6d]">{modules.length} module(s)</span>
      </div>

      {error ? <div className="rounded-xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-[12px] text-red-200">{error}</div> : null}

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={moduleIds} strategy={verticalListSortingStrategy}>
          {modules.map((module, index) => (
            <SortableModuleCard key={module.id} id={module.id}>
              {editingId === module.id ? (
                <div className="space-y-2.5">
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
                <>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-blue-500/25 bg-blue-500/10 text-[11px] font-semibold text-blue-200 shrink-0">
                        {index + 1}
                      </span>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <div className="text-[13px] text-white font-semibold leading-tight">{module.title}</div>
                          <button
                            type="button"
                            onClick={() => toggleModulePublish(module.id, module.is_published)}
                            className={`h-2 w-2 rounded-full shrink-0 ${module.is_published ? "bg-emerald-400" : "bg-amber-400"}`}
                            title={module.is_published ? "Publie - cliquer pour brouillon" : "Brouillon - cliquer pour publier"}
                          />
                        </div>
                        <div className="text-[11px] text-[#6d6d6d]">/{module.slug}{module.summary ? ` · ${module.summary}` : ""}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button type="button" onClick={() => startEdit(module)} className="text-[#888] hover:text-white p-1" title="Editer le module">
                        <iconify-icon icon="lucide:pencil" style={{ fontSize: "14px" }} />
                      </button>
                      <button type="button" onClick={() => handleDuplicateModule(module)} disabled={busy} className="text-[#888] hover:text-white p-1" title="Dupliquer le module">
                        <iconify-icon icon="lucide:copy" style={{ fontSize: "14px" }} />
                      </button>
                      <button type="button" onClick={() => handleDeleteModule(module.id)} className="text-red-400/70 hover:text-red-400 p-1" title="Supprimer le module">
                        <iconify-icon icon="lucide:trash-2" style={{ fontSize: "14px" }} />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2 pl-1 mt-4">
                    <SortableContext items={lessonIdsByModule[module.id] || []} strategy={verticalListSortingStrategy}>
                      {module.lessons.map((lesson) => (
                        <SortableLessonRow key={`lesson-${lesson.id}`} id={`lesson-${lesson.id}`}>
                          <div className="flex items-center gap-2.5 min-w-0 flex-1">
                            <button
                              type="button"
                              onClick={() => toggleLessonPublish(lesson.id, lesson.is_published)}
                              className={`h-2 w-2 rounded-full shrink-0 ${lesson.is_published ? "bg-emerald-400" : "bg-amber-400"}`}
                              title={lesson.is_published ? "Publie - cliquer pour brouillon" : "Brouillon - cliquer pour publier"}
                            />
                            <div className="min-w-0 flex-1">
                              <div className="text-[12px] text-[#d0d0d0] leading-tight truncate">{lesson.title}</div>
                              <div className="text-[10px] text-[#666]">/{lesson.slug} · {lesson.duration_minutes} min · {lesson.xp_reward} XP</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <Link href={`${basePath}/lecons/${lesson.id}`} className="text-[#888] hover:text-white p-1" title="Editer la lecon">
                              <iconify-icon icon="lucide:pencil" style={{ fontSize: "13px" }} />
                            </Link>
                            <button type="button" onClick={() => handleDuplicateLesson(lesson, module.id)} disabled={busy} className="text-[#888] hover:text-white p-1" title="Dupliquer la lecon">
                              <iconify-icon icon="lucide:copy" style={{ fontSize: "13px" }} />
                            </button>
                            <button type="button" onClick={() => handleDeleteLesson(lesson.id)} className="text-red-400/70 hover:text-red-400 p-1" title="Supprimer la lecon">
                              <iconify-icon icon="lucide:trash-2" style={{ fontSize: "13px" }} />
                            </button>
                          </div>
                        </SortableLessonRow>
                      ))}
                    </SortableContext>
                    <Link
                      href={`${basePath}/lecons/nouveau?module=${module.id}`}
                      className="inline-flex items-center gap-1.5 text-[11px] text-[#4F8EF7] hover:underline mt-1"
                    >
                      <iconify-icon icon="lucide:plus" style={{ fontSize: "12px" }} />
                      Ajouter une lecon
                    </Link>
                  </div>
                </>
              )}
            </SortableModuleCard>
          ))}
        </SortableContext>
      </DndContext>

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
