export const siteConfig = {
  brand: "Môj Chatbot",
  visualVersion: "taste-system-20260723-v7",
  title: "Môj Chatbot — chatboty, kalkulačky a konfigurátory na mieru",
  description:
    "Chatboty, kalkulačky a konfigurátory na mieru, ktoré odpovedajú zákazníkom a pripravujú použiteľné dopyty.",
  contact: {
    /**
     * Hlavná adresa značky. Sem chodia dopyty z formulára aj z chatbota
     * a je to adresa, ktorá sa zobrazuje na webe ako prvá.
     */
    email: "info@mojchatbot.sk",
    /** Osobná adresa — ostáva dostupná pre priamu komunikáciu. */
    emailPersonal: "daniel@vendzur.sk",
    phoneLabel: "+421 948 699 433",
    phoneHref: "+421948699433",
  },
  nav: [],

  /**
   * Údaje prevádzkovateľa.
   *
   * Zákon č. 22/2004 Z. z. o elektronickom obchode žiada, aby boli na
   * webe dostupné identifikačné údaje. Kým sú polia prázdne, príslušné
   * riadky sa na stránke jednoducho nezobrazia — nikde nesvieti
   * nedoplnený text. Po doplnení sa objavia samy.
   *
   * DOPLŇTE PRED SPUSTENÍM NA VLASTNEJ DOMÉNE:
   */
  legal: {
    /** Meno alebo obchodné meno, na ktoré je živnosť či firma vedená. */
    operator: "Daniel Vendžúr",
    /** Ulica, číslo, PSČ a mesto — sídlo alebo miesto podnikania. */
    address: "",
    /** IČO, ak podnikáte. */
    ico: "",
    /** DIČ, ak ho máte pridelené. */
    dic: "",
    /** IČ DPH — nechajte prázdne, ak nie ste platiteľ DPH. */
    icDph: "",
    /** Napr. „Okresný úrad Žilina, č. živnostenského registra 580-XXXXX". */
    registration: "",
    /** Nechajte true, ak nie ste platiteľ DPH — doplní sa veta o tom. */
    notVatPayer: true,
  },
};

/**
 * Adresa webu. Po prechode na vlastnú doménu stačí zmeniť túto jednu
 * hodnotu (alebo nastaviť VITE_SITE_URL pri builde) — kanonické adresy,
 * sitemap aj sociálne náhľady sa prispôsobia samy.
 */
export const SITE_ORIGIN = import.meta.env.VITE_SITE_URL ?? "https://mojchatbot.sk";
