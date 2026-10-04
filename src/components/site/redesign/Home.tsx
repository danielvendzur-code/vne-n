import { StudioHero } from "../StudioHero";
import { HomeFacts, HomeSolutions, InquiryComparison, HomeFAQ } from "./HomepageSections";
import React, { Component, Fragment } from "react";
import { cssStyle, sitePath } from "./utils";
import { Footer } from "./Footer";

export class Home extends Component<{
  active?: string;
  title?: string;
  copy?: string;
  tool?: string;
}> {
  state = { kov: 0 };

  renderVals() {
    const P = "/work/";
    const kovShots = [
      {
        label: "Bioklimatická pergola",
        img: P + "koverta/model-pergola.webp",
        fit: "contain",
      },
      { label: "Hliníkový carport", img: P + "koverta/model-carport.webp", fit: "contain" },
      { label: "Na mobile", img: P + "koverta/konfigurator-mobil.webp", fit: "contain" },
    ];
    const themes = [
      {
        bg: "#FFFFFF",
        fg: "#0E1512",
        muted: "#5C645F",
        line: "rgba(14,21,18,.12)",
        btnBg: "#0C1A15",
        btnFg: "#fff",
      },
      {
        bg: "#ECEAE3",
        fg: "#0E1512",
        muted: "#5C645F",
        line: "rgba(14,21,18,.14)",
        btnBg: "#0C1A15",
        btnFg: "#fff",
      },
      {
        bg: "#0C1A15",
        fg: "#FFFFFF",
        muted: "rgba(255,255,255,.7)",
        line: "rgba(255,255,255,.14)",
        btnBg: "#C9F26B",
        btnFg: "#0C1A15",
      },
      {
        bg: "#1F5B47",
        fg: "#FFFFFF",
        muted: "rgba(255,255,255,.78)",
        line: "rgba(255,255,255,.18)",
        btnBg: "#fff",
        btnFg: "#0C1A15",
      },
    ];
    const work = [
      {
        name: "Koverta",
        domain: "koverta.sk",
        href: "https://koverta.sk/",
        type: "Výroba na mieru · 3D konfigurátor",
        result:
          "Zákazník si prístrešok alebo pergolu poskladá v 3D a dopyt pošle aj s hotovou zostavou.",
        img: P + "live/koverta.webp",
        tools: ["3D konfigurátor", "Dopyt so zostavou"],
        case: true,
        caseHref: "/3d-konfigurator",
      },
      {
        name: "DERAT",
        domain: "derat.sk",
        href: "https://derat.sk/",
        type: "Služby · kalkulačka a dopytový asistent",
        result:
          "Kalkulačka prevedie návštevníka od problému k orientačnej cene a pripravenému dopytu.",
        img: P + "live/derat.webp",
        tools: ["Kalkulačka ceny", "Dopytový asistent"],
        case: true,
        caseHref: "/postup",
      },
      {
        name: "Môj Plot",
        domain: "mojplot.sk",
        href: "https://mojplot.sk/",
        type: "E-shop · chatbot a kalkulačka",
        result: "Chatbot poradí s výberom plotu a kalkulačka spočíta cenu podľa dĺžky a výšky.",
        img: P + "live/mojplot.webp",
        tools: ["Chatbot", "Kalkulačka plotu"],
        case: false,
      },
      {
        name: "WEBKO",
        domain: "webko.sk",
        href: "https://www.webko.sk/",
        type: "Prezentačný web · získavanie dopytov",
        result: "Sebavedomá prezentácia služby s jasným smerovaním ku kontaktu.",
        img: P + "live/webko.webp",
        tools: ["Prezentačný web", "Cesta ku kontaktu"],
        case: false,
      },
    ].map((w, i) => ({
      ...w,
      ...themes[i],
      num: "0" + (i + 1),
      top: 100 + i * 22 + "px",
    }));

    return {
      kovTabs: kovShots.map((k, i) => {
        const a = i === this.state.kov;
        return {
          ...k,
          bg: a ? "#fff" : "transparent",
          color: a ? "#0C1A15" : "rgba(255,255,255,.75)",
          pick: () => this.setState({ kov: i }),
        };
      }),
      kovShot: kovShots[this.state.kov],
      kovSteps: [
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
      work,
      steps: [
        {
          num: "01",
          title: "Ukážete nám web a ponuku",
          copy: "Zistíme, čo zákazníci najčastejšie hľadajú, riešia a pýtajú sa.",
          output: "Jasné zadanie",
        },
        {
          num: "02",
          title: "Navrhneme postup",
          copy: "Určíme, čo má zákazník vidieť, vybrať alebo vyplniť — a čo dostanete vy.",
          output: "Návrh logiky na schválenie",
        },
        {
          num: "03",
          title: "Postavíme a otestujeme",
          copy: "Dizajn, logika, ceny aj napojenia. Na počítači aj na mobile.",
          output: "Ukážka, ktorú si vyskúšate",
        },
        {
          num: "04",
          title: "Nasadíme na váš web",
          copy: "Bez prerábania celého webu. Overíme dopyty, formuláre aj bežné používanie.",
          output: "Spustené riešenie",
        },
      ],
    };
  }
  render() {
    const { kovShot, kovSteps, kovTabs, steps, work } = this.renderVals();
    return (
      <Fragment>
        <div
          style={cssStyle(
            `font-family:'Geist',system-ui,sans-serif;color:#0E1512;background:#F5F4EF`,
          )}
        >
          <StudioHero />
          <HomeFacts />
          <HomeSolutions />
          <InquiryComparison />
          <section id={"koverta"} style={cssStyle(`background:#0C1A15;color:#fff`)}>
            <div
              className="redesign-koverta-grid"
              style={cssStyle(
                `max-width:1280px;margin:0 auto;padding:88px 32px;box-sizing:border-box;display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.55fr);gap:48px;align-items:center`,
              )}
            >
              <div
                style={cssStyle(
                  `display:flex;flex-direction:column;gap:28px;padding-top:28px;border-top:1px solid rgba(255,255,255,.12)`,
                )}
              >
                <div
                  style={cssStyle(
                    `font-family:'Geist Mono',monospace;font-size:12px;letter-spacing:.08em;color:#C9F26B`,
                  )}
                >
                  {"03 / REALIZÁCIA · KOVERTA.SK"}
                </div>
                <h2
                  style={cssStyle(
                    `margin:0;font-size:clamp(36px,4vw,52px);line-height:1.04;letter-spacing:-.045em;font-weight:600`,
                  )}
                >
                  {"Prístrešok si zákazník poskladá v 3D."}
                </h2>
                <p
                  style={cssStyle(
                    `margin:0;font-size:17px;line-height:1.5;color:rgba(255,255,255,.72)`,
                  )}
                >
                  {
                    "Každá voľba sa hneď prepíše do 3D modelu aj do orientačnej ceny. Firma dostane dopyt, v ktorom už je všetko podstatné."
                  }
                </p>
                <div style={cssStyle(`display:flex;flex-direction:column`)}>
                  {kovSteps.map((s, index) => (
                    <Fragment key={index}>
                      <div
                        style={cssStyle(
                          `display:grid;grid-template-columns:40px minmax(0,1fr);gap:12px;padding:14px 0;border-top:1px solid rgba(255,255,255,.12)`,
                        )}
                      >
                        <span
                          style={cssStyle(
                            `font-family:'Geist Mono',monospace;font-size:12px;letter-spacing:.08em;color:#C9F26B;padding-top:4px`,
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
                <a
                  href={sitePath("https://koverta.sk/pages/konfigurator")}
                  target={"_blank"}
                  rel={"noreferrer"}
                  style={cssStyle(
                    `align-self:flex-start;color:#fff;font-size:15px;border-bottom:1px solid rgba(255,255,255,.4);padding-bottom:3px`,
                  )}
                >
                  {"Otvoriť na koverta.sk ↗"}
                </a>
              </div>
              <div
                style={cssStyle(
                  `display:flex;flex-direction:column;gap:14px;grid-column:span 1;min-width:0`,
                )}
              >
                <div
                  style={cssStyle(
                    `display:flex;gap:4px;background:rgba(255,255,255,.06);padding:5px;border-radius:999px;flex-wrap:nowrap;align-self:flex-start`,
                  )}
                >
                  {kovTabs.map((k, index) => (
                    <Fragment key={index}>
                      <button
                        onClick={k.pick}
                        style={cssStyle(
                          `all:unset;cursor:pointer;padding:10px 18px;border-radius:999px;font-size:14px;background:${k.bg};color:${k.color}`,
                        )}
                        type="button"
                      >
                        {k.label}
                      </button>
                    </Fragment>
                  ))}
                </div>
                <div
                  className="redesign-koverta-preview"
                  style={cssStyle(
                    `position:relative;border-radius:24px;overflow:hidden;height:clamp(300px,56vh,480px);background:#f4f4f2`,
                  )}
                >
                  <img
                    src={sitePath(kovShot.img)}
                    alt={kovShot.label}
                    style={cssStyle(
                      `width:100%;height:100%;object-fit:${kovShot.fit};display:block`,
                    )}
                    loading="lazy"
                  />
                  <a
                    href={sitePath(
                      "https://danielvendzur-code.github.io/koverta-web/konfigurator/",
                    )}
                    target={"_blank"}
                    rel={"noreferrer"}
                    className="redesign-action redesign-action--lime"
                    style={cssStyle(
                      `position:absolute;right:16px;bottom:16px;background:#C9F26B;color:#0C1A15;font-weight:600;font-size:14px;padding:12px 18px;border-radius:999px`,
                    )}
                  >
                    {"Spustiť živý konfigurátor ↗"}
                  </a>
                </div>
              </div>
            </div>
          </section>
          <section
            id={"realizacie"}
            style={cssStyle(
              `max-width:1280px;margin:0 auto;padding:88px 32px 64px;box-sizing:border-box;display:flex;flex-direction:column;gap:48px`,
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
                  {"04 / REALIZÁCIE"}
                </div>
                <h2
                  style={cssStyle(
                    `margin:16px 0 0;font-size:clamp(44px,5.5vw,68px);line-height:1.04;letter-spacing:-.045em;font-weight:600`,
                  )}
                >
                  {"Hotové projekty."}
                  <br />
                  {"Skutočné výsledky."}
                </h2>
              </div>
              <a
                href={sitePath("/projekty")}
                style={cssStyle(
                  `font-size:15px;padding:13px 20px;border:1px solid rgba(14,21,18,.2);border-radius:999px`,
                )}
                className="ref-hover-9"
              >
                {"Všetky realizácie →"}
              </a>
            </div>
            <ol
              style={cssStyle(
                `list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:32px`,
              )}
            >
              {work.map((w, index) => (
                <Fragment key={index}>
                  <li
                    className="redesign-case-item"
                    style={cssStyle(`position:sticky;top:${w.top}`)}
                  >
                    <article
                      className="redesign-case-card"
                      style={cssStyle(
                        `background:${w.bg};color:${w.fg};border:1px solid ${w.line};border-radius:28px;padding:20px;display:grid;grid-template-columns:minmax(0,1.1fr) minmax(0,1fr);gap:clamp(16px,3vw,32px);box-shadow:0 -24px 48px -32px rgba(12,26,21,.25);height:min(470px,calc(100vh - 190px));box-sizing:border-box;overflow:hidden`,
                      )}
                    >
                      <a
                        href={sitePath(w.href)}
                        target={"_blank"}
                        rel={"noreferrer"}
                        data-cursor={"Otvoriť web"}
                        className="redesign-case-shot"
                        style={cssStyle(
                          `border-radius:18px;overflow:hidden;border:1px solid ${w.line};background:#fff;align-self:stretch;display:flex;flex-direction:column`,
                        )}
                      >
                        <img
                          src={sitePath(w.img)}
                          alt={w.name}
                          style={cssStyle(
                            `width:100%;height:100%;object-fit:cover;object-position:top;display:block`,
                          )}
                          loading="lazy"
                        />
                      </a>
                      <div
                        style={cssStyle(
                          `display:flex;flex-direction:column;justify-content:space-between;gap:28px;padding:16px 16px 16px 0`,
                        )}
                      >
                        <div style={cssStyle(`display:flex;flex-direction:column;gap:16px`)}>
                          <div
                            style={cssStyle(
                              `font-family:'Geist Mono',monospace;font-size:12px;letter-spacing:.08em;color:${w.muted}`,
                            )}
                          >
                            {w.num}
                            {" / "}
                            {w.type}
                          </div>
                          <h3
                            style={cssStyle(
                              `margin:0;font-size:clamp(30px,3.8vw,48px);line-height:1.04;letter-spacing:-.045em;font-weight:600`,
                            )}
                          >
                            {w.name}
                          </h3>
                          <p
                            style={cssStyle(
                              `margin:0;font-size:clamp(15px,1.5vw,18px);line-height:1.5;color:${w.muted};text-wrap:pretty`,
                            )}
                          >
                            {w.result}
                          </p>
                        </div>
                        <div style={cssStyle(`display:flex;flex-direction:column;gap:20px`)}>
                          <div style={cssStyle(`display:flex;gap:8px;flex-wrap:wrap`)}>
                            {w.tools.map((tg, index) => (
                              <Fragment key={index}>
                                <span
                                  style={cssStyle(
                                    `border:1px solid ${w.line};padding:8px 14px;border-radius:999px;font-size:13px`,
                                  )}
                                >
                                  {tg}
                                </span>
                              </Fragment>
                            ))}
                          </div>
                          <div
                            style={cssStyle(
                              `display:flex;gap:16px;align-items:center;padding-top:20px;border-top:1px solid ${w.line}`,
                            )}
                          >
                            <a
                              className={`redesign-action ${w.btnBg === "#C9F26B" ? "redesign-action--lime" : w.btnBg === "#fff" ? "redesign-action--white" : ""}`}
                              href={sitePath(w.href)}
                              target={"_blank"}
                              rel={"noreferrer"}
                              style={cssStyle(
                                `background:${w.btnBg};color:${w.btnFg};font-weight:600;font-size:15px;padding:13px 20px;border-radius:999px`,
                              )}
                            >
                              {w.domain}
                              {" ↗"}
                            </a>
                            {w.case ? (
                              <Fragment>
                                <a
                                  href={sitePath(w.caseHref)}
                                  style={cssStyle(
                                    `font-size:15px;border-bottom:1px solid currentColor;padding-bottom:2px`,
                                  )}
                                >
                                  {"Ako to funguje →"}
                                </a>
                              </Fragment>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </article>
                  </li>
                </Fragment>
              ))}
            </ol>
          </section>
          <section id={"postup"} style={cssStyle(`background:#0C1A15;color:#fff`)}>
            <div
              style={cssStyle(
                `max-width:1280px;margin:0 auto;padding:88px 32px;box-sizing:border-box;display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,380px),1fr));gap:56px`,
              )}
            >
              <div
                style={cssStyle(
                  `display:flex;flex-direction:column;gap:20px;position:sticky;top:120px;align-self:start;padding-top:28px;border-top:1px solid rgba(255,255,255,.12)`,
                )}
              >
                <div
                  style={cssStyle(
                    `font-family:'Geist Mono',monospace;font-size:12px;letter-spacing:.08em;color:#C9F26B`,
                  )}
                >
                  {"05 / AKO TO PREBIEHA"}
                </div>
                <h2
                  style={cssStyle(
                    `margin:0;font-size:clamp(44px,5vw,60px);line-height:1.04;letter-spacing:-.045em;font-weight:600`,
                  )}
                >
                  {"Od prvého rozhovoru po spustenie na webe."}
                </h2>
                <p
                  style={cssStyle(
                    `margin:0;font-size:17px;line-height:1.5;color:rgba(255,255,255,.7)`,
                  )}
                >
                  {"Viete, čo sa deje v každom kroku. Ukážku si vyskúšate ešte pred nasadením."}
                </p>
                <a
                  className="redesign-action redesign-action--lime"
                  href={sitePath("/postup")}
                  style={cssStyle(
                    `align-self:flex-start;margin-top:12px;background:#C9F26B;color:#0C1A15;font-weight:600;font-size:15px;padding:14px 22px;border-radius:999px`,
                  )}
                >
                  {"Celý postup →"}
                </a>
              </div>
              <div style={cssStyle(`display:flex;flex-direction:column`)}>
                {steps.map((s, index) => (
                  <Fragment key={index}>
                    <div
                      style={cssStyle(
                        `display:grid;grid-template-columns:110px minmax(0,1fr);gap:24px;padding:32px 0;border-top:1px solid rgba(255,255,255,.12)`,
                      )}
                    >
                      <span
                        style={cssStyle(
                          `font-family:'Geist Mono',monospace;font-size:56px;font-weight:400;letter-spacing:-.04em;line-height:.9;color:#C9F26B`,
                        )}
                      >
                        {s.num}
                      </span>
                      <div style={cssStyle(`display:flex;flex-direction:column;gap:10px`)}>
                        <div
                          style={cssStyle(`font-size:26px;font-weight:600;letter-spacing:-.025em`)}
                        >
                          {s.title}
                        </div>
                        <div
                          style={cssStyle(
                            `font-size:16px;line-height:1.55;color:rgba(255,255,255,.7)`,
                          )}
                        >
                          {s.copy}
                        </div>
                        <div
                          style={cssStyle(
                            `display:flex;gap:12px;align-items:center;margin-top:6px;font-size:15px`,
                          )}
                        >
                          <span
                            style={cssStyle(
                              `font-family:'Geist Mono',monospace;font-size:11px;letter-spacing:.08em;color:#0C1A15;background:#C9F26B;padding:5px 9px;border-radius:999px`,
                            )}
                          >
                            {"VÝSTUP"}
                          </span>
                          {s.output}
                        </div>
                      </div>
                    </div>
                  </Fragment>
                ))}
              </div>
            </div>
          </section>
          <HomeFAQ />
          <Footer />
        </div>
      </Fragment>
    );
  }
}
