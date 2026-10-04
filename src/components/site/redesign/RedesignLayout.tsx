import { useEffect, type ReactNode } from "react";
import { useRouterState } from "@tanstack/react-router";
import { Header } from "./Header";
import "./fonts.css";
import "./reference.css";
import "./redesign.css";
import "./tokens.css";

export function RedesignLayout({ children }: { children: ReactNode }) {
  const rawPathname = useRouterState({ select: (state) => state.location.pathname });
  const pathname = rawPathname.replace(/\/+$/, "") || "/";
  const active =
    pathname === "/"
      ? "home"
      : pathname.startsWith("/projekty")
        ? "realizacie"
        : pathname === "/postup"
          ? "postup"
          : pathname === "/cennik"
            ? "cennik"
            : "riesenia";
  useEffect(() => {
    const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
    if (!meta) return;
    const previous = meta.content;
    meta.content = "#1C1612";
    return () => {
      meta.content = previous;
    };
  }, [active]);
  return (
    <div className="redesign" data-page={active}>
      <a className="redesign-skip" href="#main-content">
        Preskočiť na obsah
      </a>
      <div className="redesign-header">
        <Header active={active} />
      </div>
      <main id="main-content" key={pathname}>
        {children}
      </main>
    </div>
  );
}
