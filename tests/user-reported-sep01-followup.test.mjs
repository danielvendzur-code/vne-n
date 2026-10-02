import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("homepage solution CTAs describe the example or requested tool", async () => {
  const landing = await read("src/components/site/StudioHome.tsx");

  assert.match(landing, /Chcem chatbota/);
  assert.match(landing, /Chcem kalkulačku/);
  assert.match(landing, /Pozrieť ukážku/);
  assert.match(landing, /Chcem poradcu/);
  // The wording is data on the button, not text patched in after render.
  assert.doesNotMatch(landing, /MutationObserver/);
});

test("header CTA is lime at rest with a consistent darker lime hover", async () => {
  const layout = await read("src/components/site/Layout.tsx");
  const css = await read("src/components/site/SiteVisualAuthority.css");

  assert.match(layout, /SiteVisualAuthority\.css/);
  assert.doesNotMatch(layout, /UserFollowupSep01\.css/);
  assert.match(css, /background:\s*#c8f06a !important/);
  assert.match(css, /background:\s*#b9e354 !important/);
});

test("contact uses the unified card form without hairline separators", async () => {
  const css = await read("src/components/site/SiteVisualAuthority.css");
  const contact = await read("src/routes/kontakt.tsx");

  assert.match(css, /\.contact-page--rebrand > \.sp-hero[\s\S]*order:\s*1 !important/);
  assert.match(css, /\.contact-page--rebrand > \.contact-section[\s\S]*order:\s*2 !important/);
  assert.match(css, /\.contact-page--rebrand \.contact-form-wrap[\s\S]*border:\s*0 !important/);
  assert.match(
    css,
    /\.contact-page--rebrand \.contact-form :is\(input, textarea, select\)[\s\S]*border:\s*1px solid/,
  );
  assert.match(
    css,
    /\.contact-page--rebrand \.contact-editorial-aside li[\s\S]*border:\s*0 !important/,
  );
  assert.match(contact, /className="contact-demo-summary"/);
  assert.doesNotMatch(contact, /<p className="section-kicker">CONTACT<\/p>/);
});
