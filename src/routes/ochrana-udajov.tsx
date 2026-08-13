import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Building2,
  Clock3,
  Globe2,
  Lock,
  Mail,
  Server,
  ShieldCheck,
  UserCheck,
} from "lucide-react";
import { PageIntro, Reveal } from "@/components/site/motion-primitives";
import { siteConfig } from "@/config/site";
import { breadcrumbJsonLd, seo } from "@/lib/seo";
import "./cookies.css";

const googleAnalyticsEnabled = /^G-[A-Z0-9]+$/i.test(
  import.meta.env.VITE_GA_MEASUREMENT_ID?.trim() || "",
);

export const Route = createFileRoute("/ochrana-udajov")({
  head: () => ({
    ...seo({
      title: "Ochrana osobných údajov — Môj Chatbot",
      description:
        "Informácie o spracúvaní údajov z formulára, chatbota, e-mailovej komunikácie a analytiky návštevnosti.",
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
    title: "Dopyt a obchodná komunikácia",
    what: "Meno, e-mail, telefón, firma alebo web, obsah zadania a údaje, ktoré dobrovoľne odošlete.",
    why: "Aby sme mohli dopyt vyhodnotiť, odpovedať a pripraviť návrh riešenia.",
    basis: "Kroky pred uzatvorením zmluvy a plnenie zmluvy — čl. 6 ods. 1 písm. b) GDPR.",
    keep: "Najviac 24 mesiacov od poslednej komunikácie, ak nevznikne zmluvný alebo zákonný dôvod na dlhšie uchovanie.",
  },
  {
    icon: UserCheck,
    title: "Rozhovor s AI asistentom",
    what: "Text otázok, zvolené možnosti a kontakt, iba ak ho návštevník zadá.",
    why: "Aby asistent odpovedal a pripravil použiteľné zadanie pre tím Môj Chatbot.",
    basis:
      "Kroky pred uzatvorením zmluvy — čl. 6 ods. 1 písm. b) GDPR; pri anonymnej otázke oprávnený záujem na poskytovaní služby.",
    keep: "Podľa účelu komunikácie, najviac 24 mesiacov; technické záznamy kratšie podľa nastavenia poskytovateľa.",
  },
  {
    icon: Clock3,
    title: "Cookie-free meranie návštevnosti",
    what: "Súhrnné údaje o otvorenej stránke, zdroji návštevy, krajine, zariadení a prehliadači.",
    why: "Aby sme rozumeli používaniu webu, opravovali problémy a zlepšovali obsah.",
    basis: "Oprávnený záujem na meraní a zlepšovaní webu — čl. 6 ods. 1 písm. f) GDPR.",
    keep:
      "Vercel Analytics nepoužíva analytické cookies. Súhrnné reporty môžu byť uchované podľa nastavenia služby.",
  },
  ...(googleAnalyticsEnabled
    ? [
        {
          icon: Globe2,
          title: "Google Analytics po súhlase",
          what:
            "Údaje o návšteve stránky, zdroji návštevy, zariadení a interakcii s webom, ktoré Google Analytics spracuje po udelení súhlasu.",
          why: "Aby sme vedeli podrobnejšie vyhodnotiť návštevnosť a zlepšovať jednotlivé stránky.",
          basis:
            "Súhlas návštevníka — čl. 6 ods. 1 písm. a) GDPR. Bez súhlasu sa Google Analytics nenačíta.",
          keep:
            "Podľa retenčného nastavenia Google Analytics; súhlas je možné kedykoľvek zmeniť na stránke Cookies a analytika.",
        },
      ]
    : []),
  {
    icon: Server,
    title: "Bezpečnosť a technická prevádzka",
    what: "IP adresa, čas požiadavky, technické hlavičky, chybové a bezpečnostné záznamy.",
    why: "Ochrana formulárov, prevencia zneužitia, diagnostika chýb a dostupnosť služby.",
    basis: "Oprávnený záujem na bezpečnej prevádzke — čl. 6 ods. 1 písm. f) GDPR.",
    keep: "Len čas potrebný na bezpečnosť a diagnostiku, spravidla najviac 30 dní, ak incident nevyžaduje dlhšie uchovanie.",
  },
];

const rights = [
  "Požiadať o prístup k svojim údajom a ich kópiu.",
  "Požiadať o opravu nepresných alebo neúplných údajov.",
  "Požiadať o vymazanie alebo obmedzenie spracúvania, ak sú splnené podmienky.",
  "Namietať proti spracúvaniu založenému na oprávnenom záujme.",
  "Odvolať súhlas s Google Analytics bez vplyvu na zákonnosť spracúvania pred odvolaním.",
  "Získať údaje v prenosnom formáte, ak sa uplatní právo na prenosnosť.",
  "Podať sťažnosť na Úrad na ochranu osobných údajov Slovenskej republiky.",
];

function PrivacyPage() {
  const { legal, contact, team } = siteConfig;
  const identity = [
    { label: "Značka", value: team.label },
    { label: "Prevádzkovateľ", value: legal.operator },
    { label: "Sídlo / miesto podnikania", value: legal.address },
    { label: "IČO", value: legal.ico },
    { label: "DIČ", value: legal.dic },
    { label: "IČ DPH", value: legal.icDph },
    { label: "Registrácia", value: legal.registration },
  ].filter((row) => row.value);

  return (
    <div className="cookies-page">
      <PageIntro
        eyebrow="Súkromie"
        title={
          <>
            Údaje používame iba na jasný účel. <em>Nie na predaj ani reklamnú databázu.</em>
          </>
        }
        lead="Táto stránka vysvetľuje, aké údaje spracúvame pri používaní webu, formulára, AI asistenta, analytiky a e-mailovej komunikácie."
      />

      <section className="cookies-section">
        <div className="container-page cookies-grid">
          <Reveal className="cookies-card" direction="left">
            <h2>
              <Building2 aria-hidden="true" /> Kto je prevádzkovateľ
            </h2>
            <dl className="privacy-identity">
              {identity.map((row) => (
                <div key={row.label}>
                  <dt>{row.label}</dt>
                  <dd>{row.value}</dd>
                </div>
              ))}
              <div>
                <dt>E-mail pre súkromie</dt>
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
          </Reveal>

          <Reveal className="cookies-card" direction="right" delay={0.06}>
            <h2>
              <ShieldCheck aria-hidden="true" /> Základné zásady
            </h2>
            <ul className="cookies-list">
              <li>Zbierame iba údaje potrebné na odpoveď, realizáciu a bezpečnú prevádzku.</li>
              <li>Údaje nepredávame a nepoužívame na reklamu tretích strán.</li>
              <li>Obsah formulára ani chatbota neposielame do analytiky.</li>
              <li>
                Google Analytics sa načíta iba po výslovnom súhlase, ak je na webe aktivovaný.
              </li>
              <li>
                Nepoužívame automatizované rozhodovanie s právnymi alebo obdobne významnými
                účinkami.
              </li>
            </ul>
          </Reveal>
        </div>
      </section>

      <section className="cookies-section">
        <div className="container-page">
          <Reveal>
            <h2 className="cookies-heading">Účely, údaje a doby uchovania</h2>
          </Reveal>
          <div className="privacy-purposes">
            {purposes.map(({ icon: Icon, title, what, why, basis, keep }, index) => (
              <Reveal
                className="cookies-card"
                key={title}
                direction={index % 2 === 0 ? "left" : "right"}
                delay={index * 0.04}
              >
                <h3>
                  <Icon aria-hidden="true" /> {title}
                </h3>
                <dl className="privacy-detail">
                  <div>
                    <dt>Čo spracúvame</dt>
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
          <Reveal className="cookies-card" direction="left">
            <h2>
              <Lock aria-hidden="true" /> Poskytovatelia a príjemcovia
            </h2>
            <p>Na technickú prevádzku používame najmä tieto kategórie dodávateľov:</p>
            <ul className="cookies-list">
              <li>
                <b>Vercel</b> — hosting webu, serverové funkcie a cookie-free Web Analytics.
              </li>
              <li>
                <b>Resend</b> — odosielanie transakčných e-mailov a potvrdení dopytu.
              </li>
              <li>
                <b>Websupport</b> — doména, DNS a firemná e-mailová schránka.
              </li>
              <li>
                <b>Anthropic</b> — spracovanie otázok, keď návštevník použije AI odpoveď chatbota.
              </li>
              {googleAnalyticsEnabled ? (
                <li>
                  <b>Google</b> — Google Analytics 4, iba po výslovnom súhlase návštevníka.
                </li>
              ) : null}
            </ul>
            <p className="cookies-note">
              Dodávatelia dostanú iba údaje potrebné na konkrétnu službu a sú viazaní zmluvnými a
              bezpečnostnými podmienkami.
            </p>
          </Reveal>

          <Reveal className="cookies-card" direction="right" delay={0.06}>
            <h2>
              <Globe2 aria-hidden="true" /> Prenosy mimo EHP
            </h2>
            <p>
              Niektorí technologickí dodávatelia pôsobia v Spojených štátoch alebo spracúvajú údaje
              aj mimo Európskeho hospodárskeho priestoru. Prenos sa uskutočňuje iba pri existencii
              vhodného právneho mechanizmu podľa GDPR.
            </p>
            <p className="cookies-note">
              Konkrétny rozsah prenosu závisí od použitej služby a jej aktuálneho nastavenia.
            </p>
          </Reveal>

          <Reveal className="cookies-card cookies-card--wide" direction="left" delay={0.1}>
            <h2>
              <UserCheck aria-hidden="true" /> Vaše práva
            </h2>
            <ul className="cookies-list">
              {rights.map((right) => (
                <li key={right}>{right}</li>
              ))}
            </ul>
            <p className="cookies-note">
              Žiadosť pošlite na <a href={`mailto:${contact.email}`}>{contact.email}</a>. Odpovieme
              bez zbytočného odkladu, spravidla najneskôr do jedného mesiaca. Podrobnosti o meraní a
              nastavení súhlasu nájdete na stránke <Link to="/cookies">Cookies a analytika</Link>.
            </p>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
