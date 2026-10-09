import { useState, type ReactNode } from "react";
import { revealMailPair } from "./scene-motion";
import {
  Search,
  Archive,
  Trash2,
  ArrowLeft,
  MoreVertical,
  Star,
  ChevronDown,
  Mail,
  CheckCircle2,
} from "lucide-react";
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
    <svg width="28" height="22" viewBox="0 0 28 22" aria-hidden="true">
      <path d="M2 21V4l12 9L26 4v17" fill="none" stroke="#4285f4" strokeWidth="4" />
      <path d="M2 4l12 9L26 4" fill="none" stroke="#ea4335" strokeWidth="4" />
      <path d="M26 10v11" stroke="#34a853" strokeWidth="4" />
      <path d="M2 10v11" stroke="#fbbc04" strokeWidth="4" />
    </svg>
  );
}
function MailWindow({
  subject,
  sender,
  email,
  children,
}: {
  subject: string;
  sender: string;
  email: string;
  children: ReactNode;
}) {
  return (
    <div className={s.gmail} data-mail-preview>
      <div className={s.topbar}>
        <div className={s.gmailLogo}>
          <GmailMark />
          <span>Gmail</span>
        </div>
        <div className={s.search}>
          <Search size={17} />
          <span>Hľadať v pošte</span>
        </div>
        <span className={s.account}>K</span>
      </div>
      <div className={s.message} role="region" aria-label={`Ukážka e-mailu: ${subject}`}>
        <div className={s.toolbar} aria-hidden="true">
          <ArrowLeft size={18} />
          <Archive size={18} />
          <Trash2 size={18} />
          <Mail size={18} />
          <MoreVertical size={18} />
        </div>
        <div className={s.subject}>
          <h3>{subject}</h3>
          <span>Doručené</span>
        </div>
        <div className={s.sender}>
          <span className={s.avatar}>{sender[0]}</span>
          <div>
            <b>{sender}</b>
            <small>
              {email}
              <br />
              komu: mne <ChevronDown size={11} />
            </small>
          </div>
          <time>10:42</time>
          <Star size={16} aria-hidden="true" />
        </div>
        {children}
      </div>
    </div>
  );
}
function EmailBody({
  business,
  expanded,
  onToggle,
}: {
  business: boolean;
  expanded: boolean;
  onToggle: () => void;
}) {
  const detailsId = `inquiry-details-${business ? "business" : "customer"}`;
  return (
    <div className={s.emailBody} data-mail-body>
      <div className={s.emailMasthead}>
        <strong>Koverta</strong>
        <span>3D konfigurátor</span>
      </div>
      <div className={s.emailIntro}>
        <span className={s.emailEyebrow}>{business ? "NOVÝ DOPYT" : "POTVRDENIE ODOSLANIA"}</span>
        <h4>{business ? "Zostava od zákazníka." : "Ďakujeme za váš dopyt."}</h4>
        <p>
          {business
            ? "Martin Kováč odoslal zostavu z konfigurátora vrátane ceny a výbavy."
            : "Dobrý deň, pán Kováč. Vaša zostava z konfigurátora bola úspešne odoslaná."}
        </p>
      </div>
      <div className={s.product}>
        <img
          src={sitePath("/work/koverta/config-step-6.webp")}
          width={1400}
          height={875}
          loading="lazy"
          decoding="async"
          alt="Vybraná bioklimatická pergola s roletou a LED osvetlením"
        />
        <div className={s.price}>
          <span>Cena zostavy</span>
          <strong>
            8 490 € <small>s DPH</small>
          </strong>
          <span>Vrátane vybranej výbavy.</span>
        </div>
      </div>
      <div className={s.nextStep}>
        <CheckCircle2 size={21} strokeWidth={1.6} aria-hidden="true" />
        <div>
          <h5>{business ? "Pripravené na odpoveď" : "Ozveme sa vám do 24 hodín"}</h5>
          <p>
            {business
              ? "Dohodnite so zákazníkom termín montáže a ďalší postup."
              : "Prejdeme si s vami miesto a termín montáže a dohodneme ďalší postup."}
          </p>
        </div>
      </div>
      <button
        type="button"
        className={s.detailsToggle}
        data-email-toggle
        aria-expanded={expanded}
        aria-controls="inquiry-details-customer inquiry-details-business"
        onClick={onToggle}
      >
        {expanded ? "Skryť zostavu a kontakty" : "Zobraziť zostavu a kontakty"}
        <ChevronDown size={18} aria-hidden="true" />
      </button>
      <div
        id={detailsId}
        className={s.details}
        data-email-details
        data-expanded={expanded}
        role="region"
        aria-label={business ? "Zostava a kontakt zákazníka" : "Vaša zostava a kontaktné údaje"}
        aria-hidden={!expanded}
        inert={!expanded ? true : undefined}
      >
        <div className={s.detailsInner}>
          <div className={s.emailSection}>
            <h5>Zostava z konfigurátora</h5>
            <dl className={s.configuration}>
              {configuration.map(([label, value]) => (
                <div key={label}>
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className={s.emailSection}>
            <h5>Kontaktné údaje</h5>
            <dl className={s.contacts}>
              <div>
                <dt>Meno</dt>
                <dd>Martin Kováč</dd>
              </div>
              <div>
                <dt>Telefón</dt>
                <dd>+421 900 123 456</dd>
              </div>
              <div>
                <dt>E-mail</dt>
                <dd>martin.kovac@example.com</dd>
              </div>
              <div>
                <dt>Adresa montáže</dt>
                <dd>Javorová 12, 949 01 Nitra</dd>
              </div>
            </dl>
          </div>
          <div className={s.customerNote}>
            <h5>{business ? "Poznámka zákazníka" : "Vaša poznámka"}</h5>
            <p>Prosím o voľný termín montáže. Dlažba je pripravená, prístup na pozemok z ulice.</p>
          </div>
        </div>
      </div>
      <div className={s.emailFooter}>
        {business ? "Nový dopyt z 3D konfigurátora." : "Potvrdenie odoslania z 3D konfigurátora."}
      </div>
    </div>
  );
}

export function InquiryDemo() {
  const [expanded, setExpanded] = useState(false);
  const toggleDetails = () => setExpanded((value) => !value);
  return (
    <section id="pred-a-po" className={s.section}>
      <header className={s.heading}>
        <h2>
          Jeden výber.
          <br />
          <span>Jasno na oboch stranách.</span>
        </h2>
        <p>
          Zákazník dostane potvrdenie odoslania a cenu svojej zostavy. Vám príde tá istá zostava s
          výbavou a kontaktnými údajmi.
        </p>
      </header>
      <div className={s.comparison} ref={revealMailPair}>
        {[false, true].map((business) => (
          <div key={String(business)} data-mail-scene>
            <span className={s.comparisonLabel}>
              {business ? "ČO VIDÍTE VY" : "ČO VIDÍ ZÁKAZNÍK"}
            </span>
            <MailWindow
              subject={business ? "Nový dopyt z konfigurátora" : "Potvrdenie odoslania zostavy"}
              sender="Koverta · 3D konfigurátor"
              email="konfigurator@koverta.sk"
            >
              <EmailBody business={business} expanded={expanded} onToggle={toggleDetails} />
            </MailWindow>
          </div>
        ))}
      </div>
      <p className={s.caption}>
        Ilustračné e-maily s fiktívnymi kontaktnými údajmi a cenou. Konkrétna štruktúra sa
        prispôsobuje firme.
      </p>
    </section>
  );
}
