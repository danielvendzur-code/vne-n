import { useEffect } from "react";

export function SiteMotionEnhancements() {
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
