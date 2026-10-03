import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

// The committed Bun lock contains five private Lovable mirror URLs. Seed the
// cache from npm using the SAME locked versions and SHA-512 integrity values,
// then install the untouched committed lockfile. Never disable verification.
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const staging = mkdtempSync(join(tmpdir(), "moj-chatbot-install-"));
const env = {
  ...process.env,
  BUN_INSTALL_CACHE_DIR:
    process.env.BUN_INSTALL_CACHE_DIR || join(tmpdir(), "moj-chatbot-bun-cache"),
};
try {
  writeFileSync(join(staging, "package.json"), readFileSync(join(root, "package.json")));
  const lock = readFileSync(join(root, "bun.lock"), "utf8");
  writeFileSync(
    join(staging, "bun.lock"),
    lock.replaceAll(
      "https://europe-west4-npm.pkg.dev/lovable-core-prod/sandbox-npm-cache/",
      "https://registry.npmjs.org/",
    ),
  );
  execFileSync(process.execPath, ["install", "--frozen-lockfile"], {
    cwd: staging,
    env,
    stdio: "inherit",
  });
  execFileSync(process.execPath, ["install", "--frozen-lockfile"], {
    cwd: root,
    env,
    stdio: "inherit",
  });
} finally {
  rmSync(staging, { recursive: true, force: true });
}
