# MGTV MP3 player — raised transport and progress ring

Built and checked locally on 27 October 2026 (Jamaica). Not deployed to the hosted preview. DRM and production email remain pending. Stop before the next enhancement.

## Presentation

The connected MusicAudioProvider now renders MusicPlayerBar in place of native audio controls. A large gold Play/Pause button rises above the charcoal panel, with an advancing circular timeline and elapsed/total time underneath. Left: circular track artwork avatar, title, artist and preview identity. Right: restart, authorized next track, queue, close, mute and volume. Artwork is the current track cover, not an invented artist portrait. Existing MGTV colours, typography and diagonal corners are retained.

Desktop uses three balanced columns; phone layouts keep the orbit raised above the panel with compact identity and controls below. Player height remains observed by the existing content-clearance mechanism, including the raised area and safe-area inset. The ring has pointer dragging/click seeking and keyboard Arrow keys (five seconds), Page keys (ten seconds), Home and End. It exposes seconds/time through an accessible slider. Native volume keyboard support, focus rings, disabled controls, reduced motion and forced-colour styles are provided.

The real audio element remains inside AdaptiveAudio for authorized delivery and analytics, with native controls hidden. The existing session claim/handoff, profile checks, queue selection, heartbeats, progress persistence and source refresh remain in use. The new component owns presentation/progress updates, not session authority. Volume/mute is retained at provider level across element replacement, changing tracks, closing and reopening within that provider lifetime; it is not stored as an account preference or promised across browser reloads.

No shuffle/repeat or previous-track selection workflow was added. The backward icon is explicitly labelled Restart track. Next is unavailable when there is no following queue entry or during a handoff. Queue still opens the established music/player view. Full-track access still requires the normal account/profile checks; guest previews retain their distinct label.

## Verification

- TypeScript and production build passed. Existing bundle-size warnings remain separate performance work.
- New audio seek math checks pass: circular quadrants, keyboard clamps, zero/unknown duration and hour formatting.
- Existing playback, access and eleven customer-session checks passed.
- Production-build browser review used the existing real R2 MP3 through an isolated local API and the restored test database `mgtv_test_media_reset_restore_v1`. Main local database, hosted preview data/accounts, and provider assets were not changed. No provider jobs, upload, billing, DRM or production email were enabled for this UI review.
- Guest twenty-second real MP3 preview played with moving ring and clock. Play/pause, keyboard seek to ten seconds, click near quarter position (~4.99 seconds), drag near half (~9.99 seconds), mute and volume worked against the real audio element.
- Normal customer sign-in, parental verification and selected main profile led to full real audio (224.35 seconds). Album queue advanced Sunday Riddim → Sea and Soul → Coastline Drive through existing server selection/access checks. Volume remained 0.2 across the final transition and after closing/reopening.
- A paused 1:30 position persisted as Track 5 of 12; re-opening the listening page did not autoplay. Resume started the real track from that stored position.
- At actual 320/390/768/1280 widths, document widths were 310/380/758/1270 with no horizontal page overflow. The centre button rose above the panel and the panel stayed inside the viewport at every checked size. Final production-review tab had no captured browser errors.

Evidence: [browser.json](evidence/mp3-player/browser.json), [desktop](evidence/mp3-player/desktop.png), [phone](evidence/mp3-player/mobile.png).

The local Vite dev-server path exposed pre-existing lazy-initialization ordering in HeroBackdrop. MusicAudioContext now initializes its lazy audio after imports; unrelated HeroBackdrop changes were deferred. This review used the deployable production bundle rather than claiming that separate dev-server issue is resolved. Physical iOS/Safari, hardware-volume restrictions, screen-reader hardware and real provider/network failure injection were not exercised in this pass.

## Local review

While the task review server is running: http://127.0.0.1:5493/music/player. It uses an isolated restored database and existing private R2 delivery. The player is paused for review. Production preview stays unchanged until deployment is requested.
