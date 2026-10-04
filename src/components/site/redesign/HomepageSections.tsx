import { useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Box,
  Calculator,
  Check,
  Mail,
  MessageSquare,
  Plus,
  Minus,
  SlidersHorizontal,
} from "lucide-react";
import { faqs } from "@/data/faq";
import { sitePath } from "./utils";
import s from "./HomepageSections.module.css";

const openBuilder = () =>
  window.dispatchEvent(new CustomEvent("site-assistant:open", { detail: { entry: "builder" } }));

export function HomeFacts() {
  return (
    <section className={s.facts} aria-label="Čo môžete očakávať">
      <div className={s.fact}>
        <span>Prvá odpoveď</span>
        <strong>
          1 deň<span>v pracovný deň</span>
        </strong>
        <p>Ozveme sa s konkrétnym ďalším krokom.</p>
      </div>
      <a className={s.fact} href={sitePath("/cennik")}>
        <span>
          Chatbot alebo poradca <ArrowUpRight size={16} />
        </span>
        <strong>
          <small>od </small>347 €
        </strong>
        <p>Návrh, obsah, logika a nasadenie.</p>
      </a>
      <a className={s.fact} href={sitePath("/cennik")}>
        <span>
          Kalkulačka alebo konfigurátor <ArrowUpRight size={16} />
        </span>
        <strong>
          <small>od </small>447 €
        </strong>
        <p>Presnú cenu dohodneme podľa rozsahu.</p>
      </a>
      <div className={`${s.fact} ${s.factDark}`}>
        <span>Najprv vlastná ukážka</span>
        <strong>
          Vyskúšate.
          <br />
          Potom schválite.
        </strong>
        <p>Na váš web ide až odsúhlasené riešenie.</p>
      </div>
    </section>
  );
}

const tools = [
  {
    title: "Chatbot",
    icon: MessageSquare,
    copy: "Odpovedá z vašich podkladov. Zistí potrebu a pripraví dopyt.",
    image: "/work/solutions/chatbot-aplan.webp",
    href: "/nastroj?t=chatbot",
  },
  {
    title: "Cenová kalkulačka",
    icon: Calculator,
    copy: "Spočíta cenu podľa rozmerov, množstva a vašich pravidiel.",
    image: "/work/solutions/kalkulacka-derat.webp",
    href: "/nastroj?t=kalkulacka",
  },
  {
    title: "Interaktívny poradca",
    icon: SlidersHorizontal,
    copy: "Pomôže zákazníkovi vybrať produkt alebo službu, ktorá mu sedí.",
    image: "/work/solutions/poradca-kava.webp",
    href: "/nastroj?t=poradca",
  },
];

export function HomeSolutions() {
  return (
    <section id="riesenia" className={s.solutions}>
      <header className={s.sectionHead}>
        <span className={s.label}>Riešenia pre váš web</span>
        <h2>
          Každý nástroj má
          <br />
          svoju dobrú úlohu.
        </h2>
        <p>
          Od prvej otázky po pripravený dopyt. Vyberieme riešenie podľa toho, čo zákazníci na vašom
          webe potrebujú.
        </p>
      </header>
      <div className={s.tools}>
        <article className={s.featuredTool}>
          <a
            className={s.scene}
            href={sitePath("/3d-konfigurator")}
            aria-label="Pozrieť 3D konfigurátor"
          >
            <img
              src={sitePath("/work/koverta/model-porsche.webp")}
              width={1200}
              height={843}
              alt="Ilustračný 3D model strieborného Porsche pod hliníkovým prístreškom"
              loading="lazy"
              decoding="async"
            />
          </a>
          <div className={s.featuredCopy}>
            <Box size={24} strokeWidth={1.6} aria-hidden="true" />
            <h3>
              Nech si ho zákazník
              <br />
              poskladá sám.
            </h3>
            <p>
              Rozmery, materiály a doplnky vidí priamo v 3D. Vy dostanete dopyt s konkrétnou
              zostavou.
            </p>
            <a className={s.action} href={sitePath("/3d-konfigurator")}>
              Pozrieť 3D konfigurátor <ArrowUpRight size={18} />
            </a>
            <small>
              Cena podľa rozsahu. Porsche je ilustračný model, nie referencia spolupráce.
            </small>
          </div>
        </article>
        <div className={s.otherTools}>
          {tools.map(({ title, icon: Icon, copy, image, href }) => (
            <a className={s.tool} href={sitePath(href)} key={title}>
              <div className={s.toolImage}>
                <img
                  src={sitePath(image)}
                  width={400}
                  height={480}
                  alt={`Ukážka rozhrania: ${title}`}
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div>
                <Icon size={22} strokeWidth={1.6} aria-hidden="true" />
                <h3>{title}</h3>
                <p>{copy}</p>
                <span className={s.toolLink}>
                  Ako funguje <ArrowUpRight size={16} aria-hidden="true" />
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
      <div className={s.combinations}>
        <div>
          <h3>Samostatne alebo spolu.</h3>
          <p>
            Podľa toho, čo váš web potrebuje. 3D konfigurátor môže fungovať sám. Chatbot môže pomôcť
            s výberom alebo nadviazať na kalkulačku.
          </p>
          <button type="button" className="mc-btn" onClick={openBuilder}>
            Vyskladať riešenie <ArrowRight size={18} />
          </button>
        </div>
        <div
          className={s.toolNetwork}
          aria-label="Štyri samostatné nástroje s možnosťou kombinovania"
        >
          {[
            { name: "Chatbot", icon: MessageSquare },
            { name: "Kalkulačka", icon: Calculator },
            { name: "3D konfigurátor", icon: Box },
            { name: "Poradca", icon: SlidersHorizontal },
          ].map(({ name, icon: Icon }) => (
            <div className={s.networkNode} key={name}>
              <span>
                <Icon size={28} strokeWidth={1.5} aria-hidden="true" />
              </span>
              <strong>{name}</strong>
            </div>
          ))}
          <p>Jeden nástroj. Alebo premyslené prepojenie.</p>
        </div>
      </div>
    </section>
  );
}

export function InquiryComparison() {
  return (
    <section id="pred-a-po" className={s.comparison}>
      <div className={s.comparisonInner}>
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
    <section id="faq" className={s.faq}>
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
