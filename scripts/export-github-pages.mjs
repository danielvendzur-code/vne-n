import { cp, mkdir, rm, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

const origin = process.env.PAGES_ORIGIN || "http://127.0.0.1:4173";
const base = `/${(process.env.PAGES_BASE || "vne-n").replace(/^\/+|\/+$/g, "")}`;
const output = "pages-dist";

const routes = [
  "/",
  "/sluzby",
  "/projekty",
  "/postup",
  "/kontakt",
  "/projekty/ukazka-01",
  "/projekty/ukazka-02",
  "/projekty/ukazka-03",
  "/projekty/ukazka-04",
  "/projekty/ukazka-05",
  "/projekty/ukazka-06",
];

await rm(output, { recursive: true, force: true });
await cp(".output/public", output, { recursive: true });

for (const route of routes) {
  const response = await fetch(`${origin}${base}${route}`);
  if (!response.ok) {
    throw new Error(`Static export failed for ${route}: ${response.status}`);
  }

  const target =
    route === "/" ? join(output, "index.html") : join(output, route.slice(1), "index.html");
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, await response.text());
  console.log(`exported ${route}`);
}

const notFound = await fetch(`${origin}${base}/page-that-does-not-exist`);
await writeFile(join(output, "404.html"), await notFound.text());
await writeFile(join(output, ".nojekyll"), "");

console.log(`GitHub Pages artifact is ready in ${output}/`);
