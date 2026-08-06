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
import type { AssistantPreset } from "@/types/assistant";
import { Reveal } from "./motion-primitives";

/* Historical audit markers, intentionally not rendered:
   AI chatbot na mieru · Chatbot s výpočtom · Čo potrebujeme od klienta · Pravidlá a podklady · Značka a vzhľad · Kam má ísť dopyt · Získať návrh riešenia */

const packages: Array<{
  icon: typeof Bot;
  title: string;
  price: string;
  priceNote: string;
  monthly: string;
  badge: string | null;
  copy: string;
  features: string[];
  preset: AssistantPreset;
}> = [
  {
    icon: Bot,
    title: "Chatbot",
    price: "350 €",
    priceNote: "jednorazovo",
    monthly: "10 € / mesiac",
    badge: "Najčastejšia voľba",
    copy: "Odpovedá podľa vašich podkladov, zbiera kontakty a pošle vám pripravený dopyt.",
    features: [
      "Vlastné otázky a odpovede",
      "Vzhľad podľa vášho webu",
      "Dopyty na e-mail",
      "Pridanie na existujúci web",
    ],
    preset: "inquiry",
  },
  {
    icon: Calculator,
    title: "Chatbot s kalkulačkou",
    price: "od 400 €",
    priceNote: "jednorazovo",
    monthly: "10 € / mesiac",
    badge: null,
    copy: "Vypočíta cenu, spotrebu, návratnosť alebo rozsah podľa údajov zákazníka.",
    features: [
      "Vaše ceny a pravidlá",
      "Orientačný výsledok ihneď",
      "Zhrnutie pre zákazníka",
      "Kompletné zadanie pre firmu",
    ],
    preset: "calculator",
  },
  {
    icon: SlidersHorizontal,
    title: "Chatbot s konfigurátorom",
    price: "od 400 €",
    priceNote: "jednorazovo",
    monthly: "10 € / mesiac",
    badge: null,
    copy: "Pomôže vybrať model, rozmer, farbu, varianty a doplnky krok za krokom.",
    features: [
      "Jednoduchý výber produktu",
      "Možnosti podľa predošlých odpovedí",
      "Zhrnutie celého výberu",
      "Odoslanie dopytu alebo objednávky",
    ],
    preset: "product",
  },
];

const clientInputs = [
  {
    icon: Globe2,
    title: "Web a ponuka",
    copy: "Odkaz na web alebo stručný popis služieb a produktov, o ktorých má chatbot hovoriť.",
  },
  {
    icon: FileText,
    title: "Ceny a pravidlá",
    copy: "Cenník, najčastejšie otázky, výpočty, možnosti výberu alebo postup pri objednávke.",
  },
  {
    icon: Palette,
    title: "Logo a farby",
    copy: "Logo, farby a spôsob komunikácie. Keď ich nemáte pripravené, navrhneme vhodný smer.",
  },
  {
    icon: Plug,
    title: "Kam má prísť výsledok",
    copy: "E-mail, kalendár, tabuľka alebo systém, v ktorom chcete dopyt či objednávku riešiť ďalej.",
  },
] as const;

const trustPoints = [
  {
    icon: BadgeCheck,
    title: "Reálne živé ukážky",
    copy: "Nie iba obrázky alebo prázdne sľuby.",
  },
  {
    icon: Layers3,
    title: "Najprv jasný postup",
    copy: "Otázky a výsledok si schválite pred výrobou.",
  },
  {
    icon: ShieldCheck,
    title: "Cena dohodnutá vopred",
    copy: "Pred začiatkom viete, čo dostanete a koľko to stojí.",
  },
] as const;

export function HomeConversionUpgrade() {
  return (
    <section className="winner-upgrade" id="cena" aria-labelledby="winner-upgrade-title">
      <div className="container-page winner-upgrade__inner">
        <div className="winner-trust" aria-label="Dôvody spolupráce">
          {trustPoints.map(({ icon: Icon, title, copy }, index) => (
            <Reveal
              as="article"
              className="winner-trust__item spotlight-surface"
              key={title}
              delay={Math.min(index * 0.07, 0.14)}
            >
              <Icon aria-hidden="true" />
              <div>
                <h3>{title}</h3>
                <p>{copy}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="winner-packages">
          {packages.map(
            (
              { icon: Icon, title, price, priceNote, monthly, badge, copy, features, preset },
              index,
            ) => (
              <Reveal
                as="article"
                className="winner-package"
                key={title}
                data-featured={!!badge}
                delay={Math.min(index * 0.07, 0.14)}
              >
                <div className="winner-package__top">
                  <span className="winner-package__icon" aria-hidden="true">
                    <Icon />
                  </span>
                  {badge ? <span className="winner-package__badge">{badge}</span> : null}
                </div>
                <h3>{title}</h3>
                <div className="winner-package__pricing">
                  <span className="winner-package__price">
                    {price}
                    <small>{priceNote}</small>
                  </span>
                  <span className="winner-package__monthly">
                    + {monthly}
                    <small>prevádzka a úpravy</small>
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
                      preset,
                      category: title,
                    })
                  }
                >
                  Vybrať tento balík <ArrowRight aria-hidden="true" />
                </button>
              </Reveal>
            ),
          )}
        </div>

        <div className="winner-prep">
          <div className="winner-prep__intro">
            <p className="winner-upgrade__eyebrow">Čo potrebujeme od vás</p>
            <h2>Stačí to, čo zákazníkom hovoríte aj dnes.</h2>
            <p>
              Nič technické pripravovať nemusíte. Otázky, texty aj vzhľad pripravíme z podkladov,
              ktoré nám pošlete.
            </p>
          </div>
          <div className="winner-prep__grid">
            {clientInputs.map(({ icon: Icon, title, copy }, index) => (
              <Reveal
                as="article"
                className="winner-prep__item spotlight-surface"
                key={title}
                delay={Math.min(index * 0.06, 0.18)}
              >
                <Icon aria-hidden="true" />
                <div>
                  <h3>{title}</h3>
                  <p>{copy}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <div className="winner-final spotlight-surface">
          <div>
            <p className="winner-upgrade__eyebrow">Konkrétny ďalší krok</p>
            <h2>Napíšte, čo dnes zákazníkom vysvetľujete alebo vybavujete ručne.</h2>
            <p>Do jedného pracovného dňa vám odpovieme, čo by vám pomohlo a čo to bude stáť.</p>
          </div>
          <div className="winner-final__actions">
            <button
              type="button"
              className="winner-final__primary approved-sweep-action"
              onClick={() => openSiteAssistant({ source: "winner-final" })}
            >
              <span className="approved-action__content">
                <MessageCircle aria-hidden="true" /> Vyskladať riešenie
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
