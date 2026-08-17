import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "../../../../utils/supabase/server";

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const TEXT_TYPES = new Set([
  "text/plain", "text/markdown", "text/csv", "text/html", "text/css",
  "application/json", "application/javascript", "application/typescript", "application/xml"
]);
const ALLOWED_TYPES = new Set([
  ...TEXT_TYPES,
  "application/pdf", "image/png", "image/jpeg", "image/webp"
]);

function safeName(name: string): string {
  return name.normalize("NFKD").replace(/[^a-zA-Z0-9._-]+/g, "-").replace(/-+/g, "-").slice(0, 120) || "fichier";
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
  if (!ALLOWED_TYPES.has(file.type)) return NextResponse.json({ error: "unsupported_type", message: "Format non pris en charge." }, { status: 415 });
  if (file.size > MAX_FILE_SIZE) return NextResponse.json({ error: "file_too_large", message: "Le fichier dépasse 10 Mo." }, { status: 413 });

  const id = crypto.randomUUID();
  const storagePath = `${user.id}/${id}/${safeName(file.name)}`;
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const extractedText = TEXT_TYPES.has(file.type)
    ? new TextDecoder().decode(bytes).replace(/\u0000/g, "").slice(0, 50_000)
    : "";

  const { error: uploadError } = await supabase.storage
    .from("ai-chat-files")
    .upload(storagePath, buffer, { contentType: file.type, upsert: false });
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
      mime_type: file.type,
      size_bytes: file.size,
      extracted_text: extractedText
    })
    .select("id, file_name, mime_type, size_bytes")
    .single();
  if (error) {
    await supabase.storage.from("ai-chat-files").remove([storagePath]);
    return NextResponse.json({ error: "db_error", message: error.message }, { status: 500 });
  }

  return NextResponse.json({ attachment: data });
}
