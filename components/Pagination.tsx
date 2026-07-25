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
          className="rounded-xl border border-[var(--border-3)] bg-[var(--overlay-3)] px-4 py-2 text-[13px] font-medium text-[var(--muted-3)] hover:text-[var(--text-primary)] hover:bg-[var(--overlay-6)] transition-all"
        >
          ← Page precedente
        </Link>
      ) : (
        <span className="rounded-xl border border-[var(--border-1)] bg-[var(--overlay-1)] px-4 py-2 text-[13px] font-medium text-[var(--muted-6)] cursor-not-allowed">
          ← Page precedente
        </span>
      )}
      <span className="text-[12px] text-[var(--muted-5)]">Page {currentPage}</span>
      {hasNextPage ? (
        <Link
          href={nextHref}
          className="rounded-xl border border-[var(--border-3)] bg-[var(--overlay-3)] px-4 py-2 text-[13px] font-medium text-[var(--muted-3)] hover:text-[var(--text-primary)] hover:bg-[var(--overlay-6)] transition-all"
        >
          Page suivante →
        </Link>
      ) : (
        <span className="rounded-xl border border-[var(--border-1)] bg-[var(--overlay-1)] px-4 py-2 text-[13px] font-medium text-[var(--muted-6)] cursor-not-allowed">
          Page suivante →
        </span>
      )}
    </div>
  );
}
