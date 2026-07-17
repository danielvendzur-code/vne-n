export const siteConfig = {
  title: "Daniel Vendzúr — weby a digitálne nástroje na mieru",
  description:
    "Tvorím chatboty, všetky typy kalkulačiek a konfigurátorov — samostatne aj prepojené do jedného riešenia.",
  contact: {
    email: "daniel.vendzur@gmail.com",
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
