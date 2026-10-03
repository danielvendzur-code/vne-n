import React, { Component, Fragment } from "react";
import { cssStyle, sitePath } from "./utils";
import { Footer } from "./Footer";

export class Pricing extends Component<{
  active?: string;
  title?: string;
  copy?: string;
  tool?: string;
}> {
  renderVals() {
    return {
      plans: [
        {
          name: "Chatbot / produktový poradca",
          setup: "od 347 €",
          monthly: "od 10 € / mes.",
          copy: "Odpovedá na otázky, pomáha s výberom a posunie zákazníka na vhodný produkt alebo ďalší krok.",
          href: "/sluzby",
        },
        {
          name: "Kalkulačka",
          setup: "od 447 €",
          monthly: "od 10 € / mes.",
          copy: "Samostatný výpočet ceny, spotreby alebo rozsahu podľa vašich pravidiel. Chatbot nie je podmienkou.",
          href: "/sluzby",
        },
        {
          name: "Krokový konfigurátor",
          setup: "od 447 €",
          monthly: "od 10 € / mes.",
          copy: "Krokový výber produktu alebo služby s variantmi, rozmermi, farbami a doplnkami — bez 3D modelu.",
          href: "/sluzby",
        },
        {
          name: "3D konfigurátor",
          setup: "podľa rozsahu",
          monthly: "podľa riešenia",
          copy: "Interaktívny 3D model s rozmermi, farbami, variantmi, doplnkami a produktovou logikou.",
          href: "/3d-konfigurator",
        },
      ].map((p, i) => ({ ...p, num: "0" + (i + 1) })),
      combos: [
        {
          left: "Chatbot",
          right: "Kalkulačka",
          copy: "Zákazník sa najprv opýta a potom si cenu vypočíta v jednom rozhraní.",
        },
        {
          left: "Chatbot",
          right: "Konfigurátor",
          copy: "Chatbot vysvetlí možnosti a konfigurátor prevedie presným výberom.",
        },
        {
          left: "Poradca",
          right: "Konfigurátor",
          copy: "Poradca odporučí smer, zákazník si vyskladá konkrétny variant.",
        },
        {
          left: "Všetko",
          right: "spolu",
          copy: "Všetky štyri nástroje v jednom. Cenu povieme podľa rozsahu vopred.",
        },
      ],
      notes: [
        {
          label: "V CENE VYTVORENIA",
          copy: "Návrh otázok a krokov, vizuálne prispôsobenie, implementácia do dohodnutého rozsahu a nasadenie na web.",
        },
        {
          label: "MESAČNE",
          copy: "Prevádzka riešenia a bežná technická údržba podľa aktuálne dohodnutých podmienok.",
        },
        {
          label: "AK TREBA NIEČO NAVYŠE",
          copy: "3D modely, väčšie integrácie, nové vetvy alebo rozšírenia naceníme samostatne ešte pred začiatkom práce.",
        },
      ],
    };
  }
  render() {
    const { notes, plans } = this.renderVals();
    return (
      <Fragment>
        <div
          style={cssStyle(
            `font-family:'Geist',system-ui,sans-serif;color:#0E1512;background:#F5F4EF`,
          )}
        >
          <div style={cssStyle(`position:sticky;top:0;z-index:50`)}></div>
          <section
            style={cssStyle(
              `max-width:1280px;margin:0 auto;padding:64px 32px 48px;box-sizing:border-box`,
            )}
          >
            <div
              style={cssStyle(
                `font-family:'Geist Mono',monospace;font-size:12px;letter-spacing:.08em;color:#5C645F;padding-bottom:20px;border-bottom:1px solid rgba(14,21,18,.12)`,
              )}
            >
              <a href={sitePath("/")}>{"DOMOV"}</a>
              {" / CENNÍK"}
            </div>
            <div
              style={cssStyle(
                `display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,440px),1fr));gap:24px 56px;align-items:end;padding-top:48px`,
              )}
            >
              <h1
                style={cssStyle(
                  `margin:0;font-size:clamp(52px,7.5vw,100px);line-height:.92;letter-spacing:-.055em;font-weight:600`,
                )}
              >
                {"Jasná cena."}
                <br />
                <span style={cssStyle(`color:#1F5B47`)}>{"Jasný rozsah."}</span>
              </h1>
              <p
                style={cssStyle(
                  `margin:0;font-size:18px;line-height:1.5;color:#5C645F;text-wrap:pretty`,
                )}
              >
                {
                  "Každý nástroj môže fungovať samostatne. Ak dáva zmysel kombinácia, spojíme ich do jedného riešenia."
                }
              </p>
            </div>
          </section>
          <section
            style={cssStyle(
              `max-width:1280px;margin:0 auto;padding:0 32px 88px;box-sizing:border-box;display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:12px`,
            )}
          >
            <div
              style={cssStyle(
                `background:#fff;border:1px solid rgba(14,21,18,.12);border-radius:24px;padding:28px;display:flex;flex-direction:column;gap:20px`,
              )}
            >
              <div
                style={cssStyle(
                  `font-family:'Geist Mono',monospace;font-size:12px;letter-spacing:.08em;color:#5C645F`,
                )}
              >
                {"01 / CHATBOT · PORADCA"}
              </div>
              <div>
                <span style={cssStyle(`font-size:15px;color:#5C645F`)}>{"od "}</span>
                <span
                  style={cssStyle(
                    `font-size:56px;font-weight:600;letter-spacing:-.05em;font-variant-numeric:tabular-nums`,
                  )}
                >
                  {"347 €"}
                </span>
              </div>
              <div style={cssStyle(`font-size:14px;color:#5C645F`)}>{"vytvorenie"}</div>
            </div>
            <div
              style={cssStyle(
                `background:#fff;border:1px solid rgba(14,21,18,.12);border-radius:24px;padding:28px;display:flex;flex-direction:column;gap:20px`,
              )}
            >
              <div
                style={cssStyle(
                  `font-family:'Geist Mono',monospace;font-size:12px;letter-spacing:.08em;color:#5C645F`,
                )}
              >
                {"02 / KALKULAČKA · KROKOVÝ VÝBER"}
              </div>
              <div>
                <span style={cssStyle(`font-size:15px;color:#5C645F`)}>{"od "}</span>
                <span
                  style={cssStyle(
                    `font-size:56px;font-weight:600;letter-spacing:-.05em;font-variant-numeric:tabular-nums`,
                  )}
                >
                  {"447 €"}
                </span>
              </div>
              <div style={cssStyle(`font-size:14px;color:#5C645F`)}>{"vytvorenie"}</div>
            </div>
            <div
              style={cssStyle(
                `background:#C9F26B;border-radius:24px;padding:28px;display:flex;flex-direction:column;gap:20px`,
              )}
            >
              <div
                style={cssStyle(
                  `font-family:'Geist Mono',monospace;font-size:12px;letter-spacing:.08em`,
                )}
              >
                {"03 / TECHNICKÁ PREVÁDZKA"}
              </div>
              <div>
                <span style={cssStyle(`font-size:15px`)}>{"od "}</span>
                <span
                  style={cssStyle(
                    `font-size:56px;font-weight:600;letter-spacing:-.05em;font-variant-numeric:tabular-nums`,
                  )}
                >
                  {"10 €"}
                </span>
              </div>
              <div style={cssStyle(`font-size:14px`)}>{"mesačne pri štandardných riešeniach"}</div>
            </div>
          </section>
          <section
            style={cssStyle(
              `background:#fff;border-top:1px solid rgba(14,21,18,.12);border-bottom:1px solid rgba(14,21,18,.12)`,
            )}
          >
            <div
              style={cssStyle(
                `max-width:1280px;margin:0 auto;padding:88px 32px;box-sizing:border-box;display:flex;flex-direction:column;gap:40px`,
              )}
            >
              <div
                style={cssStyle(
                  `display:flex;justify-content:space-between;align-items:end;gap:24px 32px;flex-wrap:wrap;padding-top:28px;border-top:1px solid rgba(14,21,18,.12)`,
                )}
              >
                <div>
                  <div
                    style={cssStyle(
                      `font-family:'Geist Mono',monospace;font-size:12px;letter-spacing:.08em;color:#5C645F`,
                    )}
                  >
                    {"CELÝ CENNÍK"}
                  </div>
                  <h2
                    style={cssStyle(
                      `margin:16px 0 0;font-size:clamp(36px,4.5vw,56px);line-height:1.04;letter-spacing:-.045em;font-weight:600`,
                    )}
                  >
                    {"Najprv typ riešenia."}
                    <br />
                    {"Potom presný rozsah."}
                  </h2>
                </div>
                <p
                  style={cssStyle(
                    `margin:0;font-size:17px;line-height:1.5;color:#5C645F;max-width:440px`,
                  )}
                >
                  {
                    "Pri 3D konfigurátore cenu neurčujeme jedným číslom — závisí od modelu, možností, pravidiel a napojení."
                  }
                </p>
              </div>
              <div
                style={cssStyle(
                  `display:flex;flex-direction:column;border-top:1px solid rgba(14,21,18,.12)`,
                )}
              >
                {plans.map((p, index) => (
                  <Fragment key={index}>
                    <a
                      href={sitePath(p.href)}
                      style={cssStyle(
                        `display:grid;grid-template-columns:52px minmax(0,1.6fr) minmax(0,.7fr) minmax(0,.7fr) 44px;gap:24px;align-items:center;padding:26px 12px;border-bottom:1px solid rgba(14,21,18,.12);border-radius:4px`,
                      )}
                      className="ref-hover-17"
                    >
                      <span
                        style={cssStyle(
                          `font-family:'Geist Mono',monospace;font-size:12px;letter-spacing:.08em;color:#5C645F`,
                        )}
                      >
                        {p.num}
                      </span>
                      <span style={cssStyle(`display:flex;flex-direction:column;gap:6px`)}>
                        <span
                          style={cssStyle(`font-size:24px;font-weight:600;letter-spacing:-.025em`)}
                        >
                          {p.name}
                        </span>
                        <span style={cssStyle(`font-size:15px;color:#5C645F;line-height:1.5`)}>
                          {p.copy}
                        </span>
                      </span>
                      <span style={cssStyle(`display:flex;flex-direction:column;gap:4px`)}>
                        <span
                          style={cssStyle(
                            `font-family:'Geist Mono',monospace;font-size:11px;letter-spacing:.08em;color:#5C645F`,
                          )}
                        >
                          {"VYTVORENIE"}
                        </span>
                        <span
                          style={cssStyle(
                            `font-size:20px;font-weight:600;font-variant-numeric:tabular-nums`,
                          )}
                        >
                          {p.setup}
                        </span>
                      </span>
                      <span style={cssStyle(`display:flex;flex-direction:column;gap:4px`)}>
                        <span
                          style={cssStyle(
                            `font-family:'Geist Mono',monospace;font-size:11px;letter-spacing:.08em;color:#5C645F`,
                          )}
                        >
                          {"PREVÁDZKA"}
                        </span>
                        <span style={cssStyle(`font-size:16px;font-variant-numeric:tabular-nums`)}>
                          {p.monthly}
                        </span>
                      </span>
                      <span
                        style={cssStyle(
                          `width:44px;height:44px;border-radius:50%;border:1px solid rgba(14,21,18,.2);display:flex;align-items:center;justify-content:center`,
                        )}
                      >
                        {"↗"}
                      </span>
                    </a>
                  </Fragment>
                ))}
              </div>
            </div>
          </section>
          <section
            style={cssStyle(
              `max-width:1280px;margin:0 auto;padding:88px 32px;box-sizing:border-box;display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:12px`,
            )}
          >
            {notes.map((n, index) => (
              <Fragment key={index}>
                <div
                  style={cssStyle(
                    `background:#fff;border:1px solid rgba(14,21,18,.12);border-radius:24px;padding:28px;display:flex;flex-direction:column;gap:14px`,
                  )}
                >
                  <div
                    style={cssStyle(
                      `font-family:'Geist Mono',monospace;font-size:12px;letter-spacing:.08em;color:#5C645F`,
                    )}
                  >
                    {n.label}
                  </div>
                  <p style={cssStyle(`margin:0;font-size:16px;line-height:1.55`)}>{n.copy}</p>
                </div>
              </Fragment>
            ))}
          </section>
          <Footer
            title={"Stačí nám povedať, čo má web robiť."}
            copy={
              "Krátko popíšte, čo má zákazník na webe zvládnuť. Povieme vám, či stačí jeden nástroj alebo dáva zmysel kombinácia a koľko bude stáť."
            }
          />
        </div>
      </Fragment>
    );
  }
}
