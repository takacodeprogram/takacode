import type { ReactNode } from "react";

export default function DocContent({ children }: { children: ReactNode }) {
  return (
    <div className="prose-custom max-w-3xl rounded-2xl border border-white/[0.08] bg-[#111] p-6 md:p-8">
      <style>{`
        .prose-custom h2 {
          font-size: 16px;
          font-weight: 600;
          color: #fff;
          margin: 24px 0 12px;
          font-family: var(--font-venite-italic, serif);
        }
        .prose-custom h2:first-child { margin-top: 0; }
        .prose-custom h3 {
          font-size: 14px;
          font-weight: 600;
          color: #d1d1d1;
          margin: 20px 0 8px;
        }
        .prose-custom p {
          font-size: 13px;
          line-height: 1.7;
          color: #a5a5a5;
          margin: 0 0 16px;
          font-family: var(--font-body-readable, sans-serif);
        }
        .prose-custom ol, .prose-custom ul {
          margin: 0 0 16px;
          padding-left: 20px;
        }
        .prose-custom li {
          font-size: 13px;
          line-height: 1.7;
          color: #a5a5a5;
          margin-bottom: 4px;
          font-family: var(--font-body-readable, sans-serif);
        }
        .prose-custom strong {
          color: #d1d1d1;
          font-weight: 600;
        }
      `}</style>
      {children}
    </div>
  );
}
