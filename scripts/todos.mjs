// Lists every open TODO in src/content/site.ts (values written as todo("…")).
import { readFileSync } from "node:fs";

const file = new URL("../src/content/site.ts", import.meta.url);
const lines = readFileSync(file, "utf8").split("\n");
const open = lines
  .map((line, i) => ({ line: line.trim(), n: i + 1 }))
  .filter(({ line }) => /\btodo\(/.test(line) && !line.startsWith("import") && !line.startsWith("*"));

if (!open.length) {
  console.log("No open TODOs in src/content/site.ts 🎉");
} else {
  console.log(`${open.length} open TODO(s) in src/content/site.ts:\n`);
  for (const { line, n } of open) console.log(`  line ${n}: ${line}`);
}
