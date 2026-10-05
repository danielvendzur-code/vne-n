import { ArrowRight, ArrowUpRight } from "lucide-react";
import { sitePath } from "./utils";
import s from "./HomeSolutions.module.css";

const solutions = [
  {
    title: "Chatbot",
    copy: "Odpovedá na otázky. Zistí potrebu a pripraví dopyt.",
    image: "/work/solutions/chatbot-aplan.webp",
    alt: "Skutočné rozhranie chatbota APLAN s odpoveďou a ďalšími krokmi",
    href: "/nastroj?t=chatbot",
  },
  {
    title: "Kalkulačka",
    copy: "Spočíta cenu podľa rozmerov, množstva a vašich pravidiel.",
    image: "/work/solutions/kalkulacka-derat.webp",
    alt: "Cenová kalkulačka DERAT s výberom služby a veľkosti priestoru",
    href: "/nastroj?t=kalkulacka",
  },
  {
    title: "Poradca",
    copy: "Pomôže vybrať produkt alebo službu, ktorá zákazníkovi sedí.",
    image: "/work/solutions/poradca-kava.webp",
    alt: "Produktový poradca s výberom kávy podľa preferencií",
    href: "/nastroj?t=poradca",
  },
  {
    title: "3D konfigurátor",
    copy: "Rozmery, materiály a doplnky. Dopyt s konkrétnou zostavou.",
    image: "/work/koverta/model-porsche.webp",
    alt: "Ilustračný 3D model strieborného Porsche pod hliníkovým prístreškom",
    href: "/3d-konfigurator",
  },
] as const;

export function HomeSolutions() {
  return (
    <section id="riesenia" className={s.section} aria-labelledby="solutions-title">
      <header className={s.heading} data-reveal>
        <h2 id="solutions-title">Riešenia pre váš web</h2>
        <p>
          Od prvej otázky po pripravený dopyt. Vyberieme nástroj podľa toho, čo zákazníci potrebujú.
        </p>
      </header>
      <div className={s.panels} data-reveal>
        {solutions.map((solution, index) => (
          <a className={s.panel} href={sitePath(solution.href)} key={solution.title}>
            <div className={s.panelBody}>
              <div className={s.panelTop}>
                <span>0{index + 1}</span>
                <ArrowUpRight size={25} strokeWidth={1.5} aria-hidden="true" />
              </div>
              <h3>{solution.title}</h3>
              <p>{solution.copy}</p>
            </div>
            <div className={s.preview}>
              <img
                src={sitePath(solution.image)}
                alt={solution.alt}
                width={index === 3 ? 1200 : 640}
                height={index === 3 ? 843 : 1100}
                loading="lazy"
                decoding="async"
              />
              <span className={s.previewLink}>
                Pozrieť riešenie <ArrowUpRight size={16} aria-hidden="true" />
              </span>
            </div>
          </a>
        ))}
      </div>
      <div className={s.connection} data-reveal>
        <h3>Samostatne alebo spolu.</h3>
        <p>Jeden nástroj alebo premyslené prepojenie.</p>
        <button
          type="button"
          onClick={() =>
            window.dispatchEvent(
              new CustomEvent("site-assistant:open", { detail: { entry: "builder" } }),
            )
          }
        >
          Vyskladať riešenie <ArrowRight size={18} strokeWidth={1.6} aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}
