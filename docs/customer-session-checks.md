# Shared customer session checks — 26 October 2026

Customer-only fix. Staff authentication, API permissions, UI layout, DRM and production email are unchanged. Artists remains unstarted.

The old session hook created a request for each mounted consumer and each route change. A shared in-memory store now supplies all hooks and non-React playback/advertising consumers, coalescing requests already in progress. Guest and authenticated results remain fresh for 30 seconds; route changes, focus and returning to a visible tab revalidate only when stale. There is no polling timer.

Sign-in, sign-out and profile changes invalidate immediately. Other tabs receive an opaque localStorage invalidation signal only; customer identity, session cookies and CSRF tokens are never persisted by the store. Protected API session-required/expired responses clear shared identity and CSRF state. Request generations prevent late responses from restoring a prior session or overwriting newer CSRF state. Network failures remain explicit errors and are briefly cached to avoid retry storms.

The existing protected session endpoint remains protected. A guest can still see one expected 401 during an initial or stale session check; the fix removes the per-component burst rather than hiding HTTP failures or weakening authentication.

Verification before deployment: ten session regression checks passed, including twelve concurrent hook consumers with one request, guest caching, signed-in reuse, freshness, profile/sign-out races, revocation, network recovery, prototype mode, the real auth adapter and stale CSRF responses. TypeScript, production build, access, playback and app-state checks passed. The pre-existing bundle size warning remains. Hosted browser verification follows deployment.
