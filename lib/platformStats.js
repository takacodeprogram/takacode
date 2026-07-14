const EMPTY_STATS = {
  members: null,
  publishedTracks: null,
  totalModules: null,
  totalLessons: null,
  completedLessons: null,
  submittedProjects: null,
  ready: false
};

function toCount(value) {
  const numeric = Number(value);
  return Number.isFinite(numeric) && numeric >= 0 ? Math.floor(numeric) : null;
}

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
    members: toCount(data.members),
    publishedTracks: toCount(data.published_tracks),
    totalModules: toCount(data.total_modules),
    totalLessons: toCount(data.total_lessons),
    completedLessons: toCount(data.completed_lessons),
    submittedProjects: toCount(data.submitted_projects),
    ready: true
  };
}
