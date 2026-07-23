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
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const serviceCards = Array.from(document.querySelectorAll<HTMLElement>(".sp-service"));
    if (!serviceCards.length) return;

    const serviceHandlers = serviceCards.map((service) => {
      const handleServicePointer = (event: PointerEvent) => {
        if (!finePointer.matches || event.pointerType === "touch") return;
        const rect = service.getBoundingClientRect();
        service.style.setProperty("--spot-x", `${event.clientX - rect.left}px`);
        service.style.setProperty("--spot-y", `${event.clientY - rect.top}px`);
      };
      service.addEventListener("pointermove", handleServicePointer, { passive: true });
      return { service, handleServicePointer };
    });

    return () => {
      serviceHandlers.forEach(({ service, handleServicePointer }) => {
        service.removeEventListener("pointermove", handleServicePointer);
        service.style.removeProperty("--spot-x");
        service.style.removeProperty("--spot-y");
      });
    };
  }, []);

  return null;
}
