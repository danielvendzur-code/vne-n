import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

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
  assert.equal(
    layout.lastIndexOf('import "./'),
    layout.indexOf('import "./ClientLandingFinal.css"'),
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

test("landing anchors, reversible reveals and source integrity stay intact", async () => {
  const landing = await read("src/components/site/PremiumLanding.tsx");
  const realization = await read("src/components/site/DeratScrollStory.tsx");
  const primitives = await read("src/components/site/motion-primitives.tsx");
  const finalCorrection = await read("src/components/site/FinalUserCorrection.css");

  assert.match(landing, /href="#realizacie"/);
  assert.match(landing, /href="#moznosti"/);
  assert.match(realization, /id="realizacie"/);
  assert.match(landing, /once: false/);
  assert.match(primitives, /once: false/);
  assert.doesNotMatch(finalCorrection, /^(?:<<<<<<<|=======|>>>>>>>)(?: .*)?$/m);
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
