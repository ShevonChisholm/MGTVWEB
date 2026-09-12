import { useState } from 'react'
import { Link } from 'react-router'
import { useSaved } from '@/context/SavedContext'
import {
  trending, featuredShows, popularMovies, musicVideos,
  featuredArtists, latestNews, upcomingEvents, ContentItem,
} from '@/data/mockContent'

const allContent: (ContentItem & { _type: string; _path: string })[] = [
  ...trending.map(i => ({ ...i, _type: 'Show', _path: `/shows/${i.id}` })),
  ...featuredShows.map(i => ({ ...i, _type: 'Show', _path: `/shows/${i.id}` })),
  ...popularMovies.map(i => ({ ...i, _type: 'Movie', _path: `/movies/${i.id}` })),
  ...musicVideos.map(i => ({ ...i, _type: 'Music', _path: `/music/${i.id}` })),
  ...featuredArtists.map(i => ({ ...i, _type: 'Artist', _path: `/music/artist/${i.id}` })),
  ...latestNews.map(i => ({ ...i, _type: 'News', _path: `/news/${i.id}` })),
  ...upcomingEvents.map(i => ({ ...i, _type: 'Event', _path: `/events/${i.id}` })),
]

const filters = ['All', 'Shows', 'Movies', 'Music', 'Artists', 'News', 'Events']

export function MyListPage() {
  const { saved, toggle } = useSaved()
  const [activeFilter, setActiveFilter] = useState('All')

  const savedItems = allContent.filter(item => saved.has(item.id))
  const filtered = activeFilter === 'All'
    ? savedItems
    : savedItems.filter(item => item._type === activeFilter.slice(0, -1) || item._type === activeFilter)

  return (
    <div className="min-h-screen bg-[#0A0A0A] pt-16">
      <div className="max-w-[1200px] mx-auto px-8 md:px-16 py-12">
        <div className="mb-8">
          <h1 className="text-5xl md:text-6xl text-[#F5F5F5]" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
            My List
          </h1>
          <p className="text-[#6B6B6B] text-sm mt-1">{saved.size} saved {saved.size === 1 ? 'item' : 'items'}</p>
        </div>

        {saved.size > 0 && (
          <div className="flex gap-2 flex-wrap mb-8">
            {filters.map(f => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all cursor-pointer ${
                  activeFilter === f
                    ? 'bg-[#C9A84C] text-[#0A0A0A]'
                    : 'bg-[#1E1E1E] text-[#A3A3A3] hover:text-[#F5F5F5] border border-white/8'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        )}

        {filtered.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filtered.map(item => (
              <div key={`${item._type}-${item.id}`} className="group relative">
                <Link to={item._path} className="block">
                  <div className="relative aspect-video rounded-xl overflow-hidden bg-[#1E1E1E] mb-2">
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <p className="text-[#F5F5F5] text-sm font-medium line-clamp-1 group-hover:text-[#C9A84C] transition-colors">
                    {item.title}
                  </p>
                  {item.genre && <p className="text-[#6B6B6B] text-xs mt-0.5">{item.genre}</p>}
                </Link>
                {/* Remove button */}
                <button
                  onClick={() => toggle(item.id)}
                  title="Remove from My List"
                  className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#C9A84C] hover:text-[#0A0A0A] cursor-pointer"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        ) : saved.size === 0 ? (
          <div className="py-32 text-center">
            <div className="w-16 h-16 rounded-full bg-[#1E1E1E] flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-[#3A3A3A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h2 className="text-2xl text-[#F5F5F5] mb-2" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>Your list is empty</h2>
            <p className="text-[#6B6B6B] text-sm max-w-sm mx-auto">
              Save shows, movies, and videos to your list to watch later or keep track of what you love.
            </p>
            <Link to="/" className="inline-block mt-6 px-6 py-2.5 bg-[#C9A84C] text-[#0A0A0A] text-sm font-semibold rounded-lg hover:bg-[#E2C36A] transition-colors">
              Explore Content
            </Link>
          </div>
        ) : (
          <div className="py-24 text-center">
            <p className="text-[#6B6B6B] text-sm">No {activeFilter.toLowerCase()} in your list.</p>
            <button onClick={() => setActiveFilter('All')} className="text-[#C9A84C] text-sm mt-2 hover:text-[#E2C36A] cursor-pointer">
              Show all
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
