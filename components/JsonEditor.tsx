"use client";

import { useState, useCallback, useEffect } from "react";
import CodeEditor from "./CodeEditor";

interface JsonEditorProps {
  value: string;
  onChange: (value: string) => void;
  height?: string;
  label?: string;
  compact?: boolean;
  readOnly?: boolean;
}

export default function JsonEditor({
  value,
  onChange,
  height,
  label,
  compact = false,
  readOnly = false
}: JsonEditorProps) {
  const [error, setError] = useState<string | null>(null);

  const handleChange = useCallback((val: string) => {
    onChange(val);
    try {
      JSON.parse(val);
      setError(null);
    } catch {
      setError("JSON invalide");
    }
  }, [onChange]);

  useEffect(() => {
    if (!value.trim()) {
      setError(null);
      return;
    }
    try {
      JSON.parse(value);
      setError(null);
    } catch {
      setError("JSON invalide");
    }
  }, []);

  return (
    <div className="space-y-1">
      <CodeEditor
        value={value}
        onChange={handleChange}
        language="json"
        height={height || (compact ? "100px" : "200px")}
        minHeight={compact ? "60px" : "100px"}
        label={label}
        readOnly={readOnly}
      />
      {error ? (
        <p className="text-[11px] text-red-400 font-body-readable">{error}</p>
      ) : value.trim() ? (
        <p className="text-[11px] text-emerald-400/70 font-body-readable">JSON valide</p>
      ) : null}
    </div>
  );
}
