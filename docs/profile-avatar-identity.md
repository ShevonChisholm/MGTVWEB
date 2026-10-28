# Profile name and uploaded avatars

28 October 2026. Customer header now displays the active profile's name, rather than account/household displayName. The shared session identity refreshes after profile save. An account without a selected available profile sees Choose profile.

Identity editor now offers private JPEG/PNG/WebP upload (2 MB maximum), preview, save and colour-avatar replacement. The photo appears in profile selection, management/settings and the header. Create a profile first, then upload its photo. UI file read and save states disable interaction; API remains authoritative for format, ownership, parental verification and version checks. Failed profile-tile images fall back to the colour avatar. Existing MGTV layout retained.

TypeScript, production build, eleven customer-session checks and startup/route contracts passed. Auth/Profile API regression evidence and storage details: ../../api/docs/profile-avatars.md. Signed-in customer browser acceptance remains pending normal sign-in at http://127.0.0.1:5793/profiles. Not deployed. DRM/production email remain pending.
