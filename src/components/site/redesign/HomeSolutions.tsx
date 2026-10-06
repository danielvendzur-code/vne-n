import { ArrowRight, ArrowUpRight, Check } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { PergolaDemo } from "./PergolaDemo";
import { sitePath } from "./utils";
import s from "./HomeSolutions.module.css";
function NativePreview({ mode }: { mode: "chat" | "calc" }) {
  const root = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ scale: 0.6, height: 510 });
  useEffect(() => {
    if (!root.current) return;
    const observer = new ResizeObserver(([entry]) => {
      const scale = entry.contentRect.width / 400;
      if (scale > 0) setSize({ scale, height: entry.contentRect.height / scale });
    });
    observer.observe(root.current);
    return () => observer.disconnect();
  }, []);
  return (
    <div className={s.nativePreview} ref={root}>
      <iframe
        src={sitePath(`/work/mojplot/index.html?demo=${mode}`)}
        title={
          mode === "calc"
            ? "Pôvodná kalkulačka MôjPlot – interaktívna ukážka"
            : "Pôvodný chatbot MôjPlot – interaktívna ukážka"
        }
        loading="lazy"
        sandbox="allow-scripts allow-same-origin"
        style={{ height: size.height, transform: `scale(${size.scale})` }}
      />
    </div>
  );
}
const ChatPreview = () => <NativePreview mode="chat" />;
const CalculatorPreview = () => <NativePreview mode="calc" />;
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
    title: "3D konfigurátor",
    copy: "Zákazník vidí farbu, otočné lamely aj ZIP tienenie na svojej zostave.",
    href: "/3d-konfigurator",
    demo: () => <PergolaDemo compact />,
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
        <p>Vyskúšajte pohyb lamiel, zmenu farby aj cestu od otázky k pripravenému dopytu.</p>
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
