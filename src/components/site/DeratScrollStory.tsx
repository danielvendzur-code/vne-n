import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const frames = [
  {
    src: `${import.meta.env.BASE_URL}work/derat-v2/01-entry.webp`,
    label: "Jasný vstup do služby",
    alt: "Prémiový mobilný mockup domovskej stránky DERAT s úvodom Bez škodcov",
  },
  {
    src: `${import.meta.env.BASE_URL}work/derat-v2/02-problem.webp`,
    label: "Konkrétny problém",
    alt: "Prémiový mobilný mockup kalkulačky DERAT s výberom škodcu",
  },
  {
    src: `${import.meta.env.BASE_URL}work/derat-v2/03-scope.webp`,
    label: "Rozsah zásahu",
    alt: "Prémiový mobilný mockup kalkulačky DERAT s nastavením rozlohy 70 metrov štvorcových",
  },
  {
    src: `${import.meta.env.BASE_URL}work/derat-v2/04-result.webp`,
    label: "Cena a hotový dopyt",
    alt: "Prémiový mobilný mockup výsledku kalkulačky DERAT s cenou 99 eur bez DPH",
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
      const photos = gsap.utils.toArray<HTMLElement>("[data-case-photo]", root);
      const captions = gsap.utils.toArray<HTMLElement>("[data-case-caption]", root);
      const dots = gsap.utils.toArray<HTMLElement>("[data-case-dot]", root);
      const copySteps = gsap.utils.toArray<HTMLElement>(".case-copy-step", root);
      const progress = root.querySelector<HTMLElement>("[data-case-progress]");
      const story = root.querySelector<HTMLElement>(".case-story-desktop");
      if (!story || !images.length) return;

      gsap.set(images, { autoAlpha: 0, zIndex: 1, scale: 0.992 });
      gsap.set(photos, { yPercent: 0, scale: 1 });
      gsap.set(captions, { autoAlpha: 0, y: 8 });
      gsap.set(dots, { opacity: 0.26, scaleX: 1, transformOrigin: "center" });
      gsap.set(copySteps, { opacity: 0.32, y: 12 });
      gsap.set(images[0], { autoAlpha: 1, zIndex: 2, scale: 1 });
      gsap.set(captions[0], { autoAlpha: 1, y: 0 });
      gsap.set(dots[0], { opacity: 1, scaleX: 2.8 });
      gsap.set(copySteps[0], { opacity: 1, y: 0 });
      if (progress) gsap.set(progress, { scaleX: 0.04, transformOrigin: "left center" });

      const timeline = gsap.timeline({
        defaults: { ease: "power3.inOut" },
        scrollTrigger: {
          trigger: story,
          start: "top top+=96",
          end: "bottom bottom-=96",
          scrub: 0.62,
          invalidateOnRefresh: true,
        },
      });

      timeline.to({}, { duration: 0.55 });

      images.slice(1).forEach((image, index) => {
        const previousIndex = index;
        const nextIndex = index + 1;
        const at = 0.55 + index * 1.15;
        const nextChapter = Math.min(
          copySteps.length - 1,
          Math.round((nextIndex / (images.length - 1)) * (copySteps.length - 1)),
        );
        const previousChapter = Math.min(
          copySteps.length - 1,
          Math.round((previousIndex / (images.length - 1)) * (copySteps.length - 1)),
        );

        timeline
          .to(images[previousIndex], { autoAlpha: 0, scale: 0.992, duration: 0.48, zIndex: 1 }, at)
          .fromTo(
            image,
            { autoAlpha: 0, scale: 1.014, zIndex: 3 },
            { autoAlpha: 1, scale: 1, duration: 0.56, zIndex: 2 },
            at,
          )
          .fromTo(photos[nextIndex], { yPercent: 1.4 }, { yPercent: 0, duration: 0.58 }, at)
          .to(captions[previousIndex], { autoAlpha: 0, y: -6, duration: 0.28 }, at)
          .to(captions[nextIndex], { autoAlpha: 1, y: 0, duration: 0.42 }, at + 0.08)
          .to(dots[previousIndex], { opacity: 0.26, scaleX: 1, duration: 0.28 }, at)
          .to(dots[nextIndex], { opacity: 1, scaleX: 2.8, duration: 0.36 }, at + 0.05);

        if (nextChapter !== previousChapter) {
          timeline
            .to(copySteps[previousChapter], { opacity: 0.32, y: -10, duration: 0.34 }, at)
            .to(copySteps[nextChapter], { opacity: 1, y: 0, duration: 0.48 }, at + 0.05);
        }
      });

      timeline.to({}, { duration: 0.65 });
      if (progress) {
        timeline.fromTo(
          progress,
          { scaleX: 0.04 },
          { scaleX: 1, duration: timeline.duration(), ease: "none" },
          0,
        );
      }

      return () => timeline.kill();
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
                  <div className="case-frame-photo" data-case-photo>
                    <img
                      src={frame.src}
                      alt={frame.alt}
                      width="1086"
                      height="1448"
                      loading="eager"
                      fetchPriority={index < 2 ? "high" : "auto"}
                      decoding="async"
                    />
                  </div>
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
              <span>{String(frames.length).padStart(2, "0")}</span>
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
              width="1086"
              height="1448"
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
