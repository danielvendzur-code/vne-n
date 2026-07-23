export interface FaqEntry {
  q: string;
  a: string;
}

export const faqs: FaqEntry[] = [
  {
    q: "Koľko stojí chatbot alebo kalkulačka na mieru?",
    a: "Jednoduchý chatbot na mieru začína od 350 €. Kalkulačka alebo konfigurátor sa nacení podľa počtu pravidiel, krokov a prepojení. Po krátkom zadaní dostanete konkrétny rozsah prvej verzie aj cenu vopred — bez skrytých položiek.",
  },
  {
    q: "Čo odo mňa potrebujete na začiatku?",
    a: "Stačí odkaz na web alebo popis ponuky, najčastejšie otázky, cenník či pravidlá výpočtu a informácia, kam majú chodiť dopyty. Z toho pripravím logiku, texty, rozloženie aj prvý prototyp.",
  },
  {
    q: "Ako rýchlo viem mať nástroj na webe?",
    a: "Návrh otázok a logiky pripravím v priebehu dní. Presný termín nasadenia závisí od rozsahu a prepojení; harmonogram dostanete spolu s cenou ešte pred začiatkom vývoja.",
  },
  {
    q: "Musím kvôli tomu prerábať celý web?",
    a: "Nie. Nástroj sa vloží do existujúcej stránky ako samostatný widget a dizajn sa prispôsobí vašim farbám, typografii a rozloženiu. Vo väčšine prípadov stačí vložiť krátky kód.",
  },
  {
    q: "Z čoho chatbot odpovedá a čo ak si niečo vymyslí?",
    a: "Obsah a hranice odpovedí sa nastavia z vašich overených podkladov. Pri citlivej alebo neznámej otázke chatbot nemá hádať — požiada o kontakt alebo odovzdá konverzáciu človeku aj s kontextom.",
  },
  {
    q: "Kam budú chodiť dopyty?",
    a: "Štandardne na e-mail aj s odpoveďami zákazníka, výpočtom a kontaktom. Podľa potreby sa môžu zapisovať do kalendára, Google tabuľky, CRM alebo interného systému.",
  },
  {
    q: "Čo keď sa zmení cenník alebo ponuka?",
    a: "Logiku navrhujem tak, aby sa pravidlá dali upravovať bez prerábania celého nástroja. Rozsah následnej údržby a spôsob aktualizácií si dohodneme vopred podľa toho, ako často sa vaša ponuka mení.",
  },
  {
    q: "Ako sa riešia osobné údaje a GDPR?",
    a: "Zbierajú sa iba údaje potrebné na vybavenie dopytu. Súhlas, informačné texty, miesto uloženia a odosielanie údajov sa nastavia podľa konkrétneho procesu a webu klienta.",
  },
  {
    q: "Viem si riešenie vyskúšať ešte pred spoluprácou?",
    a: "Áno. Na webe sú živé nástroje aj interaktívne demá. Pri konkrétnom projekte najprv pripravím logiku a prvý návrh rozhrania, aby bol rozsah jasný ešte pred finálnym nasadením.",
  },
];
