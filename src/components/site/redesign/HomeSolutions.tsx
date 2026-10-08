import { ArrowRight, ArrowUpRight } from "lucide-react";
import { useEffect, useRef, type MouseEvent, type CSSProperties } from "react";
import { useRouter } from "@tanstack/react-router";
import { PergolaVideo } from "./PergolaVideo";
import { openSolution } from "./solution-navigation";

import { sitePath } from "./utils";
import s from "./HomeSolutions.module.css";

function RealPreview({ kind }: { kind: "chatbot" | "calculator" | "advisor" }) {
  const file =
    kind === "chatbot"
      ? "koverta-chat-quiet"
      : kind === "calculator"
        ? "mojplot-calc-quiet"
        : "skincare-advisor-real";
  const alt =
    kind === "chatbot"
      ? "Chatbot Koverta vo svojom reálnom webovom rozhraní"
      : kind === "calculator"
        ? "Úvodný krok skutočnej kalkulačky Môj Plot bez vypočítanej ceny"
        : "Skutočný poradca starostlivosti o pleť bez označenia firmy";
  return (
    <figure className={s.snapshot} data-real-preview>
      <img
        src={sitePath(`/work/solutions/${file}.webp`)}
        alt={alt}
        width={kind === "advisor" ? 904 : kind === "calculator" ? 888 : 768}
        height={kind === "advisor" ? 1300 : kind === "calculator" ? 1544 : 1280}
        loading="lazy"
        decoding="async"
      />
    </figure>
  );
}

const solutions = [
  {
    title: "3D konfigurátor",
    copy: "Zákazník vidí rozmery, farbu aj výbavu na svojej zostave.",
    href: "https://koverta.sk/pages/konfigurator",
    kind: "3d",
  },
  {
    title: "Chatbot",
    copy: "Odpovie na otázku, poradí s výberom a ukáže cenu podľa vášho cenníka.",
    href: "/nastroj?t=chatbot",
    kind: "chatbot",
  },
  {
    title: "Kalkulačka",
    copy: "Rozmery a možnosti premení na konkrétnu cenu. Bez ručného počítania.",
    href: "/nastroj?t=kalkulacka",
    kind: "calculator",
  },
  {
    title: "Poradca",
    copy: "Vyberie vhodný produkt z vášho katalógu a vysvetlí svoje odporúčanie.",
    href: "/nastroj?t=poradca",
    kind: "advisor",
  },
] as const;

export function HomeSolutions() {
  const root = useRef<HTMLElement>(null);
  const router = useRouter();
  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let visible = false;
    const paint = () => {
      frame = 0;
      const top = element.getBoundingClientRect().top;
      const progress = media.matches
        ? 1
        : Math.min(1, Math.max(0, (innerHeight * 0.95 - top) / (innerHeight * 0.58)));
      element.style.setProperty("--scene-open", String(progress));
      element.dataset.motion = media.matches ? "off" : "on";
      element.querySelector("[data-section-heading]")?.setAttribute("data-visible", "true");
    };
    const schedule = () => {
      if (visible && !frame) frame = requestAnimationFrame(paint);
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) paint();
      },
      { rootMargin: "160px" },
    );
    observer.observe(element);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    media.addEventListener("change", paint);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      media.removeEventListener("change", paint);
      delete element.dataset.motion;
    };
  }, []);
  const open = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
      return;
    event.preventDefault();
    const card = event.currentTarget.closest<HTMLElement>("[data-solution-card]");
    const preview = card?.querySelector<HTMLElement>("[data-solution-preview]");
    void openSolution(preview ?? null, () =>
      router.navigate({ href: sitePath(href), viewTransition: false, resetScroll: true }),
    );
  };
  return (
    <section ref={root} id="riesenia" className={s.section} aria-labelledby="solutions-title">
      <header className={s.heading} data-section-heading>
        <div className={s.headingTitle}>
          <span className={s.eyebrow}>01 / PORTFÓLIO RIEŠENÍ</span>
          <h2 id="solutions-title">
            Riešenia <em>pre váš web</em>
          </h2>
        </div>
        <div className={s.headingAside}>
          <span className={s.headingMarker} aria-hidden="true">
            <span /> 4 NÁSTROJE · JEDEN WEB
          </span>
          <p>Od prvej otázky po hotovú zostavu. Skutočné nástroje, ktoré môžete vidieť v akcii.</p>
        </div>
      </header>
      <div className={s.motionTrack} aria-hidden="true">
        <span />
      </div>
      <div className={s.panels}>
        {solutions.map(({ title, copy, href, kind }, i) => (
          <article
            className={s.panel}
            key={title}
            data-solution-card={i}
            style={
              {
                "--card-lift": `${(4 - i) * 28}px`,
                "--card-turn": `${(i - 1.5) * 2.5}deg`,
              } as CSSProperties
            }
          >
            <a
              className={s.panelLink}
              href={sitePath(href)}
              onClick={kind === "3d" ? undefined : (e) => open(e, href)}
              target={kind === "3d" ? "_blank" : undefined}
              rel={kind === "3d" ? "noopener noreferrer" : undefined}
              aria-label={
                kind === "3d"
                  ? "Vyskúšať 3D konfigurátor na koverta.sk"
                  : `Pozrieť riešenie: ${title}`
              }
            >
              <div className={s.panelBody}>
                <span className={s.number}>
                  0{i + 1} <span> / 04</span>
                </span>
                <span className={s.panelAccent} aria-hidden="true" />
                <h3>{title}</h3>
                <ArrowUpRight size={24} className={s.arrow} />
                <p>{copy}</p>
              </div>
              <div className={s.preview} data-solution-preview>
                {kind === "3d" ? <PergolaVideo /> : <RealPreview kind={kind} />}
              </div>
              <span className={s.openLabel}>
                {kind === "3d" ? "Vyskúšať na Koverta" : "Pozrieť možnosti"}
                <ArrowRight size={17} aria-hidden="true" />
              </span>
            </a>
          </article>
        ))}
      </div>
      <div className={s.connection}>
        <div>
          <h3>Samostatne alebo spolu.</h3>
          <p>Jeden nástroj alebo premyslené prepojenie.</p>
        </div>
        <button
          className="mc-btn"
          type="button"
          onClick={() =>
            window.dispatchEvent(
              new CustomEvent("site-assistant:open", { detail: { entry: "builder" } }),
            )
          }
        >
          Vyskladať riešenie <ArrowRight size={18} />
        </button>
      </div>
    </section>
  );
}
