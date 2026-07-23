import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("competition layer and conversion section are mounted last", async () => {
  const layout = await read("src/components/site/Layout.tsx");
  const css = await read("src/components/site/CompetitionWinnerFinal.css");
  const conversion = await read("src/components/site/HomeConversionUpgrade.tsx");
  assert.match(layout, /HomeConversionUpgrade/);
  assert.match(layout, /CompetitionWinnerFinal\.css/);
  assert.equal(
    layout.lastIndexOf('import "./'),
    layout.indexOf('import "./CompetitionWinnerFinal.css"'),
  );
  assert.match(css, /Final competition layer/);
  assert.match(conversion, /od 350 €/);
  assert.match(conversion, /Čo potrebujem od klienta/);
  assert.match(conversion, /Získať návrh riešenia/);
});

test("flashlight follows pointer across approved dark surfaces", async () => {
  const pointer = await read("src/components/site/LiquidSurfacePointer.tsx");
  const css = await read("src/components/site/CompetitionWinnerFinal.css");
  assert.match(pointer, /\.spotlight-surface/);
  assert.match(pointer, /\.lp-solution-cta/);
  assert.match(pointer, /\.lp-hero-pick/);
  assert.match(pointer, /--spot-x/);
  assert.match(pointer, /data\.spotlight/);
  assert.match(pointer, /requestAnimationFrame/);
  assert.match(css, /circle at var\(--spot-x\) var\(--spot-y\)/);
  assert.match(css, /\[data-spotlight="true"\]::before/);
  assert.match(css, /rgba\(255, 255, 255, 0\.28\)/);
});

test("all website chips share one stable state without a side stripe", async () => {
  const css = await read("src/components/site/CompetitionWinnerFinal.css");
  assert.match(css, /\.lp-hero-pick,[\s\S]*\.lp-chip,[\s\S]*\.sp-hero-chips \.chip/);
  assert.match(css, /\.lp-hero-pick\[data-active="true"\],[\s\S]*\.lp-chip\[data-active="true"\]/);
  assert.match(css, /border-color:\s*#6ca5ff !important/);
  assert.doesNotMatch(css, /inset 3px 0 0/);
  assert.match(css, /\.lp-chip-fill[\s\S]*display:\s*none !important/);
  assert.match(css, /\.lp-chip\[data-active="true"\] \.lp-chip-icon svg[\s\S]*rotate\(45deg\)/);
});

test("only the comparison remains a liquid segmented control", async () => {
  const layout = await read("src/components/site/Layout.tsx");
  const drag = await read("src/components/site/LiquidSegmentedDrag.tsx");
  const css = await read("src/components/site/CompetitionWinnerFinal.css");
  assert.match(layout, /LiquidSegmentedDrag/);
  assert.match(drag, /setPointerCapture/);
  assert.match(css, /Keep the approved liquid comparison/);
  assert.match(css, /\.lp-switch[\s\S]*backdrop/);
  assert.match(css, /-webkit-backdrop-filter:\s*none !important/);
});

test("hero and desktop navigation are visually simplified", async () => {
  const css = await read("src/components/site/CompetitionWinnerFinal.css");
  assert.match(css, /\.lp-assistant-card[\s\S]*top:\s*44% !important/);
  assert.match(css, /\.lp-hero-grid[\s\S]*minmax\(30rem, 0\.97fr\)/);
  assert.match(css, /@media \(min-width:\s*1024px\)[\s\S]*\.site-menu-toggle[\s\S]*display:\s*none !important/);
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
  assert.match(config, /competition-winner-20260723-v5/);
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

test("mobile conversion and chip layouts are explicit", async () => {
  const css = await read("src/components/site/CompetitionWinnerFinal.css");
  assert.match(css, /@media \(max-width:\s*760px\)/);
  assert.match(css, /\.winner-trust,[\s\S]*\.winner-final[\s\S]*grid-template-columns:\s*1fr !important/);
  assert.match(css, /\.lp-hero-picker[\s\S]*grid-template-columns:\s*1fr !important/);
  assert.match(css, /@media \(hover:\s*none\), \(pointer:\s*coarse\)/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
});

test("metadata security and fresh assistant loading remain present", async () => {
  const root = await read("src/routes/__root.tsx");
  const loader = await read("public/widget-loader.js");
  assert.match(root, /Content-Security-Policy/);
  assert.match(root, /strict-origin-when-cross-origin/);
  assert.match(loader, /__DV_ASSISTANT_LOADER_ACTIVE__/);
  assert.match(loader, /MOUNT_TIMEOUT/);
  assert.match(loader, /competition-winner-v5/);
  assert.match(loader, /Môj Chatbot/);
  assert.match(loader, /od 350 €/);
});

test("Pages workflow validates the live competition build", async () => {
  const workflow = await read(".github/workflows/pages.yml");
  assert.match(workflow, /Audit production dependencies/);
  assert.match(workflow, /Run source and deployment security audit/);
  assert.match(workflow, /Run UX and deployment contracts/);
  assert.match(workflow, /Verify live deployment and all public routes/);
  assert.match(workflow, /competition-winner-v5/);
  assert.match(workflow, /live_smoke=success/);
});
