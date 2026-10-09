import type { ReactNode } from "react";
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
function EmailBody({ business }: { business: boolean }) {
  return (
    <div className={s.emailBody}>
      <div className={s.emailMasthead}>
        <strong>Koverta</strong>
        <span>3D konfigurátor</span>
      </div>
      <div className={s.emailIntro}>
        <span className={s.emailEyebrow}>{business ? "NOVÝ DOPYT" : "VÁŠ VÝBER JE ULOŽENÝ"}</span>
        <h4>{business ? "Nová pergola. Nový zákazník." : "Vaša terasa, podľa vás."}</h4>
        <p>
          {business
            ? "Martin Kováč má záujem o túto zostavu. Máte všetko na prípravu konkrétnej ponuky."
            : "Dobrý deň, pán Kováč. Tu je pergola, ktorú ste si vybrali — spolu s výbavou a orientačnou cenou."}
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
          <span>Orientačná cena zostavy</span>
          <strong>
            8 490 € <small>s DPH</small>
          </strong>
          <span>Presnú cenu potvrdíme v ponuke.</span>
        </div>
      </div>
      <div className={s.emailSection}>
        <h5>{business ? "Zostava na nacenenie" : "Čo ste si vybrali"}</h5>
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
        <h5>{business ? "Kontakt a miesto montáže" : "Váš dopyt"}</h5>
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
      <div className={s.nextStep}>
        <h5>{business ? "Poznámka zákazníka" : "Čo bude nasledovať"}</h5>
        <p>
          {business
            ? "Prosím o voľný termín montáže. Dlažba je pripravená, prístup na pozemok z ulice."
            : "Ozveme sa vám, overíme miesto montáže a potvrdíme cenu aj voľný termín. Váš výber už máme, nemusíte ho zadávať znova."}
        </p>
      </div>
      <div className={s.emailFooter}>
        {business
          ? "Dopyt pripravený na osobnú odpoveď zákazníkovi."
          : "Ďakujeme za váš záujem. Tešíme sa na vašu novú terasu."}
      </div>
    </div>
  );
}

export function InquiryDemo() {
  return (
    <section id="pred-a-po" className={s.section}>
      <header className={s.heading}>
        <h2>
          Jeden výber.
          <br />
          <span>Jasno na oboch stranách.</span>
        </h2>
        <p>
          Zákazník dostane svoj výber a orientačnú cenu. Vy dostanete nový dopyt s celou zostavou,
          kontaktmi a údajmi na prípravu ponuky.
        </p>
      </header>
      <div className={s.comparison} ref={revealMailPair}>
        {[false, true].map((business) => (
          <div key={String(business)} data-mail-scene>
            <span className={s.comparisonLabel}>
              {business ? "ČO VIDÍTE VY" : "ČO VIDÍ ZÁKAZNÍK"}
            </span>
            <MailWindow
              subject={business ? "Nový dopyt z konfigurátora" : "Vaša pergola — výber a cena"}
              sender="Koverta · 3D konfigurátor"
              email="konfigurator@koverta.sk"
            >
              <EmailBody business={business} />
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
