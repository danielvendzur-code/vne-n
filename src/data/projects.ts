export type ProjectCategory =
  | "Pokročilý cenový výpočet"
  | "Presné zadanie"
  | "Výber produktu"
  | "Cena podľa kombinácie možností"
  | "Produkty a objednávky"
  | "Dopyt a termín";

export type PreviewType = "assistant" | "calculator" | "configurator";

export type DemoPresentation = "compact" | "wide";

export interface Project {
  slug: string;
  label: string; // "Ukážka 01"
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
    slug: "ukazka-01",
    label: "Ukážka 01",
    title: "Kalkulačka pre služby",
    category: "Pokročilý cenový výpočet",
    shortDescription:
      "Výber služby, rozsahu, dopravy, doplnkov a údajov potrebných na výpočet ceny.",
    problem:
      "Zákazník sa opýta na cenu, ale bez rozsahu a doplnkov sa nedá odpovedať.",
    solution:
      "Kalkulačka vedie klienta cez rozsah, doplnky a lokalitu. Na konci zobrazí orientačný rozsah a odošle firme kompletné zadanie.",
    result: "Firma dostáva dopyty s údajmi potrebnými na presnú ponuku.",
    accent: "#175e50",
    previewType: "calculator",
    demoUrl: null,
    demoPresentation: "wide",
    featured: true,
  },
  {
    slug: "ukazka-02",
    label: "Ukážka 02",
    title: "Dopytový asistent",
    category: "Presné zadanie",
    shortDescription:
      "Postupné otázky, ktoré z krátkej správy pripravia konkrétny dopyt.",
    problem: "Kontaktný formulár prichádza s vetou bez kontextu.",
    solution: "Asistent sa opýta na to, čo je pre danú službu podstatné.",
    result: "Prvá odpoveď firmy môže byť konkrétna.",
    accent: "#e58a5b",
    previewType: "assistant",
    demoUrl: null,
    demoPresentation: "compact",
    featured: true,
  },
  {
    slug: "ukazka-03",
    label: "Ukážka 03",
    title: "Produktový poradca",
    category: "Výber produktu",
    shortDescription:
      "Pomoc s výberom podľa spôsobu použitia, preferencií a rozpočtu.",
    problem: "Široká ponuka klienta paralyzuje.",
    solution: "Krátky sprievodca zúži výber na relevantné varianty.",
    result: "Klient sa vie ľahšie rozhodnúť.",
    accent: "#c9a85f",
    previewType: "configurator",
    demoUrl: null,
    demoPresentation: "compact",
    featured: true,
  },
  {
    slug: "ukazka-04",
    label: "Ukážka 04",
    title: "Kalkulačka s viacerými pravidlami",
    category: "Cena podľa kombinácie možností",
    shortDescription:
      "Výpočet podľa rozmerov, materiálu, montáže, dopravy a doplnkov.",
    problem: "Ceny závisia od kombinácie viacerých premenných.",
    solution:
      "Kalkulačka pozná pravidlá firmy a použije správnu sadzbu pre danú kombináciu.",
    result: "Cena alebo rozsah zodpovedá cenníku.",
    accent: "#175e50",
    previewType: "calculator",
    demoUrl: null,
    demoPresentation: "wide",
    featured: true,
  },
  {
    slug: "ukazka-05",
    label: "Ukážka 05",
    title: "Asistent pre e-shop",
    category: "Produkty a objednávky",
    shortDescription:
      "Výber produktu, otázky o doprave a informácie o objednávke po napojení systému.",
    problem: "E-shop stráca zákazníkov pri otázkach o produkte alebo objednávke.",
    solution:
      "Asistent poradí s výberom, doručením a po napojení odpovedá na stav objednávky.",
    result: "Menej opakovaných otázok na podporu.",
    accent: "#e58a5b",
    previewType: "assistant",
    demoUrl: null,
    demoPresentation: "compact",
    featured: false,
  },
  {
    slug: "ukazka-06",
    label: "Ukážka 06",
    title: "Rezervačný asistent",
    category: "Dopyt a termín",
    shortDescription:
      "Zistí základné údaje a následne otvorí dostupné termíny v kalendári.",
    problem: "Klient chce rovno termín, nie výmenu e-mailov.",
    solution:
      "Asistent zistí typ služby a otvorí kalendár s reálnymi voľnými termínmi.",
    result: "Konzultácia je dohodnutá v jednom kroku.",
    accent: "#c9a85f",
    previewType: "assistant",
    demoUrl: null,
    demoPresentation: "compact",
    featured: false,
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
