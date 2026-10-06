import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Play, Pause } from "lucide-react";
import { sitePath } from "./utils";
import s from "./ProjectGallery.module.css";
const slides = [
  {
    title: "Vyberie bioklimatickú pergolu",
    copy: "Začne základnou zostavou. V konfigurátore si určí model, rozmery a spôsob umiestnenia.",
    image: "config-step-1",
  },
  {
    title: "Zladí farbu s domom",
    copy: "Konštrukciu prepne z antracitu na bielu RAL 9010. Vybraný odtieň hneď vidí na celej pergole.",
    image: "config-step-2",
  },
  {
    title: "Nastaví otočné lamely",
    copy: "Otvorí lamely a pozrie si, ako sa mení strecha aj tieň pod ňou. Vie si predstaviť otvorenú aj zatvorenú zostavu.",
    image: "config-step-3",
  },
  {
    title: "Pridá ZIP roletu",
    copy: "Doplní tienenie a nastaví vysunutie rolety. Vidí, koľko súkromia a ochrany jeho výber prinesie.",
    image: "config-step-4",
  },
  {
    title: "Doplní LED osvetlenie",
    copy: "K vybranej konštrukcii pridá integrované svetlo. Doplnky zostanú súčasťou jeho konkrétnej zostavy.",
    image: "config-step-5",
  },
  {
    title: "Odošle hotovú zostavu",
    copy: "Firma dostane dopyt s rozmermi, farbou, polohou lamiel a výbavou. Zákazník už nemusí svoje voľby opisovať od začiatku.",
    image: "config-step-6",
  },
];

export function ProjectGallery() {
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(true);
  const root = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (!playing || !visible || window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      return;
    const id = setInterval(() => {
      if (!document.hidden) setActive((n) => (n + 1) % slides.length);
    }, 6500);
    return () => clearInterval(id);
  }, [playing, visible]);
  const pick = (n: number) => {
    setActive((n + slides.length) % slides.length);
    setPlaying(false);
  };
  return (
    <div className={s.gallery} ref={root}>
      <header className={s.heading}>
        <div>
          <span>OD PRVEJ VOĽBY PO HOTOVÚ ZOSTAVU</span>
          <h3>Takto si zákazník vyskladá pergolu.</h3>
        </div>
        <div className={s.controls}>
          <button type="button" aria-label="Predchádzajúci krok" onClick={() => pick(active - 1)}>
            <ArrowLeft size={18} />
          </button>
          <button
            type="button"
            aria-label={playing ? "Pozastaviť carousel" : "Spustiť carousel"}
            aria-pressed={playing}
            onClick={() => setPlaying(!playing)}
          >
            {playing ? <Pause size={17} /> : <Play size={17} />}
          </button>
          <button type="button" aria-label="Ďalší krok" onClick={() => pick(active + 1)}>
            <ArrowRight size={18} />
          </button>
        </div>
      </header>
      <div
        className={s.stage}
        aria-roledescription="carousel"
        aria-label="Ako zákazník konfiguruje bioklimatickú pergolu"
      >
        <div className={s.media} key={active}>
          <img
            src={sitePath(`/work/koverta/${slides[active].image}.webp`)}
            alt={slides[active].title}
            width={1400}
            height={875}
            loading="lazy"
          />
        </div>
        <div className={s.info} aria-live="polite">
          <span>
            0{active + 1} / 0{slides.length}
          </span>
          <h4>{slides[active].title}</h4>
          <p>{slides[active].copy}</p>
          <div className={s.pagination}>
            {slides.map((slide, i) => (
              <button
                type="button"
                key={slide.title}
                aria-label={slide.title}
                aria-pressed={i === active}
                onClick={() => pick(i)}
              >
                <i />
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className={s.thumbnails}>
        {slides.map((slide, i) => (
          <button
            type="button"
            key={slide.title}
            aria-pressed={i === active}
            onClick={() => pick(i)}
          >
            <img src={sitePath(`/work/koverta/${slide.image}-thumb.webp`)} alt="" loading="lazy" />
            <span>{slide.title}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
