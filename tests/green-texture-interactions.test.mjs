import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");
const forbiddenWarm =
  /#ffe38a|#ffd75d|#ffc79d|#f0a873|#f3a75a|#e58a5b|#f4c9a8|#df8840|255\s*,\s*227\s*,\s*138|223\s*,\s*136\s*,\s*64/i;

test("the final layer removes warm accents and restores tactile interaction", async () => {
  const layout = await read("src/components/site/Layout.tsx");
  const css = await read("src/components/site/GreenTextureInteractionsFinal.css");

  assert.match(layout, /GreenTextureInteractionsFinal\.css/);
  assert.ok(
    layout.indexOf('import "./LimeWhiteBrandFinal.css"') <
      layout.indexOf('import "@\/components\/site\/GreenTextureInteractionsFinal.css"'),
  );

  assert.match(css, /--primary-hover: #126d41 !important/);
  assert.match(css, /html body::after[\s\S]*fractalNoise/);
  assert.match(css, /green-paper-breathe/);
  assert.match(css, /\.lp-sweep-action[\s\S]*background: var\(--green-lock-lime\)/);
  assert.match(css, /\.lp-sweep-action[\s\S]*::before/);
  assert.match(css, /:active[\s\S]*scale\(0\.965\)/);
  assert.match(css, /data-selected="true"[\s\S]*green-selection-pop/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
  assert.doesNotMatch(css, forbiddenWarm);
});
