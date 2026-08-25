import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");
const approvedStart = "M24 71.2L24.003 32.706";
const approvedEnd = "L98.928 84.804L98.217 85.056L97.485 85.275L96.6 85.5";

test("brand mark uses the approved one-stroke chatbot geometry across site assets", async () => {
  const component = await read("src/components/BrandMark.tsx");
  const logo = await read("public/brand/logo.svg");
  const logoMark = await read("public/brand/logo-mark.svg");
  const logoLight = await read("public/brand/logo-light.svg");
  const favicon = await read("public/favicon.svg");

  assert.equal((component.match(/<path\b/g) ?? []).length, 1);
  assert.match(component, /viewBox="0 0 112 112"/);
  assert.match(component, new RegExp(approvedStart.replaceAll(".", "\\.")));
  assert.match(component, new RegExp(approvedEnd.replaceAll(".", "\\.")));
  assert.match(component, /strokeWidth="7\.25"/);
  assert.match(component, /strokeLinecap="round"/);
  assert.match(component, /strokeLinejoin="round"/);

  for (const asset of [logo, logoMark, logoLight, favicon]) {
    assert.match(asset, /viewBox="0 0 112 112"/);
    assert.match(asset, new RegExp(approvedStart.replaceAll(".", "\\.")));
    assert.match(asset, new RegExp(approvedEnd.replaceAll(".", "\\.")));
    assert.match(asset, /stroke-width="7\.25"/);
  }

  assert.match(logo, /stroke="#12372D"/);
  assert.match(logoMark, /stroke="#12372D"/);
  assert.match(logoLight, /stroke="#F5F4ED"/);
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

test("website polish leaves the existing chatbot fallback launcher untouched", async () => {
  const loader = await read("public/widget-loader.js");

  assert.match(loader, /M92\.9 81\.1C97\.4/);
  assert.match(loader, /color:\s*"#b9ed4d"/);
  assert.match(loader, /borderRadius:\s*"20px"/);
  assert.match(loader, /background:\s*"#ffffff"/);
  assert.match(loader, /WIDGET_RELEASE\s*=\s*"premium-motion-20260825-v7"/);
});

test("homepage art direction explicitly handles reduced motion and mobile composition", async () => {
  const css = await read("src/components/site/AwardHome.css");

  assert.match(css, /@media \(max-width: 720px\)/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(css, /\.hybrid-flow__desktop[\s\S]*display:\s*none/);
  assert.match(css, /\.hybrid-flow__mobile[\s\S]*display:\s*block/);
  assert.match(css, /\.page-guide/);
});
