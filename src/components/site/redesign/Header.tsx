import { useEffect, useRef, useState } from "react";
import { BrandMark } from "@/components/BrandMark";
import { Menu, X } from "lucide-react";
import { sitePath } from "./utils";

type HeaderProps = { active?: string; title?: string; copy?: string; tool?: string };

export function Header({ active = "home" }: HeaderProps) {
  const [open, setOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    const closeOutside = (event: PointerEvent) => {
      if (event.target instanceof Node && !navRef.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener("pointerdown", closeOutside);
    return () => document.removeEventListener("pointerdown", closeOutside);
  }, [open]);
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
        ref={navRef}
        className="redesign-nav"
        aria-label="Hlavná navigácia"
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            setOpen(false);
            toggleRef.current?.focus();
          }
        }}
      >
        <a className="redesign-brand" href={sitePath("/")}>
          <BrandMark size={34} tone="paper" />
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
          </button>
          <button
            ref={toggleRef}
            className="redesign-menu-toggle"
            type="button"
            aria-label={open ? "Zavrieť menu" : "Otvoriť menu"}
            aria-expanded={open}
            aria-controls="redesign-nav-links"
            onClick={() => setOpen((value) => !value)}
          >
            {open ? (
              <X size={22} strokeWidth={1.6} aria-hidden="true" />
            ) : (
              <Menu size={22} strokeWidth={1.6} aria-hidden="true" />
            )}
          </button>
        </div>
      </nav>
    </div>
  );
}
