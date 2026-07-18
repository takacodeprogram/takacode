"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "./Toast";

interface DeclareFirstEuroProps {
  projectId: string;
  alreadyDeclared: boolean;
}

export default function DeclareFirstEuro({ projectId, alreadyDeclared }: DeclareFirstEuroProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [declaring, setDeclaring] = useState(false);

  if (alreadyDeclared) {
    return (
      <span className="inline-flex items-center gap-1.5 text-[11px] text-emerald-300 font-semibold">
        <iconify-icon icon="lucide:badge-check" style={{ fontSize: "12px" }} />
        1er euro declare — bravo !
      </span>
    );
  }

  async function handleDeclare() {
    if (declaring) return;
    setDeclaring(true);
    try {
      const res = await fetch("/api/projects/first-euro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId })
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        toast(data?.error || "Erreur", "error");
        return;
      }
      toast("Premier euro declare !", "success");
      router.refresh();
    } catch {
      toast("Erreur reseau", "error");
    } finally {
      setDeclaring(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleDeclare}
      disabled={declaring}
      className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-lg border border-amber-500/40 bg-amber-500/10 text-amber-200 hover:bg-amber-500/20 transition-all disabled:opacity-50"
    >
      <iconify-icon icon={declaring ? "lucide:loader-circle" : "lucide:banknote"} style={{ fontSize: "12px" }} />
      {declaring ? "Declaration..." : "Declarer mon premier euro"}
    </button>
  );
}
