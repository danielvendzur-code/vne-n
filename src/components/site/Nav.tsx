import { Link } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowUpRight, Mail } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { LineSidebar, type LineSidebarItem } from "@/components/navigation/LineSidebar";
import { Symbol } from "@/components/Symbol";
import { siteConfig } from "@/config/site";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { openSiteAssistant } from "@/lib/site-assistant";
import "./Nav.css";

const drawerItems: LineSidebarItem[] = [
  { label: "Domov", to: "/" },
  { label: "Služby", to: "/sluzby" },
  { label: "Projekty", to: "/projekty" },
  { label: "Postup", to: "/postup" },
  { label: "Kontakt", to: "/kontakt" },
];

const liquidSpring = { type: "spring", stiffness: 290, damping: 29, mass: 0.78 } as const;
const premiumEase = [0.16, 1, 0.3, 1] as const;

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
            className="site-brand-lockup flex items-center gap-2"
            aria-label="Daniel Vendzúr — domov"
          >
            <Symbol size={34} />
            <span className="site-brand-name">Daniel Vendzúr</span>
          </Link>

          <nav className="hidden lg:flex items-center gap-8" aria-label="Rýchla navigácia">
            {siteConfig.nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
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
              className="hidden lg:inline-flex items-center rounded-[10px] px-3.5 py-2 text-[13.5px] font-medium transition-colors"
              style={{ backgroundColor: "var(--primary)", color: "var(--primary-foreground)" }}
            >
              Nezáväzná konzultácia
            </Link>
            <button
              onClick={() => setOpen((value) => !value)}
              aria-label={open ? "Zavrieť menu" : "Otvoriť menu"}
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

      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            className="site-menu-layer pointer-events-auto"
            initial={reducedMotion ? false : "closed"}
            animate="open"
            exit="closed"
          >
            <motion.div
              className="site-menu-backdrop"
              onClick={closeMenu}
              aria-hidden="true"
              variants={{
                closed: reducedMotion
                  ? { opacity: 0 }
                  : { opacity: 0, backdropFilter: "blur(0px)" },
                open: reducedMotion ? { opacity: 1 } : { opacity: 1, backdropFilter: "blur(8px)" },
              }}
              transition={reducedMotion ? { duration: 0 } : { duration: 0.26, ease: premiumEase }}
            />
            <motion.aside
              id="site-navigation-drawer"
              ref={drawerRef}
              className="site-menu-drawer"
              role="dialog"
              aria-modal="true"
              aria-label="Navigácia"
              tabIndex={-1}
              variants={{
                closed: { x: reducedMotion ? 0 : "102%" },
                open: { x: 0 },
              }}
              transition={reducedMotion ? { duration: 0 } : liquidSpring}
            >
              <div className="site-menu-head">
                <Link to="/" onClick={closeMenu} aria-label="Domov" className="site-menu-brand">
                  <Symbol size={38} />
                  <span>
                    Daniel Vendzúr
                    <small>weby a nástroje na mieru</small>
                  </span>
                </Link>
                <button className="site-menu-close" type="button" onClick={closeMenu}>
                  Zavrieť <MenuIcon open />
                </button>
              </div>

              <div className="site-menu-content">
                <p className="site-menu-eyebrow">Navigácia</p>
                <LineSidebar items={drawerItems} onItemClick={closeMenu} />
              </div>

              <div className="site-menu-footer">
                <button
                  className="site-menu-cta"
                  type="button"
                  onClick={() => {
                    closeMenu();
                    window.setTimeout(() => openSiteAssistant({ source: "sidebar" }), 120);
                  }}
                >
                  <span>
                    <small>Máte nápad?</small>
                    Prejdime si ho spolu
                  </span>
                  <ArrowUpRight size={20} />
                </button>
                <a className="site-menu-email" href={`mailto:${siteConfig.contact.email}`}>
                  <Mail size={14} /> {siteConfig.contact.email}
                </a>
              </div>
            </motion.aside>
          </motion.div>
        ) : null}
      </AnimatePresence>
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
