import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import { sitePath } from "./utils";
import s from "./ProjectGallery.module.css";

const photos = [
  { image: "realizacia-pristresok-trnava", caption: "Prístrešok pre dve autá · Trnava" },
  { image: "realizacia-pergola-sibenik", caption: "Bioklimatická pergola · Šibenik" },
  { image: "realizacia-pristresok-vecer", caption: "Prístrešok s večerným osvetlením" },
];

export function ProjectGallery() {
  const root = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    const element = root.current;
    if (!element || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(([entry]) => {
      element.dataset.active = String(entry.isIntersecting);
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  return (
    <div ref={root} className={s.gallery} data-paused={paused}>
      <div className={s.heading} data-reveal>
        <div>
          <span>OD MODELU K REALIZÁCII</span>
          <h3>Digitálny návrh. Skutočný výsledok.</h3>
        </div>
        <button type="button" onClick={() => setPaused(!paused)} aria-pressed={paused}>
          {paused ? <Play size={16} aria-hidden="true" /> : <Pause size={16} aria-hidden="true" />}
          {paused ? "Spustiť pohyb" : "Pozastaviť pohyb"}
        </button>
      </div>
      <div className={s.window}>
        <div className={s.track}>
          {[0, 1].map((copy) => (
            <div className={s.group} key={copy} aria-hidden={copy === 1 || undefined}>
              {photos.map((photo) => (
                <figure key={photo.image}>
                  <img
                    src={sitePath(`/work/koverta/${photo.image}.webp`)}
                    alt={copy === 0 ? photo.caption : ""}
                    width={800}
                    height={600}
                    loading="lazy"
                  />
                  <figcaption>{photo.caption}</figcaption>
                </figure>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
