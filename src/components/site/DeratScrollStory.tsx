import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const frames = [
  {
    src: `${import.meta.env.BASE_URL}work/derat/01-home.webp`,
    label: "Jasný vstup do služby",
    alt: "Mobilná domovská stránka DERAT s úvodom Bez škodcov",
  },
  {
    src: `${import.meta.env.BASE_URL}work/derat/02-service.webp`,
    label: "Výber typu zásahu",
    alt: "Prvý krok kalkulačky DERAT s výberom služby",
  },
  {
    src: `${import.meta.env.BASE_URL}work/derat/03-pest.webp`,
    label: "Konkrétny problém",
    alt: "Druhý krok kalkulačky DERAT s výberom škodcu",
  },
  {
    src: `${import.meta.env.BASE_URL}work/derat/04-space.webp`,
    label: "Typ priestoru",
    alt: "Tretí krok kalkulačky DERAT s výberom priestoru",
  },
  {
    src: `${import.meta.env.BASE_URL}work/derat/05-area.webp`,
    label: "Rozsah zásahu",
    alt: "Štvrtý krok kalkulačky DERAT s nastavením rozlohy",
  },
  {
    src: `${import.meta.env.BASE_URL}work/derat/06-intensity.webp`,
    label: "Miera výskytu",
    alt: "Piaty krok kalkulačky DERAT s výberom intenzity výskytu",
  },
  {
    src: `${import.meta.env.BASE_URL}work/derat/07-location.webp`,
    label: "Lokalita a termín",
    alt: "Šiesty krok kalkulačky DERAT s lokalitou a termínom",
  },
  {
    src: `${import.meta.env.BASE_URL}work/derat/08-result.webp`,
    label: "Cena a hotový dopyt",
    alt: "Výsledok kalkulačky DERAT s cenou a číslom dopytu",
  },
];

const chapters = [
  {
    eyebrow: "01 · Problém zachytený",
    title: "Návštevník označí škodcu tak, ako ho pozná.",
    copy: "Z domovskej stránky prejde priamo do výberu služby a problému. Nemusí hľadať správny odborný výraz ani cenník v PDF.",
  },
  {
    eyebrow: "02 · Cielené otázky",
    title: "Každá odpoveď pripraví iba relevantný ďalší krok.",
    copy: "Priestor, rozloha, intenzita a termín sa pýtajú postupne. Krátky tok skladá všetky podklady bez dlhého formulára.",
  },
  {
    eyebrow: "03 · Cena a kontakt",
    title: "Zákazník dostane odhad. Firma dostane hotový dopyt.",
    copy: "Výsledok obsahuje cenu, službu, priestor, lokalitu aj číslo dopytu. Obchodník môže pokračovať bez opakovania základných otázok.",
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
      const dots = gsap.utils.toArray<HTMLElement>("[data-case-dot]", root);
      const progress = root.querySelector<HTMLElement>("[data-case-progress]");
      const story = root.querySelector<HTMLElement>(".case-story-desktop");
      if (!story || !images.length) return;

      gsap.set(images, { autoAlpha: 0, zIndex: 1, clipPath: "inset(0 0 0 0)" });
      gsap.set(captions, { autoAlpha: 0, x: 0 });
      gsap.set(dots, { opacity: 0.32, scale: 1 });
      gsap.set(images[0], { autoAlpha: 1, zIndex: 2 });
      gsap.set(captions[0], { autoAlpha: 1 });
      gsap.set(dots[0], { opacity: 1, scale: 1.35 });
      if (progress) gsap.set(progress, { scaleX: 0.125, transformOrigin: "left center" });

      let activeIndex = 0;
      const showFrame = (nextIndex: number, direction: number) => {
        if (nextIndex === activeIndex) return;

        gsap.killTweensOf([
          images[activeIndex],
          images[nextIndex],
          captions[activeIndex],
          captions[nextIndex],
        ]);
        gsap.set(images[activeIndex], { autoAlpha: 0, zIndex: 1, clipPath: "inset(0 0 0 0)" });
        gsap.set(captions[activeIndex], { autoAlpha: 0, x: 0 });
        gsap.set(dots, { opacity: 0.32, scale: 1 });

        gsap.fromTo(
          images[nextIndex],
          {
            autoAlpha: 1,
            zIndex: 2,
            clipPath: direction >= 0 ? "inset(0 0 0 9%)" : "inset(0 9% 0 0)",
          },
          { clipPath: "inset(0 0 0 0)", duration: 0.2, ease: "power2.out" },
        );
        gsap.fromTo(
          captions[nextIndex],
          { autoAlpha: 0, x: direction >= 0 ? 12 : -12 },
          { autoAlpha: 1, x: 0, duration: 0.24, ease: "power2.out" },
        );
        gsap.set(dots[nextIndex], { opacity: 1, scale: 1.35 });
        activeIndex = nextIndex;
      };

      const trigger = ScrollTrigger.create({
        trigger: story,
        start: "top top+=96",
        end: "bottom bottom-=96",
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const nextIndex = Math.min(images.length - 1, Math.floor(self.progress * images.length));
          showFrame(nextIndex, self.direction);
          if (progress) gsap.set(progress, { scaleX: (nextIndex + 1) / images.length });
        },
      });

      return () => trigger.kill();
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
          <p className="case-kicker">DERAT · reálny tok zákazníka</p>
          <h2 id="derat-story-title">Od problému so škodcom po cenu a kontakt.</h2>
        </div>
        <div className="case-heading-aside">
          <p>
            Kalkulačka a asistent v jednom rozhraní. Cielené otázky určia škodcu, priestor, termín
            aj orientačnú cenu — bez opakovaného zisťovania pri telefonáte.
          </p>
          <a href="https://derat-chatbot-backend.vercel.app/" target="_blank" rel="noreferrer">
            Vyskúšať živý DERAT widget <span aria-hidden="true">↗</span>
          </a>
        </div>
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
            <div className="case-frame-dots" aria-hidden="true">
              {frames.map((frame) => (
                <i data-case-dot key={frame.label} />
              ))}
            </div>
            <div className="case-media-stack">
              {frames.map((frame, index) => (
                <figure data-case-frame className="case-frame" key={frame.src}>
                  <img
                    src={frame.src}
                    alt={frame.alt}
                    width="900"
                    height="1200"
                    loading="eager"
                    fetchPriority={index < 2 ? "high" : "auto"}
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
