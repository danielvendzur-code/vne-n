/**
 * Reálne nasadené weby, ktoré si vie ktokoľvek otvoriť a overiť.
 *
 * Zámerne tu nie sú žiadne vymyslené „ukážky" — na stránke realizácií
 * má stáť len to, čo naozaj beží na vlastnej doméne. Interaktívne demá
 * nástrojov žijú samostatne v `src/data/projects.ts` a sú tak aj
 * označené.
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
}

export const realizations: Realization[] = [
  {
    name: "Môj Plot",
    type: "E-commerce · produktový web",
    domain: "mojplot.sk",
    href: "https://mojplot.sk/",
    result: "Prehľadný výber oplotenia, služieb a ďalšieho kroku pre zákazníka.",
    detail:
      "Produktový web s ponukou plotov, kde sa zákazník dostane od typu oplotenia k dopytu bez toho, aby musel telefonovať. Štruktúra ponuky, texty aj cesta ku kontaktu sú postavené tak, aby bolo jasné, čo si vybrať.",
    image: `${import.meta.env.BASE_URL}work/portfolio/mojplot.webp`,
    alt: "Domovská stránka Môj Plot s ponukou kvalitných plotov",
  },
  {
    name: "Koverta",
    type: "E-commerce · dopytový asistent",
    domain: "koverta.sk",
    href: "https://koverta.sk/",
    result: "Produktový web pre dom a záhradu doplnený o rýchly kontakt a asistenta.",
    detail:
      "Web pre produkty do domu a záhrady. Popri katalógu tu beží asistent, ktorý sa zákazníka opýta na rozmery a použitie, takže dopyt príde s údajmi potrebnými na ponuku.",
    image: `${import.meta.env.BASE_URL}work/portfolio/koverta.webp`,
    alt: "Domovská stránka Koverta s modernou pergolou",
  },
  {
    name: "WEBKO",
    type: "Prezentačný web · získavanie dopytov",
    domain: "webko.sk",
    href: "https://www.webko.sk/",
    result: "Sebavedomá prezentácia služby s jasným smerovaním ku kontaktu.",
    detail:
      "Tmavý prezentačný web, ktorý stavia na ukážkach práce. Každá sekcia končí jasným ďalším krokom, takže návštevník nemusí hľadať, kde sa ozvať.",
    image: `${import.meta.env.BASE_URL}work/portfolio/webko.webp`,
    alt: "Tmavá domovská stránka WEBKO s ukážkou webových realizácií",
  },
];

/** Živé nástroje, ktoré bežia mimo vlastného webu a dajú sa vyskúšať. */
export const liveTools = [
  {
    name: "DERAT kalkulačka",
    href: "https://derat-chatbot-backend.vercel.app/",
    note: "Cenová kalkulačka pre deratizáciu",
  },
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
