import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");
const forbiddenWarm =
  /#ffc79d|#f0a873|#f3a75a|#e58a5b|#f4c9a8|#ffe38a|255\s*,\s*199\s*,\s*157|240\s*,\s*168\s*,\s*115/i;
const outerPath =
  "M92.9 81.1C97.4 80.8 100.6 78.6 100.6 75.6V12.6" +
  "C100.6 7.9 96.4 5.3 93 7.6L59.9 36.7" +
  "C58 38.5 55 38.5 53.1 36.7L20 7.6" +
  "C16.6 5.3 12.4 7.9 12.4 12.6V76.1" +
  "C12.4 78.9 14.7 81.1 17.5 81.1H31.7L33.5 104.5L57.5 81.1H80.9" +
  "C82.9 81.1 84.6 79.5 84.6 77.5V32.9";
const innerPath = "M28.6 65.1V32.9L53.4 57.5C55.1 59.2 57.9 59.2 59.6 57.5L84.6 32.9";
const escape = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

test("the public brand uses the supplied one-stroke mark and Google favicon stays approved", async () => {
  const component = await read("src/components/BrandMark.tsx");
  const exported = await read("public/brand/logo.svg");
  const favicon = await read("public/favicon.svg");

  assert.equal((component.match(/<path\b/g) ?? []).length, 2);
  assert.match(component, /className="brand-mark__stroke"/);
  assert.match(component, /pathLength=\{1\}/);
  assert.match(component, /strokeWidth="6\.25"/);
  assert.match(component, /d="M0 0"[\s\S]*stroke="none"[\s\S]*style=\{\{ display: "none" \}\}/);
  assert.match(component, /M24 71\.2L24\.003 32\.706/);
  assert.match(component, /L96\.6 85\.5/);

  assert.equal((exported.match(/<path\b/g) ?? []).length, 2);
  assert.match(exported, new RegExp(escape(outerPath)));
  assert.match(exported, new RegExp(escape(innerPath)));
  assert.match(exported, /stroke-width="7"/);
  assert.match(exported, /<rect[^>]*fill="#FFFFFF"/i);
  assert.equal((exported.match(/stroke="#19834F"/g) ?? []).length, 2);

  assert.equal((favicon.match(/<path\b/g) ?? []).length, 2);
  assert.match(favicon, new RegExp(escape(outerPath)));
  assert.match(favicon, new RegExp(escape(innerPath)));
  assert.match(
    favicon,
    /<rect[^>]*x="3"[^>]*y="3"[^>]*width="106"[^>]*height="106"[^>]*rx="29"[^>]*fill="#FFFFFF"/i,
  );
  assert.equal((favicon.match(/stroke="#19834F"/g) ?? []).length, 2);
  assert.match(favicon, /stroke-width="7"/i);
  assert.doesNotMatch(favicon, /#B9ED4D|<animate|stroke-dashoffset/i);
  assert.doesNotMatch(favicon, /<rect[^>]*fill="#0b2f20"/i);
});

test("the approved option 1 layer fixes contrast and removes warm legacy states", async () => {
  const layout = await read("src/components/site/Layout.tsx");
  const css = await read("src/components/site/ApprovedOptionOneFinal.css");

  assert.match(layout, /ApprovedOptionOneFinal\.css/);
  assert.ok(
    layout.indexOf('import "./WhiteGreenIdentityLock.css"') <
      layout.indexOf('import "./ApprovedOptionOneFinal.css"'),
  );
  assert.match(css, /--approved-lime: #b9ed4d/);
  assert.match(css, /--approved-green: #19834f/);
  assert.match(css, /--approved-forest: #0b2f20/);
  assert.match(css, /\.lp-comparison-body/);
  assert.match(css, /\.brand-mark[\s\S]*color 520ms/);
  assert.match(css, /\.site-brand-lockup[\s\S]*color: #19834f !important/);
  assert.doesNotMatch(css, forbiddenWarm);
});

test("the final harmony restores the premium motion instead of flattening it", async () => {
  const layout = await read("src/components/site/Layout.tsx");
  const css = await read("src/components/site/ProfessionalHarmonyFinal.css");
  const spotlight = await read("src/hooks/useSpotlight.ts");
  const mobile = await read("src/components/site/MobileMotionRestoreFinal.css");
  const solid = await read("src/components/site/SolidWidgetLogoFinal.css");

  assert.match(layout, /ProfessionalHarmonyFinal\.css/);
  assert.match(layout, /FinalSmoothTexturePolish\.css/);
  assert.match(layout, /WidgetSwipeMotionFinal\.css/);
  assert.match(layout, /LaunchReadyFinal\.css/);
  assert.match(layout, /MobileMotionRestoreFinal\.css/);
  assert.match(layout, /SolidWidgetLogoFinal\.css/);
  assert.ok(
    layout.indexOf('import "./ApprovedOptionOneFinal.css"') <
      layout.indexOf('import "./ProfessionalHarmonyFinal.css"'),
  );
  assert.match(css, /--h-white: #ffffff/);
  assert.match(css, /--h-lime: #d9ff78/);
  assert.match(css, /--h-green-hover: #126d41/);
  assert.match(css, /\.lp-hero-glide[\s\S]*display: block !important/);
  assert.match(css, /\.lp-hero-glow[\s\S]*animation: h-glow-drift/);
  assert.match(css, /\.lp-assistant-card[\s\S]*animation: h-card-float/);
  assert.match(css, /@keyframes h-card-float/);
  assert.match(css, /\.lp-hero-cta--primary, \.lp-assistant-cta[\s\S]*background: var\(--h-lime\)/);
  assert.match(css, /\.derat-story__copy-step[\s\S]*58svh/);
  assert.match(mobile, /mobile-surface-reveal/);
  assert.match(mobile, /mobile-hero-stage-arrive/);
  assert.match(solid, /mc-logo-handdraw-hover/);
  assert.match(solid, /background: #ffffff !important/);
  assert.match(solid, /border-color: #19834f !important/);
  assert.doesNotMatch(css, forbiddenWarm);

  for (const selector of [
    ".lp-assistant-card",
    ".lp-hero-pick",
    ".lp-project > a",
    ".lp-comparison-body",
  ]) {
    assert.match(layout, new RegExp(escape(selector)));
  }
  assert.match(spotlight, /requestAnimationFrame/);
  assert.match(spotlight, /prefers-reduced-motion: reduce/);
});

test("the emergency widget fallback uses option 1 and a gradual green hover", async () => {
  const loader = await read("public/widget-loader.js");

  assert.match(loader, new RegExp(escape(outerPath)));
  assert.match(loader, new RegExp(escape(innerPath)));
  assert.match(loader, /color: "#b9ed4d"/);
  assert.match(loader, /icon\.style\.color = "#19834f"/);
  assert.match(loader, /transition: "color 520ms/);
  assert.match(loader, /background: "#ffffff"/);
  assert.doesNotMatch(loader, forbiddenWarm);
  assert.doesNotMatch(loader, /sparkle|M12 3\.2/);
});
