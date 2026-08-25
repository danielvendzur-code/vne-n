import { Link } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { BrandMark } from "@/components/BrandMark";
import { siteConfig } from "@/config/site";
import { useFocusTrap } from "@/hooks/useFocusTrap";

const desktopLinks = [
  { label: "Riešenia", href: "/#riesenia" },
  { label: "Pre e-shopy", href: "/#pre-eshopy" },
  { label: "Realizácie", href: "/#realizacie" },
  { label: "Ako to funguje", href: "/#ako-to-funguje" },
  { label: "Cena", href: "/#cena" },
];

const mobileLinks = [
  { index: "01", label: "Riešenia", href: "/#riesenia" },
  { index: "02", label: "Pre e-shopy", href: "/#pre-eshopy" },
  { index: "03", label: "Realizácie", href: "/#realizacie" },
  { index: "04", label: "Proces", href: "/#proces" },
  { index: "05", label: "Cena", href: "/#cena" },
  { index: "06", label: "Kontakt", to: "/kontakt" as const },
];

export function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [tone, setTone] = useState<"dark" | "light">("dark");
  const panelRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const closeMenu = useCallback(() => setOpen(false), []);

  useFocusTrap(panelRef, open, closeMenu, menuButtonRef);

  useEffect(() => {
    let frame = 0;
    const updateTone = () => {
      const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-nav-tone]"));
      const headerBottom =
        document.querySelector<HTMLElement>(".site-header__inner")?.getBoundingClientRect()
          .bottom ?? 0;
      const sampleY = Math.min(window.innerHeight - 1, headerBottom + 24);
      const active =
        sections.find((section) => {
          const rect = section.getBoundingClientRect();
          return rect.top <= sampleY && rect.bottom > sampleY;
        }) ?? sections[0];
      if (active?.dataset.navTone === "light" || active?.dataset.navTone === "dark") {
        setTone(active.dataset.navTone);
      }
    };
    const onScroll = () => {
      setScrolled(window.scrollY > 18);
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(updateTone);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
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
      <header className="site-header" data-scrolled={scrolled} data-tone={tone}>
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
