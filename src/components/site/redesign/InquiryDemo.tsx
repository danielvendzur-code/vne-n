import { useState } from "react";
import {
  Search,
  Menu,
  Archive,
  Trash2,
  ArrowLeft,
  MoreVertical,
  Star,
  Reply,
  Paperclip,
  ChevronDown,
  Mail,
  Check,
} from "lucide-react";
import { sitePath } from "./utils";
import s from "./InquiryDemo.module.css";
const configuration = [
  ["Model", "Bioklimatická pergola Soltec"],
  ["Cena zostavy", "8 490 € s DPH · vypočítané podľa cenníka"],
  ["Rozmery", "5 076 × 2 500 mm · výška 2 500 mm"],
  ["Konštrukcia", "Biela · RAL 9010"],
  ["Lamely", "Antracit · RAL 7016 · otočná strecha"],
  ["Doplnky", "ZIP roleta vpredu, teplé LED osvetlenie"],
  ["Umiestnenie", "Samostatne stojaca · pripravená dlažba"],
  ["Lokalita", "Nitra"],
  ["Termín", "Podľa dohody"],
];
const calculation = [
  ["Typ plotu", "3D panelový plot"],
  ["Dĺžka", "20 m"],
  ["Výška", "1,53 m"],
  ["Farba", "Antracit"],
  ["Cena zostavy", "892 € vrátane montáže · ukážková zostava"],
  ["Lokalita", "Nitra"],
  ["Požiadavka", "Prosím aj ponuku na montáž a bránku."],
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
export function InquiryDemo() {
  const [kind, setKind] = useState<"config" | "calc">("config");
  const [star, setStar] = useState(false);
  const [reply, setReply] = useState(false);
  return (
    <section id="pred-a-po" className={s.section}>
      <header className={s.heading}>
        <h2>
          Od otázky k
          <br />
          <span>pripravenému dopytu.</span>
        </h2>
        <div>
          <p>
            Zákazník už pozná cenu. Vám príde jeho kontakt, hotový výber aj vypočítaná suma. Môžete
            sa rovno dohodnúť na ďalšom kroku.
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
                onClick={() => {
                  setKind(key as "config" | "calc");
                  setReply(false);
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </header>
      <div className={s.comparison}>
        <div className={s.before}>
          <span className={s.comparisonLabel}>BEŽNÁ OTÁZKA</span>
          <div className={s.gmail} data-mail-preview>
            <div className={s.topbar}>
              <div className={s.gmailLogo}>
                <GmailMark />
                <span>Gmail</span>
              </div>
              <div className={s.search}>
                <Search size={14} />
                <span>Hľadať v pošte</span>
              </div>
              <span className={s.account}>K</span>
            </div>
            <div className={s.message}>
              <div className={s.toolbar}>
                <ArrowLeft size={16} />
                <Archive size={16} />
                <Trash2 size={16} />
              </div>
              <div className={s.subject}>
                <h3>{kind === "config" ? "Cena pergoly" : "Cena plotu"}</h3>
                <span>Doručené</span>
              </div>
              <div className={s.sender}>
                <span className={s.avatar}>M</span>
                <div>
                  <b>Martin K.</b>
                  <small>martin.k@example.com</small>
                </div>
                <time>10:42</time>
              </div>
              <div className={s.ordinary}>
                <p>Dobrý deň,</p>
                <p>
                  {kind === "config"
                    ? "koľko by stála pergola k domu?"
                    : "koľko by stál plot okolo pozemku?"}
                </p>
                <p>
                  Ďakujem.
                  <br />
                  Martin
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className={s.after}>
          <span className={s.comparisonLabel}>HOTOVÝ VÝBER AJ CENA</span>
          <div className={s.gmail} data-mail-preview>
            <div className={s.topbar}>
              <Menu size={18} />
              <div className={s.gmailLogo}>
                <GmailMark />
                <span>Gmail</span>
              </div>
              <div className={s.search}>
                <Search size={16} />
                <span>Hľadať v pošte</span>
              </div>
              <span className={s.account}>K</span>
            </div>
            <div className={s.body}>
              <aside className={s.sidebar}>
                <span>
                  <Mail size={16} /> Doručené <b>1</b>
                </span>
                <span>Odoslané</span>
                <span>Koncepty</span>
              </aside>
              <div className={s.message}>
                <div className={s.toolbar} aria-hidden="true">
                  <ArrowLeft size={18} />
                  <Archive size={18} />
                  <Trash2 size={17} />
                  <MoreVertical size={18} />
                </div>
                <div className={s.subject}>
                  <h3>
                    {kind === "config"
                      ? "Nový dopyt · bioklimatická pergola"
                      : "Nový dopyt · kalkulácia plotu"}
                  </h3>
                  <span>Doručené</span>
                </div>
                <div className={s.sender}>
                  <span className={s.avatar}>{kind === "config" ? "K" : "P"}</span>
                  <div>
                    <b>{kind === "config" ? "Koverta · konfigurátor" : "Kalkulačka plotu"}</b>
                    <small>
                      komu: {kind === "config" ? "obchod@koverta.sk" : "vám"}{" "}
                      <ChevronDown size={10} />
                    </small>
                  </div>
                  <time>10:42</time>
                  <button
                    type="button"
                    aria-label={star ? "Zrušiť hviezdičku" : "Označiť hviezdičkou"}
                    aria-pressed={star}
                    onClick={() => setStar(!star)}
                  >
                    <Star size={17} fill={star ? "#fbbc04" : "none"} />
                  </button>
                </div>
                <div className={s.mailContent} key={kind}>
                  <div className={s.mailBrand}>
                    {kind === "config" ? (
                      <img
                        src={sitePath("/work/koverta/logo.svg")}
                        width={140}
                        height={30}
                        alt="Koverta"
                      />
                    ) : (
                      <span>Kalkulačka plotu</span>
                    )}
                    <small>Hotový výber zákazníka</small>
                  </div>
                  <div className={s.quote}>
                    <p className={s.eyebrow}>DOPYT #UKÁŽKA-026</p>
                    <h4>
                      {kind === "config"
                        ? "Bioklimatická pergola · hotová zostava"
                        : "3D panelový plot · hotový výber"}
                    </h4>
                    <p>Martin K. posiela svoj výber. Cenu už videl v nástroji na webe.</p>
                    <div className={s.brief}>
                      <dl>
                        {(kind === "config" ? configuration : calculation).map(([label, value]) => (
                          <div key={label}>
                            <dt>{label}</dt>
                            <dd>{value}</dd>
                          </div>
                        ))}
                      </dl>
                      <div className={s.metadata}>
                        <div className={s.contact}>
                          <strong>Martin K.</strong>
                          <span>martin.k@example.com</span>
                          <span>+421 900 123 456</span>
                        </div>
                        <p className={s.note}>
                          Poznámka zákazníka: „Prosím o preverenie dostupného termínu a podmienok
                          montáže.“
                        </p>
                        {kind === "config" && (
                          <div className={s.attachment}>
                            <img
                              src={sitePath("/work/koverta/config-step-6.webp")}
                              width={1400}
                              height={875}
                              alt="3D náhľad vybratej pergoly"
                            />
                            <span>
                              <Paperclip size={14} /> Zostava-pergoly <Check size={14} />
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <button className={s.reply} type="button" onClick={() => setReply(!reply)}>
                  <Reply size={16} /> {reply ? "Zavrieť odpoveď" : "Odpovedať"}
                </button>
                {reply && (
                  <div className={s.replyBox}>
                    <label htmlFor="sample-reply">Vzorová odpoveď zákazníkovi</label>
                    <textarea
                      id="sample-reply"
                      defaultValue="Dobrý deň, Martin, ďakujeme. Váš výber aj vypočítanú cenu máme. Dohodnime si termín montáže."
                    />
                    <span>Toto je ukážka schránky. Správa sa neodosiela.</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <p className={s.caption}>
        Vzorové rozhranie Gmailu s fiktívnym zákazníkom. Obsah správy sa prispôsobí vášmu formuláru
        a značke.
      </p>
    </section>
  );
}
