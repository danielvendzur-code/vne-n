import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { BrandMark } from "@/components/BrandMark";
import { siteConfig } from "@/config/site";
import { liveTools, realizations } from "@/data/realizations";
import "./Footer2.css";

const NAV = [
  { to: "/sluzby", label: "Riešenia" },
  { to: "/preco-chatbot", label: "Čo to prinesie webu" },
  { to: "/projekty", label: "Realizácie" },
  { to: "/cennik", label: "Cena" },
  { to: "/postup", label: "Spolupráca" },
  { to: "/kontakt", label: "Kontakt" },
] as const;

/**
 * Pätička nového webu.
 *
 * Tmavá lesná plocha, ktorá stránku zavrie tým istým tónom, akým ju
 * otvorila opona. Odkazy sú indexy, nie stĺpce odrážok.
 */
export function Footer2() {
  return (
    <footer className="mc2-footer mc2-dark">
      <div className="mc2-shell mc2-footer__inner">
        <div className="mc2-footer__brand">
          <BrandMark size={38} />
          <p className="mc2-footer__claim">
            Chatboty, kalkulačky a konfigurátory na mieru. Pre e-shopy aj pre firmy so službami.
          </p>
        </div>

        <nav className="mc2-footer__col" aria-label="Navigácia v pätičke">
          <p className="mc2-footer__label">Web</p>
          {NAV.map((item) => (
            <Link key={item.to} to={item.to} className="mc2-footer__link">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="mc2-footer__col">
          <p className="mc2-footer__label">Živé weby a nástroje</p>
          {realizations.map((project) => (
            <a
              key={project.name}
              href={project.href}
              target="_blank"
              rel="noreferrer"
              className="mc2-footer__link"
            >
              {project.domain}
              <ArrowUpRight aria-hidden="true" />
            </a>
          ))}
          {liveTools.map((tool) => (
            <a
              key={tool.name}
              href={tool.href}
              target="_blank"
              rel="noreferrer"
              className="mc2-footer__link"
            >
              {tool.name}
              <ArrowUpRight aria-hidden="true" />
            </a>
          ))}
        </div>

        <div className="mc2-footer__col">
          <p className="mc2-footer__label">Kontakt</p>
          <a href={`mailto:${siteConfig.contact.email}`} className="mc2-footer__link">
            {siteConfig.contact.email}
          </a>
          <a href={`tel:${siteConfig.contact.phoneHref}`} className="mc2-footer__link">
            {siteConfig.contact.phoneLabel}
          </a>
          <p className="mc2-footer__note">Odpovieme do jedného pracovného dňa.</p>
        </div>
      </div>

      <div className="mc2-shell mc2-footer__base">
        <p>© {new Date().getFullYear()} Môj Chatbot</p>
        <nav aria-label="Právne informácie">
          <Link to="/ochrana-udajov">Ochrana údajov</Link>
          <Link to="/cookies">Cookies</Link>
        </nav>
      </div>
    </footer>
  );
}
