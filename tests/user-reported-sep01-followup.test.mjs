import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("all homepage solution CTAs use builder wording", async () => {
  const finishing = await read("src/components/site/HomepageFinishingPass.tsx");

  assert.match(finishing, /Vyskladať chatbota/);
  assert.match(finishing, /Vyskladať kalkulačku/);
  assert.match(finishing, /Vyskladať konfigurátor/);
  assert.match(finishing, /Vyskladať poradcu/);
});

test("header CTA is lime at rest and black on hover", async () => {
  const layout = await read("src/components/site/Layout.tsx");
  const css = await read("src/components/site/UserFollowupSep01.css");

  assert.match(layout, /UserFollowupSep01\.css/);
  assert.match(css, /background:\s*#c8f06a !important/);
  assert.match(css, /background:\s*#0b0e0c !important/);
});

test("contact form is pulled into the first view and precedes notes on narrow screens", async () => {
  const css = await read("src/components/site/UserFollowupSep01.css");

  assert.match(css, /\.contact-page--rebrand > \.sp-hero[\s\S]*min-height:\s*0 !important/);
  assert.match(css, /\.contact-page--rebrand > \.contact-section[\s\S]*padding-top:/);
  assert.match(css, /\.contact-page--rebrand \.contact-form-wrap[\s\S]*order:\s*1/);
  assert.match(css, /\.contact-page--rebrand \.contact-editorial-aside[\s\S]*order:\s*2/);
});
