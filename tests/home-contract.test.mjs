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
  await assert.rejects(access(new URL("../src/components/site/RequestedRuntimePolish.tsx", import.meta.url)));
});

test("black-blue palette is followed by the recovered interaction layer", async () => {
  const layout = await read("src/components/site/Layout.tsx");
  const finalCss = await read("src/components/site/BlackBlueFinal.css");
  const recoveredCss = await read("src/components/site/RecoveredMotionFinal.css");
  assert.ok(layout.indexOf('import "./CompetitionRoutes.css"') < layout.indexOf('import "./BlackBlueFinal.css"'));
  assert.ok(layout.indexOf('import "./BlackBlueFinal.css"') < layout.indexOf('import "./RecoveredMotionFinal.css"'));
  assert.equal(layout.lastIndexOf('import "./'), layout.indexOf('import "./RecoveredMotionFinal.css"'));
  assert.match(finalCss, /--primary:\s*#3478f6/i);
  assert.match(finalCss, /--background:\s*#050609/i);
  assert.match(recoveredCss, /@keyframes recovered-border-trace/);
  assert.match(recoveredCss, /prefers-reduced-motion:\s*reduce/);
});

test("homepage and route surfaces remain covered", async () => {
  const systemCss = await read("src/components/site/CompetitionSystem.css");
  const routeCss = await read("src/components/site/CompetitionRoutes.css");
  for (const selector of [".site-header-bar", ".lp-hero", ".lp-assistant-card", ".lp-solution-pill", ".lp-chip", ".premium-footer"]) {
    assert.ok(systemCss.includes(selector), `Missing homepage style for ${selector}`);
  }
  for (const selector of [".sp-hero", ".sp-service", ".contact-page", ".cookies-page"]) {
    assert.ok(routeCss.includes(selector), `Missing route style for ${selector}`);
  }
});

test("premium pointer depth is bounded and touch-safe", async () => {
  const landing = await read("src/components/site/PremiumLanding.tsx");
  const motion = await read("src/components/site/SiteMotionEnhancements.tsx");
  assert.match(landing, /onPointerMove/);
  assert.match(landing, /event\.pointerType === "touch"/);
  assert.match(landing, /--tilt-x/);
  assert.match(motion, /perspective\(1100px\)/);
  assert.match(motion, /finePointer/);
});

test("click feedback traces only the selected border", async () => {
  const motion = await read("src/components/site/SiteMotionEnhancements.tsx");
  const css = await read("src/components/site/RecoveredMotionFinal.css");
  assert.match(motion, /is-border-tracing/);
  assert.match(motion, /lp-hero-pick, \.lp-chip/);
  assert.match(css, /mask-composite:\s*exclude/);
  assert.match(css, /animation:\s*recovered-border-trace/);
  assert.match(css, /site-consultation-cta[\s\S]*animation:\s*none !important/);
});

test("Moj Chatbot branding and direct contact are present", async () => {
  const config = await read("src/config/site.ts");
  const footer = await read("src/components/site/Footer.tsx");
  const css = await read("src/components/site/RecoveredMotionFinal.css");
  assert.match(config, /brand:\s*"Môj Chatbot"/);
  assert.match(config, /daniel@vendzur\.sk/);
  assert.match(footer, /Môj Chatbot/);
  assert.match(css, /content:\s*"Môj Chatbot"/);
});

test("metadata, CSP and resilient local widget loading are present", async () => {
  const root = await read("src/routes/__root.tsx");
  const loader = await read("public/widget-loader.js");
  assert.match(root, /Content-Security-Policy/);
  assert.match(root, /strict-origin-when-cross-origin/);
  assert.match(root, /widget-loader\.js/);
  assert.match(loader, /__DV_ASSISTANT_LOADER_ACTIVE__/);
  assert.match(loader, /MOUNT_TIMEOUT/);
  assert.match(loader, /showFallback/);
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
