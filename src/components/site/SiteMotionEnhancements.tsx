import { useEffect } from "react";

const clamp01 = (value: number): number => Math.min(1, Math.max(0, value));

export function SiteMotionEnhancements() {
  useEffect(() => {
    const hero = document.querySelector<HTMLElement>(".lp-hero");
    const copy = hero?.querySelector<HTMLElement>(".lp-hero-copy");
    const stage = hero?.querySelector<HTMLElement>(".lp-hero-stage");
    if (!hero || !copy) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;

    const setOpacity = (value: number) => {
      const opacity = String(clamp01(value));
      copy.style.setProperty("opacity", opacity, "important");
      stage?.style.setProperty("opacity", opacity, "important");
    };

    const updateHeroExit = () => {
      frame = 0;

      if (reducedMotion.matches) {
        setOpacity(1);
        return;
      }

      const height = Math.max(hero.offsetHeight, 1);
      const progress = clamp01(-hero.getBoundingClientRect().top / height);
      const fadeStart = 0.62;
      const exitProgress = clamp01((progress - fadeStart) / (1 - fadeStart));
      setOpacity(1 - exitProgress);
    };

    const scheduleUpdate = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(updateHeroExit);
    };

    updateHeroExit();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    reducedMotion.addEventListener("change", scheduleUpdate);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      reducedMotion.removeEventListener("change", scheduleUpdate);
      copy.style.removeProperty("opacity");
      stage?.style.removeProperty("opacity");
    };
  }, []);

  useEffect(() => {
    const images = Array.from(document.querySelectorAll<HTMLImageElement>(".lp-project-media img"));
    if (!images.length) return;

    const cleanup = images.map((image, index) => {
      const media = image.closest<HTMLElement>(".lp-project-media");
      const markLoaded = () => {
        if (image.naturalWidth > 0) media?.setAttribute("data-loaded", "true");
      };
      const markFailed = () => media?.setAttribute("data-load-error", "true");

      image.loading = index === 0 ? "eager" : "lazy";
      image.fetchPriority = index === 0 ? "high" : "low";
      image.addEventListener("load", markLoaded, { once: true });
      image.addEventListener("error", markFailed, { once: true });

      if (image.complete) {
        markLoaded();
      } else {
        void image
          .decode()
          .then(markLoaded)
          .catch(() => undefined);
      }

      return () => {
        image.removeEventListener("load", markLoaded);
        image.removeEventListener("error", markFailed);
      };
    });

    return () => cleanup.forEach((remove) => remove());
  }, []);

  return null;
}
