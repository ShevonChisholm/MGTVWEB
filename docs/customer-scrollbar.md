# Customer page scrollbar

Deployed to the existing disposable preview on 26 October 2026. Runtime commit e8d6829a28529adb12910373a8d1945cd7f48f76; Vercel deployment dpl_CEM5BPgmWET6VQaU7yhFNocgK1t6.

The root page scrollbar uses native thin sizing, the existing MGTV gold-muted thumb (#7A6430) and charcoal surface track (#141414). Older engines receive an 8px WebKit fallback with a rounded thumb. Forced-colors mode restores platform sizing/colors; no scroll interception, overflow locks or scrollbar hiding was added. Existing hidden rails and the player recommendation scrollbar keep their own rules. The admin app and API were not changed or deployed.

Type checking and the customer build passed. Hosted checks confirmed the computed root styling and no horizontal page overflow on Home, Shows, Movies, Music, Events and Shop at 1280px, plus Shop at 390px. Native Page Down scrolling worked. No browser console errors were captured. The high-contrast CSS fallback was reviewed in source; OS high-contrast settings and older browser engines were not manually exercised. See docs/evidence/customer-scrollbar/verification.json.

DRM remains required for production and pending. Production email remains pending. Stop point: before Sponsors.
