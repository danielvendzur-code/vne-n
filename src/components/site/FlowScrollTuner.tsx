import { useEffect } from "react";

const FLOW_STAGE_COUNT = 4;
const FLOW_IDLE_MS = 55;

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const easeOutQuart = (value: number) => 1 - (1 - value) ** 4;

/**
 * Owns the desktop scroll-settle behaviour for the 03 / Ako to funguje story.
 * The section itself stays native-scrollable; only the short idle settle is animated.
 * Capture listeners stop the older FlowStory wheel/key listener from starting its
 * slower competing 480 ms settle while the user is inside this section.
 */
export function FlowScrollTuner({ pathname }: { pathname: string }) {
  useEffect(() => {
    if (pathname !== "/") return undefined;

    const flow = document.querySelector<HTMLElement>(".kage-flow");
    if (!flow) return undefined;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const desktop = window.matchMedia("(min-width: 761px)");
    if (reducedMotion.matches || !desktop.matches) return undefined;

    let idleTimer: number | null = null;
    let animationFrame = 0;
    let snapping = false;

    const bounds = () => {
      const start = flow.offsetTop;
      const range = Math.max(0, flow.offsetHeight - window.innerHeight);
      return { start, range, end: start + range };
    };

    const isInsideFlow = () => {
      const { start, end } = bounds();
      return window.scrollY >= start - 2 && window.scrollY <= end + 2;
    };

    const cancelIdle = () => {
      if (idleTimer === null) return;
      window.clearTimeout(idleTimer);
      idleTimer = null;
    };

    const cancelSnap = () => {
      if (animationFrame !== 0) {
        window.cancelAnimationFrame(animationFrame);
        animationFrame = 0;
      }
      snapping = false;
    };

    const targetForCurrentPosition = () => {
      const { start, range } = bounds();
      if (range <= 0) return null;

      const progress = clamp((window.scrollY - start) / range, 0, 1);
      const segments = FLOW_STAGE_COUNT - 1;
      const scaled = progress * segments;
      const lower = Math.floor(scaled);
      const localProgress = scaled - lower;
      const targetStage = clamp(localProgress >= 0.5 ? lower + 1 : lower, 0, segments);

      return {
        stage: targetStage,
        y: start + (targetStage / segments) * range,
      };
    };

    const settle = () => {
      idleTimer = null;
      if (snapping || !isInsideFlow()) return;

      const target = targetForCurrentPosition();
      if (!target) return;

      const from = window.scrollY;
      const distance = target.y - from;
      if (Math.abs(distance) < 2) {
        window.scrollTo(0, target.y);
        flow.dataset.flowSnapStage = String(target.stage);
        return;
      }

      snapping = true;
      flow.dataset.flowSnapping = "true";
      flow.dataset.flowSnapStage = String(target.stage);

      const duration = clamp(210 + Math.abs(distance) * 0.09, 210, 300);
      const startedAt = performance.now();

      const tick = (now: number) => {
        const progress = clamp((now - startedAt) / duration, 0, 1);
        const eased = easeOutQuart(progress);
        window.scrollTo(0, from + distance * eased);

        if (progress < 1) {
          animationFrame = window.requestAnimationFrame(tick);
          return;
        }

        animationFrame = 0;
        snapping = false;
        delete flow.dataset.flowSnapping;
        window.scrollTo(0, target.y);
      };

      animationFrame = window.requestAnimationFrame(tick);
    };

    const scheduleSettle = () => {
      cancelIdle();
      if (snapping || !isInsideFlow()) return;
      idleTimer = window.setTimeout(settle, FLOW_IDLE_MS);
    };

    const onScroll = () => {
      if (snapping) return;
      scheduleSettle();
    };

    const onManualInput = (event: Event) => {
      if (!isInsideFlow()) return;
      cancelIdle();
      cancelSnap();
      // Keep native scrolling, but prevent FlowStory's older competing settle listener.
      event.stopImmediatePropagation();
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (!["ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End", " "].includes(event.key)) {
        return;
      }
      onManualInput(event);
    };

    window.addEventListener("wheel", onManualInput, { capture: true, passive: true });
    window.addEventListener("touchstart", onManualInput, { capture: true, passive: true });
    window.addEventListener("keydown", onKeyDown, { capture: true });
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      cancelIdle();
      cancelSnap();
      delete flow.dataset.flowSnapping;
      delete flow.dataset.flowSnapStage;
      window.removeEventListener("wheel", onManualInput, { capture: true });
      window.removeEventListener("touchstart", onManualInput, { capture: true });
      window.removeEventListener("keydown", onKeyDown, { capture: true });
      window.removeEventListener("scroll", onScroll);
    };
  }, [pathname]);

  return null;
}
