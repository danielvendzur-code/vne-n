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
  const absolute = new URL(`${directory}/`, root);
  const entries = await readdir(absolute, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.name.startsWith(".") && entry.name !== ".github") continue;
    if (excludedDirectories.has(entry.name)) continue;
    const path = join(directory, entry.name).replaceAll("\\", "/");
    if (entry.isDirectory()) {
      await walk(path);
      continue;
    }
    if (!sourceExtensions.has(extname(entry.name))) continue;
    checkedFiles.push(path);
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

  // The scanner necessarily contains the signatures below as detection rules.
  // All other source and configuration files remain subject to these checks.
  if (path !== scannerPath) {
    if (/\beval\s*\(/.test(content)) fail(`eval() detected in ${path}`);
    if (/\bnew\s+Function\s*\(/.test(content)) fail(`new Function() detected in ${path}`);
    if (/document\.write\s*\(/.test(content)) fail(`document.write() detected in ${path}`);
  }
}

const rootRoute = await read("src/routes/__root.tsx");
if (!rootRoute.includes("Content-Security-Policy")) fail("Content Security Policy is missing");
if (!rootRoute.includes("strict-origin-when-cross-origin")) {
  fail("Strict referrer policy is missing");
}
if (!rootRoute.includes("widget-loader.js")) fail("Local resilient widget loader is not used");
if (
  rootRoute.includes(
    '<script src="https://danielvendzur-code.github.io/moj.chatbot.backend/widget.js"',
  )
) {
  fail("Brittle direct external widget script is still present");
}

const loader = await read("public/widget-loader.js");
if (!loader.includes("__DV_ASSISTANT_LOADER_ACTIVE__")) {
  fail("Widget loader duplicate guard is missing");
}
if (!loader.includes("MOUNT_TIMEOUT")) fail("Widget loader mount timeout is missing");
if (!loader.includes("showFallback")) fail("Widget loader fallback is missing");
if (!loader.includes("https://danielvendzur-code.github.io")) {
  fail("Primary HTTPS widget source is missing");
}

const layout = await read("src/components/site/Layout.tsx");
const systemIndex = layout.indexOf('import "./CompetitionSystem.css"');
const routesIndex = layout.indexOf('import "./CompetitionRoutes.css"');
const blackBlueIndex = layout.indexOf('import "./BlackBlueFinal.css"');
const premiumIndex = layout.indexOf('import "./RecoveredMotionFinal.css"');
const lastStyleImport = layout.lastIndexOf('import "./');
if (systemIndex === -1) fail("CompetitionSystem.css is not imported");
if (routesIndex === -1) fail("CompetitionRoutes.css is not imported");
if (blackBlueIndex === -1) fail("BlackBlueFinal.css is not imported");
if (premiumIndex === -1) fail("RecoveredMotionFinal.css is not imported");
if (systemIndex >= routesIndex) {
  fail("CompetitionRoutes.css must load after CompetitionSystem.css");
}
if (routesIndex >= blackBlueIndex) {
  fail("BlackBlueFinal.css must load after CompetitionRoutes.css");
}
if (blackBlueIndex >= premiumIndex) {
  fail("RecoveredMotionFinal.css must load after BlackBlueFinal.css");
}
if (premiumIndex !== lastStyleImport) {
  fail("RecoveredMotionFinal.css must be the final component style import");
}

const competitionCss = await read("src/components/site/CompetitionSystem.css");
for (const token of ["#65e6c1", "#72c7ff", "prefers-reduced-motion", "focus-visible"]) {
  if (!competitionCss.toLowerCase().includes(token.toLowerCase())) {
    fail(`Final design system is missing ${token}`);
  }
}
if (/#c9aa70|#c47c5e|#bc7352/i.test(competitionCss)) {
  fail("Bronze, copper or old primary colours remain in the final design layer");
}

const premiumCss = await read("src/components/site/RecoveredMotionFinal.css");
for (const token of [
  "--premium-blue",
  "backdrop-filter",
  "site-mascot-blink",
  ".lp-switch-liquid",
  "prefers-reduced-motion",
]) {
  if (!premiumCss.includes(token)) fail(`Premium interaction layer is missing ${token}`);
}

const routeCss = await read("src/components/site/CompetitionRoutes.css");
for (const selector of [
  ".sp-hero",
  ".sp-service",
  ".sp-project-card > a",
  ".sp-timeline-progress",
  ".contact-card",
  ".cookies-card",
]) {
  if (!routeCss.includes(selector)) fail(`Route design layer is missing ${selector}`);
}
if (/#c9aa70|#c47c5e|#bc7352|rgba\(201,\s*170,\s*112/i.test(routeCss)) {
  fail("Bronze, copper or gold remains in the final route design layer");
}

const exporter = await read("scripts/export-github-pages.mjs");
for (const token of ["/cookies", "404.html", "build-meta.json", "Chatboty, ktoré"]) {
  if (!exporter.includes(token)) fail(`Static exporter is missing ${token}`);
}

const pagesWorkflow = await read(".github/workflows/pages.yml");
for (const token of [
  "Audit production dependencies",
  "Run source and deployment security audit",
  "Validate exported artifact",
  "Verify live deployment",
  "/cookies/",
  "/build-meta.json",
  "live_smoke=success",
]) {
  if (!pagesWorkflow.includes(token)) fail(`Pages workflow is missing ${token}`);
}

const packageJson = JSON.parse(await read("package.json"));
if (packageJson.private !== true) {
  fail("package.json must remain private to prevent accidental publishing");
}

try {
  await access(new URL("bun.lock", root));
} catch {
  fail("bun.lock is missing; reproducible dependency installation is not guaranteed");
}

if (failures.length) {
  console.error("Security audit failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`Security audit passed: ${checkedFiles.length} source/config files checked.`);
console.log(
  "Verified: secrets, unsafe runtime primitives, CSP, referrer policy, widget fallback, all final design layers, route export, dependency audit and live smoke contracts.",
);
