import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./DeratScrollStory.css";
import "./DeratScrollStoryMobile.css";

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
  const progressValue = useMotionValue(0);
  const springProgress = useSpring(progressValue, {
    stiffness: 190,
    damping: 31,
    mass: 0.6,
  });

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const pendingImages: HTMLImageElement[] = [];
    const preloadStoryFrames = () => {
      frames.forEach((frame) => {
        const image = new Image();
        image.decoding = "async";
        image.src = frame.src;
        pendingImages.push(image);
      });
    };

    if (!("IntersectionObserver" in window)) {
      preloadStoryFrames();
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        preloadStoryFrames();
        observer.disconnect();
      },
      { rootMargin: "900px 0px" },
    );
    observer.observe(root);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();

    media.add("(min-width: 900px) and (prefers-reduced-motion: no-preference)", () => {
      const story = root.querySelector<HTMLElement>("[data-derat-story]");
      const frameElements = gsap.utils.toArray<HTMLElement>("[data-derat-frame]", root);
      const copySteps = gsap.utils.toArray<HTMLElement>("[data-derat-copy]", root);
      if (
        !story ||
        frameElements.length !== chapters.length ||
        copySteps.length !== chapters.length
      ) {
        return;
      }

      const context = gsap.context(() => {
        gsap.set(frameElements, { autoAlpha: 0, scale: 1.008 });
        gsap.set(frameElements[0], { autoAlpha: 1, scale: 1 });
        gsap.set(copySteps, { opacity: 0.62, y: 18 });
        gsap.set(copySteps[0], { opacity: 1, y: 0 });

        const timeline = gsap.timeline({
          defaults: { overwrite: "auto" },
          scrollTrigger: {
            trigger: story,
            start: "top top+=104",
            end: "bottom bottom-=64",
            scrub: 0.72,
            invalidateOnRefresh: true,
            onUpdate: (self) => progressValue.set(self.progress),
          },
        });

        timeline.to({}, { duration: frameElements.length }, 0);

        frameElements.slice(1).forEach((frame, index) => {
          const nextIndex = index + 1;
          const transitionAt = nextIndex - 0.28;

          timeline
            .to(
              frameElements[index],
              { autoAlpha: 0, scale: 0.994, duration: 0.72, ease: "power1.inOut" },
              transitionAt,
            )
            .fromTo(
              frame,
              { autoAlpha: 0, scale: 1.008 },
              { autoAlpha: 1, scale: 1, duration: 0.72, ease: "power1.inOut" },
              transitionAt,
            )
            .to(
              copySteps[index],
              { opacity: 0.56, y: -18, duration: 0.58, ease: "power2.inOut" },
              transitionAt,
            )
            .fromTo(
              copySteps[nextIndex],
              { opacity: 0.56, y: 18 },
              { opacity: 1, y: 0, duration: 0.64, ease: "power2.out" },
              transitionAt + 0.05,
            );
        });
      }, root);

      return () => {
        progressValue.set(0);
        context.revert();
      };
    });

    return () => media.revert();
  }, [progressValue]);

  return (
    <section
      ref={rootRef}
      id="realizacie"
      className="derat-story"
      aria-labelledby="derat-story-title"
    >
      <header className="container-page derat-story__heading">
        <div>
          <p className="derat-story__kicker">Príklad realizácie · DERAT</p>
          <h2 id="derat-story-title">Kalkulačka, ktorá z návštevníka spraví pripravený dopyt.</h2>
        </div>
        <div className="derat-story__intro">
          <p>
            Reálny projekt pre deratizačnú službu: štyri otázky premenia neistotu zákazníka na
            konkrétne zadanie s cenou aj kontaktom.
          </p>
          <a href="https://derat-chatbot-backend.vercel.app/" target="_blank" rel="noreferrer">
            Otvoriť živý projekt <span aria-hidden="true">↗</span>
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
              <motion.span style={{ scaleX: springProgress }} />
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

      <div className="derat-story__mobile" aria-label="Kroky kalkulačky DERAT">
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
