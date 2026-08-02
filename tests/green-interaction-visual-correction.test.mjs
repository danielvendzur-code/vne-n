import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("the visual correction keeps hover contrast and visible paper grain", async () => {
  const layout = await read("src/components/site/Layout.tsx");
  const css = await read("src/components/site/GreenInteractionVisualCorrection.css");

  assert.match(layout, /GreenInteractionVisualCorrection\.css/);
  assert.ok(
    layout.indexOf("GreenTextureInteractionsFinal.css") <
      layout.indexOf("GreenInteractionVisualCorrection.css"),
  );
  assert.match(css, /html:root body::after[\s\S]*opacity: 0\.105 !important/);
  assert.match(css, /repeating-linear-gradient/);
  assert.match(css, /\.lp-hero-cta--primary:is\(:hover, :focus-visible\)/);
  assert.match(css, /background: #126d41 !important/);
  assert.match(css, /-webkit-text-fill-color: #ffffff !important/);
  assert.match(css, /:active[\s\S]*scale\(0\.965\)/);
});
