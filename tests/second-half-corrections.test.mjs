import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("visual QA corrections prevent the mobile story gap and empty featured card", async () => {
  const layout = await read("src/components/site/Layout.tsx");
  const css = await read("src/components/site/SecondHalfCorrectionsFinal.css");

  assert.match(layout, /SecondHalfCorrectionsFinal\.css/);
  assert.ok(
    layout.indexOf('import "./SecondHalfPremiumFinal.css"') <
      layout.indexOf('import "./SecondHalfCorrectionsFinal.css"'),
  );
  assert.match(css, /\.lp-project:nth-child\(1\) > a[\s\S]*grid-template-columns/);
  assert.match(
    css,
    /\.lp-project:nth-child\(1\) \.lp-project-media[\s\S]*min-height: 39rem/,
  );
  assert.match(
    css,
    /@media \(max-width: 899px\)[\s\S]*\.derat-story__desktop[\s\S]*display: none !important/,
  );
  assert.match(css, /\.lp-caps-count > i[\s\S]*display: none !important/);
});
