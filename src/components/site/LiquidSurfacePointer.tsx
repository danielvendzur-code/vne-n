import { useEffect } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const surfaceSelector = [
  ".site-header-bar",
  ".site-menu-drawer",
  ".site-menu-solution",
  ".site-menu-project-link",
  ".lp-assistant-card",
  ".lp-comparison",
  ".lp-comparison-body",
  ".lp-solution-pill",
  ".lp-caps-row",
  ".lp-caps-detail-inner",
  ".lp-project > a",
  ".lp-faq-item",
  ".lp-process-list > li",
  ".lp-final-card",
  ".premium-footer",
  ".sp-hero",
  ".sp-service",
  ".sp-combine",
  ".sp-step",
  ".sp-project-card > a",
  ".sp-cta",
  ".contact-card",
  ".contact-expect",
  ".cookies-card",
].join(", ");

export function LiquidSurfacePointer() {
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const connection = (
      navigator as Navigator & {
        connection?: { saveData?: boolean };
      }
    ).connection;
    if (
      reducedMotion ||
      connection?.saveData ||
      !window.matchMedia("(hover: hover) and (pointer: fine)").matches
    ) {
      return;
    }

    let active: HTMLElement | null = null;
    let frame = 0;
    let clientX = 0;
    let clientY = 0;

    const clear = () => {
      if (!active) return;
      active.removeAttribute("data-liquid-pointer");
      active.style.removeProperty("--liquid-x");
      active.style.removeProperty("--liquid-y");
      active = null;
    };

    const paint = () => {
      frame = 0;
      if (!active) return;
      const rect = active.getBoundingClientRect();
      const x = Math.min(100, Math.max(0, ((clientX - rect.left) / Math.max(rect.width, 1)) * 100));
      const y = Math.min(100, Math.max(0, ((clientY - rect.top) / Math.max(rect.height, 1)) * 100));
      active.style.setProperty("--liquid-x", `${x}%`);
      active.style.setProperty("--liquid-y", `${y}%`);
      active.dataset.liquidPointer = "true";
    };

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      const next =
        event.target instanceof Element ? event.target.closest<HTMLElement>(surfaceSelector) : null;
      if (next !== active) {
        clear();
        active = next;
      }
      if (!active) return;
      clientX = event.clientX;
      clientY = event.clientY;
      if (!frame) frame = window.requestAnimationFrame(paint);
    };

    const onPointerOut = (event: PointerEvent) => {
      if (!event.relatedTarget) clear();
    };

    document.addEventListener("pointermove", onPointerMove, { capture: true, passive: true });
    document.addEventListener("pointerout", onPointerOut, { capture: true, passive: true });
    window.addEventListener("blur", clear);

    return () => {
      document.removeEventListener("pointermove", onPointerMove, true);
      document.removeEventListener("pointerout", onPointerOut, true);
      window.removeEventListener("blur", clear);
      if (frame) window.cancelAnimationFrame(frame);
      clear();
    };
  }, [reducedMotion]);

  return null;
}
