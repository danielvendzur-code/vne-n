import { Link } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { BrandMark } from "@/components/BrandMark";
import { siteConfig } from "@/config/site";
import { useFocusTrap } from "@/hooks/useFocusTrap";

const desktopLinks = [
  { label: "Riešenia", to: "/sluzby" as const },
  { label: "Pre e-shopy", href: "/#pre-eshopy" },
  { label: "Realizácie", to: "/projekty" as const },
  { label: "Ako to funguje", to: "/postup" as const },
  { label: "Cena", to: "/cennik" as const },
];

const mobileLinks = [
  { index: "01", label: "Riešenia", to: "/sluzby" as const },
  { index: "02", label: "Pre e-shopy", href: "/#pre-eshopy" },
  { index: "03", label: "Realizácie", to: "/projekty" as const },
  { index: "04", label: "Proces", to: "/postup" as const },
  { index: "05", label: "Cena", to: "/cennik" as const },
  { index: "06", label: "Kontakt", to: "/kontakt" as const },
];

export function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const closeMenu = useCallback(() => setOpen(false), []);

  useFocusTrap(panelRef, open, closeMenu, menuButtonRef);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 18);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  return (
    <>
      <div className="site-header-spacer" aria-hidden="true" />
      <header className="site-header" data-scrolled={scrolled}>
        <div className="site-header__inner container-page">
          <Link to="/" className="site-brand-lockup" aria-label="Môj Chatbot — domov">
            <BrandMark size={34} />
            <span className="site-brand-name">Môj Chatbot</span>
          </Link>

          <nav className="site-nav" aria-label="Hlavná navigácia">
            {desktopLinks.map((item) =>
              "to" in item ? (
                <Link key={item.label} to={item.to} activeProps={{ "aria-current": "page" }}>
                  {item.label}
                </Link>
              ) : (
                <a key={item.label} href={item.href}>
                  {item.label}
                </a>
              ),
            )}
          </nav>

          <div className="site-header__actions">
            <Link to="/kontakt" className="site-header__cta">
              Začať projekt <ArrowUpRight size={14} aria-hidden="true" />
            </Link>
            <button
              ref={menuButtonRef}
              type="button"
              className="site-menu-toggle"
              aria-expanded={open}
              aria-controls="site-mobile-menu"
              aria-label={open ? "Zavrieť menu" : "Otvoriť menu"}
              onClick={() => setOpen((value) => !value)}
            >
              MENU
            </button>
          </div>
        </div>
      </header>

      <div className="site-menu-layer" data-open={open} aria-hidden={!open}>
        <div
          id="site-mobile-menu"
          ref={panelRef}
          className="site-menu-panel"
          role="dialog"
          aria-modal="true"
          aria-label="Navigácia"
          tabIndex={-1}
        >
          <div className="site-menu-head">
            <Link
              to="/"
              className="site-brand-lockup"
              onClick={closeMenu}
              aria-label="Môj Chatbot — domov"
            >
              <BrandMark size={34} />
              <span className="site-brand-name">Môj Chatbot</span>
            </Link>
            <button type="button" className="site-menu-close" onClick={closeMenu}>
              ZAVRIEŤ
            </button>
          </div>

          <nav className="site-menu-nav" aria-label="Mobilná navigácia">
            {mobileLinks.map((item) =>
              "to" in item ? (
                <Link key={item.label} to={item.to} onClick={closeMenu}>
                  <span>{item.index}</span>
                  {item.label}
                </Link>
              ) : (
                <a key={item.label} href={item.href} onClick={closeMenu}>
                  <span>{item.index}</span>
                  {item.label}
                </a>
              ),
            )}
          </nav>

          <div className="site-menu-foot">
            <a href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</a>
            <a href={`tel:${siteConfig.contact.phoneHref}`}>{siteConfig.contact.phoneLabel}</a>
          </div>
        </div>
      </div>
    </>
  );
}
