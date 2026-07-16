import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Mail, Phone } from "lucide-react";
import { Symbol } from "@/components/Symbol";
import { openSiteAssistant } from "@/lib/site-assistant";

export function Footer() {
  return (
    <footer className="premium-footer">
      <div className="container-page premium-footer-main">
        <div className="premium-footer-brand">
          <Symbol size={36} />
          <p>Daniel Vendzúr · weby, chatboty a digitálne nástroje navrhnuté na mieru.</p>
        </div>

        <div>
          <p className="premium-footer-label">Navigácia</p>
          <nav className="premium-footer-links" aria-label="Navigácia v pätičke">
            <Link to="/sluzby">Čo tvorím</Link>
            <Link to="/projekty">Ukážky</Link>
            <Link to="/postup">Spolupráca</Link>
            <Link to="/kontakt">Kontakt</Link>
          </nav>
        </div>

        <div>
          <p className="premium-footer-label">Priamy kontakt</p>
          <div className="premium-footer-links">
            <a href="mailto:info@webko.sk">
              <Mail size={15} /> info@webko.sk
            </a>
            <a href="tel:+421910893949">
              <Phone size={15} /> +421 910 893 949
            </a>
            <button onClick={() => openSiteAssistant({ source: "footer" })}>
              Otvoriť krátky dopyt <ArrowUpRight size={15} />
            </button>
          </div>
        </div>
      </div>
      <div className="container-page premium-footer-bottom">
        <span>© {new Date().getFullYear()} · Daniel Vendzúr</span>
        <span>Navrhnuté pre jasný ďalší krok.</span>
      </div>
    </footer>
  );
}
