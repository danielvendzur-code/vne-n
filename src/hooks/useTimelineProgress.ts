import { useEffect, useRef, useState, type RefObject } from "react";
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
 * Postupné odhaľovanie časovej osi podľa scrollu.
 *
 * Jedna monotónna hodnota 0–1 kreslí čiaru. Prahy jednotlivých krokov sa
 * po vyrenderovaní zmerajú priamo z reálnej polohy bodiek voči koľaji,
 * takže bodka zmení stav až v momente, keď ju vizuálne dosiahne čiara —
 * aj keď má niektorá karta viac textu alebo sa zmení šírka obrazovky.
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
  const spring = useSpring(scrollYProgress, { stiffness: 112, damping: 27, mass: 0.28 });
  const progress = useMotionValue(reducedMotion ? 1 : 0);
  const [reached, setReached] = useState(reducedMotion ? count : 0);
  const lastReached = useRef(reducedMotion ? count : 0);
  const thresholds = useRef<number[]>([]);

  useEffect(() => {
    if (reducedMotion) return undefined;
    const root = target.current;
    if (!root) return undefined;

    let frame = 0;

    const measure = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const rail = root.querySelector<HTMLElement>(".lp-timeline-rail");
        const nodes = Array.from(root.querySelectorAll<HTMLElement>(".lp-tl-node"));
        if (!rail || nodes.length === 0) return;

        const railRect = rail.getBoundingClientRect();
        if (railRect.height <= 0) return;

        thresholds.current = nodes.slice(0, count).map((node) => {
          const nodeRect = node.getBoundingClientRect();
          const center = nodeRect.top + nodeRect.height / 2;
          return Math.min(1, Math.max(0, (center - railRect.top) / railRect.height));
        });
      });
    };

    measure();

    const observer =
      typeof ResizeObserver !== "undefined" ? new ResizeObserver(measure) : null;
    observer?.observe(root);
    root.querySelectorAll<HTMLElement>(".lp-tl-card").forEach((card) => observer?.observe(card));
    window.addEventListener("resize", measure, { passive: true });

    return () => {
      cancelAnimationFrame(frame);
      observer?.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [count, reducedMotion, target]);

  useMotionValueEvent(spring, "change", (value) => {
    if (reducedMotion) return;

    const furthest = Math.max(progress.get(), value);
    if (furthest > progress.get()) progress.set(furthest);

    const measured = thresholds.current;
    const fallback = Array.from({ length: count }, (_, index) => (index + 0.5) / count);
    const activeThresholds = measured.length === count ? measured : fallback;

    let next = 0;
    for (const threshold of activeThresholds) {
      if (furthest >= threshold) next += 1;
      else break;
    }

    // Odhalený krok ostáva odhalený aj pri scrollovaní späť hore.
    if (next <= lastReached.current) return;
    lastReached.current = next;
    setReached(next);
  });

  return { progress, reached: reducedMotion ? count : reached };
}
