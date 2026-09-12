import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { FilterSidebar } from '@/components/shared/FilterSidebar'
import { Badge } from '@/components/ui/Badge'
import { featuredShows, originals, trending } from '@/data/mockContent'

const allShows = [...featuredShows, ...originals, ...trending.slice(0, 4)]
const genres = ['All', 'Drama', 'Comedy', 'Documentary', 'Culture', 'Fashion', 'Lifestyle', 'Thriller']
const featuredShow = featuredShows[0]

export function ShowsPage() {
  const navigate = useNavigate()
  const [active, setActive] = useState('All')
  const filtered = active === 'All' ? allShows : allShows.filter(s => s.genre === active)

  return (
    <div className="min-h-screen bg-[#0A0A0A] pt-16">
      {/* ── MOSAIC GRID HERO ── */}
      <section className="relative overflow-hidden" style={{ height: 'clamp(480px, 65vh, 640px)' }}>
        {/* Dark editorial base */}
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

        {/* Right: Asymmetric mosaic of show thumbnails */}
        <div className="absolute right-0 top-0 bottom-0 w-[55%] grid grid-cols-3 gap-1 p-1">
          {featuredShows.slice(0, 6).map((show, i) => (
            <div
              key={show.id}
              className={`relative overflow-hidden ${i === 1 ? 'row-span-2' : ''}`}
              style={{ opacity: i === 0 || i === 1 ? 0.8 : i === 2 || i === 3 ? 0.55 : 0.35 }}
            >
              <img src={show.thumbnail} alt={show.title} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>

        {/* Gradient mask: blends mosaic into dark left */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#080808] via-[#080808]/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#080808]/70 to-transparent" />

        {/* Gold vertical rule */}
        <div className="absolute left-[calc(8%+2px)] top-12 bottom-12 w-0.5 bg-gradient-to-b from-transparent via-[#C9A84C]/60 to-transparent" />

        {/* Text content */}
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
              className="inline-flex items-center gap-2 bg-[#C9A84C] text-[#0A0A0A] px-6 py-2.5 text-sm font-black tracking-wide hover:bg-[#E2C36A] transition-colors cursor-pointer"
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

      {/* ── BROWSE ── */}
      <div className="max-w-[1400px] mx-auto px-8 md:px-16 py-8 pb-16">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <FilterSidebar filters={genres} active={active} onChange={setActive} title="Genre" />
            <span className="text-[#4A4A4A] text-xs">{filtered.length} titles</span>
          </div>
          <h2 className="text-[#F5F5F5] text-lg hidden md:block" style={{ fontFamily: 'Bebas Neue, sans-serif', letterSpacing: '0.08em' }}>
            All Shows
          </h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
          {filtered.map(item => (
            <Link key={item.id} to={`/shows/${item.id}`} className="group cursor-pointer">
              <div className="relative aspect-video overflow-hidden bg-[#1A1A1A]">
                <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex items-center gap-2 bg-[#C9A84C] text-[#0A0A0A] px-4 py-2 text-xs font-bold">
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                    Play
                  </div>
                </div>
                <div className="absolute inset-x-0 bottom-0 h-0.5 bg-[#C9A84C] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                {item.badge && <div className="absolute top-2 left-2"><Badge variant={item.badge} /></div>}
              </div>
              <div className="mt-2.5">
                <p className="text-[#F5F5F5] text-sm font-semibold truncate group-hover:text-[#C9A84C] transition-colors">{item.title}</p>
                {item.genre && <p className="text-[#6B6B6B] text-xs mt-0.5">{item.genre}</p>}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
