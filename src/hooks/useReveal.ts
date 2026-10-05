import { useLayoutEffect, type RefObject } from "react";

/**
 * Plynulé odkrývanie obsahu pri scrollovaní.
 *
 * Obsah je na serveri aj bez JavaScriptu viditeľný. Skryjú sa až prvky, ktoré
 * sú po načítaní pod okrajom okna, a každý sa odkryje len raz. Kto má
 * vypnutý pohyb, vidí všetko hneď.
 */
export function useReveal(rootRef: RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || typeof IntersectionObserver === "undefined") return undefined;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;

    const items = Array.from(root.querySelectorAll<HTMLElement>("[data-reveal]"));
    const pending = items.filter(
      (item) =>
        item.dataset.shown !== "true" && item.getBoundingClientRect().top > window.innerHeight,
    );
    pending.forEach((item) => (item.dataset.shown = "false"));

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          (entry.target as HTMLElement).dataset.shown = "true";
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px 64px 0px", threshold: 0 },
    );
    pending.forEach((item) => observer.observe(item));

    return () => {
      observer.disconnect();
      pending.forEach((item) => (item.dataset.shown = "true"));
    };
  }, [rootRef]);
}
