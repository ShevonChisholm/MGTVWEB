# MGTV — Copy, Factual Integrity, and Visual Hierarchy Refinement

## 1. Objective, decisions, and boundaries

Refine the wording and visual hierarchy of the existing MGTV customer web prototype. Make it sound like a confident, inviting cultural host: rooted in Jamaica, welcoming the Caribbean and wider world, and clear about what every control does.

This is a refinement of the working application, not a redesign or a feature expansion. Implementation begins only after this plan is accepted.

### Confirmed voice decisions

- The proposed positioning, **“Stories, sounds and standout moments. From Jamaica to the world.”**, is **tone guidance only**. Do not insert that exact sentence into the interface or public document metadata.
- Keep useful fictional catalog content and explicitly labelled sample dates, schedules, and live/replay demonstrations.
- Remove fabricated audience totals, popularity rankings, record-breaking claims, and unsupported service promises from normal customer-facing copy.
- Preserve personal actions and truthful state within the demo: saved items, the active profile, personal ratings, viewing progress, preferences, follows, reminders, notification read state, mock votes, and playback states.
- Keep **Shows, Movies, Music, Sports, News, Events, and My List** as clear utility labels.
- Put personality mainly in editorial headings and supporting copy. Keep forms, errors, navigation, filters, eligibility rules, and playback controls direct.
- No forced slang, generic streaming slogans, inflated superlatives, or repeated “gold” wordplay. Preserve legitimate proper names such as Mining Gold TV, song titles, film titles, and product names.

### Scope exclusions and invariants

- No new features, pages, catalog collections, recommendation algorithms, backend, integrations, mobile application, deployment, publishing, or commits.
- No new email signup, contact submission, real authentication, alerts, payments, or live media.
- No changes to prices, currencies, billing periods, original prices, cart arithmetic, payment/PIN behaviour, plan access rules, or purchase flows.
- Do not invent release dates, publication dates, contact addresses, response times, awards, statistics, credentials, or service guarantees.
- Keep IDs, canonical routes, route parameters, music view values, filter keys/values, profile limits, access policy, state reducers, and audio/video queue semantics stable.
- Keep existing photography, artwork, logo, charcoal-and-gold palette, Bebas Neue display face, Inter body face, card families, and navigation structure. No image search or replacement photography is needed.
- Do not rewrite legal/policy body text as approved material. Identify it visibly and in the handoff for owner review.

## 2. Grounded findings

The repository is React 19, Vite 8, TypeScript, Tailwind v4, and `react-router`. `AGENTS.md` is authoritative. The working tree was clean when this planning audit began.

The existing local UI system is in `src/components/ui`, with semantic colours and fonts in `src/index.css`. Reuse `Button`, `ButtonLink`, `Text`, `Input`, `Badge`, and `SessionDialog`; do not introduce a new component library or font setup.

### Code and live-preview evidence

| Area | Finding | Implication |
| --- | --- | --- |
| Metadata | The live document title is `Figma Make App`; its description describes collaborative plan review. | Replace unrelated scaffold metadata with accurate MGTV prototype metadata. |
| Metadata source | `vite.config.ts` reads `.figma/make/site.json`; its existing plugin emits title, description, Open Graph title/description, language, and robots directives. | Use this supported configuration, not a competing metadata framework or duplicate static tags. |
| Home headings | The existing sample `trending` array is numbered and labelled “Trending Now”; movies are labelled “Popular Movies.” | Present these as editorial/sample selections, not measured popularity. |
| Personalisation | Home sorts recommendations using selected genres/regions, but shows preference-based copy even when those selections are empty. | Make the explanation conditional; never claim watch-history-based recommendations. |
| Viewing | `useViewing` provides real within-demo progress and resume behaviour; Alex also starts with seeded sample progress. | Keep Continue Watching functional and qualify it as demo progress, not evidence of real streaming history. |
| Main cards | `MediaCard` and `TrackCard` already keep actions in normal flow. No active large hover-expansion reserve was found in these components. | Do not “fix” obsolete hover layouts or hide controls to reduce whitespace. |
| Gutters | At 1440px, Home hero copy starts at x=144, rail headings at x=64, and the editorial News heading at x=80. Nested Shows rails add another 64px inside their content pane. | Align shared page gutters and provide a contained-rail layout without duplicate inner padding. |
| Narrow heroes | The Shows hero is 844px high at a 390×844 viewport, below the header/demo chrome. | Remove the forced full-screen minimum there; use content-driven height and concise copy. |
| Contrast | Several active screens use `#3A3A3A`, `#4A4A4A`, or `#6B6B6B` for meaningful small text on near-black surfaces. | Promote meaningful secondary text to the existing readable secondary token. |
| Status repetition | Event cards include status messages, schedule lines, location mode, timezone, and multiple actions; details repeat summaries. | Present one restrained status treatment per card, without removing schedule meaning or actions. |
| Metrics | Artist pages contain hard-coded follower totals; Like buttons show invented base counts; Shop displays fixture community ratings/review counts. | Hide unsupported aggregate claims while preserving Follow, Like, personal rating, and existing sorting behaviour. |
| News/bios | Fixture stories include millions of streams, attendance records, invented quotations, athletic results, and future broadcasts. | Rewrite unsupported reporting into neutral, clearly labelled sample editorial copy. |
| Contact | `/contact` contains four unverified addresses and a “1–2 business days” promise. | Remove them from visible copy; do not substitute invented contact information. |
| Commerce | Product details claim “In Stock — Ships in 2–4 business days”; MGTV+ banners promise trials, downloads, HD, ad-free viewing, and exclusivity as though available. | Remove operational promises and clearly frame retained plan/product panels as unconfirmed demonstrations, without changing money or behaviour. |
| Newsletter | Footer email input and Subscribe button have no signup handler. | Identify an email newsletter preview and make its unavailable state honest; do not add simulated delivery or success. |
| Legal | `/privacy` and `/terms` contain placeholder policy assertions, jurisdiction, and update dates. | Preserve body wording verbatim and add a separate owner-review notice. |
| Legacy components | `SectionHeading`, `PageHero`, `PageFeaturedHero`, and several old card names are unused or aliases. Examples such as “Every Story Worth Watching” and “Rising Artists” are not active strings in this checkout. | Audit by rendered usage; do not modify unused components merely to satisfy a search/replace checklist. |

Baseline browser inspection covered Home, Shows, and Music/Tracks at desktop size, plus Shows at 390px. Those inspected pages produced no browser page errors. Baseline screenshots and measurements are temporary audit evidence, not post-change verification.

## 3. Voice and copy rules

### Editorial voice

- Use natural, specific invitations: “Series in the spotlight,” “Tonight’s watchlist,” “Artists to explore.”
- Prefer concrete nouns and short sentences over claims such as “world-class,” “unmissable,” “limitless,” “the best,” or “the full experience.”
- Convey Jamaican roots through perspective and subject matter, not decorative slang, caricature, or claims that every island has one culture.
- Use sentence case for editorial copy and controls, except established brand/proper names and existing compact category treatments.
- Use consistent British/Jamaican English in authored interface copy, including **favourite**. Do not mechanically rewrite proper titles or quoted source material.
- Avoid repeating the same expressive heading on unrelated collections.

### Utility voice

- Keep utility navigation and recognisable actions literal.
- Describe the entity and state: series, film, track, music video, live demonstration, replay, event, article.
- Keep disabled, restricted, expired, loading, empty, and confirmation messages factual and actionable.
- Retain clear prototype disclosure, but consolidate repetitive explanation into the relevant section/player/dialog rather than adding a warning to every line.
- Never replace accurate labels with vague personality-led commands.

## 4. Contextual copy map

The following are implementation targets. They are proposed refinements, not claims that the UI has already changed.

| Surface/current wording | Target wording or rule | Reason |
| --- | --- | --- |
| Home: “Trending Now,” numbered sample cards | **In focus**; remove rank numerals; supporting copy **A selection from the sample catalog.** | No popularity or ranking evidence exists. Preserve order and card destinations. |
| Home: “Featured Shows” | **Series in the spotlight** | Editorial selection, not a utility rename. |
| Home: “Popular Movies” | **Tonight’s watchlist** | Makes the actual editorial intent clear. Do not imply this is the user’s saved My List. |
| Shows discovery introduction | **Find your next great series.** | Use as supporting copy in the existing header/hero structure, not a replacement for a featured series title. |
| Music’s existing featured-format eyebrow | **The Riddim**, with clear **Videos / Tracks / Artists / Playlists** context | Expressive music identity without hiding formats or adding a collection. Keep the selected content title as the featured title. |
| Home’s full artist collection | **Artists to explore** | Do not claim “rising” status or invent a distinct discovery selection. |
| Hypothetical future distinct artist discovery collection | Do not add one in this pass. | “Meet your next favourite artist” is conditional on an actual distinct selection; the current app does not need a new rail. |
| Music-video actions | **Watch video**, **Pause video**, **Resume video** as state permits | Clear format and state. |
| Audio actions currently “Play” | **Play track**, **Pause track**, **Resume track** as state permits | Do not confuse audio and video. Keep simulation disclosure near playback. |
| Playlist play controls | **Play tracks** / **Watch videos**; retain “from here” where applicable | Preserve the separate playlist types and ordered starting point. |
| Live demonstration | Visible action **Watch live**, with adjacent **Live demo** / no-broadcast disclosure; accessible name includes event title and “demo.” | Keep the demo working without implying an actual current broadcast. |
| Recorded sports/event content | **Watch replay**; descriptive metadata may identify highlights | Do not call archive material live. |
| Article actions | **Read story** | Applies consistently to News/Lifestyle cards and heroes. |
| Series detail links currently “View details” | **View series** | Entity-specific destination. |
| Movie detail links currently “View details” | **About this film** | Distinguishes details from playback. |
| Event details | **View event** | Preserve actual event route. |
| Genuine empty My List | **Your next favourites belong here.** | Supporting copy: **Choose Save on a title to add it to My List. Choose Saved to remove it. Your list belongs to this demo profile and resets when you reload.** |
| No saved content visible because of restrictions | **No saved items available for this profile.** | Do not pretend existing hidden saves were deleted or reveal restricted titles. |
| Empty notification/unread state | **You’re all caught up.** | Only when the current feed/unread scope genuinely supports that statement. |
| Empty notification category while other unread notices exist | **No notifications in this view.** | Supporting copy points to the existing categories/filters, not a new action. |
| Newsletter: “Stay in the loop” | **Get the next drop** | Supporting copy explicitly calls it a proposed email newsletter and states that signup is not connected. |
| “The home of…” / “World-class” / “Limitless culture” | Contextual, restrained descriptions of stories, music, sport, culture, and the sample catalog | Do not paste one replacement slogan throughout the app or use the proposed positioning verbatim. |
| Contact’s addresses/response-time promise | **Contact details are awaiting owner confirmation. Enquiries cannot be sent from this prototype.** | No invented replacement contacts or service level. |
| Product shipping/stock promise | **Sample product · Ordering and shipping are not connected.** | Leave prices and existing cart/availability logic alone. |
| MGTV+ “Start Free Trial” banner link | **Explore MGTV+** | Keep the existing `/mgtv-plus` navigation; do not imply a trial starts. |
| MGTV+ broad promotional heading | **Explore the MGTV+ concept** | Clearly conceptual, not a new commercial proposition. |

### Collection links

Add a presentation-only `seeAllLabel` prop to `ContentRail`, and supply it at every active caller. Do not infer collection scope from expressive headings.

| Existing destination/scope | Link label |
| --- | --- |
| `/shows` series collection | All shows |
| `/movies` film collection | All movies |
| `/music` or `/music?view=videos` | All videos |
| `/music?view=tracks` | All tracks |
| `/music?view=artists` | All artists |
| `/music?view=playlists` | All playlists |
| `/sports` | All sports |
| `/news` | All news |
| `/events` | All events |
| `/lifestyle` | All lifestyle stories |
| Continue Watching’s existing `/my-list` link | My List; do not claim it shows every viewing-progress record |
| Mixed editorial rail whose existing link is `/shows` | Browse shows, not “All” of a mixed film/series collection |

Retain existing hrefs when they match the label. Where a Music link currently lands on the default Videos view but its label specifically says Artists/Tracks/Playlists, use that **existing** canonical `view` query value. This is a truthful link correction, not a new route or browsing feature.

Retain descriptive accessible names for rail arrows, Save actions, and playback actions. Update those names to match the new visible wording and actual entity.

## 5. Factual integrity policy

### 5.1 Retain truthful demo state

Keep:

- Actual within-demo saved counts, personal ratings, profile choices, current follow/like state, notification unread counts, reminder state, progress bars, remaining-time calculations, and mock-vote choices.
- Existing canonical fictional entity names, narrative film/series synopses, durations, genre/category fields, and safe metadata needed by filters/access policy.
- Existing fixed sample schedules and broadcast fixtures, visibly identified as demonstrations rather than a real current schedule.
- The provisional five-total-profile rule and provisional awards eligibility/vote-limit disclosure.

Qualify seeded and subsequent viewing progress as **demo progress**. Keep Continue Watching and resume working; do not turn seeded records into marketing claims that the service knows what someone actually streamed.

When preference-based sorting is active, describe only the inputs actually present:

- Selected genres only → genre-preference explanation.
- Selected regions only → region-preference explanation.
- Both → genre and region explanation.
- Neither, or guest state → editorial/sample-catalog explanation.

Do not change sorting, add a recommender, or introduce match percentages.

### 5.2 Remove unsupported aggregates and endorsements

- Artist pages: remove hard-coded follower totals; retain Follow/Following and their existing state.
- Like buttons: render Like/Liked or an existing contextual label, without invented base totals. Keep the toggle and accessible pressed state.
- Shop/Product: remove fabricated public stars/review counts from the presentation; retain the user’s own rating widget.
- Preserve existing Shop sort behaviour. Rename **Top Rated** to **Sample rating order**, so its retained fixture-based ordering is not presented as a public endorsement. Do not fabricate replacements or change sort keys/values.
- Remove unsupported “best,” “record-breaking,” “sold out,” “award-winning,” artist-sales/streaming records, audience figures, and growth percentages from normal editorial copy.
- Preserve proper award-category names such as Best Reggae Artist inside the clearly labelled mock awards experience. Those are category names, not verified wins.

It is acceptable to leave fixture metric fields internally where another existing interaction depends on them; they must not reappear as real public evidence.

### 5.3 News, biographies, credits, and dates

- Rewrite sample reporting that asserts real results, attendance, streaming totals, invented quotations, or future MGTV broadcasts.
- Keep named fictional catalog subjects, but remove invented evidence of popularity or achievement.
- Examples:
  - “Shanti V Breaks Three Streaming Records…” → **Artist spotlight: Shanti V**.
  - “Reggae Sumfest 2025 Sets Attendance Record with 85,000 Fans” → **Reggae Sumfest in focus — sample event story**.
  - “Full Nominee List Announced” with unsupported counts/dates → **Explore the mock MGTV Awards nominees**.
- Keep article IDs and canonical detail/card relationships intact. Headlines must remain unique where catalog checks require uniqueness.
- Use a concise visible **Sample editorial copy** notice on article/detail surfaces that contain fictional reporting or credits. Do not repeat it around every paragraph.
- Do not invent new dates or roll samples forward to the current year. Prefix existing fixture publication/event dates with appropriate sample context.
- Remove relative freshness claims such as “Recent Releases” when not substantiated by a defined real release source; use **From the sample film collection** or another neutral heading without altering the underlying collection/filter logic.
- Confirm rights, origin, commissioned “Original” status, credits, authors, artist biographies, real event associations, and actual publication/release dates through the owner-review register rather than claiming verification.

### 5.4 Live, access, and badge semantics

- Do not change `eventStatus`, broadcast status, `item.badge`, classifications, access metadata, or URL filter values for a copy-only refinement.
- Keep `getEventPresentation().label` values stable where they drive filtering/tests. Qualify their **rendered labels** with demo context.
- Where a filter option has a friendlier/demo-qualified label, chips should show the option’s display label, not blindly echo its internal query value.
- Avoid isolated LIVE badges or pulsing urgency for simulated broadcasts. Use restrained **Live demo** presentation next to the actual Watch live action.
- Premium access may still be identified as MGTV+ because the prototype enforces that distinction. Do not turn it into a claim about a real paid subscription.
- Replace unsupported “EXCLUSIVE”/“Original” promotional presentation with a truthful MGTV+ preview or selected-catalog label where appropriate, without changing access rules.
- Avoid “NEW,” “LIMITED,” or exclusivity/stock scarcity claims unless clearly part of the labelled sample concept.

### 5.5 Commercial copy without monetary changes

- Freeze all numeric pricing, currencies, periods, original prices, quantities, cart totals, and purchase/PIN actions.
- Preserve the existing illustrative plan lists/comparison and their values under a conspicuous **Unconfirmed sample benefits** heading. Do not add, remove, or reassign plan entitlements in this pass.
- Remove unsupported blanket promises about real trials, cancellations, HD/4K delivery, downloads, devices, priority support, or ad-free operation from general marketing copy.
- Replace the promotional “Best Value — Save 37%” badge in the UI with **Sample plan**. Leave price/savings data unchanged; do not calculate or endorse a new saving. Record the existing promotion for owner confirmation.
- Keep the sample-plan and Payments are not connected disclosures close to relevant controls.
- Remove shipping/response-time promises and real inventory implications from customer copy. Keep existing boolean gates and cart controls functioning.

## 6. Newsletter, static pages, placeholders, and legal review

### Newsletter

- Keep the existing footer layout; do not add signup behaviour, storage, validation success, an email service, or a fake “subscribed” state.
- Use Get the next drop with a clear explanation that this is an **email newsletter concept** and signup is not connected.
- Associate an accessible Email address (preview) label with the field.
- Represent the currently inert input/button as unavailable preview controls, with **Signup not connected** text. Do not collect or send addresses.
- Make no frequency, delivery, exclusivity, unsubscribe, or privacy promises that lack owner approval.

### About and Contact

- Rewrite About’s unsupported founding history, superiority, commissioning/exclusivity, and live-service claims into a modest description of MGTV’s editorial direction and prototype scope.
- Remove unverified Contact addresses and response-time copy. Keep `/about` and `/contact` navigable.
- Do not add a contact form, address, phone number, social URL, or support commitment.

### Footer placeholders

- Preserve working route links.
- Do not invent destinations for `#` placeholders: Careers, Press, business links, social destinations, Accessibility, and Cookie Policy require owner confirmation.
- Keep their place in the footer as clearly unavailable/pending-review text or disabled presentation rather than a misleading “working” destination.
- Do not replace a working route with a placeholder or remove genuine navigation access.

### Legal/policy

- Keep `/privacy` and `/terms` body arrays **verbatim**, including their existing date/jurisdiction wording.
- Add a separate, accessible notice above those bodies: **Draft policy — owner review required.** Supporting copy states that it is placeholder policy text, not approved policy for a live service.
- Do not invent legal approval, effective dates, jurisdiction, compliance status, privacy guarantees, or rights.
- Leave copyright/legal ownership wording unchanged and flag the inconsistent dates/entity wording for owner review.
- Visually improving readability is allowed; substantively rewriting legal terms is not.

## 7. Visual hierarchy and spacing specification

### 7.1 Preserve the visual language

- Keep the charcoal surfaces, gold emphasis, existing imagery, distinct media-card aspect ratios, cinematic gradients, responsive navigation, profile avatars, and mini-player.
- Use Bebas Neue for major entertainment headings and existing expressive editorial headings.
- Use Inter for body copy, metadata, filters, tabs, controls, notices, prices where already appropriate, and errors.
- Do not add decorative icons, emoji, new animations, new card families, or a replacement design system.

### 7.2 Readable type and contrast

- Default to existing `text-text-primary` and `text-text-secondary` tokens for important text.
- Reserve `text-text-muted` and very dark raw greys for genuinely decorative/disabled details, not dates, authors, location, descriptions, explanatory copy, or actionable labels.
- Target at least 4.5:1 contrast for normal meaningful text and 3:1 for large text, including text placed on artwork.
- Use `text-sm` for important compact metadata/controls and `text-base` for normal descriptions. Keep `text-xs` only where still readable and appropriate for a short secondary status; avoid 9–10px meaningful copy.
- Major feature titles: use the existing display scale contextually, generally `text-5xl` to `md:text-7xl`; long editorial headlines may use `text-4xl` to `md:text-6xl`. Do not blanket-shrink every title.
- Section headings: consistent `text-2xl` to `md:text-3xl`, with a common line-height/baseline treatment.
- Keep body measures approximately 45–70 characters per line and descriptions usually one or two concise sentences. Avoid tall paragraph blocks in card/hero summaries.

### 7.3 Gutters and contained rails

- Standard page-content shell: existing `max-w-7xl`, centred, `px-6` on narrow screens and `md:px-16` on desktop.
- Full-bleed artwork/backgrounds may remain full width; text, section headings, cards, and relevant controls should align to that shell.
- Add a presentation-only `layout?: "page" | "contained"` prop to `ContentRail`.
  - `page` is the default and owns normal page gutters/centering.
  - `contained` inherits its parent content pane and adds no second horizontal gutter or width cap.
- Use contained rails inside `DiscoveryResults` and other already-padded content panes.
- Align headings, result counts, first card artwork, and metadata baselines within each pane. Do not remove the filter sidebar or change responsive breakpoints.
- Remove redundant nested shell padding, accumulated bottom padding, and duplicate section offsets where live measurements demonstrate the problem.

### 7.4 Whitespace and card alignment

- Do not introduce or retain large invisible hover-expansion slots.
- Because active cards already use normal-flow actions, focus this pass on actual computed spacing: full-screen hero minima, nested insets, repeated card metadata, and stacked section margins.
- Keep poster, landscape, square, artist, and event aspect ratios.
- Keep Save, playback, More, queue, and playlist actions reachable in normal flow or the existing disclosure; never hide them solely to shorten cards.
- Use consistent title/metadata spacing for cards in the same family. Allow necessary title wrapping; avoid new truncation of essential names.
- A small title-row allowance is acceptable for baseline alignment, but no arbitrary large minimum card body heights.
- Aim for an ordinary content gap of roughly the existing 8–12 spacing steps between the end of one content rail and the next heading, excluding intentional hero/footer framing.
- Preserve at least the focus-ring clearance around scrollable card links/buttons; do not clip focus outlines while tightening rails.
- Do not solve overflow or whitespace by hiding whole controls, using negative-margin hacks, or masking horizontal overflow globally.

### 7.5 Heroes and artwork contrast

- Preserve featured entity titles and the image-led hierarchy. New editorial copy must not replace the title of the selected series/film/track.
- Remove the forced narrow-screen `min-h-screen` on the Shows hero; let content, responsive padding, and artwork determine height.
- Review Home/Lifestyle full-viewport minima individually. Reduce excessive blank framing where evidenced, without converting every hero into a plain text header.
- Use the existing left/bottom gradients to give copy a predictable dark reading area; strengthen locally where a bright image undermines contrast.
- Ensure long titles, metadata, and action rows fit at 320px/390px. Buttons may wrap or stack without shortening their meaning or covering artwork.
- Keep fixed header clearance and mini-player bottom clearance. Apply an appropriate scroll offset so focused/anchored headings are not hidden beneath the fixed header.

### 7.6 Status restraint

- One principal status/access treatment per card.
- Keep genuine differences between an event’s state and broadcast availability; do not collapse distinct fields into a misleading single state.
- In compact event cards, avoid repeating the same status sentence, date, location mode, and timezone in several places. Retain one clear schedule/location presentation and the relevant actions.
- Detail/watch pages may explain restrictions or availability more fully, but remove duplicated identical summary blocks where the same information is already adjacent.

## 8. Implementation interfaces and scope

### Minimal presentation changes

1. **Copy inventory/claim register**
   - Create a small Markdown audit at `plans/mgtv-copy-owner-review.md`.
   - For each issue record surface/file, original claim, treatment, required owner confirmation, and status.
   - This is documentation, not an approval workflow or CMS.
2. **Shared components**
   - `ContentRail`: explicit collection link label and page/contained layout.
   - `MediaCard`, `TrackCard`, `PlaylistCard`: entity-specific labels, concise metadata, restrained badges, spacing/baselines.
   - `EventSummary`: compact versus detailed presentation without changing state resolution.
   - `NotificationList`: optional empty title/body supplied by the parent’s existing feed/filter facts.
   - `LikeButton`: no fabricated aggregate count in presentation; keep the same interaction.
   - `Badge`: display-label/style changes only; preserve variant values and access meaning.
   - `ActiveFilters`: use the existing option display label for chips without changing query values.
3. **Page copy**
   - Home; Shows/Movies/Music/Sports/News/Events/Lifestyle landing and detail pages.
   - My List, Search, playlists, notifications, auth, profiles/account/parental controls, and Awards for contextual wording/clarity.
   - Shop/Product and MGTV+ for truthful concept/sample disclosures, not monetary changes.
   - Footer, About, Contact, and legal presentation as specified.
4. **Fixture editorial copy**
   - Update only relevant visible headlines, descriptions, article paragraphs, and bios in canonical source records.
   - Keep titles/names used as identities and relationships stable unless the headline itself is the unsupported claim.
   - Ensure generated cards and detail records still agree after headline edits.
5. **Styling**
   - Use existing Tailwind tokens and local primitives. Add a small shared layout utility only if it removes genuine repetition.
   - No new broad component architecture, copy framework, localisation layer, image assets, or dependencies.

Do not rewrite `AppStateContext`, reducers, policy, playlist ownership, or playback ownership to achieve a copy change. Small state-aware rendering predicates are allowed to make wording truthful.

### Descriptive controls and reduced motion

- Update visible and accessible playback labels together, based on current media type and status.
- Keep pressed/checked/disabled states, associated labels/errors, focus containment/return, Escape/backdrop behaviour, and touch targets.
- Preserve existing reduced-motion CSS. Shared rail `scrollBy` calls currently request smooth scrolling explicitly; choose `auto` for users who request reduced motion rather than relying on CSS to override the JavaScript request.
- Do not add hover-only access to meaningful copy or actions.

## 9. Accurate MGTV document metadata

Use `.figma/make/site.json` as the canonical source:

- `title`: **MGTV — Jamaican and Caribbean entertainment**
- `description`: **Explore Jamaican and Caribbean series, films, music, sport, news and sample events in the MGTV customer web prototype.**
- `language`: `en`
- Preserve `robots.index: false` and all unrelated existing configuration.

The existing Vite plugin already emits matching Open Graph title/description. Do not introduce duplicate metadata tags, invented production URLs, analytics, social images, or a per-route SEO framework.

Preserve the special comment slots in `index.html` and the existing Vite/development/deployment scripts.

Verify both generated production HTML and the actual preview document. If the running host caches Vite’s imported site configuration, use a small idempotent root-level metadata synchronisation effect reading the **same configuration** to update document title, description, language, and existing Open Graph title/description. Do not create competing copy constants, duplicate tags, start another server, or modify bootstrap/deployment scripts.

## 10. Owner-review register

At minimum, record these unresolved factual matters without inventing answers:

1. Final brand positioning/approved public About copy; the proposed positioning remains guidance only.
2. Real content licensing, exclusivity, MGTV Original status, credits, authors, artist biographies, artwork associations, and release/publication dates.
3. Authentic news reporting, quotations, sporting results, festival attendance, streaming records, audience metrics, and review data.
4. Real event dates, venues, participants, ticket availability, broadcast/replay rights, and any future release or coverage promises.
5. Live service availability and operational guarantees, including offline downloads, video quality, device limits, ad-free operation, support, trials/cancellations, and plan entitlements.
6. Existing illustrative prices/savings/promotion text. No financial values are approved or changed by this task.
7. Product specifications, materials, availability, scarcity, reviews, fulfilment, and shipping times.
8. Approved contact addresses, support/response expectations, social destinations, business links, Press and Careers.
9. Newsletter availability, signup/privacy language, frequency, and delivery expectations.
10. Privacy/Terms bodies, policy dates, jurisdiction, data-practice assertions, legal entity/copyright dates, Accessibility and Cookie Policy.
11. Existing provisional profile, parental-control, and awards rules; preserve their current provisional status.

Each row must say whether visible copy was removed, neutralised, clearly marked as sample/unconfirmed, or left verbatim behind an owner-review notice. Do not mark an item approved merely because it appears in mock data.

## 11. Verification and acceptance

Planning has not changed application source or run implementation checks. The following checks are required during implementation.

### Copy and data integrity

- Audit all rendered customer routes and state-specific messages, not only Home.
- Search for stale generic link labels, unsupported percentages/records, fake totals, service promises, live claims, and scaffold metadata; review every match contextually.
- Do not blanket-ban legitimate proper names, mock award-category names, real within-demo counts, or explicit sample dates.
- Add `scripts/check-copy.mjs` using the existing Node/TypeScript tooling, with a `check:copy` package entry if needed. No test framework dependency.
- Check:
  - The exact proposed positioning is absent from rendered interface/public metadata.
  - Metadata contains the approved MGTV prototype values and preserves noindex.
  - Active collection links have specific, truthful labels.
  - Unsupported aggregate metrics and real-service promises are absent from the normal rendered surfaces.
  - Price amounts, currencies/periods, original prices, calculation inputs and plan values remain unchanged.
  - Canonical IDs, route formats, behavioural enum/filter values and relationships remain unchanged.
  - `/privacy` and `/terms` body arrays match baseline snapshots/hashes captured before edits; review notices are outside those bodies.
- Prefer parsed data/AST extraction and rendered assertions to brittle blanket source-string checks.
- Use existing catalog checks to catch duplicate headlines or card/detail divergence after copy edits.

### Prescribed commands

- Format only intended changed files with `pnpm format <explicit paths>`.
- Keep multi-member TypeScript type declarations multiline: the installed formatter has previously removed separators from compact inline declarations.
- Run `pnpm check:copy` if added, then:
  - `pnpm check:catalog`
  - `pnpm check:playback`
  - `pnpm check:app-state`
  - `pnpm check:access`
  - `pnpm check:discovery`
  - `npx tsc --noEmit`, using the repository’s configured toolchain when necessary
  - `pnpm build`
  - `git diff --check`
- Do not replace repository entry points with an invented lint/test command.
- The host supervises the development server. Do not run a second dev server, publish a preview, deploy, or commit.

### Actual UI checks after copy edits

Use the running preview URL from `figma make preview get-local-url`. Browser automation may use temporary tooling outside the repository if needed; do not add browser tooling as an application dependency.

Check 1440px desktop, approximately 768px tablet, 390px and 320px narrow browser widths, plus enlarged-text/200% zoom behaviour. Capture and inspect before/after screenshots of:

- Home hero and representative rails.
- Shows/Movies discovery with the sidebar, filtered grid, and empty results.
- Music Videos/Tracks/Artists/Playlists, including Play track/Watch video labels and long titles.
- Event cards, a live demo, replay, cancelled/postponed, and unavailable states.
- News/Lifestyle article and editorial layouts.
- Empty My List, populated My List, empty unread/category notifications.
- Account/profile/auth/restriction messages.
- MGTV+ sample panels, Product/Shop, footer/newsletter, About/Contact, and legal review notice.

Verify:

- No unintended horizontal page overflow, clipping, overlapping artwork text, misleading truncation, or buttons too narrow for their labels.
- Section gutters and first-card/header edges align; contained rails do not add a second page gutter.
- Titles and metadata have consistent baselines within a card family; whitespace is reduced without clipping focus rings or hiding controls.
- Important secondary text is readable; artwork text passes contrast checks in actual image regions, not only against a nominal background token.
- All existing navigation, canonical details, search/filter/chip/back-forward actions, profile changes, Save, Like, Follow, personal rating, playlist editing, queue controls, reminders, notification read actions, mock voting, and mock purchase-entry actions still work.
- Audio/video handoff, mini-player persistence, resume, autoplay preferences, parental restrictions, and viewing limits are unchanged.
- Keyboard-only navigation, dialog focus containment/return, Escape, touch access, and reduced-motion scrolling remain correct.
- Empty-state wording reflects the actual scope; “caught up” never hides read notifications or implies there are no other unread categories.
- Newsletter/contact copy does not trigger or imply a real submission.
- Legal body wording is unchanged; owner-review status is visible.
- The preview and built document use MGTV metadata, with no duplicated description/OG tags and no indexing/publication changes.
- No browser page errors appear.

### Final handoff

Summarise:

1. The strongest actual before/after wording examples and why they fit their context.
2. The most material visual improvements, supported by post-change screenshots/measurements.
3. Exactly which automated checks and browser scenarios passed, with any warnings or blockers accurately identified.
4. The owner-review register and remaining unverified factual/legally sensitive copy.
5. Confirmation that prices/payment behaviour, working state/navigation, backend scope, and deployment/publication were not changed.

Do not describe proposed copy or planned checks as already implemented or verified.
