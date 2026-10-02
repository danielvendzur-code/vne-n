import { mkdtempSync, readFileSync, writeFileSync, mkdirSync, symlinkSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

// Install the committed Bun graph without changing either repository lockfile.
// These cached artifacts are public npm packages with identical integrity hashes.
const root = process.cwd();
const stage = mkdtempSync(join(tmpdir(), "vne-locked-install-"));
let status = 1;
try {
  for (const file of ["package.json", "bunfig.toml"]) {
    writeFileSync(join(stage, file), readFileSync(join(root, file)));
  }
  const lock = readFileSync(join(root, "bun.lock"), "utf8").replaceAll(
    "https://europe-west4-npm.pkg.dev/lovable-core-prod/sandbox-npm-cache/",
    "https://registry.npmjs.org/",
  );
  writeFileSync(join(stage, "bun.lock"), lock);
  mkdirSync(join(root, "node_modules"), { recursive: true });
  symlinkSync(join(root, "node_modules"), join(stage, "node_modules"), "dir");
  const result = spawnSync("bun", ["install", "--frozen-lockfile", "--cwd", stage], {
    stdio: "inherit",
  });
  if (result.error) throw result.error;
  status = result.status ?? 1;
} finally {
  rmSync(stage, { recursive: true, force: true });
}
process.exitCode = status;
