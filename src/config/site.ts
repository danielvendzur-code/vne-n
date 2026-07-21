export const siteConfig = {
  title: "Daniel Vendžúr — chatboty na mieru",
  description:
    "Navrhujem chatboty na mieru — od jednoduchých asistentov po chatboty s kalkulačkou, konfigurátorom a rezerváciami.",
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
