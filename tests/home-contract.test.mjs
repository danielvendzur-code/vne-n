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

test("active homepage keeps three clean hero previews and four realizations", async () => {
  const route = await read("src/routes/index.tsx");
  const landing = await read("src/components/site/KageLanding.tsx");
  const css = await read("src/components/site/KageLanding.css");

  assert.match(route, /KageLanding/);
  assert.match(landing, /Web, ktorý mení návštevy na výsledky\./);
  assert.match(landing, /work\/portfolio\/koverta\.webp/);
  assert.match(landing, /work\/live\/derat\.webp/);
  assert.match(landing, /work\/live\/mojplot\.webp/);
  assert.match(landing, /work\/live\/webko\.webp/);
  assert.equal((landing.match(/siteImage:/g) ?? []).length, 4);
  assert.match(landing, /const heroProjects = featuredProjects\.slice\(0, 3\)/);
  assert.match(landing, /heroProjects\.map/);
  assert.match(landing, /featuredProjects\.map/);
  assert.doesNotMatch(landing, /work\/product\/|assistantImage|project-composite__assistant/);
  for (const slug of ["koverta", "derat", "mojplot", "webko"]) {
    assert.match(landing, new RegExp(`slug: "${slug}"`));
    assert.match(css, new RegExp(`project-composite--${slug}`));
  }
  assert.match(landing, /AnimatedPrice value=\{347\}/);
  assert.match(landing, /AnimatedPrice value=\{447\}/);
  assert.match(landing, /data-nav-tone="dark"/);
  // 03 / Ako to funguje is a real vertical chapter: normal page scroll drives
  // a sticky horizontal story. There is no wheel interception or separate
  // sideways-scroll gesture.
  const reworkCss = await read("src/components/site/HomepageReworkSep07.css");
  assert.match(landing, /ref=\{storyRef\}[\s\S]*className="kage-flow-story"/);
  assert.match(landing, /className="kage-flow-story__sticky"/);
  assert.match(landing, /window\.addEventListener\("scroll", scheduleUpdate/);
  assert.match(landing, /translate3d\(\$\{offset\}px, 0, 0\)/);
  assert.doesNotMatch(landing, /onWheel|addEventListener\("wheel"/);
  assert.doesNotMatch(landing, /scrollLeft\s*[+\-]?=/);
  assert.match(reworkCss, /\.kage-home \.kage-flow-story \{[\s\S]*height:\s*390svh/);
  assert.match(reworkCss, /\.kage-home \.kage-flow-story__sticky \{[\s\S]*position:\s*sticky/);
  assert.match(reworkCss, /touch-action:\s*pan-y/);
  assert.match(css, /\.kage-flow__step[\s\S]*display:\s*grid/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
  assert.doesNotMatch(landing, /SignalLens|signal-rail|back-to-top/i);
  assert.doesNotMatch(landing, /LiveDemos|Nie iba screenshot/i);
});

test("homepage is a clear work-led question-to-outcome experience", async () => {
  const landing = await read("src/components/site/PremiumLanding.tsx");
  const css = await read("src/components/site/AwardHome.css");

  assert.match(landing, /Od otázky/);
  assert.match(landing, /k výsledku/);
  assert.match(landing, /Chatbot, kalkulačka, konfigurátor alebo produktový poradca/i);
  assert.match(landing, /HeroCollage/);
  assert.match(landing, /PageGuide/);
  assert.match(landing, /FlowStory/);
  assert.match(landing, /SelectedWork/);
  assert.match(landing, /CoreTools/);
  assert.match(landing, /PRE FIRMY SO SLUŽBAMI/);
  assert.match(landing, /PRE E-SHOPY/);
  assert.match(landing, /Produktový poradca/);
  assert.match(landing, /ProofAndPrice/);
  assert.match(landing, /Povedzte nám, čo má váš web vedieť/);
  assert.match(landing, /Chatbot/);
  assert.match(landing, /Kalkulačka/);
  assert.match(landing, /Konfigurátor/);
  assert.doesNotMatch(landing, /QUESTION|CONTEXT|LOGIC|OUTCOME|SCROLL\s*\/\s*EXPLORE/i);

  assert.match(css, /height:\s*300vh/);
  assert.match(css, /position:\s*sticky/);
  assert.match(css, /\.hybrid-flow__track/);
  assert.match(css, /\.hybrid-work__grid/);
  assert.match(css, /\.page-guide/);
  assert.match(css, /body:has\(\.hybrid-home\)/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(css, /@media \(max-width: 720px\)/);
  assert.doesNotMatch(css, /backdrop-filter:\s*blur\(/i);
  assert.doesNotMatch(css, /linear-gradient\([^;]*(?:purple|violet|#7c3aed|#8b5cf6)/i);
});

test("homepage uses four real projects with one consistent realization frame", async () => {
  const landing = await read("src/components/site/PremiumLanding.tsx");
  const realizations = await read("src/data/realizations.ts");
  const css = await read("src/components/site/AwardHome.css");

  for (const name of ["DERAT", "Môj Plot", "Koverta", "WEBKO"]) {
    assert.match(realizations, new RegExp(name));
  }
  assert.match(landing, /realizations\.map/);
  assert.match(landing, /Pozrite si weby, ktoré už bežia/);
  assert.match(css, /grid-template-columns:\s*repeat\(2, minmax\(0, 1fr\)\)/);
  assert.match(css, /\.hybrid-project__visual[\s\S]*aspect-ratio:\s*1\.6/);
  assert.doesNotMatch(landing, /Najprv práca|ŽIVÉ\. KLIKATEĽNÉ|anonymné percentá/i);
  assert.doesNotMatch(landing, /\+\s*\d+\s*%|\d+×|\d+\s*clients|conversion\s+rate/i);
  assert.doesNotMatch(landing, /placeholder/i);
});

test("navigation uses the real subpages and keeps the project CTA", async () => {
  const nav = await read("src/components/site/Nav.tsx");
  const globalCss = await read("src/components/site/Rebrand.css");
  const homeCss = await read("src/components/site/AwardHome.css");

  assert.match(nav, /Riešenia/);
  assert.match(nav, /Realizácie/);
  assert.match(nav, /Ako to funguje/);
  assert.match(nav, /Cenník/);
  assert.match(nav, /Začať projekt/);
  for (const href of ["/sluzby", "/projekty", "/postup", "/cennik", "/kontakt"]) {
    assert.ok(
      nav.includes(`href: "${href}"`) || nav.includes(`to: "${href}"`),
      `Missing subpage link: ${href}`,
    );
  }
  assert.doesNotMatch(nav, /\/#(?:riesenia|realizacie|ako-to-funguje|cena|proces|pre-eshopy)/);
  assert.match(nav, /const isAdaptiveRoute = sections\.length > 0/);
  assert.doesNotMatch(nav, /backdrop-blur|rounded-\[20px\]|LineSidebar|menuSolutions/);
  assert.match(globalCss, /\.site-menu-layer/);
  assert.match(globalCss, /min-height:\s*100dvh/);
  assert.match(homeCss, /\.site-header__cta[\s\S]*border:/);
});

test("pricing is a real routed hero and keeps the public prices without fake plans", async () => {
  const pricing = await read("src/routes/cennik.tsx");
  const landing = await read("src/components/site/KageLanding.tsx");
  const pricingCss = await read("src/components/site/PricingReworkSep07.css");
  const homeCss = await read("src/components/site/HomepageReworkSep07.css");

  assert.equal((pricing.match(/setup: "od 347 €"/g) ?? []).length, 1);
  assert.equal((pricing.match(/setup: "od 447 €"/g) ?? []).length, 2);
  assert.equal((pricing.match(/monthly: "10 € \/ mesiac"/g) ?? []).length, 3);
  assert.match(landing, /to="\/cennik"/);
  assert.match(pricing, /id="baliky"/);
  assert.match(pricing, /pricing-hero__eyebrow/);
  assert.match(pricing, /data-nav-tone="dark"/);
  assert.match(pricingCss, /min-height:\s*calc\(100svh - var\(--header-h\)\)/);
  assert.match(homeCss, /\.kage-home \.kage-price-hero/);
  assert.match(pricing, /V CENE VYTVORENIA/);
  assert.match(pricing, /MESAČNE/);
  assert.match(pricing, /AK TREBA NIEČO NAVYŠE/);
  assert.doesNotMatch(pricing, /Najčastejšia voľba/i);
  assert.doesNotMatch(pricing, /\b(?:Basic|Pro|Enterprise)\b/i);
});

test("homepage, form and subpages share the smooth one-way reveal controller", async () => {
  const layout = await read("src/components/site/Layout.tsx");
  const controller = await read("src/components/site/PageRevealController.tsx");
  const pagesCss = await read("src/components/site/RebrandPages.css");
  const motion = await read("src/components/site/motion-primitives.tsx");

  assert.match(layout, /PageRevealController pathname=\{pathname\}/);
  assert.match(controller, /IntersectionObserver/);
  assert.match(controller, /contact-form/);
  assert.match(controller, /hybrid-price/);
  assert.match(controller, /element\.animate/);
  assert.match(controller, /prefers-reduced-motion/);
  assert.match(controller, /hybrid-work__grid > article/);
  assert.match(controller, /outcome-comparison__group li/);
  assert.match(controller, /element\.dataset\.motionReveal = "staged"/);
  assert.match(controller, /duration:\s*state\.duration/);
  assert.doesNotMatch(pagesCss, /data-scroll-reveal/);
  assert.match(motion, /base:\s*0\.72/);
  assert.match(motion, /data-motion-reveal/);
});

test("contact form retains sanitization, privacy notice, honeypot and resilient lead submission", async () => {
  const contact = await read("src/routes/kontakt.tsx");
  const client = await read("src/lib/lead-submission.ts");

  assert.match(contact, /cleanField/);
  assert.match(contact, /normalizeHttpUrl/);
  assert.match(contact, /isEmail/);
  assert.match(contact, /contact-website/);
  assert.match(contact, /contact-privacy-note/);
  assert.match(contact, /Ochrana osobných údajov/);
  assert.doesNotMatch(contact, /type="checkbox"/);
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

test("launch legal identity is complete, permanent and absent from homepage copy", async () => {
  const config = await read("src/config/site.ts");
  const footer = await read("src/components/site/Footer.tsx");
  const legal = await read("src/routes/pravne-informacie.tsx");
  const privacy = await read("src/routes/ochrana-udajov.tsx");
  const home = await read("src/components/site/KageLanding.tsx");

  for (const required of [
    "Venaco s.r.o.",
    "J. C. Hronského 3427/6, 949 07 Nitra",
    "45648107",
    "2023076407",
    "SK2023076407",
    "27111/N",
  ]) {
    assert.ok(config.includes(required), `Missing legal identity field: ${required}`);
  }

  assert.match(footer, /to="\/pravne-informacie"/);
  assert.match(legal, /createFileRoute\("\/pravne-informacie"\)/);
  assert.match(legal, /Orgán dozoru/);
  assert.match(privacy, /legal\.operator/);
  assert.doesNotMatch(home, /45648107|2023076407|SK2023076407/);
});

test("analytics consent is optional, reversible and cannot cover the chatbot", async () => {
  const consent = await read("src/components/site/AnalyticsConsent.tsx");
  const css = await read("src/components/site/LaunchReadinessFinal.css");
  const layout = await read("src/components/site/Layout.tsx");

  assert.match(consent, /Odmietnuť analytiku/);
  assert.match(consent, /Povoliť analytiku/);
  assert.match(consent, /removeGoogleAnalyticsCookies/);
  assert.match(consent, /localStorage/);
  assert.doesNotMatch(consent, /data-primary/);
  assert.match(css, /body:has\(\.analytics-consent\) #dv-assistant-root/);
  assert.match(css, /z-index:\s*90/);
  assert.match(layout, /LaunchReadinessFinal\.css/);
  assert.ok(
    layout.indexOf("LaunchReadinessFinal.css") > layout.indexOf("UserFollowupSep01.css"),
    "launch authority must load last",
  );
});
