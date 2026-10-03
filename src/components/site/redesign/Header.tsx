import React, { Component, Fragment } from "react";
import { cssStyle, sitePath } from "./utils";

export class Header extends Component<{
  active?: string;
  title?: string;
  copy?: string;
  tool?: string;
}> {
  renderVals() {
    const a = this.props.active ?? "home";
    const links = [
      ["riesenia", "Riešenia", "/sluzby"],
      ["realizacie", "Realizácie", "/projekty"],
      ["postup", "Postup", "/postup"],
      ["cennik", "Cenník", "/cennik"],
    ].map(([k, label, href]) => ({
      label,
      href,
      color: k === a ? "#fff" : "rgba(255,255,255,.75)",
      bg: k === a ? "rgba(255,255,255,.12)" : "transparent",
    }));
    return {
      links,
      openWidget: () =>
        window.dispatchEvent(
          new CustomEvent("site-assistant:open", { detail: { entry: "builder" } }),
        ),
    };
  }
  render() {
    const { links, openWidget } = this.renderVals();
    return (
      <Fragment>
        <div style={cssStyle(`padding:16px 24px 0;font-family:'Geist',system-ui,sans-serif`)}>
          <nav
            style={cssStyle(
              `max-width:1232px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;gap:16px;background:rgba(12,26,21,.94);backdrop-filter:blur(12px);border-radius:999px;padding:8px 8px 8px 20px;color:#fff`,
            )}
          >
            <a
              href={sitePath("/")}
              style={cssStyle(
                `display:flex;align-items:center;gap:10px;color:#fff;text-decoration:none`,
              )}
            >
              <img
                src={sitePath("/brand/logo-light.svg")}
                alt={""}
                style={cssStyle(`width:30px;height:30px`)}
                loading="lazy"
              />
              <span
                style={cssStyle(
                  `font-weight:600;font-size:17px;letter-spacing:-.01em;white-space:nowrap`,
                )}
              >
                {"Môj Chatbot"}
              </span>
            </a>
            <div style={cssStyle(`display:flex;gap:2px;flex-wrap:nowrap`)}>
              {links.map((l, index) => (
                <Fragment key={index}>
                  <a
                    href={sitePath(l.href)}
                    style={cssStyle(
                      `color:${l.color};background:${l.bg};font-size:15px;padding:10px 14px;border-radius:999px;white-space:nowrap;text-decoration:none`,
                    )}
                    className="ref-hover-18"
                  >
                    {l.label}
                  </a>
                </Fragment>
              ))}
            </div>
            <div style={cssStyle(`display:flex;align-items:center;gap:16px`)}>
              <a
                href={sitePath("tel:+421948699433")}
                data-hide-narrow={"1"}
                style={cssStyle(
                  `color:rgba(255,255,255,.7);font-size:13px;font-family:'Geist Mono',monospace;white-space:nowrap;text-decoration:none`,
                )}
              >
                {"+421 948 699 433"}
              </a>
              <button
                onClick={openWidget}
                style={cssStyle(
                  `all:unset;cursor:pointer;background:#C9F26B;color:#0C1A15;font-weight:600;font-size:15px;padding:13px 22px;border-radius:999px;white-space:nowrap`,
                )}
                className="ref-hover-19"
                type="button"
              >
                {"Vyskladať riešenie →"}
              </button>
            </div>
          </nav>
        </div>
      </Fragment>
    );
  }
}
