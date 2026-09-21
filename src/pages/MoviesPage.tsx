import { useState, useRef } from 'react'
import { useNavigate } from 'react-router'
import { FilterSidebar } from '@/components/shared/FilterSidebar'
import { PosterCard } from '@/components/home/PosterCard'
import { popularMovies, originals, trending } from '@/data/mockContent'
import type { ContentItem } from '@/data/mockContent'

const genres = ['All', 'Drama', 'Romance', 'Thriller', 'Sports', 'Action', 'Documentary', 'Biographical']
const featuredMovie = popularMovies[0]

const continueWatching = popularMovies.slice(0, 4).map(m => ({
  ...m,
  duration: `${Math.floor(Math.random() * 60 + 20)}%`,
}))

const allMovies = [...popularMovies, ...originals, ...trending.slice(0, 4)]

interface RailProps {
  title: string
  items: ContentItem[]
  type?: 'portrait' | 'landscape'
}

function Rail({ title, items, type = 'portrait' }: RailProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const cardH = type === 'landscape' ? 135 : 240
  const containerH = cardH + 100

  const scroll = (dir: 'left' | 'right') => {
    const el = scrollRef.current
    if (!el) return
    el.scrollBy({ left: dir === 'right' ? 360 : -360, behavior: 'smooth' })
  }

  return (
    <div className="mb-10">
      {/* Rail header */}
      <div className="flex items-center justify-between mb-4 px-8 md:px-16">
        <h2 className="text-[#F5F5F5] text-lg font-bold tracking-wide hover:text-[#C9A84C] transition-colors cursor-default group flex items-center gap-2">
          {title}
          <span className="text-[#C9A84C] text-sm font-normal opacity-0 group-hover:opacity-100 transition-opacity">Explore all &rsaquo;</span>
        </h2>
        <div className="flex gap-1">
          <button onClick={() => scroll('left')} className="w-7 h-7 rounded-full border border-white/20 flex items-center justify-center text-[#A3A3A3] hover:text-[#F5F5F5] hover:border-white/40 transition-all cursor-pointer">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <button onClick={() => scroll('right')} className="w-7 h-7 rounded-full border border-white/20 flex items-center justify-center text-[#A3A3A3] hover:text-[#F5F5F5] hover:border-white/40 transition-all cursor-pointer">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
      </div>

      {/* Outer: clips left/right via overflow-x: clip (no scroll container = overflow-y stays visible) */}
      <div style={{ overflowX: 'clip', paddingBottom: 180, marginBottom: -180 }}>
        <div
          ref={scrollRef}
          className="flex gap-3 px-8 md:px-16 scrollbar-hide"
          style={{ overflowX: 'scroll', overflowY: 'visible', minHeight: containerH }}
        >
          {items.map(item => (
            <PosterCard
              key={item.id}
              item={item}
              type={type}
              to={`/watch/${item.id}`}
              detailTo={`/movies/${item.id}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export function MoviesPage() {
  const navigate = useNavigate()
  const [active, setActive] = useState('All')
  const filtered = active === 'All' ? allMovies : allMovies.filter(m => m.genre === active)

  const trendingNow = filtered.slice(0, 8)
  const newReleases = filtered.slice(2, 10)
  const caribbeanOriginals = originals.slice(0, 6)
  const weekendBinge = filtered.slice(1, 7)
  const awardWinning = filtered.slice(3, 10)

  return (
    <div className="min-h-screen bg-[#0A0A0A] pt-16">
      {/* ── POSTER WALL HERO ── */}
      <section className="relative overflow-hidden" style={{ height: 'clamp(480px, 65vh, 640px)' }}>
        <div className="absolute inset-0 bg-[#050505]" />
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-transparent via-[#C9A84C]/40 to-transparent" />

        {/* Right: Leaning poster wall */}
        <div className="absolute right-0 top-0 bottom-0 flex items-center justify-end gap-3 pr-10" style={{ width: '58%' }}>
          {popularMovies.slice(0, 5).map((movie, i) => {
            const center = i === 2
            const isNear = i === 1 || i === 3
            return (
              <div
                key={movie.id}
                className="relative flex-shrink-0 overflow-hidden rounded-xl transition-all"
                style={{
                  width: center ? '144px' : isNear ? '112px' : '88px',
                  height: center ? '216px' : isNear ? '176px' : '144px',
                  marginTop: i % 2 === 0 ? '0' : '32px',
                  opacity: center ? 1 : isNear ? 0.65 : 0.35,
                  transform: `rotate(${[-2, -1, 0, 1, 2][i]}deg)`,
                  boxShadow: center ? '0 32px 64px rgba(0,0,0,0.8)' : 'none',
                }}
              >
                <img src={movie.thumbnail} alt={movie.title} className="w-full h-full object-cover" />
                {center && <div className="absolute inset-0 ring-1 ring-[#C9A84C]/30 rounded-xl" />}
              </div>
            )
          })}
        </div>

        <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/85 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/80 to-transparent" />
        <div className="absolute right-0 inset-y-0 w-16 bg-gradient-to-l from-[#050505] to-transparent" />

        <div className="relative h-full flex flex-col justify-center px-8 md:px-16 max-w-lg">
          <p className="text-[#C9A84C] text-[10px] font-black tracking-[0.35em] uppercase mb-3">Feature Films</p>
          <h1
            className="text-[#F5F5F5] leading-[0.92] mb-2"
            style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(4rem, 10vw, 7rem)' }}
          >
            Caribbean<br />Cinema
          </h1>
          <div className="flex items-center gap-3 mb-5">
            <div className="h-px w-12 bg-[#C9A84C]" />
            <span className="text-[#6B6B6B] text-xs tracking-widest uppercase">{popularMovies.length} films available</span>
          </div>
          <p className="text-[#6B6B6B] text-sm leading-relaxed mb-8 max-w-xs">
            World-class stories from the Caribbean and its diaspora. Feature films that move, inspire, and entertain.
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(`/watch/${featuredMovie.id}`)}
              className="inline-flex items-center gap-2 bg-[#C9A84C] text-[#0A0A0A] px-6 py-2.5 text-sm font-black tracking-wide hover:bg-[#E2C36A] transition-colors cursor-pointer rounded-lg"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
              Watch Now
            </button>
            <button
              onClick={() => navigate(`/movies/${featuredMovie.id}`)}
              className="border border-white/20 text-[#F5F5F5] px-6 py-2.5 text-sm font-medium hover:border-white/40 transition-all cursor-pointer rounded-lg"
            >
              More Info
            </button>
          </div>
        </div>

        <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-[#0A0A0A] to-transparent" />
      </section>

      {/* ── GENRE FILTER ── */}
      <div className="px-8 md:px-16 py-6 flex items-center gap-4">
        <FilterSidebar filters={genres} active={active} onChange={setActive} title="Genre" />
        <span className="text-[#4A4A4A] text-xs">{filtered.length} films</span>
      </div>

      {/* ── CONTENT RAILS ── */}
      <div className="pb-20">
        {continueWatching.length > 0 && (
          <Rail title="Continue Watching" items={continueWatching} type="landscape" />
        )}
        <Rail title="Trending Now" items={trendingNow} />
        <Rail title="New Releases" items={newReleases} />
        <Rail title="Caribbean Originals" items={caribbeanOriginals} />
        <Rail title="Binge in One Weekend" items={weekendBinge} />
        <Rail title="Award Winning" items={awardWinning} />
      </div>
    </div>
  )
}
