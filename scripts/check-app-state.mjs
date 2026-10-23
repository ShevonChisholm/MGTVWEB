import assert from "node:assert/strict"
import { loadModule } from "./load-module.mjs"
const { initialAppState } = await loadModule("src/data/mockAccount.ts")
const { transition, newProfile, safeReturnTo } = await loadModule(
  "src/lib/appState.ts",
)
const { catalogById } = await loadModule("src/data/mockContent.ts")
let state = initialAppState()
const perform = (action) => {
  const result = transition(state, action)
  if (result.result.ok) state = result.state
  return result.result
}
assert.equal(state.session, "signedIn")
assert.equal(state.activeProfileId, "p1")
assert.equal(state.profiles.length, 3)
for (const data of Object.values(state.profileData))
  for (const notice of data.notifications)
    if (notice.contentId)
      assert(
        catalogById[notice.contentId],
        "Notification content must resolve canonically",
      )
const original = state
assert(perform({ type: "data", id: "p1", data: { saved: ["m2"] } }).ok)
assert.equal(
  original.profileData.p1.saved.length,
  0,
  "Updates must be immutable",
)
assert(perform({ type: "select", id: "p2" }).ok)
assert.deepEqual(state.profileData.p2.saved, [])
assert.deepEqual(state.profileData.p1.saved, ["m2"])
assert(!perform({ type: "select", id: "p1", pin: "0000" }).ok)
assert.equal(state.activeProfileId, "p2")
assert(
  !perform({
    type: "vote",
    category: "best-reggae",
    nomineeId: "a1",
    nomineeName: "Empress Nia",
  }).ok,
)
assert(!perform({ type: "data", id: "p2", data: { saved: ["t2"] } }).ok)
assert(!perform({ type: "data", id: "p1", data: { saved: [] } }).ok)
assert(perform({ type: "select", id: "p1", pin: "1234" }).ok)
assert(
  !perform({
    type: "controls",
    id: "p3",
    controls: state.profiles[2].controls,
    pin: "0000",
  }).ok,
)
assert(!perform({ type: "delete", id: "p1", pin: "1234" }).ok)
assert(
  !perform({
    type: "edit",
    profile: { ...state.profiles[0], type: "teen" },
    pin: "1234",
  }).ok,
  "Keep a main adult profile",
)
for (const id of ["guided", "quick"])
  assert(perform({ type: "create", profile: newProfile(id, id, "adult") }).ok)
assert.equal(state.profiles.length, 5)
assert(
  !perform({ type: "create", profile: newProfile("six", "Sixth", "adult") }).ok,
)
assert(
  !perform({ type: "create", profile: newProfile("blank", "   ", "adult") }).ok,
)
assert(
  perform({
    type: "vote",
    category: "best-reggae",
    nomineeId: "a1",
    nomineeName: "Empress Nia",
  }).ok,
)
assert(perform({ type: "select", id: "quick" }).ok)
assert(
  !perform({
    type: "vote",
    category: "best-reggae",
    nomineeId: "a2",
    nomineeName: "Jah Roc",
  }).ok,
)
assert(
  !perform({
    type: "vote",
    category: "best-soca",
    nomineeId: "invalid",
    nomineeName: "Fake",
  }).ok,
)
perform({ type: "phase", phase: "closed" })
assert(
  !perform({
    type: "vote",
    category: "best-new",
    nomineeId: "a1",
    nomineeName: "Empress Nia",
  }).ok,
)
perform({ type: "phase", phase: "resultsPending" })
assert.equal(state.votes["best-reggae"].nomineeId, "a1")
assert(perform({ type: "reminder", id: "e2" }).ok)
assert.equal(
  state.profileData.quick.notifications.filter((n) => n.source === "reminder")
    .length,
  1,
)
const reminder = state.profileData.quick.notifications.find(
  (n) => n.source === "reminder",
)
assert(perform({ type: "read", ids: [reminder.id] }).ok)
assert.equal(
  state.profileData.quick.notifications.find((n) => n.id === reminder.id).read,
  true,
)
assert(perform({ type: "reminder", id: "e2" }).ok)
assert.equal(
  state.profileData.quick.notifications.filter((n) => n.source === "reminder")
    .length,
  0,
)
assert.equal(state.profileData.quick.reminders.length, 0)
assert(perform({ type: "reminder", id: "e2" }).ok)
assert.equal(
  state.profileData.quick.notifications.filter((n) => n.id === reminder.id)
    .length,
  1,
)
assert(
  !perform({ type: "reminder", id: "e8" }).ok,
  "Cancelled event must not accept reminders",
)
perform({ type: "scenario", session: "guest" })
assert(!perform({ type: "data", id: "quick", data: { saved: ["m2"] } }).ok)
assert(!perform({ type: "reminder", id: "e2" }).ok)
assert(
  !perform({
    type: "vote",
    category: "best-new",
    nomineeId: "a1",
    nomineeName: "Empress Nia",
  }).ok,
)
perform({ type: "scenario", session: "expired" })
assert(
  !perform({ type: "preferences", preferences: state.profiles[0].preferences })
    .ok,
)
perform({ type: "signIn" })
assert.equal(state.activeProfileId, null)
perform({ type: "select", id: "quick" })
assert(perform({ type: "delete", id: "quick", pin: "1234" }).ok)
assert.equal(state.activeProfileId, null)
assert.equal(state.profileData.quick, undefined)
assert.equal(safeReturnTo("//malicious.example"), "/")
assert.equal(safeReturnTo("/\\malicious.example"), "/")
assert.equal(safeReturnTo("https://malicious.example"), "/")
assert.equal(safeReturnTo("/music?view=tracks"), "/music?view=tracks")
assert.equal(initialAppState().votes["best-reggae"], undefined)
console.log(
  "App-state checks passed: shared capacity, isolation, immutable edits, PIN, guest/expired gates, reminders/read deduplication, account-wide votes, stale phase rules, deletion and reset.",
)
