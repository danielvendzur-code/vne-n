import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { BrandMark } from "@/components/BrandMark";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import "./Nav2.css";

const LINKS = [
  { to: "/sluzby", label: "Riešenia" },
  { to: "/projekty", label: "Realizácie" },
  { to: "/cennik", label: "Cena" },
  { to: "/postup", label: "Spolupráca" },
] as const;

/**
 * Hlavička nového webu.
 *
 * Plochá lišta s vlasovou linkou, nie plávajúca pilulka — tá bola z tých
 * prvkov, ktoré starý web robili generickým. Na vrchu stránky je linka
 * priehľadná a hlavička splýva s papierom; po odscrollovaní sa linka
 * objaví a podklad stmavne. Hovorí to, že už nie ste na začiatku, a nič
 * viac.
 *
 * Či je stránka odscrollovaná, hlási bod na začiatku dokumentu, nie
 * posluchač scrollu — ten by sa ozval pri každom pohybe prsta.
 */
export function Nav2() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  useFocusTrap(drawerRef, open, () => setOpen(false));

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(([entry]) => setScrolled(!entry?.isIntersecting), {
      threshold: 0,
    });
    observer.observe(sentinel);
    return () => observer.disconnect();
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
      <div ref={sentinelRef} className="mc2-nav-sentinel" aria-hidden="true" />
      <header className="mc2-nav" data-scrolled={scrolled}>
        <div className="mc2-shell mc2-nav__inner">
          <Link to="/" className="mc2-nav__brand" aria-label="Môj Chatbot — domov">
            <BrandMark size={30} />
            <span>Môj Chatbot</span>
          </Link>

          <nav className="mc2-nav__links" aria-label="Hlavná navigácia">
            {LINKS.map((item) => (
              <Link key={item.to} to={item.to} className="mc2-nav__link">
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="mc2-nav__actions">
            <Link to="/kontakt" className="mc2-nav__cta">
              Nezáväzná konzultácia
              <ArrowRight aria-hidden="true" />
            </Link>
            <button
              type="button"
              className="mc2-nav__toggle"
              aria-expanded={open}
              aria-controls="mc2-nav-drawer"
              onClick={() => setOpen((value) => !value)}
            >
              {open ? "Zavrieť" : "Menu"}
            </button>
          </div>
        </div>
      </header>

      {open ? (
        <div className="mc2-nav__drawer" id="mc2-nav-drawer" ref={drawerRef}>
          <nav aria-label="Navigácia">
            {LINKS.map((item, index) => (
              <Link
                key={item.to}
                to={item.to}
                className="mc2-nav__drawer-link"
                style={{ "--i": index } as React.CSSProperties}
                onClick={() => setOpen(false)}
              >
                <b>{`0${index + 1}`}</b>
                {item.label}
              </Link>
            ))}
            <Link
              to="/kontakt"
              className="mc2-nav__drawer-link"
              style={{ "--i": LINKS.length } as React.CSSProperties}
              onClick={() => setOpen(false)}
            >
              <b>{`0${LINKS.length + 1}`}</b>
              Kontakt
            </Link>
          </nav>
        </div>
      ) : null}
    </>
  );
}
