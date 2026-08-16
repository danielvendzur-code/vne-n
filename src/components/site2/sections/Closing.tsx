import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { siteConfig } from "@/config/site";
import { faqs } from "@/data/faq";
import { Reveal2 } from "../Reveal2";
import "./Closing.css";

const STEPS = [
  {
    title: "Povieme si, čo má riešenie vybaviť",
    copy: "Pozrieme si váš web, ponuku a otázky zákazníkov. Vyberieme to, čo dnes berie najviac času.",
    out: "Jasný zoznam toho, čo má riešenie robiť.",
  },
  {
    title: "Pripravíme tok, logiku a ukážku",
    copy: "Navrhneme otázky, rozhodovanie aj výpočty skôr, než sa začne vývoj.",
    out: "Klikateľná ukážka, ktorú si vyskúšate pred výrobou.",
  },
  {
    title: "Postavíme a spolu otestujeme",
    copy: "Preveríme bežné situácie na počítači aj mobile a upravíme, čo nesedí.",
    out: "Otestovaná verzia pripravená na ostrú prevádzku.",
  },
  {
    title: "Nasadíme a doladíme podľa dát",
    copy: "Prepojíme dopyty s miestom, kde ich riešite, a po spustení skontrolujeme prvé otázky.",
    out: "Živé riešenie a jasný plán ďalších úprav.",
  },
];

/** Na domovskej stránke stoja len tie otázky, ktoré padnú najčastejšie. */
const TOP_FAQ = faqs.slice(0, 5);

export function Process() {
  return (
    <section className="mc2-process mc2-dark" id="spolupraca">
      <div className="mc2-shell">
        <Reveal2 className="mc2-process__head">
          <p className="mc2-eyebrow">
            <b>03</b> Spolupráca
          </p>
          <h2 className="mc2-title">Štyri kroky. Vždy viete, čo sa deje.</h2>
        </Reveal2>

        <ol className="mc2-process__steps">
          {STEPS.map((step, index) => (
            <Reveal2 as="li" className="mc2-process__step" key={step.title} delay={index * 0.05}>
              <span className="mc2-process__num">{`0${index + 1}`}</span>
              <h3>{step.title}</h3>
              <p>{step.copy}</p>
              <p className="mc2-process__out">{step.out}</p>
            </Reveal2>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function Faq() {
  const [open, setOpen] = useState<string | null>(TOP_FAQ[0]?.q ?? null);

  return (
    <section className="mc2-faq" id="otazky">
      <div className="mc2-shell mc2-faq__inner">
        <Reveal2 className="mc2-faq__head">
          <p className="mc2-eyebrow">
            <b>04</b> Otázky
          </p>
          <h2 className="mc2-title">Čo sa najčastejšie pýtate.</h2>
          <Link to="/cennik" className="mc2-quiet">
            Pozrieť cenu
          </Link>
        </Reveal2>

        <Reveal2 className="mc2-faq__list">
          {TOP_FAQ.map((item) => {
            const expanded = open === item.q;
            const id = `mc2-faq-${item.q.slice(0, 24).replace(/\W+/g, "-")}`;
            return (
              <div className="mc2-faq__item" key={item.q} data-open={expanded}>
                <h3>
                  <button
                    type="button"
                    aria-expanded={expanded}
                    aria-controls={id}
                    onClick={() => setOpen(expanded ? null : item.q)}
                  >
                    <span>{item.q}</span>
                    <i aria-hidden="true" />
                  </button>
                </h3>
                <div className="mc2-faq__answer" id={id} hidden={!expanded}>
                  <p>{item.a}</p>
                </div>
              </div>
            );
          })}
        </Reveal2>
      </div>
    </section>
  );
}

export function FinalCta() {
  return (
    <section className="mc2-final mc2-dark">
      <div className="mc2-shell">
        <Reveal2 className="mc2-final__inner">
          <p className="mc2-eyebrow">
            <b>05</b> Ďalší krok
          </p>
          <h2 className="mc2-final__title">
            Povedzte nám, čo má web vybaviť.
            <br />
            Zvyšok pripravíme my.
          </h2>
          <p className="mc2-lead">Nezáväzná konzultácia. Ozveme sa do jedného pracovného dňa.</p>
          <div className="mc2-final__actions">
            <Link to="/kontakt" className="mc2-cta">
              <span>Nezáväzná konzultácia</span>
              <span className="mc2-cta__icon" aria-hidden="true">
                <ArrowRight />
                <ArrowRight />
              </span>
            </Link>
            <a href={`mailto:${siteConfig.contact.email}`} className="mc2-quiet">
              {siteConfig.contact.email}
            </a>
          </div>
        </Reveal2>
      </div>
    </section>
  );
}
