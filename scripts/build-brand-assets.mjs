/**
 * Vygeneruje značkové obrázky z jediného zdroja — symbolu Môj Chatbot.
 *
 * Ikony aplikácie predtým niesli starého robota s broskyňovými doplnkami,
 * ktorý nemal so značkou nič spoločné, a náhľadový obrázok pre sociálne
 * siete ukazoval ešte staršiu značku aj neplatný text. Tento skript ich
 * skladá z tej istej cesty, akú kreslí `src/components/BrandMark.tsx`,
 * takže hlavička webu, karta na Facebooku aj ikona na ploche telefónu
 * ukazujú to isté.
 *
 * Spustenie: node scripts/build-brand-assets.mjs
 *
 * Skript kreslí cez Chromium, aby zaoblenia aj text sedeli na pixel.
 * Playwright zámerne nie je závislosťou webu — je to nástroj, ktorý sa
 * púšťa len pri zmene značky:
 *   npx playwright@1 ... alebo NODE_PATH=$(npm root -g) node scripts/...
 */

import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

/**
 * Playwright sa hľadá aj mimo projektu. `import` v ESM na rozdiel od
 * `require` nepozerá na NODE_PATH, takže globálnu inštaláciu treba nájsť
 * ručne — cez PLAYWRIGHT_PACKAGE alebo `npm root -g`.
 */
async function loadChromium() {
  const candidates = [];
  if (process.env.PLAYWRIGHT_PACKAGE) candidates.push(process.env.PLAYWRIGHT_PACKAGE);
  for (const entry of (process.env.NODE_PATH ?? "").split(":").filter(Boolean)) {
    candidates.push(`${entry}/playwright`);
  }
  try {
    const { execSync } = await import("node:child_process");
    candidates.push(`${execSync("npm root -g", { encoding: "utf8" }).trim()}/playwright`);
  } catch {
    /* npm nemusí byť po ruke */
  }

  // Playwright je CommonJS — podľa spôsobu načítania sedí `chromium` buď
  // priamo na module, alebo až na jeho `default`.
  const pick = (mod) => mod?.chromium ?? mod?.default?.chromium ?? null;

  try {
    const found = pick(await import("playwright"));
    if (found) return found;
  } catch {
    /* skús ďalej */
  }
  // `import()` na adresár nefunguje — cez `require.resolve` sa dostaneme
  // na skutočný vstupný súbor balíka.
  const { createRequire } = await import("node:module");
  const { pathToFileURL } = await import("node:url");
  const require = createRequire(import.meta.url);
  for (const candidate of candidates) {
    for (const target of [candidate, `${candidate}/index.js`]) {
      try {
        const entry = require.resolve(target);
        const found = pick(await import(pathToFileURL(entry).href));
        if (found) return found;
      } catch {
        /* ďalší pokus */
      }
    }
  }
  return null;
}

const chromium = await loadChromium();
if (!chromium) {
  console.error(
    "Chýba Playwright. Je to nástroj len pre tento skript, nie závislosť webu:\n" +
      "  npm i -g playwright && node scripts/build-brand-assets.mjs\n" +
      "  (prípadne PLAYWRIGHT_PACKAGE=/cesta/k/node_modules/playwright)",
  );
  process.exit(1);
}
const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "public");
const { readFile } = await import("node:fs/promises");
// Delivered assets are the source. This script never replaces the approved SVGs.
const symbol = await readFile(join(OUT, "brand/logo-mark.svg"), "utf8");
const paths = (symbol.match(/<path\b[^>]*>/g) ?? []).join("");
if (!paths.includes("M6 46.5A29")) throw new Error("Missing delivered Rozhovor symbol");
const font = await readFile(join(OUT, "fonts/geist-latin-ext-wght-normal.woff2"));
const browser = await chromium.launch({
  executablePath: process.env.PLAYWRIGHT_CHROMIUM ?? "/opt/pw-browsers/chromium",
  args: ["--no-sandbox"],
});
try {
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
  await page.setContent(`<!doctype html><style>
    @font-face{font-family:Geist;src:url(data:font/woff2;base64,${font.toString("base64")}) format("woff2");font-weight:100 900}
    *{box-sizing:border-box}body{margin:0;width:1200px;height:630px;background:#F5EFE6;color:#1C1612;font-family:Geist,sans-serif;padding:70px 80px}
    header{display:flex;align-items:center;gap:16px;font-size:28px;font-weight:600;letter-spacing:-1px}
    svg{width:48px;height:48px}h1{font-size:73px;line-height:1.09;letter-spacing:-4px;font-weight:600;margin:64px 0 26px}h1 span{color:#5B3A26}p{font-size:23px;color:#5B3A26;margin:0}footer{margin-top:38px;font-size:20px;font-weight:600}
  </style><header><svg viewBox="0 0 100 100">${paths}</svg>Môj Chatbot</header><h1>Chatboty, kalkulačky<br><span>a konfigurátory na mieru.</span></h1><p>Zákazník dostane odpoveď. Vy dopyt aj s kontextom.</p><footer>mojchatbot.sk</footer>`);
  await page.screenshot({ path: join(OUT, "og/og-home.png") });
  console.log("Updated og/og-home.png from the delivered symbol and local Geist font.");
} finally {
  await browser.close();
}
