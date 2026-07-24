import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { listRecommendedTracksForGoal, mapTrackToRecommendation } from "../../../../lib/tracks";
import { createClient } from "../../../../utils/supabase/server";
import { trackRecommendationQuerySchema, validateQueryParams } from "../../../../lib/validation";

export async function GET(request: NextRequest) {
  const parsed = validateQueryParams(trackRecommendationQuerySchema, request.nextUrl.searchParams);
  if (!parsed.success) return parsed.response;

  const goalKey = parsed.data.goal_key;

  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

  const { tracks, error, schemaReady } = await listRecommendedTracksForGoal(supabase, goalKey, { limit: 1 });

  if (error) {
    return NextResponse.json(
      {
        recommendation: mapTrackToRecommendation(null),
        source: "fallback",
        schemaReady,
        error: error.message
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, max-age=0"
        }
      }
    );
  }

  const recommendation = mapTrackToRecommendation(tracks[0] || null);

  return NextResponse.json(
    {
      recommendation,
      source: tracks.length ? "database" : "fallback",
      schemaReady
    },
    {
      status: 200,
      headers: {
        "Cache-Control": "no-store, max-age=0"
      }
    }
  );
}
