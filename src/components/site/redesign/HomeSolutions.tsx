import { ArrowRight, ArrowUpRight } from "lucide-react";
import { useEffect, useRef, type MouseEvent, type PointerEvent, type CSSProperties } from "react";
import { useRouter } from "@tanstack/react-router";
import { PergolaVideo } from "./PergolaVideo";
import { openSolution } from "./solution-navigation";

import { sitePath } from "./utils";
import s from "./HomeSolutions.module.css";

function RealPreview({ kind }: { kind: "chatbot" | "calculator" | "advisor" }) {
  const file =
    kind === "chatbot"
      ? "koverta-chat"
      : kind === "calculator"
        ? "mojplot-calc-preview"
        : "skincare-photo";
  const alt =
    kind === "chatbot"
      ? "Chatbot Koverta vo svojom reálnom webovom rozhraní"
      : kind === "calculator"
        ? "Skutočný výsledok kalkulačky Môj Plot s cenou 892 €"
        : "Ukážka poradenstva pre pleťovú kozmetiku bez značky predajcu";
  return (
    <figure className={s.snapshot} data-real-preview>
      <img
        src={sitePath(
          kind === "chatbot" ? `/work/live/${file}.webp` : `/work/solutions/${file}.webp`,
        )}
        alt={alt}
        width={kind === "chatbot" ? 1000 : kind === "advisor" ? 1200 : 1200}
        height={kind === "chatbot" ? 1300 : kind === "advisor" ? 900 : 1440}
        loading="lazy"
        decoding="async"
      />
      <figcaption className={s.previewCaption}>
        <strong>
          {kind === "chatbot" ? "Koverta" : kind === "advisor" ? "Pleťová kozmetika" : "Môj Plot"}
        </strong>
        <span>{kind === "advisor" ? "Ukážka poradenstva" : "Skutočná ukážka"}</span>
      </figcaption>
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
  const root = useRef<HTMLDivElement>(null);
  const router = useRouter();
  useEffect(() => {
    const cards = root.current?.querySelectorAll<HTMLElement>(
      "[data-solution-card], [data-solution-preview]",
    );
    if (!cards || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(({ target, isIntersecting }) => {
          if (isIntersecting) {
            (target as HTMLElement).dataset.visible = "true";
            observer.unobserve(target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
    cards.forEach((card) => {
      card.dataset.solutionReveal = "pending";
      observer.observe(card);
    });
    return () => {
      observer.disconnect();
      cards.forEach((card) => {
        card.dataset.visible = "true";
      });
    };
  }, []);
  const onCardPointerMove = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType !== "mouse") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--light-x", `${event.clientX - bounds.left}px`);
    event.currentTarget.style.setProperty("--light-y", `${event.clientY - bounds.top}px`);
  };
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
    <section id="riesenia" className={s.section} aria-labelledby="solutions-title">
      <header className={s.heading}>
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
      <div ref={root} className={s.panels}>
        {solutions.map(({ title, copy, href, kind }, i) => (
          <article
            className={s.panel}
            key={title}
            data-solution-card={i}
            onPointerMove={onCardPointerMove}
            style={{ "--card-delay": `${i * 110}ms` } as CSSProperties}
          >
            <a
              className={s.panelLink}
              href={sitePath(href)}
              onClick={kind === "3d" ? undefined : (e) => open(e, href)}
              target={kind === "3d" ? "_blank" : undefined}
              rel={kind === "3d" ? "noopener noreferrer" : undefined}
              aria-label={kind === "3d" ? "Vyskúšať 3D konfigurátor na koverta.sk" : `Pozrieť riešenie: ${title}`}
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
