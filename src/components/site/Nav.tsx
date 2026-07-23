import { Link } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { ArrowRight, ArrowUpRight, Bot, Calculator, Mail, SlidersHorizontal } from "lucide-react";
import { LineSidebar, type LineSidebarItem } from "@/components/navigation/LineSidebar";
import { BrandMark } from "@/components/BrandMark";
import { siteConfig } from "@/config/site";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { openSiteAssistant } from "@/lib/site-assistant";
import "./Nav.css";
import "./BrandMenuV2.css";

const drawerItems: LineSidebarItem[] = [
  { label: "Domov", href: "/" },
  { label: "Chatboty a riešenia", href: "/sluzby" },
  { label: "Ukážky", href: "/projekty" },
  { label: "Spolupráca", href: "/postup" },
  { label: "Kontakt", href: "/kontakt" },
];

const menuSolutions = [
  {
    icon: Bot,
    title: "AI chatbot na mieru",
    copy: "Odpovede, kvalifikácia a pripravený dopyt 24/7.",
    mode: "assistant" as const,
  },
  {
    icon: Calculator,
    title: "Chatbot s kalkulačkou",
    copy: "Rozhovor, ktorý zároveň vypočíta cenu, spotrebu či návratnosť.",
    mode: "calculator" as const,
  },
  {
    icon: SlidersHorizontal,
    title: "Chatbot s konfigurátorom",
    copy: "Prevedie výberom produktu a odošle kompletnú špecifikáciu.",
    mode: "calculator" as const,
  },
];

export function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const drawerRef = useRef<HTMLElement>(null);
  const closeMenu = useCallback(() => setOpen(false), []);
  const reducedMotion = useReducedMotion();

  useFocusTrap(drawerRef, open, closeMenu);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.body.dataset.siteMenuOpen = "true";
    return () => {
      document.body.style.overflow = previous;
      delete document.body.dataset.siteMenuOpen;
    };
  }, [open]);

  const openMenuAssistant = (mode: "assistant" | "calculator", category?: string) => {
    closeMenu();
    window.setTimeout(
      () =>
        openSiteAssistant({
          source: "sidebar-solution",
          entry: mode === "calculator" ? "builder" : undefined,
          category,
        }),
      360,
    );
  };

  return (
    <header
      className="site-header sticky top-0 py-3 md:py-4 pointer-events-none"
      style={{ zIndex: open ? 90 : 40 }}
    >
      <div className="container-page flex items-center justify-between h-13 md:h-15">
        <div
          className="site-header-bar flex items-center justify-between w-full rounded-[20px] px-3 md:px-4 pointer-events-auto backdrop-blur-xl transition-[background-color,border-color,box-shadow]"
          style={{
            minHeight: 56,
            backgroundColor: scrolled
              ? "color-mix(in oklab, var(--surface) 92%, transparent)"
              : "color-mix(in oklab, var(--surface) 74%, transparent)",
            border: "1px solid var(--border)",
            boxShadow: scrolled
              ? "0 18px 52px rgba(0, 0, 0, 0.34), 0 1px 0 rgba(242, 239, 230, 0.04) inset"
              : "0 10px 30px rgba(0, 0, 0, 0.16)",
          }}
        >
          <Link
            to="/"
            className="site-brand-lockup flex items-center gap-2.5"
            aria-label="Môj Chatbot — domov"
          >
            <BrandMark size={34} />
            <span className="site-brand-name">Môj Chatbot</span>
          </Link>

          <nav className="hidden lg:flex items-center gap-8" aria-label="Rýchla navigácia">
            {siteConfig.nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                aria-label={item.to === "/sluzby" ? "Služby" : undefined}
                className="site-nav-link text-[13.5px] tracking-tight transition-colors"
                activeProps={{ style: { color: "var(--primary)" } }}
                inactiveProps={{ style: { color: "var(--text-secondary)" } }}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              to="/kontakt"
              className="site-consultation-cta hidden lg:inline-flex items-center gap-1.5 rounded-[12px] px-4 py-2 text-[13.5px] font-semibold"
            >
              Nezáväzná konzultácia <ArrowUpRight size={14} aria-hidden="true" />
            </Link>
            <button
              onClick={() => setOpen((value) => !value)}
              aria-label={open ? "Zavrieť horné menu" : "Otvoriť menu"}
              aria-expanded={open}
              aria-controls="site-navigation-drawer"
              className="site-menu-toggle"
            >
              <span>Menu</span>
              <MenuIcon open={open} />
            </button>
          </div>
        </div>
      </div>

      <div className="site-menu-layer pointer-events-auto" data-open={open} aria-hidden={!open}>
        <div className="site-menu-backdrop" onClick={closeMenu} aria-hidden="true" />
        <motion.aside
          id="site-navigation-drawer"
          ref={drawerRef}
          className="site-menu-drawer"
          role="dialog"
          aria-modal="true"
          aria-label="Navigácia"
          tabIndex={-1}
          initial={false}
          animate={{
            opacity: open ? 1 : 0,
            y: open ? 0 : 14,
            scale: open ? 1 : 0.985,
          }}
          transition={
            reducedMotion
              ? { duration: 0 }
              : { duration: open ? 0.42 : 0.24, ease: [0.16, 1, 0.3, 1] }
          }
          style={{
            transition: "none",
            willChange: reducedMotion ? undefined : "transform, opacity",
          }}
        >
          <div className="site-menu-head">
            <Link to="/" onClick={closeMenu} aria-label="Domov" className="site-menu-brand">
              <BrandMark size={44} />
              <span>
                Môj Chatbot
                <small>chatboty a konverzné nástroje na mieru</small>
              </span>
            </Link>
            <button
              className="site-menu-close"
              type="button"
              aria-label="Zavrieť menu"
              onClick={closeMenu}
            >
              Zavrieť <MenuIcon open />
            </button>
          </div>

          <div className="site-menu-content">
            <div className="site-menu-grid">
              <div className="site-menu-nav-column">
                <p className="site-menu-eyebrow">Navigácia</p>
                <LineSidebar
                  items={drawerItems}
                  onItemClick={closeMenu}
                  accentColor="#3478f6"
                  textColor="#f7f9fc"
                  markerColor="rgba(247, 249, 252, 0.2)"
                  markerLength={48}
                  maxShift={20}
                  itemGap={18}
                  fontSize={1.24}
                />
              </div>

              <aside className="site-menu-services" aria-label="Rýchly výber riešenia">
                <p className="site-menu-eyebrow">Chatboty</p>
                <p className="site-menu-services-intro">
                  Vyberte najbližší typ. Asistent pripraví krátke zadanie bez zbytočného formulára.
                </p>
                <div className="site-menu-solution-list">
                  {menuSolutions.map(({ icon: Icon, title, copy, mode }) => (
                    <button
                      type="button"
                      className="site-menu-solution"
                      key={title}
                      onClick={() => openMenuAssistant(mode, title)}
                    >
                      <span className="site-menu-solution-icon">
                        <Icon size={17} aria-hidden="true" />
                      </span>
                      <span>
                        <b>{title}</b>
                        <small>{copy}</small>
                      </span>
                      <ArrowUpRight size={16} aria-hidden="true" />
                    </button>
                  ))}
                </div>
                <Link className="site-menu-project-link" to="/projekty" onClick={closeMenu}>
                  Pozrieť hotové realizácie <ArrowRight size={16} aria-hidden="true" />
                </Link>
              </aside>
            </div>
          </div>

          <div className="site-menu-footer">
            <button
              className="site-menu-cta"
              type="button"
              onClick={() => openMenuAssistant("assistant")}
            >
              <span>
                <small>Máte konkrétny nápad?</small>
                Prejdime si ho spolu
              </span>
              <ArrowUpRight size={20} />
            </button>
            <a className="site-menu-email" href={`mailto:${siteConfig.contact.email}`}>
              <Mail size={14} /> {siteConfig.contact.email}
            </a>
          </div>
        </motion.aside>
      </div>
    </header>
  );
}

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <line
        x1="3"
        y1="7"
        x2="15"
        y2="7"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        style={{
          transform: open ? "rotate(45deg) translate(1px, 1px)" : "none",
          transformOrigin: "9px 9px",
          transition: "transform 200ms cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      />
      <line
        x1="3"
        y1="11"
        x2="15"
        y2="11"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        style={{
          transform: open ? "rotate(-45deg) translate(1px, -1px)" : "none",
          transformOrigin: "9px 9px",
          transition: "transform 200ms cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      />
    </svg>
  );
}
