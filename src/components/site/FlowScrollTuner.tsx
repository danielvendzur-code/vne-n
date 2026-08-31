import { useEffect } from "react";

/**
 * The homepage FlowStory already maps native vertical progress to its horizontal
 * 400%-wide stage track. Historical listeners inside that component also tried
 * to settle the window onto the nearest stage after wheel/key input. This guard
 * blocks only those legacy input listeners while leaving the browser's default
 * scroll untouched, so the four stages move continuously with the user's hand.
 */
export function FlowScrollTuner({ pathname }: { pathname: string }) {
  useEffect(() => {
    if (pathname !== "/") return undefined;

    const flow = document.querySelector<HTMLElement>(".kage-flow");
    if (!flow) return undefined;

    const insideFlow = () => {
      const start = flow.offsetTop;
      const range = Math.max(0, flow.offsetHeight - window.innerHeight);
      const end = start + range;
      return window.scrollY >= start - 2 && window.scrollY <= end + 2;
    };

    const keepNativeScroll = (event: Event) => {
      if (!insideFlow()) return;
      // Do not preventDefault: browser scrolling remains completely native.
      // Stop only the older window listeners that would start a forced snap.
      event.stopImmediatePropagation();
    };

    const keepNativeKeyboardScroll = (event: KeyboardEvent) => {
      if (!["ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End", " "].includes(event.key)) {
        return;
      }
      keepNativeScroll(event);
    };

    window.addEventListener("wheel", keepNativeScroll, { capture: true, passive: true });
    window.addEventListener("touchstart", keepNativeScroll, { capture: true, passive: true });
    window.addEventListener("keydown", keepNativeKeyboardScroll, { capture: true });

    return () => {
      window.removeEventListener("wheel", keepNativeScroll, { capture: true });
      window.removeEventListener("touchstart", keepNativeScroll, { capture: true });
      window.removeEventListener("keydown", keepNativeKeyboardScroll, { capture: true });
    };
  }, [pathname]);

  return null;
}
