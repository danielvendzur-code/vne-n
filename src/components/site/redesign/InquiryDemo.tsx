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
          <span className={s.avatar} aria-hidden="true">
            <img src={sitePath("/work/koverta/koverta-symbol.svg")} alt="" width={32} height={24} />
          </span>
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
        <img
          className={s.kovertaLogo}
          src={sitePath("/work/koverta/logo.svg")}
          width={206}
          height={31}
          alt="Koverta"
        />
        <span>3D KONFIGURÁTOR</span>
      </div>
      <div className={s.emailIntro}>
        <span className={s.emailEyebrow}>{business ? "NOVÝ DOPYT" : "POTVRDENIE ODOSLANIA"}</span>
        <h4>{business ? "Nový dopyt: bioklimatická pergola" : "Vaša zostava bola odoslaná"}</h4>
        <p>
          {business
            ? "Martin Kováč si nakonfiguroval pergolu Soltec. Nižšie nájdete zostavu, orientačnú cenu aj kontaktné údaje."
            : "Dobrý deň, pán Kováč, ďakujeme za odoslanie. Tu je prehľad zostavy, ktorú ste si vytvorili."}
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
          <h5>{business ? "Čo treba potvrdiť" : "Čo bude nasledovať"}</h5>
          <p>
            {business
              ? "Overte technické možnosti, miesto osadenia a dostupný termín pred prípravou záväznej ponuky."
              : "Overíme rozmery a podmienky montáže a následne pripravíme presnú ponuku."}
          </p>
        </div>
      </div>
      <button
        type="button"
        className={s.detailsToggle}
        data-email-toggle
        aria-expanded={expanded}
        aria-controls={detailsId}
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
              subject={
                business
                  ? "Nový dopyt – Pergola Soltec | Martin Kováč"
                  : "Potvrdenie zostavy – Pergola Soltec"
              }
              sender="Koverta"
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
