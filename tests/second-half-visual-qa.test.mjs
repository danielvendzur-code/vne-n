import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

const forbiddenWarm =
  /#ffc79d|#f0a873|#f3a75a|#e58a5b|#f4c9a8|#ffe38a|255\s*,\s*199\s*,\s*157|240\s*,\s*168\s*,\s*115/i;

test("the final visual-QA layer removes clipping and legacy warm states", async () => {
  const layout = await read("src/components/site/Layout.tsx");
  const css = await read("src/components/site/SecondHalfVisualQAFinal.css");

  assert.match(layout, /SecondHalfVisualQAFinal\.css/);
  assert.ok(
    layout.indexOf('import "./SecondHalfCorrectionsFinal.css"') <
      layout.indexOf('import "./SecondHalfVisualQAFinal.css"'),
  );
  assert.ok(
    layout.indexOf('import "./SecondHalfVisualQAFinal.css"') <
      layout.indexOf('import "./LimeWhiteBrandFinal.css"'),
  );

  assert.match(
    css,
    /\.lp-project:nth-child\(1\) \.lp-project-copy[\s\S]*display: flex !important/,
  );
  assert.match(
    css,
    /\.lp-project:nth-child\(1\) \.lp-project-copy h3[\s\S]*max-width: none !important/,
  );
  assert.match(
    css,
    /\.lp-caps-row-head \.lp-caps-count[\s\S]*grid-column: 3 !important/,
  );
  assert.match(
    css,
    /\.lp-comparison-body li svg[\s\S]*background: transparent !important/,
  );
  assert.match(
    css,
    /\.lp-tl-steps li\[data-reached="true"\] \.lp-tl-node[\s\S]*background: var\(--sh-lime\) !important/,
  );
  assert.match(css, /\.lp-final-card h2[\s\S]*color: var\(--sh-forest\) !important/);
  assert.doesNotMatch(css, forbiddenWarm);
});
