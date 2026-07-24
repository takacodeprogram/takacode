import { parseCount } from "./utils";
import type { SupabaseClient } from "@supabase/supabase-js";

export interface PlatformStatsData {
  members: number | null;
  publishedTracks: number | null;
  totalModules: number | null;
  totalLessons: number | null;
  completedLessons: number | null;
  submittedProjects: number | null;
  totalLikes: number | null;
  ready: boolean;
}

const EMPTY_STATS: PlatformStatsData = {
  members: null,
  publishedTracks: null,
  totalModules: null,
  totalLessons: null,
  completedLessons: null,
  submittedProjects: null,
  totalLikes: null,
  ready: false
};

interface RpcStatsRow {
  members: unknown;
  published_tracks: unknown;
  total_modules: unknown;
  total_lessons: unknown;
  completed_lessons: unknown;
  submitted_projects: unknown;
  total_likes: unknown;
}

export async function getPlatformStats(supabase: SupabaseClient): Promise<PlatformStatsData> {
  if (!supabase) {
    return { ...EMPTY_STATS };
  }

  const { data, error } = await supabase.rpc("platform_stats");

  if (error || !data || typeof data !== "object") {
    return { ...EMPTY_STATS };
  }

  const stats = data as RpcStatsRow;

  return {
    members: parseCount(stats.members),
    publishedTracks: parseCount(stats.published_tracks),
    totalModules: parseCount(stats.total_modules),
    totalLessons: parseCount(stats.total_lessons),
    completedLessons: parseCount(stats.completed_lessons),
    submittedProjects: parseCount(stats.submitted_projects),
    totalLikes: parseCount(stats.total_likes),
    ready: true
  };
}
