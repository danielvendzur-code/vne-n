import { ArrowRight, ArrowUpRight } from "lucide-react";
import { useRef } from "react";
import { PergolaVideo } from "./PergolaVideo";
import { sitePath } from "./utils";
import s from "./HomeSolutions.module.css";
function NativePreview({ mode }: { mode: "chat" | "calc" }) {
  return (
    <div className={s.snapshot}>
      <img
        src={sitePath(`/work/solutions/mojplot-${mode}-preview.webp`)}
        alt={
          mode === "chat"
            ? "Pôvodný widget MôjPlot s ukážkou rozhovoru"
            : "Pôvodná kalkulačka MôjPlot s výberom plotu"
        }
        width={400}
        height={mode === "chat" ? 480 : 560}
        loading="lazy"
      />
    </div>
  );
}
const ChatPreview = () => <NativePreview mode="chat" />;
const CalculatorPreview = () => <NativePreview mode="calc" />;
function AdvisorPreview() {
  return (
    <div className={s.advisor}>
      <img
        src={sitePath("/work/solutions/skincare-photo.webp")}
        alt="Neznačková starostlivosť o pleť"
        width={900}
        height={600}
        loading="lazy"
      />
      <div className={s.advice}>
        <span>Čo potrebuje vaša pleť?</span>
        <div className={s.segment}>
          <span data-selected="true">Suchá</span>
          <span>Citlivá</span>
          <span>Mastná</span>
        </div>
        <p className={s.previewRecommendation}>
          Hydratácia podľa vašej pleti.
          <br />
          <small>Poradca vysvetlí, prečo odporúča konkrétny produkt.</small>
        </p>
      </div>
    </div>
  );
}
const solutions = [
  {
    title: "3D konfigurátor",
    copy: "Zákazník vidí farbu, otočné lamely aj ZIP tienenie na svojej zostave.",
    href: "/3d-konfigurator",
    demo: PergolaVideo,
  },
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
];
export function HomeSolutions() {
  const root = useRef<HTMLDivElement>(null);
  return (
    <section id="riesenia" className={s.section} aria-labelledby="solutions-title">
      <header className={s.heading}>
        <h2 id="solutions-title">Riešenia pre váš web</h2>
        <p>Ukážky nástrojov pre váš web. Od prvej otázky po výber produktu a pripravený dopyt.</p>
      </header>
      <div ref={root} className={s.panels}>
        {solutions.map(({ title, copy, href, demo: Demo }, i) => (
          <article className={s.panel} key={title} data-solution-card={i}>
            <div className={s.panelBody}>
              <span className={s.number}>0{i + 1}</span>
              <h3>{title}</h3>
              <p>{copy}</p>
              <a href={sitePath(href)} aria-label={`Pozrieť riešenie: ${title}`}>
                <ArrowUpRight size={20} />
              </a>
            </div>
            <div className={s.preview}>
              <Demo />
            </div>
          </article>
        ))}
      </div>
      <p className={s.scope}>
        Ukážky predstavujú len časť možností. Kompletný 3D konfigurátor pridáva výber modelu,
        rozmery, materiály, výbavu aj odoslanie konkrétnej zostavy.
      </p>
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
