import { Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight, Box, Calculator, MessageSquare, Sparkles } from "lucide-react";
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { faqs } from "@/data/faq";
import { realizations } from "@/data/realizations";
import { configuratorShots, KOVERTA_LIVE_CONFIGURATOR } from "@/data/configurator";
import { openSiteAssistant } from "@/lib/site-assistant";
import { useReveal } from "@/hooks/useReveal";
import "./StudioHome.css";

const BASE = import.meta.env.BASE_URL;

const facts = [
  {
    value: "1 deň",
    label: "Ozveme sa s ďalším krokom",
    note: "Po odoslaní zadania, v pracovný deň.",
  },
  { value: "od 347 €", label: "Chatbot alebo poradca", note: "Návrh, obsah, logika a nasadenie." },
  {
    value: "od 447 €",
    label: "Kalkulačka alebo konfigurátor",
    note: "Postavené na vašich pravidlách.",
  },
  { value: "Ukážka", label: "Vyskúšate si ju vopred", note: "Na web ide až to, čo schválite." },
] as const;

const process = [
  [
    "01",
    "Ukážete nám web a ponuku",
    "Zistíme, čo zákazníci najčastejšie hľadajú, riešia a pýtajú sa.",
  ],
  [
    "02",
    "Navrhneme postup",
    "Určíme, čo má zákazník vidieť, vybrať alebo vyplniť — a čo dostanete vy.",
  ],
  ["03", "Postavíme a otestujeme", "Dizajn, logika, ceny aj napojenia. Na počítači aj na mobile."],
  [
    "04",
    "Nasadíme na váš web",
    "Bez prerábania celého webu. Overíme dopyty, formuláre aj bežné používanie.",
  ],
] as const;

const prices = [
  {
    tag: "Chatbot · produktový poradca",
    value: 347,
    lead: "od ",
    unit: "",
    copy: "Návrh, dizajn, obsah, logika a nasadenie na web.",
  },
  {
    tag: "Kalkulačka · konfigurátor",
    value: 447,
    lead: "od ",
    unit: "",
    copy: "Výpočet alebo výber postavený na vašich pravidlách a ponuke.",
  },
  {
    tag: "Technická prevádzka",
    value: 10,
    lead: "",
    unit: "/ mesiac",
    copy: "Hosting riešenia a základná technická starostlivosť.",
  },
] as const;

/* ---------------------------------------------------------------- helpers */

export function Eyebrow({
  children,
  tone = "light",
}: {
  children: ReactNode;
  tone?: "light" | "dark";
}) {
  return (
    <p className="sh-eyebrow" data-tone={tone}>
      <i aria-hidden="true" />
      {children}
    </p>
  );
}

/**
 * Counts up once when the number enters the viewport. The real value is
 * rendered on the server and stays in place for crawlers, screenshots and
 * visitors with reduced motion.
 */
function CountUp({
  value,
  lead = "",
  suffix = " €",
}: {
  value: number;
  lead?: string;
  suffix?: string;
}) {
  const [shown, setShown] = useState(value);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element || typeof IntersectionObserver === "undefined") return undefined;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;

    let frame = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        observer.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const progress = Math.min(1, (now - start) / 1100);
          const eased = 1 - Math.pow(1 - progress, 4);
          setShown(progress >= 1 ? value : Math.round(value * eased));
          if (progress < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.6 },
    );
    observer.observe(element);
    return () => {
      observer.disconnect();
      if (frame) cancelAnimationFrame(frame);
    };
  }, [value]);

  return (
    <span ref={ref} className="sh-count">
      {`${lead}${shown}${suffix}`}
    </span>
  );
}

/* ------------------------------------------------------------------- hero */

function HeroStage() {
  const [active, setActive] = useState(0);
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    const timer = window.setInterval(
      () => setActive((current) => (current + 1) % configuratorShots.length),
      4200,
    );
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return undefined;
    if (!window.matchMedia("(hover: hover) and (prefers-reduced-motion: no-preference)").matches) {
      return undefined;
    }
    let frame = 0;
    const onMove = (event: PointerEvent) => {
      const rect = stage.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        stage.style.setProperty("--tilt-x", `${(-y * 5).toFixed(2)}deg`);
        stage.style.setProperty("--tilt-y", `${(x * 7).toFixed(2)}deg`);
      });
    };
    const onLeave = () => {
      stage.style.setProperty("--tilt-x", "0deg");
      stage.style.setProperty("--tilt-y", "0deg");
    };
    stage.addEventListener("pointermove", onMove);
    stage.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(frame);
      stage.removeEventListener("pointermove", onMove);
      stage.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  const shot = configuratorShots[active];

  return (
    <div className="sh-hero__stage" ref={stageRef}>
      <div className="sh-browser">
        <div className="sh-browser__bar" aria-hidden="true">
          <span />
          <span />
          <span />
          <b>koverta.sk/pages/konfigurator</b>
        </div>
        <div className="sh-browser__view">
          {configuratorShots.map((item, index) => (
            <img
              key={item.id}
              src={item.image}
              alt={item.alt}
              width={1600}
              height={841}
              data-active={index === active}
              loading={index === 0 ? "eager" : "lazy"}
              fetchPriority={index === 0 ? "high" : "low"}
              decoding="async"
            />
          ))}
        </div>
      </div>

      <div className="sh-float sh-float--a" aria-hidden="true">
        <Box size={16} />
        <span>
          <b>{shot.label}</b>
          <small>3D model sa mení s každou voľbou</small>
        </span>
      </div>
      <div className="sh-float sh-float--b" aria-hidden="true">
        <span className="sh-float__dot" />
        <span>
          <b>Nový dopyt so zostavou</b>
          <small>rozmer · farba · strecha · výplne</small>
        </span>
      </div>

      <ol className="sh-hero__dots" aria-label="Ukážky konfigurátora">
        {configuratorShots.map((item, index) => (
          <li key={item.id}>
            <button
              type="button"
              aria-label={`Zobraziť: ${item.label}`}
              aria-pressed={index === active}
              data-active={index === active}
              onClick={() => setActive(index)}
            />
          </li>
        ))}
      </ol>
    </div>
  );
}

function Hero() {
  return (
    <section className="sh-hero" aria-labelledby="sh-hero-title">
      <div className="sh-hero__glow" aria-hidden="true" />
      <div className="sh-wrap sh-hero__grid">
        <div className="sh-hero__copy">
          <Eyebrow tone="dark">Chatboty · kalkulačky · 3D konfigurátory</Eyebrow>
          <h1 id="sh-hero-title" className="sh-hero__title">
            <span className="sh-line" style={{ "--i": 0 } as CSSProperties}>
              Predajné nástroje na web,
            </span>{" "}
            <em className="sh-line" style={{ "--i": 1 } as CSSProperties}>
              ktoré privedú dopyt.
            </em>
          </h1>
          <p className="sh-hero__lead sh-line" style={{ "--i": 2 } as CSSProperties}>
            Navrhneme a nasadíme chatbota, cenovú kalkulačku alebo 3D konfigurátor na mieru.
            Zákazník dostane odpoveď, cenu alebo hotovú zostavu. Vy pripravený dopyt.
          </p>
          <div className="sh-hero__actions sh-line" style={{ "--i": 3 } as CSSProperties}>
            <Link to="/kontakt" className="sh-btn sh-btn--lime">
              Chcem návrh zadarmo <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <a href="#konfigurator" className="sh-btn sh-btn--ghost">
              Vyskúšať 3D konfigurátor
            </a>
          </div>
          <ul className="sh-hero__proof sh-line" style={{ "--i": 4 } as CSSProperties}>
            {realizations.map((project) => (
              <li key={project.name}>{project.domain}</li>
            ))}
          </ul>
        </div>
        <HeroStage />
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ facts */

function Facts() {
  return (
    <section className="sh-facts" aria-label="Základné fakty">
      <div className="sh-wrap">
        <ul className="sh-facts__card">
          {facts.map((fact, index) => (
            <li key={fact.label} data-reveal style={{ "--d": index } as CSSProperties}>
              <strong>{fact.value}</strong>
              <span>{fact.label}</span>
              <small>{fact.note}</small>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------- solutions */

function ChatMock() {
  return (
    <div className="sh-mock sh-mock--chat" aria-hidden="true">
      <p data-from="user">Ktorý plot je vhodný k psovi?</p>
      <p data-from="bot">Odporúčam 3D panel 1,53 m s podhrabovou doskou. Pošlem cenu na 40 m?</p>
      <p data-from="user">Áno, prosím.</p>
    </div>
  );
}

function AdvisorMock() {
  return (
    <div className="sh-mock sh-mock--advisor" aria-hidden="true">
      <span data-on="true">Na terasu</span>
      <span>Pre auto</span>
      <span data-on="true">Do 5 000 €</span>
      <span>Antracit</span>
      <b>2 vhodné produkty</b>
    </div>
  );
}

function Solutions() {
  return (
    <section className="sh-section sh-solutions" id="riesenia" aria-labelledby="sh-solutions-title">
      <div className="sh-wrap">
        <header className="sh-head" data-reveal>
          <Eyebrow>Riešenia</Eyebrow>
          <h2 id="sh-solutions-title">Aké riešenie potrebujete?</h2>
          <p>
            Každý nástroj funguje samostatne. Keď to dáva zmysel, spojíme ich — napríklad chatbot,
            ktorý zároveň počíta cenu.
          </p>
        </header>

        <div className="sh-bento">
          <article
            className="sh-card sh-card--feature"
            data-reveal
            style={{ "--d": 0 } as CSSProperties}
          >
            <Link to="/3d-konfigurator" className="sh-card__media" tabIndex={-1} aria-hidden="true">
              <img
                src={`${BASE}work/koverta/konfigurator-pristresok.webp`}
                alt=""
                width={1600}
                height={841}
                loading="lazy"
                decoding="async"
              />
              <span className="sh-badge">Novinka · 3D</span>
            </Link>
            <div className="sh-card__body">
              <span className="sh-card__icon" aria-hidden="true">
                <Box size={18} />
              </span>
              <h3>3D konfigurátor</h3>
              <p>
                Zákazník si produkt poskladá v 3D — rozmer, farbu, strechu aj doplnky. Cena sa
                prepočíta okamžite a dopyt príde aj so zostavou.
              </p>
              <Link to="/3d-konfigurator" className="sh-btn sh-btn--dark">
                Pozrieť 3D konfigurátor <ArrowRight size={17} aria-hidden="true" />
              </Link>
            </div>
          </article>

          <article
            className="sh-card sh-card--media"
            data-reveal
            style={{ "--d": 1 } as CSSProperties}
          >
            <div className="sh-card__media sh-card__media--top">
              <img
                src={`${BASE}work/live/derat.webp`}
                alt=""
                width={1600}
                height={1000}
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="sh-card__body">
              <span className="sh-card__icon" aria-hidden="true">
                <Calculator size={18} />
              </span>
              <h3>Cenová kalkulačka</h3>
              <p>Keď cenu mení rozmer, množstvo, model, montáž alebo doprava.</p>
              <button
                type="button"
                className="sh-btn sh-btn--dark sh-btn--sm"
                onClick={() =>
                  openSiteAssistant({ source: "home-calculator", preset: "calculator" })
                }
              >
                Vyskladať kalkulačku <ArrowUpRight size={16} aria-hidden="true" />
              </button>
            </div>
          </article>

          <article className="sh-card" data-reveal style={{ "--d": 2 } as CSSProperties}>
            <ChatMock />
            <div className="sh-card__body">
              <span className="sh-card__icon" aria-hidden="true">
                <MessageSquare size={18} />
              </span>
              <h3>Chatbot</h3>
              <p>Odpovedá z vašich podkladov a pošle vám kontakt aj so zhrnutím.</p>
              <button
                type="button"
                className="sh-btn sh-btn--dark sh-btn--sm"
                onClick={() => openSiteAssistant({ source: "home-chatbot", preset: "advisor" })}
              >
                Vyskladať chatbota <ArrowUpRight size={16} aria-hidden="true" />
              </button>
            </div>
          </article>

          <article className="sh-card" data-reveal style={{ "--d": 3 } as CSSProperties}>
            <AdvisorMock />
            <div className="sh-card__body">
              <span className="sh-card__icon" aria-hidden="true">
                <Sparkles size={18} />
              </span>
              <h3>Produktový poradca</h3>
              <p>Zúži veľkú ponuku podľa potrieb zákazníka na pár vhodných produktov.</p>
              <button
                type="button"
                className="sh-btn sh-btn--dark sh-btn--sm"
                onClick={() => openSiteAssistant({ source: "home-advisor", preset: "product" })}
              >
                Vyskladať poradcu <ArrowUpRight size={16} aria-hidden="true" />
              </button>
            </div>
          </article>

          <article
            className="sh-card sh-card--lime"
            data-reveal
            style={{ "--d": 4 } as CSSProperties}
          >
            <h3>Neviete, čo z toho?</h3>
            <ul aria-label="Príklady">
              <li>E-shop</li>
              <li>Služby</li>
              <li>Výroba</li>
              <li>Dom a záhrada</li>
            </ul>
            <p>Odpovedzte na pár krátkych otázok a hneď uvidíte, čo by dávalo zmysel vám.</p>
            <button
              type="button"
              className="sh-btn sh-btn--ink"
              onClick={() => openSiteAssistant({ source: "home-unsure" })}
            >
              Spustiť výber <ArrowRight size={17} aria-hidden="true" />
            </button>
          </article>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------- configurator */

export function ConfiguratorShowcase({ onCaseStudy = false }: { onCaseStudy?: boolean }) {
  const [active, setActive] = useState(0);
  const [live, setLive] = useState(false);
  const shot = configuratorShots[active];

  return (
    <section
      className="sh-section sh-config"
      id="konfigurator"
      aria-labelledby="sh-config-title"
      data-live={live || undefined}
    >
      <div className="sh-wrap sh-config__grid">
        <div className="sh-config__copy" data-reveal>
          <Eyebrow tone="dark">{onCaseStudy ? "Živá ukážka" : "Realizácia · Koverta"}</Eyebrow>
          <h2 id="sh-config-title">
            {onCaseStudy ? "Vyskúšajte si ho " : "Prístrešok si zákazník "}
            <em>{onCaseStudy ? "priamo tu." : "poskladá v 3D."}</em>
          </h2>
          <p>
            Pre Kovertu sme postavili konfigurátor prístreškov a pergol. Každá voľba sa hneď prepíše
            do 3D modelu aj do orientačnej ceny. Firma dostane dopyt, v ktorom už je všetko
            podstatné.
          </p>
          <ol className="sh-steps">
            <li>
              <b>01</b>
              <span>
                <strong>Vyberie typ a umiestnenie</strong>
                Samostatne, pri stene alebo v rohu.
              </span>
            </li>
            <li>
              <b>02</b>
              <span>
                <strong>Nastaví rozmer, farbu a strechu</strong>
                Model aj cena sa menia okamžite.
              </span>
            </li>
            <li>
              <b>03</b>
              <span>
                <strong>Pošle dopyt so zostavou</strong>
                Bez prepisovania rozmerov do e-mailu.
              </span>
            </li>
          </ol>
          <div className="sh-config__actions">
            {onCaseStudy ? (
              <Link to="/kontakt" className="sh-btn sh-btn--lime">
                Chcem podobný konfigurátor <ArrowRight size={18} aria-hidden="true" />
              </Link>
            ) : (
              <Link to="/3d-konfigurator" className="sh-btn sh-btn--lime">
                Celá prípadová štúdia <ArrowRight size={18} aria-hidden="true" />
              </Link>
            )}
            <a
              href="https://koverta.sk/pages/konfigurator"
              target="_blank"
              rel="noreferrer"
              className="sh-link"
            >
              Otvoriť na koverta.sk <ArrowUpRight size={15} aria-hidden="true" />
            </a>
          </div>
        </div>

        <div className="sh-config__stage" data-reveal style={{ "--d": 1 } as CSSProperties}>
          <div className="sh-tabs" role="tablist" aria-label="Typ konštrukcie">
            {configuratorShots.map((item, index) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={index === active}
                data-active={index === active}
                onClick={() => {
                  setActive(index);
                  setLive(false);
                }}
              >
                {item.label}
              </button>
            ))}
          </div>
          <div className="sh-config__frame">
            {live ? (
              <iframe
                src={`${KOVERTA_LIVE_CONFIGURATOR}?page=${shot.page}`}
                title={`Živý 3D konfigurátor Koverta — ${shot.label}`}
                loading="lazy"
                allow="fullscreen"
              />
            ) : (
              <>
                {configuratorShots.map((item, index) => (
                  <img
                    key={item.id}
                    src={item.image}
                    alt={item.alt}
                    width={1600}
                    height={841}
                    loading="lazy"
                    decoding="async"
                    data-active={index === active}
                  />
                ))}
                <button type="button" className="sh-play" onClick={() => setLive(true)}>
                  <span aria-hidden="true" />
                  Spustiť živý konfigurátor
                </button>
              </>
            )}
          </div>
          <p className="sh-config__note">
            {live ? (
              <>
                Konfigurátor beží naživo. Pohodlnejšie ho ovládate{" "}
                <a
                  href={`${KOVERTA_LIVE_CONFIGURATOR}?page=${shot.page}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  na celej obrazovke
                </a>
                .
              </>
            ) : (
              "Živá ukážka beží priamo tu. Načíta sa až po kliknutí, aby stránka ostala rýchla."
            )}
          </p>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------- work */

function Work() {
  return (
    <section className="sh-section sh-work" id="realizacie" aria-labelledby="sh-work-title">
      <div className="sh-wrap">
        <header className="sh-head sh-head--row" data-reveal>
          <div>
            <Eyebrow>Realizácie</Eyebrow>
            <h2 id="sh-work-title">Hotové projekty, ktoré bežia naživo</h2>
          </div>
          <Link to="/projekty" className="sh-link sh-link--dark">
            Všetky realizácie <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </header>
        <div className="sh-work__grid">
          {realizations.map((project, index) => (
            <article
              className="sh-project"
              key={project.name}
              data-reveal
              style={{ "--d": index % 2 } as CSSProperties}
            >
              <a
                href={project.href}
                target="_blank"
                rel="noreferrer"
                className="sh-project__media"
                aria-label={`${project.name} — otvoriť ${project.domain}`}
              >
                <img
                  src={project.image}
                  alt={project.alt}
                  width={1600}
                  height={1000}
                  loading="lazy"
                  decoding="async"
                />
                <span className="sh-project__domain">
                  {project.domain} <ArrowUpRight size={14} aria-hidden="true" />
                </span>
              </a>
              <div className="sh-project__meta">
                <span>{project.type}</span>
                <h3>{project.name}</h3>
                <p>{project.result}</p>
                {project.caseStudyPath ? (
                  <Link to={project.caseStudyPath} className="sh-link sh-link--dark">
                    Prípadová štúdia <ArrowRight size={15} aria-hidden="true" />
                  </Link>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- process */

function Process() {
  const listRef = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return undefined;
    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = list.getBoundingClientRect();
      const start = window.innerHeight * 0.85;
      const progress = Math.min(1, Math.max(0, (start - rect.top) / (rect.height + start * 0.35)));
      list.style.setProperty("--progress", progress.toFixed(3));
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  return (
    <section className="sh-section sh-process" id="proces" aria-labelledby="sh-process-title">
      <div className="sh-wrap sh-process__grid">
        <header className="sh-head" data-reveal>
          <Eyebrow>Ako to prebieha</Eyebrow>
          <h2 id="sh-process-title">Od prvej správy po nástroj na vašom webe</h2>
          <p>Najprv dostanete návrh a ukážku. Na web ide až to, čo si vyskúšate a schválite.</p>
          <Link to="/postup" className="sh-link sh-link--dark">
            Celý postup <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </header>
        <ol className="sh-timeline" ref={listRef}>
          {process.map(([index, title, copy], order) => (
            <li key={index} data-reveal style={{ "--d": order } as CSSProperties}>
              <b>{index}</b>
              <div>
                <h3>{title}</h3>
                <p>{copy}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- pricing */

function Pricing() {
  return (
    <section className="sh-section sh-price" id="cena" aria-labelledby="sh-price-title">
      <div className="sh-wrap">
        <header className="sh-head sh-head--row" data-reveal>
          <div>
            <Eyebrow tone="dark">Cenník</Eyebrow>
            <h2 id="sh-price-title">
              Jasná cena <em>ešte pred začiatkom.</em>
            </h2>
          </div>
          <p>Presný rozsah si odsúhlasíme vopred. Ponuka uvedie základ, DPH aj celkovú sumu.</p>
        </header>
        <div className="sh-price__grid">
          {prices.map((price, index) => (
            <Link
              to="/cennik"
              key={price.tag}
              className="sh-price__card"
              data-reveal
              style={{ "--d": index } as CSSProperties}
            >
              <span>{price.tag}</span>
              <strong>
                <CountUp value={price.value} lead={price.lead} />
                {price.unit ? <small>{price.unit}</small> : null}
              </strong>
              <p>{price.copy}</p>
              <i aria-hidden="true">
                <ArrowUpRight size={18} />
              </i>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------- faq */

function Faq() {
  return (
    <section className="sh-section sh-faq" id="otazky" aria-labelledby="sh-faq-title">
      <div className="sh-wrap sh-faq__grid">
        <header className="sh-head" data-reveal>
          <Eyebrow>Časté otázky</Eyebrow>
          <h2 id="sh-faq-title">Čo sa nás pýtate najčastejšie</h2>
          <p>
            Nenašli ste odpoveď? Napíšte na{" "}
            <a href="mailto:info@mojchatbot.sk">info@mojchatbot.sk</a> alebo sa opýtajte chatbota
            vpravo dole.
          </p>
        </header>
        <div className="sh-faq__list">
          {faqs.map((faq, index) => (
            <details key={faq.q} data-reveal style={{ "--d": index % 3 } as CSSProperties}>
              <summary>
                {faq.q}
                <i aria-hidden="true" />
              </summary>
              <div>
                <p>{faq.a}</p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- closing */

function Closing() {
  return (
    <section className="sh-closing" aria-labelledby="sh-closing-title">
      <div className="sh-wrap">
        <div className="sh-closing__card" data-reveal>
          <div>
            <h2 id="sh-closing-title">Chcete to aj na svoj web?</h2>
            <p>
              Pošlite odkaz na web a stručne napíšte, čo chcete zákazníkom zjednodušiť. Ozveme sa do
              jedného pracovného dňa s konkrétnym návrhom.
            </p>
          </div>
          <div className="sh-closing__actions">
            <Link to="/kontakt" className="sh-btn sh-btn--lime">
              Chcem návrh <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <a href="tel:+421948699433" className="sh-link">
              +421 948 699 433
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export function StudioHome() {
  const rootRef = useRef<HTMLDivElement>(null);
  useReveal(rootRef);

  return (
    <div className="sh" ref={rootRef}>
      <Hero />
      <Facts />
      <Solutions />
      <ConfiguratorShowcase />
      <Work />
      <Process />
      <Pricing />
      <Faq />
      <Closing />
    </div>
  );
}
