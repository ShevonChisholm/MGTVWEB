# MGTV — Distinct Music Formats, Shared Playback, and Live-Event States

## 1. Goal and boundaries

Improve the existing React customer-web prototype in place. Make music videos, audio tracks, playlists, physical events, and broadcasts recognizably different through format, metadata, and behavior—not a new visual theme.

Preserve:
- The charcoal/gold foundation, Inter/Bebas Neue font wiring, common spacing/corners, existing icons and UI primitives.
- The Navbar’s More grouping, keyboard/touch improvements, independent rails, visible card titles/actions, shared Save behavior, and canonical content destinations.
- All existing working routes, especially `/music/video/:id`, `/music/artist/:id`, `/music/playlist/:id`, `/sports/:id`, `/watch/:id`, and series/movie details.
- Existing unrelated account, authentication, editorial, Shop, and cart functionality.

Do not add a backend, CMS, external integration, streaming service, payment/monetary flow, mobile app, publishing, or deployment. Do not acquire new media or silently substitute arbitrary public music/video URLs.

This document is an implementation plan; application source has not been changed during planning.

## 2. Decisions confirmed with the user

1. **Separate track and video playlists.** Preserve existing music-video playlists and URLs; add distinct audio-track playlists. Do not mix formats within a playlist or queue.
2. **Stop at queue end.** Do not loop, shuffle, recommend additional media, or automatically restart.
3. **Manual audio resumption after video.** Starting video playback pauses audio and retains its queue and position. Finishing, pausing, failing, or leaving video does not automatically resume audio.
4. Opening video details or a paused video page does not interrupt audio. The handoff occurs on a Play/Watch playback request, not on navigation alone.

Additional implementation defaults:
- All new state is in memory for the current SPA session. Navigation preserves it; reloading resets it. No localStorage, account persistence, browser notifications, or background reminder delivery.
- No authorized audio/video asset was found in the repository. Implement honest **simulated** previews with no sound or moving video. Preserve existing artwork.
- Mount the audio mini-player at the router’s common root so it remains available across customer-web navigation, including existing standalone routes once a track is selected. Do not add Navbar/Footer chrome to standalone auth/profile screens.
- Keep broadcast demonstration states fixed, not derived from the actual clock or randomized at render time.

## 3. Repository facts and integration points

- Vite + React 19 + React Router; pnpm; no media library or backend.
- `src/main.tsx` mounts Toast, Interaction, Playlist, and Saved providers above `App`.
- `src/App.tsx` renders `RouterProvider`; routes are in `src/app/routes.tsx`.
- `src/data/mockContent.ts` holds the canonical catalog, ID lookup, episodes, detail records, collections, duration parsing, and route helpers.
- Current music items are `musicVideo`; there is no audio-track type, queue, or global playback state.
- Existing `Playlist.tracks` contains **music-video IDs**, and `PlaylistPage` currently presents them as tracks. `PlaylistContext` has create/add/remove/delete but no ordering.
- `MediaCard` resolves canonical items, uses landscape music-video artwork, and provides working Save controls. Extend its dispatch rather than replacing the existing family.
- `VideoPlayer` owns a local simulated clock and only playing/paused behavior. It already receives item-specific durations and seeded progress; preserve that correction.
- `WatchPage` uses canonical episodes, but navigation on end needs to become a coordinated next-episode playback transition.
- Events currently expose only Upcoming/Ended and lack a separate broadcast model.
- Sports detail/highlight routes already work and are correctly labeled as archive/replay.
- `NotificationPanel` and `NotificationsPage` still contain hardcoded live/event claims, including a fabricated score; update related claims during this pass.
- Reuse `Button`, `ButtonLink`, `Input`, `Text`, `Badge`, existing gold focus styling, `ContentUnavailable`, `ShareBar`, and local interaction contexts.

## 4. User-visible acceptance outcomes

### Music
- Music browsing has URL-addressable **Music Videos**, **Tracks**, **Artists**, and **Playlists** views.
- Videos retain landscape art and Watch video actions.
- Tracks use square discovery art and compact list rows, with title, artist, duration, and explicit Play/Pause.
- “MP3” never appears as a browsing category.
- One audio mini-player provides artwork, track/artist, Play/Pause, seek, elapsed/total time, Next, and Queue.
- Every occurrence of the current track reflects the same loading/playing/paused state, including discovery, artist profiles, track details, Search, My List, playlists, and queue.
- Users can order their playlists and the pending queue without relying on dragging or hover.

### Events and broadcasts
- Every event has clear date, time, timezone, and physical/online location.
- A physical event can have no broadcast at all.
- Stable examples demonstrate Scheduled, Starting soon, Live, Ended, Replay available, Postponed, and Cancelled.
- Watch live and Watch replay exist only when the event/broadcast relationship permits them.
- Unknown or unavailable streams show intentional states rather than another item’s player.

### Players
- Loading, buffering, paused, playing, ended, unavailable, and retry behavior are visible and testable.
- No audio/video sessions advance simultaneously.
- Finite media uses its own duration and resume position; live previews do not display a fictional finite runtime or seek bar.
- Next-episode playback uses the same canonical season/episode order as series details.

## 5. Data model and fixtures

### 5.1 Audio tracks and canonical destinations

Extend the existing catalog with `type: 'track'`. Each audio track has:
- A distinct stable ID, title, `artistId`, artist display name, square artwork reference, genre, and required positive `durationSeconds`.
- Optional related `musicVideoId`; this is a relationship, not a redirect or a reused ID.
- Explicit media-preview metadata identifying simulation and any deterministic demonstration behavior.

Seed eight tracks using existing fictional titles/artwork and matching artist records:

| Track ID | Title | Artist ID | Duration |
|---|---|---|---|
| tr1 | Fire & Gold | a1 | 252 seconds |
| tr2 | Kingston Flow | a2 | 238 seconds |
| tr3 | Riddim Queen | a3 | 301 seconds |
| tr4 | Blue & Gold | a4 | 224 seconds |
| tr5 | Rasta Revolution | a7 | 270 seconds |
| tr6 | Paradise Road | a5 | 202 seconds |
| tr7 | Soca Season | a6 | 295 seconds |
| tr8 | Roots Revival | a2 | 287 seconds |

Tracks and music videos of the same song remain separate catalog items with their own IDs, source mode, actions, and playback state. Collections reference canonical objects.

Add `/music/track/:id` and `contentPath(track)` for track details. Audio playback is an action, not a navigation link: do not route tracks to `/watch` or `/music/video`.

Update `contentLabels` to distinguish Music Videos and Tracks. Extend Search, SearchModal, My List, and artist profiles for tracks. Do not create a second catalog or broad search redesign.

### 5.2 Typed playlists

Replace the misleading playlist `tracks` field with:

```ts
type PlaylistKind = 'audio' | 'video'
// Existing base fields remain: id, name, description, coverImage, createdAt, isOwn.
interface Playlist {
  // existing base fields...
  kind: PlaylistKind
  itemIds: string[]
}
```

- Preserve `pl1`–`pl4`, their names, URLs, and existing video IDs; mark them `kind: 'video'`.
- Correct video playlist counts/descriptions to “videos,” not “tracks.”
- Add `pl-a1` Reggae Essentials — Tracks (`tr1,tr2,tr5,tr8`), `pl-a2` Carnival Mix — Tracks (`tr3,tr4,tr7`), and editable `pl-a3` My Tracks (`tr1,tr6`).
- User-created playlists choose Track playlist or Video playlist at creation. Kind is fixed afterward.
- Validate every create/add/reorder operation. Reject missing IDs and format mismatches, and prevent duplicate IDs within a playlist.
- Editorial playlists are read-only. Only `isOwn` playlists appear as add/remove/reorder targets; existing creation/deletion remains available for user playlists.
- Add accessible Move up/Move down actions for user playlists. First/last moves are disabled.
- Playing a playlist snapshots its current order. Later playlist edits/deletion do not silently mutate the active queue; explain that edits apply the next time it is played.
- Queues are separate from saved playlists; queue ordering does not rewrite a playlist.

### 5.3 Media preview metadata

Use a small explicit discriminated preview descriptor:
- `mode: 'simulated'` with fixture behavior `normal`, `buffer-once`, or `fail-first-attempt`.
- `mode: 'unavailable'` with a stable reason and whether retry is meaningful.

Do not add fake `src` paths. Current previews have no authorized media source. Every playback surface must state this visibly.

Associate preview records with canonical track/video/episode/movie/highlight IDs. Existing finite media keeps its catalog duration and seeded progress.

Use normal simulated behavior by default. Assign tr2 and mv8 a one-time buffer when simulated progress first crosses 10 seconds; assign tr8 a first-load failure that succeeds on explicit Retry. Keep attempt/buffer counters keyed by media ID for the SPA session, so creating a new timer/generation does not make Retry fail forever. Manual Preview states actions may trigger another explicitly requested demonstration; reloading resets fixture counters.

### 5.4 Event information separate from broadcast availability

Extend authoritative event details with:
- `eventStatus`: scheduled, startingSoon, inProgress, ended, postponed, or cancelled.
- `startsAt`, optional `endsAt`, IANA `timeZone`, and optional `previousStartsAt` for postponed/cancelled context.
- Location discriminant: `inPerson`, `online`, or `hybrid`, with venue/address or an online-event label as appropriate.
- Optional `broadcastId`.

Create a separate canonical broadcast table:
- `id`, `eventId`, broadcast status (scheduled, startingSoon, live, ended, replayAvailable), preview source, and failure reason if applicable.
- A finite replay has its own required `durationSeconds` and initial position.
- A live preview has no fabricated finite duration, VOD resume percentage, or DVR seeking.
- An absent `broadcastId` means no broadcast is planned, not “unavailable media.”

Retire event UI’s reliance on the old overloaded `ContentItem.state`. Derive event/broadcast labels and actions from these authoritative records through shared helpers. Preserve a compatibility alias for the existing `upcomingEvents` collection if needed while migrating consumers; do not duplicate records.

### 5.5 Fixed event fixtures

Use a labeled reference schedule of **September 10, 2026, 18:00 UTC**. Do not compute status from `Date.now()`.

| Event | Event information | Broadcast example |
|---|---|---|
| e1 — Reggae Sumfest 2025 | Ended; existing July 2025 physical event | Replay available; finite 7,200-second simulated concert replay |
| e2 — MGTV Awards Ceremony 2026 | Scheduled; Oct 28, 2026, 19:00 America/Jamaica | Scheduled broadcast; no Watch action yet |
| e3 — Caribbean Cup Quarter Final | In progress; demo fixture Sep 10, 2026, 12:00–15:00 America/Jamaica, National Stadium | Live simulated sports broadcast |
| e4 — Caribbean Culinary Festival 2026 | Scheduled; Nov 14–16, starting 10:00 America/Port_of_Spain; existing Queen's Park Savannah venue | No broadcast planned |
| e5 — MGTV Awards Afterparty | Scheduled; Oct 28, 2026, 22:00 America/Jamaica | No broadcast planned |
| e6 — VIP Artist Masterclass | Postponed online event; original Sep 15, 2026, 15:00 America/Jamaica; replacement TBA | Broadcast blocked until rescheduled |
| e7 — Kingston Soundcheck Session | Starting soon; Sep 10, 2026, 13:15 America/Jamaica; online event | Starting soon, explicitly fixed at 15 minutes after the demo reference |
| e8 — Island Film Showcase | Cancelled; original Sep 12, 2026, 19:00 America/St_Lucia; fictional demo venue “Castries Community Arts Hall” | No playback |
| e9 — Regional Sports Roundup | Ended; Sep 9, 2026, 18:00–19:30 America/Jamaica; online event | Ended; no replay supplied |
| e10 — Caribbean Athletics Live | In progress; Sep 10, 2026, 13:00–15:00 America/Jamaica; fictional demo venue “Kingston Athletics Centre” | Planned broadcast is unavailable; explicit stream-status destination |

Do not change existing item IDs or silently change prerecorded sports highlights into broadcasts. e3’s fixture schedule is explicitly updated for this demonstration in every event/detail/card consumer.

Use `Intl.DateTimeFormat` with each fixture’s IANA timezone, not the browser’s timezone. Display the date, local time, timezone/UTC offset, and venue/online status consistently. Store all fixture schedule and venue values in data, not rendering code. Use broadcast IDs `b-e1`, `b-e2`, `b-e3`, `b-e6`, `b-e7`, `b-e9`, and `b-e10`; physical-only/cancelled fixtures have no broadcast relation.

## 6. Shared playback architecture

### 6.1 Single owner and state machine

Add:
- `src/lib/playback.ts`: pure types, reducer, queue transitions, completion logic, selectors; no React or runtime data imports.
- `src/context/MediaPlaybackContext.tsx`: reducer provider, the single simulation clock, scheduled load/buffer callbacks, position memory, and public commands.
- Thin state bindings in audio/video UI; no independent card/player timers.

Mount `MediaPlaybackProvider` above the router in `src/main.tsx`. Keep existing providers and their semantics. Use a pathless common router layout containing the existing route tree, `<Outlet />`, the mini-player, and queue overlay; retain existing Main/Auth layouts beneath it.

Core state:
- `activeOwner: 'audio' | 'video' | null`.
- Audio queue, current queue-entry ID, track ID, elapsed seconds, status, and queue-origin label.
- Video session: media ID, optional ordered playlist/series context, elapsed/live-session seconds, status, and autoplay preference.
- In-memory positions keyed by canonical media ID; seed each finite item only on first use.
- Per-media load-attempt and one-time-buffer counters for deterministic fixtures.
- A session/generation token that invalidates stale loading/buffering/completion callbacks after media switches, seek, pause, or unmount.

Playback statuses: `idle`, `loading`, `buffering`, `paused`, `playing`, `ended`, `unavailable`.

Public commands should cover:
- `playAudioContext(trackIds, startIndex, origin)`, `toggleTrack(trackId, context)`, `pauseAudio`, `seekAudio`, `nextAudio`.
- `enqueueNext`, `enqueueLast`, `playQueueEntry`, `removeQueueEntry`, `movePendingQueueEntry`, `clearAudioQueue`, `replayAudioQueue`.
- `prepareVideo`, `playVideo`, `pauseVideo`, `seekVideo`, `nextVideo`, `releaseVideo`.
- `retry`, `simulateBuffering`, and deterministic test/preview completion.

A component may format presentation but must not own a second playing flag or elapsed clock.

### 6.2 State transitions

| Trigger | Result |
|---|---|
| Open a valid video page | Prepare paused preview; do not take ownership from audio |
| Explicit Play on available audio/video | Pause the other source; take ownership; loading → playing |
| Loading completes | Only the matching session token may start playback |
| Pause while loading/buffering | Cancel pending automatic continuation; remain paused at the same position |
| Tick | Advance only the active playing source |
| Seek finite media | Clamp to that item’s duration; preserve current play/pause intent |
| Seek to end while paused | Show ended; do not autoplay or advance without a playback completion |
| Playing finite media completes | Record duration/ended once, then apply its explicit queue/episode autoplay policy |
| Known permanently unavailable source | Render its reason without interrupting working audio |
| Failure after a requested handoff | Show unavailable, retain position and queues, and do not auto-resume the interrupted source |
| Retry recoverable failure | Explicit user action → loading → requested playback on the same item/position |
| Leave video page | Release/pause that video session; keep audio paused unless the user resumes it |
| Press audio Play during video | Pause video, then resume the retained audio item/position |
| Reload page | Reset prototype state to fixtures; never claim saved listening progress |

One source owns loading/buffering/playing intent at a time. Clamp invalid progress; invalid/missing finite durations produce an unavailable state, not a 90-minute fallback.

Use deterministic 500 ms initial loading and 1,000 ms simulated buffering. Stop progress while paused/loading/buffering/unavailable. Drive elapsed deltas with a single monotonic clock; clean up callbacks in Strict Mode.

### 6.3 Audio queue rules

- Discovery Play starts an ordered snapshot of the visible track collection at the selected track. Artist and playlist rows use their respective ordered collection. A standalone track-detail Play with no context starts a one-track queue.
- Pressing Play/Pause on the already selected track toggles that shared session without replacing its queue or resetting progress.
- Selecting another row in a playlist/collection replaces the queue with that collection’s order and starts the selected row at zero.
- Every queued occurrence gets a unique queue-entry ID. Duplicate tracks are allowed in the queue, but not within a saved playlist.
- Play next inserts immediately after the current occurrence; Add to queue appends.
- Display current item separately from Up next. Reordering applies to pending entries only and never changes the current item or elapsed position.
- Removing a pending entry does not interrupt playback.
- Removing the current entry selects the next occurrence if present, at zero, preserving playing/paused intent. If no following occurrence exists, stop and clear the audio selection/queue, hiding the mini-player rather than jumping backward.
- Next is disabled when no following occurrence exists.
- At natural queue end, retain the final track at its duration with “Queue finished.” No repeat or unrelated autoplay.
- Play on the ended current track restarts that track. A separate Replay queue action starts the queue from its first item.
- Adding entries after queue completion does not auto-start them; Next or an explicit Play action starts them.
- Clear queue stops audio, clears its selected item, and removes the mini-player. It does not stop an independently active video.
- An unavailable queued item stops at that item with an explanation; do not silently skip it. Retry is offered only when recoverable; Next remains usable if another entry follows.

### 6.4 Video playlist and episode sequencing

- Audio and video sequences are separate; video playlists never enter the audio queue.
- Video playlist Watch all snapshots video IDs and opens the first existing video route with `?playlist=<id>` context.
- Watch video from a playlist starts at that row with the same ordered context.
- Direct-link context must resolve to an existing video playlist containing that video; invalid context is ignored with a small explanatory notice while the valid video remains usable.
- Video-playlist autoplay defaults to on and has a visible toggle. It advances within that snapshot only; stop at its end. Finishing a video outside a playlist does not start an unrelated video.
- Series autoplay uses canonical `allShowDetails`/`episodes`, ordered by season then episode number, including additional detail records.
- Starting the next episode/video is a shared-controller load-and-play operation plus navigation—not just navigation to a newly paused component.
- Preserve the existing next-episode autoplay toggle. Honor it exactly once per completion, including season boundaries; stop at the final episode.

Ordinary Watch video / Watch live / Watch replay navigation opens the correct player paused and does not itself interrupt audio. The visible Play preview control performs the handoff. Watch all is an explicit sequence-start action and requests playback of its first item. Document this distinction in the UI/test flow rather than relying on browser autoplay heuristics.

## 7. Music interface and routes

### Browsing
- Keep `/music`; add `?view=videos|tracks|artists|playlists`, defaulting to videos and supporting browser Back/Forward.
- Use labeled navigation links with `aria-current`, not fake tab semantics without keyboard behavior.
- Preserve the expressive Music hero. Its title/artwork/metadata/action must match the selected featured format:
  - Videos: landscape featured video and Watch video.
  - Tracks: square track artwork, explicit track label and shared Play/Pause.
  - Artists: circular portrait and View artist.
  - Playlists: kind/count/order context plus View playlist and matching Play all or Watch all.
- Derive genre filters from the selected content; avoid unsupported filter options or fallback results pretending to match.
- Add a modest Tracks rail beside the existing Home music discovery without redesigning Home.

### Track UI
- Introduce `TrackCard` and `TrackRow` using current tokens/primitives and the same spacing/focus conventions.
- Square art/title navigate to track details. Play/Pause, queue, playlist, and Save are sibling buttons, never nested in a link.
- Track rows show artwork, readable title/artist, duration at every width, and visible Play/Pause. Secondary actions may use a permanently visible, named menu trigger.
- Shared state distinguishes Preview running, Paused, Loading, and Unavailable; an icon alone is insufficient.
- Artist profiles gain a Tracks list while retaining videos and related artists.
- Track details reuse existing Like/Rating/Share/Save behavior with the track’s distinct ID and provide artist navigation.
- Music-video details retain landscape viewing and change “Rate this track” to “Rate this video.”

### Playlist UI
- Add `PlaylistCard` with shared family spacing and explicit Track playlist / Video playlist, item count, View playlist, and Play all / Watch all.
- Track playlists use compact TrackRows; video playlists use landscape VideoRows and Watch video links.
- Play all is a button invoking the shared audio controller, not a link to a video page.
- Empty playlists show a useful empty state; playback is disabled with a reason.
- Preserve create/add/remove/delete. Add user-playlist ordering; expose actions without hover and confirm destructive deletion.
- `AddToPlaylistMenu` accepts an item ID/kind, shows only compatible owned playlists, explains when no compatible playlist exists, and supports creating the appropriate kind.
- Keep playlists in `PlaylistContext`, not duplicated as mutable catalog records. No new playlist-wide Save feature is required.

### Persistent mini-player and queue
- Render only after audio has been selected. Keep it visible when audio is paused for video, with a clear “Audio paused for video” status.
- Use a fixed, restrained bottom bar: artwork, linked track title/artist, simulation notice, Play/Pause, elapsed/total seek, Next, and Queue count/access.
- On narrow web widths use two compact rows; do not hide seek, Next, or Queue behind hover.
- Measure the bar with `ResizeObserver` and reserve matching bottom space/scroll padding in the root layout so it never covers content, footer actions, or focused controls. Account for safe-area insets.
- Queue opens an accessible overlay, not a page-flow panel. Native dialog behavior or an equivalent local primitive must trap focus and restore it on close; support Escape and a visible Close button.
- Queue item navigation closes the overlay but preserves playback. Reordering/removing entries does not navigate.

## 8. Event/broadcast behavior and destinations

Add `/events/:id/watch` without changing `/events/:id`.

Implement shared `getEventPresentation`, `getEventActions`, and `resolveEventPlayback` helpers, used by cards, heroes, details, event filters, and the watch page.

| Condition | Visible behavior/actions |
|---|---|
| Scheduled / Starting soon | View event; Remind me. If a broadcast exists, explain when it is scheduled; no Watch live yet |
| Physical event with no broadcast | Venue/date/time; “No livestream planned.” Event reminders still work locally |
| Live and available broadcast | View event + Watch live; explicitly label the broadcast as a simulated live example |
| Ended without replay | View event; “Event ended / Replay not available”; no Watch or new reminder |
| Replay available | View event + Watch replay; finite replay metadata; no live badge |
| Postponed | Show original schedule and “New date TBA”; no Watch or new reminder |
| Cancelled | Cancellation notice; no Watch or new reminder |
| Broadcast unavailable | View event / View stream status, clear reason and Back to event; no misleading available Watch live action |
| Unknown event/broadcast or invalid relation | Intentional ContentUnavailable; never substitute another source |

Eligibility precedence: cancelled/postponed event overrides stale broadcast data; then explicit broadcast availability; no time-based guessing.

Remind me uses `InteractionContext` and `aria-pressed`; confirmation says “Prototype reminder saved for this session; no notification will be sent.” Existing reminders can be removed even when a new reminder is no longer allowed.

The broadcast watch page:
- Resolves its title, artwork, event metadata, live/replay mode, and eligibility from the same event and broadcast records.
- Live preview has no total runtime or seeking; show “Simulated live preview — no broadcast connected.”
- Replay uses its own finite duration and position and the normal VOD controls.
- Scheduled/starting-soon direct links render the schedule/waiting state, not a running player.
- Cancelled/postponed/ended-without-replay direct links are intentionally nonplayable.
- Stream e10 renders a specific unavailable state; Retry appears only for a recoverable fixture.

Keep `/sports/:id` → matching `/watch/:id` highlights intact. If adding a Sports broadcast-examples section, populate it only from explicit sports event/broadcast references. Prerecorded highlights remain Replay/Highlights.

Update directly related notification fixtures to remove fabricated scores, ticket confirmations, prerecorded “live” labels, and claims of actual real-time delivery. Use labeled demonstration copy and matching canonical event/highlight links; do not rebuild the notification system.

## 9. Demonstrating player states honestly

- Display “Simulated preview — no audio/video source connected” in both the video player and audio mini-player/track context.
- During simulated playing, use “Preview running (no sound)” or equivalent; do not imply audible playback.
- Show visible loading/buffering status, paused controls, ended summary, unavailable reason, and retry feedback.
- Add a small collapsed **Preview states** control, clearly prototype-only, to the shared video player and expanded audio queue panel. This is not a new service or production settings page.
- Controls can trigger deterministic buffering and a recoverable failure for the current eligible preview. A failed-first-attempt fixture fails once; explicit Retry succeeds on the same item.
- Ended demonstrations use normal finite completion rules, including autoplay if enabled; disable the ended option for non-finite live previews.
- Preview controls must not fabricate event lifecycle changes or mutate fixed Live fixtures into unrelated statuses.
- No random network failures, fake external fetches, fabricated adaptive-quality controls, or unimplemented volume/stream-quality options.

## 10. Accessibility and visual constraints

- Use existing UI primitives and theme tokens. Extend locally only for new track rows, media controls, playlist cards, and queue overlays.
- Maintain common corners and type hierarchy; no unrelated decorations or fake real-time equalizer.
- Use links for navigation and buttons for playback/mutation. No nested interactive elements or card-wide links wrapping actions.
- Target at least 44 × 44 CSS-pixel touch areas using the existing spacing scale.
- Give controls item-specific names: “Pause simulated preview: Fire & Gold,” “Seek Fire & Gold,” “Move Kingston Flow up,” etc.
- Native range inputs support arrows/Home/End, with elapsed/total `aria-valuetext`. Hide finite seeking for live previews.
- Announce track changes and significant player states through a polite status region, not every progress tick.
- Support focus visibility, Escape, dialog focus restoration, reduced motion, and narrow layout wrapping.
- Use existing inline SVG conventions; no emojis.

## 11. Implementation sequence and file scope

1. **Catalog and models**
   - Extend `src/data/mockContent.ts` with tracks, typed playlists, fixed event/broadcast fixtures, and media preview descriptors.
   - Add pure event selectors/formatting in `src/lib/eventPresentation.ts`.
   - Update route/content labels and catalog invariants without breaking existing IDs.
2. **Playback core**
   - Add pure `src/lib/playback.ts`, `MediaPlaybackContext`, deterministic clock/transition handling, and unit-style reducer checks.
   - Wire the provider in `src/main.tsx` and a common playback layout in `src/app/routes.tsx`.
3. **Audio surfaces**
   - Build `TrackCard`, `TrackRow`, track details, audio mini-player, and queue dialog.
   - Bind all controls to the provider; integrate tracks into MediaCard dispatch, Music, Home, artist profiles, Search, SearchModal, and My List.
4. **Typed playlists**
   - Update `PlaylistContext`, `PlaylistPage`, `AddToPlaylistMenu`, and playlist cards.
   - Preserve existing video lists; add audio lists, ordering, validation, and sequence playback.
5. **Video integration**
   - Convert `VideoPlayer` to controlled shared state.
   - Update `MusicVideoPage` and `WatchPage` for handoff, resume, retry, ended behavior, and canonical next-episode/video sequencing.
6. **Events and broadcasts**
   - Update `EventsPage`, `EventDetailPage`, event card presentation, related Home/hero consumers, and add `EventWatchPage`.
   - Preserve sports detail/highlight behavior; correct directly related notification/live claims.
7. **Verification and polish**
   - Verify all states and navigation flows below; fix only pass-related regressions.
   - Report simulation limits and verification honestly. Do not publish/deploy/commit unless separately requested.

## 12. Verification strategy

### Automated catalog checks

Extend `scripts/check-catalog.mjs` and run `pnpm run check:catalog`:
- Unique canonical IDs; unchanged existing destinations; collection references, not clones.
- Track artist/video relations and positive per-item durations.
- Audio playlists contain only tracks; video playlists only music videos; IDs/order valid.
- Every finite playable ID resolves to the same item in details and player, including extra show/movie records.
- Event/broadcast relationships are valid and every requested fixed state is represented.
- Physical-only events cannot resolve to a broadcast; cancelled/postponed events cannot play through deep links.
- Timezone formatting is stable even when the browser’s timezone differs.

Add `scripts/check-playback.mjs` with a `check:playback` package script, using the installed TypeScript transpiler and Node assertions, without adding a test framework. Keep reducer/helper modules free of runtime imports so they can be tested like the existing standalone catalog module.

Cover:
- Single playback ownership; no dual ticking.
- Switching while loading/buffering; stale callbacks cannot revive prior media.
- Shared current-track toggling, per-item resume positions, finite seek clamping.
- Audio/video handoff and no automatic audio resumption.
- Queue snapshots, duplicate occurrences, pending reorder/removal, current removal, clear, Next, stop at end, Replay queue.
- Recoverable Retry vs permanent unavailable, and pause during buffering.
- One completion/advance per item, playlist boundaries, episode/season boundaries, and final-item stopping.
- Invalid/missing IDs and duration metadata fail intentionally.

Run `pnpm exec tsc --noEmit`, `pnpm run build`, and `git diff --check`. Use `pnpm run format` only with intended changed files if formatting is needed; do not reformat unrelated files.

### Browser interaction checks

Use the host-supervised running preview; **do not start another dev server**. Discover available browser tooling rather than assuming a tool name or hardcoded port.

Verify desktop and narrow widths, including 1440, 768, 375, and 320 where practical:

1. Play tr1 from Tracks; navigate Home → artist → track details → Search → My List → playlist. Mini-player stays mounted, position continues, every occurrence agrees.
2. Pause from a track row, resume from the mini-player, seek, switch tracks, and use Next. No independent playing icons or overlapping simulation clocks.
3. Play/reorder an audio playlist, manipulate the pending queue, finish the last track, and verify no loop/autoplay. Playlist edits do not unexpectedly mutate the active snapshot.
4. Open video details while audio runs; audio continues. Start video; audio pauses and retains its position. End/leave video; audio stays paused. Resume audio; mounted video pauses.
5. Watch an existing video playlist in order and verify contextual next video; do not relabel its videos as tracks.
6. Open additional series details; play an episode, seek near completion, and verify the correct next episode actually starts when autoplay is enabled.
7. Exercise all event fixtures: scheduled, starting soon, live, ended, replay, postponed, cancelled, physical-only, and unavailable stream. Check action eligibility both through UI and direct URLs.
8. Retry a recoverable preview failure and verify a permanent unavailable stream does not falsely recover. Test loading/buffering pause/switch behavior.
9. Check keyboard focus, native seeking, queue/dialog Escape/return focus, item-specific accessible names, visible actions, and touch targets.
10. Confirm the mini-player does not obscure page actions/footer, page widths do not overflow, and existing rail hover/swipe behavior and More navigation remain intact.
11. Inspect runtime console errors and preserve representative screenshots for actual visual review. Re-run corrected checks after failures; distinguish environment failures from app failures.

## 13. Remaining limits to explain at delivery

- No audible tracks, actual video, live ingest, network buffering, or real broadcast-status feed exists; all playback states are explicit local simulations.
- No persistence after refresh, cross-tab/device synchronization, account storage, actual reminders, calendar delivery, or push/email notifications.
- Fixed demonstration schedules are examples, not real-time availability.
- Existing authorized artwork is reused; it is not evidence of audiovisual playback rights.
- No payments, ticket purchasing, new services, mobile app, publishing, or deployment.
- Preserve unrelated prototype limitations rather than implying they were solved by this pass.
