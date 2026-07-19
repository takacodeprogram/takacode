import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-static";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const title = searchParams.get("title") || "TakaCode";
  const color = searchParams.get("color") || "#4F8EF7";

  const width = 1200;
  const height = 630;

  const escapedTitle = escapeXml(title);

  const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0A0A0A"/>
      <stop offset="100%" style="stop-color:#111111"/>
    </linearGradient>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#bg)"/>
  <rect x="0" y="0" width="8" height="${height}" fill="${escapeXml(color)}"/>
  
  <text x="${width/2}" y="${height/2 - 30}" 
        font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
        font-size="64" font-weight="bold" fill="#FFFFFF" text-anchor="middle" dominant-baseline="middle">
    ${escapedTitle}
  </text>
  
  <text x="${width/2}" y="${height - 60}" 
        font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
        font-size="24" fill="#888888" text-anchor="middle" dominant-baseline="middle">
    TakaCode \u2014 Apprends en construisant
  </text>
</svg>`;

  return new NextResponse(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=31536000, immutable"
    }
  });
}

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&")
    .replace(/</g, "<")
    .replace(/>/g, ">")
    .replace(/'/g, "&apos;")
    .replace(/"/g, """);
}