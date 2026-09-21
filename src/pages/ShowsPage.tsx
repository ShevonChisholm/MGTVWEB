import { useState, useRef } from 'react'
import { useNavigate } from 'react-router'
import { FilterSidebar } from '@/components/shared/FilterSidebar'
import { PosterCard } from '@/components/home/PosterCard'
import { featuredShows, originals, trending } from '@/data/mockContent'
import type { ContentItem } from '@/data/mockContent'

const allShows = [...featuredShows, ...originals, ...trending.slice(0, 4)]
const genres = ['All', 'Drama', 'Comedy', 'Documentary', 'Culture', 'Fashion', 'Lifestyle', 'Thriller']
const featuredShow = featuredShows[0]

const continueWatching = featuredShows.slice(0, 3).map(s => ({
  ...s,
  duration: `${Math.floor(Math.random() * 60 + 15)}%`,
}))

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
      <div className="flex items-center justify-between mb-4 px-8 md:px-16">
        <h2 className="text-[#F5F5F5] text-lg font-bold tracking-wide group flex items-center gap-2 cursor-default hover:text-[#C9A84C] transition-colors">
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
              detailTo={`/shows/${item.id}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export function ShowsPage() {
  const navigate = useNavigate()
  const [active, setActive] = useState('All')
  const filtered = active === 'All' ? allShows : allShows.filter(s => s.genre === active)

  const trendingSeries = filtered.slice(0, 8)
  const newEpisodes = filtered.slice(1, 8)
  const caribbeanOriginals = originals.slice(0, 6)
  const dramas = filtered.filter(s => s.genre === 'Drama' || !s.genre).slice(0, 8)
  const documentaries = filtered.filter(s => s.genre === 'Documentary' || s.genre === 'Culture').slice(0, 8)

  return (
    <div className="min-h-screen bg-[#0A0A0A] pt-16">
      {/* ── MOSAIC GRID HERO ── */}
      <section className="relative overflow-hidden" style={{ height: 'clamp(480px, 65vh, 640px)' }}>
        <div className="absolute inset-0 bg-[#080808]" />

        {/* Giant watermark text */}
        <div className="absolute inset-0 flex items-center overflow-hidden pointer-events-none select-none">
          <span
            style={{
              fontFamily: 'Bebas Neue, sans-serif',
              fontSize: 'clamp(10rem, 28vw, 22rem)',
              lineHeight: 1,
              color: 'transparent',
              WebkitTextStroke: '1px rgba(255,255,255,0.04)',
              letterSpacing: '0.05em',
              whiteSpace: 'nowrap',
              paddingLeft: '8%',
            }}
          >
            SERIES
          </span>
        </div>

        {/* Right: Asymmetric mosaic */}
        <div className="absolute right-0 top-0 bottom-0 w-[55%] grid grid-cols-3 gap-1 p-1">
          {featuredShows.slice(0, 6).map((show, i) => (
            <div
              key={show.id}
              className={`relative overflow-hidden rounded-lg ${i === 1 ? 'row-span-2' : ''}`}
              style={{ opacity: i === 0 || i === 1 ? 0.8 : i === 2 || i === 3 ? 0.55 : 0.35 }}
            >
              <img src={show.thumbnail} alt={show.title} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>

        <div className="absolute inset-0 bg-gradient-to-r from-[#080808] via-[#080808]/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#080808]/70 to-transparent" />

        <div className="absolute left-[calc(8%+2px)] top-12 bottom-12 w-0.5 bg-gradient-to-b from-transparent via-[#C9A84C]/60 to-transparent" />

        <div className="relative h-full flex flex-col justify-center pl-16 md:pl-24 pr-[50%]">
          <p className="text-[#C9A84C] text-[10px] font-black tracking-[0.35em] uppercase mb-4">Browse All Series</p>
          <h1
            className="text-[#F5F5F5] leading-[0.92] mb-5"
            style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(3.5rem, 9vw, 6rem)' }}
          >
            Every Story<br />Worth<br />Watching
          </h1>
          <p className="text-[#6B6B6B] text-sm leading-relaxed mb-8 max-w-xs">
            From gripping dramas to powerful documentaries — curated Caribbean storytelling, all in one place.
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(`/shows/${featuredShow.id}`)}
              className="inline-flex items-center gap-2 bg-[#C9A84C] text-[#0A0A0A] px-6 py-2.5 text-sm font-black tracking-wide hover:bg-[#E2C36A] transition-colors cursor-pointer rounded-lg"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
              Watch Now
            </button>
            <button
              onClick={() => navigate('/shows')}
              className="text-[#A3A3A3] text-sm hover:text-[#F5F5F5] transition-colors cursor-pointer"
            >
              Browse All →
            </button>
          </div>
        </div>

        <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-[#0A0A0A] to-transparent" />
      </section>

      {/* ── GENRE FILTER ── */}
      <div className="px-8 md:px-16 py-6 flex items-center gap-4">
        <FilterSidebar filters={genres} active={active} onChange={setActive} title="Genre" />
        <span className="text-[#4A4A4A] text-xs">{filtered.length} titles</span>
      </div>

      {/* ── CONTENT RAILS ── */}
      <div className="pb-20">
        {continueWatching.length > 0 && (
          <Rail title="Continue Watching" items={continueWatching} type="landscape" />
        )}
        <Rail title="Trending Series" items={trendingSeries} />
        <Rail title="New Episodes" items={newEpisodes} />
        <Rail title="Caribbean Originals" items={caribbeanOriginals} />
        {dramas.length > 0 && <Rail title="Drama" items={dramas} />}
        {documentaries.length > 0 && <Rail title="Documentaries" items={documentaries} />}
      </div>
    </div>
  )
}
