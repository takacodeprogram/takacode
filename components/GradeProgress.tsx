import { getGradeProgress } from "../lib/grades";

interface Props {
  points?: number;
  compact?: boolean;
}

export default function GradeProgress({ points = 0, compact = false }: Props) {
  const { points: p, current, next, percent, pointsToNext } = getGradeProgress(points);

  return (
    <article className="rounded-2xl border border-white/[0.08] bg-[#111] p-5">
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-blue-500/25 bg-blue-500/10">
            <iconify-icon icon={current.icon} style={{ fontSize: "18px", color: "#89c7ff" }} />
          </span>
          <div>
            <div className="text-[10px] text-[#666] uppercase tracking-widest">Grade actuel</div>
            <div className="text-[14px] text-white font-semibold leading-tight">{current.label}</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-[10px] text-[#666] uppercase tracking-widest">Points</div>
          <div className="text-[14px] text-white font-semibold">{p}</div>
        </div>
      </div>

      {next ? (
        <>
          <div className="flex items-center justify-between text-[11px] mb-1.5">
            <span className="text-[#888]">Vers {next.label}</span>
            <span className="text-[#89c7ff] font-semibold">{pointsToNext} pts restants</span>
          </div>
          <div className="h-1.5 rounded bg-white/[0.06] overflow-hidden">
            <div className="h-full rounded bg-gradient-to-r from-[#4F8EF7] to-[#9B6DFF]" style={{ width: `${percent}%` }} />
          </div>
        </>
      ) : (
        <div className="rounded-xl border border-amber-500/25 bg-amber-500/10 px-3.5 py-2.5 text-[12px] text-amber-100 font-body-readable">
          Grade maximum atteint. Tu es une Legende TakaCode !
        </div>
      )}

      {!compact ? (
        <p className="font-body-readable text-[11px] text-[#9b9b9b] leading-snug mt-3">
          <span className="text-[#7a7a7a]">Avantage {current.label} : </span>
          {current.perk}
        </p>
      ) : null}
    </article>
  );
}
