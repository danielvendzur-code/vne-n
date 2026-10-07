import { useState, type ReactNode } from "react";
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
const calculation = [
  ["Typ plotu", "3D panelový plot"],
  ["Dĺžka", "20 m · 8 panelov"],
  ["Výška", "153 cm"],
  ["Hrúbka drôtu", "4 mm"],
  ["Farba", "Antracit · RAL 7016"],
  ["Stĺpiky", "Hranaté · 60 × 40 mm"],
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
  const [kind, setKind] = useState<"config" | "calc">("config");
  const config = kind === "config";
  return (
    <section id="pred-a-po" className={s.section}>
      <header className={s.heading}>
        <h2>
          Od otázky k<br />
          <span>pripravenému dopytu.</span>
        </h2>
        <div>
          <p>
            Zákazník pozná cenu ešte na webe. Vám príde jeho kontakt, konkrétny výber a vypočítaná
            suma.
          </p>
          <div className={s.tabs} aria-label="Zdroj vzorového dopytu">
            {[
              ["config", "Z konfigurátora"],
              ["calc", "Z kalkulačky"],
            ].map(([key, label]) => (
              <button
                type="button"
                key={key}
                aria-pressed={kind === key}
                onClick={() => setKind(key as "config" | "calc")}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </header>
      <div className={s.comparison}>
        <div>
          <span className={s.comparisonLabel}>BEŽNÝ E-MAIL</span>
          <MailWindow
            subject={config ? "Pergola na terasu" : "Plot k rodinnému domu"}
            sender="Martin Kováč"
            email="martin.kovac@example.com"
          >
            <div className={s.ordinary}>
              <p>Dobrý deň,</p>
              <p>
                {config
                  ? "mám záujem o pergolu na terasu v Nitre, približne 5 × 2,5 m. Viete mi, prosím, poslať cenu aj s montážou?"
                  : "potrebujem približne 20 metrov plotu k domu v Nitre. Viete mi, prosím, poslať cenu aj s montážou?"}
              </p>
              <p>
                Ďakujem.
                <br />
                Martin Kováč
                <br />
                +421 900 123 456
              </p>
              <div className={s.reply}>
                <Reply size={16} /> Odpovedať
              </div>
            </div>
          </MailWindow>
        </div>
        <div>
          <span className={s.comparisonLabel}>DOPYT Z NÁSTROJA</span>
          <MailWindow
            subject={
              config
                ? "Nový dopyt z konfigurátora — Martin Kováč"
                : "Nový dopyt z kalkulačky — Martin Kováč"
            }
            sender={config ? "Koverta — konfigurátor" : "Môj Plot — kalkulačka"}
            email={config ? "konfigurator@koverta.sk" : "kalkulacka@mojplot.sk"}
          >
            <div className={s.mailContent} key={kind}>
              <div className={s.mailBrand}>
                {config ? (
                  <img
                    src={sitePath("/work/koverta/logo.svg")}
                    width={140}
                    height={30}
                    alt="Koverta"
                  />
                ) : (
                  <>
                    <img
                      src={sitePath("/work/mojplot/logo.png")}
                      width={44}
                      height={44}
                      alt="Môj Plot"
                    />
                    <strong>Môj Plot</strong>
                  </>
                )}
              </div>
              <div className={s.quote}>
                <p>Dobrý deň,</p>
                <p>
                  {config
                    ? "Martin Kováč odoslal dopyt z 3D konfigurátora."
                    : "Martin Kováč odoslal dopyt z kalkulačky plotu."}{" "}
                  Nižšie nájdete jeho výber a kontaktné údaje.
                </p>
                <div className={s.price}>
                  <span>Cena zobrazená zákazníkovi</span>
                  <strong>{config ? "8 490 € s DPH" : "892 €"}</strong>
                  <small>
                    {config ? "Vybraná zostava podľa cenníka" : "Materiál a montáž spolu"}
                  </small>
                </div>
                <h4>{config ? "Zostava pergoly" : "Kalkulácia plotu"}</h4>
                <dl>
                  {(config ? configuration : calculation).map(([label, value]) => (
                    <div key={label}>
                      <dt>{label}</dt>
                      <dd>{value}</dd>
                    </div>
                  ))}
                </dl>
                <h4>Kontakt zákazníka</h4>
                <dl>
                  <div>
                    <dt>Meno</dt>
                    <dd>Martin Kováč</dd>
                  </div>
                  <div>
                    <dt>E-mail</dt>
                    <dd>martin.kovac@example.com</dd>
                  </div>
                  <div>
                    <dt>Telefón</dt>
                    <dd>+421 900 123 456</dd>
                  </div>
                  <div>
                    <dt>Lokalita</dt>
                    <dd>Nitra</dd>
                  </div>
                </dl>
                <p className={s.note}>
                  <b>Poznámka zákazníka:</b>
                  <br />„
                  {config
                    ? "Prosím o voľný termín montáže. Pod pergolou máme pripravenú dlažbu."
                    : "Prosím o voľný termín montáže. Plot bude na rovnom pozemku."}
                  “
                </p>
                {config && (
                  <div className={s.attachment}>
                    <img
                      src={sitePath("/work/koverta/config-step-6.webp")}
                      width={1400}
                      height={875}
                      alt="Náhľad vybratej pergoly"
                    />
                    <span>
                      <Paperclip size={15} /> zostava-pergoly.png
                    </span>
                  </div>
                )}
                <div className={s.reply}>
                  <Reply size={16} /> Odpovedať Martinovi
                </div>
              </div>
            </div>
          </MailWindow>
        </div>
      </div>
      <p className={s.caption}>
        Vzorové e-maily s fiktívnymi kontaktnými údajmi. Výstup sa prispôsobí vašej značke a
        nástroju.
      </p>
    </section>
  );
}
