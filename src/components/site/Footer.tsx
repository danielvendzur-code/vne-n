import { Link } from "@tanstack/react-router";
import { Symbol } from "@/components/Symbol";
import { openSiteAssistant } from "@/lib/site-assistant";

export function Footer() {
  return (
    <footer className="mt-20 md:mt-28" style={{ borderTop: "1px solid var(--border)" }}>
      <div className="container-page py-12 grid gap-10 md:grid-cols-12">
        <div className="md:col-span-5 flex items-start gap-3">
          <Symbol size={32} />
          <p className="text-sm max-w-xs" style={{ color: "var(--text-secondary)", lineHeight: 1.55 }}>
            Chatboty, kalkulačky a interaktívne nástroje pre firemné weby.
          </p>
        </div>

        <div className="md:col-span-4">
          <div className="eyebrow mb-3">Prehľad</div>
          <ul className="space-y-2 text-sm">
            <li><Link to="/sluzby" style={{ color: "var(--text-primary)" }}>Čo tvorím</Link></li>
            <li><Link to="/projekty" style={{ color: "var(--text-primary)" }}>Ukážky</Link></li>
            <li><Link to="/postup" style={{ color: "var(--text-primary)" }}>Ako prebieha spolupráca</Link></li>
            <li>
              <Link to="/" hash="cena" style={{ color: "var(--text-primary)" }}>
                Cena
              </Link>
            </li>
            <li>
              <button
                onClick={() => openSiteAssistant({ source: "footer-contact" })}
                className="text-left"
                style={{ color: "var(--text-primary)" }}
              >
                Kontakt
              </button>
            </li>
          </ul>
        </div>

        <div className="md:col-span-3">
          <div className="eyebrow mb-3">Rýchly krok</div>
          <button
            onClick={() => openSiteAssistant({ source: "footer" })}
            className="inline-flex rounded-md px-3.5 py-2 text-sm font-medium"
            style={{ backgroundColor: "var(--primary)", color: "var(--primary-foreground)" }}
          >
            Nájsť riešenie
          </button>
        </div>
      </div>
      <div
        className="container-page py-5 text-xs"
        style={{ color: "var(--text-light)", borderTop: "1px solid var(--border)" }}
      >
        <span>© {new Date().getFullYear()}</span>
      </div>
    </footer>
  );
}
