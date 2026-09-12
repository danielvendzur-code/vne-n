# PageSpeed + podstránky — 2026-09-12

Tento branch cieli na problémy viditeľné v PageSpeed Insights pre mojchatbot.sk a zároveň zjednocuje hlavné marketingové podstránky s vizuálnym jazykom homepage hero sekcie.

## Výkon

- externý chatbot widget sa už nenačítava pri prvom vykreslení; načíta sa až pri reálnej interakcii používateľa,
- odstránený nepoužívaný TanStack Query provider z kritického runtime,
- odstránený globálny MotionConfig a hlavná homepage používa ľahký lokálny `useReducedMotion`,
- sekundárne hero preview obrázky sú lazy + low priority; iba prvý hero obrázok je eager/high priority,
- odstránené per-character DOM animácie z hero nadpisu,
- odstránený PageRevealController z kritickej cesty, ktorý pri štarte čítal layout viacerých prvkov,
- podstránkové obrázky realizácií sa pod foldom načítavajú lazy,
- pod foldom sa na hlavných podstránkach používa `content-visibility: auto`.

## Vizuál podstránok

- spoločný dark-forest hero,
- lime akcent a rovnaký typografický rytmus ako homepage,
- jednotné editorial grid rozloženie hero obsahu,
- cenník, kontakt, realizácie, služby a postup používajú spoločné vizuálne pravidlá,
- spodné CTA/pricing bridge sekcie sú zjednotené s tmavozelenými kapitolami homepage.

Pred merge treba nechať prejsť PR quality workflow a vizuálne preveriť desktop + mobile preview.
