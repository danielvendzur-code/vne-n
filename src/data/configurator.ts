/**
 * Snímky 3D konfigurátora Koverta. Sú to skutočné zábery z bežiaceho
 * konfigurátora (nie makety) a `page` zodpovedá parametru, ktorým sa
 * rovnaký model otvorí v živej ukážke.
 */
export const KOVERTA_LIVE_CONFIGURATOR =
  "https://danielvendzur-code.github.io/koverta-web/konfigurator/";

export const configuratorShots = [
  {
    id: "pergola",
    page: "bio",
    label: "Bioklimatická pergola",
    image: `${import.meta.env.BASE_URL}work/koverta/konfigurator-pergola.webp`,
    alt: "3D konfigurátor Koverta: bioklimatická pergola s posedením a výberom umiestnenia",
  },
  {
    id: "pristresok",
    page: "koverta",
    label: "Prístrešok pre auto",
    image: `${import.meta.env.BASE_URL}work/koverta/konfigurator-pristresok.webp`,
    alt: "3D konfigurátor Koverta: oceľový prístrešok pre auto s nastavením šírky a hĺbky",
  },
  {
    id: "carport",
    page: "carport",
    label: "Hliníkový carport",
    image: `${import.meta.env.BASE_URL}work/koverta/konfigurator-carport.webp`,
    alt: "3D konfigurátor Koverta: hliníkový carport Soltec s autom v scéne a orientačnou cenou",
  },
] as const;

export const configuratorFaqs = [
  {
    q: "Koľko stojí 3D konfigurátor?",
    a: "Konfigurátor začína na 447 €. Pri 3D verzii cenu ovplyvní počet produktov a modelov, množstvo variantov a pravidlá výpočtu ceny. Presnú sumu vrátane DPH dostanete pred začiatkom práce.",
  },
  {
    q: "Potrebujeme vlastné 3D modely?",
    a: "Nie je to podmienka. Modely vieme pripraviť podľa výkresov, fotografií a rozmerov vašich produktov. Ak 3D podklady máte, použijeme ich.",
  },
  {
    q: "Dá sa konfigurátor vložiť do existujúceho webu alebo e-shopu?",
    a: "Áno. Konfigurátor Koverta beží na e-shope postavenom na Shopify. Pri inom systéme najprv overíme, ako ho vložiť a kam budú chodiť dopyty.",
  },
  {
    q: "Funguje 3D konfigurátor aj na mobile?",
    a: "Áno. Ovládanie je prispôsobené dotyku, model sa dá otáčať prstom a priblížiť dvoma prstami. Testujeme ho na počítači aj na telefónoch.",
  },
  {
    q: "Čo presne príde firme v dopyte?",
    a: "Kontakt zákazníka a celá zostava — typ, rozmer, umiestnenie, farba, strecha, výplne a orientačná cena. Dopyt môže prísť e-mailom alebo do systému, ktorý používate.",
  },
] as const;
