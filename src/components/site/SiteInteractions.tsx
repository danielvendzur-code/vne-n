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
      const x = Math.min(event.clientX + 18, window.innerWidth - el.offsetWidth - 12);
      const y = Math.min(event.clientY + 18, window.innerHeight - el.offsetHeight - 12);
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
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
  return <CursorLabel />;
}
