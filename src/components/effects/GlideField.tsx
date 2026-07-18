import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import "./GlideField.css";

type GlideFieldProps = {
  className?: string;
  radius?: number;
  intensity?: number;
};

type SurfaceState = {
  width: number;
  height: number;
  dpr: number;
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
  angle: number;
  opacity: number;
  targetOpacity: number;
  controlMix: number;
  controlTarget: number;
  active: boolean;
  lastInputAt: number;
};

type TrailPoint = {
  x: number;
  y: number;
  time: number;
};

type RippleState = {
  x: number;
  y: number;
  startedAt: number;
  seed: number;
  touch: boolean;
};

type Point = { x: number; y: number };

const EDGE_POINTS = 8;
const TRAIL_LIFETIME = 620;
const CONTROL_SELECTOR =
  ".lp-button, .lp-assistant-cta, .lp-assistant-chips button, .lp-switch button";

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

function hash(x: number, y: number) {
  const value = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return value - Math.floor(value);
}

function appendSmoothLine(path: Path2D, points: Point[], move = true) {
  if (!points.length) return;
  if (move) path.moveTo(points[0].x, points[0].y);
  else path.lineTo(points[0].x, points[0].y);
  if (points.length === 1) return;

  for (let index = 1; index < points.length - 1; index += 1) {
    const current = points[index];
    const next = points[index + 1];
    path.quadraticCurveTo(
      current.x,
      current.y,
      (current.x + next.x) * 0.5,
      (current.y + next.y) * 0.5,
    );
  }

  const last = points[points.length - 1];
  path.lineTo(last.x, last.y);
}

function createClosedSmoothPath(points: Point[]) {
  const path = new Path2D();
  if (points.length < 3) return path;

  const first = points[0];
  const last = points[points.length - 1];
  path.moveTo((last.x + first.x) * 0.5, (last.y + first.y) * 0.5);
  for (let index = 0; index < points.length; index += 1) {
    const current = points[index];
    const next = points[(index + 1) % points.length];
    path.quadraticCurveTo(
      current.x,
      current.y,
      (current.x + next.x) * 0.5,
      (current.y + next.y) * 0.5,
    );
  }
  path.closePath();
  return path;
}

function createOrganicRingPath(
  centerX: number,
  centerY: number,
  radius: number,
  yScale: number,
  seed: number,
  phase: number,
) {
  const points: Point[] = [];
  const rotation = seed * Math.PI * 0.7;
  for (let index = 0; index < 12; index += 1) {
    const angle = (index / 12) * Math.PI * 2;
    const wobble = 1 + Math.sin(angle * 3 + seed * 8.7 + phase * 2.4) * 0.025;
    const localX = Math.cos(angle) * radius * wobble;
    const localY = Math.sin(angle) * radius * yScale * (2 - wobble);
    points.push({
      x: centerX + localX * Math.cos(rotation) - localY * Math.sin(rotation),
      y: centerY + localX * Math.sin(rotation) + localY * Math.cos(rotation),
    });
  }
  return createClosedSmoothPath(points);
}

function drawBaseLayer(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  dpr: number,
  intensity: number,
) {
  context.setTransform(1, 0, 0, 1, 0, 0);
  context.clearRect(0, 0, Math.ceil(width * dpr), Math.ceil(height * dpr));
  context.setTransform(dpr, 0, 0, dpr, 0, 0);

  const mintGlow = context.createRadialGradient(
    width * 0.32,
    height * 0.42,
    0,
    width * 0.32,
    height * 0.42,
    Math.max(width, height) * 0.58,
  );
  mintGlow.addColorStop(0, `rgba(50, 211, 162, ${0.1 * intensity})`);
  mintGlow.addColorStop(0.48, `rgba(50, 211, 162, ${0.026 * intensity})`);
  mintGlow.addColorStop(1, "rgba(50, 211, 162, 0)");
  context.fillStyle = mintGlow;
  context.fillRect(0, 0, width, height);

  const blueGlow = context.createRadialGradient(
    width * 0.82,
    height * 0.7,
    0,
    width * 0.82,
    height * 0.7,
    Math.max(width, height) * 0.46,
  );
  blueGlow.addColorStop(0, `rgba(112, 168, 255, ${0.055 * intensity})`);
  blueGlow.addColorStop(1, "rgba(112, 168, 255, 0)");
  context.fillStyle = blueGlow;
  context.fillRect(0, 0, width, height);

  context.save();
  context.globalCompositeOperation = "screen";
  for (let ribbon = 0; ribbon < 6; ribbon += 1) {
    const progress = ribbon / 5;
    const y = height * (0.14 + progress * 0.72);
    const phase = ribbon * 0.82;
    const path = new Path2D();
    path.moveTo(-width * 0.08, y);
    path.bezierCurveTo(
      width * 0.18,
      y + Math.sin(phase + 0.4) * height * 0.1,
      width * 0.38,
      y + Math.cos(phase + 0.9) * height * 0.08,
      width * 0.58,
      y + Math.sin(phase + 1.5) * height * 0.085,
    );
    path.bezierCurveTo(
      width * 0.76,
      y + Math.cos(phase + 2.1) * height * 0.07,
      width * 0.94,
      y + Math.sin(phase + 2.8) * height * 0.09,
      width * 1.08,
      y + Math.cos(phase + 3.2) * height * 0.055,
    );

    context.lineCap = "round";
    context.lineWidth = (54 + ribbon * 8) * Math.min(1.25, width / 1100 + 0.45);
    context.strokeStyle =
      ribbon % 2 === 0
        ? `rgba(50, 211, 162, ${0.014 * intensity})`
        : `rgba(112, 168, 255, ${0.012 * intensity})`;
    context.stroke(path);

    context.lineWidth = 1 + (ribbon % 3) * 0.35;
    context.strokeStyle =
      ribbon % 2 === 0
        ? `rgba(244, 251, 248, ${0.045 * intensity})`
        : `rgba(112, 168, 255, ${0.042 * intensity})`;
    context.stroke(path);
  }
  context.restore();
}

export function GlideField({ className = "", radius = 140, intensity = 1 }: GlideFieldProps) {
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
    const baseLayer = document.createElement("canvas");
    let surface: SurfaceState = { width: 1, height: 1, dpr: 1, baseLayer };
    let bounds = root.getBoundingClientRect();
    let animationFrame = 0;
    let geometryFrame = 0;
    let lastFrameAt = 0;
    let visible = true;
    const trail: TrailPoint[] = [];
    const ripples: RippleState[] = [];
    const edgeOffset = new Float32Array(EDGE_POINTS);
    const edgeVelocity = new Float32Array(EDGE_POINTS);
    const pointer: PointerState = {
      clientX: bounds.left + bounds.width * 0.7,
      clientY: bounds.top + bounds.height * 0.46,
      x: bounds.width * 0.7,
      y: bounds.height * 0.46,
      targetX: bounds.width * 0.7,
      targetY: bounds.height * 0.46,
      velocityX: 0,
      velocityY: 0,
      angle: 0,
      opacity: 0,
      targetOpacity: 0,
      controlMix: 0,
      controlTarget: 0,
      active: false,
      lastInputAt: 0,
    };

    const updateBounds = () => {
      bounds = root.getBoundingClientRect();
    };

    const prepareSurface = () => {
      updateBounds();
      const width = Math.max(1, Math.round(bounds.width));
      const height = Math.max(1, Math.round(bounds.height));
      const rawDpr = Math.min(window.devicePixelRatio || 1, coarse ? 1.1 : 1.35);
      const pixelBudget = Math.sqrt(2_800_000 / Math.max(1, width * height));
      const dpr = clamp(Math.min(rawDpr, pixelBudget), 0.68, rawDpr);

      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      baseLayer.width = canvas.width;
      baseLayer.height = canvas.height;
      surface = { width, height, dpr, baseLayer };

      const baseContext = baseLayer.getContext("2d", { alpha: true });
      if (baseContext) drawBaseLayer(baseContext, width, height, dpr, intensity);

      pointer.x = width * 0.7;
      pointer.y = height * 0.46;
      pointer.targetX = pointer.x;
      pointer.targetY = pointer.y;
      pointer.clientX = bounds.left + pointer.x;
      pointer.clientY = bounds.top + pointer.y;
      pointer.opacity = 0;
      pointer.targetOpacity = 0;
      pointer.velocityX = 0;
      pointer.velocityY = 0;
      trail.length = 0;
      ripples.length = 0;
      edgeOffset.fill(0);
      edgeVelocity.fill(0);
      drawStatic();
    };

    function resetCanvas() {
      context.setTransform(1, 0, 0, 1, 0, 0);
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.setTransform(surface.dpr, 0, 0, surface.dpr, 0, 0);
      context.drawImage(surface.baseLayer, 0, 0, surface.width, surface.height);
    }

    function drawStatic() {
      resetCanvas();
    }

    function createLensPath(speedFactor: number) {
      const controlScale = 1 - pointer.controlMix * 0.18;
      const rx = radius * controlScale * (1 + speedFactor * 0.16);
      const ry = radius * controlScale * (0.76 - speedFactor * 0.055);
      const cos = Math.cos(pointer.angle);
      const sin = Math.sin(pointer.angle);
      const points: Point[] = [];

      for (let index = 0; index < EDGE_POINTS; index += 1) {
        const angle = (index / EDGE_POINTS) * Math.PI * 2;
        const localX = Math.cos(angle) * (rx + edgeOffset[index]);
        const localY = Math.sin(angle) * (ry + edgeOffset[index] * 0.64);
        points.push({
          x: pointer.x + localX * cos - localY * sin,
          y: pointer.y + localX * sin + localY * cos,
        });
      }

      return { path: createClosedSmoothPath(points), rx, ry };
    }

    function drawTrail(now: number) {
      while (trail.length && now - trail[0].time > TRAIL_LIFETIME) trail.shift();
      const maxPoints = pointer.controlMix > 0.55 ? 7 : 14;
      const liveTrail = trail.slice(-maxPoints);
      if (liveTrail.length < 2) return;

      const left: Point[] = [];
      const right: Point[] = [];
      const centers: Point[] = [];
      for (let index = 0; index < liveTrail.length; index += 1) {
        const point = liveTrail[index];
        const previous = liveTrail[Math.max(0, index - 1)];
        const next = liveTrail[Math.min(liveTrail.length - 1, index + 1)];
        const tangentX = next.x - previous.x;
        const tangentY = next.y - previous.y;
        const length = Math.hypot(tangentX, tangentY) || 1;
        const age = clamp((now - point.time) / TRAIL_LIFETIME, 0, 1);
        const width = radius * 0.2 * (1 - age) ** 1.65;
        const normalX = -tangentY / length;
        const normalY = tangentX / length;
        left.push({ x: point.x + normalX * width, y: point.y + normalY * width });
        right.push({ x: point.x - normalX * width, y: point.y - normalY * width });
        centers.push({ x: point.x, y: point.y });
      }

      const ribbon = new Path2D();
      appendSmoothLine(ribbon, left);
      appendSmoothLine(ribbon, right.reverse(), false);
      ribbon.closePath();
      const oldest = liveTrail[0];
      const newest = liveTrail[liveTrail.length - 1];
      const body = context.createLinearGradient(oldest.x, oldest.y, newest.x, newest.y);
      body.addColorStop(0, "rgba(112, 168, 255, 0)");
      body.addColorStop(0.48, `rgba(112, 168, 255, ${0.024 * intensity})`);
      body.addColorStop(1, `rgba(50, 211, 162, ${0.052 * intensity})`);

      context.save();
      context.globalCompositeOperation = "screen";
      context.fillStyle = body;
      context.fill(ribbon);

      const ridge = new Path2D();
      appendSmoothLine(ridge, centers);
      const highlight = context.createLinearGradient(oldest.x, oldest.y, newest.x, newest.y);
      highlight.addColorStop(0, "rgba(244, 251, 248, 0)");
      highlight.addColorStop(1, `rgba(244, 251, 248, ${0.095 * intensity})`);
      context.lineWidth = 1.1;
      context.lineCap = "round";
      context.strokeStyle = highlight;
      context.stroke(ridge);
      context.restore();
    }

    function drawLens(speedFactor: number) {
      if (pointer.opacity < 0.012) return;
      const { path, rx, ry } = createLensPath(speedFactor);
      const opacity = pointer.opacity * intensity;
      const refractionScale = 1.018 + speedFactor * 0.018;
      const shiftX = clamp(-pointer.velocityX * 0.0032, -7, 7);
      const shiftY = clamp(-pointer.velocityY * 0.0032, -7, 7);

      context.save();
      context.globalAlpha = opacity * 0.88;
      context.clip(path);
      context.translate(pointer.x + shiftX, pointer.y + shiftY);
      context.scale(refractionScale, refractionScale);
      context.translate(-pointer.x, -pointer.y);
      context.drawImage(surface.baseLayer, 0, 0, surface.width, surface.height);
      context.restore();

      context.save();
      context.clip(path);
      context.globalCompositeOperation = "screen";
      const glass = context.createRadialGradient(
        pointer.x - rx * 0.28,
        pointer.y - ry * 0.3,
        0,
        pointer.x,
        pointer.y,
        rx * 1.18,
      );
      const controlBoost = 1 + pointer.controlMix * 0.42;
      glass.addColorStop(0, `rgba(244, 251, 248, ${0.092 * opacity * controlBoost})`);
      glass.addColorStop(0.22, `rgba(50, 211, 162, ${0.078 * opacity * controlBoost})`);
      glass.addColorStop(0.58, `rgba(50, 211, 162, ${0.026 * opacity})`);
      glass.addColorStop(0.8, `rgba(112, 168, 255, ${0.042 * opacity})`);
      glass.addColorStop(1, "rgba(112, 168, 255, 0)");
      context.fillStyle = glass;
      context.fillRect(pointer.x - rx * 1.3, pointer.y - ry * 1.5, rx * 2.6, ry * 3);
      context.restore();

      const rim = context.createLinearGradient(
        pointer.x - rx,
        pointer.y - ry,
        pointer.x + rx,
        pointer.y + ry,
      );
      rim.addColorStop(0, `rgba(244, 251, 248, ${0.2 * opacity})`);
      rim.addColorStop(0.46, `rgba(50, 211, 162, ${0.13 * opacity})`);
      rim.addColorStop(1, `rgba(112, 168, 255, ${0.15 * opacity})`);
      context.save();
      context.lineWidth = 1.1 + pointer.controlMix * 0.25;
      context.strokeStyle = rim;
      context.shadowColor = `rgba(50, 211, 162, ${0.18 * opacity})`;
      context.shadowBlur = 7;
      context.stroke(path);
      context.restore();

      context.save();
      context.translate(pointer.x, pointer.y);
      context.rotate(pointer.angle - 0.18);
      context.beginPath();
      context.ellipse(0, 0, rx * 0.88, ry * 0.82, 0, Math.PI * 1.08, Math.PI * 1.82);
      context.lineWidth = 0.72;
      context.strokeStyle = `rgba(112, 168, 255, ${0.11 * opacity})`;
      context.stroke();
      context.restore();
    }

    function drawRipples(now: number) {
      for (let index = ripples.length - 1; index >= 0; index -= 1) {
        const ripple = ripples[index];
        const compact = coarse || ripple.touch;
        const duration = compact ? 640 : 920;
        const elapsed = now - ripple.startedAt;
        const age = clamp(elapsed / duration, 0, 1);
        if (age >= 1) {
          ripples.splice(index, 1);
          continue;
        }

        const eased = 1 - (1 - age) ** 3;
        const fade = (1 - age) ** 1.55;
        const outerMax = compact ? 112 : Math.min(230, radius * 1.56);
        const outerRadius = 10 + eased * outerMax;
        const outerPath = createOrganicRingPath(
          ripple.x,
          ripple.y,
          outerRadius,
          0.8,
          ripple.seed,
          age,
        );
        context.save();
        context.globalCompositeOperation = "screen";
        context.lineWidth = 1.65 - age * 0.9;
        context.strokeStyle = `rgba(50, 211, 162, ${fade * (compact ? 0.3 : 0.44) * intensity})`;
        context.shadowColor = `rgba(50, 211, 162, ${fade * 0.28 * intensity})`;
        context.shadowBlur = 10 * fade;
        context.stroke(outerPath);
        context.restore();

        if (!compact && elapsed > 82) {
          const blueAge = clamp((elapsed - 82) / 840, 0, 1);
          const blueEase = 1 - (1 - blueAge) ** 3;
          const bluePath = createOrganicRingPath(
            ripple.x,
            ripple.y,
            8 + blueEase * outerMax * 0.72,
            0.83,
            ripple.seed + 0.23,
            blueAge,
          );
          context.lineWidth = 0.78;
          context.strokeStyle = `rgba(112, 168, 255, ${(1 - blueAge) ** 1.7 * 0.2 * intensity})`;
          context.stroke(bluePath);
        }

        if (elapsed < (compact ? 360 : 460)) {
          const impactAge = elapsed / (compact ? 360 : 460);
          const impactRadius = 7 + (1 - (1 - impactAge) ** 3) * (compact ? 42 : 60);
          context.save();
          context.translate(ripple.x, ripple.y);
          context.rotate(ripple.seed * Math.PI);
          context.beginPath();
          context.ellipse(0, 0, impactRadius, impactRadius * 0.76, 0, -0.25, Math.PI * 1.08);
          context.lineWidth = 1.2 - impactAge * 0.55;
          context.strokeStyle = `rgba(255, 146, 118, ${(1 - impactAge) ** 1.8 * 0.36 * intensity})`;
          context.stroke();
          context.restore();
        }

        if (elapsed < 180) {
          const flashAge = elapsed / 180;
          const flash = context.createRadialGradient(
            ripple.x,
            ripple.y,
            0,
            ripple.x,
            ripple.y,
            12 + flashAge * 34,
          );
          flash.addColorStop(0, `rgba(244, 251, 248, ${(1 - flashAge) * 0.2 * intensity})`);
          flash.addColorStop(0.35, `rgba(255, 146, 118, ${(1 - flashAge) * 0.16 * intensity})`);
          flash.addColorStop(1, "rgba(255, 146, 118, 0)");
          context.fillStyle = flash;
          context.fillRect(ripple.x - 50, ripple.y - 50, 100, 100);
        }
      }
    }

    const ensureRender = () => {
      if (!animationFrame && visible && !document.hidden) {
        animationFrame = window.requestAnimationFrame(render);
      }
    };

    const render = (now: number) => {
      animationFrame = 0;
      if (!visible || document.hidden || surface.width <= 1 || surface.height <= 1) return;

      const delta = lastFrameAt ? clamp((now - lastFrameAt) / 1000, 1 / 120, 1 / 20) : 1 / 60;
      lastFrameAt = now;
      const oldX = pointer.x;
      const oldY = pointer.y;
      const follow = 1 - Math.exp(-(pointer.controlTarget ? 18 : 14) * delta);
      pointer.x += (pointer.targetX - pointer.x) * follow;
      pointer.y += (pointer.targetY - pointer.y) * follow;
      const rawVelocityX = (pointer.x - oldX) / delta;
      const rawVelocityY = (pointer.y - oldY) / delta;
      const velocityBlend = 1 - Math.exp(-11 * delta);
      pointer.velocityX += (rawVelocityX - pointer.velocityX) * velocityBlend;
      pointer.velocityY += (rawVelocityY - pointer.velocityY) * velocityBlend;
      const speed = Math.hypot(pointer.velocityX, pointer.velocityY);
      if (speed > 25) pointer.angle = Math.atan2(pointer.velocityY, pointer.velocityX);
      const speedFactor = clamp(speed / 900, 0, 1);
      const opacityBlend = 1 - Math.exp(-9 * delta);
      pointer.opacity += (pointer.targetOpacity - pointer.opacity) * opacityBlend;
      pointer.controlMix +=
        (pointer.controlTarget - pointer.controlMix) * (1 - Math.exp(-10 * delta));

      for (let index = 0; index < EDGE_POINTS; index += 1) {
        const edgeAngle = (index / EDGE_POINTS) * Math.PI * 2;
        const target = Math.cos(edgeAngle - pointer.angle) * speedFactor * 2.8;
        edgeVelocity[index] += (target - edgeOffset[index]) * 48 * delta;
        edgeVelocity[index] *= Math.exp(-8.5 * delta);
        edgeOffset[index] += edgeVelocity[index] * delta;
        edgeOffset[index] = clamp(edgeOffset[index], -7, 7);
      }

      if (pointer.active) {
        const latest = trail[trail.length - 1];
        if (!latest || Math.hypot(pointer.x - latest.x, pointer.y - latest.y) > 7) {
          trail.push({ x: pointer.x, y: pointer.y, time: now });
          if (trail.length > 14) trail.shift();
        }
      }

      resetCanvas();
      drawTrail(now);
      drawLens(speedFactor);
      drawRipples(now);

      const positionSettled =
        Math.abs(pointer.targetX - pointer.x) < 0.18 &&
        Math.abs(pointer.targetY - pointer.y) < 0.18;
      const velocitySettled = Math.hypot(pointer.velocityX, pointer.velocityY) < 1.2;
      const opacitySettled = Math.abs(pointer.targetOpacity - pointer.opacity) < 0.008;
      const controlSettled = Math.abs(pointer.controlTarget - pointer.controlMix) < 0.008;
      let edgeSettled = true;
      for (let index = 0; index < EDGE_POINTS; index += 1) {
        if (Math.abs(edgeOffset[index]) > 0.08 || Math.abs(edgeVelocity[index]) > 0.08) {
          edgeSettled = false;
          break;
        }
      }
      const trailAlive = trail.some((point) => now - point.time < TRAIL_LIFETIME);
      const shouldContinue =
        !positionSettled ||
        !velocitySettled ||
        !opacitySettled ||
        !controlSettled ||
        !edgeSettled ||
        trailAlive ||
        ripples.length > 0;

      if (shouldContinue) {
        animationFrame = window.requestAnimationFrame(render);
      } else {
        lastFrameAt = 0;
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
        pointer.active =
          localX >= 0 && localX <= bounds.width && localY >= 0 && localY <= bounds.height;
        pointer.targetOpacity = pointer.active ? 1 : 0;
        if (pointer.active) {
          pointer.targetX = localX;
          pointer.targetY = localY;
        }
        ensureRender();
      });
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (!pointerMotionEnabled || event.pointerType === "touch") return;
      const localX = event.clientX - bounds.left;
      const localY = event.clientY - bounds.top;
      const inside =
        localX >= 0 && localX <= bounds.width && localY >= 0 && localY <= bounds.height;

      if (!inside) {
        if (pointer.active || pointer.targetOpacity > 0) {
          pointer.active = false;
          pointer.targetOpacity = 0;
          pointer.controlTarget = 0;
          ensureRender();
        }
        return;
      }

      pointer.active = true;
      pointer.targetOpacity = 1;
      pointer.clientX = event.clientX;
      pointer.clientY = event.clientY;
      pointer.targetX = localX;
      pointer.targetY = localY;
      pointer.lastInputAt = performance.now();

      const target =
        event.target instanceof Element ? event.target.closest(CONTROL_SELECTOR) : null;
      const control = target instanceof HTMLElement ? target : null;
      pointer.controlTarget = control ? 1 : 0;
      ensureRender();
    };

    const releasePointer = () => {
      if (!pointer.active && pointer.targetOpacity <= 0) return;
      pointer.active = false;
      pointer.targetOpacity = 0;
      pointer.controlTarget = 0;
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

      const now = performance.now();
      const touch = event.pointerType === "touch";
      pointer.clientX = event.clientX;
      pointer.clientY = event.clientY;
      pointer.targetX = localX;
      pointer.targetY = localY;
      pointer.lastInputAt = now;
      if (coarse || touch) {
        pointer.active = false;
        pointer.controlTarget = 0;
        pointer.x = localX;
        pointer.y = localY;
        pointer.opacity = 0.72;
        pointer.targetOpacity = 0;
      } else {
        pointer.active = true;
        pointer.targetOpacity = 1;
      }

      ripples.push({ x: localX, y: localY, startedAt: now, seed: hash(localX, localY), touch });
      const rippleLimit = coarse || touch ? 1 : 2;
      while (ripples.length > rippleLimit) ripples.shift();
      for (let index = 0; index < EDGE_POINTS; index += 1) {
        edgeVelocity[index] += (index % 2 === 0 ? 1 : -0.62) * (coarse || touch ? 72 : 118);
      }
      ensureRender();
    };

    const handleVisibility = () => {
      if (document.hidden) {
        pointer.active = false;
        pointer.targetOpacity = 0;
        pointer.controlTarget = 0;
        trail.length = 0;
        if (animationFrame) window.cancelAnimationFrame(animationFrame);
        animationFrame = 0;
        drawStatic();
        return;
      }
      if (visible && (pointer.active || ripples.length)) ensureRender();
    };

    const resizeObserver = new ResizeObserver(prepareSurface);
    resizeObserver.observe(root);
    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (!visible && animationFrame) {
          window.cancelAnimationFrame(animationFrame);
          animationFrame = 0;
        } else if (visible) {
          drawStatic();
          if (pointer.active || ripples.length) ensureRender();
        }
      },
      { rootMargin: "180px" },
    );
    intersectionObserver.observe(root);

    prepareSurface();
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
      window.removeEventListener("mouseout", handleWindowMouseOut);
      window.removeEventListener("blur", releasePointer);
      window.removeEventListener("pointerdown", handlePointerDown, true);
      window.removeEventListener("scroll", scheduleGeometry);
      document.removeEventListener("visibilitychange", handleVisibility);
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
      if (geometryFrame) window.cancelAnimationFrame(geometryFrame);
    };
  }, [intensity, radius, reducedMotion]);

  return (
    <div ref={rootRef} className={`glide-field ${className}`.trim()} aria-hidden="true">
      <canvas ref={canvasRef} className="glide-field__canvas" />
      <div className="glide-field__vignette" />
    </div>
  );
}
