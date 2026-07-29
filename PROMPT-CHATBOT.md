# Zadanie pre chatbot (repo `moj.chatbot.backend`)

Skopíruj celý text nižšie a pošli ho Claudovi v repozitári chatbota.

---

Uprav chatbota v tomto repozitári. Sú tri okruhy: **oprava chýb**, **animácie** a **vizuál**. Po každej zmene over výsledok v prehliadači, nie od oka.

## 1. Oprava: chipy po prechode na ďalší krok

**Chyba:** keď používateľ klikne na možnosť a chatbot prejde na ďalší krok, jeden z nových chipov ostane zvýraznený, hoci ho nikto nevybral. Vyzerá to, že je už vybraný alebo odporúčaný, a mätie to.

**Príčina, ktorú hľadaj:** stav výberu sa neresetuje pri zmene kroku, alebo si chip drží `:focus` po kliknutí na predchádzajúci chip na tej istej pozícii. Skontroluj oboje:

- pri prechode na nový krok nastav vybraný chip na `null`,
- ak sú chipy vykresľované cez `.map()`, daj im `key`, ktoré obsahuje aj číslo kroku (napr. `` key={`${stepId}-${option.id}`} ``). Bez toho React recykluje ten istý DOM prvok aj s jeho `:focus` a stavom,
- vizuálny stav viaž na `data-selected`, nie na `:focus`. Na klávesnicu nechaj `:focus-visible`, ktoré sa po kliknutí myšou neaktivuje.

**Ako to overiť:** v prehliadači klikni na možnosť, prejdi na ďalší krok a skontroluj, že žiadny chip nemá `data-selected="true"` ani inú farbu pozadia než ostatné. Porovnaj `getComputedStyle(chip).backgroundColor` pre všetky chipy nového kroku — musia byť identické.

## 2. Animácie

Web, na ktorom chatbot beží, používa krivku `cubic-bezier(0.16, 1, 0.3, 1)`. Použi rovnakú, aby to pôsobilo ako jeden celok.

**Nový krok — možnosti sa zjavia postupne, nie naraz:**

```css
@media (prefers-reduced-motion: no-preference) {
  .chip {
    animation: chip-in 420ms cubic-bezier(0.16, 1, 0.3, 1) backwards;
  }
  .chip:nth-child(1) { animation-delay: 40ms; }
  .chip:nth-child(2) { animation-delay: 90ms; }
  .chip:nth-child(3) { animation-delay: 140ms; }
  .chip:nth-child(4) { animation-delay: 190ms; }
  .chip:nth-child(5) { animation-delay: 240ms; }
  .chip:nth-child(6) { animation-delay: 290ms; }

  @keyframes chip-in {
    from { opacity: 0; transform: translateY(10px) scale(0.97); }
    to   { opacity: 1; transform: none; }
  }
}
```

Ďalšie animácie, ktoré chcem:

- **správa chatbota** nabehne zľava, správa používateľa sprava, obe cez `opacity` + `translateY(8px)`, trvanie 320 ms,
- **„píše…"** tri bodky, ktoré pulzujú s odstupom 160 ms medzi sebou; zmizne až keď príde odpoveď,
- **výsledok výpočtu** (cena, suma) sa odpočíta nahor z nuly za ~900 ms. Pri `prefers-reduced-motion` sa zobrazí rovno finálne číslo, nikdy nesmie chýbať,
- **ukazovateľ postupu** (napr. „Otázka 2 zo 4") sa dopĺňa plynulo, nie skokom,
- **prechod medzi krokmi**: starý krok odíde s `opacity: 0` a `translateY(-6px)`, nový príde zdola. Nesmie to poskakovať — počas prechodu drž výšku panela.

**Dôležité:** všetko zabaľ do `@media (prefers-reduced-motion: no-preference)`. Kto má vypnuté animácie, musí vidieť rovnaký obsah, len bez pohybu.

**Čo nerobiť:** žiadne poskakovanie prvkov po kliknutí, žiadne nekonečné pulzovanie, žiadny efekt, ktorý sa spustí pri každom scrollovaní.

## 3. Vizuál

**Farby** — web prešiel na zelenú, chatbot musí ladiť:

| Použitie | Hodnota |
|---|---|
| hlavná zelená | `#16c47f` |
| tmavšia zelená (hover) | `#0fa568` |
| svetlá zelená (ikony, akcenty) | `#7fe0b4` |
| text na zelenej | `#04140d` |
| pozadie panela | `#0b110f` |
| pozadie chipu | `#131c18` |
| text | `#f4f8f6` |
| tlmený text | `#a8bab1` |
| hranica | `rgba(122, 210, 180, 0.16)` |

Nikde nenechaj modrú. Prejdi si to meraním, nie okom — modré odtiene sa schovávajú aj v neutrálnych šedých. Užitočný postup: prejdi všetky prvky, načítaj `color`, `backgroundColor` a `borderColor`, a vypíš tie, kde je modrá zložka výrazne vyššia než červená aj zelená. Na webe to odhalilo 42 miest, ktoré by oko nenašlo.

Keď nahrádzaš studenú šeď, zachovaj svetlosť pôvodnej farby, inak sa zhorší čitateľnosť. Kontrast textu voči pozadiu drž nad 4,5:1.

**Ostatné:**

- **zaoblenie:** chipy a tlačidlá `999px`, panel `20px`, bubliny správ `16px`,
- **aktívny chip:** tmavý text `#04140d` na plnej zelenej `#16c47f`. Neaktívny svetlý text na tmavom. Pozor na kontrast — na webe bol aktívny popis svetlosivý na zelenej, teda kontrast 1,0 a úplne nečitateľný,
- **plocha na klik** minimálne 44 × 44 px, aj keď je chip vizuálne nižší,
- **dotyk:** `touch-action: manipulation` na tlačidlá a chipy. Nikdy nie na panel ani na scrollovaciu oblasť — zablokovalo by to priblíženie prstami,
- **na mobile** nikdy nenastavuj `overflow: hidden` na `html` ani `body`. Robí to z nich scroll kontajner a láme to scroll aj zoom po vyskočení klávesnice. Ak potrebuješ zabrániť vodorovnému presahu, použi `overflow-x: clip` na vnútornom kontajneri,
- **písmo:** rovnaká rodina ako web (Inter Tight), veľkosť správ 15 px, chipov 14 px.

## 4. Texty

Prepíš všetky texty tak, aby im rozumel každý — aj človek, ktorý nie je technický a web navštívil prvýkrát. Konkrétne:

- žiadne slová ako „konfigurátor", „logika", „parametre", „špecifikácia", „kvalifikácia dopytu",
- pýtaj sa priamo: nie „Aký je rozsah vašej zákazky?", ale „Koľko metrov plotu potrebujete?",
- každá otázka nech má maximálne jednu vetu,
- pri každej otázke nech je jasné, prečo sa pýtaš, ak to nie je zrejmé.

Príklady prepisu:

| Namiesto | Napíš |
|---|---|
| „Špecifikujte požadovaný rozsah." | „Čo presne potrebujete?" |
| „Prebehne kvalifikácia dopytu." | „Opýtam sa na pár vecí, nech viem poradiť." |
| „Zadajte parametre výpočtu." | „Napíšte rozmery a ja spočítam cenu." |
| „Konfigurácia bola odoslaná." | „Hotovo, poslal som to. Ozveme sa do jedného dňa." |

## 5. Ako to overiť

Nestačí, že to vyzerá dobre. Over aspoň toto:

1. prejdi celý rozhovor od začiatku po odoslanie a skontroluj, že po každom kroku sú všetky chipy rovnaké,
2. skontroluj na šírke 390 px aj 1440 px, že nič nepresahuje a nič sa neprekrýva,
3. zmeraj kontrast textu voči skutočnému pozadiu — pozor, ak je pozadie súrodenec (napr. posuvný jazdec prepínača), automatický nástroj ho nenájde a nahlási nezmysel. V takom prípade odčítaj farbu priamo z pixelov snímky,
4. zapni `prefers-reduced-motion: reduce` a over, že je vidieť celý obsah,
5. zmeraj plynulosť: medián snímku má byť do 17 ms. Ak je 33 ms, niečo beží na polovičnej snímkovej frekvencii.

Ak niečo nestihneš alebo sa to nepodarí, napíš to priamo — nehlás hotovo to, čo hotové nie je.
