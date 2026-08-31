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

test("chatbot fallback is the approved round animated one-stroke launcher", async () => {
  const loader = await read("public/widget-loader.js");

  assert.match(loader, new RegExp(approvedStart.replaceAll(".", "\\.")));
  assert.match(loader, new RegExp(approvedEnd.replaceAll(".", "\\.")));
  assert.match(loader, /pathLength="1"/);
  assert.equal((loader.match(/<path\b/g) ?? []).length, 1);
  assert.match(loader, /width:\s*"72px"/);
  assert.match(loader, /height:\s*"72px"/);
  assert.match(loader, /borderRadius:\s*"50%"/);
  assert.match(loader, /background:\s*"#ffffff"/);
  assert.match(loader, /requestAnimationFrame/);
  assert.match(loader, /DARK_LOGO\s*=\s*\[11, 47, 32\]/);
  assert.match(loader, /PALE_LOGO\s*=\s*\[185, 237, 77\]/);
  assert.match(loader, /WIDGET_RELEASE\s*=\s*"round-one-stroke-launcher-20260831-v15"/);
  assert.doesNotMatch(loader, /<strong>Môj Chatbot<\/strong>/);
  assert.doesNotMatch(loader, /<small>Otvoriť krátke zadanie<\/small>/);
});

test("homepage art direction explicitly handles reduced motion and mobile composition", async () => {
  const css = await read("src/components/site/AwardHome.css");

  assert.match(css, /@media \(max-width: 720px\)/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(css, /\.hybrid-flow__desktop[\s\S]*display:\s*none/);
  assert.match(css, /\.hybrid-flow__mobile[\s\S]*display:\s*block/);
  assert.match(css, /\.page-guide/);
});

test("homepage repair keeps horizontal stages sequential and hero lines geometrically even", async () => {
  const route = await read("src/routes/index.tsx");
  const repair = await read("src/components/site/FinalHomepageMotionRepair.css");

  const userFixImport = route.indexOf('import "@/components/site/FinalHomepageUserFix.css"');
  const repairImport = route.indexOf('import "@/components/site/FinalHomepageMotionRepair.css"');
  assert.ok(userFixImport >= 0);
  assert.ok(repairImport > userFixImport);

  assert.match(repair, /\.kage-flow \.kage-flow__panel[\s\S]*position:\s*relative !important/);
  assert.match(repair, /width:\s*100vw !important/);
  assert.match(repair, /flex:\s*0 0 100vw !important/);
  assert.match(repair, /h1 > \.typed-line/);
  assert.match(repair, /h1 > em > \.typed-line/);
  assert.match(
    repair,
    /\.typed-word,[\s\S]*\.typed-character[\s\S]*display:\s*inline-block !important/,
  );
  assert.match(repair, /line-height:\s*inherit !important/);
});
