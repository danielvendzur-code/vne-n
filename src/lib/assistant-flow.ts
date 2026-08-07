import type { AssistantPreset, InterestId } from "../types/assistant";

export type StepId = "interest" | "industry" | "features" | "timeline" | "contact";

export const STEPS: StepId[] = ["interest", "industry", "features", "timeline", "contact"];

export const QUESTIONS: Record<StepId, [title: string, subtitle: string]> = {
  interest: [
    "Aké riešenie chcete na web?",
    "Vyberte jednu možnosť. Ďalšie kroky sa jej automaticky prispôsobia.",
  ],
  industry: [
    "Čo robí vaša firma?",
    "Vyberte odvetvie, aby som vedel prispôsobiť odporúčané funkcie.",
  ],
  features: [
    "Ktoré doplnkové funkcie chcete?",
    "Zobrazujem iba doplnky, ktoré dávajú zmysel pre vybraný typ riešenia.",
  ],
  timeline: ["Kedy to chcete mať hotové?", "Vyberte približný termín."],
  contact: ["Kam vám môžem poslať ďalší krok?", "Ozvem sa do jedného pracovného dňa."],
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
    label: "Chatbot",
    description: "Odpovedá zákazníkom, poradí im a vybaví servisné požiadavky.",
    icon: "chat",
  },
  {
    id: "calcbot",
    label: "Chatbot s kalkulačkou",
    description: "Vypočíta cenu, spotrebu alebo rozsah podľa vašich pravidiel.",
    icon: "calculator",
  },
  {
    id: "product",
    label: "Chatbot s konfigurátorom",
    description: "Prevedie zákazníka výberom produktu, variantov a doplnkov.",
    icon: "cart",
  },
  {
    id: "custom",
    label: "Riešenie na mieru",
    description: "Poskladáme vlastný proces presne podľa vašej firmy.",
    icon: "spark",
  },
];

export type IndustryOption = {
  id: string;
  label: string;
  icon: "tools" | "cart" | "food" | "heart" | "factory" | "spark";
  examples: string[];
};

export const INDUSTRIES: IndustryOption[] = [
  { id: "sluzby", label: "Služby a remeslá", icon: "tools", examples: [] },
  { id: "eshop", label: "E-shop a predaj", icon: "cart", examples: [] },
  { id: "gastro", label: "Gastro a ubytovanie", icon: "food", examples: [] },
  { id: "zdravie", label: "Zdravie a krása", icon: "heart", examples: [] },
  { id: "vyroba", label: "Výroba a B2B", icon: "factory", examples: [] },
  { id: "ine", label: "Iné odvetvie", icon: "spark", examples: [] },
];

export type FeatureOption = {
  id: string;
  label: string;
  description: string;
};

export const FEATURES: FeatureOption[] = [
  { id: "cena", label: "Počítať cenu", description: "Podľa rozmerov, množstva alebo vašich pravidiel." },
  { id: "varianty", label: "Konfigurovať produkt alebo službu", description: "Varianty, rozmery, materiál a doplnky." },
  { id: "advisor", label: "Odporúčať vhodný produkt", description: "Vyberie z ponuky podľa potrieb zákazníka." },
  { id: "compare", label: "Porovnať produkty alebo varianty", description: "Ukáže rozdiely a pomôže s rozhodnutím." },
  { id: "tracking", label: "Sledovať objednávku", description: "Stav platby, expedície a doručenia." },
  { id: "order-change", label: "Zmeniť alebo zrušiť objednávku", description: "Overí údaje a pripraví požiadavku." },
  { id: "returns", label: "Riešiť vrátenie a reklamáciu", description: "Zozbiera objednávku, dôvod a fotografie." },
  { id: "stock-alert", label: "Upozorniť na dostupnosť alebo cenu", description: "Upozorní zákazníka na sklad alebo zmenu ceny." },
  { id: "cart-recovery", label: "Uložiť rozpracovaný výber", description: "Zákazník sa môže vrátiť bez začínania odznova." },
  { id: "rezervacie", label: "Rezervovať termíny", description: "Konzultáciu alebo službu zapíše do kalendára." },
  { id: "fotky", label: "Prijímať fotky a prílohy", description: "Podklady k odhadu, návrhu alebo reklamácii." },
  { id: "payment", label: "Poslať platobný odkaz alebo zálohu", description: "Bezpečný ďalší krok k objednávke." },
  { id: "document", label: "Vytvoriť ponuku alebo PDF zhrnutie", description: "Pripraví prehľad pre zákazníka aj firmu." },
  { id: "handoff", label: "Odovzdať rozhovor človeku", description: "Kolega dostane celý kontext konverzácie." },
  { id: "tabulka", label: "Zapisovať do tabuľky alebo CRM", description: "Každý dopyt uloží na správne miesto." },
  { id: "jazyky", label: "Komunikovať v cudzom jazyku", description: "Automaticky použije jazyk zákazníka." },
];

export const FEATURE_IDS_BY_INTEREST: Record<InterestId, string[]> = {
  chatbot: ["tracking", "order-change", "returns", "handoff", "tabulka", "jazyky", "stock-alert", "rezervacie"],
  calcbot: ["cena", "document", "payment", "fotky", "tabulka", "rezervacie", "handoff"],
  product: ["varianty", "advisor", "compare", "stock-alert", "cart-recovery", "payment", "document", "tabulka"],
  booking: ["rezervacie", "payment", "jazyky", "tabulka", "handoff", "document"],
  custom: ["handoff", "document", "tabulka", "jazyky", "fotky", "rezervacie", "payment"],
};

export const RECOMMENDED_FEATURES: Record<InterestId, string[]> = {
  chatbot: ["tracking", "handoff", "tabulka"],
  calcbot: ["cena", "document", "payment"],
  product: ["varianty", "advisor", "compare"],
  booking: ["rezervacie", "payment", "tabulka"],
  custom: ["handoff", "document", "tabulka"],
};

export type TimelineOption = {
  id: string;
  label: string;
  description: string;
};

export const TIMELINES: TimelineOption[] = [
  { id: "asap", label: "Čo najskôr", description: "Začnem, len čo pošlete podklady." },
  { id: "mesiac", label: "Do mesiaca", description: "Máme priestor všetko doladiť." },
  { id: "kvartal", label: "Za dva až tri mesiace", description: "Rozdelíme to na menšie kroky." },
  { id: "rozhliadam", label: "Len sa pozerám", description: "Najprv si chcete ujasniť možnosti." },
];

export const PRESET_TO_INTEREST: Record<AssistantPreset, InterestId> = {
  calculator: "calcbot",
  inquiry: "chatbot",
  advisor: "chatbot",
  booking: "chatbot",
};

export const labelOf = (
  options: ReadonlyArray<{ id: string; label: string }>,
  id: string | null,
): string => options.find((option) => option.id === id)?.label ?? "—";

export function buildProposalNumber(): string {
  return `NV-${Date.now().toString(36).toUpperCase().slice(-6)}`;
}
