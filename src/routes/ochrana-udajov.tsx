import { createFileRoute, Link } from "@tanstack/react-router";
import { Building2, Clock3, Lock, Mail, ShieldCheck, UserCheck } from "lucide-react";
import { PageIntro, Reveal } from "@/components/site/motion-primitives";
import { siteConfig } from "@/config/site";
import { breadcrumbJsonLd, seo } from "@/lib/seo";
import "./cookies.css";

export const Route = createFileRoute("/ochrana-udajov")({
  head: () => ({
    ...seo({
      title: "Ochrana osobných údajov",
      description:
        "Aké údaje z formulára a chatbota spracúvam, prečo, ako dlho ich uchovávam a aké máte práva podľa GDPR.",
      path: "/ochrana-udajov",
    }),
    scripts: [
      {
        type: "application/ld+json",
        children: breadcrumbJsonLd([{ name: "Ochrana osobných údajov", path: "/ochrana-udajov" }]),
      },
    ],
  }),
  component: PrivacyPage,
});

const purposes = [
  {
    icon: Mail,
    title: "Odpoveď na váš dopyt",
    what: "Meno, e-mail, prípadne telefón, web firmy a text správy.",
    why: "Bez toho vám neviem odpovedať ani pripraviť návrh.",
    basis: "Predzmluvné vzťahy — čl. 6 ods. 1 písm. b) GDPR.",
    keep: "Dva roky od poslednej správy. Potom údaje mažem.",
  },
  {
    icon: UserCheck,
    title: "Rozhovor s chatbotom",
    what: "Vaše odpovede v chatbote a kontakt, ak ho zadáte.",
    why: "Aby som vedel, čo potrebujete, a nemusel sa pýtať znova.",
    basis: "Predzmluvné vzťahy — čl. 6 ods. 1 písm. b) GDPR.",
    keep: "Dva roky od rozhovoru.",
  },
  {
    icon: Clock3,
    title: "Meranie návštevnosti",
    what: "Anonymné údaje o tom, ktoré stránky sa otvárajú.",
    why: "Aby som vedel, čo na webe funguje a čo nie.",
    basis: "Váš súhlas — čl. 6 ods. 1 písm. a) GDPR. Kedykoľvek ho môžete odvolať.",
    keep: "Podľa nastavenia súhlasu, najdlhšie 14 mesiacov.",
  },
];

const rights = [
  "Vedieť, aké údaje o vás mám, a dostať ich kópiu.",
  "Nechať si ich opraviť, ak nie sú správne.",
  "Nechať si ich vymazať, ak už nie sú potrebné.",
  "Obmedziť ich spracúvanie alebo proti nemu namietať.",
  "Dostať ich v bežnom formáte a preniesť inam.",
  "Kedykoľvek odvolať súhlas, ktorý ste dali.",
];

function PrivacyPage() {
  const { legal, contact } = siteConfig;
  const identity = [
    { label: "Prevádzkovateľ", value: legal.operator },
    { label: "Sídlo", value: legal.address },
    { label: "IČO", value: legal.ico },
    { label: "DIČ", value: legal.dic },
    { label: "IČ DPH", value: legal.icDph },
    { label: "Zapísaný", value: legal.registration },
  ].filter((row) => row.value);

  return (
    <div className="cookies-page">
      <PageIntro
        eyebrow="Súkromie"
        title={
          <>
            Čo robím s údajmi, <em>ktoré mi pošlete.</em>
          </>
        }
        lead="Zbieram len to, čo potrebujem na to, aby som vám odpovedal. Nič nepredávam ďalej a nikomu iné údaje neposkytujem."
      />

      <section className="cookies-section">
        <div className="container-page cookies-grid">
          <Reveal className="cookies-card">
            <h2>
              <Building2 aria-hidden="true" /> Kto údaje spracúva
            </h2>
            <dl className="privacy-identity">
              {identity.map((row) => (
                <div key={row.label}>
                  <dt>{row.label}</dt>
                  <dd>{row.value}</dd>
                </div>
              ))}
              <div>
                <dt>E-mail</dt>
                <dd>
                  <a href={`mailto:${contact.email}`}>{contact.email}</a>
                </dd>
              </div>
              <div>
                <dt>Telefón</dt>
                <dd>
                  <a href={`tel:${contact.phoneHref}`}>{contact.phoneLabel}</a>
                </dd>
              </div>
            </dl>
            {legal.notVatPayer ? <p className="cookies-note">Nie som platiteľ DPH.</p> : null}
          </Reveal>

          <Reveal className="cookies-card" delay={0.06}>
            <h2>
              <ShieldCheck aria-hidden="true" /> Krátko a jasne
            </h2>
            <ul className="cookies-list">
              <li>Údaje používam len na to, aby som vám odpovedal na dopyt.</li>
              <li>Nikomu ich nepredávam ani neposkytujem na reklamu.</li>
              <li>Uchovávam ich dva roky, potom ich mažem.</li>
              <li>Kedykoľvek si môžete vyžiadať výmaz — stačí napísať e-mail.</li>
            </ul>
          </Reveal>
        </div>
      </section>

      <section className="cookies-section">
        <div className="container-page">
          <Reveal>
            <h2 className="cookies-heading">Na čo údaje potrebujem</h2>
          </Reveal>
          <div className="privacy-purposes">
            {purposes.map(({ icon: Icon, title, what, why, basis, keep }, index) => (
              <Reveal className="cookies-card" key={title} delay={index * 0.05}>
                <h3>
                  <Icon aria-hidden="true" /> {title}
                </h3>
                <dl className="privacy-detail">
                  <div>
                    <dt>Čo zbieram</dt>
                    <dd>{what}</dd>
                  </div>
                  <div>
                    <dt>Prečo</dt>
                    <dd>{why}</dd>
                  </div>
                  <div>
                    <dt>Právny základ</dt>
                    <dd>{basis}</dd>
                  </div>
                  <div>
                    <dt>Ako dlho</dt>
                    <dd>{keep}</dd>
                  </div>
                </dl>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="cookies-section">
        <div className="container-page cookies-grid">
          <Reveal className="cookies-card">
            <h2>
              <UserCheck aria-hidden="true" /> Vaše práva
            </h2>
            <ul className="cookies-list">
              {rights.map((right) => (
                <li key={right}>{right}</li>
              ))}
            </ul>
            <p className="cookies-note">
              Stačí napísať na <a href={`mailto:${contact.email}`}>{contact.email}</a>. Ozvem sa
              najneskôr do jedného mesiaca. Ak by ste neboli spokojní, môžete sa obrátiť na Úrad na
              ochranu osobných údajov SR, Hraničná 12, 820 07 Bratislava.
            </p>
          </Reveal>

          <Reveal className="cookies-card" delay={0.06}>
            <h2>
              <Lock aria-hidden="true" /> Komu sa údaje dostanú
            </h2>
            <p>
              Údaje spracúvam sám. Web a e-mail bežia na službách, ktoré fungujú ako
              sprostredkovatelia — hosting stránky a doručovanie e-mailov. Tie majú prístup len k
              tomu, čo je potrebné na prevádzku, a viaže ich zmluva o spracúvaní údajov.
            </p>
            <p className="cookies-note">
              Údaje neprenášam mimo Európsky hospodársky priestor. Nepoužívam automatizované
              rozhodovanie ani profilovanie, ktoré by malo pre vás právne účinky.
            </p>
            <p className="cookies-note">
              Podrobnosti o cookies nájdete na stránke <Link to="/cookies">Používanie cookies</Link>
              .
            </p>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
