import { type CSSProperties, useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import "./LineSidebar.css";

export type LineSidebarItem = {
  label: string;
  href: string;
};

type Falloff = "linear" | "smooth" | "sharp";

type LineSidebarProps = {
  items: LineSidebarItem[];
  accentColor?: string;
  textColor?: string;
  markerColor?: string;
  showIndex?: boolean;
  showMarker?: boolean;
  proximityRadius?: number;
  maxShift?: number;
  falloff?: Falloff;
  markerLength?: number;
  markerGap?: number;
  tickScale?: number;
  scaleTick?: boolean;
  itemGap?: number;
  fontSize?: number;
  smoothing?: number;
  defaultActive?: number | null;
  onItemClick?: (index: number, item: LineSidebarItem) => void;
  className?: string;
};

type SidebarStyle = CSSProperties & Record<`--line-${string}`, string | number>;

const falloffCurves: Record<Falloff, (progress: number) => number> = {
  linear: (progress) => progress,
  smooth: (progress) => progress * progress * (3 - 2 * progress),
  sharp: (progress) => progress * progress * progress,
};

/** React Bits LineSidebar, adapted to render semantic, keyboard-accessible links. */
export function LineSidebar({
  items,
  accentColor = "#c96c4c",
  textColor = "#d8e8e3",
  markerColor = "rgba(216, 232, 227, 0.28)",
  showIndex = true,
  showMarker = true,
  proximityRadius = 110,
  maxShift = 28,
  falloff = "smooth",
  markerLength = 58,
  markerGap = 12,
  tickScale = 0.42,
  scaleTick = true,
  itemGap = 20,
  fontSize = 1.2,
  smoothing = 95,
  defaultActive = null,
  onItemClick,
  className = "",
}: LineSidebarProps) {
  const listRef = useRef<HTMLUListElement>(null);
  const itemRefs = useRef<Array<HTMLLIElement | null>>([]);
  const targetsRef = useRef<number[]>([]);
  const currentRef = useRef<number[]>([]);
  const frameRef = useRef<number | null>(null);
  const lastFrameRef = useRef(0);
  const activeRef = useRef(defaultActive);
  const [activeIndex, setActiveIndex] = useState<number | null>(defaultActive);
  const reducedMotion = useReducedMotion();

  activeRef.current = activeIndex;

  const runFrame = useCallback(
    (now: number) => {
      const delta = Math.min((now - lastFrameRef.current) / 1000, 0.05);
      lastFrameRef.current = now;
      const speed = reducedMotion ? 1 : 1 - Math.exp(-delta / (Math.max(smoothing, 1) / 1000));
      let moving = false;

      itemRefs.current.forEach((element, index) => {
        if (!element) return;
        const target = Math.max(
          targetsRef.current[index] ?? 0,
          activeRef.current === index ? 1 : 0,
        );
        const current = currentRef.current[index] ?? 0;
        const next = current + (target - current) * speed;
        const settled = Math.abs(target - next) < 0.0015;
        const value = settled ? target : next;
        currentRef.current[index] = value;
        element.style.setProperty("--line-effect", value.toFixed(4));
        if (!settled) moving = true;
      });

      frameRef.current = moving ? window.requestAnimationFrame(runFrame) : null;
    },
    [reducedMotion, smoothing],
  );

  const startLoop = useCallback(() => {
    if (frameRef.current !== null) return;
    lastFrameRef.current = performance.now();
    frameRef.current = window.requestAnimationFrame(runFrame);
  }, [runFrame]);

  const handlePointerMove = useCallback(
    (event: React.PointerEvent<HTMLUListElement>) => {
      if (event.pointerType === "touch" || reducedMotion) return;
      const list = listRef.current;
      if (!list) return;
      const pointerY = event.clientY - list.getBoundingClientRect().top;
      const curve = falloffCurves[falloff];

      itemRefs.current.forEach((element, index) => {
        if (!element) return;
        const center = element.offsetTop + element.offsetHeight / 2;
        const proximity = Math.max(0, 1 - Math.abs(pointerY - center) / proximityRadius);
        targetsRef.current[index] = curve(proximity);
      });
      startLoop();
    },
    [falloff, proximityRadius, reducedMotion, startLoop],
  );

  const resetTargets = useCallback(() => {
    targetsRef.current = items.map(() => 0);
    startLoop();
  }, [items, startLoop]);

  useEffect(() => {
    startLoop();
  }, [activeIndex, startLoop]);

  useEffect(
    () => () => {
      if (frameRef.current !== null) window.cancelAnimationFrame(frameRef.current);
    },
    [],
  );

  const style: SidebarStyle = {
    "--line-accent": accentColor,
    "--line-text": textColor,
    "--line-marker": markerColor,
    "--line-marker-length": `${markerLength}px`,
    "--line-marker-gap": `${markerGap}px`,
    "--line-tick-scale": tickScale,
    "--line-max-shift": `${maxShift}px`,
    "--line-item-gap": `${itemGap}px`,
    "--line-font-size": `${fontSize}rem`,
  };

  return (
    <nav
      className={`rb-line-sidebar${showMarker ? " rb-line-sidebar--markers" : ""}${scaleTick ? " rb-line-sidebar--scale-tick" : ""}${className ? ` ${className}` : ""}`}
      style={style}
      aria-label="Hlavné menu"
    >
      <ul
        ref={listRef}
        className="rb-line-sidebar__list"
        onPointerMove={handlePointerMove}
        onPointerLeave={resetTargets}
      >
        {items.map((item, index) => (
          <li
            className="rb-line-sidebar__item"
            ref={(element) => {
              itemRefs.current[index] = element;
            }}
            key={`${item.href}-${item.label}`}
          >
            {showMarker ? <span className="rb-line-sidebar__marker" aria-hidden="true" /> : null}
            <a
              className="rb-line-sidebar__label"
              href={item.href}
              aria-current={activeIndex === index ? "location" : undefined}
              onFocus={() => {
                targetsRef.current[index] = 1;
                startLoop();
              }}
              onBlur={() => {
                targetsRef.current[index] = 0;
                startLoop();
              }}
              onClick={() => {
                setActiveIndex(index);
                onItemClick?.(index, item);
              }}
            >
              {showIndex ? (
                <span className="rb-line-sidebar__index">{String(index + 1).padStart(2, "0")}</span>
              ) : null}
              <span className="rb-line-sidebar__text">{item.label}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
