/**
 * Reálne nasadené weby, ktoré si vie ktokoľvek otvoriť a overiť.
 *
 * Zámerne tu nie sú žiadne vymyslené „ukážky" — na stránke realizácií
 * má stáť len to, čo naozaj beží na vlastnej doméne. Interaktívne nástroje
 * bez vlastnej domény žijú samostatne v `liveTools`.
 */
export interface Realization {
  name: string;
  type: string;
  domain: string;
  href: string;
  /** Čo web pre firmu rieši — jedna veta bez marketingových fráz. */
  result: string;
  /** Dlhší popis pre podstránku realizácií. */
  detail: string;
  image: string;
  alt: string;
  /** Čo sme na webe dodali — krátke štítky. */
  tools: string[];
  /** Voliteľná interná prípadová štúdia. */
  caseStudyPath?: "/projekty/derat" | "/3d-konfigurator";
}

export const realizations: Realization[] = [
  {
    name: "DERAT",
    type: "Služby · kalkulačka a dopytový asistent",
    domain: "derat.sk",
    href: "https://derat.sk/",
    result: "Kalkulačka prevedie návštevníka od problému k orientačnej cene a pripravenému dopytu.",
    detail:
      "Reálne nasadená deratizačná služba. Návštevník vyberie typ problému a rozsah zásahu, dostane orientačný výsledok a firma prijme kontakt spolu s kontextom potrebným na ďalší krok.",
    image: `${import.meta.env.BASE_URL}work/live/derat.webp`,
    alt: "Domovská stránka DERAT s nadpisom Bez škodcov a kalkulačkou zásahu",
    tools: ["Kalkulačka ceny", "Dopytový asistent"],
    caseStudyPath: "/projekty/derat",
  },
  {
    name: "Môj Plot",
    type: "E-shop · chatbot a kalkulačka",
    domain: "mojplot.sk",
    href: "https://mojplot.sk/",
    result: "Chatbot poradí s výberom plotu a kalkulačka spočíta cenu podľa dĺžky a výšky.",
    detail:
      "E-shop s plotmi, kde chatbot odpovedá na otázky k typom oplotenia a kalkulačka z dĺžky, výšky a doplnkov spočíta orientačnú cenu. Zákazník sa dostane k objednávke alebo dopytu bez telefonovania.",
    image: `${import.meta.env.BASE_URL}work/live/mojplot.webp`,
    alt: "Domovská stránka Môj Plot s kategóriami plotov a hlavným bannerom",
    tools: ["Chatbot", "Kalkulačka plotu"],
  },
  {
    name: "Koverta · konfigurátor",
    type: "Výroba na mieru · 3D konfigurátor",
    domain: "koverta.sk",
    href: "https://koverta.sk/pages/konfigurator",
    result:
      "Zákazník si prístrešok alebo pergolu poskladá v 3D a dopyt pošle aj s hotovou zostavou.",
    detail:
      "Web výrobcu prístreškov a pergol s 3D konfigurátorom. Zákazník vyberie typ, umiestnenie, rozmer, farbu, strechu a výplne, vidí model aj orientačnú cenu a firma dostane dopyt so všetkými údajmi potrebnými na ponuku.",
    image: `${import.meta.env.BASE_URL}work/koverta/konfigurator-carport.webp`,
    alt: "Rozhranie 3D konfigurátora Koverta s nastavením carportu",
    tools: ["3D konfigurátor", "Dopyt so zostavou"],
    caseStudyPath: "/3d-konfigurator",
  },
  {
    name: "Koverta · chatbot",
    type: "Výroba na mieru · chatbot",
    domain: "koverta.sk",
    href: "https://koverta.sk/",
    result: "Asistent poradí s výberom prístrešku alebo pergoly a pripraví ďalší krok.",
    detail:
      "Chatbot na webe Koverta pomáha s otázkami k produktom, výberom riešenia a prípravou dopytu. Samostatná realizácia popri 3D konfigurátore.",
    image: `${import.meta.env.BASE_URL}work/live/koverta.webp`,
    alt: "Web Koverta, na ktorom beží produktový chatbot",
    tools: ["Chatbot", "Produktové poradenstvo"],
  },
  {
    name: "WEBKO",
    type: "Prezentačný web · získavanie dopytov",
    domain: "webko.sk",
    href: "https://www.webko.sk/",
    result: "Sebavedomá prezentácia služby s jasným smerovaním ku kontaktu.",
    detail:
      "Tmavý prezentačný web, ktorý stavia na ukážkach práce. Každá sekcia končí jasným ďalším krokom, takže návštevník nemusí hľadať, kde sa ozvať.",
    image: `${import.meta.env.BASE_URL}work/live/webko.webp`,
    alt: "Tmavá domovská stránka WEBKO s ukážkou webových realizácií",
    tools: ["Prezentačný web", "Cesta ku kontaktu"],
  },
];

/** Živé nástroje mimo vlastnej domény, ktoré sa dajú priamo vyskúšať. */
export const liveTools = [
  {
    name: "APLAN AI",
    href: "https://danielvendzur-code.github.io/aplan-chatbot-backend/",
    note: "Asistent pre plánovanie",
  },
  {
    name: "Môj Chatbot",
    href: "https://danielvendzur-code.github.io/moj.chatbot.backend/",
    note: "Chatbot, ktorý beží na tomto webe",
  },
];
