import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Clock3,
  FileCheck2,
  Filter,
  MessageCircle,
  MousePointerClick,
  TrendingUp,
} from "lucide-react";
import { PageIntro, Reveal } from "@/components/site/motion-primitives";
import { openSiteAssistant } from "@/lib/site-assistant";
import { seo } from "@/lib/seo";
import "./preco-chatbot.css";

export const Route = createFileRoute("/preco-chatbot")({
  head: () => ({
    ...seo({
      title: "Ako chatbot pomôže vášmu webu — viac dopytov z rovnakej návštevnosti",
      description:
        "Väčšina návštevníkov odíde bez otázky. Chatbot odpovie hneď, vypočíta cenu a odovzdá vám dopyt aj s kontextom. Pozrite si, čo to zmení na vašom webe.",
      path: "/preco-chatbot",
    }),
  }),
  component: WhyChatbotPage,
});

const problems = [
  {
    icon: MousePointerClick,
    title: "Návštevník nenájde odpoveď a odíde",
    copy: "Cenník je všeobecný, otázka je konkrétna. Namiesto písania e-mailu zavrie kartu a pozrie sa ku konkurencii.",
  },
  {
    icon: Clock3,
    title: "Odpoveď príde neskoro",
    copy: "Kým sa dostanete k e-mailu, zákazník už väčšinou oslovil niekoho ďalšieho. Rýchlosť prvej odpovede rozhoduje.",
  },
  {
    icon: Filter,
    title: "Z formulára príde holý kontakt",
    copy: "Meno a e-mail bez rozsahu, lokality či termínu. Nasleduje niekoľko správ, kým vôbec viete, či sa dopyt oplatí.",
  },
];

const outcomes = [
  {
    icon: MessageCircle,
    title: "Odpovie v sekunde, aj o polnoci",
    copy: "Chatbot pozná vaše služby, cenník a podmienky. Odpovedá presne podľa podkladov, ktoré mu dáte — nič si nevymýšľa.",
  },
  {
    icon: TrendingUp,
    title: "Z otázky spraví výpočet",
    copy: "Kalkulačka alebo konfigurátor prevedie zákazníka pár otázkami a ukáže mu orientačnú cenu či rozsah ešte na webe.",
  },
  {
    icon: FileCheck2,
    title: "Dopyt príde aj s kontextom",
    copy: "Dostanete službu, vstupy, lokalitu aj kontakt v jednej správe. Môžete rovno potvrdiť termín namiesto zisťovania údajov.",
  },
];

const fits = [
  "Služby, kde sa cena počíta podľa rozmerov alebo rozsahu",
  "Produkty s variantmi, kde si zákazník nevie vybrať sám",
  "Weby, na ktoré chodia ľudia, ale dopytov je málo",
  "Firmy, ktoré odpovedajú stále na tie isté otázky",
];

function WhyChatbotPage() {
  return (
    <div className="sp-page why-page">
      <PageIntro
        eyebrow="Prečo chatbot"
        title={
          <>
            Rovnaká návštevnosť. <em>Viac dopytov.</em>
          </>
        }
        lead="Väčšina ľudí neodíde preto, že by nemali záujem. Odídu preto, že nedostali odpoveď dosť rýchlo. Toto je časť, ktorú chatbot rieši."
      />

      <section className="sp-section why-problem" aria-labelledby="why-problem-title">
        <div className="container-page">
          <div className="sp-heading">
            <h2 id="why-problem-title">
              Kde weby <em>strácajú dopyty.</em>
            </h2>
            <p className="sp-heading-copy">
              Tri miesta, ktoré vidím takmer na každom webe, kam sa pozriem.
            </p>
          </div>

          <div className="why-grid">
            {problems.map(({ icon: Icon, title, copy }, index) => (
              <Reveal className="why-card" key={title} delay={index * 0.07}>
                <span className="why-card__icon" aria-hidden="true">
                  <Icon />
                </span>
                <h3>{title}</h3>
                <p>{copy}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section
        className="sp-section sp-section--soft why-outcome"
        aria-labelledby="why-outcome-title"
      >
        <div className="container-page">
          <div className="sp-heading">
            <h2 id="why-outcome-title">
              Čo sa zmení, keď je na webe <em>asistent.</em>
            </h2>
            <p className="sp-heading-copy">
              Nie je to okno s „Ako vám môžem pomôcť?". Je to krátky rozhovor, ktorý končí
              konkrétnym výsledkom.
            </p>
          </div>

          <div className="why-grid">
            {outcomes.map(({ icon: Icon, title, copy }, index) => (
              <Reveal className="why-card why-card--accent" key={title} delay={index * 0.07}>
                <span className="why-card__icon" aria-hidden="true">
                  <Icon />
                </span>
                <h3>{title}</h3>
                <p>{copy}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="sp-section why-demo" aria-labelledby="why-demo-title">
        <div className="container-page">
          <div className="sp-heading">
            <h2 id="why-demo-title">
              Vyskúšajte si to <em>naživo.</em>
            </h2>
            <p className="sp-heading-copy">
              Toto je reálny asistent, nie video ani obrázok. Napíšte mu otázku tak, ako by ju
              napísal váš zákazník.
            </p>
          </div>

          <Reveal className="why-demo-frame">
            {/* Jednoriadkový iframe: obsah sa načítava priamo z repozitára chatbota,
                takže každá zmena tam sa prejaví tu bez zásahu do kódu webu. */}
            <iframe
              src="https://danielvendzur-code.github.io/moj.chatbot.backend/"
              title="Živá ukážka chatbota"
              loading="lazy"
            />
          </Reveal>
        </div>
      </section>

      <section className="sp-section sp-section--soft why-fit" aria-labelledby="why-fit-title">
        <div className="container-page">
          <div className="sp-heading">
            <h2 id="why-fit-title">
              Komu to <em>dáva zmysel.</em>
            </h2>
          </div>
          <ul className="why-fit-list">
            {fits.map((fit) => (
              <li key={fit}>
                <ArrowRight aria-hidden="true" />
                {fit}
              </li>
            ))}
          </ul>

          <div className="why-actions">
            <button
              type="button"
              className="sp-button sp-button--primary"
              onClick={() => openSiteAssistant({ source: "why-page", entry: "builder" })}
            >
              Chcem takéto riešenie
            </button>
            <Link to="/projekty" className="sp-button sp-button--ghost">
              Pozrieť realizácie
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
