import type { AssistantPreset } from "@/types/assistant";

/**
 * Scenáre produktovej plochy.
 *
 * Vlastný súbor, nie konštanta v komponente: keby tu boli, súbor by
 * exportoval komponent aj dáta a Fast Refresh by pri každej úprave textu
 * prekresľoval celý strom namiesto samotného komponentu.
 *
 * Tri scenáre sú e-shopové, štvrtý ukazuje, že to isté riešenie platí aj
 * pre firmy so službami — vrátane kalkulačky a konfigurátora.
 */

export type SurfaceKey = "objednavky" | "poradca" | "vratenie" | "sluzby";

interface Scenario {
  key: SurfaceKey;
  index: string;
  label: string;
  /** Pre koho scenár je. Tri sú e-shopové, štvrtý ukazuje služby. */
  tag: "E-shop" | "Služby";
  preset: AssistantPreset;
  note: string;
  turns: Array<{ who: "Zákazník" | "Chatbot"; text: string }>;
  /** Objednávku chatbot vybaví, dopyt naopak pošle ďalej. */
  resultLabel: string;
  result: string;
}

export const SCENARIOS: Scenario[] = [
  {
    key: "objednavky",
    index: "01",
    label: "Objednávky",
    tag: "E-shop",
    preset: "inquiry",
    note: "Stav objednávky, zmena adresy, zrušenie aj storno — bez vášho zásahu.",
    turns: [
      { who: "Zákazník", text: "Kde je moja objednávka 24815?" },
      { who: "Chatbot", text: "Odoslaná včera, doručenie zajtra do 14:00. Chcete zmeniť adresu?" },
      { who: "Zákazník", text: "Áno, pošlite to prosím do práce." },
    ],
    resultLabel: "Vybavené bez vás",
    result: "Adresa zmenená, zákazník má potvrdenie. Vám ostane len záznam.",
  },
  {
    key: "poradca",
    index: "02",
    label: "Poradca",
    tag: "E-shop",
    preset: "advisor",
    note: "Odporučí z vašej ponuky podľa toho, čo zákazník naozaj rieši.",
    turns: [
      { who: "Zákazník", text: "Hľadám bežecké topánky na asfalt, veľkosť 43." },
      { who: "Chatbot", text: "Bežíte skôr dlhé trasy alebo krátke intervaly?" },
      { who: "Zákazník", text: "Dlhé, tak pätnásť kilometrov." },
    ],
    resultLabel: "Výsledok",
    result: "Tri modely z vašej ponuky a zákazník ide rovno do košíka.",
  },
  {
    key: "vratenie",
    index: "03",
    label: "Vrátenie",
    tag: "E-shop",
    preset: "inquiry",
    note: "Vrátenie, výmena aj reklamácia so všetkými údajmi na jednom mieste.",
    turns: [
      { who: "Zákazník", text: "Chcem vrátiť tovar z objednávky 24815." },
      { who: "Chatbot", text: "Vraciate ju celú alebo len jednu položku?" },
      { who: "Zákazník", text: "Len jednu — nesedela veľkosť." },
    ],
    resultLabel: "Vám príde",
    result: "Vrátenie založené. Objednávku, položku aj dôvod máte na e-maile.",
  },
  {
    key: "sluzby",
    index: "04",
    label: "Služby",
    tag: "Služby",
    preset: "calculator",
    note: "Pre firmy so službami: kalkulačka ceny aj konfigurátor riešenia.",
    turns: [
      { who: "Zákazník", text: "Koľko by stál plot na 42 metrov?" },
      { who: "Chatbot", text: "Panely alebo poplastované pletivo? A akú výšku potrebujete?" },
      { who: "Zákazník", text: "Panely, výška 1,5 metra." },
    ],
    resultLabel: "Vám príde",
    result: "Orientačná cena 3 180 € aj s rozpisom materiálu a montáže.",
  },
];
