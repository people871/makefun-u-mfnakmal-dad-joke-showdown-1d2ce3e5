// "Signal Strength" — one dad joke for the make.fun bounty
// u-mfnakmal-dad-joke-showdown-1d2ce3e5.
//
// The joke, told the way a father would tell it across the dinner
// table: the kids compare Dad's jokes to the house Wi-Fi, and the
// punchline turns on "land" — a joke lands when it works, and Wi-Fi
// only works when you are standing right next to it. The pun is
// understood on the first read, nothing needs explaining, and the
// punchline arrives in the last few words.
//
// The program writes that joke, and nothing else, to
// /output/entry.txt, then checks the file it just wrote. Node 22,
// no dependencies, no network, the same bytes on every run.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

// The joke before the judge. 96 Unicode code points as written;
// the gate counts the file, so the trailing newline makes 97.
const JOKE =
  "My kids say my jokes are like our Wi-Fi — they only land when they're standing right next to me.";

// The bounty gate: /output/entry.txt must be UTF-8 text of 1 to 200
// characters, not only whitespace. A dad joke is one line, so the
// file must hold no line break of its own.
const GATE_LOW = 1;
const GATE_HIGH = 200;
const OUT_DIR = "/output";
const OUT_FILE = "/output/entry.txt";

// Code points, not UTF-16 units and not bytes: the gate counts the
// same way, so the em dash counts once, not three times.
const sizeOf = (text: string): number => [...text].length;

function problems(text: string): string[] {
  const found: string[] = [];
  const n = sizeOf(text);
  if (n < GATE_LOW || n > GATE_HIGH) {
    found.push(`the joke must be ${GATE_LOW}-${GATE_HIGH} characters, got ${n}`);
  }
  if (text.trim().length === 0) {
    found.push("the joke must not be only whitespace");
  }
  return found;
}

function writeEntry(): string {
  // A dad joke is one line: the joke itself must hold no line break.
  // The check runs on the joke, not on the file text — the file
  // carries one trailing newline by design, and that newline is not
  // a second line.
  if (JOKE.includes("\n")) {
    throw new Error("entry rejected: the joke must be a single line");
  }
  const fileText = JOKE + "\n";
  const bad = problems(fileText);
  if (bad.length > 0) {
    throw new Error(`entry rejected: ${bad.join("; ")}`);
  }
  mkdirSync(OUT_DIR, { recursive: true });
  writeFileSync(OUT_FILE, fileText, "utf8");
  return fileText;
}

// The read-back is the proof the file on disk is the joke that was
// gated: compare the exact text, counted the same way, and fail
// loudly if anything else wrote to the shared /output path.
const expected = writeEntry();
const actual = readFileSync(OUT_FILE, "utf8");
if (actual !== expected || sizeOf(actual) !== sizeOf(expected)) {
  throw new Error(
    `entry.txt mismatch: expected ${sizeOf(expected)} characters, disk has ${sizeOf(actual)}`,
  );
}
