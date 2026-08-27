import { Link, useRouterState } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { BrandMark } from "@/components/BrandMark";
import { siteConfig } from "@/config/site";
import { useFocusTrap } from "@/hooks/useFocusTrap";

type NavTone = "dark" | "light";

const desktopLinks = [
  { label: "Riešenia", href: "/#riesenia" },
  { label: "Realizácie", href: "/#realizacie" },
  { label: "Ako to funguje", href: "/#ako-to-funguje" },
  { label: "Cena", href: "/#cena" },
  { label: "Kontakt", href: "/kontakt" },
];

const mobileLinks = [
  { index: "01", label: "Riešenia", href: "/#riesenia" },
  { index: "02", label: "Realizácie", href: "/#realizacie" },
  { index: "03", label: "Ako to funguje", href: "/#ako-to-funguje" },
  { index: "04", label: "Výsledok · Pre e-shopy", href: "/#pre-eshopy" },
  { index: "05", label: "Proces", href: "/#proces" },
  { index: "06", label: "Cena", href: "/#cena" },
  { index: "07", label: "Kontakt", to: "/kontakt" as const },
];

function sectionTone(section: HTMLElement | undefined): NavTone | null {
  const value = section?.dataset.navTone;
  return value === "dark" || value === "light" ? value : null;
}

export function Nav() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [tone, setTone] = useState<NavTone>(() => (pathname === "/" ? "dark" : "light"));
  const [adaptiveHome, setAdaptiveHome] = useState(pathname === "/");
  const headerRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const closeMenu = useCallback(() => setOpen(false), []);

  useFocusTrap(panelRef, open, closeMenu, menuButtonRef);

  useEffect(() => {
    let frame = 0;
    const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-nav-tone]"));
    const isAdaptiveHome = document.querySelector(".kage-home") !== null && sections.length > 0;

    setAdaptiveHome((current) => (current === isAdaptiveHome ? current : isAdaptiveHome));

    if (!isAdaptiveHome) {
      setTone((current) => (current === "light" ? current : "light"));
    }

    const update = () => {
      const nextScrolled = window.scrollY > 18;
      setScrolled((current) => (current === nextScrolled ? current : nextScrolled));

      if (!isAdaptiveHome || sections.length === 0) return;

      const headerBottom = headerRef.current?.getBoundingClientRect().bottom ?? 76;
      const sampleY = Math.min(window.innerHeight - 1, headerBottom + 12);
      let nextTone = sectionTone(sections[0]) ?? "dark";

      for (const section of sections) {
        const rect = section.getBoundingClientRect();
        if (rect.top > sampleY) break;

        nextTone = sectionTone(section) ?? nextTone;
        if (rect.bottom > sampleY) break;
      }

      setTone((current) => (current === nextTone ? current : nextTone));
    };

    const requestUpdate = () => {
      if (frame !== 0) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        update();
      });
    };

    update();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate, { passive: true });

    return () => {
      if (frame !== 0) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
    };
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const brandHref = pathname === "/" ? "#page-top" : "/#page-top";

  return (
    <>
      <div id="page-top" className="site-header-spacer" aria-hidden="true" />
      <header
        ref={headerRef}
        className="site-header"
        data-scrolled={scrolled}
        data-tone={tone}
        data-adaptive={adaptiveHome ? "true" : "false"}
      >
        <div className="site-header__inner container-page">
          <a href={brandHref} className="site-brand-lockup" aria-label="Môj Chatbot — naspäť hore">
            <BrandMark size={34} />
            <span className="site-brand-name">Môj Chatbot</span>
          </a>

          <nav className="site-nav" aria-label="Hlavná navigácia">
            {desktopLinks.map((item) => (
              <a key={item.label} href={item.href}>
                {item.label}
              </a>
            ))}
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
            <a
              href={brandHref}
              className="site-brand-lockup"
              onClick={closeMenu}
              aria-label="Môj Chatbot — naspäť hore"
            >
              <BrandMark size={34} />
              <span className="site-brand-name">Môj Chatbot</span>
            </a>
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
