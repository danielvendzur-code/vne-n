import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

const forbiddenWarm =
  /#ffc79d|#f0a873|#f3a75a|#e58a5b|#f4c9a8|#ffe38a|255\s*,\s*199\s*,\s*157|240\s*,\s*168\s*,\s*115/i;

test("the second half uses the premium editorial composition", async () => {
  const layout = await read("src/components/site/Layout.tsx");
  const css = await read("src/components/site/SecondHalfPremiumFinal.css");

  assert.match(layout, /SecondHalfPremiumFinal\.css/);
  assert.ok(
    layout.indexOf('import "./HeroMotionSafety.css"') <
      layout.indexOf('import "./SecondHalfPremiumFinal.css"'),
  );
  assert.ok(
    layout.indexOf('import "./SecondHalfPremiumFinal.css"') <
      layout.indexOf('import "./LimeWhiteBrandFinal.css"'),
  );

  assert.match(css, /--sh-lime: #d9ff78/);
  assert.match(css, /--sh-green-dark: #126d41/);
  assert.match(css, /\.derat-story__copy-step[\s\S]*43svh/);
  assert.match(css, /\.lp-value > \.container-page[\s\S]*grid-template-columns/);
  assert.match(css, /\.lp-project:nth-child\(1\)[\s\S]*grid-column: span 7/);
  assert.match(css, /\.lp-caps-row-head[\s\S]*grid-template-columns: 4\.5rem/);
  assert.match(css, /\.lp-final-card[\s\S]*background:[\s\S]*var\(--sh-lime\)/);
  assert.match(css, /@media \(max-width: 640px\)/);
  assert.doesNotMatch(css, forbiddenWarm);
});
