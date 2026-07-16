"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../utils/supabase/client";

const NOTIF_ICONS = {
  review_pending: "lucide:git-pull-request",
  review_received: "lucide:badge-check",
  track_reminder: "lucide:map",
  project_reminder: "lucide:folder-code",
  review_completed: "lucide:check-circle"
};

const NOTIF_COLORS = {
  review_pending: "#F59E0B",
  review_received: "#10B981",
  track_reminder: "#4F8EF7",
  project_reminder: "#9B6DFF",
  review_completed: "#10B981"
};

function timeAgo(dateStr) {
  if (!dateStr) return "";
  const now = new Date();
  const date = new Date(dateStr);
  const diff = Math.floor((now - date) / 1000);
  if (diff < 60) return "à l'instant";
  if (diff < 3600) return `il y a ${Math.floor(diff / 60)}min`;
  if (diff < 86400) return `il y a ${Math.floor(diff / 3600)}h`;
  return `il y a ${Math.floor(diff / 86400)}j`;
}

export default function NotificationBell() {
  const router = useRouter();
  const supabase = createClient();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = useCallback(async () => {
    try {
      const { data: notifData } = await supabase.rpc("list_notifications", { p_limit: 20 });
      const { data: countData } = await supabase.rpc("count_unread_notifications");

      if (Array.isArray(notifData)) {
        setNotifications(notifData);
      }
      if (countData?.count !== undefined) {
        setUnreadCount(countData.count);
      }
    } catch (err) {
      console.error("Erreur chargement notifs:", err);
    }
  }, [supabase]);

  useEffect(() => {
    fetchNotifications();
    // Poll toutes les 30 secondes
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  async function markAsRead(id) {
    try {
      await supabase.rpc("mark_notification_read", { p_notification_id: id });
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read_at: new Date().toISOString() } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error("Erreur mark read:", err);
    }
  }

  async function markAllRead() {
    try {
      await supabase.rpc("mark_all_notifications_read");
      setNotifications((prev) =>
        prev.map((n) => (n.read_at ? n : { ...n, read_at: new Date().toISOString() }))
      );
      setUnreadCount(0);
    } catch (err) {
      console.error("Erreur mark all read:", err);
    }
  }

  function handleNotifClick(notif) {
    if (!notif.read_at) {
      markAsRead(notif.id);
    }
    setIsOpen(false);
    if (notif.link) {
      router.push(notif.link);
    }
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-[#888] hover:text-white transition-colors"
        aria-label="Notifications"
      >
        <iconify-icon icon="lucide:bell" style={{ fontSize: "18px" }} />
        {unreadCount > 0 ? (
          <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 rounded-full bg-[#4F8EF7] text-[9px] font-bold text-white flex items-center justify-center px-1">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        ) : null}
      </button>

      {isOpen ? (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 top-full mt-2 w-[340px] max-h-[420px] rounded-2xl border border-white/[0.1] bg-[#111] shadow-2xl z-50 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.08]">
              <span className="text-[12px] text-white font-semibold">Notifications</span>
              {unreadCount > 0 ? (
                <button
                  type="button"
                  onClick={markAllRead}
                  className="text-[10px] text-[#4F8EF7] hover:text-[#6ba3ff]"
                >
                  Tout marquer lu
                </button>
              ) : null}
            </div>

            <div className="overflow-y-auto max-h-[360px]">
              {notifications.length === 0 ? (
                <div className="px-4 py-8 text-center text-[12px] text-[#666]">
                  Aucune notification
                </div>
              ) : (
                notifications.map((notif) => {
                  const isUnread = !notif.read_at;
                  const icon = NOTIF_ICONS[notif.type] || "lucide:bell";
                  const color = NOTIF_COLORS[notif.type] || "#888";

                  return (
                    <button
                      key={notif.id}
                      type="button"
                      onClick={() => handleNotifClick(notif)}
                      className={`w-full text-left px-4 py-3 flex items-start gap-3 hover:bg-white/[0.03] transition-colors border-b border-white/[0.05] ${
                        isUnread ? "bg-blue-500/[0.04]" : ""
                      }`}
                    >
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                        style={{ background: `${color}15`, border: `1px solid ${color}30` }}
                      >
                        <iconify-icon icon={icon} style={{ fontSize: "14px", color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`text-[11px] font-semibold ${isUnread ? "text-white" : "text-[#aaa]"}`}>
                            {notif.title}
                          </span>
                          {isUnread ? <span className="w-1.5 h-1.5 rounded-full bg-[#4F8EF7] shrink-0" /> : null}
                        </div>
                        {notif.body ? (
                          <p className="text-[10px] text-[#777] leading-snug mt-0.5 line-clamp-2">{notif.body}</p>
                        ) : null}
                        <span className="text-[9px] text-[#555] mt-1 block">{timeAgo(notif.created_at)}</span>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
