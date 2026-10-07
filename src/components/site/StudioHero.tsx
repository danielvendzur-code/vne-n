import { ArrowUpRight } from "lucide-react";
import { useEffect, useRef, type CSSProperties } from "react";
import styles from "./StudioHome.module.css";

import fit from "./StudioHero.module.css";
import { ProductPreview } from "./redesign/ProductPreview";
import { sitePath } from "./redesign/utils";

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
                      { "--letter-delay": `${lineIndex * 180 + index * 32}ms` } as CSSProperties
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
            aria-label="Ukážka chatbota WEBKO a výpočtu Môj Plot"
          >
            <a
              className={fit.liveCase}
              href={sitePath("/nastroj?t=chatbot")}
              aria-label="Pozrieť chatbot WEBKO"
            >
              <ProductPreview client="WEBKO" compact />
            </a>
            <a
              className={fit.priceCard}
              href={sitePath("/nastroj?t=kalkulacka")}
              aria-label="Pozrieť kalkulačku Môj Plot"
            >
              <span>MÔJ PLOT · CENA ZOSTAVY</span>
              <strong>
                892 <small>€</small>
              </strong>
              <p>20 m · antracit · montáž</p>
              <ArrowUpRight size={20} />
            </a>
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
