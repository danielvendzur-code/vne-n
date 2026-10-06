// Run after building the sibling moj.chatbot.backend repository.
import { cp, mkdir, stat } from "node:fs/promises";
import { resolve } from "node:path";
const source = resolve(process.argv[2] || "../backend/dist");
const target = resolve("public/assistant");
for (const file of ["widget.js", "widget.css"]) await stat(resolve(source, file));
await mkdir(target, { recursive: true });
for (const file of ["widget.js", "widget.css", "fonts"]) {
  await cp(resolve(source, file), resolve(target, file), { recursive: true });
}
console.log("Updated the same-origin assistant from", source);
