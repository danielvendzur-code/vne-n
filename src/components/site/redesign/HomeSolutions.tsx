import { ArrowRight, ArrowUpRight } from "lucide-react";
import { useEffect, useRef, type MouseEvent } from "react";
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
    copy: "Odpovie na otázky, pomôže s výberom a ukáže cenu podľa vášho cenníka.",
    href: "/nastroj?t=chatbot",
    kind: "chatbot",
  },
  {
    title: "Kalkulačka",
    copy: "Spočíta cenu podľa rozmerov a vybraných možností. Bez ručného počítania.",
    href: "/nastroj?t=kalkulacka",
    kind: "calculator",
  },
  {
    title: "Poradca",
    copy: "Odporučí produkt z vášho katalógu a vysvetlí, prečo sa hodí.",
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
    const panels = element.querySelector<HTMLElement>(`[data-solution-panels]`);
    const cards = Array.from(element.querySelectorAll<HTMLElement>("[data-solution-card]"));
    const animations: Animation[] = [];
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          observer.unobserve(entry.target);
          if (media.matches) continue;
          const card = entry.target as HTMLElement;
          const index = Number(card.dataset.solutionCard);
          const desktop = innerWidth > 1100;
          const rect = card.getBoundingClientRect();
          const stage = panels?.getBoundingClientRect();
          const inward =
            desktop && stage ? (stage.x + stage.width / 2 - rect.x - rect.width / 2) * 0.42 : 0;
          animations.push(
            card.animate(
              [
                {
                  transform: `perspective(1800px) translate3d(${inward}px, ${desktop ? 155 : 54}px, ${desktop ? -90 : 0}px) rotateX(${desktop ? 12 : 0}deg) rotateY(${desktop ? (1.5 - index) * 9 : 0}deg) rotateZ(${desktop ? (index - 1.5) * 7 : 0}deg) scale(${desktop ? 0.92 : 0.97})`,
                  opacity: 0.35,
                },
                {
                  offset: 0.72,
                  transform:
                    "perspective(1800px) translate3d(0, -4px, 0) rotateX(0deg) rotateY(0deg) rotateZ(0deg) scale(1.003)",
                  opacity: 1,
                },
                {
                  transform:
                    "perspective(1800px) translate3d(0, 0, 0) rotateX(0deg) rotateY(0deg) rotateZ(0deg) scale(1)",
                  opacity: 1,
                },
              ],
              {
                duration: desktop ? 1550 : 1050,
                delay: desktop ? index * 110 : 0,
                easing: "cubic-bezier(0.22, 1, 0.36, 1)",
                fill: "backwards",
              },
            ),
          );
          const preview = card.querySelector("[data-solution-preview]");
          if (preview)
            animations.push(
              preview.animate(
                [
                  { transform: "translate3d(0, 42px, 0) scale(1.065)", opacity: 0.5 },
                  { transform: "translate3d(0, 0, 0) scale(1)", opacity: 1 },
                ],
                {
                  duration: 1400,
                  delay: desktop ? 180 + index * 110 : 100,
                  easing: "cubic-bezier(0.22, 1, 0.36, 1)",
                },
              ),
            );
        }
      },
      { threshold: 0.08 },
    );
    cards.forEach((card) => observer.observe(card));
    const stop = () => {
      if (media.matches) animations.forEach((animation) => animation.cancel());
    };
    media.addEventListener("change", stop);
    return () => {
      observer.disconnect();
      animations.forEach((animation) => animation.cancel());
      media.removeEventListener("change", stop);
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
      <header className={s.heading} data-section-heading data-visible="true">
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
      <div className={s.panels} data-solution-panels>
        {solutions.map(({ title, copy, href, kind }, i) => (
          <article className={s.panel} key={title} data-solution-card={i}>
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
