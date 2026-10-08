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
    res.writeHead(response.status, Object.fromEntries(response.headers));
    res.end(Buffer.from(await response.arrayBuffer()));
  } catch (e) {
    console.error(e);
    res.writeHead(500);
    res.end(String(e));
  }
}).listen(Number(process.argv[3]), "127.0.0.1", () =>
  console.log("Serving Vercel build on", process.argv[3]),
);
