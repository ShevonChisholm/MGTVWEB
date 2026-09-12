import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router'
import {
  featuredShows, popularMovies, musicVideos, featuredArtists,
  latestNews, upcomingEvents, trending, ContentItem,
} from '@/data/mockContent'

const categories = ['All', 'Shows', 'Movies', 'Music', 'Artists', 'News', 'Events'] as const
type Category = typeof categories[number]

interface SearchResult extends ContentItem {
  _type: string
  _path: string
}

const corpus: SearchResult[] = [
  ...trending.map(i => ({ ...i, _type: 'Shows', _path: `/shows/${i.id}` })),
  ...featuredShows.map(i => ({ ...i, _type: 'Shows', _path: `/shows/${i.id}` })),
  ...popularMovies.map(i => ({ ...i, _type: 'Movies', _path: `/movies/${i.id}` })),
  ...musicVideos.map(i => ({ ...i, _type: 'Music', _path: `/music/${i.id}` })),
  ...featuredArtists.map(i => ({ ...i, _type: 'Artists', _path: `/music/artist/${i.id}` })),
  ...latestNews.map(i => ({ ...i, _type: 'News', _path: `/news/${i.id}` })),
  ...upcomingEvents.map(i => ({ ...i, _type: 'Events', _path: `/events/${i.id}` })),
]

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get('q') ?? ''
  const [activeCategory, setActiveCategory] = useState<Category>('All')
  const [results, setResults] = useState<SearchResult[]>([])

  useEffect(() => {
    if (!query.trim()) { setResults([]); return }
    const q = query.toLowerCase()
    const matched = corpus.filter(item =>
      item.title.toLowerCase().includes(q) ||
      item.genre?.toLowerCase().includes(q) ||
      (item as { artist?: string }).artist?.toLowerCase().includes(q) ||
      item.description?.toLowerCase().includes(q)
    )
    // deduplicate by id+type
    const seen = new Set<string>()
    setResults(matched.filter(item => {
      const key = `${item._type}-${item.id}`
      if (seen.has(key)) return false
      seen.add(key)
      return true
    }))
  }, [query])

  const filtered = activeCategory === 'All'
    ? results
    : results.filter(r => r._type === activeCategory)

  const counts = categories.reduce((acc, cat) => {
    acc[cat] = cat === 'All' ? results.length : results.filter(r => r._type === cat).length
    return acc
  }, {} as Record<Category, number>)

  const [inputValue, setInputValue] = useState(query)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputValue.trim()) setSearchParams({ q: inputValue.trim() })
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] pt-16">
      <div className="max-w-[1200px] mx-auto px-8 md:px-16 py-12">
        {/* Search bar */}
        <form onSubmit={handleSearch} className="relative mb-8 max-w-xl">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B6B6B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            placeholder="Search everything on MGTV…"
            className="w-full bg-[#141414] border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-[#F5F5F5] placeholder-[#6B6B6B] text-base focus:outline-none focus:border-[#C9A84C]/50"
          />
        </form>

        {query && (
          <h1 className="text-4xl md:text-5xl text-[#F5F5F5] mb-2" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
            {results.length > 0 ? `${results.length} results for "${query}"` : `No results for "${query}"`}
          </h1>
        )}

        {!query && (
          <h1 className="text-4xl text-[#F5F5F5] mb-2" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
            Search MGTV
          </h1>
        )}

        {/* Category tabs */}
        {results.length > 0 && (
          <div className="flex gap-2 flex-wrap mb-8 mt-6">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-[#C9A84C] text-[#0A0A0A]'
                    : 'bg-[#1E1E1E] text-[#A3A3A3] hover:text-[#F5F5F5] border border-white/8'
                }`}
              >
                {cat}
                {counts[cat] > 0 && (
                  <span className={`text-xs rounded-full px-1.5 py-0 ${activeCategory === cat ? 'bg-[#0A0A0A]/20 text-[#0A0A0A]' : 'bg-white/10 text-[#6B6B6B]'}`}>
                    {counts[cat]}
                  </span>
                )}
              </button>
            ))}
          </div>
        )}

        {/* Results grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filtered.map(item => (
              <Link
                key={`${item._type}-${item.id}`}
                to={item._path}
                className="group block"
              >
                <div className="relative aspect-video rounded-xl overflow-hidden bg-[#1E1E1E] mb-2">
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute top-2 left-2">
                    <span className="text-[10px] font-semibold tracking-wider uppercase bg-[#C9A84C]/90 text-[#0A0A0A] px-1.5 py-0.5 rounded">
                      {item._type.replace('Shows', 'Show').replace('Movies', 'Movie').replace('Artists', 'Artist').replace('Events', 'Event')}
                    </span>
                  </div>
                </div>
                <p className="text-[#F5F5F5] text-sm font-medium line-clamp-1 group-hover:text-[#C9A84C] transition-colors">
                  {item.title}
                </p>
                {item.genre && <p className="text-[#6B6B6B] text-xs mt-0.5">{item.genre}</p>}
              </Link>
            ))}
          </div>
        ) : query ? (
          <div className="py-24 text-center">
            <p className="text-[#6B6B6B] text-lg">No {activeCategory !== 'All' ? activeCategory.toLowerCase() : 'content'} found for "{query}"</p>
            <p className="text-[#3A3A3A] text-sm mt-2">Try a different search term or browse by category</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8">
            {[
              { label: 'Shows', to: '/shows', color: 'from-[#1A2A1A] to-[#0A1A0A]' },
              { label: 'Movies', to: '/movies', color: 'from-[#2A1A1A] to-[#1A0A0A]' },
              { label: 'Music', to: '/music', color: 'from-[#2A2010] to-[#1A1200]' },
              { label: 'Sports', to: '/sports', color: 'from-[#1A1A2A] to-[#0A0A1A]' },
              { label: 'News', to: '/news', color: 'from-[#1A2A2A] to-[#0A1A1A]' },
              { label: 'Events', to: '/events', color: 'from-[#2A1A2A] to-[#1A0A1A]' },
            ].map(cat => (
              <Link
                key={cat.label}
                to={cat.to}
                className={`bg-gradient-to-br ${cat.color} border border-white/8 rounded-2xl p-8 flex items-center justify-center hover:border-[#C9A84C]/30 transition-all group`}
              >
                <span className="text-[#F5F5F5] text-2xl font-bold group-hover:text-[#C9A84C] transition-colors" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
                  {cat.label}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
