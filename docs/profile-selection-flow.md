# Customer profile selection flow

28 October 2026. Implemented, checked locally and deployed to the stable disposable customer preview.

## Experience

Customer sign-in leads to the standalone /profiles chooser, including one-profile accounts. MGTV branding, charcoal/gold surfaces, diagonal-corner avatar tiles, concise labels and lock/pencil/plus icons keep selection visual. The application navigation, footer, account settings and audio dock do not crowd the chooser. Entering profile flow pauses audio while keeping its element, queue and resume state mounted.

Selecting an unprotected profile confirms it through the existing API and continues to a validated internal return destination. Selecting a protected profile opens /profiles/unlock/:id, even when recent parental proof exists. The separate challenge offers the account password or six-digit shared parental PIN. This increment does not introduce individual profile credentials. Incorrect verification stays blocked. Parent verification does not invalidate the signed-in identity or discard a mounted editor; profile selection then refreshes authoritative session identity before continuing.

Manage Profiles is a separate mode with edit overlays and Done. It requires recent server parental proof, not simply choosing an adult profile. Each profile has a settings hub and separate name/avatar, language/playback, parental policy and deletion views. Shared PIN setup remains a separate account-level screen; /parental-controls preserves its legacy entry. The main adult profile remains undeletable. The existing mutation handlers retain ownership, CSRF, version preconditions and idempotency.

Add appears only below the server allowance: Free/Roots 1, Rhythm 3, Gold 5, absolute maximum 5. Direct Add navigation at capacity shows an explanatory state without a creation form. Saved excess profiles remain managed according to existing API availability policy. No tier is inferred from a role or a client-stored plan. Account settings retain subscriptions, notification preferences and sign-out separately.

## Verification

- TypeScript and production build passed; existing HLS chunk-size warning remains.
- Safe-return/chooser-loop and profile-limit boundary checks passed. Eleven shared-session checks, existing access/playback/startup/route checks passed.
- Existing API Auth/Profile regression suites: 25 passed in an isolated test database. No backend source or schema change.
- Browser acceptance used a separate local database with fabricated Gold and Free customers, no staff grants and no provider/email jobs. Normal local and hosted accounts were untouched.
- Sign-in to chooser, protected wrong-PIN rejection, correct PIN unlock, preserved /account return destination, fresh-session password management verification, protected challenge after management, identity edit persistence, two creations from 3 to 5 profiles, Add removal and direct capacity guard passed. One-slot Free account showed no Add and selected its unlocked main profile directly.
- Main-profile settings omit deletion. Chooser, settings and parental-policy layout contained at 320/390/768/1280px; representative mobile unlock screenshot saved. Route headings receive focus. Existing reduced-motion behavior retained.
- Final-build PIN selection and password management verification rechecked after correcting an initial CSRF timing issue. Parent verification must not call identity invalidation before the next authenticated mutation.

## Boundaries

This browser pass did not reset a parental credential, execute final deletion, wait for a real five-minute proof timeout, or perform exhaustive assistive-technology testing. Existing API tests cover authorization and profile invariants; client expiry hides the editor behind re-verification. Do not describe these as newly browser-verified paths. No production email, DRM, subscription purchase or provider upload was enabled. Customer deployment is now complete; no other admin area started.


## Preview rollout

Customer commit 2c01b60d04b62597bf8fd5ebd8e340d0f1e66494 deployed READY as dpl_58B5XEWodqvmZ3LDU22fw4fLCtHF at https://mgtv-web.vercel.app. Previous rollback: a73e991 / dpl_3reGV9bTMd2c2gxK3pnc1UK9UaYh. Vercel calls this stable disposable-preview address its Production target; business production remains pending. No API, database schema, provider configuration or admin deployment changed.

Hosted acceptance: guest chooser sign-in gate; existing Gold customer login to standalone five-profile chooser; capacity label and Add omission; protected Jordan profile challenge, method switch to account password and successful selection to homepage; return to chooser, management mode and settings hub; identity editor and direct deep-link refresh. Settings contained at 390/768/1280px (document widths 380/758/1270px). Browser error log was empty. No hosted profile fields, PINs, policies, subscriptions or permissions were changed; session sign-in, parental verification and active-profile selection were the only authentication mutations. The PIN-specific, create and identity-save paths were verified locally in the earlier isolated database, not repeated against hosted records. DRM and production email remain pending.
