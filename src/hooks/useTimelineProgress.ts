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
  /** Uzly, podľa ktorých sa spresnia prahy jednotlivých krokov. */
  nodeSelector?: string;
  /**
   * Koľaj, ktorá určuje os. Keď je širšia než vyššia, os je vodorovná —
   * na počítači tak tá istá logika obslúži aj štyri kroky vedľa seba.
   */
  railSelector?: string;
}

interface Timeline {
  progress: MotionValue<number>;
  /** Koľko krokov už čiara prešla. */
  reached: number;
  /** Index kroku, ktorý sa práve rozsvietil; -1 kým sa nezačalo. */
  active: number;
}

/** Pružina sa k jednotke blíži asymptoticky, posledný prah preto potrebuje vôľu. */
const EPSILON = 0.006;

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

/**
 * Scroll-driven timeline.
 *
 * Základné prahy ostávajú matematické. Po prvom layoute ich jednorazovo
 * spresníme podľa skutočných stredov bodiek; znovu sa prepočítajú len po
 * resize/orientation change, po načítaní fontov a keď sekcia dostane skutočné
 * rozmery (`content-visibility: auto` ju do prvého zobrazenia nerozkladá).
 * Počas scrollu sa layout nikdy nemeria — rastie iba jedna MotionValue.
 */
export function useTimelineProgress(
  target: RefObject<HTMLElement | null>,
  { offset, count, nodeSelector = ".lp-tl-node", railSelector }: Options,
): Timeline {
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
    // Meria sa aj pri obmedzenom pohybe: prahy vtedy nikto nečíta, ale koľaj
    // musí aj v statickom obraze začínať v prvej bodke a končiť v poslednej.
    if (!root) return;

    const measure = () => {
      const rootRect = root.getClientRects().item(0);
      if (!rootRect || rootRect.height < 1) return;

      const nodes = Array.from(root.querySelectorAll<HTMLElement>(nodeSelector)).slice(0, count);
      if (nodes.length !== count) return;

      const rects = nodes.map((node) => node.getClientRects().item(0));
      if (rects.some((rect) => !rect)) return;

      // Os si nevyberá mediálny dotaz v JS, ale skutočný tvar koľaje. Vodorovná
      // koľaj na počítači a zvislá na mobile tak zdieľajú jeden výpočet.
      const rail = railSelector ? root.querySelector<HTMLElement>(railSelector) : null;
      const railRect = rail?.getClientRects().item(0) ?? null;
      const horizontal = railRect ? railRect.width > railRect.height : false;

      const centres = rects.map((rect) =>
        horizontal
          ? rect!.left + rect!.width / 2 - rootRect.left
          : rect!.top + rect!.height / 2 - rootRect.top,
      );

      const span = horizontal ? rootRect.width : rootRect.height;
      const first = centres[0] ?? 0;
      const last = centres[centres.length - 1] ?? span;
      const railStart = clamp01(Math.min(first, last) / span) * span;
      const railEnd = Math.min(span, Math.max(railStart + 1, Math.max(first, last)));
      const railLength = railEnd - railStart;

      // Koľaj začína presne v strede prvej bodky a končí v strede poslednej,
      // takže výplň dorazí k uzlu v ten istý moment, v ktorom sa rozsvieti.
      root.style.setProperty("--tl-rail-start", `${railStart}px`);
      root.style.setProperty("--tl-rail-end", `${Math.max(0, span - railEnd)}px`);
      if (!horizontal) {
        // Staršia mobilná vrstva pozná ešte pôvodné názvy.
        root.style.setProperty("--tl-rail-top", `${railStart}px`);
        root.style.setProperty("--tl-rail-bottom", `${Math.max(0, span - railEnd)}px`);
      }

      // Pružina sa k jednotke blíži asymptoticky, posledný uzol by sa preto pri
      // presnom prahu 1 nikdy nerozsvietil. Strop 0,96 je vizuálne nerozoznateľný
      // — čiara je v tej chvíli tesne pri bodke.
      const measured = centres.map((centre) =>
        Math.min(0.96, clamp01((centre - railStart) / railLength)),
      );
      // Ak sa kroky ešte neusadili, ostávame na matematickom rozdelení.
      const usable = measured.some((value, index) => index > 0 && value > measured[index - 1]!);
      if (usable) thresholds.current = measured;
    };

    measure();

    const observer =
      typeof ResizeObserver === "undefined" ? null : new ResizeObserver(() => measure());
    observer?.observe(root);

    window.addEventListener("resize", measure, { passive: true });
    void document.fonts?.ready.then(measure).catch(() => undefined);

    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [count, nodeSelector, railSelector, reducedMotion, target]);

  useMotionValueEvent(spring, "change", (value) => {
    if (reducedMotion) return;

    // Už prejdená časť osi sa pri scrollovaní späť nezmaže.
    const furthest = Math.max(progress.get(), value);
    if (furthest > progress.get()) progress.set(furthest);

    let next = 0;
    for (let index = 0; index < count; index += 1) {
      const threshold = thresholds.current[index] ?? (index + 0.5) / count;
      if (furthest >= threshold - EPSILON) next += 1;
      else break;
    }

    if (next <= lastReached.current) return;
    lastReached.current = next;
    setReached(next);
  });

  const settled = reducedMotion ? count : reached;
  return { progress, reached: settled, active: settled - 1 };
}
