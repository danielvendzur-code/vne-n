import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("competition homepage replaces the historical landing and duplicate ending", async () => {
  const route = await read("src/routes/index.tsx");
  const layout = await read("src/components/site/Layout.tsx");
  const homepage = await read("src/components/site/CompetitionLanding.tsx");

  assert.match(route, /CompetitionLanding/);
  assert.doesNotMatch(route, /PremiumLanding/);
  assert.doesNotMatch(layout, /HomeConversionUpgrade/);
  assert.match(layout, /CompetitionWinnerFinal\.css/);
  assert.match(layout, /TasteSystemFinal\.css/);
  assert.equal(layout.lastIndexOf('import "./'), layout.indexOf('import "./TasteSystemFinal.css"'));
  assert.match(homepage, /Web, ktorý odpovedá, počíta/);
  assert.match(homepage, /Získať návrh riešenia/);
});

test("homepage follows one deliberate competition narrative", async () => {
  const homepage = await read("src/components/site/CompetitionLanding.tsx");
  const orderedSections = [
    "<Hero />",
    "<ProofBar />",
    "<DeratScrollStory />",
    "<Solutions />",
    "<Portfolio />",
    "<Process />",
    "<Faq />",
    "<FinalOffer />",
  ];

  let previous = -1;
  for (const section of orderedSections) {
    const current = homepage.indexOf(section);
    assert.ok(current > previous, `${section} must appear in the intended order`);
    previous = current;
  }

  assert.match(homepage, /Reálne rozhrania\./);
  assert.match(homepage, /Nie generické makety\./);
  assert.match(homepage, /Jednoduchý chatbot začína od 350 €/);
  assert.match(homepage, /Na existujúci web/);
  assert.match(homepage, /Vlastný dizajn a logika/);
});

test("interactive product preview exposes three clear tool modes", async () => {
  const homepage = await read("src/components/site/CompetitionLanding.tsx");

  assert.match(homepage, /type ToolKey = "chatbot" \| "calculator" \| "configurator"/);
  assert.match(homepage, /AI chatbot/);
  assert.match(homepage, /Kalkulačka/);
  assert.match(homepage, /Konfigurátor/);
  assert.match(homepage, /cx-choice-chip/);
  assert.match(homepage, /aria-pressed=\{selected\}/);
  assert.match(homepage, /Výstup pre firmu/);
  assert.match(homepage, /Hotový dopyt/);
});

test("visual system contains compact chips and one pressed-metal action language", async () => {
  const css = await read("src/components/site/TasteSystemFinal.css");

  assert.match(css, /Taste-system final layer/);
  assert.match(css, /--taste-font/);
  assert.match(css, /--taste-display/);
  assert.match(css, /Pressed-metal button adapted/);
  assert.match(css, /\.cx-metal-button__inner/);
  assert.match(css, /clip-path: inset\(1\.5px/);
  assert.match(css, /\.cx-choice-chip\[data-active="true"\]/);
  assert.match(css, /border-radius: 999px/);
  assert.match(css, /\.cx-static-tag/);
  assert.doesNotMatch(css, /inset 3px 0 0/);
});

test("desktop, mobile and reduced-motion layouts are explicit", async () => {
  const css = await read("src/components/site/TasteSystemFinal.css");

  assert.match(css, /@media \(max-width: 1100px\)/);
  assert.match(css, /@media \(max-width: 760px\)/);
  assert.match(css, /@media \(max-width: 480px\)/);
  assert.match(css, /@media \(hover: none\), \(pointer: coarse\)/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(css, /\.cx-project-card\[data-featured="true"\]/);
  assert.match(css, /\.cx-proofbar__grid/);
});

test("contact flow and metadata security remain intact", async () => {
  const root = await read("src/routes/__root.tsx");
  const contact = await read("src/routes/kontakt.tsx");
  const client = await read("src/lib/lead-submission.ts");
  const loader = await read("public/widget-loader.js");

  assert.match(root, /Content-Security-Policy/);
  assert.match(root, /strict-origin-when-cross-origin/);
  assert.match(contact, /await submitWebsiteLead/);
  assert.match(contact, /submitState === "done"/);
  assert.match(contact, /contact-consent/);
  assert.match(client, /api\/lead/);
  assert.match(client, /AbortController/);
  assert.match(client, /fallback/);
  assert.match(loader, /__DV_ASSISTANT_LOADER_ACTIVE__/);
  assert.match(loader, /taste-system-v7/);
});

test("static export validates the new hero and conversion action", async () => {
  const exporter = await read("scripts/export-github-pages.mjs");
  const workflow = await read(".github/workflows/pages.yml");

  assert.match(exporter, /Web, ktorý odpovedá, počíta/);
  assert.match(exporter, /Získať návrh riešenia/);
  assert.match(exporter, /404\.html/);
  assert.match(exporter, /build-meta\.json/);
  assert.match(workflow, /Run source and deployment security audit/);
  assert.match(workflow, /Run UX and deployment contracts/);
  assert.match(workflow, /CompetitionLanding/);
  assert.match(workflow, /TasteSystemFinal\.css/);
  assert.match(workflow, /live_smoke=success/);
});

test("portfolio assets preserve lazy loading and real destinations", async () => {
  const homepage = await read("src/components/site/CompetitionLanding.tsx");
  const motion = await read("src/components/site/SiteMotionEnhancements.tsx");

  assert.match(homepage, /loading="lazy"/);
  assert.match(homepage, /https:\/\/derat-chatbot-backend\.vercel\.app/);
  assert.match(homepage, /https:\/\/mojplot\.sk/);
  assert.match(homepage, /https:\/\/koverta\.sk/);
  assert.match(motion, /image\.loading = index === 0 \? "eager" : "lazy"/);
  assert.doesNotMatch(motion, /images\.map[\s\S]*image\.loading = "eager"/);
});
