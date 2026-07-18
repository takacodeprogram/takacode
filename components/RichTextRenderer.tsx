import { renderMarkdownToReact, renderMarkdownToHtml, sanitizeHtml } from "../lib/markdown";

type Format = "text" | "markdown" | "html";

interface RichTextRendererProps {
  content: string | null | undefined;
  format?: Format;
  className?: string;
  fallback?: string;
}

export default function RichTextRenderer({ content, format = "text", className = "", fallback }: RichTextRendererProps) {
  if (!content) {
    if (fallback) return <p className={`font-body-readable text-[13px] text-[#666] ${className}`}>{fallback}</p>;
    return null;
  }

  if (format === "html") {
    const sanitized = sanitizeHtml(content);
    return (
      <div
        className={`font-body-readable text-[13px] text-[#b5b5b5] leading-relaxed [&_iconify-icon]:inline [&_iconify-icon]:align-middle ${className}`}
        dangerouslySetInnerHTML={{ __html: sanitized }}
      />
    );
  }

  if (format === "markdown") {
    return <div className={`font-body-readable ${className}`}>{renderMarkdownToReact(content)}</div>;
  }

  return (
    <p className={`font-body-readable text-[13px] text-[#b5b5b5] leading-relaxed whitespace-pre-wrap ${className}`}>
      {content}
    </p>
  );
}
