import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Clock3,
  FileCheck2,
  Filter,
  MessageCircle,
  MousePointerClick,
  PackageCheck,
  TrendingUp,
} from "lucide-react";
import { PageIntro, Reveal } from "@/components/site/motion-primitives";
import { openSiteAssistant } from "@/lib/site-assistant";
import { breadcrumbJsonLd, seo } from "@/lib/seo";
import "./preco-chatbot.css";

export const Route = createFileRoute("/preco-chatbot")({
  head: () => ({
    ...seo({
      title: "Ako chatbot pomôže e-shopu alebo firme so službami",
      description:
        "Chatbot odpovie hneď, pomôže s výberom, vypočíta cenu a pripraví dopyt, objednávku alebo reklamáciu. Pozrite si, čo zmení na vašom webe.",
      path: "/preco-chatbot",
    }),
    scripts: [
      {
        type: "application/ld+json",
        children: breadcrumbJsonLd([{ name: "Čo to prinesie webu", path: "/preco-chatbot" }]),
      },
    ],
  }),
  component: WhyChatbotPage,
});

const problems = [
  {
    icon: MousePointerClick,
    title: "Zákazník nenájde odpoveď a odíde",
    copy: "Má konkrétnu otázku, no na stránke nájde iba všeobecný text. Namiesto písania e-mailu sa pozrie inde.",
  },
  {
    icon: Clock3,
    title: "Odpoveď príde neskoro",
    copy: "Kým sa dostanete k správe, zákazník už môže riešiť ponuku, objednávku alebo termín s niekým iným.",
  },
  {
    icon: Filter,
    title: "Príde kontakt bez dôležitých údajov",
    copy: "Neviete, čo človek potrebuje, aký má rozmer, rozpočet, číslo objednávky ani termín. Všetko musíte zisťovať znova.",
  },
];

const outcomes = [
  {
    icon: MessageCircle,
    title: "Odpovie hneď, aj mimo pracovného času",
    copy: "Chatbot používa vaše služby, produkty, ceny a pravidlá. Keď odpoveď nepozná, vypýta si kontakt namiesto hádania.",
  },
  {
    icon: TrendingUp,
    title: "Pomôže s cenou alebo výberom",
    copy: "Zákazník zadá potrebné údaje a dostane orientačnú cenu, vhodný produkt alebo odporúčaný ďalší krok.",
  },
  {
    icon: PackageCheck,
    title: "Pomôže aj po objednávke",
    copy: "V e-shope môže ukázať stav doručenia a pripraviť zmenu, zrušenie, vrátenie alebo reklamáciu.",
  },
  {
    icon: FileCheck2,
    title: "Vám príde všetko v jednej správe",
    copy: "Dostanete odpovede, výber, fotografie aj kontakt. Môžete rovno pokračovať ponukou alebo vybavením požiadavky.",
  },
];

const fits = [
  "E-shopy, ktoré riešia veľa otázok o produktoch a objednávkach",
  "Služby, kde sa cena počíta podľa rozmerov alebo rozsahu",
  "Produkty s variantmi, pri ktorých sa zákazník nevie rozhodnúť",
  "Firmy, ktoré stále odpovedajú na rovnaké otázky",
  "Weby s návštevnosťou, ale malým počtom dopytov alebo objednávok",
];

function WhyChatbotPage() {
  return (
    <div className="sp-page why-page">
      <PageIntro
        eyebrow="Prínos pre web"
        title={
          <>
            Menej čakania. <em>Viac vybavených zákazníkov.</em>
          </>
        }
        lead="Chatbot pomôže pred nákupom aj po ňom. Odpovie, vypočíta, poradí a pripraví údaje, ktoré potrebujete na ďalší krok."
      />

      <section className="sp-section why-problem" aria-labelledby="why-problem-title">
        <div className="container-page">
          <div className="sp-heading">
            <h2 id="why-problem-title">
              Kde weby <em>strácajú zákazníkov.</em>
            </h2>
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
              Čo sa zmení, keď je na webe <em>chatbot.</em>
            </h2>
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
              onClick={() => openSiteAssistant({ source: "why-page" })}
            >
              Vyskladať riešenie
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
