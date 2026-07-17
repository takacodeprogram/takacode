import Link from "next/link";

interface PaginationProps {
  currentPage: number;
  hasNextPage: boolean;
  baseUrl: string;
}

export default function Pagination({ currentPage, hasNextPage, baseUrl }: PaginationProps) {
  const prevHref = currentPage > 1 ? `${baseUrl}?page=${currentPage - 1}` : "#";
  const nextHref = hasNextPage ? `${baseUrl}?page=${currentPage + 1}` : "#";

  return (
    <div className="flex items-center justify-center gap-3 pt-8">
      {currentPage > 1 ? (
        <Link
          href={prevHref}
          className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-[13px] font-medium text-[#888] hover:text-white hover:bg-white/[0.06] transition-all"
        >
          ← Page precedente
        </Link>
      ) : (
        <span className="rounded-xl border border-white/[0.04] bg-white/[0.01] px-4 py-2 text-[13px] font-medium text-[#444] cursor-not-allowed">
          ← Page precedente
        </span>
      )}
      <span className="text-[12px] text-[#555]">Page {currentPage}</span>
      {hasNextPage ? (
        <Link
          href={nextHref}
          className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-[13px] font-medium text-[#888] hover:text-white hover:bg-white/[0.06] transition-all"
        >
          Page suivante →
        </Link>
      ) : (
        <span className="rounded-xl border border-white/[0.04] bg-white/[0.01] px-4 py-2 text-[13px] font-medium text-[#444] cursor-not-allowed">
          Page suivante →
        </span>
      )}
    </div>
  );
}
