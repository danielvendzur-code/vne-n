import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Symbol } from "@/components/Symbol";
import { siteConfig } from "@/config/site";
import { openSiteAssistant } from "@/lib/site-assistant";

export function Nav() {
  const [open, setOpen] = useState(false);

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
    <header
      className="sticky top-0 z-40 backdrop-blur"
      style={{
        backgroundColor: "color-mix(in oklab, var(--background) 90%, transparent)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <div className="container-page flex items-center justify-between h-14 md:h-16">
        <Link to="/" className="flex items-center gap-2" aria-label="Domov">
          <Symbol size={32} />
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {siteConfig.nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="text-sm transition-colors"
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
            className="hidden sm:inline-flex items-center rounded-md px-3.5 py-2 text-sm font-medium transition-colors"
            style={{ backgroundColor: "var(--primary)", color: "var(--primary-foreground)" }}
          >
            Nájsť riešenie
          </button>
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Zavrieť menu" : "Otvoriť menu"}
            aria-expanded={open}
            className="md:hidden inline-flex h-11 w-11 items-center justify-center rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
            style={{
              border: "1px solid var(--border-strong)",
              // @ts-expect-error CSS var
              "--tw-ring-color": "var(--primary)",
              "--tw-ring-offset-color": "var(--background)",
            }}
          >
            <MenuIcon open={open} />
          </button>
        </div>
      </div>

      {open && (
        <div
          className="md:hidden"
          style={{ borderTop: "1px solid var(--border)", backgroundColor: "var(--background)" }}
        >
          <div className="container-page py-4 flex flex-col gap-1">
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
              className="mt-3 rounded-md px-4 py-3 text-sm font-medium text-left"
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
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <line
        x1="3"
        y1={open ? "10" : "7"}
        x2="17"
        y2={open ? "10" : "7"}
        stroke="var(--text-primary)"
        strokeWidth="1.5"
        strokeLinecap="round"
        style={{
          transform: open ? "rotate(45deg)" : "none",
          transformOrigin: "10px 10px",
          transition: "transform 180ms ease, y1 180ms ease, y2 180ms ease",
        }}
      />
      <line
        x1="3"
        y1={open ? "10" : "13"}
        x2="17"
        y2={open ? "10" : "13"}
        stroke="var(--text-primary)"
        strokeWidth="1.5"
        strokeLinecap="round"
        style={{
          transform: open ? "rotate(-45deg)" : "none",
          transformOrigin: "10px 10px",
          transition: "transform 180ms ease, y1 180ms ease, y2 180ms ease",
        }}
      />
    </svg>
  );
}
