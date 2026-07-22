import type { AssistantPreset, InterestId } from "../types/assistant";

export type StepId =
  | "interest"
  | "industry"
  | "channel"
  | "features"
  | "volume"
  | "timeline"
  | "contact";

export const STEPS: StepId[] = [
  "interest",
  "industry",
  "channel",
  "features",
  "volume",
  "timeline",
  "contact",
];

export const QUESTIONS: Record<StepId, [title: string, subtitle: string]> = {
  interest: [
    "Čo má zákazník cez chatbota vybaviť?",
    "Vyberte hlavný typ riešenia. Výpočty, konfiguráciu a ďalšie funkcie doladíte v ďalších krokoch.",
  ],
  industry: [
    "V akom odvetví podnikáte?",
    "Podľa odvetvia pripravím vhodné ukážky a tón komunikácie.",
  ],
  channel: [
    "Kde má asistent bežať?",
    "Vyberte hlavné miesto nasadenia — ďalšie vieme pridať neskôr.",
  ],
  features: ["Čo má asistent zvládnuť?", "Označte všetko, čo dáva zmysel. Pokojne viac možností."],
  volume: ["Koľko dopytov mesačne riešite?", "Stačí odhad — pomôže nastaviť rozsah riešenia."],
  timeline: [
    "Kedy to plánujete spustiť?",
    "Stačí orientačne — pomôže mi navrhnúť tempo a ďalší krok.",
  ],
  contact: [
    "Zhrnutie návrhu",
    "Skontrolujte výber a nechajte mi kontakt — pripravím návrh na mieru.",
  ],
};

export type InterestOption = {
  id: InterestId;
  label: string;
  description: string;
  badge?: string;
  icon: "chat" | "calculator" | "cart" | "calendar" | "spark";
};

export const INTERESTS: InterestOption[] = [
  {
    id: "chatbot",
    label: "AI chatbot a dopyty",
    description: "Odpovedá návštevníkom 24/7, poradí a pripraví dopyt s potrebným kontextom.",
    icon: "chat",
  },
  {
    id: "calcbot",
    label: "Chatbot s výpočtom",
    description: "Vypočíta cenu, spotrebu alebo rozsah presne podľa vašich pravidiel.",
    icon: "calculator",
  },
  {
    id: "product",
    label: "Chatbot s konfigurátorom",
    description: "Prevedie zákazníka výberom modelu, variantov a doplnkov.",
    icon: "cart",
  },
  {
    id: "booking",
    label: "Rezervácie a termíny",
    description: "Zistí potrebné údaje, ponúkne termín a odošle potvrdenie.",
    icon: "calendar",
  },
  {
    id: "custom",
    label: "Vlastné riešenie",
    description: "Popíšte svoj proces a navrhnem asistenta presne podľa neho.",
    icon: "spark",
  },
];

export type IndustryOption = {
  id: string;
  label: string;
  icon: "tools" | "cart" | "food" | "heart" | "factory" | "spark";
  /* Reálne use-casy chatbotov v danom odvetví — zobrazia sa po výbere. */
  examples: string[];
};

export const INDUSTRIES: IndustryOption[] = [
  {
    id: "sluzby",
    label: "Služby a remeslá",
    icon: "tools",
    examples: [
      "Cenový dopyt aj s fotkami rozsahu práce",
      "Rezervácia obhliadky priamo do kalendára",
      "Zachytenie urgentných požiadaviek mimo pracovného času",
    ],
  },
  {
    id: "eshop",
    label: "E-shop a predaj",
    icon: "cart",
    examples: [
      "Stav objednávky a doručenia bez čakania na podporu",
      "Odporúčanie produktu podľa potreby zákazníka",
      "Záchrana opusteného košíka a rýchle vrátenie tovaru",
    ],
  },
  {
    id: "gastro",
    label: "Gastro a ubytovanie",
    icon: "food",
    examples: [
      "Rezervácia stola či izby vrátane čakacej listiny",
      "Objednávky a menu s alergénmi na jednu správu",
      "Otváracie hodiny a informácie 24/7 aj vo viacerých jazykoch",
    ],
  },
  {
    id: "zdravie",
    label: "Zdravie a krása",
    icon: "heart",
    examples: [
      "Objednanie termínu s automatickou pripomienkou",
      "Predpríprava klienta pred návštevou",
      "Cenník, permanentky a časté otázky bez telefonátu",
    ],
  },
  {
    id: "vyroba",
    label: "Výroba a B2B",
    icon: "factory",
    examples: [
      "Kvalifikácia dopytov ešte pred obchodníkom",
      "Technické parametre a dostupnosť z katalógu",
      "Servisné dopyty a náhradné diely s presným kontextom",
    ],
  },
  {
    id: "ine",
    label: "Iné odvetvie",
    icon: "spark",
    examples: [
      "Odpovede na časté otázky 24/7",
      "Zber dopytov a kontaktov s kontextom",
      "Odovzdanie zložitých otázok živému človeku",
    ],
  },
];

export type ChannelOption = {
  id: string;
  label: string;
  description: string;
};

export const CHANNELS: ChannelOption[] = [
  { id: "web", label: "Na našom webe", description: "Widget doplníme na existujúce stránky." },
  {
    id: "novy-web",
    label: "Web ešte len chystáme",
    description: "Asistenta navrhneme spolu s novým webom.",
  },
  {
    id: "social",
    label: "Facebook / Instagram",
    description: "Odpovede v Messengeri a na Instagrame.",
  },
  { id: "whatsapp", label: "WhatsApp", description: "Konverzácie priamo v telefóne zákazníka." },
  {
    id: "neviem",
    label: "Neviem, poraďte mi",
    description: "Odporučím najvhodnejší kanál podľa cieľa.",
  },
];

export type FeatureOption = {
  id: string;
  label: string;
  description: string;
};

export const FEATURES: FeatureOption[] = [
  {
    id: "faq",
    label: "Odpovedať na časté otázky",
    description: "Ceny, otváracie hodiny, postupy…",
  },
  {
    id: "dopyty",
    label: "Zbierať dopyty a kontakty",
    description: "Použiteľné podklady ešte pred telefonátom.",
  },
  {
    id: "cena",
    label: "Počítať podľa parametrov",
    description: "Cena, spotreba alebo rozsah z údajov zákazníka.",
  },
  {
    id: "varianty",
    label: "Ponúkať varianty a doplnky",
    description: "Zákazník si vyskladá model bez neistoty.",
  },
  {
    id: "fotky",
    label: "Prijímať fotky od zákazníka",
    description: "Rozsah práce je jasný ešte pred obhliadkou.",
  },
  {
    id: "rezervacie",
    label: "Rezervovať termíny",
    description: "Prepojenie na kalendár a pripomienky.",
  },
  {
    id: "pdf",
    label: "Vygenerovať PDF ponuku",
    description: "Hotová ponuka na stiahnutie či do e-mailu.",
  },
  { id: "scoring", label: "Triediť dopyty", description: "Priorita dopytu podľa hodnoty zákazky." },
  {
    id: "email",
    label: "Posielať zhrnutia e-mailom",
    description: "Vám aj zákazníkovi automaticky.",
  },
  {
    id: "crm",
    label: "Zapisovať do CRM / tabuľky",
    description: "Každý dopyt na správnom mieste.",
  },
  {
    id: "handoff",
    label: "Prepnúť na živého človeka",
    description: "Zložitú požiadavku odovzdá aj s kontextom.",
  },
  {
    id: "jazyky",
    label: "Odpovedať vo viacerých jazykoch",
    description: "Slovenčina, angličtina, nemčina a ďalšie.",
  },
];

/* Predvolené funkcie podľa vybraného záujmu — dajú sa upraviť. */
export const RECOMMENDED_FEATURES: Record<InterestId, string[]> = {
  chatbot: ["faq", "dopyty"],
  calcbot: ["cena", "dopyty", "pdf", "email"],
  product: ["varianty", "cena", "dopyty"],
  booking: ["rezervacie", "dopyty", "email"],
  custom: [],
};

export type VolumeOption = {
  id: string;
  label: string;
  description: string;
};

export const VOLUMES: VolumeOption[] = [
  { id: "v20", label: "Do 20", description: "Občasné dopyty, dôraz na osobný tón." },
  { id: "v100", label: "20 – 100", description: "Stabilný tok — asistent odbremení telefón." },
  { id: "v500", label: "100 – 500", description: "Vyťažená prevádzka, triedenie má veľký efekt." },
  {
    id: "v500plus",
    label: "Viac než 500",
    description: "Veľký objem — automatizácia je nevyhnutná.",
  },
];

export type TimelineOption = {
  id: string;
  label: string;
  description: string;
};

export const TIMELINES: TimelineOption[] = [
  { id: "asap", label: "Čo najskôr", description: "Chcem to rozbehnúť hneď, ako sa dá." },
  { id: "1-2m", label: "Do 1–2 mesiacov", description: "Mám čas na prípravu a ladenie." },
  { id: "quarter", label: "Tento kvartál", description: "Plánujem to v najbližších mesiacoch." },
  {
    id: "explore",
    label: "Zatiaľ len zisťujem",
    description: "Zbieram informácie, termín zatiaľ neriešim.",
  },
];

export const PRESET_TO_INTEREST: Record<AssistantPreset, InterestId> = {
  calculator: "calcbot",
  inquiry: "chatbot",
  advisor: "chatbot",
  booking: "booking",
};

export const labelOf = (
  options: ReadonlyArray<{ id: string; label: string }>,
  id: string | null,
): string => options.find((option) => option.id === id)?.label ?? "—";

export function buildProposalNumber(): string {
  return `NV-${Date.now().toString(36).toUpperCase().slice(-6)}`;
}
