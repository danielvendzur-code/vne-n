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
      typeof IntersectionObserver === "undefined" ||
      typeof Element.prototype.animate !== "function"
    ) {
      return;
    }

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches) return;
    const targets = Array.from(
      root.querySelectorAll<HTMLElement>("section > header, #realizacie > div:first-child"),
    );
    const staged = targets.filter((target) => {
      if (target.getBoundingClientRect().top < window.innerHeight - 12) return false;
      target.style.opacity = "0";
      target.dataset.motionStaged = "true";
      return true;
    });
    const animations = new Set<Animation>();
    const timers = new Set<number>();

    const release = (target: HTMLElement) => {
      target.style.removeProperty("opacity");
      target.dataset.motionComplete = "true";
    };
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const target = entry.target as HTMLElement;
          observer.unobserve(target);
          if (media.matches) {
            release(target);
            continue;
          }
          target.dataset.motionEntered = "true";
          const duration = innerWidth <= 700 ? 480 : 560;
          const animation = target.animate(
            [
              { opacity: 0, transform: "translate3d(0, 22px, 0)" },
              { opacity: 1, transform: "translate3d(0, 0, 0)" },
            ],
            {
              duration,
              delay: 0,
              easing: "cubic-bezier(0.2, 0.7, 0.2, 1)",
              fill: "both",
            },
          );
          animations.add(animation);

          // Draw the single editorial accent line as the portfolio enters.
          // All other headings use only the restrained fade/translate.
          if (target.matches("#riesenia > header")) {
            const line = target.parentElement?.querySelector<HTMLElement>(
              "[data-solution-motion-track] > span",
            );
            if (line) {
              const lineAnimation = line.animate(
                [{ transform: "scaleX(0)" }, { transform: "scaleX(1)" }],
                {
                  duration: 780,
                  delay: 60,
                  easing: "cubic-bezier(0.2, 0.7, 0.2, 1)",
                  fill: "both",
                },
              );
              animations.add(lineAnimation);
              void lineAnimation.finished.then(
                () => {
                  lineAnimation.cancel();
                  animations.delete(lineAnimation);
                },
                () => undefined,
              );
            }
          }

          const timer = window.setTimeout(() => {
            timers.delete(timer);
            release(target);
            animation.cancel();
            animations.delete(animation);
          }, duration + 180);
          timers.add(timer);
          void animation.finished.then(
            () => {
              window.clearTimeout(timer);
              timers.delete(timer);
              release(target);
              animation.cancel();
              animations.delete(animation);
            },
            () => undefined,
          );
        }
      },
      { threshold: 0, rootMargin: "0px 0px -12px 0px" },
    );
    staged.forEach((target) => observer.observe(target));

    const stop = () => {
      if (!media.matches) return;
      observer.disconnect();
      timers.forEach((timer) => window.clearTimeout(timer));
      timers.clear();
      animations.forEach((animation) => animation.cancel());
      animations.clear();
      staged.forEach(release);
    };
    media.addEventListener("change", stop);
    return () => {
      observer.disconnect();
      media.removeEventListener("change", stop);
      timers.forEach((timer) => window.clearTimeout(timer));
      animations.forEach((animation) => animation.cancel());
      staged.forEach((target) => {
        target.style.removeProperty("opacity");
        delete target.dataset.motionStaged;
        delete target.dataset.motionEntered;
        delete target.dataset.motionComplete;
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
