import { useEffect, useRef, useState, type RefObject } from "react";
import { useMotionValueEvent, useScroll, useSpring, type MotionValue } from "motion/react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface Options {
  /** Selektor uzlov na čiare (bodiek), ktoré sa majú rozsvecovať. */
  nodeSelector: string;
  /** Rozsah scrollovania, v ktorom čiara narastá z 0 na 1. */
  offset: [string, string];
  /** Koľko uzlov je na časovej osi. */
  count: number;
}

/**
 * Postupné odhaľovanie časovej osi podľa scrollu.
 *
 * Pôvodná verzia merala `getBoundingClientRect()` pre zoznam aj pre každý
 * uzol v každom snímku animácie — teda vynútený prepočet rozloženia
 * 7× za snímok — a navyše volala `setReached` aj vtedy, keď sa hodnota
 * nezmenila, takže React prekresľoval 60× za sekundu. Odtiaľ to sekanie.
 *
 * Polohy uzlov sa preto merajú raz a prepočítajú len pri zmene rozmerov.
 * V samotnej animácii sa už porovnávajú iba čísla a stav sa mení len
 * vtedy, keď čiara naozaj prejde cez ďalší uzol.
 */
export function useTimelineProgress(
  listRef: RefObject<HTMLElement | null>,
  { nodeSelector, offset, count }: Options,
): { scaleY: MotionValue<number>; reached: number } {
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: offset as unknown as Parameters<typeof useScroll>[0]["offset"],
  });
  const scaleY = useSpring(scrollYProgress, { stiffness: 70, damping: 26, mass: 0.5 });
  const [reached, setReached] = useState(reducedMotion ? count : 0);

  // Stredy uzlov v pomere k výške zoznamu (0–1). Merané mimo animácie.
  const marks = useRef<number[]>([]);
  const lastReached = useRef(reducedMotion ? count : 0);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;

    const measure = () => {
      const listRect = list.getBoundingClientRect();
      if (!listRect.height) return;
      marks.current = Array.from(list.querySelectorAll<HTMLElement>(nodeSelector)).map((node) => {
        const rect = node.getBoundingClientRect();
        return (rect.top + rect.height / 2 - listRect.top) / listRect.height;
      });
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(list);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [listRef, nodeSelector]);

  useMotionValueEvent(scaleY, "change", (value) => {
    if (reducedMotion) return;
    const positions = marks.current;
    if (!positions.length) return;

    let next = 0;
    for (const mark of positions) {
      if (mark <= value) next += 1;
      else break;
    }
    // Bez tejto podmienky by React prekresľoval pri každom snímku.
    if (next !== lastReached.current) {
      lastReached.current = next;
      setReached(next);
    }
  });

  return { scaleY, reached: reducedMotion ? count : reached };
}
