import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Mail, Phone } from "lucide-react";
import { BrandMark } from "@/components/BrandMark";
import { siteConfig } from "@/config/site";
import { liveTools, realizations } from "@/data/realizations";
import { openSiteAssistant } from "@/lib/site-assistant";

export function Footer() {
  return (
    <footer className="premium-footer">
      <div className="container-page premium-footer-main">
        <div className="premium-footer-brand">
          <BrandMark size={36} />
          <p>Môj Chatbot · chatboty, kalkulačky a konfigurátory navrhnuté na mieru.</p>
          <p className="premium-footer-note">
            Napíšte nám, s čím má web pomôcť. Ozveme sa zvyčajne do jedného pracovného dňa.
          </p>
        </div>

        <div>
          <p className="premium-footer-label">Navigácia</p>
          <nav className="premium-footer-links" aria-label="Navigácia v pätičke">
            <Link to="/sluzby">Čo tvoríme</Link>
            <Link to="/preco-chatbot">Čo to prinesie webu</Link>
            <Link to="/projekty">Realizácie</Link>
            <Link to="/cennik">Cena</Link>
            <Link to="/postup">Spolupráca</Link>
            <Link to="/kontakt">Kontakt</Link>
          </nav>
        </div>

        <div>
          <p className="premium-footer-label">Živé weby a nástroje</p>
          <div className="premium-footer-links">
            {realizations.map((project) => (
              <a key={project.name} href={project.href} target="_blank" rel="noreferrer">
                {project.domain} <ArrowUpRight size={13} />
              </a>
            ))}
            {liveTools.map(({ name, href }) => (
              <a key={name} href={href} target="_blank" rel="noreferrer">
                {name} <ArrowUpRight size={13} />
              </a>
            ))}
          </div>
        </div>

        <div>
          <p className="premium-footer-label">Kontakt na tím</p>
          <div className="premium-footer-links">
            <a href={`mailto:${siteConfig.contact.email}`}>
              <Mail size={15} /> {siteConfig.contact.email}
            </a>
            <a href={`mailto:${siteConfig.contact.emailPersonal}`}>
              <Mail size={15} /> {siteConfig.contact.emailPersonal}
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
        <span>© {new Date().getFullYear()} · Môj Chatbot</span>
        <span className="premium-footer-privacy">
          <Link to="/ochrana-udajov">Ochrana osobných údajov</Link>
          <Link to="/cookies">Cookies a analytika</Link>
        </span>
      </div>
    </footer>
  );
}
