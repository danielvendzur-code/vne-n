import { createFileRoute } from "@tanstack/react-router";
import { BarChart3, Cookie, Fingerprint, ShieldCheck } from "lucide-react";
import { Reveal } from "@/components/site/motion-primitives";
import { ShPage, ShPageHero } from "@/components/site/SubPage";
import { siteConfig } from "@/config/site";
import { openAnalyticsPreferences } from "@/lib/analytics-consent";
import { breadcrumbJsonLd, seo } from "@/lib/seo";
import "./cookies.css";

const googleAnalyticsEnabled = /^G-[A-Z0-9]+$/i.test(
  import.meta.env.VITE_GA_MEASUREMENT_ID?.trim() || "",
);

export const Route = createFileRoute("/cookies")({
  head: () => ({
    ...seo({
      title: "Súbory cookie a meranie návštevnosti — Môj Chatbot",
      description:
        "Prehľad technológií používaných na meranie návštevnosti: Vercel Analytics bez súborov cookie a voliteľný Google Analytics iba po súhlase.",
      path: "/cookies",
    }),
    scripts: [
      {
        type: "application/ld+json",
        children: breadcrumbJsonLd([{ name: "Súbory cookie a analytika", path: "/cookies" }]),
      },
    ],
  }),
  component: CookiesPage,
});

function CookiesPage() {
  return (
    <ShPage className="shp-legal cookies-page">
      <ShPageHero
        eyebrow="Súkromie a analytika"
        title="Meranie návštevnosti"
        accent="pod vašou kontrolou."
        lead="Voliteľné meranie cez Vercel Analytics aj nakonfigurovaný Google Analytics spúšťame iba po vašom súhlase. Odmietnutie neobmedzí web ani asistenta."
        compact
      />

      <section className="cookies-section">
        <div className="container-page cookies-grid">
          <Reveal className="cookies-card" direction="left">
            <span className="cookies-card__icon" aria-hidden="true">
              <Cookie />
            </span>
            <p className="cookies-card__kicker">01 / SÚBORY COOKIE</p>
            <h2>Žiadne sledovacie súbory cookie bez vášho súhlasu.</h2>
            <p>
              Vercel Analytics funguje bez analytických súborov cookie, ale aj toto meranie zapíname
              až po súhlase. Google Analytics sa načíta až po voľbe „Povoliť analytiku“ a pri jeho
              používaní môžu byť uložené analytické súbory cookie podľa nastavenia služby Google.
            </p>
            <p>
              Funkčné lokálne úložisko používame na zapamätanie vašej voľby analytiky na 180 dní. AI
              asistent môže v prehliadači uchovať rozpracovanú konverzáciu a náhodný identifikátor
              vlákna najviac 24 hodín, aby sa chat nestratil pri prechode medzi stránkami. Tieto
              údaje neslúžia na reklamu ani profilovanie.
            </p>
          </Reveal>

          <Reveal className="cookies-card" direction="right" delay={0.06}>
            <span className="cookies-card__icon" aria-hidden="true">
              <BarChart3 />
            </span>
            <p className="cookies-card__kicker">02 / Vercel Analytics</p>
            <h2>Súhrnné meranie bez súborov cookie</h2>
            <p>
              Zobrazujú sa súhrnné počty návštev, otvorené stránky, zdroje návštevnosti, krajina,
              typ zariadenia a prehliadač. Údaje používame na zlepšovanie obsahu, použiteľnosti a
              technickej kvality webu.
            </p>
            <div className="cookies-status">
              <span>Režim merania</span>
              <b>Iba po súhlase, bez analytických súborov cookie</b>
              <p>Obsah formulára ani chatbota sa do analytiky neposiela.</p>
            </div>
          </Reveal>

          <Reveal className="cookies-card" direction="left" delay={0.1}>
            <span className="cookies-card__icon" aria-hidden="true">
              <Fingerprint />
            </span>
            <p className="cookies-card__kicker">03 / Google Analytics</p>
            <h2>
              {googleAnalyticsEnabled
                ? "Aktívny iba po súhlase"
                : "Pripravený, zatiaľ neaktivovaný"}
            </h2>
            <p>
              {googleAnalyticsEnabled
                ? "Google Analytics 4 je nakonfigurovaný, ale kód sa načíta až po výslovnom súhlase návštevníka. Súhlas sa dá kedykoľvek zmeniť."
                : "Integrácia je v kóde pripravená, ale bez platného Google Measurement ID sa Google Analytics vôbec nenačíta ani neodosiela žiadne dáta."}
            </p>
            <button
              type="button"
              className="sp-button sp-button--ghost"
              onClick={openAnalyticsPreferences}
            >
              Zmeniť nastavenie analytiky
            </button>
          </Reveal>

          <Reveal className="cookies-card" direction="right" delay={0.14}>
            <span className="cookies-card__icon" aria-hidden="true">
              <ShieldCheck />
            </span>
            <p className="cookies-card__kicker">04 / Právny základ</p>
            <h2>Rozlišujeme meranie bez súborov cookie a meranie so súhlasom.</h2>
            <p>
              Voliteľnú analytiku používame na základe vášho súhlasu. Bez súhlasu sa skripty Vercel
              Analytics ani Google Analytics nenačítajú. Voľbu môžete kedykoľvek zmeniť cez
              „Nastavenia cookies“ v pätičke. Odvolaním súhlasu zastavíte ďalšie meranie; údaje už
              odoslané poskytovateľovi tým spätne nevymažete.
            </p>
          </Reveal>
        </div>
      </section>
      <section className="cookies-section">
        <div className="container-page cookies-card">
          <h2>Čo môže zostať v prehliadači</h2>
          <ul className="cookies-list">
            <li>
              <code>mojchatbot.analytics-consent.v2</code> — voľba merania a jej čas, lokálne
              úložisko na 180 dní.
            </li>
            <li>
              <code>dv-assistant-chat-v1</code> a <code>dv-assistant-conversation-v1</code> —
              rozpracovaný chat a náhodný identifikátor, najviac 24 hodín. Vymazanie údajov stránky
              v prehliadači vymaže miestnu históriu.
            </li>
            <li>
              <code>_ga</code> a <code>_ga_*</code> — iba ak je Google Analytics nakonfigurovaný a
              povolený. Životnosť závisí od nastavenia Google Analytics; pri odmietnutí odstránime
              dostupné analytické cookies tejto domény.
            </li>
          </ul>
          <p>
            Vercel Analytics nepoužíva analytické cookies. Technické úložisko pre voľbu súkromia a
            požadovaný chat slúži funkčnosti, nie reklame.
          </p>
        </div>
      </section>

      <section className="cookies-contact">
        <div className="container-page">
          <p>
            Otázky k súkromiu:{" "}
            <a href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</a>
          </p>
          <small>Posledná aktualizácia: 4. októbra 2026</small>
        </div>
      </section>
    </ShPage>
  );
}
