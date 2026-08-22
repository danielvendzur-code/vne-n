import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");
const path = "M10 47V17L32 35L54 17V47H40L32 55V47H19";

test("brand mark is one compact production path shared by site and favicon", async () => {
  const component = await read("src/components/BrandMark.tsx");
  const logo = await read("public/brand/logo.svg");
  const favicon = await read("public/favicon.svg");

  assert.equal((component.match(/<path\b/g) ?? []).length, 1);
  assert.match(component, new RegExp(path));
  assert.match(component, /strokeWidth="4\.6"/);
  assert.match(component, /strokeLinecap="round"/);
  assert.match(component, /strokeLinejoin="round"/);

  assert.equal((logo.match(/<path\b/g) ?? []).length, 1);
  assert.match(logo, new RegExp(path));
  assert.match(logo, /stroke="#12372D"/);

  assert.equal((favicon.match(/<path\b/g) ?? []).length, 1);
  assert.match(favicon, new RegExp(path));
  assert.match(favicon, /fill="#12372D"/);
  assert.match(favicon, /stroke="#F5F4ED"/);
});

test("design tokens use restrained paper, ink and one forest brand colour", async () => {
  const css = await read("src/components/site/Rebrand.css");

  assert.match(css, /--paper:\s*#f2f0e8/);
  assert.match(css, /--pure:\s*#fcfbf7/);
  assert.match(css, /--ink:\s*#111310/);
  assert.match(css, /--forest:\s*#12372d/);
  assert.match(css, /--sage:\s*#a9b7ae/);
  assert.match(css, /--radius-widget:\s*10px/);
  assert.match(css, /--font-display:\s*"Inter Tight"/);
  assert.match(css, /--font-sans:\s*"Inter Tight"/);
  assert.match(css, /--font-mono:\s*"SFMono-Regular"/);
  assert.doesNotMatch(css, /fonts\.googleapis\.com|@import\s+url\(/i);

  for (const forbidden of ["#e58a5b", "#7c3aed", "#8b5cf6", "aurora", "glassmorphism"]) {
    assert.doesNotMatch(css, new RegExp(forbidden, "i"));
  }
});

test("marketing surfaces stay low-radius and shadow-light", async () => {
  const css = await read("src/components/site/Rebrand.css");

  assert.match(css, /--radius-xs:\s*2px/);
  assert.match(css, /--radius-sm:\s*4px/);
  assert.match(css, /--radius-md:\s*6px/);
  assert.match(css, /\.button-primary/);
  assert.match(css, /border-radius:\s*var\(--radius-sm\)/);
  assert.doesNotMatch(css, /border-radius:\s*(?:2[0-9]|3[0-9]|4[0-9])px/);
});

test("website rebrand leaves the existing chatbot fallback launcher untouched", async () => {
  const loader = await read("public/widget-loader.js");

  assert.match(loader, /M92\.9 81\.1C97\.4/);
  assert.match(loader, /color:\s*"#b9ed4d"/);
  assert.match(loader, /borderRadius:\s*"20px"/);
  assert.match(loader, /background:\s*"#ffffff"/);
});

test("reduced motion and mobile-specific composition are explicit", async () => {
  const css = await read("src/components/site/Rebrand.css");

  assert.match(css, /@media \(max-width: 720px\)/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(css, /\.path-story__desktop[\s\S]*display:\s*none/);
  assert.match(css, /\.path-story__mobile[\s\S]*display:\s*block/);
});
