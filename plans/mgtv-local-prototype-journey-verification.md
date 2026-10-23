# MGTV — Local prototype journey verification and bounded regression repair

## 1. Goal and delivery

Review the implemented customer-web prototype through real local browser journeys, not a checklist of visible screens or decorative responses. Demonstrate destinations, matching entity identity, meaningful state changes, browser history, accessible interaction, and responsive presentation.

Repair reproducible regressions attributable to the recent refinements. Report incomplete features and uncertain/pre-existing defects instead of silently implementing them.

The final user-facing handoff will be a concise checklist under exactly these four headings:

1. Completed and demonstrated workflows.
2. Remaining incomplete screens/actions.
3. Mock behavior requiring backend implementation later.
4. Product decisions requiring owner input.

Supporting reproducible steps and evidence will be recorded in `plans/mgtv-local-verification-results.md`. This report must distinguish current observations from historical verification.

## 2. Boundaries

- Local React/Vite customer web only. Use the existing host-supervised preview; do not start another development server.
- No publishing, deployment, remote preview creation, commits, or pushes.
- No backend, persistence service, CMS, external integration, new real authentication, email delivery, notifications service, real media source, ticketing, payment functionality, mobile app, or sponsor/advertiser portal.
- Do not change amounts, currencies, billing periods, original prices, cart arithmetic, plan benefits/entitlement definitions, or payment/PIN rules.
- Inspect existing cart and purchase-entry demonstrations only to establish their present boundaries; do not extend them into transactions.
- Preserve canonical catalog IDs, relationships, routes and Music view values, filter query values, profile/parental rules, awards rules, and shared playback ownership.
- Preserve the preceding copy improvements, charcoal-and-gold UI, fonts, imagery, noindex metadata, and legal-body wording. No broad redesign, image replacement, or new content collection.
- Do not repair unrelated/pre-existing issues or turn an incomplete action into a new feature without further approval.
- Preserve any user changes present when implementation begins.

## 3. Repository facts established during planning

- `AGENTS.md` prescribes React 19, Vite 8, Tailwind v4, the already-running server, and the project commands below.
- The current working tree is clean. Available Git history contains **one snapshot commit**, not a usable pre-refinement source tree.
- The current preview URL is `http://localhost:3000`, obtained from `figma make preview get-local-url`; obtain it again if the environment changes.
- Primary routes are defined in `src/app/routes.tsx`, covering discovery, media details/playback, Music formats/playlists, events, editorial stories, auth, profiles/account/parental controls, saved items, notifications, awards, shop/product, MGTV+, and static/legal pages.
- Shared profile state lives in `AppStateContext`/`lib/appState.ts`; saved media, likes, follows, ratings, reminders, preferences, notifications, playlists and viewing records have explicit existing data paths.
- Saved media uses `SavedContext` and shared profile state. **The Shop product-card heart currently uses component-local `useState` only.** This is an audit candidate, not evidence of a completed wishlist workflow.
- Cart state is held separately in `InteractionContext`, shared within the mounted app session rather than stored in `ProfileData`. Its intended profile/account scope requires owner confirmation; preserve it in this pass.
- Share controls either copy a URL or open an external sharing intent. Neither operation proves a post was published.
- Existing `PreviewStates` controls simulate buffering, failure and completion. These are not network or media-service observations.
- `pnpm check:copy` freezes legal/monetary/catalog/filter data and hashes several state, routing, access and purchase modules from the prior copy-only pass. Do not regenerate that baseline to hide a change.
- Previous reports claim substantial passing coverage and identify some external image failures plus a bundle-size warning. Those are **historical evidence**, not fresh passes.
- Prior temporary browser scripts/screenshots are not available in the current environment. Chromium is available at `/usr/bin/chromium`; Playwright is not a project dependency.

Planning has inspected source and prior reports only. The fresh browser walkthrough and regression fixes begin after acceptance of this plan.

## 4. Evidence and verdict rules

### What counts as demonstrated

For each workflow, record:

- entry route, active session/profile and relevant starting state;
- exact visible control used, destination URL/query and entity ID/title;
- expected observable state change and independent evidence of that change;
- state after navigating away and back, and isolation from another profile where applicable;
- reset/reload behavior, expected limitations, viewport and input method;
- verdict and any evidence path.

Use these verdicts: **Demonstrated locally**, **Incomplete**, **Defect**, **Blocked**, and **Not exercised**. An intentionally disabled/unconnected control is a truthful boundary, not a completed service.

Never equate the following with success:

- a filled heart with a saved item retrievable elsewhere;
- a toast with an accepted mutation;
- a disappearing notification row with a persisted read state;
- a dismissed dialog with a recorded vote, profile edit or purchase;
- a running timer with delivered audio/video;
- an opened social window with a published share;
- a local account transition with real authentication or email verification.

The final report may call a workflow demonstrated only when its intended local state and destination have been checked. Partial flows must be labelled partial.

### State reset and navigation

- Start independent scenarios from a fresh reload or the existing confirmed demo reset.
- Use real links, forms, buttons, browser Back/Forward, and visible reviewer controls. Do not drive app reducers directly to manufacture a passing result.
- Keep a single mounted session for persistence checks; a reload intentionally resets local demo state.
- Verify direct URL entry separately from in-app navigation. Do not rely on address-bar changes alone as proof that React rendered the destination.
- Wait for destination-specific content and entity markers rather than arbitrary sleeps, stale headings, or brittle copy-only waits.

## 5. Primary journey matrix

Walk all existing route families; use representative canonical entities plus the distinct access/state cases below. Do not create new app routes or fixture states just for this review.

| Journey | Actions to demonstrate | Outcome and negative checks |
| --- | --- | --- |
| Navigation and discovery | Desktop/mobile navigation and More/account disclosures; collection links; all Music format tabs; search modal and search page; filters/chips/clear; Back/Forward | Correct canonical destination and entity; query/view preservation; AND-filter results and genuine zero-results state; invalid filter handling; no stale content after navigation; no hidden actions requiring hover |
| Series, films and sports | Card → details → appropriate episode/film/replay; select available episodes; pause/resume/seek; continue watching; return to details/discovery | Title, ID, duration, series/season/episode and classification agree across surfaces; demo progress and remaining time update after actual simulated playback, not merely opening the page; restrictions hold on direct entry; invalid IDs show a recoverable unavailable/not-found state |
| Audio/video playback | Play track; pause/resume; seek; queue add/play-next/reorder/remove; mini-player across navigation; play video while audio runs; navigate back; available autoplay controls | One owner at a time; video pauses audio; no unintended automatic audio restart; queue order and next-item identity are correct; removal/empty/end behavior is meaningful; mini-player clearance remains correct; buffering/failure/retry/completion are explicitly simulated |
| Artists and personal actions | Follow/Following, Like/Liked, personal rating/edit; navigate away/back; change profiles | Real profile-data changes, not only label changes; saved ratings/follows/likes are retrieved consistently and isolated; guest/expired/blocked actions do not falsely report success |
| My List and playlists | Save/remove media from multiple entry points; open My List; create compatible audio/video playlists; add/remove/reorder/rename/delete only where existing controls support them; start at an ordered position | Canonical saved media is retrievable; save removal agrees across surfaces; genuine empty versus restriction-hidden state is accurate; compatible types only; editorial playlists stay read-only; live queue snapshot and later playlist edits remain distinct; destructive cancel does not mutate state |
| Events | Landing → details → live demonstration/replay/status; existing reminder toggle; scheduled/starting-soon/ended/postponed/cancelled/unavailable fixtures | Correct event/broadcast association; fixed sample schedule explained; only available demonstrations can start; no substitute stream or ticket purchase; reminder record and local notification confirmation agree; clearing/removing is not mistaken for real scheduled delivery |
| Notifications | Panel/full-feed navigation; categories/unread filter; open a notice; mark-all-read; notification preferences; Back/Forward | Destination matches the notice; read/unread state and shared counts remain consistent after navigation; category-empty copy does not hide other unread scopes; turning a category off is not falsely reported as reading/deleting its notices |
| Auth and profile lifecycle | Guest/expired/signed-in gates; demo sign-in/return-to; registration validation and replacement confirmation; simulated verification; guided/quick profile creation; edit/switch/delete/cancel; forgot/reset forms | Only declared demo transitions occur; no email or real credentials used; mismatched inputs reject appropriately; returning destination is safe; profile capacity/main-profile protections and PIN gates remain intact; profile changes alter data scope, not just the avatar |
| Account and parental controls | Edit/cancel account fields and profile preferences; all four genre/region copy combinations; notification/autoplay/language preferences; rating ceiling, PIN and video-budget controls using existing reviewer tools | Saved versus cancelled values differ correctly; preference-only language is not claimed as translation; restrictions cover discovery and playback/retry/queue entries; daily usage counts simulated playing video rather than seeking/buffering/audio; child/teen cannot change adult-only controls |
| Mock awards | Categories/nominee identity; choose/cancel/confirm; revisit; another adult profile; child/guest; open/closed/results-pending reviewer states | Actual account/category vote record and duplicate prevention, not dialog dismissal; cancelled selection records nothing; stale confirmation cannot vote after profile/phase change; no real submission, winners or public totals implied |
| Shop, Product and MGTV+ previews | Product route identity, existing categories/sorts; detail quantity/add-to-cart; inspect cart quantity/remove/subtotal; existing mock authorization/checkout entry; product heart/wishlist/rating | Add-to-cart is corroborated by cart contents/count/quantity, not just a toast; sample values remain untouched; PIN outcome never means a payment/order/plan change; card-local heart is not called a wishlist unless a retrievable intended record actually exists; inspect quick-add with keyboard/touch rather than desktop hover alone |
| Editorial/static/legal/footer/share | News/Lifestyle cards and article identity; sample/full-article boundaries; About/Contact; draft policy notice; working footer links and pending placeholders; newsletter unavailability; copy/share controls | No invented full article, submission, subscription or destination; legal bodies unchanged; actual clipboard value checked when browser permissions allow; rejected clipboard access is not success; external share intents inspected without posting or adding integrations |

For existing social share controls, intercept/inspect the requested URL or popup in the test harness without completing provider navigation or transmitting a post. Record only the intent construction as verified. Clipboard permission/availability limitations must be reported accurately.

## 6. Empty, error, loading and access states

Exercise existing states where they are reachable:

- empty My List; saved items hidden by tightened controls without deleting them;
- no search matches, combined-filter zero results, invalid ID/unknown route;
- empty own playlist and incompatible/read-only playlist actions;
- filtered notification emptiness, no unread notices, disabled category preferences;
- incorrect demo PIN, invalid/mismatched form inputs, cancellation of destructive dialogs;
- guest, expired, adult, teen and child scenarios;
- playback preparing/loading, paused, playing, buffering, failed/retryable, ended, unavailable, and live demonstrations without seeking;
- empty queue and final item, autoplay off, access changes during playback;
- provisional profile capacity, unavailable awards phase, duplicate vote attempts;
- unavailable fullscreen/clipboard behavior where the environment can exercise it safely.

Do not add fake loaders, network requests, errors or backend responses to a static page merely to check a box. Mark non-existent states as not implemented or not applicable. Existing demo controls may establish otherwise costly state cases, but must be identified as reviewer tools rather than customer journeys.

## 7. Desktop, narrow, keyboard and touch verification

- Main journey runs at **1440×900** and **390×844**.
- Run focused layout checks at **768px** and **320px**, including long titles, forms, filters, card actions, menus, notification panel, footer, dialogs and an active mini-player.
- Include 200% text enlargement and reflow/zoom checks. Describe emulation honestly; do not call CSS zoom a native-device/browser certification.
- Use a touch-enabled, no-hover browser context for representative media/track cards, nav, filters, product controls and dialogs. This is mobile-browser verification, not a mobile app.
- Keyboard-only: logical Tab/Shift+Tab order, visible focus, Enter/Space activation, disclosure behavior, native controls, Escape/backdrop cancellation, modal containment and focus return. Do not assume every disclosure has ARIA-menu arrow-key semantics.
- Check touch targets against the existing 44px target pattern where feasible, without redesigning unrelated screens.
- Inspect real screenshots and DOM geometry for page overflow, card/action overlap, clipped focus, unreadable truncation, fixed header/mini-player obstruction and off-screen dialogs. Scrolling rails may overflow internally; the page must not.
- Check meaningful small text against at least 4.5:1 and large text at least 3:1. Sample actual artwork regions using text-range bounds; do not fail empty space elsewhere in a full-width paragraph box or claim compliance from nominal theme colors alone.
- Verify reduced-motion rail behavior and stable visible actions without hover.
- Recheck MGTV title, language, description/OG tags, and noindex in the actual preview and built HTML.
- Capture external image/request failures separately from browser exceptions. Existing image failures must not be disguised with replacement photography.

## 8. Bounded regression triage and repair

Each defect record will include reproduction steps, expected local contract, observed behavior, affected route/component, impact, attribution evidence, and retest result.

Classify findings as:

1. **Proven recent regression:** caused by the recent copy/layout/label/rendering changes or contradicted by a reliably documented pre-change behavior. Repair the smallest root cause and add a focused check.
2. **Existing/incomplete behavior:** intentionally unavailable services, source-confirmed disconnected actions, or defects already present in historical evidence. Report; do not add the missing feature.
3. **Attribution unknown:** only current failure is observable and no reliable pre-change evidence exists. Report explicitly; do not call it newly introduced or automatically broaden the patch.
4. **Environment/external asset issue:** record the actual failure and any verification limitation; do not change deployment, bootstrap scripts, providers or artwork.

Do not use the single Git snapshot to imply a before/after comparison that it cannot establish.

### Repair constraints

- Prefer corrected destinations, state-aware labels, event handlers, visibility/wrapping, focus and shared-component presentation over new state abstractions.
- Reuse local primitives and semantic tokens. Invoke `make/use-design-system` before any UI repair.
- Do not make a passing result by disabling a working control, removing a row, renaming away an expected outcome, or emitting a success toast without a mutation.
- Do not rewrite reducers, queues, ownership, access rules or fixtures to make a consumer test pass.
- If the only viable repair requires changing a frozen state/routing/payment contract or adding missing behavior, stop that repair and request approval. Keep the finding in the report; do not weaken `check:copy` or regenerate baseline hashes.
- Reproduce before the patch, assert the intended state/destination after it, then rerun the sibling entry points and relevant negative cases.
- If no attributable regression is found, source-code changes are not required.

## 9. Execution approach and verification artifacts

1. Recheck instructions, working tree, installed toolchain and local preview URL.
2. Record the six existing check-suite results before modifications to separate baseline failures from new ones.
3. Build the journey inventory from active imports/routes and capture a fresh initial state.
4. Use Chromium with temporary browser automation outside the repository. If needed, resolve and install `playwright-core` into an isolated `/tmp/mgtv-local-review/` directory; record its resolved version. Do not add application dependencies, app services or another server. If tooling is unavailable, report blocked browser coverage instead of substituting claimed visual inspection.
5. Walk the actual customer entry points with the outcome rules above. Use separate page/context or explicit resets between independent scenarios, and keep sessions mounted for persistence/history tests.
6. Record evidence progressively so a browser crash does not erase completed results. Keep screenshots/logs temporary and link or name them in the report with their retention limitation.
7. Apply only qualifying regression repairs, then add focused regression assertions to the appropriate existing script when it tests a pure contract. Keep browser-only checks in the temporary harness; do not introduce a test framework for this pass.
8. Retest repaired paths plus related consumers, responsive/input cases and negative states.
9. Write `plans/mgtv-local-verification-results.md`, carrying forward unresolved owner matters by reference to `plans/mgtv-copy-owner-review.md` rather than declaring them approved.

No application feature API or data model changes are planned.

### Prescribed commands

Use the existing entry points:

```text
pnpm check:copy
pnpm check:catalog
pnpm check:playback
pnpm check:app-state
pnpm check:access
pnpm check:discovery
npx tsc --noEmit
pnpm build
git diff --check
```

Format only changed intended files with `pnpm format <explicit paths>`. Keep multi-member TypeScript declarations multiline because the installed formatter previously removed separators in compact declarations.

Run the narrow relevant check after each repair, and the listed suites/typecheck/build at the end of this broader verification pass. Diagnose nonzero exits; report unrelated/environmental failures instead of masking them. Treat bundle warnings separately from build failures. Do not run an invented lint command, start `pnpm dev`, poll logs without a concrete failure, or deploy.

## 10. Simulation boundaries and owner decisions

The result report will explain, without implementing any of the following:

- Reload-scoped state is not durable storage, cross-device sync or secure user isolation.
- Demo sign-in/registration/verification/reset and visible PINs are not authentication, email delivery or security.
- Artwork, timers, buffering/retry controls, live examples and autoplay/queue simulation are not streaming, DRM, live broadcasts or verified media availability.
- Saved items, follows, ratings, playlists, progress, notifications and reminders need real durable ownership/delivery services for a live product.
- Mock awards choices need approved eligibility/rules and authoritative server-side enforcement before real voting.
- Existing cart and PIN/checkout/plan previews do not place orders, charge money, create subscriptions or reserve inventory.
- Newsletter/contact are disconnected; social sharing intent is not provider integration or posting.
- Fictional/sample catalog/editorial/event/product/plan material and draft policies are not approved claims.

Owner decisions to list where still unresolved:

- five **total** profiles, main-profile protections, parental classifications/PIN/security/video-budget policy;
- adult eligibility, account-versus-profile awards limits, editability and final voting phases;
- guest/free/MGTV+ access and confirmed plan benefits;
- whether product wishlist exists at all, whether it relates to media My List, and cart ownership/reset scope;
- reminder/notification channels and the newsletter-preference meaning;
- content/media rights, credits, authentic reporting, real dates/venues/participants and content availability;
- commercial/product/service claims and prices/promotions, without changing them;
- approved contacts, footer/social/business destinations, policy/legal dates/entity/jurisdiction and accessibility/cookie material.

Do not ask the owner to decide details already encoded as explicitly provisional demo behavior before exercising them. Preserve those defaults; ask only if a proposed repair would change them.

## 11. Acceptance and final checklist format

The pass is complete when:

- every primary journey family has a current verdict and a meaningful outcome oracle;
- the report clearly identifies incomplete/disconnected/decorative actions and does not count them as successful workflows;
- attributable regressions are repaired and retested, or their bounded blockers are explicit;
- browser history, canonical identity, error/empty/simulated-loading/access states, representative keyboard/touch and responsive presentation have recorded evidence or honest blocked/not-exercised status;
- frozen legal/monetary/catalog/behavior contracts and simulation disclosures are preserved;
- check commands, browser exceptions, asset issues and warnings are reported accurately;
- no backend, external integration, payment extension, mobile app, sponsor portal, publication, deployment or commit has been added.

The final response should be concise: demonstrated workflow groups and any fixed regressions; actionable incomplete items with destinations; backend-dependent mock boundaries; and owner decisions. Include the supporting report path and material verification blockers, but do not substitute a long proposed roadmap for the requested checklist.
