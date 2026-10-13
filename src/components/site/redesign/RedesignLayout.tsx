import { useEffect, useLayoutEffect, useRef, type ReactNode } from "react";
import { useRouterState } from "@tanstack/react-router";
import { Header } from "./Header";
import "./fonts.css";
import "./reference.css";
import "./redesign.css";
import "./tokens.css";
import "./solution-motion.css";

export function RedesignLayout({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLElement>(null);
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
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (
      !root ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      typeof IntersectionObserver === "undefined" ||
      typeof Element.prototype.animate !== "function"
    ) {
      return;
    }

    // The new site has no .page-transition container. Stage its own section
    // headings before first paint so animation is visible when scrolling.
    const headings = Array.from(root.querySelectorAll<HTMLElement>("section > header"));
    const pending = headings.filter((heading) => {
      if (heading.getBoundingClientRect().top < window.innerHeight - 12) return false;
      heading.style.opacity = "0";
      heading.dataset.motionStaged = "true";
      return true;
    });
    const animations = new Set<Animation>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const heading = entry.target as HTMLElement;
          observer.unobserve(heading);
          heading.dataset.motionEntered = "true";
          const animation = heading.animate(
            [
              { opacity: 0, transform: "translate3d(0, 24px, 0)" },
              { opacity: 1, transform: "translate3d(0, 0, 0)" },
            ],
            {
              duration: 620,
              delay: 0,
              easing: "cubic-bezier(0.2, 0.7, 0.2, 1)",
              fill: "both",
            },
          );
          animations.add(animation);
          void animation.finished.then(
            () => {
              heading.style.removeProperty("opacity");
              animation.cancel();
              animations.delete(animation);
            },
            () => animations.delete(animation),
          );
        }
      },
      { threshold: 0, rootMargin: "0px 0px -12px 0px" },
    );
    pending.forEach((heading) => observer.observe(heading));
    return () => {
      observer.disconnect();
      animations.forEach((animation) => animation.cancel());
      pending.forEach((heading) => {
        heading.style.removeProperty("opacity");
        delete heading.dataset.motionStaged;
        delete heading.dataset.motionEntered;
      });
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
      <main id="main-content" ref={rootRef}>
        {children}
      </main>
    </div>
  );
}
