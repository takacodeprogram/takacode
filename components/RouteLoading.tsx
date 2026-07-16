"use client";

import { usePathname } from "next/navigation";
import LoaderVisual from "./LoaderVisual";

function Block({ className }: { className: string }) {
  return <div className={`route-skeleton ${className}`} aria-hidden="true" />;
}

function HeaderSkeleton({ action = true }: { action?: boolean }) {
  return (
    <div className="mb-7 flex items-end justify-between gap-4">
      <div className="space-y-3">
        <Block className="h-7 w-48 rounded-lg md:w-64" />
        <Block className="h-3 w-28 rounded-full" />
      </div>
      {action ? <Block className="h-10 w-28 rounded-xl" /> : null}
    </div>
  );
}

function AppFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white lg:flex">
      <aside className="hidden h-screen w-[280px] shrink-0 border-r border-white/[0.05] p-6 lg:block">
        <Block className="mb-10 h-16 w-28 rounded-xl" />
        <div className="space-y-2">
          {[0, 1, 2, 3, 4, 5, 6].map((item) => <Block key={item} className="h-11 rounded-xl" />)}
        </div>
      </aside>
      <div className="min-w-0 flex-1">
        <div className="flex h-[72px] items-center justify-end gap-3 px-6 md:px-8">
          <Block className="h-10 w-10 rounded-xl" />
          <Block className="h-10 w-40 rounded-xl" />
        </div>
        <main className="px-6 pb-10 pt-4 md:px-8">{children}</main>
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <AppFrame>
      <HeaderSkeleton />
      <div className="mb-5 grid grid-cols-2 gap-3 xl:grid-cols-4">
        {[0, 1, 2, 3].map((item) => <Block key={item} className="h-24 rounded-2xl" />)}
      </div>
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <Block className="h-72 rounded-2xl" />
        <div className="space-y-4">
          <Block className="h-32 rounded-2xl" />
          <Block className="h-32 rounded-2xl" />
        </div>
      </div>
    </AppFrame>
  );
}

function ListSkeleton() {
  return (
    <AppFrame>
      <HeaderSkeleton />
      <div className="mb-4 flex gap-2">
        <Block className="h-9 w-28 rounded-full" />
        <Block className="h-9 w-24 rounded-full" />
        <Block className="h-9 w-32 rounded-full" />
      </div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
        {[0, 1, 2, 3, 4, 5].map((item) => (
          <div key={item} className="rounded-2xl border border-white/[0.06] bg-[#111] p-5">
            <div className="mb-5 flex items-start gap-3">
              <Block className="h-11 w-11 shrink-0 rounded-xl" />
              <div className="flex-1 space-y-2"><Block className="h-4 w-3/4 rounded" /><Block className="h-3 w-1/2 rounded" /></div>
            </div>
            <Block className="mb-2 h-3 w-full rounded" />
            <Block className="mb-5 h-3 w-4/5 rounded" />
            <Block className="h-9 w-28 rounded-lg" />
          </div>
        ))}
      </div>
    </AppFrame>
  );
}

function FormSkeleton() {
  return (
    <AppFrame>
      <HeaderSkeleton action={false} />
      <div className="rounded-2xl border border-white/[0.08] bg-[#111] p-5">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {[0, 1, 2, 3].map((item) => (
            <div key={item} className="space-y-2"><Block className="h-3 w-24 rounded" /><Block className="h-11 rounded-xl" /></div>
          ))}
        </div>
        <div className="mt-4 space-y-2"><Block className="h-3 w-28 rounded" /><Block className="h-24 rounded-xl" /></div>
        <div className="mt-4 space-y-2"><Block className="h-3 w-32 rounded" /><Block className="h-40 rounded-xl" /></div>
        <Block className="mt-5 h-10 w-36 rounded-lg" />
      </div>
    </AppFrame>
  );
}

function LessonSkeleton() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] px-6 pb-12 pt-24 md:px-8">
      <div className="mx-auto max-w-[980px]">
        <Block className="mb-6 h-9 w-40 rounded-lg" />
        <div className="rounded-2xl border border-white/[0.08] bg-[#111] p-5 md:p-7">
          <div className="mb-7 flex items-start gap-4"><Block className="h-12 w-12 rounded-xl" /><div className="flex-1 space-y-3"><Block className="h-6 w-2/3 rounded" /><Block className="h-3 w-1/3 rounded" /></div></div>
          <div className="mb-5 flex gap-2">{[0, 1, 2, 3].map((item) => <Block key={item} className="h-8 flex-1 rounded-full" />)}</div>
          <Block className="mb-3 h-4 w-full rounded" /><Block className="mb-7 h-4 w-5/6 rounded" />
          <div className="mb-6 grid grid-cols-1 gap-3 md:grid-cols-2"><Block className="h-36 rounded-xl" /><Block className="h-36 rounded-xl" /></div>
          <Block className="mb-3 h-5 w-32 rounded" /><Block className="h-64 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

function AuthSkeleton() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0A0A0A] px-5 py-12">
      <div className="w-full max-w-md rounded-2xl border border-white/[0.08] bg-[#111] p-6">
        <Block className="mx-auto mb-7 h-16 w-28 rounded-xl" />
        <Block className="mx-auto mb-3 h-7 w-52 rounded" /><Block className="mx-auto mb-7 h-3 w-64 rounded" />
        <div className="space-y-4">{[0, 1].map((item) => <div key={item} className="space-y-2"><Block className="h-3 w-24 rounded" /><Block className="h-11 rounded-xl" /></div>)}</div>
        <Block className="mt-6 h-11 rounded-lg" />
      </div>
    </div>
  );
}

function PublicSkeleton() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] px-6 pb-12 pt-28 md:px-8">
      <div className="mx-auto max-w-[1320px]">
        <div className="mx-auto mb-12 max-w-3xl text-center"><Block className="mx-auto mb-4 h-4 w-32 rounded-full" /><Block className="mx-auto mb-4 h-10 w-4/5 rounded-xl" /><Block className="mx-auto h-4 w-2/3 rounded" /></div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">{[0, 1, 2, 3, 4, 5].map((item) => <Block key={item} className="h-64 rounded-2xl" />)}</div>
      </div>
    </div>
  );
}

export default function RouteLoading() {
  const pathname = usePathname();

  if (pathname === "/") {
    return <div className="startup-loader startup-loader-static" role="status" aria-live="polite" aria-label="Chargement de l'accueil"><LoaderVisual /></div>;
  }

  const accessibleLabel = <span className="sr-only">Chargement…</span>;
  const isApp = pathname.startsWith("/dashboard") || pathname.startsWith("/admin");
  const isForm = /\/(nouveau|profil)(?:\/|$)/.test(pathname) || /\/admin\/(parcours|sessions|affiliations)\/[^/]+/.test(pathname) || /\/dashboard\/projets\/[^/]+/.test(pathname);
  const isList = /\/(parcours|projets|ressources|reviews|sessions|utilisateurs|affiliations|communaute|outils|nouveautes)$/.test(pathname);
  const isLesson = /^\/parcours\/[^/]+\/lecon\/[^/]+$/.test(pathname);
  const isAuth = ["/signin", "/signup", "/connexion", "/forgot-password", "/reset-password", "/onboarding"].some((route) => pathname.startsWith(route));

  return (
    <div role="status" aria-live="polite" aria-label="Chargement de la page">
      {isLesson ? <LessonSkeleton /> : isAuth ? <AuthSkeleton /> : isApp && isForm ? <FormSkeleton /> : isApp && isList ? <ListSkeleton /> : isApp ? <DashboardSkeleton /> : <PublicSkeleton />}
      {accessibleLabel}
    </div>
  );
}
