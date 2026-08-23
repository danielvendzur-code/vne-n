import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("layout loads one coherent brand system instead of historical override stack", async () => {
  const layout = await read("src/components/site/Layout.tsx");

  assert.match(layout, /Rebrand\.css/);
  assert.match(layout, /RebrandPages\.css/);
  for (const legacy of [
    "FinalUserCorrection.css",
    "CompetitionWinnerFinal.css",
    "AppleLiquidSystemFinal.css",
    "LiquidChipPolish.css",
    "LimeWhiteBrandFinal.css",
    "RoundFixes.css",
    "ProductionReadiness.css",
  ]) {
    assert.doesNotMatch(layout, new RegExp(legacy.replace(".", "\\.")));
  }
  assert.doesNotMatch(
    layout,
    /SiteMotionEnhancements|SiteFunnelBridge|useSpotlight|useSettledSections/,
  );
});

test("public homepage keeps the dark work-led hero and visible product proof", async () => {
  const landing = await read("src/components/site/AwardV2Landing.tsx");
  const css = await read("src/components/site/AwardV2Landing.css");
  const route = await read("src/routes/index.tsx");

  assert.match(route, /AwardV2Landing/);
  assert.match(landing, /Od otázky/);
  assert.match(landing, /k výsledku/);
  assert.match(landing, /HeroCollage/);
  assert.match(landing, /HeroChatPreview/);
  assert.match(landing, /ŽIVÝ CHATBOT/);
  assert.match(landing, /ContinuousGuide/);
  assert.match(landing, /HorizontalFlow/);
  assert.match(landing, /SelectedWork/);
  assert.match(landing, /CoreTools/);
  assert.match(landing, /LiveDemos/);
  assert.match(landing, /Produktový poradca/);
  assert.match(landing, /Chatbot/);
  assert.match(landing, /Kalkulačka/);
  assert.match(landing, /Konfigurátor/);
  assert.doesNotMatch(landing, /QUESTION|CONTEXT|LOGIC|OUTCOME|SCROLL\s*\/\s*EXPLORE/i);

  assert.match(css, /body:has\(\.award2-home\) \.site-header[\s\S]*background:/);
  assert.match(css, /\.award2-hero-chat/);
  assert.match(css, /\.award2-guide/);
  assert.match(css, /offset-path:\s*path/);
  assert.match(css, /height:\s*420vh/);
  assert.match(css, /position:\s*sticky/);
  assert.match(css, /\.award2-flow__track/);
  assert.match(css, /width:\s*400vw/);
  assert.match(css, /\.award2-work__grid/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(css, /@media \(max-width: 720px\)/);
  assert.doesNotMatch(css, /linear-gradient\([^;]*(?:purple|violet|#7c3aed|#8b5cf6)/i);
});

test("homepage uses four real projects with one consistent realization frame", async () => {
  const landing = await read("src/components/site/AwardV2Landing.tsx");
  const realizations = await read("src/data/realizations.ts");
  const css = await read("src/components/site/AwardV2Landing.css");

  for (const name of ["DERAT", "Môj Plot", "Koverta", "WEBKO"]) {
    assert.match(realizations, new RegExp(name));
  }
  assert.match(landing, /realizations\.map/);
  assert.match(landing, /Weby, ktoré už bežia/);
  assert.match(css, /grid-template-columns:\s*repeat\(2, minmax\(0, 1fr\)\)/);
  assert.match(css, /\.award2-project__visual[\s\S]*aspect-ratio:\s*1\.6/);
  assert.doesNotMatch(landing, /Najprv práca|ŽIVÉ\. KLIKATEĽNÉ|anonymné percentá/i);
  assert.doesNotMatch(landing, /\+\s*\d+\s*%|\d+×|\d+\s*clients|conversion\s+rate/i);
});

test("homepage keeps WEBKO and APLAN as additional live demos", async () => {
  const landing = await read("src/components/site/AwardV2Landing.tsx");
  const realizations = await read("src/data/realizations.ts");

  assert.match(landing, /VYSKÚŠAJTE SI TO/);
  assert.match(landing, /WEBKO/);
  assert.match(landing, /APLAN AI/);
  assert.match(landing, /Môj Chatbot/);
  assert.match(realizations, /APLAN AI/);
});

test("navigation remains an editorial dark-home header with a visible project CTA and fullscreen mobile menu", async () => {
  const nav = await read("src/components/site/Nav.tsx");
  const globalCss = await read("src/components/site/Rebrand.css");
  const homeCss = await read("src/components/site/AwardV2Landing.css");

  assert.match(nav, /Riešenia/);
  assert.match(nav, /Pre e-shopy/);
  assert.match(nav, /Realizácie/);
  assert.match(nav, /Ako to funguje/);
  assert.match(nav, /Začať projekt/);
  assert.match(nav, /01/);
  assert.match(nav, /06/);
  assert.doesNotMatch(nav, /backdrop-blur|rounded-\[20px\]|LineSidebar|menuSolutions/);
  assert.match(globalCss, /\.site-menu-layer/);
  assert.match(globalCss, /min-height:\s*100dvh/);
  assert.match(homeCss, /body:has\(\.award2-home\) \.site-header/);
  assert.match(homeCss, /\.site-header__cta[\s\S]*border-color:\s*var\(--a2-lime\)/);
});

test("pricing keeps the updated public prices and avoids fake plans", async () => {
  const pricing = await read("src/routes/cennik.tsx");
  const landing = await read("src/components/site/AwardV2Landing.tsx");

  assert.equal((pricing.match(/setup: "od 497 €"/g) ?? []).length, 1);
  assert.equal((pricing.match(/setup: "od 597 €"/g) ?? []).length, 2);
  assert.equal((pricing.match(/monthly: "10 € \/ mesiac"/g) ?? []).length, 3);
  assert.match(landing, /od 497 €/);
  assert.match(landing, /od 597 €/);
  assert.match(landing, /10 €/);
  assert.match(pricing, /V CENE VYTVORENIA/);
  assert.match(pricing, /MESAČNE/);
  assert.match(pricing, /AK TREBA NIEČO NAVYŠE/);
  assert.doesNotMatch(pricing, /Najčastejšia voľba/i);
  assert.doesNotMatch(pricing, /\b(?:Basic|Pro|Enterprise)\b/i);
});

test("contact form retains sanitization, consent, honeypot and resilient lead submission", async () => {
  const contact = await read("src/routes/kontakt.tsx");
  const client = await read("src/lib/lead-submission.ts");

  assert.match(contact, /cleanField/);
  assert.match(contact, /contact-website/);
  assert.match(contact, /consent/);
  assert.match(contact, /submitWebsiteLead/);
  assert.match(contact, /result\.fallback/);
  assert.match(contact, /dakujeme/);
  assert.match(client, /api\/lead/);
  assert.match(client, /AbortController/);
});

test("public SEO positions Môj Chatbot as digital sales tools without unsupported post-purchase claims", async () => {
  const home = await read("src/routes/index.tsx");
  const root = await read("src/routes/__root.tsx");

  assert.match(home, /Digitálne predajné nástroje na mieru/);
  assert.match(home, /produktoví poradcovia/);
  assert.doesNotMatch(home, /sledovanie objednávky|zrušenie objednávky|reklamácie/);
  assert.match(root, /produktový poradca/);
  assert.match(root, /guided selling/);
  assert.doesNotMatch(root, /AI asistent pre web/);
});

test("DERAT case-study route and thank-you route exist as real source routes", async () => {
  const projects = await read("src/routes/projekty.index.tsx");
  const derat = await read("src/routes/projekty.derat.tsx");
  const thanks = await read("src/routes/dakujeme.tsx");

  assert.match(projects, /projekty\/derat/);
  assert.match(derat, /createFileRoute\("\/projekty\/derat"\)/);
  assert.match(derat, /derat\.sk/);
  assert.match(thanks, /createFileRoute\("\/dakujeme"\)/);
  assert.match(thanks, /Máme/);
});

test("client landing remains a noindex continuation of the same brand", async () => {
  const navrh = await read("src/routes/navrh.tsx");
  const landing = await read("src/components/site/PremiumLanding.tsx");

  assert.match(navrh, /PremiumLanding variant="client"/);
  assert.match(navrh, /noindex:\s*true/);
  assert.match(landing, /Návrh už máte/);
  assert.match(landing, /Teraz ho zažite/);
});
