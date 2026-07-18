"use client";

import { useState, useCallback } from "react";

interface GitHubSourceViewerProps {
  repoUrl: string;
}

function extractRepoInfo(url: string): { owner: string; repo: string } | null {
  const match = url.match(/github\.com\/([^/]+)\/([^/]+)/);
  if (!match) return null;
  return { owner: match[1], repo: match[2].replace(/\.git$/, "") };
}

export default function GitHubSourceViewer({ repoUrl }: GitHubSourceViewerProps) {
  const [filePath, setFilePath] = useState("");
  const [code, setCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const repo = extractRepoInfo(repoUrl);
  if (!repo) return null;

  const handleFetch = useCallback(async () => {
    if (!filePath.trim()) return;
    setLoading(true);
    setError("");
    setCode(null);

    const branches = ["main", "master"];
    let fetched = false;

    for (const branch of branches) {
      try {
        const res = await fetch(`https://raw.githubusercontent.com/${repo.owner}/${repo.repo}/${branch}/${filePath.replace(/^\//, "")}`);
        if (res.ok) {
          const text = await res.text();
          setCode(text);
          fetched = true;
          break;
        }
      } catch {
        continue;
      }
    }

    if (!fetched) {
      setError("Fichier introuvable sur main ou master.");
    }

    setLoading(false);
  }, [filePath, repo]);

  if (!repoUrl || !repo) return null;

  return (
    <div className="rounded-2xl border border-white/[0.08] bg-[#111] p-5">
      <div className="flex items-center gap-2 mb-3">
        <iconify-icon icon="lucide:github" style={{ fontSize: "16px", color: "#888" }} />
        <div className="text-[10px] text-[#666] uppercase tracking-widest font-semibold">Code source</div>
      </div>
      <div className="flex gap-2 mb-3">
        <input
          className="auth-input text-[12px] flex-1"
          placeholder="src/app/page.tsx"
          value={filePath}
          onChange={(e) => setFilePath(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleFetch()}
        />
        <button onClick={handleFetch} disabled={loading || !filePath.trim()} className="btn-primary text-[12px] px-3 py-2">
          {loading ? "..." : "Voir"}
        </button>
      </div>
      {error ? <p className="text-[12px] text-red-300">{error}</p> : null}
      {code ? (
        <pre className="bg-[#1a1a2e] border border-white/[0.08] rounded-xl p-4 overflow-x-auto max-h-[400px] overflow-y-auto">
          <code className="text-[12px] font-mono text-[#e0e0e0] leading-relaxed whitespace-pre">{code}</code>
        </pre>
      ) : null}
    </div>
  );
}
