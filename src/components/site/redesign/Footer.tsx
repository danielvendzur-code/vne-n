import React, { Component, Fragment } from "react";
import { cssStyle, sitePath } from "./utils";

export class Footer extends Component<{
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
      title: this.props.title ?? "Začnime tým, čo dnes riešite ručne.",
      copy:
        this.props.copy ??
        "Nemusíte vedieť, či potrebujete chatbot, kalkulačku, konfigurátor alebo poradcu. Stačí popísať proces a výsledok, ktorý chcete.",
    };
  }
  render() {
    const { copy, openWidget, title } = this.renderVals();
    return (
      <Fragment>
        <section
          id={"kontakt"}
          style={cssStyle(
            `background:#0C1A15;color:#fff;padding:24px;font-family:'Geist',system-ui,sans-serif`,
          )}
        >
          <div
            style={cssStyle(
              `max-width:1232px;margin:0 auto;background:#C9F26B;color:#0C1A15;border-radius:14px;padding:clamp(24px,4vw,48px);display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,420px),1fr));gap:40px;align-items:end`,
            )}
          >
            <div>
              <div
                style={cssStyle(
                  `font-family:'Geist Mono',monospace;font-size:12px;letter-spacing:.08em`,
                )}
              >
                {"ĎALŠÍ KROK"}
              </div>
              <h2
                style={cssStyle(
                  `margin:16px 0 0;font-size:clamp(40px,5vw,64px);line-height:.98;letter-spacing:-.05em;font-weight:600`,
                )}
              >
                {title}
              </h2>
            </div>
            <div style={cssStyle(`display:flex;flex-direction:column;gap:24px`)}>
              <p style={cssStyle(`margin:0;font-size:18px;line-height:1.5`)}>{copy}</p>
              <div style={cssStyle(`display:flex;gap:10px;flex-wrap:wrap`)}>
                <button
                  className="redesign-action"
                  onClick={openWidget}
                  style={cssStyle(
                    `all:unset;cursor:pointer;background:#0C1A15;color:#fff;font-weight:600;font-size:16px;padding:16px 26px;border-radius:999px`,
                  )}
                  type="button"
                >
                  {"Vyskladať riešenie →"}
                </button>
                <a
                  href={sitePath("mailto:info@mojchatbot.sk")}
                  style={cssStyle(
                    `color:#0C1A15;font-size:16px;padding:16px 26px;border-radius:999px;border:1px solid rgba(12,26,21,.3);text-decoration:none`,
                  )}
                >
                  {"info@mojchatbot.sk"}
                </a>
              </div>
            </div>
          </div>
          <footer
            style={cssStyle(
              `max-width:1232px;margin:0 auto;padding:64px 32px 24px;box-sizing:border-box;display:flex;flex-direction:column;gap:48px`,
            )}
          >
            <div
              style={cssStyle(
                `display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:40px`,
              )}
            >
              <div style={cssStyle(`display:flex;flex-direction:column;gap:14px`)}>
                <div style={cssStyle(`display:flex;align-items:center;gap:10px`)}>
                  <img
                    src={sitePath("/brand/logo-light.svg")}
                    alt={""}
                    style={cssStyle(`width:32px;height:32px`)}
                    loading="lazy"
                  />
                  <span style={cssStyle(`font-weight:600;font-size:18px`)}>{"Môj Chatbot"}</span>
                </div>
                <p
                  style={cssStyle(
                    `margin:0;font-size:15px;line-height:1.5;color:rgba(255,255,255,.6);max-width:260px`,
                  )}
                >
                  {"Chatboty, kalkulačky, konfigurátory a produktoví poradcovia na mieru."}
                </p>
              </div>
              <div style={cssStyle(`display:flex;flex-direction:column;gap:10px;font-size:15px`)}>
                <span
                  style={cssStyle(
                    `font-family:'Geist Mono',monospace;font-size:12px;letter-spacing:.08em;color:rgba(255,255,255,.5);margin-bottom:6px`,
                  )}
                >
                  {"STRÁNKY"}
                </span>
                <a
                  href={sitePath("/sluzby")}
                  style={cssStyle(`color:rgba(255,255,255,.85);text-decoration:none`)}
                >
                  {"Riešenia"}
                </a>
                <a
                  href={sitePath("/3d-konfigurator")}
                  style={cssStyle(`color:rgba(255,255,255,.85);text-decoration:none`)}
                >
                  {"3D konfigurátor"}
                </a>
                <a
                  href={sitePath("/projekty")}
                  style={cssStyle(`color:rgba(255,255,255,.85);text-decoration:none`)}
                >
                  {"Realizácie"}
                </a>
                <a
                  href={sitePath("/postup")}
                  style={cssStyle(`color:rgba(255,255,255,.85);text-decoration:none`)}
                >
                  {"Postup"}
                </a>
                <a
                  href={sitePath("/cennik")}
                  style={cssStyle(`color:rgba(255,255,255,.85);text-decoration:none`)}
                >
                  {"Cenník"}
                </a>
              </div>
              <div style={cssStyle(`display:flex;flex-direction:column;gap:10px;font-size:15px`)}>
                <span
                  style={cssStyle(
                    `font-family:'Geist Mono',monospace;font-size:12px;letter-spacing:.08em;color:rgba(255,255,255,.5);margin-bottom:6px`,
                  )}
                >
                  {"KONTAKT"}
                </span>
                <a
                  href={sitePath("mailto:info@mojchatbot.sk")}
                  style={cssStyle(`color:rgba(255,255,255,.85);text-decoration:none`)}
                >
                  {"info@mojchatbot.sk"}
                </a>
                <a
                  href={sitePath("tel:+421948699433")}
                  style={cssStyle(
                    `color:rgba(255,255,255,.85);font-family:'Geist Mono',monospace;font-size:14px;text-decoration:none`,
                  )}
                >
                  {"+421 948 699 433"}
                </a>
              </div>
              <div
                style={cssStyle(
                  `display:flex;flex-direction:column;gap:10px;font-size:14px;color:rgba(255,255,255,.6);line-height:1.5`,
                )}
              >
                <span
                  style={cssStyle(
                    `font-family:'Geist Mono',monospace;font-size:12px;letter-spacing:.08em;color:rgba(255,255,255,.5);margin-bottom:6px`,
                  )}
                >
                  {"PREVÁDZKOVATEĽ"}
                </span>
                <span>
                  {"Venaco s.r.o."}
                  <br />
                  {"J. C. Hronského 3427/6, 949 07 Nitra"}
                  <br />
                  {"IČO 45648107"}
                </span>
              </div>
            </div>
            <div
              style={cssStyle(
                `display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap;padding-top:24px;border-top:1px solid rgba(255,255,255,.12);font-family:'Geist Mono',monospace;font-size:12px;letter-spacing:.08em;color:rgba(255,255,255,.5)`,
              )}
            >
              <span>{"© 2026 MÔJ CHATBOT"}</span>
              <span style={cssStyle(`display:flex;gap:24px`)}>
                <span>{"OCHRANA ÚDAJOV"}</span>
                <span>{"COOKIES"}</span>
                <span>{"PRÁVNE INFORMÁCIE"}</span>
              </span>
            </div>
          </footer>
        </section>
      </Fragment>
    );
  }
}
