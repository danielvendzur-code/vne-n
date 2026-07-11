import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Symbol } from "@/components/Symbol";
import { siteConfig } from "@/config/site";
import { openSiteAssistant } from "@/lib/site-assistant";

export function Nav() {
  const [open, setOpen] = useState(false);
  return (
    <header
      className="sticky top-0 z-40 backdrop-blur"
      style={{
        backgroundColor: "color-mix(in oklab, var(--background) 88%, transparent)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <div className="container-page flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2" aria-label="Domov">
          <Symbol />
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
            Napísať zadanie
          </button>
          <button
            onClick={() => setOpen((v) => !v)}
            className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-md"
            style={{ border: "1px solid var(--border)" }}
            aria-label="Menu"
          >
            <span className="block h-[1.5px] w-4" style={{ backgroundColor: "var(--text-primary)" }} />
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t" style={{ borderColor: "var(--border)" }}>
          <div className="container-page py-3 flex flex-col gap-1">
            {siteConfig.nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="py-2 text-sm"
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
              className="mt-2 rounded-md px-3.5 py-2 text-sm font-medium text-left"
              style={{ backgroundColor: "var(--primary)", color: "var(--primary-foreground)" }}
            >
              Napísať zadanie
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
