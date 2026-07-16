import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./DeratScrollStory.css";

const frames = [
  {
    src: `${import.meta.env.BASE_URL}work/derat-v2/01-entry.webp`,
    label: "Jasný vstup do služby",
    alt: "Mobilná ukážka domovskej stránky DERAT s úvodom Bez škodcov",
  },
  {
    src: `${import.meta.env.BASE_URL}work/derat-v2/02-problem.webp`,
    label: "Konkrétny problém",
    alt: "Mobilná ukážka kalkulačky DERAT s výberom druhu škodcu",
  },
  {
    src: `${import.meta.env.BASE_URL}work/derat-v2/03-scope.webp`,
    label: "Rozsah zásahu",
    alt: "Mobilná ukážka kalkulačky DERAT s nastavením rozlohy 70 metrov štvorcových",
  },
  {
    src: `${import.meta.env.BASE_URL}work/derat-v2/04-result.webp`,
    label: "Cena a hotový dopyt",
    alt: "Mobilná ukážka výsledku kalkulačky DERAT s odhadovanou cenou",
  },
];

const chapters = [
  {
    eyebrow: "01 / Prvý kontakt",
    title: "Návštevník okamžite vie, čo má urobiť.",
    copy: "Z problému prejde priamo do krátkeho výpočtu. Bez hľadania cenníka a bez telefonátu naslepo.",
  },
  {
    eyebrow: "02 / Presná otázka",
    title: "Vyberie škodcu tak, ako ho pozná.",
    copy: "Jednoduché možnosti odstránia neistotu. Systém zobrazí iba ďalšiu otázku, ktorá je pre daný zásah dôležitá.",
  },
  {
    eyebrow: "03 / Rozsah zásahu",
    title: "Odhad vzniká z konkrétnych odpovedí.",
    copy: "Rozloha, priestor aj intenzita sa ukladajú priebežne. Zákazník nič nevypĺňa dvakrát.",
  },
  {
    eyebrow: "04 / Pripravený dopyt",
    title: "Zákazník dostane odhad. Firma celý kontext.",
    copy: "Služba, lokalita aj kontakt prídu spolu. Tím môže rovno potvrdiť termín namiesto opakovaného zisťovania údajov.",
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
      const story = root.querySelector<HTMLElement>("[data-derat-story]");
      const frameElements = gsap.utils.toArray<HTMLElement>("[data-derat-frame]", root);
      const copySteps = gsap.utils.toArray<HTMLElement>("[data-derat-copy]", root);
      const progress = root.querySelector<HTMLElement>("[data-derat-progress]");
      if (
        !story ||
        frameElements.length !== chapters.length ||
        copySteps.length !== chapters.length
      ) {
        return;
      }

      const context = gsap.context(() => {
        gsap.set(frameElements, { autoAlpha: 0, scale: 1.018 });
        gsap.set(frameElements[0], { autoAlpha: 1, scale: 1 });
        gsap.set(copySteps, { opacity: 0.28, y: 12 });
        gsap.set(copySteps[0], { opacity: 1, y: 0 });
        if (progress) gsap.set(progress, { scaleX: 0, transformOrigin: "left center" });

        const timeline = gsap.timeline({
          defaults: { overwrite: "auto" },
          scrollTrigger: {
            trigger: story,
            start: "top top+=104",
            end: "bottom bottom-=64",
            scrub: 0.55,
            invalidateOnRefresh: true,
          },
        });

        timeline.to({}, { duration: frameElements.length }, 0);

        frameElements.slice(1).forEach((frame, index) => {
          const nextIndex = index + 1;
          const transitionAt = nextIndex - 0.2;

          timeline
            .to(
              frameElements[index],
              { autoAlpha: 0, scale: 0.986, duration: 0.42, ease: "power2.inOut" },
              transitionAt,
            )
            .fromTo(
              frame,
              { autoAlpha: 0, scale: 1.018 },
              { autoAlpha: 1, scale: 1, duration: 0.42, ease: "power2.inOut" },
              transitionAt,
            )
            .to(
              copySteps[index],
              { opacity: 0.28, y: -10, duration: 0.34, ease: "power2.inOut" },
              transitionAt,
            )
            .fromTo(
              copySteps[nextIndex],
              { opacity: 0.28, y: 12 },
              { opacity: 1, y: 0, duration: 0.38, ease: "power2.out" },
              transitionAt + 0.04,
            );
        });

        if (progress) {
          timeline.fromTo(
            progress,
            { scaleX: 0 },
            { scaleX: 1, duration: frameElements.length, ease: "none" },
            0,
          );
        }
      }, root);

      return () => {
        context.revert();
      };
    });

    return () => media.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      id="realizacie"
      className="derat-story"
      aria-labelledby="derat-story-title"
    >
      <header className="container-page derat-story__heading">
        <div>
          <p className="derat-story__kicker">DERAT / reálna realizácia</p>
          <h2 id="derat-story-title">Štyri odpovede. Jeden pripravený dopyt.</h2>
        </div>
        <div className="derat-story__intro">
          <p>Ukážka cesty, ktorá premení neistotu návštevníka na použiteľné zadanie pre firmu.</p>
          <a href="https://derat-chatbot-backend.vercel.app/" target="_blank" rel="noreferrer">
            Otvoriť živý DERAT <span aria-hidden="true">↗</span>
          </a>
        </div>
      </header>

      <div className="container-page derat-story__desktop" data-derat-story>
        <div className="derat-story__visual">
          <div className="derat-story__visual-stick">
            <div className="derat-story__stage">
              {frames.map((frame) => (
                <figure data-derat-frame className="derat-story__frame" key={frame.src}>
                  <img
                    src={frame.src}
                    alt={frame.alt}
                    width="1086"
                    height="1448"
                    loading="lazy"
                    fetchPriority="low"
                    decoding="async"
                  />
                  <figcaption className="sr-only">{frame.label}</figcaption>
                </figure>
              ))}
            </div>
            <div className="derat-story__progress" aria-hidden="true">
              <span data-derat-progress />
            </div>
          </div>
        </div>

        <ol className="derat-story__copy-list">
          {chapters.map((chapter) => (
            <li data-derat-copy className="derat-story__copy-step" key={chapter.title}>
              <p className="derat-story__kicker">{chapter.eyebrow}</p>
              <h3>{chapter.title}</h3>
              <p>{chapter.copy}</p>
            </li>
          ))}
        </ol>
      </div>

      <div className="derat-story__mobile" aria-label="Obrazovky kalkulačky DERAT">
        {frames.map((frame, index) => (
          <article className="derat-story__mobile-slide" key={frame.src}>
            <figure>
              <img
                src={frame.src}
                alt={frame.alt}
                width="1086"
                height="1448"
                loading="lazy"
                fetchPriority="low"
                decoding="async"
              />
            </figure>
            <div className="derat-story__mobile-copy">
              <p className="derat-story__kicker">{chapters[index].eyebrow}</p>
              <h3>{chapters[index].title}</h3>
              <p>{chapters[index].copy}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
