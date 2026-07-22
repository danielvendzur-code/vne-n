import { cp, mkdir, rm, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

const origin = process.env.PAGES_ORIGIN || "http://127.0.0.1:4173";
const projectName = (process.env.PAGES_BASE || "vne-n").replace(/^\/+|\/+$/g, "");
const base = `/${projectName}`;
const output = "pages-dist";
const fallbackSnapshot = ".pages-dist-snapshot";
const sourceSha = process.env.GITHUB_SHA || "local";

const routes = [
  "/",
  "/sluzby",
  "/projekty",
  "/postup",
  "/kontakt",
  "/cookies",
  "/farby",
  "/projekty/ukazka-01",
  "/projekty/ukazka-02",
  "/projekty/ukazka-03",
  "/projekty/ukazka-04",
  "/projekty/ukazka-05",
  "/projekty/ukazka-06",
];

await rm(output, { recursive: true, force: true });
await rm(fallbackSnapshot, { recursive: true, force: true });
await cp(".output/public", output, { recursive: true });

let homeHtml = "";

for (const route of routes) {
  const response = await fetch(`${origin}${base}${route}`, {
    headers: { "Cache-Control": "no-cache" },
  });
  if (!response.ok) {
    throw new Error(`Static export failed for ${route}: ${response.status}`);
  }

  const html = await response.text();
  if (!html.includes("<html") || !html.includes("</html>")) {
    throw new Error(`Static export returned invalid HTML for ${route}`);
  }

  if (route === "/") {
    homeHtml = html;
    if (!homeHtml.includes("Chatboty, ktoré")) {
      throw new Error("Homepage export does not contain the current chatbot-first hero copy");
    }
    if (homeHtml.includes("Webové nástroje, ktoré odovzdajú hotový dopyt")) {
      throw new Error("Homepage export still contains obsolete hero copy");
    }
  }

  const relative = route.slice(1);
  const directoryTarget =
    route === "/" ? join(output, "index.html") : join(output, relative, "index.html");
  await mkdir(dirname(directoryTarget), { recursive: true });
  await writeFile(directoryTarget, html);

  // GitHub Pages and external links may request /route without a trailing slash.
  // The sibling .html file makes that request resolvable without a platform-specific redirect.
  if (route !== "/") {
    const extensionTarget = join(output, `${relative}.html`);
    await mkdir(dirname(extensionTarget), { recursive: true });
    await writeFile(extensionTarget, html);
  }

  console.log(`exported ${route}`);
}

if (!homeHtml) throw new Error("Homepage was not exported");

// A copy of the application shell is the safest GitHub Pages fallback: the
// client router reads the original URL and renders either the real route or
// the polished in-app 404 screen.
await writeFile(join(output, "404.html"), homeHtml);
await writeFile(join(output, "index.htm"), homeHtml);
await writeFile(join(output, ".nojekyll"), "");
await writeFile(join(output, "health.txt"), `ok\nsource_sha=${sourceSha}\n`);
await writeFile(
  join(output, "build-meta.json"),
  JSON.stringify(
    {
      sourceSha,
      generatedAt: new Date().toISOString(),
      routes,
      projectName,
    },
    null,
    2,
  ),
);

// GitHub Pages normally mounts a project artifact directly at /<repo>/.
// A duplicated project-named directory also covers the alternate mount shape
// that otherwise returns GitHub's generic "File not found" page at /<repo>/.
await cp(output, fallbackSnapshot, { recursive: true });
await mkdir(join(output, projectName), { recursive: true });
await cp(fallbackSnapshot, join(output, projectName), { recursive: true });
await rm(fallbackSnapshot, { recursive: true, force: true });

console.log(`GitHub Pages artifact is ready in ${output}/ and ${output}/${projectName}/`);
