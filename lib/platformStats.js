import { parseCount } from "./utils";

const EMPTY_STATS = {
  members: null,
  publishedTracks: null,
  totalModules: null,
  totalLessons: null,
  completedLessons: null,
  submittedProjects: null,
  ready: false
};

// Recupere les compteurs agreges reels via la RPC platform_stats (006).
// Renvoie ready:false si la fonction n'est pas encore installee, pour que les
// pages puissent degrader proprement sans casser.
export async function getPlatformStats(supabase) {
  if (!supabase) {
    return { ...EMPTY_STATS };
  }

  const { data, error } = await supabase.rpc("platform_stats");

  if (error || !data || typeof data !== "object") {
    return { ...EMPTY_STATS };
  }

  return {
    members: parseCount(data.members),
    publishedTracks: parseCount(data.published_tracks),
    totalModules: parseCount(data.total_modules),
    totalLessons: parseCount(data.total_lessons),
    completedLessons: parseCount(data.completed_lessons),
    submittedProjects: parseCount(data.submitted_projects),
    ready: true
  };
}
