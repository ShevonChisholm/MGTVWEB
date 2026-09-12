# MGTV — Feature Expansion Plan (Sept 2026)

## Context

User requested a wide expansion of MGTV's interactivity and detail-page depth. Key asks:
1. **Detailed pages built out** — more mock data so all detail pages work (currently only 1 record each for shows, movies, artists, events)
2. **Music Playlist feature** — create/manage playlists, add tracks, browse playlists
3. **Events: Set Reminder** — reminder/RSVP toggle on EventDetailPage
4. **Like + Rate (1–10)** — on shows, movies, music, events attended, shop products
5. **Nice extras**: Follow artists (wired), cart context, more data depth across the app

---

## Current State Summary

- **Detail pages exist for:** Shows, Movies, Music Video, Artist Profile, News Article, Events — but only 1 mock record each (`t1`, `m1`, `a1`, `n1`, `e1`), so any other ID shows "not found"
- **Save/My List:** wired on ShowDetailPage + MovieDetailPage via `SavedContext`; NOT on Artist, Music Video, Events
- **Ratings:** display-only on ProductDetailPage; zero interactive rating anywhere
- **Likes:** not implemented anywhere
- **Artist Follow:** button renders but has no state handler
- **Playlist/Queue:** no data shape, no UI, no context
- **Event Reminder:** no state, no UI — only a "Get Tickets" external link
- **Cart:** add-to-cart is a 2-second flash with no persistence

---

## What Will Be Built

### 1. Expanded Mock Data (`src/data/mockContent.ts`)

Add 3–4 additional records for each detail type so navigation doesn't 404:
- `showDetails`: add `t2` (drama), `t3` (documentary), `t4` (comedy)
- `movieDetails`: add `m2`, `m3`, `m4`
- `artistDetails`: add `a2` (Jah Roc), `a3` (Shanti V), `a4` (D-Wave)
- `newsArticles`: add `n2`, `n3`, `n4`
- `eventDetails`: add `e2`, `e3`, `e4`
- Add `Playlist` interface + `playlists` array (3 mock playlists with track lists referencing existing `musicVideos` ids)

**Pattern:** Copy structure from existing records, change ids/titles/images/cast

---

### 2. Global Interaction Context (`src/context/InteractionContext.tsx`)

Single new context to unify all user interaction state:

```ts
interface UserRating { rating: number; timestamp: number }
interface InteractionState {
  // Ratings (1–10 scale)
  ratings: Record<string, UserRating>       // id → rating
  rateItem: (id: string, rating: number) => void
  getRating: (id: string) => number | null

  // Likes
  likes: Set<string>
  toggleLike: (id: string) => void
  isLiked: (id: string) => boolean

  // Follow (artists)
  following: Set<string>
  toggleFollow: (id: string) => void
  isFollowing: (id: string) => boolean

  // Event reminders
  reminders: Set<string>
  toggleReminder: (id: string) => void
  hasReminder: (id: string) => boolean

  // Cart
  cart: CartItem[]
  addToCart: (product: Product, qty: number) => void
  removeFromCart: (id: string) => void
  cartCount: number
}
```

Wrap in `src/App.tsx` alongside existing `SavedContext`. All state is in-memory (no persistence required).

---

### 3. `RatingWidget` Component (`src/components/shared/RatingWidget.tsx`)

Reusable component used across Show/Movie/Music/Event/Product detail pages.

```tsx
interface RatingWidgetProps {
  id: string
  label?: string          // e.g. "Rate this show"
  context?: 'show' | 'movie' | 'music' | 'event' | 'product'
}
```

- **Appearance:** 10 numbered cells (1–10), gold fill on hover/selected, dark on unrated
- **Interaction:** hover previews rating; click submits; shows confirmation toast ("Thanks for rating!")
- **After rating:** collapses to a compact "Your rating: X/10" pill with edit pencil icon
- **Placement:** below the description on detail pages, above ShareBar

---

### 4. `LikeButton` Component (`src/components/shared/LikeButton.tsx`)

Compact heart toggle used in detail page header rows.

- Gold fill + scale animation on like; outline on unlike
- Shows like count (mock number + 1 when liked)
- Used on: ShowDetailPage, MovieDetailPage, MusicVideoPage, EventDetailPage

---

### 5. Music Playlist Feature

#### 5a. Data shape (in `mockContent.ts`)
```ts
export interface Playlist {
  id: string
  name: string
  description: string
  coverImage: string
  tracks: string[]     // array of musicVideo ids
  createdAt: string
  isOwn: boolean       // true = user-created, false = editorial
}
export const playlists: Playlist[] = [ /* 3 editorial + mock user playlist */ ]
```

#### 5b. `PlaylistContext` (`src/context/PlaylistContext.tsx`)
```ts
interface PlaylistState {
  playlists: Playlist[]
  createPlaylist: (name: string) => void
  addTrack: (playlistId: string, trackId: string) => void
  removeTrack: (playlistId: string, trackId: string) => void
  deletePlaylist: (id: string) => void
}
```

#### 5c. "Add to Playlist" button on MusicVideoPage
- A `+` / playlist icon button next to share
- Opens a small dropdown/modal: shows existing playlists with checkbox; "+ New Playlist" creates one inline

#### 5d. Playlists section on MusicPage
- New horizontal `ContentRail`-style section: "Your Playlists" (editorial + user-created)
- Playlist card: square cover image, name, track count, "Play All" hover CTA
- Clicking navigates to `/music/playlist/:id`

#### 5e. New route `/music/playlist/:id` → `PlaylistPage.tsx`
- Playlist hero: cover, name, track count, "Play All" button
- Track list table: number, thumbnail, title, artist, duration, "Add to queue" icon, remove icon (own playlists only)
- Related playlists rail at bottom

---

### 6. Event Reminder / RSVP (`EventDetailPage.tsx`)

In the sticky sidebar card, replace/augment the "Get Tickets" area:

- **"Set Reminder" button**: bell icon; calls `toggleReminder(event.id)` from `InteractionContext`
  - Active state: gold filled bell + "Reminder Set ✓" text
  - Shows a small toast: "We'll remind you 24 hours before the event"
- **"RSVP Interest"** checkbox: "I'm interested" — tracked in `InteractionContext` (same as `likes` for events)
- Sidebar also gets a `LikeButton` + `RatingWidget` (label: "Rate this event" — shown after the event date has passed, otherwise shows "Going?" interest state)

---

### 7. Wire Follow on ArtistProfilePage

- Connect "Follow" button to `InteractionContext.toggleFollow(artist.id)`
- Button toggles: "Follow" (outline) ↔ "Following ✓" (gold filled)
- Show follower count (mock number ± 1 when toggled)

---

### 8. Cart Context + Cart Drawer (`src/context/InteractionContext.tsx` + `CartDrawer`)

Cart state lives in `InteractionContext`. A `CartDrawer` slides in from the right when an item is added to cart on ShopPage/ProductDetailPage.

- Drawer: list of cart items (image, name, qty stepper, price, remove), subtotal, "Checkout" gold CTA (placeholder)
- Navbar: shopping bag icon with item count badge (visible when `cartCount > 0`)
- ProductDetailPage "Add to Cart" now calls `addToCart()` from context instead of local state flash

---

### 9. Detail Page Enhancements

#### ShowDetailPage
- Add `LikeButton` + `RatingWidget` below the action buttons
- "Add to My List" already exists — keep

#### MovieDetailPage
- Add `LikeButton` + `RatingWidget` below action buttons

#### MusicVideoPage
- Add `LikeButton` (in the video info row)
- Add `RatingWidget` (label: "Rate this track")
- Add "Add to Playlist" button

#### EventDetailPage
- Add `LikeButton` + reminder bell in the sidebar
- Add `RatingWidget` (label: "Rate your experience") — visible after event date or always for demo
- Live "attendee interest" count (mock number ± likes)

#### ProductDetailPage
- Replace display-only star rating with interactive `RatingWidget` (but show both: community rating display + "Your rating" widget)

---

### 10. Nice Extras

**Recently Viewed rail** on HomePage: Track last 4 viewed item IDs in `InteractionContext.recentlyViewed`. Display as a "Continue From Where You Left Off" `ContentRail` with `cardType="continueWatching"`.

**Rating Summary on browse pages**: Show average rating (from `InteractionContext`) as a small gold number on ContentCard hover overlay — purely cosmetic display from user's own ratings.

**Toast notification system** (`src/components/shared/Toast.tsx`): A simple bottom-right toast queue used for rating confirmations, reminder set, playlist additions, cart adds. Stack up to 3 toasts, auto-dismiss after 3 seconds.

---

## Files to Create

| File | Purpose |
|---|---|
| `src/context/InteractionContext.tsx` | Ratings, likes, follows, reminders, cart, recently viewed |
| `src/context/PlaylistContext.tsx` | Playlist CRUD |
| `src/components/shared/RatingWidget.tsx` | 1–10 interactive rating |
| `src/components/shared/LikeButton.tsx` | Heart toggle with count |
| `src/components/shared/Toast.tsx` + `ToastContext.tsx` | Notification toasts |
| `src/components/shared/CartDrawer.tsx` | Sliding cart panel |
| `src/pages/PlaylistPage.tsx` | `/music/playlist/:id` |
| `src/components/music/AddToPlaylistMenu.tsx` | Dropdown for adding tracks to playlists |

## Files to Modify

| File | Change |
|---|---|
| `src/data/mockContent.ts` | Add 3–4 records each for show/movie/artist/news/event details; add `Playlist` type + mock playlists |
| `src/App.tsx` | Wrap with `InteractionContext.Provider`, `PlaylistContext.Provider`, `ToastContext.Provider` |
| `src/app/routes.tsx` | Add `/music/playlist/:id` route |
| `src/pages/ShowDetailPage.tsx` | Add `LikeButton`, `RatingWidget` |
| `src/pages/MovieDetailPage.tsx` | Add `LikeButton`, `RatingWidget` |
| `src/pages/MusicVideoPage.tsx` | Add `LikeButton`, `RatingWidget`, `AddToPlaylistMenu` |
| `src/pages/ArtistProfilePage.tsx` | Wire `Follow` button via `InteractionContext`, show follower count |
| `src/pages/EventDetailPage.tsx` | Add reminder bell, `LikeButton`, `RatingWidget` |
| `src/pages/ProductDetailPage.tsx` | Replace display rating with `RatingWidget`, use cart context |
| `src/pages/MusicPage.tsx` | Add "Your Playlists" rail section |
| `src/pages/HomePage.tsx` | Add "Recently Viewed" rail |
| `src/components/layout/Navbar.tsx` | Add cart icon with count badge |
| `src/pages/ShopPage.tsx` | Use `addToCart` from context |

---

## Verification

- Navigate to a show detail, rate it → toast appears, rating persists as "Your rating: X/10" on revisit within session
- Like a show, navigate away, return → heart still filled
- Go to MusicVideoPage → "Add to Playlist" dropdown shows playlists, creates new one, navigates to `/music/playlist/:id`
- EventDetailPage sidebar → "Set Reminder" toggles bell state and fires toast
- ArtistProfilePage → "Follow" toggles to "Following ✓" with count change
- ProductDetailPage → "Add to Cart" → CartDrawer slides in; Navbar bag icon shows count
- `npx tsc --noEmit` passes with 0 errors
