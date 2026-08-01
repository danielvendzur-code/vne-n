import { createFileRoute } from "@tanstack/react-router";
import { BarChart3, Cookie, Fingerprint, ShieldCheck } from "lucide-react";
import { PageIntro, Reveal } from "@/components/site/motion-primitives";
import { siteConfig } from "@/config/site";
import { seo } from "@/lib/seo";
import "./cookies.css";

export const Route = createFileRoute("/cookies")({
  head: () => ({
    ...seo({
      title: "Cookies a meranie návštevnosti — Môj Chatbot",
      description:
        "Prehľad technológií používaných na webe, cookie-free analytiky a ochrany súkromia návštevníkov.",
      path: "/cookies",
    }),
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
            Štatistiky bez reklamných profilov. <em>Žiadne sledovacie cookies.</em>
          </>
        }
        lead="Web používa cookie-free Vercel Web Analytics na súhrnné meranie návštevnosti. Nevytvárame reklamné profily a nepoužívame Google Analytics ani marketingové pixely."
      />

      <section className="cookies-section">
        <div className="container-page cookies-grid">
          <Reveal className="cookies-card" direction="left">
            <span className="cookies-card__icon" aria-hidden="true">
              <Cookie />
            </span>
            <p className="cookies-card__kicker">01 / Cookies</p>
            <h2>Analytické a marketingové cookies nepoužívame.</h2>
            <p>
              Meranie návštevnosti neukladá do prehliadača identifikátor návštevníka. Web môže
              používať iba technické úložisko potrebné pre konkrétnu funkciu rozhrania, nikdy nie na
              reklamnú identifikáciu naprieč webmi.
            </p>
          </Reveal>

          <Reveal className="cookies-card" direction="right" delay={0.06}>
            <span className="cookies-card__icon" aria-hidden="true">
              <BarChart3 />
            </span>
            <p className="cookies-card__kicker">02 / Návštevnosť</p>
            <h2>Vercel Web Analytics</h2>
            <p>
              Zobrazujú sa súhrnné počty návštev, otvorené stránky, zdroje návštevnosti, krajina,
              typ zariadenia a prehliadač. Údaje slúžia na zlepšovanie obsahu a použiteľnosti webu.
            </p>
            <div className="cookies-status">
              <span>Režim merania</span>
              <b>Bez cookies a bez trvalého identifikátora</b>
              <p>
                Dočasný anonymizovaný identifikátor sa obnovuje každý deň a relácia sa neuchováva
                dlhšie než 24 hodín.
              </p>
            </div>
          </Reveal>

          <Reveal className="cookies-card" direction="left" delay={0.1}>
            <span className="cookies-card__icon" aria-hidden="true">
              <Fingerprint />
            </span>
            <p className="cookies-card__kicker">03 / Čo nevidíme</p>
            <h2>Nevidíme konkrétneho človeka.</h2>
            <p>
              Štatistiky neslúžia na pomenovanie návštevníka, spájanie návštev medzi dňami ani
              sledovanie aktivity na iných webových stránkach. Obsah formulára a chatbota sa do
              analytiky neposiela.
            </p>
          </Reveal>

          <Reveal className="cookies-card" direction="right" delay={0.14}>
            <span className="cookies-card__icon" aria-hidden="true">
              <ShieldCheck />
            </span>
            <p className="cookies-card__kicker">04 / Právny základ</p>
            <h2>Zlepšovanie webu a ochrana prevádzky.</h2>
            <p>
              Súhrnné meranie používame na základe oprávneného záujmu rozumieť fungovaniu webu,
              odhaľovať technické problémy a zlepšovať obsah. Podrobnosti sú na stránke ochrany
              osobných údajov.
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
          <small>Posledná aktualizácia: 1. augusta 2026</small>
        </div>
      </section>
    </div>
  );
}
