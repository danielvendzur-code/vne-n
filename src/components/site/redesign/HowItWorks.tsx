import { MessageCircle, SlidersHorizontal, Send, ArrowRight } from "lucide-react";
import { sitePath } from "./utils";
import s from "./HowItWorks.module.css";

const steps = [
  {
    icon: MessageCircle,
    title: "Zákazník povie, čo potrebuje.",
    copy: "Chatbot zodpovie prvé otázky. Poradca mu pomôže nájsť vhodný produkt alebo službu.",
    detail: "Otázka → zrozumiteľná odpoveď",
  },
  {
    icon: SlidersHorizontal,
    title: "Vyberie možnosti a pozná cenu.",
    copy: "Kalkulačka počíta podľa vášho cenníka. Konfigurátor ukáže rozmery, farby a doplnky na konkrétnej zostave.",
    detail: "Voľby → výpočet alebo 3D náhľad",
  },
  {
    icon: Send,
    title: "Vy dostanete všetko podstatné.",
    copy: "Keď zákazník požiada o ponuku, príde vám kontakt spolu s jeho výberom. Máte podklady na konkrétnu odpoveď.",
    detail: "Záujem → pripravený dopyt",
  },
];

export function HowItWorks() {
  return (
    <section id="ako-to-funguje" className={s.section} aria-labelledby="how-title">
      <header>
        <span>AKO TO FUNGUJE</span>
        <h2 id="how-title">Menej otázok medzi záujmom a ponukou.</h2>
        <p>
          Nástroje môžu fungovať samostatne aj spolu. Každý má jasnú úlohu v ceste vášho zákazníka.
        </p>
      </header>
      <div className={s.steps}>
        {steps.map(({ icon: Icon, title, copy, detail }, i) => (
          <article key={title}>
            <div className={s.top}>
              <span>0{i + 1}</span>
              <Icon size={28} strokeWidth={1.4} />
            </div>
            <h3>{title}</h3>
            <p>{copy}</p>
            <div className={s.detail}>{detail}</div>
          </article>
        ))}
      </div>
      <a className={s.link} href={sitePath("/postup")}>
        Ako pripravíme riešenie pre váš web <ArrowRight size={17} />
      </a>
    </section>
  );
}
