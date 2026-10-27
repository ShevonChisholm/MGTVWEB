import type { ApiEvent } from "@/context/EventsContext"
export type ContentBadge = "premium" | "free" | "new" | "live" | "exclusive"

export interface Playlist {
  id: string
  name: string
  description: string
  coverImage: string
  kind: "audio" | "video"
  itemIds: string[]
  createdAt: string
  isOwn: boolean
}

export interface ContentItem {
  imageAlt?: string
  eventRecord?: ApiEvent
  previewAvailable?: boolean
  featureUrl?: string | null
  source?: "api"
  landscapeThumbnail?:string
  moviePreference?: { saved:boolean;liked:boolean;rating:number|null;version:number }
  sportsCoverage?: "highlight" | "replay"
  sport?: string
  occurredAt?: string
  sportsPreference?: { saved:boolean;liked:boolean;rating:number|null;version:number }
  id: string
  title: string
  thumbnail: string
  badge?: ContentBadge
  duration?: string
  genre?: string
  year?: number
  description?: string
  artist?: string
  date?: string
  location?: string
  type?: ContentType
  classification?: string
  durationSeconds?: number
  progress?: number
  readTime?: string
  time?: string
  state?: string
  artistId?: string
  musicVideoId?: string
  showId?: string
  seriesTitle?: string
  seasonNumber?: number
  episodeNumber?: number
  access?: "free" | "premium"
  region?: string
  album?: string
  competition?: string
  teams?: string[]
  athletes?: string[]
  ticketTier?: string
}

export type ContentType = "show" | "movie" | "episode" | "musicVideo" | "track" | "artist" | "news" | "lifestyle" | "event" | "sports"
export type CatalogItem = ContentItem & { type: ContentType }

export interface Episode {
  id: string
  number: number
  title: string
  description: string
  duration: string
  thumbnail: string
  progress?: number
}

export interface Season {
  number: number
  episodes: Episode[]
}

export interface ShowDetail {
  id: string
  title: string
  banner: string
  poster: string
  badge: ContentBadge
  genre: string
  description: string
  cast: string[]
  seasons: Season[]
}

export interface MovieDetail {
  id: string
  title: string
  banner: string
  badge: ContentBadge
  genre: string
  year: number
  duration: string
  description: string
  director: string
  cast: string[]
}

export interface ArtistDetail {
  id: string
  name: string
  image: string
  genre: string
  origin: string
  bio: string
  videos: ContentItem[]
}

export interface NewsArticle {
  id: string
  title: string
  category: string
  hero: string
  publishedAt: string
  author: string
  body: string[]
}

export interface EventDetail {
  id: string
  title: string
  image: string
  genre: string
  date: string
  location: string
  description: string
  performers: string[]
  ticketUrl: string
}

// Unsplash image pool
const imgs = {
  concert1:
    "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600&q=80",
  concert2:
    "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600&q=80",
  concert3:
    "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600&q=80",
  concert4:
    "https://images.unsplash.com/photo-1563841930606-67e2bce48b78?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600&q=80",
  stage1:
    "https://images.unsplash.com/photo-1700720711254-602cb6b8468d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600&q=80",
  sports1:
    "https://images.unsplash.com/photo-1763639700615-225fe7fdffff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600&q=80",
  sports2:
    "https://images.unsplash.com/photo-1755877956621-5fac2eae4ebb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600&q=80",
  sports3:
    "https://images.unsplash.com/photo-1760114852784-ec280f0a62e2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600&q=80",
  sports4:
    "https://images.unsplash.com/photo-1765261371855-967aef597a9b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600&q=80",
  artist1:
    "https://images.unsplash.com/photo-1615422079250-5d9aa901ef1b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80",
  artist2:
    "https://images.unsplash.com/photo-1647208976598-7daadeac04e6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80",
  artist3:
    "https://images.unsplash.com/photo-1647208976651-d328633e9628?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80",
  artist4:
    "https://images.unsplash.com/photo-1695917647199-2564d52b3b73?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80",
  artist5:
    "https://images.unsplash.com/photo-1664199749342-67394cd1f356?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80",
  beach1:
    "https://images.unsplash.com/photo-1602608099803-96718a589bb3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600&q=80",
  beach2:
    "https://images.unsplash.com/photo-1600208537475-6cdbf234ca5d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600&q=80",
  beach3:
    "https://images.unsplash.com/photo-1727994191293-f7e14cf7c75b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600&q=80",
  film1:
    "https://images.unsplash.com/photo-1524712245354-2c4e5e7121c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600&q=80",
  film2:
    "https://images.unsplash.com/photo-1529798856831-427dfd0a1ab1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600&q=80",
  film3:
    "https://images.unsplash.com/photo-1650475958723-e8d850c26f67?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600&q=80",
}

const showSeeds: ContentItem[] = [
  {
    id: "t1",
    title: "Island Chronicles",
    thumbnail: imgs.stage1,
    badge: "exclusive",
    genre: "Drama",
  },
  {
    id: "s2",
    title: "The Runway",
    thumbnail: imgs.film1,
    badge: "new",
    genre: "Fashion",
  },
  {
    id: "s3",
    title: "Kingstown Stories",
    thumbnail: imgs.beach1,
    badge: "premium",
    genre: "Drama",
  },
  {
    id: "s4",
    title: "Night Markets",
    thumbnail: imgs.concert4,
    badge: "free",
    genre: "Lifestyle",
  },
  {
    id: "s5",
    title: "The Yard",
    thumbnail: imgs.film3,
    badge: "premium",
    genre: "Comedy",
  },
  {
    id: "s6",
    title: "Coral Reef",
    thumbnail: imgs.beach2,
    badge: "new",
    genre: "Documentary",
  },
  {
    id: "s7",
    title: "Crown & Culture",
    thumbnail: imgs.beach3,
    badge: "premium",
    genre: "Culture",
  },
]

const movieSeeds: ContentItem[] = [
  {
    id: "m1",
    title: "One Last Summer",
    thumbnail: imgs.beach1,
    badge: "premium",
    genre: "Drama",
    duration: "2h 05m",
    year: 2024,
  },
  {
    id: "m2",
    title: "The Last Sprint",
    thumbnail: imgs.sports2,
    badge: "free",
    genre: "Sports",
    duration: "1h 52m",
    year: 2023,
  },
  {
    id: "m3",
    title: "Yardie Rose",
    thumbnail: imgs.film1,
    badge: "premium",
    genre: "Thriller",
    duration: "1h 48m",
    year: 2024,
  },
  {
    id: "m4",
    title: "Carnival Queen",
    thumbnail: imgs.concert3,
    badge: "new",
    genre: "Romance",
    duration: "1h 38m",
    year: 2025,
  },
  {
    id: "m5",
    title: "Roots & Wings",
    thumbnail: imgs.beach3,
    badge: "premium",
    genre: "Biographical",
    duration: "2h 12m",
    year: 2024,
  },
  {
    id: "m6",
    title: "The Reel",
    thumbnail: imgs.film2,
    badge: "free",
    genre: "Documentary",
    duration: "1h 22m",
    year: 2023,
  },
  {
    id: "m7",
    title: "Trident",
    thumbnail: imgs.film3,
    badge: "exclusive",
    genre: "Action",
    duration: "2h 00m",
    year: 2025,
  },
]

const videoSeeds: ContentItem[] = [
  {
    id: "mv1",
    title: "Fire & Gold",
    thumbnail: imgs.concert1,
    badge: "new",
    artist: "Empress Nia",
    duration: "4:12",
  },
  {
    id: "mv2",
    title: "Kingston Flow",
    thumbnail: imgs.concert4,
    badge: "free",
    artist: "Jah Roc",
    duration: "3:58",
  },
  {
    id: "mv3",
    title: "Riddim Queen",
    thumbnail: imgs.concert2,
    badge: "premium",
    artist: "Shanti V",
    duration: "5:01",
  },
  {
    id: "mv4",
    title: "Blue & Gold",
    thumbnail: imgs.stage1,
    badge: "new",
    artist: "D-Wave",
    duration: "3:44",
  },
  {
    id: "mv5",
    title: "Rasta Revolution",
    thumbnail: imgs.artist2,
    badge: "free",
    artist: "Bredda Levi",
    duration: "4:30",
  },
  {
    id: "mv6",
    title: "Paradise Road",
    thumbnail: imgs.beach2,
    badge: "premium",
    artist: "Coral Wave",
    duration: "3:22",
  },
  {
    id: "mv7",
    title: "Soca Season",
    thumbnail: imgs.concert3,
    badge: "new",
    artist: "Trini Gold",
    duration: "4:55",
  },
]

const artistSeeds: ContentItem[] = [
  {
    id: "a1",
    title: "Empress Nia",
    thumbnail: imgs.artist5,
    genre: "Reggae · R&B",
    description: "Kingston, JM",
  },
  {
    id: "a2",
    title: "Jah Roc",
    thumbnail: imgs.artist2,
    genre: "Reggae · Roots",
    description: "Kingston, Jamaica",
  },
  {
    id: "a3",
    title: "Shanti V",
    thumbnail: imgs.artist1,
    genre: "Soca · Afrobeats",
    description: "Port of Spain, Trinidad",
  },
  {
    id: "a4",
    title: "D-Wave",
    thumbnail: imgs.artist3,
    genre: "Dancehall · R&B",
    description: "Bridgetown, Barbados",
  },
  {
    id: "a5",
    title: "Coral Wave",
    thumbnail: imgs.artist4,
    genre: "Gospel · Soul",
    description: "Barbados, BB",
  },
  {
    id: "a6",
    title: "Trini Gold",
    thumbnail: imgs.artist5,
    genre: "Soca · Calypso",
    description: "San Fernando, TT",
  },
]

const sportSeeds: ContentItem[] = [
  {
    id: "sp1",
    title: "World Champs 100m Final",
    thumbnail: imgs.sports1,
    badge: "premium",
    genre: "Track & Field",
    duration: "12m",
  },
  {
    id: "sp2",
    title: "Caribbean Cup Quarter Final",
    thumbnail: imgs.sports4,
    badge: "free",
    genre: "Football",
    duration: "28m",
  },
  {
    id: "sp3",
    title: "Sprint Showdown 2025",
    thumbnail: imgs.sports2,
    badge: "new",
    genre: "Athletics",
    duration: "18m",
  },
  {
    id: "sp4",
    title: "Cricket: Windies vs England",
    thumbnail: imgs.sports3,
    badge: "premium",
    genre: "Cricket",
    duration: "45m",
  },
  {
    id: "sp5",
    title: "Rising Stars Athletics",
    thumbnail: imgs.sports1,
    badge: "free",
    genre: "Track & Field",
    duration: "22m",
  },
  {
    id: "sp6",
    title: "Basketball Slam Dunk",
    thumbnail: imgs.sports4,
    badge: "new",
    genre: "Basketball",
    duration: "15m",
  },
]

const newsSeeds: ContentItem[] = [
  {
    id: "n5",
    title: "Caribbean artists: a sample introduction",
    thumbnail: imgs.artist3,
    genre: "Music",
  },
  {
    id: "n6",
    title: "Tourism and community across the Caribbean",
    thumbnail: imgs.beach1,
    genre: "Regional News",
  },
]

const eventSeeds: ContentItem[] = [
  {
    id: "e5",
    title: "MGTV Awards Afterparty",
    thumbnail: imgs.stage1,
    genre: "Awards Celebration",
    date: "October 28, 2026",
    location: "Kingston, JM",
  },
  {
    id: "e6",
    title: "VIP Artist Masterclass",
    thumbnail: imgs.artist1,
    genre: "Masterclass",
    date: "September 15, 2026",
    location: "Online",
  },
]

// ── Detail records ─────────────────────────────────────────────────────────

export const showDetails: Record<string, ShowDetail> = {
  t1: {
    id: "t1",
    title: "Island Chronicles",
    banner: imgs.stage1.replace("w=600", "w=1920"),
    poster: imgs.stage1,
    badge: "exclusive",
    genre: "Drama",
    description:
      "Five generations of the Montague family face love, power and questions of identity across the Caribbean. Hurricanes, buried secrets and homecomings test the ties between them.",
    cast: [
      "Naomi Richards",
      "Marcus James",
      "Sasha Brown",
      "Devon Clarke",
      "Yvette Francis",
    ],
    seasons: [
      {
        number: 1,
        episodes: [
          {
            id: "e101",
            number: 1,
            title: "Roots",
            description:
              "The Montague family gathers on the ancestral estate for the first time in decades, and old wounds resurface.",
            duration: "52m",
            thumbnail: imgs.stage1,
            progress: 100,
          },
          {
            id: "e102",
            number: 2,
            title: "The Storm Before",
            description:
              "A looming hurricane forces the family to confront buried secrets and make impossible choices.",
            duration: "48m",
            thumbnail: imgs.concert4,
            progress: 60,
          },
          {
            id: "e103",
            number: 3,
            title: "Salt & Gold",
            description:
              "Marcus discovers a hidden journal that rewrites everything he believed about his grandmother.",
            duration: "55m",
            thumbnail: imgs.beach2,
            progress: 0,
          },
          {
            id: "e104",
            number: 4,
            title: "Carnival Night",
            description:
              "Amid the celebrations, a betrayal threatens to tear the family apart forever.",
            duration: "51m",
            thumbnail: imgs.concert3,
            progress: 0,
          },
          {
            id: "e105",
            number: 5,
            title: "Deep Waters",
            description:
              "Naomi travels to the neighbouring island in search of answers about her father's past.",
            duration: "49m",
            thumbnail: imgs.beach1,
            progress: 0,
          },
          {
            id: "e106",
            number: 6,
            title: "The Reckoning",
            description:
              "Long-hidden alliances come to light as the family faces its most critical vote.",
            duration: "54m",
            thumbnail: imgs.film1,
            progress: 0,
          },
          {
            id: "e107",
            number: 7,
            title: "New Tide",
            description:
              "A surprise arrival changes the balance of power and opens the door to reconciliation.",
            duration: "47m",
            thumbnail: imgs.beach3,
            progress: 0,
          },
          {
            id: "e108",
            number: 8,
            title: "Gold & Glory",
            description:
              "The season finale. The Montague legacy is decided — and nothing will ever be the same.",
            duration: "68m",
            thumbnail: imgs.stage1,
            progress: 0,
          },
        ],
      },
    ],
  },
}

export const movieDetails: Record<string, MovieDetail> = {
  m1: {
    id: "m1",
    title: "One Last Summer",
    banner: imgs.beach1.replace("w=600", "w=1920"),
    badge: "premium",
    genre: "Drama",
    year: 2024,
    duration: "2h 05m",
    description:
      "When three estranged university friends reunite on a remote Caribbean island for one final summer, old loves, unresolved rivalries, and a shared secret threaten to upend their carefully constructed lives. A visually stunning drama about the cost of ambition and the pull of home.",
    director: "Camille Beaumont",
    cast: [
      "Lena Morrison",
      "Andre St. Clair",
      "Nia Thompson",
      "Joseph Walcott",
    ],
  },
}

export const artistDetails: Record<string, ArtistDetail> = {
  a1: {
    id: "a1",
    name: "Empress Nia",
    image: imgs.artist5,
    genre: "Reggae · R&B",
    origin: "Kingston, Jamaica",
    bio: 'Empress Nia is a fictional Kingston-based artist in the MGTV sample catalog. Her profile explores roots reggae and R&B through the illustrative album "Golden Hour" and the tracks and videos collected here.',
    videos: [],
  },
}

export const newsArticles: Record<string, NewsArticle> = {
  n1: {
    id: "n1",
    title: "Jamaican sprinting in focus",
    category: "Sports",
    hero: imgs.sports2.replace("w=600", "w=1920"),
    publishedAt: "September 9, 2026",
    author: "Terrence Campbell",
    body: [
      "Trackside anticipation, training routines and moments after the finish line frame this sample feature on Jamaican sprinting.",
      "The sports archive in this prototype contains illustrative replay entries. It does not document verified championship results, race times or athlete interviews.",
      "Any published coverage would need confirmed sources, credits and footage rights. No future MGTV broadcast is announced here.",
    ],
  },
}

export const eventDetails: Record<string, EventDetail> = {
  e1: {
    id: "e1",
    title: "Reggae Sumfest 2025",
    image: imgs.concert1.replace("w=600", "w=1920"),
    genre: "Music Festival",
    date: "July 18–20, 2025",
    location: "Catherine Hall Entertainment Centre, Montego Bay, Jamaica",
    description:
      "A sample festival entry inspired by Reggae Sumfest in Montego Bay. The schedule, participant list and simulated replay illustrate the event experience; they are not a confirmed festival programme or licensed broadcast.",
    performers: [
      "Empress Nia",
      "Jah Roc",
      "Shanti V",
      "D-Wave",
      "Coral Wave",
      "Trini Gold",
      "Bredda Levi",
      "Special International Guest TBA",
    ],
    ticketUrl: "#",
  },
}

// ─── Shop & Lifestyle ────────────────────────────────────────────────────────

export type ProductCategory = "clothing" | "accessories" | "merch" | "food" | "experiences" | "travel"

export interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number
  image: string
  category: ProductCategory
  badge?: "new" | "sale" | "exclusive" | "limited"
  description: string
  tags: string[]
  inStock: boolean
  rating: number
  reviewCount: number
}

export interface LifestyleArticle {
  id: string
  title: string
  subtitle: string
  image: string
  category: "food" | "travel" | "fashion" | "culture" | "wellness"
  readTime: string
  date: string
  featured: boolean
  excerpt: string
}

export const products: Product[] = [
  {
    id: "p1",
    name: "MGTV Gold Logo Tee",
    price: 45,
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600&q=80",
    category: "clothing",
    badge: "new",
    description:
      "Sample tee concept featuring the MGTV gold wordmark. Materials and product specifications are unconfirmed.",
    tags: ["tee", "unisex", "gold", "logo"],
    inStock: true,
    rating: 4.8,
    reviewCount: 124,
  },
  {
    id: "p2",
    name: "Island Vibes Hoodie",
    price: 89,
    originalPrice: 109,
    image:
      "https://images.unsplash.com/photo-1556821840-3a63f15732ce?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600&q=80",
    category: "clothing",
    badge: "sale",
    description:
      'Sample pullover concept with an MGTV emblem and "Island Vibes" slogan. Materials and finish are unconfirmed.',
    tags: ["hoodie", "oversized", "unisex"],
    inStock: true,
    rating: 4.9,
    reviewCount: 87,
  },
  {
    id: "p3",
    name: "Caribbean Gold Cap",
    price: 35,
    image:
      "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600&q=80",
    category: "accessories",
    badge: "exclusive",
    description:
      "Sample cap concept in black with a gold MGTV logo. Design and production details are unconfirmed.",
    tags: ["cap", "hat", "limited", "gold"],
    inStock: true,
    rating: 4.7,
    reviewCount: 56,
  },
  {
    id: "p4",
    name: "MGTV Gold Chain Pendant",
    price: 120,
    image:
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600&q=80",
    category: "accessories",
    badge: "limited",
    description:
      "Sample MGTV pendant concept. Metal, finish and included accessories are unconfirmed.",
    tags: ["jewelry", "pendant", "gold", "chain"],
    inStock: true,
    rating: 4.9,
    reviewCount: 43,
  },
  {
    id: "p5",
    name: "Empress Nia Vinyl LP",
    price: 55,
    image:
      "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600&q=80",
    category: "merch",
    badge: "exclusive",
    description:
      '"Golden Hour" vinyl concept for the sample artist Empress Nia. Format, artist approval and availability are unconfirmed.',
    tags: ["vinyl", "music", "signed", "limited"],
    inStock: true,
    rating: 5.0,
    reviewCount: 31,
  },
  {
    id: "p6",
    name: "Jerk Seasoning Kit",
    price: 38,
    image:
      "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600&q=80",
    category: "food",
    description:
      "Sample Jamaican jerk seasoning concept. Ingredients, packaging and any culinary partnership are unconfirmed.",
    tags: ["food", "spice", "cooking", "authentic"],
    inStock: true,
    rating: 4.8,
    reviewCount: 201,
  },
  {
    id: "p7",
    name: "Caribbean Cooking Masterclass",
    price: 149,
    image:
      "https://images.unsplash.com/photo-1556910103-1c02745aae4d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600&q=80",
    category: "experiences",
    badge: "new",
    description:
      "Sample virtual cooking-class concept exploring Caribbean dishes. Hosts, programme and availability are unconfirmed.",
    tags: ["class", "cooking", "virtual", "chef"],
    inStock: true,
    rating: 4.9,
    reviewCount: 78,
  },
  {
    id: "p8",
    name: "Jamaica Music Tour Package",
    price: 1299,
    image:
      "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600&q=80",
    category: "travel",
    badge: "exclusive",
    description:
      "Sample Jamaica music-tour concept. Itinerary, accommodation, event access and availability are unconfirmed.",
    tags: ["travel", "jamaica", "vip", "tour"],
    inStock: true,
    rating: 4.9,
    reviewCount: 15,
  },
  {
    id: "p9",
    name: "MGTV Studio Mug",
    price: 22,
    image:
      "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600&q=80",
    category: "merch",
    description:
      "Sample black mug concept with a gold MGTV wordmark. Materials, capacity and care instructions are unconfirmed.",
    tags: ["mug", "merch", "kitchen"],
    inStock: true,
    rating: 4.6,
    reviewCount: 93,
  },
  {
    id: "p10",
    name: "Reggae History Art Print",
    price: 65,
    image:
      "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600&q=80",
    category: "merch",
    badge: "limited",
    description:
      "Sample reggae-inspired art-print concept. Artist attribution, dimensions and production details are unconfirmed.",
    tags: ["art", "print", "reggae", "limited"],
    inStock: true,
    rating: 4.8,
    reviewCount: 27,
  },
  {
    id: "p11",
    name: "Caribbean Wellness Box",
    price: 78,
    originalPrice: 95,
    image:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600&q=80",
    category: "food",
    badge: "sale",
    description:
      "Sample Caribbean wellness-box concept. Contents, ingredients and safety information are unconfirmed; no health benefits are claimed.",
    tags: ["wellness", "herbal", "natural", "caribbean"],
    inStock: true,
    rating: 4.7,
    reviewCount: 144,
  },
  {
    id: "p12",
    name: "Island Life Bucket Hat",
    price: 42,
    image:
      "https://images.unsplash.com/photo-1533827432537-1f1e2fbd6cd2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600&q=80",
    category: "clothing",
    description:
      "Sample khaki bucket-hat concept with an MGTV patch. Materials and finish are unconfirmed.",
    tags: ["hat", "bucket hat", "summer", "unisex"],
    inStock: true,
    rating: 4.5,
    reviewCount: 62,
  },
]

export const lifestyleArticles: LifestyleArticle[] = [
  {
    id: "l1",
    title: "Caribbean fashion, in detail",
    subtitle: "Print, silhouette and the stories behind what we wear",
    image:
      "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1200&q=80",
    category: "fashion",
    readTime: "6 min read",
    date: "Sep 10, 2026",
    featured: true,
    excerpt:
      "A sample editorial introduction to Caribbean fashion through print, shape and personal expression. Designer interviews, collection credits and reporting have not been supplied.",
  },
  {
    id: "l2",
    title: "A Cook's Guide to Authentic Jamaican Jerk",
    subtitle: "Beyond the supermarket shelf — the story of jerk spice",
    image:
      "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80",
    category: "food",
    readTime: "8 min read",
    date: "Sep 8, 2026",
    featured: false,
    excerpt:
      "Smoke, seasoning and the time spent around a cooking fire frame this sample introduction to Jamaican jerk. Historical sources, recipes and contributor credits await editorial review.",
  },
  {
    id: "l3",
    title: "Trinidad Carnival: A Year in the Making",
    subtitle: "Behind the masquerade, months of artistry",
    image:
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80",
    category: "culture",
    readTime: "7 min read",
    date: "Sep 5, 2026",
    featured: false,
    excerpt:
      "This sample story looks beyond the parade to costume-making, wire-bending and rehearsal. Interviews, workshop details and image credits await editorial review.",
  },
  {
    id: "l4",
    title: "Sea moss and Caribbean food traditions",
    subtitle: "A sample cultural story, not health advice",
    image:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80",
    category: "wellness",
    readTime: "5 min read",
    date: "Sep 3, 2026",
    featured: false,
    excerpt:
      "A proposed cultural feature about sea moss in Caribbean food traditions. Research and contributor accounts have not been supplied; this preview makes no nutritional or medical claims.",
  },
  {
    id: "l5",
    title: "Along the Caribbean coast",
    subtitle: "Beyond the tourist trails of the Caribbean coast",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80",
    category: "travel",
    readTime: "9 min read",
    date: "Sep 1, 2026",
    featured: false,
    excerpt:
      "A sample travel introduction to coastlines, coves and the communities around them. No destination list, local recommendations or current travel information has been verified.",
  },
  {
    id: "l6",
    title: "The Art of Slow Living in Barbados",
    subtitle: "Learning to exhale on the platinum coast",
    image:
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80",
    category: "travel",
    readTime: "6 min read",
    date: "Aug 28, 2026",
    featured: false,
    excerpt:
      "An illustrative introduction to a slower day in Barbados, with space for seaside walks and conversation. Local voices, places and travel details await editorial review.",
  },
]

// ─── Additional Show Details ─────────────────────────────────────────────────

export const extraShowDetails: Record<string, ShowDetail> = {
  t2: {
    id: "t2",
    title: "Kingston Noir",
    banner:
      "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1920&q=80",
    poster:
      "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600&q=80",
    badge: "premium",
    genre: "Crime Drama",
    description:
      "A detective navigates the complex underworld of Kingston, where loyalty, music, and survival collide in every dark alley. Gritty, cinematic, and unmistakably Caribbean.",
    cast: [
      "Devante Brown",
      "Leila Morrison",
      "Winston Clarke",
      "Patrice Hamilton",
    ],
    seasons: [
      {
        number: 1,
        episodes: [
          {
            id: "k1e1",
            number: 1,
            title: "The First Cut",
            description:
              "Detective Roy finds a body in the yard of a dancehall legend.",
            duration: "48 min",
            thumbnail:
              "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80",
            progress: 100,
          },
          {
            id: "k1e2",
            number: 2,
            title: "Sound System",
            description: "A stolen sound system leads to dangerous territory.",
            duration: "51 min",
            thumbnail:
              "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80",
            progress: 55,
          },
          {
            id: "k1e3",
            number: 3,
            title: "Garrison State",
            description: "Roy goes deep into garrison politics.",
            duration: "46 min",
            thumbnail:
              "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80",
            progress: 0,
          },
          {
            id: "k1e4",
            number: 4,
            title: "Neon Rain",
            description: "A shootout changes everything Roy thought he knew.",
            duration: "52 min",
            thumbnail:
              "https://images.unsplash.com/photo-1509909756405-be0199881695?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80",
            progress: 0,
          },
        ],
      },
    ],
  },
  t3: {
    id: "t3",
    title: "Roots & Routes",
    banner:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1920&q=80",
    poster:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600&q=80",
    badge: "free",
    genre: "Documentary",
    description:
      "A sweeping documentary series tracing the African diaspora through Caribbean food, music, and spiritual tradition. Three sample episodes, one connected story.",
    cast: ["Dr. Yvonne Brown (Host)", "Various Cultural Historians"],
    seasons: [
      {
        number: 1,
        episodes: [
          {
            id: "rr1e1",
            number: 1,
            title: "The Middle Passage",
            description: "Origins and the crossing — told through food.",
            duration: "55 min",
            thumbnail:
              "https://images.unsplash.com/photo-1556910103-1c02745aae4d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80",
            progress: 0,
          },
          {
            id: "rr1e2",
            number: 2,
            title: "Rhythm & Memory",
            description: "How drumming preserved culture across generations.",
            duration: "58 min",
            thumbnail:
              "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80",
            progress: 0,
          },
          {
            id: "rr1e3",
            number: 3,
            title: "Spirit House",
            description:
              "Obeah, Vodou, and Orisha traditions across five islands.",
            duration: "54 min",
            thumbnail:
              "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80",
            progress: 0,
          },
        ],
      },
    ],
  },
  t4: {
    id: "t4",
    title: "Soca Summer",
    banner:
      "https://images.unsplash.com/photo-1563841930606-67e2bce48b78?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1920&q=80",
    poster:
      "https://images.unsplash.com/photo-1563841930606-67e2bce48b78?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600&q=80",
    badge: "new",
    genre: "Comedy",
    description:
      "A group of cousins from different islands are forced to share a Barbados vacation house for the summer. Culture clashes, romance, and fetes ensue.",
    cast: ["Trini Gold", "Coral Wave", "Marcus Reid", "Sasha Pierre"],
    seasons: [
      {
        number: 1,
        episodes: [
          {
            id: "ss1e1",
            number: 1,
            title: "First Flight",
            description:
              "The cousins arrive and immediately clash over room assignments.",
            duration: "32 min",
            thumbnail:
              "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80",
            progress: 0,
          },
          {
            id: "ss1e2",
            number: 2,
            title: "Fete Disaster",
            description: "A beach fete goes hilariously wrong.",
            duration: "29 min",
            thumbnail:
              "https://images.unsplash.com/photo-1544551763-46a013bb70d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80",
            progress: 0,
          },
          {
            id: "ss1e3",
            number: 3,
            title: "Carnival Day",
            description:
              "The cousins finally find common ground on the parade route.",
            duration: "35 min",
            thumbnail:
              "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80",
            progress: 0,
          },
        ],
      },
    ],
  },
}

// ─── Additional Movie Details ─────────────────────────────────────────────────

export const extraMovieDetails: Record<string, MovieDetail> = {
  m8: {
    id: "m8",
    title: "Coral Blue",
    banner:
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1920&q=80",
    badge: "premium",
    genre: "Thriller",
    year: 2025,
    duration: "1h 54m",
    description:
      "A marine biologist uncovers a conspiracy threatening Caribbean reefs — and the fishing communities that depend on them.",
    director: "Renee St. Claire",
    cast: ["Leila Morrison", "David Okafor", "Sasha Pierre", "Winston Clarke"],
  },
  m9: {
    id: "m9",
    title: "The Jump Up",
    banner:
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1920&q=80",
    badge: "free",
    genre: "Drama · Music",
    year: 2024,
    duration: "2h 04m",
    description:
      "A young soca artist from a small Trinidadian village risks everything to compete at Carnival — and discovers his family history along the way.",
    director: "Marcus Antoine",
    cast: [
      "Trini Gold",
      "Coral Wave",
      "Empress Nia (cameo)",
      "Patricia Walcott",
    ],
  },
  m10: {
    id: "m10",
    title: "Blue Mountain Run",
    banner:
      "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1920&q=80",
    badge: "new",
    genre: "Action",
    year: 2026,
    duration: "1h 42m",
    description:
      "A trail runner discovers a decades-old secret buried in the Blue Mountains of Jamaica while training for the world championships.",
    director: "Anya Thompson",
    cast: ["Devante Brown", "Kyle James", "Leila Morrison"],
  },
}

// ─── Additional Artist Details ────────────────────────────────────────────────

export const extraArtistDetails: Record<string, ArtistDetail> = {
  a2: {
    id: "a2",
    name: "Jah Roc",
    image:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1200&q=80",
    genre: "Reggae · Roots",
    origin: "Kingston, Jamaica",
    bio: 'Jah Roc is a fictional Kingston-based roots-reggae artist in the sample catalog. The illustrative album "Kingston Flow" provides the setting for his collected tracks and videos; no sales, awards or artist affiliations are claimed.',
    videos: [],
  },
  a3: {
    id: "a3",
    name: "Shanti V",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1200&q=80",
    genre: "Soca · Afrobeats",
    origin: "Port of Spain, Trinidad",
    bio: 'Shanti V is a fictional Port of Spain artist whose sample profile brings soca and Afrobeats together. Explore the illustrative track "Fete Season" and related videos without any claim about streaming records or chart position.',
    videos: [],
  },
  a4: {
    id: "a4",
    name: "D-Wave",
    image:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1200&q=80",
    genre: "Dancehall · R&B",
    origin: "Bridgetown, Barbados",
    bio: "D-Wave is a fictional Bridgetown artist in the MGTV sample catalog. His profile explores dancehall and R&B through the illustrative tracks and videos collected here.",
    videos: [],
  },
}

// ─── Additional News Articles ─────────────────────────────────────────────────

export const extraNewsArticles: Record<string, NewsArticle> = {
  n2: {
    id: "n2",
    title: "Artist spotlight: Shanti V",
    category: "Music",
    hero: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1920&q=80",
    publishedAt: "Sep 9, 2026",
    author: "Marcus Antoine",
    body: [
      'Soca and Afrobeats meet in the sample profile of Shanti V. This artist spotlight introduces "Fete Season" as part of the fictional MGTV music collection.',
      "Explore the linked tracks and videos to try the prototype’s separate audio and video experiences. Playback uses still artwork and simulated progress, with no sound.",
      "This is not a reported interview or a release announcement. Artist background, recording credits and any real publication would require confirmation.",
    ],
  },
  n3: {
    id: "n3",
    title: "Reggae Sumfest in focus — sample event story",
    category: "Events",
    hero: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1920&q=80",
    publishedAt: "Sep 6, 2026",
    author: "Claudette Henry",
    body: [
      "Festival staging, music and the sense of gathering form the editorial direction for this sample event story inspired by Reggae Sumfest.",
      "The related event page uses a fixed sample schedule and a simulated replay. Its participant list and artwork are illustrative, not a confirmed record of the festival.",
      "No attendance figures, organiser quotations or future coverage are asserted. Event associations and broadcast rights require owner confirmation.",
    ],
  },
  n4: {
    id: "n4",
    title: "Explore the mock MGTV Awards nominees",
    category: "Awards",
    hero: "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1920&q=80",
    publishedAt: "Sep 3, 2026",
    author: "MGTV Editorial",
    body: [
      "The mock MGTV Awards experience lets a demo profile explore sample nominees and record a local vote. It is a prototype interaction, not an official nomination announcement.",
      "Category names and fictional nominees are provided to demonstrate the voting flow. Eligibility and vote limits remain provisional.",
      "Votes are not submitted to a real awards body. No ceremony broadcast, voting date or final programme is confirmed.",
    ],
  },
}

// ─── Additional Event Details ─────────────────────────────────────────────────

export const extraEventDetails: Record<string, EventDetail> = {
  e2: {
    id: "e2",
    title: "MGTV Awards Ceremony 2026",
    image:
      "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1920&q=80",
    genre: "Awards Show",
    date: "October 28, 2026",
    location: "National Indoor Sports Centre, Kingston, Jamaica",
    description:
      "A sample awards-ceremony concept celebrating Caribbean entertainment. The listed date, venue and participants are illustrative; no ceremony or broadcast is confirmed.",
    performers: [
      "Empress Nia",
      "Shanti V",
      "Jah Roc",
      "D-Wave",
      "Bredda Levi",
      "Special Surprise Guest",
    ],
    ticketUrl: "#",
  },
  e3: {
    id: "e3",
    title: "Caribbean Cup Quarter Final",
    image:
      "https://images.unsplash.com/photo-1763639700615-225fe7fdffff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1920&q=80",
    genre: "Sports",
    date: "September 20, 2026",
    location: "National Stadium, Kingston, Jamaica",
    description:
      "A sample football event featuring Jamaica and Trinidad & Tobago. The live demonstration uses still artwork and simulated playback, not a real match broadcast.",
    performers: ["Jamaica National Team", "Trinidad & Tobago National Team"],
    ticketUrl: "#",
  },
  e4: {
    id: "e4",
    title: "Caribbean Culinary Festival 2026",
    image:
      "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1920&q=80",
    genre: "Food & Culture",
    date: "November 14–16, 2026",
    location: "Queen's Park Savannah, Port of Spain, Trinidad",
    description:
      "A sample festival concept exploring Caribbean food and culture. The schedule, venue, chef list and programme are illustrative; no booking or broadcast is confirmed.",
    performers: [
      "Chef Yvonne Brown",
      "Chef Marcus James",
      "Chef Suki Reid",
      "MGTV Culinary Team",
    ],
    ticketUrl: "#",
  },
}

// ─── Playlists ────────────────────────────────────────────────────────────────

export const playlists: Playlist[] = [
  {
    id: "pl1",
    name: "Reggae Essentials",
    description: "A sample video selection of reggae rhythms and voices.",
    coverImage:
      "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80",
    kind: "video",
    itemIds: ["mv1", "mv2", "mv3", "mv4"],
    createdAt: "Sep 1, 2026",
    isOwn: false,
  },
  {
    id: "pl2",
    name: "Carnival Vibes",
    description: "Soca, dancehall, and everything that makes you move.",
    coverImage:
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80",
    kind: "video",
    itemIds: ["mv5", "mv6", "mv7", "mv1"],
    createdAt: "Aug 15, 2026",
    isOwn: false,
  },
  {
    id: "pl3",
    name: "MGTV New Releases",
    description: "Selected sample videos from across the Caribbean.",
    coverImage:
      "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80",
    kind: "video",
    itemIds: ["mv1", "mv5", "mv3", "mv7", "mv2"],
    createdAt: "Sep 10, 2026",
    isOwn: false,
  },
  {
    id: "pl4",
    name: "My Favourites",
    description: "Videos I keep coming back to.",
    coverImage:
      "https://images.unsplash.com/photo-1563841930606-67e2bce48b78?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80",
    kind: "video",
    itemIds: ["mv2", "mv6"],
    createdAt: "Sep 12, 2026",
    isOwn: true,
  },
  {
    id: "pl-a1",
    name: "Reggae Essentials — Tracks",
    description: "Roots, culture, and gold. An audio selection.",
    coverImage: imgs.concert1,
    kind: "audio",
    itemIds: ["tr1", "tr2", "tr5", "tr8"],
    createdAt: "Sep 1, 2026",
    isOwn: false,
  },
  {
    id: "pl-a2",
    name: "Carnival Mix — Tracks",
    description: "Island rhythms for the road.",
    coverImage: imgs.concert3,
    kind: "audio",
    itemIds: ["tr3", "tr4", "tr7"],
    createdAt: "Sep 5, 2026",
    isOwn: false,
  },
  {
    id: "pl-a3",
    name: "My Tracks",
    description: "My own audio selection.",
    coverImage: imgs.beach2,
    kind: "audio",
    itemIds: ["tr1", "tr6"],
    createdAt: "Sep 10, 2026",
    isOwn: true,
  },
]

// One catalog, many collections. Collections hold references, never alternate identities.
export function durationInSeconds(duration = ""): number {
  if (duration.includes(":")) {
    return duration
      .split(":")
      .reduce((total, part) => total * 60 + Number(part), 0)
  }
  const hours = Number(duration.match(/(\d+)\s*h/)?.[1] ?? 0)
  const minutes = Number(duration.match(/(\d+)\s*m/)?.[1] ?? 0)
  return (hours * 60 + minutes) * 60
}

const classifications: Record<string, string> = {
  t1: "TV-14",
  t2: "TV-MA",
  t3: "TV-PG",
  t4: "TV-PG",
  s2: "TV-14",
  s3: "TV-14",
  s4: "TV-PG",
  s5: "TV-14",
  s6: "TV-G",
  s7: "TV-PG",
  s8: "TV-G",
  m1: "PG-13",
  m2: "PG",
  m3: "R",
  m4: "PG-13",
  m5: "PG-13",
  m6: "PG",
  m7: "PG-13",
  m8: "PG-13",
  m9: "PG-13",
  m10: "PG-13",
  m11: "PG",
  m12: "PG",
  m13: "PG",
  m14: "PG",
  m15: "PG",
}

const travelShow: ContentItem = {
  id: "s8",
  title: "Blue Mountains",
  thumbnail: imgs.beach2,
  genre: "Travel",
  badge: "free",
}
const allShowSeeds = [...showSeeds, travelShow]
export const allShowDetails: Record<string, ShowDetail> = {
  ...showDetails,
  ...extraShowDetails,
}
for (const seed of allShowSeeds) {
  if (allShowDetails[seed.id]) continue
  allShowDetails[seed.id] = {
    id: seed.id,
    title: seed.title,
    banner: seed.thumbnail,
    poster: seed.thumbnail,
    badge: seed.badge ?? "free",
    genre: seed.genre ?? "Drama",
    description: `${seed.title} brings Caribbean ${seed.genre?.toLowerCase()} to MGTV. Explore two sample episodes in this prototype catalog.`,
    cast: [],
    seasons: [
      {
        number: 1,
        episodes: [
          {
            id: `${seed.id}-e1`,
            number: 1,
            title: "Beginnings",
            description: `The opening chapter of ${seed.title}. Sample episode.`,
            duration: "42 min",
            thumbnail: seed.thumbnail,
            progress: 0,
          },
          {
            id: `${seed.id}-e2`,
            number: 2,
            title: "New Horizons",
            description: `The story continues in ${seed.title}. Sample episode.`,
            duration: "46 min",
            thumbnail: seed.thumbnail,
            progress: 0,
          },
        ],
      },
    ],
  }
}

const additionalFilms: ContentItem[] = [
  {
    id: "m11",
    title: "Riddim Nation",
    thumbnail: imgs.concert1,
    badge: "exclusive",
    genre: "Music Documentary",
    duration: "2h 15m",
    year: 2025,
  },
  {
    id: "m12",
    title: "Golden Mile",
    thumbnail: imgs.sports1,
    badge: "exclusive",
    genre: "Sports Documentary",
    duration: "1h 42m",
    year: 2025,
  },
  {
    id: "m13",
    title: "Festival Season",
    thumbnail: imgs.concert3,
    badge: "premium",
    genre: "Music",
    duration: "3h 00m",
    year: 2025,
  },
  {
    id: "m14",
    title: "Sprint to Glory",
    thumbnail: imgs.sports2,
    badge: "premium",
    genre: "Sports",
    duration: "1h 28m",
    year: 2025,
  },
  {
    id: "m15",
    title: "Soul & Rhythm",
    thumbnail: imgs.concert2,
    badge: "free",
    genre: "Music",
    duration: "1h 55m",
    year: 2025,
  },
]
export const allMovieDetails: Record<string, MovieDetail> = {
  ...movieDetails,
  ...extraMovieDetails,
}
for (const seed of [...movieSeeds, ...additionalFilms]) {
  if (allMovieDetails[seed.id]) continue
  allMovieDetails[seed.id] = {
    id: seed.id,
    title: seed.title,
    banner: seed.thumbnail,
    badge: seed.badge ?? "free",
    genre: seed.genre!,
    year: seed.year!,
    duration: seed.duration!,
    description: `${seed.title} — a Caribbean ${seed.genre?.toLowerCase()} feature from the MGTV sample catalog.`,
    director: "Not listed in this sample",
    cast: [],
  }
}

export const musicVideos: CatalogItem[] = [
  ...videoSeeds,
  {
    id: "mv8",
    title: "Roots Revival",
    thumbnail: imgs.concert2,
    artist: "Jah Roc",
    duration: "4:47",
    badge: "free" as const,
  },
  {
    id: "mv9",
    title: "Fete Season",
    thumbnail: imgs.artist1,
    artist: "Shanti V",
    duration: "3:58",
    badge: "new" as const,
  },
  {
    id: "mv10",
    title: "Lagos & Laventille",
    thumbnail: imgs.concert1,
    artist: "Shanti V",
    duration: "4:12",
    badge: "premium" as const,
  },
  {
    id: "mv11",
    title: "Barefoot Kings",
    thumbnail: imgs.artist3,
    artist: "D-Wave",
    duration: "4:31",
    badge: "exclusive" as const,
  },
].map((item) => ({
  ...item,
  type: "musicVideo",
  durationSeconds: durationInSeconds(item.duration),
}))

export const allArtistDetails: Record<string, ArtistDetail> = {
  ...artistDetails,
  ...extraArtistDetails,
}
const bredda: ContentItem = {
  id: "a7",
  title: "Bredda Levi",
  thumbnail: imgs.artist2,
  genre: "Roots Reggae",
  description: "Jamaica",
}
export const featuredArtists: CatalogItem[] = [...artistSeeds, bredda].map(
  (seed) => {
    const detail = allArtistDetails[seed.id] ?? {
      id: seed.id,
      name: seed.title,
      image: seed.thumbnail,
      genre: seed.genre!,
      origin: seed.description!,
      bio: `${seed.title} is featured in MGTV's Caribbean music sample catalog.`,
      videos: [],
    }
    detail.videos = musicVideos.filter((video) => video.artist === detail.name)
    allArtistDetails[seed.id] = detail
    return {
      id: detail.id,
      title: detail.name,
      thumbnail: detail.image,
      genre: detail.genre,
      description: detail.origin,
      type: "artist",
    }
  },
)
for (const video of musicVideos) {
  video.genre = featuredArtists.find((artist) => artist.title === video.artist)
    ?.genre
}

export const tracks: CatalogItem[] = musicVideos
  .slice(0, 8)
  .map((video, index) => {
    const artist = featuredArtists.find((item) => item.title === video.artist)!
    return {
      id: `tr${index + 1}`,
      type: "track",
      title: video.title,
      artist: artist.title,
      artistId: artist.id,
      thumbnail: artist.thumbnail,
      genre: artist.genre,
      duration: video.duration,
      durationSeconds: video.durationSeconds,
      musicVideoId: video.id,
      description: "Simulated audio preview — no audio source connected.",
    }
  })

export type Preview = {
  mode: "simulated"
  behavior?: "buffer-once" | "fail-first-attempt"
} | {
  mode: "unavailable"
  reason: string
  retryable: boolean
}
export const mediaPreviews: Record<string, Preview> = {
  tr2: { mode: "simulated", behavior: "buffer-once" },
  mv8: { mode: "simulated", behavior: "buffer-once" },
  tr8: { mode: "simulated", behavior: "fail-first-attempt" },
}

export const featuredShows: CatalogItem[] = Object.values(allShowDetails).map(
  (show) => ({
    id: show.id,
    type: "show",
    title: show.title,
    thumbnail: show.poster,
    badge: show.badge,
    genre: show.genre,
    description: show.description,
    classification: classifications[show.id],
    duration: `${show.seasons.length} season${
      show.seasons.length === 1 ? "" : "s"
    } · ${show.seasons.flatMap((s) => s.episodes).length} episodes`,
  }),
)
export const popularMovies: CatalogItem[] = Object.values(allMovieDetails).map(
  (movie) => ({
    id: movie.id,
    type: "movie",
    title: movie.title,
    thumbnail: movie.banner,
    badge: movie.badge,
    genre: movie.genre,
    description: movie.description,
    classification: classifications[movie.id],
    year: movie.year,
    duration: movie.duration,
    durationSeconds: durationInSeconds(movie.duration),
    progress: movie.id === "m1" ? 15 : movie.id === "m8" ? 40 : 0,
  }),
)
export const episodes: CatalogItem[] = Object.values(allShowDetails).flatMap(
  (show) =>
    show.seasons.flatMap((season) =>
      season.episodes.map((ep) => ({
        ...ep,
        type: "episode" as const,
        showId: show.id,
        seriesTitle: show.title,
        seasonNumber: season.number,
        episodeNumber: ep.number,
        classification: classifications[show.id],
        durationSeconds: durationInSeconds(ep.duration),
      })),
    ),
)
export const sportsHighlights: CatalogItem[] = sportSeeds.map((item) => ({
  ...item,
  type: "sports",
  state: "Replay",
  durationSeconds: durationInSeconds(item.duration),
  description: `${item.title} — ${item.genre} highlights from the MGTV sample sports archive.`,
}))

export const allNewsArticles: Record<string, NewsArticle> = {
  ...newsArticles,
  ...extraNewsArticles,
}
for (const seed of newsSeeds) {
  if (allNewsArticles[seed.id]) continue
  allNewsArticles[seed.id] = {
    id: seed.id,
    title: seed.title,
    hero: seed.thumbnail,
    category: seed.genre!,
    publishedAt: seed.id === "n5" ? "Sep 2, 2026" : "Sep 1, 2026",
    author: "MGTV Editorial",
    body: [
      seed.id === "n5"
        ? "Independent releases, community stages and island-to-island collaborations are themes for this sample introduction to Caribbean artists."
        : "Tourism, local communities and coastlines frame this sample exploration of Caribbean travel. Reporting and contributors await editorial review.",
    ],
  }
}
export const latestNews: CatalogItem[] = Object.values(allNewsArticles).map(
  (article) => ({
    id: article.id,
    type: "news",
    title: article.title,
    thumbnail: article.hero,
    genre: article.category,
    date: article.publishedAt,
    description: article.body[0],
    readTime: `${Math.max(1, Math.ceil(article.body.join(" ").split(/\s+/).length / 200))} min read`,
  }),
)
export const lifestyleContent: CatalogItem[] = lifestyleArticles.map(
  (article) => ({
    id: article.id,
    type: "lifestyle",
    title: article.title,
    thumbnail: article.image,
    genre: article.category,
    date: article.date,
    readTime: article.readTime,
    description: article.excerpt,
  }),
)

const baseEventDetails: Record<string, EventDetail> = {
  ...eventDetails,
  ...extraEventDetails,
}
for (const seed of eventSeeds) {
  if (baseEventDetails[seed.id]) continue
  baseEventDetails[seed.id] = {
    id: seed.id,
    title: seed.title,
    image: seed.thumbnail,
    genre: seed.genre!,
    date: seed.date!,
    location: seed.location!,
    description:
      "A sample Caribbean event from the MGTV events catalog. Ticketing is not connected.",
    performers: [],
    ticketUrl: "",
  }
}
export interface EventSchedule {
  eventStatus: "scheduled" | "startingSoon" | "inProgress" | "ended" | "postponed" | "cancelled"
  startsAt: string
  endsAt?: string
  timeZone: string
  locationKind: "inPerson" | "online" | "hybrid"
  broadcastId?: string
}
export interface Broadcast {
  id: string
  eventId: string
  status: "scheduled" | "startingSoon" | "live" | "ended" | "replayAvailable"
  preview: Preview
  durationSeconds?: number
}
export const demoReference = "September 10, 2026 · 18:00 UTC"
const schedules: Record<string, EventSchedule> = {
  e1: {
    eventStatus: "ended",
    startsAt: "2025-07-18T23:00:00Z",
    endsAt: "2025-07-21T04:00:00Z",
    timeZone: "America/Jamaica",
    locationKind: "inPerson",
    broadcastId: "b-e1",
  },
  e2: {
    eventStatus: "scheduled",
    startsAt: "2026-10-29T00:00:00Z",
    timeZone: "America/Jamaica",
    locationKind: "inPerson",
    broadcastId: "b-e2",
  },
  e3: {
    eventStatus: "inProgress",
    startsAt: "2026-09-10T17:00:00Z",
    endsAt: "2026-09-10T20:00:00Z",
    timeZone: "America/Jamaica",
    locationKind: "inPerson",
    broadcastId: "b-e3",
  },
  e4: {
    eventStatus: "scheduled",
    startsAt: "2026-11-14T14:00:00Z",
    endsAt: "2026-11-16T22:00:00Z",
    timeZone: "America/Port_of_Spain",
    locationKind: "inPerson",
  },
  e5: {
    eventStatus: "scheduled",
    startsAt: "2026-10-29T03:00:00Z",
    timeZone: "America/Jamaica",
    locationKind: "inPerson",
  },
  e6: {
    eventStatus: "postponed",
    startsAt: "2026-09-15T20:00:00Z",
    timeZone: "America/Jamaica",
    locationKind: "online",
    broadcastId: "b-e6",
  },
  e7: {
    eventStatus: "startingSoon",
    startsAt: "2026-09-10T18:15:00Z",
    timeZone: "America/Jamaica",
    locationKind: "online",
    broadcastId: "b-e7",
  },
  e8: {
    eventStatus: "cancelled",
    startsAt: "2026-09-12T23:00:00Z",
    timeZone: "America/St_Lucia",
    locationKind: "inPerson",
  },
  e9: {
    eventStatus: "ended",
    startsAt: "2026-09-09T23:00:00Z",
    endsAt: "2026-09-10T00:30:00Z",
    timeZone: "America/Jamaica",
    locationKind: "online",
    broadcastId: "b-e9",
  },
  e10: {
    eventStatus: "inProgress",
    startsAt: "2026-09-10T18:00:00Z",
    endsAt: "2026-09-10T20:00:00Z",
    timeZone: "America/Jamaica",
    locationKind: "inPerson",
    broadcastId: "b-e10",
  },
}
for (const [id, title, location, genre, image] of [
  [
    "e7",
    "Kingston Soundcheck Session",
    "Online · MGTV session",
    "Music",
    imgs.concert2,
  ],
  [
    "e8",
    "Island Film Showcase",
    "Castries Community Arts Hall, Saint Lucia (demo venue)",
    "Film",
    imgs.film1,
  ],
  [
    "e9",
    "Regional Sports Roundup",
    "Online · MGTV session",
    "Sports",
    imgs.sports2,
  ],
  [
    "e10",
    "Caribbean Athletics Live",
    "Kingston Athletics Centre, Jamaica (demo venue)",
    "Sports",
    imgs.sports3,
  ],
])
  baseEventDetails[id] = {
    id,
    title,
    location,
    genre,
    image,
    date: "",
    description:
      "A fixed demonstration event, not a real-time schedule. Ticketing is not connected.",
    performers: [],
    ticketUrl: "",
  }

export const broadcasts: Record<string, Broadcast> = Object.fromEntries(
  ([
    ["e1", "replayAvailable", 7200],
    ["e2", "scheduled"],
    ["e3", "live"],
    ["e6", "scheduled"],
    ["e7", "startingSoon"],
    ["e9", "ended"],
    ["e10", "live"],
  ] satisfies [string, Broadcast["status"], number?][]).map(
    ([eventId, status, duration]) => {
      const id = `b-${eventId}`
      return [
        id,
        {
          id,
          eventId,
          status,
          durationSeconds: duration,
          preview:
            eventId === "e10"
              ? {
                  mode: "unavailable",
                  reason:
                    "The demonstration stream has not been supplied. No live source is connected.",
                  retryable: false,
                }
              : { mode: "simulated" },
        },
      ]
    },
  ),
)

export const allEventDetails: Record<string, EventDetail & EventSchedule> =
  Object.fromEntries(
    Object.values(baseEventDetails).map((event) => {
      const schedule = schedules[event.id]
      const date = new Intl.DateTimeFormat("en-US", {
        timeZone: schedule.timeZone,
        month: "long",
        day: "numeric",
        year: "numeric",
      }).format(new Date(schedule.startsAt))
      return [event.id, { ...event, ...schedule, date }]
    }),
  )
export const upcomingEvents: CatalogItem[] = Object.values(allEventDetails).map(
  (event) => ({
    id: event.id,
    type: "event",
    title: event.title,
    thumbnail: event.image,
    genre: event.genre,
    date: event.date,
    location: event.location,
    description: event.description,
    time: new Intl.DateTimeFormat("en-US", {
      timeZone: event.timeZone,
      hour: "numeric",
      minute: "2-digit",
      timeZoneName: "shortOffset",
    }).format(new Date(event.startsAt)),
    state: {
      scheduled: "Scheduled",
      startingSoon: "Starting soon",
      inProgress: "In progress",
      ended: "Ended",
      postponed: "Postponed",
      cancelled: "Cancelled",
    }[event.eventStatus],
  }),
)

export const catalog: CatalogItem[] = [
  ...featuredShows,
  ...popularMovies,
  ...episodes,
  ...musicVideos,
  ...tracks,
  ...featuredArtists,
  ...sportsHighlights,
  ...latestNews,
  ...lifestyleContent,
  ...upcomingEvents,
]
export const catalogById: Record<string, CatalogItem> = Object.fromEntries(
  catalog.map((item) => [item.id, item]),
)
// Explicit provisional fixture metadata; these are not production content ratings.
for (const item of catalog) {
  item.classification ??=
    item.type === "musicVideo" || item.type === "track"
      ? ["mv2", "tr2"].includes(item.id)
        ? "TV-14"
        : "PG"
      : "G"
  item.access =
    item.badge === "premium" || item.badge === "exclusive" ? "premium" : "free"
  const originArtist =
    item.artistId ??
    (item.type === "artist"
      ? item.id
      : featuredArtists.find((artist) => artist.title === item.artist)?.id)
  item.region =
    originArtist === "a3" || originArtist === "a6" || item.id === "e4"
      ? "Trinidad & Tobago"
      : originArtist === "a4" || originArtist === "a5"
        ? "Barbados"
        : "Jamaica"
  if (item.id === "e8") item.region = "Saint Lucia"
  if (item.type === "track" || item.type === "musicVideo")
    item.album =
      originArtist === "a1" ? "Golden Hour" : "Island Sessions (demo)"
  if (item.type === "sports") {
    item.competition =
      item.genre === "Football"
        ? "Caribbean Cup"
        : item.genre === "Cricket"
          ? "Windies Series"
          : "Island Championships"
    item.teams =
      item.genre === "Football"
        ? ["Jamaica", "Trinidad & Tobago"]
        : item.genre === "Cricket"
          ? ["West Indies", "England"]
          : []
    item.athletes = ["Track & Field", "Athletics"].includes(item.genre ?? "")
      ? ["Alicia Morgan (demo)"]
      : []
  }
  if (item.type === "event")
    item.ticketTier =
      item.id === "e6"
        ? "VIP (demo)"
        : item.id === "e4"
          ? "Free (demo)"
          : "Standard (demo)"
}
for (const episode of episodes)
  episode.access = catalogById[episode.showId!]?.access ?? "free"
const references = (ids: string[]) => ids.map((id) => catalogById[id])
export const trending = references([
  "t1",
  "m11",
  "m12",
  "s8",
  "m13",
  "s2",
  "m14",
  "m15",
])
export const originals = references(["t1", "m11", "m12", "s5", "s7", "m7"])
export const continueWatching = references(["e102", "k1e2", "m1", "m8"])

export const contentLabels: Record<ContentType, string> = {
  show: "Shows",
  movie: "Movies",
  episode: "Episodes",
  musicVideo: "Music Videos",
  track: "Tracks",
  artist: "Artists",
  news: "News",
  lifestyle: "Lifestyle",
  event: "Events",
  sports: "Sports",
}
export function contentPath(item: CatalogItem): string {
  const prefixes: Record<ContentType, string> = {
    show: "/shows",
    movie: "/movies",
    episode: "/watch",
    musicVideo: "/music/video",
    track: "/music/track",
    artist: "/music/artist",
    news: "/news",
    lifestyle: "/lifestyle",
    event: "/events",
    sports: "/sports",
  }
  return `${prefixes[item.type]}/${item.id}`
}
export function playableItem(item: CatalogItem): CatalogItem | undefined {
  if (item.type === "show") {
    const showEpisodes = episodes.filter((ep) => ep.showId === item.id)
    return (
      showEpisodes.find(
        (ep) => (ep.progress ?? 0) > 0 && (ep.progress ?? 0) < 100,
      ) ??
      showEpisodes.find((ep) => (ep.progress ?? 0) < 100) ??
      showEpisodes[0]
    )
  }
  return ["episode", "movie", "sports", "musicVideo"].includes(item.type)
    ? item
    : undefined
}
export function watchPath(item: CatalogItem): string | undefined {
  if(item.source==="api" && item.type==="sports") return `/sports/${item.id}/watch`;
  const playable = playableItem(item)
  return playable
    ? playable.type === "musicVideo"
      ? contentPath(playable)
      : `/watch/${playable.id}`
    : undefined
}
