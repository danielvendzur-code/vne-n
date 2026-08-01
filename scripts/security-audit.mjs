import { access, readFile, readdir } from "node:fs/promises";
import { extname, join } from "node:path";

const root = new URL("../", import.meta.url);
const failures = [];
const checkedFiles = [];
const sourceExtensions = new Set([".js", ".mjs", ".cjs", ".ts", ".tsx", ".json", ".yml", ".yaml"]);
const excludedDirectories = new Set([
  "node_modules",
  ".git",
  ".output",
  "dist",
  "pages-dist",
  "coverage",
]);
const scannerPath = "scripts/security-audit.mjs";

function fail(message) {
  failures.push(message);
}

async function read(path) {
  return readFile(new URL(path, root), "utf8");
}

async function walk(directory) {
  const entries = await readdir(new URL(`${directory}/`, root), { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name.startsWith(".") && entry.name !== ".github") continue;
    if (excludedDirectories.has(entry.name)) continue;
    const path = join(directory, entry.name).replaceAll("\\", "/");
    if (entry.isDirectory()) {
      await walk(path);
      continue;
    }
    if (sourceExtensions.has(extname(entry.name))) checkedFiles.push(path);
  }
}

for (const directory of ["src", "public", "scripts", ".github"]) {
  try {
    await walk(directory);
  } catch (error) {
    fail(`Cannot scan ${directory}: ${error instanceof Error ? error.message : String(error)}`);
  }
}

const secretPatterns = [
  [/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/, "private key"],
  [/sk-ant-api\d{2}-[A-Za-z0-9_-]{20,}/, "Anthropic API key"],
  [/\bAKIA[0-9A-Z]{16}\b/, "AWS access key"],
  [/\bghp_[A-Za-z0-9]{30,}\b/, "GitHub personal access token"],
  [/\bxox[baprs]-[A-Za-z0-9-]{20,}\b/, "Slack token"],
];

for (const path of checkedFiles) {
  const content = await read(path);
  for (const [pattern, label] of secretPatterns) {
    if (pattern.test(content)) fail(`${label} pattern detected in ${path}`);
  }
  if (path !== scannerPath) {
    if (/\beval\s*\(/.test(content)) fail(`eval() detected in ${path}`);
    if (/\bnew\s+Function\s*\(/.test(content)) fail(`new Function() detected in ${path}`);
    if (/document\.write\s*\(/.test(content)) fail(`document.write() detected in ${path}`);
    if (/\b(?:href|to)\s*=\s*(?:\{\s*)?["'`]\/\/[^/]/.test(content)) {
      fail(`Protocol-relative link detected in ${path}`);
    }
  }
}

const rootRoute = await read("src/routes/__root.tsx");
for (const token of [
  "Content-Security-Policy",
  "strict-origin-when-cross-origin",
  "widget-loader.js",
]) {
  if (!rootRoute.includes(token)) fail(`Root security metadata is missing ${token}`);
}
if (
  rootRoute.includes(
    '<script src="https://danielvendzur-code.github.io/moj.chatbot.backend/widget.js"',
  )
) {
  fail("Brittle direct external widget script is present");
}

const loader = await read("public/widget-loader.js");
for (const token of [
  "__DV_ASSISTANT_LOADER_ACTIVE__",
  "MOUNT_TIMEOUT",
  "showFallback",
  "https://danielvendzur-code.github.io",
  "buildKey",
  "Môj Chatbot",
]) {
  if (!loader.includes(token)) fail(`Resilient assistant loader is missing ${token}`);
}

// A pinned cache key froze every visitor on the build their browser downloaded
// first, so widget updates never reached them. The key has to stay derived.
if (/\?v=[\w-]*['"`]/.test(loader)) {
  fail("Resilient assistant loader pins a constant cache key instead of rotating it");
}

const layout = await read("src/components/site/Layout.tsx");
const previousIndex = layout.indexOf('import "./WebsiteRequestFinish.css"');
const winnerIndex = layout.indexOf('import "./CompetitionWinnerFinal.css"');
const tasteIndex = layout.indexOf('import "./TasteSystemFinal.css"');
const approvedIndex = layout.indexOf('import "./ApprovedInteractionsFinal.css"');
const matteIndex = layout.indexOf('import "./MatteUiFinal.css"');
const correctionIndex = layout.indexOf('import "./FinalUserCorrection.css"');
const brandIndex = layout.indexOf('import "./BrandSystemFinal.css"');
const clientIndex = layout.indexOf('import "./ClientLandingFinal.css"');
const finishIndex = layout.indexOf('import "./SiteFinish.css"');
const lastStyleImport = layout.lastIndexOf('import "./');
if (winnerIndex === -1) fail("CompetitionWinnerFinal.css is not imported");
if (tasteIndex === -1) fail("TasteSystemFinal.css is not imported");
if (approvedIndex === -1) fail("ApprovedInteractionsFinal.css is not imported");
if (matteIndex === -1) fail("MatteUiFinal.css is not imported");
if (correctionIndex === -1) fail("FinalUserCorrection.css is not imported");
if (brandIndex === -1) fail("BrandSystemFinal.css is not imported");
if (clientIndex === -1) fail("ClientLandingFinal.css is not imported");
if (finishIndex === -1) fail("SiteFinish.css is not imported");
if (
  previousIndex >= winnerIndex ||
  winnerIndex >= tasteIndex ||
  tasteIndex >= approvedIndex ||
  approvedIndex >= matteIndex ||
  matteIndex >= correctionIndex ||
  correctionIndex >= brandIndex ||
  brandIndex >= clientIndex
) {
  fail("Client landing styles must load after the historical visual layers");
}
// SiteFinish.css je posledná vrstva — dokončuje paletu, prejazdy
// myšou aj opravy hlavičky a menu, takže musí prekryť všetko pred ňou.
if (clientIndex >= finishIndex) {
  fail("SiteFinish.css must load after ClientLandingFinal.css");
}
if (finishIndex !== lastStyleImport) {
  fail("SiteFinish.css must be the final component style import");
}
if (layout.includes("HomeConversionUpgrade")) {
  fail("Removed homepage pricing section is still mounted in Layout");
}
if (!layout.includes('className="page-transition"')) {
  fail("Layout is missing the non-inheriting CSS route transition");
}
if (/<AnimatePresence|<motion\./.test(layout)) {
  fail("A Motion route wrapper can disable descendant whileInView reveals");
}
for (const token of ["LiquidSurfacePointer", "LiquidSegmentedDrag"]) {
  if (layout.includes(token)) fail(`Removed liquid runtime is still mounted: ${token}`);
}

const winnerCss = await read("src/components/site/CompetitionWinnerFinal.css");
for (const token of [
  "--wf-blue: #f3a75a",
  ".spotlight-surface",
  '.lp-hero-pick[data-active="true"]',
  ".lp-switch",
  ".winner-packages",
  ".winner-prep",
  ".winner-final",
  "@media (max-width: 760px)",
  "prefers-reduced-motion",
]) {
  if (!winnerCss.includes(token)) fail(`Competition visual system is missing ${token}`);
}
if (/#c9aa70|#c47c5e|#bc7352|rgba\(201,\s*170,\s*112/i.test(winnerCss)) {
  fail("Bronze, copper or gold remains in the final competition layer");
}

const tasteCss = await read("src/components/site/TasteSystemFinal.css");
for (const token of [
  "Taste-system final layer",
  "--taste-font",
  ".lp-button-quiet::before",
  ".lp-hero-pick::after",
  '.lp-hero-pick[data-active="true"]',
  ".lp-hero-pick-icon",
  ".lp-comparison-body",
  "border: 0 !important",
  "content: none !important",
  "Remove square icon tiles",
]) {
  if (!tasteCss.includes(token)) fail(`Taste visual system is missing ${token}`);
}
if (/inset 3px 0 0/.test(tasteCss)) {
  fail("Selected chip side stripe remains in the Taste visual layer");
}

const approvedCss = await read("src/components/site/ApprovedInteractionsFinal.css");
for (const token of [
  "Difference Sweep",
  "Reversed Blue Bloom",
  ".lp-button-sweep",
  ".lp-button-bloom",
  ".lp-caps-detail-inner",
  ".winner-prep__item",
  "prefers-reduced-motion",
]) {
  if (!approvedCss.includes(token)) fail(`Approved interaction layer is missing ${token}`);
}
if (/#2aa|#1fa|teal|turquoise|bronze|gold|green/i.test(approvedCss)) {
  fail("Forbidden colour remains in the approved interaction layer");
}

const matteCss = await read("src/components/site/MatteUiFinal.css");
for (const token of [
  "Final matte interaction system",
  ".lp-hero-cta--primary",
  ".lp-hero-cta--secondary",
  '.lp-chip)[data-active="true"]',
  ".lp-caps-detail-inner",
  ".lp-caps-input",
  ".lp-switch--clean",
  ".lp-comparison-body",
  ".lp-solution-cta--clean",
  "backdrop-filter: none !important",
  "border: 0 !important",
]) {
  if (!matteCss.includes(token)) fail(`Final matte visual system is missing ${token}`);
}
if (/mix-blend-mode|lp-bloom-dot|scale\(6\.2\)/i.test(matteCss)) {
  fail("Liquid or bloom decoration remains in the final matte layer");
}

const correctionCss = await read("src/components/site/FinalUserCorrection.css");
for (const token of [
  "Final user correction",
  ".lp-comparison > .lp-switch.lp-switch--clean",
  "visibility: visible !important",
  "content: none !important",
  "border: 0 !important",
]) {
  if (!correctionCss.includes(token)) fail(`Final user correction is missing ${token}`);
}
if (/inset 3px 0 0|mix-blend-mode|lp-bloom-dot/i.test(correctionCss))
  fail("Ornament or liquid decoration remains in final correction");

const clientCss = await read("src/components/site/ClientLandingFinal.css");
for (const token of [
  "CLIENT LANDING",
  "--brand-primary: #ffc79d",
  "The icon is an icon, never an icon tile",
  "@keyframes client-chip-confirm",
  ".page-transition",
  "@keyframes client-page-fade-in",
  "prefers-reduced-motion",
]) {
  if (!clientCss.includes(token)) fail(`Client landing system is missing ${token}`);
}
if (/#19345d|#245fae|#3979ec|#4db6ac|#7b8fa6/i.test(clientCss)) {
  fail("Legacy blue or teal remains in the authoritative client landing layer");
}

const landing = await read("src/components/site/PremiumLanding.tsx");
const homeRoute = await read("src/routes/index.tsx");
for (const token of ["lp-hero-cta--primary", "lp-hero-cta--secondary", "lp-switch--clean"]) {
  if (!landing.includes(token)) fail(`Homepage rebuild is missing ${token}`);
}
for (const token of [
  "lp-button-bloom",
  "lp-bloom-dot",
  "lp-switch-liquid",
  "lp-hero-pick-plus",
  "lp-hero-pick-check",
  "lp-chip-icon",
  "LiquidControlGlow",
]) {
  if (landing.includes(token)) fail(`Removed liquid homepage element remains: ${token}`);
}
if (landing.includes("HomeConversionUpgrade")) {
  fail("Removed homepage pricing section is still mounted in PremiumLanding");
}
if (/hasOfferCatalog|price\s*:\s*["']350["']/.test(homeRoute)) {
  fail("Removed homepage pricing is still present in structured data");
}
for (const [path, content] of [
  ["src/components/site/PremiumLanding.tsx", landing],
  ["src/routes/index.tsx", homeRoute],
  ["src/routes/__root.tsx", rootRoute],
  ["public/widget-loader.js", loader],
]) {
  if (/350\s*€|od\s+350/i.test(content)) fail(`Removed homepage price remains in ${path}`);
}

const conversion = await read("src/components/site/HomeConversionUpgrade.tsx");
for (const token of [
  "Čo potrebujem od klienta",
  "Web a ponuka",
  "Pravidlá a podklady",
  "Získať návrh riešenia",
]) {
  if (!conversion.includes(token)) fail(`Conversion section is missing ${token}`);
}

const contact = await read("src/routes/kontakt.tsx");
const leadClient = await read("src/lib/lead-submission.ts");
for (const token of [
  "submitWebsiteLead",
  'submitState === "done"',
  "contact-consent",
  "Získať návrh riešenia",
]) {
  if (!contact.includes(token)) fail(`Real contact flow is missing ${token}`);
}
for (const token of ["api/lead", "AbortController", 'credentials: "omit"', "fallback"]) {
  if (!leadClient.includes(token)) fail(`Lead client is missing ${token}`);
}

const motion = await read("src/components/site/SiteMotionEnhancements.tsx");
if (!motion.includes('image.loading = index === 0 ? "eager" : "lazy"')) {
  fail("Portfolio images do not preserve lazy loading after the first image");
}
if (/rotateX|rotateY|is-border-tracing/.test(motion)) {
  fail("Noisy legacy motion remains active");
}

const pagesWorkflow = await read(".github/workflows/pages.yml");
for (const token of [
  "Audit production dependencies",
  "Run source and deployment security audit",
  "Validate exported artifact",
  "Verify live deployment",
  "buildKey",
  "TasteSystemFinal.css",
  "live_smoke=success",
]) {
  if (!pagesWorkflow.includes(token)) fail(`Pages workflow is missing ${token}`);
}

const exporter = await read("scripts/export-github-pages.mjs");
for (const token of ["/cookies", "404.html", "build-meta.json", "Chatboty, ktoré"]) {
  if (!exporter.includes(token)) fail(`Static exporter is missing ${token}`);
}

const packageJson = JSON.parse(await read("package.json"));
if (packageJson.private !== true) fail("package.json must remain private");

try {
  await access(new URL("bun.lock", root));
} catch {
  fail("bun.lock is missing");
}

if (failures.length) {
  console.error("Security audit failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`Security audit passed: ${checkedFiles.length} source/config files checked.`);
console.log(
  "Verified: secrets, unsafe primitives, CSP, resilient assistant loading, final matte borderless controls, removed liquid runtime, real lead submission, mobile coverage, static export and live deployment contracts.",
);
