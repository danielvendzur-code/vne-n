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
  assert.match(landing, /Čo má váš chatbot zvládnuť\?/);
  assert.match(landing, /Bez chatbota/);
  assert.match(landing, /S chatbotom/);
  assert.doesNotMatch(landing, /Webové nástroje, ktoré odovzdajú hotový dopyt/);
  assert.doesNotMatch(motion, /refineHomepageCopy|replaceText/);
  assert.doesNotMatch(layout, /RequestedRuntimePolish/);
  await assert.rejects(
    access(new URL("../src/components/site/RequestedRuntimePolish.tsx", import.meta.url)),
  );
});

test("final design system is imported last and removes bronze from the authoritative layer", async () => {
  const layout = await read("src/components/site/Layout.tsx");
  const css = await read("src/components/site/CompetitionSystem.css");
  assert.match(layout, /CompetitionSystem\.css/);
  assert.equal(layout.lastIndexOf('import "./'), layout.indexOf('import "./CompetitionSystem.css"'));
  assert.match(css, /--primary:\s*#65e6c1/i);
  assert.match(css, /--primary-hover:\s*#83f1d0/i);
  assert.match(css, /--accent:\s*#72c7ff/i);
  assert.match(css, /--highlight:\s*#8aa7ff/i);
  assert.doesNotMatch(css, /#c9aa70|#c47c5e|#bc7352/i);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
  assert.match(css, /focus-visible/);
});

test("all major homepage surfaces are covered by the final design layer", async () => {
  const css = await read("src/components/site/CompetitionSystem.css");
  for (const selector of [
    ".site-header-bar",
    ".site-menu-drawer",
    ".lp-hero",
    ".lp-assistant-card",
    ".lp-assistant-chips",
    ".lp-comparison",
    ".lp-solution-pill",
    ".lp-caps-row",
    ".lp-chip",
    ".lp-portfolio",
    ".lp-project > a",
    ".lp-faq-item",
    ".lp-final-card",
    ".premium-footer",
  ]) {
    assert.ok(css.includes(selector), `Missing final style for ${selector}`);
  }
});

test("three solution cards are complete and use bounded pointer interaction", async () => {
  const landing = await read("src/components/site/PremiumLanding.tsx");
  const css = await read("src/components/site/CompetitionSystem.css");
  assert.match(landing, /Chatbot na mieru/);
  assert.match(landing, /Chatbot s kalkulačkou/);
  assert.match(landing, /Chatbot s konfigurátorom/);
  assert.match(landing, /Navrhnúť tento chatbot/);
  assert.match(landing, /onPointerMove/);
  assert.match(landing, /event\.pointerType === "touch"/);
  assert.match(landing, /--tilt-x/);
  assert.match(css, /rotateX\(var\(--tilt-x\)\)/);
});

test("navigation has visible brand copy and no side-slide drawer animation", async () => {
  const nav = await read("src/components/site/Nav.tsx");
  assert.match(nav, /site-brand-copy/);
  assert.match(nav, /chatboty na mieru/);
  assert.match(nav, /Chatboty a riešenia/);
  assert.match(nav, /opacity: open \? 1 : 0/);
  assert.doesNotMatch(nav, /animate=\{\{ x:/);
});

test("metadata, CSP and resilient local widget loading are present", async () => {
  const root = await read("src/routes/__root.tsx");
  const loader = await read("public/widget-loader.js");
  assert.match(root, /Content-Security-Policy/);
  assert.match(root, /strict-origin-when-cross-origin/);
  assert.match(root, /widget-loader\.js/);
  assert.doesNotMatch(
    root,
    /<script src="https:\/\/danielvendzur-code\.github\.io\/moj\.chatbot\.backend\/widget\.js"/,
  );
  assert.match(loader, /__DV_ASSISTANT_LOADER_ACTIVE__/);
  assert.match(loader, /MOUNT_TIMEOUT/);
  assert.match(loader, /showFallback/);
  assert.match(loader, /moj-chatbot-backend\.vercel\.app/);
});

test("static export covers cookies, clean URLs, SPA fallback and immutable build metadata", async () => {
  const exporter = await read("scripts/export-github-pages.mjs");
  assert.match(exporter, /"\/cookies"/);
  assert.match(exporter, /404\.html/);
  assert.match(exporter, /build-meta\.json/);
  assert.match(exporter, /extensionTarget/);
  assert.match(exporter, /Chatboty, ktoré/);
  assert.match(exporter, /obsolete hero copy/);
});

test("Pages workflow validates artifacts and the real live deployment", async () => {
  const workflow = await read(".github/workflows/pages.yml");
  assert.match(workflow, /Lint source/);
  assert.match(workflow, /Run UX and deployment contracts/);
  assert.match(workflow, /Validate exported artifact/);
  assert.match(workflow, /Verify live deployment and all public routes/);
  assert.match(workflow, /\/cookies\//);
  assert.match(workflow, /\/widget-loader\.js/);
  assert.match(workflow, /\/build-meta\.json/);
  assert.match(workflow, /live_smoke=success/);
});

test("site metadata presents Daniel Vendžúr as a chatbot specialist", async () => {
  const config = await read("src/config/site.ts");
  assert.match(config, /Daniel Vendžúr — chatboty na mieru/);
  assert.match(config, /chatboty s kalkulačkou, konfigurátorom a rezerváciami/);
  assert.doesNotMatch(config, /weby a digitálne nástroje na mieru/);
});
