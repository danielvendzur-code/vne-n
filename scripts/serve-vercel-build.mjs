import { createServer } from "node:http";
import { stat } from "node:fs/promises";
import { createReadStream } from "node:fs";
import { resolve, extname } from "node:path";
import { pathToFileURL } from "node:url";
const root = resolve(process.argv[2], ".vercel/output");
const handler = (await import(pathToFileURL(resolve(root, "functions/__server.func/index.mjs"))))
  .default;
const types = {
  ".js": "text/javascript",
  ".mjs": "text/javascript",
  ".css": "text/css",
  ".webp": "image/webp",
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".woff2": "font/woff2",
  ".mp4": "video/mp4",
  ".svg": "image/svg+xml",
  ".json": "application/json",
};
createServer(async (req, res) => {
  try {
    const pathname = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
    const file = resolve(root, "static", "." + pathname);
    if (file.startsWith(resolve(root, "static") + "/")) {
      const info = await stat(file).catch(() => null);
      if (info?.isFile()) {
        res.setHeader("Content-Type", types[extname(file)] || "application/octet-stream");
        res.setHeader("Content-Length", info.size);
        createReadStream(file).pipe(res);
        return;
      }
    }
    const chunks = [];
    for await (const c of req) chunks.push(c);
    const request = new Request("http://127.0.0.1:" + process.argv[3] + req.url, {
      method: req.method,
      headers: req.headers,
      ...(!["GET", "HEAD"].includes(req.method)
        ? { body: Buffer.concat(chunks), duplex: "half" }
        : {}),
    });
    const response = await handler.fetch(request, {});
    const headers = new Headers(response.headers);
    let body = Buffer.from(await response.arrayBuffer());

    // Only this HTTP-only test server omits the production HTTPS-upgrade rule.
    // WebKit otherwise upgrades http://127.0.0.1 resources to HTTPS and cannot
    // hydrate the page. The real HTTPS deployment keeps its original CSP.
    const omitLocalUpgrade = (value) =>
      value.replace(/;\\s*upgrade-insecure-requests\\b/g, "");
    if (headers.has("content-security-policy")) {
      headers.set(
        "content-security-policy",
        omitLocalUpgrade(headers.get("content-security-policy") || ""),
      );
    }
    if ((headers.get("content-type") || "").includes("text/html")) {
      body = Buffer.from(omitLocalUpgrade(body.toString("utf8")));
      headers.set("content-length", String(body.byteLength));
    }
    res.writeHead(response.status, Object.fromEntries(headers));
    res.end(body);
  } catch (e) {
    console.error(e);
    res.writeHead(500);
    res.end(String(e));
  }
}).listen(Number(process.argv[3]), "127.0.0.1", () =>
  console.log("Serving Vercel build on", process.argv[3]),
);
