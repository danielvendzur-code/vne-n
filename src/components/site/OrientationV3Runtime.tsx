import { useEffect } from "react";
import "./AwardV2OrientationV3.css";

const FLOW_POINTS = [
  [0, 0],
  [0.16, 0],
  [0.3, 0.25],
  [0.43, 0.25],
  [0.57, 0.5],
  [0.7, 0.5],
  [0.84, 0.75],
  [1, 0.75],
] as const;

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));

function interpolateFlow(progress: number): number {
  const value = clamp01(progress);

  for (let index = 0; index < FLOW_POINTS.length - 1; index += 1) {
    const [fromProgress, fromX] = FLOW_POINTS[index];
    const [toProgress, toX] = FLOW_POINTS[index + 1];
    if (value > toProgress) continue;

    const span = toProgress - fromProgress;
    if (span <= 0) return toX;
    const mix = (value - fromProgress) / span;
    return fromX + (toX - fromX) * mix;
  }

  return 0.75;
}

export function OrientationV3Runtime(): null {
  useEffect(() => {
    const flow = document.querySelector<HTMLElement>(".award2-flow");
    const track = document.querySelector<HTMLElement>(".award2-flow__track");
    const progressLine = document.querySelector<HTMLElement>(".award2-flow__progress i");
    if (!flow || !track) return;

    let frame = 0;

    const update = () => {
      frame = 0;
      const flowTop = flow.getBoundingClientRect().top + window.scrollY;
      const travel = Math.max(1, flow.offsetHeight - window.innerHeight);
      const progress = clamp01((window.scrollY - flowTop) / travel);
      const x = interpolateFlow(progress);

      track.style.setProperty("--orientation-flow-x", `${x * -100}%`);
      progressLine?.style.setProperty("--orientation-flow-progress", `${Math.max(0.03, progress)}`);
    };

    const schedule = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      track.style.removeProperty("--orientation-flow-x");
      progressLine?.style.removeProperty("--orientation-flow-progress");
    };
  }, []);

  return null;
}
