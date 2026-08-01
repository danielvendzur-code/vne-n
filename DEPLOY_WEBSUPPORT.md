# Nasadenie VNE-N na doménu spravovanú vo Websupporte

Odporúčaná produkčná architektúra:

- `www.DOMENA.sk` — web `vne-n` na Verceli,
- `chat.DOMENA.sk` — chatbot, `/api/chat` a `/api/lead` na Verceli,
- doména, DNS a existujúce e-mailové MX záznamy zostanú vo Websupporte.

Klasický FTP hosting nie je pre aktuálny projekt vhodný: web používa TanStack Start/Nitro SSR a chatbot má serverové API s tajnými kľúčmi. Na FTP by sa dala nahrať iba statická časť, nie celé riešenie.

## 1. Pripravte dve Vercel aplikácie

1. Vo Verceli zvoľte **Add New → Project** a importujte GitHub repozitár `vne-n`.
2. Importujte aj repozitár `moj.chatbot.backend` ako druhý projekt.
3. Pri oboch nechajte koreň projektu na koreň repozitára. Build nastavenia sú už uložené vo `vercel.json`.
4. Najprv ich nasaďte na dočasné adresy `*.vercel.app` a skontrolujte, že oba deploymenty skončili úspešne.

## 2. Nastavte environment premenné

V projekte chatbota nastavte pre **Production**:

```text
ANTHROPIC_API_KEY=...
RESEND_API_KEY=...
LEAD_TO_EMAIL=daniel@vendzur.sk
LEAD_FROM_EMAIL=Môj Chatbot <overena-adresa@DOMENA.sk>
ALLOWED_ORIGINS=https://DOMENA.sk,https://www.DOMENA.sk,https://chat.DOMENA.sk
VITE_CHAT_API_URL=https://chat.DOMENA.sk/api/chat
VITE_LEAD_API_URL=https://chat.DOMENA.sk/api/lead
```

Ak namiesto Resendu používate automatizáciu alebo CRM, pridajte `LEAD_WEBHOOK_URL` a `RESEND_API_KEY` môže zostať prázdny.

V projekte webu nastavte pre **Production**:

```text
VITE_SITE_URL=https://www.DOMENA.sk
VITE_ASSISTANT_EMBED_URL=https://chat.DOMENA.sk/embed.js
VITE_LEAD_API_URL=https://chat.DOMENA.sk/api/lead
```

Po každej zmene environment premenných urobte nový deployment; staré deploymenty nové hodnoty nepreberú automaticky.

## 3. Pridajte domény vo Verceli

1. V projekte webu otvorte **Settings → Domains** a pridajte `www.DOMENA.sk` aj `DOMENA.sk`.
2. Nastavte `www.DOMENA.sk` ako primárnu adresu a hlavnú doménu presmerujte na `www`.
3. V projekte chatbota pridajte `chat.DOMENA.sk`.
4. Pri každej adrese si skopírujte **presný A/CNAME záznam, ktorý ukáže Vercel**. Nezadávajte naslepo všeobecný cieľ — projekt môže dostať unikátny CNAME.

Oficiálny postup Vercelu: <https://vercel.com/docs/domains/set-up-custom-domain>

## 4. Zapíšte DNS vo Websupporte

1. Prihláste sa do Webadminu Websupportu.
2. Otvorte doménu → **DNS**.
3. Pre hlavnú doménu (`@`) nastavte A záznam podľa hodnoty z Vercelu.
4. Pre `www` vytvorte CNAME podľa hodnoty z Vercelu.
5. Pre `chat` vytvorte CNAME podľa hodnoty z druhého Vercel projektu.
6. Ak už `www` alebo `chat` majú A/AAAA záznam, ktorý s novým CNAME koliduje, odstráňte iba kolidujúci záznam pre danú subdoménu.
7. **Nemeňte MX záznamy**, aby zostal funkčný e-mail.

Websupport návody:

- A záznamy: <https://www.websupport.sk/podpora/kb/a-zaznamy/>
- CNAME záznamy: <https://www.websupport.sk/podpora/kb/cname-zaznamy/>

Websupport uvádza, že externé DNS zmeny sa môžu prejavovať približne dve hodiny. HTTPS certifikát potom vystaví Vercel automaticky.

## 5. Dokončite metadata po potvrdení domény

V `public/sitemap.xml` a `public/robots.txt` nahraďte starú GitHub Pages adresu adresou `https://www.DOMENA.sk`. Kanonické URL, JSON-LD, OG obrázky, API adresy a povolený pôvod widgetu už používajú vyššie uvedené environment premenné.

Pred ostrým odoslaním klientom doplňte aj chýbajúce identifikačné údaje v `src/config/site.ts` (`address`, `ico`, prípadne `dic`, `registration`).

## 6. Produkčný smoke test

Skontrolujte aspoň:

1. `https://DOMENA.sk` presmeruje na `https://www.DOMENA.sk`.
2. Web aj `https://chat.DOMENA.sk` majú platný HTTPS certifikát.
3. Chatbot sa z webu otvorí, prepne oba režimy a po zatvorení vráti fokus na pôvodné tlačidlo.
4. Správa v chate dostane odpoveď bez CORS chyby.
5. Testovací dopyt príde na správny e-mail alebo webhook.
6. Mobilná klávesnica nezakryje vstup a stránka nemá vodorovný presah.
7. `sitemap.xml`, `robots.txt`, `/kontakt`, ochrana údajov a cookies používajú produkčnú doménu.

Ak sa nasadenie nepodarí, nemeníte DNS naslepo: vo Verceli vrátite predchádzajúci úspešný deployment alebo vo Websupporte obnovíte predchádzajúcu DNS hodnotu z histórie zmien.
