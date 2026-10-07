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
      ? "webko-chat-native"
      : kind === "calculator"
        ? "mojplot-calc-preview"
        : "mojplot-chat-native";
  const alt =
    kind === "chatbot"
      ? "Skutočný chatbot WEBKO — celé rozhranie v pôvodných farbách"
      : kind === "calculator"
        ? "Skutočný výsledok kalkulačky Môj Plot s cenou 892 €"
        : "Skutočný produktový asistent Môj Plot";
  return (
    <figure className={s.snapshot} data-real-preview>
      <img
        src={sitePath(`/work/solutions/${file}.webp`)}
        alt={alt}
        width={kind === "chatbot" ? 1140 : kind === "advisor" ? 1332 : 1200}
        height={kind === "chatbot" ? 1680 : kind === "advisor" ? 1956 : 1440}
        loading="lazy"
        decoding="async"
      />
      <figcaption className={s.previewCaption}>
        <strong>{kind === "chatbot" ? "WEBKO" : "Môj Plot"}</strong>
        <span>Skutočné rozhranie</span>
      </figcaption>
    </figure>
  );
}

const solutions = [
  {
    title: "3D konfigurátor",
    copy: "Zákazník vidí rozmery, farbu aj výbavu na svojej zostave.",
    href: "/3d-konfigurator",
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
        <h2 id="solutions-title">Riešenia pre váš web</h2>
        <p>Skutočné ukážky nástrojov. Od prvej otázky po konkrétny výber a cenu.</p>
      </header>
      <div ref={root} className={s.panels}>
        {solutions.map(({ title, copy, href, kind }, i) => (
          <article
            className={s.panel}
            key={title}
            data-solution-card={i}
            style={{ "--card-delay": `${i * 110}ms` } as CSSProperties}
          >
            <a
              className={s.panelLink}
              href={sitePath(href)}
              onClick={(e) => open(e, href)}
              aria-label={`Pozrieť riešenie: ${title}`}
            >
              <div className={s.panelBody}>
                <span className={s.number}>0{i + 1}</span>
                <h3>{title}</h3>
                <ArrowUpRight size={24} className={s.arrow} />
                <p>{copy}</p>
              </div>
              <div className={s.preview} data-solution-preview>
                {kind === "3d" ? <PergolaVideo /> : <RealPreview kind={kind} />}
              </div>
              <span className={s.openLabel}>
                Pozrieť možnosti <ArrowRight size={17} />
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
