import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { BrandMark } from "@/components/BrandMark";
import { siteConfig } from "@/config/site";
import { realizations } from "@/data/realizations";
import "./SiteChrome.css";

/** Tmavá pätička podľa Koverty: veľká výzva hore, stĺpce odkazov pod ňou. */
export function Footer() {
  return (
    <footer className="mc-footer">
      <div className="mc-footer__wrap">
        <div className="mc-footer__cta">
          <div>
            <p className="mc-footer__label">Od nápadu po nasadenie</p>
            <h2>Web, ktorý odpovie, spočíta aj poradí.</h2>
          </div>
          <Link to="/kontakt" className="mc-footer__btn">
            Nezáväzný návrh <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>

        <div className="mc-footer__grid">
          <div className="mc-footer__brand">
            <Link to="/" className="mc-footer__logo">
              <BrandMark size={34} />
              Môj Chatbot
            </Link>
            <p>
              Chatboty, cenové kalkulačky, 3D konfigurátory a produktoví poradcovia na mieru pre
              e-shopy aj firmy so službami.
            </p>
          </div>

          <div className="mc-footer__col">
            <h3>Riešenia</h3>
            <ul>
              <li>
                <Link to="/sluzby">Všetky riešenia</Link>
              </li>
              <li>
                <Link to="/3d-konfigurator">3D konfigurátor</Link>
              </li>
              <li>
                <Link to="/cennik">Cenník</Link>
              </li>
              <li>
                <Link to="/postup">Ako to funguje</Link>
              </li>
            </ul>
          </div>

          <div className="mc-footer__col">
            <h3>Realizácie</h3>
            <ul>
              {realizations.map((project) => (
                <li key={project.name}>
                  <a href={project.href} target="_blank" rel="noreferrer">
                    {project.domain}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="mc-footer__col">
            <h3>Kontakt</h3>
            <ul>
              <li>
                <a href={`tel:${siteConfig.contact.phoneHref}`}>{siteConfig.contact.phoneLabel}</a>
              </li>
              <li>
                <a href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</a>
              </li>
            </ul>
            <div className="mc-footer__pills">
              <Link to="/kontakt">Kontaktný formulár</Link>
            </div>
          </div>
        </div>

        <div className="mc-footer__bottom">
          <span>
            © {new Date().getFullYear()} Môj Chatbot · {siteConfig.legal.operator}
          </span>
          <nav aria-label="Právne odkazy">
            <Link to="/pravne-informacie">Právne informácie</Link>
            <Link to="/ochrana-udajov">Ochrana osobných údajov</Link>
            <Link to="/cookies">Súbory cookie</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
