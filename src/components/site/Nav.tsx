import { Link } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { BrandMark } from "@/components/BrandMark";
import { siteConfig } from "@/config/site";
import { useFocusTrap } from "@/hooks/useFocusTrap";

type NavTone = "dark" | "light";
type Rgb = readonly [number, number, number];

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

const NAV_PALETTE: Record<NavTone, { surface: Rgb; foreground: Rgb; accent: Rgb }> = {
  dark: {
    surface: [7, 27, 21],
    foreground: [246, 245, 238],
    accent: [200, 240, 106],
  },
  light: {
    surface: [242, 240, 232],
    foreground: [18, 56, 45],
    accent: [18, 56, 45],
  },
};

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));

const mixRgb = (from: Rgb, to: Rgb, progress: number) => {
  const amount = clamp01(progress);
  const channels = from.map((channel, index) =>
    Math.round(channel + (to[index] - channel) * amount),
  );
  return `rgb(${channels[0]} ${channels[1]} ${channels[2]})`;
};

const sectionTone = (section: HTMLElement | undefined): NavTone | null => {
  const value = section?.dataset.navTone;
  return value === "dark" || value === "light" ? value : null;
};

export function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [tone, setTone] = useState<NavTone>("dark");
  const headerRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const closeMenu = useCallback(() => setOpen(false), []);

  useFocusTrap(panelRef, open, closeMenu, menuButtonRef);

  useEffect(() => {
    let frame = 0;

    const updateTone = () => {
      const header = headerRef.current;
      if (!header) return;

      const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-nav-tone]"));
      if (sections.length === 0) return;

      const headerBottom = header.getBoundingClientRect().bottom;
      const sampleY = Math.min(window.innerHeight - 1, headerBottom + 22);
      const foundIndex = sections.findIndex((section) => {
        const rect = section.getBoundingClientRect();
        return rect.top <= sampleY && rect.bottom > sampleY;
      });
      const firstRect = sections[0].getBoundingClientRect();
      const activeIndex =
        foundIndex >= 0 ? foundIndex : sampleY < firstRect.top ? 0 : sections.length - 1;
      const active = sections[activeIndex] ?? sections[0];
      const activeTone = sectionTone(active) ?? "light";

      let fromTone: NavTone = activeTone;
      let toTone: NavTone = activeTone;
      let progress = 0;

      // Blend around one physical section boundary. The same formula is used on
      // both sides of the boundary, so crossing it cannot reset the progress.
      const blendRadius = Math.max(90, Math.min(150, window.innerHeight * 0.13));
      let nearestBoundaryDistance = Number.POSITIVE_INFINITY;

      for (let index = 0; index < sections.length - 1; index += 1) {
        const currentTone = sectionTone(sections[index]);
        const nextTone = sectionTone(sections[index + 1]);
        if (!currentTone || !nextTone || currentTone === nextTone) continue;

        const currentRect = sections[index].getBoundingClientRect();
        const nextRect = sections[index + 1].getBoundingClientRect();
        const boundaryY = (currentRect.bottom + nextRect.top) / 2;
        const distance = Math.abs(sampleY - boundaryY);

        if (distance > blendRadius || distance >= nearestBoundaryDistance) continue;

        nearestBoundaryDistance = distance;
        fromTone = currentTone;
        toTone = nextTone;
        progress = clamp01((sampleY - (boundaryY - blendRadius)) / (blendRadius * 2));
      }

      const fromPalette = NAV_PALETTE[fromTone];
      const toPalette = NAV_PALETTE[toTone];
      header.style.setProperty("--nav-surface", mixRgb(fromPalette.surface, toPalette.surface, progress));
      header.style.setProperty(
        "--nav-foreground",
        mixRgb(fromPalette.foreground, toPalette.foreground, progress),
      );
      header.style.setProperty("--nav-accent", mixRgb(fromPalette.accent, toPalette.accent, progress));
      header.style.setProperty("--nav-blend", progress.toFixed(3));
      header.dataset.toneFrom = fromTone;
      header.dataset.toneTo = toTone;

      const adaptiveHome = document.querySelector(".kage-home") !== null;
      if (adaptiveHome) {
        // On the home page the visible colors are driven exclusively by the
        // continuous CSS variables above. Keeping data-tone stable prevents
        // legacy dark/light selectors from snapping halfway through a blend.
        setTone((current) => (current === "dark" ? current : "dark"));
      } else {
        const resolvedTone = progress >= 0.5 ? toTone : fromTone;
        setTone((current) => (current === resolvedTone ? current : resolvedTone));
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
      <header ref={headerRef} className="site-header" data-scrolled={scrolled} data-tone={tone}>
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
