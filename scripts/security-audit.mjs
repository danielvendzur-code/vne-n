import { readFile, readdir } from "node:fs/promises";
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
  "qa-results",
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

  if (path === scannerPath) continue;
  if (/\beval\s*\(/.test(content)) fail(`eval() detected in ${path}`);
  if (/\bnew\s+Function\s*\(/.test(content)) fail(`new Function() detected in ${path}`);
  if (/document\.write\s*\(/.test(content)) fail(`document.write() detected in ${path}`);
  if (/\b(?:href|to)\s*=\s*(?:\{\s*)?["'`]\/\/[^/]/.test(content)) {
    fail(`Protocol-relative link detected in ${path}`);
  }
}

const rootRoute = await read("src/routes/__root.tsx");
for (const token of [
  "Content-Security-Policy",
  "strict-origin-when-cross-origin",
  "widget-loader.js",
  "safeAssistantEmbedUrl",
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
  fail("Assistant loader pins a constant cache key instead of rotating it");
}
if (
  !loader.includes('anchor.href = internalHref("/kontakt")') ||
  !loader.includes('anchor.setAttribute("aria-label"')
) {
  fail("Assistant fallback is missing its accessible contact destination");
}

const layout = await read("src/components/site/Layout.tsx");
for (const token of ['import "./Rebrand.css"', 'import "./RebrandPages.css"']) {
  if (!layout.includes(token)) fail(`Layout is missing ${token}`);
}
const legacyLayers = [
  "CompetitionWinnerFinal.css",
  "TasteSystemFinal.css",
  "ApprovedInteractionsFinal.css",
  "MatteUiFinal.css",
  "FinalUserCorrection.css",
  "BrandSystemFinal.css",
  "ClientLandingFinal.css",
  "SiteFinish.css",
  "TeamMotionUpgrade.css",
  "LimeWhiteBrandFinal.css",
  "ProfessionalHarmonyFinal.css",
  "FinalSmoothTexturePolish.css",
];
for (const legacy of legacyLayers) {
  if (layout.includes(legacy)) fail(`Legacy visual override is still imported: ${legacy}`);
}
if (!layout.includes('className="page-transition"')) {
  fail("Layout is missing the route transition boundary");
}
for (const runtimePatch of [
  "SiteMotionEnhancements",
  "SiteFunnelBridge",
  "useSpotlight",
  "useSettledSections",
]) {
  if (layout.includes(runtimePatch)) {
    fail(`Legacy runtime visual patch is still mounted: ${runtimePatch}`);
  }
}

const brandCss = await read("src/components/site/Rebrand.css");
for (const token of [
  "--paper: #f2f0e8",
  "--pure: #fcfbf7",
  "--ink: #111310",
  "--forest: #12372d",
  "prefers-reduced-motion",
  "@media (max-width: 720px)",
]) {
  if (!brandCss.includes(token)) fail(`Global rebrand system is missing ${token}`);
}
if (/backdrop-filter:\s*blur\(/i.test(brandCss)) {
  fail("Glassmorphism blur is present in the global rebrand system");
}

const landing = await read("src/components/site/PremiumLanding.tsx");
for (const token of [
  "Od otázky",
  "HeroCollage",
  "FlowStory",
  "SelectedWork",
  "CoreTools",
  "PRE FIRMY SO SLUŽBAMI",
  "PRE E-SHOPY",
  "Produktový poradca",
  "ProofAndPrice",
]) {
  if (!landing.includes(token)) fail(`Homepage story is missing ${token}`);
}
if (!landing.includes('import "./AwardHome.css"')) {
  fail("Homepage does not own its dedicated art-direction stylesheet");
}
if (/\+\s*\d+\s*%|\d+×|conversion\s+rate/i.test(landing)) {
  fail("Unsupported marketing metric is present on the homepage");
}

const homeCss = await read("src/components/site/AwardHome.css");
for (const token of [
  "--hh-lime: #c8f06a",
  ".hybrid-hero__collage",
  ".hybrid-flow__track",
  ".hybrid-work__grid",
  ".hybrid-audience",
  ".hybrid-tool",
  "body:has(.hybrid-home)",
  "@media (max-width: 720px)",
  "prefers-reduced-motion",
]) {
  if (!homeCss.includes(token)) fail(`Homepage art direction is missing ${token}`);
}
if (/backdrop-filter:\s*blur\(/i.test(homeCss)) {
  fail("Glassmorphism blur is present in the homepage art direction");
}

const contact = await read("src/routes/kontakt.tsx");
for (const token of [
  "cleanField",
  "contact-website",
  "contact-consent",
  "submitWebsiteLead",
  "result.fallback",
  "dakujeme",
]) {
  if (!contact.includes(token)) fail(`Contact flow is missing ${token}`);
}

const leadClient = await read("src/lib/lead-submission.ts");
for (const token of ["api/lead", "AbortController", 'credentials: "omit"', "fallback"]) {
  if (!leadClient.includes(token)) fail(`Lead client is missing ${token}`);
}

const leadRoute = await read("src/routes/api.lead.ts");
for (const token of ["POST", "consent", "website", "RESEND_API_KEY"]) {
  if (!leadRoute.includes(token)) fail(`Lead endpoint is missing ${token}`);
}

const homeRoute = await read("src/routes/index.tsx");
if (/hasOfferCatalog|price\s*:\s*["'](?:497|500)["']/.test(homeRoute)) {
  fail("Homepage structured data contains a hard-coded commercial offer");
}

const pricing = await read("src/routes/cennik.tsx");
for (const token of ["od 347 €", "od 447 €", "10 € / mesiac"]) {
  if (!pricing.includes(token)) fail(`Pricing page is missing verified public price ${token}`);
}

const pagesWorkflow = await read(".github/workflows/pages.yml");
for (const token of [
  "Run source and deployment security audit",
  "Validate exported artifact",
  "Verify production build",
]) {
  if (!pagesWorkflow.includes(token)) fail(`Pages workflow is missing ${token}`);
}

if (failures.length) {
  console.error("Security audit failed:\n" + failures.map((item) => `- ${item}`).join("\n"));
  process.exit(1);
}

console.log(`Security audit passed (${checkedFiles.length} files scanned).`);
