import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const frames = [
  {
    src: "/work/derat/01-home.webp",
    label: "Jasný vstup do služby",
    alt: "Mobilná domovská stránka DERAT s úvodom Bez škodcov",
  },
  {
    src: "/work/derat/02-service.webp",
    label: "Výber typu zásahu",
    alt: "Prvý krok kalkulačky DERAT s výberom služby",
  },
  {
    src: "/work/derat/03-pest.webp",
    label: "Konkrétny problém",
    alt: "Druhý krok kalkulačky DERAT s výberom škodcu",
  },
  {
    src: "/work/derat/04-space.webp",
    label: "Typ priestoru",
    alt: "Tretí krok kalkulačky DERAT s výberom priestoru",
  },
  {
    src: "/work/derat/05-area.webp",
    label: "Rozsah zásahu",
    alt: "Štvrtý krok kalkulačky DERAT s nastavením rozlohy",
  },
  {
    src: "/work/derat/06-intensity.webp",
    label: "Miera výskytu",
    alt: "Piaty krok kalkulačky DERAT s výberom intenzity výskytu",
  },
  {
    src: "/work/derat/07-location.webp",
    label: "Lokalita a termín",
    alt: "Šiesty krok kalkulačky DERAT s lokalitou a termínom",
  },
  {
    src: "/work/derat/08-result.webp",
    label: "Cena a hotový dopyt",
    alt: "Výsledok kalkulačky DERAT s cenou a číslom dopytu",
  },
];

const chapters = [
  {
    eyebrow: "Začína sa to jednoducho",
    title: "Návštevník nemusí poznať správny odborný výraz.",
    copy: "Vyberie službu a označí problém tak, ako ho vidí. Rozhranie ukazuje iba možnosti, ktoré sú v danom kroku užitočné.",
  },
  {
    eyebrow: "Otázky majú poradie",
    title: "Každá odpoveď spresní ďalšiu otázku.",
    copy: "Typ priestoru, rozloha a miera výskytu sa nepýtajú naraz. Krátky tok znižuje neistotu a zároveň skladá podklady pre výpočet.",
  },
  {
    eyebrow: "Pravidlá firmy v rozhraní",
    title: "Cena vzniká z reálnych vstupov, nie z odhadu vo formulári.",
    copy: "Lokalita, deň zásahu a rozsah sa premietnu do orientačnej ceny. Zákazník vidí, čo výsledok ovplyvnilo.",
  },
  {
    eyebrow: "Výsledok pre obe strany",
    title: "Zákazník dostane ďalší krok. Firma dostane použiteľný dopyt.",
    copy: "Na konci je cena, zhrnutie služby, priestoru, lokality a vlastné číslo dopytu — bez opätovného zisťovania základných údajov.",
  },
];

export function DeratScrollStory() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();

    media.add("(min-width: 900px) and (prefers-reduced-motion: no-preference)", () => {
      const images = gsap.utils.toArray<HTMLElement>("[data-case-frame]", root);
      const captions = gsap.utils.toArray<HTMLElement>("[data-case-caption]", root);
      const progress = root.querySelector<HTMLElement>("[data-case-progress]");

      gsap.set(images, { autoAlpha: 0, scale: 1.035, yPercent: 3 });
      gsap.set(captions, { autoAlpha: 0, y: 8 });
      gsap.set(images[0], { autoAlpha: 1, scale: 1, yPercent: 0 });
      gsap.set(captions[0], { autoAlpha: 1, y: 0 });
      if (progress) gsap.set(progress, { scaleX: 0.125, transformOrigin: "left center" });

      const timeline = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: root,
          start: "top top+=72",
          end: "bottom bottom-=72",
          scrub: 0.45,
          invalidateOnRefresh: true,
        },
      });

      for (let i = 1; i < images.length; i += 1) {
        const at = i - 1;
        timeline
          .to(images[i - 1], { autoAlpha: 0, scale: 0.955, yPercent: -2, duration: 0.62 }, at)
          .to(captions[i - 1], { autoAlpha: 0, y: -8, duration: 0.3 }, at)
          .fromTo(
            images[i],
            { autoAlpha: 0, scale: 1.035, yPercent: 3 },
            { autoAlpha: 1, scale: 1, yPercent: 0, duration: 0.62 },
            at,
          )
          .fromTo(
            captions[i],
            { autoAlpha: 0, y: 8 },
            { autoAlpha: 1, y: 0, duration: 0.3 },
            at + 0.15,
          );
      }

      if (progress) {
        timeline.to(progress, { scaleX: 1, duration: frames.length - 1 }, 0);
      }

      return () => timeline.scrollTrigger?.kill();
    });

    return () => media.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      id="realizacie"
      className="case-study"
      aria-labelledby="derat-story-title"
    >
      <div className="container-page case-study-heading">
        <div>
          <p className="case-kicker">DERAT · produktová ukážka</p>
          <h2 id="derat-story-title">Od prvej voľby po dopyt, s ktorým sa dá pracovať.</h2>
        </div>
        <p>
          Kalkulačka a asistent v jednom rozhraní. Osem obrazoviek tvorí jeden súvislý tok — bez
          preskakovania do formulára na konci.
        </p>
      </div>

      <div className="container-page case-story-desktop">
        <ol className="case-copy-list">
          {chapters.map((chapter, index) => (
            <li className="case-copy-step" key={chapter.title}>
              <div className="case-step-number" aria-hidden="true">
                0{index + 1}
              </div>
              <p className="case-kicker">{chapter.eyebrow}</p>
              <h3>{chapter.title}</h3>
              <p>{chapter.copy}</p>
            </li>
          ))}
        </ol>

        <div className="case-visual-column">
          <div className="case-stage">
            <div className="case-stage-topline">
              <span>DERAT</span>
              <span>Kalkulačka + AI asistent</span>
            </div>
            <div className="case-progress-track" aria-hidden="true">
              <span data-case-progress />
            </div>
            <div className="case-media-stack">
              {frames.map((frame, index) => (
                <figure data-case-frame className="case-frame" key={frame.src}>
                  <img
                    src={frame.src}
                    alt={frame.alt}
                    width="900"
                    height="1200"
                    loading={index === 0 ? "eager" : "lazy"}
                    decoding="async"
                  />
                </figure>
              ))}
            </div>
            <div className="case-stage-footer" aria-live="off">
              <div className="case-caption-stack">
                {frames.map((frame, index) => (
                  <p data-case-caption key={frame.label}>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    {frame.label}
                  </p>
                ))}
              </div>
              <span>08</span>
            </div>
          </div>
        </div>
      </div>

      <div className="case-mobile-gallery" aria-label="Obrazovky kalkulačky DERAT">
        {frames.map((frame, index) => (
          <figure key={frame.src}>
            <img
              src={frame.src}
              alt={frame.alt}
              width="900"
              height="1200"
              loading="lazy"
              decoding="async"
            />
            <figcaption>
              <span>{String(index + 1).padStart(2, "0")}</span>
              {frame.label}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

const selectedWork = [
  {
    name: "moj.chatbot.backend",
    type: "Interaktívny prototyp",
    description:
      "Samostatný webový asistent s chameleónom, lokálnou konverzáciou, kalkulačkou a pripraveným integračným API.",
    href: "https://danielvendzur-code.github.io/moj.chatbot.backend/",
    github: "https://github.com/danielvendzur-code/moj.chatbot.backend",
    tone: "green",
  },
  {
    name: "koverta.sk",
    type: "Produktový web",
    description:
      "Ponuka prístreškov, pergol a riešení pre dom a záhradu s jasnou cestou od kategórie k dopytu.",
    href: "https://koverta.sk/",
    tone: "clay",
  },
  {
    name: "webko.sk",
    type: "Predajná prezentácia",
    description:
      "Web pre tvorbu stránok na mieru, ktorý vysvetľuje rozsah služby a vedie návštevníka ku konkrétnemu zadaniu.",
    href: "https://webko.sk/",
    tone: "gold",
  },
  {
    name: "mojplot.sk",
    type: "E-shop a katalóg",
    description:
      "Rozsiahly sortiment plotov, brán a príslušenstva s produktovými variantmi, montážou a praktickým výberom.",
    href: "https://mojplot.sk/",
    tone: "ink",
  },
] as const;

export function SelectedWork() {
  return (
    <section className="selected-work" aria-labelledby="selected-work-title">
      <div className="container-page">
        <div className="selected-work-heading">
          <div>
            <p className="case-kicker">Ďalšie realizácie a prototypy</p>
            <h2 id="selected-work-title">Rôzne typy webov. Rovnaký dôraz na jasný ďalší krok.</h2>
          </div>
          <p>
            Krátky výber verejných projektov — od produktového webu cez e-shop až po samostatný
            asistenčný widget.
          </p>
        </div>

        <div className="work-accordion">
          {selectedWork.map((item, index) => (
            <article className={`work-panel work-panel-${item.tone}`} key={item.name}>
              <div className="work-panel-index" aria-hidden="true">
                0{index + 1}
              </div>
              <div className="work-panel-graphic" aria-hidden="true">
                <span />
                <span />
                <span />
              </div>
              <div className="work-panel-content">
                <p>{item.type}</p>
                <h3>{item.name}</h3>
                <div className="work-panel-detail">
                  <p>{item.description}</p>
                  <div className="work-panel-links">
                    <a href={item.href} target="_blank" rel="noreferrer">
                      Otvoriť projekt <span aria-hidden="true">↗</span>
                    </a>
                    {"github" in item && item.github ? (
                      <a
                        href={item.github}
                        target="_blank"
                        rel="noreferrer"
                        className="work-source-link"
                      >
                        GitHub <span aria-hidden="true">↗</span>
                      </a>
                    ) : null}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
