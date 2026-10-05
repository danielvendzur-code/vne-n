import { useState } from "react";
import { ArrowRight, ArrowUpRight, Check, Mail, Plus, Minus } from "lucide-react";
import { faqs } from "@/data/faq";
import { sitePath } from "./utils";
import s from "./HomepageSections.module.css";
import facts from "./HomeFacts.module.css";
export { HomeSolutions } from "./HomeSolutions";

const openBuilder = () =>
  window.dispatchEvent(new CustomEvent("site-assistant:open", { detail: { entry: "builder" } }));

export function HomeFacts() {
  return (
    <section className={facts.section} aria-label="Čo môžete očakávať">
      <div className={facts.item} data-reveal>
        <span className={facts.label}>Prvá odpoveď</span>
        <div className={facts.value}>
          <strong>1 deň</strong>
          <span>v pracovný deň</span>
        </div>
        <p>Ozveme sa s konkrétnym ďalším krokom.</p>
      </div>
      <a className={facts.item} href={sitePath("/cennik")} data-reveal>
        <span className={facts.label}>
          Chatbot alebo poradca
          <ArrowUpRight size={16} aria-hidden="true" />
        </span>
        <div className={facts.value}>
          <strong>
            <small>od </small>347 €
          </strong>
        </div>
        <p>Návrh, obsah, logika a nasadenie.</p>
      </a>
      <a className={facts.item} href={sitePath("/cennik")} data-reveal>
        <span className={facts.label}>
          Kalkulačka alebo konfigurátor
          <ArrowUpRight size={16} aria-hidden="true" />
        </span>
        <div className={facts.value}>
          <strong>
            <small>od </small>447 €
          </strong>
        </div>
        <p>Presnú cenu dohodneme podľa rozsahu.</p>
      </a>
      <div className={facts.item} data-reveal>
        <span className={facts.label}>Najprv vyskúšate</span>
        <div className={facts.value}>
          <strong>Ukážka</strong>
          <span>pred nasadením</span>
        </div>
        <p>Na váš web ide až odsúhlasené riešenie.</p>
      </div>
    </section>
  );
}

export function InquiryComparison() {
  return (
    <section id="pred-a-po" className={s.comparison}>
      <div className={s.comparisonInner} data-reveal>
        <header className={s.sectionHead}>
          <h2>
            Rovnaký záujem.
            <br />
            <span>Oveľa lepší dopyt.</span>
          </h2>
          <p>
            Keď sa váš web opýta správne, môžete pripraviť ponuku namiesto ďalšieho kola otázok.
          </p>
        </header>
        <div className={s.comparePanels}>
          <article className={s.email} aria-labelledby="before-title">
            <header>
              <span>
                <Mail size={18} aria-hidden="true" /> Pred
              </span>
              <span>Bežný e-mail</span>
            </header>
            <div className={s.emailMeta}>
              <span>Od</span>
              <b>zákazník@example.invalid</b>
              <span>Predmet</span>
              <b>Cenová ponuka</b>
            </div>
            <div className={s.emailBody}>
              <h3 id="before-title">„Koľko by to stálo?“</h3>
              <p>
                Dobrý deň, prosím vás, vedeli by ste mi poslať cenovú ponuku na prístrešok? Ďakujem.
              </p>
              <span className={s.signature}>Zákazník</span>
            </div>
            <footer>Ešte chýbajú rozmery, materiál, miesto aj termín.</footer>
          </article>
          <article className={`${s.email} ${s.emailAfter}`} aria-labelledby="after-title">
            <header>
              <span>
                <Check size={18} aria-hidden="true" /> Po
              </span>
              <span>Dopyt pripravený na ponuku</span>
            </header>
            <h3 id="after-title">Viete, čo zákazník potrebuje.</h3>
            <dl>
              {[
                ["Riešenie", "Hliníkový prístrešok"],
                ["Rozmer a materiál", "6 × 3 m · antracit · hliník"],
                ["Lokalita a termín", "Nitra · do 2 mesiacov"],
                ["Požiadavky", "Montáž pri dome, bočné tienenie"],
                ["Kontakt", "zákazník@example.invalid"],
              ].map(([label, value]) => (
                <div key={label}>
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
            <footer>
              <Check size={16} aria-hidden="true" /> Podstatné údaje už máte. Môžete sa venovať
              ponuke.
            </footer>
          </article>
        </div>
        <p className={s.simulation}>Oba dopyty sú dizajnové ukážky s fiktívnymi údajmi.</p>
      </div>
    </section>
  );
}

export function HomeFAQ() {
  const [opened, setOpened] = useState<number | null>(0);
  return (
    <section id="faq" className={s.faq} data-reveal>
      <div className={s.faqIntro}>
        <span className={s.label}>OTÁZKY A ODPOVEDE</span>
        <h2>Často sa pýtate</h2>
        <p>Krátke odpovede na to, čo riešia firmy pred spustením.</p>
        <button type="button" className="mc-btn" onClick={openBuilder}>
          Vyskladať riešenie <ArrowRight size={18} />
        </button>
        <div className={s.faqChat}>
          <span>
            <i aria-hidden="true" /> Chatbot je online
          </span>
          <h3>Nenašli ste svoju otázku?</h3>
          <button
            type="button"
            onClick={() =>
              window.dispatchEvent(
                new CustomEvent("site-assistant:open", { detail: { entry: "chat" } }),
              )
            }
          >
            Napíšte ju sem…{" "}
            <span className={s.faqSend}>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                aria-hidden="true"
              >
                <path d="M12 19V5m-7 7 7-7 7 7" />
              </svg>
            </span>
          </button>
        </div>
      </div>
      <div className={s.faqList}>
        {faqs.map((faq, index) => (
          <article className={s.faqItem} data-open={opened === index} key={faq.q}>
            <h3>
              <button
                type="button"
                aria-expanded={opened === index}
                aria-controls={`faq-answer-${index}`}
                id={`faq-question-${index}`}
                onClick={() => setOpened(opened === index ? null : index)}
              >
                <span className={s.faqNumber}>{String(index + 1).padStart(2, "0")}</span>
                <span>{faq.q}</span>
                <span className={s.faqToggle}>
                  {opened === index ? (
                    <Minus size={18} aria-hidden="true" />
                  ) : (
                    <Plus size={18} aria-hidden="true" />
                  )}
                </span>
              </button>
            </h3>
            <div
              className={s.faqAnswer}
              id={`faq-answer-${index}`}
              role="region"
              aria-labelledby={`faq-question-${index}`}
              aria-hidden={opened !== index}
              inert={opened !== index ? true : undefined}
            >
              <div>
                <p>{faq.a}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
