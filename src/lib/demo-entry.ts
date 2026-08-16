import type { AssistantPreset } from "@/types/assistant";

/**
 * Vstup z ukážky.
 *
 * Keď pošlete klientovi ukážku kalkulačky, nemá zmysel, aby na webe
 * pristál na všeobecnej domovskej stránke a hľadal, čo s tým súvisí.
 * Odkaz s parametrom `?ukazka=kalkulacka` otvorí web rovno na tom, o čom
 * ste sa bavili: produktová plocha stojí na správnom nástroji, hore je
 * pásik, ktorý na e-mail nadväzuje, a ďalší krok je jedno kliknutie.
 *
 * Odkazy, ktoré sa dajú posielať:
 *
 *   mojchatbot.sk/?ukazka=kalkulacka
 *   mojchatbot.sk/?ukazka=chatbot
 *   mojchatbot.sk/?ukazka=konfigurator
 *   mojchatbot.sk/?ukazka=eshop
 *   mojchatbot.sk/?ukazka=formular      → rovno na dopytový formulár
 *
 * Neznáma alebo chýbajúca hodnota nič nerozbije — stránka sa správa
 * ako obyčajná domovská stránka.
 */
export type DemoKey = "chatbot" | "kalkulacka" | "konfigurator" | "eshop" | "formular";

export interface DemoEntry {
  key: DemoKey;
  /** Ktorý stav produktovej plochy sa otvorí. */
  surface: "objednavky" | "poradca" | "vratenie" | "sluzby";
  /** V akom režime sa otvorí chatbot, keď naň klikne. */
  preset: AssistantPreset;
  /** Nadviazanie na e-mail. Krátka veta, nie marketing. */
  band: string;
  /** Čo ponúkame ako ďalší krok. */
  action: { label: string; kind: "assistant" | "form" };
}

const ENTRIES: Record<DemoKey, DemoEntry> = {
  kalkulacka: {
    key: "kalkulacka",
    surface: "sluzby",
    preset: "calculator",
    band: "Poslali sme vám ukážku kalkulačky. Takto pracuje na ostro.",
    action: { label: "Vyskúšať kalkulačku", kind: "assistant" },
  },
  chatbot: {
    key: "chatbot",
    surface: "objednavky",
    preset: "inquiry",
    band: "Poslali sme vám ukážku chatbota. Takto pracuje na ostro.",
    action: { label: "Vyskúšať chatbota", kind: "assistant" },
  },
  konfigurator: {
    key: "konfigurator",
    surface: "poradca",
    preset: "product",
    band: "Poslali sme vám ukážku konfigurátora. Takto pracuje na ostro.",
    action: { label: "Vyskúšať konfigurátor", kind: "assistant" },
  },
  eshop: {
    key: "eshop",
    surface: "vratenie",
    preset: "inquiry",
    band: "Poslali sme vám ukážku pre e-shop: objednávky, vrátenie aj reklamácie.",
    action: { label: "Vyskúšať naživo", kind: "assistant" },
  },
  formular: {
    key: "formular",
    surface: "objednavky",
    preset: "inquiry",
    band: "Nadväzujeme na našu správu. Napíšte nám, čo potrebujete.",
    action: { label: "Vyplniť dopyt", kind: "form" },
  },
};

const ALIASES: Record<string, DemoKey> = {
  kalkulacka: "kalkulacka",
  kalkulačka: "kalkulacka",
  calculator: "kalkulacka",
  chatbot: "chatbot",
  bot: "chatbot",
  konfigurator: "konfigurator",
  konfigurátor: "konfigurator",
  configurator: "konfigurator",
  eshop: "eshop",
  "e-shop": "eshop",
  objednavky: "eshop",
  formular: "formular",
  formulár: "formular",
  form: "formular",
  kontakt: "formular",
};

/**
 * Prevedie hodnotu z adresy na vstup. Vstup od návštevníka sa nikdy
 * nepoužije priamo — mapuje sa cez zoznam známych hodnôt, takže do
 * stránky sa nedostane nič, čo sme sami nenapísali.
 */
export function readDemoEntry(raw: string | undefined | null): DemoEntry | null {
  if (!raw) return null;
  const key = ALIASES[raw.trim().toLowerCase()];
  return key ? ENTRIES[key] : null;
}

/** Všetky odkazy, ktoré sa dajú posielať klientom. */
export const DEMO_KEYS = Object.keys(ENTRIES) as DemoKey[];
