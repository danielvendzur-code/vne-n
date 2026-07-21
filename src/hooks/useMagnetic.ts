import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

/**
 * Gives an element only a very small cursor response. The visible hover
 * animation is handled by CSS; this hook must never make a CTA feel loose.
 */
export function useMagnetic<T extends HTMLElement>(strength = 0.035) {
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
    const maxOffset = 2.5;

    const tick = () => {
      currentX += (targetX - currentX) * 0.24;
      currentY += (targetY - currentY) * 0.24;
      const done =
        Math.abs(currentX - targetX) < 0.05 &&
        Math.abs(currentY - targetY) < 0.05 &&
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
      targetX = clamp(
        (event.clientX - bounds.left - bounds.width / 2) * Math.min(strength, 0.04),
        -maxOffset,
        maxOffset,
      );
      targetY = clamp(
        (event.clientY - bounds.top - bounds.height / 2) * Math.min(strength, 0.04),
        -maxOffset,
        maxOffset,
      );
      schedule();
    };

    const handleLeave = () => {
      targetX = 0;
      targetY = 0;
      schedule();
    };

    element.addEventListener("pointermove", handleMove, { passive: true });
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