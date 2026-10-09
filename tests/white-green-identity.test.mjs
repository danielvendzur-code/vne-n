import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");
const approvedStart = "M6 46.5A29 29 0 0 1 64 46.5Z";
const approvedEnd =
  "M36 53.5H94A29 29 0 0 1 93.01 61C91.7 65.8 92.34 67.76 93.43 72.64L96.1 84.6L84.14 81.93C79.26 80.84 77.34 80.21 72.51 81.51A29 29 0 0 1 36 53.5Z";

test("delivered Rozhovor identity uses the exact two filled paths across public assets", async () => {
  const component = await read("src/components/BrandMark.tsx");
  assert.equal((component.match(/<path\b/g) ?? []).length, 2);
  assert.match(component, /viewBox="0 0 100 100"/);
  assert.doesNotMatch(component, /strokeWidth|strokeLinecap|strokeLinejoin/);
  for (const source of [
    component,
    ...(await Promise.all(
      [
        "public/brand/logo.svg",
        "public/brand/logo-mark.svg",
        "public/brand/logo-light.svg",
        "public/favicon.svg",
      ].map(read),
    )),
  ]) {
    assert.ok(source.includes(approvedStart));
    assert.ok(source.includes(approvedEnd));
  }
  const motion = await read("src/components/brand-mark.css");
  assert.match(motion, /prefers-reduced-motion/);
  const top = Number(motion.match(/translate\(15px, ([0-9.]+)px\)/)?.[1]);
  const bottom = Number(motion.match(/translate\(-15px, (-[0-9.]+)px\)/)?.[1]);
  // Approved paths close at y=46.5 / y=53.5. Their transformed edges must
  // overlap by 1.5–2 units, preventing a raster seam at small sizes and fractional scales.
  const overlap = 46.5 + top - (53.5 + bottom);
  assert.ok(overlap >= 1.5 && overlap <= 2, `Merged logo seam: ${overlap}`);
  assert.match(motion, /scale\(1\.22\)/);
  assert.doesNotMatch(motion, /stroke-dash|blur|filter:/);
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

test("chatbot fallback carries the delivered symbol and same-origin versioned widget", async () => {
  const loader = await read("public/widget-loader.js");
  assert.ok(loader.includes(approvedStart));
  assert.ok(loader.includes(approvedEnd));
  assert.equal((loader.match(/<path\b/g) ?? []).length, 2);
  assert.match(loader, /borderRadius:\s*"50%"/);
  assert.match(loader, /background:\s*"#FFFCF7"/);
  assert.doesNotMatch(loader, /requestAnimationFrame|strokeDashoffset/);
  assert.match(loader, /WIDGET_RELEASE\s*=\s*"faq-word-stream-20261009-v35"/);
  assert.match(loader, /assistant\/widget\.js/);
  assert.match(loader, /pendingOpen/);
  assert.match(loader, /MOUNT_TIMEOUT[\s\S]*scheduleRetry\(\)/);
});

test("homepage art direction explicitly handles reduced motion and mobile composition", async () => {
  const css = await read("src/components/site/AwardHome.css");

  assert.match(css, /@media \(max-width: 720px\)/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(css, /\.hybrid-flow__desktop[\s\S]*display:\s*none/);
  assert.match(css, /\.hybrid-flow__mobile[\s\S]*display:\s*block/);
  assert.match(css, /\.page-guide/);
});

test("homepage repair keeps scroll-driven stages sequential and hero lines geometrically even", async () => {
  const route = await read("src/routes/index.tsx");
  const repair = await read("src/components/site/SiteVisualAuthority.css");
  const flowCss = repair;

  assert.doesNotMatch(route, /components\/site\/[^"]+\.css/);
  const userFixMarker = repair.indexOf("consolidated from FinalHomepageUserFix.css");
  const repairMarker = repair.indexOf("consolidated from FinalHomepageMotionRepair.css");
  const reworkMarker = repair.indexOf("consolidated from HomepageReworkSep07.css");
  assert.ok(userFixMarker >= 0);
  assert.ok(repairMarker > userFixMarker);
  assert.ok(reworkMarker > repairMarker);

  assert.match(flowCss, /\.kage-home \.kage-flow-story__steps/);
  assert.match(flowCss, /\.kage-home \.kage-flow__step/);
  assert.match(flowCss, /position:\s*sticky/);
  assert.match(flowCss, /height:\s*390svh/);
  assert.match(repair, /h1 > \.typed-line/);
  assert.match(repair, /h1 > em > \.typed-line/);
  assert.match(
    repair,
    /\.typed-word,[\s\S]*\.typed-character[\s\S]*display:\s*inline-block !important/,
  );
  assert.match(repair, /line-height:\s*inherit !important/);
});
