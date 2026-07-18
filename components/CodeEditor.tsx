"use client";

import { useCallback, useMemo } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { javascript } from "@codemirror/lang-javascript";
import { json } from "@codemirror/lang-json";
import { oneDark } from "@codemirror/theme-one-dark";
import type { Extension } from "@codemirror/state";

export type EditorLang = "html" | "css" | "js" | "ts" | "json" | "text";

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: EditorLang;
  height?: string;
  minHeight?: string;
  placeholder?: string;
  readOnly?: boolean;
  maxLength?: number;
  label?: string;
}

const LANG_MAP: Record<EditorLang, Extension> = {
  html: html(),
  css: css(),
  js: javascript({ jsx: true }),
  ts: javascript({ typescript: true, jsx: true }),
  json: json(),
  text: []
};

export default function CodeEditor({
  value,
  onChange,
  language = "text",
  height,
  minHeight = "120px",
  placeholder = "",
  readOnly = false,
  maxLength,
  label
}: CodeEditorProps) {
  const extensions = useMemo(() => [LANG_MAP[language] || []].flat(), [language]);

  const handleChange = useCallback((val: string) => {
    if (maxLength && val.length > maxLength) return;
    onChange(val);
  }, [onChange, maxLength]);

  return (
    <div className="space-y-1.5">
      {label ? (
        <label className="text-[11px] text-[#8d8d8d] uppercase tracking-widest font-semibold">{label}</label>
      ) : null}
      <div className="rounded-xl border border-white/[0.08] overflow-hidden [&_.cm-editor]:outline-none [&_.cm-gutters]:border-r-white/[0.06] [&_.cm-activeLineGutter]:bg-white/[0.03]">
        <CodeMirror
          value={value}
          onChange={handleChange}
          extensions={extensions}
          theme={oneDark}
          height={height}
          minHeight={minHeight}
          placeholder={placeholder}
          readOnly={readOnly}
          basicSetup={{
            lineNumbers: true,
            highlightActiveLineGutter: true,
            highlightActiveLine: !readOnly,
            foldGutter: true,
            bracketMatching: true,
            closeBrackets: !readOnly,
            autocompletion: language === "json",
            indentOnInput: !readOnly,
            tabSize: 2
          }}
        />
      </div>
    </div>
  );
}
