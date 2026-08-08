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
 * Prahy sa zámerne nepočítajú ako rovnaké štvrtiny. Karty majú na mobile
 * rôznu výšku a pri responzívnom zalomení sa mení aj ich poloha. Preto si
 * pri layoute zmeriame skutočné stredy bodiek a rovnaké súradnice použijeme
 * aj na dĺžku koľaje aj na okamih odhalenia. Bodka sa tak vyplní až vtedy,
 * keď ju vizuálne dosiahne rastúca čiara.
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
      const nodes = Array.from(root.querySelectorAll<HTMLElement>(".lp-tl-node")).slice(0, count);
      if (nodes.length !== count) return;

      const rootRect = root.getBoundingClientRect();
      const centres = nodes.map((node) => {
        const rect = node.getBoundingClientRect();
        return rect.top + rect.height / 2 - rootRect.top;
      });

      const first = centres[0] ?? 0;
      const last = centres[centres.length - 1] ?? rootRect.height;
      // Krátky presah pred prvou a za poslednou bodkou necháva používateľa
      // reálne vidieť, ako čiara do bodky príde a zase z nej pokračuje.
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
    const observer = new ResizeObserver(measure);
    observer.observe(root);
    root.querySelectorAll<HTMLElement>(".lp-tl-card").forEach((card) => observer.observe(card));

    return () => observer.disconnect();
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
