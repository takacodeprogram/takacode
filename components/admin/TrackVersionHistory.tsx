"use client";

import { useEffect, useState } from "react";
import { createClient } from "../../utils/supabase/client";

interface VersionEntry {
  id: string;
  track_id: string;
  snapshot: Record<string, unknown>;
  label: string | null;
  created_at: string;
}

interface TrackVersionHistoryProps {
  trackId: string;
  onRestore: (snapshot: Record<string, unknown>) => void;
  onCompare?: (version: VersionEntry) => void;
}

export default function TrackVersionHistory({ trackId, onRestore, onCompare }: TrackVersionHistoryProps) {
  const supabase = createClient();
  const [versions, setVersions] = useState<VersionEntry[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [restoring, setRestoring] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const { data } = await supabase
      .from("track_versions")
      .select("id, track_id, snapshot, label, created_at")
      .eq("track_id", trackId)
      .order("created_at", { ascending: false });
    setVersions((data || []) as VersionEntry[]);
    setLoading(false);
  }

  useEffect(() => {
    if (open) load();
  }, [open, trackId]);

  async function handleRestore(version: VersionEntry) {
    if (!window.confirm(`Restaurer la version du ${new Date(version.created_at).toLocaleString("fr-FR")} ? Les modifications non enregistrees seront perdues.`)) return;
    setRestoring(version.id);
    onRestore(version.snapshot);
    setRestoring(null);
  }

  async function handleDelete(versionId: string) {
    if (!window.confirm("Supprimer cette version ?")) return;
    await supabase.from("track_versions").delete().eq("id", versionId);
    setVersions((prev) => prev.filter((v) => v.id !== versionId));
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 text-[10px] text-[#6d6d6d] uppercase tracking-widest hover:text-[#aaa] transition-colors"
      >
        <iconify-icon icon={open ? "lucide:clock" : "lucide:clock"} style={{ fontSize: "12px" }} />
        Historique des versions {open ? "— masquer" : `— ${versions.length || ""}`}
      </button>

      {open && (
        <div className="mt-2 space-y-2 max-h-[300px] overflow-y-auto">
          {loading ? (
            <div className="text-[11px] text-[#6d6d6d]">Chargement...</div>
          ) : versions.length === 0 ? (
            <div className="text-[11px] text-[#6d6d6d]">Aucune version enregistree.</div>
          ) : (
            versions.map((version) => (
              <div key={version.id} className="flex items-center justify-between gap-2 rounded-lg border border-white/[0.06] bg-[#0f0f0f] px-3 py-2">
                <div className="min-w-0">
                  <div className="text-[11px] text-[#d0d0d0]">
                    {new Date(version.created_at).toLocaleString("fr-FR", {
                      day: "numeric", month: "short", year: "numeric",
                      hour: "2-digit", minute: "2-digit"
                    })}
                  </div>
                  {version.label && <div className="text-[10px] text-[#666]">{version.label}</div>}
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleRestore(version)}
                    disabled={restoring === version.id}
                    className="text-[10px] text-[#4F8EF7] hover:underline disabled:opacity-50"
                  >
                    Restaurer
                  </button>
                  {onCompare && (
                    <button
                      type="button"
                      onClick={() => onCompare(version)}
                      className="text-[10px] text-[#89c7ff] hover:underline"
                    >
                      Comparer
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleDelete(version.id)}
                    className="text-[10px] text-red-400/70 hover:text-red-400"
                  >
                    <iconify-icon icon="lucide:trash-2" style={{ fontSize: "11px" }} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
