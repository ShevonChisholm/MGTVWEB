import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router'
import {
  trending, featuredShows, popularMovies, musicVideos,
  featuredArtists, latestNews, upcomingEvents,
} from '@/data/mockContent'

const popularSearches = ['Reggae Sumfest', 'Island Chronicles', 'Empress Nia', 'Cricket', 'MGTV Awards', 'Dancehall']

const allContent = [
  ...trending.map(i => ({ ...i, _type: 'show' as const, _path: `/shows/${i.id}` })),
  ...featuredShows.map(i => ({ ...i, _type: 'show' as const, _path: `/shows/${i.id}` })),
  ...popularMovies.map(i => ({ ...i, _type: 'movie' as const, _path: `/movies/${i.id}` })),
  ...musicVideos.map(i => ({ ...i, _type: 'music' as const, _path: `/music/${i.id}` })),
  ...featuredArtists.map(i => ({ ...i, _type: 'artist' as const, _path: `/music/artist/${i.id}` })),
  ...latestNews.map(i => ({ ...i, _type: 'news' as const, _path: `/news/${i.id}` })),
  ...upcomingEvents.map(i => ({ ...i, _type: 'event' as const, _path: `/events/${i.id}` })),
]

interface SearchModalProps {
  onClose: () => void
}

export function SearchModal({ onClose }: SearchModalProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<typeof allContent>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  useEffect(() => { inputRef.current?.focus() }, [])

  useEffect(() => {
    if (!query.trim()) { setResults([]); return }
    const q = query.toLowerCase()
    setResults(
      allContent.filter(item =>
        item.title.toLowerCase().includes(q) ||
        item.genre?.toLowerCase().includes(q) ||
        (item as { artist?: string }).artist?.toLowerCase().includes(q)
      ).slice(0, 8)
    )
  }, [query])

  const go = (path: string) => { navigate(path); onClose() }

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) { navigate(`/search?q=${encodeURIComponent(query.trim())}`); onClose() }
  }

  const typeBadge: Record<string, string> = {
    show: 'Show', movie: 'Movie', music: 'Music', artist: 'Artist', news: 'News', event: 'Event'
  }

  return (
    <div className="fixed inset-0 z-[100] flex flex-col" onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

      {/* Panel */}
      <div
        className="relative w-full max-w-2xl mx-auto mt-20 px-4"
        onClick={e => e.stopPropagation()}
      >
        {/* Search bar */}
        <form onSubmit={submit} className="relative mb-3">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B6B6B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search shows, movies, artists, events…"
            className="w-full bg-[#1A1A1A] border border-white/15 rounded-xl pl-12 pr-12 py-4 text-[#F5F5F5] placeholder-[#6B6B6B] text-base focus:outline-none focus:border-[#C9A84C]/50"
          />
          {query && (
            <button type="button" onClick={() => setQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6B6B6B] hover:text-[#F5F5F5] cursor-pointer">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </form>

        {/* Results or suggestions */}
        <div className="bg-[#141414] border border-white/10 rounded-xl overflow-hidden max-h-[60vh] overflow-y-auto">
          {results.length > 0 ? (
            <div>
              <div className="px-4 py-3 border-b border-white/8 flex items-center justify-between">
                <span className="text-[#6B6B6B] text-xs font-medium tracking-wider uppercase">Results</span>
                <button
                  onClick={() => { navigate(`/search?q=${encodeURIComponent(query)}`); onClose() }}
                  className="text-[#C9A84C] text-xs hover:text-[#E2C36A] transition-colors cursor-pointer"
                >
                  See all results →
                </button>
              </div>
              {results.map(item => (
                <button
                  key={`${item._type}-${item.id}`}
                  onClick={() => go(item._path)}
                  className="w-full flex items-center gap-4 px-4 py-3 hover:bg-white/5 transition-colors text-left cursor-pointer border-b border-white/5 last:border-0"
                >
                  <img src={item.thumbnail} alt={item.title} className="w-12 aspect-video object-cover rounded-lg flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[#F5F5F5] text-sm font-medium truncate">{item.title}</p>
                    {item.genre && <p className="text-[#6B6B6B] text-xs">{item.genre}</p>}
                  </div>
                  <span className="text-[#6B6B6B] text-xs bg-[#2A2A2A] px-2 py-0.5 rounded flex-shrink-0">
                    {typeBadge[item._type]}
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <div className="p-5">
              <p className="text-[#6B6B6B] text-xs font-medium tracking-wider uppercase mb-3">Popular searches</p>
              <div className="flex flex-wrap gap-2">
                {popularSearches.map(s => (
                  <button
                    key={s}
                    onClick={() => setQuery(s)}
                    className="px-3 py-1.5 bg-[#1E1E1E] border border-white/8 rounded-full text-[#A3A3A3] text-sm hover:text-[#F5F5F5] hover:border-[#C9A84C]/30 transition-all cursor-pointer"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
