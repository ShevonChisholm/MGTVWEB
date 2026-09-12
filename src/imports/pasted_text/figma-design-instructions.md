Here is the restructured prompt, converted into a precise set of editing instructions. You can paste this directly into an AI assistant, or hand it to a design team to modify an existing design system rather than starting from scratch.
------------------------------
## FIGMA DESIGN SYSTEM EDITING INSTRUCTIONS: MGTV CUSTOMER WEB APP## Project Overview
You are optimizing and updating the existing Mining Gold TV (MGTV) customer-facing web application Figma design. The goal is to break away from uniform "Netflix-clone" layouts. You will inject strong visual rhythm, specialized card systems, and an editorial Caribbean identity without rebuilding the core infrastructure from scratch.
------------------------------
## 1. Global Navigation & Header Edits

* Adaptive Scaling: Retain the global header layout but implement an intelligent responsive collapse pattern.
* Prioritized Actions: On smaller screens, automatically collapse menu links into a mobile navigation pattern while strictly preserving Search and Profile access.
* Background Blending: Adjust the header component layer rules so it renders seamlessly over both solid page backgrounds and complex cinematic hero imagery.

------------------------------
## 2. Structural Hero Updates (Mandatory Page Section)

* Enforce Hero Pattern: Ensure every major content landing page (Shows, Movies, Music, Sports, News, Events, MGTV+, Lifestyle) begins with a prominent Featured Hero section instead of starting directly with a content grid.
* Dynamic Call-to-Actions (CTAs): Audit and replace generic "Play" buttons with context-aware primary actions matching the entity type:
* Shows / Movies / MGTV+: "Watch Now" or "Play"
   * Music: "Listen Now" or "Watch Video"
   * Events: "Get Tickets" or "View Event"
   * News / Lifestyle & Culture: "Read Story" or "Explore"
* Text Contrast: Overlay a clean, cinematic gradient vignette behind hero metadata text to secure absolute readability over high-contrast artwork.

------------------------------
## 3. Card System Refactoring & Visual Separation
Review the existing single-card component architecture and split it into distinct card families to establish automatic content recognition. Apply the following specific structural changes:

| Card Family | Aspect Ratio / Core Shape | Mandated Layout Elements & Metadata |
|---|---|---|
| A. Show Cards | Landscape (Wide) | Wide image, Show Title, Genre, Season/Episode tracker, Play/Explore overlay. |
| B. Movie Cards | Portrait (Cinematic) | High-impact poster artwork focus, compact footer metadata (Year, Runtime, Rating, MGTV+ Badge). |
| C. Continue Watching | Landscape (Wide) | Centered subtle Play/Resume icon, prominent bottom progress bar, "X min remaining" text. |
| D. Event Cards | Block Layout | Bold structural date block (e.g., SEP / 28), Event Name, Location, Time, Ticket Status tag. |
| E. Sports Cards | Split Match / Profile | Team Logos, Live Scores, Match Status (LIVE badge) OR Athlete Image + Island Stat highlight. |
| F. Music Cards | Perfect Square | Album/Single square artwork, Title, Artist name, subtle hover playback state. |
| G. News & Editorial | Magazine Layout | Editorial cover frame, strict typographic headline hierarchy, Category tag, Publish Date. |

------------------------------
## 4. UI Layout & Visual Rhythm Overhaul

* Eliminate Rows Elements: Break up monotonous "Header + standard horizontal rail" page sections.
* Introduce Mixed Compositions: Alternate layouts down each landing page using diverse visual weights:
* Mix Horizontal Rails (for Movies/Trending) with Featured Grids (for News/Lifestyle).
   * Insert Editorial Splits (one large feature card pinned next to smaller supporting text blocks) and Numbered Ranked Rails for trending media.
* Personalization Context: Update recommendation rails to dynamically present subtle context text (e.g., "Because you watched..." or "Popular in Jamaica") above the assigned content cards.

------------------------------
## 5. Filter Architecture Update (Remove Filter Chips)

* Desktop Sidebar Integration: Completely remove horizontal rows of filter chips from the tops of all discovery pages. Replace them with a persistent, visually quiet left-hand filter sidebar aligned alongside the content results grid.
* Context-Driven Filters: Configure the sidebar options to change dynamically based on the current page path:
* Sports: Filter by Sport, Competition, Team, Athlete, and Match Status (Live/Upcoming).
   * Events: Filter by Date, Location, Venue Style (Online/In-Person), and Ticket Tier.
   * Music: Filter by Genre, Artist, Album, and Regional/Island origin.
* Mobile Responsive Translation: Map the desktop sidebar into an overlay Filter Drawer/Screen triggered by a clean desktop filter button. Do not crowd mobile screens with persistent sidebar columns.

------------------------------
## 6. Styling & Identity Alignment

* Remove SaaS Artifacts: Strip out generic SaaS aesthetics—eliminate overly rounded pill buttons, heavy card borders, generic glassmorphic blocks, and heavy artificial ambient shadows.
* Premium Caribbean Identity: Anchor the Caribbean aesthetic entirely through rich imagery, organic color choices, bold typography, and editorial layouts, rather than decorative icons or tropical cliches.

------------------------------
To help you get started on modifying this system, could you tell me which page layout or card family you would like to edit first? I can generate a structured step-by-step layout map or provide specific spacing and component variants for it.

