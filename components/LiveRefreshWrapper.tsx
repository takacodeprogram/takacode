"use client";

import { useLiveRefresh } from "../hooks/useLiveRefresh";

export default function LiveRefreshWrapper({ children }: { children: React.ReactNode }) {
  useLiveRefresh();
  return <>{children}</>;
}
