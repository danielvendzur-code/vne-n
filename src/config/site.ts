export const siteConfig = {
  brand: "Môj Chatbot",
  visualVersion: "taste-system-20260723-v7",
  title: "Môj Chatbot — chatboty, kalkulačky a konfigurátory na mieru",
  description:
    "Chatboty, kalkulačky a konfigurátory na mieru od 350 €, ktoré odpovedajú zákazníkom a pripravujú použiteľné dopyty.",
  contact: {
    email: "daniel@vendzur.sk",
    phoneLabel: "+421 948 699 433",
    phoneHref: "+421948699433",
  },
  nav: [
    { label: "Riešenia", to: "/sluzby" as const },
    { label: "Realizácie", to: "/projekty" as const },
    { label: "Ako to prebieha", to: "/postup" as const },
    { label: "Kontakt", to: "/kontakt" as const },
  ],
};
