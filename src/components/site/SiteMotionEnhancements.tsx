import { useEffect } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export function SiteMotionEnhancements() {
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;

    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const hero = document.querySelector<HTMLElement>(".lp-hero");
    const glide = hero?.querySelector<HTMLElement>(".lp-hero-glide") ?? null;
    const card = hero?.querySelector<HTMLElement>(".lp-assistant-card") ?? null;
    const serviceCards = Array.from(document.querySelectorAll<HTMLElement>(".sp-service"));
    if ((!hero || !glide || !card) && !serviceCards.length) return;

    let scrollFrame = 0;
    let pointerFrame = 0;
    let pointerX = 0;
    let pointerY = 0;

    const paintScroll = () => {
      scrollFrame = 0;
      if (!hero || !glide) return;
      const rect = hero.getBoundingClientRect();
      const progress = clamp(-rect.top / Math.max(rect.height, 1), 0, 1);
      glide.style.transform = `translate3d(0, ${progress * 30}px, 0)`;
    };

    const handleScroll = () => {
      if (!scrollFrame) scrollFrame = window.requestAnimationFrame(paintScroll);
    };

    const paintPointer = () => {
      pointerFrame = 0;
      if (!finePointer.matches || !card) return;
      const rect = card.getBoundingClientRect();
      const normalizedX = clamp((pointerX - rect.left) / rect.width, 0, 1) * 2 - 1;
      const normalizedY = clamp((pointerY - rect.top) / rect.height, 0, 1) * 2 - 1;
      const rotateY = normalizedX * 4;
      const rotateX = normalizedY * -4;
      card.style.transition = "transform 110ms linear";
      card.style.transform = `translateY(-50%) perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (!finePointer.matches || event.pointerType === "touch") return;
      pointerX = event.clientX;
      pointerY = event.clientY;
      if (!pointerFrame) pointerFrame = window.requestAnimationFrame(paintPointer);
    };

    const resetCard = () => {
      if (!card) return;
      if (pointerFrame) {
        window.cancelAnimationFrame(pointerFrame);
        pointerFrame = 0;
      }
      card.style.transition = "transform 420ms cubic-bezier(0.16, 1, 0.3, 1)";
      card.style.transform = "translateY(-50%) perspective(1000px) rotateX(0deg) rotateY(0deg)";
    };

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

    const handlePointerChange = () => {
      if (!finePointer.matches) resetCard();
    };

    if (glide) glide.style.willChange = "transform";
    if (card) {
      card.style.willChange = "transform";
      card.addEventListener("pointermove", handlePointerMove, { passive: true });
      card.addEventListener("pointerleave", resetCard);
    }
    if (hero && glide) {
      paintScroll();
      window.addEventListener("scroll", handleScroll, { passive: true });
      window.addEventListener("resize", handleScroll, { passive: true });
    }
    finePointer.addEventListener("change", handlePointerChange);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      card?.removeEventListener("pointermove", handlePointerMove);
      card?.removeEventListener("pointerleave", resetCard);
      finePointer.removeEventListener("change", handlePointerChange);
      serviceHandlers.forEach(({ service, handleServicePointer }) => {
        service.removeEventListener("pointermove", handleServicePointer);
        service.style.removeProperty("--spot-x");
        service.style.removeProperty("--spot-y");
      });
      if (scrollFrame) window.cancelAnimationFrame(scrollFrame);
      if (pointerFrame) window.cancelAnimationFrame(pointerFrame);
      glide?.style.removeProperty("transform");
      glide?.style.removeProperty("will-change");
      card?.style.removeProperty("transform");
      card?.style.removeProperty("transition");
      card?.style.removeProperty("will-change");
    };
  }, [reducedMotion]);

  return null;
}
