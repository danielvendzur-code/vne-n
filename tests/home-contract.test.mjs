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

test("the restrained correction layer loads last", async () => {
  const layout = await read("src/components/site/Layout.tsx");
  const finalCss = await read("src/components/site/WebsiteRefinementFinal.css");
  assert.ok(
    layout.indexOf('import "./AppleLiquidSystemFinal.css"') <
      layout.indexOf('import "./WebsiteRefinementFinal.css"'),
  );
  assert.equal(
    layout.lastIndexOf('import "./'),
    layout.indexOf('import "./WebsiteRefinementFinal.css"'),
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
    assert.ok(finalCss.includes(selector), `Missing final restrained coverage for ${selector}`);
  }
  assert.match(finalCss, /--wr-blue:\s*#4e8cff/i);
  assert.match(finalCss, /backdrop-filter:\s*none/i);
  assert.match(finalCss, /@media \(max-width:\s*720px\)/);
  assert.match(finalCss, /prefers-reduced-motion:\s*reduce/);
});

test("ordinary controls no longer use liquid centre fills", async () => {
  const css = await read("src/components/site/WebsiteRefinementFinal.css");
  for (const selector of [
    ".site-consultation-cta",
    ".site-menu-cta",
    ".lp-button",
    ".lp-assistant-cta",
    ".lp-caps-detail-cta",
    ".lp-faq-ask",
    ".sp-button",
    ".contact-submit",
    ".contact-assistant",
  ]) {
    assert.ok(css.includes(selector), `Missing matte CTA coverage for ${selector}`);
  }
  assert.match(css, /background:\s*#101722 !important/);
  assert.match(css, /content:\s*none !important/);
  assert.doesNotMatch(css, /scale3d\(1\.2, 1\.08, 1\)/);
});

test("flashlight follows a fine pointer only on solution CTAs", async () => {
  const layout = await read("src/components/site/Layout.tsx");
  const pointer = await read("src/components/site/LiquidSurfacePointer.tsx");
  const css = await read("src/components/site/WebsiteRefinementFinal.css");
  assert.match(layout, /LiquidSurfacePointer/);
  assert.match(pointer, /const surfaceSelector = "\.lp-solution-cta"/);
  assert.match(pointer, /\(hover: hover\) and \(pointer: fine\)/);
  assert.match(pointer, /--liquid-x/);
  assert.match(pointer, /--liquid-y/);
  assert.match(pointer, /connection\?\.saveData/);
  assert.match(pointer, /requestAnimationFrame/);
  assert.match(css, /\.lp-solution-cta\[data-liquid-pointer="true"\]::before/);
  assert.match(css, /circle at var\(--liquid-x\) var\(--liquid-y\)/);
});

test("hero and capability chips have stable matte selection states", async () => {
  const motion = await read("src/components/site/SiteMotionEnhancements.tsx");
  const css = await read("src/components/site/WebsiteRefinementFinal.css");
  assert.doesNotMatch(motion, /is-border-tracing/);
  assert.doesNotMatch(motion, /\.lp-hero-pick, \.lp-chip/);
  assert.doesNotMatch(motion, /rotateX|rotateY/);
  assert.match(css, /\.lp-hero-pick-fill,[\s\S]*\.lp-chip-fill[\s\S]*display:\s*none !important/);
  assert.match(css, /\.lp-hero-pick\[data-active="true"\],[\s\S]*\.lp-chip\[data-active="true"\]/);
  assert.match(css, /box-shadow:\s*inset 3px 0 0 var\(--wr-blue\)/);
  assert.match(css, /transform:\s*none !important/);
});

test("comparison switch remains draggable and liquid", async () => {
  const layout = await read("src/components/site/Layout.tsx");
  const drag = await read("src/components/site/LiquidSegmentedDrag.tsx");
  const liquidCss = await read("src/components/site/ProfessionalChipFinal.css");
  const refinementCss = await read("src/components/site/WebsiteRefinementFinal.css");
  assert.match(layout, /LiquidSegmentedDrag/);
  assert.match(drag, /setPointerCapture/);
  assert.match(drag, /--lp-segment-x/);
  assert.match(drag, /liquidSettling/);
  assert.match(liquidCss, /data-liquid-dragging/);
  assert.match(liquidCss, /cubic-bezier\(0\.16, 1\.28, 0\.3, 1\)/);
  assert.match(refinementCss, /Intentionally not reset/);
});

test("capability details and mobile layout stay ordered", async () => {
  const css = await read("src/components/site/WebsiteRefinementFinal.css");
  assert.match(css, /\.lp-caps-detail-inner[\s\S]*background:\s*#090f18 !important/);
  assert.match(css, /\.lp-caps-detail-cta[\s\S]*background:\s*#101722 !important/);
  assert.match(css, /\.lp-caps-chips[\s\S]*grid-template-columns:\s*1fr !important/);
  assert.match(css, /\.lp-caps-detail-inner[\s\S]*grid-template-columns:\s*1fr !important/);
  assert.match(css, /\.lp-hero-picker[\s\S]*grid-template-columns:\s*1fr !important/);
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
  assert.match(loader, /complete-liquid-system-v1/);
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
