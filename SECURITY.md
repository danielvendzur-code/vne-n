# Bezpečnosť

## Nahlásenie zraniteľnosti

Bezpečnostný problém neposielajte ako verejný GitHub issue. Pošlite ho súkromne na **daniel.vendzur@gmail.com** s predmetom `SECURITY — vne-n`.

Uveďte:

- dotknutú URL alebo komponent,
- presný postup reprodukcie,
- možné následky,
- snímku obrazovky alebo krátky dôkaz, ak je relevantný,
- návrh opravy, ak ho máte.

Nevkladajte do správy skutočné heslá, API kľúče ani osobné údaje tretích strán. Pri testovaní nepoužívajte deštruktívne požiadavky ani automatizované zaťaženie verejnej stránky.

## Podporovaná verzia

Bezpečnostné opravy sa aplikujú na aktuálnu vetvu `main` a na aktuálne nasadenie GitHub Pages.

## Aktuálne ochrany

- Content Security Policy a obmedzené externé zdroje,
- striktnejšia referrer policy,
- žiadne serverové ukladanie údajov z kontaktného formulára,
- sanitizácia a limity kontaktných polí,
- odolný loader chatbota s bezpečným fallbackom,
- produkčný audit závislostí pri každom nasadení,
- zdrojový scanner na tajné kľúče a nebezpečné runtime primitíva,
- route a live deployment smoke testy,
- týždenné Dependabot kontroly npm a GitHub Actions.
