export const siteConfig = {
  brand: "Môj Chatbot",
  title: "Môj Chatbot — chatboty, kalkulačky a konfigurátory na mieru",
  description:
    "Chatboty, kalkulačky a konfigurátory na mieru, ktoré odpovedajú zákazníkom a pripravujú použiteľné dopyty.",
  contact: {
    email: "daniel@vendzur.sk",
    phoneLabel: "+421 948 699 433",
    phoneHref: "+421948699433",
  },
  nav: [
    { label: "Čo tvorím", to: "/sluzby" as const },
    { label: "Ukážky", to: "/projekty" as const },
    { label: "Spolupráca", to: "/postup" as const },
    { label: "Kontakt", to: "/kontakt" as const },
  ],
};
