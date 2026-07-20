import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Mail, Phone } from "lucide-react";
import { Symbol } from "@/components/Symbol";
import { siteConfig } from "@/config/site";
import { openSiteAssistant } from "@/lib/site-assistant";

const liveTools = [
  ["DERAT kalkulačka", "https://derat-chatbot-backend.vercel.app/"],
  ["APLAN AI", "https://danielvendzur-code.github.io/aplan-chatbot-backend/"],
  ["Webový asistent", "https://danielvendzur-code.github.io/moj.chatbot.backend/"],
] as const;

export function Footer() {
  return (
    <footer className="premium-footer">
      <div className="container-page premium-footer-main">
        <div className="premium-footer-brand">
          <Symbol size={36} />
          <p>Daniel Vendžúr · chatboty, kalkulačky a konfigurátory navrhnuté na mieru.</p>
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
          <p className="premium-footer-label">Živé nástroje</p>
          <div className="premium-footer-links">
            {liveTools.map(([name, href]) => (
              <a key={name} href={href} target="_blank" rel="noreferrer">
                {name} <ArrowUpRight size={13} />
              </a>
            ))}
          </div>
        </div>

        <div>
          <p className="premium-footer-label">Priamy kontakt</p>
          <div className="premium-footer-links">
            <a href={`mailto:${siteConfig.contact.email}`}>
              <Mail size={15} /> {siteConfig.contact.email}
            </a>
            <a href={`tel:${siteConfig.contact.phoneHref}`}>
              <Phone size={15} /> {siteConfig.contact.phoneLabel}
            </a>
            <button onClick={() => openSiteAssistant({ source: "footer" })}>
              Otvoriť krátky dopyt <ArrowUpRight size={15} />
            </button>
          </div>
        </div>
      </div>
      <div className="container-page premium-footer-bottom">
        <span>© {new Date().getFullYear()} · Daniel Vendžúr</span>
        <span>Navrhnuté pre jasný ďalší krok.</span>
      </div>
    </footer>
  );
}
