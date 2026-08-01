export const siteConfig = {
  brand: "Môj Chatbot",
  visualVersion: "taste-system-20260723-v7",
  title: "Môj Chatbot — chatboty, kalkulačky a konfigurátory na mieru",
  description:
    "Chatboty, kalkulačky a konfigurátory na mieru, ktoré odpovedajú zákazníkom a pripravujú použiteľné dopyty.",
  team: {
    label: "Tím Môj Chatbot",
    founder: "Daniel Vendžúr",
    founderRole: "zakladateľ a produktový dizajnér",
  },
  contact: {
    /** Jediná verejná kontaktná adresa značky. */
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
