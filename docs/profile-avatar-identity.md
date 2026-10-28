# Profile name and uploaded avatars

28 October 2026. Customer header now displays the active profile's name, rather than account/household displayName. The shared session identity refreshes after profile save. An account without a selected available profile sees Choose profile.

Identity editor now offers private JPEG/PNG/WebP upload (2 MB maximum), preview, save and colour-avatar replacement. The photo appears in profile selection, management/settings and the header. Create a profile first, then upload its photo. UI file read and save states disable interaction; API remains authoritative for format, ownership, parental verification and version checks. Failed profile-tile images fall back to the colour avatar. Existing MGTV layout retained.

TypeScript, production build, eleven customer-session checks and startup/route contracts passed. Auth/Profile API regression evidence and storage details: ../../api/docs/profile-avatars.md. Signed-in customer browser acceptance remains pending normal sign-in at http://127.0.0.1:5793/profiles. Not deployed. DRM/production email remain pending.


## Signed-in browser acceptance completed — 28 October 2026

User completed normal customer sign-in and the application's separate parental verification. An expired timed parent proof required normal profile unlock; no guard was bypassed. Original main profile: Gold household, gold colour avatar, no custom photo. Invalid TXT upload was rejected in the browser. A harmless synthetic PNG and temporary MGTV profile check name saved successfully through the configured cloud/R2 development adapter; private image loaded in settings and chooser and persisted after refresh. The currently selected profile's desktop header immediately displayed MGTV profile check, loaded its avatar, and retained both after refresh. Original name and colour avatar were then restored via the UI; chooser showed Gold household and zero custom profile images. No profile policy, PIN, account password, subscription or plan entitlement changed. Four profiles outside the current one-slot allowance remained unavailable for selection.

Identity editor contained at 320/390/768/1440px with zero page overflow or overflowing fields. Browser error log empty. Two synthetic uploaded objects remain private under the documented retained-media behavior; no production data or personal photo used. Evidence in apps/web/docs/evidence/profile-avatar/. This supersedes the earlier pending-customer-browser statements. No source change or deployment was needed for acceptance. DRM/production email remain pending; no next admin area started.
