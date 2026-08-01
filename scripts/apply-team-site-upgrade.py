from __future__ import annotations

from pathlib import Path
import json
import re

ROOT = Path(__file__).resolve().parents[1]


def read(path: str) -> str:
    return (ROOT / path).read_text(encoding="utf-8")


def write(path: str, content: str) -> None:
    target = ROOT / path
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(content.rstrip() + "\n", encoding="utf-8")


def replace(path: str, old: str, new: str, *, count: int = -1) -> None:
    content = read(path)
    if old not in content:
        raise RuntimeError(f"Expected text not found in {path}: {old[:100]!r}")
    write(path, content.replace(old, new, count))


def regex_replace(path: str, pattern: str, replacement: str, *, flags: int = 0) -> None:
    content = read(path)
    updated, count = re.subn(pattern, replacement, content, flags=flags)
    if count == 0:
        raise RuntimeError(f"Pattern not found in {path}: {pattern}")
    write(path, updated)


# ---------------------------------------------------------------------------
# One source of truth for brand, team and legal identity.
# ---------------------------------------------------------------------------
write(
    "src/config/site.ts",
    '''export const siteConfig = {
  brand: "Môj Chatbot",
  visualVersion: "team-system-20260801-v1",
  title: "Môj Chatbot — chatboty, kalkulačky a konfigurátory na mieru",
  description:
    "Chatboty, kalkulačky a konfigurátory na mieru, ktoré odpovedajú zákazníkom a pripravujú použiteľné dopyty.",
  team: {
    label: "Tím Môj Chatbot",
    founder: "Daniel Vendžúr",
    founderRole: "zakladateľ a produktový dizajnér",
  },
  contact: {
    email: "info@mojchatbot.sk",
    /** Zakladateľská adresa ostáva iba ako interný údaj; na webe sa nezobrazuje. */
    emailPersonal: "daniel@vendzur.sk",
    phoneLabel: "+421 948 699 433",
    phoneHref: "+421948699433",
  },
  nav: [],

  /**
   * Identifikačné údaje právneho prevádzkovateľa webu a dodávateľa služby.
   * Meno zakladateľa nie je náhradou za obchodné údaje. Pred komerčným
   * spustením treba doplniť presný subjekt, adresu, IČO a registráciu.
   */
  legal: {
    operator: "Daniel Vendžúr",
    address: "",
    ico: "",
    dic: "",
    icDph: "",
    registration: "",
    notVatPayer: true,
  },
};

export const SITE_ORIGIN = import.meta.env.VITE_SITE_URL ?? "https://mojchatbot.sk";
''',
)

# ---------------------------------------------------------------------------
# Team-first footer. Daniel remains visible as founder, not as the whole brand.
# ---------------------------------------------------------------------------
write(
    "src/components/site/Footer.tsx",
    '''import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Mail, Phone } from "lucide-react";
import { BrandMark } from "@/components/BrandMark";
import { siteConfig } from "@/config/site";
import { liveTools, realizations } from "@/data/realizations";
import { openSiteAssistant } from "@/lib/site-assistant";

export function Footer() {
  return (
    <footer className="premium-footer">
      <div className="container-page premium-footer-main">
        <div className="premium-footer-brand">
          <BrandMark size={36} />
          <p>Môj Chatbot · chatboty, kalkulačky a konfigurátory navrhnuté na mieru.</p>
          <p className="premium-footer-note">
            Napíšte nám, s čím má web pomôcť. Ozveme sa zvyčajne do jedného pracovného dňa.
          </p>
          <p className="premium-footer-founder">
            Tím vedie {siteConfig.team.founder}, {siteConfig.team.founderRole}.
          </p>
        </div>

        <div>
          <p className="premium-footer-label">Navigácia</p>
          <nav className="premium-footer-links" aria-label="Navigácia v pätičke">
            <Link to="/sluzby">Čo tvoríme</Link>
            <Link to="/preco-chatbot">Čo to prinesie webu</Link>
            <Link to="/projekty">Realizácie</Link>
            <Link to="/cennik">Cena</Link>
            <Link to="/postup">Spolupráca</Link>
            <Link to="/kontakt">Kontakt</Link>
          </nav>
        </div>

        <div>
          <p className="premium-footer-label">Živé weby a nástroje</p>
          <div className="premium-footer-links">
            {realizations.map((project) => (
              <a key={project.name} href={project.href} target="_blank" rel="noreferrer">
                {project.domain} <ArrowUpRight size={13} />
              </a>
            ))}
            {liveTools.map(({ name, href }) => (
              <a key={name} href={href} target="_blank" rel="noreferrer">
                {name} <ArrowUpRight size={13} />
              </a>
            ))}
          </div>
        </div>

        <div>
          <p className="premium-footer-label">Kontakt na tím</p>
          <div className="premium-footer-links">
            <a href={`mailto:${siteConfig.contact.email}`}>
              <Mail size={15} /> {siteConfig.contact.email}
            </a>
            <a href={`tel:${siteConfig.contact.phoneHref}`}>
              <Phone size={15} /> {siteConfig.contact.phoneLabel}
            </a>
            <button onClick={() => openSiteAssistant({ source: "footer" })}>
              Otvoriť krátky dopyt <ArrowUpRight size={15} />
            </button>
          </div>
        </div>
      </div>
      <div className="container-page premium-footer-bottom">
        <span>
          © {new Date().getFullYear()} · Môj Chatbot · prevádzkovateľ {siteConfig.legal.operator}
          {siteConfig.legal.ico ? ` · IČO ${siteConfig.legal.ico}` : ""}
        </span>
        <span className="premium-footer-privacy">
          <Link to="/ochrana-udajov">Ochrana osobných údajov</Link>
          <Link to="/cookies">Cookies a analytika</Link>
        </span>
      </div>
    </footer>
  );
}
''',
)

# ---------------------------------------------------------------------------
# Cookie-free analytics transparency page.
# ---------------------------------------------------------------------------
write(
    "src/routes/cookies.tsx",
    '''import { createFileRoute } from "@tanstack/react-router";
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
            <span className="cookies-card__icon" aria-hidden="true"><Cookie /></span>
            <p className="cookies-card__kicker">01 / Cookies</p>
            <h2>Analytické a marketingové cookies nepoužívame.</h2>
            <p>
              Meranie návštevnosti neukladá do prehliadača identifikátor návštevníka. Web môže
              používať iba technické úložisko potrebné pre konkrétnu funkciu rozhrania, nikdy nie
              na reklamnú identifikáciu naprieč webmi.
            </p>
          </Reveal>

          <Reveal className="cookies-card" direction="right" delay={0.06}>
            <span className="cookies-card__icon" aria-hidden="true"><BarChart3 /></span>
            <p className="cookies-card__kicker">02 / Návštevnosť</p>
            <h2>Vercel Web Analytics</h2>
            <p>
              Zobrazujú sa súhrnné počty návštev, otvorené stránky, zdroje návštevnosti, krajina,
              typ zariadenia a prehliadač. Údaje slúžia na zlepšovanie obsahu a použiteľnosti webu.
            </p>
            <div className="cookies-status">
              <span>Režim merania</span>
              <b>Bez cookies a bez trvalého identifikátora</b>
              <p>Dočasný anonymizovaný identifikátor sa obnovuje každý deň a relácia sa neuchováva dlhšie než 24 hodín.</p>
            </div>
          </Reveal>

          <Reveal className="cookies-card" direction="left" delay={0.1}>
            <span className="cookies-card__icon" aria-hidden="true"><Fingerprint /></span>
            <p className="cookies-card__kicker">03 / Čo nevidíme</p>
            <h2>Nevidíme konkrétneho človeka.</h2>
            <p>
              Štatistiky neslúžia na pomenovanie návštevníka, spájanie návštev medzi dňami ani
              sledovanie aktivity na iných webových stránkach. Obsah formulára a chatbota sa do
              analytiky neposiela.
            </p>
          </Reveal>

          <Reveal className="cookies-card" direction="right" delay={0.14}>
            <span className="cookies-card__icon" aria-hidden="true"><ShieldCheck /></span>
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
          <p>Otázky k súkromiu: <a href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</a></p>
          <small>Posledná aktualizácia: 1. augusta 2026</small>
        </div>
      </section>
    </div>
  );
}
''',
)

# ---------------------------------------------------------------------------
# GDPR information aligned with the actual stack and cross-border transfers.
# ---------------------------------------------------------------------------
write(
    "src/routes/ochrana-udajov.tsx",
    '''import { createFileRoute, Link } from "@tanstack/react-router";
import { Building2, Clock3, Globe2, Lock, Mail, Server, ShieldCheck, UserCheck } from "lucide-react";
import { PageIntro, Reveal } from "@/components/site/motion-primitives";
import { siteConfig } from "@/config/site";
import { breadcrumbJsonLd, seo } from "@/lib/seo";
import "./cookies.css";

export const Route = createFileRoute("/ochrana-udajov")({
  head: () => ({
    ...seo({
      title: "Ochrana osobných údajov — Môj Chatbot",
      description:
        "Informácie o spracúvaní údajov z formulára, chatbota, e-mailovej komunikácie a cookie-free analytiky.",
      path: "/ochrana-udajov",
    }),
    scripts: [{
      type: "application/ld+json",
      children: breadcrumbJsonLd([{ name: "Ochrana osobných údajov", path: "/ochrana-udajov" }]),
    }],
  }),
  component: PrivacyPage,
});

const purposes = [
  {
    icon: Mail,
    title: "Dopyt a obchodná komunikácia",
    what: "Meno, e-mail, telefón, firma alebo web, obsah zadania a údaje, ktoré dobrovoľne odošlete.",
    why: "Aby sme mohli dopyt vyhodnotiť, odpovedať a pripraviť návrh riešenia.",
    basis: "Kroky pred uzatvorením zmluvy a plnenie zmluvy — čl. 6 ods. 1 písm. b) GDPR.",
    keep: "Najviac 24 mesiacov od poslednej komunikácie, ak nevznikne zmluvný alebo zákonný dôvod na dlhšie uchovanie.",
  },
  {
    icon: UserCheck,
    title: "Rozhovor s AI asistentom",
    what: "Text otázok, zvolené možnosti a kontakt, iba ak ho návštevník zadá.",
    why: "Aby asistent odpovedal a pripravil použiteľné zadanie pre tím Môj Chatbot.",
    basis: "Kroky pred uzatvorením zmluvy — čl. 6 ods. 1 písm. b) GDPR; pri anonymnej otázke oprávnený záujem na poskytovaní služby.",
    keep: "Podľa účelu komunikácie, najviac 24 mesiacov; technické záznamy kratšie podľa nastavenia poskytovateľa.",
  },
  {
    icon: Clock3,
    title: "Cookie-free meranie návštevnosti",
    what: "Súhrnné údaje o otvorenej stránke, zdroji návštevy, krajine, zariadení a prehliadači.",
    why: "Aby sme rozumeli používaniu webu, opravovali problémy a zlepšovali obsah.",
    basis: "Oprávnený záujem na meraní a zlepšovaní webu — čl. 6 ods. 1 písm. f) GDPR.",
    keep: "Vercel nepoužíva analytické cookies; dočasný hash sa obnovuje denne a relácia sa zahodí po 24 hodinách. Súhrnné reporty môžu byť uchované dlhšie.",
  },
  {
    icon: Server,
    title: "Bezpečnosť a technická prevádzka",
    what: "IP adresa, čas požiadavky, technické hlavičky, chybové a bezpečnostné záznamy.",
    why: "Ochrana formulárov, prevencia zneužitia, diagnostika chýb a dostupnosť služby.",
    basis: "Oprávnený záujem na bezpečnej prevádzke — čl. 6 ods. 1 písm. f) GDPR.",
    keep: "Len čas potrebný na bezpečnosť a diagnostiku, spravidla najviac 30 dní, ak incident nevyžaduje dlhšie uchovanie.",
  },
];

const rights = [
  "Požiadať o prístup k svojim údajom a ich kópiu.",
  "Požiadať o opravu nepresných alebo neúplných údajov.",
  "Požiadať o vymazanie alebo obmedzenie spracúvania, ak sú splnené podmienky.",
  "Namietať proti spracúvaniu založenému na oprávnenom záujme.",
  "Získať údaje v prenosnom formáte, ak sa uplatní právo na prenosnosť.",
  "Podať sťažnosť na Úrad na ochranu osobných údajov Slovenskej republiky.",
];

function PrivacyPage() {
  const { legal, contact, team } = siteConfig;
  const identity = [
    { label: "Značka", value: team.label },
    { label: "Prevádzkovateľ", value: legal.operator },
    { label: "Sídlo / miesto podnikania", value: legal.address },
    { label: "IČO", value: legal.ico },
    { label: "DIČ", value: legal.dic },
    { label: "IČ DPH", value: legal.icDph },
    { label: "Registrácia", value: legal.registration },
  ].filter((row) => row.value);

  return (
    <div className="cookies-page">
      <PageIntro
        eyebrow="Súkromie"
        title={<>Údaje používame iba na jasný účel. <em>Nie na predaj ani reklamnú databázu.</em></>}
        lead="Táto stránka vysvetľuje, aké údaje spracúvame pri používaní webu, formulára, AI asistenta a e-mailovej komunikácie."
      />

      <section className="cookies-section">
        <div className="container-page cookies-grid">
          <Reveal className="cookies-card" direction="left">
            <h2><Building2 aria-hidden="true" /> Kto je prevádzkovateľ</h2>
            <dl className="privacy-identity">
              {identity.map((row) => <div key={row.label}><dt>{row.label}</dt><dd>{row.value}</dd></div>)}
              <div><dt>E-mail pre súkromie</dt><dd><a href={`mailto:${contact.email}`}>{contact.email}</a></dd></div>
              <div><dt>Telefón</dt><dd><a href={`tel:${contact.phoneHref}`}>{contact.phoneLabel}</a></dd></div>
            </dl>
          </Reveal>

          <Reveal className="cookies-card" direction="right" delay={0.06}>
            <h2><ShieldCheck aria-hidden="true" /> Základné zásady</h2>
            <ul className="cookies-list">
              <li>Zbierame iba údaje potrebné na odpoveď, realizáciu a bezpečnú prevádzku.</li>
              <li>Údaje nepredávame a nepoužívame na reklamu tretích strán.</li>
              <li>Obsah formulára ani chatbota neposielame do analytiky.</li>
              <li>Nepoužívame automatizované rozhodovanie s právnymi alebo obdobne významnými účinkami.</li>
            </ul>
          </Reveal>
        </div>
      </section>

      <section className="cookies-section">
        <div className="container-page">
          <Reveal><h2 className="cookies-heading">Účely, údaje a doby uchovania</h2></Reveal>
          <div className="privacy-purposes">
            {purposes.map(({ icon: Icon, title, what, why, basis, keep }, index) => (
              <Reveal className="cookies-card" key={title} direction={index % 2 === 0 ? "left" : "right"} delay={index * 0.04}>
                <h3><Icon aria-hidden="true" /> {title}</h3>
                <dl className="privacy-detail">
                  <div><dt>Čo spracúvame</dt><dd>{what}</dd></div>
                  <div><dt>Prečo</dt><dd>{why}</dd></div>
                  <div><dt>Právny základ</dt><dd>{basis}</dd></div>
                  <div><dt>Ako dlho</dt><dd>{keep}</dd></div>
                </dl>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="cookies-section">
        <div className="container-page cookies-grid">
          <Reveal className="cookies-card" direction="left">
            <h2><Lock aria-hidden="true" /> Poskytovatelia a príjemcovia</h2>
            <p>Na technickú prevádzku používame najmä tieto kategórie dodávateľov:</p>
            <ul className="cookies-list">
              <li><b>Vercel</b> — hosting webu, serverové funkcie a cookie-free Web Analytics.</li>
              <li><b>Resend</b> — odosielanie transakčných e-mailov a potvrdení dopytu.</li>
              <li><b>Websupport</b> — doména, DNS a firemná e-mailová schránka.</li>
              <li><b>Anthropic</b> — spracovanie otázok, keď návštevník použije AI odpoveď chatbota.</li>
            </ul>
            <p className="cookies-note">Dodávatelia dostanú iba údaje potrebné na konkrétnu službu a sú viazaní zmluvnými a bezpečnostnými podmienkami.</p>
          </Reveal>

          <Reveal className="cookies-card" direction="right" delay={0.06}>
            <h2><Globe2 aria-hidden="true" /> Prenosy mimo EHP</h2>
            <p>
              Niektorí technologickí dodávatelia pôsobia v Spojených štátoch alebo spracúvajú
              údaje aj mimo Európskeho hospodárskeho priestoru. Prenos sa uskutočňuje iba pri
              existencii vhodného právneho mechanizmu, najmä rozhodnutia o primeranosti,
              štandardných zmluvných doložiek alebo iných záruk podľa GDPR.
            </p>
            <p className="cookies-note">Predchádzajúce tvrdenie, že údaje nikdy neopúšťajú EHP, nebolo pri použitom technologickom stacku presné a bolo odstránené.</p>
          </Reveal>

          <Reveal className="cookies-card cookies-card--wide" direction="left" delay={0.1}>
            <h2><UserCheck aria-hidden="true" /> Vaše práva</h2>
            <ul className="cookies-list">{rights.map((right) => <li key={right}>{right}</li>)}</ul>
            <p className="cookies-note">
              Žiadosť pošlite na <a href={`mailto:${contact.email}`}>{contact.email}</a>. Odpovieme
              bez zbytočného odkladu, spravidla najneskôr do jedného mesiaca. Podrobnosti o
              meraní nájdete na stránke <Link to="/cookies">Cookies a analytika</Link>.
            </p>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
''',
)

# ---------------------------------------------------------------------------
# Root: local font, Vercel Analytics, team author metadata.
# ---------------------------------------------------------------------------
root_path = "src/routes/__root.tsx"
root = read(root_path)
root = root.replace(
    'import { QueryClient, QueryClientProvider } from "@tanstack/react-query";\n',
    'import { QueryClient, QueryClientProvider } from "@tanstack/react-query";\nimport { Analytics } from "@vercel/analytics/react";\nimport "@fontsource-variable/inter-tight";\n',
)
root = root.replace('{ name: "author", content: "Daniel Vendžúr" }', '{ name: "author", content: "Tím Môj Chatbot" }')
root = root.replace('email: `mailto:${siteConfig.contact.emailPersonal}`,', 'email: `mailto:${siteConfig.contact.email}`,')
root = re.sub(
    r'const interTightLatinExt =[\s\S]*?const contentSecurityPolicy =',
    'const contentSecurityPolicy =',
    root,
    count=1,
)
# Remove Google font links and preloads; the same family is bundled locally.
root = re.sub(r'\n\s*\{ rel: "preconnect", href: "https://fonts\.googleapis\.com" \},', '', root)
root = re.sub(r'\n\s*\{ rel: "preconnect", href: "https://fonts\.gstatic\.com", crossOrigin: "anonymous" \},', '', root)
root = re.sub(r'\n\s*\{\s*rel: "preload",\s*href: interTightLatinExt,[\s\S]*?\},', '', root, count=1)
root = re.sub(r'\n\s*\{\s*rel: "preload",\s*href: interTightLatin,[\s\S]*?\},', '', root, count=1)
root = re.sub(r'\n\s*\{\s*rel: "stylesheet",\s*href: "https://fonts\.googleapis\.com[^\n]+\n\s*\},', '', root, count=1)
root = root.replace(
    '        {children}\n        <Scripts />',
    '        {children}\n        <Analytics />\n        <Scripts />',
)
write(root_path, root)

# No consent banner is needed for the selected cookie-free analytics implementation.
replace("src/components/site/Layout.tsx", 'import { CookieConsent } from "./CookieConsent";\n', "")
replace("src/components/site/Layout.tsx", '        <CookieConsent />\n', "")
replace(
    "src/components/site/Layout.tsx",
    '// Posledná vrstva — čo je v SiteFinish.css, to platí.\nimport "./SiteFinish.css";',
    '// Posledné dve vrstvy — TeamMotionUpgrade je autorita pre nový scroll a timeline systém.\nimport "./SiteFinish.css";\nimport "./TeamMotionUpgrade.css";',
)

# ---------------------------------------------------------------------------
# Landing page: team voice, four-stage collaboration and alternating scroll.
# ---------------------------------------------------------------------------
landing_path = "src/components/site/PremiumLanding.tsx"
landing = read(landing_path)
landing = landing.replace('text: "Od návrhu po nasadenie priamo so mnou"', 'text: "Od návrhu po nasadenie s tímom Môj Chatbot"')
landing = landing.replace('lead: "Staviam chatboty, kalkulačky a konfigurátory na mieru.', 'lead: "Tvoríme chatboty, kalkulačky a konfigurátory na mieru.')
landing = landing.replace('postup spolupráce a priamy kontakt na mňa.', 'postup spolupráce a priamy kontakt na náš tím.')
landing = landing.replace('Vyskúšať môjho chatbota', 'Vyskúšať chatbota')
landing = landing.replace('eyebrow="Čo všetko viem postaviť"', 'eyebrow="Čo všetko vieme postaviť"')
landing = landing.replace('copy="Ak tu odpoveď nie je, napíšte mi — alebo sa spýtajte priamo chatbota v rohu obrazovky."', 'copy="Ak tu odpoveď nie je, napíšte nám — alebo sa spýtajte priamo chatbota v rohu obrazovky."')
landing = landing.replace(
'''const process = [
  {
    icon: MessageCircle,
    title: "Krátka analýza",
    copy: "Poviete mi, čo predávate a čo vás najviac zdržuje.",
  },
  {
    icon: Workflow,
    title: "Logika a prototyp",
    copy: "Navrhnem otázky, rozhodovanie aj rozhranie ešte pred vývojom.",
  },
  {
    icon: Rocket,
    title: "Nasadenie",
    copy: "Hotový nástroj otestujem, prepojím a nasadím priamo na váš web.",
  },
];''',
'''const process = [
  {
    icon: MessageCircle,
    title: "Úvodný brief",
    copy: "Spoločne pomenovaťe cieľ, najčastejšie otázky zákazníkov a údaje, ktoré má riešenie zbierať.",
    result: "Výstup: jasný rozsah prvej verzie a zoznam podkladov.",
  },
  {
    icon: Workflow,
    title: "Tok, logika a prototyp",
    copy: "Navrhneme otázky, rozhodovanie, výpočty aj rozhranie skôr, než sa začne samotný vývoj.",
    result: "Výstup: klikateľný návrh a odsúhlasená logika.",
  },
  {
    icon: BadgeCheck,
    title: "Vývoj a spoločné testovanie",
    copy: "Riešenie postavíme a preveríme na reálnych scenároch, mobile aj desktope. Pripomienky zapracujeme pred nasadením.",
    result: "Výstup: otestovaná verzia pripravená na ostrú prevádzku.",
  },
  {
    icon: Rocket,
    title: "Nasadenie a zlepšovanie",
    copy: "Nástroj prepojíme s e-mailom alebo ďalšími systémami, vložíme na web a podľa reálnych dát doladíme detaily.",
    result: "Výstup: živé riešenie a jasný plán ďalších úprav.",
  },
];''',
)
landing = landing.replace(
'''        {process.map(({ icon: Icon, title, copy }, index) => (
          <li key={title} data-reached={reducedMotion || index < reached}>
            <span className="lp-step-node" aria-hidden="true">
              <i />
            </span>
            <span className="lp-step-icon" aria-hidden="true">
              <Icon />
            </span>
            <div className="lp-step-body">
              <span className="lp-step-num">Krok 0{index + 1}</span>
              <h3>{title}</h3>
              <p>{copy}</p>
            </div>
          </li>
        ))}''',
'''        {process.map(({ icon: Icon, title, copy, result }, index) => (
          <motion.li
            key={title}
            data-reached={reducedMotion || index < reached}
            data-side={index % 2 === 0 ? "left" : "right"}
            initial={reducedMotion ? false : { opacity: 0, x: index % 2 === 0 ? -58 : 58, y: 18 }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once: true, amount: 0.34, margin: "-7% 0px -12% 0px" }}
            transition={reducedMotion ? { duration: 0 } : { duration: 0.82, delay: index * 0.06, ease: premiumEase }}
          >
            <span className="lp-step-node" aria-hidden="true"><i /></span>
            <span className="lp-step-icon" aria-hidden="true"><Icon /></span>
            <div className="lp-step-body">
              <span className="lp-step-num">Krok 0{index + 1}</span>
              <h3>{title}</h3>
              <p>{copy}</p>
              <p className="lp-step-result"><Check aria-hidden="true" /> {result}</p>
            </div>
          </motion.li>
        ))}''',
)
landing = landing.replace('Máte návrh v e-maile alebo nápad v hlave?', 'Máte návrh v e-maile alebo nápad, ktorý chcete preveriť?')
landing = landing.replace('Stačí mi povedať, čo vám sedí. Ďalší krok pripravím ja.', 'Stačí nám povedať, čo vám sedí. Ďalší krok pripraví tím Môj Chatbot.')
write(landing_path, landing)

# ---------------------------------------------------------------------------
# Collaboration detail page rewritten in team language with side entrances.
# ---------------------------------------------------------------------------
write(
    "src/routes/postup.tsx",
    '''import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef } from "react";
import { motion } from "motion/react";
import { ArrowRight, CalendarCheck, Code2, MessageCircle, Palette, PlugZap, Search, Workflow } from "lucide-react";
import { CtaBand, PageIntro, premiumEase } from "@/components/site/motion-primitives";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useTimelineProgress } from "@/hooks/useTimelineProgress";
import { openSiteAssistant } from "@/lib/site-assistant";
import { breadcrumbJsonLd, seo } from "@/lib/seo";
import "./postup.css";

const steps = [
  { icon: Search, label: "Krok 01 · Zorientovanie", title: "Pozrieme si web, služby a obchodný proces.", copy: "Zistíme, čo zákazníci potrebujú vedieť a ktoré údaje firma dnes zisťuje ručne.", chips: ["Bez záväzku", "Stačí odkaz na web"] },
  { icon: Workflow, label: "Krok 02 · Návrh logiky", title: "Navrhneme otázky, vetvenie a výpočty.", copy: "Spoločne odsúhlasíme kroky, možnosti, cenové pravidlá a výsledok pre zákazníka ešte pred vývojom.", chips: ["Mapa otázok", "Cenové pravidlá", "Schválenie vopred"] },
  { icon: Palette, label: "Krok 03 · Dizajn", title: "Rozhranie zladíme s vašou značkou.", copy: "Nástroj prevezme farby, typografiu a tón komunikácie webu, aby nepôsobil ako cudzí doplnok.", chips: ["Vaše farby", "Mobil aj desktop"] },
  { icon: Code2, label: "Krok 04 · Vývoj a test", title: "Riešenie postavíme a otestujeme.", copy: "Preveríme logiku, výpočty aj správanie na počítači a mobile. Pred nasadením dostanete živý testovací odkaz.", chips: ["Testovací odkaz", "Reálne scenáre"] },
  { icon: PlugZap, label: "Krok 05 · Prepojenie", title: "Dopyty prepojíme s vašimi systémami.", copy: "E-mail, kalendár, tabuľka, CRM alebo vlastné API dostanú údaje bez ručného prepisovania.", chips: ["E-mail", "Kalendár", "Tabuľka", "CRM / API"] },
  { icon: CalendarCheck, label: "Krok 06 · Nasadenie", title: "Widget nasadíme a doladíme podľa prevádzky.", copy: "Vo väčšine prípadov stačí jeden riadok kódu. Po spustení skontrolujeme funkčnosť a upravíme detaily podľa reálnych reakcií.", chips: ["Jeden riadok kódu", "Podpora po spustení"] },
];

const processJsonLd = JSON.stringify({
  "@context": "https://schema.org", "@type": "HowTo",
  name: "Ako prebieha spolupráca s tímom Môj Chatbot",
  description: "Šesť krokov od analýzy po nasadenie chatbota, kalkulačky alebo konfigurátora.",
  step: steps.map((step, index) => ({ "@type": "HowToStep", position: index + 1, name: step.title, text: step.copy })),
});

export const Route = createFileRoute("/postup")({
  head: () => ({
    ...seo({ title: "Ako prebieha spolupráca — Môj Chatbot", description: "Šesť jasných krokov od úvodného briefu po nasadenie a zlepšovanie nástroja na webe.", path: "/postup" }),
    scripts: [
      { type: "application/ld+json", children: processJsonLd },
      { type: "application/ld+json", children: breadcrumbJsonLd([{ name: "Ako to prebieha", path: "/postup" }]) },
    ],
  }),
  component: ProcessPage,
});

function Timeline() {
  const listRef = useRef<HTMLOListElement>(null);
  const reducedMotion = useReducedMotion();
  const { scaleY, reached } = useTimelineProgress(listRef, { nodeSelector: ".sp-step-node", offset: ["start 0.92", "end 0.48"], count: steps.length });

  return (
    <div className="sp-timeline-wrap">
      {reducedMotion ? null : <motion.span className="sp-timeline-progress" style={{ scaleY }} aria-hidden="true" />}
      <ol className="sp-timeline" ref={listRef}>
        {steps.map((step, index) => (
          <motion.li
            key={step.title}
            className="sp-timeline-item"
            data-reached={reducedMotion || index < reached}
            data-side={index % 2 === 0 ? "left" : "right"}
            initial={reducedMotion ? false : { opacity: 0, x: index % 2 === 0 ? -64 : 64, y: 20 }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once: true, amount: 0.28, margin: "-6% 0px -10% 0px" }}
            transition={reducedMotion ? { duration: 0 } : { duration: 0.82, delay: Math.min(index * 0.055, 0.22), ease: premiumEase }}
          >
            <span className="sp-step-node" aria-hidden="true"><i /></span>
            <div className="sp-step">
              <p className="sp-step-label"><step.icon aria-hidden="true" />{step.label}</p>
              <h2>{step.title}</h2>
              <p>{step.copy}</p>
              <div className="sp-chip-row">{step.chips.map((chip) => <span className="chip" key={chip}>{chip}</span>)}</div>
            </div>
          </motion.li>
        ))}
      </ol>
    </div>
  );
}

function ProcessPage() {
  return (
    <div className="sp-page sp-page--process">
      <PageIntro eyebrow="Spolupráca" title={<>Od prvých otázok <em>po živé riešenie na vašom webe.</em></>} lead="Šesť krokov s jasným výstupom. Vždy viete, čo sa práve deje, čo schvaľujete a čo bude nasledovať.">
        <div className="sp-hero-chips"><span className="chip">Logika schválená pred vývojom</span><span className="chip">Testovací odkaz pred nasadením</span><span className="chip">Bez prerábania webu</span></div>
      </PageIntro>
      <section className="sp-section"><div className="container-page"><Timeline /></div></section>
      <section className="sp-section">
        <CtaBand kicker="Zaujíma vás niektorý krok?" title="Napíšte konkrétnu otázku. Odpovieme konkrétne." lead="Po krátkom zadaní pripravíme návrh prvého kroku, otázok a logiky pre vašu službu.">
          <button type="button" className="sp-button sp-button--primary" onClick={() => openSiteAssistant({ source: "process-cta" })}><MessageCircle aria-hidden="true" /> Nájsť riešenie</button>
          <Link to="/kontakt" className="sp-button sp-button--ghost">Prejsť na kontakt <ArrowRight aria-hidden="true" /></Link>
        </CtaBand>
      </section>
    </div>
  );
}
''',
)

# ---------------------------------------------------------------------------
# Contact page team language and one public brand address.
# ---------------------------------------------------------------------------
contact_path = "src/routes/kontakt.tsx"
contact = read(contact_path)
replacements = {
    "Napíšte mi, s čím vám má chatbot": "Napíšte nám, s čím vám má chatbot",
    "Ozvem\n            sa s návrhom": "Ozveme\n            sa s návrhom",
    '''            <a href={`mailto:${siteConfig.contact.emailPersonal}`}>
              <Mail />
              {siteConfig.contact.emailPersonal}
              <em>osobná</em>
            </a>
''': "",
    "Ďakujem za zadanie": "Ďakujeme za zadanie",
    "Dopyt je na ceste ku mne.": "Dopyt je už u tímu Môj Chatbot.",
    "Zadanie od <b>{name.trim() || \"vás\"}</b> som prijal": "Zadanie od <b>{name.trim() || \"vás\"}</b> sme prijali",
    "pošlem na <b>{email.trim()}</b>": "pošleme na <b>{email.trim()}</b>",
    "Potvrdenie s kópiou vášho zadania som poslal": "Potvrdenie s kópiou vášho zadania sme poslali",
    "Povedzte mi základ.": "Povedzte nám základ.",
}
for old, new in replacements.items():
    if old not in contact:
        raise RuntimeError(f"Contact replacement missing: {old[:80]!r}")
    contact = contact.replace(old, new)
write(contact_path, contact)

# ---------------------------------------------------------------------------
# Broad, precise team-language cleanup in remaining user-facing files.
# ---------------------------------------------------------------------------
team_phrase_map = {
    "Čo všetko viem postaviť": "Čo všetko vieme postaviť",
    "napíšte mi": "napíšte nám",
    "Napíšte mi": "Napíšte nám",
    "ozvem sa": "ozveme sa",
    "Ozvem sa": "Ozveme sa",
    "odpoviem": "odpovieme",
    "Odpoviem": "Odpovieme",
    "navrhnem": "navrhneme",
    "Navrhnem": "Navrhneme",
    "pripravím": "pripravíme",
    "Pripravím": "Pripravíme",
    "vytvorím": "vytvoríme",
    "Vytvorím": "Vytvoríme",
    "otestujem": "otestujeme",
    "Otestujem": "Otestujeme",
    "prepojím": "prepojíme",
    "Prepojím": "Prepojíme",
    "nasadím": "nasadíme",
    "Nasadím": "Nasadíme",
    "spracúvam sám": "spracúvame v tíme a prostredníctvom uvedených dodávateľov",
    "Údaje spracúvam": "Údaje spracúvame",
    "Zbieram len": "Zbierame len",
}
for rel in [
    "src/routes/cennik.tsx",
    "src/lib/assistant-flow.ts",
    "src/lib/lead-email.ts",
    "src/components/site/HomeConversionUpgrade.tsx",
]:
    if not (ROOT / rel).exists():
        continue
    content = read(rel)
    for old, new in team_phrase_map.items():
        content = content.replace(old, new)
    content = content.replace("Daniel Vendžúr · Môj Chatbot", "Tím Môj Chatbot")
    write(rel, content)

# Brand metadata: founder is retained, public authorship belongs to the team.
index_path = "src/routes/index.tsx"
index = read(index_path)
index = index.replace('founder: { "@type": "Person", name: "Daniel Vendžúr" },', 'founder: { "@type": "Person", name: siteConfig.team.founder },')
write(index_path, index)

manifest = {
    "name": "Môj Chatbot",
    "short_name": "Môj Chatbot",
    "description": "Chatboty, kalkulačky a konfigurátory na mieru od tímu Môj Chatbot.",
    "start_url": "/",
    "display": "standalone",
    "background_color": "#0a0908",
    "theme_color": "#0a0908",
    "icons": [
        {"src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png"},
        {"src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png"},
    ],
}
write("public/manifest.webmanifest", json.dumps(manifest, ensure_ascii=False, indent=2))

# ---------------------------------------------------------------------------
# Final visual authority for collaboration timeline and scroll reactions.
# ---------------------------------------------------------------------------
write(
    "src/components/site/TeamMotionUpgrade.css",
    '''/* Team-first collaboration and scroll motion — final visual authority. */

.premium-footer-founder {
  margin-top: 0.9rem;
  color: color-mix(in srgb, var(--text-secondary) 88%, #ffc79d 12%);
  font-size: 0.82rem;
  line-height: 1.55;
}

.lp-process-grid {
  grid-template-columns: minmax(0, 1fr) !important;
  gap: clamp(3.5rem, 8vw, 7.5rem) !important;
}

.lp-process-grid > div:first-child {
  width: 100%;
}

.lp-timeline-wrap,
.sp-timeline-wrap {
  position: relative;
  isolation: isolate;
  margin-top: clamp(2.5rem, 6vw, 5rem);
}

.lp-process-list,
.sp-timeline {
  position: relative;
  display: grid;
  gap: clamp(2rem, 4.5vw, 4rem);
  margin: 0;
  padding: 0;
  list-style: none;
}

.lp-process-list::before,
.sp-timeline::before {
  content: "";
  position: absolute;
  z-index: -2;
  inset: 0 auto 0 50%;
  width: 1px;
  background: rgba(255, 255, 255, 0.13);
  transform: translateX(-50%);
}

.lp-timeline-progress,
.sp-timeline-progress {
  position: absolute;
  z-index: -1;
  inset: 0 auto 0 50% !important;
  width: 3px !important;
  height: 100% !important;
  transform-origin: top center !important;
  background: linear-gradient(180deg, #ffc79d 0%, #d9bd83 52%, #bc7352 100%) !important;
  box-shadow: 0 0 28px rgba(255, 199, 157, 0.48), 0 0 64px rgba(188, 115, 82, 0.18) !important;
}

.lp-process-list > li,
.sp-timeline-item {
  position: relative;
  display: grid !important;
  grid-template-columns: minmax(0, 1fr) 52px minmax(0, 1fr) !important;
  align-items: center;
  min-height: 190px;
  padding: 0 !important;
  border: 0 !important;
  background: transparent !important;
  box-shadow: none !important;
}

.lp-process-list > li[data-side="left"] .lp-step-body,
.sp-timeline-item[data-side="left"] .sp-step {
  grid-column: 1;
}

.lp-process-list > li[data-side="right"] .lp-step-body,
.sp-timeline-item[data-side="right"] .sp-step {
  grid-column: 3;
}

.lp-process-list > li[data-side="left"] .lp-step-body,
.sp-timeline-item[data-side="left"] .sp-step {
  text-align: right;
}

.lp-process-list > li[data-side="right"] .lp-step-body,
.sp-timeline-item[data-side="right"] .sp-step {
  text-align: left;
}

.lp-step-body,
.sp-step {
  position: relative;
  overflow: hidden;
  padding: clamp(1.4rem, 3vw, 2.25rem) !important;
  border: 1px solid rgba(255, 199, 157, 0.14) !important;
  border-radius: 1.45rem !important;
  background:
    radial-gradient(circle at var(--spot-x, 50%) var(--spot-y, 50%), rgba(255, 199, 157, 0.11), transparent 42%),
    linear-gradient(145deg, rgba(35, 26, 20, 0.96), rgba(18, 13, 10, 0.98)) !important;
  box-shadow: 0 26px 70px -52px rgba(0, 0, 0, 0.9) !important;
  transition: border-color 320ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 320ms cubic-bezier(0.16, 1, 0.3, 1), transform 320ms cubic-bezier(0.16, 1, 0.3, 1) !important;
}

.lp-step-body::before,
.sp-step::before {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: linear-gradient(105deg, transparent 20%, rgba(255,255,255,.07) 48%, transparent 75%);
  transform: translateX(-120%);
  transition: transform 760ms cubic-bezier(0.16, 1, 0.3, 1);
}

.lp-process-list > li[data-reached="true"] .lp-step-body,
.sp-timeline-item[data-reached="true"] .sp-step {
  border-color: rgba(255, 199, 157, 0.3) !important;
  box-shadow: 0 30px 90px -58px rgba(255, 199, 157, 0.42) !important;
}

.lp-process-list > li[data-reached="true"] .lp-step-body::before,
.sp-timeline-item[data-reached="true"] .sp-step::before {
  transform: translateX(120%);
}

.lp-step-node,
.sp-step-node {
  position: absolute !important;
  z-index: 3;
  left: 50% !important;
  top: 50% !important;
  width: 22px !important;
  height: 22px !important;
  margin: 0 !important;
  border: 4px solid #100b08 !important;
  border-radius: 999px !important;
  background: #6e5545 !important;
  transform: translate(-50%, -50%) !important;
  box-shadow: 0 0 0 1px rgba(255, 199, 157, 0.24) !important;
  transition: background 320ms ease, box-shadow 320ms ease, scale 320ms ease !important;
}

.lp-process-list > li[data-reached="true"] .lp-step-node,
.sp-timeline-item[data-reached="true"] .sp-step-node {
  background: #ffc79d !important;
  box-shadow: 0 0 0 7px rgba(255, 199, 157, 0.1), 0 0 30px rgba(255, 199, 157, 0.65) !important;
}

.lp-step-icon {
  position: absolute !important;
  z-index: 2;
  left: 50% !important;
  top: 50% !important;
  display: grid !important;
  place-items: center;
  width: 52px !important;
  height: 52px !important;
  margin: 0 !important;
  border: 1px solid rgba(255,199,157,.2) !important;
  border-radius: 999px !important;
  background: #17100c !important;
  color: #d8b99c !important;
  transform: translate(-50%, -50%) scale(0.72) !important;
  opacity: 0;
  transition: opacity 380ms ease, transform 520ms cubic-bezier(0.16, 1, 0.3, 1), color 320ms ease !important;
}

.lp-process-list > li[data-reached="true"] .lp-step-icon {
  color: #ffc79d !important;
  opacity: 1;
  transform: translate(-50%, -50%) scale(1) !important;
}

.lp-step-result {
  display: inline-flex;
  align-items: flex-start;
  gap: 0.55rem;
  margin-top: 1rem !important;
  padding-top: 0.9rem;
  border-top: 1px solid rgba(255,255,255,.09);
  color: #e7d2bf !important;
  font-size: 0.82rem !important;
  font-weight: 650;
  line-height: 1.5;
}

.lp-step-result svg {
  flex: 0 0 auto;
  width: 16px;
  height: 16px;
  margin-top: 0.16rem;
  color: #ffc79d;
}

.lp-final-card {
  width: min(100%, 760px);
  margin-inline: auto;
  text-align: center;
}

/* Subtle view-linked movement where supported; no JavaScript scroll listener. */
@supports (animation-timeline: view()) {
  .lp-project-media img {
    animation: team-project-parallax linear both;
    animation-timeline: view();
    animation-range: entry 0% exit 100%;
  }

  .lp-caps-row,
  .lp-faq-item {
    animation: team-surface-breathe linear both;
    animation-timeline: view();
    animation-range: entry 8% cover 42%;
  }
}

@keyframes team-project-parallax {
  0% { transform: scale(1.075) translateY(2.5%); }
  50% { transform: scale(1.025) translateY(0); }
  100% { transform: scale(1.06) translateY(-2%); }
}

@keyframes team-surface-breathe {
  0% { filter: brightness(.9); }
  100% { filter: brightness(1); }
}

@media (max-width: 820px) {
  .lp-process-list::before,
  .sp-timeline::before,
  .lp-timeline-progress,
  .sp-timeline-progress {
    left: 17px !important;
  }

  .lp-process-list > li,
  .sp-timeline-item {
    grid-template-columns: 42px minmax(0, 1fr) !important;
    min-height: 0;
  }

  .lp-process-list > li .lp-step-body,
  .sp-timeline-item .sp-step,
  .lp-process-list > li[data-side="left"] .lp-step-body,
  .lp-process-list > li[data-side="right"] .lp-step-body,
  .sp-timeline-item[data-side="left"] .sp-step,
  .sp-timeline-item[data-side="right"] .sp-step {
    grid-column: 2 !important;
    text-align: left !important;
  }

  .lp-step-node,
  .sp-step-node {
    left: 17px !important;
  }

  .lp-step-icon {
    display: none !important;
  }
}

@media (prefers-reduced-motion: reduce) {
  .lp-project-media img,
  .lp-caps-row,
  .lp-faq-item,
  .lp-step-body::before,
  .sp-step::before {
    animation: none !important;
    transition: none !important;
    transform: none !important;
    filter: none !important;
  }
}
''',
)

# ---------------------------------------------------------------------------
# Regression tests: team voice, accurate privacy, analytics and motion system.
# ---------------------------------------------------------------------------
test_path = "tests/home-contract.test.mjs"
tests = read(test_path)
tests = tests.replace('test("both contact addresses are wired through one config", async () => {', 'test("the public website is team-first and uses one brand contact", async () => {')
tests = tests.replace('  assert.match(config, /emailPersonal: "daniel@vendzur\\.sk"/);', '  assert.match(config, /founder: "Daniel Vendžúr"/);')
tests = tests.replace('  assert.match(footer, /contact\\.emailPersonal/);', '  assert.doesNotMatch(footer, /contact\\.emailPersonal/);\n  assert.match(footer, /Tím vedie/);')
# Existing wording contracts should follow the new plural voice.
tests = tests.replace('/Čo všetko viem postaviť/', '/Čo všetko vieme postaviť/')
tests += '''

test("privacy copy matches the deployed processors and cookie-free analytics", async () => {
  const privacy = await read("src/routes/ochrana-udajov.tsx");
  const cookies = await read("src/routes/cookies.tsx");
  const root = await read("src/routes/__root.tsx");
  const layout = await read("src/components/site/Layout.tsx");

  assert.match(privacy, /Vercel/);
  assert.match(privacy, /Resend/);
  assert.match(privacy, /Websupport/);
  assert.match(privacy, /Anthropic/);
  assert.match(privacy, /Prenosy mimo EHP/);
  assert.doesNotMatch(privacy, /neprenášam mimo Európsky hospodársky priestor/);
  assert.match(cookies, /Žiadne sledovacie cookies/);
  assert.match(cookies, /Vercel Web Analytics/);
  assert.match(root, /@vercel\/analytics\/react/);
  assert.match(root, /<Analytics \/>/);
  assert.doesNotMatch(layout, /<CookieConsent/);
});

test("collaboration timelines alternate from the sides and respect reduced motion", async () => {
  const landing = await read("src/components/site/PremiumLanding.tsx");
  const process = await read("src/routes/postup.tsx");
  const css = await read("src/components/site/TeamMotionUpgrade.css");

  assert.match(landing, /data-side=\{index % 2 === 0 \? "left" : "right"\}/);
  assert.match(landing, /lp-step-result/);
  assert.match(process, /whileInView=\{\{ opacity: 1, x: 0, y: 0 \}\}/);
  assert.match(css, /animation-timeline: view\(\)/);
  assert.match(css, /prefers-reduced-motion: reduce/);
});
'''
write(test_path, tests)

# Remove temporary audit helper from the final branch. The apply workflow also
# deletes itself before committing, so no diagnostic automation reaches main.
for temp in [
    ROOT / ".github/workflows/team-legal-motion-audit.yml",
    ROOT / ".github/workflows/apply-team-site-upgrade.yml",
    ROOT / "scripts/apply-team-site-upgrade.py",
]:
    if temp.exists():
        temp.unlink()
