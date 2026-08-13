import { createFileRoute } from "@tanstack/react-router";
import { BarChart3, Cookie, Fingerprint, ShieldCheck } from "lucide-react";
import { openAnalyticsPreferences } from "@/components/site/AnalyticsConsent";
import { PageIntro, Reveal } from "@/components/site/motion-primitives";
import { siteConfig } from "@/config/site";
import { breadcrumbJsonLd, seo } from "@/lib/seo";
import "./cookies.css";

const googleAnalyticsEnabled = /^G-[A-Z0-9]+$/i.test(
  import.meta.env.VITE_GA_MEASUREMENT_ID?.trim() || "",
);

export const Route = createFileRoute("/cookies")({
  head: () => ({
    ...seo({
      title: "Cookies a meranie návštevnosti — Môj Chatbot",
      description:
        "Prehľad technológií používaných na meranie návštevnosti: cookie-free Vercel Analytics a voliteľný Google Analytics iba po súhlase.",
      path: "/cookies",
    }),
    scripts: [
      {
        type: "application/ld+json",
        children: breadcrumbJsonLd([{ name: "Cookies a analytika", path: "/cookies" }]),
      },
    ],
  }),
  component: CookiesPage,
});

function CookiesPage() {
  return (
    <div className="cookies-page">
      <PageIntro
        eyebrow="Súkromie a analytika"
        title={
          <>
            Meranie návštevnosti <em>pod vašou kontrolou.</em>
          </>
        }
        lead="Vercel Web Analytics používame bez analytických cookies. Google Analytics sa spustí iba vtedy, keď je na webe nakonfigurovaný a návštevník ho výslovne povolí."
      />

      <section className="cookies-section">
        <div className="container-page cookies-grid">
          <Reveal className="cookies-card" direction="left">
            <span className="cookies-card__icon" aria-hidden="true">
              <Cookie />
            </span>
            <p className="cookies-card__kicker">01 / Cookies</p>
            <h2>Bez súhlasu nespúšťame Google Analytics.</h2>
            <p>
              Základné meranie cez Vercel Analytics funguje bez analytických cookies. Google
              Analytics sa načíta až po voľbe „Povoliť analytiku“ a pri jeho používaní môžu byť
              uložené analytické cookies podľa nastavenia služby Google.
            </p>
          </Reveal>

          <Reveal className="cookies-card" direction="right" delay={0.06}>
            <span className="cookies-card__icon" aria-hidden="true">
              <BarChart3 />
            </span>
            <p className="cookies-card__kicker">02 / Vercel Analytics</p>
            <h2>Cookie-free súhrnné meranie</h2>
            <p>
              Zobrazujú sa súhrnné počty návštev, otvorené stránky, zdroje návštevnosti, krajina,
              typ zariadenia a prehliadač. Údaje používame na zlepšovanie obsahu, použiteľnosti a
              technickej kvality webu.
            </p>
            <div className="cookies-status">
              <span>Režim merania</span>
              <b>Bez analytických cookies</b>
              <p>Obsah formulára ani chatbota sa do analytiky neposiela.</p>
            </div>
          </Reveal>

          <Reveal className="cookies-card" direction="left" delay={0.1}>
            <span className="cookies-card__icon" aria-hidden="true">
              <Fingerprint />
            </span>
            <p className="cookies-card__kicker">03 / Google Analytics</p>
            <h2>{googleAnalyticsEnabled ? "Aktívny iba po súhlase" : "Pripravený, zatiaľ neaktivovaný"}</h2>
            <p>
              {googleAnalyticsEnabled
                ? "Google Analytics 4 je nakonfigurovaný, ale kód sa načíta až po výslovnom súhlase návštevníka. Súhlas sa dá kedykoľvek zmeniť."
                : "Integrácia je v kóde pripravená, ale bez platného Google Measurement ID sa Google Analytics vôbec nenačíta ani neodosiela žiadne dáta."}
            </p>
            {googleAnalyticsEnabled ? (
              <button type="button" className="sp-button sp-button--ghost" onClick={openAnalyticsPreferences}>
                Zmeniť nastavenie analytiky
              </button>
            ) : null}
          </Reveal>

          <Reveal className="cookies-card" direction="right" delay={0.14}>
            <span className="cookies-card__icon" aria-hidden="true">
              <ShieldCheck />
            </span>
            <p className="cookies-card__kicker">04 / Právny základ</p>
            <h2>Rozlišujeme cookie-free meranie a súhlas.</h2>
            <p>
              Cookie-free Vercel Analytics používame na základe oprávneného záujmu na zlepšovaní a
              bezpečnej prevádzke webu. Google Analytics používame iba po súhlase návštevníka; bez
              súhlasu sa jeho skript nenačíta.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="cookies-contact">
        <div className="container-page">
          <p>
            Otázky k súkromiu:{" "}
            <a href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</a>
          </p>
          <small>Posledná aktualizácia: 13. augusta 2026</small>
        </div>
      </section>
    </div>
  );
}
