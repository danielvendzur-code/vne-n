import { ArrowUpRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { realizations } from "@/data/realizations";
import { Reveal2 } from "../Reveal2";
import "./Work.css";

const [lead, ...rest] = realizations;

/**
 * Realizácie.
 *
 * Predtým to boli štyri rovnaké karty, čo je presne to, čo z webu robí
 * katalóg namiesto dôkazu. DERAT tu vedie ako hlavná prípadová štúdia
 * cez celú šírku, ostatné projekty idú pod ním ako editorial riadky.
 * Screenshoty sú reálne a veľké — projekt má vyzerať ako projekt, nie
 * ako náhľad v malom boxe.
 */
export function Work() {
  return (
    <section className="mc2-work" id="realizacie">
      <div className="mc2-shell">
        <Reveal2 className="mc2-work__head">
          <p className="mc2-eyebrow">
            <b>02</b> Realizácie
          </p>
          <h2 className="mc2-title">Weby, ktoré si viete otvoriť a overiť.</h2>
          <p className="mc2-lead">
            Žiadne makety. Každý odkaz nižšie je nasadený web, na ktorom naše riešenie beží.
          </p>
        </Reveal2>

        {/* Hlavná prípadová štúdia. Dostáva celú šírku, pretože je to
            najsilnejší dôkaz, ktorý máme. */}
        <Reveal2 className="mc2-work__lead" as="article">
          <a
            className="mc2-work__lead-media"
            href={lead.href}
            target="_blank"
            rel="noreferrer"
            aria-label={`Otvoriť živý web ${lead.domain}`}
          >
            <img
              src={lead.image}
              alt={lead.alt}
              loading="lazy"
              decoding="async"
              width="1200"
              height="750"
            />
            <span className="mc2-work__badge">Živý web</span>
          </a>

          <div className="mc2-work__lead-copy">
            <p className="mc2-work__index">01 / Hlavná realizácia</p>
            <h3>{lead.name}</h3>
            <p className="mc2-work__type">{lead.type}</p>
            <p className="mc2-work__detail">{lead.detail}</p>
            <div className="mc2-work__actions">
              <a className="mc2-quiet" href={lead.href} target="_blank" rel="noreferrer">
                {lead.domain}
                <ArrowUpRight aria-hidden="true" />
              </a>
              {lead.caseStudyPath ? (
                <Link className="mc2-quiet" to={lead.caseStudyPath}>
                  Prípadová štúdia
                  <ArrowUpRight aria-hidden="true" />
                </Link>
              ) : null}
            </div>
          </div>
        </Reveal2>

        <ul className="mc2-work__rest">
          {rest.map((project, index) => (
            <Reveal2 as="li" className="mc2-work__row" key={project.name} delay={index * 0.05}>
              <a
                className="mc2-work__row-media"
                href={project.href}
                target="_blank"
                rel="noreferrer"
                aria-label={`Otvoriť živý web ${project.domain}`}
              >
                <img
                  src={project.image}
                  alt={project.alt}
                  loading="lazy"
                  decoding="async"
                  width="900"
                  height="600"
                />
              </a>
              <div className="mc2-work__row-copy">
                <p className="mc2-work__index">{`0${index + 2} / ${project.domain}`}</p>
                <h3>{project.name}</h3>
                <p className="mc2-work__type">{project.type}</p>
                <p className="mc2-work__detail">{project.result}</p>
                <a className="mc2-quiet" href={project.href} target="_blank" rel="noreferrer">
                  Otvoriť web
                  <ArrowUpRight aria-hidden="true" />
                </a>
              </div>
            </Reveal2>
          ))}
        </ul>
      </div>
    </section>
  );
}
