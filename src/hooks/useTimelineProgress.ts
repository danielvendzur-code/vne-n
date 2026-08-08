import { useRef, useState, type RefObject } from "react";
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
 * Jedna monotónna hodnota 0–1 poháňa čiaru. Finálny timeline používa
 * rovnako vysoké tracky, takže stredy bodiek ležia presne na prahoch
 * (i + 0.5) / count bez merania DOM a bez observerov počas scrollu.
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

  useMotionValueEvent(spring, "change", (value) => {
    if (reducedMotion) return;

    const furthest = Math.max(progress.get(), value);
    if (furthest > progress.get()) progress.set(furthest);

    let next = 0;
    for (let index = 0; index < count; index += 1) {
      if (furthest >= (index + 0.5) / count) next += 1;
      else break;
    }

    // Odhalený krok ostáva odhalený aj pri scrollovaní späť hore.
    if (next <= lastReached.current) return;
    lastReached.current = next;
    setReached(next);
  });

  return { progress, reached: reducedMotion ? count : reached };
}
