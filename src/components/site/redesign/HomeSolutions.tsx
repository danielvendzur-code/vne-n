import { ArrowRight, ArrowUpRight } from "lucide-react";
import { useLayoutEffect, useRef, type MouseEvent } from "react";
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
  useLayoutEffect(() => {
    const element = root.current;
    if (
      !element ||
      typeof IntersectionObserver === "undefined" ||
      typeof Element.prototype.animate !== "function"
    ) {
      return;
    }

    const media = matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches) return;
    const cards = Array.from(element.querySelectorAll<HTMLElement>("[data-solution-card]"));
    const desktop = matchMedia("(min-width: 1101px)").matches;

    // Prepare ONLY content below the viewport before paint. Once seen, a card
    // must never disappear or repeat its entrance while the user scrolls.
    const pending = cards.filter((card) => {
      if (card.getBoundingClientRect().top < innerHeight - 12) return false;
      card.style.opacity = "0";
      card.dataset.motionCard = "staged";
      return true;
    });
    const animations = new Set<Animation>();
    const releaseTimers = new Set<number>();

    const release = (card: HTMLElement) => {
      card.style.removeProperty("opacity");
      card.dataset.motionCard = "complete";
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const card = entry.target as HTMLElement;
          observer.unobserve(card);
          if (media.matches) {
            release(card);
            continue;
          }

          const index = cards.indexOf(card);
          const delay = desktop ? Math.min(index * 65, 195) : 0;
          const duration = desktop ? 620 : 510;
          const animation = card.animate(
            [
              {
                opacity: 0,
                transform: `translate3d(0, ${desktop ? 30 : 17}px, 0) scale(.988)`,
              },
              { opacity: 1, transform: "translate3d(0, 0, 0) scale(1)" },
            ],
            {
              duration,
              delay,
              easing: "cubic-bezier(0.2, 0.7, 0.2, 1)",
              fill: "both",
            },
          );
          card.dataset.motionCard = "playing";
          animations.add(animation);

          // A hidden tab or cancelled WAAPI animation must never leave a card
          // invisible. The timer is a safety net; it does not delay a normal run.
          const timer = window.setTimeout(
            () => {
              releaseTimers.delete(timer);
              release(card);
              animation.cancel();
              animations.delete(animation);
            },
            duration + delay + 180,
          );
          releaseTimers.add(timer);
          void animation.finished.then(
            () => {
              window.clearTimeout(timer);
              releaseTimers.delete(timer);
              release(card);
              animation.cancel();
              animations.delete(animation);
            },
            () => undefined,
          );
        }
      },
      { threshold: 0, rootMargin: "0px 0px -12px 0px" },
    );

    pending.forEach((card) => observer.observe(card));
    const stop = () => {
      if (!media.matches) return;
      observer.disconnect();
      animations.forEach((animation) => animation.cancel());
      animations.clear();
      releaseTimers.forEach((timer) => window.clearTimeout(timer));
      releaseTimers.clear();
      pending.forEach(release);
    };
    media.addEventListener("change", stop);

    return () => {
      observer.disconnect();
      media.removeEventListener("change", stop);
      releaseTimers.forEach((timer) => window.clearTimeout(timer));
      animations.forEach((animation) => animation.cancel());
      pending.forEach((card) => {
        card.style.removeProperty("opacity");
        delete card.dataset.motionCard;
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
    <section ref={root} id="riesenia" className={s.section} aria-labelledby="solutions-title">
      <header className={s.heading} data-section-heading data-visible="true">
        <div className={s.headingTitle}>
          <span className={s.eyebrow}>01 / PORTFÓLIO RIEŠENÍ</span>
          <h2 id="solutions-title">
            Riešenia <em>pre váš web</em>
          </h2>
        </div>
      </header>
      <div className={s.motionTrack} data-solution-motion-track aria-hidden="true">
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
