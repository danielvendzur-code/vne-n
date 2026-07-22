import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import "./GlideField.css";

type GlideFieldProps = {
  className?: string;
  spacing?: number;
  radius?: number;
  intensity?: number;
};

type RGB = [number, number, number];

type Palette = {
  base: RGB;
  active: RGB;
  secondary: RGB;
  impact: RGB;
};

type ParticleField = {
  width: number;
  height: number;
  dpr: number;
  gap: number;
  columns: number;
  rows: number;
  count: number;
  baseX: Float32Array;
  baseY: Float32Array;
  x: Float32Array;
  y: Float32Array;
  vx: Float32Array;
  vy: Float32Array;
  energy: Float32Array;
  impactEnergy: Float32Array;
  alpha: Float32Array;
  seed: Float32Array;
  active: Uint8Array;
  activeIndices: number[];
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
};

type BurstState = {
  x: number;
  y: number;
  startedAt: number;
  lastRadius: number;
  touch: boolean;
};

const DEFAULT_PALETTE: Palette = {
  base: [247, 249, 252],
  active: [52, 120, 246],
  secondary: [52, 120, 246],
  impact: [52, 120, 246],
};

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

function hash(x: number, y: number) {
  const value = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return value - Math.floor(value);
}

function parseRgb(value: string, fallback: RGB): RGB {
  const channels = value
    .trim()
    .replaceAll(",", " ")
    .split(/\s+/)
    .map(Number)
    .filter(Number.isFinite);

  if (channels.length < 3) return fallback;
  return [
    Math.round(clamp(channels[0], 0, 255)),
    Math.round(clamp(channels[1], 0, 255)),
    Math.round(clamp(channels[2], 0, 255)),
  ];
}

function readPalette(root: HTMLElement): Palette {
  const style = window.getComputedStyle(root);
  return {
    base: parseRgb(style.getPropertyValue("--glide-base"), DEFAULT_PALETTE.base),
    active: parseRgb(style.getPropertyValue("--glide-active"), DEFAULT_PALETTE.active),
    secondary: parseRgb(style.getPropertyValue("--glide-secondary"), DEFAULT_PALETTE.secondary),
    impact: parseRgb(style.getPropertyValue("--glide-impact"), DEFAULT_PALETTE.impact),
  };
}

function rgba(color: RGB, alpha: number) {
  return `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${clamp(alpha, 0, 1)})`;
}

function createField({
  canvas,
  width,
  height,
  dpr,
  requestedSpacing,
  maxParticles,
  intensity,
  palette,
  coarse,
}: {
  canvas: HTMLCanvasElement;
  width: number;
  height: number;
  dpr: number;
  requestedSpacing: number;
  maxParticles: number;
  intensity: number;
  palette: Palette;
  coarse: boolean;
}): ParticleField {
  const requestedGap = coarse ? Math.max(15, requestedSpacing + 3) : requestedSpacing;
  const adaptiveGap = Math.sqrt((width * height) / maxParticles);
  const gap = Math.max(requestedGap, adaptiveGap);
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
  const impactEnergy = new Float32Array(count);
  const alpha = new Float32Array(count);
  const seed = new Float32Array(count);
  const active = new Uint8Array(count);
  const activeIndices: number[] = [];

  canvas.width = Math.max(1, Math.round(width * dpr));
  canvas.height = Math.max(1, Math.round(height * dpr));
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;

  const baseLayer = document.createElement("canvas");
  baseLayer.width = canvas.width;
  baseLayer.height = canvas.height;
  const baseContext = baseLayer.getContext("2d", { alpha: true });
  const strength = clamp(intensity, 0, 1.25);

  let index = 0;
  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      const dotX = column * gap + gap * 0.5;
      const dotY = row * gap + gap * 0.5;
      const nx = dotX / Math.max(width, 1);
      const ny = dotY / Math.max(height, 1);
      const random = hash(column, row);
      const upperContour = Math.exp(-Math.abs(ny - (0.22 + Math.sin(nx * 7.1 + 0.5) * 0.07)) * 20);
      const lowerContour = Math.exp(-Math.abs(ny - (0.69 + Math.cos(nx * 5.4 - 0.7) * 0.095)) * 17);
      const diagonalContour = Math.exp(
        -Math.abs(ny - (0.88 - nx * 0.46 + Math.sin(nx * 10.2) * 0.025)) * 24,
      );
      const rightIsland = Math.exp(-((nx - 0.78) ** 2 / 0.052 + (ny - 0.36) ** 2 / 0.12));
      const centerIsland = Math.exp(-((nx - 0.42) ** 2 / 0.082 + (ny - 0.52) ** 2 / 0.17));
      const texture = 0.46 + random * 0.54;
      const dotAlpha =
        clamp(
          0.014 +
            (upperContour * 0.12 +
              lowerContour * 0.082 +
              diagonalContour * 0.065 +
              rightIsland * 0.085 +
              centerIsland * 0.045) *
              texture,
          0.012,
          0.22,
        ) * strength;

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
    for (let particle = 0; particle < count; particle += 1) {
      const size = seed[particle] > 0.88 ? 1.25 : 0.9;
      baseContext.fillStyle = rgba(palette.base, alpha[particle]);
      baseContext.fillRect(baseX[particle] - size * 0.5, baseY[particle] - size * 0.5, size, size);
    }
  }

  return {
    width,
    height,
    dpr,
    gap,
    columns,
    rows,
    count,
    baseX,
    baseY,
    x,
    y,
    vx,
    vy,
    energy,
    impactEnergy,
    alpha,
    seed,
    active,
    activeIndices,
    baseLayer,
  };
}

function activateParticle(field: ParticleField, index: number) {
  if (field.active[index]) return;
  field.active[index] = 1;
  field.activeIndices.push(index);
}

function visitParticleArea(
  field: ParticleField,
  centerX: number,
  centerY: number,
  areaRadius: number,
  callback: (index: number, dx: number, dy: number, distance: number) => void,
) {
  const minColumn = clamp(Math.floor((centerX - areaRadius) / field.gap), 0, field.columns - 1);
  const maxColumn = clamp(Math.ceil((centerX + areaRadius) / field.gap), 0, field.columns - 1);
  const minRow = clamp(Math.floor((centerY - areaRadius) / field.gap), 0, field.rows - 1);
  const maxRow = clamp(Math.ceil((centerY + areaRadius) / field.gap), 0, field.rows - 1);
  const radiusSquared = areaRadius * areaRadius;

  for (let row = minRow; row <= maxRow; row += 1) {
    for (let column = minColumn; column <= maxColumn; column += 1) {
      const index = row * field.columns + column;
      const dx = field.x[index] - centerX;
      const dy = field.y[index] - centerY;
      const distanceSquared = dx * dx + dy * dy;
      if (distanceSquared > radiusSquared) continue;
      callback(index, dx, dy, Math.sqrt(distanceSquared));
    }
  }
}

export function GlideField({
  className = "",
  spacing = 12,
  radius = 146,
  intensity = 1,
}: GlideFieldProps) {
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
    const coarse =
      window.matchMedia("(pointer: coarse)").matches &&
      !window.matchMedia("(any-pointer: fine)").matches;
    const hasFinePointer = window.matchMedia("(any-pointer: fine)").matches;
    const motionDisabled = reducedMotion || Boolean(connection?.saveData);
    const pointerMotionEnabled = !motionDisabled && hasFinePointer;
    const burstEnabled = !motionDisabled;
    const isAmbient = className.includes("glide-field--ambient");
    const maxParticles = isAmbient ? (coarse ? 2600 : 6500) : coarse ? 4600 : 11000;
    const palette = readPalette(root);

    let bounds = root.getBoundingClientRect();
    let field: ParticleField | null = null;
    let animationFrame = 0;
    let geometryFrame = 0;
    let resizeFrame = 0;
    let lastFrameAt = 0;
    let visible = true;
    const bursts: BurstState[] = [];
    const pointer: PointerState = {
      clientX: bounds.left + bounds.width * 0.72,
      clientY: bounds.top + bounds.height * 0.44,
      x: bounds.width * 0.72,
      y: bounds.height * 0.44,
      targetX: bounds.width * 0.72,
      targetY: bounds.height * 0.44,
      velocityX: 0,
      velocityY: 0,
      active: false,
    };

    const updateBounds = () => {
      bounds = root.getBoundingClientRect();
    };

    function resetCanvas() {
      if (!field) return;
      context.setTransform(1, 0, 0, 1, 0, 0);
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.setTransform(field.dpr, 0, 0, field.dpr, 0, 0);
      context.drawImage(field.baseLayer, 0, 0, field.width, field.height);
    }

    function drawStatic() {
      resetCanvas();
    }

    const prepareField = () => {
      updateBounds();
      const width = Math.max(1, Math.round(bounds.width));
      const height = Math.max(1, Math.round(bounds.height));
      const rawDpr = Math.min(window.devicePixelRatio || 1, coarse ? 1.1 : 1.35);
      const pixelBudget = Math.sqrt(2_800_000 / Math.max(1, width * height));
      const dpr = clamp(Math.min(rawDpr, pixelBudget), 0.68, rawDpr);

      field = createField({
        canvas,
        width,
        height,
        dpr,
        requestedSpacing: spacing,
        maxParticles,
        intensity,
        palette,
        coarse,
      });
      pointer.x = width * 0.72;
      pointer.y = height * 0.44;
      pointer.targetX = pointer.x;
      pointer.targetY = pointer.y;
      pointer.clientX = bounds.left + pointer.x;
      pointer.clientY = bounds.top + pointer.y;
      pointer.velocityX = 0;
      pointer.velocityY = 0;
      pointer.active = false;
      bursts.length = 0;
      lastFrameAt = 0;
      drawStatic();
    };

    const ensureRender = () => {
      if (!animationFrame && visible && !document.hidden) {
        animationFrame = window.requestAnimationFrame(render);
      }
    };

    function applyPointerMotion(current: ParticleField, travel: number) {
      const speed = Math.min(1500, Math.hypot(pointer.velocityX, pointer.velocityY));
      const travelStrength = clamp(travel / 8, 0.08, 1);

      visitParticleArea(current, pointer.x, pointer.y, radius, (index, dx, dy, distance) => {
        const safeDistance = distance || 1;
        const influence = (1 - safeDistance / radius) ** 2 * travelStrength;
        if (influence <= 0.001) return;
        const normalX = dx / safeDistance;
        const normalY = dy / safeDistance;
        const directionalPush = 0.115 * influence;
        const radialPush = (68 + speed * 0.038) * influence;
        const shearPush = speed * 0.032 * influence;

        activateParticle(current, index);
        current.vx[index] +=
          pointer.velocityX * directionalPush + normalX * radialPush - normalY * shearPush;
        current.vy[index] +=
          pointer.velocityY * directionalPush + normalY * radialPush + normalX * shearPush;
        current.energy[index] = Math.max(
          current.energy[index],
          influence * (0.52 + Math.min(0.48, speed / 2200)),
        );
      });
    }

    function applyBurstWaves(current: ParticleField, now: number) {
      for (let burstIndex = bursts.length - 1; burstIndex >= 0; burstIndex -= 1) {
        const burst = bursts[burstIndex];
        const duration = burst.touch || coarse ? 620 : 820;
        const age = clamp((now - burst.startedAt) / duration, 0, 1);
        if (age >= 1) {
          bursts.splice(burstIndex, 1);
          continue;
        }

        const eased = 1 - (1 - age) ** 3;
        const maximumRadius = burst.touch || coarse ? 112 : Math.min(226, radius * 1.55);
        const waveRadius = 7 + eased * maximumRadius;
        const previousRadius = burst.lastRadius;
        const band = Math.max(current.gap * 1.8, waveRadius - previousRadius + current.gap);
        const searchRadius = waveRadius + current.gap * 1.2;

        visitParticleArea(current, burst.x, burst.y, searchRadius, (index, dx, dy, distance) => {
          if (distance < Math.max(0, previousRadius - current.gap) || distance > searchRadius) {
            return;
          }
          const safeDistance = distance || 1;
          const wave = clamp(1 - Math.abs(distance - waveRadius) / band, 0.18, 1);
          const fade = 1 - age * 0.38;
          const force =
            (burst.touch || coarse ? 126 : 184) * (0.68 + current.seed[index] * 0.42) * wave * fade;

          activateParticle(current, index);
          current.vx[index] += (dx / safeDistance) * force;
          current.vy[index] += (dy / safeDistance) * force;
          current.energy[index] = Math.max(current.energy[index], wave * 0.88);
          current.impactEnergy[index] = Math.max(current.impactEnergy[index], wave * fade);
        });
        burst.lastRadius = waveRadius;
      }
    }

    function updateParticles(current: ParticleField, delta: number) {
      const damping = Math.exp(-8.2 * delta);
      const energyDecay = Math.exp(-4.5 * delta);
      const impactDecay = Math.exp(-6.2 * delta);

      for (let activeIndex = current.activeIndices.length - 1; activeIndex >= 0; activeIndex -= 1) {
        const index = current.activeIndices[activeIndex];
        current.vx[index] += (current.baseX[index] - current.x[index]) * 52 * delta;
        current.vy[index] += (current.baseY[index] - current.y[index]) * 52 * delta;
        current.vx[index] *= damping;
        current.vy[index] *= damping;
        current.x[index] += current.vx[index] * delta;
        current.y[index] += current.vy[index] * delta;
        current.energy[index] *= energyDecay;
        current.impactEnergy[index] *= impactDecay;

        const offsetX = current.x[index] - current.baseX[index];
        const offsetY = current.y[index] - current.baseY[index];
        const offset = Math.hypot(offsetX, offsetY);
        if (offset > 22) {
          const scale = 22 / offset;
          current.x[index] = current.baseX[index] + offsetX * scale;
          current.y[index] = current.baseY[index] + offsetY * scale;
          current.vx[index] *= 0.72;
          current.vy[index] *= 0.72;
        }

        const speed = Math.hypot(current.vx[index], current.vy[index]);
        if (
          offset < 0.07 &&
          speed < 0.58 &&
          current.energy[index] < 0.014 &&
          current.impactEnergy[index] < 0.014
        ) {
          current.x[index] = current.baseX[index];
          current.y[index] = current.baseY[index];
          current.vx[index] = 0;
          current.vy[index] = 0;
          current.energy[index] = 0;
          current.impactEnergy[index] = 0;
          current.active[index] = 0;
          const finalIndex = current.activeIndices.pop();
          if (activeIndex < current.activeIndices.length && finalIndex !== undefined) {
            current.activeIndices[activeIndex] = finalIndex;
          }
        }
      }
    }

    function drawParticles(current: ParticleField) {
      const activePath = new Path2D();
      const secondaryPath = new Path2D();
      const impactPath = new Path2D();
      const streakPath = new Path2D();

      for (const index of current.activeIndices) {
        context.clearRect(current.baseX[index] - 2.2, current.baseY[index] - 2.2, 4.4, 4.4);

        const offset = Math.hypot(
          current.x[index] - current.baseX[index],
          current.y[index] - current.baseY[index],
        );
        const energy = clamp(current.energy[index] + offset / 24, 0, 1);
        const size = 1.15 + energy * 1.65;
        const targetPath =
          current.impactEnergy[index] > 0.17
            ? impactPath
            : current.seed[index] > 0.9
              ? secondaryPath
              : activePath;
        targetPath.rect(current.x[index] - size * 0.5, current.y[index] - size * 0.5, size, size);

        const speed = Math.hypot(current.vx[index], current.vy[index]);
        if (speed > 48 && energy > 0.32) {
          const streakScale = Math.min(0.022, 8 / speed);
          streakPath.moveTo(current.x[index], current.y[index]);
          streakPath.lineTo(
            current.x[index] - current.vx[index] * streakScale,
            current.y[index] - current.vy[index] * streakScale,
          );
        }
      }

      const strength = clamp(intensity, 0, 1.2);
      context.save();
      context.globalCompositeOperation = "screen";
      context.fillStyle = rgba(palette.active, 0.82 * strength);
      context.fill(activePath);
      context.fillStyle = rgba(palette.secondary, 0.78 * strength);
      context.fill(secondaryPath);
      context.fillStyle = rgba(palette.impact, 0.9 * strength);
      context.fill(impactPath);
      context.lineCap = "round";
      context.lineWidth = 0.72;
      context.strokeStyle = rgba(palette.active, 0.26 * strength);
      context.stroke(streakPath);
      context.restore();
    }

    function drawBurstRings(now: number) {
      const strength = clamp(intensity, 0, 1.15);
      for (const burst of bursts) {
        const duration = burst.touch || coarse ? 620 : 820;
        const age = clamp((now - burst.startedAt) / duration, 0, 1);
        const fade = (1 - age) ** 1.7;
        context.save();
        context.globalCompositeOperation = "screen";
        context.beginPath();
        context.arc(burst.x, burst.y, burst.lastRadius, 0, Math.PI * 2);
        context.lineWidth = 0.9;
        context.strokeStyle = rgba(palette.impact, fade * 0.3 * strength);
        context.stroke();
        context.restore();
      }
    }

    function render(now: number) {
      animationFrame = 0;
      if (!visible || document.hidden || !field || field.width <= 1 || field.height <= 1) return;

      const current = field;
      const delta = lastFrameAt ? clamp((now - lastFrameAt) / 1000, 1 / 120, 1 / 20) : 1 / 60;
      lastFrameAt = now;
      const oldX = pointer.x;
      const oldY = pointer.y;
      const follow = 1 - Math.exp(-15 * delta);
      pointer.x += (pointer.targetX - pointer.x) * follow;
      pointer.y += (pointer.targetY - pointer.y) * follow;
      const travel = Math.hypot(pointer.x - oldX, pointer.y - oldY);
      const rawVelocityX = (pointer.x - oldX) / delta;
      const rawVelocityY = (pointer.y - oldY) / delta;
      const velocityBlend = 1 - Math.exp(-12 * delta);
      pointer.velocityX += (rawVelocityX - pointer.velocityX) * velocityBlend;
      pointer.velocityY += (rawVelocityY - pointer.velocityY) * velocityBlend;

      if (pointer.active && travel > 0.035) applyPointerMotion(current, travel);
      applyBurstWaves(current, now);
      updateParticles(current, delta);
      resetCanvas();
      drawParticles(current);
      drawBurstRings(now);

      const pointerSettled =
        !pointer.active ||
        (Math.abs(pointer.targetX - pointer.x) < 0.16 &&
          Math.abs(pointer.targetY - pointer.y) < 0.16);
      const shouldContinue =
        !pointerSettled || current.activeIndices.length > 0 || bursts.length > 0;

      if (shouldContinue) {
        animationFrame = window.requestAnimationFrame(render);
      } else {
        pointer.velocityX = 0;
        pointer.velocityY = 0;
        lastFrameAt = 0;
      }
    }

    const resetDynamics = () => {
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
      animationFrame = 0;
      lastFrameAt = 0;
      bursts.length = 0;
      pointer.active = false;
      pointer.velocityX = 0;
      pointer.velocityY = 0;
      if (field) {
        for (const index of field.activeIndices) {
          field.x[index] = field.baseX[index];
          field.y[index] = field.baseY[index];
          field.vx[index] = 0;
          field.vy[index] = 0;
          field.energy[index] = 0;
          field.impactEnergy[index] = 0;
          field.active[index] = 0;
        }
        field.activeIndices.length = 0;
        drawStatic();
      }
    };

    const scheduleGeometry = () => {
      if (geometryFrame) return;
      geometryFrame = window.requestAnimationFrame(() => {
        geometryFrame = 0;
        updateBounds();
        if (!pointer.active) return;
        const localX = pointer.clientX - bounds.left;
        const localY = pointer.clientY - bounds.top;
        const inside =
          localX >= 0 && localX <= bounds.width && localY >= 0 && localY <= bounds.height;
        pointer.active = inside;
        if (inside) {
          pointer.targetX = localX;
          pointer.targetY = localY;
        }
        ensureRender();
      });
    };

    const scheduleResize = () => {
      if (resizeFrame) window.cancelAnimationFrame(resizeFrame);
      resizeFrame = window.requestAnimationFrame(() => {
        resizeFrame = 0;
        prepareField();
      });
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (!pointerMotionEnabled || event.pointerType === "touch") return;
      const localX = event.clientX - bounds.left;
      const localY = event.clientY - bounds.top;
      const inside =
        localX >= 0 && localX <= bounds.width && localY >= 0 && localY <= bounds.height;

      if (!inside) {
        if (pointer.active) {
          pointer.active = false;
          ensureRender();
        }
        return;
      }

      pointer.active = true;
      pointer.clientX = event.clientX;
      pointer.clientY = event.clientY;
      pointer.targetX = localX;
      pointer.targetY = localY;
      ensureRender();
    };

    const releasePointer = () => {
      if (!pointer.active) return;
      pointer.active = false;
      ensureRender();
    };

    const handleWindowMouseOut = (event: MouseEvent) => {
      if (!event.relatedTarget) releasePointer();
    };

    const handlePointerDown = (event: PointerEvent) => {
      if (!burstEnabled || !event.isPrimary || event.button !== 0) return;
      const localX = event.clientX - bounds.left;
      const localY = event.clientY - bounds.top;
      const inside =
        localX >= 0 && localX <= bounds.width && localY >= 0 && localY <= bounds.height;
      if (!inside) return;

      const touch = event.pointerType === "touch";
      const now = performance.now();
      pointer.clientX = event.clientX;
      pointer.clientY = event.clientY;
      pointer.targetX = localX;
      pointer.targetY = localY;
      if (pointerMotionEnabled && !touch) pointer.active = true;
      bursts.push({ x: localX, y: localY, startedAt: now, lastRadius: 0, touch });
      const burstLimit = coarse || touch ? 1 : 2;
      while (bursts.length > burstLimit) bursts.shift();
      ensureRender();
    };

    const handleVisibility = () => {
      if (document.hidden) {
        resetDynamics();
      } else if (visible) {
        updateBounds();
        drawStatic();
      }
    };

    const resizeObserver = new ResizeObserver(scheduleResize);
    resizeObserver.observe(root);
    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (!visible) {
          resetDynamics();
        } else {
          updateBounds();
          drawStatic();
        }
      },
      { rootMargin: "180px" },
    );
    intersectionObserver.observe(root);

    prepareField();
    if (pointerMotionEnabled) {
      window.addEventListener("pointermove", handlePointerMove, { passive: true, capture: true });
      window.addEventListener("mouseout", handleWindowMouseOut, { passive: true });
      window.addEventListener("blur", releasePointer);
    }
    if (burstEnabled) {
      window.addEventListener("pointerdown", handlePointerDown, { passive: true, capture: true });
    }
    if (pointerMotionEnabled || burstEnabled) {
      window.addEventListener("scroll", scheduleGeometry, { passive: true });
      document.addEventListener("visibilitychange", handleVisibility);
    }

    return () => {
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      window.removeEventListener("pointermove", handlePointerMove, true);
      window.removeEventListener("pointerdown", handlePointerDown, true);
      window.removeEventListener("mouseout", handleWindowMouseOut);
      window.removeEventListener("blur", releasePointer);
      window.removeEventListener("scroll", scheduleGeometry);
      document.removeEventListener("visibilitychange", handleVisibility);
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
      if (geometryFrame) window.cancelAnimationFrame(geometryFrame);
      if (resizeFrame) window.cancelAnimationFrame(resizeFrame);
    };
  }, [className, intensity, radius, reducedMotion, spacing]);

  return (
    <div ref={rootRef} className={`glide-field ${className}`} aria-hidden="true">
      <canvas ref={canvasRef} className="glide-field__canvas" />
      <div className="glide-field__vignette" />
    </div>
  );
}
