import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import "./GlideField.css";

type GlideFieldProps = {
  className?: string;
  spacing?: number;
  radius?: number;
};

type FieldState = {
  width: number;
  height: number;
  dpr: number;
  count: number;
  baseX: Float32Array;
  baseY: Float32Array;
  x: Float32Array;
  y: Float32Array;
  vx: Float32Array;
  vy: Float32Array;
  energy: Float32Array;
  alpha: Float32Array;
  seed: Float32Array;
  baseLayer: HTMLCanvasElement;
};

type PointerState = {
  clientX: number;
  clientY: number;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  velocityX: number;
  velocityY: number;
  active: boolean;
  lastInputAt: number;
};

const EMPTY_FIELD: Omit<FieldState, "baseLayer"> = {
  width: 0,
  height: 0,
  dpr: 1,
  count: 0,
  baseX: new Float32Array(),
  baseY: new Float32Array(),
  x: new Float32Array(),
  y: new Float32Array(),
  vx: new Float32Array(),
  vy: new Float32Array(),
  energy: new Float32Array(),
  alpha: new Float32Array(),
  seed: new Float32Array(),
};

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

function hash(x: number, y: number) {
  const value = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return value - Math.floor(value);
}

function createField(
  canvas: HTMLCanvasElement,
  width: number,
  height: number,
  spacing: number,
): FieldState {
  const coarse =
    window.matchMedia("(pointer: coarse)").matches &&
    !window.matchMedia("(any-pointer: fine)").matches;
  const dpr = Math.min(window.devicePixelRatio || 1, coarse ? 1.25 : 1.5);
  const gap = coarse ? Math.max(14, spacing + 3) : spacing;
  const columns = Math.max(1, Math.ceil(width / gap));
  const rows = Math.max(1, Math.ceil(height / gap));
  const count = columns * rows;
  const baseX = new Float32Array(count);
  const baseY = new Float32Array(count);
  const x = new Float32Array(count);
  const y = new Float32Array(count);
  const vx = new Float32Array(count);
  const vy = new Float32Array(count);
  const energy = new Float32Array(count);
  const alpha = new Float32Array(count);
  const seed = new Float32Array(count);

  canvas.width = Math.max(1, Math.round(width * dpr));
  canvas.height = Math.max(1, Math.round(height * dpr));
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;

  const baseLayer = document.createElement("canvas");
  baseLayer.width = canvas.width;
  baseLayer.height = canvas.height;
  const baseContext = baseLayer.getContext("2d");

  let index = 0;
  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      const dotX = Math.min(width, column * gap + gap * 0.5);
      const dotY = Math.min(height, row * gap + gap * 0.5);
      const nx = dotX / Math.max(width, 1);
      const ny = dotY / Math.max(height, 1);
      const random = hash(column, row);
      const upperRibbon = Math.exp(-Math.abs(ny - (0.25 + Math.sin(nx * 7.4 + 0.8) * 0.075)) * 18);
      const lowerRibbon = Math.exp(-Math.abs(ny - (0.66 + Math.cos(nx * 5.2 - 0.6) * 0.1)) * 15);
      const focus = Math.exp(-((nx - 0.34) ** 2 / 0.075 + (ny - 0.43) ** 2 / 0.16));
      const dotAlpha = clamp(
        0.045 + upperRibbon * 0.09 + lowerRibbon * 0.06 + focus * 0.055,
        0.04,
        0.24,
      );

      baseX[index] = dotX;
      baseY[index] = dotY;
      x[index] = dotX;
      y[index] = dotY;
      alpha[index] = dotAlpha;
      seed[index] = random;
      index += 1;
    }
  }

  if (baseContext) {
    baseContext.setTransform(dpr, 0, 0, dpr, 0, 0);
    baseContext.clearRect(0, 0, width, height);
    for (let dot = 0; dot < count; dot += 1) {
      const size = seed[dot] > 0.82 ? 1.35 : 1;
      baseContext.fillStyle = `rgba(169, 193, 188, ${alpha[dot]})`;
      baseContext.fillRect(baseX[dot] - size * 0.5, baseY[dot] - size * 0.5, size, size);
    }
  }

  return {
    width,
    height,
    dpr,
    count,
    baseX,
    baseY,
    x,
    y,
    vx,
    vy,
    energy,
    alpha,
    seed,
    baseLayer,
  };
}

export function GlideField({ className = "", spacing = 11, radius = 132 }: GlideFieldProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    if (!root || !canvas) return;

    const context = canvas.getContext("2d", { alpha: true });
    if (!context) return;

    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } })
      .connection;
    const hasFinePointer = window.matchMedia("(any-pointer: fine)").matches;
    const staticMode = reducedMotion || !hasFinePointer || Boolean(connection?.saveData);
    const baseLayer = document.createElement("canvas");
    let field: FieldState = { ...EMPTY_FIELD, baseLayer };
    let bounds = root.getBoundingClientRect();
    let animationFrame = 0;
    let geometryFrame = 0;
    let visible = true;
    let lastFrameAt = 0;
    let lastPointerX = 0;
    let lastPointerY = 0;
    const pointer: PointerState = {
      clientX: bounds.left + bounds.width * 0.36,
      clientY: bounds.top + bounds.height * 0.42,
      x: bounds.width * 0.36,
      y: bounds.height * 0.42,
      targetX: bounds.width * 0.36,
      targetY: bounds.height * 0.42,
      velocityX: 0,
      velocityY: 0,
      active: false,
      lastInputAt: 0,
    };

    const updateBounds = () => {
      bounds = root.getBoundingClientRect();
    };

    const rebuild = () => {
      updateBounds();
      const width = Math.max(1, Math.round(bounds.width));
      const height = Math.max(1, Math.round(bounds.height));
      field = createField(canvas, width, height, spacing);
      pointer.x = width * 0.36;
      pointer.y = height * 0.42;
      pointer.targetX = pointer.x;
      pointer.targetY = pointer.y;
      pointer.clientX = bounds.left + pointer.x;
      pointer.clientY = bounds.top + pointer.y;
      lastPointerX = pointer.x;
      lastPointerY = pointer.y;
      drawStatic();
    };

    function drawStatic() {
      context.setTransform(field.dpr, 0, 0, field.dpr, 0, 0);
      context.clearRect(0, 0, field.width, field.height);
      context.drawImage(field.baseLayer, 0, 0, field.width, field.height);

      const glow = context.createRadialGradient(
        field.width * 0.34,
        field.height * 0.42,
        0,
        field.width * 0.34,
        field.height * 0.42,
        Math.min(field.width, field.height) * 0.28,
      );
      glow.addColorStop(0, "rgba(50, 211, 162, 0.12)");
      glow.addColorStop(0.5, "rgba(50, 211, 162, 0.035)");
      glow.addColorStop(1, "rgba(50, 211, 162, 0)");
      context.fillStyle = glow;
      context.fillRect(0, 0, field.width, field.height);
    }

    const render = (now: number) => {
      animationFrame = 0;
      if (!visible || document.hidden || field.width <= 1 || field.height <= 1) return;

      const recentlyActive = pointer.active || now - pointer.lastInputAt < 1250;
      if (!recentlyActive && now - lastFrameAt < 32) {
        animationFrame = window.requestAnimationFrame(render);
        return;
      }
      const elapsed = lastFrameAt ? clamp(now - lastFrameAt, 1, 50) : 1000 / 60;
      lastFrameAt = now;
      const frameScale = clamp(elapsed / (1000 / 60), 0.25, 3);
      const activeBlend = 1 - Math.pow(0.8, frameScale);
      const idleBlend = 1 - Math.pow(0.988, frameScale);
      const velocityBlend = 1 - Math.pow(0.78, frameScale);

      if (pointer.active) {
        pointer.x += (pointer.targetX - pointer.x) * activeBlend;
        pointer.y += (pointer.targetY - pointer.y) * activeBlend;
      } else {
        const idleX = field.width * (0.46 + Math.sin(now * 0.00021) * 0.2);
        const idleY = field.height * (0.48 + Math.cos(now * 0.00017) * 0.17);
        pointer.x += (idleX - pointer.x) * idleBlend;
        pointer.y += (idleY - pointer.y) * idleBlend;
      }

      const frameVelocityX = (pointer.x - lastPointerX) / frameScale;
      const frameVelocityY = (pointer.y - lastPointerY) / frameScale;
      lastPointerX = pointer.x;
      lastPointerY = pointer.y;
      pointer.velocityX += (frameVelocityX - pointer.velocityX) * velocityBlend;
      pointer.velocityY += (frameVelocityY - pointer.velocityY) * velocityBlend;
      pointer.velocityX = clamp(pointer.velocityX, -42, 42);
      pointer.velocityY = clamp(pointer.velocityY, -42, 42);

      context.setTransform(field.dpr, 0, 0, field.dpr, 0, 0);
      context.clearRect(0, 0, field.width, field.height);
      context.drawImage(field.baseLayer, 0, 0, field.width, field.height);

      const velocity = Math.hypot(pointer.velocityX, pointer.velocityY);
      const pointerStrength = pointer.active ? 1 : 0.12;
      const haloRadius = radius * (pointer.active ? 1.08 : 0.78);
      const halo = context.createRadialGradient(
        pointer.x,
        pointer.y,
        0,
        pointer.x,
        pointer.y,
        haloRadius,
      );
      halo.addColorStop(0, `rgba(50, 211, 162, ${pointer.active ? 0.11 : 0.035})`);
      halo.addColorStop(0.48, `rgba(50, 211, 162, ${pointer.active ? 0.036 : 0.012})`);
      halo.addColorStop(1, "rgba(50, 211, 162, 0)");
      context.fillStyle = halo;
      context.fillRect(
        pointer.x - haloRadius,
        pointer.y - haloRadius,
        haloRadius * 2,
        haloRadius * 2,
      );

      const mintPath = new Path2D();
      const coralPath = new Path2D();
      const bluePath = new Path2D();
      const radiusSquared = radius * radius;

      for (let dot = 0; dot < field.count; dot += 1) {
        const dx = field.x[dot] - pointer.x;
        const dy = field.y[dot] - pointer.y;
        const distanceSquared = dx * dx + dy * dy;
        let influence = 0;

        if (distanceSquared < radiusSquared) {
          const distance = Math.sqrt(distanceSquared) || 1;
          influence = (1 - distance / radius) ** 2 * pointerStrength;
          const normalX = dx / distance;
          const normalY = dy / distance;
          const speedFactor = Math.min(1.6, velocity / 11);
          field.vx[dot] +=
            (pointer.velocityX * 0.055 * influence +
              normalX * 0.22 * influence +
              -normalY * speedFactor * 0.11 * influence) *
            frameScale;
          field.vy[dot] +=
            (pointer.velocityY * 0.055 * influence +
              normalY * 0.22 * influence +
              normalX * speedFactor * 0.11 * influence) *
            frameScale;
        }

        field.vx[dot] += (field.baseX[dot] - field.x[dot]) * 0.035 * frameScale;
        field.vy[dot] += (field.baseY[dot] - field.y[dot]) * 0.035 * frameScale;
        const damping = Math.pow(0.86, frameScale);
        field.vx[dot] *= damping;
        field.vy[dot] *= damping;
        field.x[dot] += field.vx[dot] * frameScale;
        field.y[dot] += field.vy[dot] * frameScale;

        const offsetX = field.x[dot] - field.baseX[dot];
        const offsetY = field.y[dot] - field.baseY[dot];
        const offset = Math.hypot(offsetX, offsetY);
        if (offset > 18) {
          const scale = 18 / offset;
          field.x[dot] = field.baseX[dot] + offsetX * scale;
          field.y[dot] = field.baseY[dot] + offsetY * scale;
        }

        const targetEnergy = Math.min(1, influence * (0.55 + velocity * 0.12));
        const energyResponse = targetEnergy > field.energy[dot] ? 0.28 : 0.095;
        const energyBlend = 1 - Math.pow(1 - energyResponse, frameScale);
        field.energy[dot] += (targetEnergy - field.energy[dot]) * energyBlend;
        const energy = field.energy[dot];
        if (energy < 0.018) continue;

        const size = 1.15 + energy * 1.75;
        const left = field.x[dot] - size * 0.5;
        const top = field.y[dot] - size * 0.5;
        if (energy > 0.56 && field.seed[dot] > 0.43) {
          coralPath.rect(left, top, size, size);
        } else if (field.seed[dot] > 0.935) {
          bluePath.rect(left, top, size, size);
        } else {
          mintPath.rect(left, top, size, size);
        }
      }

      context.globalCompositeOperation = "lighter";
      context.fillStyle = "rgba(50, 211, 162, 0.82)";
      context.fill(mintPath);
      context.fillStyle = "rgba(112, 168, 255, 0.72)";
      context.fill(bluePath);
      context.shadowColor = "rgba(255, 146, 118, 0.42)";
      context.shadowBlur = recentlyActive ? 9 : 0;
      context.fillStyle = "rgba(255, 146, 118, 0.92)";
      context.fill(coralPath);
      context.shadowBlur = 0;
      context.globalCompositeOperation = "source-over";

      animationFrame = window.requestAnimationFrame(render);
    };

    const scheduleGeometry = () => {
      if (geometryFrame) return;
      geometryFrame = window.requestAnimationFrame(() => {
        geometryFrame = 0;
        updateBounds();
        if (pointer.active) {
          const localX = pointer.clientX - bounds.left;
          const localY = pointer.clientY - bounds.top;
          pointer.active =
            localX >= 0 && localX <= bounds.width && localY >= 0 && localY <= bounds.height;
          if (pointer.active) {
            pointer.targetX = localX;
            pointer.targetY = localY;
          }
        }
      });
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (staticMode || event.pointerType === "touch") return;
      const localX = event.clientX - bounds.left;
      const localY = event.clientY - bounds.top;
      const inside =
        localX >= 0 && localX <= bounds.width && localY >= 0 && localY <= bounds.height;
      pointer.active = inside;
      if (!inside) return;
      pointer.clientX = event.clientX;
      pointer.clientY = event.clientY;
      pointer.targetX = localX;
      pointer.targetY = localY;
      pointer.lastInputAt = performance.now();
      if (!animationFrame && visible && !document.hidden) {
        animationFrame = window.requestAnimationFrame(render);
      }
    };

    const handleVisibility = () => {
      if (!document.hidden && visible && !staticMode && !animationFrame) {
        animationFrame = window.requestAnimationFrame(render);
      }
    };

    const resizeObserver = new ResizeObserver(rebuild);
    resizeObserver.observe(root);

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible && !staticMode && !document.hidden && !animationFrame) {
          animationFrame = window.requestAnimationFrame(render);
        }
      },
      { rootMargin: "180px" },
    );
    intersectionObserver.observe(root);

    rebuild();
    if (!staticMode) {
      window.addEventListener("pointermove", handlePointerMove, { passive: true, capture: true });
      window.addEventListener("scroll", scheduleGeometry, { passive: true });
      document.addEventListener("visibilitychange", handleVisibility);
      animationFrame = window.requestAnimationFrame(render);
    }

    return () => {
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      window.removeEventListener("pointermove", handlePointerMove, true);
      window.removeEventListener("scroll", scheduleGeometry);
      document.removeEventListener("visibilitychange", handleVisibility);
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
      if (geometryFrame) window.cancelAnimationFrame(geometryFrame);
    };
  }, [radius, reducedMotion, spacing]);

  return (
    <div ref={rootRef} className={`glide-field ${className}`} aria-hidden="true">
      <canvas ref={canvasRef} className="glide-field__canvas" />
      <div className="glide-field__vignette" />
    </div>
  );
}
