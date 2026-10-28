import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import ts from "typescript";
const src = await readFile(
  new URL("../src/lib/featuredClip.ts", import.meta.url),
  "utf8",
);
const {
  FeaturedClipPlayback,
  readFeaturedMuted,
  saveFeaturedMuted,
  FEATURED_SOUND_KEY,
} = await import(
  "data:text/javascript;base64," +
    Buffer.from(
      ts.transpileModule(src, {
        compilerOptions: { module: ts.ModuleKind.ESNext },
      }).outputText,
    ).toString("base64")
);
let saved = null;
globalThis.localStorage = {
  getItem: () => saved,
  setItem: (k, v) => {
    assert.equal(k, FEATURED_SOUND_KEY);
    saved = v;
  },
};
assert.equal(readFeaturedMuted(), false);
saveFeaturedMuted(true);
assert.equal(readFeaturedMuted(), true);
saveFeaturedMuted(false);
assert.equal(readFeaturedMuted(), false);
saved = "invalid";
assert.equal(readFeaturedMuted(), false);
globalThis.localStorage = {
  getItem() {
    throw Error("blocked");
  },
  setItem() {
    throw Error("blocked");
  },
};
assert.equal(readFeaturedMuted(), false);
saveFeaturedMuted(true);
const policy = () =>
  Object.assign(Error("Policy"), { name: "NotAllowedError" });
let calls = [],
  states = [],
  failed = 0,
  wanted = true;
const media = {
  muted: false,
  pause() {
    calls.push("pause");
  },
  async play() {
    calls.push(this.muted);
    if (!this.muted) throw policy();
  },
};
let player = new FeaturedClipPlayback(
  media,
  () => wanted,
  (m) => states.push(m),
  () => failed++,
);
await player.play(false);
assert.deepEqual(calls, [false, true]);
assert.equal(media.muted, true);
assert.equal(failed, 0);
calls = [];
await player.play(false);
assert.deepEqual(calls, [true]); // policy mute is sticky for this element, not persisted
media.play = async function () {
  calls.push(this.muted);
};
calls = [];
await player.play(false, true);
assert.deepEqual(calls, [false]);
assert.equal(media.muted, false);
calls = [];
await player.play(true, true);
assert.deepEqual(calls, [true]);
let reject;
media.play = () =>
  new Promise((_, r) => {
    reject = r;
  });
calls = [];
const old = player.play(false);
await player.play(false);
player.stop();
reject(policy());
await old;
assert.deepEqual(calls, ["pause"]); // stale rejection cannot restart offscreen audio
media.play = async () => {
  throw Object.assign(Error("bad source"), { name: "NotSupportedError" });
};
await player.play(false);
assert.equal(failed, 1);
media.play = async () => {
  throw Object.assign(Error("source changed"), { name: "AbortError" });
};
await player.play(false);
assert.equal(failed, 1);
media.play = async () => {
  throw policy();
};
await player.play(false);
assert.equal(failed, 1); // fully blocked browser keeps poster/controls, no fake media failure
wanted = false;
calls = [];
await player.play(false);
assert.deepEqual(calls, []);
console.log(
  "Featured clip checks passed: preference storage/denial, sound-first, muted fallback, explicit override, deduplication, stale cancellation and real errors.",
);
