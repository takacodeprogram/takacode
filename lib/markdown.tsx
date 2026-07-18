import React from "react";

function escapeHtml(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function inlineCode(text: string): React.ReactNode {
  return React.createElement("code", {
    className: "bg-white/[0.08] px-1.5 py-0.5 rounded text-[12px] font-mono text-[#f0a0ff]",
    key: "code-" + Math.random().toString(36).slice(2)
  }, text);
}

function link(href: string, text: string): React.ReactNode {
  return React.createElement("a", {
    href,
    target: "_blank",
    rel: "noopener noreferrer",
    className: "text-[#4F8EF7] hover:underline",
    key: "link-" + Math.random().toString(36).slice(2)
  }, text);
}

function processInline(text: string): (string | React.ReactNode)[] {
  const parts: (string | React.ReactNode)[] = [];
  let remaining = text;

  while (remaining.length > 0) {
    const codeMatch = remaining.match(/^`([^`]+)`/);
    if (codeMatch) {
      parts.push(inlineCode(codeMatch[1]));
      remaining = remaining.slice(codeMatch[0].length);
      continue;
    }

    const boldMatch = remaining.match(/^\*\*(.+?)\*\*/);
    if (boldMatch) {
      parts.push(React.createElement("strong", { key: parts.length }, boldMatch[1]));
      remaining = remaining.slice(boldMatch[0].length);
      continue;
    }

    const italicMatch = remaining.match(/^\*(.+?)\*/);
    if (italicMatch && !italicMatch[1].startsWith(" ")) {
      parts.push(React.createElement("em", { key: parts.length }, italicMatch[1]));
      remaining = remaining.slice(italicMatch[0].length);
      continue;
    }

    const linkMatch = remaining.match(/^\[([^\]]+)\]\(([^)]+)\)/);
    if (linkMatch) {
      parts.push(link(linkMatch[2], linkMatch[1]));
      remaining = remaining.slice(linkMatch[0].length);
      continue;
    }

    const imageMatch = remaining.match(/^!\[([^\]]*)\]\(([^)]+)\)/);
    if (imageMatch) {
      parts.push(React.createElement("img", {
        src: imageMatch[2],
        alt: imageMatch[1] || "",
        className: "max-w-full rounded-lg my-2",
        key: "img-" + parts.length
      }));
      remaining = remaining.slice(imageMatch[0].length);
      continue;
    }

    const emojiMatch = remaining.match(/^:([a-zA-Z0-9_+-]+):/);
    if (emojiMatch) {
      parts.push(emojiMatch[0]);
      remaining = remaining.slice(emojiMatch[0].length);
      continue;
    }

    parts.push(remaining[0]);
    remaining = remaining.slice(1);
  }

  return parts;
}

function isListLine(line: string): { type: "ul" | "ol"; content: string; indent: number } | null {
  const ulMatch = line.match(/^(\s*)[-*+]\s+(.*)$/);
  if (ulMatch) return { type: "ul", content: ulMatch[2], indent: ulMatch[1].length };

  const olMatch = line.match(/^(\s*)\d+\.\s+(.*)$/);
  if (olMatch) return { type: "ol", content: olMatch[2], indent: olMatch[1].length };

  return null;
}

function parseInlineToHtml(text: string): string {
  return escapeHtml(text)
    .replace(/&grave;([^&grave;]+)&grave;/g, "<code class=\"bg-white\\/[0.08] px-1.5 py-0.5 rounded text-[12px] font-mono text-[#f0a0ff]\">$1</code>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, "<a href=\"$2\" target=\"_blank\" rel=\"noopener noreferrer\" class=\"text-[#4F8EF7] hover:underline\">$1</a>");
}

interface RichBlock {
  type: "paragraph" | "heading" | "code" | "ul" | "ol" | "empty";
  level?: number;
  content?: string;
  items?: { content: string; indent: number }[];
  language?: string;
}

function parseBlocks(text: string): RichBlock[] {
  const lines = text.split("\n");
  const blocks: RichBlock[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.trim() === "") {
      i++;
      continue;
    }

    const headingMatch = line.match(/^(#{1,3})\s+(.+)$/);
    if (headingMatch) {
      blocks.push({ type: "heading", level: headingMatch[1].length, content: headingMatch[2] });
      i++;
      continue;
    }

    if (line.startsWith("```")) {
      const language = line.slice(3).trim();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      i++;
      blocks.push({ type: "code", language: language || undefined, content: codeLines.join("\n") });
      continue;
    }

    const listStart = isListLine(line);
    if (listStart) {
      const items: { content: string; indent: number }[] = [];
      while (i < lines.length) {
        const item = isListLine(lines[i]);
        if (!item || item.type !== listStart.type) break;
        items.push({ content: item.content, indent: item.indent });
        i++;
      }
      blocks.push({ type: listStart.type, items });
      continue;
    }

    const paraLines: string[] = [];
    while (i < lines.length) {
      const trimmed = lines[i].trim();
      if (trimmed === "" || lines[i].startsWith("#") || lines[i].startsWith("```") || isListLine(lines[i]) || lines[i].startsWith("---") || lines[i].startsWith("___")) break;
      paraLines.push(lines[i]);
      i++;
    }
    blocks.push({ type: "paragraph", content: paraLines.join("\n") });
  }

  return blocks;
}

export function renderMarkdownToReact(text: string | null | undefined): React.ReactNode {
  if (!text) return null;

  const blocks = parseBlocks(text);
  const elements: React.ReactNode[] = [];

  for (let idx = 0; idx < blocks.length; idx++) {
    const block = blocks[idx];
    const key = `md-${idx}`;

    switch (block.type) {
      case "heading": {
        const tagName = `h${block.level || 2}`;
        elements.push(
          React.createElement(tagName, {
            className: "font-venite-italic text-white mb-2 mt-4",
            style: { fontSize: block.level === 1 ? "20px" : block.level === 2 ? "17px" : "15px" },
            key
          } as React.HTMLAttributes<HTMLElement>, processInline(block.content || ""))
        );
        break;
      }
      case "paragraph": {
        const lines = (block.content || "").split("\n").filter(Boolean);
        const lineElements = lines.flatMap((ln, li) =>
          li < lines.length - 1
            ? [...processInline(ln), React.createElement("br", { key: `${key}-br-${li}` })]
            : processInline(ln)
        );
        elements.push(
          React.createElement("p", {
            className: "font-body-readable text-[13px] text-[#b5b5b5] leading-relaxed mb-3",
            key
          }, ...lineElements)
        );
        break;
      }
      case "code":
        elements.push(
          React.createElement("pre", {
            className: "bg-[#1a1a2e] border border-white/[0.08] rounded-xl p-4 overflow-x-auto mb-3",
            key
          },
            React.createElement("code", {
              className: "text-[12px] font-mono text-[#e0e0e0] leading-relaxed"
            }, block.content)
          )
        );
        break;
      case "ul":
        elements.push(
          React.createElement("ul", {
            className: "list-disc list-inside space-y-1 mb-3 font-body-readable text-[13px] text-[#b5b5b5]",
            key
          },
            ...(block.items || []).map((item, ii) =>
              React.createElement("li", { key: `${key}-li-${ii}` }, ...processInline(item.content))
            )
          )
        );
        break;
      case "ol":
        elements.push(
          React.createElement("ol", {
            className: "list-decimal list-inside space-y-1 mb-3 font-body-readable text-[13px] text-[#b5b5b5]",
            key
          },
            ...(block.items || []).map((item, ii) =>
              React.createElement("li", { key: `${key}-li-${ii}` }, ...processInline(item.content))
            )
          )
        );
        break;
    }
  }

  return elements.length > 0 ? React.createElement(React.Fragment, null, ...elements) : text;
}

export function renderMarkdownToHtml(text: string | null | undefined): string {
  if (!text) return "";

  const blocks = parseBlocks(text);
  let html = "";

  for (const block of blocks) {
    switch (block.type) {
      case "heading":
        html += `<h${block.level} style="font-family:var(--font-venite-italic);color:white;margin-bottom:8px;margin-top:16px;font-size:${block.level === 1 ? "20px" : block.level === 2 ? "17px" : "15px"}">${parseInlineToHtml(block.content || "")}</h${block.level}>`;
        break;
      case "paragraph":
        html += `<p class="font-body-readable" style="font-size:13px;color:#b5b5b5;line-height:1.625;margin-bottom:12px">${parseInlineToHtml((block.content || "").replace(/\n/g, "<br/>"))}</p>`;
        break;
      case "code":
        html += `<pre style="background:#1a1a2e;border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:16px;overflow-x:auto;margin-bottom:12px"><code style="font-size:12px;font-family:monospace;color:#e0e0e0;line-height:1.625">${escapeHtml(block.content || "")}</code></pre>`;
        break;
      case "ul": {
        let listHtml = '<ul style="list-style:disc;padding-left:20px;margin-bottom:12px;font-size:13px;color:#b5b5b5">';
        for (const item of block.items || []) {
          listHtml += `<li>${parseInlineToHtml(item.content)}</li>`;
        }
        listHtml += "</ul>";
        html += listHtml;
        break;
      }
      case "ol": {
        let listHtml = '<ol style="list-style:decimal;padding-left:20px;margin-bottom:12px;font-size:13px;color:#b5b5b5">';
        for (const item of block.items || []) {
          listHtml += `<li>${parseInlineToHtml(item.content)}</li>`;
        }
        listHtml += "</ol>";
        html += listHtml;
        break;
      }
    }
  }

  return html;
}

const ALLOWED_HTML_TAGS = new Set([
  "p", "br", "b", "i", "strong", "em", "u", "s", "a", "ul", "ol", "li",
  "h1", "h2", "h3", "h4", "h5", "h6", "pre", "code", "blockquote",
  "img", "span", "div", "hr", "table", "thead", "tbody", "tr", "th", "td",
  "iconify-icon"
]);

const ALLOWED_ATTRS = new Set([
  "href", "target", "rel", "src", "alt", "class", "style", "id",
  "icon", "width", "height"
]);

const MARKDOWN_RE = /(?:\*\*|__|[*_]\*|[`#]|!\[|\n[*-]|\n\d+\.|\n>|<\/?\w+)/;

export function looksLikeMarkdown(text: string | null | undefined): boolean {
  if (!text) return false;
  return MARKDOWN_RE.test(text);
}

export function sanitizeHtml(html: string): string {
  return html.replace(/<(\/?)(\w[\w-]*)([^>]*)>/gi, (_match: string, closing: string, tagName: string, attrs: string) => {
    const tag = tagName.toLowerCase();
    if (!ALLOWED_HTML_TAGS.has(tag) && !tag.startsWith("iconify")) return "";
    const safeAttrs = attrs.replace(/(\w[\w-]*)\s*=\s*"([^"]*)"/gi, (_amatch: string, attrName: string, attrValue: string) => {
      const attr = attrName.toLowerCase();
      if (!ALLOWED_ATTRS.has(attr)) return "";
      if (attr === "href" || attr === "src") {
        if (attrValue.startsWith("javascript:") || attrValue.startsWith("data:")) return "";
      }
      return ` ${attr}="${attrValue.replace(/"/g, "&quot;")}"`;
    });
    return `<${closing}${tag}${safeAttrs}>`;
  }).replace(/<script[\s\S]*?<\/script>/gi, "").replace(/on\w+\s*=\s*"[^"]*"/gi, "");
}
