export const siteConfig = {
  brand: "Môj Chatbot",
  visualVersion: "question-to-outcome-20260824-orientation-v3b",
  title: "Môj Chatbot — digitálne predajné nástroje na mieru",
  description:
    "Chatboty, kalkulačky, konfigurátory a produktoví poradcovia na mieru pre e-shopy aj firmy so službami.",
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
  nav: [
    { label: "Riešenia", to: "/sluzby" },
    { label: "Realizácie", to: "/projekty" },
    { label: "Proces", to: "/postup" },
    { label: "Cena", to: "/cennik" },
  ],

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
