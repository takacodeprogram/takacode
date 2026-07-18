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
        <span className="text-[10px] text-[#8d8d8d] uppercase tracking-widest font-semibold block mb-1">{label}</span>
      ) : null}
      <div className="flex gap-1 rounded-xl border border-white/[0.08] bg-white/[0.02] p-1">
        {FORMATS.map((fmt) => (
          <button
            key={fmt.value}
            type="button"
            onClick={() => onChange(fmt.value)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all ${
              value === fmt.value
                ? "bg-[#4F8EF7] text-white"
                : "text-[#888] hover:text-white hover:bg-white/[0.05]"
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
