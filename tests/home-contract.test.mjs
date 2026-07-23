import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("Taste system and conversion section are mounted", async () => {
  const layout = await read("src/components/site/Layout.tsx");
  const tasteCss = await read("src/components/site/TasteSystemFinal.css");
  const conversion = await read("src/components/site/HomeConversionUpgrade.tsx");
  assert.match(layout, /HomeConversionUpgrade/);
  assert.match(layout, /CompetitionWinnerFinal\.css/);
  assert.match(layout, /TasteSystemFinal\.css/);
  assert.equal(
    layout.lastIndexOf('import "./'),
    layout.indexOf('import "./TasteSystemFinal.css"'),
  );
  assert.match(tasteCss, /Taste-system final layer/);
  assert.match(conversion, /od 350 €/);
  assert.match(conversion, /Čo potrebujem od klienta/);
  assert.match(conversion, /Získať návrh riešenia/);
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

test("website chips are rounded borderless and use a clean selected state", async () => {
  const tasteCss = await read("src/components/site/TasteSystemFinal.css");
  assert.match(tasteCss, /\.lp-hero-pick,[\s\S]*\.lp-chip/);
  assert.match(tasteCss, /border: 0 !important/);
  assert.match(tasteCss, /border-radius: 16px !important/);
  assert.match(
    tasteCss,
    /\.lp-hero-pick\[data-active="true"\],[\s\S]*background: #19345d !important/,
  );
  assert.match(tasteCss, /\.lp-hero-pick-fill,[\s\S]*display: none !important/);
  assert.match(tasteCss, /\.lp-hero-pick-icon,[\s\S]*background: transparent !important/);
  assert.doesNotMatch(tasteCss, /inset 3px 0 0/);
});

test("comparison uses one clean content surface", async () => {
  const layout = await read("src/components/site/Layout.tsx");
  const drag = await read("src/components/site/LiquidSegmentedDrag.tsx");
  const tasteCss = await read("src/components/site/TasteSystemFinal.css");
  assert.match(layout, /LiquidSegmentedDrag/);
  assert.match(drag, /setPointerCapture/);
  assert.match(tasteCss, /One comparison card/);
  assert.match(tasteCss, /\.lp-switch[\s\S]*border: 0 !important/);
  assert.match(tasteCss, /\.lp-comparison[\s\S]*background: transparent !important/);
  assert.match(tasteCss, /\.lp-comparison-body[\s\S]*border-radius: 24px !important/);
  assert.match(tasteCss, /\.lp-comparison-copy,[\s\S]*background: transparent !important/);
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

test("pricing and client preparation cover the sales essentials", async () => {
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
  assert.match(faq, /začína od 350 €/);
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

test("metadata security and fresh assistant loading remain present", async () => {
  const root = await read("src/routes/__root.tsx");
  const loader = await read("public/widget-loader.js");
  assert.match(root, /Content-Security-Policy/);
  assert.match(root, /strict-origin-when-cross-origin/);
  assert.match(root, /ProfessionalService/);
  assert.match(root, /Môj Chatbot — chatboty na mieru od 350 €/);
  assert.match(loader, /__DV_ASSISTANT_LOADER_ACTIVE__/);
  assert.match(loader, /MOUNT_TIMEOUT/);
  assert.match(loader, /taste-system-v7/);
  assert.match(loader, /Môj Chatbot/);
  assert.match(loader, /od 350 €/);
});

test("Pages workflow validates the live Taste build", async () => {
  const workflow = await read(".github/workflows/pages.yml");
  assert.match(workflow, /Audit production dependencies/);
  assert.match(workflow, /Run source and deployment security audit/);
  assert.match(workflow, /Run UX and deployment contracts/);
  assert.match(workflow, /Verify live deployment and all public routes/);
  assert.match(workflow, /taste-system-v7/);
  assert.match(workflow, /TasteSystemFinal\.css/);
  assert.match(workflow, /live_smoke=success/);
});
