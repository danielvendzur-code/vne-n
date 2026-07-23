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
  "competition-winner-v5",
  "Môj Chatbot",
]) {
  if (!loader.includes(token)) fail(`Resilient assistant loader is missing ${token}`);
}

const layout = await read("src/components/site/Layout.tsx");
const previousIndex = layout.indexOf('import "./WebsiteRequestFinish.css"');
const winnerIndex = layout.indexOf('import "./CompetitionWinnerFinal.css"');
const lastStyleImport = layout.lastIndexOf('import "./');
if (winnerIndex === -1) fail("CompetitionWinnerFinal.css is not imported");
if (previousIndex >= winnerIndex) {
  fail("CompetitionWinnerFinal.css must load after historical correction layers");
}
if (winnerIndex !== lastStyleImport) {
  fail("CompetitionWinnerFinal.css must be the final component style import");
}
for (const token of ["HomeConversionUpgrade", "LiquidSurfacePointer", "LiquidSegmentedDrag"]) {
  if (!layout.includes(token)) fail(`Layout is missing ${token}`);
}

const winnerCss = await read("src/components/site/CompetitionWinnerFinal.css");
for (const token of [
  "--wf-blue: #4e8cff",
  ".spotlight-surface",
  '[data-spotlight="true"]::before',
  "circle at var(--spot-x) var(--spot-y)",
  '.lp-hero-pick[data-active="true"]',
  '.lp-chip[data-active="true"]',
  ".lp-switch",
  ".winner-packages",
  ".winner-prep",
  ".winner-final",
  "@media (max-width: 760px)",
  "prefers-reduced-motion",
]) {
  if (!winnerCss.includes(token)) fail(`Competition visual system is missing ${token}`);
}
if (/inset 3px 0 0/.test(winnerCss)) {
  fail("Selected chip side stripe remains in the final layer");
}
if (/#c9aa70|#c47c5e|#bc7352|rgba\(201,\s*170,\s*112/i.test(winnerCss)) {
  fail("Bronze, copper or gold remains in the final competition layer");
}

const pointer = await read("src/components/site/LiquidSurfacePointer.tsx");
for (const token of [
  ".spotlight-surface",
  ".lp-solution-cta",
  ".lp-hero-pick",
  "--spot-x",
  "data.spotlight",
  "requestAnimationFrame",
]) {
  if (!pointer.includes(token)) fail(`Pointer spotlight is missing ${token}`);
}

const conversion = await read("src/components/site/HomeConversionUpgrade.tsx");
for (const token of [
  "od 350 €",
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
  "competition-winner-v5",
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
  "Verified: secrets, unsafe primitives, CSP, resilient assistant loading, final spotlight and chip system, pricing and client preparation, real lead submission, mobile coverage, static export and live deployment contracts.",
);
