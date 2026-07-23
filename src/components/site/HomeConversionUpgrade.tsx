import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BadgeCheck,
  Bot,
  Calculator,
  Check,
  FileText,
  Globe2,
  Layers3,
  MessageCircle,
  Palette,
  Plug,
  ShieldCheck,
  SlidersHorizontal,
} from "lucide-react";
import { openSiteAssistant } from "@/lib/site-assistant";

const packages = [
  {
    icon: Bot,
    title: "AI chatbot na mieru",
    price: "od 350 €",
    copy: "Odpovede podľa podkladov firmy, zber kontaktu a odovzdanie dopytu s celým kontextom.",
    features: [
      "Vlastný scenár rozhovoru",
      "Dizajn prispôsobený webu",
      "Dopyty na e-mail",
      "Nasadenie na existujúci web",
    ],
  },
  {
    icon: Calculator,
    title: "Chatbot s výpočtom",
    price: "podľa logiky",
    copy: "Cena, spotreba, návratnosť alebo rozsah služby vypočítaný z reálnych vstupov zákazníka.",
    features: [
      "Vaše vzorce a pravidlá",
      "Orientačný výsledok ihneď",
      "Zhrnutie pre zákazníka",
      "Kompletné zadanie pre firmu",
    ],
  },
  {
    icon: SlidersHorizontal,
    title: "Chatbot s konfigurátorom",
    price: "podľa rozsahu",
    copy: "Výber modelu, rozmerov, variantov a doplnkov v jednom plynulom rozhraní bez chaotického formulára.",
    features: [
      "Krokový výber produktu",
      "Podmienené možnosti",
      "Súhrn konfigurácie",
      "Prepojenia podľa potreby",
    ],
  },
] as const;

const clientInputs = [
  {
    icon: Globe2,
    title: "Web a ponuka",
    copy: "Odkaz na web alebo stručný popis služieb a produktov, ktoré má nástroj vysvetľovať.",
  },
  {
    icon: FileText,
    title: "Pravidlá a podklady",
    copy: "Cenník, najčastejšie otázky, výpočty, možnosti výberu alebo existujúci obchodný postup.",
  },
  {
    icon: Palette,
    title: "Značka a vzhľad",
    copy: "Logo, farby a tón komunikácie. Keď ich nemáte pripravené, navrhnem vhodný smer.",
  },
  {
    icon: Plug,
    title: "Kam má ísť dopyt",
    copy: "E-mail, WhatsApp, kalendár, tabuľka alebo systém, v ktorom chcete s dopytom pokračovať.",
  },
] as const;

const trustPoints = [
  {
    icon: BadgeCheck,
    title: "Reálne živé ukážky",
    copy: "Nie iba obrázky alebo generické makety.",
  },
  {
    icon: Layers3,
    title: "Najprv logika",
    copy: "Otázky a rozhodovanie sa navrhnú pred vizuálom.",
  },
  {
    icon: ShieldCheck,
    title: "Bez skrytého rozsahu",
    copy: "Pred vývojom dostanete jasný návrh prvej verzie.",
  },
] as const;

export function HomeConversionUpgrade() {
  return (
    <section className="winner-upgrade" aria-labelledby="winner-upgrade-title">
      <div className="container-page winner-upgrade__inner">
        <header className="winner-upgrade__head">
          <p className="winner-upgrade__eyebrow">Cena a príprava projektu</p>
          <h2 id="winner-upgrade-title">
            Začíname od <em>350 €.</em> Rozsah poznáte ešte pred vývojom.
          </h2>
          <p>
            Jednoduchý chatbot môže byť nasadený rýchlo. Kalkulačka alebo konfigurátor sa nacení
            podľa počtu pravidiel, krokov a prepojení — vždy po krátkom zadaní, bez hádania.
          </p>
        </header>

        <div className="winner-trust" aria-label="Dôvody spolupráce">
          {trustPoints.map(({ icon: Icon, title, copy }) => (
            <article className="winner-trust__item spotlight-surface" key={title}>
              <Icon aria-hidden="true" />
              <div>
                <h3>{title}</h3>
                <p>{copy}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="winner-packages">
          {packages.map(({ icon: Icon, title, price, copy, features }, index) => (
            <article
              className="winner-package spotlight-surface"
              key={title}
              data-featured={index === 0}
            >
              <div className="winner-package__top">
                <span className="winner-package__icon" aria-hidden="true">
                  <Icon />
                </span>
                <span className="winner-package__price">{price}</span>
              </div>
              <h3>{title}</h3>
              <p>{copy}</p>
              <ul>
                {features.map((feature) => (
                  <li key={feature}>
                    <Check aria-hidden="true" /> {feature}
                  </li>
                ))}
              </ul>
              <button
                type="button"
                className="winner-package__cta spotlight-surface"
                onClick={() =>
                  openSiteAssistant({
                    source: "pricing-package",
                    entry: "builder",
                    category: title,
                  })
                }
              >
                Získať návrh riešenia <ArrowRight aria-hidden="true" />
              </button>
            </article>
          ))}
        </div>

        <div className="winner-prep">
          <div className="winner-prep__intro">
            <p className="winner-upgrade__eyebrow">Čo potrebujem od klienta</p>
            <h2>Stačia podklady, ktoré už pri predaji bežne používate.</h2>
            <p>
              Nemusíte pripravovať technickú dokumentáciu. Z vašich podkladov vytvorím logiku,
              otázky, texty aj vhodné rozloženie.
            </p>
          </div>
          <div className="winner-prep__grid">
            {clientInputs.map(({ icon: Icon, title, copy }) => (
              <article className="winner-prep__item spotlight-surface" key={title}>
                <Icon aria-hidden="true" />
                <div>
                  <h3>{title}</h3>
                  <p>{copy}</p>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="winner-final spotlight-surface">
          <div>
            <p className="winner-upgrade__eyebrow">Konkrétny ďalší krok</p>
            <h2>Opíšte, čo dnes počítate alebo vysvetľujete ručne.</h2>
            <p>Do jedného pracovného dňa dostanete odporúčanie vhodného riešenia a ďalší postup.</p>
          </div>
          <div className="winner-final__actions">
            <button
              type="button"
              className="winner-final__primary"
              onClick={() => openSiteAssistant({ source: "winner-final", entry: "builder" })}
            >
              <MessageCircle aria-hidden="true" /> Získať návrh
            </button>
            <Link to="/projekty" className="winner-final__secondary spotlight-surface">
              Pozrieť realizácie <ArrowRight aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
