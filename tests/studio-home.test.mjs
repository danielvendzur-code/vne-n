import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("homepage is the Koverta-inspired studio page with real work and a keyword H1", async () => {
  const route = await read("src/routes/index.tsx");
  const landing = await read("src/components/site/StudioHome.tsx");

  assert.match(route, /import \{ StudioHome \}/);
  assert.match(route, /3D konfigurátor na web/);
  assert.equal((landing.match(/<h1\b/g) ?? []).length, 1);
  assert.match(landing, /Predajné nástroje na web,/);
  assert.match(landing, /realizations\.map/);
  assert.match(landing, /faqs\.map/);
  for (const id of ["riesenia", "konfigurator", "realizacie", "proces", "cena", "otazky"]) {
    assert.match(landing, new RegExp(`id="${id}"`));
  }
});

test("the live Koverta configurator loads only after an explicit click", async () => {
  const landing = await read("src/components/site/StudioHome.tsx");
  const data = await read("src/data/configurator.ts");
  const root = await read("src/routes/__root.tsx");

  assert.match(landing, /\{live \? \(\s*<iframe/);
  assert.match(landing, /onClick=\{\(\) => setLive\(true\)\}/);
  assert.match(data, /https:\/\/danielvendzur-code\.github\.io\/koverta-web\/konfigurator\//);
  assert.match(root, /frame-src 'self' https:\/\/danielvendzur-code\.github\.io/);
  for (const shot of ["konfigurator-pergola", "konfigurator-pristresok", "konfigurator-carport"]) {
    assert.match(data, new RegExp(`work/koverta/${shot}\\.webp`));
  }
});

test("scroll reveal keeps content visible without JavaScript and respects reduced motion", async () => {
  const hook = await read("src/hooks/useReveal.ts");
  const css = await read("src/components/site/StudioHome.css");

  // Only elements below the fold are hidden, and only after mount.
  assert.match(hook, /getBoundingClientRect\(\)\.top > window\.innerHeight/);
  assert.match(hook, /prefers-reduced-motion: reduce/);
  assert.match(css, /\[data-reveal\]\[data-shown="false"\]/);
  assert.doesNotMatch(css, /\[data-reveal\]\s*\{[^}]*opacity:\s*0/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
  assert.doesNotMatch(css, /addEventListener\("wheel"/);
});

test("3D configurator case study is indexable with its own structured data and sitemap entry", async () => {
  const route = await read("src/routes/3d-konfigurator.tsx");
  const sitemap = await read("public/sitemap.xml");
  const nav = await read("src/components/site/Nav.tsx");

  assert.match(route, /createFileRoute\("\/3d-konfigurator"\)/);
  assert.match(route, /"@type": "FAQPage"/);
  assert.match(route, /"@type": "Service"/);
  assert.match(route, /breadcrumbJsonLd/);
  assert.match(route, /og-3d-konfigurator\.png/);
  assert.doesNotMatch(route, /noindex/);
  assert.match(sitemap, /https:\/\/mojchatbot\.sk\/3d-konfigurator/);
  assert.match(nav, /href: "\/3d-konfigurator"/);
});
