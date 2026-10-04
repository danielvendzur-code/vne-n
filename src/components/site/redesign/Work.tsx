import React, { Component, Fragment } from "react";
import { cssStyle, sitePath } from "./utils";
import { Footer } from "./Footer";

export class Work extends Component<{
  active?: string;
  title?: string;
  copy?: string;
  tool?: string;
}> {
  renderVals() {
    const P = "/work/live/";
    return {
      work: [
        {
          name: "Koverta",
          domain: "koverta.sk",
          href: "https://koverta.sk/",
          type: "Výroba na mieru · 3D konfigurátor",
          detail:
            "Web výrobcu prístreškov a pergol s 3D konfigurátorom. Zákazník vyberie typ, umiestnenie, rozmer, farbu, strechu a výplne, vidí model aj orientačnú cenu a firma dostane dopyt so všetkými údajmi.",
          img: P + "koverta.webp",
          tools: ["3D konfigurátor", "Dopyt so zostavou"],
          caseHref: "/3d-konfigurator",
        },
        {
          name: "DERAT",
          domain: "derat.sk",
          href: "https://derat.sk/",
          type: "Služby · kalkulačka a dopytový asistent",
          detail:
            "Reálne nasadená deratizačná služba. Návštevník vyberie typ problému a rozsah zásahu, dostane orientačný výsledok a firma prijme kontakt spolu s kontextom potrebným na ďalší krok.",
          img: P + "derat.webp",
          tools: ["Kalkulačka ceny", "Dopytový asistent"],
          caseHref: "/postup",
        },
        {
          name: "Môj Plot",
          domain: "mojplot.sk",
          href: "https://mojplot.sk/",
          type: "E-shop · chatbot a kalkulačka",
          detail:
            "E-shop s plotmi, kde chatbot odpovedá na otázky k typom oplotenia a kalkulačka z dĺžky, výšky a doplnkov spočíta orientačnú cenu. Zákazník sa dostane k objednávke bez telefonovania.",
          img: P + "mojplot.webp",
          tools: ["Chatbot", "Kalkulačka plotu"],
          caseHref: "",
        },
        {
          name: "WEBKO",
          domain: "webko.sk",
          href: "https://www.webko.sk/",
          type: "Prezentačný web · získavanie dopytov",
          detail:
            "Tmavý prezentačný web, ktorý stavia na ukážkach práce. Každá sekcia končí jasným ďalším krokom, takže návštevník nemusí hľadať, kde sa ozvať.",
          img: P + "webko.webp",
          tools: ["Prezentačný web", "Cesta ku kontaktu"],
          caseHref: "",
        },
      ].map((w, i) => ({ ...w, num: "0" + (i + 1) })),
      live: [
        {
          num: "01",
          name: "APLAN AI",
          note: "Asistent pre plánovanie",
          href: "https://danielvendzur-code.github.io/aplan-chatbot-backend/",
        },
        {
          num: "02",
          name: "Môj Chatbot",
          note: "Chatbot, ktorý beží na tomto webe",
          href: "https://danielvendzur-code.github.io/moj.chatbot.backend/",
        },
      ],
    };
  }
  render() {
    const { live, work } = this.renderVals();
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
              `max-width:1280px;margin:0 auto;padding:64px 32px 40px;box-sizing:border-box`,
            )}
          >
            <div
              style={cssStyle(
                `font-family:'Geist Mono',monospace;font-size:12px;letter-spacing:.08em;color:#5C645F;padding-bottom:20px;border-bottom:1px solid rgba(14,21,18,.12)`,
              )}
            >
              <a href={sitePath("/")}>{"DOMOV"}</a>
              {" / REALIZÁCIE"}
            </div>
            <div
              style={cssStyle(
                `display:flex;justify-content:space-between;align-items:end;gap:24px 40px;flex-wrap:wrap;padding-top:48px`,
              )}
            >
              <h1
                style={cssStyle(
                  `margin:0;font-size:clamp(56px,8vw,104px);line-height:.92;letter-spacing:-.055em;font-weight:600`,
                )}
              >
                {"Realizácie."}
              </h1>
              <p
                style={cssStyle(
                  `margin:0;font-size:18px;line-height:1.5;color:#5C645F;max-width:420px`,
                )}
              >
                {"Len to, čo naozaj beží na vlastnej doméne. Každý web si môžete otvoriť a overiť."}
              </p>
            </div>
          </section>
          <section
            style={cssStyle(
              `max-width:1280px;margin:0 auto;padding:0 32px 88px;box-sizing:border-box;display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,460px),1fr));gap:16px`,
            )}
          >
            {work.map((w, index) => (
              <Fragment key={index}>
                <article
                  style={cssStyle(
                    `background:#fff;border:1px solid rgba(14,21,18,.12);border-radius:24px;overflow:hidden;display:flex;flex-direction:column`,
                  )}
                  className="ref-hover-15"
                >
                  <a
                    href={sitePath(w.href)}
                    target={"_blank"}
                    rel={"noreferrer"}
                    data-cursor={"Otvoriť web"}
                    style={cssStyle(`display:block`)}
                  >
                    <img
                      src={sitePath(w.img)}
                      alt={w.name}
                      style={cssStyle(
                        `width:100%;aspect-ratio:16/10;object-fit:cover;object-position:top;display:block`,
                      )}
                      loading="eager"
                    />
                  </a>
                  <div
                    style={cssStyle(
                      `padding:24px 26px;display:flex;flex-direction:column;gap:12px;flex:1`,
                    )}
                  >
                    <div
                      style={cssStyle(
                        `font-family:'Geist Mono',monospace;font-size:12px;letter-spacing:.08em;color:#5C645F`,
                      )}
                    >
                      {w.num}
                      {" / "}
                      {w.type}
                    </div>
                    <h2
                      style={cssStyle(
                        `margin:0;font-size:32px;font-weight:600;letter-spacing:-.035em;line-height:1.04`,
                      )}
                    >
                      {w.name}
                    </h2>
                    <p style={cssStyle(`margin:0;font-size:16px;line-height:1.55;color:#5C645F`)}>
                      {w.detail}
                    </p>
                    <div style={cssStyle(`display:flex;gap:8px;flex-wrap:wrap`)}>
                      {w.tools.map((tg, index) => (
                        <Fragment key={index}>
                          <span
                            style={cssStyle(
                              `background:#F5F4EF;padding:7px 12px;border-radius:999px;font-size:13px`,
                            )}
                          >
                            {tg}
                          </span>
                        </Fragment>
                      ))}
                    </div>
                    <div
                      style={cssStyle(
                        `display:flex;gap:16px;align-items:center;margin-top:auto;padding-top:18px;border-top:1px solid rgba(14,21,18,.12)`,
                      )}
                    >
                      <a
                        href={sitePath(w.href)}
                        target={"_blank"}
                        rel={"noreferrer"}
                        style={cssStyle(
                          `background:#0C1A15;color:#fff;font-weight:600;font-size:14px;padding:12px 18px;border-radius:999px`,
                        )}
                      >
                        {w.domain}
                        {" ↗"}
                      </a>
                      {w.caseHref ? (
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
                </article>
              </Fragment>
            ))}
          </section>
          <section style={cssStyle(`background:#fff;border-top:1px solid rgba(14,21,18,.12)`)}>
            <div
              style={cssStyle(
                `max-width:1280px;margin:0 auto;padding:72px 32px;box-sizing:border-box;display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,360px),1fr));gap:48px`,
              )}
            >
              <div
                style={cssStyle(
                  `position:sticky;top:110px;align-self:start;background:#0C1A15;color:#fff;border-radius:28px;padding:32px;display:flex;flex-direction:column;gap:20px`,
                )}
              >
                <div
                  style={cssStyle(
                    `font-family:'Geist Mono',monospace;font-size:12px;letter-spacing:.08em;color:#C9F26B`,
                  )}
                >
                  {"ŽIVÉ NÁSTROJE"}
                </div>
                <h2
                  style={cssStyle(
                    `margin:0;font-size:clamp(32px,3.6vw,44px);line-height:1.04;letter-spacing:-.045em;font-weight:600`,
                  )}
                >
                  {"Vyskúšajte si ich priamo."}
                </h2>
                <p
                  style={cssStyle(
                    `margin:0;font-size:16px;line-height:1.55;color:rgba(255,255,255,.72)`,
                  )}
                >
                  {
                    "Nástroje bez vlastnej domény, ktoré bežia samostatne. Kliknite a skúste si ich ako zákazník."
                  }
                </p>
              </div>
              <div
                style={cssStyle(
                  `display:flex;flex-direction:column;border-top:1px solid rgba(14,21,18,.12)`,
                )}
              >
                {live.map((l, index) => (
                  <Fragment key={index}>
                    <a
                      href={sitePath(l.href)}
                      target={"_blank"}
                      rel={"noreferrer"}
                      style={cssStyle(
                        `display:grid;grid-template-columns:48px minmax(0,1fr) auto;gap:16px;align-items:center;padding:22px 8px;border-bottom:1px solid rgba(14,21,18,.12);border-radius:4px`,
                      )}
                      className="ref-hover-16"
                    >
                      <span
                        style={cssStyle(
                          `font-family:'Geist Mono',monospace;font-size:12px;letter-spacing:.08em;color:#5C645F`,
                        )}
                      >
                        {l.num}
                      </span>
                      <span style={cssStyle(`display:flex;flex-direction:column;gap:2px`)}>
                        <span
                          style={cssStyle(`font-size:22px;font-weight:600;letter-spacing:-.02em`)}
                        >
                          {l.name}
                        </span>
                        <span style={cssStyle(`font-size:15px;color:#5C645F`)}>{l.note}</span>
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
          <Footer
            title={"Chcete podobné riešenie?"}
            copy={
              "Popíšte, čo dnes zákazníkom vysvetľujete, počítate alebo vyberáte. Navrhneme najjednoduchší funkčný smer."
            }
          />
        </div>
      </Fragment>
    );
  }
}
