# MGTV — Shared Profiles, Discovery, Restrictions, Notifications, and Mock Awards

## 1. Objective and approval boundary

Complete the existing MGTV customer-web prototype using shared, **in-memory mock state only**. Preserve its charcoal-and-gold visual identity, typography, shared card families, navigation, canonical content destinations, audio/video playlist separation, persistent mini-player, simulated playback behavior, and fixed event/broadcast examples.

This document is an implementation plan, not a claim that these changes have been made. Implementation starts only after plan review.

### Confirmed user decisions

- Hide restricted content from discovery. Explain restrictions on direct links rather than displaying locked cards throughout discovery.
- Demonstrate adult-only awards eligibility, with **one mock vote per account per category**, shared across adult profiles.
- First load starts signed in to the adult demo account.
- Guests and expired sessions can browse and play allowed free previews. Saving, reminders, personal playlists, voting, and account settings require simulated sign-in; premium previews require the demo account.
- Both existing profile-creation flows must write to one collection. Active profile, saved items, preferences, and viewing activity must work across the app.
- Retain a **provisional maximum of five total profiles**, including the main profile, and flag it for product confirmation.

### Explicit exclusions

No backend, database, Payload migration, real authentication, external integrations, real submissions, emails, push notifications, livestream sources, payments, checkout, mobile application, deployment, publishing, or commits. No new photography or visual redesign is needed.

State survives route navigation and profile switching within the current mounted app. Reload resets the demo. Do not introduce localStorage, sessionStorage, cookies, credential persistence, or cross-tab synchronization.

## 2. Repository-grounded findings

The workspace is a React 19 / Vite 8 / TypeScript / Tailwind v4 application using `react-router`. `AGENTS.md` is the repository instruction source; `CLAUDE.md` points to it.

| Area | Current implementation and gap |
| --- | --- |
| Provider composition | `src/main.tsx` mounts Toast, Interaction, Playlist, Saved, and MediaPlayback providers above the router. These are suitable integration boundaries; no framework migration is needed. |
| Profiles | `ProfilesPage.tsx` owns an isolated Alex/Jordan array. Continue only clears local selection; edit does not save. Its quick-add modal has no usable opening action. `CreateProfilePage.tsx` collects information but only navigates on completion. |
| Account | `AccountPage.tsx` renders a constant user, hard-coded profile count, inert saves, and page-local notification preferences. |
| Authentication | Dedicated `/auth/*` routes exist. Sign-in simulates a delay and navigates but does not change shared session state. Registration and verification do not complete a shared account flow. |
| Saved / interactions | `SavedContext.tsx` and `InteractionContext.tsx` contain app-wide sets and records, not profile-specific data. |
| Playlists | `PlaylistContext.tsx` already validates audio/video compatibility and supports editing; user-owned lists are not scoped to profiles. |
| Playback | `lib/playback.ts` is a standalone reducer tested by `scripts/check-playback.mjs`. `MediaPlaybackContext.tsx` owns simulated sessions and queues. Progress is session-wide; Continue Watching and resume selection still read static catalog progress. |
| Catalog / navigation | `data/mockContent.ts` exports canonical objects, `catalogById`, `contentPath`, `playableItem`, and `watchPath`. Keep these identities and URL formats. Events and broadcasts are separate entities with fixed demo states. |
| Discovery | `FilterSidebar.tsx` accepts one `active: string`; even grouped controls would overwrite each other. Several pages use genre/category alone. Search also keeps its category separately from its query URL. |
| Restrictions | `ParentalControlsPage.tsx` holds local settings and only flashes “Saved”; browsing and playback do not consult them. Ratings include both movie and television classifications. |
| Notifications | Navbar owns a hard-coded unread count, dropdown owns immutable fixture rows, and `/notifications` owns another fixture list and read state. Event reminder toggles live elsewhere. |
| Awards | Votes are page-local, eligibility is absent, and a hard-coded closing date implies real open voting. |
| UI foundations | Reuse `Button`, `ButtonLink`, `Text`, `Input`, `SessionDialog`, existing SVG conventions, and semantic Tailwind tokens in `index.css`. Extend local primitives only for missing semantics. |

There is no general test framework installed. Existing prescribed checks are `pnpm check:catalog`, `pnpm check:playback`, `pnpm build`, and the documented `npx tsc --noEmit`. Formatting uses the existing `pnpm format` entry point.

## 3. State architecture and interfaces

### 3.1 One mock application state owner

Add `src/context/AppStateContext.tsx`, backed by pure typed state/reducer functions in `src/lib/appState.ts` and fixed fixtures in `src/data/mockAccount.ts`. Mount it above the existing domain providers in `main.tsx`.

Use one reducer for account/profile mutations so validation, profile deletion, reminder synchronization, vote limits, and read updates are atomic. Do not replace the existing playback reducer with a monolithic application reducer.

Core model:

```ts
type SessionStatus = 'guest' | 'signedIn' | 'expired'
type ProfileType = 'adult' | 'teen' | 'child'
type MutationResult = { ok: true } | { ok: false; reason: string }

interface MockAppState {
  session: { status: SessionStatus; accountId: string | null }
  account: DemoAccount
  profiles: Profile[]
  activeProfileId: string | null
  profileData: Record<string, ProfileData>
  accountNotifications: NotificationRecord[]
  votesByCategory: Record<string, MockVote>
  awardsPhase: 'open' | 'closed' | 'resultsPending'
}
```

`Profile` contains stable ID, name, type, avatar-color token, main-profile flag, and preferences. `ProfileData` contains saved IDs, likes, ratings, follows, reminders, recent views, viewing positions/completions, daily video usage, profile notification records/read state, and user-owned playlists.

`DemoAccount` contains mock account ID, display name/email/country, display-only subscription fixture, account communication preferences, and a clearly non-secure demo parental PIN. Never store password form values in shared state.

### 3.2 Scope decisions

| Data | Scope |
| --- | --- |
| Account details, mock session, demo PIN, display-only subscription | Account |
| Profile collection and active profile selection | Account |
| Votes and awards phase | Account/demo scenario |
| Saved items, likes, ratings, follows, reminders, interests, language, autoplay, notification preferences | Profile |
| Viewing positions, completed items, recent views, daily video usage | Profile |
| User-created playlists and owned fixture playlists | Profile |
| Editorial playlists, canonical catalog, event/broadcast fixtures | Shared read-only |
| Shopping cart | Existing session/account-level behavior; do not expand commerce |
| Filters | Per-route URL query state, not profile preferences |
| Pending confirmations, form drafts, drawer visibility | Local component state |

Seed Alex/adult/main, Jordan/teen, and a clearly named child demo profile so all requested states are reachable immediately. Only Alex receives the existing sample Continue Watching progress. Other profiles begin with empty viewing history and saved items. Profile counts and all labels derive from this collection.

### 3.3 Preserve existing consumer APIs

- Convert Saved, Interaction, and Playlist contexts into adapters over the shared state, retaining existing hook names and operations wherever possible.
- Keep transient cart/drawer state in its existing boundary.
- Move reminders into the shared model, exposing the existing reminder methods through the Interaction adapter.
- Expose a notification hook/adapter for both notification views and Navbar; do not maintain duplicate counters.
- Domain mutators validate signed-in status, active profile, content eligibility, and ownership—not merely disabled UI.
- Return an explicit result for operations that can fail. Show a specific inline message or toast; never report success for rejected mutations.
- Keep reducer updates immutable and deterministic. Generate IDs and timestamps before dispatch; use stable unique IDs rather than array length or a reusable module sequence.

## 4. Session and profile journeys

### 4.1 Simulated authentication

- Navbar and account entry display the current profile name/avatar and session state. Guests see Sign In; signed-in users see profile/account actions and Sign Out; expired users see a visible “Demo session expired” explanation.
- Add a compact, clearly labeled **Demo controls** disclosure, accessible on desktop, mobile, and auth routes. It offers Guest, Signed-in adult, Signed-in teen, Signed-in child, Expire session, awards phase, viewing-limit demonstration, and Reset demo.
- Scenario controls are explicitly reviewer tools, not production authentication or a hidden parental bypass. Switching scenarios retains this session's data unless Reset is chosen.
- Guest and expired use the same public capabilities; expired retains its distinct explanation and the account data for simulated reauthentication.
- Protected routes show an inline gate with dedicated sign-in navigation. Do not revive `AuthModal.tsx` or add authentication modals.
- For signed-out protected actions, present a direct sign-in link with a validated same-origin relative `returnTo`. Do not automatically execute a save, reminder, vote, or playlist mutation after sign-in.
- Sign-in validates visible fields, disables duplicate submissions, clearly states that any valid demo input simulates access, updates session state, and proceeds to profile selection.
- Profile confirmation activates the profile globally and continues to a safe `returnTo` or Home. A restriction still applies if that destination is inappropriate.
- Sign-out or expiry stops playback and clears pending confirmations, but keeps the session's account/profile data for a later demo sign-in.

Registration remains a local demonstration: validate fields, keep only non-sensitive draft account details, route to verification, offer “Simulate verification — no email sent,” then create the first main adult profile through the shared creation flow. Replacing the existing demo account requires explicit confirmation and resets its associated profile data and votes. Forgot/reset-password pages must say no email is sent and no real password is changed; offer an explicit simulated continuation. No credentials leave the form or survive route exit.

### 4.2 Profiles

- Keep the dedicated guided `/profiles/create` journey and expose the existing quick-add dialog through an explicit secondary “Quick add” action on `/profiles`.
- Both use the same validated `createProfile` operation and defaults. The guided flow retains avatar, age, language, genres, and regions.
- Name: trim, require 1–20 characters; allow duplicate display names because IDs establish identity.
- Recheck the five-total-profile limit inside the reducer at final submission. At capacity, disable add entry points, explain the limit, and handle direct navigation or a stale open form without creating a sixth profile.
- Creating a profile adds it once and activates it only on the final confirmed “Start watching” action. Canceled or abandoned drafts do not create records.
- Selecting and continuing updates the whole app, including Navbar, recommendations, My List, playlists, notifications, Continue Watching, autoplay, and restrictions.
- Edit saves real profile fields. Cancel discards the draft. Child/teen users cannot change their own age classification or controls.
- Delete uses confirmation, cannot delete the main profile, and removes that profile's scoped state. Deleting the active profile returns to profile selection without automatically playing or revealing another profile's data.
- Retain existing routes. Use the existing edit surface for preferences rather than introducing all optional account/profile routes from the historical brief.
- Show “Demo limit: 5 total profiles — awaiting product confirmation” near management/help copy. Correct directly conflicting profile-limit copy in MGTV+ without redesigning its plan cards.

### 4.3 Account and preferences

- Replace hard-coded name, email, avatar, profile count, and overview values with selectors.
- Personal-info edits validate name/email and update account overview immediately after Save; Cancel discards drafts.
- Clearly separate account communication preferences from the active profile's language, genres, regions, followed artists, autoplay, and in-app notification preferences.
- Notification toggles are shared profile preferences, not tab-local state.
- Language is a saved preference; do not imply full interface translation. Genre/region preferences influence recommendation ordering and contextual copy, never content authorization.
- Overview actions select existing tabs or navigate to existing canonical routes. Subscription and security actions that have no real implementation show explicit prototype explanations rather than silently doing nothing or implying real billing/password/device changes.

## 5. Profile-aware viewing and playback preservation

- The existing playback reducer remains responsible for live runtime ownership, loading/buffering/retry, queue snapshots, elapsed time, and completion.
- Profile viewing records are the remembered snapshots used on returning to an item or profile. Update them during actual simulated video playing, throttled to once per second, and flush on seek, pause, completion, navigation release, profile switch, sign-out, and expiry.
- Merely opening details or preparing a paused player does not count as watched. Recently viewed may record an allowed detail visit separately.
- Use profile positions/completions for progress bars, remaining-time labels, Continue Watching, and show resume selection. Static catalog progress is only a first-load Alex fixture, never a fallback that overwrites another profile's empty or updated history.
- For shows: resume the most recently viewed incomplete episode; otherwise choose the earliest incomplete episode in season/episode order; if all are completed, offer Watch again starting at episode one.
- Keep `contentPath` and URL prefixes unchanged. Add optional viewing-state inputs to the existing playable/resume helpers or one profile-aware wrapper used consistently by cards, heroes, show details, and watch-page actions; preserve default helper behavior for existing catalog checks.
- Continue Watching includes only incomplete finite video items with progress; exclude completed items, live broadcasts, and audio tracks.
- Changing profiles flushes the old profile's progress, clears runtime audio/video and pending next-item callbacks, and loads the new profile paused. Never carry queues or auto-resume across profiles.
- Own playlists are profile-specific; editorial lists remain shared. Existing kind compatibility, ordering, queue snapshots, and duplicate-occurrence identity rules remain intact.
- Profile autoplay applies to episode advance, music-video sequence advance, and audio queue advance. Off means stop at completion while retaining manual Next.
- Preserve the single-playback-owner rule, audio paused by video, no automatic audio restart when leaving video, stale callback protection, deterministic failure/buffering fixtures, no live seeking, and unavailable-stream behavior.

## 6. Effective parental and access policy

Add pure policy functions in `src/lib/accessPolicy.ts`, consumed by discovery selectors, route/detail gates, mutations, and the playback boundary.

### 6.1 Provisional classification rules

Normalize equivalent labels into these ordered demo levels:

| Level | Equivalent classifications |
| --- | --- |
| General | G, TV-G |
| Guidance | PG, TV-PG |
| Teen 13 | PG-13 |
| Teen 14 | TV-14 |
| Mature | R, TV-MA |

Defaults and maximum type ceilings: adult = Mature, teen = Teen 14, child = Guidance. A per-profile setting may lower that ceiling but cannot raise it above the profile-type maximum. Unknown/unrated content is hidden and blocked for teen/child; adult can browse it with an Unrated label.

Episodes inherit their parent show's classification. Give other discoverable/playable fixtures explicit provisional ratings and free/premium access metadata rather than assuming missing values are child-safe. Tracks and videos can share a rating where their mock content is equivalent; broadcasts inherit the parent event policy. Artist biographies can remain General while their related media are filtered independently.

Free/premium access is separate from age classification: premium content may remain discoverable to public users with its existing badge, but premium playback requires simulated sign-in. Add explicit access metadata because “new” is not an entitlement tier.

### 6.2 Enforcement and presentation

- Apply restrictions before rendering Home rails, feature slides/backgrounds, landing-page heroes and collages, discovery grids, quick-search suggestions, full search, related content, artist media, playlists, My List, reminders, and content-linked notifications.
- Recompute result counts from allowed items. Never leak restricted titles/art through result totals, hidden carousel slides, unfiltered side lists, or fallback heroes.
- Pick the first eligible featured item. If none is eligible, retain a neutral branded section with explanatory copy and no restricted artwork.
- Existing restricted IDs display “Not available for this profile,” without title/art or player initialization, and offer safe navigation/profile switching. Unknown IDs remain Not Found.
- Central playback authorization covers audio start/toggle, enqueue, queue selection/replay/advance, video prepare/play/retry, episodes, music-video sequences, event broadcasts, and direct player dispatch.
- Wrap the public playback dispatch in current policy checks; reconcile queue entries against policy before transitions, including reducer-driven completion advance. Map broadcast IDs back to parent events. Do not trust an old queue's eligibility snapshot after settings change.
- On tighter controls, immediately stop an ineligible active session, remove ineligible queued entries, invalidate pending ready/ended callbacks, and expose an accessible reason. Derived playback state must not briefly present an ineligible running session while an effect catches up.
- Do not treat parental blocks as retryable media-source failures.

### 6.3 Parent management and PIN

- `/parental-controls` selects the target profile, loads its current values, saves atomically, and supports Cancel.
- Only a signed-in adult may manage profiles or parental settings. Teen/child can inspect a read-only restriction summary.
- Use a clearly labeled demo PIN, initially `1234`; explain that it offers no real security. Validate a four-digit PIN with associated error text.
- When PIN protection is enabled, require it for parental edits, changing protected profile type/age, and switching from a teen/child profile to an adult profile. A successful check authorizes only that action; no indefinitely unlocked session.
- Wrong or canceled PIN makes no state change. Reviewer scenario controls remain explicitly separate from the customer flow.

### 6.4 Viewing and purchase restrictions

- Enforced daily viewing limits count actual simulated **video** playing seconds, including live event video, not browsing, paused/loading/buffering time, seeking, or audio listening.
- Use the existing fixed demo date as the budget day; show this fact. Default limits are disabled; adults may enable 1–8 hours per target profile, defaulting to 2 hours when enabled.
- Reaching the budget stops video and blocks further video start/autoplay; browsing and audio remain available. Lowering the limit below used time takes effect immediately.
- Demo controls can set the active profile to ten seconds below its configured/default two-hour limit and can reset demo usage, avoiding hours-long manual testing.
- Purchase restrictions gate existing mock plan-change/checkout entry actions with the demo PIN when enabled. Even after authorization, show “Payments are not connected”; do not change plans, create orders, or contact payment services.
- All classification, age, PIN, time-limit, and purchase behavior is provisional prototype policy, not production safety/security certification.

## 7. Independent discovery filters and genuine empty states

### 7.1 Shared filter contract

Replace the single `active: string` filter contract with keyed groups:

```ts
interface FilterGroup {
  id: string
  label: string
  options: { value: string; label: string }[]
}
type FilterSelection = Record<string, string | undefined>
```

Each group is independently single-select; All/Any removes that group's key. Combine different groups with AND. Selecting Genre must not erase Region or Format. No multi-select complexity is needed for this pass.

Add pure matching/normalization functions in `src/lib/discovery.ts` and shared route-query handling in `src/hooks/useDiscoveryFilters.ts`. Reuse `FilterSidebar` for desktop sidebar content and a mobile modal drawer. No second filter implementation for different breakpoints.

- Valid filter keys/values are serialized in URL search parameters; preserve `q` and Music's existing `view`.
- Back/forward and direct links restore the same selections and result set. Unknown filter keys/invalid values are ignored and normalized safely.
- Music views retain compatible filter values and clear only groups that do not apply to the new format.
- Drawer selections apply immediately, remain open while choosing additional groups, and have a Done action. Desktop and mobile edit exactly the same selection.
- Show removable **active-selection chips only**, e.g. “Genre: Reggae ×”, with Clear all and an announced result count. This is not a return to horizontal rows containing every available filter option.
- Clear all removes filters only, not search text or music format.
- Enumerate facet choices from the profile-eligible base dataset, not the progressively narrowed results, so valid but incompatible combinations can produce honest zero results.

### 7.2 Page coverage

Add explicit fixture metadata where needed. Use known content facts or clearly marked mock values; do not parse displayed prose for behavior.

| Surface | Independent groups |
| --- | --- |
| Shows | Genre, Region, Classification, Access |
| Movies | Genre, Region, Release year, Classification, Access |
| Music videos / tracks | Genre, Artist, Album, Region |
| Music artists | Genre, Region |
| Music playlists | Audio/video format, Editorial/My playlists |
| Sports | Sport, Competition, Team, Athlete, Match status |
| Events | Date window, Location/region, Venue style, Ticket tier, Event/broadcast state |
| News | Category, Region |
| Lifestyle | Category, Region |
| Search | Content type, Genre/category, Region, Access, alongside existing query |
| My List | Existing content-type filter with the shared active-chip/count/clear/empty behavior |

Sports archive records remain Replay; choosing Live/Upcoming may legitimately return zero and must never invent a broadcast. Team/athlete facets use explicit arrays and match empty/non-team records correctly.

Event date windows are Any date, Today, Next 7 days, and Later, anchored to the fixed September 10, 2026 reference in UTC. Display event-local schedule/timezone as today; do not change event statuses based on the real clock. Venue style supports in-person/online/hybrid. Ticket-tier labels are fixture metadata only, never a purchase or availability claim.

Shop is not receiving an expanded filter system in this pass.

### 7.3 Results and empty-state rules

- Existing default editorial layouts and rails remain when no filters are applied; filtered sections derive from the same matched set.
- Heroes remain curated, profile-eligible features outside browse filtering and are labeled as Featured—not counted as filter matches.
- When a filtered set is empty, do not substitute the complete collection or show unrelated result rails. Show “No results match these filters,” active selections, and Clear filters.
- Search distinguishes no query, no query matches, and no matches after filtering. My List distinguishes an empty profile list from an empty filtered subset.
- Related/editorial extras outside a filtered result section must be clearly separate and never presented as matches.
- Preserve existing media cards, aspect ratios, playback actions, canonical links, and music-format navigation.

## 8. Unified notifications and reminders

Add `src/data/mockNotifications.ts` and a shared notification hook/adapter. Both `/notifications` and the dropdown consume the same records, read selectors, category preferences, restriction filtering, and canonical destinations. Navbar derives unread count from that same visible feed.

Notification record fields: stable ID, account/profile scope, type/category, title/body, fixed demo timestamp/group, read state, optional canonical content/event ID, and source (`fixture`, `reminder`, `mockVote`, or `session`). Resolve destinations from IDs/helpers instead of maintaining conflicting route strings.

- Consolidate current fixtures and correct conflicting years/closing claims. Account/system notices remain clearly sample notices, not real billing/security activity.
- Content-linked rows are hidden when their target is restricted. Essential account/system notices are adult/account-scoped; do not expose account billing/security details to child profiles.
- Opening a notification marks it read and follows its canonical destination. Mark all read updates the current profile's visible feed in either view. Account-scoped read state is shared by adults; profile rows remain independent.
- Category toggles suppress optional categories in both views and their unread counts. Hidden rows retain their previous read state so re-enabling does not duplicate them. Essential account notices are not optional.
- Profile switching immediately updates both feeds and the badge; navigation does not reset read state.

### Reminder synchronization

- Keep existing event/broadcast `canRemind` rules.
- Toggling a reminder writes/removes the profile reminder and exactly one linked notification with stable ID `reminder:<profileId>:<eventId>` in one reducer action.
- The row says “Demo reminder saved” and explains that no alert will be sent. It appears immediately as a local confirmation, not as a scheduled or delivered real reminder.
- Removing the reminder removes its confirmation row from both feeds. Re-adding creates one unread row, never duplicates.
- If event notifications are disabled, the reminder still saves; show “Saved · In-app event alerts off.” The optional row is hidden until re-enabled.
- Original event card, detail page, and any reminder action share the same state.
- No push permissions, background timers, email delivery, or invented “we'll notify you in 24 hours” claims.
- Add a canonical `/notifications` entry with unread count to mobile navigation without displacing Search/Profile.

## 9. Mock awards participation

Extract current category/nominee fixtures into `src/data/mockAwards.ts`, preserving Music/Sports presentation and existing imagery.

- Label the page and confirmations **“Mock voting — no real submissions.”**
- Default phase is Open. Demo controls switch Open, Closed, and Results pending; dates/status copy derives from these fixed scenarios, not the real clock.
- Eligibility requires a signed-in adult active profile. Guest/expired directs to dedicated sign-in; teen/child receives a readable ineligibility reason.
- Use one shared account vote map keyed by category. Switching adult profiles, tabs, routes, or signing back in does not allow a second vote.
- Select a nominee, open an accessible confirmation with category/nominee/rule summary, then explicitly “Confirm mock vote.” Cancel, Escape, and backdrop dismissal make no mutation.
- Confirmation atomically rechecks session, adult eligibility, phase, category/nominee validity, and existing account vote. Disable repeat submission.
- On success show “Mock vote recorded for this demo session,” highlight the chosen nominee, show Already voted for the category, and optionally add one deduplicated awards notification for the participating profile.
- Close or invalidate a pending confirmation if the profile/session/phase changes. A stale confirmation must never bypass current rules.
- Closed blocks new votes while retaining the account's choices.
- Results pending displays “Results have not been released,” not fabricated totals, rankings, percentages, winners, or early results. Retain visible previous selections separately.
- No vote changes/undo in this prototype; Reset demo clears all mock participation with confirmation.
- Adult-only eligibility and one-account-vote rules remain labeled provisional and awaiting product confirmation.

## 10. Accessibility and visual constraints

Apply these requirements to every touched interaction and new shared primitive, not an unrelated redesign:

- Use existing local UI primitives and semantic theme tokens. Preserve Bebas Neue/Inter wiring, charcoal surfaces, gold emphasis, card geometry, navigation hierarchy, and existing imagery.
- Add a small reusable Toggle/radio-group primitive only where current UI lacks accessible semantics; extend `SessionDialog` rather than create competing modal systems.
- Profile choices, avatar selectors, chips, switches, nominee actions, and drawers must be keyboard operable with explicit names and selected/checked state.
- Avoid clickable non-interactive containers and nested button/link controls. Edit/delete controls must be available on focus and touch, not hover only.
- Associate labels, helper text, and validation errors with inputs. Use `aria-invalid`, `aria-describedby`, and live announcements for saves, result counts, restrictions, read updates, and vote confirmation.
- Dialogs/drawers require focus containment, Escape/cancel behavior, scroll containment, and focus return. If the trigger disappears on deletion/navigation, return focus to a logical surviving heading/action.
- Tabs either implement full tab/tabpanel keyboard semantics or remain plainly labeled navigation/buttons; do not add incomplete ARIA roles.
- Preserve visible gold focus indicators and reduced-motion support; ensure touched muted text has adequate contrast and errors/eligibility are not conveyed by color alone.
- Maintain practical touch targets and layouts at 320–390 px, tablet, desktop, and 200% zoom. Notification panels/drawers must fit the viewport and remain clear of the mini-player.
- Use the existing SVG/icon convention; do not add decorative emoji or introduce a new icon library.

## 11. Implementation sequence and file boundaries

1. **Shared state and fixtures**
   - Add app-state types, pure reducer/selectors, account/profile fixtures, context provider, and demo-reset/scenario actions.
   - Adapt Saved/Interaction/Playlist providers without breaking existing consumers.
2. **Auth, profiles, account**
   - Wire dedicated auth pages, route/action gates, both creation flows, selection, edit/delete, account saves, and profile preferences.
   - Update Navbar and capacity copy.
3. **Policy and viewing**
   - Add ratings/access metadata and policy functions.
   - Wire parental target selection/PIN/budgets, profile viewing activity, progress/resume, autoplay preferences, and central playback authorization/reconciliation.
4. **Discovery**
   - Add typed filter matching/query helpers, shared sidebar/drawer/chips/empty states, and page-specific facets.
   - Apply allowed-content selectors to heroes, cards, search, detail/related sections, My List, and playlists.
5. **Notifications/reminders**
   - Consolidate fixtures, read state, category preferences, badge counts, mobile entry, and atomic event-reminder synchronization.
6. **Awards**
   - Move fixtures/state to shared boundaries and implement eligibility, phases, confirmation, account-level vote limits, and pending results.
7. **Accessibility and regression verification**
   - Complete keyboard/touch semantics in touched components, run prescribed checks, and execute the scenario matrix below.

Principal existing files touched: `main.tsx`, `app/routes.tsx`, existing context adapters, `data/mockContent.ts`, `MediaPlaybackContext.tsx`, `lib/playback.ts`, profile/account/auth/parental pages, discovery/search/My List pages, detail/watch/playlist pages where authorization or resume is relevant, Navbar, NotificationPanel, NotificationsPage, AwardsPage, EventSummary, shared filter/dialog primitives, card/hero/rail selectors, and narrowly scoped styles. Do not rewrite unaffected editorial layouts or move unrelated assets.

Expected new modules: `lib/appState.ts`, `lib/accessPolicy.ts`, `lib/discovery.ts`, `context/AppStateContext.tsx`, `data/mockAccount.ts`, `data/mockNotifications.ts`, `data/mockAwards.ts`, `hooks/useDiscoveryFilters.ts`, and minimal shared demo/gate/filter/toggle components.

## 12. Verification strategy and acceptance matrix

Planning itself does not run builds/tests or modify application source. During implementation, start with pure-logic checks and broaden for these cross-cutting changes.

### Automated checks

- Add `scripts/check-app-state.mjs`, `scripts/check-access.mjs`, and `scripts/check-discovery.mjs`, exposed through corresponding `check:*` package scripts.
- Follow the existing Node assert + TypeScript transpilation pattern; do not add a test framework. Keep pure modules importable by the checks and load their local dependency graph explicitly rather than assuming Node can resolve app aliases.
- State checks: both creation inputs share validation/capacity; immutable profile edits/deletes; profile data isolation; account vote uniqueness; notification/read/reminder deduplication; rejected guest/teen mutations; reset and stale confirmation rules.
- Policy checks: all classification aliases; child/teen ceilings; unknown rating behavior; episode/event inheritance; free/premium rules; invalid IDs; queue reconciliation and policy changes; budget accounting and boundary stop; PIN/no-PIN flows.
- Filter checks: independent groups compose with AND; removing one chip preserves others; query/view preservation; invalid values; URL round-trip; fixed event date windows; sports Replay versus Live; deliberately incompatible selections return exactly zero.
- Extend playback checks for profile reset/hydration, disabled autoplay, authorization of queue advance/retry/live broadcasts, budget stop, and stale callbacks after context changes. Retain every existing playback assertion.
- Extend catalog checks to validate fixture rating/access/facet metadata, canonical links, artist/media/playlist references, and notification targets.
- Run:
  1. `pnpm check:app-state`
  2. `pnpm check:access`
  3. `pnpm check:discovery`
  4. `pnpm check:catalog`
  5. `pnpm check:playback`
  6. `npx tsc --noEmit`
  7. `pnpm build`
- Format only intended touched files with `pnpm format <explicit touched-file paths>`; avoid formatting unrelated files.
- Use the host's existing preview server. Do not start a second server or alter deployment/bootstrap scripts.

### Preview acceptance scenarios

| Scenario | Required outcome |
| --- | --- |
| First load | Signed-in Alex adult, shared profile count, existing sample viewing progress, clear local-demo status. |
| Guest / expired | Public browse and free previews work; premium and personal actions explain sign-in requirement; expired messaging is distinct. |
| Both create flows | Quick add and guided create immediately appear in the same list; form data/preferences are retained; sixth-profile submission is rejected. |
| Switch profiles | Name/avatar, saved items, own playlists, preferences, notifications, restrictions, and viewing activity change together; old playback stops. |
| Edit/delete | Saves survive navigation; canceled edits do not; main deletion is blocked; active-profile deletion does not expose another profile. |
| Watch/resume | Progress updates cards and Continue Watching for the correct profile; completed items disappear; resume chooses the correct episode. |
| Parent / child | Restricted titles/art do not appear in discovery/search/notifications; direct links explain; queued/autoplay/retry playback cannot bypass controls. |
| PIN and time | Incorrect PIN rejects; teen-to-adult switch is protected; ten-second limit scenario stops video at budget; audio does not consume video budget. |
| Filters | At least two simultaneous groups per applicable surface; chips remove independently; clear retains query/view; incompatible selections show true zero results; Back/Forward restores selections. |
| Notifications | Open/mark-all-read in either surface updates the other and badge; profile switching isolates rows; settings affect both feeds/counts. |
| Reminders | One toggle updates event actions and one shared notification; removal removes it; no duplicate rows or real-delivery promises. |
| Awards | Guest/teen/child eligibility explanations, adult confirmation/cancel, cross-profile Already voted, Closed, and Results pending all demonstrable. |
| Playback regression | Audio/video handoff, mini-player persistence, audio/video playlist separation, reordering/removal, buffering/failure retry, fixed live/replay/unavailable events remain correct. |
| Accessibility / responsive | Keyboard-only and touch journeys work; dialog focus returns; labels and live states are meaningful; no clipping at mobile/zoom sizes. |
| Reset / reload | Explicit reset confirmation restores all fixtures; reload resets session state as disclosed; no network/account persistence is claimed. |

Report the exact successful checks, any observed failures/blockers, and which manual scenarios were actually exercised. Do not claim a runtime/accessibility check that was not performed.

## 13. Product confirmations to carry forward

These are explicit provisional demo decisions, not blockers to implementation:

1. Five **total** profiles per account, including the main profile; no production plan-specific entitlement rule is approved.
2. Adult-only participation and one non-editable vote per account/category.
3. The simplified rating equivalences, teen/child ceilings, unrated-content treatment, PIN behavior, and video-only viewing-budget policy.
4. Free guest previews and signed-in premium previews are simulated access rules, not real subscription enforcement.
5. All state resets on reload. Any later durable accounts, synchronization, secure controls, real reminders, or real voting require a separate backend/security/product scope.
