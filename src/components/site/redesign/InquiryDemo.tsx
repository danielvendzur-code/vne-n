import type { ReactNode } from "react";
import {
  Search,
  Archive,
  Trash2,
  ArrowLeft,
  MoreVertical,
  Star,
  Reply,
  Paperclip,
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
      <div
        className={s.message}
        tabIndex={0}
        role="region"
        aria-label={`Ukážka e-mailu: ${subject}`}
      >
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
export function InquiryDemo() {
  return (
    <section id="pred-a-po" className={s.section}>
      <header className={s.heading}>
        <h2>Od otázky k<br /><span>pripravenému dopytu.</span></h2>
        <p>Zákazník odošle zostavu v 3D. Vám príde meno, kontakt, orientačná cena a podrobný výber – bez ďalšieho dopisovania.</p>
      </header>
      <div className={s.comparison}>
        <div>
          <span className={s.comparisonLabel}>BEŽNÝ E-MAIL</span>
          <MailWindow subject="Pergola na terasu" sender="Martin Kováč" email="martin.kovac@example.com">
            <div className={s.ordinary}>
              <p>Dobrý deň,</p>
              <p>mám záujem o pergolu na terasu v Nitre, približne 5 × 2,5 m. Viete mi poslať cenu aj s montážou?</p>
              <p>Ďakujem.<br />Martin Kováč<br />+421 900 123 456</p>
              <div className={s.reply}><Reply size={16} /> Odpovedať</div>
            </div>
          </MailWindow>
        </div>
        <div>
          <span className={s.comparisonLabel}>DOPYT Z 3D KONFIGURÁTORA</span>
          <MailWindow subject="Nový dopyt z konfigurátora" sender="Koverta · 3D konfigurátor" email="konfigurator@koverta.sk">
            <div className={s.mailContent}>
              <div className={s.quote}>
                <span className={s.emailEyebrow}>NOVÝ DOPYT · PERGOLA</span>
                <h4>Údaje zákazníka</h4>
                <dl>
                  <div><dt>Meno</dt><dd>Martin Kováč</dd></div>
                  <div><dt>Telefón</dt><dd>+421 900 123 456</dd></div>
                  <div><dt>E-mail</dt><dd>martin.kovac@example.com</dd></div>
                  <div><dt>Lokalita</dt><dd>Nitra</dd></div>
                </dl>
                <div className={s.price}>
                  <span>Orientačná cena zostavy</span>
                  <strong>8 490 € s DPH</strong>
                  <small>Vzorová cena pre ukážku</small>
                </div>
                <details className={s.configurationDetails}>
                  <summary>Celá zostava zákazníka <ChevronDown size={18} aria-hidden="true" /></summary>
                  <div className={s.configurationBody}>
                    <dl>
                      {configuration.map(([label, value]) => (
                        <div key={label}><dt>{label}</dt><dd>{value}</dd></div>
                      ))}
                    </dl>
                    <p className={s.note}><strong>Poznámka:</strong> Prosím o voľný termín montáže. Dlažba je pripravená.</p>
                    <div className={s.attachment}>
                      <img src={sitePath("/work/koverta/config-step-6.webp")} width={1400} height={875} alt="Náhľad vybratej pergoly" />
                      <span><Paperclip size={15} /> Náhľad zostavy</span>
                    </div>
                  </div>
                </details>
                <div className={s.reply}><Reply size={16} /> Odpovedať zákazníkovi</div>
              </div>
            </div>
          </MailWindow>
        </div>
      </div>
      <p className={s.caption}>Ilustračné e-maily s fiktívnymi kontaktnými údajmi a cenou. Konkrétna štruktúra sa prispôsobuje firme.</p>
    </section>
  );
}
