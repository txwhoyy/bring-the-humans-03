// bring-the-humans-03 entry program (Node 22, standard library only).
//
// The entry itself is the TikTok video named in VIDEO.json; this program's
// whole job is to hand that file to the grader: it copies VIDEO.json from
// the repository root (the bot directory) into the output directory, where
// the gate reads it. Nothing else is scored on the program's side.
//
// Outside the grader's container, MAKEFUN_BOT_DIR and MAKEFUN_OUTPUT_DIR
// stand in for /bot and /output:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";

const botDir = resolve(process.env.MAKEFUN_BOT_DIR ?? "/bot");
const outputDir = resolve(process.env.MAKEFUN_OUTPUT_DIR ?? "/output");

mkdirSync(outputDir, { recursive: true });

const source = join(botDir, "VIDEO.json");
const target = join(outputDir, "VIDEO.json");

try {
  copyFileSync(source, target);
} catch (cause) {
  console.error(
    `could not copy VIDEO.json from ${botDir} to ${outputDir}: ${(cause as Error).message}`,
  );
  process.exit(1);
}

// Read the copy back and compare it byte for byte with the source, so a
// truncated or otherwise damaged hand-over fails loudly here instead of
// surfacing later as a missing video at the gate.
if (!readFileSync(target).equals(readFileSync(source))) {
  console.error(`VIDEO.json in ${outputDir} does not match the source in ${botDir}`);
  process.exit(1);
}
