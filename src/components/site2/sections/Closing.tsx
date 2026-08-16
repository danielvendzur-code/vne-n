import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { siteConfig } from "@/config/site";
import { faqs } from "@/data/faq";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { Reveal2 } from "../Reveal2";
import { RevealText } from "../RevealText";
import { RuleLine } from "../RuleLine";
import "./Closing.css";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/**
 * Kroky spolupráce.
 *
 * V zozname stojí len názov kroku a to, čo z neho vypadne — dve krátke
 * veci, ktoré sa dajú prejsť očami. Vysvetlenie je za rozkliknutím,
 * pretože kto sa rozhoduje, ho číta, a kto skenuje, ho preskočí.
 */
const STEPS = [
  {
    title: "Zistíme, čo má vybaviť",
    out: "Zoznam úloh pre riešenie",
    copy: "Pozrieme si váš e-shop, ponuku a otázky zákazníkov. Vyberieme to, čo dnes berie najviac času.",
  },
  {
    title: "Navrhneme tok a logiku",
    out: "Klikateľná ukážka",
    copy: "Otázky, rozhodovanie aj výpočty pripravíme skôr, než sa začne vývoj. Ukážku si vyskúšate pred výrobou.",
  },
  {
    title: "Postavíme a otestujeme",
    out: "Otestovaná verzia",
    copy: "Preveríme bežné situácie na počítači aj mobile a upravíme, čo nesedí.",
  },
  {
    title: "Nasadíme a doladíme",
    out: "Živé riešenie",
    copy: "Prepojíme dopyty s miestom, kde ich riešite, a po spustení skontrolujeme prvé otázky zákazníkov.",
  },
];

/** Na domovskej stránke stoja len tie otázky, ktoré padnú najčastejšie. */
const TOP_FAQ = faqs.slice(0, 5);

/**
 * Otvárací panel.
 *
 * Jeden kus pre kroky aj otázky — obe potrebujú to isté: výšku, ktorá
 * dorastie, a obsah, ktorý za ňou o kúsok zaostane. Pri vypnutých
 * animáciách sa panel len ukáže.
 */
function Panel({
  id,
  open,
  reduced,
  className,
  children,
}: {
  id: string;
  open: boolean;
  reduced: boolean;
  className: string;
  children: React.ReactNode;
}) {
  return (
    <AnimatePresence initial={false}>
      {open ? (
        <motion.div
          id={id}
          className={className}
          initial={reduced ? false : { height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={reduced ? { opacity: 1 } : { height: 0, opacity: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
          style={{ overflow: "hidden" }}
        >
          <motion.div
            initial={reduced ? false : { y: 14, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: EASE, delay: 0.08 }}
          >
            {children}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export function Process() {
  const reduced = useReducedMotion();
  const [open, setOpen] = useState<string | null>(null);

  return (
    <section className="mc2-process mc2-dark mc2-arch-top mc2-arch-bottom" id="spolupraca">
      <div className="mc2-shell">
        <Reveal2 className="mc2-process__head">
          <p className="mc2-eyebrow">
            <b>03</b> Spolupráca
          </p>
          <RevealText className="mc2-title" text="Štyri kroky. Vždy viete, čo sa deje." />
        </Reveal2>

        <ol className="mc2-process__steps">
          {STEPS.map((step, index) => {
            const expanded = open === step.title;
            const panelId = `mc2-step-${index + 1}`;

            return (
              <li className="mc2-process__step" key={step.title} data-open={expanded}>
                <h3>
                  <button
                    type="button"
                    className="mc2-process__row"
                    aria-expanded={expanded}
                    aria-controls={panelId}
                    onClick={() => setOpen(expanded ? null : step.title)}
                  >
                    <span className="mc2-process__num">{`0${index + 1}`}</span>
                    <span className="mc2-process__title">{step.title}</span>
                    <span className="mc2-process__out">{step.out}</span>
                    <span className="mc2-process__sign" aria-hidden="true" />
                  </button>
                </h3>

                <Panel
                  id={panelId}
                  open={expanded}
                  reduced={reduced}
                  className="mc2-process__panel"
                >
                  <p className="mc2-process__copy">{step.copy}</p>
                </Panel>

                <RuleLine delay={index * 0.06} />
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

export function Faq() {
  const reduced = useReducedMotion();
  const [open, setOpen] = useState<string | null>(TOP_FAQ[0]?.q ?? null);

  return (
    <section className="mc2-faq" id="otazky">
      <div className="mc2-shell mc2-faq__inner">
        <Reveal2 className="mc2-faq__head">
          <p className="mc2-eyebrow">
            <b>04</b> Otázky
          </p>
          <RevealText className="mc2-title" text="Čo sa najčastejšie pýtate." />
          <Link to="/cennik" className="mc2-quiet">
            Pozrieť cenu
          </Link>
        </Reveal2>

        <Reveal2 className="mc2-faq__list">
          {TOP_FAQ.map((item, index) => {
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
                <Panel id={id} open={expanded} reduced={reduced} className="mc2-faq__answer">
                  <p>{item.a}</p>
                </Panel>

                <RuleLine delay={index * 0.06} />
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
    <section className="mc2-final mc2-dark mc2-arch-top">
      <div className="mc2-shell">
        <Reveal2 className="mc2-final__inner">
          <p className="mc2-eyebrow">
            <b>05</b> Ďalší krok
          </p>
          <RevealText className="mc2-final__title" text="Povedzte nám, čo má e‑shop vybaviť." />
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
