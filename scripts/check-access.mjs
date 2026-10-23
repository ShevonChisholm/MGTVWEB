import assert from "node:assert/strict"
import { loadModule } from "./load-module.mjs"
const { initialAppState } = await loadModule("src/data/mockAccount.ts")
const { canDiscover, ratingLevel, playbackReason } = await loadModule(
  "src/lib/accessPolicy.ts",
)
const { reconcilePlayback, actionReason } = await loadModule(
  "src/lib/playbackAccess.ts",
)
const { playbackReducer: reduce, initialPlayback } = await loadModule(
  "src/lib/playback.ts",
)
const { catalogById, catalog, broadcasts } = await loadModule(
  "src/data/mockContent.ts",
)
let state = initialAppState()
assert.equal(ratingLevel("TV-PG"), ratingLevel("PG"))
assert.equal(ratingLevel("R"), ratingLevel("TV-MA"))
assert.equal(ratingLevel("Unrated"), undefined)
state.activeProfileId = "p3"
assert(canDiscover(state, catalogById.m2))
assert(!canDiscover(state, catalogById.t1))
assert(!canDiscover(state, catalogById.t2))
assert(!canDiscover(state, { ...catalogById.m2, classification: undefined }))
assert(!canDiscover(state, undefined))
assert(playbackReason(state, "t1"))
assert(playbackReason(state, "e102"), "Episodes inherit parent classification")
for (const b of Object.values(broadcasts))
  assert.equal(playbackReason(state, b.id), playbackReason(state, b.eventId))
state.activeProfileId = "p2"
assert(canDiscover(state, catalogById.t1))
assert(!canDiscover(state, catalogById.t2))
state.activeProfileId = "p1"
assert(canDiscover(state, catalogById.t2))
state.session = "guest"
assert.equal(playbackReason(state, "m2"), undefined)
assert.match(playbackReason(state, "m1"), /Sign in/)
state.session = "expired"
assert.equal(playbackReason(state, "m2"), undefined)
assert.match(playbackReason(state, "m1"), /Sign in/)
state.session = "signedIn"
state.activeProfileId = "p3"
const audio = reduce(initialPlayback, {
  type: "audioContext",
  media: [
    { id: "tr1", duration: 10 },
    { id: "tr2", duration: 10 },
  ],
  index: 0,
  origin: "test",
})
const sanitized = reconcilePlayback(audio, state)
assert.deepEqual(
  sanitized.queue.map((e) => e.media.id),
  ["tr1"],
)
assert(actionReason(audio, { type: "select", index: 1 }, state))
assert(
  actionReason(
    audio,
    { type: "enqueue", media: { id: "tr2", duration: 10 }, next: true },
    state,
  ),
)
const restrictedAudio = reduce(initialPlayback, {
  type: "audioContext",
  media: [{ id: "tr2", duration: 10 }],
  index: 0,
  origin: "test",
})
assert.equal(
  reconcilePlayback(restrictedAudio, state).audio,
  null,
  "Restricted artwork must leave the mini-player",
)
state.profiles[2].controls.dailyLimit = 10
state.profileData.p3.usedSeconds = 10
assert.match(playbackReason(state, "m2"), /daily demo viewing limit/)
assert.equal(playbackReason(state, "tr1"), undefined)
let video = reduce(initialPlayback, {
  type: "prepareVideo",
  media: { id: "m2", duration: 10 },
})
video = reduce(video, { type: "play", owner: "video" })
const stopped = reconcilePlayback(video, state)
assert.equal(stopped.owner, null)
assert.equal(stopped.video.status, "unavailable")
assert.equal(stopped.video.retryable, false)
assert(actionReason(stopped, { type: "play", owner: "video" }, state))
state.profileData.p3.usedSeconds = 0
const restored = reconcilePlayback(stopped, state)
assert.equal(restored.owner, null, "Relaxing policy must never auto-resume")
assert.equal(
  restored.video.status,
  "paused",
  "Explicit play is available after a policy block is lifted",
)
state.profileData.p3.usedSeconds = 10
state.profiles[2].preferences.autoplay = false
let queue = reconcilePlayback(audio, state)
queue = reduce(queue, { type: "finish", owner: "audio" })
assert.equal(queue.audio.status, "ended")
assert.equal(queue.index, 0)
for (const item of catalog) {
  assert(
    item.classification,
    `${item.id} must have an explicit provisional rating`,
  )
  assert(
    ["free", "premium"].includes(item.access),
    `${item.id} must have an entitlement independent of badge`,
  )
}
console.log(
  "Access checks passed: rating aliases, type ceilings, unrated, episodes/broadcasts, public free access, restricted queue removal, retries, daily video stop and autoplay.",
)
