import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";
import type { ReactNode } from "react";
import "@/components/site/BrandStudioServicesPage.css";
import { openSiteAssistant } from "@/lib/site-assistant";
import { breadcrumbJsonLd, seo } from "@/lib/seo";

export const Route = createFileRoute("/sluzby")({
  head: () => ({
    ...seo({
      title: "Chatbot, kalkulačka a konfigurátor na mieru — Môj Chatbot",
      description:
        "Chatboty pre e-shopy aj služby, cenové kalkulačky a konfigurátory na mieru. Zákazník dostane odpoveď, cenu alebo výber a vám príde pripravený dopyt.",
      path: "/sluzby",
    }),
    scripts: [
      {
        type: "application/ld+json",
        children: breadcrumbJsonLd([{ name: "Služby", path: "/sluzby" }]),
      },
    ],
  }),
  component: ServicesPage,
});

const services = [
  {
    index: "01",
    title: "Chatbot pre e-shop",
    copy: "Pomôže s produktom, objednávkou aj otázkami, ktoré by inak skončili v e-maile alebo na telefóne.",
    preset: "product" as const,
    details: [
      [
        "Kedy sa hodí",
        "Keď sa zákazníci opakovane pýtajú na produkty, dostupnosť, dopravu alebo čo si majú vybrať.",
      ],
      [
        "Čo vie",
        "Poradí s výberom, zistí stav objednávky a pripraví zmenu, zrušenie, vrátenie alebo reklamáciu.",
      ],
      [
        "Čo dostanete vy",
        "Kontakt spolu s tým, čo zákazník rieši, namiesto anonymnej otázky bez kontextu.",
      ],
    ],
  },
  {
    index: "02",
    title: "Chatbot s kalkulačkou",
    copy: "Vypočíta orientačnú cenu, spotrebu alebo rozsah podľa pravidiel vašej firmy priamo počas rozhovoru.",
    preset: "calculator" as const,
    details: [
      [
        "Kedy sa hodí",
        "Pre služby a produkty, kde cenu menia rozmery, množstvo, doprava, materiál alebo doplnky.",
      ],
      [
        "Čo zadá zákazník",
        "Len vstupy, ktoré reálne ovplyvňujú výsledok — napríklad rozmery, variant alebo lokalitu.",
      ],
      [
        "Čo dostanete vy",
        "Orientačný výpočet, všetky vstupy a kontakt pripravený na cenovú ponuku.",
      ],
    ],
  },
  {
    index: "03",
    title: "Chatbot s konfigurátorom",
    copy: "Prevedie zákazníka produktom alebo službou krok za krokom a odovzdá vám hotovú špecifikáciu.",
    preset: "product" as const,
    details: [
      [
        "Kedy sa hodí",
        "Pre nábytok, ploty, technické výrobky, balíky služieb, veľkosti, farby, materiály a doplnky.",
      ],
      [
        "Čo zadá zákazník",
        "Typ, rozmery, varianty, farby, doplnky a ďalšie voľby podľa konkrétneho produktu.",
      ],
      [
        "Čo dostanete vy",
        "Hotový výber pripravený na cenovú ponuku, výrobu alebo objednávku.",
      ],
    ],
  },
] as const;

function Reveal({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.68, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

function ServicesPage() {
  return (
    <div className="brand-services-page">
      <section className="brand-services-intro">
        <div className="brand-services-intro__inner">
          <motion.div
            className="brand-services-intro__eyebrow"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            Čo vieme postaviť
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          >
            Web, ktorý zákazníka <span>posunie ďalej.</span>
          </motion.h1>
          <div className="brand-services-intro__bottom">
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.12 }}
            >
              Nie univerzálny chatbot. Vyberieme presne tú logiku, ktorá vášmu zákazníkovi pomôže
              a vám skráti cestu od návštevy k použiteľnému dopytu.
            </motion.p>
            <motion.div
              className="brand-services-intro__links"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.18 }}
            >
              <Link to="/kontakt" className="brand-services-primary">
                Prebrať váš web <ArrowRight size={17} />
              </Link>
              <a href="#typy" className="brand-services-link">
                Pozrieť možnosti <ArrowUpRight size={16} />
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      <div className="brand-services-list" id="typy">
        {services.map((service) => (
          <Reveal className="brand-services-section" key={service.index}>
            <span className="brand-services-section__index">{service.index}</span>
            <div className="brand-services-section__title">
              <h2>{service.title}</h2>
              <p>{service.copy}</p>
              <button
                type="button"
                onClick={() =>
                  openSiteAssistant({
                    source: `services-${service.index}`,
                    preset: service.preset,
                    category: service.title,
                  })
                }
              >
                Vyskúšať tento typ <ArrowUpRight size={16} />
              </button>
            </div>
            <div className="brand-services-section__details">
              {service.details.map(([label, text]) => (
                <div className="brand-services-detail" key={label}>
                  <span>{label}</span>
                  <p>{text}</p>
                </div>
              ))}
            </div>
          </Reveal>
        ))}
      </div>

      <section className="brand-services-combine">
        <div className="brand-services-combine__inner">
          <Reveal>
            <span className="brand-services-combine__eyebrow">Jedno riešenie na mieru</span>
            <h2>Najlepšie projekty tieto nástroje kombinujú.</h2>
          </Reveal>
          <Reveal className="brand-services-combine__copy">
            <p>
              Chatbot môže najprv zistiť potrebu, potom spustiť výpočet alebo konfigurátor a na
              konci odovzdať hotový dopyt. Neplatíte za tri samostatné widgety — riešime jeden
              zákaznícky flow.
            </p>
            <Link to="/kontakt" className="brand-services-primary">
              Navrhnúť riešenie <ArrowRight size={17} />
            </Link>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
