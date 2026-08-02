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
  // The client landing layer is the final visual authority.
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
  assert.equal(
    layout.lastIndexOf('import "./'),
    layout.indexOf('import "./TeamMotionUpgrade.css"'),
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

test("website chips use a warm selected glow without an icon plate", async () => {
  const css = await read("src/components/site/ClientLandingFinal.css");
  assert.match(css, /--chip-accent: #ffc79d/);
  assert.match(css, /\.lp-hero-pick-icon,[\s\S]*background: transparent !important/);
  assert.match(css, /\.lp-hero-pick-icon,[\s\S]*border-radius: 0 !important/);
  assert.match(css, /0 0 36px -8px rgba\(255, 199, 157, 0\.72\)/);
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
  const hook = await read("src/hooks/useTimelineProgress.ts");

  // Kroky sú vedľa seba a spája ich jedna narastajúca čiara.
  assert.match(landing, /lp-timeline-rail/);
  assert.match(landing, /lp-timeline-fill/);
  assert.match(css, /grid-template-columns: repeat\(var\(--steps, 3\)/);

  // Smer čiary si vyberá CSS, hodnotu dodáva jedna premenná — tá istá
  // os tak funguje vodorovne na širokej obrazovke aj zvislo na mobile.
  assert.match(css, /scaleX\(var\(--tl-progress\)\)/);
  assert.match(css, /scaleY\(var\(--tl-progress\)\)/);
  // Prahy sa počítajú, nemerajú — odpadlo tým meranie rozloženia aj
  // pozorovateľ rozmerov, ktorý musel bežať pri každej zmene veľkosti.
  assert.match(hook, /progress/);
  assert.match(hook, /\(index \+ 0\.5\) \/ count/);
  assert.doesNotMatch(hook, /\.getBoundingClientRect\(/);
  assert.doesNotMatch(hook, /new ResizeObserver\(/);
  assert.doesNotMatch(hook, /useEffect\(/);
});

test("primary buttons keep readable ink on the light brand colour", async () => {
  const contact = await read("src/routes/kontakt.tsx");
  const finish = await read("src/components/site/SiteFinish.css");

  // Biely popis na svetlej marhuľovej mal kontrast 1,51:1.
  assert.match(finish, /\.contact-page \.contact-submit,/);
  assert.match(finish, /\.sp-page \.sp-button--primary,/);
  assert.match(finish, /color: #12100e !important/);

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
  const conversion = await read("src/components/site/HomeConversionUpgrade.tsx");
  const contact = await read("src/routes/kontakt.tsx");
  const css = await read("src/components/site/ApprovedInteractionsFinal.css");

  assert.match(landing, /lp-hero-cta--primary/);
  assert.match(landing, /lp-hero-cta--secondary/);
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

test("website chips use one crisp warm interaction system", async () => {
  const landing = await read("src/components/site/PremiumLanding.tsx");
  const pointer = await read("src/components/site/LiquidSurfacePointer.tsx");
  const css = await read("src/components/site/ClientLandingFinal.css");

  assert.doesNotMatch(landing, /lp-hero-pick-fill/);
  assert.doesNotMatch(landing, /lp-chip-fill/);
  assert.doesNotMatch(landing, /whileTap=/);
  assert.match(landing, /data-chip-kind="hero"/);
  assert.match(landing, /data-chip-kind="capability"/);
  assert.match(landing, /event\.stopPropagation\(\)/);
  assert.doesNotMatch(pointer, /"\.lp-hero-pick"/);
  assert.doesNotMatch(pointer, /"\.lp-chip"/);
  assert.match(css, /solution picker \/ chips/);
  assert.match(css, /background: rgba\(255, 199, 157, 0\.13\) !important/);
  assert.match(css, /The icon is an icon, never an icon tile/);
});

test("landing anchors, one-shot reveals and source integrity stay intact", async () => {
  const landing = await read("src/components/site/PremiumLanding.tsx");
  const realization = await read("src/components/site/DeratScrollStory.tsx");
  const primitives = await read("src/components/site/motion-primitives.tsx");
  const finalCorrection = await read("src/components/site/FinalUserCorrection.css");

  // Sekcia realizácií drží reálne weby; prípadová štúdia má vlastnú kotvu,
  // takže sa id na stránke neopakuje.
  assert.match(landing, /id="realizacie"/);
  assert.match(landing, /id="moznosti"/);
  assert.match(landing, /href: "#realizacie"/);
  assert.match(landing, /href: "#pripadova-studia"/);

  // Prvé tlačidlo v hero vedie k dohode, nie o kus nižšie na tú istú
  // stránku — predtým obe viedli len na ďalšie prezeranie.
  assert.match(landing, /primary: \{ label: "[^"]+", to: "\/kontakt" \}/);
  assert.match(realization, /id="pripadova-studia"/);
  assert.doesNotMatch(realization, /id="realizacie"/);

  // Odhaľovanie sa spúšťa raz. Opakované spúšťanie pri každom prechode
  // cez sekciu bolo hlavným zdrojom sekania pri scrollovaní.
  assert.doesNotMatch(landing, /once: false/);
  assert.doesNotMatch(primitives, /once: false/);
  assert.doesNotMatch(realization, /once: false/);
  assert.match(primitives, /once: true/);

  assert.doesNotMatch(finalCorrection, /^(?:<<<<<<<|=======|>>>>>>>)(?: .*)?$/m);
});

test("realizations are real live websites, not invented case studies", async () => {
  const realizations = await read("src/data/realizations.ts");
  const projectsRoute = await read("src/routes/projekty.index.tsx");
  const landing = await read("src/components/site/PremiumLanding.tsx");

  for (const domain of ["mojplot.sk", "koverta.sk", "webko.sk"]) {
    assert.match(realizations, new RegExp(domain.replace(".", "\\.")));
  }
  // Vzorové rozhrania ostávajú, ale sú označené ako ukážky, nie realizácie.
  assert.match(projectsRoute, /Vzorové rozhrania/);
  assert.match(projectsRoute, /nie sú nasadené firemné projekty/);
  assert.match(landing, /realizations\.map/);
  assert.doesNotMatch(landing, /Ukážka 0/);
});

test("both landing variants exist and the client one stays out of the index", async () => {
  const landing = await read("src/components/site/PremiumLanding.tsx");
  const clientRoute = await read("src/routes/navrh.tsx");
  const homeRoute = await read("src/routes/index.tsx");
  const robots = await read("public/robots.txt");

  assert.match(landing, /Návrh už máte\./);
  assert.match(landing, /variant="client"|variant: LandingVariant/);
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
  assert.doesNotMatch(footer, /contact\.emailPersonal/);
  assert.match(footer, /Tím vedie/);
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

test("collaboration timelines alternate from the sides and respect reduced motion", async () => {
  const landing = await read("src/components/site/PremiumLanding.tsx");
  const process = await read("src/routes/postup.tsx");
  const css = await read("src/components/site/TeamMotionUpgrade.css");

  assert.match(landing, /data-side=\{index % 2 === 0 \? "left" : "right"\}/);
  assert.match(landing, /lp-step-result/);
  assert.match(process, /whileInView=\{\{ opacity: 1, x: 0, y: 0 \}\}/);
  assert.match(css, /animation-timeline: view\(\)/);
  assert.match(css, /prefers-reduced-motion: reduce/);
});
