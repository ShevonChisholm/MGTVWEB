# Featured clip sound — 28 October 2026

Implemented and verified locally; not deployed. DRM and production email remain pending. Stop before the next enhancement.

## Behaviour

Shared HeroBackdrop tries sound-on for its existing public featured clips. A 44px top-right speaker button mutes/unmutes, with an accessible action label, tooltip and keyboard focus styling. MGTV colours, posters, gradients, diagonal corners and existing pause control remain. Music places the button 84px from the hero top to clear the fixed 64px navigation; inset heroes use 20px.

Only explicit clicks persist `mgtv.featured-muted.v1` in this browser/origin's localStorage. This is a device preference, not a profile/account setting. Browser policy fallback never writes the preference. Storage errors are tolerated; persistence cannot be promised when storage is disabled. New visits with no saved choice request sound. An unmuted NotAllowedError retries muted and reflects that actual state in the speaker icon. Clicking the icon explicitly retries sound inside a user gesture. If even muted playback is blocked, retain poster/play controls. Abort errors and stale asynchronous rejections do not become media failures; actual source failures retain the poster. Readiness events share one in-flight attempt, and pointer leave/unmount cancels pending ownership.

Poster-first mouse-hover playback remains. Touch-only and reduced-motion devices retain the existing poster-only behaviour. Pointer leave, offscreen visibility and hidden documents pause clips. Muting while explicitly paused does not resume. The delivery component now uses a stable forwarded video ref, preventing state updates from detaching/restarting the element. No API, access gates, provider assets/jobs, billing, DRM or email changes.

## Verification

- TypeScript and production build passed; existing chunk-size warnings remain.
- Focused featured-clip checks passed: default/stored/invalid/denied storage, sound-first, policy mute fallback, explicit override, in-flight deduplication, stale cancellation, AbortError, actual source failure and fully blocked playback.
- Existing playback checks and all eleven customer-session checks passed.
- Local production-built review used the existing isolated API/database at 127.0.0.1:5493 and existing real Mux clips. Home, Shows, Movies and Music began with posters and no mounted video until pointer interaction. Real media reached readyState 4 with time progressing; enabled sound verified via actual video.muted=false. Explicit mute survived navigation to Shows, explicit unmute survived navigation to Movies, and subsequent mute survived reload. Pause then mute stayed paused. Moving outside the hero removed the video and controls.
- 1280/768/390 viewport checks had document widths 1270/758/380 without horizontal page overflow. The 390px mouse-driven review placed the 44px control within the hero. This does not substitute for physical touch/Safari testing. On Music the control was initially covered by navigation; after correction its top was 84px and hit testing plus a real click verified reachability. Browser error capture was empty.
- Browser policy denial paths are covered deterministically by the controller checks; the review browser permitted audible playback after interaction. No claim that every first-time browser permits sound, or that actual blocked autoplay was reproduced in the review browser.

Evidence: [Home](evidence/featured-sound/home.png), [narrow Movies](evidence/featured-sound/phone.png), [Music](evidence/featured-sound/music.png). Preview deployment remains separate.
