import { useLayoutEffect, useRef, useState, type RefObject } from "react";
import {
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useSpring,
  type MotionValue,
} from "motion/react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface Options {
  /** Rozsah scrollovania, v ktorom čiara narastá z 0 na 1. */
  offset: [string, string];
  /** Koľko krokov je na časovej osi. */
  count: number;
}

/**
 * Scroll-driven timeline.
 *
 * Základné prahy ostávajú matematické. Po prvom layoute ich jednorazovo
 * spresníme podľa skutočných stredov bodiek; znovu sa prepočítajú len po
 * resize/orientation change a po načítaní fontov. Počas scrollu sa layout
 * nikdy nemeria — rastie iba jedna MotionValue.
 */
export function useTimelineProgress(
  target: RefObject<HTMLElement | null>,
  { offset, count }: Options,
): { progress: MotionValue<number>; reached: number } {
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target,
    offset: offset as unknown as Parameters<typeof useScroll>[0]["offset"],
  });
  const spring = useSpring(scrollYProgress, { stiffness: 108, damping: 28, mass: 0.3 });
  const progress = useMotionValue(reducedMotion ? 1 : 0);
  const [reached, setReached] = useState(reducedMotion ? count : 0);
  const lastReached = useRef(reducedMotion ? count : 0);
  const thresholds = useRef<number[]>(
    Array.from({ length: count }, (_, index) => (index + 0.5) / count),
  );

  useLayoutEffect(() => {
    const root = target.current;
    if (!root || reducedMotion) return;

    const measure = () => {
      const rootRect = root.getClientRects().item(0);
      if (!rootRect) return;

      const nodes = Array.from(root.querySelectorAll<HTMLElement>(".lp-tl-node")).slice(0, count);
      if (nodes.length !== count) return;

      const centres = nodes.map((node) => {
        const rect = node.getClientRects().item(0);
        if (!rect) return 0;
        return rect.top + rect.height / 2 - rootRect.top;
      });

      const first = centres[0] ?? 0;
      const last = centres[centres.length - 1] ?? rootRect.height;
      const railStart = Math.max(0, first - 18);
      const railEnd = Math.min(rootRect.height, Math.max(railStart + 1, last + 18));
      const railLength = Math.max(1, railEnd - railStart);

      root.style.setProperty("--tl-rail-top", `${railStart}px`);
      root.style.setProperty("--tl-rail-bottom", `${Math.max(0, rootRect.height - railEnd)}px`);
      thresholds.current = centres.map((centre) =>
        Math.min(1, Math.max(0, (centre - railStart) / railLength)),
      );
    };

    measure();
    window.addEventListener("resize", measure, { passive: true });
    void document.fonts?.ready.then(measure).catch(() => undefined);

    return () => window.removeEventListener("resize", measure);
  }, [count, reducedMotion, target]);

  useMotionValueEvent(spring, "change", (value) => {
    if (reducedMotion) return;

    // Už prejdená časť osi sa pri scrollovaní späť nezmaže.
    const furthest = Math.max(progress.get(), value);
    if (furthest > progress.get()) progress.set(furthest);

    let next = 0;
    for (let index = 0; index < count; index += 1) {
      if (furthest >= (thresholds.current[index] ?? (index + 0.5) / count)) next += 1;
      else break;
    }

    if (next <= lastReached.current) return;
    lastReached.current = next;
    setReached(next);
  });

  return { progress, reached: reducedMotion ? count : reached };
}
