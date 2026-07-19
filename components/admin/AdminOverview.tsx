import Link from "next/link";
import type { PlatformStatsData } from "../../lib/platformStats";

interface User {
  id?: string;
  display_name?: string;
  email?: string;
  role?: string;
  grade?: string;
  points?: number;
  is_active?: boolean;
  isActive?: boolean;
  is_published?: boolean;
  isPublished?: boolean;
}

interface NorthStar {
  ready: boolean;
  members: number;
  withLive: number;
  withEuro: number;
  pctLive: number;
  pctEuro: number;
}

interface Props {
  users?: User[];
  tracks?: User[];
  platformStats?: PlatformStatsData | null;
  systemIssues?: string[];
  northStar?: NorthStar | null;
}

interface LeaderboardEntry {
  id?: string;
  label: string;
  grade: string;
  points: number;
}

function resolveUserLabel(user: Record<string, unknown>): string {
  const name = typeof user?.display_name === "string" ? user.display_name.trim() : "";
  if (name) {
    return name;
  }
  const email = typeof user?.email === "string" ? user.email.trim() : "";
  if (email && email.includes("@")) {
    return email.split("@")[0];
  }
  const id = typeof user?.id === "string" ? user.id : "";
  return id ? `${id.slice(0, 6)}...` : "Membre";
}

function isRoleAdmin(role: unknown): boolean {
  return String(role || "").trim().toLowerCase() === "admin";
}

interface MetricTile {
  label: string;
  value: number;
}

export default function AdminOverview({ users = [], tracks = [], platformStats = null, systemIssues = [], northStar = null }: Props) {
  const listUsers = Array.isArray(users) ? users : [];
  const listTracks = Array.isArray(tracks) ? tracks : [];

  const metrics: MetricTile[] = [
    { label: "Utilisateurs", value: listUsers.length },
    { label: "Admins", value: listUsers.filter((entry) => isRoleAdmin(entry?.role)).length },
    {
      label: "Parcours actifs",
      value: listTracks.filter((entry) => entry?.is_active !== false && entry?.isActive !== false).length
    },
    {
      label: "Publies",
      value: listTracks.filter((entry) => entry?.is_published === true || entry?.isPublished === true).length
    }
  ];

  const curriculumTiles: MetricTile[] = platformStats?.ready
    ? [
        { label: "Modules", value: platformStats.totalModules || 0 },
        { label: "Leçons", value: platformStats.totalLessons || 0 },
        { label: "Leçons validées", value: platformStats.completedLessons || 0 },
        { label: "Micro-projets soumis", value: platformStats.submittedProjects || 0 }
      ]
    : [];

  const leaderboard: LeaderboardEntry[] = [...listUsers]
    .map((entry) => ({
      id: entry?.id,
      label: resolveUserLabel(entry as Record<string, unknown>),
      grade: typeof entry?.grade === "string" && entry.grade.trim() ? entry.grade : "Starter",
      points: Number.isFinite(Number(entry?.points)) ? Number(entry.points) : 0
    }))
    .sort((a, b) => b.points - a.points)
    .slice(0, 5);

  return (
    <div className="space-y-5">
      {northStar?.ready ? (
        <div className="rounded-2xl border border-[#4F8EF7]/25 bg-[#111] p-5">
          <div className="flex items-center gap-2 mb-4">
            <iconify-icon icon="lucide:star" style={{ color: "#F59E0B", fontSize: "15px" }} />
            <span className="text-[11px] text-[#8d8d8d] uppercase tracking-widest font-semibold">Étoile du nord</span>
            <span className="text-[10px] text-[#666] font-body-readable ml-auto">{northStar.members} membres</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="flex items-end justify-between gap-2 mb-1.5">
                <span className="font-body-readable text-[12px] text-[#a5a5a5]">Membres avec un projet en ligne</span>
                <span className="text-[22px] text-white font-semibold leading-none">{northStar.pctLive}%</span>
              </div>
              <div className="h-1.5 rounded bg-white/[0.06] overflow-hidden mb-1">
                <div className="h-full rounded bg-gradient-to-r from-[#4F8EF7] to-[#9B6DFF]" style={{ width: `${northStar.pctLive}%` }} />
              </div>
              <div className="text-[10px] text-[#666] font-body-readable">{northStar.withLive} membre{northStar.withLive > 1 ? "s" : ""} avec un lien live ou un projet publié</div>
            </div>
            <div>
              <div className="flex items-end justify-between gap-2 mb-1.5">
                <span className="font-body-readable text-[12px] text-[#a5a5a5]">Membres avec un premier euro</span>
                <span className="text-[22px] text-emerald-300 font-semibold leading-none">{northStar.pctEuro}%</span>
              </div>
              <div className="h-1.5 rounded bg-white/[0.06] overflow-hidden mb-1">
                <div className="h-full rounded bg-gradient-to-r from-emerald-500 to-emerald-300" style={{ width: `${northStar.pctEuro}%` }} />
              </div>
              <div className="text-[10px] text-[#666] font-body-readable">{northStar.withEuro} membre{northStar.withEuro > 1 ? "s" : ""} avec un premier euro déclaré</div>
            </div>
          </div>
        </div>
      ) : null}

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-2.5">
        {metrics.map((tile) => (
          <div key={tile.label} className="rounded-xl border border-white/[0.08] bg-[#111] px-3.5 py-3">
            <div className="text-[10px] text-[#666] uppercase tracking-widest">{tile.label}</div>
            <div className="text-[20px] text-white font-semibold mt-1">{tile.value}</div>
          </div>
        ))}
      </div>

      {curriculumTiles.length ? (
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-2.5">
          {curriculumTiles.map((tile) => (
            <div key={tile.label} className="rounded-xl border border-white/[0.08] bg-[#111] px-3.5 py-3">
              <div className="text-[10px] text-[#666] uppercase tracking-widest">{tile.label}</div>
              <div className="text-[20px] text-white font-semibold mt-1">
                {Number.isFinite(Number(tile.value)) ? tile.value : "—"}
              </div>
            </div>
          ))}
        </div>
      ) : null}

      {systemIssues.length ? (
        <div className="rounded-xl border border-amber-500/25 bg-amber-500/10 px-4 py-3">
          <div className="text-[12px] text-amber-100 font-semibold mb-1">Action requise</div>
          <div className="space-y-1.5">
            {systemIssues.map((issue) => (
              <p key={issue} className="text-[12px] text-amber-100/90 font-body-readable">
                {issue}
              </p>
            ))}
          </div>
        </div>
      ) : null}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {leaderboard.length ? (
          <div className="rounded-2xl border border-white/[0.08] bg-[#111] p-5">
            <div className="text-[11px] text-[#8d8d8d] uppercase tracking-widest font-semibold mb-3">Leaderboard (top 5 XP)</div>
            <div className="space-y-2">
              {leaderboard.map((entry, index) => (
                <div key={entry.id || entry.label} className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-blue-500/25 bg-blue-500/10 text-[11px] font-semibold text-blue-200">
                      {index + 1}
                    </span>
                    <span className="text-[12px] text-white font-body-readable truncate">{entry.label}</span>
                    <span className="text-[10px] text-[#777] hidden sm:inline">{entry.grade}</span>
                  </div>
                  <span className="text-[12px] text-[#6ec3ff] font-semibold shrink-0">{entry.points} XP</span>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        <div className="rounded-2xl border border-white/[0.08] bg-[#111] p-5">
          <div className="text-[11px] text-[#8d8d8d] uppercase tracking-widest font-semibold mb-3">Gestion</div>
          <div className="space-y-2.5">
            <Link href="/admin/utilisateurs" className="w-full rounded-xl border border-white/[0.08] bg-white/[0.02] px-3.5 py-3 text-[12px] font-semibold text-[#d1d1d1] hover:bg-white/[0.05] transition-colors inline-flex items-center gap-2">
              <iconify-icon icon="lucide:users" style={{ color: "#4F8EF7", fontSize: "14px" }} />
              Gérer les utilisateurs
            </Link>
            <Link href="/admin/parcours" className="w-full rounded-xl border border-white/[0.08] bg-white/[0.02] px-3.5 py-3 text-[12px] font-semibold text-[#d1d1d1] hover:bg-white/[0.05] transition-colors inline-flex items-center gap-2">
              <iconify-icon icon="lucide:route" style={{ color: "#4F8EF7", fontSize: "14px" }} />
              Gérer les parcours et leurs leçons
            </Link>
            <Link href="/admin/revues" className="w-full rounded-xl border border-white/[0.08] bg-white/[0.02] px-3.5 py-3 text-[12px] font-semibold text-[#d1d1d1] hover:bg-white/[0.05] transition-colors inline-flex items-center gap-2">
              <iconify-icon icon="lucide:git-pull-request" style={{ color: "#9B6DFF", fontSize: "14px" }} />
              Historique des revues
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
