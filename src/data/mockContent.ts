export type ContentBadge = 'premium' | 'free' | 'new' | 'live' | 'exclusive'

export interface Playlist {
  id: string
  name: string
  description: string
  coverImage: string
  tracks: string[]
  createdAt: string
  isOwn: boolean
}

export interface ContentItem {
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
}

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
  concert1: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600&q=80',
  concert2: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600&q=80',
  concert3: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600&q=80',
  concert4: 'https://images.unsplash.com/photo-1563841930606-67e2bce48b78?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600&q=80',
  stage1: 'https://images.unsplash.com/photo-1700720711254-602cb6b8468d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600&q=80',
  sports1: 'https://images.unsplash.com/photo-1763639700615-225fe7fdffff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600&q=80',
  sports2: 'https://images.unsplash.com/photo-1755877956621-5fac2eae4ebb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600&q=80',
  sports3: 'https://images.unsplash.com/photo-1760114852784-ec280f0a62e2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600&q=80',
  sports4: 'https://images.unsplash.com/photo-1765261371855-967aef597a9b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600&q=80',
  artist1: 'https://images.unsplash.com/photo-1615422079250-5d9aa901ef1b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80',
  artist2: 'https://images.unsplash.com/photo-1647208976598-7daadeac04e6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80',
  artist3: 'https://images.unsplash.com/photo-1647208976651-d328633e9628?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80',
  artist4: 'https://images.unsplash.com/photo-1695917647199-2564d52b3b73?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80',
  artist5: 'https://images.unsplash.com/photo-1664199749342-67394cd1f356?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80',
  beach1: 'https://images.unsplash.com/photo-1602608099803-96718a589bb3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600&q=80',
  beach2: 'https://images.unsplash.com/photo-1600208537475-6cdbf234ca5d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600&q=80',
  beach3: 'https://images.unsplash.com/photo-1727994191293-f7e14cf7c75b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600&q=80',
  film1: 'https://images.unsplash.com/photo-1524712245354-2c4e5e7121c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600&q=80',
  film2: 'https://images.unsplash.com/photo-1529798856831-427dfd0a1ab1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600&q=80',
  film3: 'https://images.unsplash.com/photo-1650475958723-e8d850c26f67?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600&q=80',
}

export const trending: ContentItem[] = [
  { id: 't1', title: 'Island Chronicles', thumbnail: imgs.stage1, badge: 'exclusive', genre: 'Drama', duration: 'S1 · 8 Episodes' },
  { id: 't2', title: 'Riddim Nation Live', thumbnail: imgs.concert1, badge: 'premium', genre: 'Music', duration: '2h 15m' },
  { id: 't3', title: 'Golden Mile', thumbnail: imgs.sports1, badge: 'new', genre: 'Documentary', duration: '1h 42m' },
  { id: 't4', title: 'Blue Mountains', thumbnail: imgs.beach2, badge: 'free', genre: 'Travel', duration: '45m' },
  { id: 't5', title: 'Festival Season', thumbnail: imgs.concert3, badge: 'premium', genre: 'Music', duration: '3h 00m' },
  { id: 't6', title: 'The Runway', thumbnail: imgs.film1, badge: 'new', genre: 'Drama', duration: 'S2 · 10 Episodes' },
  { id: 't7', title: 'Sprint to Glory', thumbnail: imgs.sports2, badge: 'premium', genre: 'Sports', duration: '1h 28m' },
  { id: 't8', title: 'Soul & Rhythm', thumbnail: imgs.concert2, badge: 'free', genre: 'Music', duration: '1h 55m' },
]

export const featuredShows: ContentItem[] = [
  { id: 's1', title: 'Island Chronicles', thumbnail: imgs.stage1, badge: 'exclusive', genre: 'Drama', duration: 'S1 · 8 Episodes' },
  { id: 's2', title: 'The Runway', thumbnail: imgs.film1, badge: 'new', genre: 'Fashion', duration: 'S2 · 10 Episodes' },
  { id: 's3', title: 'Kingstown Stories', thumbnail: imgs.beach1, badge: 'premium', genre: 'Drama', duration: 'S3 · 12 Episodes' },
  { id: 's4', title: 'Night Markets', thumbnail: imgs.concert4, badge: 'free', genre: 'Lifestyle', duration: 'S1 · 6 Episodes' },
  { id: 's5', title: 'The Yard', thumbnail: imgs.film3, badge: 'premium', genre: 'Comedy', duration: 'S4 · 8 Episodes' },
  { id: 's6', title: 'Coral Reef', thumbnail: imgs.beach2, badge: 'new', genre: 'Documentary', duration: 'S1 · 5 Episodes' },
  { id: 's7', title: 'Crown & Culture', thumbnail: imgs.beach3, badge: 'premium', genre: 'Culture', duration: 'S2 · 10 Episodes' },
]

export const popularMovies: ContentItem[] = [
  { id: 'm1', title: 'One Last Summer', thumbnail: imgs.beach1, badge: 'premium', genre: 'Drama', duration: '2h 05m', year: 2024 },
  { id: 'm2', title: 'The Last Sprint', thumbnail: imgs.sports2, badge: 'free', genre: 'Sports', duration: '1h 52m', year: 2023 },
  { id: 'm3', title: 'Yardie Rose', thumbnail: imgs.film1, badge: 'premium', genre: 'Thriller', duration: '1h 48m', year: 2024 },
  { id: 'm4', title: 'Carnival Queen', thumbnail: imgs.concert3, badge: 'new', genre: 'Romance', duration: '1h 38m', year: 2025 },
  { id: 'm5', title: 'Roots & Wings', thumbnail: imgs.beach3, badge: 'premium', genre: 'Biographical', duration: '2h 12m', year: 2024 },
  { id: 'm6', title: 'The Reel', thumbnail: imgs.film2, badge: 'free', genre: 'Documentary', duration: '1h 22m', year: 2023 },
  { id: 'm7', title: 'Trident', thumbnail: imgs.film3, badge: 'exclusive', genre: 'Action', duration: '2h 00m', year: 2025 },
]

export const musicVideos: ContentItem[] = [
  { id: 'mv1', title: 'Fire & Gold', thumbnail: imgs.concert1, badge: 'new', artist: 'Empress Nia', duration: '4:12' },
  { id: 'mv2', title: 'Kingston Flow', thumbnail: imgs.concert4, badge: 'free', artist: 'Jah Roc', duration: '3:58' },
  { id: 'mv3', title: 'Riddim Queen', thumbnail: imgs.concert2, badge: 'premium', artist: 'Shanti V', duration: '5:01' },
  { id: 'mv4', title: 'Blue & Gold', thumbnail: imgs.stage1, badge: 'new', artist: 'D-Wave', duration: '3:44' },
  { id: 'mv5', title: 'Rasta Revolution', thumbnail: imgs.artist2, badge: 'free', artist: 'Bredda Levi', duration: '4:30' },
  { id: 'mv6', title: 'Paradise Road', thumbnail: imgs.beach2, badge: 'premium', artist: 'Coral Wave', duration: '3:22' },
  { id: 'mv7', title: 'Soca Season', thumbnail: imgs.concert3, badge: 'new', artist: 'Trini Gold', duration: '4:55' },
]

export const featuredArtists: ContentItem[] = [
  { id: 'a1', title: 'Empress Nia', thumbnail: imgs.artist5, genre: 'Reggae · R&B', description: 'Kingston, JM' },
  { id: 'a2', title: 'Jah Roc', thumbnail: imgs.artist2, genre: 'Roots Reggae', description: 'Trenchtown, JM' },
  { id: 'a3', title: 'Shanti V', thumbnail: imgs.artist1, genre: 'Dancehall · Afrobeats', description: 'Montego Bay, JM' },
  { id: 'a4', title: 'D-Wave', thumbnail: imgs.artist3, genre: 'Soca · Reggaeton', description: 'Port of Spain, TT' },
  { id: 'a5', title: 'Coral Wave', thumbnail: imgs.artist4, genre: 'Gospel · Soul', description: 'Barbados, BB' },
  { id: 'a6', title: 'Trini Gold', thumbnail: imgs.artist5, genre: 'Soca · Calypso', description: 'San Fernando, TT' },
]

export const sportsHighlights: ContentItem[] = [
  { id: 'sp1', title: 'World Champs 100m Final', thumbnail: imgs.sports1, badge: 'premium', genre: 'Track & Field', duration: '12m' },
  { id: 'sp2', title: 'Caribbean Cup Quarter Final', thumbnail: imgs.sports4, badge: 'free', genre: 'Football', duration: '28m' },
  { id: 'sp3', title: 'Sprint Showdown 2025', thumbnail: imgs.sports2, badge: 'new', genre: 'Athletics', duration: '18m' },
  { id: 'sp4', title: 'Cricket: Windies vs England', thumbnail: imgs.sports3, badge: 'premium', genre: 'Cricket', duration: '45m' },
  { id: 'sp5', title: 'Rising Stars Athletics', thumbnail: imgs.sports1, badge: 'free', genre: 'Track & Field', duration: '22m' },
  { id: 'sp6', title: 'Basketball Slam Dunk', thumbnail: imgs.sports4, badge: 'new', genre: 'Basketball', duration: '15m' },
]

export const latestNews: ContentItem[] = [
  { id: 'n1', title: 'Jamaica Sweeps Sprint Finals at World Championships', thumbnail: imgs.sports2, genre: 'Sports', description: '3 hours ago' },
  { id: 'n2', title: 'New Reggae Album Tops Global Charts for Third Week', thumbnail: imgs.concert1, genre: 'Music', description: '5 hours ago' },
  { id: 'n3', title: 'Caribbean Film Festival Announces 2025 Lineup', thumbnail: imgs.film1, genre: 'Entertainment', description: '8 hours ago' },
  { id: 'n4', title: 'MGTV Originals Win Three International Awards', thumbnail: imgs.stage1, genre: 'Entertainment', description: '1 day ago' },
  { id: 'n5', title: 'Rising Stars: Next Generation of Caribbean Artists', thumbnail: imgs.artist3, genre: 'Music', description: '1 day ago' },
  { id: 'n6', title: 'Tourism Boom: Record Visitors to Caribbean Islands', thumbnail: imgs.beach1, genre: 'Regional News', description: '2 days ago' },
]

export const upcomingEvents: ContentItem[] = [
  { id: 'e1', title: 'Reggae Sumfest 2025', thumbnail: imgs.concert1, genre: 'Music Festival', date: 'Jul 18–20', location: 'Montego Bay, JM' },
  { id: 'e2', title: 'Caribbean Film Premiere Night', thumbnail: imgs.film3, genre: 'Film Premiere', date: 'Jul 25', location: 'Kingston, JM' },
  { id: 'e3', title: 'CARIFTA Games 2025', thumbnail: imgs.sports1, genre: 'Athletics', date: 'Aug 1–3', location: 'Bridgetown, BB' },
  { id: 'e4', title: 'Trinidad Carnival 2025', thumbnail: imgs.concert3, genre: 'Cultural Festival', date: 'Aug 9–10', location: 'Port of Spain, TT' },
  { id: 'e5', title: 'MGTV Awards Night', thumbnail: imgs.stage1, genre: 'Awards Ceremony', date: 'Sep 6', location: 'Kingston, JM' },
  { id: 'e6', title: 'VIP Artist Masterclass', thumbnail: imgs.artist1, genre: 'Masterclass', date: 'Sep 15', location: 'Online' },
]

export const originals: ContentItem[] = [
  { id: 'o1', title: 'Island Chronicles', thumbnail: imgs.stage1, badge: 'exclusive', genre: 'Drama', duration: 'S1 · 8 Episodes' },
  { id: 'o2', title: 'Riddim Nation', thumbnail: imgs.concert1, badge: 'exclusive', genre: 'Music Doc', duration: '2h 15m' },
  { id: 'o3', title: 'Golden Mile', thumbnail: imgs.sports1, badge: 'exclusive', genre: 'Sports Doc', duration: '1h 42m' },
  { id: 'o4', title: 'The Yard', thumbnail: imgs.film3, badge: 'exclusive', genre: 'Comedy', duration: 'S4 · 8 Episodes' },
  { id: 'o5', title: 'Crown & Culture', thumbnail: imgs.beach3, badge: 'exclusive', genre: 'Culture', duration: 'S2 · 10 Episodes' },
  { id: 'o6', title: 'Trident', thumbnail: imgs.film1, badge: 'exclusive', genre: 'Action', duration: '2h 00m' },
]

// ── Detail records ─────────────────────────────────────────────────────────

export const showDetails: Record<string, ShowDetail> = {
  't1': {
    id: 't1',
    title: 'Island Chronicles',
    banner: imgs.stage1.replace('w=600', 'w=1920'),
    poster: imgs.stage1,
    badge: 'exclusive',
    genre: 'Drama',
    description: 'A sweeping saga of love, power, and identity across the Caribbean islands — five generations, one unforgettable story. Island Chronicles follows the Montague family through hurricanes, heartbreak, and triumph, weaving together the threads of Caribbean history into one unmissable series.',
    cast: ['Naomi Richards', 'Marcus James', 'Sasha Brown', 'Devon Clarke', 'Yvette Francis'],
    seasons: [
      {
        number: 1,
        episodes: [
          { id: 'e101', number: 1, title: 'Roots', description: 'The Montague family gathers on the ancestral estate for the first time in decades, and old wounds resurface.', duration: '52m', thumbnail: imgs.stage1, progress: 100 },
          { id: 'e102', number: 2, title: 'The Storm Before', description: 'A looming hurricane forces the family to confront buried secrets and make impossible choices.', duration: '48m', thumbnail: imgs.concert4, progress: 60 },
          { id: 'e103', number: 3, title: 'Salt & Gold', description: 'Marcus discovers a hidden journal that rewrites everything he believed about his grandmother.', duration: '55m', thumbnail: imgs.beach2, progress: 0 },
          { id: 'e104', number: 4, title: 'Carnival Night', description: 'Amid the celebrations, a betrayal threatens to tear the family apart forever.', duration: '51m', thumbnail: imgs.concert3, progress: 0 },
          { id: 'e105', number: 5, title: 'Deep Waters', description: 'Naomi travels to the neighbouring island in search of answers about her father\'s past.', duration: '49m', thumbnail: imgs.beach1, progress: 0 },
          { id: 'e106', number: 6, title: 'The Reckoning', description: 'Long-hidden alliances come to light as the family faces its most critical vote.', duration: '54m', thumbnail: imgs.film1, progress: 0 },
          { id: 'e107', number: 7, title: 'New Tide', description: 'A surprise arrival changes the balance of power and opens the door to reconciliation.', duration: '47m', thumbnail: imgs.beach3, progress: 0 },
          { id: 'e108', number: 8, title: 'Gold & Glory', description: 'The season finale. The Montague legacy is decided — and nothing will ever be the same.', duration: '68m', thumbnail: imgs.stage1, progress: 0 },
        ],
      },
    ],
  },
}

export const movieDetails: Record<string, MovieDetail> = {
  'm1': {
    id: 'm1',
    title: 'One Last Summer',
    banner: imgs.beach1.replace('w=600', 'w=1920'),
    badge: 'premium',
    genre: 'Drama',
    year: 2024,
    duration: '2h 05m',
    description: 'When three estranged university friends reunite on a remote Caribbean island for one final summer, old loves, unresolved rivalries, and a shared secret threaten to upend their carefully constructed lives. A visually stunning drama about the cost of ambition and the pull of home.',
    director: 'Camille Beaumont',
    cast: ['Lena Morrison', 'Andre St. Clair', 'Nia Thompson', 'Joseph Walcott'],
  },
}

export const artistDetails: Record<string, ArtistDetail> = {
  'a1': {
    id: 'a1',
    name: 'Empress Nia',
    image: imgs.artist5,
    genre: 'Reggae · R&B',
    origin: 'Kingston, Jamaica',
    bio: 'Empress Nia emerged from the vibrant music scene of Kingston\'s New Kingston district, blending roots reggae with contemporary R&B to create a sound entirely her own. Her debut album "Golden Hour" spent twelve weeks at the top of the Caribbean charts, and her collaborations with leading producers across Jamaica, Trinidad, and the UK have cemented her status as one of the most exciting voices in modern Caribbean music. Known for her powerful live performances and deeply personal lyrics, Empress Nia continues to push the boundaries of what reggae music can be.',
    videos: [
      { id: 'mv1', title: 'Fire & Gold', thumbnail: imgs.concert1, badge: 'new', artist: 'Empress Nia', duration: '4:12' },
      { id: 'mv4', title: 'Blue & Gold', thumbnail: imgs.stage1, badge: 'new', artist: 'Empress Nia', duration: '3:44' },
      { id: 'mv6', title: 'Paradise Road', thumbnail: imgs.beach2, badge: 'premium', artist: 'Empress Nia', duration: '3:22' },
    ],
  },
}

export const newsArticles: Record<string, NewsArticle> = {
  'n1': {
    id: 'n1',
    title: 'Jamaica Sweeps Sprint Finals at World Championships',
    category: 'Sports',
    hero: imgs.sports2.replace('w=600', 'w=1920'),
    publishedAt: 'September 9, 2026',
    author: 'Terrence Campbell',
    body: [
      'Jamaica delivered one of the most dominant performances in World Championship history on Saturday evening, sweeping the medals in both the men\'s and women\'s 100m finals at the Stade de France in Paris. The achievement sent shockwaves through the athletics world and reignited conversations about Caribbean sporting supremacy on the global stage.',
      'In the women\'s final, Alicia Morgan crossed the line in a world-leading 10.71 seconds, edging out compatriots Jade Francis (10.74) and Simone Clarke (10.78) in a Jamaican clean sweep that drew thunderous applause from the sold-out stadium. It was the first time any nation had achieved a 1-2-3 in the women\'s 100m at a World Championship since 2009.',
      '"This is for every child who grew up watching Jamaican sprinters on television and dreaming," said Morgan in a post-race interview with MGTV Sports. "We run for the whole Caribbean. This is bigger than us."',
      'The men\'s final proved equally dramatic. Devonte Reid, competing in his first World Championship final, held his nerve in the closing metres to win gold in 9.84 seconds, with veteran champion Marcus Brown taking silver (9.86) and young talent Kyle James completing the sweep in 9.88.',
      'Jamaica\'s national athletics federation called the performance "a defining moment in our athletic history," and Prime Minister Patricia Walcott announced a national celebration upon the team\'s return to Kingston next week.',
      'MGTV will broadcast the full championship highlights and exclusive athlete interviews across this weekend.',
    ],
  },
}

export const eventDetails: Record<string, EventDetail> = {
  'e1': {
    id: 'e1',
    title: 'Reggae Sumfest 2025',
    image: imgs.concert1.replace('w=600', 'w=1920'),
    genre: 'Music Festival',
    date: 'July 18–20, 2025',
    location: 'Catherine Hall Entertainment Centre, Montego Bay, Jamaica',
    description: 'The world\'s greatest reggae festival returns for its landmark 33rd edition. Reggae Sumfest 2025 brings three nights of unforgettable music, culture, and celebration to the shores of Montego Bay, featuring an extraordinary lineup of reggae legends alongside the most exciting new voices in Caribbean music. With Dancehall Night, International Night, and the legendary All-White Party, Sumfest is the ultimate Caribbean music experience.',
    performers: ['Empress Nia', 'Jah Roc', 'Shanti V', 'D-Wave', 'Coral Wave', 'Trini Gold', 'Bredda Levi', 'Special International Guest TBA'],
    ticketUrl: '#',
  },
}

// ─── Shop & Lifestyle ────────────────────────────────────────────────────────

export type ProductCategory = 'clothing' | 'accessories' | 'merch' | 'food' | 'experiences' | 'travel'

export interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number
  image: string
  category: ProductCategory
  badge?: 'new' | 'sale' | 'exclusive' | 'limited'
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
  category: 'food' | 'travel' | 'fashion' | 'culture' | 'wellness'
  readTime: string
  date: string
  featured: boolean
  excerpt: string
}

export const products: Product[] = [
  {
    id: 'p1',
    name: 'MGTV Gold Logo Tee',
    price: 45,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600&q=80',
    category: 'clothing',
    badge: 'new',
    description: 'Premium heavyweight cotton tee featuring the iconic MGTV gold wordmark. Crafted for Caribbean comfort.',
    tags: ['tee', 'unisex', 'gold', 'logo'],
    inStock: true,
    rating: 4.8,
    reviewCount: 124,
  },
  {
    id: 'p2',
    name: 'Island Vibes Hoodie',
    price: 89,
    originalPrice: 109,
    image: 'https://images.unsplash.com/photo-1556821840-3a63f15732ce?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600&q=80',
    category: 'clothing',
    badge: 'sale',
    description: 'Oversized pullover hoodie with embroidered MGTV emblem and "Island Vibes" slogan on the back.',
    tags: ['hoodie', 'oversized', 'unisex'],
    inStock: true,
    rating: 4.9,
    reviewCount: 87,
  },
  {
    id: 'p3',
    name: 'Caribbean Gold Cap',
    price: 35,
    image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600&q=80',
    category: 'accessories',
    badge: 'exclusive',
    description: '6-panel structured cap in matte black with gold embroidered MGTV logo. Limited production run.',
    tags: ['cap', 'hat', 'limited', 'gold'],
    inStock: true,
    rating: 4.7,
    reviewCount: 56,
  },
  {
    id: 'p4',
    name: 'MGTV Gold Chain Pendant',
    price: 120,
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600&q=80',
    category: 'accessories',
    badge: 'limited',
    description: 'Stainless steel pendant with 18K gold plating. MGTV logo in raised relief. Chain included.',
    tags: ['jewelry', 'pendant', 'gold', 'chain'],
    inStock: true,
    rating: 4.9,
    reviewCount: 43,
  },
  {
    id: 'p5',
    name: 'Empress Nia Vinyl LP',
    price: 55,
    image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600&q=80',
    category: 'merch',
    badge: 'exclusive',
    description: '"Golden Hour" debut album on 180g gold-flecked vinyl. Signed and numbered, limited to 500 copies.',
    tags: ['vinyl', 'music', 'signed', 'limited'],
    inStock: true,
    rating: 5.0,
    reviewCount: 31,
  },
  {
    id: 'p6',
    name: 'Jerk Seasoning Kit',
    price: 38,
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600&q=80',
    category: 'food',
    description: 'Authentic Jamaican jerk spice blend curated by MGTV culinary partner Chef Yvonne Brown. Three-pack.',
    tags: ['food', 'spice', 'cooking', 'authentic'],
    inStock: true,
    rating: 4.8,
    reviewCount: 201,
  },
  {
    id: 'p7',
    name: 'Caribbean Cooking Masterclass',
    price: 149,
    image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600&q=80',
    category: 'experiences',
    badge: 'new',
    description: 'Live virtual cooking class with MGTV chef partners. Learn 5 signature Caribbean dishes. Certificate included.',
    tags: ['class', 'cooking', 'virtual', 'chef'],
    inStock: true,
    rating: 4.9,
    reviewCount: 78,
  },
  {
    id: 'p8',
    name: 'Jamaica Music Tour Package',
    price: 1299,
    image: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600&q=80',
    category: 'travel',
    badge: 'exclusive',
    description: '5-day curated Jamaica music tour. Studio visits, beach sessions, and VIP Sumfest access. Includes hotel.',
    tags: ['travel', 'jamaica', 'vip', 'tour'],
    inStock: true,
    rating: 4.9,
    reviewCount: 15,
  },
  {
    id: 'p9',
    name: 'MGTV Studio Mug',
    price: 22,
    image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600&q=80',
    category: 'merch',
    description: 'Matte black ceramic mug with gold MGTV wordmark. 12oz. Microwave safe.',
    tags: ['mug', 'merch', 'kitchen'],
    inStock: true,
    rating: 4.6,
    reviewCount: 93,
  },
  {
    id: 'p10',
    name: 'Reggae History Art Print',
    price: 65,
    image: 'https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600&q=80',
    category: 'merch',
    badge: 'limited',
    description: 'A3 giclée art print celebrating 60 years of reggae. Numbered and signed by Caribbean artist Marcia Pierre.',
    tags: ['art', 'print', 'reggae', 'limited'],
    inStock: true,
    rating: 4.8,
    reviewCount: 27,
  },
  {
    id: 'p11',
    name: 'Caribbean Wellness Box',
    price: 78,
    originalPrice: 95,
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600&q=80',
    category: 'food',
    badge: 'sale',
    description: 'Curated selection of Caribbean wellness products: sea moss gel, sorrel tea, moringa blend, and cerasee.',
    tags: ['wellness', 'herbal', 'natural', 'caribbean'],
    inStock: true,
    rating: 4.7,
    reviewCount: 144,
  },
  {
    id: 'p12',
    name: 'Island Life Bucket Hat',
    price: 42,
    image: 'https://images.unsplash.com/photo-1533827432537-1f1e2fbd6cd2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600&q=80',
    category: 'clothing',
    description: 'Woven cotton bucket hat in sun-bleached khaki. MGTV embroidered patch on front brim.',
    tags: ['hat', 'bucket hat', 'summer', 'unisex'],
    inStock: true,
    rating: 4.5,
    reviewCount: 62,
  },
]

export const lifestyleArticles: LifestyleArticle[] = [
  {
    id: 'l1',
    title: 'The Rise of Caribbean Fashion on the Global Stage',
    subtitle: 'How island designers are reshaping international runways',
    image: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1200&q=80',
    category: 'fashion',
    readTime: '6 min read',
    date: 'Sep 10, 2026',
    featured: true,
    excerpt: 'From Bridgetown to Paris, Caribbean designers are no longer waiting for the world to come to them. With vibrant prints, bold silhouettes, and deeply rooted cultural narratives, a new wave of island-born fashion houses is making waves in the global consciousness.',
  },
  {
    id: 'l2',
    title: "A Cook's Guide to Authentic Jamaican Jerk",
    subtitle: 'Beyond the supermarket shelf — the story of jerk spice',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80',
    category: 'food',
    readTime: '8 min read',
    date: 'Sep 8, 2026',
    featured: false,
    excerpt: 'Jerk is more than a seasoning — it is a living piece of Jamaican history, tracing back to the Maroons who perfected the art of pit-cooking in the Blue Mountains. Chef Yvonne Brown takes us through the origin, the craft, and the culture.',
  },
  {
    id: 'l3',
    title: 'Trinidad Carnival: A Year in the Making',
    subtitle: 'Behind the masquerade, months of artistry',
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80',
    category: 'culture',
    readTime: '7 min read',
    date: 'Sep 5, 2026',
    featured: false,
    excerpt: 'Most people see the two days of Carnival. Few know the 363 days that come before it — the bandcamp sessions, the wire-bending workshops, the feather sorting, the all-night costume construction.',
  },
  {
    id: 'l4',
    title: 'Sea Moss: Caribbean Superfood Going Global',
    subtitle: 'The wellness trend rooted in island tradition',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80',
    category: 'wellness',
    readTime: '5 min read',
    date: 'Sep 3, 2026',
    featured: false,
    excerpt: "Caribbean grandmothers have known it for generations — sea moss is nature's multivitamin. Now it's appearing on the shelves of wellness shops worldwide. We trace its journey from the rocky coastlines of St Lucia to the health aisles of London and New York.",
  },
  {
    id: 'l5',
    title: '10 Hidden Beaches You Need to Visit This Season',
    subtitle: 'Beyond the tourist trails of the Caribbean coast',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80',
    category: 'travel',
    readTime: '9 min read',
    date: 'Sep 1, 2026',
    featured: false,
    excerpt: "The Caribbean holds secrets that don't make the glossy brochures. From a black-sand cove in St Vincent to a bioluminescent bay in Vieques, these are the beaches that the locals call their own.",
  },
  {
    id: 'l6',
    title: 'The Art of Slow Living in Barbados',
    subtitle: 'Learning to exhale on the platinum coast',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80',
    category: 'travel',
    readTime: '6 min read',
    date: 'Aug 28, 2026',
    featured: false,
    excerpt: 'Barbados has long been a destination for those seeking something beyond the ordinary — where seaside rum shops are philosophical institutions and time bends itself around the natural rhythm of tide and trade wind.',
  },
]

// ─── Additional Show Details ─────────────────────────────────────────────────

export const extraShowDetails: Record<string, ShowDetail> = {
  't2': {
    id: 't2',
    title: 'Kingston Noir',
    banner: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1920&q=80',
    poster: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600&q=80',
    badge: 'premium',
    genre: 'Crime Drama',
    description: 'A detective navigates the complex underworld of Kingston, where loyalty, music, and survival collide in every dark alley. Gritty, cinematic, and unmistakably Caribbean.',
    cast: ['Devante Brown', 'Leila Morrison', 'Winston Clarke', 'Patrice Hamilton'],
    seasons: [{
      number: 1,
      episodes: [
        { id: 'k1e1', number: 1, title: 'The First Cut', description: 'Detective Roy finds a body in the yard of a dancehall legend.', duration: '48 min', thumbnail: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80', progress: 100 },
        { id: 'k1e2', number: 2, title: 'Sound System', description: 'A stolen sound system leads to dangerous territory.', duration: '51 min', thumbnail: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80', progress: 55 },
        { id: 'k1e3', number: 3, title: 'Garrison State', description: 'Roy goes deep into garrison politics.', duration: '46 min', thumbnail: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80', progress: 0 },
        { id: 'k1e4', number: 4, title: 'Neon Rain', description: 'A shootout changes everything Roy thought he knew.', duration: '52 min', thumbnail: 'https://images.unsplash.com/photo-1509909756405-be0199881695?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80', progress: 0 },
      ],
    }],
  },
  't3': {
    id: 't3',
    title: 'Roots & Routes',
    banner: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1920&q=80',
    poster: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600&q=80',
    badge: 'free',
    genre: 'Documentary',
    description: 'A sweeping documentary series tracing the African diaspora through Caribbean food, music, and spiritual tradition. Five episodes, five islands, one story.',
    cast: ['Dr. Yvonne Brown (Host)', 'Various Cultural Historians'],
    seasons: [{
      number: 1,
      episodes: [
        { id: 'rr1e1', number: 1, title: 'The Middle Passage', description: 'Origins and the crossing — told through food.', duration: '55 min', thumbnail: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80', progress: 0 },
        { id: 'rr1e2', number: 2, title: 'Rhythm & Memory', description: 'How drumming preserved culture across generations.', duration: '58 min', thumbnail: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80', progress: 0 },
        { id: 'rr1e3', number: 3, title: 'Spirit House', description: 'Obeah, Vodou, and Orisha traditions across five islands.', duration: '54 min', thumbnail: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80', progress: 0 },
      ],
    }],
  },
  't4': {
    id: 't4',
    title: 'Soca Summer',
    banner: 'https://images.unsplash.com/photo-1563841930606-67e2bce48b78?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1920&q=80',
    poster: 'https://images.unsplash.com/photo-1563841930606-67e2bce48b78?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600&q=80',
    badge: 'new',
    genre: 'Comedy',
    description: 'A group of cousins from different islands are forced to share a Barbados vacation house for the summer. Culture clashes, romance, and fetes ensue.',
    cast: ['Trini Gold', 'Coral Wave', 'Marcus Reid', 'Sasha Pierre'],
    seasons: [{
      number: 1,
      episodes: [
        { id: 'ss1e1', number: 1, title: 'First Flight', description: 'The cousins arrive and immediately clash over room assignments.', duration: '32 min', thumbnail: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80', progress: 0 },
        { id: 'ss1e2', number: 2, title: 'Fete Disaster', description: 'A beach fete goes hilariously wrong.', duration: '29 min', thumbnail: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80', progress: 0 },
        { id: 'ss1e3', number: 3, title: 'Carnival Day', description: 'The cousins finally find common ground on the parade route.', duration: '35 min', thumbnail: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80', progress: 0 },
      ],
    }],
  },
}

// ─── Additional Movie Details ─────────────────────────────────────────────────

export const extraMovieDetails: Record<string, MovieDetail> = {
  'm2': {
    id: 'm2',
    title: 'Coral Blue',
    banner: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1920&q=80',
    badge: 'premium',
    genre: 'Thriller',
    year: 2025,
    duration: '1h 54m',
    description: 'A marine biologist uncovers a conspiracy threatening Caribbean reefs — and the fishing communities that depend on them.',
    director: 'Renee St. Claire',
    cast: ['Leila Morrison', 'David Okafor', 'Sasha Pierre', 'Winston Clarke'],
  },
  'm3': {
    id: 'm3',
    title: 'The Jump Up',
    banner: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1920&q=80',
    badge: 'free',
    genre: 'Drama · Music',
    year: 2024,
    duration: '2h 04m',
    description: 'A young soca artist from a small Trinidadian village risks everything to compete at Carnival — and discovers his family history along the way.',
    director: 'Marcus Antoine',
    cast: ['Trini Gold', 'Coral Wave', 'Empress Nia (cameo)', 'Patricia Walcott'],
  },
  'm4': {
    id: 'm4',
    title: 'Blue Mountain Run',
    banner: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1920&q=80',
    badge: 'new',
    genre: 'Action',
    year: 2026,
    duration: '1h 42m',
    description: 'A trail runner discovers a decades-old secret buried in the Blue Mountains of Jamaica while training for the world championships.',
    director: 'Anya Thompson',
    cast: ['Devante Brown', 'Kyle James', 'Leila Morrison'],
  },
}

// ─── Additional Artist Details ────────────────────────────────────────────────

export const extraArtistDetails: Record<string, ArtistDetail> = {
  'a2': {
    id: 'a2',
    name: 'Jah Roc',
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1200&q=80',
    genre: 'Reggae · Roots',
    origin: 'Kingston, Jamaica',
    bio: 'Jah Roc emerged from the Trenchtown music scene with a voice that carries the weight of generations. His debut album "Kingston Flow" went platinum across the Caribbean and earned him three MGTV Awards nominations. A student of Bob Marley and Peter Tosh, Roc writes music that speaks truth to power with melody and grace.',
    videos: [
      { id: 'mv3', title: 'Kingston Flow', thumbnail: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600&q=80', artist: 'Jah Roc', duration: '5:22', badge: 'new' },
      { id: 'mv4', title: 'Roots Revival', thumbnail: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600&q=80', artist: 'Jah Roc', duration: '4:47', badge: 'free' },
    ],
  },
  'a3': {
    id: 'a3',
    name: 'Shanti V',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1200&q=80',
    genre: 'Soca · Afrobeats',
    origin: 'Port of Spain, Trinidad',
    bio: 'Shanti V is Trinidad\'s most streamed artist of the decade, blending soca heat with afrobeats rhythm into a sound she calls "island global." Her Carnival anthem "Fete Season" broke streaming records across three continents. She splits her time between Port of Spain and Lagos, carrying the Caribbean with her everywhere she goes.',
    videos: [
      { id: 'mv5', title: 'Fete Season', thumbnail: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600&q=80', artist: 'Shanti V', duration: '3:58', badge: 'new' },
      { id: 'mv6', title: 'Lagos & Laventille', thumbnail: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600&q=80', artist: 'Shanti V', duration: '4:12', badge: 'premium' },
    ],
  },
  'a4': {
    id: 'a4',
    name: 'D-Wave',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1200&q=80',
    genre: 'Dancehall · R&B',
    origin: 'Bridgetown, Barbados',
    bio: 'D-Wave is the architect of a new Bajan sound — smooth dancehall draped in neo-soul textures. His self-produced debut EP sold out physical copies in 72 hours and landed him on the cover of MGTV Magazine. He performs barefoot, always, as a reminder of where he comes from.',
    videos: [
      { id: 'mv7', title: 'Barefoot Kings', thumbnail: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600&q=80', artist: 'D-Wave', duration: '4:31', badge: 'exclusive' },
    ],
  },
}

// ─── Additional News Articles ─────────────────────────────────────────────────

export const extraNewsArticles: Record<string, NewsArticle> = {
  'n2': {
    id: 'n2',
    title: 'Shanti V Breaks Three Streaming Records in One Week',
    category: 'Music',
    hero: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1920&q=80',
    publishedAt: 'Sep 9, 2026',
    author: 'Marcus Antoine',
    body: [
      'Trinidad\'s Shanti V has rewritten the MGTV streaming record books this week, with her new single "Fete Season" clocking 4.2 million streams in its first 72 hours — surpassing the previous record held by Empress Nia by nearly 800,000 plays.',
      '"Fete Season" debuted simultaneously in Jamaica, Trinidad, Barbados, and Guyana, with pre-save numbers that platform executives called "unprecedented for a Caribbean-origin release." The song blends soca rhythm with an Afrobeats second verse that has resonated globally.',
      'The record-breaking week also included the most-watched music video debut in MGTV history, with the visual for "Fete Season" accumulating 1.8 million views in under 48 hours after its midnight premiere.',
      'Speaking from her Port of Spain studio, Shanti V expressed gratitude to Caribbean fans and hinted at a forthcoming collaboration with a "major international artist" to be announced at Carnival 2027.',
    ],
  },
  'n3': {
    id: 'n3',
    title: 'Reggae Sumfest 2025 Sets Attendance Record with 85,000 Fans',
    category: 'Events',
    hero: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1920&q=80',
    publishedAt: 'Sep 6, 2026',
    author: 'Claudette Henry',
    body: [
      'Reggae Sumfest 2025 closed its three-night run in Montego Bay with a record-breaking final attendance of 85,000 — the highest in the festival\'s 33-year history and a 22% increase on the 2024 edition.',
      'The milestone came as the festival expanded its Catherine Hall Entertainment Centre footprint for the first time in eight years, adding a second stage that allowed simultaneous performances across dancehall and reggae lineups.',
      'Headliners Empress Nia and the legendary Bredda Levi drew respective crowd peaks of 62,000 and 71,000 for their Saturday and Sunday night sets. Both performances will be available as exclusive MGTV livestream replays through October.',
      'Festival director Courtney Hamilton called the numbers "a testament to the enduring power of Jamaican music to draw the world to our shores," and confirmed that 2026 planning has already begun, with a 100,000-capacity target.',
    ],
  },
  'n4': {
    id: 'n4',
    title: 'MGTV Awards 2026: Full Nominee List Announced',
    category: 'Awards',
    hero: 'https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1920&q=80',
    publishedAt: 'Sep 3, 2026',
    author: 'MGTV Editorial',
    body: [
      'The full nominee list for the MGTV Awards 2026 has been revealed, featuring 48 nominees across 12 categories celebrating the best of Caribbean music, entertainment, and culture from the past year.',
      'Leading the music nominations is Empress Nia with four nods including Best Reggae Artist, Best Album ("Golden Hour"), and Song of the Year ("Fire & Gold"). Shanti V follows with three nominations after her breakout streaming year.',
      'In the film and television categories, "Kingston Noir" leads with three nominations for Best Drama Series, while "The Jump Up" and "Coral Blue" anchor the film categories.',
      'Fan voting opens on September 15 exclusively through MGTV. The awards ceremony will be broadcast live on October 28, with red carpet coverage beginning two hours before showtime.',
    ],
  },
}

// ─── Additional Event Details ─────────────────────────────────────────────────

export const extraEventDetails: Record<string, EventDetail> = {
  'e2': {
    id: 'e2',
    title: 'MGTV Awards Ceremony 2026',
    image: 'https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1920&q=80',
    genre: 'Awards Show',
    date: 'October 28, 2026',
    location: 'National Indoor Sports Centre, Kingston, Jamaica',
    description: 'The biggest night in Caribbean entertainment. The MGTV Awards 2026 brings together the best artists, directors, athletes, and personalities for a celebration of culture, excellence, and Caribbean pride. Red carpet. Live performances. Surprise collaborations.',
    performers: ['Empress Nia', 'Shanti V', 'Jah Roc', 'D-Wave', 'Bredda Levi', 'Special Surprise Guest'],
    ticketUrl: '#',
  },
  'e3': {
    id: 'e3',
    title: 'Caribbean Cup Quarter Final',
    image: 'https://images.unsplash.com/photo-1763639700615-225fe7fdffff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1920&q=80',
    genre: 'Sports',
    date: 'September 20, 2026',
    location: 'National Stadium, Kingston, Jamaica',
    description: 'The Caribbean Cup returns to Kingston for an epic quarter final clash. Two island nations battle for a spot in the semi-finals of the region\'s most prestigious football tournament. Available to watch live on MGTV Sports.',
    performers: ['Jamaica National Team', 'Trinidad & Tobago National Team'],
    ticketUrl: '#',
  },
  'e4': {
    id: 'e4',
    title: 'Caribbean Culinary Festival 2026',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1920&q=80',
    genre: 'Food & Culture',
    date: 'November 14–16, 2026',
    location: 'Queen\'s Park Savannah, Port of Spain, Trinidad',
    description: 'A three-day celebration of Caribbean cuisine, culture, and creativity. Over 80 chefs across 20 countries come together to showcase the depth and diversity of Caribbean food. Cooking demonstrations, tastings, masterclasses, and live music.',
    performers: ['Chef Yvonne Brown', 'Chef Marcus James', 'Chef Suki Reid', 'MGTV Culinary Team'],
    ticketUrl: '#',
  },
}

// ─── Playlists ────────────────────────────────────────────────────────────────

export const playlists: Playlist[] = [
  {
    id: 'pl1',
    name: 'Reggae Essentials',
    description: 'The definitive MGTV reggae playlist — roots, culture, and gold.',
    coverImage: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80',
    tracks: ['mv1', 'mv2', 'mv3', 'mv4'],
    createdAt: 'Sep 1, 2026',
    isOwn: false,
  },
  {
    id: 'pl2',
    name: 'Carnival Vibes',
    description: 'Soca, dancehall, and everything that makes you move.',
    coverImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80',
    tracks: ['mv5', 'mv6', 'mv7', 'mv1'],
    createdAt: 'Aug 15, 2026',
    isOwn: false,
  },
  {
    id: 'pl3',
    name: 'MGTV New Releases',
    description: 'Fresh drops from across the Caribbean.',
    coverImage: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80',
    tracks: ['mv1', 'mv5', 'mv3', 'mv7', 'mv2'],
    createdAt: 'Sep 10, 2026',
    isOwn: false,
  },
  {
    id: 'pl4',
    name: 'My Favourites',
    description: 'Tracks I keep coming back to.',
    coverImage: 'https://images.unsplash.com/photo-1563841930606-67e2bce48b78?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80',
    tracks: ['mv2', 'mv6'],
    createdAt: 'Sep 12, 2026',
    isOwn: true,
  },
]
