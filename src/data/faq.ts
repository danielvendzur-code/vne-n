export interface FaqEntry {
  q: string;
  a: string;
}

export const faqs: FaqEntry[] = [
  {
    q: "Koľko stojí chatbot alebo kalkulačka na mieru?",
    a: "Cena závisí od zložitosti logiky a prepojení. Po krátkom zadaní dostanete konkrétny rozsah prvej verzie aj s cenou — vopred a bez záväzku, žiadne skryté paušály.",
  },
  {
    q: "Ako rýchlo viem mať nástroj na webe?",
    a: "Návrh otázok a výpočtu pripravím v priebehu dní. Termín nasadenia závisí od rozsahu — presný harmonogram poviem hneď po prvej konzultácii, aby ste vedeli, s čím počítať.",
  },
  {
    q: "Musím kvôli tomu prerábať celý web?",
    a: "Nie. Nástroj sa vkladá ako widget do existujúcej stránky a dizajn prispôsobím farbám aj štýlu vášho webu. Vo väčšine prípadov stačí vložiť jeden riadok kódu.",
  },
  {
    q: "Kam budú chodiť dopyty?",
    a: "Štandardne na váš e-mail aj s celým kontextom odpovedí. Podľa potreby ich prepojím s kalendárom, tabuľkou alebo interným systémom, s ktorým už pracujete.",
  },
  {
    q: "Čo keď sa zmení cenník alebo ponuka?",
    a: "Logiku navrhujem tak, aby sa pravidlá dali meniť. Nové ceny, možnosti či služby vieme premietnuť bez prerábania celého nástroja.",
  },
  {
    q: "Viem si niečo vyskúšať ešte pred spoluprácou?",
    a: "Áno. Priamo na webe sú živé nástroje aj interaktívne ukážky. Vyskúšate si ich za pár sekúnd a uvidíte presne to, čo uvidí váš zákazník.",
  },
];
