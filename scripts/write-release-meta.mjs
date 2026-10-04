import { execFileSync } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

let sourceSha = process.env.VERCEL_GIT_COMMIT_SHA || process.env.GITHUB_SHA || "";
if (!/^[a-f0-9]{40,64}$/i.test(sourceSha)) {
  try {
    sourceSha = execFileSync("git", ["rev-parse", "HEAD"], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
  } catch {
    sourceSha = "local";
  }
}
const directory = ".vercel/output/static";
await mkdir(directory, { recursive: true });
await writeFile(
  join(directory, "build-meta.json"),
  JSON.stringify(
    {
      sourceSha,
      generatedAt: new Date().toISOString(),
      target: "vercel",
    },
    null,
    2,
  ),
);
console.log(`Vercel release metadata written for ${sourceSha}`);
