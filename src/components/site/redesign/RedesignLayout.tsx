import { useEffect, useLayoutEffect, useRef, type ReactNode } from "react";
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
  useLayoutEffect(() => {
    const elements = Array.from(
      contentRef.current?.querySelectorAll<HTMLElement>("[data-reveal]") ?? [],
    );
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches || typeof IntersectionObserver === "undefined") return;
    // Read all geometry before writing. Already visible SSR content stays visible.
    const belowViewport = elements.filter(
      (element) =>
        element.dataset.revealed !== "true" &&
        element.getBoundingClientRect().top >= window.innerHeight,
    );
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.setAttribute("data-revealed", "true");
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0, rootMargin: "0px 0px -48px 0px" },
    );
    for (const element of belowViewport) {
      element.dataset.revealed = "pending";
      observer.observe(element);
    }
    const showAll = () => {
      if (!media.matches) return;
      observer.disconnect();
      for (const element of belowViewport) element.dataset.revealed = "true";
    };
    media.addEventListener("change", showAll);
    return () => {
      observer.disconnect();
      media.removeEventListener("change", showAll);
      for (const element of belowViewport) element.dataset.revealed = "true";
    };
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
