export const siteConfig = {
  brand: "Môj Chatbot",
  visualVersion: "taste-system-20260806-v8",
  title: "Môj Chatbot — chatboty pre e-shopy aj firmy so službami",
  description:
    "Chatboty na mieru pre e-shopy aj firmy so službami. Odpovede, výpočet ceny, výber produktu, objednávky, reklamácie a pripravené dopyty.",
  team: {
    label: "Tím Môj Chatbot",
    founder: "Daniel Vendžúr",
    founderRole: "zakladateľ a produktový dizajnér",
    responsibleRole: "produktový dizajnér tímu Môj Chatbot",
  },
  contact: {
    email: "info@mojchatbot.sk",
    emailPersonal: "daniel@vendzur.sk",
    phoneLabel: "+421 948 699 433",
    phoneHref: "+421948699433",
  },
  nav: [],

  /**
   * Pred komerčným spustením treba doplniť subjekt, ktorý službu skutočne
   * predáva a vystavuje faktúry. Údaje nesmú patriť inej firme iba kvôli
   * dôveryhodnosti stránky.
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
