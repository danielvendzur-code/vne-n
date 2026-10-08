import React, { Component, Fragment } from "react";
import { cssStyle, sitePath } from "./utils";
import { PergolaDemo } from "./PergolaDemo";
import { Footer } from "./Footer";

export class Configurator extends Component<{
  active?: string;
  title?: string;
  copy?: string;
  tool?: string;
}> {
  componentDidMount() {
    if (document.documentElement.dataset.solutionOpening === "true")
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }
  renderVals() {
    return {
      steps: [
        {
          num: "01",
          title: "Vyberie typ a umiestnenie",
          copy: "Samostatne, pri stene alebo v rohu.",
        },
        {
          num: "02",
          title: "Nastaví rozmer, farbu a strechu",
          copy: "Model aj cena sa menia okamžite.",
        },
        {
          num: "03",
          title: "Pošle dopyt so zostavou",
          copy: "Bez prepisovania rozmerov do e-mailu.",
        },
      ],
      faqs: [
        [
          "Platí sa mesačne za prevádzku?",
          "Nie. Samostatný 3D konfigurátor nemá mesačný poplatok za prevádzku. Vytvorenie a prípadné rozšírenia sa nacenia vopred podľa rozsahu.",
        ],
        [
          "Koľko stojí 3D konfigurátor?",
          "Cena 3D konfigurátora sa určuje podľa rozsahu. Ovplyvní ju počet produktov a modelov, množstvo variantov a pravidlá výpočtu ceny. Presnú sumu vrátane DPH dostanete pred začiatkom práce.",
        ],
        [
          "Potrebujeme vlastné 3D modely?",
          "Nie je to podmienka. Modely vieme pripraviť podľa výkresov, fotografií a rozmerov vašich produktov. Ak 3D podklady máte, použijeme ich.",
        ],
        [
          "Dá sa konfigurátor vložiť do existujúceho webu alebo e-shopu?",
          "Áno. Konfigurátor Koverta beží na e-shope postavenom na Shopify. Pri inom systéme najprv overíme, ako ho vložiť a kam budú chodiť dopyty.",
        ],
        [
          "Funguje 3D konfigurátor aj na mobile?",
          "Áno. Ovládanie je prispôsobené dotyku, model sa dá otáčať prstom a priblížiť dvoma prstami.",
        ],
        [
          "Čo presne príde firme v dopyte?",
          "Kontakt zákazníka a celá zostava — typ, rozmer, umiestnenie, farba, strecha, výplne a vypočítaná cena.",
        ],
      ].map(([q, a], i) => ({ q, a, num: "0" + (i + 1) })),
    };
  }
  render() {
    const { faqs, steps } = this.renderVals();
    return (
      <Fragment>
        <div
          style={cssStyle(
            `font-family:'Geist',system-ui,sans-serif;color:var(--mc-ink);background:var(--mc-page)`,
          )}
        >
          <div style={cssStyle(`position:sticky;top:0;z-index:50`)}></div>
          <section
            className="solution-detail solution-detail--3d"
            style={cssStyle(
              `max-width:1280px;margin:0 auto;padding:64px 32px 48px;box-sizing:border-box`,
            )}
          >
            <div
              style={cssStyle(
                `font-family:'Geist Mono',monospace;font-size:12px;letter-spacing:.08em;color:var(--mc-muted);padding-bottom:20px;border-bottom:1px solid rgba(14,21,18,.12)`,
              )}
            >
              <a href={sitePath("/")}>{"DOMOV"}</a>
              {" / "}
              <a href={sitePath("/sluzby")}>{"RIEŠENIA"}</a>
              {" / 3D KONFIGURÁTOR"}
            </div>
            <div
              style={cssStyle(
                `display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,440px),1fr));gap:24px 56px;align-items:end;padding-top:48px`,
              )}
            >
              <h1
                style={cssStyle(
                  `margin:0;font-size:clamp(52px,7vw,92px);line-height:.92;letter-spacing:-.055em;font-weight:600`,
                )}
              >
                {"3D konfigurátor"}
                <br />
                <span style={cssStyle(`color:var(--mc-brand)`)}>{"na váš web."}</span>
              </h1>
              <div style={cssStyle(`display:flex;flex-direction:column;gap:22px`)}>
                <p
                  style={cssStyle(`margin:0;font-size:18px;line-height:1.5;color:var(--mc-muted)`)}
                >
                  {
                    "Produkt si zákazník poskladá v 3D, cena sa prepočíta hneď a vy dostanete dopyt s celou zostavou."
                  }
                </p>
                <div style={cssStyle(`display:flex;gap:16px;align-items:center;flex-wrap:wrap`)}>
                  <a
                    href="#" onClick={(e) => { e.preventDefault(); window.dispatchEvent(new CustomEvent("site-assistant:open", { detail: { entry:"builder", preset:"product" } })); }}
                    style={cssStyle(
                      `background:var(--mc-ink);color:var(--mc-paper);font-weight:600;font-size:15px;padding:15px 24px;border-radius:999px`,
                    )}
                  >
                    {"Chcem podobný konfigurátor →"}
                  </a>
                  <span style={cssStyle(`font-size:15px;color:var(--mc-muted)`)}>
                    <strong style={cssStyle(`color:var(--mc-ink)`)}>{"podľa rozsahu"}</strong>
                  </span>
                </div>
              </div>
            </div>
          </section>
          <section
            className="redesign-koverta-section"
            style={cssStyle(`background:var(--mc-ink);color:var(--mc-paper)`)}
          >
            <div
              className="redesign-koverta-grid"
              style={cssStyle(
                `max-width:1280px;margin:0 auto;padding:72px 32px;box-sizing:border-box;display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.55fr);gap:48px;align-items:center`,
              )}
            >
              <div style={cssStyle(`display:flex;flex-direction:column;gap:24px`)}>
                <div
                  style={cssStyle(
                    `font-family:'Geist Mono',monospace;font-size:12px;letter-spacing:.08em;color:var(--mc-accent)`,
                  )}
                >
                  {"ŽIVÁ REALIZÁCIA · KOVERTA"}
                </div>
                <h2
                  style={cssStyle(
                    `margin:0;font-size:clamp(32px,3.6vw,46px);line-height:1.04;letter-spacing:-.045em;font-weight:600`,
                  )}
                >
                  {"Vyskúšajte si ho priamo tu."}
                </h2>
                <div style={cssStyle(`display:flex;flex-direction:column`)}>
                  {steps.map((s, index) => (
                    <Fragment key={index}>
                      <div
                        style={cssStyle(
                          `display:grid;grid-template-columns:40px minmax(0,1fr);gap:12px;padding:14px 0;border-top:1px solid rgba(255,255,255,.12)`,
                        )}
                      >
                        <span
                          style={cssStyle(
                            `font-family:'Geist Mono',monospace;font-size:12px;letter-spacing:.08em;color:var(--mc-accent);padding-top:4px`,
                          )}
                        >
                          {s.num}
                        </span>
                        <div>
                          <div style={cssStyle(`font-size:17px;font-weight:600`)}>{s.title}</div>
                          <div
                            style={cssStyle(
                              `font-size:14px;color:rgba(255,255,255,.65);margin-top:2px`,
                            )}
                          >
                            {s.copy}
                          </div>
                        </div>
                      </div>
                    </Fragment>
                  ))}
                </div>
              </div>
              <div style={cssStyle(`display:flex;flex-direction:column;gap:14px;min-width:0`)}>
                <PergolaDemo />
                <a
                  className="mc-btn"
                  href="https://koverta.sk/pages/konfigurator"
                  target="_blank"
                  rel="noreferrer"
                >
                  Celý konfigurátor Koverta ↗
                </a>
              </div>
            </div>
          </section>
          <section
            style={cssStyle(
              `max-width:1280px;margin:0 auto;padding:88px 32px;box-sizing:border-box;display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,360px),1fr));gap:48px`,
            )}
          >
            <div
              style={cssStyle(
                `position:sticky;top:110px;align-self:start;background:var(--mc-ink);color:var(--mc-paper);border-radius:28px;padding:32px;display:flex;flex-direction:column;gap:20px`,
              )}
            >
              <div
                style={cssStyle(
                  `font-family:'Geist Mono',monospace;font-size:12px;letter-spacing:.08em;color:var(--mc-accent)`,
                )}
              >
                {"ČASTÉ OTÁZKY"}
              </div>
              <h2
                style={cssStyle(
                  `margin:0;font-size:clamp(32px,3.6vw,44px);line-height:1.04;letter-spacing:-.045em;font-weight:600`,
                )}
              >
                {"Dobré vedieť pred začiatkom."}
              </h2>
              <p
                style={cssStyle(
                  `margin:0;font-size:16px;line-height:1.55;color:rgba(255,255,255,.72)`,
                )}
              >
                {
                  "Máte vlastné produkty, rozmery alebo výkresy? Pošlite ich a povieme vám, čo sa dá spraviť v 3D."
                }
              </p>
              <div
                style={cssStyle(
                  `display:flex;align-items:center;gap:12px;padding:14px;border-radius:18px;background:rgba(255,255,255,.06)`,
                )}
              >
                <span
                  style={cssStyle(
                    `width:44px;height:44px;border-radius:50%;background:var(--mc-accent);color:var(--mc-ink);display:flex;align-items:center;justify-content:center;font-weight:600;font-size:15px`,
                  )}
                >
                  {"DV"}
                </span>
                <span style={cssStyle(`display:flex;flex-direction:column;gap:2px`)}>
                  <strong style={cssStyle(`font-size:15px;font-weight:600`)}>
                    {"Daniel Vendžúr"}
                  </strong>
                  <span style={cssStyle(`font-size:13px;color:rgba(255,255,255,.65)`)}>
                    {"zakladateľ a produktový dizajnér"}
                  </span>
                </span>
              </div>
              <div style={cssStyle(`display:flex;gap:8px;flex-wrap:wrap`)}>
                <a
                  href={sitePath("mailto:info@mojchatbot.sk")}
                  style={cssStyle(
                    `background:var(--mc-accent);color:var(--mc-ink);font-weight:600;font-size:14px;padding:12px 18px;border-radius:999px`,
                  )}
                >
                  {"Napísať otázku →"}
                </a>
                <a
                  href={sitePath("tel:+421948699433")}
                  style={cssStyle(
                    `color:var(--mc-paper);font-size:14px;padding:12px 18px;border-radius:999px;border:1px solid rgba(255,255,255,.25);font-family:'Geist Mono',monospace`,
                  )}
                >
                  {"+421 948 699 433"}
                </a>
              </div>
            </div>
            <div style={cssStyle(`display:flex;flex-direction:column;gap:10px`)}>
              {faqs.map((q, index) => (
                <Fragment key={index}>
                  <details
                    style={cssStyle(
                      `background:var(--mc-paper);border:1px solid rgba(14,21,18,.14);border-radius:18px`,
                    )}
                    className="ref-hover-14"
                  >
                    <summary
                      style={cssStyle(
                        `cursor:pointer;list-style:none;display:grid;grid-template-columns:44px minmax(0,1fr) 40px;gap:12px;align-items:center;padding:20px 20px 20px 24px;font-size:18px;font-weight:600`,
                      )}
                    >
                      <span
                        style={cssStyle(
                          `font-family:'Geist Mono',monospace;font-size:12px;letter-spacing:.08em;color:var(--mc-muted);font-weight:400`,
                        )}
                      >
                        {q.num}
                      </span>
                      {q.q}
                      <span
                        style={cssStyle(
                          `width:40px;height:40px;border-radius:50%;background:var(--mc-ink);color:var(--mc-accent);display:flex;align-items:center;justify-content:center;font-weight:400;font-size:20px`,
                        )}
                      >
                        {"+"}
                      </span>
                    </summary>
                    <p
                      style={cssStyle(
                        `margin:0;padding:0 24px 24px 80px;font-size:16px;line-height:1.6;color:#3F4743`,
                      )}
                    >
                      {q.a}
                    </p>
                  </details>
                </Fragment>
              ))}
            </div>
          </section>
          <Footer
            title={"Chcete podobný konfigurátor?"}
            copy={
              "Pošlite nám produkty, rozmery a pravidlá. Povieme vám rozsah aj cenu ešte pred začiatkom."
            }
          />
        </div>
      </Fragment>
    );
  }
}
