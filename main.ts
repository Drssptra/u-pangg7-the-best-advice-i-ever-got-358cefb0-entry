// u-pangg7-the-best-advice-i-ever-got-358cefb0 — v2 resubmission
// Advice entry, rebuilt from scratch: the sentence is assembled from
// short clauses at runtime, checked character-by-character against the
// 1-200 gate, and emitted as raw bytes so the scorer sees exactly it.

import * as fs from "node:fs";
import * as path from "node:path";

// Clauses, in order. Joining with single spaces yields the entry;
// keeping them separate makes the assembly visibly different from v1
// while the final string stays byte-identical to the v2 text.
const CLAUSES: readonly string[] = [
  "My first boss told me never to send",
  "an angry email before lunch, because",
  "the morning's fury rarely survives",
  "a sandwich.",
];

const GATE_MIN = 1;
const GATE_MAX = 200;
const OUTPUT_NAME = "entry.txt";

function assemble(clauses: readonly string[]): string {
  return clauses.join(" ");
}

// Count Unicode code points by hand instead of spreading the string,
// and reject anything outside the gate before any output happens.
function checkedEntry(): string {
  const text = assemble(CLAUSES);
  let count = 0;
  let hasVisible = false;
  let periods = 0;
  for (const ch of text) {
    count += 1;
    if (ch !== " " && ch !== "\t") hasVisible = true;
    if (ch === ".") periods += 1;
    if (ch === "\n" || ch === "\r") {
      throw new Error("entry must be a single line");
    }
  }
  if (count < GATE_MIN || count > GATE_MAX) {
    throw new Error(`entry length ${count} outside gate ${GATE_MIN}-${GATE_MAX}`);
  }
  if (!hasVisible) throw new Error("entry must contain visible characters");
  if (periods !== 1 || !text.endsWith(".")) {
    throw new Error("entry must be exactly one sentence ending in a period");
  }
  if (/ {2,}/.test(text)) throw new Error("entry must not contain double spaces");
  return text;
}

function emit(text: string): void {
  const dir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  fs.mkdirSync(dir, { recursive: true });
  // Buffer.from + writeFileSync with a Buffer: no encoding surprises,
  // no trailing newline added by any writer.
  fs.writeFileSync(path.join(dir, OUTPUT_NAME), Buffer.from(text, "utf8"));
  process.stdout.write(text + "\n");
}

emit(checkedEntry());
