import { useState } from 'react'
import { useNavigate } from 'react-router'
import { FilterSidebar } from '@/components/shared/FilterSidebar'
import { MovieCard } from '@/components/home/MovieCard'
import { popularMovies } from '@/data/mockContent'

const genres = ['All', 'Drama', 'Romance', 'Thriller', 'Sports', 'Action', 'Documentary', 'Biographical']
const featuredMovie = popularMovies[0]

export function MoviesPage() {
  const navigate = useNavigate()
  const [active, setActive] = useState('All')
  const filtered = active === 'All' ? popularMovies : popularMovies.filter(m => m.genre === active)

  return (
    <div className="min-h-screen bg-[#0A0A0A] pt-16">
      {/* ── POSTER WALL HERO ── */}
      <section className="relative overflow-hidden" style={{ height: 'clamp(480px, 65vh, 640px)' }}>
        <div className="absolute inset-0 bg-[#050505]" />

        {/* Film strip texture line at very top */}
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-transparent via-[#C9A84C]/40 to-transparent" />

        {/* Right: Leaning poster wall */}
        <div className="absolute right-0 top-0 bottom-0 flex items-center justify-end gap-3 pr-10" style={{ width: '58%' }}>
          {popularMovies.slice(0, 5).map((movie, i) => {
            const center = i === 2
            const isNear = i === 1 || i === 3
            return (
              <div
                key={movie.id}
                className="relative flex-shrink-0 overflow-hidden transition-all"
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
                {center && (
                  <div className="absolute inset-0 ring-1 ring-[#C9A84C]/30" />
                )}
              </div>
            )
          })}
        </div>

        {/* Gradient masks */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/85 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/80 to-transparent" />
        <div className="absolute right-0 inset-y-0 w-16 bg-gradient-to-l from-[#050505] to-transparent" />

        {/* Text content */}
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
              className="inline-flex items-center gap-2 bg-[#C9A84C] text-[#0A0A0A] px-6 py-2.5 text-sm font-black tracking-wide hover:bg-[#E2C36A] transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
              Watch Now
            </button>
            <button
              onClick={() => navigate(`/movies/${featuredMovie.id}`)}
              className="border border-white/20 text-[#F5F5F5] px-6 py-2.5 text-sm font-medium hover:border-white/40 transition-all cursor-pointer"
            >
              More Info
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
            <span className="text-[#4A4A4A] text-xs">{filtered.length} films</span>
          </div>
          <h2 className="text-[#F5F5F5] text-lg hidden md:block" style={{ fontFamily: 'Bebas Neue, sans-serif', letterSpacing: '0.08em' }}>All Movies</h2>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 xl:grid-cols-6 gap-4">
          {filtered.map(item => (
            <MovieCard key={item.id} item={item} to={`/movies/${item.id}`} />
          ))}
        </div>
      </div>
    </div>
  )
}
