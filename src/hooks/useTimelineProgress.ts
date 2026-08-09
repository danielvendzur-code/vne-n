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
  /** Uzly, ktorými dráha prechádza a podľa ktorých sa spresnia prahy. */
  nodeSelector?: string;
}

interface Geometry {
  /** `d` pre SVG dráhu vedenú stredmi uzlov. */
  path: string;
  /** Dĺžka dráhy v užívateľských jednotkách — kreslí sa ňou `stroke-dasharray`. */
  length: number;
  width: number;
  height: number;
}

interface Timeline {
  progress: MotionValue<number>;
  /** Koľko krokov už čiara prešla. */
  reached: number;
  /** Index kroku, ktorý sa práve rozsvietil; -1 kým sa nezačalo. */
  active: number;
  /** Dráha medzi uzlami; `null`, kým sa kroky nerozložia. */
  geometry: Geometry | null;
}

interface Point {
  x: number;
  y: number;
}

/** Pružina sa k jednotke blíži asymptoticky, posledný prah preto potrebuje vôľu. */
const EPSILON = 0.006;

/**
 * Strop posledného prahu. Bez neho by sa posledný uzol nerozsvietil nikdy —
 * pružina sa k jednotke blíži, ale nedosiahne ju. Vizuálne je to nerozoznateľné,
 * čiara je v tej chvíli tesne pri bodke.
 */
const LAST_THRESHOLD = 0.96;

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

const round = (value: number) => Math.round(value * 10) / 10;

/** Najväčší polomer zaoblenia v zákrute dráhy. */
const CORNER = 26;

/** Dĺžka kvadratickej krivky odhadnutá vzorkovaním — presnosť hlboko pod pixel. */
function quadLength(from: Point, control: Point, to: Point): number {
  const samples = 24;
  let length = 0;
  let previous = from;

  for (let step = 1; step <= samples; step += 1) {
    const t = step / samples;
    const u = 1 - t;
    const point = {
      x: u * u * from.x + 2 * u * t * control.x + t * t * to.x,
      y: u * u * from.y + 2 * u * t * control.y + t * t * to.y,
    };
    length += Math.hypot(point.x - previous.x, point.y - previous.y);
    previous = point;
  }

  return length;
}

/**
 * Dráha z jedného uzla do druhého.
 *
 * Uzol sedí vo výške ikony, teda hneď pod horným okrajom svojej karty, a ďalší
 * krok je posunutý doprava až za jej pravý okraj. Priama spojnica by preto
 * viedla naprieč kartou. Dráha namiesto toho zíde v ľavom pruhu pod kartu,
 * v medzere medzi krokmi prejde zaoblenou zákrutou do strany a do ďalšieho
 * uzla vojde zhora. Keď kroky nie sú posunuté (mobil), ostane z toho úsečka.
 */
function segment(from: Point, to: Point, lane: number): { d: string; length: number } {
  const dx = to.x - from.x;

  if (Math.abs(dx) < 1) {
    return { d: ` L ${round(to.x)} ${round(to.y)}`, length: Math.abs(to.y - from.y) };
  }

  const laneY = Math.min(Math.max(lane, from.y + 2), to.y - 2);
  const side = Math.sign(dx);
  const radius = Math.max(0, Math.min(CORNER, Math.abs(dx) / 2, laneY - from.y, to.y - laneY));

  const turnIn = { x: from.x, y: laneY - radius };
  const turnOut = { x: from.x + side * radius, y: laneY };
  const dropIn = { x: to.x - side * radius, y: laneY };
  const dropOut = { x: to.x, y: laneY + radius };

  const d =
    ` L ${round(turnIn.x)} ${round(turnIn.y)}` +
    ` Q ${round(from.x)} ${round(laneY)}, ${round(turnOut.x)} ${round(turnOut.y)}` +
    ` L ${round(dropIn.x)} ${round(dropIn.y)}` +
    ` Q ${round(to.x)} ${round(laneY)}, ${round(dropOut.x)} ${round(dropOut.y)}` +
    ` L ${round(to.x)} ${round(to.y)}`;

  const length =
    Math.abs(turnIn.y - from.y) +
    quadLength(turnIn, { x: from.x, y: laneY }, turnOut) +
    Math.abs(dropIn.x - turnOut.x) +
    quadLength(dropIn, { x: to.x, y: laneY }, dropOut) +
    Math.abs(to.y - dropOut.y);

  return { d, length };
}

/**
 * Scroll-driven timeline.
 *
 * Kroky nie sú v rade — každý je kúsok nižšie a kúsok bokom od predošlého —
 * takže ich nespája úsečka, ale dráha vedená stredmi uzlov. Tá istá dráha
 * kreslí čiaru aj nesie svetlo na jej čele a z jej dĺžky vychádzajú prahy,
 * pri ktorých sa jednotlivé kroky rozsvecujú. Uzol sa tak rozsvieti presne
 * vtedy, keď k nemu čiara dorastie.
 *
 * Meria sa po prvom layoute a potom už len pri zmene rozmerov, po načítaní
 * fontov a keď sekcia dostane skutočnú výšku (`content-visibility: auto` ju do
 * prvého zobrazenia nerozkladá). Počas scrollu sa layout nikdy nemeria —
 * rastie iba jedna MotionValue.
 */
export function useTimelineProgress(
  target: RefObject<HTMLElement | null>,
  { offset, count, nodeSelector = ".lp-tl-node" }: Options,
): Timeline {
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target,
    offset: offset as unknown as Parameters<typeof useScroll>[0]["offset"],
  });
  const spring = useSpring(scrollYProgress, { stiffness: 108, damping: 28, mass: 0.3 });
  const progress = useMotionValue(reducedMotion ? 1 : 0);
  const [reached, setReached] = useState(reducedMotion ? count : 0);
  const [geometry, setGeometry] = useState<Geometry | null>(null);
  const lastReached = useRef(reducedMotion ? count : 0);
  const thresholds = useRef<number[]>(
    Array.from({ length: count }, (_, index) => (index + 0.5) / count),
  );

  useLayoutEffect(() => {
    const root = target.current;
    // Meria sa aj pri obmedzenom pohybe: prahy vtedy nikto nečíta, ale dráha
    // musí aj v statickom obraze viesť presne od prvej bodky k poslednej.
    if (!root) return;

    const measure = () => {
      const rootRect = root.getClientRects().item(0);
      if (!rootRect || rootRect.height < 1) return;

      const nodes = Array.from(root.querySelectorAll<HTMLElement>(nodeSelector)).slice(0, count);
      if (nodes.length !== count) return;

      const centres: Point[] = [];
      // Spodný a horný okraj kroku určujú pruh, ktorým dráha prejde do strany.
      const rows: { top: number; bottom: number }[] = [];

      for (const node of nodes) {
        const rect = node.getClientRects().item(0);
        if (!rect) return;
        const centre = {
          x: rect.left + rect.width / 2 - rootRect.left,
          y: rect.top + rect.height / 2 - rootRect.top,
        };
        centres.push(centre);

        const row = node.parentElement?.getClientRects().item(0);
        rows.push(
          row
            ? { top: row.top - rootRect.top, bottom: row.bottom - rootRect.top }
            : { top: centre.y, bottom: centre.y },
        );
      }
      if (centres.length < 2) return;

      let path = `M ${round(centres[0]!.x)} ${round(centres[0]!.y)}`;
      const cumulative = [0];
      let total = 0;

      for (let index = 1; index < centres.length; index += 1) {
        const from = centres[index - 1]!;
        const to = centres[index]!;
        const lane = (rows[index - 1]!.bottom + rows[index]!.top) / 2;
        const { d, length } = segment(from, to, lane);
        path += d;
        total += length;
        cumulative.push(total);
      }

      if (total < 1) return;

      thresholds.current = cumulative.map((at, index) =>
        index === cumulative.length - 1
          ? LAST_THRESHOLD
          : Math.min(LAST_THRESHOLD, clamp01(at / total)),
      );

      const next: Geometry = {
        path,
        length: Math.round(total),
        width: Math.round(rootRect.width),
        height: Math.round(rootRect.height),
      };

      // Bez porovnania by zápis rozmerov znovu spustil pozorovateľa.
      setGeometry((current) =>
        current &&
        current.path === next.path &&
        current.length === next.length &&
        current.width === next.width &&
        current.height === next.height
          ? current
          : next,
      );
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
  }, [count, nodeSelector, target]);

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
  return { progress, reached: settled, active: settled - 1, geometry };
}
