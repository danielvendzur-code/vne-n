import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";
import "@/components/site/BrandStudioProjectsPage.css";
import { liveTools, realizations } from "@/data/realizations";
import { breadcrumbJsonLd, seo, SITE_URL } from "@/lib/seo";

const realizationsJsonLd = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Realizácie — weby a nástroje, ktoré bežia naživo",
  url: `${SITE_URL}/projekty`,
  mainEntity: {
    "@type": "ItemList",
    itemListElement: realizations.map((project, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: project.name,
      url: project.href,
      description: project.result,
    })),
  },
});

export const Route = createFileRoute("/projekty/")({
  head: () => ({
    ...seo({
      title: "Realizácie — Môj Chatbot",
      description:
        "Reálne nasadené weby a nástroje: DERAT, Môj Plot, Koverta a WEBKO. Pozrite si projekty, ktoré si môžete otvoriť a overiť.",
      path: "/projekty",
    }),
    scripts: [
      {
        type: "application/ld+json",
        children: breadcrumbJsonLd([{ name: "Realizácie", path: "/projekty" }]),
      },
      { type: "application/ld+json", children: realizationsJsonLd },
    ],
  }),
  component: ProjectsPage,
});

function ProjectsPage() {
  const feature = realizations[0];
  const rest = realizations.slice(1, 4);

  return (
    <div className="brand-projects-page">
      <section className="brand-projects-intro">
        <div className="brand-projects-shell">
          <motion.div
            className="brand-projects-eyebrow"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            Realizácie
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          >
            Nie prezentácie. <span>Reálne nasadené weby.</span>
          </motion.h1>
          <div className="brand-projects-intro__bottom">
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.12 }}
            >
              Každý projekt nižšie si môžete otvoriť. Ukazujeme radšej menej práce vo väčšom
              formáte, než veľa malých makiet bez kontextu.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.18 }}
            >
              <Link to="/kontakt">
                Prebrať vlastný projekt <ArrowRight size={16} />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {feature ? (
        <section className="brand-projects-feature">
          <div className="brand-projects-shell">
            <motion.div
              className="brand-projects-feature__head"
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
            >
              <div>
                <span className="brand-projects-meta">Vybraná realizácia · {feature.domain}</span>
                <h2>{feature.name}</h2>
              </div>
              <div>
                <p>{feature.detail}</p>
                <div className="brand-projects-feature__actions">
                  <a href={feature.href} target="_blank" rel="noreferrer">
                    Otvoriť živý web <ArrowUpRight size={16} />
                  </a>
                  {feature.caseStudyPath ? (
                    <Link to={feature.caseStudyPath}>Pozrieť prípadovú štúdiu <ArrowRight size={16} /></Link>
                  ) : null}
                </div>
              </div>
            </motion.div>

            <motion.a
              className="brand-projects-feature__media"
              href={feature.href}
              target="_blank"
              rel="noreferrer"
              initial={{ clipPath: "inset(8% 0 8% 0)" }}
              whileInView={{ clipPath: "inset(0% 0 0% 0)" }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            >
              <img src={feature.image} alt={feature.alt} />
              <span>{feature.domain} <ArrowUpRight size={15} /></span>
            </motion.a>
          </div>
        </section>
      ) : null}

      <section className="brand-projects-grid-section">
        <div className="brand-projects-shell">
          <motion.div
            className="brand-projects-grid-heading"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="brand-projects-meta">Ďalšie projekty</span>
            <h2>Každý má inú úlohu. Preto ani nevyzerajú rovnako.</h2>
          </motion.div>

          <div className="brand-projects-grid">
            {rest.map((project, index) => (
              <motion.article
                className="brand-projects-project"
                key={project.name}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.18 }}
                transition={{ duration: 0.7, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
              >
                <a
                  className="brand-projects-project__media"
                  href={project.href}
                  target="_blank"
                  rel="noreferrer"
                >
                  <img src={project.image} alt={project.alt} />
                </a>
                <div className="brand-projects-project__head">
                  <div>
                    <span className="brand-projects-meta">{project.domain}</span>
                    <h3>{project.name}</h3>
                  </div>
                  <ArrowUpRight size={20} />
                </div>
                <p>{project.result}</p>
                <div className="brand-projects-project__links">
                  <a href={project.href} target="_blank" rel="noreferrer">
                    Otvoriť web <ArrowUpRight size={15} />
                  </a>
                  {project.caseStudyPath ? (
                    <Link to={project.caseStudyPath}>Prípadová štúdia <ArrowRight size={15} /></Link>
                  ) : null}
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="brand-projects-tools">
        <div className="brand-projects-shell brand-projects-tools__inner">
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="brand-projects-tools__label">Živé nástroje</span>
            <h2>Ukážky, ktoré sa dajú rovno vyskúšať.</h2>
          </motion.div>
          <div className="brand-projects-tools__list">
            {liveTools.map((tool) => (
              <a key={tool.name} href={tool.href} target="_blank" rel="noreferrer">
                <div>
                  <b>{tool.name}</b>
                  <span>{tool.note}</span>
                </div>
                <ArrowUpRight size={18} />
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
