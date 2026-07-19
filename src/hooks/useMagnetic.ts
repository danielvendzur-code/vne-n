import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * Gives an element a gentle magnetic pull towards the cursor.
 * Desktop-only (fine pointer), disabled for reduced motion; the element
 * springs back to rest when the pointer leaves.
 */
export function useMagnetic<T extends HTMLElement>(strength = 0.16) {
  const ref = useRef<T>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const element = ref.current;
    if (!element || reducedMotion) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    let frame = 0;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let settled = true;

    const tick = () => {
      currentX += (targetX - currentX) * 0.18;
      currentY += (targetY - currentY) * 0.18;
      const done =
        Math.abs(currentX - targetX) < 0.08 &&
        Math.abs(currentY - targetY) < 0.08 &&
        targetX === 0 &&
        targetY === 0;
      element.style.translate = `${currentX.toFixed(2)}px ${currentY.toFixed(2)}px`;
      if (done) {
        element.style.translate = "";
        settled = true;
        frame = 0;
        return;
      }
      frame = window.requestAnimationFrame(tick);
    };

    const schedule = () => {
      if (settled) {
        settled = false;
        frame = window.requestAnimationFrame(tick);
      }
    };

    const handleMove = (event: PointerEvent) => {
      const bounds = element.getBoundingClientRect();
      targetX = (event.clientX - bounds.left - bounds.width / 2) * strength;
      targetY = (event.clientY - bounds.top - bounds.height / 2) * strength;
      schedule();
    };

    const handleLeave = () => {
      targetX = 0;
      targetY = 0;
      schedule();
    };

    element.addEventListener("pointermove", handleMove);
    element.addEventListener("pointerleave", handleLeave);
    return () => {
      element.removeEventListener("pointermove", handleMove);
      element.removeEventListener("pointerleave", handleLeave);
      if (frame) window.cancelAnimationFrame(frame);
      element.style.translate = "";
    };
  }, [reducedMotion, strength]);

  return ref;
}
