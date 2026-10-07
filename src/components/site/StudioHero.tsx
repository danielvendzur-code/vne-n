import { ArrowUpRight } from "lucide-react";
import { useEffect, useRef, type CSSProperties } from "react";
import styles from "./StudioHome.module.css";

import fit from "./StudioHero.module.css";
const BASE = import.meta.env.BASE_URL;

const heroProjects = [
  {
    slug: "derat-chat",
    name: "DERAT",
    href: "https://derat.sk/",
    image: `${BASE}work/live/derat-chat.webp`,
    alt: "Web DERAT s otvoreným chatbotom",
  },
  {
    slug: "mojplot-chat",
    name: "Môj Plot",
    href: "https://mojplot.sk/",
    image: `${BASE}work/live/mojplot-chat.webp`,
    alt: "Web Môj Plot s pôvodným chatbotom",
  },
  {
    slug: "koverta-chat",
    name: "Koverta",
    href: "https://koverta.sk/",
    image: `${BASE}work/live/koverta-chat.webp`,
    alt: "Web Koverta s otvoreným poradcom",
  },
] as const;

export function StudioHero() {
  const heroRef = useRef<HTMLElement>(null);
  useEffect(() => {
    let second = 0;
    const first = requestAnimationFrame(() => {
      second = requestAnimationFrame(() =>
        heroRef.current?.setAttribute("data-headline-ready", "true"),
      );
    });
    return () => {
      cancelAnimationFrame(first);
      cancelAnimationFrame(second);
    };
  }, []);
  useEffect(() => {
    const resize = () => {
      const hero = heroRef.current;
      if (!hero) return;
      const top = hero.getBoundingClientRect().top + window.scrollY;
      hero.style.setProperty("--hero-header-height", `${Math.max(0, top)}px`);
    };
    const frame = requestAnimationFrame(resize);
    const header = document.querySelector(".redesign-header");
    const observer = new ResizeObserver(resize);
    if (header) observer.observe(header);
    window.addEventListener("resize", resize);
    resize();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", resize);
    };
  }, []);
  return (
    <div className={styles.home}>
      <section
        ref={heroRef}
        id="top"
        className={`${styles.hero} ${fit.hero}`}
        aria-labelledby="hybrid-hero-title"
        data-nav-tone="dark"
        data-viewport-hero
      >
        <div className={`${styles.heroStage} ${fit.stage}`}>
          <h1 id="hybrid-hero-title" aria-label="Chatboty a konfigurátory na mieru pre váš web.">
            {["Chatboty a", "konfigurátory", "na mieru."].map((line, lineIndex) => (
              <span
                className={fit.headlineLine}
                key={line}
                aria-hidden="true"
                data-accent={lineIndex > 0}
              >
                {Array.from(line).map((letter, index) => (
                  <span
                    key={index}
                    className={fit.headlineGlyph}
                    style={
                      {
                        "--letter-delay": `${160 + ([0, 10, 23][lineIndex] + index) * 52}ms`,
                      } as CSSProperties
                    }
                  >
                    {letter === " " ? "\u00a0" : letter}
                  </span>
                ))}
              </span>
            ))}
          </h1>
          <div
            className={`${styles.collage} ${fit.collage}`}
            aria-label="Vybrané projekty a ukážky nástrojov"
          >
            {heroProjects.map((project, index) => (
              <a
                key={project.slug}
                className={`${styles.heroCase} ${fit.case}`}
                href={project.href}
                target="_blank"
                rel="noreferrer"
                style={{ "--case": index } as CSSProperties}
              >
                <img
                  src={project.image}
                  srcSet={`${BASE}work/live/${project.slug}-640.webp 640w, ${BASE}work/live/${project.slug}-1000.webp 1000w, ${project.image} 1600w`}
                  sizes="(max-width: 767px) 74vw, (max-width: 1100px) 40vw, 38vw"
                  alt={project.alt}
                  width={project.slug === "mojplot-chat" ? 2200 : 1600}
                  height={project.slug === "mojplot-chat" ? 1480 : 1000}
                  loading="eager"
                  decoding="async"
                  fetchPriority={index === 0 ? "high" : "auto"}
                />
                <span>
                  0{index + 1} / {project.name} <ArrowUpRight size={14} aria-hidden="true" />
                </span>
              </a>
            ))}
          </div>
        </div>
        <div className={`${styles.heroBottom} ${fit.bottom}`}>
          <p>
            Chatbot odpovie. Kalkulačka spočíta cenu. Konfigurátor vyskladá produkt. Váš web pomôže
            zákazníkovi urobiť ďalší krok.
          </p>
          <button
            type="button"
            className="mc-btn mc-btn--on-dark"
            onClick={() =>
              window.dispatchEvent(
                new CustomEvent("site-assistant:open", { detail: { entry: "builder" } }),
              )
            }
          >
            Vyskladať riešenie <span aria-hidden="true">→</span>
          </button>
        </div>
      </section>
    </div>
  );
}
