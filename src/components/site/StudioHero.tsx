import { ArrowUpRight } from "lucide-react";
import { useEffect, useRef, type CSSProperties } from "react";
import styles from "./StudioHome.module.css";
import actions from "./WebsiteAction.module.css";
import fit from "./StudioHero.module.css";
const BASE = import.meta.env.BASE_URL;

const heroProjects = [
  {
    slug: "koverta",
    name: "Koverta",
    href: "https://koverta.sk/",
    image: `${BASE}work/live/koverta.webp`,
    alt: "Domovská stránka Koverta s pergolou nad terasou",
  },
  {
    slug: "derat",
    name: "DERAT",
    href: "https://derat.sk/",
    image: `${BASE}work/live/derat.webp`,
    alt: "Domovská stránka DERAT s nadpisom Bez škodcov",
  },
  {
    slug: "mojplot",
    name: "Môj Plot",
    href: "https://mojplot.sk/",
    image: `${BASE}work/live/mojplot.webp`,
    alt: "Domovská stránka Môj Plot s kategóriami plotov",
  },
] as const;

export function StudioHero() {
  const heroRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const header = document.querySelector(".redesign-header");
    if (!header) return;
    const resize = () =>
      heroRef.current?.style.setProperty(
        "--hero-header-height",
        `${header.getBoundingClientRect().height}px`,
      );
    const observer = new ResizeObserver(resize);
    observer.observe(header);
    resize();
    return () => observer.disconnect();
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
            <span>Chatboty a</span>
            <em>konfigurátory</em>
            <em>na mieru.</em>
          </h1>
          <div className={`${styles.collage} ${fit.collage}`} aria-label="Vybrané živé realizácie">
            {heroProjects.map((project, index) => (
              <a
                key={project.slug}
                className={`${styles.heroCase} ${fit.case}`}
                href={project.href}
                target="_blank"
                rel="noreferrer"
                data-cursor="Otvoriť web"
                style={{ "--case": index } as CSSProperties}
              >
                <img
                  src={project.image}
                  srcSet={`${BASE}work/live/${project.slug}-640.webp 640w, ${BASE}work/live/${project.slug}-1000.webp 1000w, ${project.image} 1600w`}
                  sizes="(max-width: 767px) 74vw, (max-width: 1100px) 40vw, 38vw"
                  alt={project.alt}
                  width={1600}
                  height={1000}
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
          <a href="#riesenia" className={`${actions.action} ${actions.lime}`}>
            Vybrať riešenie <ArrowUpRight size={17} aria-hidden="true" />
          </a>
        </div>
      </section>
    </div>
  );
}
