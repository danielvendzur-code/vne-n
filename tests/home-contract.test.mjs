import test from "node:test";
import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("chatbot-first copy is rendered directly by React", async () => {
  const landing = await read("src/components/site/PremiumLanding.tsx");
  const motion = await read("src/components/site/SiteMotionEnhancements.tsx");
  const layout = await read("src/components/site/Layout.tsx");
  assert.match(landing, /Chatboty, ktoré/);
  assert.match(landing, /zvyšujú konverzie/);
  assert.match(landing, /Čo pre vás postavím/);
  assert.match(landing, /GlideField/);
  assert.match(landing, /LiquidControlGlow/);
  assert.doesNotMatch(motion, /refineHomepageCopy|replaceText/);
  assert.doesNotMatch(layout, /RequestedRuntimePolish/);
  await assert.rejects(
    access(new URL("../src/components/site/RequestedRuntimePolish.tsx", import.meta.url)),
  );
});

test("one final liquid layer owns the complete website", async () => {
  const layout = await read("src/components/site/Layout.tsx");
  const finalCss = await read("src/components/site/AppleLiquidSystemFinal.css");
  assert.ok(
    layout.indexOf('import "./ProfessionalChipFinal.css"') <
      layout.indexOf('import "./AppleLiquidSystemFinal.css"'),
  );
  assert.equal(
    layout.lastIndexOf('import "./'),
    layout.indexOf('import "./AppleLiquidSystemFinal.css"'),
  );
  for (const selector of [
    ".site-header-bar",
    ".lp-assistant-card",
    ".lp-comparison",
    ".lp-solution-pill",
    ".lp-caps-row",
    ".lp-project > a",
    ".lp-faq-item",
    ".lp-process-list > li",
    ".lp-final-card",
    ".premium-footer",
    ".sp-hero",
    ".sp-service",
    ".sp-cta",
    ".contact-card",
  ]) {
    assert.ok(finalCss.includes(selector), `Missing final liquid coverage for ${selector}`);
  }
  assert.match(finalCss, /--al-blue:\s*#3478f6/i);
  assert.match(finalCss, /backdrop-filter:\s*blur\(26px\)/i);
  assert.match(finalCss, /prefers-reduced-motion:\s*reduce/);
});

test("all major CTAs use the same centre-fill liquid interaction", async () => {
  const css = await read("src/components/site/AppleLiquidSystemFinal.css");
  for (const selector of [
    ".site-consultation-cta",
    ".site-menu-cta",
    ".lp-button",
    ".lp-assistant-cta",
    ".lp-solution-cta",
    ".lp-caps-detail-cta",
    ".lp-faq-ask",
    ".sp-button",
    ".contact-submit",
    ".contact-assistant",
  ]) {
    assert.ok(css.includes(selector), `Missing CTA coverage for ${selector}`);
  }
  assert.match(css, /transform:\s*scale3d\(0\.05, 0\.24, 1\)/);
  assert.match(css, /transform 760ms var\(--al-ease\)/);
  assert.match(css, /transform:\s*scale3d\(1\.2, 1\.08, 1\)/);
});

test("liquid surface lighting follows a fine pointer and respects reduced motion", async () => {
  const layout = await read("src/components/site/Layout.tsx");
  const pointer = await read("src/components/site/LiquidSurfacePointer.tsx");
  assert.match(layout, /LiquidSurfacePointer/);
  assert.match(pointer, /\(hover: hover\) and \(pointer: fine\)/);
  assert.match(pointer, /--liquid-x/);
  assert.match(pointer, /--liquid-y/);
  assert.match(pointer, /connection\?\.saveData/);
  assert.match(pointer, /requestAnimationFrame/);
});

test("chip click feedback completes the border before the centre fill", async () => {
  const motion = await read("src/components/site/SiteMotionEnhancements.tsx");
  const css = await read("src/components/site/ProfessionalChipFinal.css");
  assert.match(motion, /is-border-tracing/);
  assert.match(motion, /lp-hero-pick, \.lp-chip/);
  assert.match(motion, /1420/);
  assert.match(css, /mask-composite:\s*exclude/);
  assert.match(css, /lp-professional-border-trace 690ms/);
  assert.match(css, /0%,[\s\S]*58%[\s\S]*background-size:\s*0% 0%/);
  assert.match(css, /lp-professional-centre-fill 1160ms/);
  assert.match(css, /lp-hero-pick-fill[\s\S]*display:\s*none !important/);
});

test("comparison switch is draggable and settles elastically", async () => {
  const layout = await read("src/components/site/Layout.tsx");
  const drag = await read("src/components/site/LiquidSegmentedDrag.tsx");
  const css = await read("src/components/site/ProfessionalChipFinal.css");
  assert.match(layout, /LiquidSegmentedDrag/);
  assert.match(drag, /setPointerCapture/);
  assert.match(drag, /--lp-segment-x/);
  assert.match(drag, /liquidSettling/);
  assert.match(css, /data-liquid-dragging/);
  assert.match(css, /cubic-bezier\(0\.16, 1\.28, 0\.3, 1\)/);
});

test("Moj Chatbot branding and direct contact are present", async () => {
  const config = await read("src/config/site.ts");
  const footer = await read("src/components/site/Footer.tsx");
  assert.match(config, /brand:\s*"Môj Chatbot"/);
  assert.match(config, /daniel@vendzur\.sk/);
  assert.match(footer, /Môj Chatbot/);
});

test("metadata, CSP and resilient latest widget loading are present", async () => {
  const root = await read("src/routes/__root.tsx");
  const loader = await read("public/widget-loader.js");
  assert.match(root, /Content-Security-Policy/);
  assert.match(root, /strict-origin-when-cross-origin/);
  assert.match(root, /widget-loader\.js/);
  assert.match(loader, /__DV_ASSISTANT_LOADER_ACTIVE__/);
  assert.match(loader, /MOUNT_TIMEOUT/);
  assert.match(loader, /showFallback/);
  assert.match(loader, /apple-liquid-controls-v1/);
  assert.match(loader, /moj-chatbot-backend\.vercel\.app/);
});

test("static export covers clean URLs and immutable build metadata", async () => {
  const exporter = await read("scripts/export-github-pages.mjs");
  assert.match(exporter, /"\/cookies"/);
  assert.match(exporter, /404\.html/);
  assert.match(exporter, /build-meta\.json/);
  assert.match(exporter, /Chatboty, ktoré/);
});

test("Pages workflow validates and verifies the live deployment", async () => {
  const workflow = await read(".github/workflows/pages.yml");
  assert.match(workflow, /Audit production dependencies/);
  assert.match(workflow, /Run source and deployment security audit/);
  assert.match(workflow, /Run UX and deployment contracts/);
  assert.match(workflow, /Verify live deployment and all public routes/);
  assert.match(workflow, /live_smoke=success/);
});
