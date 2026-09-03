import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("homepage replaces the fragile snapping flow with an ordinary-scroll four-step section", async () => {
  const route = await read("src/routes/index.tsx");
  const landing = await read("src/components/site/KageLanding.tsx");

  assert.match(route, /UserReportedVisualFinal\.css/);
  assert.match(landing, /id="ako-to-funguje"/);
  assert.match(landing, /className="kage-flow-story"/);
  for (const index of ["01", "02", "03", "04"]) {
    assert.match(landing, new RegExp(`index: "${index}"`));
  }

  // The section must never move, hold or reinterpret the page's own scrolling.
  assert.doesNotMatch(landing, /animate\(window\.scrollY|window\.scrollTo\(/);
  assert.doesNotMatch(landing, /useScroll|useMotionValueEvent|scrollYProgress/);
  assert.doesNotMatch(landing, /addEventListener\("wheel"/);
  assert.doesNotMatch(landing, /preventDefault\(\)[\s\S]{0,200}scrollLeft/);

  // No second copy of the section is portalled over a hidden legacy one.
  assert.doesNotMatch(landing, /createPortal|data-flow-rescued/);
});

test("reported heading has safe Slovak-diacritic leading", async () => {
  const css = await read("src/components/site/UserReportedVisualFinal.css");

  assert.match(css, /\.outcome-comparison__intro h2[\s\S]*line-height: 1\.08 !important/);
  assert.match(css, /@media \(max-width: 720px\)[\s\S]*line-height: 1\.1 !important/);
});

test("Začať projekt CTA is green and changes to black on hover or keyboard focus", async () => {
  const css = await read("src/components/site/UserReportedVisualFinal.css");

  assert.match(
    css,
    /\.site-header \.site-header__cta[\s\S]*background: #c8f06a !important[\s\S]*color: #071b15 !important/,
  );
  assert.match(
    css,
    /\.site-header \.site-header__cta:is\(:hover, :focus-visible\)[\s\S]*background: #0b0e0c !important[\s\S]*color: #f6f5ee !important/,
  );
});
