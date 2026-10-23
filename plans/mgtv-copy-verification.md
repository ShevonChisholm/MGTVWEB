# MGTV refinement — implementation verification

## Implemented wording examples

- **Trending Now → In focus**, with “A selection from the sample catalog.” Numbered ranks were removed, not reordered.
- **Popular Movies → Tonight’s watchlist**; this remains an editorial rail, not the profile’s saved My List.
- **Featured Artists → Artists to explore**, with **All artists** correctly opening the existing `view=artists` collection.
- Music uses **The Riddim** with explicit format context. Track/video/playlist controls now identify the media and current state.
- Fabricated streaming, attendance and sporting headlines became **Artist spotlight: Shanti V**, **Reggae Sumfest in focus — sample event story**, and **Jamaican sprinting in focus**. Cards and detail pages still use the same canonical records.
- Contact now says details await owner confirmation and enquiries cannot be sent. The footer newsletter is explicitly an unavailable email-newsletter concept.
- MGTV+ is a concept with **Unconfirmed sample benefits**, not an available trial. Illustrative values and existing mock purchase behavior were retained.
- Empty My List distinguishes genuinely empty from hidden saved items. Empty notification copy distinguishes a filtered view from a genuinely caught-up unread feed.

## Visual evidence and measurements

Screenshots and browser measurement output are temporary review evidence in `/tmp/mgtv-copy-audit/`, not application assets or dependencies.

| Measurement | Before (accepted-plan audit) | After |
| --- | --- | --- |
| Home at 1440px: hero title / rail heading / first artwork | x=144 / x=64 / x=64 | **x=144 / x=144 / x=144** |
| News at 1440px | Editorial gutters differed from the Home hero | **x=144** for the feature heading, using the same page shell |
| Shows at 390×844: hero height | 844px below the chrome | **413px**, content-driven |
| Shows at 320px | Forced viewport minimum | **574.5px**, wrapping the real content and actions |
| Shows desktop contained rail | Extra 64px page gutter inside the results pane | Heading at **x=368**, artwork at **x=372**; only a 4px focus-clearance inset remains |
| Home at 390px | Inconsistent shared gutters | Hero title, rail heading and first artwork all **x=24** |
| News at 768px | Fixed framing/awkward narrow columns | Single-column editorial hero, measured **605.5px** after the copy refinement |

Representative inspected evidence:

- `final---1440.png`, `final---rails-1440.png`: Home hero, progress rail, and unranked In focus rail.
- `final--shows-390.png`, `final--shows-320.png`, `final--shows-rails-1440.png`: content-driven hero and contained discovery rails.
- `final--music-view-tracks-390.png`, `final--events-rails-390.png`: format-specific controls, readable metadata and restrained demo status.
- `final--news-1440.png`, `final--lifestyle-390.png`, `final--mgtv-plus-390.png`, `final--privacy-390.png`: editorial/concept/legal presentation.
- `empty-my-list.png`, `empty-category-notifications.png`, `empty-unread-notifications.png`: state-specific empty copy.

Meaningful low-contrast raw grey text was promoted to the existing secondary token; tiny authored metadata was enlarged. Image gradients were strengthened locally. Poster, landscape, artist and track aspect ratios and existing artwork were retained. Controls stay in normal flow; wrapping was added rather than hiding actions.

## Automated commands actually run

All of the following completed successfully:

- `pnpm format <explicit changed paths>`
- `pnpm check:copy`
- `pnpm check:catalog` — 112 canonical items
- `pnpm check:playback`
- `pnpm check:app-state`
- `pnpm check:access`
- `pnpm check:discovery`
- `npx tsc --noEmit`
- `pnpm build`
- `git diff --check`

The first formatting pass exposed the known compact-type separator issue in three existing declarations. Those declarations were made multiline, reformatted and typechecked successfully. No check failure was ignored.

`check:copy` protects the pre-edit policy bodies, product prices/original prices, plan/comparison values, catalog IDs/routes/relationships, behavioral filter values, schedules/broadcast states, and existing state/access/playback/purchase modules. It audits the active import graph for specific collection-link labels and unsupported rendered aggregate expressions. Computed news read time is intentionally allowed to reflect revised article length.

Built HTML assertions verified the approved title, one description, one OG title and description, language, and existing noindex/robots behavior. The actual preview also had exactly one of each metadata tag and the approved MGTV title. The root sync reads the same site JSON; it does not introduce a second metadata source.

## Browser checks actually run

Used the host-supervised preview at `http://localhost:3000`; no development server was started.

- A **200-case sweep** covered 50 routes/states at 1440, 768, 390 and 320px, including landing/detail pages, all Music formats, filtered/empty discovery, sample event states, search, account/profiles/parental controls, awards, shop/product/plans, static/legal and auth screens. No horizontal document overflow, duplicate metadata or browser page exceptions were found.
- A subsequent **36-case focused pass** remeasured nine representative surfaces at those widths after the final wrapping/contrast refinements. No horizontal document overflow.
- **24 enlarged/reflow cases** tested 12 representative routes at 200% root text size and 2× CSS zoom at 768px. These are text enlargement and a browser-reflow proxy, not a claim of testing every native browser zoom implementation. After fixing newsletter/banner/action wrapping, there was no document overflow or visible card-action overrun.
- Screenshot pixel checks sampled **22 secondary-text regions** on image-led Home/Shows/Music/Events/event-detail/sports-detail heroes at 1440 and 390px. Text was temporarily hidden in the browser harness and actual text-range backgrounds sampled; the minimum contrast against the brightest sampled background was **5.29:1**, above 4.5:1. This is a scoped image-region check, not a whole-site accessibility certification.
- Ten end-to-end interaction scenarios passed: Save/removal and empty My List; Follow/Like/personal rating persistence; reminders and scoped notification empty states; audio/video handoff and mini-player persistence; compatible playlist creation/removal and queue controls; mock voting; mock purchase PIN checks; child-profile isolation and content restrictions; reduced-motion rail scrolling; and unavailable newsletter/contact plus legal notice.
- Four additional scenarios passed: all four genre/region explanation combinations; filter/chip/browser-history navigation; **Live demo** option/chip retaining the underlying `Live` query value; and sample cart quantity/subtotal plus checkout entry.
- Keyboard checks covered dialog focus containment, Escape dismissal/focus return, and reduced-motion `scrollBy` using `auto`.

Temporary browser tooling was kept outside the repository. Early harness timeouts were corrected for stale route waits, transformed display text, a navbar-versus-track “More” selector, static-page container selection, and the existing auto-opening cart. These were rerun successfully; they were not application-state changes.

## Warnings and remaining owner review

- The production build succeeds with Vite’s existing-style **large chunk warning** (a minified JS chunk above 500kB). Code splitting is outside this copy/hierarchy pass.
- Existing external images sometimes fail to load in Shop/Product/Lifestyle. The **Island Vibes Hoodie** and **Island Life Bucket Hat** URLs were among observed failures. Artwork URLs were deliberately preserved; complete asset-delivery verification is therefore not claimed.
- The owner must still approve licensing, credits, real reporting, dates/venues/participants, plan/product/service claims, contacts, policy/legal wording and provisional product rules. See **`plans/mgtv-copy-owner-review.md`**.
- Privacy/Terms body arrays, dates and jurisdiction wording remain unchanged behind a separate draft-policy notice. This pass does not make them approved policies.
- No prices, payment/PIN behavior, canonical routes, behavioral enum values, state reducers or playback/queue ownership were changed. No backend, integration, mobile app, deployment, publication or commit was added.

These checks are representative regression coverage, not a full assistive-technology, native-device or legal/compliance certification.
