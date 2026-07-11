export type ProjectCategory =
  | "Kalkulačka a konfigurátor"
  | "3D konfigurátor"
  | "Dopytový asistent"
  | "Produktový konfigurátor"
  | "Kalkulačka a dopytový asistent";

export type PreviewType = "form" | "configurator" | "assistant" | "viewer-3d";

export type DemoPresentation = "inline" | "dialog" | "fullscreen";

export interface Project {
  slug: string;
  title: string;
  category: ProjectCategory;
  shortDescription: string;
  problem: string;
  solution: string;
  result: string;
  accent: string;
  previewType: PreviewType;
  demoUrl: string | null;
  demoPresentation: DemoPresentation;
  featured: boolean;
}

export const projects: Project[] = [
  {
    slug: "mojplot",
    title: "MojPlot",
    category: "Kalkulačka a konfigurátor",
    shortDescription:
      "Výber typu plota, rozmerov, brány, bránky, montáže a orientačného cenového rozsahu.",
    problem:
      "Návštevník na stránke firmy nevedel odhadnúť, koľko bude jeho plot stáť, a písal krátke správy bez rozmerov.",
    solution:
      "Kalkulačka vedie klienta cez typ plota, dĺžku, výšku, počet brán a montáž. Na konci zobrazí orientačný cenový rozsah a odošle firme kompletné zadanie.",
    result:
      "Firma dostáva dopyty s rozmermi, typom a vybranou bránou. Cenovú ponuku pripraví bez viacnásobnej výmeny e-mailov.",
    accent: "#175e50",
    previewType: "configurator",
    demoUrl: null,
    demoPresentation: "dialog",
    featured: true,
  },
  {
    slug: "koverta",
    title: "Koverta",
    category: "3D konfigurátor",
    shortDescription:
      "Výber konštrukcie, rozmerov, farieb a doplnkov prístrešku v jednom prehľadnom rozhraní.",
    problem:
      "Klient si prístrešok bez ukážky nevedel predstaviť a rozhodnutie odkladal.",
    solution:
      "3D konfigurátor mení podobu prístrešku v reálnom čase podľa výberu konštrukcie, farby, rozmerov a doplnkov.",
    result:
      "Návštevník odchádza s konkrétnou predstavou. Firma pozná presnú konfiguráciu ešte pred prvým hovorom.",
    accent: "#e58a5b",
    previewType: "viewer-3d",
    demoUrl: null,
    demoPresentation: "fullscreen",
    featured: true,
  },
  {
    slug: "kamenarstvo",
    title: "Kamenárstvo",
    category: "3D konfigurátor",
    shortDescription:
      "Výber typu hrobu, tvaru pomníka, farby kameňa, písma a ďalších detailov.",
    problem:
      "Citlivá téma, pri ktorej klient potrebuje pokoj a jasné možnosti bez nátlaku predavača.",
    solution:
      "Konfigurátor zobrazuje pomník v 3D a umožňuje pokojne prejsť tvar, kameň, písmo a doplnky vlastným tempom.",
    result:
      "Klient príde do predajne pripravený. Konzultácia sa venuje detailom, nie základnému výberu.",
    accent: "#5e6964",
    previewType: "viewer-3d",
    demoUrl: null,
    demoPresentation: "fullscreen",
    featured: true,
  },
  {
    slug: "aplan",
    title: "Aplan",
    category: "Dopytový asistent",
    shortDescription:
      "Asistent návštevníka nasmeruje podľa jeho situácie a pripraví údaje potrebné na prvú konzultáciu.",
    problem:
      "Klienti nevedeli, do ktorej služby patrí ich zadanie, a e-maily boli príliš všeobecné.",
    solution:
      "Asistent kladie krátke otázky, rozpozná typ zadania a zozbiera údaje, ktoré firma reálne potrebuje.",
    result:
      "Prvá konzultácia začína pri konkrétnom zadaní, nie pri základných otázkach.",
    accent: "#175e50",
    previewType: "assistant",
    demoUrl: null,
    demoPresentation: "dialog",
    featured: false,
  },
  {
    slug: "vasasauna",
    title: "VašaSauna",
    category: "Produktový konfigurátor",
    shortDescription:
      "Výber typu sauny, umiestnenia, veľkosti, materiálu, skla a doplnkov.",
    problem:
      "Široká ponuka materiálov a rozmerov klienta odrádzala od vyplnenia formulára.",
    solution:
      "Produktový konfigurátor rozdelí rozhodnutie na zrozumiteľné kroky a ukáže dostupné kombinácie.",
    result:
      "Firma dostáva dopyty s vybraným typom, materiálom a doplnkami. Ponuka odchádza rýchlejšie.",
    accent: "#c9a85f",
    previewType: "configurator",
    demoUrl: null,
    demoPresentation: "dialog",
    featured: true,
  },
  {
    slug: "derat",
    title: "Derat",
    category: "Kalkulačka a dopytový asistent",
    shortDescription:
      "Zistenie typu problému, rozsahu zásahu, lokality a údajov potrebných na cenovú ponuku.",
    problem:
      "Zákazník v strese potrebuje rýchlu odpoveď. Klasický formulár ho spomalí.",
    solution:
      "Nástroj zistí typ problému a rozsah, ponúkne orientačnú cenu a odovzdá firme jasný dopyt s lokalitou.",
    result:
      "Zásah je možné naplánovať bez zbytočných telefonátov navyše.",
    accent: "#cd7146",
    previewType: "assistant",
    demoUrl: null,
    demoPresentation: "dialog",
    featured: false,
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
