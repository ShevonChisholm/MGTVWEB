# Homepage startup performance — 26 October 2026

Scope: customer web startup only. Preserve the MGTV design, poster-first hover playback, profile access and subscription gates. No API/schema/data changes, paid services, DRM or production email.

## Measured cause

Opt-in `?mgtvPerf=1` records numeric browser LCP and resource timings to the local console only. No telemetry transmission or credentials/URLs in its report.

Baseline hosted desktop (1280px): LCP 3904ms; featured API 1626.6ms under startup contention; poster starts at 2924.4ms and finishes at 3787.2ms. Navigation TTFB256.8ms. Phone viewport390px: LCP3068ms; featured1929.9ms; poster starts2594.1ms and finishes3029.4ms. These are individual browser observations, not a field percentile or throttled-device benchmark.

## Changes

- Prioritize the existing profile-aware featured endpoint. Start background catalogs, lifecycle rails, advertising and full-home aggregation after the first poster decodes and paints. Five-second fallback, cancellation and explicit failure release prevent deadlock. Scheduling never authorizes content.
- Remove an unused Home catalog aggregation. Continue Watching remains actual profile history from movie/show/sports contexts.
- Load closed-cart data only when opened; reject stale responses after close.
- Split secondary routes, HLS video and audio playback from the eager Home path. Hover still controls featured clips; a metadata-ready callback handles deferred video mounting.
- Deliver lossless approved-logo derivatives and a small transparent favicon; retain the source master unchanged.
- Keep diagnostics opt-in and numeric; ten-second follow-up exposes background request ordering.

## Regression verification

TypeScript and production build pass. Startup gate cancellation/shared-waiter/fallback tests, ten session checks, access, playback, app-state, discovery and copy safeguards pass. The route safeguard now compares AST route/layout/import contracts: independently verified against the previous approved raw hash (with Windows line endings). Only that baseline entry changed; mutation checks reject route URLs, layout and module changes.

Browser checks: guest Home, Movies and Shows navigation, cart opening, poster-first hover playback and pointer-leave stop. Failed hero image and failed featured request release background work; failed page chunk shows the existing reload error and recovers after retry. Local prod-build LCP616ms is diagnostic only, not a hosted result.

## Hosted acceptance

Pending deployment and repeated desktop/phone measurements; record all observations and cache limitations. Free-host sleeping/connection variance remains a preview constraint. No cache or access protections weakened.
