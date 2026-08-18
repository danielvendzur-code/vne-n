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
  "VITE_ASSISTANT_EMBED_URL",
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
if (/\?v=[\w-]*['"`]/.test(loader)) {
  fail("Resilient assistant loader pins a constant cache key instead of rotating it");
}

const layout = await read("src/components/site/Layout.tsx");
for (const token of [
  'data-brand-studio="true"',
  "BrandStudioShell.css",
  "BrandStudioRoutes.css",
  'className="page-transition"',
]) {
  if (!layout.includes(token)) fail(`Current public layout is missing ${token}`);
}
if (/<AnimatePresence|<motion\./.test(layout)) {
  fail("A Motion route wrapper can disable descendant whileInView reveals");
}

const homeRoute = await read("src/routes/index.tsx");
const home = await read("src/components/site/BrandStudioHome.tsx");
const homeCss = await read("src/components/site/BrandStudioHome.css");
const shellCss = await read("src/components/site/BrandStudioShell.css");
const routesCss = await read("src/components/site/BrandStudioRoutes.css");
for (const token of ["BrandStudioHome", 'data-landing-variant="public"']) {
  if (!homeRoute.includes(token)) fail(`Public homepage route is missing ${token}`);
}
for (const token of [
  "Z návštevy webu spravíme",
  "pripravený dopyt",
  'id="realizacie"',
  'id="cena"',
  "openSiteAssistant",
]) {
  if (!home.includes(token)) fail(`Brand-studio homepage is missing ${token}`);
}
for (const [path, content] of [
  ["BrandStudioHome.css", homeCss],
  ["BrandStudioShell.css", shellCss],
  ["BrandStudioRoutes.css", routesCss],
]) {
  if (!/#5b5ef7/i.test(content)) fail(`${path} is missing the approved blue-violet primary`);
  if (!/prefers-reduced-motion/.test(content) && path !== "BrandStudioShell.css") {
    fail(`${path} is missing reduced-motion handling`);
  }
}
if (/Sparkles|✨|aurora|particle/i.test(home)) {
  fail("Generic AI decoration remains in the new homepage source");
}

const pricing = await read("src/routes/cennik.tsx");
for (const token of [
  "START",
  "od 390 €",
  "29 € / mes.",
  "SMART",
  "od 690 €",
  "39 € / mes.",
  "PRO",
  "od 990 €",
  "59 € / mes.",
  "Čo potrebujeme od vás",
]) {
  if (!pricing.includes(token)) fail(`Current pricing page is missing ${token}`);
}
if (/HomeConversionUpgrade|350 €|10 € \/ mesiac/.test(pricing)) {
  fail("Retired pricing implementation remains on the public pricing route");
}

const contact = await read("src/routes/kontakt.tsx");
const leadClient = await read("src/lib/lead-submission.ts");
const leadApi = await read("src/routes/api.lead.ts");
const leadMail = await read("src/lib/lead-email.ts");
for (const token of ["submitWebsiteLead", 'submitState === "done"', "contact-consent"]) {
  if (!contact.includes(token)) fail(`Real contact flow is missing ${token}`);
}
for (const token of ["api/lead", "AbortController", 'credentials: "omit"', "fallback"]) {
  if (!leadClient.includes(token)) fail(`Lead client is missing ${token}`);
}
if (!leadMail.includes("process.env.RESEND_API_KEY")) fail("Server mail module is missing RESEND_API_KEY");
if (leadMail.includes("import.meta.env")) fail("Server mail module exposes build-time env access");
if (leadClient.includes("RESEND")) fail("Browser lead client references the mail secret provider");
for (const token of [
  "invalid-payload",
  "HEADER_INJECTION",
  "raw.website",
  "rateLimited",
  "too-many-requests",
  "delivery-not-configured",
  "mailtoFallback",
]) {
  if (!leadApi.includes(token)) fail(`Lead API is missing ${token}`);
}

const realizations = await read("src/data/realizations.ts");
for (const token of ["DERAT", "derat.sk", "Môj Plot", "mojplot.sk", "Koverta", "koverta.sk", "WEBKO", "webko.sk"]) {
  if (!realizations.toLowerCase().includes(token.toLowerCase())) {
    fail(`Realization data is missing ${token}`);
  }
}
if (/example\.com|placeholder/i.test(realizations)) fail("Placeholder project remains in realization data");

const pagesWorkflow = await read(".github/workflows/pages.yml");
for (const token of [
  "Audit production dependencies",
  "Run source and deployment security audit",
  "Validate exported artifact",
  "Verify live deployment",
  "Z návštevy webu spravíme",
  "390 €",
  "690 €",
  "990 €",
  "live_smoke=success",
]) {
  if (!pagesWorkflow.includes(token)) fail(`Pages workflow is missing ${token}`);
}

const exporter = await read("scripts/export-github-pages.mjs");
for (const token of ["/cookies", "404.html", "build-meta.json", "Z návštevy webu spravíme"]) {
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
  "Verified: secrets, unsafe primitives, CSP, resilient assistant loading, current brand ownership, pricing, first-party lead submission, real projects, static export and deployment contracts.",
);