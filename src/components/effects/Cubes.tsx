import {
  type CSSProperties,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { gsap } from "gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import "./Cubes.css";

type CubeGap = number | { row?: number; col?: number };

type CubesProps = {
  gridSize?: number;
  cubeSize?: number;
  maxAngle?: number;
  radius?: number;
  easing?: string;
  duration?: { enter: number; leave: number };
  cellGap?: CubeGap;
  borderStyle?: string;
  faceColor?: string;
  shadow?: boolean | string;
  autoAnimate?: boolean;
  rippleOnClick?: boolean;
  rippleColor?: string;
  rippleSpeed?: number;
  className?: string;
};

type CubeStyle = CSSProperties & {
  "--rb-cube-face-border": string;
  "--rb-cube-face-bg": string;
  "--rb-cube-face-shadow": string;
};

type CubeMotion = {
  rotateX: (value: number) => void;
  rotateY: (value: number) => void;
  z: (value: number) => void;
};

/**
 * React Bits Cubes, adapted for this site: scoped styles, reduced-motion,
 * viewport pausing and touch-safe interaction.
 */
export function Cubes({
  gridSize = 8,
  cubeSize,
  maxAngle = 46,
  radius = 3.2,
  easing = "power3.out",
  duration = { enter: 0.28, leave: 0.62 },
  cellGap,
  borderStyle = "1px solid rgba(214, 255, 235, 0.24)",
  faceColor = "#173f3b",
  shadow = false,
  autoAnimate = true,
  rippleOnClick = true,
  rippleColor = "#c96c4c",
  rippleSpeed = 1.8,
  className = "",
}: CubesProps) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const pointerFrameRef = useRef<number | null>(null);
  const idleTimerRef = useRef<number | null>(null);
  const cubesRef = useRef<HTMLElement[]>([]);
  const cubeMotionRef = useRef<Map<HTMLElement, CubeMotion>>(new Map());
  const activeCubesRef = useRef<Set<HTMLElement>>(new Set());
  const userActiveRef = useRef(false);
  const visibleRef = useRef(true);
  const simPosRef = useRef({ x: gridSize * 0.7, y: gridSize * 0.35 });
  const simTargetRef = useRef({ x: gridSize * 0.25, y: gridSize * 0.72 });
  const reducedMotion = useReducedMotion();

  const cells = useMemo(() => Array.from({ length: gridSize }), [gridSize]);
  const colGap =
    typeof cellGap === "number"
      ? `${cellGap}px`
      : cellGap?.col !== undefined
        ? `${cellGap.col}px`
        : "clamp(3px, 0.7vw, 8px)";
  const rowGap =
    typeof cellGap === "number"
      ? `${cellGap}px`
      : cellGap?.row !== undefined
        ? `${cellGap.row}px`
        : "clamp(3px, 0.7vw, 8px)";

  const getCubes = useCallback(() => cubesRef.current, []);

  const tiltAt = useCallback(
    (rowCenter: number, colCenter: number) => {
      if (!sceneRef.current || !visibleRef.current || reducedMotion) return;

      const nextActive = new Set<HTMLElement>();

      getCubes().forEach((cube) => {
        const row = Number(cube.dataset.row);
        const col = Number(cube.dataset.col);
        const distance = Math.hypot(row + 0.5 - rowCenter, col + 0.5 - colCenter);

        if (distance <= radius) {
          nextActive.add(cube);
          const influence = 1 - distance / radius;
          const xDirection = (row + 0.5 - rowCenter) / radius;
          const yDirection = (col + 0.5 - colCenter) / radius;
          const motion = cubeMotionRef.current.get(cube);
          motion?.rotateX(-maxAngle * influence * xDirection);
          motion?.rotateY(maxAngle * influence * yDirection);
          motion?.z(18 * influence);
        }
      });

      activeCubesRef.current.forEach((cube) => {
        if (!nextActive.has(cube)) {
          gsap.to(cube, {
            duration: duration.leave,
            ease: "power3.out",
            overwrite: "auto",
            rotateX: 0,
            rotateY: 0,
            z: 0,
          });
        }
      });

      activeCubesRef.current = nextActive;
    },
    [duration.leave, getCubes, maxAngle, radius, reducedMotion],
  );

  const resetAll = useCallback(() => {
    if (!sceneRef.current || activeCubesRef.current.size === 0) return;
    gsap.to([...activeCubesRef.current], {
      duration: reducedMotion ? 0 : duration.leave,
      ease: "power3.out",
      overwrite: "auto",
      rotateX: 0,
      rotateY: 0,
      z: 0,
    });
    activeCubesRef.current.clear();
  }, [duration.leave, reducedMotion]);

  const handlePointerMove = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (event.pointerType === "touch" || reducedMotion) return;
      userActiveRef.current = true;
      if (idleTimerRef.current !== null) window.clearTimeout(idleTimerRef.current);

      const scene = sceneRef.current;
      if (!scene) return;
      const rect = scene.getBoundingClientRect();
      const colCenter = ((event.clientX - rect.left) / rect.width) * gridSize;
      const rowCenter = ((event.clientY - rect.top) / rect.height) * gridSize;

      if (pointerFrameRef.current !== null) window.cancelAnimationFrame(pointerFrameRef.current);
      pointerFrameRef.current = window.requestAnimationFrame(() => tiltAt(rowCenter, colCenter));
      idleTimerRef.current = window.setTimeout(() => {
        userActiveRef.current = false;
      }, 1800);
    },
    [gridSize, reducedMotion, tiltAt],
  );

  const handleRipple = useCallback(
    (event: ReactMouseEvent<HTMLDivElement>) => {
      const scene = sceneRef.current;
      if (!scene || !rippleOnClick || reducedMotion) return;

      const rect = scene.getBoundingClientRect();
      const colHit = Math.floor(((event.clientX - rect.left) / rect.width) * gridSize);
      const rowHit = Math.floor(((event.clientY - rect.top) / rect.height) * gridSize);
      const rings = new Map<number, HTMLElement[]>();

      getCubes().forEach((cube) => {
        const distance = Math.hypot(
          Number(cube.dataset.row) - rowHit,
          Number(cube.dataset.col) - colHit,
        );
        const ring = Math.round(distance);
        const faces = Array.from(cube.querySelectorAll<HTMLElement>(".rb-cubes__face"));
        rings.set(ring, [...(rings.get(ring) ?? []), ...faces]);
      });

      [...rings.entries()].forEach(([ring, faces]) => {
        const delay = (ring * 0.1) / rippleSpeed;
        gsap.to(faces, {
          backgroundColor: rippleColor,
          duration: 0.22 / rippleSpeed,
          delay,
          ease: "power2.out",
        });
        gsap.to(faces, {
          backgroundColor: faceColor,
          duration: 0.5 / rippleSpeed,
          delay: delay + 0.34 / rippleSpeed,
          ease: "power3.out",
        });
      });
    },
    [faceColor, getCubes, gridSize, reducedMotion, rippleColor, rippleOnClick, rippleSpeed],
  );

  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    const cubes = Array.from(scene.querySelectorAll<HTMLElement>(".rb-cubes__cube"));
    cubesRef.current = cubes;
    cubeMotionRef.current = new Map(
      cubes.map((cube) => [
        cube,
        {
          rotateX: gsap.quickTo(cube, "rotationX", { duration: duration.enter, ease: easing }),
          rotateY: gsap.quickTo(cube, "rotationY", { duration: duration.enter, ease: easing }),
          z: gsap.quickTo(cube, "z", { duration: duration.enter, ease: easing }),
        },
      ]),
    );

    return () => {
      gsap.killTweensOf(cubes);
      gsap.killTweensOf(scene.querySelectorAll(".rb-cubes__face"));
      cubesRef.current = [];
      cubeMotionRef.current.clear();
      activeCubesRef.current.clear();
    };
  }, [duration.enter, easing, gridSize]);

  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    const updateDepth = () => {
      const firstCube = cubesRef.current[0];
      if (!firstCube) return;
      const depth = Math.max(2, firstCube.getBoundingClientRect().width / 2);
      scene.style.setProperty("--rb-cube-depth", `${depth.toFixed(2)}px`);
    };

    updateDepth();
    const resizeObserver = new ResizeObserver(updateDepth);
    resizeObserver.observe(scene);
    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        visibleRef.current = entry.isIntersecting;
        if (!entry.isIntersecting) resetAll();
      },
      { rootMargin: "100px" },
    );
    visibilityObserver.observe(scene);

    return () => {
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
    };
  }, [resetAll]);

  useEffect(() => {
    if (
      !autoAnimate ||
      reducedMotion ||
      window.matchMedia("(pointer: coarse), (hover: none)").matches
    )
      return;

    const timer = window.setInterval(() => {
      if (document.hidden || !visibleRef.current || userActiveRef.current) return;
      const position = simPosRef.current;
      const target = simTargetRef.current;
      position.x += (target.x - position.x) * 0.08;
      position.y += (target.y - position.y) * 0.08;
      tiltAt(position.y, position.x);

      if (Math.hypot(position.x - target.x, position.y - target.y) < 0.2) {
        simTargetRef.current = {
          x: 0.5 + Math.random() * (gridSize - 1),
          y: 0.5 + Math.random() * (gridSize - 1),
        };
      }
    }, 72);

    return () => window.clearInterval(timer);
  }, [autoAnimate, gridSize, reducedMotion, tiltAt]);

  useEffect(
    () => () => {
      if (pointerFrameRef.current !== null) window.cancelAnimationFrame(pointerFrameRef.current);
      if (idleTimerRef.current !== null) window.clearTimeout(idleTimerRef.current);
    },
    [],
  );

  const sceneStyle: CSSProperties = {
    gridTemplateColumns: cubeSize
      ? `repeat(${gridSize}, ${cubeSize}px)`
      : `repeat(${gridSize}, 1fr)`,
    gridTemplateRows: cubeSize ? `repeat(${gridSize}, ${cubeSize}px)` : `repeat(${gridSize}, 1fr)`,
    columnGap: colGap,
    rowGap,
  };
  const wrapperStyle: CubeStyle = {
    "--rb-cube-face-border": borderStyle,
    "--rb-cube-face-bg": faceColor,
    "--rb-cube-face-shadow": shadow === true ? "0 9px 24px rgba(0, 0, 0, 0.3)" : shadow || "none",
  };

  return (
    <div
      className={`rb-cubes${className ? ` ${className}` : ""}`}
      style={wrapperStyle}
      aria-hidden="true"
    >
      <div
        ref={sceneRef}
        className="rb-cubes__scene"
        style={sceneStyle}
        onPointerMove={handlePointerMove}
        onPointerLeave={resetAll}
        onClick={handleRipple}
      >
        {cells.map((_, row) =>
          cells.map((__, col) => (
            <div className="rb-cubes__cube" data-row={row} data-col={col} key={`${row}-${col}`}>
              <i className="rb-cubes__face rb-cubes__face--front" />
              <i className="rb-cubes__face rb-cubes__face--back" />
              <i className="rb-cubes__face rb-cubes__face--left" />
              <i className="rb-cubes__face rb-cubes__face--right" />
              <i className="rb-cubes__face rb-cubes__face--top" />
              <i className="rb-cubes__face rb-cubes__face--bottom" />
            </div>
          )),
        )}
      </div>
    </div>
  );
}
