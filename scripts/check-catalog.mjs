import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import ts from "typescript"

// Load the standalone mock-data module without adding a test runner or backend.
const source = await readFile(
  new URL("../src/data/mockContent.ts", import.meta.url),
  "utf8",
)
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext },
})
const data = await import(
  `data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`
)
const {
  catalog,
  catalogById,
  allShowDetails,
  allMovieDetails,
  allArtistDetails,
  allNewsArticles,
  allEventDetails,
  contentPath,
  watchPath,
  playableItem,
} = data

assert.equal(
  new Set(catalog.map((item) => item.id)).size,
  catalog.length,
  "Catalog IDs must be unique",
)
const identities = new Set()
for (const item of catalog) {
  const identity = `${item.type}:${item.showId ?? ""}:${item.title}`
  assert(!identities.has(identity), `Duplicate identity: ${identity}`)
  identities.add(identity)
  assert.strictEqual(catalogById[item.id], item)
  assert(item.title && item.thumbnail && item.type)
  assert(
    item.classification,
    `${item.id} must have a provisional classification`,
  )
  assert(
    ["free", "premium"].includes(item.access),
    `${item.id} must have explicit access metadata`,
  )
  assert(item.region, `${item.id} must have a discovery region`)
  assert(contentPath(item).endsWith(`/${item.id}`))
  if (["movie", "episode", "musicVideo", "sports"].includes(item.type)) {
    assert(item.durationSeconds > 0, `${item.id} needs its own duration`)
    assert.equal(
      watchPath(item),
      item.type === "musicVideo"
        ? `/music/video/${item.id}`
        : `/watch/${item.id}`,
    )
  }
  if (item.type === "show") {
    assert.equal(allShowDetails[item.id].title, item.title)
    assert.equal(allShowDetails[item.id].poster, item.thumbnail)
    assert(item.classification)
    const episode = playableItem(item)
    assert.equal(episode.showId, item.id)
    assert.equal(watchPath(item), `/watch/${episode.id}`)
    for (const season of allShowDetails[item.id].seasons) {
      for (const ep of season.episodes) {
        assert.equal(catalogById[ep.id].title, ep.title)
        assert.equal(catalogById[ep.id].seasonNumber, season.number)
        assert.equal(
          catalogById[ep.id].durationSeconds,
          data.durationInSeconds(ep.duration),
        )
      }
    }
  }
  if (item.type === "episode") {
    assert.equal(item.classification, catalogById[item.showId].classification)
    assert.equal(item.access, catalogById[item.showId].access)
  }
  if (item.type === "movie") {
    assert.equal(allMovieDetails[item.id].title, item.title)
    assert.equal(allMovieDetails[item.id].duration, item.duration)
    assert(item.year && item.classification)
  }
  if (item.type === "artist") {
    const artist = allArtistDetails[item.id]
    assert.equal(artist.name, item.title)
    assert.equal(artist.image, item.thumbnail)
    for (const video of artist.videos) {
      assert.strictEqual(video, catalogById[video.id])
      assert.equal(video.artist, artist.name)
      assert.equal(contentPath(video), `/music/video/${video.id}`)
    }
  }
  if (item.type === "news")
    assert.equal(allNewsArticles[item.id].title, item.title)
  if (item.type === "event") {
    assert.equal(allEventDetails[item.id].title, item.title)
    assert.equal(allEventDetails[item.id].date, item.date)
    assert(item.time && item.state)
  }
}
for (const name of [
  "trending",
  "originals",
  "continueWatching",
  "featuredShows",
  "popularMovies",
  "musicVideos",
  "featuredArtists",
  "sportsHighlights",
  "latestNews",
  "upcomingEvents",
  "lifestyleContent",
]) {
  const collection = data[name]
  assert.equal(
    new Set(collection.map((item) => item.id)).size,
    collection.length,
    `${name} duplicates items`,
  )
  for (const item of collection)
    assert.strictEqual(
      item,
      catalogById[item.id],
      `${name} must reference canonical items`,
    )
}
for (const item of data.continueWatching) {
  assert(item.progress > 0 && item.progress < 100)
  assert(item.durationSeconds > 0)
}
assert.equal(data.durationInSeconds("1h 54m"), 6840)
assert.equal(data.durationInSeconds("51 min"), 3060)
assert.equal(data.durationInSeconds("4:12"), 252)
assert.equal(catalogById.e102.progress, 60)
assert.equal(
  Math.ceil(
    (catalogById.e102.durationSeconds * (1 - catalogById.e102.progress / 100)) /
      60,
  ),
  20,
)
assert.equal(catalogById["unknown"], undefined)
for (const playlist of data.playlists) {
  assert.equal(new Set(playlist.itemIds).size, playlist.itemIds.length)
  for (const id of playlist.itemIds)
    assert.equal(
      catalogById[id]?.type,
      playlist.kind === "audio" ? "track" : "musicVideo",
    )
}
assert.equal(data.tracks.length, 8)
for (const track of data.tracks) {
  assert.strictEqual(track, catalogById[track.id])
  assert(track.durationSeconds > 0)
  assert.equal(catalogById[track.artistId]?.type, "artist")
  assert.equal(catalogById[track.musicVideoId]?.type, "musicVideo")
  assert.equal(contentPath(track), `/music/track/${track.id}`)
  assert.equal(watchPath(track), undefined)
}
const eventSource = await readFile(
  new URL("../src/lib/eventPresentation.ts", import.meta.url),
  "utf8",
)
const eventJs = ts.transpileModule(eventSource, {
  compilerOptions: { module: ts.ModuleKind.ESNext },
}).outputText
const { getEventPresentation, eventSchedule } = await import(
  `data:text/javascript;base64,${Buffer.from(eventJs).toString("base64")}`
)
const labels = new Set()
for (const event of Object.values(allEventDetails)) {
  const broadcast = data.broadcasts[event.broadcastId]
  if (event.broadcastId) {
    assert(broadcast)
    assert.equal(broadcast.eventId, event.id)
    if (broadcast.status === "replayAvailable")
      assert(broadcast.durationSeconds > 0)
    if (broadcast.status === "live")
      assert.equal(broadcast.durationSeconds, undefined)
  }
  const presentation = getEventPresentation(event, broadcast)
  labels.add(presentation.label)
  assert(eventSchedule(event).includes(event.timeZone))
  if (["cancelled", "postponed"].includes(event.eventStatus) || !broadcast) {
    assert.equal(presentation.playable, false)
    assert.equal(presentation.watchLabel, undefined)
  }
  if (broadcast?.preview.mode === "unavailable")
    assert.equal(presentation.playable, false)
}
for (const label of [
  "Scheduled",
  "Starting soon",
  "Live",
  "Ended",
  "Replay available",
  "Postponed",
  "Cancelled",
  "Stream unavailable",
])
  assert(labels.has(label), `Missing ${label} event fixture`)
assert.equal(
  getEventPresentation(allEventDetails.e3, data.broadcasts["b-e1"]).playable,
  false,
  "A mismatched broadcast must not play",
)
console.log(
  `Catalog checks passed: ${catalog.length} unique items, every collection, detail, episode, video, and playlist resolves consistently.`,
)
