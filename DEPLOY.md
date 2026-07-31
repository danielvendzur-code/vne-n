# Nasadenie na vlastnú doménu

Postup od nuly po fungujúci web na vašej doméne. Počítajte s 20–30 minútami,
z toho väčšinu tvorí čakanie na DNS.

---

## Predtým než začnete — doplňte údaje

V `src/config/site.ts` je sekcia `legal`. Doplňte **adresu, IČO a DIČ**.
Prázdne polia sa na stránke nezobrazia, takže tam nikde nesvieti nedoplnený
text — ale kým ich nedoplníte, identifikácia prevádzkovateľa je neúplná
a zákon č. 22/2004 Z. z. o elektronickom obchode ju vyžaduje.

```ts
legal: {
  operator: "Daniel Vendžúr",
  address: "Ulica 1, 010 01 Žilina",   // doplňte
  ico: "12345678",                      // doplňte
  dic: "1012345678",                    // doplňte
  icDph: "",                            // len ak ste platiteľ DPH
  registration: "Okresný úrad Žilina, č. živnostenského registra 580-XXXXX",
  notVatPayer: true,                    // false, ak ste platiteľ DPH
},
```

V tom istom súbore je aj `SITE_ORIGIN`. Nastavte na svoju doménu:

```ts
export const SITE_ORIGIN =
  import.meta.env.VITE_SITE_URL ?? "https://vasa-domena.sk";
```

Tým sa prispôsobia kanonické adresy aj náhľady pri zdieľaní na sieťach.

---

## 1. Nasadenie na Vercel

Web je pripravený — v repozitári je `vercel.json` aj potrebné skripty.
Vercel má bezplatný plán, ktorý na tento web bohato stačí.

### Cez webové rozhranie (odporúčam)

1. Choďte na **vercel.com** a prihláste sa cez GitHub.
2. **Add New → Project** a vyberte repozitár `vne-n`.
3. Vercel si prečíta `vercel.json`, takže **nič nenastavujte** —
   build aj výstup sú v ňom už popísané. Nechajte predvolené hodnoty.
4. **Deploy.** Prvý build trvá 2–3 minúty.
5. Dostanete adresu typu `vne-n.vercel.app`. Otvorte ju a skontrolujte,
   že web beží.

### Cez príkazový riadok

```bash
npm i -g vercel
vercel login
vercel --prod
```

---

## 2. Pripojenie domény

1. Vo Verceli otvorte projekt → **Settings → Domains**.
2. Napíšte svoju doménu (napr. `mojchatbot.sk`) a dajte **Add**.
3. Vercel vypíše, aké DNS záznamy máte nastaviť. Sú to spravidla dva:

| Typ | Názov | Hodnota |
|---|---|---|
| `A` | `@` | `76.76.21.21` |
| `CNAME` | `www` | `cname.vercel-dns.com` |

> Presné hodnoty berte z Vercelu, nie odtiaľto — občas ich menia.

4. Prihláste sa k registrátorovi, kde ste doménu kúpili (WebSupport,
   Websupport, Forpsi, GoDaddy…), otvorte **DNS záznamy** a zadajte ich.
5. Počkajte. Zvyčajne to trvá 10–30 minút, výnimočne pár hodín.
   Vercel v Settings → Domains ukáže zelenú fajku, keď je hotovo.
6. HTTPS certifikát Vercel vystaví sám, netreba nič robiť.

### Presmerovanie www

Vo Verceli nastavte jednu verziu ako hlavnú (odporúčam bez `www`)
a druhú ako presmerovanie. Vercel to ponúkne priamo pri pridaní domény.
Web tak nebude existovať na dvoch adresách naraz, čo by inak kazilo SEO.

---

## 3. Po nasadení — skontrolujte

Prejdite si tento zoznam, zaberie to päť minút:

- [ ] Web sa otvorí na `https://vasa-domena.sk` aj `https://www.vasa-domena.sk`
- [ ] V adresnom riadku je zámok (HTTPS)
- [ ] Fungujú všetky stránky: úvod, Chatboty a riešenia, Čo to prinesie webu,
      Realizácie, Ako to prebieha, Kontakt, Cookies, Ochrana osobných údajov
- [ ] Kontaktný formulár odošle dopyt a príde vám e-mail
- [ ] Chatbot v rohu sa otvorí a odpovedá
- [ ] Na mobile nič nepresahuje do strán
- [ ] `https://vasa-domena.sk/sitemap.xml` sa načíta
- [ ] V pätičke sú vaše správne údaje (IČO, adresa)

---

## 4. Aby vás našiel Google

Toto nie je súčasť nasadenia, ale bez toho vás nikto nenájde.

1. **Google Search Console** — search.google.com/search-console
   - Pridajte doménu, overte cez DNS záznam (Vercel to zvládne)
   - V sekcii **Sitemaps** zadajte `sitemap.xml`
   - Indexovanie trvá niekoľko dní až dva týždne

2. **Firemný profil na Google** — business.google.com
   - Pre lokálne vyhľadávanie („chatbot na mieru Žilina") je to
     často účinnejšie než samotný web

3. **Prepojte web s chatbotom** — v repozitári chatbota nastavte, aby
   povolil vloženie z vašej novej domény, inak sa widget nemusí načítať.

---

## 5. Čo sa deje pri ďalších zmenách

Vercel je pripojený na GitHub, takže:

- **push do `main`** → automaticky nasadí na produkciu
- **push do inej vetvy** → vytvorí náhľadovú adresu, kde si zmeny
  pozriete skôr, než pôjdu von

Nemusíte teda nič nasadzovať ručne.

---

## Prečo Vercel a nie GitHub Pages

Web doteraz bežal na GitHub Pages, čo fungovalo, ale malo dve obmedzenia:
Pages vie servírovať len statické súbory a doména sa tam nastavuje
neohrabane. Vercel zvládne aj serverovú časť, certifikát aj náhľady vetiev
bez nastavovania. Pages konfigurácia v repozitári ostáva — ak by ste sa
chceli vrátiť, `bun run build:pages` funguje ďalej.
