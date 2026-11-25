// The Best Advice I Ever Got — make.fun entry
// One sentence about the best advice the author ever received, written
// in this session. The program prints it to stdout and writes it
// byte-for-byte (no trailing newline) to the output file the sealed
// scorer reads, so the entry the judge sees is exactly this text.

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The entry: one sentence, well under the 200-character gate. It names
// the person who said it and the moment it landed, so it reads as a
// memory rather than a slogan.
const ENTRY =
  "My grandmother told me to stop rehearsing disasters that had not happened yet, because today already had enough of its own.";

const MAX_CHARS = 200;

function main(): void {
  // The gate counts characters, not bytes, and refuses whitespace-only
  // text, so guard both before anything is written.
  const length = [...ENTRY].length;
  if (length < 1 || length > MAX_CHARS) {
    throw new Error(`entry is ${length} characters; gate allows 1-200`);
  }
  if (ENTRY.trim().length === 0) {
    throw new Error("entry must not be only whitespace");
  }
  if (!ENTRY.endsWith(".")) {
    throw new Error("entry must be a single complete sentence");
  }

  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, "entry.txt"), ENTRY, "utf8");

  // Stdout carries the entry plus a newline for humans; the file stays
  // exactly the entry, with no trailing newline.
  console.log(ENTRY);
}

main();
