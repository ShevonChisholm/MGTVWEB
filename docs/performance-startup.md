# Homepage startup performance â€” 26 October 2026

Scope: customer web startup only. Preserve the MGTV design, poster-first hover playback, profile access and subscription gates. No API/schema/data changes, paid services, DRM or production email.

## Measured cause

Opt-in `?mgtvPerf=1` records numeric browser LCP and resource timings to the local console only. No telemetry transmission or credentials/URLs in its report.

Baseline hosted desktop (1280px): LCP 3904ms; featured API 1626.6ms under startup contention; poster starts at 2924.4ms and finishes at 3787.2ms. Navigation TTFB 256.8ms. Phone viewport 390px: LCP 3068ms; featured 1929.9ms; poster starts 2594.1ms and finishes 3029.4ms. These are individual browser observations, not a field percentile or throttled-device benchmark.

## Changes

- Prioritize the existing profile-aware featured endpoint. Start background catalogs, lifecycle rails, advertising and full-home aggregation after the first poster decodes and paints. Five-second fallback, cancellation and explicit failure release prevent deadlock. Scheduling never authorizes content.
- Remove an unused Home catalog aggregation. Continue Watching remains actual profile history from movie/show/sports contexts.
- Load closed-cart data only when opened; reject stale responses after close.
- Split secondary routes, HLS video and audio playback from the eager Home path. Hover still controls featured clips; a metadata-ready callback handles deferred video mounting.
- Deliver lossless approved-logo derivatives and a small transparent favicon; retain the source master unchanged.
- Keep diagnostics opt-in and numeric; ten-second follow-up exposes background request ordering.

## Regression verification

TypeScript and production build pass. Startup gate cancellation/shared-waiter/fallback tests, ten session checks, access, playback, app-state, discovery and copy safeguards pass. The route safeguard now compares AST route/layout/import contracts: independently verified against the previous approved raw hash (with Windows line endings). Only that baseline entry changed; mutation checks reject route URLs, layout and module changes.

Browser checks: guest Home, Movies and Shows navigation, cart opening, poster-first hover playback and pointer-leave stop. Failed hero image and failed featured request release background work; failed page chunk shows the existing reload error and recovers after retry. Local prod-build LCP 616ms is diagnostic only, not a hosted result.

## Hosted acceptance

Deployed customer commit `f03317538b8d0a4ad6f66c9ff8ff63a7dfdf8bde`, Vercel `dpl_D9k395xzsFdj9tznPMFK83MbSGv7`, stable disposable preview https://mgtv-web.vercel.app. API and admin unchanged.

| Viewport | Baseline single run | Optimized runs | Median |
| --- | ---: | --- | ---: |
| Desktop 1280px |3904ms|1168,1076,892ms|1076ms|
| Phone 390px |3068ms|1280,1440,1024ms|1280ms|

All six guest observations were below 2500ms. First new-bundle phone run transferred 87030 bytes for the entry plus shared preload chunks; total initial script transfer 184774 bytes (including the diagnostic module), compared with 212597 bytes across the two baseline script entries. Entry chunk size alone is not the full startup payload. Browser cache remained enabled: later runs reused cached/revalidated scripts. No CPU/network throttling; phone tests are viewport checks rather than real-device benchmarks. These are warm Render observations, not a field percentile or guarantee for cold starts.

Desktop second run: featured 145.2ms; poster starts 655.1ms versus 2924.4ms baseline. Background catalog work starts 1025ms after the poster finishes at 977.6ms. The full/lifecycle catalogs still take several seconds to fill rails and remain a separate opportunity. Closed-cart Commerce and unused news/lifestyle requests are absent from initial Home startup.

Free-host sleeping/connection variance remains a preview constraint. No cache or access protections weakened. There was no paid hosting or provider change.



Signed-in acceptance: existing approved free-preview customer signed in, verified parental access with the existing password, selected the protected main adult profile, reloaded Home at both widths, then signed out. LCP 1436ms desktop and 2424ms phone; no Home alerts, horizontal page overflow or pre-hover video. The profile preference request transiently failed once during profile selection but succeeded on the subsequent profile visit; no preference mutation or authentication workaround was used. This existing-module reliability observation is deferred.

See `docs/evidence/lcp/optimized-all.json` for all eight measurements and `baseline-*.json` for the two baseline observations. First-load script transfer 184774 bytes versus212597bytes baseline (about 13% lower); most gain came from discovery order and avoiding API contention, not just script size. The deferred HLS chunk still produces Vite's large-chunk warning; it is loaded only when playback needs it.

Stop: Albums remains unstarted; DRM, real-footage acceptance and production email remain pending.


Final visual verification found that broad repository LFS rules caused Vercel to serve pointers for four new UI assets. Exact path exceptions and re-normalized binary blobs fix the delivery without changing the source artwork or other LFS objects. Final release `37184e374668a3978363c4670a32fb3dffb8d5a6`, deployment `dpl_7iCHFgV8ehBVAEWumXYhEC4suae8`. The eight above runs precede that image-delivery correction; repeat final-release checks below before treating the visual result as accepted.

Final-release acceptance: all three WebP deliveries and favicon returned 200 with exact expected byte lengths and SHA256 hashes. Browser logos have nonzero natural dimensions. Guest desktop LCP 1256ms; phone 956ms. Poster loaded, no horizontal overflow, no pre-hover video. See final-release.json separately from earlier observations. Temporary local review servers stopped; private configuration unchanged; customer review session signed out.
