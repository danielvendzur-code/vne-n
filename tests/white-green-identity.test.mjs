import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");
const forbiddenWarm =
  /#ffc79d|#f0a873|#f3a75a|#e58a5b|#f4c9a8|#ffe38a|255\s*,\s*199\s*,\s*157|240\s*,\s*168\s*,\s*115/i;
// Kresba podľa originálu loga. Predošlá verzia mala vonkajší ťah otvorený:
// začínal pahýľom pri pravom dolnom rohu a končil zvislicou vybiehajúcou
// z dolnej hrany, takže vpravo bola dvojitá čiara a vnútorné M malo len
// ľavé rameno. Teraz je bublina zavretá a vnútorné M má obe ramená.
const outerPath =
  "M8.5 12.4C8.5 7.2 14.5 4.5 18.3 6.4L52.5 34.5" +
  "C54.1 36.1 57.9 36.1 59.5 34.5L95.4 6.4" +
  "C99.2 4.5 103.6 7.2 103.6 12.4V79.9" +
  "C103.6 82.6 101.4 84.8 98.7 84.8H52.9L30.5 105.5L30.2 84.8H13.4" +
  "C10.7 84.8 8.5 82.6 8.5 79.9Z";
const innerPath = "M24 71.2V29.2L52.5 55.4C54.1 57 57.9 57 59.5 55.4L88 29.2V71.2";
const escape = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

test("the public brand uses the approved option 1 geometry", async () => {
  const component = await read("src/components/BrandMark.tsx");
  const exported = await read("public/brand/logo.svg");
  const favicon = await read("public/favicon.svg");

  // Dlhá cesta je v zdroji rozdelená na viac reťazcov, aby sa riadky
  // zmestili — pred porovnaním sa spoje zlepia späť.
  const joined = component.replace(/"\s*\+\s*\n?\s*"/g, "");
  assert.match(joined, new RegExp(escape(outerPath)));
  assert.match(joined, new RegExp(escape(innerPath)));
  assert.equal((component.match(/<path\b/g) ?? []).length, 2);
  // Ťah 7,2 zodpovedá hrúbke originálu v prepočte na túto šírku bubliny.
  assert.match(component, /strokeWidth="7\.2"/);

  for (const asset of [exported, favicon]) {
    assert.equal((asset.match(/<path\b/g) ?? []).length, 2);
    assert.match(asset, new RegExp(escape(outerPath)));
    assert.match(asset, new RegExp(escape(innerPath)));
    assert.match(asset, /stroke="#B9ED4D"/);
    assert.match(asset, /stroke-width="7\.2"/);
  }

  // Favicon navyše sedí na tmavej lesnej dlaždici. Samotný limetkový ťah
  // sa na svetlom paneli prehliadača stráca, pri 16 px úplne.
  assert.match(favicon, /<rect[^>]*fill="#0b2f20"/);
  assert.doesNotMatch(exported, /<rect\b/);
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

  assert.match(layout, /ProfessionalHarmonyFinal\.css/);
  assert.ok(
    layout.indexOf('import "./ApprovedOptionOneFinal.css"') <
      layout.indexOf('import "./ProfessionalHarmonyFinal.css"'),
  );
  assert.ok(
    layout.indexOf('import "./ProfessionalHarmonyFinal.css"') <
      layout.indexOf('import "./LimeWhiteBrandFinal.css"'),
  );

  assert.match(css, /--h-white: #ffffff/);
  assert.match(css, /--h-lime: #d9ff78/);
  assert.match(css, /--h-green-hover: #126d41/);
  assert.match(css, /\.lp-hero-glide[\s\S]*display: block !important/);
  assert.match(css, /\.lp-hero-glow[\s\S]*animation: h-glow-drift/);
  assert.match(css, /\.lp-assistant-card[\s\S]*animation: h-card-float/);
  assert.match(css, /@keyframes h-card-float/);
  assert.match(css, /\.lp-hero-cta--primary, \.lp-assistant-cta[\s\S]*background: var\(--h-lime\)/);
  assert.match(css, /\.lp-project > a[\s\S]*rotateX\(var\(--tilt-x/);
  assert.match(css, /\.derat-story__copy-step[\s\S]*58svh/);
  assert.doesNotMatch(css, forbiddenWarm);

  for (const selector of [".lp-assistant-card", ".lp-project > a", ".lp-comparison-body"]) {
    assert.match(layout, new RegExp(escape(selector)));
  }
  assert.match(spotlight, /--tilt-x/);
  assert.match(spotlight, /--tilt-y/);
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
