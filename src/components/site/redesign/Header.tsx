import { useCallback, useEffect, useRef, useState } from "react";
import { BrandMark } from "@/components/BrandMark";
import { ArrowRight, ArrowUpRight, Menu, X } from "lucide-react";
import { sitePath } from "./utils";
import s from "./Header.module.css";

type HeaderProps = { active?: string; title?: string; copy?: string; tool?: string };
const links = [
  ["riesenia", "Riešenia", "/sluzby", "Nástroje pre váš web"],
  ["realizacie", "Realizácie", "/projekty", "Pozrite si ich v praxi"],
  ["postup", "Postup", "/postup", "Od návrhu po spustenie"],
  ["cennik", "Cenník", "/cennik", "Jasný rozsah aj cena"],
  ["kontakt", "Kontakt", "/kontakt", "Poďme prebrať váš web"],
];

export function Header({ active = "home" }: HeaderProps) {
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const exitTimer = useRef<number | undefined>(undefined);
  const close = useCallback(() => {
    setOpen(false);
    window.clearTimeout(exitTimer.current);
    const animate = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setClosing(animate);
    if (animate) exitTimer.current = window.setTimeout(() => setClosing(false), 220);
  }, []);
  useEffect(() => () => window.clearTimeout(exitTimer.current), []);
  useEffect(() => {
    if (!open) return;
    const closeOutside = (event: PointerEvent) => {
      if (event.target instanceof Node && !navRef.current?.contains(event.target)) close();
    };
    document.addEventListener("pointerdown", closeOutside);
    window.addEventListener("site-assistant:open", close);
    return () => {
      document.removeEventListener("pointerdown", closeOutside);
      window.removeEventListener("site-assistant:open", close);
    };
  }, [open, close]);
  return (
    <nav
      ref={navRef}
      className={s.nav}
      aria-label="Hlavná navigácia"
      onBlur={(event) => {
        if (
          open &&
          event.relatedTarget instanceof Node &&
          !event.currentTarget.contains(event.relatedTarget)
        )
          close();
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape" && open) {
          close();
          toggleRef.current?.focus();
        }
      }}
    >
      <a className={s.brand} href={sitePath("/")} aria-label="Môj Chatbot — úvod">
        <BrandMark intro size={32} tone="paper" />
        <span>Môj Chatbot</span>
      </a>
      <button
        ref={toggleRef}
        className={s.toggle}
        type="button"
        aria-label={open ? "Zavrieť menu" : "Otvoriť menu"}
        aria-expanded={open}
        aria-controls="site-menu"
        onClick={() => {
          if (open) close();
          else {
            window.clearTimeout(exitTimer.current);
            setClosing(false);
            setOpen(true);
          }
        }}
      >
        <span>{open ? "Zavrieť" : "Menu"}</span>
        <span className={s.toggleIcon} data-open={open}>
          <Menu size={18} strokeWidth={1.6} aria-hidden="true" />
          <X size={18} strokeWidth={1.6} aria-hidden="true" />
        </span>
      </button>
      <div
        className={s.backdrop}
        hidden={!open && !closing}
        data-state={closing ? "closing" : "open"}
        onClick={close}
        aria-hidden="true"
      />
      <div
        id="site-menu"
        className={s.menu}
        hidden={!open && !closing}
        inert={closing || undefined}
        data-state={closing ? "closing" : "open"}
      >
        <div className={s.menuEyebrow}>VÁŠ WEB. VIAC MOŽNOSTÍ.</div>
        <div className={s.menuGrid}>
          <div className={s.links}>
            {links.map(([key, label, href, detail], index) => (
              <a
                key={key}
                href={sitePath(href)}
                aria-current={key === active ? "page" : undefined}
                onClick={close}
                style={{ "--row": index } as React.CSSProperties}
              >
                <span className={s.index}>0{index + 1}</span>
                <span className={s.linkCopy}>
                  <strong>{label}</strong>
                  <small>{detail}</small>
                </span>
                <ArrowUpRight size={22} strokeWidth={1.5} aria-hidden="true" />
              </a>
            ))}
          </div>
          <div className={s.menuFeature}>
            <BrandMark size={60} tone="paper" loop />
            <h2>
              Od prvej otázky
              <br />k ďalšiemu kroku.
            </h2>
            <p>Vyberte si nástroj, ktorý vašim zákazníkom uľahčí rozhodovanie.</p>
            <div className={s.quickLinks}>
              <a href={sitePath("/3d-konfigurator")} onClick={close}>
                3D konfigurátor <ArrowUpRight size={14} />
              </a>
              <a href={sitePath("/nastroj?t=chatbot")} onClick={close}>
                Chatbot <ArrowUpRight size={14} />
              </a>
              <a href={sitePath("/nastroj?t=kalkulacka")} onClick={close}>
                Kalkulačka <ArrowUpRight size={14} />
              </a>
            </div>
            <button
              type="button"
              className={s.menuCta}
              onClick={() => {
                close();
                window.dispatchEvent(
                  new CustomEvent("site-assistant:open", { detail: { entry: "builder" } }),
                );
              }}
            >
              Vyskladať riešenie <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
