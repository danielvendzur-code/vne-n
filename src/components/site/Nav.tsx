import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Symbol } from "@/components/Symbol";
import { siteConfig } from "@/config/site";
import { openSiteAssistant } from "@/lib/site-assistant";

export function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-40 py-3 md:py-4 pointer-events-none">
      <div
        className="container-page flex items-center justify-between h-13 md:h-15"
        style={{ height: undefined }}
      >
        <div
          className="flex items-center justify-between w-full rounded-[20px] px-3 md:px-4 pointer-events-auto backdrop-blur-xl transition-[background-color,border-color,box-shadow]"
          style={{
            minHeight: 56,
            backgroundColor: scrolled
              ? "color-mix(in oklab, var(--surface) 92%, transparent)"
              : "color-mix(in oklab, var(--surface) 74%, transparent)",
            border: "1px solid var(--border)",
            boxShadow: scrolled
              ? "0 12px 34px rgba(16, 38, 31, 0.08)"
              : "0 4px 20px rgba(16, 38, 31, 0.035)",
          }}
        >
          <Link to="/" className="flex items-center gap-2" aria-label="Domov">
            <Symbol size={34} />
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {siteConfig.nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="text-[13.5px] tracking-tight transition-colors"
                activeProps={{ style: { color: "var(--primary)" } }}
                inactiveProps={{ style: { color: "var(--text-secondary)" } }}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={() => openSiteAssistant({ source: "nav" })}
              className="hidden sm:inline-flex items-center rounded-[10px] px-3.5 py-2 text-[13.5px] font-medium transition-colors"
              style={{ backgroundColor: "var(--primary)", color: "var(--primary-foreground)" }}
            >
              Nájsť riešenie
            </button>
            <button
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Zavrieť menu" : "Otvoriť menu"}
              aria-expanded={open}
              className="md:hidden inline-flex h-11 w-11 items-center justify-center rounded-[10px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
              style={{
                border: "1px solid var(--border-strong)",
                backgroundColor: "var(--surface)",
                // @ts-expect-error CSS var
                "--tw-ring-color": "var(--primary)",
                "--tw-ring-offset-color": "var(--background)",
              }}
            >
              <MenuIcon open={open} />
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div className="md:hidden pointer-events-auto">
          <div
            className="container-page mt-2 py-4 flex flex-col gap-1 rounded-[18px]"
            style={{
              backgroundColor: "var(--surface)",
              border: "1px solid var(--border)",
              boxShadow: "0 18px 48px rgba(16, 38, 31, 0.12)",
            }}
          >
            {siteConfig.nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="py-2.5 text-base"
                style={{ color: "var(--text-primary)" }}
              >
                {item.label}
              </Link>
            ))}
            <button
              onClick={() => {
                setOpen(false);
                openSiteAssistant({ source: "nav-mobile" });
              }}
              className="mt-3 rounded-[10px] px-4 py-3 text-sm font-medium text-left"
              style={{ backgroundColor: "var(--primary)", color: "var(--primary-foreground)" }}
            >
              Nájsť riešenie
            </button>
          </div>
        </div>
      )}
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
        stroke="var(--text-primary)"
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
        stroke="var(--text-primary)"
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
