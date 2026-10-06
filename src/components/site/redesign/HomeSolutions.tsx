import { ArrowRight, ArrowUpRight, Send, Check } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { BrandMark } from "@/components/BrandMark";
import { PergolaDemo } from "./PergolaDemo";
import { sitePath } from "./utils";
import s from "./HomeSolutions.module.css";
const openChat = () =>
  window.dispatchEvent(new CustomEvent("site-assistant:open", { detail: { entry: "recommend" } }));
const answers = [
  {
    q: "Čo dokáže chatbot na webe?",
    a: "Odpovie z vašich podkladov, odporučí vhodné riešenie a pripraví dopyt s kontaktom.",
  },
  {
    q: "Kam prídu dopyty?",
    a: "Na váš e-mail. Kontakt aj všetky voľby zákazníka dostanete v jednej prehľadnej správe.",
  },
];
function ChatPreview() {
  const [question, setQuestion] = useState<number | null>(null);
  const [typing, setTyping] = useState(false);
  useEffect(() => {
    if (question === null) return;
    setTyping(true);
    const id = setTimeout(() => setTyping(false), 750);
    return () => clearTimeout(id);
  }, [question]);
  return (
    <div className={s.chat}>
      <div className={s.chatHead}>
        <BrandMark size={24} tone="paper" />
        <span>
          Môj Chatbot<small>Ukážka rozhovoru</small>
        </span>
        <i />
      </div>
      <div className={s.messages}>
        <p className={s.bot}>Dobrý deň. Čo by mal váš web robiť za vás?</p>
        {question !== null && (
          <>
            <p className={s.user}>{answers[question].q}</p>
            <p className={s.bot} key={question}>
              {typing ? <BrandMark size={20} loop tone="brand" /> : answers[question].a}
            </p>
          </>
        )}
      </div>
      <div className={s.questions}>
        {answers.map((a, i) => (
          <button type="button" key={a.q} onClick={() => setQuestion(i)}>
            {a.q}
            <ArrowUpRight size={14} />
          </button>
        ))}
      </div>
      <button className={s.composer} type="button" onClick={openChat}>
        Napíšte vlastnú otázku <Send size={15} />
      </button>
    </div>
  );
}
function CalculatorPreview() {
  const [length, setLength] = useState(20);
  const [type, setType] = useState("3D panel");
  const price = length * (type === "3D panel" ? 30 : 50);
  return (
    <div className={s.calculator}>
      <div className={s.calcTop}>
        <span>Oplotenie pozemku</span>
        <small>Ukážka výpočtu</small>
      </div>
      <img
        className={s.fencePhoto}
        key={type}
        src={sitePath(
          `/work/solutions/${type === "3D panel" ? "fence-panel" : "fence-concrete"}.webp`,
        )}
        alt={
          type === "3D panel"
            ? "Skutočný panelový plot z katalógu Môj Plot"
            : "Betónový plot z katalógu Môj Plot"
        }
        width={600}
        height={300}
        loading="lazy"
      />
      <div className={s.segment}>
        {["3D panel", "Betón"].map((t) => (
          <button type="button" aria-pressed={type === t} onClick={() => setType(t)} key={t}>
            {t}
          </button>
        ))}
      </div>
      <label>
        Dĺžka plotu <output>{length} m</output>
        <input
          aria-label="Dĺžka plotu"
          type="range"
          min="5"
          max="60"
          value={length}
          onChange={(e) => setLength(Number(e.target.value))}
        />
      </label>
      <div className={s.total}>
        <span>
          Orientačne za plot<small>Modelový výpočet bez montáže</small>
        </span>
        <strong key={price}>{price.toLocaleString("sk-SK")} €</strong>
      </div>
    </div>
  );
}
function AdvisorPreview() {
  const [skin, setSkin] = useState("Suchá");
  const [chosen, setChosen] = useState(false);
  return (
    <div className={s.advisor}>
      <img
        src={sitePath("/work/solutions/skincare-photo.webp")}
        alt="Reálna fotografia prírodnej starostlivosti o pleť"
        width={900}
        height={600}
        loading="lazy"
      />
      <div className={s.advice}>
        <span>Čo potrebuje vaša pleť?</span>
        <div className={s.segment}>
          {["Suchá", "Citlivá", "Mastná"].map((t) => (
            <button
              type="button"
              aria-pressed={skin === t}
              key={t}
              onClick={() => {
                setSkin(t);
                setChosen(false);
              }}
            >
              {t}
            </button>
          ))}
        </div>
        <button className={s.recommend} type="button" onClick={() => setChosen(true)}>
          {chosen ? <Check size={16} /> : <ArrowRight size={16} />}{" "}
          {chosen ? "Odporúčanie pripravené" : "Nájsť vhodnú starostlivosť"}
        </button>
        {chosen && (
          <p className={s.result} key={skin}>
            {skin === "Mastná"
              ? "Ľahká hydratácia bez hutnej textúry. Poradca vyberie vhodné produkty z vášho katalógu."
              : skin === "Citlivá"
                ? "Jemná starostlivosť s jednoduchým zložením. Výber z katalógu zohľadní vaše preferencie."
                : "Hydratačný krém a šetrné čistenie. Poradca vysvetlí, prečo odporúča konkrétny produkt."}
          </p>
        )}
      </div>
    </div>
  );
}
const solutions = [
  {
    title: "Chatbot",
    copy: "Zodpovie otázku, pochopí potrebu a prevedie zákazníka k ďalšiemu kroku.",
    href: "/nastroj?t=chatbot",
    demo: ChatPreview,
  },
  {
    title: "Kalkulačka",
    copy: "Rozmery a možnosti premení na cenu podľa vášho cenníka. Bez ručného počítania.",
    href: "/nastroj?t=kalkulacka",
    demo: CalculatorPreview,
  },
  {
    title: "Poradca",
    copy: "Pomôže s výberom z vášho katalógu. Vysvetlí odporúčanie a zjednoduší rozhodovanie.",
    href: "/nastroj?t=poradca",
    demo: AdvisorPreview,
  },
  {
    title: "3D konfigurátor",
    copy: "Farby, pohyb lamiel aj tienenie uvidí zákazník priamo na vlastnej zostave.",
    href: "/3d-konfigurator",
    demo: () => <PergolaDemo compact />,
  },
];
export function HomeSolutions() {
  const root = useRef<HTMLDivElement>(null);
  return (
    <section id="riesenia" className={s.section} aria-labelledby="solutions-title">
      <header className={s.heading}>
        <h2 id="solutions-title">Riešenia pre váš web</h2>
        <p>Vyskúšajte, čo sa zmení po otázke, posunutí rozmeru alebo výbere farby.</p>
      </header>
      <div ref={root} className={s.panels}>
        {solutions.map(({ title, copy, href, demo: Demo }, i) => (
          <article className={s.panel} key={title} data-solution-card={i}>
            <div className={s.panelBody}>
              <span className={s.number}>0{i + 1}</span>
              <h3>{title}</h3>
              <p>{copy}</p>
              <a href={sitePath(href)}>
                Pozrieť riešenie <ArrowUpRight size={17} />
              </a>
            </div>
            <div className={s.preview}>
              <Demo />
            </div>
          </article>
        ))}
      </div>
      <div className={s.connection}>
        <h3>Samostatne alebo spolu.</h3>
        <p>Jeden nástroj alebo premyslené prepojenie.</p>
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
