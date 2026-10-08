import { useEffect, useRef, type ReactNode } from "react";
import { BrandMark } from "@/components/BrandMark";
import s from "./SectionReveal.module.css";

/** A single scroll-led scene. With no JS or reduced motion, all content is already open. */
export function SectionReveal({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let visible = false;
    const paint = () => {
      frame = 0;
      if (media.matches) {
        delete element.dataset.motion;
        return;
      }
      const top = element.getBoundingClientRect().top;
      const progress = Math.min(1, Math.max(0, (innerHeight * 0.88 - top) / (innerHeight * 0.58)));
      const eased = progress * progress * (3 - 2 * progress);
      element.style.setProperty("--door-open", String(eased));
      element.dataset.motion = "true";
    };
    const schedule = () => {
      if (visible && !frame) frame = requestAnimationFrame(paint);
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) paint();
      },
      { rootMargin: "120px" },
    );
    observer.observe(element);
    const preference = () => {
      paint();
    };
    media.addEventListener("change", preference);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      media.removeEventListener("change", preference);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      delete element.dataset.motion;
    };
  }, []);
  return (
    <div ref={root} className={s.scene} data-door-reveal>
      <div className={s.content}>{children}</div>
      <div className={s.doors} aria-hidden="true">
        <div className={s.left}>
          <span>
            <BrandMark size={104} tone="paper" />
          </span>
        </div>
        <div className={s.right}>
          <span>
            <BrandMark size={104} tone="paper" />
          </span>
        </div>
      </div>
    </div>
  );
}
