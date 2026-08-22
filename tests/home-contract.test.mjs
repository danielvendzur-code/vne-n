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

test("homepage is a work-led question-to-outcome experience", async () => {
  const landing = await read("src/components/site/PremiumLanding.tsx");
  const css = await read("src/components/site/AwardHome.css");

  assert.match(landing, /Od otázky/);
  assert.match(landing, /k výsledku/);
  assert.match(landing, /Chatboty, kalkulačky, konfigurátory a produktoví poradcovia/i);
  assert.match(landing, /HeroCollage/);
  assert.match(landing, /FlowStory/);
  assert.match(landing, /SelectedWork/);
  assert.match(landing, /CoreTools/);
  assert.match(landing, /PRE FIRMY SO SLUŽBAMI/);
  assert.match(landing, /PRE E-SHOPY/);
  assert.match(landing, /Produktový poradca/);
  assert.match(landing, /ProofAndPrice/);
  assert.match(landing, /Má váš web iba existovať/);

  assert.match(css, /height:\s*420vh/);
  assert.match(css, /position:\s*sticky/);
  assert.match(css, /\.hybrid-flow__track/);
  assert.match(css, /\.hybrid-work__grid/);
  assert.match(css, /body:has\(\.hybrid-home\)/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(css, /@media \(max-width: 720px\)/);
  assert.doesNotMatch(css, /backdrop-filter:\s*blur\(/i);
  assert.doesNotMatch(css, /linear-gradient\([^;]*(?:purple|violet|#7c3aed|#8b5cf6)/i);
});

test("homepage uses real projects and no invented performance metrics", async () => {
  const landing = await read("src/components/site/PremiumLanding.tsx");
  const realizations = await read("src/data/realizations.ts");

  for (const name of ["DERAT", "Môj Plot", "Koverta", "WEBKO"]) {
    assert.match(realizations, new RegExp(name));
  }
  assert.match(landing, /realizations\.map/);
  assert.match(landing, /ŽIVÉ\. KLIKATEĽNÉ\. OVERITEĽNÉ\./);
  assert.doesNotMatch(landing, /\+\s*\d+\s*%|\d+×|\d+\s*clients|conversion\s+rate/i);
  assert.doesNotMatch(landing, /placeholder/i);
});

test("navigation remains an editorial header with a fullscreen mobile menu", async () => {
  const nav = await read("src/components/site/Nav.tsx");
  const css = await read("src/components/site/Rebrand.css");

  assert.match(nav, /Riešenia/);
  assert.match(nav, /Pre e-shopy/);
  assert.match(nav, /Realizácie/);
  assert.match(nav, /Ako to funguje/);
  assert.match(nav, /Začať projekt/);
  assert.match(nav, /01/);
  assert.match(nav, /06/);
  assert.doesNotMatch(nav, /backdrop-blur|rounded-\[20px\]|LineSidebar|menuSolutions/);
  assert.match(css, /\.site-menu-layer/);
  assert.match(css, /min-height:\s*100dvh/);
});

test("pricing keeps the verified public prices and avoids fake plans", async () => {
  const pricing = await read("src/routes/cennik.tsx");
  const landing = await read("src/components/site/PremiumLanding.tsx");

  assert.equal((pricing.match(/setup: "350 €"/g) ?? []).length, 1);
  assert.equal((pricing.match(/setup: "od 400 €"/g) ?? []).length, 2);
  assert.equal((pricing.match(/monthly: "10 € \/ mesiac"/g) ?? []).length, 3);
  assert.match(landing, /350 €/);
  assert.match(landing, /10 €/);
  assert.match(landing, /od 400 €/);
  assert.match(pricing, /V CENE VYTVORENIA/);
  assert.match(pricing, /MESAČNE/);
  assert.match(pricing, /VOLITEĽNÁ PRÁCA/);
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
