import { useEffect, useRef } from "react";
import { sitePath } from "./utils";
import s from "./HomeSolutions.module.css";

export function PergolaVideo() {
  const video = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const element = video.current;
    if (!element) return;
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;
    const sync = () => {
      if (visible && !document.hidden && !motion.matches) void element.play().catch(() => {});
      else element.pause();
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        sync();
      },
      { threshold: 0.2 },
    );
    observer.observe(element);
    motion.addEventListener("change", sync);
    document.addEventListener("visibilitychange", sync);
    return () => {
      observer.disconnect();
      motion.removeEventListener("change", sync);
      document.removeEventListener("visibilitychange", sync);
      element.pause();
    };
  }, []);
  return (
    <div className={s.pergolaFilm}>
      <video
        ref={video}
        muted
        loop
        playsInline
        preload="none"
        poster={sitePath("/work/solutions/pergola-film-poster.webp")}
        width={800}
        height={600}
        aria-label="Video pergoly: pohyb lamiel, ZIP rolety, výber farby a LED osvetlenie"
      >
        <source src={sitePath("/work/solutions/pergola-film.mp4")} type="video/mp4" />
      </video>
      <span>Lamely · ZIP tienenie · farby · LED</span>
    </div>
  );
}
