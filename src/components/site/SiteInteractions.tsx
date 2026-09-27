import { useEffect, useRef } from "react";
import "./SiteInteractions.css";

/**
 * Jemné interakcie známe z ocenených webov, bez externých knižníc:
 *  - plynulé scrollovanie kolieskom myši (ako Lenis) — natívny scroll ostáva,
 *    iba sa interpoluje k cieľu, takže sticky sekcie aj kotvy fungujú,
 *  - pri realizáciách s `data-cursor` sa pri kurzore ukáže krátky popis.
 * Na dotykových zariadeniach a pri obmedzenom pohybe sa nič z toho nespustí.
 */
function canEnhance() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function scrollableParent(node: EventTarget | null): boolean {
  let el = node instanceof Element ? node : null;
  while (el && el !== document.body && el !== document.documentElement) {
    const style = getComputedStyle(el);
    if (
      /(auto|scroll)/.test(style.overflowY) &&
      el.scrollHeight > el.clientHeight + 1 &&
      !el.matches("html, body")
    ) {
      return true;
    }
    el = el.parentElement;
  }
  return false;
}

function useSmoothScroll() {
  useEffect(() => {
    if (!canEnhance()) return undefined;

    let target = window.scrollY;
    let current = window.scrollY;
    let frame = 0;
    let active = false;

    const maxScroll = () => document.documentElement.scrollHeight - window.innerHeight;

    const step = () => {
      current += (target - current) * 0.16;
      if (Math.abs(target - current) < 0.5) {
        current = target;
        active = false;
      }
      window.scrollTo({ top: current, behavior: "instant" });
      frame = active ? requestAnimationFrame(step) : 0;
    };

    const onWheel = (event: WheelEvent) => {
      if (event.ctrlKey || event.defaultPrevented || document.body.style.overflow === "hidden") {
        return;
      }
      if (scrollableParent(event.target)) return;
      event.preventDefault();
      if (!active) {
        current = window.scrollY;
        target = window.scrollY;
      }
      const delta = event.deltaMode === 1 ? event.deltaY * 32 : event.deltaY;
      target = Math.max(0, Math.min(maxScroll(), target + delta));
      if (!active) {
        active = true;
        frame = requestAnimationFrame(step);
      }
    };

    // Keyboard, scrollbar or anchor jumps take over immediately.
    const sync = () => {
      if (!active) {
        current = window.scrollY;
        target = window.scrollY;
      }
    };
    const stop = () => {
      active = false;
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      sync();
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("keydown", stop);
    window.addEventListener("pointerdown", stop);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("scroll", sync);
      window.removeEventListener("keydown", stop);
      window.removeEventListener("pointerdown", stop);
    };
  }, []);
}

/** Popis „Otvoriť web" pri realizáciách. Systémový kurzor ostáva, popis
 *  sa posúva presne s ním (bez oneskorenia), takže klik sedí tam, kam ukazuje. */
function CursorLabel() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !canEnhance()) return undefined;

    const onMove = (event: PointerEvent) => {
      const target = event.target instanceof Element ? event.target : null;
      const labelled = target?.closest<HTMLElement>("[data-cursor]");
      if (!labelled) {
        el.dataset.visible = "false";
        return;
      }
      el.textContent = labelled.dataset.cursor ?? "";
      el.style.transform = `translate3d(${event.clientX + 18}px, ${event.clientY + 18}px, 0)`;
      el.dataset.visible = "true";
    };
    const hide = () => {
      el.dataset.visible = "false";
    };

    document.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", hide);
    window.addEventListener("scroll", hide, { passive: true });
    return () => {
      document.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", hide);
      window.removeEventListener("scroll", hide);
    };
  }, []);

  return <div ref={ref} className="mc-cursor-label" data-visible="false" aria-hidden="true" />;
}

export function SiteInteractions() {
  useSmoothScroll();
  return <CursorLabel />;
}
