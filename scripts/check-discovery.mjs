import assert from "node:assert/strict"
import { loadModule } from "./load-module.mjs"
const { filterGroups, normalizeFilters, matchesFilters, valuesFor } =
  await loadModule("src/lib/discovery.ts")
const { tracks, popularMovies, upcomingEvents, sportsHighlights } =
  await loadModule("src/data/mockContent.ts")
assert.deepEqual(
  valuesFor(
    upcomingEvents.find((item) => item.id === "e8"),
    "region",
  ),
  ["Saint Lucia"],
)
const groups = filterGroups(tracks, "tracks")
assert.deepEqual(
  groups.map((g) => g.id),
  ["genre", "artist", "album", "region"],
)
const sample = tracks[0]
const params = new URLSearchParams({
  q: "sample",
  view: "tracks",
  genre: valuesFor(sample, "genre")[0],
  artist: sample.artist,
})
let filters = normalizeFilters(params, groups)
assert.equal(Object.keys(filters).length, 2)
assert(matchesFilters(sample, filters))
assert(
  tracks
    .filter((i) => matchesFilters(i, filters))
    .every((i) => i.artist === sample.artist),
)
params.delete("genre")
filters = normalizeFilters(params, groups)
assert.equal(filters.genre, undefined)
assert.equal(filters.artist, sample.artist)
assert.equal(params.get("q"), "sample")
assert.equal(params.get("view"), "tracks")
params.set("genre", "not-a-valid-genre")
assert.equal(normalizeFilters(params, groups).genre, undefined)
assert.deepEqual(
  normalizeFilters(new URLSearchParams(params.toString()), groups),
  filters,
)
assert.equal(
  popularMovies.filter((i) =>
    matchesFilters(i, { genre: "Drama", year: "1900" }),
  ).length,
  0,
)
assert.equal(
  sportsHighlights.filter((i) => matchesFilters(i, { status: "Live" })).length,
  0,
)
assert(sportsHighlights.every((i) => matchesFilters(i, { status: "Replay" })))
assert(
  filterGroups(sportsHighlights, "sports")
    .find((g) => g.id === "status")
    .options.some((o) => o.value === "Live"),
)
assert(
  valuesFor(
    upcomingEvents.find((i) => i.id === "e3"),
    "date",
  ).includes("Today"),
)
assert(
  valuesFor(
    upcomingEvents.find((i) => i.id === "e2"),
    "date",
  ).includes("Later"),
)
assert.equal(
  upcomingEvents.filter((i) => matchesFilters(i, { venue: "Hybrid" })).length,
  0,
)
assert(
  filterGroups(upcomingEvents, "events")
    .find((g) => g.id === "venue")
    .options.some((o) => o.value === "Hybrid"),
)
assert(
  upcomingEvents.filter((i) =>
    matchesFilters(i, { status: "Replay available" }),
  ).length > 0,
)
console.log(
  "Discovery checks passed: independent AND facets, chip removal, query/format preservation, URL round-trip, invalid values, true zero results, fixed dates and independent broadcast states.",
)
