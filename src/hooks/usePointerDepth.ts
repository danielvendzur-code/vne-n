import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

/**
 * Zapisuje pozíciu kurzora nad prvkom ako `--mc-px` a `--mc-py` v rozsahu
 * −1 až 1. Vrstvy vnútri sa podľa toho môžu posunúť o pár pixelov rôznou
 * silou, takže plocha dostane hĺbku bez tieňov a bez ďalšej knižnice.
 *
 * Zámerne veľmi jemné. Nie je to efekt — je to len náznak, že plocha má
 * vrstvy. Na dotykových zariadeniach a pri vypnutých animáciách sa vôbec
 * nepripojí, hodnoty prepisuje jeden `requestAnimationFrame` a po odchode
 * kurzora sa všetko vráti na nulu.
 */
export function usePointerDepth<T extends HTMLElement>() {
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
      currentX += (targetX - currentX) * 0.12;
      currentY += (targetY - currentY) * 0.12;
      element.style.setProperty("--mc-px", currentX.toFixed(3));
      element.style.setProperty("--mc-py", currentY.toFixed(3));

      const done =
        Math.abs(currentX - targetX) < 0.002 &&
        Math.abs(currentY - targetY) < 0.002 &&
        targetX === 0 &&
        targetY === 0;
      if (done) {
        element.style.removeProperty("--mc-px");
        element.style.removeProperty("--mc-py");
        settled = true;
        frame = 0;
        return;
      }
      frame = window.requestAnimationFrame(tick);
    };

    const schedule = () => {
      if (!settled) return;
      settled = false;
      frame = window.requestAnimationFrame(tick);
    };

    const onMove = (event: PointerEvent) => {
      const bounds = element.getBoundingClientRect();
      if (!bounds.width || !bounds.height) return;
      targetX = clamp((event.clientX - bounds.left) / bounds.width - 0.5, -0.5, 0.5) * 2;
      targetY = clamp((event.clientY - bounds.top) / bounds.height - 0.5, -0.5, 0.5) * 2;
      schedule();
    };

    const onLeave = () => {
      targetX = 0;
      targetY = 0;
      schedule();
    };

    element.addEventListener("pointermove", onMove, { passive: true });
    element.addEventListener("pointerleave", onLeave);
    return () => {
      element.removeEventListener("pointermove", onMove);
      element.removeEventListener("pointerleave", onLeave);
      if (frame) window.cancelAnimationFrame(frame);
      element.style.removeProperty("--mc-px");
      element.style.removeProperty("--mc-py");
    };
  }, [reducedMotion]);

  return ref;
}
