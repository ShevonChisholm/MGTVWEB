import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import ts from "typescript"

const source = await readFile(
  new URL("../src/lib/playback.ts", import.meta.url),
  "utf8",
)
const js = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext },
}).outputText
const {
  playbackReducer: reduce,
  initialPlayback: initial,
  formatTime,
} = await import(
  `data:text/javascript;base64,${Buffer.from(js).toString("base64")}`
)
const a = { id: "tr1", duration: 12 }
const b = { id: "tr2", duration: 21, behavior: "buffer-once" }
const c = { id: "tr8", duration: 31, behavior: "fail-first-attempt" }
const v = { id: "e102", duration: 40, initial: 24 }
const ready = (s, owner = s.owner) =>
  reduce(s, { type: "ready", owner, generation: s[owner].generation })
const tick = (s, count) => {
  for (let i = 0; i < count; i++) s = reduce(s, { type: "tick", seconds: 1 })
  return s
}
const play = (s, owner) => reduce(s, { type: "play", owner })
const context = (media = [a, b, c]) =>
  reduce(initial, {
    type: "audioContext",
    media,
    index: 0,
    origin: "Test playlist",
  })
let state = ready(context())
assert.equal(state.audio.status, "playing")
state = tick(state, 3)
assert.equal(state.audio.elapsed, 3)
const snapshot = state.queue.map((entry) => entry.media.id)
const generation = state.audio.generation
state = reduce(state, { type: "prepareVideo", media: v })
assert.equal(state.owner, "audio", "Opening a video must not pause audio")
assert.equal(
  state.video.elapsed,
  24,
  "Seed each item with its own initial progress",
)
state = play(state, "video")
assert.equal(state.audio.status, "paused")
assert.equal(state.audioPausedForVideo, true)
state = ready(state)
state = tick(state, 2)
assert.equal(state.audio.elapsed, 3, "Audio must not tick during video")
assert.equal(state.video.elapsed, 26)
state = reduce(state, { type: "release", owner: "video", id: v.id })
assert.equal(state.owner, null)
assert.equal(state.audio.status, "paused", "Leaving video never resumes audio")
assert.deepEqual(
  state.queue.map((entry) => entry.media.id),
  snapshot,
)
state = ready(play(state, "audio"))
assert.equal(state.audio.elapsed, 3)
assert.equal(state.video.status, "paused")
assert.equal(state.audioPausedForVideo, false)
assert.deepEqual(
  reduce(state, { type: "ready", owner: "audio", generation }),
  state,
  "Stale loading callbacks cannot revive old sessions",
)
state = reduce(state, { type: "seek", owner: "audio", elapsed: 11 })
state = tick(state, 1)
assert.equal(state.index, 1)
assert.equal(state.audio.media.id, "tr2")
assert.equal(state.audio.status, "loading")
state = ready(state)
state = tick(state, 10)
assert.equal(state.audio.status, "buffering")
const bufferToken = state.audio.generation
state = reduce(state, { type: "pause", owner: "audio" })
assert.equal(
  reduce(state, { type: "ready", owner: "audio", generation: bufferToken })
    .audio.status,
  "paused",
)
state = ready(play(state, "audio"))
state = tick(state, 1)
assert.equal(state.audio.status, "playing", "One-time buffer must not recur")
state = reduce(state, { type: "finish", owner: "audio" })
assert.equal(state.audio.media.id, "tr8")
state = ready(state)
assert.equal(state.audio.status, "unavailable")
assert.equal(state.audio.retryable, true)
state = ready(play(state, "audio"))
assert.equal(
  state.audio.status,
  "playing",
  "Retry succeeds after deterministic first failure",
)
state = reduce(state, { type: "finish", owner: "audio" })
assert.equal(state.audio.status, "ended")
assert.equal(state.audio.elapsed, c.duration)
assert.equal(state.owner, null)
state = tick(state, 10)
assert.equal(state.audio.status, "ended", "Queue end must stop, not wrap")
assert.equal(reduce(state, { type: "next" }).audio.media.id, "tr8")
state = ready(play(state, "audio"))
assert.equal(
  state.audio.elapsed,
  0,
  "Play after end restarts only the selected item",
)
state = reduce(state, { type: "replay" })
assert.equal(state.index, 0)

state = context([a, b])
const sourceQueue = state.queue
state = reduce(state, { type: "enqueue", media: a, next: true })
assert.equal(state.queue.length, 3)
assert.equal(
  new Set(state.queue.map((entry) => entry.key)).size,
  3,
  "Duplicate media occurrences need unique identities",
)
assert.equal(
  sourceQueue.length,
  2,
  "Queue changes cannot mutate an old snapshot",
)
const currentKey = state.queue[0].key
assert.deepEqual(
  reduce(state, { type: "move", key: currentKey, direction: 1 }),
  state,
  "Current occurrence cannot be reordered",
)
state = reduce(state, { type: "move", key: state.queue[2].key, direction: -1 })
assert.deepEqual(
  state.queue.map((entry) => entry.media.id),
  ["tr1", "tr2", "tr1"],
)
state = reduce(state, { type: "remove", key: state.queue[1].key })
assert.equal(state.audio.media.id, a.id)
assert.equal(state.queue.length, 2)
state = reduce(state, { type: "pause", owner: "audio" })
state = reduce(state, { type: "remove", key: currentKey })
assert.equal(
  state.audio.status,
  "paused",
  "Current removal retains paused intent",
)
assert.equal(state.audio.elapsed, 0)
state = reduce(state, { type: "remove", key: state.queue[0].key })
assert.equal(
  state.audio,
  null,
  "Removing final current occurrence clears mini-player",
)
state = ready(context([a]))
state = reduce(state, { type: "prepareVideo", media: v })
state = ready(play(state, "video"))
state = reduce(state, { type: "clear" })
assert.equal(
  state.video.status,
  "playing",
  "Clearing audio does not stop video",
)
assert.equal(state.owner, "video")
state = reduce(state, { type: "prepareVideo", media: { ...v, id: "next" } })
state = play(state, "video")
assert.equal(
  reduce(state, { type: "release", owner: "video", id: v.id }).video.status,
  "loading",
  "Old component cleanup must not pause next video",
)
state = ready(state)
state = reduce(state, { type: "seek", owner: "video", elapsed: 999 })
assert.equal(state.video.elapsed, 40)
assert.equal(state.video.status, "ended")
assert.equal(
  state.video.completed,
  false,
  "Seeking to end must not request autoplay",
)
state = ready(play(state, "video"))
state = reduce(state, { type: "finish", owner: "video" })
assert.equal(state.video.completed, true)
assert.deepEqual(
  reduce(state, { type: "finish", owner: "video" }),
  state,
  "Completion is idempotent",
)
state = reduce(state, {
  type: "prepareVideo",
  media: { id: "b-live", live: true },
})
state = ready(play(state, "video"))
state = tick(state, 80)
assert.equal(state.video.status, "playing")
assert.equal(state.video.elapsed, 80)
assert.equal(
  reduce(state, { type: "seek", owner: "video", elapsed: 10 }).video.elapsed,
  80,
)
assert.equal(
  reduce(state, { type: "finish", owner: "video" }).video.status,
  "playing",
  "Live must not have finite completion",
)
state = reduce(state, { type: "prepareVideo", media: { id: "missing" } })
assert.equal(state.video.status, "unavailable")
state = reduce(state, {
  type: "prepareVideo",
  media: {
    id: "permanent",
    live: true,
    unavailable: "No stream",
    retryable: false,
  },
})
assert.equal(play(state, "video").video.status, "unavailable")
assert.deepEqual(context([{ id: "bad" }]), initial)
state = reduce(initial, { type: "prepareVideo", media: { id: "completed-episode", duration: 20, initial: 20 } })
state = play(state, "video")
assert.equal(state.video.elapsed, 0, "Explicit Play replays a previously completed episode from the start")
state = ready(state)
state = tick(state, 4)
state = reduce(state, { type: "prepareVideo", media: v })
state = reduce(state, { type: "prepareVideo", media: { id: "completed-episode", duration: 20 } })
assert.equal(state.video.elapsed, 4, "Video position is remembered by canonical ID")
state = ready(play(state, "video"))
state = reduce(state, { type: "finish", owner: "video" })
state = reduce(state, { type: "prepareVideo", media: { id: "completed-episode", duration: 20 } })
assert.equal(state.video.completed, false, "Reopening completed media does not emit another completion")
state = ready(context([a]))
state = reduce(state, { type: "prepareVideo", media: { id: "missing-stream", live: true, unavailable: "No source", retryable: false } })
state = play(state, "video")
assert.equal(state.owner, "audio", "A permanently unavailable video must not interrupt working audio")
state = reduce(state, { type: "finish", owner: "audio" })
state = reduce(state, { type: "enqueue", media: b, next: false })
assert.equal(state.audio.status, "ended", "Adding after completion does not auto-start")
state = reduce(state, { type: "next" })
assert.equal(state.audio.media.id, b.id)
assert.equal(state.audio.status, "loading")
assert.equal(formatTime(252), "4:12")
assert.equal(formatTime(7200), "120:00")
console.log(
  "Playback checks passed: ownership, stale callbacks, handoff, progress, queues, ordering, removal, completion, retry, live, and unavailable states.",
)
