"use client";

import { usePathname } from "next/navigation";
import LoaderVisual from "./LoaderVisual";

function SkeletonBlock({ className }: { className: string }) {
  return <div className={`route-skeleton ${className}`} aria-hidden="true" />;
}

export default function RouteLoading() {
  const pathname = usePathname();

  if (pathname === "/") {
    return (
      <div className="startup-loader startup-loader-static" role="status" aria-live="polite" aria-label="Chargement de l'accueil">
        <LoaderVisual />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#0A0A0A] px-6 py-8 md:px-10" role="status" aria-live="polite" aria-label="Chargement de la page">
      <div className="mx-auto max-w-[1180px]">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div className="space-y-3">
            <SkeletonBlock className="h-7 w-52 rounded-lg" />
            <SkeletonBlock className="h-3 w-32 rounded-full" />
          </div>
          <SkeletonBlock className="h-10 w-28 rounded-xl" />
        </div>

        <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[0, 1, 2, 3].map((item) => (
            <SkeletonBlock key={item} className="h-24 rounded-2xl" />
          ))}
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <SkeletonBlock className="h-72 rounded-2xl" />
          <div className="space-y-4">
            <SkeletonBlock className="h-32 rounded-2xl" />
            <SkeletonBlock className="h-32 rounded-2xl" />
          </div>
        </div>
      </div>
      <span className="sr-only">Chargement…</span>
    </main>
  );
}

