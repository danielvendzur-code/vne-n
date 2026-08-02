import { useRef, useState, type RefObject } from "react";
import { useMotionValueEvent, useScroll, useSpring, type MotionValue } from "motion/react";
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
 * Vracia jedinú hodnotu 0–1, ktorá nie je viazaná na os. Tá istá hodnota
 * poháňa vodorovnú čiaru na širokej obrazovke aj zvislú na mobile — CSS
 * si ju vezme cez premennú a rozhodne, ktorým smerom sa má ťahať.
 *
 * Krok sa rozsvieti, keď čiara prejde jeho stredom. Prahy sa nemerajú
 * z rozloženia, ale počítajú ako (i + 0.5) / count. Odpadá tým meranie
 * `getBoundingClientRect()` aj ResizeObserver, ktoré predtým museli
 * bežať pri každej zmene rozmerov.
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
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 26, mass: 0.3 });
  const [reached, setReached] = useState(reducedMotion ? count : 0);
  const lastReached = useRef(reducedMotion ? count : 0);

  useMotionValueEvent(progress, "change", (value) => {
    if (reducedMotion) return;
    let next = 0;
    for (let index = 0; index < count; index += 1) {
      if (value >= (index + 0.5) / count) next += 1;
      else break;
    }
    // Bez tejto podmienky by React prekresľoval pri každom snímku.
    if (next !== lastReached.current) {
      lastReached.current = next;
      setReached(next);
    }
  });

  return { progress, reached: reducedMotion ? count : reached };
}
