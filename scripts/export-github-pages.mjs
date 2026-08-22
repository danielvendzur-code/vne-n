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
  "/navrh",
  "/sluzby",
  "/projekty",
  "/projekty/derat",
  "/postup",
  "/preco-chatbot",
  "/cennik",
  "/kontakt",
  "/dakujeme",
  "/cookies",
  "/ochrana-udajov",
  "/farby",
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
    if (!homeHtml.includes("Z otázky") || !homeHtml.includes("k výsledku")) {
      throw new Error("Homepage export does not contain the current rebrand hero copy");
    }
    if (
      homeHtml.includes("Váš web odpovie") ||
      homeHtml.includes("Webové nástroje, ktoré odovzdajú hotový dopyt")
    ) {
      throw new Error("Homepage export still contains obsolete hero copy");
    }
  }

  const relative = route.slice(1);
  const directoryTarget =
    route === "/" ? join(output, "index.html") : join(output, relative, "index.html");
  await mkdir(dirname(directoryTarget), { recursive: true });
  await writeFile(directoryTarget, html);

  if (route !== "/") {
    const extensionTarget = join(output, `${relative}.html`);
    await mkdir(dirname(extensionTarget), { recursive: true });
    await writeFile(extensionTarget, html);
  }

  console.log(`exported ${route}`);
}

if (!homeHtml) throw new Error("Homepage was not exported");

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

// Cover both GitHub Pages project mount shapes without changing the public app router.
await cp(output, fallbackSnapshot, { recursive: true });
await mkdir(join(output, projectName), { recursive: true });
await cp(fallbackSnapshot, join(output, projectName), { recursive: true });
await rm(fallbackSnapshot, { recursive: true, force: true });

console.log(`GitHub Pages artifact is ready in ${output}/ and ${output}/${projectName}/`);
