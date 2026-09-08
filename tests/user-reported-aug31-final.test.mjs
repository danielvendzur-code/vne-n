import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("homepage uses ordinary vertical scroll to drive the four-step story", async () => {
  const route = await read("src/routes/index.tsx");
  const landing = await read("src/components/site/KageLanding.tsx");
  const rework = await read("src/components/site/HomepageVisualAuthority.css");

  assert.match(route, /HomepageVisualAuthority\.css/);
  assert.doesNotMatch(route, /HomepageReworkSep07\.css/);
  assert.match(landing, /id="ako-to-funguje"/);
  assert.match(landing, /className="kage-flow-story"/);
  for (const index of ["01", "02", "03", "04"]) {
    assert.match(landing, new RegExp(`index: "${index}"`));
  }

  assert.match(landing, /window\.addEventListener\("scroll", scheduleUpdate/);
  assert.match(landing, /className="kage-flow-story__sticky"/);
  assert.doesNotMatch(landing, /animate\(window\.scrollY|window\.scrollTo\(/);
  assert.doesNotMatch(landing, /addEventListener\("wheel"/);
  assert.doesNotMatch(landing, /scrollLeft\s*[+\-]?=/);
  assert.match(rework, /touch-action:\s*pan-y/);
  assert.doesNotMatch(landing, /createPortal|data-flow-rescued/);
});

test("reported heading has safe Slovak-diacritic leading", async () => {
  const css = await read("src/components/site/HomepageVisualAuthority.css");

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
