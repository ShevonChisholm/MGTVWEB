# MGTV — Local prototype verification results

## Outcome

Completed a fresh review of the customer-web prototype at the host-supervised `http://localhost:3000` preview.

**No regression attributable to the preceding refinement was established in the exercised workflows. No application behavior, data model, money values, payment/PIN rules or protected baseline was changed.** This pass adds this verification report rather than silently implementing unrelated missing features.

The review did find existing Shop interaction defects, disconnected/partial actions, an error-view accessibility gap and external asset failures. These remain open below. Passing test assertions about an intentionally incomplete action do **not** make that action a completed workflow.

### 1. Completed and demonstrated workflows — local only

| Workflow | Evidence of the intended outcome |
| --- | --- |
| Navigation, search and discovery | Desktop and no-hover narrow navigation/More links, Music format destinations, search dialog, matching search result, no-results page, combined movie filters/chips/clear and browser Back/Forward were exercised. Artist `a1`, track `tr1`, music video `mv1`, series `t1`, article `n1`, lifestyle introduction `l1` and sports replay `sp1` retained matching route/title identity. |
| Media My List | Saving `t1` produced a retrievable My List card; removal produced the genuine empty state. Jordan’s list remained separate. Returning to Alex after the PIN gate retrieved Alex’s saved record. Tightening Alex’s controls hid the record without deleting it; restoring controls revealed it again. |
| Likes, follows and personal ratings | A movie like and rating were retrieved after navigation. Editing 8/10 to 6/10 retrieved the new value. Following/unfollowing Empress Nia changed the separate account-preferences following count from 0→1→0, not just the artist button. |
| Series and film previews/progress | `t1` resumed the matching `e102`; seeking changed the elapsed value; simulated buffering/failure/retry worked. Completion advanced to `e103`; autoplay off stopped further advancement. Playing previously unwatched film `m2` added actual demo progress to Continue Watching; returning resumed it; reload removed that newly recorded activity as disclosed. |
| Audio queue and video handoff | Queue reordering changed the selected pending order; removal changed the remaining queue. The mini-player survived navigation. Starting `mv1` paused audio, video pause did not silently restart it, and explicit audio resume worked. Clearing the queue stopped audio and removed the player. The existing `tr8` failure fixture retried the same **Roots Revival** track. |
| Own and editorial playlists | Created a track playlist, added `tr1`/`tr2`, retrieved it, reordered the tracks and started the resulting ordered queue. Later playlist edits did not replace the active queue snapshot. Removing all tracks produced an empty disabled-play state. Keeping the deletion dialog preserved the playlist; confirming deletion removed its collection link. Editorial playlists remained read-only. |
| Events and reminders | `e3` opened its matching simulated live broadcast without seeking; `e1` opened its matching replay with seeking. Starting-soon `e7`, postponed `e6`, cancelled `e8`, ended-without-replay `e9` and unavailable `e10` showed their corresponding states without a substitute player. An `e2` reminder survived navigation and generated a local notice with the matching event destination. |
| Notification read state | Opening the reminder notice changed the shared unread count and retained the notice as read after Back navigation. A category with no matching unread notices did not claim the entire feed was caught up. Mark-all-read changed the unread scope; disabling Unread only showed retained notices rather than treating row disappearance as deletion. |
| Demo auth and profile lifecycle | Registration mismatch validation, replacement cancellation/confirmation, simulated verification and first-profile guided setup were exercised; the entered sample email and first-profile count were retrieved in Account. Forgot/reset mismatch validation and the explicit “no real password changed” boundary worked. Guest and expired gates, demo sign-in, required profile selection and safe `/my-list` return-to worked. |
| Profile edits/capacity/parental controls | Quick-added, edited and deleted profiles with count changes; cancellation preserved the record. Five-total-profile capacity and main-profile protections held. Incorrect PIN was rejected. Child history navigation could not reveal restricted series details or adult control editing. The video budget stopped running video after the reviewer tool established ten seconds remaining. |
| Account preferences | Unsaved account changes were discarded; saved changes were retrieved. All four genre/region recommendation explanations reflected the actual selections. Language remained labelled a preference, not a translated interface. |
| Mock awards | Cancelling did not record a vote; confirmation produced a retrievable local choice and disabled repeat voting. Dialog keyboard containment/Escape/focus return worked. Closed, results-pending and child-profile states prevented voting without inventing results. |
| Product/cart/plan boundaries | Product detail rating and its separate like-labelled “Wishlist” state persisted locally, but this is **not a unified product wishlist**. Existing cart addition produced a real cart line; quantity changed the sample subtotal from $45.00 to $90.00; removal emptied the cart. Incorrect/correct PIN outcomes remained explicit mock authorization, with no purchase or subscription. No monetary logic was added or altered. |
| Editorial, static and sharing boundaries | News card→story and Lifestyle card→introduction identity/history worked. Contact and newsletter were truthfully unavailable; draft legal notices were visible. Clipboard copying was verified by reading the actual copied URL. Simulated clipboard denial did not show “Copied!” success. A WhatsApp intent URL was inspected without opening the provider or posting. |
| Visible player/rail controls | DOM observation captured “Loading preview…” followed by the running preview. Fullscreen changed the actual fullscreen element in this top-level headless browser. With reduced motion enabled, In focus moved from scrollLeft 0→368 and back to 0; the arrow response was not merely decorative. |

### 2. Remaining incomplete screens/actions and defects

| Finding / classification | Reproduction, expected versus actual, and scope |
| --- | --- |
| **Shop touch card navigation can trigger an invisible quick-add — existing structural defect** | At `/shop` in a 390px no-hover touch context, tap the centre of the `p1` card link. The hit target is the nested **+ Add to Cart** button while its parent opacity is **0**. Instead of navigating, it opens a populated cart and the URL stays `/shop`. Tapping the product **title** does navigate correctly. The nested hover-only button structure was present before the refinement; this is not established as a new regression. Source: `src/pages/ShopPage.tsx`, `ProductCard`. It was deliberately **not** recorded as a successful card-navigation workflow or silently redesigned. |
| **Shop card heart is not a completed saved-product workflow** | Tap Save on a product card; its icon fills. Navigate to the product and back; it resets. It uses component-local `useState`, not a retrievable wishlist/My List record. Its 32×32 target is also below the project’s preferred 44px touch pattern. Product-detail “Wishlist” uses separate profile likes and does not synchronize this card heart or expose a saved-products collection. Same source plus `ProductDetailPage.tsx`/`InteractionContext.tsx`. |
| **Quick-add keyboard discoverability** | The Shop overlay is revealed by hover, not keyboard focus or no-hover interaction. An existing interactive control can therefore remain visually hidden. This is part of the existing Shop issue, not an approved new checkout feature. |
| **Unknown-show fallback has no primary heading** | `/shows/unknown` displays “Show not found.” and a working Back to Shows link at all four checked widths, but has no `h1`. Recovery and metadata worked; the missing heading is an existing accessibility gap in `ShowDetailPage.tsx`, not a newly introduced route failure. |
| **Unavailable content/services** | Lifestyle detail explicitly supplies an introduction, not a full article. Media/broadcasts have no connected source. Newsletter input/button are disabled, Contact cannot submit enquiries, Shop preview is intentionally disabled, and Careers/Press/business/social/Accessibility/Cookie Policy footer placeholders remain pending review. These were not counted as completed services. |
| **Missing playlist operation** | Own playlists support the demonstrated operations above, but there is no rename control in the current screen. No rename feature was added. |
| **Clipboard failure feedback** | Failure does not incorrectly show success, but there is no explanatory failure message. Real clipboard availability remains browser/embedding dependent. No new sharing integration was added. |
| **Existing external image failures** | The Island Vibes Hoodie and Island Life Bucket Hat image URLs failed in Shop/Product/Lifestyle cases. These match previously reported asset-delivery concerns. URLs/artwork were preserved, so complete external asset delivery is not claimed. |

**Repair decision:** no qualifying recent regression was found to patch. The existing Shop and error-view issues were reported, not hidden by changing labels, disabling a working action, removing rows or altering frozen state rules. Available Git snapshots do not provide a full before-refinement source tree; attribution beyond the corroborated existing structures is limited.

### 3. Mock behavior requiring backend implementation later

- **Accounts/security:** sign-in, registration, verification, password reset and visible demo PINs are local transitions, not authentication, email delivery or secure parental protection.
- **Durable ownership:** profile data, saved items, likes/follows, personal ratings, playlists, viewing progress and preferences live in memory and reset on reload. They do not provide cross-browser/device persistence or secure user isolation.
- **Media delivery:** artwork, elapsed timers, queues, autoplay, buffering/retry controls and “live” examples simulate a player. There is no audio/video delivery, live source, DRM, verified availability or licensed streaming demonstrated here.
- **Notifications/reminders:** notices/read counts and reminder confirmations are local records, not scheduled delivery, email, push or real-time event updates.
- **Awards:** choices are mock local records. Real voting would need approved rules and authoritative eligibility/duplicate/stale-state enforcement.
- **Commerce/entitlements:** current cart, plan, PIN and checkout surfaces are previews only. No order, charge, inventory reservation, trial, subscription, upgrade or cancellation is connected. This review did not add any of those capabilities.
- **Contact/newsletter/content:** there is no submission/delivery service or managed publishing backend. Sample stories, events, bios, products and plan benefits remain unconfirmed. Social intent construction and clipboard copying are not provider integration or proof of publication.

### 4. Product decisions requiring owner input

- Five **total** profiles, main-profile protections, classification ceilings, secure parental controls/PINs and daily-budget policy.
- Adult awards eligibility, account-versus-profile category limits, editability and final voting phases.
- Guest/free/MGTV+ access and actual plan/service benefits; sample prices/promotions remain unapproved and unchanged.
- Whether a product wishlist is intended, how it relates to media My List/likes, and cart ownership/reset scope across profiles/accounts.
- Notification/reminder channels and what the saved Newsletter preference is meant to do.
- Licensed media/artwork, approved credits/bios/reporting, real event dates/venues/participants, availability and rights.
- Approved contacts, footer/social/business destinations, full content and newsletter operation.
- Legal entity/copyright dates, Privacy/Terms bodies and jurisdiction, Accessibility and Cookie Policy.
- Whether to authorize a separate repair of the existing Shop/card accessibility and other pre-existing gaps. None was silently folded into this pass.

The broader factual/legal register remains open: [`mgtv-copy-owner-review.md`](mgtv-copy-owner-review.md). No sample content or draft policy was approved by this review.

## Verification record

### Current execution, not inherited claims

- **47 browser scenario records:** 46 expected local/negative outcomes demonstrated; **one explicit defect observation** for the no-hover Shop card/heart behavior. That defect is not a passing customer workflow. Core journeys were exercised at both 1440×900 and touch-enabled 390×844; supplementary cases used their recorded desktop/narrow contexts.
- **228 route/viewport cases:** 57 representative valid, empty, restricted/status and invalid-route entries at 1440, 768, 390 and 320px. No horizontal document overflow or browser page exceptions were observed. The unknown-show heading gap is retained in the results, not erased by the recoverable error.
- Preview title, exactly one description and OG title, and noindex were verified across those cases. Built HTML also had exactly one description, OG title and OG description, the approved title, and blocking robots output.
- **20 text/reflow cases:** ten representative routes at 200% root font size and at 2× CSS zoom. No document overflow or visible card-action overrun. CSS zoom is a reflow proxy, not native browser/device certification.
- **Three active mini-player checks:** 320px normal, 768px enlarged text and 768px CSS zoom had no horizontal overflow. Normal/enlarged player heights matched the measured reserved CSS padding (209/305px respectively); the zoom proxy reserved space as well. A touch run also verified the More→compatible-playlist dialog while audio was active.
- **22 artwork text-range samples** on Home/Shows/Music/Events/event-detail/sports-detail heroes at desktop/narrow widths had a minimum sampled secondary-text contrast of **5.29:1**, above 4.5:1. Text was temporarily hidden in the harness to sample its actual background, not unrelated empty paragraph space. This is scoped sampling, not a whole-site WCAG certification.
- Keyboard checks covered search initial focus, modal containment, Enter/Shift+Tab, Escape/focus return, range seeking and reduced-motion rail movement. Actual touch taps covered navigation, More, filters, Music actions, playlist access and the Shop defect.
- Invalid-show recovery was independently checked at all four widths. Invalid watch/track and unknown routes were included in the route sweep.
- No browser page exceptions were recorded in the completed scenario groups. External image failures and existing accessibility/interaction gaps remain separate findings.

### Automated checks

The six repository suites passed both before review and at final verification:

```text
pnpm check:copy
pnpm check:catalog
pnpm check:playback
pnpm check:app-state
pnpm check:access
pnpm check:discovery
```

Final checks also completed successfully:

```text
npx tsc --noEmit
pnpm build
git diff --check
```

Catalog checks covered 112 canonical items. The copy baseline confirmed legal bodies, prices/plan values, IDs/relationships, query values and protected state/routing/access/playback/purchase modules remain unchanged.

The production build retains Vite’s warning about a minified JS chunk above 500kB. It is a warning, not a failed build; code splitting was not added as unrelated work.

Formatting limitation: `pnpm format plans/mgtv-local-verification-results.md` exited 2 because the installed `oxfmt` did not accept the Markdown-only target (“Expected at least one target file”). No application source file required formatting. The report was checked for trailing whitespace and a final newline separately; no substitute formatter or unrelated file rewrite was introduced.

### Tooling, evidence and limitations

- Chromium **151.0.7922.173**; temporary `playwright-core` **1.64.1** installed under `/tmp/mgtv-local-review/`, not added to project dependencies.
- Temporary evidence: `core-results.json`, `extra-results.json`, `states-results.json`, `supplement-results.json`, `layout-results.json`, `visual-results.json`, `recovery-mini-results.json`, plus representative `view-*`, `rail-*`, `mini-*` and `active-mini-touch.png` screenshots in that directory.
- Temporary artifacts may not survive a restored session. The reproduction steps and actual findings are retained in this report.
- Early harness failures caused by stale SPA content, assuming a profile was preselected, wrong control text or waiting for a heading on the existing heading-less error view were diagnosed and retested. The reproducible invisible Shop quick-add outcome was **not** dismissed as a selector issue; it remains a defect.
- Real social-provider navigation/posting was not exercised. An intercepted sharing intent was inspected; real clipboard readback and an explicitly rejected clipboard write were tested separately.
- This is headless local-browser verification, not native-device, embedded-preview permission, assistive-technology, production availability or legal/compliance certification.
- No application source/dependency, backend, external integration, financial rule, mobile app, sponsor portal, bootstrap/deployment script, publication or deployment was added. No commit or push was performed.
