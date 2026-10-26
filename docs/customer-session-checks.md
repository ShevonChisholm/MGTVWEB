# Shared customer session checks — 26 October 2026

Customer-only fix. Staff authentication, API permissions, UI layout, DRM and production email are unchanged. Artists remains unstarted.

The old session hook created a request for each mounted consumer and each route change. A shared in-memory store now supplies all hooks and non-React playback/advertising consumers, coalescing requests already in progress. Guest and authenticated results remain fresh for 30 seconds; route changes, focus and returning to a visible tab revalidate only when stale. There is no polling timer.

Sign-in, sign-out and profile changes invalidate immediately. Other tabs receive an opaque localStorage invalidation signal only; customer identity, session cookies and CSRF tokens are never persisted by the store. Protected API session-required/expired responses clear shared identity and CSRF state. Request generations prevent late responses from restoring a prior session or overwriting newer CSRF state. Network failures remain explicit errors and are briefly cached to avoid retry storms.

The existing protected session endpoint remains protected. A guest can still see one expected 401 during an initial or stale session check; the fix removes the per-component burst rather than hiding HTTP failures or weakening authentication.

Verification before deployment: ten session regression checks passed, including twelve concurrent hook consumers with one request, guest caching, signed-in reuse, freshness, profile/sign-out races, revocation, network recovery, prototype mode, the real auth adapter and stale CSRF responses. TypeScript, production build, access, playback and app-state checks passed. The pre-existing bundle size warning remains. Hosted browser verification follows deployment.

## Hosted verification

Deployed runtime commit 8e95cacd6300a0b57411f76813690e1d8251ceea; Vercel deployment dpl_2jDXvw25dWxK1ntrf5Fa6xGP6GNr is READY with the stable https://mgtv-web.vercel.app alias. Vercel calls this stable disposable preview its production target. No API or admin deployment was needed.

Hosted browser checks used the existing approved free preview customer through ordinary UI authentication: sign-in, password-based parental verification, protected main-profile selection, navigation to Movies, sign-out, and the guest Profiles gate all passed. Public guest homepage/Shows navigation worked. There was no page overflow at 390px or 1280px, and no JavaScript errors were observed. The customer was signed out after testing; no accounts, roles or permissions were created or changed.

The exact twelve-consumers/one-request assertion is an automated auth-adapter regression check, not a claim of browser network instrumentation. A separate hosted HTTP check confirms anonymous /api/v1/customer/session still returns 401 with SESSION_REQUIRED. The stable page serves the new shared-session bundle. Sanitized evidence is in docs/evidence/customer-session/hosted.json.

DRM and production email remain pending. Stopped before Artists.
