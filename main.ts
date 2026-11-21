// bring-the-humans-03: the entry is the TikTok ad named in VIDEO.json.
// This program's single job is to deliver that file to the grader: read
// VIDEO.json from the bot directory, sanity-check that it parses and
// names a video, then write its exact bytes into the output directory.
//
// Locally, MAKEFUN_BOT_DIR and MAKEFUN_OUTPUT_DIR point at the repo and
// at an out/ folder; on the grader they are /bot and /output.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const botDir = process.env.MAKEFUN_BOT_DIR ?? "/bot";
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

const videoJsonPath = join(botDir, "VIDEO.json");
const raw = readFileSync(videoJsonPath, "utf8");

let parsed: unknown;
try {
  parsed = JSON.parse(raw);
} catch {
  throw new Error(`VIDEO.json in ${botDir} is not valid JSON`);
}

const url = (parsed as { url?: unknown }).url;
// The gate only accepts a full TikTok video address (never a short link
// or a photo post), so refuse anything else here instead of handing the
// grader a file it will score as invalid.
const videoAddress =
  /^https:\/\/(www\.|m\.)?tiktok\.com\/@[^/]+\/video\/\d+$/;
if (typeof url !== "string" || !videoAddress.test(url)) {
  throw new Error("VIDEO.json url is not a TikTok video address");
}

mkdirSync(outputDir, { recursive: true });
writeFileSync(join(outputDir, "VIDEO.json"), raw, "utf8");
