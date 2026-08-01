import { useEffect, useRef } from "react";

/**
 * Baterka pod kurzorom.
 *
 * Na koreňovom prvku sleduje pohyb myši a zapisuje polohu do premenných
 * `--spot-x` / `--spot-y`, z ktorých si CSS kreslí teplý svetelný kruh.
 * Zápis prebieha raz za snímok cez requestAnimationFrame, takže ani rýchly
 * pohyb myšou nezahltí hlavné vlákno — na rozdiel od zápisu priamo
 * v obsluhe udalosti, ktorá sa spúšťa aj 200× za sekundu.
 *
 * Efekt sa zapína len na zariadeniach so skutočným kurzorom. Na dotyku
 * by nemal čo sledovať a zbytočne by kreslil ďalšiu vrstvu.
 *
 * @param selector Potomkovia, ktorí majú baterku dostať. Bez neho ju
 *                 dostane samotný koreňový prvok.
 */
export function useSpotlight<T extends HTMLElement>(selector?: string) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    let pending: { target: HTMLElement; x: number; y: number } | null = null;

    const flush = () => {
      frame = 0;
      if (!pending) return;
      const { target, x, y } = pending;
      pending = null;
      target.style.setProperty("--spot-x", `${x.toFixed(1)}%`);
      target.style.setProperty("--spot-y", `${y.toFixed(1)}%`);
    };

    const handleMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      const origin = event.target;
      if (!(origin instanceof Element)) return;
      const target = selector
        ? origin.closest<HTMLElement>(selector)
        : (root as unknown as HTMLElement);
      if (!target || !root.contains(target)) return;

      const bounds = target.getBoundingClientRect();
      if (!bounds.width || !bounds.height) return;

      pending = {
        target,
        x: ((event.clientX - bounds.left) / bounds.width) * 100,
        y: ((event.clientY - bounds.top) / bounds.height) * 100,
      };
      target.dataset.spot = "on";
      if (!frame) frame = window.requestAnimationFrame(flush);
    };

    const handleLeave = (event: PointerEvent) => {
      const origin = event.target;
      if (!(origin instanceof Element)) return;
      const target = selector ? origin.closest<HTMLElement>(selector) : root;
      if (target instanceof HTMLElement) delete target.dataset.spot;
    };

    root.addEventListener("pointermove", handleMove, { passive: true });
    root.addEventListener("pointerleave", handleLeave, { passive: true });
    root.addEventListener("pointerout", handleLeave, { passive: true });

    return () => {
      root.removeEventListener("pointermove", handleMove);
      root.removeEventListener("pointerleave", handleLeave);
      root.removeEventListener("pointerout", handleLeave);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [selector]);

  return ref;
}
