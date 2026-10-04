import React, { Component, Fragment } from "react";
import { cssStyle, sitePath } from "./utils";
import { Footer } from "./Footer";

export class Tool extends Component<{
  active?: string;
  title?: string;
  copy?: string;
  tool?: string;
}> {
  state = { t: this.props.tool ?? "kalkulacka" };
  renderVals() {
    const P = "/work/";
    const F: Record<string, [string, string]> = {
      answers: [
        "Odpovedať na otázky",
        "Ponuka, dostupnosť, doprava a bežné otázky priamo na webe.",
      ],
      leads: [
        "Zbierať dopyty a kontakty",
        "Zistí, čo zákazník potrebuje, a odošle pripravený kontakt.",
      ],
      advisor: ["Odporúčať vhodný produkt", "Vyberie z ponuky podľa potrieb a rozpočtu zákazníka."],
      compare: ["Porovnať produkty", "Ukáže hlavné rozdiely a pomôže s rozhodnutím."],
      tracking: ["Sledovať objednávku", "Stav platby, expedície a doručenia."],
      returns: ["Riešiť vrátenie a reklamáciu", "Zozbiera číslo objednávky, dôvod a fotografie."],
      rezervacie: ["Rezervovať termíny", "Konzultáciu alebo službu zapíše do kalendára."],
      handoff: [
        "Odovzdať rozhovor človeku",
        "Kolega dostane celý kontext a zákazník nič neopakuje.",
      ],
      jazyky: ["Komunikovať v cudzom jazyku", "Automaticky použije jazyk zákazníka."],
      tabulka: ["Zapisovať do tabuľky alebo CRM", "Každý dopyt uloží na správne miesto."],
      dims: ["Počítať podľa rozmerov", "Dĺžka, šírka, plocha, objem alebo iné rozmery."],
      qty: ["Počítať podľa množstva", "Kusy, metre, balenia alebo iné množstvo."],
      variant: [
        "Počítať podľa typu alebo modelu",
        "Cena sa mení podľa zvoleného variantu alebo služby.",
      ],
      extras: ["Montáž, doprava a doplnky", "Do výsledku zahrnie voliteľné položky a príplatky."],
      document: [
        "Ponuka alebo PDF zhrnutie",
        "Z odpovedí pripraví prehľad pre zákazníka aj firmu.",
      ],
      fotky: ["Prijímať fotky a prílohy", "Podklady k odhadu, návrhu alebo reklamácii."],
      payment: ["Platobný odkaz alebo záloha", "Po výbere ponúkne ďalší krok k objednávke."],
      stock: ["Upozorniť na dostupnosť", "Ozve sa, keď sa produkt vráti alebo zlacnie."],
      cart: ["Uložiť rozpracovaný výber", "Zákazník sa vráti k výberu bez začínania odznova."],
    };
    const feats = (ids: string[]) =>
      ids.map((id, i) => ({
        num: String(i + 1).padStart(2, "0"),
        label: F[id][0],
        desc: F[id][1],
      }));
    const steps = (rows: string[][]) =>
      rows.map(([label, title, copy, artifact], i) => ({
        index: "0" + (i + 1),
        label,
        title,
        copy,
        artifact,
      }));
    const T = {
      chatbot: {
        label: "Chatbot",
        crumb: "CHATBOT",
        num: "01",
        acc: "chatbota",
        title: "Chatbot,",
        accent: "ktorý vie odpovedať.",
        price: "347 €",
        lead: "Odpovedá z vašich podkladov, zistí, čo zákazník potrebuje, a pošle vám kontakt so zhrnutím.",
        img: P + "solutions/chatbot-aplan.webp",
        imgW: "46%",
        caption: "APLAN AI · ASISTENT",
        steps: steps([
          [
            "OTÁZKA",
            "Zákazník sa pýta na produkt alebo nákup.",
            "Namiesto hľadania po webe sa opýta priamo.",
            "Ktorý produkt je pre mňa vhodný?",
          ],
          [
            "POTREBY",
            "Chatbot zistí, čo skutočne hľadá.",
            "Doplní použitie, preferencie alebo rozpočet.",
            "Použitie / preferencie / rozpočet",
          ],
          [
            "ODPOVEĎ",
            "Odpovie z vašich podkladov.",
            "Keď odpoveď nepozná, nehádá — vypýta si kontakt.",
            "Vaše texty, cenník, pravidlá",
          ],
          [
            "ĎALŠÍ KROK",
            "Kontakt príde vám aj so zhrnutím.",
            "Viete, čo zákazník chce, ešte pred prvým telefonátom.",
            "Kontakt + kontext",
          ],
        ]),
        customer: "Odpoveď a jasný ďalší krok bez hľadania po webe.",
        business: "Kontakt spolu s kontextom, ktorý sa dá ďalej riešiť.",
        features: feats([
          "answers",
          "leads",
          "advisor",
          "rezervacie",
          "tracking",
          "returns",
          "handoff",
          "jazyky",
          "tabulka",
        ]),
        exName: "Môj Plot",
        exDomain: "mojplot.sk",
        exHref: "https://mojplot.sk/",
        exImg: P + "live/mojplot.webp",
        exCopy:
          "Chatbot poradí s výberom plotu a kalkulačka spočíta cenu podľa dĺžky a výšky. Zákazník sa dostane k objednávke bez telefonovania.",
      },
      kalkulacka: {
        label: "Kalkulačka",
        crumb: "KALKULAČKA",
        num: "02",
        acc: "kalkulačku",
        title: "Kalkulačka,",
        accent: "ktorá počíta za vás.",
        price: "447 €",
        lead: "Z rozmerov, množstva či doplnkov spočíta orientačnú cenu podľa vášho cenníka. Zákazník vie, s čím počítať — vy dostanete hotové zadanie.",
        img: P + "solutions/kalkulacka-derat.webp",
        imgW: "62%",
        caption: "DERAT · KALKULAČKA ZÁSAHU",
        steps: steps([
          [
            "ZAČIATOK",
            "Návštevník chce poznať cenu.",
            "Výpočet začne hneď, bez telefonátu alebo čakania.",
            "Koľko to bude približne stáť?",
          ],
          [
            "ÚDAJE",
            "Zadá niekoľko jednoduchých údajov.",
            "Vyberie rozmer, množstvo, variant alebo doplnky.",
            "Rozmer / množstvo / variant",
          ],
          [
            "VÝPOČET",
            "Web cenu prepočíta.",
            "Použije váš cenník a pravidlá, ktoré už vo firme máte.",
            "Vaše pravidlá + váš cenník",
          ],
          [
            "VÝSLEDOK",
            "Ukáže výsledok a ďalší krok.",
            "Návštevník vie, s čím počítať, a môže odoslať dopyt.",
            "Odhad ceny + pripravený dopyt",
          ],
        ]),
        customer: "Orientačná cena ešte pred kontaktovaním firmy.",
        business: "Rovnaké vstupy aj výsledok, pripravené pre ponuku.",
        features: feats([
          "dims",
          "qty",
          "variant",
          "extras",
          "document",
          "fotky",
          "tabulka",
          "payment",
        ]),
        exName: "DERAT",
        exDomain: "derat.sk",
        exHref: "https://derat.sk/",
        exImg: P + "live/derat.webp",
        exCopy:
          "Návštevník vyberie typ problému a rozsah zásahu, dostane orientačný výsledok a firma prijme kontakt spolu s kontextom na ďalší krok.",
      },
      poradca: {
        label: "Poradca",
        crumb: "PRODUKTOVÝ PORADCA",
        num: "04",
        acc: "poradcu",
        title: "Poradca,",
        accent: "ktorý vyberie za zákazníka.",
        price: "347 €",
        lead: "Pár jednoduchých otázok a zákazník dostane konkrétny produkt z vašej ponuky — bez toho, aby musel poznať celý katalóg.",
        img: P + "solutions/poradca-kava.webp",
        imgW: "46%",
        caption: "E-SHOP S KÁVOU · VÝBER CHUTI",
        steps: steps([
          [
            "OTÁZKY",
            "Zákazník odpovie na pár otázok.",
            "Jednoduché voľby namiesto filtrov a parametrov.",
            "Na čo to potrebujete?",
          ],
          [
            "PREFERENCIE",
            "Poradca pochopí, čo mu vyhovuje.",
            "Chuť, použitie, veľkosť alebo rozpočet.",
            "Použitie / chuť / rozpočet",
          ],
          [
            "ODPORÚČANIE",
            "Ukáže 1–3 konkrétne produkty.",
            "Vysvetlí, prečo práve tieto a v čom sa líšia.",
            "Produkty + rozdiely",
          ],
          [
            "NÁKUP",
            "Pokračuje rovno do košíka.",
            "Rozhodnutie sa nestratí v ďalšom kroku.",
            "Produkt / košík",
          ],
        ]),
        customer: "Rýchlejšie sa dostane k produktu, ktorý mu dáva zmysel.",
        business: "Asistovaný výber bez poznania celého katalógu — menej vrátení, viac istoty.",
        features: feats([
          "advisor",
          "compare",
          "stock",
          "cart",
          "document",
          "tabulka",
          "payment",
          "jazyky",
        ]),
        exName: "Môj Chatbot",
        exDomain: "vyskúšať ukážku",
        exHref: "https://danielvendzur-code.github.io/moj.chatbot.backend/",
        exImg: P + "solutions/poradca-kava.webp",
        exCopy:
          "Vyskúšajte si, ako vyzerá riadený výber v praxi. Poradca sa dá napojiť na váš e-shop a produkty.",
      },
    };
    const key = this.state.t in T ? (this.state.t as keyof typeof T) : "kalkulacka";
    const t = T[key];
    const switcher = [
      ["chatbot", "Chatbot"],
      ["kalkulacka", "Kalkulačka"],
      ["konfigurator", "3D konfigurátor"],
      ["poradca", "Poradca"],
    ].map(([k, label]) => ({
      label,
      bg: k === key ? "var(--mc-ink)" : "transparent",
      fg: k === key ? "var(--mc-paper)" : "var(--mc-ink)",
      href: k === "konfigurator" ? "/3d-konfigurator" : "/nastroj?t=" + k,
      pick: undefined,
    }));
    return {
      t,
      switcher,
      openWidget: () =>
        window.dispatchEvent(
          new CustomEvent("site-assistant:open", { detail: { entry: "builder" } }),
        ),
    };
  }
  render() {
    const { openWidget, switcher, t } = this.renderVals();
    return (
      <Fragment>
        <div
          style={cssStyle(
            `font-family:'Geist',system-ui,sans-serif;color:var(--mc-ink);background:var(--mc-page)`,
          )}
        >
          <div style={cssStyle(`position:sticky;top:0;z-index:50`)}></div>
          <section
            style={cssStyle(
              `max-width:1280px;margin:0 auto;padding:56px 32px 72px;box-sizing:border-box`,
            )}
          >
            <div
              style={cssStyle(
                `display:flex;justify-content:space-between;align-items:center;gap:16px;flex-wrap:wrap;padding-bottom:20px;border-bottom:1px solid rgba(14,21,18,.12)`,
              )}
            >
              <div
                style={cssStyle(
                  `font-family:'Geist Mono',monospace;font-size:12px;letter-spacing:.08em;color:var(--mc-muted)`,
                )}
              >
                <a href={sitePath("/")}>{"DOMOV"}</a>
                {" / "}
                <a href={sitePath("/sluzby")}>{"RIEŠENIA"}</a>
                {" / "}
                {t.crumb}
              </div>
              <div
                style={cssStyle(
                  `display:flex;gap:4px;background:var(--mc-paper);border:1px solid rgba(14,21,18,.12);padding:4px;border-radius:999px;flex-wrap:wrap`,
                )}
              >
                {switcher.map((s, index) => (
                  <Fragment key={index}>
                    <a
                      href={sitePath(s.href)}
                      onClick={s.pick}
                      style={cssStyle(
                        `padding:9px 16px;border-radius:999px;font-size:14px;background:${s.bg};color:${s.fg}`,
                      )}
                    >
                      {s.label}
                    </a>
                  </Fragment>
                ))}
              </div>
            </div>
            <div
              style={cssStyle(
                `display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,460px),1fr));gap:48px;align-items:center;padding-top:48px`,
              )}
            >
              <div style={cssStyle(`display:flex;flex-direction:column;gap:28px`)}>
                <div
                  style={cssStyle(
                    `font-family:'Geist Mono',monospace;font-size:12px;letter-spacing:.08em;color:var(--mc-muted)`,
                  )}
                >
                  {t.num}
                  {" / "}
                  {t.crumb}
                </div>
                <h1
                  style={cssStyle(
                    `margin:0;font-size:clamp(48px,6.5vw,88px);line-height:.94;letter-spacing:-.055em;font-weight:600`,
                  )}
                >
                  {t.title}
                  <br />
                  <span style={cssStyle(`color:var(--mc-brand)`)}>{t.accent}</span>
                </h1>
                <p
                  style={cssStyle(
                    `margin:0;font-size:19px;line-height:1.5;color:var(--mc-muted);max-width:520px;text-wrap:pretty`,
                  )}
                >
                  {t.lead}
                </p>
                <div style={cssStyle(`display:flex;gap:12px;align-items:center;flex-wrap:wrap`)}>
                  <button className="mc-btn" onClick={openWidget} type="button">
                    {"Vyskladať riešenie →"}
                  </button>
                  <div
                    style={cssStyle(
                      `display:flex;align-items:baseline;gap:8px;padding:10px 18px;border-radius:999px;background:var(--mc-paper);border:1px solid rgba(14,21,18,.12)`,
                    )}
                  >
                    <span style={cssStyle(`font-size:14px;color:var(--mc-muted)`)}>{"od"}</span>
                    <span
                      style={cssStyle(
                        `font-size:26px;font-weight:600;letter-spacing:-.03em;font-variant-numeric:tabular-nums`,
                      )}
                    >
                      {t.price}
                    </span>
                    <span
                      style={cssStyle(
                        `font-family:'Geist Mono',monospace;font-size:11px;letter-spacing:.08em;color:var(--mc-muted)`,
                      )}
                    >
                      {"JEDNORAZOVO"}
                    </span>
                  </div>
                </div>
              </div>
              <div
                style={cssStyle(
                  `background:var(--mc-ink);border-radius:32px;height:clamp(380px,62vh,540px);position:relative;overflow:hidden;display:flex;align-items:flex-end;justify-content:center`,
                )}
              >
                <div
                  style={cssStyle(
                    `position:absolute;top:20px;left:22px;right:22px;display:flex;justify-content:space-between;font-family:'Geist Mono',monospace;font-size:11px;letter-spacing:.08em;color:rgba(255,255,255,.7)`,
                  )}
                >
                  <span style={cssStyle(`display:flex;align-items:center;gap:8px`)}>
                    <span
                      style={cssStyle(
                        `width:7px;height:7px;border-radius:50%;background:var(--mc-accent)`,
                      )}
                    ></span>
                    {"ŽIVÁ UKÁŽKA"}
                  </span>
                  <span>{t.caption}</span>
                </div>
                <img
                  src={sitePath(t.img)}
                  alt={t.caption}
                  style={cssStyle(
                    `width:${t.imgW};max-height:84%;object-fit:cover;object-position:top;border-radius:20px 20px 0 0;display:block`,
                  )}
                  loading="eager"
                />
              </div>
            </div>
          </section>
          <section style={cssStyle(`background:var(--mc-ink);color:var(--mc-paper)`)}>
            <div
              style={cssStyle(
                `max-width:1280px;margin:0 auto;padding:88px 32px;box-sizing:border-box;display:flex;flex-direction:column;gap:36px`,
              )}
            >
              <div
                style={cssStyle(
                  `display:flex;justify-content:space-between;align-items:end;gap:20px 32px;flex-wrap:wrap;padding-top:28px;border-top:1px solid rgba(255,255,255,.12)`,
                )}
              >
                <div>
                  <div
                    style={cssStyle(
                      `font-family:'Geist Mono',monospace;font-size:12px;letter-spacing:.08em;color:var(--mc-accent)`,
                    )}
                  >
                    {"01 / AKO TO FUNGUJE"}
                  </div>
                  <h2
                    style={cssStyle(
                      `margin:16px 0 0;font-size:clamp(36px,4.5vw,56px);line-height:1.04;letter-spacing:-.045em;font-weight:600`,
                    )}
                  >
                    {"Štyri kroky zákazníka."}
                  </h2>
                </div>
                <p
                  style={cssStyle(
                    `margin:0;font-size:17px;line-height:1.5;color:rgba(255,255,255,.7);max-width:380px`,
                  )}
                >
                  {"Bez hľadania, čakania a zbytočných telefonátov."}
                </p>
              </div>
              <div
                style={cssStyle(
                  `display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:12px`,
                )}
              >
                {t.steps.map(
                  (
                    s: {
                      index: string;
                      label: string;
                      title: string;
                      copy: string;
                      artifact: string;
                    },
                    index: number,
                  ) => (
                    <Fragment key={index}>
                      <div
                        style={cssStyle(
                          `background:var(--mc-ink);border:1px solid rgba(255,255,255,.08);border-radius:24px;padding:26px;display:flex;flex-direction:column;gap:12px`,
                        )}
                      >
                        <div
                          style={cssStyle(
                            `font-family:'Geist Mono',monospace;font-size:12px;letter-spacing:.08em;color:var(--mc-accent)`,
                          )}
                        >
                          {s.index}
                          {" / "}
                          {s.label}
                        </div>
                        <div
                          style={cssStyle(
                            `font-size:20px;font-weight:600;letter-spacing:-.02em;line-height:1.2`,
                          )}
                        >
                          {s.title}
                        </div>
                        <div
                          style={cssStyle(
                            `font-size:15px;line-height:1.5;color:rgba(255,255,255,.7)`,
                          )}
                        >
                          {s.copy}
                        </div>
                        <div
                          style={cssStyle(
                            `margin-top:auto;padding-top:14px;border-top:1px solid rgba(255,255,255,.12);font-size:14px;font-weight:500`,
                          )}
                        >
                          {s.artifact}
                        </div>
                      </div>
                    </Fragment>
                  ),
                )}
              </div>
            </div>
          </section>
          <section
            style={cssStyle(
              `max-width:1280px;margin:0 auto;padding:88px 32px 0;box-sizing:border-box;display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,420px),1fr));gap:12px`,
            )}
          >
            <div
              style={cssStyle(
                `background:var(--mc-accent);border-radius:28px;padding:36px;display:flex;flex-direction:column;gap:16px`,
              )}
            >
              <div
                style={cssStyle(
                  `font-family:'Geist Mono',monospace;font-size:12px;letter-spacing:.08em`,
                )}
              >
                {"ČO DOSTANE ZÁKAZNÍK"}
              </div>
              <div
                style={cssStyle(
                  `font-size:30px;font-weight:600;letter-spacing:-.03em;line-height:1.12`,
                )}
              >
                {t.customer}
              </div>
            </div>
            <div
              style={cssStyle(
                `background:var(--mc-paper);border:1px solid rgba(14,21,18,.12);border-radius:28px;padding:36px;display:flex;flex-direction:column;gap:16px`,
              )}
            >
              <div
                style={cssStyle(
                  `font-family:'Geist Mono',monospace;font-size:12px;letter-spacing:.08em;color:var(--mc-muted)`,
                )}
              >
                {"ČO DOSTANETE VY"}
              </div>
              <div
                style={cssStyle(
                  `font-size:30px;font-weight:600;letter-spacing:-.03em;line-height:1.12`,
                )}
              >
                {t.business}
              </div>
            </div>
          </section>
          <section
            style={cssStyle(
              `max-width:1280px;margin:0 auto;padding:88px 32px;box-sizing:border-box;display:flex;flex-direction:column;gap:36px`,
            )}
          >
            <div
              style={cssStyle(
                `display:flex;justify-content:space-between;align-items:end;gap:20px 32px;flex-wrap:wrap;padding-top:28px;border-top:1px solid rgba(14,21,18,.12)`,
              )}
            >
              <div>
                <div
                  style={cssStyle(
                    `font-family:'Geist Mono',monospace;font-size:12px;letter-spacing:.08em;color:var(--mc-muted)`,
                  )}
                >
                  {"02 / ČO VIE"}
                </div>
                <h2
                  style={cssStyle(
                    `margin:16px 0 0;font-size:clamp(36px,4.5vw,56px);line-height:1.04;letter-spacing:-.045em;font-weight:600`,
                  )}
                >
                  {"Funkcie, ktoré môžete pridať."}
                </h2>
              </div>
              <p
                style={cssStyle(
                  `margin:0;font-size:17px;line-height:1.5;color:var(--mc-muted);max-width:380px`,
                )}
              >
                {"Vyberieme len to, čo vaša firma naozaj potrebuje. Zvyšok sa dá doplniť neskôr."}
              </p>
            </div>
            <div
              style={cssStyle(
                `display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,280px),1fr));gap:10px`,
              )}
            >
              {t.features.map((f: { num: string; label: string; desc: string }, index: number) => (
                <Fragment key={index}>
                  <div
                    style={cssStyle(
                      `background:var(--mc-paper);border:1px solid rgba(14,21,18,.12);border-radius:20px;padding:22px;display:grid;grid-template-columns:36px minmax(0,1fr);gap:14px`,
                    )}
                    className="ref-hover-12"
                  >
                    <span
                      style={cssStyle(
                        `width:32px;height:32px;border-radius:10px;background:var(--mc-ink);color:var(--mc-accent);display:flex;align-items:center;justify-content:center;font-family:'Geist Mono',monospace;font-size:11px`,
                      )}
                    >
                      {f.num}
                    </span>
                    <div style={cssStyle(`display:flex;flex-direction:column;gap:4px`)}>
                      <span style={cssStyle(`font-size:16px;font-weight:600`)}>{f.label}</span>
                      <span
                        style={cssStyle(`font-size:14px;color:var(--mc-muted);line-height:1.45`)}
                      >
                        {f.desc}
                      </span>
                    </div>
                  </div>
                </Fragment>
              ))}
            </div>
          </section>
          <section
            style={cssStyle(
              `max-width:1280px;margin:0 auto;padding:0 32px 88px;box-sizing:border-box`,
            )}
          >
            <a
              href={sitePath(t.exHref)}
              target={"_blank"}
              rel={"noreferrer"}
              style={cssStyle(
                `display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,420px),1fr));background:var(--mc-paper);border:1px solid rgba(14,21,18,.12);border-radius:28px;overflow:hidden`,
              )}
              className="ref-hover-13"
            >
              <img
                src={sitePath(t.exImg)}
                alt={t.exName}
                style={cssStyle(
                  `width:100%;height:100%;min-height:280px;max-height:380px;object-fit:cover;object-position:top;display:block`,
                )}
                loading="lazy"
              />
              <div
                style={cssStyle(
                  `padding:36px;display:flex;flex-direction:column;justify-content:center;gap:14px`,
                )}
              >
                <div
                  style={cssStyle(
                    `font-family:'Geist Mono',monospace;font-size:12px;letter-spacing:.08em;color:var(--mc-muted)`,
                  )}
                >
                  {"03 / NASADENÉ NA WEBE"}
                </div>
                <div
                  style={cssStyle(
                    `font-size:40px;font-weight:600;letter-spacing:-.04em;line-height:1.04`,
                  )}
                >
                  {t.exName}
                </div>
                <p
                  style={cssStyle(`margin:0;font-size:16px;line-height:1.55;color:var(--mc-muted)`)}
                >
                  {t.exCopy}
                </p>
                <span
                  style={cssStyle(
                    `align-self:flex-start;margin-top:6px;background:var(--mc-ink);color:var(--mc-paper);font-weight:600;font-size:14px;padding:12px 18px;border-radius:999px`,
                  )}
                >
                  {t.exDomain}
                  {" ↗"}
                </span>
              </div>
            </a>
          </section>
          <Footer
            title={"Chcete to aj na svojom webe?"}
            copy={
              "Popíšte, čo dnes zákazníkom vysvetľujete, počítate alebo vyberáte. Do 1 pracovného dňa sa ozveme s ďalším krokom."
            }
          />
        </div>
      </Fragment>
    );
  }
}
