import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check } from "lucide-react";
import { PageIntro, Reveal } from "@/components/site/motion-primitives";
import "@/components/site/BrandStudioPricingPage.css";
import { breadcrumbJsonLd, seo } from "@/lib/seo";

export const Route = createFileRoute("/cennik")({
  head: () => ({
    ...seo({
      title: "Cenník — chatbot, kalkulačka a konfigurátor na mieru",
      description:
        "Tri úrovne riešenia Môj Chatbot: START od 390 €, SMART od 690 € a PRO od 990 €. Rozsah a cenu potvrdíme vopred podľa vášho webu a logiky.",
      path: "/cennik",
    }),
    scripts: [
      {
        type: "application/ld+json",
        children: breadcrumbJsonLd([{ name: "Cena", path: "/cennik" }]),
      },
    ],
  }),
  component: PricingPage,
});

const plans = [
  {
    index: "01",
    name: "START",
    price: "od 390 €",
    monthly: "29 € / mes.",
    forWho: "Keď má chatbot hlavne odpovedať a zbierať lepšie dopyty.",
    items: [
      "Chatbot podľa obsahu a podkladov firmy",
      "Odpovede na časté otázky",
      "Zbieranie dopytu a kontaktu",
      "Dizajn prispôsobený vášmu webu",
      "Nasadenie na desktop aj mobil",
    ],
  },
  {
    index: "02",
    name: "SMART",
    price: "od 690 €",
    monthly: "39 € / mes.",
    forWho: "Keď má web zákazníka kvalifikovať, počítať alebo viesť výberom.",
    items: [
      "Všetko zo START",
      "Vlastná konverzačná logika",
      "Kalkulačka alebo jednoduchý konfigurátor",
      "Viac scenárov podľa typu zákazníka",
      "Základné meranie konverzných krokov",
    ],
    featured: true,
  },
  {
    index: "03",
    name: "PRO",
    price: "od 990 €",
    monthly: "59 € / mes.",
    forWho: "Keď riešenie potrebuje komplexnejší workflow, viac vetiev alebo napojenia.",
    items: [
      "Všetko zo SMART",
      "Pokročilý konfigurátor alebo výpočtová logika",
      "Viac typov dopytov a výsledkov",
      "Individuálne UX pre konkrétny proces",
      "Voliteľné integrácie podľa projektu",
    ],
  },
] as const;

const inputs = [
  [
    "01",
    "Odkaz na web",
    "Pozrieme si ponuku, štruktúru a spôsob, akým dnes zákazník kontaktuje firmu.",
  ],
  [
    "02",
    "Obsah a pravidlá",
    "Stačia existujúce texty, cenník, časté otázky a pravidlá, podľa ktorých má riešenie odpovedať.",
  ],
  [
    "03",
    "Logika výpočtu alebo výberu",
    "Pri kalkulačke či konfigurátore potrebujeme vedieť, aké vstupy menia cenu alebo výsledok.",
  ],
  [
    "04",
    "Miesto pre výsledok",
    "Dohodneme, kam má prísť dopyt — napríklad e-mail, tabuľka, kalendár alebo iný systém podľa projektu.",
  ],
] as const;

function PricingPage() {
  return (
    <div className="sp-page brand-pricing-page">
      <PageIntro
        eyebrow="Cenník"
        title={
          <>
            Jednoduchý základ. <em>Rozsah podľa toho, čo má web robiť.</em>
          </>
        }
        lead="Cena sa nemení podľa počtu pekných obrazoviek, ale podľa logiky pod nimi. Preto máte tri jasné úrovne a presný rozsah potvrdíme ešte pred začiatkom."
      />

      <section className="sp-section brand-pricing-section">
        <div className="container-page">
          <div className="brand-pricing-table">
            {plans.map((plan) => (
              <Reveal
                className={`brand-pricing-row${plan.featured ? " is-featured" : ""}`}
                key={plan.name}
                amount={0.15}
              >
                <span className="brand-pricing-index">{plan.index}</span>
                <div className="brand-pricing-name">
                  <h2>{plan.name}</h2>
                  {plan.featured ? <small>Najčastejšia voľba</small> : null}
                </div>
                <div className="brand-pricing-price">
                  <b>{plan.price}</b>
                  <span>{plan.monthly}</span>
                </div>
                <p className="brand-pricing-for">{plan.forWho}</p>
                <ul>
                  {plan.items.map((item) => (
                    <li key={item}>
                      <Check aria-hidden="true" size={15} />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link to="/kontakt" className="brand-pricing-action">
                  Prebrať rozsah <ArrowRight aria-hidden="true" size={16} />
                </Link>
              </Reveal>
            ))}
          </div>
          <p className="brand-pricing-note">
            Uvedené ceny sú orientačné „od“. Pred realizáciou dostanete konkrétny rozsah,
            jednorazovú cenu aj mesačný poplatok písomne — bez prekvapenia po dokončení.
          </p>
        </div>
      </section>

      <section className="sp-section sp-section--soft brand-inputs-section">
        <div className="container-page brand-inputs-layout">
          <Reveal className="brand-inputs-heading">
            <span>Čo potrebujeme od vás</span>
            <h2>Väčšinu podkladov už pravdepodobne máte.</h2>
            <p>
              Nepripravujete technickú špecifikáciu. Potrebujeme pochopiť váš biznis a pravidlá;
              návrh flow a rozhrania je na nás.
            </p>
          </Reveal>
          <div className="brand-inputs-list">
            {inputs.map(([index, title, copy]) => (
              <Reveal className="brand-input-row" key={index}>
                <span>{index}</span>
                <div>
                  <h3>{title}</h3>
                  <p>{copy}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="sp-section brand-pricing-cta-section">
        <div className="container-page brand-pricing-cta">
          <Reveal>
            <span>Presná cena za jeden rozhovor</span>
            <h2>Pošlite web. Povieme vám, ktorý rozsah má reálne zmysel.</h2>
          </Reveal>
          <Reveal className="brand-pricing-cta-actions">
            <Link to="/kontakt" className="sp-button sp-button--primary">
              Nezáväzná konzultácia <ArrowRight aria-hidden="true" />
            </Link>
            <Link to="/projekty" className="sp-button sp-button--ghost">
              Najprv realizácie
            </Link>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
