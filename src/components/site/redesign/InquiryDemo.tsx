import { useState, type ReactNode } from "react";
import {
  Archive,
  ArrowLeft,
  ChevronDown,
  MoreVertical,
  Search,
  Star,
  Trash2,
} from "lucide-react";
import { revealMailPair } from "./scene-motion";
import { sitePath } from "./utils";
import s from "./InquiryDemo.module.css";

const configuration = [
  ["Model", "Bioklimatická pergola Soltec"],
  ["Rozmery", "5 076 × 2 500 mm · výška 2 500 mm"],
  ["Konštrukcia", "Biela · RAL 9010"],
  ["Lamely", "Antracit · RAL 7016"],
  ["Výbava", "ZIP roleta vpredu, teplé LED osvetlenie"],
  ["Umiestnenie", "Samostatne stojaca · pripravená dlažba"],
];

function GmailMark() {
  return (
    <svg width="30" height="24" viewBox="64 116 384 286" aria-hidden="true" focusable="false">
      <path d="m76 190v171q0 30 30 30h52V190" fill="#4285f4" />
      <path d="m354 190v201h52q30 0 30-30V190" fill="#34a853" />
      <path d="M350 255V149l28-21c24-18 58 2 58 30v32" fill="#fbbc04" />
      <path d="M154 249V143l102 77 98-74v106l-98 74" fill="#ea4335" />
      <path d="m76 190v-32c0-29 34-48 58-30l24 18v106" fill="#c5221f" />
    </svg>
  );
}

function MailWindow({
  subject,
  business,
  children,
}: {
  subject: string;
  business: boolean;
  children: ReactNode;
}) {
  return (
    <div className={s.gmail} data-mail-preview>
      <div className={s.topbar}>
        <div className={s.gmailLogo}>
          <GmailMark />
          <span>Gmail</span>
        </div>
        <div className={s.search} aria-hidden="true">
          <Search size={17} />
          <span>Hľadať v pošte</span>
        </div>
        <span className={s.account} aria-hidden="true">{business ? "K" : "M"}</span>
      </div>
      <div className={s.message} role="region" aria-label={"Ukážka e-mailu: " + subject}>
        <div className={s.toolbar} aria-hidden="true">
          <ArrowLeft size={17} />
          <Archive size={17} />
          <Trash2 size={17} />
          <MoreVertical size={17} />
        </div>
        <h3 className={s.subject}>{subject}</h3>
        <div className={s.sender}>
          <span className={s.avatar} aria-hidden="true">
            <img
              src={sitePath("/work/koverta/koverta-symbol.svg")}
              alt=""
              width={32}
              height={24}
            />
          </span>
          <div className={s.senderInfo}>
            <b>Koverta</b>
            <small>konfigurator@koverta.sk</small>
            <small>komu: mne <ChevronDown size={11} aria-hidden="true" /></small>
          </div>
          <time>10:42</time>
          <Star size={16} className={s.star} aria-hidden="true" />
        </div>
        {children}
      </div>
    </div>
  );
}

function Details({ business, expanded }: { business: boolean; expanded: boolean }) {
  return (
    <div
      id={business ? "mail-business-details" : "mail-customer-details"}
      className={s.details}
      data-email-details
      data-expanded={expanded}
      aria-hidden={!expanded}
      inert={!expanded ? true : undefined}
    >
      <div className={s.detailsInner}>
        <h5>Parametre zostavy</h5>
        <dl className={s.configuration}>
          {configuration.map(([label, value]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
        {!business && (
          <p className={s.customerNote}>
            <strong>Vaša poznámka:</strong> Prosím o voľný termín montáže. Dlažba je pripravená,
            prístup na pozemok z ulice.
          </p>
        )}
      </div>
    </div>
  );
}

function EmailBody({ business, expanded }: { business: boolean; expanded: boolean }) {
  return (
    <div className={s.emailBody} data-mail-body>
      <div className={s.emailMasthead}>
        <img
          className={s.kovertaLogo}
          src={sitePath("/work/koverta/logo.svg")}
          width={206}
          height={31}
          alt="Koverta"
        />
      </div>
      <div className={s.emailContent}>
        <h4>{business ? "Nový dopyt od Martina Kováča" : "Váš dopyt sme prijali"}</h4>
        <p className={s.intro}>
          {business
            ? "Zákazník poslal konfiguráciu pergoly Soltec cez koverta.sk. Tu sú údaje k dopytu."
            : "Dobrý deň, pán Kováč, ďakujeme za záujem. Vašu konfiguráciu pergoly sme prijali a po preverení možností vám pripravíme cenovú ponuku."}
        </p>

        <div className={s.productSummary}>
          <div className={s.productDescription}>
            <h5>Bioklimatická pergola Soltec</h5>
            <p>5 076 × 2 500 mm</p>
            <p>Biela konštrukcia, antracitové lamely</p>
            <div className={s.estimate}>
              <span>Orientačná cena s DPH</span>
              <strong>8 490 €</strong>
            </div>
          </div>
          <img
            src={sitePath("/work/koverta/config-step-6.webp")}
            width={1400}
            height={875}
            loading="lazy"
            decoding="async"
            alt="Náhľad zvolenej bioklimatickej pergoly"
          />
        </div>

        {business ? (
          <>
            <div className={s.contactBlock}>
              <h5>Kontakt na zákazníka</h5>
              <dl className={s.contacts}>
                <div><dt>Meno</dt><dd>Martin Kováč</dd></div>
                <div><dt>Telefón</dt><dd>+421 900 123 456</dd></div>
                <div><dt>E-mail</dt><dd>martin.kovac@example.com</dd></div>
                <div><dt>Montáž</dt><dd>Javorová 12, 949 01 Nitra</dd></div>
              </dl>
            </div>
            <div className={s.note}>
              <h5>Poznámka zákazníka</h5>
              <p>Prosím o voľný termín montáže. Dlažba je pripravená, prístup na pozemok z ulice.</p>
            </div>
          </>
        ) : (
          <div className={s.followup}>
            <h5>Čo bude nasledovať</h5>
            <p>Preveríme rozmery a podmienky montáže. Potom sa vám ozveme s presnou ponukou.</p>
          </div>
        )}

        <Details business={business} expanded={expanded} />
      </div>
      <div className={s.emailFooter}>
        {business
          ? "Automatické oznámenie z konfigurátora Koverta."
          : "Toto je potvrdenie prijatia dopytu, nie záväzná objednávka."}
      </div>
    </div>
  );
}

export function InquiryDemo() {
  const [expanded, setExpanded] = useState(false);
  return (
    <section id="pred-a-po" className={s.section}>
      <header className={s.heading}>
        <h2>
          Čo príde zákazníkovi.
          <br />
          <span>A čo príde vám.</span>
        </h2>
        <p>
          Po odoslaní zostavy dostane zákazník potvrdenie. Vy dostanete dopyt s cenou,
          konfiguráciou a kontaktom na zákazníka.
        </p>
      </header>
      <div className={s.previewControls}>
        <button
          type="button"
          className={s.expandControl}
          data-email-toggle
          aria-expanded={expanded}
          aria-controls="mail-customer-details mail-business-details"
          onClick={() => setExpanded((value) => !value)}
        >
          {expanded ? "Skryť podrobné parametre" : "Zobraziť podrobné parametre"}
          <ChevronDown size={16} aria-hidden="true" />
        </button>
      </div>
      <div className={s.comparison} ref={revealMailPair}>
        {[false, true].map((business) => (
          <div key={String(business)} data-mail-scene>
            <h3 className={s.comparisonLabel}>
              {business ? "E-mail pre firmu" : "Potvrdenie pre zákazníka"}
            </h3>
            <MailWindow
              business={business}
              subject={business
                ? "Nový dopyt – pergola Soltec – Martin Kováč"
                : "Potvrdenie prijatia dopytu – Koverta"}
            >
              <EmailBody business={business} expanded={expanded} />
            </MailWindow>
          </div>
        ))}
      </div>
      <p className={s.caption}>
        Ilustračné e-maily s fiktívnymi kontaktnými údajmi a orientačnou cenou.
        Skutočnú podobu prispôsobujeme konkrétnej firme.
      </p>
    </section>
  );
}
