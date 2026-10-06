import { useEffect, useRef, useState } from "react";
import { RotateCcw, Play, Pause } from "lucide-react";
import { sitePath } from "./utils";
import s from "./PergolaDemo.module.css";

type ModelApi = {
  update: (state: Record<string, unknown>) => void;
  view: (az: number, el: number) => void;
};
const colors = [
  { name: "Antracit", ral: "RAL 7016", hex: "#383e42" },
  { name: "Biela", ral: "RAL 9010", hex: "#f1ece1" },
  { name: "Hnedá", ral: "RAL 8017", hex: "#45322e" },
];

export function PergolaDemo({ compact = false }: { compact?: boolean }) {
  const frame = useRef<HTMLIFrameElement>(null);
  const root = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [angle, setAngle] = useState(84);
  const [screen, setScreen] = useState(0);
  const [color, setColor] = useState(colors[0].ral);
  const [led, setLed] = useState(false);
  const [touring, setTouring] = useState(false);
  const [phase, setPhase] = useState("Lamely regulujú svetlo");
  const manual = useRef(false);
  const stopTour = () => {
    manual.current = true;
    setTouring(false);
  };
  const api = () =>
    (frame.current?.contentWindow as (Window & { MC_PERGOLA?: ModelApi }) | null)?.MC_PERGOLA;
  // The iframe may finish loading before React hydrates. Check its actual API too.
  useEffect(() => {
    let timer = 0;
    const check = () => {
      const model = api();
      if (!model) return;
      setReady(true);
      model.view(-0.62, 0.42);
      window.clearInterval(timer);
    };
    timer = window.setInterval(check, 250);
    check();
    return () => window.clearInterval(timer);
  }, []);
  useEffect(() => {
    const onReady = (e: MessageEvent) => {
      if (
        e.origin !== window.location.origin ||
        e.source !== frame.current?.contentWindow ||
        e.data?.source !== "mc-pergola"
      )
        return;
      setReady(true);
      api()?.view(-0.62, 0.42);
    };
    window.addEventListener("message", onReady);
    return () => window.removeEventListener("message", onReady);
  }, []);
  useEffect(() => {
    if (!ready) return;
    const doc = frame.current?.contentDocument;
    const takeControl = () => stopTour();
    doc?.addEventListener("pointerdown", takeControl);
    doc?.addEventListener("keydown", takeControl);
    return () => {
      doc?.removeEventListener("pointerdown", takeControl);
      doc?.removeEventListener("keydown", takeControl);
    };
  }, [ready]);
  useEffect(() => {
    if (!ready) return;
    api()?.update({ louver: angle / 100, screen: screen / 100, color, led });
  }, [angle, screen, color, led, ready]);
  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;
    const sync = () =>
      setTouring(visible && !motion.matches && !document.hidden && !manual.current);
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        sync();
      },
      { threshold: 0.25 },
    );
    if (root.current) observer.observe(root.current);
    motion.addEventListener("change", sync);
    document.addEventListener("visibilitychange", sync);
    return () => {
      observer.disconnect();
      motion.removeEventListener("change", sync);
      document.removeEventListener("visibilitychange", sync);
    };
  }, []);
  useEffect(() => {
    if (!touring || !ready) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setTouring(false);
      return;
    }
    let id = 0,
      start = 0,
      last = 0,
      lastView = "";
    const tick = (now: number) => {
      if (document.hidden) {
        setTouring(false);
        return;
      }
      if (!start) start = now;
      const t = ((now - start) % 22000) / 22000;
      if (now - last > 50) {
        last = now;
        const view = t > 0.8 ? "under" : "top";
        if (view !== lastView) {
          api()?.view(-0.62, view === "under" ? -0.16 : 0.42);
          lastView = view;
        }
        if (t < 0.28) {
          setPhase("Lamely regulujú svetlo");
          setAngle(Math.round(50 + 50 * Math.cos((t / 0.28) * Math.PI * 2)));
          setScreen(0);
          setColor(colors[0].ral);
          setLed(false);
        } else if (t < 0.57) {
          setPhase("ZIP roleta pridáva tieň a súkromie");
          setAngle(84);
          setScreen(Math.round(100 * Math.sin(((t - 0.28) / 0.29) * Math.PI) ** 2));
          setLed(false);
        } else if (t < 0.8) {
          setPhase("Farba zladí pergolu s domom");
          setScreen(0);
          setColor(colors[Math.min(2, Math.floor(((t - 0.57) / 0.23) * 3))].ral);
          setLed(false);
        } else {
          setPhase("LED rozsvieti vybranú zostavu");
          setAngle(35);
          setScreen(20);
          setColor(colors[0].ral);
          setLed(true);
        }
      }
      id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(id);
    };
  }, [touring, ready]);
  const reset = () => {
    stopTour();
    setAngle(84);
    setScreen(0);
    setColor(colors[0].ral);
    setLed(false);
    api()?.update({ reset: true });
  };
  return (
    <div
      ref={root}
      className={`${s.demo} ${compact ? s.compact : ""}`}
      data-pergola-demo
      data-ready={ready}
      data-touring={touring}
    >
      <div className={s.stage}>
        <iframe
          ref={frame}
          src={sitePath("/work/pergola/index.html")}
          title="Interaktívny 3D model pergoly Koverta"
          loading="lazy"
          onLoad={() => {
            if (api()) {
              api()?.view(-0.62, 0.42);
              setReady(true);
            }
          }}
        />
        {!ready && (
          <div className={s.loading}>
            <img
              src={sitePath("/work/koverta/model-pergola.webp")}
              alt="3D model pergoly Koverta"
            />
            <span>Načítavam 3D model…</span>
          </div>
        )}
        <button className={s.reset} type="button" aria-label="Obnoviť pergolu" onClick={reset}>
          <RotateCcw size={16} />
        </button>
        <span className={s.hint}>Ťahaním otočíte model</span>
      </div>
      <div className={s.controls}>
        <p className={s.status} data-product-phase>
          {touring ? phase : "Nastavte si zostavu podľa seba"}
        </p>
        <label>
          Lamely <output>{angle} % otvorenia</output>
          <input
            type="range"
            aria-label="Otvorenie lamiel"
            min="0"
            max="100"
            value={angle}
            disabled={!ready}
            onChange={(e) => {
              stopTour();
              setAngle(Number(e.target.value));
            }}
          />
        </label>
        <label>
          ZIP roleta <output>{screen} % vysunutia</output>
          <input
            type="range"
            aria-label="Vysunutie ZIP rolety"
            min="0"
            max="100"
            value={screen}
            disabled={!ready}
            onChange={(e) => {
              stopTour();
              setScreen(Number(e.target.value));
            }}
          />
        </label>
        <div className={s.bottom}>
          <button
            type="button"
            className={s.tour}
            disabled={!ready}
            aria-pressed={touring}
            onClick={() => {
              manual.current = touring;
              setTouring(!touring);
            }}
          >
            {touring ? <Pause size={14} /> : <Play size={14} />}{" "}
            {touring ? "Pozastaviť" : "Ukážka pohybu"}
          </button>
          <div className={s.swatches} role="group" aria-label="Farba pergoly">
            {colors.map((c) => (
              <button
                type="button"
                key={c.ral}
                style={{ background: c.hex }}
                aria-label={c.name}
                aria-pressed={color === c.ral}
                disabled={!ready}
                onClick={() => {
                  stopTour();
                  setColor(c.ral);
                }}
              />
            ))}
          </div>
          <button
            className={s.led}
            type="button"
            aria-pressed={led}
            disabled={!ready}
            onClick={() => {
              stopTour();
              setLed(!led);
            }}
          >
            LED <i data-on={led} />
          </button>
        </div>
      </div>
    </div>
  );
}
