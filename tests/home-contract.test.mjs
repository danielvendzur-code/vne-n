import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { runInNewContext } from "node:vm";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("client landing layer is authoritative and pricing stays off the homepage", async () => {
  const layout = await read("src/components/site/Layout.tsx");
  const landing = await read("src/components/site/PremiumLanding.tsx");
  const homeRoute = await read("src/routes/index.tsx");
  const pricingRoute = await read("src/routes/cennik.tsx");
  const tasteCss = await read("src/components/site/TasteSystemFinal.css");
  const approvedCss = await read("src/components/site/ApprovedInteractionsFinal.css");
  assert.doesNotMatch(layout, /HomeConversionUpgrade/);
  assert.doesNotMatch(landing, /HomeConversionUpgrade/);
  assert.doesNotMatch(homeRoute, /hasOfferCatalog|price:\s*"350"/);
  assert.match(pricingRoute, /<HomeConversionUpgrade \/>/);
  assert.match(layout, /CompetitionWinnerFinal\.css/);
  assert.match(layout, /TasteSystemFinal\.css/);
  assert.match(layout, /ApprovedInteractionsFinal\.css/);
  assert.match(layout, /MatteUiFinal\.css/);
  assert.match(layout, /FinalUserCorrection\.css/);
  assert.ok(
    layout.indexOf('import "./TasteSystemFinal.css"') <
      layout.indexOf('import "./ApprovedInteractionsFinal.css"'),
  );
  assert.ok(
    layout.indexOf('import "./ApprovedInteractionsFinal.css"') <
      layout.indexOf('import "./MatteUiFinal.css"'),
  );
  assert.ok(
    layout.indexOf('import "./MatteUiFinal.css"') <
      layout.indexOf('import "./FinalUserCorrection.css"'),
  );
  // Historical layers retain their order; the approved lime-white layer is final.
  assert.ok(
    layout.indexOf('import "./FinalUserCorrection.css"') <
      layout.indexOf('import "./BrandSystemFinal.css"'),
  );
  assert.ok(
    layout.indexOf('import "./BrandSystemFinal.css"') <
      layout.indexOf('import "./ClientLandingFinal.css"'),
  );
  // SiteFinish.css je posledná vrstva — čo je v nej, to platí.
  assert.ok(
    layout.indexOf('import "./ClientLandingFinal.css"') <
      layout.indexOf('import "./SiteFinish.css"'),
  );
  assert.ok(
    layout.indexOf('import "./TeamMotionUpgrade.css"') <
      layout.indexOf('import "./LimeWhiteBrandFinal.css"'),
  );
  assert.equal(
    layout.lastIndexOf('import "./'),
    layout.indexOf('import "./LimeWhiteBrandFinal.css"'),
  );
  assert.match(tasteCss, /Taste-system final layer/);
  assert.match(approvedCss, /Difference Sweep/);
  assert.match(approvedCss, /Reversed Blue Bloom/);
});

test("decorative hover blobs are removed from quiet actions and chips", async () => {
  const pointer = await read("src/components/site/LiquidSurfacePointer.tsx");
  const tasteCss = await read("src/components/site/TasteSystemFinal.css");
  assert.match(pointer, /--spot-x/);
  assert.match(pointer, /dataset\.spotlight/);
  assert.match(pointer, /requestAnimationFrame/);
  assert.match(tasteCss, /\.lp-button-quiet::before/);
  assert.match(tasteCss, /\.lp-button-quiet::after/);
  assert.match(tasteCss, /\.lp-hero-pick::before/);
  assert.match(tasteCss, /\.lp-chip::after/);
  assert.match(tasteCss, /content: none !important/);
  assert.match(tasteCss, /background: none !important/);
});

test("website chips use a green selected glow without an icon plate", async () => {
  const css = await read("src/components/site/ClientLandingFinal.css");
  assert.match(css, /--chip-accent: #b3e9d0/);
  assert.match(css, /\.lp-hero-pick-icon,[\s\S]*background: transparent !important/);
  assert.match(css, /\.lp-hero-pick-icon,[\s\S]*border-radius: 0 !important/);
  assert.match(css, /0 0 36px -8px rgba\(179, 233, 208, 0\.72\)/);
  assert.match(css, /animation: client-chip-confirm 420ms/);
  assert.match(css, /@keyframes client-chip-confirm/);
  assert.doesNotMatch(css, /#19345d|#245fae|#3979ec|#4db6ac|#7b8fa6/);
});

test("comparison uses one clean content surface without liquid runtime", async () => {
  const layout = await read("src/components/site/Layout.tsx");
  const landing = await read("src/components/site/PremiumLanding.tsx");
  const matteCss = await read("src/components/site/MatteUiFinal.css");
  assert.doesNotMatch(layout, /LiquidSegmentedDrag/);
  assert.doesNotMatch(layout, /LiquidSurfacePointer/);
  assert.doesNotMatch(landing, /lp-switch-liquid/);
  assert.match(landing, /lp-switch--clean/);
  assert.match(matteCss, /Final matte interaction system/);
  assert.match(matteCss, /\.lp-comparison-body[\s\S]*border-radius: 24px !important/);
  assert.match(matteCss, /\.lp-switch--clean[\s\S]*backdrop-filter: none !important/);
});

test("typography and icons share one visual language", async () => {
  const tasteCss = await read("src/components/site/TasteSystemFinal.css");
  assert.match(tasteCss, /--taste-font/);
  assert.match(tasteCss, /Segoe UI Variable/);
  assert.match(tasteCss, /\.lp-hero-pick-label,[\s\S]*font-weight: 650 !important/);
  assert.match(tasteCss, /stroke-width: 1\.65 !important/);
  assert.match(tasteCss, /Remove square icon tiles/);
});

test("hero and desktop navigation remain visually simplified", async () => {
  const css = await read("src/components/site/CompetitionWinnerFinal.css");
  assert.match(css, /\.lp-assistant-card[\s\S]*top:\s*44% !important/);
  assert.match(css, /\.lp-hero-grid[\s\S]*minmax\(30rem, 0\.97fr\)/);
  assert.match(
    css,
    /@media \(min-width:\s*1024px\)[\s\S]*\.site-menu-toggle[\s\S]*display:\s*none !important/,
  );
  assert.match(css, /Remove card tilt/);
});

test("the dedicated pricing page still covers client preparation", async () => {
  const conversion = await read("src/components/site/HomeConversionUpgrade.tsx");
  const faq = await read("src/data/faq.ts");
  const config = await read("src/config/site.ts");
  assert.match(conversion, /AI chatbot na mieru/);
  assert.match(conversion, /Chatbot s výpočtom/);
  assert.match(conversion, /Chatbot s konfigurátorom/);
  assert.match(conversion, /Web a ponuka/);
  assert.match(conversion, /Pravidlá a podklady/);
  assert.match(conversion, /Značka a vzhľad/);
  assert.match(conversion, /Kam má ísť dopyt/);
  assert.doesNotMatch(faq, /od 350 €/);
  assert.match(faq, /pevnú cenu vopred/);
  assert.match(faq, /GDPR/);
  assert.match(faq, /čo ak si niečo vymyslí/);
  assert.match(config, /taste-system-20260723-v7/);
});

test("contact form submits directly and keeps a resilient fallback", async () => {
  const contact = await read("src/routes/kontakt.tsx");
  const client = await read("src/lib/lead-submission.ts");
  assert.match(contact, /await submitWebsiteLead/);
  assert.match(contact, /submitState === "done"/);
  assert.match(contact, /contact-consent/);
  assert.doesNotMatch(contact, /window\.location\.assign\(`mailto:/);
  assert.match(client, /api\/lead/);
  assert.match(client, /AbortController/);
  assert.match(client, /fallback/);
});

test("lead endpoint runs on our own domain and never leaks the key", async () => {
  const api = await read("src/routes/api.lead.ts");
  const mail = await read("src/lib/lead-email.ts");
  const client = await read("src/lib/lead-submission.ts");

  // Vlastný koncový bod, nie cudzí backend — ten po prechode na
  // mojchatbot.sk odpovedal origin-not-allowed a formulár tíško padal.
  assert.match(client, /"\/api\/lead"/);
  assert.doesNotMatch(client, /moj-chatbot-backend\.vercel\.app/);

  // Kľúč žije iba v serverovom module a nikdy sa nedostane do balíka
  // pre prehliadač — `import.meta.env.VITE_*` by ho tam vložilo.
  assert.match(mail, /process\.env\.RESEND_API_KEY/);
  assert.doesNotMatch(mail, /import\.meta\.env/);
  assert.doesNotMatch(client, /RESEND/);

  // Odpoveď na dopyt ide zákazníkovi, poďakovanie zase na značkovú adresu.
  assert.match(mail, /reply_to: lead\.email/);
  assert.match(mail, /reply_to: LEAD_RECIPIENT/);

  // Overenie vstupu, návnada na roboty a strop na počet dopytov.
  assert.match(api, /invalid-payload/);
  assert.match(api, /HEADER_INJECTION/);
  assert.match(api, /raw\.website/);
  assert.match(api, /rateLimited/);
  assert.match(api, /too-many-requests/);

  // Keď kľúč chýba, návštevník dostane mailto namiesto tichého zlyhania.
  assert.match(api, /delivery-not-configured/);
  assert.match(api, /mailtoFallback/);
});

test("process reads as a timeline, not three empty boxes", async () => {
  const landing = await read("src/components/site/PremiumLanding.tsx");
  const css = await read("src/components/site/LandingFinish.css");
  const story = await read("src/components/site/ProcessTimelineStory.css");
  const hook = await read("src/hooks/useTimelineProgress.ts");

  // Kroky spája jedna narastajúca čiara. `LandingFinish` ostáva základnou
  // vrstvou rozloženia, samotnú os však celú drží `ProcessTimelineStory`.
  assert.match(landing, /lp-timeline-rail/);
  assert.match(landing, /lp-timeline-fill/);
  assert.match(css, /grid-template-columns: repeat\(var\(--steps, 3\)/);

  // Kroky nestoja v rade: každý je o kúsok nižšie a o kúsok bokom od
  // predošlého, takže ich nespája úsečka, ale dráha vedená stredmi bodiek.
  // Kreslí sa odkrývaním ťahu, nie mierkou — mierka by dráhu zdeformovala.
  assert.match(story, /--tl-shift/);
  assert.match(
    story,
    /stroke-dashoffset: calc\(var\(--tl-length, 0\) \* \(1 - var\(--tl-progress, 0\)\)\)/,
  );
  assert.match(landing, /offsetPath/);

  // Nezačatý krok nie je prázdny obdĺžnik — ikona a nadpis sú naznačené
  // a doplní ich zvyšok obsahu, až keď k nim čiara dorastie.
  assert.match(story, /li:not\(\[data-reached="true"\]\)/);

  // Matematické prahy ostávajú ako záloha do prvého merania. Skutočné prahy
  // vychádzajú z dĺžky dráhy, takže sa uzol rozsvieti presne vtedy, keď k nemu
  // ťah dorastie — pri rovnomernom rozdelení by sa rozsvecoval mimo čiary.
  // Sekcia má `content-visibility: auto`, takže sa rozloží až pri prvom
  // zobrazení; `ResizeObserver` je to, čo vtedy meranie zopakuje.
  assert.match(hook, /progress/);
  assert.match(hook, /\(index \+ 0\.5\) \/ count/);
  assert.match(hook, /new ResizeObserver\(/);
  assert.doesNotMatch(hook, /\.getBoundingClientRect\(/);
  assert.doesNotMatch(hook, /useEffect\(/);

  // Uzol sedí vo výške ikony, teda tesne pod horným okrajom karty. Dráha preto
  // nesmie ísť priamo — v medzere medzi krokmi prejde bokom, aby kartu nepretla.
  assert.match(hook, /function segment\(/);
  assert.match(hook, /lane/);

  // Počas scrollu sa layout nikdy nemeria — obsluha zmeny hodnoty pružiny
  // pracuje len s číslami, ktoré už sú spočítané.
  const onChange = hook.slice(hook.indexOf('useMotionValueEvent(spring, "change"'));
  assert.doesNotMatch(onChange, /getClientRects|querySelectorAll|offsetHeight|offsetWidth/);
});

test("the hero is one owned layer, not another override", async () => {
  const hero = await read("src/components/site/SignatureHero.tsx");
  const css = await read("src/components/site/SignatureHero.css");
  const landing = await read("src/components/site/PremiumLanding.tsx");

  // Vlastná vrstva znamená vlastníctvo: nový hero neprebíja nič cudzie,
  // takže v ňom nesmie byť ani jeden `!important`.
  assert.doesNotMatch(css, /!important\s*;/);

  // Hero stojí vo vlastnom ráme, aby naň nesadala staršia vrstva rytmu
  // sekcií s odsadením 122 px cez `!important`.
  assert.match(landing, /className="mc-hero-frame"/);
  assert.match(css, /\.mc-hero-frame/);

  // Presne to, čomu sa nový hero mal vzdialiť: karta, pilulky a glow.
  assert.doesNotMatch(hero, /lp-assistant-card|lp-hero-pick|lp-hero-glow|GlideField/);
  assert.doesNotMatch(css, /backdrop-filter|blur\(|radial-gradient/);

  // Tmavá scéna je plocha zarazená do hrany okna, nie karta v mriežke.
  assert.match(css, /background: var\(--mc-ink\)/);
  assert.match(css, /margin-right: calc\(-1 \* \(\(100vw - min\(var\(--mc-shell\)/);

  // Jeden tvarový systém odvodený od bubliny v logu: tri polomery a pätka.
  assert.match(css, /--mc-shape:/);
  assert.match(css, /--mc-foot:/);
  assert.match(
    css,
    /border-radius: var\(--mc-shape\) var\(--mc-shape\) var\(--mc-shape\) var\(--mc-foot\)/,
  );

  // Hero hovorí najprv k e-shopom, ale služby z neho nesmú vypadnúť:
  // tri scenáre sú e-shopové, štvrtý drží kalkulačku aj konfigurátor
  // a značka pri každom scenári hovorí, pre koho je.
  assert.match(hero, /className="mc-hero__pick"/);
  for (const label of ["Objednávky", "Poradca", "Vrátenie", "Služby"]) {
    assert.match(hero, new RegExp(`label: "${label}"`));
  }
  assert.equal((hero.match(/tag: "E-shop",/g) ?? []).length, 3);
  assert.equal((hero.match(/tag: "Služby",/g) ?? []).length, 1);
  assert.match(hero, /kicker: "Chatboty pre e-shopy"/);
  assert.match(hero, /Aj pre firmy so službami/);
  assert.match(hero, /kalkulačkou aj konfigurátorom/);
  assert.match(hero, /reklamáci/);

  // Scéna je oblúk, nie zaoblený obdĺžnik, a hĺbku robí posun vrstiev
  // a jedna vlasová hrana — nie vrhnutý tieň ani rozostrenie.
  assert.match(css, /--mc-arch:/);
  assert.match(css, /border-radius: var\(--mc-arch\)/);
  assert.match(css, /translate: calc\(var\(--mc-px\)/);
  assert.doesNotMatch(css, /box-shadow: 0 /);

  // Svetlozelená je z hero preč. Na papieri je akcent smaragdová, na
  // tmavej scéne biela — jedna farba na jednu plochu.
  assert.doesNotMatch(css, /#d9ff78|#b9ed4d|217,\s*255,\s*120|185,\s*237,\s*77/i);
  assert.match(css, /--mc-paper: #f7f7f4/);
  assert.match(css, /background: var\(--mc-paper\)/);
  assert.match(
    css,
    /\.mc-hero__turn\[data-who="bot"\] \.mc-hero__bubble \{[\s\S]*background: #ffffff/,
  );

  // Chatbot sa otvorí v režime vybraného scenára, nie vždy rovnako.
  assert.match(hero, /preset: scenario\.preset/);

  // Index je prepínač kariet, nie štyri nezávislé tlačidlá.
  assert.match(hero, /role="tablist"/);
  assert.match(hero, /role="tabpanel"/);
  assert.match(hero, /aria-selected=\{item\.key === active\}/);

  // Dôkaz produktu je prepis rozhovoru aj s výsledkom pre firmu.
  assert.match(hero, /mc-hero__result-text/);
  assert.match(hero, /Vám príde/);

  // Pohyb ostáva na kompozítore.
  assert.match(hero, /clipPath/);
  assert.doesNotMatch(css, /transition:[^;]*\b(width|height|top|left|margin|padding)\b/);
});

test("the brand intro plays once, from first paint, and never traps the page", async () => {
  const intro = await read("src/components/site/BrandIntro.tsx");
  const css = await read("src/components/site/BrandIntro.css");
  const store = await read("src/lib/brand-intro.ts");
  const layout = await read("src/components/site/Layout.tsx");
  const hero = await read("src/components/site/SignatureHero.tsx");

  assert.match(layout, /<BrandIntro \/>/);

  // Opona je v HTML zo servera a pohyb je celý v CSS, takže začína pri
  // prvom vykreslení — nie až keď sa pripojí React. Inak by návštevník
  // na okamih uvidel hotové hero a opona by naň spadla až potom.
  assert.match(css, /@keyframes mc-intro-draw/);
  // Opona je lesná, takže jej zdvih je zároveň prechod tmavá → biela.
  assert.match(css, /\.mc-intro \{[\s\S]*background: #0b2f20/);
  // Ťah loga je ostrý a biely. Staršia vrstva mu inak pridáva limetkovú
  // farbu aj žiaru.
  assert.match(css, /filter: none !important/);
  assert.doesNotMatch(css, /#d9ff78|#b9ed4d|217,\s*255,\s*120/i);
  assert.match(css, /@keyframes mc-intro-lift/);
  assert.match(css, /stroke-dashoffset/);
  assert.doesNotMatch(intro, /setTimeout\(/);
  assert.match(intro, /animationend/);

  // Raz za reláciu, preskočiteľné klávesou aj kliknutím.
  assert.match(store, /sessionStorage/);
  assert.match(intro, /introAlreadyPlayed\(\)/);
  assert.match(intro, /keydown/);
  assert.match(intro, /pointerdown/);

  // Poistky: pri vypnutých animáciách sa opona nevykreslí vôbec, hero sa
  // odkryje aj keby sa úvod nedohral, a po odchode opona nechytá kliknutia.
  assert.match(
    css,
    /@media \(prefers-reduced-motion: reduce\)[\s\S]*\.mc-intro \{\s*display: none/,
  );
  assert.match(store, /SAFETY_MS/);
  assert.match(css, /pointer-events: none/);

  // Hero čaká na oponu, nie naopak.
  assert.match(hero, /useIntroReady\(\)/);
  assert.match(hero, /still \|\| introReady/);
});

test("primary buttons keep readable ink on the light brand colour", async () => {
  const contact = await read("src/routes/kontakt.tsx");
  const finish = await read("src/components/site/SiteFinish.css");

  // Biely popis na svetlej výplni mal kontrast 1,51:1. Tmavá lesná
  // zo značkovej palety má na limetkovej 12,4:1.
  assert.match(finish, /\.contact-page \.contact-submit,/);
  assert.match(finish, /\.sp-page \.sp-button--primary,/);
  assert.match(finish, /color: #0b2f20 !important/);

  // Odosielacie tlačidlo je obyčajné, bez preletujúceho bieleho kruhu.
  assert.doesNotMatch(contact, /approved-sweep-action/);
});

test("portfolio image loading preserves lazy loading after the first image", async () => {
  const motion = await read("src/components/site/SiteMotionEnhancements.tsx");
  assert.match(motion, /image\.loading = index === 0 \? "eager" : "lazy"/);
  assert.match(motion, /image\.fetchPriority = index === 0 \? "high" : "low"/);
  assert.doesNotMatch(motion, /images\.map[\s\S]*image\.loading = "eager"/);
  assert.doesNotMatch(motion, /glide\.style\.(?:transform|willChange)/);
});

test("mobile layouts and reduced motion remain explicit", async () => {
  const css = await read("src/components/site/CompetitionWinnerFinal.css");
  const tasteCss = await read("src/components/site/TasteSystemFinal.css");
  assert.match(css, /@media \(max-width:\s*760px\)/);
  assert.match(
    css,
    /\.winner-trust,[\s\S]*\.winner-final[\s\S]*grid-template-columns:\s*1fr !important/,
  );
  assert.match(css, /\.lp-hero-picker[\s\S]*grid-template-columns:\s*1fr !important/);
  assert.match(tasteCss, /@media \(max-width: 760px\)/);
  assert.match(tasteCss, /@media \(hover: none\), \(pointer: coarse\)/);
  assert.match(tasteCss, /prefers-reduced-motion/);
});

test("approved buttons and one-layer details remain mounted", async () => {
  const landing = await read("src/components/site/PremiumLanding.tsx");
  const hero = await read("src/components/site/SignatureHero.tsx");
  const conversion = await read("src/components/site/HomeConversionUpgrade.tsx");
  const contact = await read("src/routes/kontakt.tsx");
  const css = await read("src/components/site/ApprovedInteractionsFinal.css");

  // Hero má jednu plnú akciu a jednu tichú. Triedy sa presťahovali spolu
  // s hero do vlastného komponentu; podmienka je stále tá istá — dve
  // akcie, nie osem.
  // Vľavo stojí jediná plná akcia. Sekundárna je riadok na písanie na
  // dne scény — tá istá akcia dvakrát by bola súťaž, nie ponuka.
  assert.match(hero, /className="mc-hero__cta"/);
  assert.equal((hero.match(/className="mc-hero__cta"/g) ?? []).length, 1);
  assert.match(hero, /className="mc-hero__ask"/);
  assert.match(hero, /aria-label="Vyskúšať chatbota naživo"/);
  assert.doesNotMatch(hero, /mc-hero__ghost/);
  assert.doesNotMatch(landing, /lp-button-bloom/);
  assert.doesNotMatch(landing, /lp-bloom-dot/);
  assert.doesNotMatch(landing, /<p>\{copy\}<\/p>\s*<p>\{copy\}<\/p>/);
  assert.match(conversion, /approved-bloom-action/);
  assert.match(contact, /contact-submit__content/);
  assert.match(contact, /data-state=\{submitState\}/);
  assert.match(css, /\.lp-caps-detail-inner/);
  assert.match(css, /\.winner-prep__item/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
});

test("metadata security and fresh assistant loading remain present", async () => {
  const root = await read("src/routes/__root.tsx");
  const config = await read("src/config/site.ts");
  const loader = await read("public/widget-loader.js");
  assert.match(root, /Content-Security-Policy/);
  assert.match(root, /strict-origin-when-cross-origin/);
  assert.match(root, /ProfessionalService/);
  assert.match(root, /Môj Chatbot — pripravené dopyty priamo z webu/);
  assert.match(root, /VITE_ASSISTANT_EMBED_URL/);
  assert.match(root, /data-assistant-source=\{safeAssistantEmbedUrl\}/);
  assert.match(config, /VITE_SITE_URL/);
  assert.doesNotMatch(root, /priceRange/);
  assert.doesNotMatch(root, /od 350 €/);
  assert.match(loader, /__DV_ASSISTANT_LOADER_ACTIVE__/);
  assert.match(loader, /MOUNT_TIMEOUT/);
  assert.match(loader, /buildKey/);
  assert.match(loader, /moj\.chatbot\.backend\/embed\.js/);
  assert.match(loader, /pendingOpen/);
  assert.match(loader, /__siteAssistantEmbed/);
  assert.match(loader, /dataset\.assistantSource/);
  assert.doesNotMatch(loader, /\?v=\d{8}-/);
  assert.doesNotMatch(loader, /moj-chatbot-backend\.vercel\.app\/widget\.js/);
  assert.doesNotMatch(loader, /moj\.chatbot\.backend\/widget\.js/);
  assert.match(loader, /Môj Chatbot/);
  assert.doesNotMatch(loader, /od 350 €/);
});

test("assistant fallback always links to an internal contact route", async () => {
  const loader = await read("public/widget-loader.js");

  const fallbackHrefFor = (basePath) => {
    let fallbackAnchor;

    class MockElement {
      constructor(tagName) {
        this.tagName = tagName;
        this.dataset = {};
        this.style = {};
      }

      setAttribute() {}
      remove() {}
    }

    const document = {
      readyState: "complete",
      documentElement: {
        dataset: {
          assistantSource: "https://example.test/embed.js",
          basePath,
        },
      },
      getElementById: () => null,
      createElement: (tagName) => new MockElement(tagName),
      head: {
        appendChild: (element) => element.onerror?.(),
      },
      body: {
        appendChild: (element) => {
          fallbackAnchor = element;
        },
      },
    };
    const window = {
      addEventListener() {},
      removeEventListener() {},
    };

    runInNewContext(loader, { document, HTMLElement: MockElement, window });
    return fallbackAnchor?.href;
  };

  assert.equal(fallbackHrefFor("/"), "/kontakt");
  assert.equal(fallbackHrefFor("/vne-n/"), "/vne-n/kontakt");
  assert.doesNotMatch(fallbackHrefFor("//"), /^\/\//);
});

test("Pages workflow validates the live Taste build", async () => {
  const workflow = await read(".github/workflows/pages.yml");
  assert.match(workflow, /Audit production dependencies/);
  assert.match(workflow, /Run source and deployment security audit/);
  assert.match(workflow, /Run UX and deployment contracts/);
  assert.match(workflow, /Verify live deployment and all public routes/);
  assert.match(workflow, /buildKey/);
  assert.match(workflow, /TasteSystemFinal\.css/);
  assert.match(workflow, /live_smoke=success/);
});

test("website chips use one crisp green interaction system", async () => {
  const landing = await read("src/components/site/PremiumLanding.tsx");
  const pointer = await read("src/components/site/LiquidSurfacePointer.tsx");
  const css = await read("src/components/site/ClientLandingFinal.css");

  assert.doesNotMatch(landing, /lp-hero-pick-fill/);
  assert.doesNotMatch(landing, /lp-chip-fill/);
  assert.doesNotMatch(landing, /whileTap=/);
  assert.match(landing, /data-chip-kind="capability"/);
  assert.match(landing, /event\.stopPropagation\(\)/);
  assert.doesNotMatch(pointer, /"\.lp-hero-pick"/);
  assert.doesNotMatch(pointer, /"\.lp-chip"/);
  assert.match(css, /solution picker \/ chips/);
  assert.match(css, /background: rgba\(242, 251, 247, 0\.026\) !important/);
  assert.match(css, /The icon is an icon, never an icon tile/);
});

test("landing anchors, one-way reveals and source integrity stay intact", async () => {
  const landing = await read("src/components/site/PremiumLanding.tsx");
  const hero = await read("src/components/site/SignatureHero.tsx");
  const realization = await read("src/components/site/DeratScrollStory.tsx");
  const primitives = await read("src/components/site/motion-primitives.tsx");
  const finalCorrection = await read("src/components/site/FinalUserCorrection.css");

  // Sekcia realizácií drží reálne weby; prípadová štúdia má vlastnú kotvu,
  // takže sa id na stránke neopakuje.
  assert.match(landing, /id="realizacie"/);
  assert.match(landing, /id="moznosti"/);

  // Prvé tlačidlo v hero vedie k dohode, nie o kus nižšie na tú istú
  // stránku — predtým obe viedli len na ďalšie prezeranie. Hero má
  // vlastný komponent, kotvy naň teda nadväzujú odtiaľ.
  assert.match(hero, /primary: \{ label: "[^"]+", to: "\/kontakt" \}/);
  assert.match(hero, /href: "#realizacie"/);
  assert.match(hero, /href: "#pripadova-studia"/);
  assert.doesNotMatch(hero, /once: false/);
  assert.match(realization, /id="pripadova-studia"/);
  assert.doesNotMatch(realization, /id="realizacie"/);

  // Odhaľovanie je jednosmerné. Predtým tu bola opačná podmienka:
  // obsah sa pri odchode zo zorného poľa vracal do skrytého stavu.
  // Pri scrollovaní späť hore sa preto odhaľovanie prehrávalo znova a
  // keďže cesta hore býva rýchlejšia než samotné odhalenie, nadpisy aj
  // otázky boli v polovici obrazovky priehľadné až neviditeľné.
  // Čo raz bolo vidieť, ostáva vidieť.
  assert.match(primitives, /once: true/);
  assert.doesNotMatch(landing, /once: false/);
  assert.doesNotMatch(primitives, /once: false/);
  assert.doesNotMatch(realization, /once: false/);

  assert.doesNotMatch(finalCorrection, /^(?:<<<<<<<|=======|>>>>>>>)(?: .*)?$/m);
});

test("realizations are real live websites, not invented case studies", async () => {
  const realizations = await read("src/data/realizations.ts");
  const projectsRoute = await read("src/routes/projekty.index.tsx");
  const landing = await read("src/components/site/PremiumLanding.tsx");

  for (const domain of ["mojplot.sk", "koverta.sk", "webko.sk"]) {
    assert.match(realizations, new RegExp(domain.replace(".", "\\.")));
  }
  // Vzorové rozhrania boli na želanie odstránené celé — v realizáciách
  // majú stáť len weby a nástroje, ktoré naozaj bežia. Predtým tu bola
  // podmienka opačná: ukážky smeli ostať, ak boli takto označené.
  assert.doesNotMatch(projectsRoute, /Vzorové rozhrani/);
  assert.doesNotMatch(projectsRoute, /nie sú nasadené firemné projekty/);
  assert.match(landing, /realizations\.map/);
  assert.doesNotMatch(landing, /Ukážka 0/);
});

test("both landing variants exist and the client one stays out of the index", async () => {
  const landing = await read("src/components/site/PremiumLanding.tsx");
  const hero = await read("src/components/site/SignatureHero.tsx");
  const clientRoute = await read("src/routes/navrh.tsx");
  const homeRoute = await read("src/routes/index.tsx");
  const robots = await read("public/robots.txt");

  assert.match(hero, /Návrh už máte\./);
  assert.match(hero, /variant: LandingVariant/);
  assert.match(landing, /<SignatureHero variant=\{variant\} \/>/);
  assert.match(clientRoute, /noindex: true/);
  assert.match(homeRoute, /variant="public"/);
  assert.doesNotMatch(homeRoute, /Návrh už máte/);
  assert.match(robots, /Disallow: \/navrh/);
});

test("the public website is team-first and uses one brand contact", async () => {
  const config = await read("src/config/site.ts");
  const lead = await read("src/lib/lead-submission.ts");
  const contact = await read("src/routes/kontakt.tsx");
  const footer = await read("src/components/site/Footer.tsx");

  assert.match(config, /email: "info@mojchatbot\.sk"/);
  assert.match(config, /founder: "Daniel Vendžúr"/);
  assert.match(config, /https:\/\/mojchatbot\.sk/);
  // Záložná mailto adresa aj príjemca dopytu idú z jedného miesta.
  assert.match(lead, /siteConfig\.contact\.email/);
  assert.doesNotMatch(lead, /daniel@vendzur\.sk/);
  // Poďakovanie posiela server sám; web sa len dozvie, či naozaj odišlo,
  // a podľa toho zvolí znenie potvrdenia.
  assert.match(lead, /thankYouSent/);
  assert.match(lead, /autoReplySent/);
  assert.match(contact, /thankYouSent/);
  // Druhá adresa je na želanie v pätičke ako priamy kontakt. Dopyt
  // z formulára aj tak stále chodí na značkovú adresu — to drží
  // podmienka na `lead` vyššie.
  assert.match(footer, /contact\.emailPersonal/);
  // V pätičke nestojí ani meno zakladateľa, ani jeho funkcia — blok
  // s osobou bol na želanie odstránený celý.
  assert.doesNotMatch(footer, /Tím vedie/);
  assert.doesNotMatch(footer, /Zodpovedná osoba/);
});

test("final correction restores the comparison and removes chip ornaments", async () => {
  const landing = await read("src/components/site/PremiumLanding.tsx");
  const css = await read("src/components/site/FinalUserCorrection.css");
  assert.match(landing, /Bez chatbota/);
  assert.match(landing, /S chatbotom/);
  assert.doesNotMatch(
    landing,
    /LiquidControlGlow|lp-hero-pick-plus|lp-hero-pick-check|lp-chip-icon/,
  );
  assert.match(css, /Final user correction/);
  assert.match(css, /\.lp-comparison > \.lp-switch\.lp-switch--clean/);
  assert.match(css, /visibility:\s*visible !important/);
  assert.doesNotMatch(css, /inset 3px 0 0|mix-blend-mode|lp-bloom-dot/);
});

test("privacy copy matches the deployed processors and cookie-free analytics", async () => {
  const privacy = await read("src/routes/ochrana-udajov.tsx");
  const cookies = await read("src/routes/cookies.tsx");
  const root = await read("src/routes/__root.tsx");
  const layout = await read("src/components/site/Layout.tsx");

  assert.match(privacy, /Vercel/);
  assert.match(privacy, /Resend/);
  assert.match(privacy, /Websupport/);
  assert.match(privacy, /Anthropic/);
  assert.match(privacy, /Prenosy mimo EHP/);
  assert.doesNotMatch(privacy, /neprenášam mimo Európsky hospodársky priestor/);
  assert.match(cookies, /Žiadne sledovacie cookies/);
  assert.match(cookies, /Vercel Web Analytics/);
  assert.match(root, /@vercel\/analytics\/react/);
  assert.match(root, /<Analytics \/>/);
  assert.doesNotMatch(layout, /<CookieConsent/);
});

test("collaboration timelines animate and respect reduced motion", async () => {
  const landing = await read("src/components/site/PremiumLanding.tsx");
  const process = await read("src/routes/postup.tsx");
  const css = await read("src/components/site/TeamMotionUpgrade.css");

  // Na domovskej stránke už kroky nestriedajú strany — sú vedľa seba na
  // jednej narastajúcej čiare. Výstup každého kroku ostáva.
  assert.match(landing, /lp-tl-result/);
  assert.doesNotMatch(landing, /data-side=\{index % 2 === 0 \? "left" : "right"\}/);

  // Šesťkrokovú os na /postup striedanie strán ďalej používa.
  assert.match(process, /data-side=\{index % 2 === 0 \? "left" : "right"\}/);
  assert.match(process, /whileInView=\{\{ opacity: 1, x: 0, y: 0 \}\}/);

  assert.match(css, /animation-timeline: view\(\)/);
  assert.match(css, /prefers-reduced-motion: reduce/);
});

test("the white forest lime system is the final brand authority", async () => {
  const layout = await read("src/components/site/Layout.tsx");
  const css = await read("src/components/site/LimeWhiteBrandFinal.css");
  const mark = await read("src/components/BrandMark.tsx");

  assert.match(layout, /LimeWhiteBrandFinal\.css/);
  assert.match(css, /--brand-primary: #b9ed4d/);
  assert.match(css, /--brand-forest: #0b2f20/);
  assert.match(css, /--brand-yellow: #a4e5c7/);
  assert.match(css, /background:\s*#ffffff\s*!important/);
  assert.match(css, /\.lp-hero-pick[\s\S]*background: #d9ff78 !important/);
  assert.match(css, /data-active="true"[\s\S]*background: #0b2f20 !important/);
  assert.match(mark, /viewBox="0 0 112 112"/);
  // Predtým tu stáli „migračné markery" — reťazce v komentári, ktoré sa
  // nikdy nevykresľovali a po premeraní loga prestali platiť. Kontrolujú
  // sa skutočné hodnoty: dva ťahy a hrúbka odmeraná z originálu.
  assert.equal((mark.match(/<path\b/g) ?? []).length, 2);
  // Ťah 7,0 dal najvyšší prekryv s originálom (76,9 %).
  assert.match(mark, /strokeWidth="7"/);
});

test("no orange survives anywhere in the styled sources", async () => {
  // Zákazka znela jednoznačne: oranžová, broskyňová a hnedá sa na weby
  // nevracajú. Test prejde všetky štýlované zdroje a zachytí každý
  // zápis farby, ktorý padne do teplého odtieňa.
  const { readdir } = await import("node:fs/promises");

  const hue = (r, g, b) => {
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const d = max - min;
    if (!d) return { h: 0, s: 0, l: max / 255 };
    let h;
    if (max === r) h = ((g - b) / d) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h = h * 60;
    if (h < 0) h += 360;
    const l = (max + min) / 2 / 255;
    return { h, s: d / 255 / (1 - Math.abs(2 * l - 1)), l };
  };
  const isWarm = (r, g, b) => {
    const { h, s, l } = hue(r, g, b);
    return h >= 10 && h <= 55 && s > 0.18 && l > 0.07;
  };

  // `/farby` je interná ukážka pomenovaných palet, nie verejná identita.
  const skip = new Set(["src/routes/farby.tsx", "src/routes/farby.css"]);
  const files = [];
  const walk = async (dir) => {
    for (const entry of await readdir(new URL(`../${dir}`, import.meta.url), {
      withFileTypes: true,
    })) {
      const path = `${dir}/${entry.name}`;
      if (entry.isDirectory()) await walk(path);
      else if (/\.(css|ts|tsx)$/.test(entry.name) && !skip.has(path)) files.push(path);
    }
  };
  await walk("src");

  const offenders = [];
  for (const path of files) {
    const source = await read(path);
    let inComment = false;
    source.split("\n").forEach((line, index) => {
      // komentáre smú citovať pôvodné hodnoty, inak by sa nedalo
      // vysvetliť, čo sa a prečo menilo
      const opens = line.lastIndexOf("/*");
      const closes = line.lastIndexOf("*/");
      const wasInComment = inComment;
      if (opens > closes) inComment = true;
      else if (closes > opens) inComment = false;
      if (wasInComment || inComment) return;
      if (/^\s*(\/\*|\*|\/\/)/.test(line)) return;
      for (const match of line.matchAll(/#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})\b/g)) {
        const v =
          match[1].length === 3
            ? match[1]
                .split("")
                .map((c) => c + c)
                .join("")
            : match[1];
        const [r, g, b] = [v.slice(0, 2), v.slice(2, 4), v.slice(4, 6)].map((x) => parseInt(x, 16));
        if (isWarm(r, g, b)) offenders.push(`${path}:${index + 1} ${match[0]}`);
      }
      for (const match of line.matchAll(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/g)) {
        const [r, g, b] = [+match[1], +match[2], +match[3]];
        if (isWarm(r, g, b)) offenders.push(`${path}:${index + 1} ${match[0]})`);
      }
      // Zápis bez čiarok — tak sa deklarujú premenné, ktoré si číta
      // interaktívne pole v hero (`--glide-active: 255 199 157`).
      for (const match of line.matchAll(
        /:\s*(\d{1,3})\s+(\d{1,3})\s+(\d{1,3})\s*(?:!important)?\s*;/g,
      )) {
        const [r, g, b] = [+match[1], +match[2], +match[3]];
        if (r > 255 || g > 255 || b > 255) continue;
        if (isWarm(r, g, b))
          offenders.push(`${path}:${index + 1} ${match[1]} ${match[2]} ${match[3]}`);
      }
    });
  }

  assert.deepEqual(offenders, [], `teplé farby ostali na ${offenders.length} miestach`);
});
