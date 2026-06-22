import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getUserAccessContext } from "../../../../lib/auth";
import { buildAdminPitchDeckBuffer } from "../../../../lib/adminPitchDeck";
import { createClient } from "../../../../utils/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function resolveAppUrl() {
  const candidates = [
    process.env.NEXT_PUBLIC_APP_URL,
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${String(process.env.VERCEL_PROJECT_PRODUCTION_URL).replace(/^https?:\/\//i, "")}`
      : "",
    "https://takacode.vercel.app"
  ];

  for (const candidate of candidates) {
    const value = String(candidate || "").trim();
    if (!value) {
      continue;
    }

    if (/^https?:\/\//i.test(value)) {
      return value;
    }

    return `https://${value.replace(/^\/+/, "")}`;
  }

  return "https://takacode.vercel.app";
}

export async function GET() {
  try {
    const cookieStore = await cookies();
    const supabase = await createClient(cookieStore);

    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Non authentifie" }, { status: 401 });
    }

    const accessContext = await getUserAccessContext(supabase, user);

    if (!accessContext.hasRole(["admin"])) {
      return NextResponse.json({ error: "Acces admin requis" }, { status: 403 });
    }

    const buffer = await buildAdminPitchDeckBuffer({
      appUrl: resolveAppUrl()
    });

    const dateLabel = new Date().toISOString().slice(0, 10);
    const fileName = `takacode-pitch-deploiement-${dateLabel}.pptx`;

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "Content-Disposition": `attachment; filename=\"${fileName}\"`,
        "Cache-Control": "private, no-store"
      }
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Impossible de generer le pitch deck",
        message: error instanceof Error ? error.message : "Erreur inconnue"
      },
      { status: 500 }
    );
  }
}
