"use client";

type Format = "text" | "markdown" | "html";

interface FormatPickerProps {
  value: Format;
  onChange: (format: Format) => void;
  label?: string;
}

const FORMATS: { value: Format; label: string; icon: string }[] = [
  { value: "text", label: "Texte", icon: "lucide:type" },
  { value: "markdown", label: "Markdown", icon: "lucide:file-text" },
  { value: "html", label: "HTML", icon: "lucide:code-2" }
];

export default function FormatPicker({ value, onChange, label }: FormatPickerProps) {
  return (
    <div>
      {label ? (
        <span className="text-[10px] text-[var(--muted-3)] uppercase tracking-widest font-semibold block mb-1">{label}</span>
      ) : null}
      <div className="flex gap-1 rounded-xl border border-[var(--border-3)] bg-[var(--overlay-2)] p-1">
        {FORMATS.map((fmt) => (
          <button
            key={fmt.value}
            type="button"
            onClick={() => onChange(fmt.value)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all ${
              value === fmt.value
                ? "bg-[#4F8EF7] text-[var(--text-primary)]"
                : "text-[var(--muted-3)] hover:text-[var(--text-primary)] hover:bg-[var(--overlay-5)]"
            }`}
          >
            <iconify-icon icon={fmt.icon} style={{ fontSize: "13px" }} />
            {fmt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
