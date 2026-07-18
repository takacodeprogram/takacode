"use client";

import { useState, useCallback, useEffect } from "react";

interface GitHubSourceViewerProps {
  repoUrl: string;
}

interface RepoFile {
  name: string;
  path: string;
  type: "file" | "dir";
}

function extractRepoInfo(url: string): { owner: string; repo: string } | null {
  const match = url.match(/github\.com\/([^/]+)\/([^/]+)/);
  if (!match) return null;
  return { owner: match[1], repo: match[2].replace(/\.git$/, "") };
}

const TEXT_EXTENSIONS = new Set([
  "ts", "tsx", "js", "jsx", "mjs", "cjs", "json", "md", "mdx", "css", "scss",
  "html", "htm", "xml", "yaml", "yml", "toml", "env", "txt", "sh", "bash",
  "zsh", "ps1", "bat", "sql", "prisma", "graphql", "svelte", "vue", "astro",
  "cfg", "ini", "conf", "lock", "gitignore", "dockerfile", "makefile",
  "rb", "py", "go", "rs", "java", "kt", "swift", "c", "cpp", "h", "hpp"
]);

function isTextFile(name: string): boolean {
  const ext = name.split(".").pop()?.toLowerCase();
  if (!ext) return false;
  if (name.toLowerCase() === "dockerfile" || name.toLowerCase() === "makefile") return true;
  return TEXT_EXTENSIONS.has(ext);
}

const IGNORE_DIRS = new Set(["node_modules", ".next", "dist", "build", ".git", "coverage", ".cache"]);

export default function GitHubSourceViewer({ repoUrl }: GitHubSourceViewerProps) {
  const repo = extractRepoInfo(repoUrl);
  const [currentPath, setCurrentPath] = useState("");
  const [files, setFiles] = useState<RepoFile[]>([]);
  const [code, setCode] = useState<string | null>(null);
  const [codePath, setCodePath] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchFiles = useCallback(async (path: string) => {
    if (!repo) return;
    setLoading(true);
    setError("");
    setCode(null);
    setCodePath(null);

    try {
      const res = await fetch(`https://api.github.com/repos/${repo.owner}/${repo.repo}/contents/${path}`, {
        headers: { Accept: "application/vnd.github.v3+json" }
      });
      if (!res.ok) {
        setError("Impossible de lister les fichiers.");
        setFiles([]);
        return;
      }
      const data = await res.json();
      const list: RepoFile[] = Array.isArray(data) ? data
        .filter((f: { name: string; type: string }) => !IGNORE_DIRS.has(f.name))
        .filter((f: { name: string; type: string }) => f.type === "dir" || isTextFile(f.name))
        .map((f: { name: string; path: string; type: string }) => ({
          name: f.name,
          path: f.path,
          type: f.type as "file" | "dir"
        }))
        .sort((a: RepoFile, b: RepoFile) => {
          if (a.type !== b.type) return a.type === "dir" ? -1 : 1;
          return a.name.localeCompare(b.name);
        }) : [];
      setFiles(list);
    } catch {
      setError("Erreur reseau. Verifie que le repo est public.");
      setFiles([]);
    }

    setLoading(false);
  }, [repo]);

  useEffect(() => {
    if (repo) fetchFiles("");
  }, [repo, fetchFiles]);

  const fetchCode = useCallback(async (filePath: string) => {
    if (!repo) return;
    setLoading(true);
    setError("");
    setCode(null);

    const branches = ["main", "master"];
    let fetched = false;

    for (const branch of branches) {
      try {
        const res = await fetch(`https://raw.githubusercontent.com/${repo.owner}/${repo.repo}/${branch}/${filePath}`);
        if (res.ok) {
          const text = await res.text();
          setCode(text);
          setCodePath(filePath);
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
  }, [repo]);

  if (!repo) return null;

  const handleGoBack = () => {
    const parent = currentPath.includes("/") ? currentPath.substring(0, currentPath.lastIndexOf("/")) : "";
    fetchFiles(parent);
    setCurrentPath(parent);
  };

  const handleDirClick = (dirPath: string) => {
    fetchFiles(dirPath);
    setCurrentPath(dirPath);
    setCode(null);
    setCodePath(null);
  };

  return (
    <div className="rounded-2xl border border-white/[0.08] bg-[#111] p-5">
      <a href={repoUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 mb-4 hover:opacity-80">
        <iconify-icon icon="lucide:github" style={{ fontSize: "18px", color: "#888" }} />
        <span className="text-[13px] text-white font-semibold">{repo.owner}/{repo.repo}</span>
        <iconify-icon icon="lucide:external-link" style={{ fontSize: "12px", color: "#666" }} />
      </a>

      {loading && !code ? (
        <div className="text-[12px] text-[#888] font-body-readable">Chargement...</div>
      ) : null}

      {error ? (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-[11px] text-red-200 mb-3">{error}</div>
      ) : null}

      {code && codePath ? (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <button onClick={() => { setCode(null); setCodePath(null); }} className="text-[11px] text-[#4F8EF7] hover:underline inline-flex items-center gap-1">
              <iconify-icon icon="lucide:arrow-left" style={{ fontSize: "11px" }} />
              Retour
            </button>
            <span className="text-[11px] text-[#888] font-mono">{codePath}</span>
          </div>
          <pre className="bg-[#1a1a2e] border border-white/[0.08] rounded-xl p-4 overflow-x-auto max-h-[500px] overflow-y-auto">
            <code className="text-[12px] font-mono text-[#e0e0e0] leading-relaxed whitespace-pre">{code}</code>
          </pre>
        </div>
      ) : files.length > 0 ? (
        <div>
          {currentPath ? (
            <button onClick={handleGoBack} className="text-[11px] text-[#4F8EF7] hover:underline inline-flex items-center gap-1 mb-2">
              <iconify-icon icon="lucide:arrow-left" style={{ fontSize: "11px" }} />
              ../
            </button>
          ) : null}
          <div className="space-y-0.5 max-h-[300px] overflow-y-auto">
            {files.map((file) => (
              <button
                key={file.path}
                onClick={() => file.type === "dir" ? handleDirClick(file.path) : fetchCode(file.path)}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left hover:bg-white/[0.04] transition-colors"
              >
                <iconify-icon
                  icon={file.type === "dir" ? "lucide:folder" : "lucide:file-code"}
                  style={{ fontSize: "14px", color: file.type === "dir" ? "#F59E0B" : "#4F8EF7" }}
                />
                <span className="text-[12px] text-[#ccc] font-mono truncate">{file.name}</span>
              </button>
            ))}
          </div>
        </div>
      ) : !loading && !error ? (
        <div className="text-[12px] text-[#666] font-body-readable text-center py-4">
          Aucun fichier source trouve.
        </div>
      ) : null}
    </div>
  );
}
