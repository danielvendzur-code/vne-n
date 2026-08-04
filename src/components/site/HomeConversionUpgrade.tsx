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
    price: "350 €",
    priceNote: "jednorazovo",
    monthly: "10 € / mesiac",
    badge: "Najčastejšia voľba",
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
    price: "od 400 €",
    priceNote: "jednorazovo",
    monthly: "10 € / mesiac",
    badge: null,
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
    price: "od 400 €",
    priceNote: "jednorazovo",
    monthly: "10 € / mesiac",
    badge: null,
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
    copy: "Logo, farby a tón komunikácie. Keď ich nemáte pripravené, navrhneme vhodný smer.",
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
    <section className="winner-upgrade" id="cena" aria-labelledby="winner-upgrade-title">
      <div className="container-page winner-upgrade__inner">
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
          {packages.map(
            ({ icon: Icon, title, price, priceNote, monthly, badge, copy, features }) => (
              <article className="winner-package" key={title} data-featured={!!badge}>
                {/* Odznak stojí v hornom riadku pri ikone, takže nadpisy
                  všetkých troch kariet začínajú na rovnakej výške. */}
                <div className="winner-package__top">
                  <span className="winner-package__icon" aria-hidden="true">
                    <Icon />
                  </span>
                  {badge ? <span className="winner-package__badge">{badge}</span> : null}
                </div>
                <h3>{title}</h3>
                {/* Jednorazová cena a mesačný poplatok stoja oddelene, aby
                  bolo na prvý pohľad jasné, čo je čo. Žiadna hviezdička. */}
                <div className="winner-package__pricing">
                  <span className="winner-package__price">
                    {price}
                    <small>{priceNote}</small>
                  </span>
                  <span className="winner-package__monthly">
                    + {monthly}
                    <small>prevádzka a údržba</small>
                  </span>
                </div>
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
                  className="winner-package__cta"
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
            ),
          )}
        </div>

        <div className="winner-prep">
          <div className="winner-prep__intro">
            <p className="winner-upgrade__eyebrow">Čo potrebujeme od klienta</p>
            <h2>Stačí to, čo zákazníkom hovoríte aj tak.</h2>
            <p>
              Nič technické pripravovať nemusíte. Otázky, texty aj vzhľad pripravíme z podkladov,
              ktoré nám pošlete.
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
            <h2>Napíšte, na čo sa vás zákazníci pýtajú najčastejšie.</h2>
            <p>Do jedného pracovného dňa vám odpovieme, čo by vám pomohlo a čo to bude stáť.</p>
          </div>
          <div className="winner-final__actions">
            <button
              type="button"
              className="winner-final__primary approved-sweep-action"
              onClick={() => openSiteAssistant({ source: "winner-final", entry: "builder" })}
            >
              <span className="approved-action__content">
                <MessageCircle aria-hidden="true" /> Získať návrh
              </span>
            </button>
            <Link to="/projekty" className="winner-final__secondary approved-bloom-action">
              <span className="approved-bloom-dot approved-bloom-dot--one" aria-hidden="true" />
              <span className="approved-bloom-dot approved-bloom-dot--two" aria-hidden="true" />
              <span className="approved-bloom-dot approved-bloom-dot--three" aria-hidden="true" />
              <span className="approved-bloom-dot approved-bloom-dot--four" aria-hidden="true" />
              <span className="approved-action__content">
                Pozrieť realizácie <ArrowRight aria-hidden="true" />
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
