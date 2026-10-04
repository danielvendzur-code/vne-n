import { useState } from "react";
import { sitePath } from "./utils";

type HeaderProps = { active?: string; title?: string; copy?: string; tool?: string };

export function Header({ active = "home" }: HeaderProps) {
  const [open, setOpen] = useState(false);
  const links = [
    ["riesenia", "Riešenia", "/sluzby"],
    ["realizacie", "Realizácie", "/projekty"],
    ["postup", "Postup", "/postup"],
    ["cennik", "Cenník", "/cennik"],
  ];
  const openWidget = () => {
    setOpen(false);
    window.dispatchEvent(new CustomEvent("site-assistant:open", { detail: { entry: "builder" } }));
  };
  return (
    <div className="redesign-nav-wrap">
      <nav
        className="redesign-nav"
        aria-label="Hlavná navigácia"
        onKeyDown={(event) => {
          if (event.key === "Escape") setOpen(false);
        }}
      >
        <a className="redesign-brand" href={sitePath("/")}>
          <img src={sitePath("/brand/logo-light.svg")} alt="" width="30" height="30" />
          <span>Môj Chatbot</span>
        </a>
        <div className="redesign-nav-links" id="redesign-nav-links" data-open={open}>
          {links.map(([key, label, href]) => (
            <a
              key={key}
              href={sitePath(href)}
              aria-current={key === active ? "page" : undefined}
              onClick={() => setOpen(false)}
            >
              {label}
            </a>
          ))}
        </div>
        <div className="redesign-nav-actions">
          <a className="redesign-nav-phone" href="tel:+421948699433">
            +421 948 699 433
          </a>
          <button className="redesign-nav-cta" type="button" onClick={openWidget}>
            <span className="redesign-nav-cta-full">Vyskladať riešenie →</span>
            <span className="redesign-nav-cta-short">Vyskladať →</span>
          </button>
          <button
            className="redesign-menu-toggle"
            type="button"
            aria-label={open ? "Zavrieť menu" : "Otvoriť menu"}
            aria-expanded={open}
            aria-controls="redesign-nav-links"
            onClick={() => setOpen((value) => !value)}
          >
            <svg
              viewBox="0 0 24 24"
              width="22"
              height="22"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              aria-hidden="true"
            >
              {open ? <path d="m6 6 12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </nav>
    </div>
  );
}
