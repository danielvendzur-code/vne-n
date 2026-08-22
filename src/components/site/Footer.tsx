import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { BrandMark } from "@/components/BrandMark";
import { siteConfig } from "@/config/site";
import { realizations } from "@/data/realizations";

export function Footer() {
  return (
    <footer className="premium-footer">
      <div className="container-page premium-footer-main">
        <div className="premium-footer-brand">
          <BrandMark size={42} />
          <p>Digitálne predajné nástroje na mieru pre e-shopy aj firmy so službami.</p>
          <p className="premium-footer-note">
            Chatboty, kalkulačky, konfigurátory a produktoví poradcovia — navrhnuté podľa toho, čo
            má zákazník na vašom webe dosiahnuť.
          </p>
        </div>

        <div>
          <p className="premium-footer-label">Navigácia</p>
          <nav className="premium-footer-links" aria-label="Navigácia v pätičke">
            <Link to="/sluzby">Riešenia</Link>
            <a href="/#pre-eshopy">Pre e-shopy</a>
            <Link to="/projekty">Realizácie</Link>
            <Link to="/postup">Ako to funguje</Link>
            <Link to="/cennik">Cena</Link>
            <Link to="/kontakt">Kontakt</Link>
          </nav>
        </div>

        <div>
          <p className="premium-footer-label">Živá práca</p>
          <div className="premium-footer-links">
            {realizations.map((project) => (
              <a key={project.name} href={project.href} target="_blank" rel="noreferrer">
                {project.domain} <ArrowUpRight size={12} aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <p className="premium-footer-label">Kontakt</p>
          <div className="premium-footer-links">
            <a href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</a>
            <a href={`tel:${siteConfig.contact.phoneHref}`}>{siteConfig.contact.phoneLabel}</a>
            <Link to="/kontakt">
              Začať projekt <ArrowUpRight size={12} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>

      <div className="container-page premium-footer-bottom">
        <span>© {new Date().getFullYear()} Môj Chatbot</span>
        <span className="premium-footer-privacy">
          <Link to="/ochrana-udajov">Ochrana osobných údajov</Link>
          <Link to="/cookies">Cookies</Link>
        </span>
      </div>
    </footer>
  );
}
