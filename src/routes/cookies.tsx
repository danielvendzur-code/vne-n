import { createFileRoute } from "@tanstack/react-router";
import { BarChart3, Cookie, RotateCcw, ShieldCheck } from "lucide-react";
import { PageIntro, Reveal } from "@/components/site/motion-primitives";
import { siteConfig } from "@/config/site";
import { openCookieSettings } from "@/lib/cookie-consent";
import { seo } from "@/lib/seo";
import "./cookies.css";

export const Route = createFileRoute("/cookies")({
  head: () => ({
    ...seo({
      title: "Používanie cookies — Daniel Vendžúr",
      description:
        "Prehľad cookies používaných na webe, ich účel, trvanie a možnosť kedykoľvek zmeniť súhlas.",
      path: "/cookies",
    }),
  }),
  component: CookiesPage,
});

function CookiesPage() {
  return (
    <div className="cookies-page">
      <PageIntro
        eyebrow="Súkromie a cookies"
        title={
          <>
            Jasné pravidlá. <em>Žiadne skryté sledovanie.</em>
          </>
        }
        lead="Nevyhnutné cookies používam iba na fungovanie webu a zapamätanie vašej voľby. Voliteľné analytické funkcie zostanú vypnuté, kým ich nepovolíte."
      >
        <button type="button" className="cookies-settings-button" onClick={openCookieSettings}>
          <Cookie aria-hidden="true" /> Otvoriť nastavenia cookies
        </button>
      </PageIntro>

      <section className="cookies-section">
        <div className="container-page cookies-grid">
          <Reveal className="cookies-card" amount={0.22}>
            <span className="cookies-card__icon" aria-hidden="true">
              <ShieldCheck />
            </span>
            <p className="cookies-card__kicker">01 / Nevyhnutné</p>
            <h2>Čo je aktívne vždy</h2>
            <p>
              Technické uloženie súhlasu je potrebné, aby sa cookie okno nezobrazovalo pri každej
              návšteve a web rešpektoval váš posledný výber.
            </p>
            <dl className="cookies-list">
              <div>
                <dt>Názov</dt>
                <dd>vendzur_cookie_consent</dd>
              </div>
              <div>
                <dt>Účel</dt>
                <dd>Uloženie voľby „všetko“ alebo „iba nevyhnutné“.</dd>
              </div>
              <div>
                <dt>Platnosť</dt>
                <dd>180 dní</dd>
              </div>
              <div>
                <dt>Typ</dt>
                <dd>Prvá strana, nevyhnutná</dd>
              </div>
            </dl>
          </Reveal>

          <Reveal className="cookies-card" delay={0.08} amount={0.22}>
            <span className="cookies-card__icon" aria-hidden="true">
              <BarChart3 />
            </span>
            <p className="cookies-card__kicker">02 / Analytické</p>
            <h2>Aktívne iba po súhlase</h2>
            <p>
              Udalosti z webu a asistenta sa môžu použiť na pochopenie toho, ktoré časti fungujú a
              ktoré treba zlepšiť. Bez súhlasu je analytický režim odmietnutý.
            </p>
            <div className="cookies-status">
              <span>Aktuálny stav nasadenia</span>
              <b>Bez externého analytického poskytovateľa</b>
              <p>
                Web momentálne nenačítava Google Analytics ani iný externý merací skript, takže sa
                nevytvárajú ďalšie analytické cookies.
              </p>
            </div>
          </Reveal>

          <Reveal className="cookies-card cookies-card--wide" delay={0.12} amount={0.22}>
            <span className="cookies-card__icon" aria-hidden="true">
              <RotateCcw />
            </span>
            <p className="cookies-card__kicker">03 / Zmena rozhodnutia</p>
            <h2>Súhlas môžete kedykoľvek upraviť.</h2>
            <p>
              Odkaz „Nastavenia cookies“ je trvalo v pätičke. Po vypnutí analytiky web odstráni
              známe analytické cookies, ak by boli v budúcnosti nasadené. Základný obsah zostáva
              dostupný bez ohľadu na voľbu.
            </p>
            <button type="button" className="cookies-settings-button" onClick={openCookieSettings}>
              Zmeniť nastavenie
            </button>
          </Reveal>
        </div>
      </section>

      <section className="cookies-contact">
        <div className="container-page">
          <p>
            Otázky k súkromiu:{" "}
            <a href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</a>
          </p>
          <small>Posledná aktualizácia: 20. júla 2026</small>
        </div>
      </section>
    </div>
  );
}
