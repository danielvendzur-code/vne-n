export const siteConfig = {
  brand: "Môj Chatbot",
  visualVersion: "question-to-outcome-20260823-orientation-v4",
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

  legal: {
    operator: "Venaco s.r.o.",
    legalForm: "spoločnosť s ručením obmedzeným",
    address: "J. C. Hronského 3427/6, 949 07 Nitra",
    ico: "45648107",
    dic: "2023076407",
    icDph: "SK2023076407",
    registration:
      "Obchodný register Okresného súdu Nitra, oddiel Sro, vložka č. 27111/N",
    supervisor:
      "Inšpektorát Slovenskej obchodnej inšpekcie pre Nitriansky kraj, Staničná 9, P. O. BOX 49A, 950 50 Nitra 1",
    vatPayer: true,
  },
};

export const SITE_ORIGIN = import.meta.env.VITE_SITE_URL ?? "https://mojchatbot.sk";
