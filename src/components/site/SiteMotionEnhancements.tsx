import { useEffect } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export function SiteMotionEnhancements() {
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const images = Array.from(document.querySelectorAll<HTMLImageElement>(".lp-project-media img"));
    if (!images.length) return;

    const cleanup = images.map((image, index) => {
      const media = image.closest<HTMLElement>(".lp-project-media");
      const markLoaded = () => {
        if (image.naturalWidth > 0) media?.setAttribute("data-loaded", "true");
      };
      const markFailed = () => media?.setAttribute("data-load-error", "true");

      image.loading = "eager";
      image.fetchPriority = index === 0 ? "high" : "auto";
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

  useEffect(() => {
    if (reducedMotion) return;

    const hero = document.querySelector<HTMLElement>(".lp-hero");
    const glide = hero?.querySelector<HTMLElement>(".lp-hero-glide") ?? null;
    if (!hero || !glide) return;

    let frame = 0;
    const paint = () => {
      frame = 0;
      const rect = hero.getBoundingClientRect();
      const progress = clamp(-rect.top / Math.max(rect.height, 1), 0, 1);
      glide.style.transform = `translate3d(0, ${progress * 18}px, 0)`;
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(paint);
    };

    glide.style.willChange = "transform";
    paint();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
      glide.style.removeProperty("transform");
      glide.style.removeProperty("will-change");
    };
  }, [reducedMotion]);

  return null;
}
