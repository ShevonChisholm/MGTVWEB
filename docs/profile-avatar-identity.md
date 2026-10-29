# Profile name and uploaded avatars

28 October 2026. Customer header now displays the active profile's name, rather than account/household displayName. The shared session identity refreshes after profile save. An account without a selected available profile sees Choose profile.

Identity editor now offers private JPEG/PNG/WebP upload (2 MB maximum), preview, save and colour-avatar replacement. The photo appears in profile selection, management/settings and the header. Create a profile first, then upload its photo. UI file read and save states disable interaction; API remains authoritative for format, ownership, parental verification and version checks. Failed profile-tile images fall back to the colour avatar. Existing MGTV layout retained.

TypeScript, production build, eleven customer-session checks and startup/route contracts passed. Auth/Profile API regression evidence and storage details: ../../api/docs/profile-avatars.md. Signed-in customer browser acceptance remains pending normal sign-in at http://127.0.0.1:5793/profiles. Not deployed. DRM/production email remain pending.


## Signed-in browser acceptance completed — 28 October 2026

User completed normal customer sign-in and the application's separate parental verification. An expired timed parent proof required normal profile unlock; no guard was bypassed. Original main profile: Gold household, gold colour avatar, no custom photo. Invalid TXT upload was rejected in the browser. A harmless synthetic PNG and temporary MGTV profile check name saved successfully through the configured cloud/R2 development adapter; private image loaded in settings and chooser and persisted after refresh. The currently selected profile's desktop header immediately displayed MGTV profile check, loaded its avatar, and retained both after refresh. Original name and colour avatar were then restored via the UI; chooser showed Gold household and zero custom profile images. No profile policy, PIN, account password, subscription or plan entitlement changed. Four profiles outside the current one-slot allowance remained unavailable for selection.

Identity editor contained at 320/390/768/1440px with zero page overflow or overflowing fields. Browser error log empty. Two synthetic uploaded objects remain private under the documented retained-media behavior; no production data or personal photo used. Evidence in apps/web/docs/evidence/profile-avatar/. This supersedes the earlier pending-customer-browser statements. No source change or deployment was needed for acceptance. DRM/production email remain pending; no next admin area started.


## Preview deployment completed on 28 October 2026

API 8006044 is live as dep-dbh8jfmc6qcc73em3dh0. Startup logs confirm migration 060_profile_avatars.sql applied before readiness. Customer 5e4cdfb is READY as dpl_6sQcGoCCh2poPE6J6zXDvKkyzjnx at https://mgtv-web.vercel.app. Admin cbc3d67 is READY as dpl_5uYt4WbSqR3tbHde8GvESBWqB3TG at https://mgtv-admin.vercel.app. Exact Git SHAs and stable aliases verified; no main-branch promotion. These stable Vercel aliases are its Production target for the existing disposable preview, not the business production release.

Hosted acceptance used existing customer/staff sessions and normal user-completed preview parental verification. Selected Jordan profile was temporarily renamed and given a synthetic avatar through the production-shaped R2 preview path. Header name/photo updated immediately and survived reload. Original Jordan name, jade colour and no custom photo restored; main Chizzy profile untouched. Identity editor contained at 320/390/768/1440px with no page overflow. Four Awards program cards and all nine saved nominees loaded real artwork. Open ballot edit fields and Save remained disabled. Closed-program result preview retained reason/title confirmation and disabled Confirm; cancelled without release. Nominee screen contained at the same four widths. Fresh profile-editor and Awards browser error logs were empty.

Direct API and both frontend health proxies returned ok/preview/postgresql. Cookie-free customer session, private-avatar and admin Awards requests returned 401. No permission, PIN, password, subscription, voting/result or production provider setting changed. The admin release also carries the previously reviewed Sponsors & Advertising visual work; no new area was implemented during rollout.

Runtime limitation: broader homepage/catalog/notification database timeouts were observed after rollout. Matching statement timeouts on notifications, advertising, artists and albums are present before this release at 20:30 UTC on the previous API instance. Preserve this existing reliability follow-up; do not describe the entire preview as runtime-error-free or infer a cause from this comparison. Database external allowlist remained private; migration proof came from startup logs and successful hosted avatar writes/reads, without weakening network controls.

Full deployment/rollback IDs and verification record: apps/api/docs/profile-awards-preview-release.json. The avatar migration is additive; application rollback does not reverse it. DRM and production email remain pending. Stopped before the next admin area.
