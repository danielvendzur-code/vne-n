import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Box,
  Car,
  Euro,
  Link2,
  Move3d,
  Ruler,
  Send,
  ShieldCheck,
  Smartphone,
} from "lucide-react";
import { useRef, type CSSProperties } from "react";
import { configuratorFaqs } from "@/data/configurator";
import { useReveal } from "@/hooks/useReveal";
import { ConfiguratorShowcase, Eyebrow } from "./StudioHome";
import "./StudioHome.css";
import "./ConfiguratorPage.css";

const BASE = import.meta.env.BASE_URL;

const abilities = [
  {
    icon: Move3d,
    title: "3D model priamo v prehliadači",
    copy: "Zákazník otáča zostavu, prepína pohľady spredu, zboku aj zhora a môže ju zväčšiť na celú obrazovku.",
  },
  {
    icon: Ruler,
    title: "Rozmer v milimetroch",
    copy: "Šírku a hĺbku nastaví posuvníkom alebo číslom. Konfigurátor pustí len rozmery, ktoré sa dajú vyrobiť.",
  },
  {
    icon: Box,
    title: "Umiestnenie, strecha a výplne",
    copy: "Samostatne, pri stene alebo v rohu. Typ strechy, bočné steny a lamely menia model aj cenu.",
  },
  {
    icon: Car,
    title: "Scéna so skutočnou mierkou",
    copy: "Do scény sa dá pridať auto alebo posedenie, takže je hneď jasné, či sa všetko zmestí.",
  },
  {
    icon: Euro,
    title: "Orientačná cena okamžite",
    copy: "Každá zmena sa prepočíta podľa katalógových pravidiel firmy. Bez čakania na e-mail.",
  },
  {
    icon: Link2,
    title: "Zostava uložená v odkaze",
    copy: "Výber sa zapíše do adresy stránky. Zákazník ho pošle doma na poradu alebo sa k nemu vráti.",
  },
  {
    icon: Send,
    title: "Dopyt s hotovou zostavou",
    copy: "Firma dostane rozmer, typ, farbu aj výbavu naraz. Nič sa nemusí dopisovať telefonicky.",
  },
  {
    icon: Smartphone,
    title: "Pohodlne aj na mobile",
    copy: "Ovládanie je prispôsobené prstom, model sa dá otáčať a priblížiť dvoma prstami.",
  },
  {
    icon: ShieldCheck,
    title: "Bez registrácie a bez inštalácie",
    copy: "Beží ako súčasť webu. Návštevník nič nesťahuje a nemusí si zakladať účet.",
  },
] as const;

const fits = [
  "Prístrešky, carporty a pergoly",
  "Ploty, brány a zábradlia",
  "Záhradné domčeky a sklady",
  "Nábytok a kuchyne na mieru",
  "Schody, okná a tienenie",
  "Oceľové a hliníkové konštrukcie",
];

const gallery = [
  {
    src: `${BASE}work/koverta/realizacia-pristresok-trnava.webp`,
    alt: "Hotový antracitový prístrešok Koverta pre auto pred rodinným domom",
    width: 1400,
    height: 1050,
    caption: "Prístrešok pre auto, Trnava",
  },
  {
    src: `${BASE}work/koverta/realizacia-pristresok-vecer.webp`,
    alt: "Prístrešok Koverta pre dve autá s LED osvetlením večer",
    width: 1400,
    height: 1050,
    caption: "Prístrešok s LED osvetlením",
  },
  {
    src: `${BASE}work/koverta/realizacia-pergola-sibenik.webp`,
    alt: "Biela bioklimatická pergola nad terasou s jedálenským sedením",
    width: 1400,
    height: 788,
    caption: "Bioklimatická pergola",
  },
];

export function ConfiguratorPage() {
  const rootRef = useRef<HTMLDivElement>(null);
  useReveal(rootRef);

  return (
    <div className="sh cfp" ref={rootRef}>
      <section className="sh-hero cfp-hero" aria-labelledby="cfp-title">
        <div className="sh-wrap sh-hero__grid">
          <div className="sh-hero__copy">
            <Eyebrow tone="dark">Prípadová štúdia · Koverta</Eyebrow>
            <h1 id="cfp-title" className="sh-hero__title">
              <span className="sh-line" style={{ "--i": 0 } as CSSProperties}>
                3D konfigurátor na web,
              </span>{" "}
              <em className="sh-line" style={{ "--i": 1 } as CSSProperties}>
                v ktorom si zákazník poskladá produkt.
              </em>
            </h1>
            <p className="sh-hero__lead sh-line" style={{ "--i": 2 } as CSSProperties}>
              Pre výrobcu prístreškov a pergol Koverta sme postavili konfigurátor, v ktorom zákazník
              nastaví rozmer, farbu, strechu aj výbavu, vidí výsledok v 3D a hneď aj orientačnú
              cenu.
            </p>
            <div className="sh-hero__actions sh-line" style={{ "--i": 3 } as CSSProperties}>
              <a href="#konfigurator" className="sh-btn sh-btn--lime">
                Vyskúšať naživo <ArrowRight size={18} aria-hidden="true" />
              </a>
              <Link to="/kontakt" className="sh-btn sh-btn--ghost">
                Chcem konfigurátor
              </Link>
            </div>
          </div>
          <div className="cfp-hero__media sh-line" style={{ "--i": 2 } as CSSProperties}>
            <img
              className="cfp-hero__desk"
              src={`${BASE}work/koverta/konfigurator-carport.webp`}
              alt="3D konfigurátor Koverta: carport s autom v scéne, výber umiestnenia a orientačná cena"
              width={1600}
              height={841}
              fetchPriority="high"
            />
            <img
              className="cfp-hero__phone"
              src={`${BASE}work/koverta/konfigurator-mobil.webp`}
              alt="Rovnaký 3D konfigurátor na mobile"
              width={600}
              height={1000}
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>
      </section>

      <section className="sh-section" aria-labelledby="cfp-abilities-title">
        <div className="sh-wrap">
          <header className="sh-head" data-reveal>
            <Eyebrow>Čo konfigurátor zvláda</Eyebrow>
            <h2 id="cfp-abilities-title">Všetko, čo by inak zistil obchodník telefonicky</h2>
            <p>
              Zákazník sa rozhoduje sám a vlastným tempom. Firma dostane dopyt, na ktorý môže rovno
              poslať ponuku.
            </p>
          </header>
          <ul className="cfp-abilities">
            {abilities.map((item, index) => (
              <li key={item.title} data-reveal style={{ "--d": index % 3 } as CSSProperties}>
                <span aria-hidden="true">
                  <item.icon size={20} />
                </span>
                <h3>{item.title}</h3>
                <p>{item.copy}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <ConfiguratorShowcase onCaseStudy />

      <section className="sh-section cfp-real" aria-labelledby="cfp-real-title">
        <div className="sh-wrap">
          <header className="sh-head sh-head--row" data-reveal>
            <div>
              <Eyebrow>Z obrazovky do reality</Eyebrow>
              <h2 id="cfp-real-title">Čo si zákazník poskladá, to sa aj postaví</h2>
            </div>
            <p>
              Model v konfigurátore vychádza z reálnych konštrukcií Koverta — rovnakých profilov,
              rozpätí a výplní, aké sa vyrábajú a montujú.
            </p>
          </header>
          <div className="cfp-gallery">
            {gallery.map((photo, index) => (
              <figure key={photo.src} data-reveal style={{ "--d": index } as CSSProperties}>
                <img
                  src={photo.src}
                  alt={photo.alt}
                  width={photo.width}
                  height={photo.height}
                  loading="lazy"
                  decoding="async"
                />
                <figcaption>{photo.caption}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="sh-section cfp-fit" aria-labelledby="cfp-fit-title">
        <div className="sh-wrap cfp-fit__grid">
          <header className="sh-head" data-reveal>
            <Eyebrow>Pre koho</Eyebrow>
            <h2 id="cfp-fit-title">3D konfigurátor sa oplatí pri výrobe na mieru</h2>
            <p>
              Keď zákazník potrebuje vidieť výsledok skôr, než sa rozhodne, a cena závisí od rozmeru
              a výbavy. Pri jednoduchom výbere stačí bežný konfigurátor bez 3D.
            </p>
          </header>
          <ul className="cfp-fit__list" data-reveal style={{ "--d": 1 } as CSSProperties}>
            {fits.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="sh-section sh-price cfp-price" aria-labelledby="cfp-price-title">
        <div className="sh-wrap cfp-price__grid">
          <div data-reveal>
            <Eyebrow tone="dark">Cena a postup</Eyebrow>
            <h2 id="cfp-price-title">
              Konfigurátor od 447 €. <em>3D naceníme podľa rozsahu.</em>
            </h2>
            <p>
              Cenu 3D konfigurátora ovplyvní počet modelov, variantov a pravidiel výpočtu. Po
              krátkom rozhovore dostanete presný rozsah, termín a cenu vrátane DPH.
            </p>
          </div>
          <ol className="cfp-price__steps" data-reveal style={{ "--d": 1 } as CSSProperties}>
            <li>
              <b>01</b> Pošlete produkty, rozmery a cenník
            </li>
            <li>
              <b>02</b> Navrhneme kroky a pravidlá výberu
            </li>
            <li>
              <b>03</b> Pripravíme 3D modely a ukážku
            </li>
            <li>
              <b>04</b> Nasadíme na web a napojíme dopyty
            </li>
          </ol>
        </div>
      </section>

      <section className="sh-section sh-faq" aria-labelledby="cfp-faq-title">
        <div className="sh-wrap sh-faq__grid">
          <header className="sh-head" data-reveal>
            <Eyebrow>Otázky</Eyebrow>
            <h2 id="cfp-faq-title">Čo zaujíma firmy pred 3D konfigurátorom</h2>
          </header>
          <div className="sh-faq__list">
            {configuratorFaqs.map((faq, index) => (
              <details key={faq.q} data-reveal style={{ "--d": index % 3 } as CSSProperties}>
                <summary>
                  {faq.q}
                  <i aria-hidden="true" />
                </summary>
                <div>
                  <p>{faq.a}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="sh-closing" aria-labelledby="cfp-closing-title">
        <div className="sh-wrap">
          <div className="sh-closing__card" data-reveal>
            <div>
              <h2 id="cfp-closing-title">Chcete podobný konfigurátor?</h2>
              <p>
                Pošlite odkaz na web a zoznam produktov. Ozveme sa do jedného pracovného dňa s
                návrhom, ako by mohol vyzerať ten váš.
              </p>
            </div>
            <div className="sh-closing__actions">
              <Link to="/kontakt" className="sh-btn sh-btn--lime">
                Chcem návrh <ArrowRight size={18} aria-hidden="true" />
              </Link>
              <Link to="/projekty" className="sh-link">
                Ďalšie realizácie
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
