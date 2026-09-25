import { useEffect, useRef } from "react";
import "./SiteInteractions.css";

/**
 * Jemné interakcie známe z ocenených webov, bez externých knižníc:
 *  - plynulé scrollovanie kolieskom myši (ako Lenis) — natívny scroll ostáva,
 *    iba sa interpoluje k cieľu, takže sticky sekcie aj kotvy fungujú,
 *  - magnetické tlačidlá, ktoré sa jemne pritiahnu ku kurzoru,
 *  - vlastný kurzor, ktorý nad odkazmi s `data-cursor` ukáže popis.
 * Na dotykových zariadeniach a pri obmedzenom pohybe sa nič z toho nespustí.
 */
const MAGNETIC =
  ".sh-btn--lime, .hybrid-hero__primary, .site-header__cta, .kage-flow-story__cta, [data-magnetic]";

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
      current += (target - current) * 0.11;
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

function useMagnetic() {
  useEffect(() => {
    if (!canEnhance()) return undefined;
    let frame = 0;
    let last: HTMLElement | null = null;

    const reset = (el: HTMLElement | null) => {
      if (!el) return;
      el.style.removeProperty("--mag-x");
      el.style.removeProperty("--mag-y");
      el.removeAttribute("data-magnet");
    };

    const onMove = (event: PointerEvent) => {
      const el = (event.target as Element | null)?.closest<HTMLElement>(MAGNETIC) ?? null;
      if (el !== last) {
        reset(last);
        last = el;
      }
      if (!el) return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        const x = (event.clientX - (r.left + r.width / 2)) * 0.28;
        const y = (event.clientY - (r.top + r.height / 2)) * 0.38;
        el.setAttribute("data-magnet", "true");
        el.style.setProperty("--mag-x", `${x.toFixed(1)}px`);
        el.style.setProperty("--mag-y", `${y.toFixed(1)}px`);
      });
    };
    const onLeave = () => {
      reset(last);
      last = null;
    };

    document.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(frame);
      reset(last);
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, []);
}

function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    const label = labelRef.current;
    if (!dot || !label || !canEnhance()) return undefined;

    document.documentElement.classList.add("has-cursor");
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let cx = x;
    let cy = y;
    let frame = 0;

    const loop = () => {
      cx += (x - cx) * 0.22;
      cy += (y - cy) * 0.22;
      dot.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);

    const onMove = (event: PointerEvent) => {
      x = event.clientX;
      y = event.clientY;
      dot.dataset.visible = "true";
      const target = event.target instanceof Element ? event.target : null;
      const labelled = target?.closest<HTMLElement>("[data-cursor]");
      const interactive = target?.closest("a, button, [role='tab'], summary, input, label");
      if (labelled) {
        dot.dataset.state = "label";
        label.textContent = labelled.dataset.cursor ?? "";
      } else if (interactive) {
        dot.dataset.state = "hover";
        label.textContent = "";
      } else {
        dot.dataset.state = "idle";
        label.textContent = "";
      }
    };
    const onLeave = () => {
      dot.dataset.visible = "false";
    };
    const onDown = () => dot.setAttribute("data-down", "true");
    const onUp = () => dot.removeAttribute("data-down");

    document.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("pointerup", onUp);

    return () => {
      cancelAnimationFrame(frame);
      document.documentElement.classList.remove("has-cursor");
      document.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("pointerup", onUp);
    };
  }, []);

  return (
    <div
      ref={dotRef}
      className="mc-cursor"
      data-state="idle"
      data-visible="false"
      aria-hidden="true"
    >
      <span ref={labelRef} />
    </div>
  );
}

export function SiteInteractions() {
  useSmoothScroll();
  useMagnetic();
  return <Cursor />;
}
