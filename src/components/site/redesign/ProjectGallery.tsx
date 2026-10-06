import { useEffect, useRef, useState } from "react";
import { sitePath } from "./utils";
import s from "./ProjectGallery.module.css";
const slides = [
  {
    title: "Vyberie si bioklimatickú pergolu",
    copy: "Zvolí model bioklimatickej pergoly, jej rozmery a spôsob umiestnenia. Ďalšími voľbami ju prispôsobí svojmu domu.",
    image: "config-step-1",
  },
  {
    title: "Zladí farbu s domom",
    copy: "Konštrukciu prepne z antracitu na bielu RAL 9010. Vybraný odtieň hneď vidí na celej pergole.",
    image: "config-step-2",
  },
  {
    title: "Nastaví otočné lamely",
    copy: "Zvolí kontrastné antracitové lamely a nastaví ich otvorenie. Hneď vidí strechu aj tieň pod pergolou.",
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
  const root = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      if (!root.current || !stage.current) return;
      const r = root.current.getBoundingClientRect();
      const inset = parseFloat(getComputedStyle(stage.current).top) || 88;
      const travel = Math.max(1, r.height - stage.current.offsetHeight);
      const progress = Math.max(0, Math.min(1, (inset - r.top) / travel));
      setActive(Math.min(slides.length - 1, Math.floor(progress * slides.length)));
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    update();
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      cancelAnimationFrame(raf);
    };
  }, []);
  return (
    <div className={`${s.gallery} ${s.scrollGallery}`} ref={root} data-scroll-gallery>
      <div className={s.scrollScene} ref={stage}>
        <header className={s.heading}>
          <div>
            <span>OD PRVEJ VOĽBY PO HOTOVÚ ZOSTAVU</span>
            <h3>Takto si zákazník vyskladá svoju zostavu.</h3>
          </div>
          <p className={s.scrollHint}>Posúvajte stránku a sledujte jednotlivé voľby ↓</p>
        </header>
        <div className={s.stage} aria-label="Postup skladania pergoly pri posúvaní stránky">
          <div className={`${s.media} ${s.scrollMedia}`}>
            {slides.map((slide, i) => (
              <img
                key={slide.image}
                src={sitePath(`/work/koverta/${slide.image}.webp`)}
                alt={i === active ? slide.title : ""}
                aria-hidden={i !== active}
                data-active={i === active}
                width={1400}
                height={875}
                loading="lazy"
              />
            ))}
          </div>
          <div className={s.info}>
            <span>
              0{active + 1} / 0{slides.length}
            </span>
            <h4 key={`title-${active}`}>{slides[active].title}</h4>
            <p key={`copy-${active}`}>{slides[active].copy}</p>
            <div className={s.scrollProgress} aria-hidden="true">
              {slides.map((slide, i) => (
                <i key={slide.image} data-active={i === active} />
              ))}
            </div>
          </div>
        </div>
        <ol className={`${s.thumbnails} ${s.scrollSteps}`}>
          {slides.map((slide, i) => (
            <li
              key={slide.image}
              data-active={i === active}
              aria-current={i === active ? "step" : undefined}
            >
              <img
                src={sitePath(`/work/koverta/${slide.image}-thumb.webp`)}
                alt=""
                loading="lazy"
              />
              <span>{slide.title}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
