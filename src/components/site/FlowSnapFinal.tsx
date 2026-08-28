import { animate } from "motion/react";
import { useEffect } from "react";

/**
 * Final desktop-only snap assist for the scrollytelling section.
 * It starts before the older in-component fallback, lands on the same four
 * stage anchors and leaves the mobile/static flow untouched.
 */
export function FlowSnapFinal() {
  useEffect(() => {
    const compact = window.matchMedia("(max-width: 760px)").matches;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (compact || reducedMotion) return undefined;

    const flow = document.querySelector<HTMLElement>(".kage-flow");
    if (!flow) return undefined;

    let settleTimer: number | null = null;
    let userScrolling = false;
    let settling = false;
    let activeAnimation: { stop: () => void } | null = null;

    const clearTimer = () => {
      if (settleTimer === null) return;
      window.clearTimeout(settleTimer);
      settleTimer = null;
    };

    const inFlowRange = () => {
      const range = Math.max(0, flow.offsetHeight - window.innerHeight);
      const start = flow.offsetTop;
      return window.scrollY >= start - 3 && window.scrollY <= start + range + 3;
    };

    const beginUserScroll = () => {
      if (!inFlowRange()) {
        userScrolling = false;
        return;
      }
      clearTimer();
      activeAnimation?.stop();
      activeAnimation = null;
      settling = false;
      userScrolling = true;
    };

    const settle = () => {
      settleTimer = null;
      if (!userScrolling || settling || !inFlowRange()) return;

      const stageCount = 3;
      const range = Math.max(0, flow.offsetHeight - window.innerHeight);
      if (range <= 0) return;
      const start = flow.offsetTop;
      const progress = Math.min(1, Math.max(0, (window.scrollY - start) / range));
      const targetStage = Math.round(progress * stageCount);
      const targetY = start + (targetStage / stageCount) * range;

      if (Math.abs(window.scrollY - targetY) < 3) {
        userScrolling = false;
        return;
      }

      settling = true;
      activeAnimation?.stop();
      activeAnimation = animate(window.scrollY, targetY, {
        duration: 0.34,
        ease: [0.2, 0.78, 0.2, 1],
        onUpdate: (position) => window.scrollTo(0, position),
        onComplete: () => {
          settling = false;
          userScrolling = false;
          activeAnimation = null;
        },
      });
    };

    const scheduleSettle = () => {
      if (!userScrolling || settling || !inFlowRange()) return;
      clearTimer();
      settleTimer = window.setTimeout(settle, 55);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (["ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End", " "].includes(event.key)) {
        beginUserScroll();
      }
    };

    window.addEventListener("wheel", beginUserScroll, { passive: true });
    window.addEventListener("touchstart", beginUserScroll, { passive: true });
    window.addEventListener("scroll", scheduleSettle, { passive: true });
    window.addEventListener("keydown", onKeyDown);

    return () => {
      clearTimer();
      activeAnimation?.stop();
      window.removeEventListener("wheel", beginUserScroll);
      window.removeEventListener("touchstart", beginUserScroll);
      window.removeEventListener("scroll", scheduleSettle);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  return null;
}
