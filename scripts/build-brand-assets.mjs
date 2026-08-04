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

/** Paleta je zhodná s WhiteGreenIdentityLock.css. */
const FOREST = "#0b2f20";
const LIME = "#B9ED4D";
const LIME_BRIGHT = "#d9ff78";
const SOFT = "#f5f9f2";
const SECONDARY = "#4c5a52";

/** Obe ťahy symbolu — jediný zdroj pravdy pre všetky výstupy.
    Musia sedieť s `src/components/BrandMark.tsx`; kontrolu drží test
    `the public brand uses the approved option 1 geometry`. */
const MARK_PATHS = [
  "M96.6 85.5C100.8 84.6 103.6 82.4 103.6 79.9V12.4C103.6 7.2 99.2 4.5 95.4 6.4L59.5 34.5" +
    "C57.9 36.1 54.1 36.1 52.5 34.5L18.3 6.4C14.5 4.5 8.5 7.2 8.5 12.4V78.5" +
    "C8.5 81.4 11 83.7 14.2 83.7H30.2L30.5 105.5L52.9 83.7H85.3C86.8 83.7 88 82.6 88 81.2V29.2",
  "M24 71.2V29.2L52.5 55.4C54.1 57 57.9 57 59.5 55.4L88 29.2",
];

const mark = (stroke, width = 6.2) =>
  MARK_PATHS.map(
    (d) =>
      `<path d="${d}" fill="none" stroke="${stroke}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round"/>`,
  ).join("");

/**
 * Dlaždica ikony. `inset` drží symbol v bezpečnej zóne — maskovateľná
 * ikona sa na Androide oreže do kruhu, takže potrebuje väčší okraj.
 */
function iconSvg(size, { inset = 0.2, radius = 0.223, background = FOREST } = {}) {
  const box = 112;
  const scale = 1 - inset * 2;
  const offset = box * inset;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${box} ${box}">
  <rect width="${box}" height="${box}" rx="${box * radius}" fill="${background}"/>
  <g transform="translate(${offset} ${offset}) scale(${scale})">${mark(LIME, 7)}</g>
</svg>`;
}

/** Náhľad pre sociálne siete — biela plocha, značka, jedna veta. */
function ogSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#ffffff"/>
      <stop offset="1" stop-color="${SOFT}"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.86" cy="0.1" r="0.6">
      <stop offset="0" stop-color="${LIME_BRIGHT}" stop-opacity="0.5"/>
      <stop offset="1" stop-color="${LIME_BRIGHT}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect width="1200" height="630" fill="url(#glow)"/>
  <rect y="614" width="1200" height="16" fill="${LIME}"/>

  <g transform="translate(96 84) scale(0.62)">
    <rect width="112" height="112" rx="25" fill="${FOREST}"/>
    <g transform="translate(22.4 22.4) scale(0.6)">${mark(LIME, 7)}</g>
  </g>
  <text x="184" y="146" font-family="Inter Tight, Inter, -apple-system, Segoe UI, sans-serif"
        font-size="34" font-weight="680" fill="${FOREST}" letter-spacing="-0.5">Môj Chatbot</text>

  <text x="96" y="300" font-family="Inter Tight, Inter, -apple-system, Segoe UI, sans-serif"
        font-size="82" font-weight="600" fill="${FOREST}" letter-spacing="-3.4">Chatboty, kalkulačky</text>
  <text x="96" y="392" font-family="Inter Tight, Inter, -apple-system, Segoe UI, sans-serif"
        font-size="82" font-weight="600" fill="#19834f" letter-spacing="-3.4">a konfigurátory na mieru.</text>

  <text x="96" y="470" font-family="Inter, -apple-system, Segoe UI, sans-serif"
        font-size="27" fill="${SECONDARY}">Zákazník dostane odpoveď hneď, vy dopyt aj s kontextom.</text>

  <text x="96" y="556" font-family="Inter, -apple-system, Segoe UI, sans-serif"
        font-size="24" font-weight="640" fill="${FOREST}">mojchatbot.sk</text>
</svg>`;
}

/** Favicon má vlastnú dlaždicu — samotný limetkový ťah by sa na svetlom
    paneli prehliadača stratil. */
function faviconSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 112 112" role="img" aria-label="Môj Chatbot">
  <title>Môj Chatbot</title>
  <rect width="112" height="112" rx="25" fill="${FOREST}"/>
  <g transform="translate(16.8 16.8) scale(0.7)">${mark(LIME)}</g>
</svg>`;
}

/** ICO obal okolo hotových PNG — moderné prehliadače ho čítajú priamo. */
function buildIco(images) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);

  let offset = 6 + images.length * 16;
  const entries = [];
  for (const { size, data } of images) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(size >= 256 ? 0 : size, 0);
    entry.writeUInt8(size >= 256 ? 0 : size, 1);
    entry.writeUInt8(0, 2);
    entry.writeUInt8(0, 3);
    entry.writeUInt16LE(1, 4);
    entry.writeUInt16LE(32, 6);
    entry.writeUInt32LE(data.length, 8);
    entry.writeUInt32LE(offset, 12);
    entries.push(entry);
    offset += data.length;
  }
  return Buffer.concat([header, ...entries, ...images.map((i) => i.data)]);
}

const browser = await chromium.launch({
  executablePath: process.env.PLAYWRIGHT_CHROMIUM ?? "/opt/pw-browsers/chromium",
});

/** Vykreslí SVG cez prehliadač, aby zaoblenia aj text sedeli na pixel. */
async function render(svg, width, height) {
  const page = await browser.newPage({
    viewport: { width, height },
    deviceScaleFactor: 1,
  });
  await page.setContent(
    `<!doctype html><style>html,body{margin:0;padding:0;background:transparent}svg{display:block}</style>${svg}`,
    { waitUntil: "load" },
  );
  const shot = await page.screenshot({ omitBackground: true });
  await page.close();
  return shot;
}

const written = [];
const write = async (relative, data) => {
  await writeFile(join(OUT, relative), data);
  written.push(`${relative} (${(data.length / 1024).toFixed(1)} kB)`);
};

// Ikony aplikácie
await write("icons/icon-192.png", await render(iconSvg(192), 192, 192));
await write("icons/icon-512.png", await render(iconSvg(512), 512, 512));
await write("icons/apple-touch-icon.png", await render(iconSvg(180, { inset: 0.19 }), 180, 180));
// Maskovateľná verzia: plná plocha bez zaoblenia a širší okraj pre orez.
await write(
  "icons/icon-512-maskable.png",
  await render(iconSvg(512, { inset: 0.29, radius: 0 }), 512, 512),
);

// Favicon
await write("favicon.svg", Buffer.from(faviconSvg(), "utf8"));
await write(
  "favicon.ico",
  buildIco([
    { size: 16, data: await render(faviconSvg(), 16, 16) },
    { size: 32, data: await render(faviconSvg(), 32, 32) },
    { size: 48, data: await render(faviconSvg(), 48, 48) },
  ]),
);

// Značkové SVG pre externé použitie
const standalone = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 112 112" role="img" aria-label="Môj Chatbot">
  <title>Môj Chatbot</title>
  ${mark(LIME)}
</svg>`;
await write("brand/logo.svg", Buffer.from(standalone, "utf8"));
await write("brand/mark-lime.svg", Buffer.from(standalone, "utf8"));

// Náhľad pre sociálne siete
await write("og/og-home.png", await render(ogSvg(), 1200, 630));

await browser.close();
console.log("Vygenerované:\n  " + written.join("\n  "));
