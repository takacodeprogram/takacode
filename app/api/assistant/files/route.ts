import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "../../../../utils/supabase/server";

export const runtime = "nodejs";
export const maxDuration = 60;

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const MAX_EXTRACTED_CHARS = 50_000;

const PDF_TYPE = "application/pdf";
const DOCX_TYPE = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

const TEXT_TYPES = new Set([
  "text/plain", "text/markdown", "text/x-markdown", "text/csv", "text/tab-separated-values",
  "text/html", "text/css", "text/javascript", "text/xml", "text/yaml", "text/x-yaml",
  "application/json", "application/javascript", "application/x-javascript",
  "application/typescript", "application/xml", "application/x-yaml", "application/sql"
]);
const IMAGE_TYPES = new Set(["image/png", "image/jpeg", "image/webp"]);
const ALLOWED_TYPES = new Set([...TEXT_TYPES, PDF_TYPE, DOCX_TYPE, ...IMAGE_TYPES]);

// Les navigateurs renvoient souvent un type MIME vide ou générique
// (application/octet-stream) pour .md, .ts, .csv... On retombe alors sur
// l'extension, sinon un fichier parfaitement lisible serait rejeté à l'upload.
const EXTENSION_TYPES: Record<string, string> = {
  txt: "text/plain", md: "text/markdown", markdown: "text/markdown",
  csv: "text/csv", tsv: "text/tab-separated-values",
  html: "text/html", htm: "text/html", css: "text/css",
  js: "text/javascript", mjs: "text/javascript", cjs: "text/javascript",
  ts: "application/typescript", tsx: "application/typescript", jsx: "text/javascript",
  json: "application/json", xml: "application/xml",
  yml: "text/yaml", yaml: "text/yaml", sql: "application/sql",
  pdf: PDF_TYPE, docx: DOCX_TYPE,
  png: "image/png", jpg: "image/jpeg", jpeg: "image/jpeg", webp: "image/webp"
};

function safeName(name: string): string {
  return name.normalize("NFKD").replace(/[^a-zA-Z0-9._-]+/g, "-").replace(/-+/g, "-").slice(0, 120) || "fichier";
}

function resolveMimeType(file: File): string {
  const declared = (file.type || "").toLowerCase().split(";")[0].trim();
  if (ALLOWED_TYPES.has(declared)) return declared;
  const ext = file.name.split(".").pop()?.toLowerCase() || "";
  return EXTENSION_TYPES[ext] || declared;
}

function stripNulls(value: string): string {
  return value.split(String.fromCharCode(0)).join("");
}

function cleanText(value: string): string {
  return stripNulls(value).replace(/[ \t]+\n/g, "\n").trim().slice(0, MAX_EXTRACTED_CHARS);
}

async function extractPdf(buffer: Buffer): Promise<string> {
  const { PDFParse } = await import("pdf-parse");
  const parser = new PDFParse({ data: new Uint8Array(buffer) });
  try {
    const parsed = await parser.getText();
    return cleanText(String(parsed?.text || ""));
  } finally {
    await Promise.resolve(parser.destroy?.()).catch(() => {});
  }
}

async function extractDocx(buffer: Buffer): Promise<string> {
  const mammoth: any = await import("mammoth");
  const extract = mammoth.extractRawText || mammoth.default?.extractRawText;
  const result = await extract({ buffer });
  return cleanText(String(result?.value || ""));
}

interface Extraction {
  text: string;
  warning: string;
}

async function extractContent(mimeType: string, buffer: Buffer, bytes: ArrayBuffer): Promise<Extraction> {
  try {
    if (TEXT_TYPES.has(mimeType)) {
      return { text: cleanText(new TextDecoder().decode(bytes)), warning: "" };
    }
    if (mimeType === PDF_TYPE) {
      const text = await extractPdf(buffer);
      return text
        ? { text, warning: "" }
        : { text: "", warning: "Ce PDF ne contient aucun texte sélectionnable (probablement un scan). L'assistant ne pourra pas le lire." };
    }
    if (mimeType === DOCX_TYPE) {
      const text = await extractDocx(buffer);
      return text ? { text, warning: "" } : { text: "", warning: "Ce document Word semble vide." };
    }
    if (IMAGE_TYPES.has(mimeType)) {
      return { text: "", warning: "L'assistant ne lit pas encore le contenu des images : décris-la dans ton message." };
    }
    return { text: "", warning: "" };
  } catch (err: any) {
    console.error(`Extraction failed for ${mimeType}:`, err);
    return { text: "", warning: `Extraction du contenu impossible : ${err?.message || "erreur inconnue"}` };
  }
}

export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "not_authenticated" }, { status: 401 });

  const form = await request.formData().catch(() => null);
  const file = form?.get("file");
  const contextKind = String(form?.get("contextKind") || "generic");
  const contextRef = String(form?.get("contextRef") || "").slice(0, 200);
  if (!(file instanceof File)) return NextResponse.json({ error: "missing_file" }, { status: 400 });

  const mimeType = resolveMimeType(file);
  if (!ALLOWED_TYPES.has(mimeType)) {
    return NextResponse.json({ error: "unsupported_type", message: "Format non pris en charge." }, { status: 415 });
  }
  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json({ error: "file_too_large", message: "Le fichier dépasse 10 Mo." }, { status: 413 });
  }

  const id = crypto.randomUUID();
  const storagePath = `${user.id}/${id}/${safeName(file.name)}`;
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Une extraction ratée ne doit pas bloquer l'envoi : on garde la pièce jointe
  // et on remonte un avertissement pour que l'utilisateur sache pourquoi
  // l'assistant ne verra pas le contenu.
  const { text: extractedText, warning } = await extractContent(mimeType, buffer, bytes);

  const { error: uploadError } = await supabase.storage
    .from("ai-chat-files")
    .upload(storagePath, buffer, { contentType: mimeType, upsert: false });
  if (uploadError) return NextResponse.json({ error: "upload_failed", message: uploadError.message }, { status: 500 });

  const { data, error } = await supabase
    .from("ai_chat_attachments")
    .insert({
      id,
      user_id: user.id,
      context_kind: contextKind,
      context_ref: contextRef,
      storage_path: storagePath,
      file_name: file.name.slice(0, 255),
      mime_type: mimeType,
      size_bytes: file.size,
      extracted_text: extractedText
    })
    .select("id, file_name, mime_type, size_bytes")
    .single();
  if (error) {
    await supabase.storage.from("ai-chat-files").remove([storagePath]);
    return NextResponse.json({ error: "db_error", message: error.message }, { status: 500 });
  }

  return NextResponse.json({
    attachment: { ...data, extracted_chars: extractedText.length, warning: warning || undefined }
  });
}
