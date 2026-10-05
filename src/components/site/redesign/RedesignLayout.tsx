import { useEffect, useRef, type ReactNode } from "react";
import { useRouterState } from "@tanstack/react-router";
import { Header } from "./Header";
import "./fonts.css";
import "./reference.css";
import "./redesign.css";
import "./tokens.css";
import "./solution-motion.css";

export function RedesignLayout({ children }: { children: ReactNode }) {
  const rawPathname = useRouterState({ select: (state) => state.location.pathname });
  const pathname = rawPathname.replace(/\/+$/, "") || "/";
  const contentRef = useRef<HTMLElement>(null);
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
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const elements = contentRef.current?.querySelectorAll<HTMLElement>("[data-reveal]");
    if (!elements || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.setAttribute("data-revealed", "true");
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.08 },
    );
    for (const element of elements) observer.observe(element);
    return () => observer.disconnect();
  }, [pathname]);
  return (
    <div className="redesign" data-page={active}>
      <a className="redesign-skip" href="#main-content">
        Preskočiť na obsah
      </a>
      <div className="redesign-header">
        <Header active={active} />
      </div>
      <main ref={contentRef} id="main-content">
        {children}
      </main>
    </div>
  );
}
