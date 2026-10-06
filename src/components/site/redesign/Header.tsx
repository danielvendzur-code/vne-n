import { useEffect, useRef, useState } from "react";
import { BrandMark } from "@/components/BrandMark";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { sitePath } from "./utils";
import s from "./Header.module.css";

type HeaderProps = { active?: string; title?: string; copy?: string; tool?: string };
const links = [
  ["riesenia", "Riešenia", "/sluzby"],
  ["realizacie", "Realizácie", "/projekty"],
  ["postup", "Postup", "/postup"],
  ["cennik", "Cenník", "/cennik"],
  ["kontakt", "Kontakt", "/kontakt"],
];

export function Header({ active = "home" }: HeaderProps) {
  const [open, setOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    const closeOutside = (event: PointerEvent) => {
      if (event.target instanceof Node && !navRef.current?.contains(event.target)) setOpen(false);
    };
    const closeForChat = () => setOpen(false);
    document.addEventListener("pointerdown", closeOutside);
    window.addEventListener("site-assistant:open", closeForChat);
    return () => {
      document.removeEventListener("pointerdown", closeOutside);
      window.removeEventListener("site-assistant:open", closeForChat);
    };
  }, [open]);
  return (
    <nav
      ref={navRef}
      className={s.nav}
      aria-label="Hlavná navigácia"
      onKeyDown={(event) => {
        if (event.key === "Escape" && open) {
          setOpen(false);
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
        onClick={() => setOpen((value) => !value)}
      >
        <span>Menu</span>
        {open ? (
          <X size={18} strokeWidth={1.6} aria-hidden="true" />
        ) : (
          <Menu size={18} strokeWidth={1.6} aria-hidden="true" />
        )}
      </button>
      <div id="site-menu" className={s.menu} hidden={!open}>
        {links.map(([key, label, href], index) => (
          <a
            key={key}
            href={sitePath(href)}
            aria-current={key === active ? "page" : undefined}
            onClick={() => setOpen(false)}
          >
            <span className={s.index}>0{index + 1}</span>
            <span>{label}</span>
            <ArrowUpRight size={20} strokeWidth={1.5} aria-hidden="true" />
          </a>
        ))}
      </div>
    </nav>
  );
}
