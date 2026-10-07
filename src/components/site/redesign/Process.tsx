import React, { Component, Fragment } from "react";
import { cssStyle, sitePath } from "./utils";
import { Footer } from "./Footer";

export class Process extends Component<{
  active?: string;
  title?: string;
  copy?: string;
  tool?: string;
}> {
  renderVals() {
    return {
      openWidget: () =>
        window.dispatchEvent(
          new CustomEvent("site-assistant:open", { detail: { entry: "builder" } }),
        ),
      steps: [
        {
          title: "Pochopenie",
          output: "Jasne pomenovaný problém a cieľ nástroja.",
          copy: "Prejdeme web, ponuku a situácie, ktoré dnes riešite ručne. Určíme, čo má zákazník zistiť, vypočítať, vybrať alebo odoslať.",
        },
        {
          title: "Návrh",
          output: "Schválená cesta zákazníka a rozsah prvej verzie.",
          copy: "Navrhneme otázky, rozhodovaciu logiku, výstupy a podobu rozhrania. Pred vývojom viete, čo presne sa bude diať po jednotlivých krokoch.",
        },
        {
          title: "Vývoj",
          output: "Funkčná verzia na otestovanie.",
          copy: "Postavíme rozhranie a dohodnutú logiku. Otestujeme výpočty, formuláre, konfiguráciu a správanie na desktopoch aj mobiloch.",
        },
        {
          title: "Nasadenie",
          output: "Nástroj na reálnom webe a overený ďalší krok.",
          copy: "Nasadíme riešenie, preveríme odosielanie dopytov alebo výsledkov a doladíme detaily podľa reálneho použitia.",
        },
      ].map((s, i) => ({ ...s, num: "0" + (i + 1) })),
    };
  }
  render() {
    const { openWidget, steps } = this.renderVals();
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
              `max-width:1280px;margin:0 auto;padding:64px 32px 56px;box-sizing:border-box`,
            )}
          >
            <div
              style={cssStyle(
                `font-family:'Geist Mono',monospace;font-size:12px;letter-spacing:.08em;color:var(--mc-muted);padding-bottom:20px;border-bottom:1px solid rgba(14,21,18,.12)`,
              )}
            >
              <a href={sitePath("/")}>{"DOMOV"}</a>
              {" / POSTUP"}
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
                {"Od prvého zadania"}
                <br />
                <span style={cssStyle(`color:var(--mc-brand)`)}>{"po živý web."}</span>
              </h1>
              <p
                style={cssStyle(
                  `margin:0;font-size:19px;line-height:1.5;color:var(--mc-muted);text-wrap:pretty`,
                )}
              >
                {
                  "Každý krok má konkrétny výstup. Viete, čo sa práve rozhoduje, čo dostanete a kedy má zmysel pokračovať ďalej."
                }
              </p>
            </div>
          </section>
          <section
            className="process-layout"
            style={cssStyle(
              `max-width:1280px;margin:0 auto;padding:0 32px 88px;box-sizing:border-box;display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,320px),1fr));gap:48px`,
            )}
          >
            <div
              className="process-aside"
              style={cssStyle(
                `position:sticky;top:110px;align-self:start;background:var(--mc-ink);color:var(--mc-paper);border-radius:28px;padding:32px;display:flex;flex-direction:column;gap:20px`,
              )}
            >
              <div
                style={cssStyle(
                  `font-family:'Geist Mono',monospace;font-size:12px;letter-spacing:.08em;color:var(--mc-accent)`,
                )}
              >
                {"OTÁZKA → VÝSLEDOK"}
              </div>
              <h2
                style={cssStyle(
                  `margin:0;font-size:clamp(32px,3.6vw,44px);line-height:1.04;letter-spacing:-.045em;font-weight:600`,
                )}
              >
                {"Technológia je až druhá."}
              </h2>
              <p
                style={cssStyle(
                  `margin:0;font-size:16px;line-height:1.55;color:rgba(255,255,255,.72)`,
                )}
              >
                {
                  "Najprv musí byť jasné, čo má byť výsledkom pre zákazníka a pre firmu. Až potom staviame."
                }
              </p>
              <div style={cssStyle(`border-radius:18px;overflow:hidden;position:relative`)}>
                <img
                  src={sitePath("/work/live/derat.webp")}
                  alt={"Živá realizácia DERAT"}
                  style={cssStyle(`width:100%;aspect-ratio:16/10;object-fit:cover;display:block`)}
                  loading="lazy"
                />
                <span
                  style={cssStyle(
                    `position:absolute;left:12px;bottom:12px;background:var(--mc-accent);color:var(--mc-ink);padding:6px 10px;border-radius:999px;font-family:'Geist Mono',monospace;font-size:11px;letter-spacing:.08em`,
                  )}
                >
                  {"ŽIVÁ REALIZÁCIA · DERAT"}
                </span>
              </div>
              <button className="mc-btn" onClick={openWidget} type="button">
                {"Vyskladať riešenie →"}
              </button>
            </div>
            <div
              className="process-steps"
              style={cssStyle(`display:flex;flex-direction:column;gap:12px;grid-column:span 1`)}
            >
              {steps.map((s, index) => (
                <Fragment key={index}>
                  <div
                    className="process-step"
                    data-reveal
                    style={cssStyle(
                      `background:var(--mc-paper);border:1px solid rgba(14,21,18,.12);border-radius:24px;padding:28px 30px;display:grid;grid-template-columns:64px minmax(0,1fr);gap:20px`,
                    )}
                  >
                    <span
                      style={cssStyle(
                        `width:48px;height:48px;border-radius:14px;background:var(--mc-ink);color:var(--mc-accent);display:flex;align-items:center;justify-content:center;font-family:'Geist Mono',monospace;font-size:13px`,
                      )}
                    >
                      {s.num}
                    </span>
                    <div style={cssStyle(`display:flex;flex-direction:column;gap:10px`)}>
                      <h3
                        style={cssStyle(
                          `margin:0;font-size:26px;font-weight:600;letter-spacing:-.025em`,
                        )}
                      >
                        {s.title}
                      </h3>
                      <p
                        style={cssStyle(
                          `margin:0;font-size:16px;line-height:1.55;color:var(--mc-muted)`,
                        )}
                      >
                        {s.copy}
                      </p>
                      <div
                        style={cssStyle(
                          `display:flex;gap:12px;align-items:center;background:var(--mc-page);border-radius:12px;padding:12px 14px;font-size:15px`,
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
          </section>
          <Footer
            title={"Začnime tým, čo dnes riešite ručne."}
            copy={
              "Nemusíte vedieť, či potrebujete chatbot, kalkulačku, konfigurátor alebo produktového poradcu. Stačí popísať proces a výsledok, ktorý chcete."
            }
          />
        </div>
      </Fragment>
    );
  }
}
