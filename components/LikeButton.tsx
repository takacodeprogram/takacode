"use client";

import { useCallback, useState, useMemo } from "react";
import { createClient } from "../utils/supabase/client";

interface LikeButtonProps {
  projectId: string;
  initialCount: number;
  initialLiked: boolean;
  userId?: string | null;
  size?: "sm" | "md";
}

export default function LikeButton({ projectId, initialCount, initialLiked, userId, size = "md" }: LikeButtonProps) {
  const supabase = useMemo(() => createClient(), []);
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [animating, setAnimating] = useState(false);

  const handleToggle = useCallback(async () => {
    if (!userId) return;
    setAnimating(true);

    const isLiked = liked;
    setLiked(!isLiked);
    setCount((c) => (isLiked ? c - 1 : c + 1));

    try {
      if (isLiked) {
        await supabase.from("project_likes").delete().eq("user_id", userId).eq("project_id", projectId);
      } else {
        await supabase.from("project_likes").insert({ user_id: userId, project_id: projectId });
      }
      const { data } = await supabase.rpc("get_project_likes_count", { p_project_id: projectId });
      if (typeof data === "number") setCount(data);
    } catch {
      setLiked(isLiked);
      setCount((c) => (isLiked ? c + 1 : c - 1));
    }

    setAnimating(false);
  }, [userId, projectId, liked, supabase]);

  const iconSize = size === "sm" ? "14px" : "18px";
  const padding = size === "sm" ? "6px 10px" : "8px 14px";
  const textSize = size === "sm" ? "11px" : "13px";

  return (
    <button
      onClick={handleToggle}
      disabled={!userId || animating}
      className={`inline-flex items-center gap-1.5 rounded-xl border transition-all font-semibold ${
        liked
          ? "border-rose-500/40 bg-rose-500/15 text-rose-300"
          : "border-white/[0.08] bg-white/[0.02] text-[#999] hover:border-white/[0.2] hover:text-white"
      } ${!userId ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
      style={{ padding, fontSize: textSize }}
    >
      <iconify-icon icon={liked ? "lucide:heart" : "lucide:heart"} style={{ fontSize: iconSize, color: liked ? "#f43f5e" : undefined }} />
      {count > 0 ? count : null}
    </button>
  );
}
