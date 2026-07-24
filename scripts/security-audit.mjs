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
  "taste-system-v7",
  "Môj Chatbot",
]) {
  if (!loader.includes(token)) fail(`Resilient assistant loader is missing ${token}`);
}

const layout = await read("src/components/site/Layout.tsx");
const previousIndex = layout.indexOf('import "./WebsiteRequestFinish.css"');
const winnerIndex = layout.indexOf('import "./CompetitionWinnerFinal.css"');
const tasteIndex = layout.indexOf('import "./TasteSystemFinal.css"');
const lastStyleImport = layout.lastIndexOf('import "./');
if (winnerIndex === -1) fail("CompetitionWinnerFinal.css is not imported");
if (tasteIndex === -1) fail("TasteSystemFinal.css is not imported");
if (previousIndex >= winnerIndex || winnerIndex >= tasteIndex) {
  fail("TasteSystemFinal.css must load after every historical visual layer");
}
if (tasteIndex !== lastStyleImport) {
  fail("TasteSystemFinal.css must be the final component style import");
}
for (const token of ["LiquidSurfacePointer", "LiquidSegmentedDrag"]) {
  if (!layout.includes(token)) fail(`Layout is missing ${token}`);
}
if (layout.includes("HomeConversionUpgrade")) {
  fail("The removed duplicate homepage ending is still mounted in Layout");
}

const indexRoute = await read("src/routes/index.tsx");
if (!indexRoute.includes("CompetitionLanding")) {
  fail("Homepage route is not using CompetitionLanding");
}
if (indexRoute.includes("PremiumLanding")) {
  fail("Homepage route still mounts the historical PremiumLanding");
}

const competitionHome = await read("src/components/site/CompetitionLanding.tsx");
for (const token of [
  "Web, ktorý odpovedá, počíta",
  "cx-metal-button",
  "cx-choice-chip",
  "DeratScrollStory",
  "Reálne rozhrania. Nie generické makety.",
  "od 350 €",
  "FinalOffer",
]) {
  if (!competitionHome.includes(token)) fail(`Competition homepage is missing ${token}`);
}
for (const section of [
  "<Hero />",
  "<ProofBar />",
  "<DeratScrollStory />",
  "<Solutions />",
  "<Portfolio />",
  "<Process />",
  "<Faq />",
  "<FinalOffer />",
]) {
  if (!competitionHome.includes(section)) fail(`Competition homepage is missing section ${section}`);
}

const winnerCss = await read("src/components/site/CompetitionWinnerFinal.css");
for (const token of [
  "--wf-blue: #4e8cff",
  ".spotlight-surface",
  '.lp-hero-pick[data-active="true"]',
  ".lp-switch",
  "@media (max-width: 760px)",
  "prefers-reduced-motion",
]) {
  if (!winnerCss.includes(token)) fail(`Historical competition layer is missing ${token}`);
}
if (/#c9aa70|#c47c5e|#bc7352|rgba\(201,\s*170,\s*112/i.test(winnerCss)) {
  fail("Bronze, copper or gold remains in the historical competition layer");
}

const tasteCss = await read("src/components/site/TasteSystemFinal.css");
for (const token of [
  "Taste-system final layer",
  "--taste-font",
  "--taste-display",
  "Pressed-metal button adapted",
  ".cx-metal-button__inner",
  '.cx-choice-chip[data-active="true"]',
  ".cx-static-tag",
  ".cx-project-card",
  "@media (max-width: 760px)",
  "@media (prefers-reduced-motion: reduce)",
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

const pointer = await read("src/components/site/LiquidSurfacePointer.tsx");
for (const token of ["--spot-x", "dataset.spotlight", "requestAnimationFrame"]) {
  if (!pointer.includes(token)) fail(`Pointer tracker is missing ${token}`);
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
  "CompetitionLanding",
  "taste-system-v7",
  "TasteSystemFinal.css",
  "live_smoke=success",
]) {
  if (!pagesWorkflow.includes(token)) fail(`Pages workflow is missing ${token}`);
}

const exporter = await read("scripts/export-github-pages.mjs");
for (const token of [
  "/cookies",
  "404.html",
  "build-meta.json",
  "Web, ktorý odpovedá, počíta",
  "Získať návrh riešenia",
]) {
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
  "Verified: secrets, unsafe primitives, CSP, resilient assistant loading, competition homepage structure, pressed-metal CTA, compact chip system, real lead submission, responsive coverage, static export and live deployment contracts.",
);
