import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { BrandMark } from "@/components/BrandMark";
import { siteConfig } from "@/config/site";
import { realizations } from "@/data/realizations";
import styles from "./SiteChrome.module.css";
import actions from "./WebsiteAction.module.css";

/** Tmavá pätička podľa Koverty: veľká výzva hore, stĺpce odkazov pod ňou. */
export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerWrap}>
        <div className={styles.footerCta}>
          <div>
            <p className={styles.label}>Od nápadu po nasadenie</p>
            <h2>Web, ktorý odpovie, spočíta aj poradí.</h2>
          </div>
          <Link to="/kontakt" className={`${actions.action} ${actions.lime}`}>
            Nezáväzný návrh <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>

        <div className={styles.footerGrid}>
          <div className={styles.footerBrand}>
            <Link to="/" className={styles.brand}>
              <BrandMark size={34} />
              Môj Chatbot
            </Link>
            <p>
              Chatboty, cenové kalkulačky, 3D konfigurátory a produktoví poradcovia na mieru pre
              e-shopy aj firmy so službami.
            </p>
          </div>

          <div className={styles.footerCol}>
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

          <div className={styles.footerCol}>
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

          <div className={styles.footerCol}>
            <h3>Kontakt</h3>
            <ul>
              <li>
                <a href={`tel:${siteConfig.contact.phoneHref}`}>{siteConfig.contact.phoneLabel}</a>
              </li>
              <li>
                <a href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</a>
              </li>
            </ul>
            <div className={styles.footerContact}>
              <Link to="/kontakt">Kontaktný formulár</Link>
            </div>
          </div>
        </div>

        <div className={styles.footerBottom}>
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
