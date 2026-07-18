"use client";

import { useCallback, useState, useMemo, useEffect } from "react";
import { createClient } from "../utils/supabase/client";

function getVisitorId(): string {
  const cookieName = "tk_visitor";
  const match = document.cookie.match(new RegExp(`(?:^|; )${cookieName}=([^;]*)`));
  if (match) return decodeURIComponent(match[1]);

  const id = crypto.randomUUID();
  const maxAge = 365 * 24 * 60 * 60;
  document.cookie = `${cookieName}=${encodeURIComponent(id)}; path=/; max-age=${maxAge}; SameSite=Lax`;
  return id;
}

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

  const visitorId = useMemo(() => {
    if (typeof document === "undefined") return "";
    if (userId) return "";
    return getVisitorId();
  }, [userId]);

  const handleToggle = useCallback(async () => {
    setAnimating(true);

    const isLiked = liked;
    setLiked(!isLiked);
    setCount((c) => (isLiked ? c - 1 : c + 1));

    try {
      if (isLiked) {
        if (userId) {
          await supabase.from("project_likes").delete().match({ user_id: userId, project_id: projectId });
        } else {
          await supabase.from("project_likes").delete().match({ visitor_id: visitorId, project_id: projectId } as unknown as Record<string, unknown>);
        }
      } else {
        if (userId) {
          await supabase.from("project_likes").insert({ user_id: userId, project_id: projectId });
        } else {
          await supabase.from("project_likes").insert({ visitor_id: visitorId, project_id: projectId } as unknown as Record<string, unknown>);
        }
      }
      const { data } = await supabase.rpc("get_project_likes_count", { p_project_id: projectId });
      if (typeof data === "number") setCount(data);
    } catch {
      setLiked(isLiked);
      setCount((c) => (isLiked ? c + 1 : c - 1));
    }

    setAnimating(false);
  }, [userId, projectId, liked, supabase, visitorId]);

  const iconSize = size === "sm" ? "14px" : "18px";
  const padding = size === "sm" ? "6px 10px" : "8px 14px";
  const textSize = size === "sm" ? "11px" : "13px";

  return (
    <button
      onClick={handleToggle}
      disabled={animating}
      className={`inline-flex items-center gap-1.5 rounded-xl border transition-all font-semibold ${
        liked
          ? "border-rose-500/40 bg-rose-500/15 text-rose-300"
          : "border-white/[0.08] bg-white/[0.02] text-[#999] hover:border-white/[0.2] hover:text-white"
      }`}
      style={{ padding, fontSize: textSize }}
    >
      <iconify-icon icon={liked ? "lucide:heart" : "lucide:heart"} style={{ fontSize: iconSize, color: liked ? "#f43f5e" : undefined }} />
      {count > 0 ? count : null}
    </button>
  );
}
