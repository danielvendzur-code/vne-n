import { type CSSProperties, useCallback, useEffect, useMemo, useRef } from "react";
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

type ScenePoint = {
  col: number;
  row: number;
  inside: boolean;
};

type PointerSample = {
  clientX: number;
  clientY: number;
  col: number;
  row: number;
  inside: boolean;
  hasPosition: boolean;
  pointerType: string;
  pressed: boolean;
};

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

/**
 * A pointer-independent adaptation of React Bits Cubes. Interaction is read
 * from the window, so foreground mock-ups cannot block the visual underneath.
 */
export function Cubes({
  gridSize = 8,
  cubeSize,
  maxAngle = 46,
  radius = 3.2,
  easing = "power3.out",
  duration = { enter: 0.28, leave: 0.62 },
  cellGap,
  borderStyle = "1px solid rgba(225, 255, 244, 0.42)",
  faceColor = "#245d53",
  shadow = false,
  autoAnimate = true,
  rippleOnClick = true,
  rippleColor = "#c96c4c",
  rippleSpeed = 1.8,
  className = "",
}: CubesProps) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const cubesRef = useRef<HTMLElement[]>([]);
  const cubeMotionRef = useRef<Map<HTMLElement, CubeMotion>>(new Map());
  const activeCubesRef = useRef<Set<HTMLElement>>(new Set());
  const visibleRef = useRef(true);
  const idleEpochRef = useRef(0);
  const interactionUntilRef = useRef(0);
  const pointerRef = useRef<PointerSample>({
    clientX: 0,
    clientY: 0,
    col: 0,
    row: 0,
    inside: false,
    hasPosition: false,
    pointerType: "mouse",
    pressed: false,
  });
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

  const getScenePoint = useCallback(
    (clientX: number, clientY: number): ScenePoint => {
      const scene = sceneRef.current;
      if (!scene) return { col: 0, row: 0, inside: false };

      const rect = scene.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return { col: 0, row: 0, inside: false };

      const edgeTolerance = Math.min(rect.width, rect.height) * 0.018;
      const inside =
        clientX >= rect.left - edgeTolerance &&
        clientX <= rect.right + edgeTolerance &&
        clientY >= rect.top - edgeTolerance &&
        clientY <= rect.bottom + edgeTolerance;

      return {
        col: clamp(((clientX - rect.left) / rect.width) * gridSize, 0.15, gridSize - 0.15),
        row: clamp(((clientY - rect.top) / rect.height) * gridSize, 0.15, gridSize - 0.15),
        inside,
      };
    },
    [gridSize],
  );

  const tiltAt = useCallback(
    (rowCenter: number, colCenter: number, intensity = 1) => {
      if (!sceneRef.current || !visibleRef.current || reducedMotion) return;

      const nextActive = new Set<HTMLElement>();

      cubesRef.current.forEach((cube) => {
        const row = Number(cube.dataset.row);
        const col = Number(cube.dataset.col);
        const distance = Math.hypot(row + 0.5 - rowCenter, col + 0.5 - colCenter);

        if (distance > radius) return;

        nextActive.add(cube);
        const influence = Math.pow(1 - distance / radius, 1.18) * intensity;
        const xDirection = (row + 0.5 - rowCenter) / radius;
        const yDirection = (col + 0.5 - colCenter) / radius;
        const motion = cubeMotionRef.current.get(cube);
        motion?.rotateX(-maxAngle * influence * xDirection);
        motion?.rotateY(maxAngle * influence * yDirection);
        motion?.z(28 * influence);
      });

      activeCubesRef.current.forEach((cube) => {
        if (nextActive.has(cube)) return;
        gsap.to(cube, {
          duration: duration.leave,
          ease: "power3.out",
          overwrite: "auto",
          rotationX: 0,
          rotationY: 0,
          z: 0,
        });
      });

      activeCubesRef.current = nextActive;
    },
    [duration.leave, maxAngle, radius, reducedMotion],
  );

  const resetAll = useCallback(
    (immediate = false) => {
      if (activeCubesRef.current.size === 0) return;
      gsap.to([...activeCubesRef.current], {
        duration: immediate || reducedMotion ? 0 : duration.leave,
        ease: "power3.out",
        overwrite: "auto",
        rotationX: 0,
        rotationY: 0,
        z: 0,
      });
      activeCubesRef.current.clear();
    },
    [duration.leave, reducedMotion],
  );

  const rippleAt = useCallback(
    (clientX: number, clientY: number) => {
      if (!rippleOnClick || reducedMotion) return;
      const point = getScenePoint(clientX, clientY);
      if (!point.inside) return;

      const colHit = Math.floor(point.col);
      const rowHit = Math.floor(point.row);

      cubesRef.current.forEach((cube) => {
        const distance = Math.hypot(
          Number(cube.dataset.row) - rowHit,
          Number(cube.dataset.col) - colHit,
        );
        const delay = (distance * 0.075) / rippleSpeed;
        const faces = cube.querySelectorAll<HTMLElement>(
          ".rb-cubes__face--front, .rb-cubes__face--top, .rb-cubes__face--right",
        );

        gsap.to(faces, {
          backgroundColor: rippleColor,
          duration: 0.18 / rippleSpeed,
          delay,
          ease: "power2.out",
        });
        gsap.to(faces, {
          backgroundColor: faceColor,
          duration: 0.48 / rippleSpeed,
          delay: delay + 0.24 / rippleSpeed,
          ease: "power3.out",
        });
        gsap.fromTo(
          cube,
          { scale: 1 },
          {
            scale: 1.035,
            duration: 0.18 / rippleSpeed,
            delay,
            repeat: 1,
            yoyo: true,
            ease: "power2.inOut",
          },
        );
      });
    },
    [faceColor, getScenePoint, reducedMotion, rippleColor, rippleOnClick, rippleSpeed],
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
      const depth = Math.max(4, firstCube.offsetWidth / 2);
      scene.style.setProperty("--rb-cube-depth", `${depth.toFixed(2)}px`);
    };

    updateDepth();
    const resizeObserver = new ResizeObserver(updateDepth);
    resizeObserver.observe(scene);
    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        visibleRef.current = entry.isIntersecting;
        if (!entry.isIntersecting) resetAll(true);
      },
      { rootMargin: "120px" },
    );
    visibilityObserver.observe(scene);

    return () => {
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
    };
  }, [resetAll]);

  useEffect(() => {
    if (reducedMotion) {
      resetAll(true);
      gsap.killTweensOf(cubesRef.current);
      gsap.set(cubesRef.current, { clearProps: "transform" });
      return;
    }

    const samplePointer = (event: PointerEvent, pressed?: boolean) => {
      const point = getScenePoint(event.clientX, event.clientY);
      pointerRef.current = {
        clientX: event.clientX,
        clientY: event.clientY,
        col: point.col,
        row: point.row,
        inside: point.inside,
        hasPosition: true,
        pointerType: event.pointerType || "mouse",
        pressed: pressed ?? pointerRef.current.pressed,
      };
      interactionUntilRef.current = performance.now() + (event.pointerType === "touch" ? 650 : 320);
    };
    const onPointerMove = (event: PointerEvent) => samplePointer(event);
    const onPointerDown = (event: PointerEvent) => {
      samplePointer(event, true);
      rippleAt(event.clientX, event.clientY);
    };
    const onPointerUp = (event: PointerEvent) => {
      samplePointer(event, false);
      interactionUntilRef.current = performance.now() + (event.pointerType === "touch" ? 720 : 320);
    };
    const onPointerExit = (event: PointerEvent) => {
      if (event.relatedTarget !== null) return;
      pointerRef.current.hasPosition = false;
      pointerRef.current.inside = false;
      pointerRef.current.pressed = false;
      interactionUntilRef.current = performance.now() + 220;
    };
    const onBlur = () => {
      pointerRef.current.hasPosition = false;
      pointerRef.current.inside = false;
      pointerRef.current.pressed = false;
    };
    const refreshPointerPosition = () => {
      const pointer = pointerRef.current;
      if (!pointer.hasPosition) return;
      const point = getScenePoint(pointer.clientX, pointer.clientY);
      pointer.col = point.col;
      pointer.row = point.row;
      pointer.inside = point.inside;
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    window.addEventListener("pointerup", onPointerUp, { passive: true });
    window.addEventListener("pointercancel", onPointerUp, { passive: true });
    window.addEventListener("pointerout", onPointerExit, { passive: true });
    window.addEventListener("blur", onBlur);
    window.addEventListener("resize", refreshPointerPosition, { passive: true });
    window.addEventListener("scroll", refreshPointerPosition, { passive: true });

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
      window.removeEventListener("pointerout", onPointerExit);
      window.removeEventListener("blur", onBlur);
      window.removeEventListener("resize", refreshPointerPosition);
      window.removeEventListener("scroll", refreshPointerPosition);
    };
  }, [getScenePoint, reducedMotion, resetAll, rippleAt]);

  useEffect(() => {
    if (reducedMotion) return;
    idleEpochRef.current = performance.now();

    const tick = (time: number) => {
      animationFrameRef.current = window.requestAnimationFrame(tick);
      if (document.hidden || !visibleRef.current) return;

      const pointer = pointerRef.current;
      const touchIsActive =
        pointer.pointerType === "touch" && (pointer.pressed || time < interactionUntilRef.current);
      const directInteraction =
        pointer.hasPosition && pointer.inside && (pointer.pointerType !== "touch" || touchIsActive);

      if (directInteraction) {
        tiltAt(pointer.row, pointer.col, pointer.pointerType === "touch" ? 0.92 : 1);
        return;
      }

      if (!autoAnimate || time < interactionUntilRef.current) return;

      const elapsed = (time - idleEpochRef.current) / 1000;
      const col = gridSize * (0.5 + Math.sin(elapsed * 0.52) * 0.28);
      const row = gridSize * (0.5 + Math.cos(elapsed * 0.39) * 0.22);
      const intensity = 0.56 + Math.sin(elapsed * 0.74) * 0.08;
      tiltAt(row, col, intensity);
    };

    animationFrameRef.current = window.requestAnimationFrame(tick);
    return () => {
      if (animationFrameRef.current !== null) {
        window.cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [autoAnimate, gridSize, reducedMotion, tiltAt]);

  useEffect(
    () => () => {
      if (animationFrameRef.current !== null)
        window.cancelAnimationFrame(animationFrameRef.current);
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
      data-reduced-motion={reducedMotion ? "true" : undefined}
      aria-hidden="true"
    >
      <div ref={sceneRef} className="rb-cubes__scene" style={sceneStyle}>
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
