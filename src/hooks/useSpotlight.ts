import { useEffect, useRef } from "react";

/**
 * Baterka a jemný fyzický náklon pod kurzorom.
 *
 * Pohyb zapisuje iba CSS premenné a je zoskupený cez requestAnimationFrame,
 * takže React sa pri pohybe myši vôbec nerenderuje. Dotykové zariadenia aj
 * reduced-motion režim zostávajú bez efektu.
 */
export function useSpotlight<T extends HTMLElement>(selector?: string) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    type PendingFrame = {
      target: HTMLElement;
      x: number;
      y: number;
      tiltX: number;
      tiltY: number;
    };

    let frame = 0;
    let pending: PendingFrame | null = null;

    const flush = () => {
      frame = 0;
      if (!pending) return;
      const { target, x, y, tiltX, tiltY } = pending;
      pending = null;
      target.style.setProperty("--spot-x", `${x.toFixed(1)}%`);
      target.style.setProperty("--spot-y", `${y.toFixed(1)}%`);
      target.style.setProperty("--tilt-x", `${tiltX.toFixed(2)}deg`);
      target.style.setProperty("--tilt-y", `${tiltY.toFixed(2)}deg`);
      target.dataset.spot = "on";
    };

    const resolveTarget = (origin: EventTarget | null) => {
      if (!(origin instanceof Element)) return null;
      const target = selector
        ? origin.closest<HTMLElement>(selector)
        : (root as unknown as HTMLElement);
      return target && root.contains(target) ? target : null;
    };

    const resetTarget = (target: HTMLElement | null) => {
      if (!target) return;
      delete target.dataset.spot;
      target.style.setProperty("--tilt-x", "0deg");
      target.style.setProperty("--tilt-y", "0deg");
    };

    const handleMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      const target = resolveTarget(event.target);
      if (!target) return;

      const bounds = target.getBoundingClientRect();
      if (!bounds.width || !bounds.height) return;

      const xRatio = Math.min(1, Math.max(0, (event.clientX - bounds.left) / bounds.width));
      const yRatio = Math.min(1, Math.max(0, (event.clientY - bounds.top) / bounds.height));

      pending = {
        target,
        x: xRatio * 100,
        y: yRatio * 100,
        // Náklon je zámerne malý. Pri 5,2° / 6,4° sa karta v hero pri
        // prejdení myšou viditeľne odlepila od svojho miesta; teraz je to
        // náznak hĺbky, ktorý si človek skôr vycíti, než všimne.
        tiltX: (0.5 - yRatio) * 1.8,
        tiltY: (xRatio - 0.5) * 2.2,
      };
      if (!frame) frame = window.requestAnimationFrame(flush);
    };

    const handleOut = (event: PointerEvent) => {
      const target = resolveTarget(event.target);
      if (!target) return;
      const nextTarget = resolveTarget(event.relatedTarget);
      if (nextTarget === target) return;
      resetTarget(target);
    };

    const handleRootLeave = () => {
      root.querySelectorAll<HTMLElement>("[data-spot='on']").forEach(resetTarget);
    };

    root.addEventListener("pointermove", handleMove, { passive: true });
    root.addEventListener("pointerout", handleOut, { passive: true });
    root.addEventListener("pointerleave", handleRootLeave, { passive: true });

    return () => {
      root.removeEventListener("pointermove", handleMove);
      root.removeEventListener("pointerout", handleOut);
      root.removeEventListener("pointerleave", handleRootLeave);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [selector]);

  return ref;
}
