import { lazy, Suspense, type ReactNode } from "react";
import { useRouterState } from "@tanstack/react-router";
import { RedesignLayout } from "./redesign/RedesignLayout";

const LegacySiteLayout = lazy(() => import("./LegacySiteLayout"));

export function SiteLayout({ children }: { children: ReactNode }) {
  const rawPathname = useRouterState({ select: (state) => state.location.pathname });
  const pathname = rawPathname.replace(/\/+$/, "") || "/";
  if (
    [
      "/",
      "/sluzby",
      "/3d-konfigurator",
      "/projekty",
      "/projekty/",
      "/postup",
      "/cennik",
      "/nastroj",
    ].includes(pathname)
  )
    return <RedesignLayout>{children}</RedesignLayout>;
  return (
    <Suspense fallback={<main aria-busy="true">Načítavam…</main>}>
      <LegacySiteLayout pathname={pathname}>{children}</LegacySiteLayout>
    </Suspense>
  );
}
