import { StudioHero } from "../StudioHero";
import { HomeFacts, HomeSolutions, InquiryComparison, HomeFAQ } from "./HomepageSections";
import React, { Component, Fragment } from "react";
import { cssStyle, sitePath } from "./utils";
import { Footer } from "./Footer";
import { ProjectGallery } from "./ProjectGallery";

export class Home extends Component<{
  active?: string;
  title?: string;
  copy?: string;
  tool?: string;
}> {
  renderVals() {
    const P = "/work/";
    const themes = [
      {
        bg: "var(--mc-paper)",
        fg: "var(--mc-ink)",
        muted: "var(--mc-muted)",
        line: "rgba(14,21,18,.12)",
        btnBg: "var(--mc-ink)",
        btnFg: "var(--mc-paper)",
      },
      {
        bg: "var(--mc-page)",
        fg: "var(--mc-ink)",
        muted: "var(--mc-muted)",
        line: "rgba(14,21,18,.14)",
        btnBg: "var(--mc-ink)",
        btnFg: "var(--mc-paper)",
      },
      {
        bg: "var(--mc-ink)",
        fg: "var(--mc-paper)",
        muted: "rgba(255,255,255,.7)",
        line: "rgba(255,255,255,.14)",
        btnBg: "var(--mc-accent)",
        btnFg: "var(--mc-ink)",
      },
      {
        bg: "var(--mc-brand)",
        fg: "var(--mc-paper)",
        muted: "rgba(255,255,255,.78)",
        line: "rgba(255,255,255,.18)",
        btnBg: "var(--mc-paper)",
        btnFg: "var(--mc-ink)",
      },
    ];
    const work = [
      {
        name: "Koverta · konfigurátor",
        domain: "koverta.sk",
        href: "https://koverta.sk/pages/konfigurator",
        type: "Výroba na mieru · 3D konfigurátor",
        result:
          "Zákazník si prístrešok alebo pergolu poskladá v 3D a dopyt pošle aj s hotovou zostavou.",
        img: P + "koverta/konfigurator-carport.webp",
        tools: ["3D konfigurátor", "Dopyt so zostavou"],
        case: true,
        caseHref: "/3d-konfigurator",
      },
      {
        name: "Koverta · chatbot",
        domain: "koverta.sk",
        href: "https://koverta.sk/",
        type: "Výroba na mieru · chatbot",
        result: "Asistent odpovie na otázky k prístreškom a pergolám a pomôže pripraviť dopyt.",
        img: P + "live/koverta-chat.webp",
        tools: ["Chatbot", "Produktové poradenstvo"],
        case: false,
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
        img: P + "live/mojplot-chat.webp",
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
    ]
      .sort(
        (a, b) =>
          ["Koverta · konfigurátor", "DERAT", "Môj Plot", "Koverta · chatbot", "WEBKO"].indexOf(
            a.name,
          ) -
          ["Koverta · konfigurátor", "DERAT", "Môj Plot", "Koverta · chatbot", "WEBKO"].indexOf(
            b.name,
          ),
      )
      .map((w, i) => ({
        ...w,
        ...themes[i % themes.length],
        num: "0" + (i + 1),
        top: 100 + i * 22 + "px",
      }));

    return {
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
    const { steps, work } = this.renderVals();
    return (
      <Fragment>
        <div
          style={cssStyle(
            `font-family:'Geist',system-ui,sans-serif;color:var(--mc-ink);background:var(--mc-page)`,
          )}
        >
          <StudioHero />
          <HomeFacts />
          <HomeSolutions />
          <InquiryComparison />
          <section
            id={"koverta"}
            style={cssStyle(`background:var(--mc-ink);color:var(--mc-paper)`)}
          >
            <ProjectGallery />
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
                    `font-family:'Geist Mono',monospace;font-size:12px;letter-spacing:.08em;color:var(--mc-muted)`,
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
                      data-reveal
                      style={cssStyle(
                        `background:${w.bg};color:${w.fg};border:1px solid ${w.line};border-radius:28px;padding:20px;display:grid;grid-template-columns:minmax(0,1.1fr) minmax(0,1fr);gap:clamp(16px,3vw,32px);box-shadow:0 -24px 48px -32px rgba(12,26,21,.25);height:min(470px,calc(100vh - 190px));box-sizing:border-box;overflow:hidden`,
                      )}
                    >
                      <a
                        href={sitePath(w.href)}
                        target={"_blank"}
                        rel={"noreferrer"}
                        className="redesign-case-shot"
                        style={cssStyle(
                          `border-radius:18px;overflow:hidden;border:1px solid ${w.line};background:var(--mc-paper);align-self:stretch;display:flex;flex-direction:column`,
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
                              className={`redesign-action ${w.btnBg === "var(--mc-accent)" ? "redesign-action--lime" : w.btnBg === "var(--mc-paper)" ? "redesign-action--white" : ""}`}
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
          <section id={"postup"} style={cssStyle(`background:var(--mc-ink);color:var(--mc-paper)`)}>
            <div
              className="redesign-process-grid"
              style={cssStyle(
                `max-width:1280px;margin:0 auto;padding:88px 32px;box-sizing:border-box;display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,380px),1fr));gap:56px`,
              )}
            >
              <div
                className="redesign-process-intro"
                style={cssStyle(
                  `display:flex;flex-direction:column;gap:20px;position:sticky;top:120px;align-self:start;padding-top:28px;border-top:1px solid rgba(255,255,255,.12)`,
                )}
              >
                <div
                  style={cssStyle(
                    `font-family:'Geist Mono',monospace;font-size:12px;letter-spacing:.08em;color:var(--mc-accent)`,
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
                    `align-self:flex-start;margin-top:12px;background:var(--mc-accent);color:var(--mc-ink);font-weight:600;font-size:15px;padding:14px 22px;border-radius:999px`,
                  )}
                >
                  {"Celý postup →"}
                </a>
              </div>
              <div
                className="redesign-process-steps"
                style={cssStyle(`display:flex;flex-direction:column`)}
              >
                {steps.map((s, index) => (
                  <Fragment key={index}>
                    <div
                      data-reveal
                      style={cssStyle(
                        `display:grid;grid-template-columns:110px minmax(0,1fr);gap:24px;padding:32px 0;border-top:1px solid rgba(255,255,255,.12)`,
                      )}
                    >
                      <span
                        style={cssStyle(
                          `font-family:'Geist Mono',monospace;font-size:56px;font-weight:400;letter-spacing:-.04em;line-height:.9;color:var(--mc-accent)`,
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
                              `font-family:'Geist Mono',monospace;font-size:11px;letter-spacing:.08em;color:var(--mc-ink);background:var(--mc-accent);padding:5px 9px;border-radius:999px`,
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
