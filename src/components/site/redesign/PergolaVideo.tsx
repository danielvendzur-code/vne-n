import { useEffect, useRef, useState } from "react";
import { sitePath } from "./utils";
import s from "./HomeSolutions.module.css";

type PergolaModel = {
  view: (azimuth: number, elevation: number) => void;
  update: (state: Record<string, unknown>) => void;
};

/** Live 3D replaces the baked film: fixed camera, continuous louvers and shading. */
export function PergolaVideo() {
  const root = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLIFrameElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;
    let model: PergolaModel | undefined;
    let frameId = 0;
    let pollId = 0;
    let lastPaint = 0;
    let start = 0;

    const stop = () => {
      if (frameId) cancelAnimationFrame(frameId);
      frameId = 0;
    };
    const tick = (time: number) => {
      if (!visible || document.hidden || motion.matches || !model) {
        frameId = 0;
        return;
      }
      if (!start) start = time;
      // Limit parent updates to 30 fps; the 3D scene handles its own rendering.
      if (time - lastPaint >= 33) {
        lastPaint = time;
        const t = (time - start) / 1000;
        const louver = 0.50 + 0.40 * Math.sin((t * Math.PI) / 5);
        const screen = 0.28 + 0.26 * Math.sin((t * Math.PI) / 8 + 1);
        model.update({ louver, screen, color: "RAL 7016", led: false });
      }
      frameId = requestAnimationFrame(tick);
    };
    const sync = () => {
      if (!model) return;
      if (visible && !document.hidden && !motion.matches && !frameId) {
        start = 0;
        frameId = requestAnimationFrame(tick);
      } else if (!visible || document.hidden || motion.matches) {
        stop();
        model.update({ louver: 0.84, screen: 0.15, color: "RAL 7016", led: false });
      }
    };
    const check = () => {
      const api = (frame.current?.contentWindow as (Window & { MC_PERGOLA?: PergolaModel }) | null)?.MC_PERGOLA;
      if (!api || model) return;
      model = api;
      model.view(-0.62, 0.42);
      model.update({ louver: 0.84, screen: 0.15, color: "RAL 7016", led: false });
      setReady(true);
      sync();
      window.clearInterval(pollId);
    };
    pollId = window.setInterval(check, 250);
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    }, { threshold: 0.1 });
    observer.observe(element);
    document.addEventListener("visibilitychange", sync);
    motion.addEventListener("change", sync);
    check();
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
      motion.removeEventListener("change", sync);
      window.clearInterval(pollId);
      stop();
    };
  }, []);

  return (
    <div ref={root} className={s.pergolaFilm} data-3d-ready={ready}>
      <div className={s.pergolaScene}>
        <img
          className={s.pergolaPoster}
          src={sitePath("/work/solutions/pergola-film-poster.webp")}
          alt="3D model bioklimatickej pergoly"
          width={800}
          height={600}
          loading="lazy"
          decoding="async"
        />
        <iframe
          ref={frame}
          className={s.pergolaFrame}
          src={sitePath("/work/pergola/index.html")}
          title="Plynulá 3D animácia lamiel a tienenia pergoly"
          loading="lazy"
          tabIndex={-1}
          aria-hidden="true"
        />
      </div>
      <span>Plynulé 3D · lamely · ZIP tienenie</span>
    </div>
  );
}
