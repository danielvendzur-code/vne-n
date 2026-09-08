import { createFileRoute, Link } from "@tanstack/react-router";
import { Building2, Mail, ReceiptText, Scale, ShieldCheck } from "lucide-react";
import { PageIntro, Reveal } from "@/components/site/motion-primitives";
import { siteConfig } from "@/config/site";
import { breadcrumbJsonLd, seo } from "@/lib/seo";
import "./cookies.css";

export const Route = createFileRoute("/pravne-informacie")({
  head: () => ({
    ...seo({
      title: "Právne informácie — Môj Chatbot",
      description:
        "Identifikačné a kontaktné údaje prevádzkovateľa služby Môj Chatbot, registrácia, daňové údaje a orgán dozoru.",
      path: "/pravne-informacie",
    }),
    scripts: [
      {
        type: "application/ld+json",
        children: breadcrumbJsonLd([{ name: "Právne informácie", path: "/pravne-informacie" }]),
      },
    ],
  }),
  component: LegalInformationPage,
});

function LegalInformationPage() {
  const { legal, contact } = siteConfig;

  return (
    <div className="cookies-page legal-information-page">
      <PageIntro
        eyebrow="Právne informácie"
        title={
          <>
            Kto službu prevádzkuje <em>a kto je váš zmluvný partner.</em>
          </>
        }
        lead="Môj Chatbot je obchodná značka. Službu poskytuje a fakturuje Venaco s.r.o.; nižšie sú identifikačné údaje dostupné pred odoslaním dopytu aj pred uzatvorením spolupráce."
      />

      <section className="cookies-section" id="prevadzkovatel">
        <div className="container-page cookies-grid">
          <Reveal className="cookies-card" direction="left">
            <h2>
              <Building2 aria-hidden="true" /> Prevádzkovateľ a poskytovateľ
            </h2>
            <dl className="privacy-identity">
              <div>
                <dt>Obchodné meno</dt>
                <dd>{legal.operator}</dd>
              </div>
              <div>
                <dt>Právna forma</dt>
                <dd>{legal.legalForm}</dd>
              </div>
              <div>
                <dt>Sídlo</dt>
                <dd>{legal.address}</dd>
              </div>
              <div>
                <dt>IČO</dt>
                <dd>{legal.ico}</dd>
              </div>
              <div>
                <dt>DIČ</dt>
                <dd>{legal.dic}</dd>
              </div>
              <div>
                <dt>IČ DPH</dt>
                <dd>{legal.icDph}</dd>
              </div>
              <div>
                <dt>Registrácia</dt>
                <dd>{legal.registration}</dd>
              </div>
            </dl>
          </Reveal>

          <Reveal className="cookies-card" direction="right" delay={0.06}>
            <h2>
              <Mail aria-hidden="true" /> Elektronický a telefonický kontakt
            </h2>
            <p>
              E-mail: <a href={`mailto:${contact.email}`}>{contact.email}</a>
            </p>
            <p>
              Telefón: <a href={`tel:${contact.phoneHref}`}>{contact.phoneLabel}</a>
            </p>
            <p className="cookies-note">
              Tieto kontakty môžete použiť aj na otázky k objednávke služby, fakturácii, ochrane
              osobných údajov alebo technickej prevádzke.
            </p>
          </Reveal>

          <Reveal className="cookies-card" direction="left" delay={0.1}>
            <h2>
              <Scale aria-hidden="true" /> Orgán dozoru
            </h2>
            <p>{legal.supervisor}</p>
            <p className="cookies-note">
              Uvedenie orgánu dozoru nemení vaše právo obrátiť sa na iný príslušný orgán podľa
              povahy konkrétnej veci.
            </p>
          </Reveal>

          <Reveal className="cookies-card" direction="right" delay={0.14}>
            <h2>
              <ReceiptText aria-hidden="true" /> Ceny a fakturácia
            </h2>
            <p>
              Venaco s.r.o. je platiteľ DPH. Sumy „od“ na webe sú informatívne ceny za predpokladaný
              rozsah riešenia; nejde o automaticky uzatvorenú objednávku.
            </p>
            <p className="cookies-note">
              Pred začatím práce dostanete konkrétnu cenovú ponuku s jasne uvedeným rozsahom,
              základom dane, DPH a celkovou cenou. Záväzná je až ponuka, ktorú si odsúhlasíme.
            </p>
          </Reveal>

          <Reveal className="cookies-card cookies-card--wide" direction="left" delay={0.18}>
            <h2>
              <Scale aria-hidden="true" /> Spotrebiteľský spor a zmluva na diaľku
            </h2>
            <p>
              Odoslanie formulára alebo dopytu na tomto webe samo osebe nevytvára objednávku ani
              zmluvu. Ak má byť konkrétna zmluva uzatvorená so spotrebiteľom na diaľku, povinné
              informácie k danej službe vrátane podmienok a prípadného práva na odstúpenie budú
              poskytnuté pred jej uzavretím.
            </p>
            <p className="cookies-note">
              Ak vystupujete ako spotrebiteľ a spor sa nepodarí vyriešiť priamo s nami, môžete po
              splnení zákonných podmienok využiť alternatívne riešenie spotrebiteľského sporu.{" "}
              <a
                href="https://www.soi.sk/alternativne-riesenie-spotrebitelskych-sporov"
                target="_blank"
                rel="noreferrer"
              >
                Informácie o ARS na stránke SOI
              </a>
              .
            </p>
          </Reveal>

          <Reveal className="cookies-card cookies-card--wide" direction="right" delay={0.22}>
            <h2>
              <ShieldCheck aria-hidden="true" /> Súkromie a cookies
            </h2>
            <p>
              Informácie o spracúvaní osobných údajov sú na stránke{" "}
              <Link to="/ochrana-udajov">Ochrana osobných údajov</Link>. Používanie analytiky a
              možnosti súhlasu nájdete na stránke <Link to="/cookies">Súbory cookie a analytika</Link>.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="cookies-contact">
        <div className="container-page">
          <small>Posledná aktualizácia: 6. septembra 2026</small>
        </div>
      </section>
    </div>
  );
}
