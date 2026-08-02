import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");
const forbiddenWarm =
  /#ffc79d|#f0a873|#f3a75a|#e58a5b|#f4c9a8|255\s*,\s*199\s*,\s*157|240\s*,\s*168\s*,\s*115/i;
const singleLinePath =
  "M69 103L69 88H82C93 88 101 80 101 69V23C101 14 91 10 84 17L64 37C59 42 53 42 48 37L28 17C21 10 11 14 11 23V69C11 80 19 88 30 88H54L69 103Z";

test("the public brand uses one continuous M and speech-bubble stroke", async () => {
  const component = await read("src/components/BrandMark.tsx");
  const exported = await read("public/brand/logo.svg");
  const favicon = await read("public/favicon.svg");

  assert.match(component, new RegExp(singleLinePath.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.equal((component.match(/<path\b/g) ?? []).length, 1);
  assert.doesNotMatch(component, /<g\b/);
  assert.match(component, /strokeWidth="8\.5"/);

  for (const asset of [exported, favicon]) {
    assert.equal((asset.match(/<path\b/g) ?? []).length, 1);
    assert.match(asset, /stroke="#B9ED4D"/);
    assert.match(asset, /stroke-width="8\.5"/);
    assert.doesNotMatch(asset, /<g\b/);
  }
});

test("the scoped final identity wins over legacy peach selectors", async () => {
  const layout = await read("src/components/site/Layout.tsx");
  const css = await read("src/components/site/WhiteGreenIdentityLock.css");

  assert.match(layout, /site-theme-white-green/);
  assert.match(layout, /WhiteGreenIdentityLock\.css/);
  assert.ok(
    layout.indexOf('import "./WhiteGreenIdentityLock.css"') <
      layout.indexOf('import "./LimeWhiteBrandFinal.css"'),
  );
  assert.match(css, /html:root body \.site-theme-white-green/);
  assert.match(css, /--brand-primary: #b9ed4d/);
  assert.match(css, /--brand-accent: #19834f/);
  assert.match(css, /--brand-bg: #ffffff/);
  assert.match(css, /\.lp-hero-pick/);
  assert.match(css, /\.site-header-bar/);
  assert.match(css, /\.premium-footer/);
  assert.doesNotMatch(css, forbiddenWarm);
});

test("the emergency widget fallback cannot reintroduce the old orange brand", async () => {
  const loader = await read("public/widget-loader.js");

  assert.match(loader, new RegExp(singleLinePath.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.match(loader, /color: "#b9ed4d"/);
  assert.match(loader, /background: "#ffffff"/);
  assert.match(loader, /color: "#0b2f20"/);
  assert.doesNotMatch(loader, forbiddenWarm);
  assert.doesNotMatch(loader, /sparkle|M12 3\.2/);
});
